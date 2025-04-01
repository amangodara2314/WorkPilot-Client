import { Link } from "react-router-dom";
import { BorderBeam } from "./magicui/border-beam";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useGlobalContext } from "@/context/GlobalContext";
import WorkshopLinkTag from "./WorkshopLinkTag";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function RecentMembers({ members = [] }) {
  return (
    <Card className="col-span-1 relative overflow-hidden">
      <BorderBeam duration={6} size={300} />
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Recent Members</CardTitle>
          <CardDescription>Latest members in your workshop</CardDescription>
        </div>

        <WorkshopLinkTag path={"members"}>
          <Button variant="outline" size="sm" className="ml-auto gap-1">
            View All <ArrowUpRight className="h-3 w-3" />
          </Button>
        </WorkshopLinkTag>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.length === 0 && (
            <div className="text-sm text-muted-foreground w-full text-center my-24">
              <span>No members found</span>
            </div>
          )}
          {members.length > 0 &&
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex flex-1 items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium">Joined {member.joinedDate}</p>
                  <p className="text-muted-foreground">
                    {member.tasksCompleted} tasks completed
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
