import { motion } from "framer-motion";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Flag,
  GitPullRequest,
  MessageSquare,
  Users,
  FolderKanban,
  ArrowRight,
  Badge,
  Info,
  SquarePen,
} from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { useParams } from "react-router-dom";
import { TaskSkeleton } from "@/components/TaskSkeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CreateEditTaskForm from "@/components/CreateEditTask";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function ShowTask() {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const { data, error, loading, refetch } = useFetch(
    "/task/" + params.taskId + "?workshopId=" + params.id,
    {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    true
  );

  const statusColors = {
    "in-review": "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    backlog: "bg-gray-100 text-gray-800",
    completed: "bg-green-100 text-green-800",
    pending: "bg-orange-100 text-orange-800",
    canceled: "bg-red-100 text-red-800",
  };

  const priorityColors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading || !data || !data.task) {
    return <TaskSkeleton />;
  }
  return (
    <div className="min-h-screen">
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <CreateEditTaskForm
            task={data?.task}
            isEditing={true}
            onClose={() => setOpen(false)}
            callback={(res) => {
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            {" "}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {data.task?.title}
            </h1>
            <button onClick={() => setOpen(true)} className="text-gray-900">
              <SquarePen />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
              {data.task?.taskCode}
            </span>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-full capitalize ${
                statusColors[data.task?.status]
              } text-gray-800`}
            >
              {data.task?.status}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 space-y-6"
          >
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-base font-medium mb-4">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.task?.description}
              </p>
            </div>

            <div className="flex justify-between gap-6">
              <div className="bg-white rounded-lg border p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-500">Project</h2>
                  <FolderKanban className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {data.task?.project?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.task?.project?.description || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Assigned To
                  </h2>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={data.task?.assignedTo?.profileImage}
                      alt={data.task?.assignedTo?.name}
                    />
                    <AvatarFallback className="rounded-full">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.task?.assignedTo?.name}
                    </span>
                    <span className="truncate text-xs">
                      {data.task?.assignedTo?.email}
                    </span>
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {data.task?.assignedTo?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.task?.assignedTo?.email || "N/A"}
                  </p>
                </div> */}
              </div>
            </div>

            {/* <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-medium">Recent Activity</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {data.task?.activity}
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="text-sm text-gray-500 text-center py-8">
                No recent activity found
              </div>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-4">
                Task Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flag
                      className={`h-4 w-4 ${
                        priorityColors[data.task?.priority]
                      }`}
                    />
                    <span className="text-sm">Priority</span>
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {data.task?.priority}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Due Date</span>
                  </div>
                  <span className="text-sm">
                    {format(data.task?.dueDate, "MMM dd, yyyy")}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info
                      className={`h-4 w-4 ${statusColors[data.task?.status]}`}
                    />
                    <span className="text-sm">Status</span>
                  </div>
                  <span className="text-sm capitalize">
                    {data.task?.status}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Badge</span>
                  </div>
                  <span className="text-sm">{data.task?.badge}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default ShowTask;
