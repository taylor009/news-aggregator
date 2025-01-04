"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const savedBookmarks = localStorage.getItem("bookmarks");
      if (savedBookmarks) {
        try {
          return JSON.parse(savedBookmarks);
        } catch (error) {
          console.error("Failed to parse bookmarks:", error);
        }
      }
    }
    return [];
  });

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.includes(id),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (id: number) => {
      const isCurrentlyBookmarked = bookmarks.includes(id);

      setBookmarks((prev) =>
        isCurrentlyBookmarked
          ? prev.filter((bookmarkId) => bookmarkId !== id)
          : [...prev, id]
      );

      // Show toast notification after state update
      setTimeout(() => {
        toast.success(
          isCurrentlyBookmarked
            ? "Removed from bookmarks"
            : "Added to bookmarks",
          {
            id: `bookmark-${id}`,
            duration: 2000,
          }
        );
      }, 0);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
}
