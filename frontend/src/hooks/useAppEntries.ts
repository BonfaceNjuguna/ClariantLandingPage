import { useEffect, useState } from "react";
import { getAppEntries } from "../services/appService";
import { useAuth } from "../context/AuthContext";
import type { AppEntry } from "../types/index";

export const useAppEntries = (perPage: number, currentPage: number, search: string) => {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppEntry[]>([]);

  useEffect(() => {
    if (!user || !user.token) return; // Only fetch if logged in
    const fetch = async () => {
      const result = await getAppEntries(perPage, currentPage, search, user.token);
      setApps(result);
    };
    fetch();
  }, [perPage, currentPage, search, user]);

  return apps;
};
