import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { BorderBeam } from "./magicui/border-beam";

export default function RecentCardSkeleton() {
  return (
    <Card className="col-span-1 relative overflow-hidden">
      <BorderBeam duration={6} size={300} />

      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex flex-1 items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
