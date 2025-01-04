import { render, screen } from "@testing-library/react";
import { ArticleList } from "./article-list";
import { useArticles } from "@/lib/hooks/use-articles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the useArticles hook
jest.mock("@/lib/hooks/use-articles");

describe("ArticleList", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state", () => {
    (useArticles as jest.Mock).mockReturnValue({
      articles: [],
      error: null,
      isLoading: true,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ArticleList />, { wrapper });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays error message", () => {
    const error = new Error("Failed to fetch articles");
    (useArticles as jest.Mock).mockReturnValue({
      articles: [],
      error,
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ArticleList />, { wrapper });

    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it("displays no articles message when empty", () => {
    (useArticles as jest.Mock).mockReturnValue({
      articles: [],
      error: null,
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ArticleList />, { wrapper });

    expect(screen.getByText("No articles found")).toBeInTheDocument();
  });

  it("displays articles", () => {
    const mockArticles = [
      {
        id: 1,
        title: "Test Article",
        description: "Test Description",
        content: "Test Content",
        url: "http://test.com",
        urlToImage: "http://test.com/image.jpg",
        publishedAt: new Date(),
        source: "Test Source",
        category: "technology",
      },
    ];

    (useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      error: null,
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ArticleList />, { wrapper });

    expect(screen.getByText(mockArticles[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockArticles[0].description)).toBeInTheDocument();
    expect(screen.getByText(mockArticles[0].source)).toBeInTheDocument();
  });

  it("displays loading more indicator", () => {
    const mockArticles = [
      {
        id: 1,
        title: "Test Article",
        description: "Test Description",
        content: "Test Content",
        url: "http://test.com",
        urlToImage: "http://test.com/image.jpg",
        publishedAt: new Date(),
        source: "Test Source",
        category: "technology",
      },
    ];

    (useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      error: null,
      isLoading: false,
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage: jest.fn(),
    });

    render(<ArticleList />, { wrapper });

    expect(screen.getByText("Loading more...")).toBeInTheDocument();
  });
});
