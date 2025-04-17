import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";
import { useGlobalContext } from "@/context/GlobalContext";
import useFetch from "@/hooks/use-fetch";
import DeleteWorkshopButton from "@/components/DeleteWorkshopButton";

export default function Settings() {
  const {
    currentWorkshopDetails,
    currentWorkshop,
    setCurrentWorkshop,
    setCurrentWorkshopDetails,
  } = useGlobalContext();
  const [workshopName, setWorkshopName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentWorkshopDetails) {
      setWorkshopName(currentWorkshopDetails.name);
      setDescription(currentWorkshopDetails.description);
    }
  }, [currentWorkshopDetails]);

  const { data, error, loading, refetch } = useFetch(
    "/workshop/" + currentWorkshop,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
      body: JSON.stringify({ name: workshopName, description }),
    },
    false
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setCurrentWorkshopDetails(data.workshop);
      setCurrentWorkshop(data.workshop._id);
      setWorkshopName(data.workshop.name);
      setDescription(data.workshop.description);
      toast.success("Workshop updated successfully!", {
        description: "Your workshop details have been updated successfully.",
      });
    }
    if (error) {
      toast.error(error || "Something went wrong");
    }
  }, [data, error]);
  const handleSave = () => {
    refetch({ name: workshopName, description });
  };

  return (
    <div className="flex justify-center">
      <div className="flex-1 py-6 px-6 md:px-20 lg:px-40 space-y-6">
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
              placeholder="Enter your workshop name"
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
              placeholder="Provide a detailed description of your workshop, including its objectives, target audience, and expected outcomes."
            />
            <p className="text-[13px] text-muted-foreground">
              Provide a detailed description of your workshop, including its
              objectives, target audience, and expected outcomes.
            </p>
          </div>

          <div className="flex md:flex-row flex-wrap items-center justify-end gap-4">
            <DeleteWorkshopButton />
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#18181B] text-white hover:bg-[#18181B]/90 sm:w-fit w-full"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
