import CountCard from "@/components/CountCard";
import CreateEditProject from "@/components/CreateEditProject";
import TaskTable from "@/components/TaskTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/context/GlobalContext";
import useFetch from "@/hooks/use-fetch";
import socket from "@/lib/socket";
import {
  Activity,
  CircleCheckBig,
  CircleEllipsis,
  SquarePen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Project() {
  const { currentWorkshop, permissions } = useGlobalContext();
  const params = useParams();
  const [tasks, setTasks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const buildQueryParams = (page) => {
    return {
      page: page || currentPage,
      status: statusFilter || null,
      priority: priorityFilter || null,
      title: searchQuery || null,
      workshopId: currentWorkshop,
      project: params.projectId,
    };
  };
  const { data, loading, error, refetch } = useFetch(
    "/project/details/" + params?.projectId + "?workshopId=" + currentWorkshop
  );

  const {
    data: taskData,
    loading: taskLoading,
    error: taskError,
    refetch: fetchTasks,
  } = useFetch(
    "/task?" + new URLSearchParams(buildQueryParams()).toString(),
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          sessionStorage.getItem("accessToken")
        )}`,
      },
    },
    false
  );

  useEffect(() => {
    if (taskData) {
      console.log(taskData);
      setTasks(taskData.tasks);
      setTotalTasks(taskData.totalCount || taskData.tasks.length);
      setHasNextPage(taskData.tasks.length >= 5);
    }
    if (taskError) {
      toast.error(taskError || "Something went wrong");
    }
  }, [taskData, taskError]);

  useEffect(() => {
    if (params.projectId) {
      fetchTasks();
    }
  }, [params]);

  useEffect(() => {
    if (currentWorkshop) {
      fetchTasks();
    }
  }, [currentWorkshop, searchQuery, currentPage, statusFilter, priorityFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something Went Wrong");
    }
  }, [error]);

  useEffect(() => {
    socket.on("new_task", (data) => {
      if (params.projectId == data.task.project) {
        fetchTasks();
        refetch();
      }
      toast.info(data.message, {
        duration: 8000,
        description: data?.description,
      });
    });
    socket.on("project_updated", (data) => {
      if (params.projectId == data?._id) {
        refetch();
      }
    });
  }, [socket]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-6 p-6">
        {loading && !data ? (
          <div className="">
            <h1 className="text-2xl font-bold tracking-tight text-primary flex gap-3 mb-2">
              <div className="flex items-center gap-2">
                {" "}
                <Skeleton className="h-6 w-6" />{" "}
                <Skeleton className="h-6 w-72" />
              </div>
              <button onClick={() => {}} className="text-gray-900">
                <Skeleton className="h-6 w-6" />
              </button>
            </h1>
            <span className="text-muted-foreground">
              <Skeleton className="h-6 max-w-82" />
              <Skeleton className="h-6 max-w-72 mt-2" />
            </span>
          </div>
        ) : (
          <div className="">
            <h1 className="text-2xl font-bold tracking-tight text-primary flex gap-3">
              <span>
                {" "}
                {data?.project?.emoji} {data?.project?.name}{" "}
              </span>
              {permissions && permissions.project.includes("edit") && (
                <Dialog
                  modal={true}
                  onOpenChange={setIsOpen}
                  open={isOpen}
                  onClick={() => {}}
                >
                  <DialogTrigger>
                    <SquarePen className="size-6" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
                    <CreateEditProject
                      project={data?.project}
                      onClose={() => setIsOpen(false)}
                      callback={refetch}
                      mode="edit"
                    />
                  </DialogContent>
                </Dialog>
              )}
            </h1>
            <span className="text-muted-foreground">
              {data?.project?.description || null}
            </span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <CountCard
            title="Total Tasks"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            count={data?.totalTasks || 0}
            isLoading={loading}
          />
          <CountCard
            title="Completed Tasks"
            icon={<CircleCheckBig className="h-4 w-4 text-muted-foreground" />}
            count={data?.completedTasks || 0}
            isLoading={loading}
          />
          <CountCard
            title="Pending Tasks"
            icon={<CircleEllipsis className="h-4 w-4 text-muted-foreground" />}
            count={data?.pendingTasks || 0}
            isLoading={loading}
          />
        </div>
        <TaskTable
          tasks={tasks}
          loading={taskLoading}
          error={taskError}
          refetch={refetch}
          currentWorkshop={currentWorkshop}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalTasks={totalTasks}
          hasNextPage={hasNextPage}
          setTasks={setTasks}
        />
      </div>
    </div>
  );
}
