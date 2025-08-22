"use client";

import { cn } from "@/lib/cn";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  );
};

export const TableSkeleton = ({ rows = 10, columns = 5 }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-sky-950">
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="p-2 text-white text-[16px]">
              <Skeleton className="h-4 w-full bg-sky-800" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="bg-white text-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="p-2">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const LogisticPageSkeleton = () => {
  return (
    <div className="flex flex-col justify-start ml-[72px] py-8 pr-8 gap-4">
      <Skeleton className="h-10 w-64 mb-4" />
      <div className="flex flex-row items-center justify-between mb-5 gap-4">
        <div className="relative w-[520px]">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
      <TableSkeleton rows={10} columns={5} />
      <div className="flex justify-center">
        <Skeleton className="h-8 w-64" />
      </div>
    </div>
  );
};
