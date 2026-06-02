import Link from "next/link";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type PostLite = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  readingMinutes: number;
  publishedAt: Date | null;
  categories: { category: { name: string; slug: string } }[];
  author: { name: string };
};

export function PostCard({ post }: { post: PostLite }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="press group h-full overflow-hidden hover:-translate-y-1 hover:shadow-lift">
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden bg-mist-200">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {post.categories.slice(0, 2).map((c) => (
              <Badge key={c.category.slug} variant="accent" className="text-[10px]">
                {c.category.name}
              </Badge>
            ))}
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900 line-clamp-2 transition-colors group-hover:text-iris-700">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink-700/70">{post.excerpt}</p>

          <div className="mt-4 flex items-center justify-between text-xs text-ink-700/65">
            <span>{post.author.name}</span>
            <div className="flex items-center gap-3">
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {post.readingMinutes} min
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
