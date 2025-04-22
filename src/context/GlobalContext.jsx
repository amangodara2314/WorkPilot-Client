import { Toaster } from "@/components/ui/sonner";
import socket from "@/lib/socket";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const MainContext = createContext();

export default function GlobalContext({ children }) {
  const API = import.meta.env.VITE_API_URL;
  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const [workshops, setWorkshops] = useState(null);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  const [members, setMembers] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentWorkshopDetails, setCurrentWorkshopDetails] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const handleNewTask = (data) => {
      if (data.task.assignedTo._id === user._id) {
        toast.info(data.message, {
          duration: 8000,
          description: data?.description,
        });
      }
    };

    socket.on("new_task", handleNewTask);

    return () => {
      socket.off("new_task", handleNewTask);
    };
  }, [user, socket]);

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      socket.on("active_users", (users) => {
        setActiveUsers(users);
      });
      socket.on("new_message", (data) => {
        toast.info(data.message, {
          duration: 8000,
          description: data?.description,
        });
      });
    }

    socket.on("user_disconnected", ({ userId }) => {
      setActiveUsers((prevUsers) => prevUsers.filter((a) => a._id !== userId));
    });

    socket.on("role_changed", (data) => {
      toast.info("Your role has been changed to " + data.role.name);
      setUser((prevUser) => ({
        ...prevUser,
        role: data.role.name,
      }));
      setPermissions(data.role.permissions);
    });
    socket.on("workshop_deleted", () => {
      toast.error("This workshop has been deleted by the owner", {
        description: "Please select another workshop",
      });
    });

    return () => {
      socket.off("active_users");
      socket.off("new_message");
      socket.off("user_disconnected");
    };
  }, [user, socket]);

  return (
    <MainContext.Provider
      value={{
        clientId,
        API,
        currentWorkshop,
        setCurrentWorkshop,
        workshops,
        setWorkshops,
        user,
        setUser,
        setProjects,
        projects,
        members,
        setMembers,
        tasks,
        setTasks,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        selectedTasks,
        setSelectedTasks,
        currentPage,
        setCurrentPage,
        totalTasks,
        setTotalTasks,
        hasNextPage,
        currentWorkshopDetails,
        setCurrentWorkshopDetails,
        setHasNextPage,
        permissions,
        setPermissions,
        socket,
        activeUsers,
        setActiveUsers,
      }}
    >
      {children}
      <Toaster richColors="true" />
    </MainContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(MainContext);
}
