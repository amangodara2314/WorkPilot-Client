import { Toaster } from "@/components/ui/sonner";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MainContext = createContext();

export default function GlobalContext({ children }) {
  const API = import.meta.env.VITE_API_URL;
  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
  const [currentWorkshop, setCurrentWorkshop] = useState(null);

  return (
    <MainContext.Provider
      value={{ clientId, API, currentWorkshop, setCurrentWorkshop }}
    >
      {children}
      <Toaster richColors="true" />
    </MainContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(MainContext);
}
