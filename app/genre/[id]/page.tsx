"use client";

import { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useFetch } from "@/helpers/hooks";
import { fetchMoviesByGenre, fetchGenreList } from "@/helpers/backend";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Film,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useIsMobile } from "@/lib/use-mobile";
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

interface Genre {
  id: number;
  name: string;
}

export function GenreMoviesContent({ genreId }: { genreId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const sortParam = searchParams.get("sort") || "popularity.desc";
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1,
  );

  useEffect(() => {
    const newPage = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(newPage);
  }, [pageParam]);
  const isMobile = useIsMobile();
  const { data: genreData } = useFetch(["genre-list"], fetchGenreList);

  const { data, isPending } = useFetch(
    ["movies-by-genre", genreId, currentPage, sortParam],
    () =>
      fetchMoviesByGenre({
        with_genres: genreId,
        page: currentPage,
        sort_by: sortParam,
      }),
  );

  const genres: Genre[] = genreData?.genres || [];
  const currentGenre = genres.find((g) => g.id === parseInt(genreId));
  const movies: Movie[] = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);
  const totalResults = data?.total_results || 0;

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "release_date.desc", label: "Release date" },
    // { value: "release_date.asc", label: "Oldest First" },
    { value: "title.asc", label: "Title" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/genre/${genreId}?page=${page}&sort=${sortParam}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    router.push(`/genre/${genreId}?page=1&sort=${newSort}`);
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

        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Tag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {currentGenre?.name || "Genre"} Movies
              </h1>
              <p className="text-gray-600 max-sm:text-sm dark:text-gray-400">
                {totalResults.toLocaleString()} movies found • Page{" "}
                {currentPage} of {totalPages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={sortParam}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-md cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 12).map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}?page=1&sort=${sortParam}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  genre.id === parseInt(genreId)
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md"
                }`}
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

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
              No movies available in this genre.
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
                className="flex max-sm:flex-wrap items-center justify-center gap-2 mt-12 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 md:px-4 px-2 py-2 rounded-lg font-medium transition-all duration-200 ${
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

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />
            <div className="flex gap-2 mb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"
                />
              ))}
            </div>
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
      <GenreMoviesContent genreId={id} />
    </Suspense>
  );
};

export default Page;
