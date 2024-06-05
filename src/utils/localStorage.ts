/* eslint-disable @typescript-eslint/no-explicit-any */
export const storageConstants = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  profile: "profile",
};

export const setLocalStorage = (name: string, value: any) =>
  localStorage.setItem(name, JSON.stringify(value));

export const getLocalStorage = (value: any) => JSON.parse(localStorage.getItem(value) as string);

export const LocalStorage = (function () {
  function _setToken(accessToken: any) {
    if (accessToken) {
      localStorage.setItem(storageConstants.accessToken, accessToken);
    }
  }
  function _setRefreshToken(refreshToken: any) {
    if (refreshToken) {
      localStorage.setItem(storageConstants.refreshToken, refreshToken);
    }
  }

  function _getAccessToken() {
    return localStorage.getItem(storageConstants.accessToken);
  }

  function _getRefreshToken() {
    return localStorage.getItem(storageConstants.refreshToken);
  }

  function _clearToken() {
    localStorage.removeItem(storageConstants.accessToken);
    localStorage.removeItem(storageConstants.refreshToken);
  }

  return {
    setToken: _setToken,
    setRefreshToken: _setRefreshToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
  };
})();
