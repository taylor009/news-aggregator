import { useState, useEffect } from "react";

interface UserPreferences {
  defaultPageSize: number;
  defaultSortBy: string;
  defaultSortOrder: "ASC" | "DESC";
  preferredCategories: string[];
  theme: "light" | "dark";
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultPageSize: 12,
  defaultSortBy: "createdAt",
  defaultSortOrder: "DESC",
  preferredCategories: [],
  theme: "light",
};

export function usePreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const stored = localStorage.getItem("userPreferences");
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((current) => {
      const updated = { ...current, ...updates };
      localStorage.setItem("userPreferences", JSON.stringify(updated));
      return updated;
    });
  };

  const togglePreferredCategory = (category: string) => {
    setPreferences((current) => {
      const updated = {
        ...current,
        preferredCategories: current.preferredCategories.includes(category)
          ? current.preferredCategories.filter((c) => c !== category)
          : [...current.preferredCategories, category],
      };
      localStorage.setItem("userPreferences", JSON.stringify(updated));
      return updated;
    });
  };

  return {
    preferences,
    updatePreferences,
    togglePreferredCategory,
  };
}
