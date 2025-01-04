"use client";

import { useEffect, useState } from "react";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { ArticleCard } from "@/components/articles/article-card";
import { Bookmark } from "lucide-react";

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

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      try {
        const fetchedArticles = await Promise.all(
          bookmarks.map(async (id) => {
            const response = await fetch(
              `http://localhost:8080/api/articles/${id}`
            );
            if (!response.ok) throw new Error(`Failed to fetch article ${id}`);
            return response.json();
          })
        );
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching bookmarked articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedArticles();
  }, [bookmarks]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <Bookmark className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          No bookmarked articles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Articles you bookmark will appear here. Start reading and bookmark
          articles you want to save for later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Bookmark className="h-8 w-8 text-gray-900 dark:text-white" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bookmarked Articles
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
