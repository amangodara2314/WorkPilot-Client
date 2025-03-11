import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [workshopName, setWorkshopName] = useState("Advanced React Workshop");
  const [description, setDescription] = useState(
    "A comprehensive workshop covering advanced React concepts, state management, and performance optimization techniques."
  );

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your workshop details have been updated successfully.",
    });
  };

  return (
    <div className="flex justify-center">
      <div className="flex-1 py-6 max-w-[75%]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Workshop Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your workshop details and configuration options.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-8 w-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="workshopName">Workshop Name</Label>
            </div>
            <Input
              id="workshopName"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              className="max-w-[600px]"
            />
            <p className="text-[13px] text-muted-foreground">
              This is the name that will be displayed to all workshop
              participants.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Workshop Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px]"
            />
            <p className="text-[13px] text-muted-foreground">
              Provide a detailed description of your workshop, including its
              objectives, target audience, and expected outcomes.
            </p>
          </div>

          <div className="flex items-center justify-end  gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Workshop
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your workshop and remove all associated data including:
                    <ul className="list-disc ml-6 mt-2">
                      <li>All projects within this workshop</li>
                      <li>All tasks and their progress</li>
                      <li>All member associations and permissions</li>
                      <li>All workshop resources and materials</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground">
                    Delete Workshop
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={handleSave}
              className="bg-[#18181B] text-white hover:bg-[#18181B]/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
