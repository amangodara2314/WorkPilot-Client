import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function DatePicker({ form, name, label, description, disabled }) {
  // Format date for the native input
  const formatDateForInput = (date) => {
    if (!date) return "";
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Handle date changes from input
        const handleDateChange = (e) => {
          const value = e.target.value;
          field.onChange(value ? new Date(value) : null);
        };

        return (
          <FormItem className="flex flex-col no-close">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <input
                  type="date"
                  value={formatDateForInput(field.value)}
                  onChange={handleDateChange}
                  disabled={disabled}
                  className={cn(
                    "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
