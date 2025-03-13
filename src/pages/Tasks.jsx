import TaskDialog from "@/components/TaskDailog";
import TaskTable from "@/components/TaskTable";

export default function Tasks() {
  return (
    <div className="w-full h-full flex-col space-y-8 p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <TaskDialog />
      </div>
      <TaskTable />
      <div></div>
    </div>
  );
}
