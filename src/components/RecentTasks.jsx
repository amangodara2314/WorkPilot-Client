import { Link } from "react-router-dom";
import { BorderBeam } from "./magicui/border-beam";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ArrowUpRight, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useGlobalContext } from "@/context/GlobalContext";
import WorkshopLinkTag from "./WorkshopLinkTag";
import { getDueStatus } from "@/lib/helper";

export default function RecentTasks({ tasks = [] }) {
  const { currentWorkshop, user } = useGlobalContext();
  return (
    <Card className="col-span-1 relative overflow-hidden">
      <BorderBeam duration={6} size={300} />

      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>
            {user?.role == "Member" ? "Your Recent Tasks" : "Recent Tasks"}
          </CardTitle>
          <CardDescription>Latest tasks in your workshop</CardDescription>
        </div>
        <WorkshopLinkTag path={"tasks"}>
          <Button variant="outline" size="sm" className="ml-auto gap-1">
            View All <ArrowUpRight className="h-3 w-3" />
          </Button>
        </WorkshopLinkTag>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 && (
            <div className="text-sm text-muted-foreground w-full text-center my-24">
              <span>No tasks found</span>
            </div>
          )}
          {tasks.length > 0 &&
            tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex flex-1 w-3/4 items-center space-x-4 truncate">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={task?.assignedTo?.profileImage}
                      alt={task?.assignedTo?.name}
                    />
                    <AvatarFallback>
                      {task?.assignedTo?.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {task.title}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{getDueStatus(task?.dueDate)}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    task.status === "completed"
                      ? "success"
                      : task.status === "in-progress"
                      ? "default"
                      : "secondary"
                  }
                  className="ml-auto flex items-center justify-center"
                >
                  {task.status}
                </Badge>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
