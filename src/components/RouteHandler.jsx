import React from "react";
import { Navigate } from "react-router-dom";

const RouteHandler = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken && workshopId) {
    return <Navigate to={`/workshop/dsfaskdjk`} replace />;
  }

  return <Navigate to="/auth/login" replace />;
};

export default RouteHandler;
