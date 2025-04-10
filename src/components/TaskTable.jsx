import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MoreHorizontal,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { getStatusColor } from "@/lib/helper";
import useFetch from "@/hooks/use-fetch";
import { useGlobalContext } from "@/context/GlobalContext";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent } from "./ui/dialog";
import CreateEditTaskForm from "./CreateEditTask";

export default function TaskTable() {
  const {
    currentWorkshop,
    tasks,
    setTasks,
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
    setTotalTasks,
    hasNextPage,
    setHasNextPage,
  } = useGlobalContext();

  const rowsPerPage = 5;
  const [selectedTask, setSelectedTask] = useState(null);

  const [columns, setColumns] = useState([
    { id: "select", label: "", visible: true },
    { id: "id", label: "Task", visible: true },
    { id: "title", label: "Title", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "priority", label: "Priority", visible: true },
    { id: "assignedTo", label: "Assigned To", visible: true },
  ]);

  // Build query parameters
  const buildQueryParams = (page) => {
    return {
      page: page || currentPage,
      status: statusFilter || null,
      priority: priorityFilter || null,
      title: searchQuery || "",
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
      setHasNextPage(data.tasks.length >= rowsPerPage);
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
        ("fetching again");
        refetch();
      }
    }
  }, [currentPage, statusFilter, priorityFilter, searchQuery, currentWorkshop]);

  const changePage = (dir, value) => {
    if (dir && dir === "next") {
      setCurrentPage((prev) => value);
    } else {
      setCurrentPage((prev) => value);
    }
    setTimeout(() => {
      console.log("refetch", currentPage);
      refetch(null, "/task?" + new URLSearchParams(buildQueryParams(value)));
    }, 0);
  };

  useEffect(() => {
    if (!tasks && currentWorkshop) {
      refetch();
    }
  }, [currentWorkshop]);

  const toggleColumnVisibility = (columnId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
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

  const resetFilters = () => {
    const resetStates = () => {
      setSearchQuery("");
      setStatusFilter("");
      setPriorityFilter("");
      setCurrentPage(1);
    };

    refetch(null, "/task?workshopId=" + currentWorkshop, resetStates);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? "" : status);
    setCurrentPage(1);
  };

  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority === priorityFilter ? "" : priority);
    setCurrentPage(1);
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <ChevronUp className="h-4 w-4 text-red-500" />;
      case "medium":
        return <ChevronRight className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <ChevronDown className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Status options for dropdown
  const statusOptions = [
    "in-review",
    "in-progress",
    "backlog",
    "completed",
    "pending",
    "canceled",
  ];

  // Priority options for dropdown
  const priorityOptions = ["high", "medium", "low"];

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
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search task title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 4.5C3 3.11929 4.11929 2 5.5 2C6.88071 2 8 3.11929 8 4.5C8 5.88071 6.88071 7 5.5 7C4.11929 7 3 5.88071 3 4.5ZM5.5 9C4.67157 9 4 9.67157 4 10.5C4 11.3284 4.67157 12 5.5 12C6.32843 12 7 11.3284 7 10.5C7 9.67157 6.32843 9 5.5 9zM3 10.5C3 9.11929 4.11929 8 5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5zM11.5 3C10.6716 3 10 3.67157 10 4.5C10 5.32843 10.6716 6 11.5 6C12.3284 6 13 5.32843 13 4.5C13 3.67157 12.3284 3 11.5 3zM9 4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5C14 5.88071 12.8807 7 11.5 7C10.1193 7 9 5.88071 9 4.5zM11.5 9C10.6716 9 10 9.67157 10 10.5C10 11.3284 10.6716 12 11.5 12C12.3284 12 13 11.3284 13 10.5C13 9.67157 12.3284 9 11.5 9zM9 10.5C9 9.11929 10.1193 8 11.5 8C12.8807 8 14 9.11929 14 10.5C14 11.8807 12.8807 13 11.5 13C10.1193 13 9 11.8807 9 10.5z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Status
                {statusFilter && (
                  <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {statusFilter}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className="flex items-center gap-2"
                >
                  {statusFilter === status && (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}
                  />
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 4.5C3 3.11929 4.11929 2 5.5 2C6.88071 2 8 3.11929 8 4.5C8 5.88071 6.88071 7 5.5 7C4.11929 7 3 5.88071 3 4.5ZM5.5 9C4.67157 9 4 9.67157 4 10.5C4 11.3284 4.67157 12 5.5 12C6.32843 12 7 11.3284 7 10.5C7 9.67157 6.32843 9 5.5 9zM3 10.5C3 9.11929 4.11929 8 5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5zM11.5 3C10.6716 3 10 3.67157 10 4.5C10 5.32843 10.6716 6 11.5 6C12.3284 6 13 5.32843 13 4.5C13 3.67157 12.3284 3 11.5 3zM9 4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5C14 5.88071 12.8807 7 11.5 7C10.1193 7 9 5.88071 9 4.5zM11.5 9C10.6716 9 10 9.67157 10 10.5C10 11.3284 10.6716 12 11.5 12C12.3284 12 13 11.3284 13 10.5C13 9.67157 12.3284 9 11.5 9zM9 10.5C9 9.11929 10.1193 8 11.5 8C12.8807 8 14 9.11929 14 10.5C14 11.8807 12.8807 13 11.5 13C10.1193 13 9 11.8807 9 10.5z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Priority
                {priorityFilter && (
                  <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {priorityFilter}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {priorityOptions.map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() => handlePriorityFilter(priority)}
                  className="flex items-center gap-2"
                >
                  {priorityFilter === priority && (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {getPriorityIcon(priority)}
                  {priority}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset Filters */}
          {(searchQuery || statusFilter || priorityFilter) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex items-center gap-1"
            >
              Reset
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Column Visibility Toggle using shadcn/ui DropdownMenu */}
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns
                  .filter((col) => col.id !== "select")
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.visible}
                      onCheckedChange={() => toggleColumnVisibility(column.id)}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="rounded-md border">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-gray-50">
                <tr className="border-b">
                  {columns.map(
                    (column) =>
                      column.visible && (
                        <th
                          key={column.id}
                          className="h-12 px-4 text-left align-middle font-medium text-gray-500"
                        >
                          {column.id === "select" ? (
                            <Checkbox
                              checked={
                                selectedTasks.length === tasks?.length &&
                                tasks?.length > 0
                              }
                              onCheckedChange={toggleAllTasks}
                              aria-label="Select all"
                              disabled={!tasks?.length}
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span>{column.label}</span>
                            </div>
                          )}
                        </th>
                      )
                  )}
                  <th className="h-12 px-4 text-left align-middle font-medium"></th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: rowsPerPage }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 h-[65px] py-8"
                    >
                      {columns
                        .filter((col) => col.visible)
                        .map((column) => (
                          <td key={column.id} className="p-4 align-middle">
                            <Skeleton
                              className={`h-4 ${
                                column.id === "select" ? "w-4" : "w-full"
                              }`}
                            />
                          </td>
                        ))}
                      <td className="p-4 align-middle h-8">
                        <Skeleton className="h-4 w-8" />
                      </td>
                    </tr>
                  ))
                ) : tasks?.length === 0 ? (
                  // No results message
                  <tr>
                    <td
                      colSpan={columns.filter((col) => col.visible).length + 1}
                      className="h-24 text-center"
                    >
                      No tasks found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  // Tasks data
                  tasks?.map((task) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      {columns.map(
                        (column) =>
                          column.visible && (
                            <td
                              key={`${task._id}-${column.id}`}
                              className="p-4 align-middle"
                            >
                              {column.id === "select" ? (
                                <Checkbox
                                  checked={selectedTasks.includes(task._id)}
                                  onCheckedChange={() =>
                                    toggleTaskSelection(task._id)
                                  }
                                  aria-label={`Select ${task._id}`}
                                />
                              ) : column.id === "id" ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                    {task.taskCode}
                                  </span>
                                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                    {task.batch}
                                  </span>
                                </div>
                              ) : column.id === "status" ? (
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${getStatusColor(
                                      task.status
                                    )}`}
                                  />
                                  {task.status}
                                </div>
                              ) : column.id === "priority" ? (
                                <div className="flex items-center gap-2">
                                  {getPriorityIcon(task.priority)}
                                  {task.priority}
                                </div>
                              ) : column.id === "assignedTo" ? (
                                <div className="flex items-center gap-2 truncate text-nowrap">
                                  {task.assignedTo ? (
                                    <>
                                      {task.assignedTo.profileImage &&
                                      task.assignedTo.profileImage !== "" ? (
                                        <Avatar className="h-6 w-6 rounded-full">
                                          <AvatarImage
                                            src={task.assignedTo.profileImage}
                                            alt={task.assignedTo.name}
                                          />
                                          <AvatarFallback className="rounded-full">
                                            {task.assignedTo.name[0].toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                                          {task.assignedTo.name.charAt(0)}
                                        </div>
                                      )}
                                      <span>{task.assignedTo.name}</span>
                                    </>
                                  ) : (
                                    <span className="text-gray-400">
                                      Unassigned
                                    </span>
                                  )}
                                </div>
                              ) : (
                                task[column.id]
                              )}
                            </td>
                          )
                      )}
                      <td className="p-4 align-middle">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedTask(task)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedTasks.length > 0
              ? `${selectedTasks.length} of ${
                  tasks?.length || 0
                } row(s) selected.`
              : `${tasks?.length || 0} tasks shown.`}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => changePage("prev", currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <span className="sr-only">Go to previous page</span>
              <span>{"<"}</span>
            </Button>
            <div className="flex w-[100px] items-center justify-center text-sm">
              Page {currentPage}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => changePage("next", currentPage + 1)}
              disabled={!hasNextPage || loading}
            >
              <span className="sr-only">Go to next page</span>
              <span>{">"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
