"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePreferences } from "@/lib/hooks/use-preferences";
import { ArticleCard } from "@/components/articles/article-card";
import { NewsletterSubscription } from "@/components/newsletter-subscription";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { Bell, Search } from "lucide-react";

const CATEGORIES = [
  "technology",
  "ai",
  "science",
  "space",
  "environment",
  "business",
];

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
  updatedAt: string;
}

interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { newArticles, isConnected, clearNewArticles } = useRealtime();

  const fetchArticles = async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", pageSize.toString());
      params.append("sortBy", preferences.defaultSortBy || "createdAt");
      params.append("sortOrder", preferences.defaultSortOrder || "DESC");

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (selectedCategories.length > 0) {
        selectedCategories.forEach((category) => {
          params.append("categories[]", category);
        });
      }

      console.log("Fetching articles with params:", params.toString());
      const response = await fetch(
        `http://localhost:8080/articles?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Response not OK:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
      }

      const data: ArticlesResponse = await response.json();
      console.log("Received articles:", data);

      if (!data.articles) {
        throw new Error("No articles received from server");
      }

      setArticles(data.articles);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch articles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [
    page,
    pageSize,
    searchQuery,
    selectedCategories,
    searchParams,
    preferences,
  ]);

  const handleShowNewArticles = () => {
    setArticles((prev) => [...newArticles, ...prev]);
    clearNewArticles();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1); // Reset to first page when changing filters
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-600">
          Error Loading Articles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => fetchArticles()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-300 bg-white px-9 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </form>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-500">per page</span>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryToggle(category)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              selectedCategories.includes(category)
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {newArticles.length > 0 && (
        <div className="sticky top-20 z-10 mx-auto flex max-w-lg items-center justify-center">
          <button
            onClick={handleShowNewArticles}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Bell className="h-4 w-4" />
            {newArticles.length} new{" "}
            {newArticles.length === 1 ? "article" : "articles"} available
          </button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="flex h-96 flex-col items-center justify-center text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            No articles found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or check back later for new articles.
          </p>
        </div>
      )}

      <div className="mt-12">
        <NewsletterSubscription />
      </div>
    </div>
  );
}
