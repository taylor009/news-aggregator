/** @jest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react";
import { useArticles } from "./use-articles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Article } from "@/types";
import React from "react";

describe("useArticles", () => {
  const mockArticle: Article = {
    id: 1,
    title: "Test Article 1",
    description: "Test Description 1",
    content: "Test Content 1",
    url: "http://test1.com",
    urlToImage: "http://test1.com/image.jpg",
    publishedAt: new Date(),
    source: "Test Source 1",
    category: "technology",
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it("fetches articles successfully", async () => {
    const mockResponse = {
      data: [mockArticle],
      hasNextPage: true,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useArticles(), {
      wrapper: Wrapper,
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.articles).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.articles).toEqual([mockArticle]);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to fetch");
    (global.fetch as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useArticles(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.articles).toEqual([]);
  });

  it("fetches next page successfully", async () => {
    const page1 = [mockArticle];
    const page2 = [{ ...mockArticle, id: 2 }];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: page1, hasNextPage: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: page2, hasNextPage: false }),
      });

    const { result } = renderHook(() => useArticles(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.articles).toEqual(page1);
    });

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.articles).toEqual([...page1, ...page2]);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  it("filters articles by category", async () => {
    const articles = [
      { ...mockArticle, category: "technology" },
      { ...mockArticle, id: 2, category: "business" },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: articles, hasNextPage: false }),
    });

    const { result } = renderHook(() => useArticles("technology"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.articles).toEqual([articles[0]]);
    });
  });

  it("handles empty response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [], hasNextPage: false }),
    });

    const { result } = renderHook(() => useArticles(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.articles).toEqual([]);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  it("handles invalid response format", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ invalid: "format" }),
    });

    const { result } = renderHook(() => useArticles(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
