import { Article } from "@/types/article";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Share, Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { toast } from "sonner";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.content,
          url: article.url,
        });
      } else {
        await navigator.clipboard.writeText(article.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share article");
    }
  };

  const handleBookmark = () => {
    toggleBookmark(article);
    toast.success(
      bookmarked ? "Article removed from bookmarks" : "Article bookmarked"
    );
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    // Add quality and sizing parameters to Unsplash URLs
    if (url.includes("unsplash.com")) {
      return `${url}?w=800&q=80&fit=crop&auto=format`;
    }
    return url;
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="relative h-48 overflow-hidden">
        {article.imageUrl ? (
          <Image
            src={getImageUrl(article.imageUrl)}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No image available
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {article.source}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(article.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <h2 className="mb-2 flex-1 text-lg font-semibold text-gray-900 dark:text-white">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {article.title}
          </Link>
        </h2>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {article.content}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {article.categories?.map((category) => (
              <span
                key={category}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Share article"
            >
              <Share className="h-4 w-4" />
            </button>
            <button
              onClick={handleBookmark}
              className={`rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                bookmarked
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark article"}
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
