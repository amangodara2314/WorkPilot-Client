import CurrentWorkshop from "@/components/CurrentWorkshop";
import RolesDropdown from "@/components/RolesDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/context/GlobalContext";
import useFetch from "@/hooks/use-fetch";
import { Check, ClipboardCopy, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Members() {
  const { currentWorkshop } = useGlobalContext();
  const [copied, setCopied] = useState(false);
  const [changingRole, setChangingRole] = useState(false);
  const { data, loading, error, refetch } = useFetch(
    "/member/" + currentWorkshop,
    {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("accessToken")),
      },
    },
    false
  );
  useEffect(() => {
    if (currentWorkshop) {
      refetch();
    }
  }, [currentWorkshop]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data?.joinUrl || "").then(() => {
      setCopied(true);
      toast.success("Invite link copied!", {
        style: { background: "#22c55e", color: "white" },
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

        {loading || !data ? (
          <>
            <div className="flex items-center space-x-2 max-w-full">
              <Skeleton className="h-10 w-full rounded-md flex-grow" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Separator className="" />
            <MembersSkeleton />
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 max-w-full">
              {!data.joinUrl ? (
                <div className="text-center text-muted-foreground text-sm w-full">
                  You don't have permission to view this.
                </div>
              ) : (
                <>
                  {" "}
                  <Input
                    value={data?.joinUrl || ""}
                    readOnly
                    className="cursor-default"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    disabled={copied}
                    className="bg-[#18181B] text-white hover:text-white hover:bg-[#18181B]/90"
                  >
                    {!copied ? <CopyIcon /> : <Check />}
                  </Button>
                </>
              )}
            </div>
            <Separator className="" />
            {!loading && !error && (
              <div className="space-y-3">
                {data?.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage
                          src={member?.user?.profileImage}
                          alt={member?.user?.name}
                        />
                        <AvatarFallback className="rounded-full">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {member?.user?.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {member?.user?.email}
                        </span>
                      </div>
                    </div>
                    <RolesDropdown
                      setChangingRole={setChangingRole}
                      callback={refetch}
                      changingRole={changingRole}
                      member={member}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const MembersSkeleton = () => {
  useEffect(() => {
    console.log("MembersSkeleton");
  }, []);
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      ))}
    </div>
  );
};
