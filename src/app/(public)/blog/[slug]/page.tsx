import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Eye, Share2, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/marketing/post-card";
import { CommentsSection } from "@/components/blog/comments-section";
import { ReactionsBar } from "@/components/blog/reactions-bar";
import { formatDate, initials } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  return { title: post?.title ?? "Post", description: post?.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      comments: {
        where: { status: "APPROVED", parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            where: { status: "APPROVED" },
            orderBy: { createdAt: "asc" },
            include: { author: { select: { id: true, name: true, image: true } } },
          },
        },
      },
      reactions: { select: { emoji: true } },
    },
  });
  if (!post) notFound();

  // increment view count (fire and forget)
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const reactionCounts = post.reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  const related = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      categories: { some: { categoryId: { in: post.categories.map((c) => c.category.id) } } },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true } },
      categories: { include: { category: true } },
    },
  });

  return (
    <article className="page-enter">
      <header className="container py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {post.categories.map((c) => (
              <Badge key={c.category.id} variant="accent">{c.category.name}</Badge>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                {post.author.image && <AvatarImage src={post.author.image} alt={post.author.name} />}
                <AvatarFallback>{initials(post.author.name)}</AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </div>
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readingMinutes} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {post.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="container">
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-[16/8] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>
      )}

      <section className="container-prose py-16">
        <div className="prose prose-neutral max-w-none">
          <PostBody markdown={post.content} />
        </div>

        <ReactionsBar postId={post.id} initialCounts={reactionCounts} />

        <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-6">
          <span className="text-xs uppercase text-muted-foreground">Tags:</span>
          {post.tags.map((t) => (
            <Link key={t.tag.id} href={`/blog?tag=${t.tag.slug}`}>
              <Badge variant="outline" className="text-xs">#{t.tag.name}</Badge>
            </Link>
          ))}
          <button className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Share2 className="size-3.5" /> Share
          </button>
        </div>

        <CommentsSection postId={post.id} initialComments={post.comments} />
      </section>

      {related.length > 0 && (
        <section className="container pb-20">
          <h2 className="font-display text-2xl font-semibold">Related reads</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// Tiny markdown renderer (headings, paragraphs, bold). Good enough for seeded content.
function PostBody({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n\n+/);
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("# ")) return <h1 key={i} className="mt-8 font-display text-3xl font-semibold">{block.slice(2)}</h1>;
        if (block.startsWith("## ")) return <h2 key={i} className="mt-8 font-display text-2xl font-semibold">{block.slice(3)}</h2>;
        if (block.startsWith("### ")) return <h3 key={i} className="mt-6 font-display text-xl font-semibold">{block.slice(4)}</h3>;
        if (/^\d\.\s/.test(block) || block.startsWith("- ")) {
          const ordered = /^\d\.\s/.test(block);
          const Tag = ordered ? "ol" : "ul";
          const items = block.split(/\n/).map((line) => line.replace(/^(\d\.|-)\s+/, ""));
          return (
            <Tag key={i} className={ordered ? "ml-5 list-decimal space-y-1" : "ml-5 list-disc space-y-1"}>
              {items.map((it, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />
              ))}
            </Tag>
          );
        }
        return <p key={i} className="mt-4 leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: inline(block) }} />;
      })}
    </>
  );
}

function inline(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
