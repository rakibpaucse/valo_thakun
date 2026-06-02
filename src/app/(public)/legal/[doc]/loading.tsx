import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-prose py-16 space-y-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
