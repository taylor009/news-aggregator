"use client";

import Link from "next/link";
import { Search, Bookmark, Settings } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { bookmarks } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const debouncedSearch = useDebounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  }, 300);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            News Aggregator
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-10 w-[300px] rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <nav className="flex items-center space-x-2">
            <Link
              href="/bookmarks"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/bookmarks"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {bookmarks.length}
                </span>
              )}
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/settings"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
