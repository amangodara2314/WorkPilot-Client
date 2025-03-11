import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Users,
  FolderKanban,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BorderBeam } from "@/components/magicui/border-beam";

// Sample data - replace with your actual data fetching logic
const workshopData = {
  stats: {
    members: 24,
    tasks: 78,
    projects: 12,
  },
  recentTasks: [
    {
      id: 1,
      title: "Update user dashboard wireframes",
      assignee: {
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AM",
      },
      status: "In Progress",
      dueDate: "Today",
      priority: "High",
    },
    {
      id: 2,
      title: "Create component library documentation",
      assignee: {
        name: "Taylor Swift",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "TS",
      },
      status: "Completed",
      dueDate: "Yesterday",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Implement authentication flow",
      assignee: {
        name: "Jamie Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JC",
      },
      status: "In Progress",
      dueDate: "Tomorrow",
      priority: "High",
    },
    {
      id: 4,
      title: "Design system color palette review",
      assignee: {
        name: "Sam Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SW",
      },
      status: "Not Started",
      dueDate: "Next Week",
      priority: "Low",
    },
    {
      id: 5,
      title: "Finalize Q3 roadmap presentation",
      assignee: {
        name: "Riley Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "RJ",
      },
      status: "In Progress",
      dueDate: "Friday",
      priority: "Medium",
    },
  ],
  recentMembers: [
    {
      id: 1,
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AM",
      role: "Product Designer",
      joinedDate: "2 days ago",
      tasksCompleted: 12,
    },
    {
      id: 2,
      name: "Taylor Swift",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "TS",
      role: "Frontend Developer",
      joinedDate: "1 week ago",
      tasksCompleted: 8,
    },
    {
      id: 3,
      name: "Jamie Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JC",
      role: "UX Researcher",
      joinedDate: "3 days ago",
      tasksCompleted: 5,
    },
    {
      id: 4,
      name: "Sam Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
      role: "Project Manager",
      joinedDate: "2 weeks ago",
      tasksCompleted: 24,
    },
    {
      id: 5,
      name: "Riley Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "RJ",
      role: "Backend Developer",
      joinedDate: "5 days ago",
      tasksCompleted: 15,
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-6 p-6">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Workshop Overview
          </h1>
          <span className="text-muted-foreground">
            Here's an overview for this workspace!
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className=" relative overflow-hidden">
            <BorderBeam duration={5} size={150} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workshopData.stats.members}
              </div>
              <p className="text-xs text-muted-foreground">+2 new this week</p>
            </CardContent>
          </Card>
          <Card className=" relative overflow-hidden">
            <BorderBeam duration={5} size={150} />{" "}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workshopData.stats.tasks}
              </div>
              <p className="text-xs text-muted-foreground">
                12 completed this week
              </p>
            </CardContent>
          </Card>
          <Card className=" relative overflow-hidden">
            <BorderBeam duration={5} size={150} />{" "}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workshopData.stats.projects}
              </div>
              <p className="text-xs text-muted-foreground">1 new this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Tasks */}
          <Card className="col-span-1 relative overflow-hidden">
            <BorderBeam duration={6} size={300} />

            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest tasks in your workshop</CardDescription>
              </div>
              <Link to={"/workshop/asfaef/tasks"}>
                {" "}
                <Button variant="outline" size="sm" className="ml-auto gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workshopData.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="flex flex-1 items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                        />
                        <AvatarFallback>
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {task.title}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.status === "Completed"
                          ? "success"
                          : task.status === "In Progress"
                          ? "default"
                          : "secondary"
                      }
                      className="ml-auto"
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Updated 2 hours ago
              </p>
            </CardFooter>
          </Card>

          {/* Recent Members */}
          <Card className="col-span-1 relative overflow-hidden">
            <BorderBeam duration={6} size={300} />
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>
                  Latest members in your workshop
                </CardDescription>
              </div>
              <Link to={"/workshop/asfaef/members"}>
                <Button variant="outline" size="sm" className="ml-auto gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workshopData.recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="flex flex-1 items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-medium">Joined {member.joinedDate}</p>
                      <p className="text-muted-foreground">
                        {member.tasksCompleted} tasks completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Updated 1 hour ago
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
