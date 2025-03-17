import { createContext, useContext } from "react";

const MainContext = createContext();

export default function GlobalContext({ children }) {
  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

  return (
    <MainContext.Provider value={{ clientId }}>{children}</MainContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(MainContext);
}
