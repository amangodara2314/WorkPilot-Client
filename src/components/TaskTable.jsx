import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import CreateEditTaskForm from "@/components/CreateEditTask";
import { TaskPagination } from "./TaskPagination";
import { TaskTableBody } from "./TaskTableBody";
import { TaskTableHeader } from "./TaskTableHeader";
import { TaskTableHead } from "./TaskTableHead";
import TaskTableSkeleton from "./TaskTableSkeleton";

export default function TaskTable({
  tasks,
  loading,
  error,
  refetch,
  currentWorkshop,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  selectedTasks,
  setSelectedTasks,
  currentPage,
  setCurrentPage,
  totalTasks,
  setTasks,
  hasNextPage,
}) {
  const rowsPerPage = 5;
  const [selectedTask, setSelectedTask] = useState(null);
  const params = useParams();
  const [projectId, setProjectId] = useState(null);

  const [columns, setColumns] = useState([
    { id: "select", label: "", visible: true },
    { id: "id", label: "Task", visible: true },
    { id: "title", label: "Title", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "priority", label: "Priority", visible: true },
    { id: "assignedTo", label: "Assigned To", visible: true },
  ]);

  useEffect(() => {
    if (params.projectId) {
      setProjectId(params.projectId);
    }
  }, [params]);

  const buildQueryParams = (page) => {
    return {
      page: page || currentPage,
      status: statusFilter || null,
      priority: priorityFilter || null,
      title: searchQuery || "",
      workshopId: currentWorkshop,
      project: projectId,
    };
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setCurrentPage(1);
    refetch(null, "/task?workshopId=" + currentWorkshop);
  };

  const changePage = (dir, value) => {
    if (dir && dir === "next") {
      setCurrentPage(value);
    } else {
      setCurrentPage(value);
    }

    setTimeout(() => {
      refetch(null, "/task?" + new URLSearchParams(buildQueryParams(value)));
    }, 0);
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(
      selectedTasks.includes(taskId)
        ? selectedTasks.filter((id) => id !== taskId)
        : [...selectedTasks, taskId]
    );
  };

  const toggleAllTasks = () => {
    setSelectedTasks(
      selectedTasks.length === tasks?.length
        ? []
        : tasks?.map((task) => task._id)
    );
  };

  if (loading && !tasks) {
    return (
      <TaskTableSkeleton
        columns={columns}
        selectedTasks={selectedTasks}
        tasks={tasks}
        toggleAllTasks={toggleAllTasks}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Dialog
        modal={true}
        open={selectedTask !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedTask(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <CreateEditTaskForm
            task={selectedTask}
            isEditing={true}
            onClose={() => setSelectedTask(null)}
            setTask={setTasks}
          />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col space-y-4">
        {/* Filters */}
        <TaskTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          columns={columns}
          setColumns={setColumns}
          resetFilters={resetFilters}
        />

        {/* Tasks Table */}
        <div className="rounded-md border">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <TaskTableHead
                columns={columns}
                toggleAllTasks={toggleAllTasks}
                selectedTasks={selectedTasks}
                tasks={tasks}
              />
              <TaskTableBody
                loading={loading}
                tasks={tasks}
                columns={columns}
                toggleTaskSelection={toggleTaskSelection}
                selectedTasks={selectedTasks}
                setSelectedTask={setSelectedTask}
                refetch={refetch}
                currentPage={currentPage}
                buildQueryParams={buildQueryParams}
                rowsPerPage={rowsPerPage}
              />
            </table>
          </div>
        </div>

        {/* Pagination */}
        <TaskPagination
          selectedTasks={selectedTasks}
          tasks={tasks}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          changePage={changePage}
          loading={loading}
        />
      </div>
    </div>
  );
}
