import axios from "axios";
import type { AppEntry, AppEntryInput } from "../types/index";

const API_URL = import.meta.env.VITE_API_URL;

export const getAppEntries = async (
  limit: number,
  page: number,
  search: string,
  token: string
): Promise<AppEntry[]> => {
  const params: Record<string, any> = {
    limit,
    skip: (page - 1) * limit,
  };
  if (search && search.trim() !== "") {
    params.search = search;
  }
  const res = await axios.get(`${API_URL}/apps/`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
};

export const createAppEntry = async (
  data: AppEntryInput,
  token: string
): Promise<AppEntry> => {
  const res = await axios.post(`${API_URL}/apps/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};