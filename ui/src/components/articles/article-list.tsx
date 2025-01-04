import { useQuery } from "@tanstack/react-query";
import { ArticleCard } from "./article-card";
import { getArticles } from "@/lib/api/articles";
import { ChevronLeft, ChevronRight, Loader2, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZES = [10, 25, 50, 100];
const SORT_OPTIONS = [
  { value: "createdAt", label: "Date" },
  { value: "title", label: "Title" },
  { value: "source", label: "Source" },
];

interface ArticleListProps {
  search?: string;
  category?: string;
}

function ArticleSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="aspect-video w-full animate-pulse bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ArticleList({ search, category }: ArticleListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 12;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "DESC") as "ASC" | "DESC";

  const { data, status, error } = useQuery({
    queryKey: [
      "articles",
      { search, category, page: currentPage, pageSize, sortBy, sortOrder },
    ],
    queryFn: () =>
      getArticles({
        page: currentPage,
        search,
        category,
        limit: pageSize,
        sortBy,
        sortOrder,
      }),
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newSize.toString());
    params.set("page", "1"); // Reset to first page when changing page size
    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (field === sortBy) {
      // Toggle sort order if clicking the same field
      params.set("sortOrder", sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "DESC");
    }
    router.push(`/?${params.toString()}`);
  };

  if (status === "pending") {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold text-gray-900">
          Error loading articles
        </p>
        <p className="text-sm text-gray-600">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold text-gray-900">No articles found</p>
        <p className="text-sm text-gray-600">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, data.meta.total)} of{" "}
            {data.meta.total} articles
          </span>
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <div className="flex gap-2">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleSortChange(value)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                    sortBy === value
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {label}
                  {sortBy === value && (
                    <ArrowUpDown
                      className={`h-4 w-4 transition-transform ${
                        sortOrder === "DESC" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <span>
            Page {currentPage} of {data.meta.totalPages}
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, data.meta.totalPages) }).map(
            (_, i) => {
              const pageNumber =
                currentPage <= 3
                  ? i + 1
                  : currentPage >= data.meta.totalPages - 2
                  ? data.meta.totalPages - 4 + i
                  : currentPage - 2 + i;

              if (pageNumber <= 0 || pageNumber > data.meta.totalPages)
                return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`min-w-[40px] rounded-lg px-4 py-2 text-sm font-medium ${
                    currentPage === pageNumber
                      ? "bg-blue-100 text-blue-800"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
          )}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.meta.totalPages}
          className="flex items-center gap-1 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
