import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useArticles } from "@/lib/hooks/use-articles";

interface ArticleListProps {
  category?: string;
}

export function ArticleList({ category }: ArticleListProps) {
  const { ref, inView } = useInView();
  const {
    articles,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles(category);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div data-testid="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!articles.length) {
    return <div>No articles found</div>;
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <article
          key={article.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-48 object-cover rounded mb-4"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg";
              }}
            />
          )}
          <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
          <p className="text-gray-600 mb-4">{article.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{article.source}</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </article>
      ))}
      {hasNextPage && (
        <div ref={ref} className="h-10">
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      )}
    </div>
  );
}
