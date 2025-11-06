import { Author, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./authAPI.models";
import axios from "axios";

const BASE_URL = "https://localhost:7001/api";

export const authAPI = {
  register: async (
    userData: RegisterRequest,
  ): Promise<{ data: RegisterResponse }> => {
    return await axios.post(`${BASE_URL}/Account/register`, userData, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });
  },

  login: async (
    credentials: LoginRequest,
  ): Promise<{ data: LoginResponse }> => {
    return await axios.post(`${BASE_URL}/Account/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });
  },

  getCurrentAuthor: async (token: string): Promise<{ data: Author }> => {
    return await axios.get(`${BASE_URL}/Authors/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });
  },
};
