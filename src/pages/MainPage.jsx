import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect } from "react";

export default function MainPage() {
  const { setCurrentWorkshop } = useGlobalContext();
  const params = useParams();
  useEffect(() => {
    if (params.id) {
      setCurrentWorkshop(params.id);
    }
  }, [params.id]);
  return (
    <>
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <Header />
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
