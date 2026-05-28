import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export const useFetch = (url, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, setData, loading, refetch };
};
