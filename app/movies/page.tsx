"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useFetch } from "@/helpers/hooks";
import {
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchDiscoverMovies,
  searchMovies,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
} from "@/helpers/backend";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Search,
  X,
  Film,
  TrendingUp,
  Clock,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TMDB_IMAGE_BASE } from "@/helpers/api";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

function MoviesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryType = searchParams.get("type");
  const queryValue = searchParams.get("value");
  const showSearch = searchParams.get("search");
  const pageParam = searchParams.get("page");

  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1,
  );
  const [searchQuery, setSearchQuery] = useState(
    queryType === "search" ? queryValue || "" : "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const newPage = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(newPage);
  }, [pageParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getQueryKey = () => {
    if (queryType === "search" && queryValue) {
      return ["search-movies", queryValue, currentPage];
    }
    if (queryType === "movies") {
      switch (queryValue) {
        case "toprated":
          return ["top-rated-movies-all", currentPage];
        case "popular":
          return ["popular-movies-all", currentPage];
        case "nowplaying":
          return ["now-playing-movies", currentPage];
        case "upcoming":
          return ["upcoming-movies", currentPage];
        default:
          return ["discover-movies", currentPage];
      }
    }
    if (debouncedSearch && showSearch === "true") {
      return ["search-movies", debouncedSearch, currentPage];
    }
    return ["discover-movies", currentPage];
  };

  const getQueryFn = () => {
    if (queryType === "search" && queryValue) {
      return () => searchMovies({ query: queryValue, page: currentPage });
    }
    if (queryType === "movies") {
      switch (queryValue) {
        case "toprated":
          return () => fetchTopRatedMovies({ page: currentPage });
        case "popular":
          return () => fetchPopularMovies({ page: currentPage });
        case "nowplaying":
          return () => fetchNowPlayingMovies({ page: currentPage });
        case "upcoming":
          return () => fetchUpcomingMovies({ page: currentPage });
        default:
          return () => fetchDiscoverMovies({ page: currentPage });
      }
    }
    if (debouncedSearch && showSearch === "true") {
      return () => searchMovies({ query: debouncedSearch, page: currentPage });
    }
    return () => fetchDiscoverMovies({ page: currentPage });
  };

  const getPageTitle = () => {
    if (queryType === "search" && queryValue) {
      return `Search Results for "${queryValue}"`;
    }
    if (queryType === "movies") {
      switch (queryValue) {
        case "toprated":
          return "Top Rated Movies";
        case "popular":
          return "Popular Movies";
        case "nowplaying":
          return "Now Playing";
        case "upcoming":
          return "Upcoming Movies";
        default:
          return "Discover Movies";
      }
    }
    if (debouncedSearch && showSearch === "true") {
      return `Search Results for "${debouncedSearch}"`;
    }
    return "Discover Movies";
  };

  const getPageIcon = () => {
    if (queryType === "movies") {
      switch (queryValue) {
        case "toprated":
          return <Star className="w-6 h-6 text-yellow-500" />;
        case "popular":
          return <TrendingUp className="w-6 h-6 text-red-500" />;
        case "nowplaying":
          return <Clock className="w-6 h-6 text-green-500" />;
        case "upcoming":
          return <Calendar className="w-6 h-6 text-blue-500" />;
        default:
          return <Film className="w-6 h-6 text-primary" />;
      }
    }
    if (queryType === "search" || (showSearch === "true" && debouncedSearch)) {
      return <Search className="w-6 h-6 text-primary" />;
    }
    return <Film className="w-6 h-6 text-primary" />;
  };

  const { data, isPending } = useFetch(getQueryKey(), getQueryFn());

  const movies: Movie[] = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500); // TMDB limits to 500 pages
  const totalResults = data?.total_results || 0;

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (queryType) params.set("type", queryType);
    if (queryValue) params.set("value", queryValue);
    if (showSearch) params.set("search", showSearch);
    params.set("page", page.toString());
    return `/movies?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(buildPageUrl(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/movies?type=search&value=${encodeURIComponent(searchQuery)}&search=true&page=1`,
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    router.push("/movies?search=true");
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6 transition-colors opacity-0 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {showSearch === "true" && (
          <div
            className="mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "50ms" }}
          >
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full px-5 py-4 pl-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg text-lg"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </form>
          </div>
        )}

        <div
          className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
            {getPageIcon()}
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 max-sm:text-sm dark:text-gray-400">
              {totalResults.toLocaleString()} movies found • Page {currentPage}{" "}
              of {totalPages}
            </p>
          </div>
        </div>

        {queryType === "movies" && (
          <div
            className="flex flex-wrap gap-3 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            {[
              { value: "popular", label: "Popular", icon: TrendingUp },
              { value: "toprated", label: "Top Rated", icon: Star },
              { value: "nowplaying", label: "Now Playing", icon: Clock },
              { value: "upcoming", label: "Upcoming", icon: Calendar },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={`/movies?type=movies&value=${tab.value}&page=1`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  queryValue === tab.value
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            ))}
          </div>
        )}

        {isPending ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No movies found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {queryType === "search"
                ? "Try a different search term"
                : "No movies available"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <MovieCard movie={movie} index={index} key={movie.id} />
              ))}
            </div>

            {totalPages > 1 && (
              <div
                className="flex items-center flex-wrap justify-center gap-2 mt-12 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          page === currentPage
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md"
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span
                        key={index}
                        className="w-10 h-10 flex items-center justify-center text-gray-400"
                      >
                        {page}
                      </span>
                    ),
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
};

export default Page;
