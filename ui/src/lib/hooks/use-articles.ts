import { useInfiniteQuery } from "@tanstack/react-query";
import { Article } from "@/types";

interface ArticlesResponse {
  data: Article[];
  hasNextPage: boolean;
}

export function useArticles(category?: string) {
  const fetchArticles = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: "10",
      ...(category && { category }),
    });

    const response = await fetch(`/api/articles?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format");
    }

    return {
      data: category
        ? data.data.filter((article: Article) => article.category === category)
        : data.data,
      hasNextPage: data.hasNextPage,
    } as ArticlesResponse;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["articles", category],
    queryFn: fetchArticles,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });

  const articles = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    articles,
    error,
    isLoading: status === "pending",
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
  };
}
