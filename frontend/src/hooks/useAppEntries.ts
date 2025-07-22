import { useEffect, useState } from "react";
import { getAppEntries } from "../services/appService";
import { useAuth } from "../context/AuthContext";
import type { AppEntry } from "../types/index";

export const useAppEntries = (
  perPage: number,
  currentPage: number,
  search: string
) => {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user || !user.token) return;
    const fetch = async () => {
      const result = await getAppEntries(perPage, currentPage, search, user.token);
      setApps(result.items);
      setTotal(result.total);
    };
    fetch();
  }, [perPage, currentPage, search, user]);

  return { apps, total };
};