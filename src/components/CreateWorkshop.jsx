import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import useFetch from "@/hooks/use-fetch";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const workshopFormSchema = z.object({
  name: z.string().min(2, {
    message: "Workshop name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

export default function CreateWorkshopForm({
  onClose,
  setWorkshops,
  changeWorkshop,
}) {
  const { currentWorkshop } = useGlobalContext();
  const [formData, setFormData] = useState(null);
  const { data, error, loading, refetch } = useFetch(
    "/workshop",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
      body: JSON.stringify(formData),
    },
    false
  );

  const form = useForm({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setWorkshops((w) => [...w, data.workshop.workshop]);
      changeWorkshop(data.workshop.workshop._id);
      setFormData(null);
      form.reset();
      onClose();
      toast.success("Workshop created successfully!");
    }
    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  }, [data, error]);

  function onSubmit(values) {
    refetch(values);
  }

  return (
    <div className="space-y-4">
      <div className="mb-5 pb-2 border-b">
        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1">
          Create Workshop
        </h1>
        <p className="text-muted-foreground text-sm leading-tight">
          Add a new workshop to group related tasks and sessions
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workshop Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter workshop name" {...field} />
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
                <FormLabel>
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional: Add a short description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Creating Workshop..." : "Create Workshop"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
