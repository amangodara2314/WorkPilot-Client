import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RouteHandler = () => {
  const { currentWorkshop } = useGlobalContext();
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    return <Outlet />;
  }

  return <Navigate to="/auth/login" replace />;
};

export default RouteHandler;
