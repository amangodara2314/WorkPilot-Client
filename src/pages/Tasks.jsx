import TaskDialog from "@/components/TaskDialog";
import TaskTable from "@/components/TaskTable";
import { useGlobalContext } from "@/context/GlobalContext";
import useFetch from "@/hooks/use-fetch";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Tasks() {
  const {
    currentWorkshop,
    setTasks,
    tasks,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    selectedTasks,
    setSelectedTasks,
    currentPage,
    setCurrentPage,
    searchQuery,
    totalTasks,
    setTotalTasks,
    hasNextPage,
    setHasNextPage,
    permissions,
    user,
  } = useGlobalContext();

  const buildQueryParams = (page) => {
    return {
      page: page || currentPage,
      status: statusFilter || null,
      priority: priorityFilter || null,
      title: searchQuery,
      workshopId: currentWorkshop,
    };
  };

  const { data, loading, error, refetch } = useFetch(
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
    if (data) {
      setTasks(data.tasks);
      setTotalTasks(data.totalCount || data.tasks.length);
      setHasNextPage(data.tasks.length >= 5);
    }
    if (error) {
      toast.error(error || "Something went wrong");
    }
  }, [data, error]);

  useEffect(() => {
    if (currentWorkshop && !loading) {
      const shouldFetch =
        statusFilter !== "" ||
        priorityFilter !== "" ||
        searchQuery !== "" ||
        !tasks ||
        tasks.length === 0;

      if (shouldFetch) {
        refetch();
      }
    }
  }, [currentPage, statusFilter, priorityFilter, searchQuery, currentWorkshop]);

  useEffect(() => {
    if (!tasks && currentWorkshop) {
      refetch();
    }
  }, [currentWorkshop]);

  useEffect(() => {
    if (!user) return;

    const handleNewTask = (data) => {
      if (user.role === "Member" && data.task.assignedTo === user._id) {
        refetch();
      } else {
        refetch();
      }
    };

    const handleTaskUpdated = (data) => {
      if (user.role === "Member" && data.assignedTo === user._id) {
        refetch();
      } else {
        refetch();
      }
    };

    const handleTaskDeleted = (data) => {
      if (user.role === "Member" && data.task.assignedTo === user._id) {
        refetch();
      } else {
        refetch();
      }
    };

    const handleProjectDeleted = () => {
      refetch();
    };

    socket.on("new_task", handleNewTask);
    socket.on("task_updated", handleTaskUpdated);
    socket.on("task_deleted", handleTaskDeleted);
    socket.on("project_deleted", handleProjectDeleted);

    return () => {
      socket.off("new_task", handleNewTask);
      socket.off("task_updated", handleTaskUpdated);
      socket.off("task_deleted", handleTaskDeleted);
      socket.off("project_deleted", handleProjectDeleted);
    };
  }, [user, socket]);
  return (
    <div className="w-full h-full flex-col space-y-8 p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        {permissions && permissions?.task.includes("create") && <TaskDialog />}
      </div>
      <TaskTable
        tasks={tasks}
        loading={loading}
        error={error}
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
      <div></div>
    </div>
  );
}
