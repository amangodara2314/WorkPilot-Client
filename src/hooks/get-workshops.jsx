import { useGlobalContext } from "@/context/GlobalContext";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getWorkshops = (unauthorized) => {
  const { API } = useGlobalContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("called workshop");
    try {
      const response = await fetch(API + "/workshop", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again", {
          description:
            "There is something wrong with your session. Please login again to continue",
          duration: 7000,
        });
        sessionStorage.removeItem("accessToken");
        unauthorized();
        return;
      }

      const result = await response.json();
      console.log("result", result);

      if (!response.ok) {
        setError(result.message || "Something went wrong");
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array, only run on mount

  return { data, error, loading, fetchData };
};

export default getWorkshops;
