import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/GlobalContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  batch: z.enum(["Bug", "Feature", "Documentation", "Other"], {
    required_error: "Please select a batch type.",
  }),
  project: z.string({
    required_error: "Please select a project.",
  }),
  assignedTo: z.string({
    required_error: "Please select a member.",
  }),
  status: z
    .enum(["in-review", "in-progress", "backlog", "completed", "pending"], {
      required_error: "Please select a status.",
    })
    .default("pending"),
  priority: z
    .enum(["low", "medium", "high"], {
      required_error: "Please select a priority level.",
    })
    .default("low"),
  dueDate: z.date().optional(),
});

export default function CreateEditTaskForm({
  onClose,
  task = null,
  isEditing = false,
}) {
  console.log(task);
  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task ? task.title : "",
      description: task ? task.description : "",
      status: task ? task.status : "pending",
      priority: task ? task.priority : "low",
      batch: task ? task.batch : "Other",
      project: task ? task.project : "",
      assignedTo: task ? (task.assignedTo ? task.assignedTo._id : "") : "",
      dueDate: task
        ? task.dueDate
          ? new Date(task.dueDate)
          : undefined
        : null,
    },
  });

  const url = isEditing && task ? "/task/" + task._id : "/task";
  const method = isEditing && task ? "PUT" : "POST";
  const { projects, members, setMembers, currentWorkshop, setTasks } =
    useGlobalContext();

  const {
    data: res,
    error,
    loading,
    refetch,
  } = useFetch(
    url,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    false
  );

  const {
    data: userData,
    error: userError,
    loading: userLoading,
    refetch: userRefetch,
  } = useFetch(
    "/member/" + currentWorkshop,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    false
  );

  useEffect(() => {
    if (res) {
      if (isEditing) {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? res.task : t))
        );
      }
      toast.success(`Task ${isEditing ? "updated" : "created"} successfully!`);
      form.reset();
      if (onClose) onClose();
    }
    if (error) {
      toast.error(error || "Something went wrong");
    }
  }, [res, error]);
  function onSubmit(data) {
    refetch({ ...data, workshop: currentWorkshop });
  }

  useEffect(() => {
    if (!members) {
      userRefetch();
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setMembers(userData.members);
    }
    if (userError) {
      toast.error(userError.message || "Failed to fetch members");
    }
  }, [userData, userError]);
  return (
    <div className="space-y-4">
      <div className="mb-5 pb-2 border-b">
        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1">
          {isEditing ? "Edit Task" : "Create Task"}
        </h1>
        <p className="text-muted-foreground text-sm leading-tight">
          Organize and manage tasks, resources, and team collaboration
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of the task"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Batch Field */}
          <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={task ? task.batch : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Feature">Feature</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Field */}
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem
                        className="truncate"
                        key={project._id}
                        value={project._id}
                      >
                        {project.emoji} {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority Field */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigned To Field */}
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userLoading && (
                      <div className="h-10 animate-pulse text-center">
                        Loading...
                      </div>
                    )}
                    {members?.map((member) => (
                      <SelectItem
                        className=""
                        key={member._id}
                        value={member.user._id}
                      >
                        <div className="flex items-center gap-2 text-secondary-foreground font-semibold">
                          <Avatar className="h-7 w-7 rounded-full">
                            <AvatarImage
                              src={member.user.profileImage}
                              alt={member.user.name}
                            />
                            <AvatarFallback className="rounded-full">
                              {member.user.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date Field */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Optional: Set a deadline for this task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading
                ? `${
                    task && isEditing ? "Updating Task..." : "Creating Task..."
                  }`
                : `${task && isEditing ? "Update Task" : "Create Task"}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
