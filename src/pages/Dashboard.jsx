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
import { Link, useParams } from "react-router-dom";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect } from "react";
import CountCard from "@/components/CountCard";
import useFetch from "@/hooks/use-fetch";
import RecentTasks from "@/components/RecentTasks";
import RecentCardSkeleton from "@/components/RecentCardSkeleton";
import RecentMembers from "@/components/RecentMembers";
import { toast } from "sonner";
import socket from "@/lib/socket";

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
  const { user } = useGlobalContext();
  const params = useParams();

  const { data, error, loading, refetch } = useFetch(
    "/workshop/details/" + params.id
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    socket.on("new_task", (data) => {
      refetch();
      toast.info(data.message, {
        duration: 8000,
        description: data?.description,
      });
    });
    socket.on("task_updated", (data) => {
      refetch();
    });
    socket.on("task_deleted", (data) => {
      refetch();
    });
    socket.on("project_deleted", (data) => {
      refetch();
    });
  }, [socket]);
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
          <CountCard
            title="Total Members"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            count={data?.totalMembers || 0}
            isLoading={loading}
          />
          <CountCard
            title="Total Projects"
            icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />}
            count={data?.totalProjects || 0}
            isLoading={loading}
          />
          <CountCard
            title={user?.role == "Member" ? "Your Tasks" : "Total Tasks"}
            icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
            count={data?.totalTasks || 0}
            isLoading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Tasks */}
          {loading ? (
            <RecentCardSkeleton />
          ) : (
            <RecentTasks tasks={data?.recentTasks} />
          )}
          {loading ? (
            <RecentCardSkeleton />
          ) : (
            <RecentMembers members={data?.recentMembers} />
          )}
          {/* Recent Members */}
        </div>
      </div>
    </div>
  );
}
