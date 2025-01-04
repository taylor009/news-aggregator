"use client";

import { usePreferences } from "@/lib/hooks/use-preferences";
import { useTheme } from "@/components/theme-provider";
import { Settings, Moon, Sun } from "lucide-react";

const PAGE_SIZES = [10, 12, 25, 50, 100];
const SORT_OPTIONS = [
  { value: "createdAt", label: "Date" },
  { value: "title", label: "Title" },
  { value: "source", label: "Source" },
];
const CATEGORIES = [
  "general",
  "business",
  "technology",
  "entertainment",
  "health",
  "science",
  "sports",
];

export default function SettingsPage() {
  const { preferences, updatePreferences, togglePreferredCategory } =
    usePreferences();
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Settings className="h-8 w-8 text-gray-900 dark:text-white" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>

      <div className="space-y-8">
        <section className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Display Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default items per page
              </label>
              <select
                value={preferences.defaultPageSize}
                onChange={(e) =>
                  updatePreferences({ defaultPageSize: Number(e.target.value) })
                }
                className="rounded-lg border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default sort by
              </label>
              <select
                value={preferences.defaultSortBy}
                onChange={(e) =>
                  updatePreferences({ defaultSortBy: e.target.value })
                }
                className="rounded-lg border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default sort order
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    value="DESC"
                    checked={preferences.defaultSortOrder === "DESC"}
                    onChange={(e) =>
                      updatePreferences({
                        defaultSortOrder: e.target.value as "DESC",
                      })
                    }
                    className="text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  Descending
                </label>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    value="ASC"
                    checked={preferences.defaultSortOrder === "ASC"}
                    onChange={(e) =>
                      updatePreferences({
                        defaultSortOrder: e.target.value as "ASC",
                      })
                    }
                    className="text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  Ascending
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                    theme === "light"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                    theme === "dark"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Preferred Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => togglePreferredCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                  preferences.preferredCategories.includes(category)
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
