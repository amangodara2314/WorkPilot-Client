import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGlobalContext } from "@/context/GlobalContext";
import useFetch from "@/hooks/use-fetch";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import socket from "@/lib/socket";

export default function DeleteWorkshopButton() {
  const {
    setCurrentWorkshop,
    currentWorkshop,
    setCurrentWorkshopDetails,
    setPermissions,
    setWorkshops,
    setUser,
    user,
    workshops,
  } = useGlobalContext();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(
    "/workshop/" + currentWorkshop,
    {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    false
  );
  useEffect(() => {
    if (data) {
      socket.emit("workshop_deleted", currentWorkshop);
      setWorkshops(workshops.filter((w) => w._id !== currentWorkshop));
      setCurrentWorkshopDetails(data.userWorkshop);
      setPermissions(data?.permissions);
      setUser({ ...user, role: data?.role || "Member" });
      setCurrentWorkshop(data.userWorkshop._id);
      toast.success("Workshop deleted successfully!", {
        description: "You will be redirected to the homepage of other workshop",
      });
      navigate("/workshop/" + data.userWorkshop._id, { replace: true });
    }
    if (error) {
      toast.error(error || "Something went wrong");
    }
  }, [data, error]);
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={loading} asChild>
        <Button
          variant="destructive"
          className="flex items-center gap-2 w-full sm:w-fit"
        >
          <Trash2 className="h-4 w-4" />
          Delete Workshop
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            workshop and remove all associated data including:
            <ul className="list-disc ml-6 mt-2">
              <li>All projects within this workshop</li>
              <li>All tasks and their progress</li>
              <li>All member associations and permissions</li>
              <li>All workshop resources and materials</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => refetch()}
            className="bg-destructive text-destructive-foreground"
          >
            Delete Workshop
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
