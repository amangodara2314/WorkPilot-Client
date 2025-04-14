import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "sonner";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function RolesDropdown({
  member = null,
  callback = () => {},
  changingRole = false,
  setChangingRole = () => {},
}) {
  const { API, currentWorkshop, user } = useGlobalContext();
  const navigate = useNavigate();
  const changeRole = async (role) => {
    setChangingRole(true);
    const res = fetch(`${API}/member/change-role/${member?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          sessionStorage.getItem("accessToken")
        )}`,
      },
      body: JSON.stringify({ role, workshop: currentWorkshop }),
    }).then((res) => {
      const data = res.json();
      if (res.status === 401) {
        sessionStorage.removeItem("accessToken");
        navigate("/");
        throw { message: "Unauthorized" };
      }
      if (res.status != 200) {
        throw data;
      }
      callback();
    });
    try {
      toast.promise(res, {
        loading: "Changing role...",
        success: "Role changed successfully!",
        error: (err) => err || "Failed to change role",
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setChangingRole(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={user?.role == "Member"} asChild>
        <Button className="w-[90px]" variant="outline">
          {member?.role?.name || "Select Role"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        <DropdownMenuItem
          disabled={changingRole}
          onClick={() => changeRole("Admin")}
          className="flex flex-col items-start gap-0 cursor-pointer hover:bg-muted/50"
        >
          <span className="font-medium text-sm">Admin</span>
          <span className="text-muted-foreground text-xs">
            Can view, create, edit tasks, project and manage settings.
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={changingRole}
          onClick={() => changeRole("Member")}
          className="flex flex-col items-start gap-0 cursor-pointer hover:bg-muted/50"
        >
          <span className="font-medium text-sm">Member</span>
          <span className="text-muted-foreground text-xs">
            Can view and update their own tasks only.
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
