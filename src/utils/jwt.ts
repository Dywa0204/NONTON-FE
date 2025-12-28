import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import axios from "axios";

export interface UserSession {
  session: {
    fullName: string;
    email?: string;
    [key: string]: any;
  };
}

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return (decoded as any).createTime < currentTime;
};

const getSession = (): UserSession | null => {
  const accessToken = window.localStorage.getItem("accessToken");

  try {
    return jwtDecode<UserSession>(accessToken || "");
  } catch (error) {
    console.error("Error decoding session:", error);
    return null;
  }
}

const setSession = (accessToken: string) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { verify, sign, isValidToken, setSession, getSession };
