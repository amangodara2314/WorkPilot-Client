import { useGlobalContext } from "@/context/GlobalContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useFetch = (
  url,
  initialOptions = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
    },
  },
  initialFetch = true
) => {
  const { API } = useGlobalContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (customBody = null, customUrl = url, customLogic = () => {}) => {
      setLoading(true);
      setError(null);

      try {
        const options = { ...initialOptions };

        if (customBody !== null) {
          options.body = JSON.stringify(customBody);
        }

        const response = await fetch(API + customUrl, options);

        if (response.status === 401) {
          toast.error("Session expired. Please login again", {
            description:
              "There is something wrong with your session. Please login again to continue",
            duration: 7000,
          });
          sessionStorage.removeItem("accessToken");
          navigate("/auth/login");
          return;
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Request failed");
        }
        customLogic();

        setData(result);
        return result;
      } catch (err) {
        console.log(error);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API, url, navigate]
  );

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [fetchData, initialFetch]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;
