"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePreferences } from "@/lib/hooks/use-preferences";

type Theme = "light" | "dark";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "light",
  setTheme: () => null,
});

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { preferences, updatePreferences } = usePreferences();
  const [theme, setTheme] = useState<Theme>(preferences.theme);
  const [mounted, setMounted] = useState(false);

  // Handle initial theme setup
  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = preferences.theme;

    // Apply the theme class
    root.classList.remove("light", "dark");
    root.classList.add(initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, [preferences.theme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      setTheme(newTheme);
      updatePreferences({ theme: newTheme });
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [updatePreferences]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      setTheme(newTheme);
      updatePreferences({ theme: newTheme });
    },
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
