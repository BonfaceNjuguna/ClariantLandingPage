import axios from "axios";
import type { AuthUser } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export const loginWithToken = async (
  token: string,
  provider: "google" | "microsoft"
): Promise<AuthUser> => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    token,
    provider,
  });

  return {
    email: res.data.user.email,
    name: res.data.user.name,
    token,
    provider,
  };
};
