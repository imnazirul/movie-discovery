"use client";

import { fetchPopularMovies } from "@/helpers/backend";
import { useFetch } from "@/helpers/hooks";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, ChevronLeft, TrendingUp } from "lucide-react";
import { useRef } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  popularity: number;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w780";

const PopularMovies = () => {
  const { data, isPending } = useFetch(["popular-movies"], fetchPopularMovies);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const movies: Movie[] = data?.results?.slice(0, 10) || [];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  if (isPending) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded mt-2 animate-pulse" />
            </div>
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-72 flex-shrink-0 aspect-[16/9] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 md:py-16  px-4 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex max-md:flex-col  items-center justify-between mb-10">
          <div className="opacity-0 max-md:mb-4 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Popular Right Now
              </h2>
            </div>
            <p className="text-gray-600 max-sm:text-xs dark:text-gray-400">
              Trending movies everyone is watching
            </p>
          </div>
          <div className="flex items-center gap-3 opacity-0 animate-fade-in-up">
            <button
              onClick={() => scroll("left")}
              className="p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <Link
              href={`/movies?type=movies&value=popular&page=1`}
              className="group flex max-sm:text-xs items-center gap-2 px-3 md:px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 ml-2"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group relative flex-shrink-0 w-72 md:w-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/10] relative">
                {movie.backdrop_path ? (
                  <Image
                    src={`${TMDB_IMAGE_BASE}${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : movie.poster_path ? (
                  <Image
                    src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      No Image
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center justify-center w-10 h-10 bg-primary text-white font-bold text-lg rounded-full shadow-lg">
                  {index + 1}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-white text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <span>
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "N/A"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {movie.popularity.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularMovies;
