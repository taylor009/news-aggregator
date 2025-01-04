"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Share2, Bookmark, Clock } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { toast } from "react-hot-toast";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";

interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  source: string;
  author?: string;
  categories: string[];
  createdAt: string;
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarks.includes(article.id);
  const readingTime = calculateReadingTime(article.content);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.content.slice(0, 100) + "...",
          url: article.url,
        });
      } else {
        await navigator.clipboard.writeText(article.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {article.imageUrl && (
        <div className="relative aspect-video">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{article.source}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(article.createdAt))} ago</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatReadingTime(readingTime)}
          </span>
        </div>
        <Link href={`/articles/${article.id}`}>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            {article.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {article.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {article.categories?.map((category) => (
              <span
                key={category}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Share article"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isBookmarked
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
            >
              <Bookmark
                className="h-4 w-4"
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
