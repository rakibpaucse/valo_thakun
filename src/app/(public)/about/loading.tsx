import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto h-5 w-2/3" />
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-3xl" />
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-3xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
