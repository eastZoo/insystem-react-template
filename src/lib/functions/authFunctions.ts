import { ACCESS_TOKEN, RECOIL_PERSIST_KEY, REFRESH_TOKEN } from "@/lib/constants/sharedStrings";

export const writeAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
};

export const writeRefreshToken = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const readAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

export const readRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN);
};

export const getUserInfo = () => {
  const localStorageUser: string | null = localStorage.getItem(RECOIL_PERSIST_KEY);
  if (localStorageUser) {
    const storageJson = JSON.parse(localStorageUser);
    return storageJson["user"];
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  window.location.href = "/";
  localStorage.removeItem(RECOIL_PERSIST_KEY);
};

export const validateToken = async () => {};
