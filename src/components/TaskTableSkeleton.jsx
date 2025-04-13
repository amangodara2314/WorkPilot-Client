import { useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";

export default function TaskTableSkeleton({ rowsPerPage = 5, columns }) {
  return (
    <>
      {Array.from({ length: rowsPerPage }).map((_, i) => (
        <tr key={i} className="border-b transition-colors hover:bg-gray-50">
          {columns
            .filter((col) => col.visible)
            .map((column) => (
              <td key={column.id} className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  {column.id === "select" ? (
                    <div className="h-4 w-4 animate-pulse rounded-sm bg-gray-200" />
                  ) : column.id === "task" ? (
                    <>
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </>
                  ) : column.id === "title" ? (
                    <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
                  ) : column.id === "status" ? (
                    <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
                  ) : column.id === "priority" ? (
                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                  ) : column.id === "assignedTo" ? (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                  ) : (
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  )}
                </div>
              </td>
            ))}
          <td className="p-4 align-middle">
            <div className="h-4 w-8 animate-pulse rounded-full bg-gray-200" />
          </td>
        </tr>
      ))}
    </>
  );
}
