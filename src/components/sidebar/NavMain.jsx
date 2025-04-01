import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CircleCheck,
  LayoutDashboard,
  SettingsIcon,
  Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import WorkshopLinkTag from "../WorkshopLinkTag";
import { useGlobalContext } from "@/context/GlobalContext";

const items = [
  { title: "Dashboard", icon: <LayoutDashboard /> },
  { title: "Tasks", icon: <CircleCheck /> },
  { title: "Members", icon: <Users /> },
  { title: "Settings", icon: <SettingsIcon /> },
];

export function NavMain() {
  const { currentWorkshop } = useGlobalContext();
  const location = useLocation();

  return (
    <SidebarMenu className="px-2">
      {items.map((item) => {
        const isActive =
          item.title === "Dashboard"
            ? location.pathname === "/workshop/" + currentWorkshop + "/"
            : location.pathname.includes(item.title.toLowerCase());

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <WorkshopLinkTag
                path={
                  item.title !== "Dashboard" ? item.title.toLowerCase() : ""
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </WorkshopLinkTag>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
