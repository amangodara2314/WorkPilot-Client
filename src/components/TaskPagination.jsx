import { Button } from "@/components/ui/button";

export function TaskPagination({
  selectedTasks,
  tasks,
  currentPage,
  hasNextPage,
  changePage,
  loading,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {selectedTasks.length > 0
          ? `${selectedTasks.length} of ${tasks?.length || 0} row(s) selected.`
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
  );
}
