import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-3 w-20" />
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto h-5 w-2/3" />
        </div>
      </section>
      <section className="container pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <Skeleton className="h-[480px] rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
