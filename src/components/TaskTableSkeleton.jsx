import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";

export default function TaskTableSkeleton({
  rowsPerPage = 5,
  columns,
  selectedTasks,
  tasks,
  toggleAllTasks,
}) {
  return (
    <>
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
          {Array.from({ length: rowsPerPage }).map((_, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 h-[65px] py-8">
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
          ))}
        </tbody>
      </table>
    </>
  );
}
