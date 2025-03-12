import CurrentWorkshop from "@/components/CurrentWorkshop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Check, ClipboardCopy, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Members() {
  const inviteLink = "https://yourwebsite.com/invite/12345";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      toast.success("Invite link copied!", {
        style: { background: "#22c55e", color: "white" }, // Tailwind green-500
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="flex justify-center">
      <div className="flex-1 py-6 max-w-[75%] space-y-6">
        <CurrentWorkshop size={16} />
        <Separator className="" />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Workshop Members</h1>
            <p className="text-sm text-muted-foreground">
              Workspace members can view and join all Workspace project, tasks
              and create new task in the Workspace.{" "}
            </p>
          </div>
        </div>
        <Separator className="" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              Invite Members in your Workshop
            </h1>
            <p className="text-sm text-muted-foreground">
              Anyone with an invite link can join this free Workspace. You can
              also disable and create a new invite link for this Workspace at
              any time.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 max-w-full">
          <Input value={inviteLink} readOnly className="cursor-default" />
          <Button
            onClick={handleCopy}
            variant="outline"
            disabled={copied}
            className="bg-[#18181B] text-white hover:text-white hover:bg-[#18181B]/90"
          >
            {!copied ? <CopyIcon /> : <Check />}
          </Button>
        </div>
        <Separator className="" />
      </div>
    </div>
  );
}
