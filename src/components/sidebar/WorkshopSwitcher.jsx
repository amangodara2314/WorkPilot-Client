import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import getWorkshops from "@/hooks/get-workshops";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";
import CreateWorkshopForm from "../CreateWorkshop";
import { Dialog, DialogContent } from "../ui/dialog";
import { useNavigate } from "react-router-dom";
export function WorkshopSwitcher({}) {
  const { isMobile } = useSidebar();
  const { currentWorkshop, setCurrentWorkshop, setWorkshops, workshops, API } =
    useGlobalContext();
  const { data, error } = getWorkshops();
  const [activeWorkshop, setActiveWorkshop] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log(data, error);
    if (data) {
      setWorkshops(data.workshops);
      setActiveWorkshop(
        data.workshops.find((w) => w.workshop._id === currentWorkshop)
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

    // Define the promise that toast.promise will track
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
      setCurrentWorkshop(id);
      setActiveWorkshop(data.workshops.find((w) => w.workshop._id === id));
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
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!data || !workshops || !activeWorkshop) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton className="h-10 w-full" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
            >
              {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeWorkshop.logo className="size-4" />
              </div> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-primary font-semibold">
                  {activeWorkshop?.workshop.name}
                </span>
                <span className="truncate text-xs">Free</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
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
                if (workshop?.workshop?._id === currentWorkshop) return null;
                return (
                  <DropdownMenuItem
                    key={workshop?.workshop?.name}
                    onClick={() => {
                      changeWorkshop(workshop?.workshop?._id);
                    }}
                    className="gap-2 p-2 text-sm truncate cursor-pointer"
                  >
                    {workshop?.workshop?.name}
                  </DropdownMenuItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={(e) => {
                e.preventDefault(); // prevents menu from closing immediately
                setIsOpen(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Workshop
              </div>
            </DropdownMenuItem>

            <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="cursor-pointer sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <CreateWorkshopForm onClose={() => setIsOpen(false)} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
