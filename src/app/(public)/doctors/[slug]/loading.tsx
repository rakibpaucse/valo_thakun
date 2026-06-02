import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="-mt-20 space-y-6 lg:-mt-24">
            <div className="overflow-hidden rounded-3xl border border-ink-100 bg-card">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
            <Skeleton className="h-44 w-full rounded-3xl" />
          </aside>
          <div className="space-y-6 pt-6 lg:pt-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-7 w-40 mt-8" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
