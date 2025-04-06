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
