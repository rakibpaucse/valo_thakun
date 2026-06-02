import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton — centered to match the new editorial hero */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center bg-gradient-to-b from-mist-200/55 via-background to-background pt-24 pb-16">
        <div className="container flex flex-col items-center gap-6">
          <Skeleton className="h-7 w-72 rounded-full" />
          <Skeleton className="h-20 w-3/4 max-w-3xl" />
          <Skeleton className="h-20 w-2/3 max-w-2xl" />
          <Skeleton className="mt-4 h-5 w-1/2 max-w-xl" />
          <Skeleton className="h-5 w-2/5 max-w-md" />
          <div className="mt-6 flex gap-5">
            <Skeleton className="h-14 w-52 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </section>

      {/* Quick-actions skeleton */}
      <section className="container -mt-10 grid gap-4 md:grid-cols-3 md:-mt-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-3xl" />
        ))}
      </section>

      {/* Section skeletons */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-32" />
          <Skeleton className="mx-auto h-10 w-3/4" />
          <Skeleton className="mx-auto h-5 w-2/3" />
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-3xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
