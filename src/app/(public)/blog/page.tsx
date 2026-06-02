import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/marketing/post-card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; tag?: string }>;
}) {
  const { cat, tag } = await searchParams;

  const where = {
    status: "PUBLISHED" as const,
    ...(cat ? { categories: { some: { category: { slug: cat } } } } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
  };

  const [categories, tags, posts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
      },
    }),
  ]);

  return (
    <div className="page-enter">
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Blog</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Health, in plain language
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Practical, evidence-based articles from our doctors. Read at your own pace.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <a href="/blog">
            <Badge variant={cat ? "secondary" : "default"} className="px-3 py-1.5 text-sm">All</Badge>
          </a>
          {categories.map((c) => (
            <a key={c.id} href={`/blog?cat=${c.slug}`}>
              <Badge variant={cat === c.slug ? "default" : "secondary"} className="px-3 py-1.5 text-sm">
                {c.name}
              </Badge>
            </a>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts found in this category.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t pt-8">
            <span className="text-xs uppercase text-muted-foreground">Tags:</span>
            {tags.map((t) => (
              <a key={t.id} href={`/blog?tag=${t.slug}`}>
                <Badge variant="outline" className="text-xs">#{t.name}</Badge>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
