"use client";

import { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useFetch } from "@/helpers/hooks";
import { fetchSimilarMovies, fetchMovieDetails } from "@/helpers/backend";
import Image from "next/image";
import Link from "next/link";
import { Star, Film, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function SimilarMoviesContent({ movieId }: { movieId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1,
  );

  useEffect(() => {
    const newPage = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(newPage);
  }, [pageParam]);

  const { data: movieData } = useFetch(["movie-details", movieId], () =>
    fetchMovieDetails(movieId),
  );

  const { data, isPending } = useFetch(
    ["similar-movies", movieId, currentPage],
    () => fetchSimilarMovies(movieId, { page: currentPage }),
  );

  const movieDetails: MovieDetails | null = movieData || null;
  const movies: Movie[] = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);
  const totalResults = data?.total_results || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/movies/${movieId}/similar?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          href={`/movies/${movieId}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6 transition-colors opacity-0 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movie
        </Link>

        <div
          className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {movieDetails?.poster_path && (
            <div className="w-16 h-24 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
              <Image
                src={`${TMDB_IMAGE_BASE}${movieDetails.poster_path}`}
                alt={movieDetails.title || ""}
                width={64}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Similar Movies
            </h1>
            {movieDetails && (
              <p className="text-gray-600 dark:text-gray-400">
                Movies similar to{" "}
                <span className="text-primary font-medium">
                  {movieDetails.title}
                </span>
              </p>
            )}
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              {totalResults.toLocaleString()} movies found • Page {currentPage}{" "}
              of {totalPages}
            </p>
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
              No similar movies found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn&apos;t find any similar movies for this title.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${(index % 10) * 50 + 200}ms` }}
                >
                  <div className="aspect-[2/3] relative">
                    {movie.poster_path ? (
                      <Image
                        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                        <Film className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-semibold">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <p className="text-white text-xs line-clamp-3">
                        {movie.overview || "No description available."}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-2 mt-12 opacity-0 animate-fade-in-up"
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

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

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
      <SimilarMoviesContent movieId={id} />
    </Suspense>
  );
};

export default Page;
