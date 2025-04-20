import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGlobalContext } from "@/context/GlobalContext";
import { Skeleton } from "../ui/skeleton";
import useWorkshops from "@/hooks/use-workshops";
import { toast } from "sonner";
import CreateWorkshopForm from "../CreateWorkshop";
import { Dialog, DialogContent } from "../ui/dialog";
import { useNavigate } from "react-router-dom";
import socket from "@/lib/socket";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function WorkshopSwitcher({}) {
  const { isMobile, open } = useSidebar();
  const {
    currentWorkshop,
    setCurrentWorkshop,
    setCurrentWorkshopDetails,
    setWorkshops,
    workshops,
    currentWorkshopDetails,
    API,
    setTasks,
    setPermissions,
    setMembers,
    user,
    setUser,
  } = useGlobalContext();
  const { data, error } = useWorkshops();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (data) {
      setWorkshops(data.workshops);
      setCurrentWorkshopDetails(
        data.workshops.find((w) => w._id === currentWorkshop)
      );
    }
    if (error) {
      toast.error(
        error.message || "Something went wrong while getting workshops"
      );
    }
  }, [data, error]);

  const changeWorkshop = async (id) => {
    setIsLoading(true);

    const workshopPromise = fetch(`${API}/workshop/change/${id}`, {
      method: "PATCH",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    }).then(async (response) => {
      const result = await response.json();
      if (response.status !== 201) {
        throw new Error(result.message || "Something went wrong");
      }
      socket.emit("workshop_changed", {
        user: result.user,
        workshopId: id,
        prevWorkshopId: currentWorkshop,
      });
      setTasks(null);
      setUser({ ...user, role: result.member.role.name });
      setPermissions(result.member.role.permissions);
      setCurrentWorkshop(id);
      setMembers(null);
      setCurrentWorkshopDetails(data.workshops.find((w) => w._id === id));
      navigate("/workshop/" + id);
      return result;
    });

    toast.promise(workshopPromise, {
      loading: "Changing workshop...",
      success: "Workshop changed successfully!",
      error: (err) => err.message || "Failed to change workshop",
    });

    try {
      await workshopPromise;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="text-sm text-muted-foreground text-center py-2">
          Error Occurred
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!data || !workshops) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton className="h-10 w-full mt-2" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="cursor-pointer sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <CreateWorkshopForm
            onClose={() => setIsOpen(false)}
            workshop={workshops}
            setWorkshops={setWorkshops}
            changeWorkshop={changeWorkshop}
          />
        </DialogContent>
      </Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <SidebarMenuButton
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
              >
                {/* For icon/logo - could be shown in both open and expanded states */}
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeWorkshop.logo className="size-4" />
                </div> */}

                {open ? (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-primary font-semibold">
                      {currentWorkshopDetails?.name}
                    </span>
                    <span className="truncate text-xs">Free</span>
                  </div>
                ) : null}

                {open ? (
                  <ChevronsUpDown className="ml-auto size-4" />
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex w-full justify-center items-center">
                        <ChevronsUpDown className="size-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentWorkshopDetails?.name || "Something went wrong"}
                    </TooltipContent>
                  </Tooltip>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={"bottom"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workshops
              </DropdownMenuLabel>
              {data &&
                workshops.map((workshop, index) => {
                  if (workshop?._id === currentWorkshop) return null;
                  return (
                    <DropdownMenuItem
                      key={workshop?.name || index}
                      onClick={() => {
                        changeWorkshop(workshop?._id);
                      }}
                      className="gap-2 p-2 text-sm truncate cursor-pointer"
                    >
                      {workshop?.name}
                    </DropdownMenuItem>
                  );
                })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add Workshop
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
