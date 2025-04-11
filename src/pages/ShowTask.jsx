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
} from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { useParams } from "react-router-dom";
import { TaskSkeleton } from "@/components/TaskSkeleton";
import { useEffect } from "react";
import { toast } from "sonner";

function ShowTask() {
  const params = useParams();

  const { data, error, loading } = useFetch(
    "/task/" + params.taskId + "?workshopId=" + params.id,
    {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    true
  );

  const task = {
    taskCode: "TASK-001",
    title: "Implement User Authentication",
    description:
      "Add user authentication functionality using JWT tokens and implement secure password hashing. This includes setting up the authentication middleware, creating user registration and login endpoints, and implementing password reset functionality.",
    batch: "Feature",
    status: "in-progress",
    priority: "high",
    dueDate: new Date("2024-03-01"),
    assignedTo: {
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
    },
    project: {
      name: "Project Alpha",
      description: "Main project for the company's core product",
    },
    workshop: {
      name: "Backend Development",
      description: "Core backend infrastructure team",
    },
    comments: 5,
    activity: 12,
  };

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
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {data.task?.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
              {data.task?.taskCode}
            </span>{" "}
            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
              {data.task?.batch}
            </span>{" "}
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
                    {data.task?.project.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.task?.project.description}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Workshop
                  </h2>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {data.task?.workshop.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.task?.workshop.description}
                  </p>
                </div>
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
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Assigned to</span>
                  </div>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={data.task?.assignedTo.avatar} />
                    <AvatarFallback>
                      {data.task?.assignedTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
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
                    <Badge className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Batch</span>
                  </div>
                  <span className="text-sm">{data.task?.batch}</span>
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
