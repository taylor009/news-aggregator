"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/articles/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch article");
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {error || "Article not found"}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          We couldn't load this article. Please try again later.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.createdAt}>
              {formatDistanceToNow(new Date(article.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
          {article.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          )}
          <span>•</span>
          <span>{article.source}</span>
        </div>
      </div>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}

      <div className="prose prose-lg max-w-none dark:prose-invert">
        {article.content}
      </div>

      <div className="flex flex-wrap gap-2">
        {article.categories.map((category) => (
          <Link
            key={category}
            href={`/?category=${category}`}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-8 dark:border-gray-800">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Read original article
          <ArrowLeft className="h-4 w-4 rotate-[135deg]" />
        </a>
      </div>
    </article>
  );
}
