import { useGlobalContext } from "@/context/GlobalContext";
import { Outlet } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";
export default function GoogleAuthProvider() {
  const { clientId } = useGlobalContext();
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Outlet />
    </GoogleOAuthProvider>
  );
}
