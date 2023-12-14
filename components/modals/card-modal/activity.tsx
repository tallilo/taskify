"use client";

import { ActivityItem } from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import { checkSubscription } from "@/lib/subscription";
import { AuditLog } from "@prisma/client";
import { Activity as ActivityIcon } from "lucide-react";

interface ActivityProps {
  items: AuditLog[];
}

export const Activity = ({ items }: ActivityProps) => {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <ol className="mt-2 space-y-4">
          {items.map((item) => (
            <ActivityItem data={item} key={item.id} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className=" h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className=" w-24 mb-2 h-6 bg-neutral-200" />
        <Skeleton className=" w-full h-10 bg-neutral-200" />
      </div>
    </div>
  );
};
