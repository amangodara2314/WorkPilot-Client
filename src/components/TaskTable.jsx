"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

// Sample task data
const initialTasks = [
  {
    id: "TASK-8782",
    type: "Documentation",
    title:
      "You can't compress the program without quantifying the open-source SSD",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "TASK-7878",
    type: "Documentation",
    title:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "Backlog",
    priority: "Medium",
  },
  {
    id: "TASK-7839",
    type: "Bug",
    title: "We need to bypass the neural TCP card!",
    status: "Todo",
    priority: "High",
  },
  {
    id: "TASK-5562",
    type: "Feature",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up",
    status: "Backlog",
    priority: "Medium",
  },
  {
    id: "TASK-8686",
    type: "Feature",
    title:
      "I'll parse the wireless SSL protocol, that should driver the API panel!",
    status: "Canceled",
    priority: "Medium",
  },
  {
    id: "TASK-1280",
    type: "Bug",
    title:
      "Use the digital TLS panel, then you can transmit the haptic system!",
    status: "Done",
    priority: "High",
  },
  {
    id: "TASK-7262",
    type: "Feature",
    title:
      "The UTF8 application is down, parse the neural bandwidth so we can back up",
    status: "Done",
    priority: "High",
  },
  {
    id: "TASK-1138",
    type: "Feature",
    title:
      "Generating the driver won't do anything, we need to quantify the 1080p SSD",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "TASK-7184",
    type: "Feature",
    title: "We need to program the back-end THX pixel!",
    status: "Todo",
    priority: "Low",
  },
  {
    id: "TASK-5160",
    type: "Documentation",
    title:
      "Calculating the bus won't do anything, we need to navigate the back-end SSL",
    status: "In Progress",
    priority: "High",
  },
];

export default function TaskTable() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Define columns and their visibility
  const [columns, setColumns] = useState([
    { id: "select", label: "", visible: true },
    { id: "id", label: "Task", visible: true },
    { id: "title", label: "Title", visible: true, sortable: true },
    { id: "status", label: "Status", visible: true, sortable: true },
    { id: "priority", label: "Priority", visible: true, sortable: true },
  ]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredTasks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortColumn,
    sortDirection,
  ]);

  // Toggle column visibility
  const toggleColumnVisibility = (columnId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Toggle sort
  const toggleSort = (columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  // Toggle task selection
  const toggleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // Toggle all tasks selection
  const toggleAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-slate-500";
      case "In Progress":
        return "bg-blue-500";
      case "Backlog":
        return "bg-yellow-500";
      case "Done":
        return "bg-green-500";
      case "Canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Priority icon mapping
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <ChevronUp className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <ChevronDown className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <ChevronDown className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Status Filter */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setStatusFilter(statusFilter === "Backlog" ? "" : "Backlog");
              setPriorityFilter("");
            }}
          >
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

          {/* Priority Filter */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setPriorityFilter(priorityFilter === "" ? "High" : "");
              setStatusFilter("");
            }}
          >
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

          {/* Column Visibility Toggle */}
          <div className="ml-auto relative">
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => setShowColumnToggle(!showColumnToggle)}
            >
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

            {showColumnToggle && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10 border py-1">
                <div className="px-3 py-2 text-sm font-medium">
                  Toggle columns
                </div>
                <Separator className="" />
                {columns
                  .filter((col) => col.id !== "select")
                  .map((column) => (
                    <div
                      key={column.id}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                      onClick={() => toggleColumnVisibility(column.id)}
                    >
                      <div className="w-5">
                        {column.visible && (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      {column.label}
                    </div>
                  ))}
              </div>
            )}
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
                                selectedTasks.length === filteredTasks.length &&
                                filteredTasks.length > 0
                              }
                              onCheckedChange={toggleAllTasks}
                              aria-label="Select all"
                            />
                          ) : (
                            <div
                              className={cn(
                                "flex items-center space-x-2",
                                column.sortable && "cursor-pointer select-none"
                              )}
                              onClick={() =>
                                column.sortable && toggleSort(column.id)
                              }
                            >
                              <span>{column.label}</span>
                              {column.sortable && sortColumn === column.id && (
                                <ChevronUp
                                  className={cn(
                                    "h-4 w-4",
                                    sortDirection === "desc" && "rotate-180"
                                  )}
                                />
                              )}
                            </div>
                          )}
                        </th>
                      )
                  )}
                  <th className="h-12 px-4 text-left align-middle font-medium"></th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.filter((col) => col.visible).length + 1}
                      className="h-24 text-center"
                    >
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      {columns.map(
                        (column) =>
                          column.visible && (
                            <td
                              key={`${task.id}-${column.id}`}
                              className="p-4 align-middle"
                            >
                              {column.id === "select" ? (
                                <Checkbox
                                  checked={selectedTasks.includes(task.id)}
                                  onCheckedChange={() =>
                                    toggleTaskSelection(task.id)
                                  }
                                  aria-label={`Select ${task.id}`}
                                />
                              ) : column.id === "id" ? (
                                <div className="flex items-center gap-2">
                                  <span>{task.id}</span>
                                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                    {task.type}
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
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
            {selectedTasks.length} of {filteredTasks.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                className="h-8 w-16 rounded-md border border-input bg-transparent"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <span>{"<<"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <span>{"<"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <span>{">"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <span>{">>"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
