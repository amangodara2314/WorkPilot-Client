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

  const normalizedPath = location.pathname.endsWith("/")
    ? location.pathname.slice(0, -1)
    : location.pathname;

  return (
    <SidebarMenu className="px-2">
      {items.map((item) => {
        const isActive =
          item.title === "Dashboard"
            ? normalizedPath === "/workshop/" + currentWorkshop
            : normalizedPath.includes(item.title.toLowerCase());

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
