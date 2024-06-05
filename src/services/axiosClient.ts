/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalStorage } from "@/utils/localStorage";
import axios from "axios";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];
const baseURL: string = String(import.meta.env.VITE_API_ENDPOINT);
const refreshTokenURL: string = "refresh-access-token";

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosClient = axios.create({
  baseURL: baseURL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const check =
      originalRequest.url.includes("login") ||
      originalRequest.url.includes("register") ||
      originalRequest.url.includes("logout");

    if ([400, 401, 403]?.includes(error?.response?.status) && !originalRequest._retry && !check) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = LocalStorage.getRefreshToken();

      try {
        const res = await axios.post(refreshTokenURL, {
          refresh_token: refreshToken,
        });

        const data = res.data;
        LocalStorage.setToken(data.access_token);
        LocalStorage.setRefreshToken(data.refresh_token);

        axios.defaults.headers.common["Authorization"] = "Bearer " + data.access_token;
        originalRequest.headers["Authorization"] = "Bearer " + data.access_token;
        processQueue(null, data.access_token);

        return axiosClient.request(originalRequest);
      } catch (err: any) {
        // const { status, data } = err?.response;

        // if (status === 404 || (data && data.error.errorCode === "REFRESH_TOKEN_INVALID")) {
        //   LocalStorage.clearToken();
        // }

        // if (status === 403 || status === 400) {
        //   LocalStorage.clearToken();
        // }

        processQueue(err, null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
