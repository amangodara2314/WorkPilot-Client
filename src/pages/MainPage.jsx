import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function MainPage() {
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
