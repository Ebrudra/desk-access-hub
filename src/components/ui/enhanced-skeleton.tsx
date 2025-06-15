
import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                {Array.from({ length: columns }).map((_, j) => (
                  <Skeleton
                    key={j}
                    className={cn(
                      "h-4",
                      j === 0 ? "w-[200px]" : j === 1 ? "w-[150px]" : "w-[100px]"
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardSkeletonProps {
  showImage?: boolean;
  lines?: number;
}

function CardSkeleton({ showImage = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div className="rounded-lg border p-6 space-y-3">
      {showImage && <Skeleton className="h-48 w-full" />}
      <Skeleton className="h-4 w-[250px]" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
      <div className="flex items-center space-x-2 pt-2">
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    </div>
  );
}

interface FormSkeletonProps {
  fields?: number;
}

function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex items-center space-x-2 pt-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[80px]" />
      </div>
    </div>
  );
}

export { Skeleton, TableSkeleton, CardSkeleton, FormSkeleton };
