import { Checkbox } from "@/components/ui/checkbox";

export function TaskTableHead({
  columns,
  toggleAllTasks,
  selectedTasks,
  tasks,
}) {
  return (
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
  );
}
