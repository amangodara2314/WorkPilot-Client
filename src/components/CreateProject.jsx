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
import { useGlobalContext } from "@/context/GlobalContext";

const projectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  emoji: z.string().optional(),
});

export default function CreateProjectForm({ setProjects, onClose }) {
  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "🚀",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const [formValues, setFormValues] = useState(null);

  // Get the refetch function from useFetch
  const { data, error, loading, refetch } = useFetch(
    "/project",
    {
      method: "POST",
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
      toast.error("Failed to create project: " + error);
      return;
    }
    if (data) {
      setProjects((prev) => [...prev, data.project]);
      toast.success("Project created successfully!");
      form.reset();
      if (onClose) onClose();
    }
  }, [data, error, onClose, form]);

  function onSubmit(values) {
    setFormValues((prev) => values);

    refetch();
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
        <h1 className="text-xl font-semibold">Create Project</h1>
        <p className="text-muted-foreground text-sm">
          Manage your projects effectively
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
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
