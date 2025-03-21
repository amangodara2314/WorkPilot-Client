import { useGlobalContext } from "@/context/GlobalContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useFetch = (
  url,
  options = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
    },
  }
) => {
  const { API } = useGlobalContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API + url, options);

      if (response.status === 401) {
        toast.error("Session expired. Please login again", {
          description:
            "There is something wrong with your session. Please login again to continue",
          duration: 7000,
        });
        sessionStorage.removeItem("accessToken");
        navigate("/auth/login");
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;
