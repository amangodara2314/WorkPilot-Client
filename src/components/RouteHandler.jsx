import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const RouteHandler = () => {
  const { currentWorkshop, API, setCurrentWorkshop, setUser } =
    useGlobalContext();
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      const getUser = async () => {
        try {
          const response = await fetch(`${API}/user`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + JSON.parse(accessToken),
            },
          });
          const result = await response.json();
          setCurrentWorkshop(result.user.currentWorkshop);
          setUser(result.user);

          if (result.user.currentWorkshop) {
            if (window.location.pathname === "/") {
              navigate(`/workshop/${result.user.currentWorkshop}`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      getUser();
    }
  }, [accessToken, API, setCurrentWorkshop, setUser, navigate]);

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default RouteHandler;
