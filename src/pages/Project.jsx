import CountCard from "@/components/CountCard";
import TaskTable from "@/components/TaskTable";
import { useGlobalContext } from "@/context/GlobalContext";
import useFetch from "@/hooks/use-fetch";
import { Activity, CircleCheckBig, CircleEllipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Project() {
  const { currentWorkshop } = useGlobalContext();
  const params = useParams();
  const [tasks, setTasks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const buildQueryParams = (page) => {
    return {
      page: page || currentPage,
      status: statusFilter || null,
      priority: priorityFilter || null,
      title: searchQuery,
      workshopId: currentWorkshop,
      project: params.id,
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
      refetch();
    }
  }, [currentWorkshop]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something Went Wrong");
    }
  }, [error]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-6 p-6">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {data?.project?.emoji} {data?.project?.name}
          </h1>
          <span className="text-muted-foreground">
            {data?.project?.description || null}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <CountCard
            title="Total Tasks"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            count={data?.totalTasks || 0}
            isLoading={loading}
          />
          <CountCard
            title="Pending Tasks"
            icon={<CircleCheckBig className="h-4 w-4 text-muted-foreground" />}
            count={data?.completedTasks || 0}
            isLoading={loading}
          />
          <CountCard
            title="Completed Tasks"
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
