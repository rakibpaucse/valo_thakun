import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="container py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="mx-auto h-5 w-24 rounded-full" />
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto h-5 w-2/3" />
        </div>
      </div>
      <div className="container">
        <Skeleton className="aspect-[16/8] w-full rounded-3xl" />
      </div>
      <div className="container-prose py-16 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
