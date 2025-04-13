// DeleteProjectDialog.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteProjectDialog({
  projectId,
  callback = () => {},
}) {
  const params = useParams();
  const navigate = useNavigate();
  const { API, setTasks } = useGlobalContext();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    const res = fetch(API + "/project/" + projectId, {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    }).then((res) => {
      if (res.status === 401) {
        sessionStorage.removeItem("accessToken");
        navigate("/login");
        throw { message: "Unauthorized" };
      }
      if (res.status != 200) {
        throw res.json();
      }
      if (params.projectId === projectId) {
        setTasks(null);
        navigate("/workshop/" + params?.id);
      }
      callback();
    });
    try {
      toast.promise(res, {
        loading: "Deleting project...",
        success: "Project deleted successfully!",
        error: (err) => err || "Failed to delete project",
      });
    } catch {
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="flex items-center w-full"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Deleting this project will also permanently delete{" "}
            <strong>all tasks</strong> associated with it. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
