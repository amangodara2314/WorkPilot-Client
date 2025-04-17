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
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import CreateEditTaskForm from "../CreateEditTask";
import CreateEditProject from "../CreateEditProject";
import DeleteProjectDialog from "../DeleteProjectDailog";
import socket from "@/lib/socket";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const { projectId } = useParams();
  const { currentWorkshop, setProjects, projects, permissions } =
    useGlobalContext();
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

  useEffect(() => {
    socket.on("new_project", (data) => {
      refetch();
      toast.info(`New Project: ${data.name}`, {
        duration: 8000,
        description: `a new project has been created by ${
          data.createdBy.name || "Anonymous"
        }`,
      });
    });
    socket.on("project_updated", (data) => {
      refetch();
    });
  }, [socket]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-primary text-xs flex items-center justify-between">
        Projects
        {permissions && permissions?.project?.includes("create") && (
          <Dialog
            modal={true}
            onOpenChange={setIsOpen}
            open={isOpen}
            onClick={() => {}}
          >
            <DialogTrigger>
              <Plus className="size-3 border rounded-full border-black cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
              <CreateEditProject
                setProjects={setProjects}
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </SidebarGroupLabel>
      <SidebarMenu>
        {loading ? (
          <SidebarMenu>
            {new Array(5).fill(null).map((item, index) => {
              return <Skeleton key={index} className="h-6 w-full" />;
            })}
          </SidebarMenu>
        ) : projects && projects.length === 0 ? (
          <SidebarMenuItem className="mt-4">
            <div className="flex items-center justify-center text-sm">
              {" "}
              <StarOff className="mr-2 size-4" />
              <p>No projects found</p>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              there are no projects in this workshop. please create one to get
              started
            </p>
          </SidebarMenuItem>
        ) : (
          projects &&
          projects.length > 0 &&
          projects.map((item) => (
            <SidebarMenuItem
              key={item._id}
              className={item._id === projectId ? "bg-muted" : ""}
            >
              <SidebarMenuButton asChild>
                {item._id === projectId ? (
                  <div className="selected-link-style">
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <Link
                    to={`/workshop/${item.workshop}/project/${item._id}`}
                    title={`/workshop/${item.workshop}/project/${item._id}`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
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
                    <DeleteProjectDialog
                      callback={refetch}
                      projectId={item?._id}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
