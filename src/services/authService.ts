import { User } from "@/types/user";
import { SuccessResponse } from "@/types/utils";
import axiosClient from "./axiosClient";

const authService = {
  login: (
    user: any,
  ): Promise<{
    data: SuccessResponse<{
      access_token: string;
      refresh_token: string;
      user: User;
    }>;
  }> => {
    return axiosClient.post(`login`, user);
  },
};

export default authService;
