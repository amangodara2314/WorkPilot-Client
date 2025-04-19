import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import CreateEditTaskForm from "@/components/CreateEditTask";
import { TaskPagination } from "./TaskPagination";
import { TaskTableBody } from "./TaskTableBody";
import { TaskTableHeader } from "./TaskTableHeader";
import { TaskTableHead } from "./TaskTableHead";
import TaskTableSkeleton from "./TaskTableSkeleton";
import { DialogTitle } from "@radix-ui/react-dialog";

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
  const { projectId } = useParams();

  const dialogRef = useRef(null);
  const [columns, setColumns] = useState([
    { id: "select", label: "", visible: true },
    { id: "id", label: "Task", visible: true },
    { id: "title", label: "Title", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "priority", label: "Priority", visible: true },
    { id: "assignedTo", label: "Assigned To", visible: true },
  ]);

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
      selectedTasks?.length === tasks?.length
        ? []
        : tasks?.map((task) => task._id)
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (event.target.closest(".no-close")) return;

      if (
        dialogRef.current &&
        dialogRef.current.classList.contains("dialog-cont")
      ) {
        setSelectedTask(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      {selectedTask && (
        <div
          className="fixed top-0 w-full left-0 h-full bg-black bg-opacity-70 z-50 flex items-center justify-center dialog-cont"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedTask(null);
            }
          }}
        >
          <div
            ref={dialogRef}
            className="sm:min-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateEditTaskForm
              task={selectedTask}
              isEditing={true}
              onClose={() => setSelectedTask(null)}
              setTasks={setTasks}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-4">
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
