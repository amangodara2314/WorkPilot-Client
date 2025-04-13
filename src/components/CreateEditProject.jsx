import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";

const projectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  emoji: z.string().optional(),
});

export default function CreateEditProject({
  project = null,
  setProjects,
  onClose,
  mode = "create",
  callback = () => {},
}) {
  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      emoji: project?.emoji || "🚀",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const [formValues, setFormValues] = useState(null);

  // Get the refetch function from useFetch
  const { data, error, loading, refetch } = useFetch(
    mode === "create" ? "/project" : `/project/${project?._id}`,
    {
      method: mode === "create" ? "POST" : "PUT",
      body: JSON.stringify(formValues),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    false
  );

  useEffect(() => {
    if (error) {
      toast.error(`${error}`);
      return;
    }
    if (data) {
      if (mode === "create") {
        setProjects((prev) => [...prev, data.project]);
        toast.success("Project created successfully!");
      } else {
        callback();
        toast.success("Project updated successfully!");
      }

      form.reset();
      if (onClose) onClose();
    }
  }, [data, error]);

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
        emoji: project.emoji || "🚀",
      });
    }
  }, [project, form]);

  function onSubmit(values) {
    setFormValues(values);
    refetch(values);
  }

  const handleEmojiSelect = (emojiObject) => {
    form.setValue("emoji", emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="mb-5 pb-2 border-b">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Create" : "Edit"} Project
        </h1>
        <p className="text-muted-foreground text-sm">
          {mode === "create"
            ? "Start a new project"
            : "Update your project details"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your project"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emoji */}
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <div className="relative" ref={emojiPickerRef}>
                  <FormControl>
                    <Input
                      {...field}
                      ref={inputRef}
                      onFocus={() => setShowEmojiPicker(true)}
                      readOnly
                    />
                  </FormControl>
                  {showEmojiPicker && (
                    <div className="absolute z-10 mt-2 left-0 bottom-[42px]">
                      <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Project"
                : "Update Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
