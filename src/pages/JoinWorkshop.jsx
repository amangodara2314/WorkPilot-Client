"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "@/context/GlobalContext";
import socket from "@/lib/socket";

export default function JoinWorkshop() {
  const { API, setCurrentWorkshop, setCurrentWorkshopDetails } =
    useGlobalContext();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const params = useParams();
  const code = params.code;
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("accessToken")) {
      navigate("/auth/login?redirect=workshop/join/" + params.code, {
        replace: true,
      });
    }
  }, [sessionStorage]);

  useEffect(() => {
    if (code && sessionStorage.getItem("accessToken")) {
      const joinWorkshop = async () => {
        try {
          setStatus("loading");

          const res = await fetch(`${API}/workshop/join/${code}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(
                sessionStorage.getItem("accessToken")
              )}`,
            },
          });

          const data = await res.json();

          if (res.status === 201) {
            setStatus("success");
            setMessage("You have successfully joined the workshop!");
            setCurrentWorkshop(data.workshop._id);
            setCurrentWorkshopDetails(data.workshop);
            socket.emit("new_member", { workshop: data.workshop._id });
            navigate("/workshop/" + data.workshop._id);
          } else {
            setStatus("error");
            setMessage(data.message || "Failed to join the workshop.");
          }
        } catch (error) {
          console.error("Error joining workshop:", error);
          setStatus("error");
          setMessage("An error occurred while trying to join the workshop.");
        }
      };

      if (code) {
        joinWorkshop();
      }
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Workshop Join</CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Processing your request..."
              : status === "success"
              ? "Welcome to the workshop!"
              : "Something went wrong"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Please wait while we add you to the workshop...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <p className="text-center text-red-500">{message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" && (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}

          {status === "error" && (
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
