import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-3 w-12" />
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto h-5 w-2/3" />
        </div>
      </section>
      <section className="container pb-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex justify-between gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 flex-1 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-12 w-1/2" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
