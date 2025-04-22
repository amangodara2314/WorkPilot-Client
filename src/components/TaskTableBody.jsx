import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WorkshopLinkTag from "@/components/WorkshopLinkTag";
import DeleteTask from "@/components/DeleteTask";
import { getStatusColor } from "@/lib/helper";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import TaskTableSkeleton from "./TaskTableSkeleton";

export function TaskTableBody({
  loading,
  tasks,
  columns,
  toggleTaskSelection,
  selectedTasks,
  setSelectedTask,
  refetch,
  currentPage,
  buildQueryParams,
  rowsPerPage,
  toggleAllTasks,
}) {
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

  return (
    <tbody className="[&_tr:last-child]:border-0">
      {loading || !tasks ? (
        <TaskTableSkeleton
          columns={columns}
          selectedTasks={selectedTasks}
          tasks={tasks}
          toggleAllTasks={toggleAllTasks}
        />
      ) : tasks?.length === 0 ? (
        <tr>
          <td
            colSpan={columns.filter((col) => col.visible).length + 1}
            className="h-24 text-center"
          >
            No tasks found.
          </td>
        </tr>
      ) : (
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
                        onCheckedChange={() => toggleTaskSelection(task._id)}
                        aria-label={`Select ${task._id}`}
                      />
                    ) : column.id === "id" ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {task?.taskCode}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {task?.badge}
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
                          <span className="text-gray-400">Unassigned</span>
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
                  <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                    Edit
                  </DropdownMenuItem>
                  <DeleteTask
                    id={task._id}
                    task={task}
                    refetch={() =>
                      refetch(
                        null,
                        "/task?" +
                          new URLSearchParams(buildQueryParams(currentPage))
                      )
                    }
                  />
                  <DropdownMenuItem>
                    <WorkshopLinkTag path={`tasks/${task._id}`}>
                      View Details
                    </WorkshopLinkTag>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
