import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SpinningText } from "@/components/magicui/spinning-text";
import socket from "@/lib/socket";

const RouteHandler = () => {
  const {
    setCurrentWorkshopDetails,
    API,
    setCurrentWorkshop,
    setUser,
    setPermissions,
  } = useGlobalContext();
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      const getUser = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API}/user`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + JSON.parse(accessToken),
            },
          });
          const result = await response.json();
          setCurrentWorkshop(result.user.currentWorkshop._id);
          setCurrentWorkshopDetails(result.user.currentWorkshop);
          setUser(result.user);
          setPermissions(result.permissions);
          socket.emit("join_room", {
            userId: result.user._id,
            workshopId: result.user.currentWorkshop._id,
          });

          if (result.user.currentWorkshop) {
            if (window.location.pathname === "/") {
              navigate(`/workshop/${result.user.currentWorkshop._id}`);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      getUser();
    }
  }, [accessToken, API, setCurrentWorkshop, setUser, navigate]);

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (loading) {
    return (
      <div className="fixed w-full h-full flex items-center justify-center">
        <SpinningText>beautiful • things awaits • you •</SpinningText>
      </div>
    );
  }

  return <Outlet />;
};

export default RouteHandler;
