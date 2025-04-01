import {
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  StarOff,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CreateProjectForm from "../CreateProject";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const { currentWorkshop } = useGlobalContext();
  const [projects, setProjects] = useState(null);
  const { data, error, loading, refetch } = useFetch(
    "/project/" + currentWorkshop,
    {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    false
  );

  useEffect(() => {
    if (currentWorkshop) {
      refetch();
    }
  }, [currentWorkshop]);

  useEffect(() => {
    if (data) {
      setProjects(data.projects);
    }
    if (error) {
      toast.error(error);
    }
  }, [data, error]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-primary flex items-center justify-between">
        Projects
        <Dialog
          modal={true}
          onOpenChange={setIsOpen}
          open={isOpen}
          onClick={() => {}}
        >
          <DialogTrigger>
            <Plus className="size-3 border rounded-full border-black cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <CreateProjectForm
              setProjects={setProjects}
              onClose={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </SidebarGroupLabel>
      <SidebarMenu>
        {loading && (
          <SidebarMenu>
            {new Array(5).fill(null).map((item, index) => {
              return <Skeleton key={index} className="h-6 w-full" />;
            })}
          </SidebarMenu>
        )}
        {projects &&
          projects.length > 0 &&
          projects.map((item) => (
            <SidebarMenuItem key={item._id}>
              <SidebarMenuButton asChild>
                <Link
                  to={`/workshop/${item.workshop}/project/${item._id}`}
                  title={`/workshop/${item.workshop}/project/${item._id}`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem className="hover:text-red-500 cursor-pointer">
                    <Trash2 className="" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
