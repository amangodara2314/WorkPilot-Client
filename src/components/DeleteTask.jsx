import { useGlobalContext } from "@/context/GlobalContext";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import socket from "@/lib/socket";

export default function DeleteTask({ id, refetch }) {
  const { API, currentWorkshop } = useGlobalContext();
  const navigate = useNavigate();

  const deleteTask = async () => {
    const res = fetch(`${API}/task/${id}?workshopId=${currentWorkshop}`, {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 401) {
          toast.error(result.message);
          sessionStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }
        if (response.status != 200) {
          throw new Error(result.message || "Something went wrong");
        }
        socket.emit("task_deleted", {
          taskId: id,
          workshopId: currentWorkshop,
        });
        refetch();
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error.message || "Something went wrong");
      });
    try {
      toast.promise(res, {
        loading: "Deleting task...",
        success: "Task deleted successfully!",
        error: (err) => err.message || "Failed to delete task",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return <DropdownMenuItem onClick={deleteTask}>Delete</DropdownMenuItem>;
}
