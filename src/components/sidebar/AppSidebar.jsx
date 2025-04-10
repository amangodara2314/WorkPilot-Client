import React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CircleCheck,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SettingsIcon,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { WorkshopSwitcher } from "./WorkshopSwitcher";
import Settings from "@/pages/Settings";
import { useGlobalContext } from "@/context/GlobalContext";

// This is sample data.
const data = {
  user: {
    name: "user",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkshopSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
