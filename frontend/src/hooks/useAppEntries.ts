import { useEffect, useState, useCallback } from "react";
import { getAppEntries } from "../services/appService";
import { useAuth } from "../context/AuthContext";
import type { AppEntry } from "../types/index";

export const useAppEntries = (
  perPage: number,
  currentPage: number,
  search: string,
  status: string,
  sortBy: string,
  sortOrder: string
) => {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!user || !user.token) return;
    const fetch = async () => {
      const result = await getAppEntries(perPage, currentPage, search, user.token, status, sortBy, sortOrder);
      setApps(result.items);
      setTotal(result.total);
    };
    fetch();
  }, [perPage, currentPage, search, status, sortBy, sortOrder, user, refetchIndex]);

  return { apps, total, refetch };
};