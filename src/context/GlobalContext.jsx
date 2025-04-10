import { Toaster } from "@/components/ui/sonner";
import getWorkshops from "@/hooks/get-workshops";
import useFetch from "@/hooks/use-fetch";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
