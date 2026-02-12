"use client";

import { fetchTopRatedMovies } from "@/helpers/backend";
import { useFetch } from "@/helpers/hooks";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { TMDB_IMAGE_BASE } from "@/helpers/api";
import TopRatedMovieCard from "./TopRatedMovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

const TopRatedMovies = () => {
  const { data, isPending } = useFetch(
    ["top-rated-movies"],
    fetchTopRatedMovies,
  );

  const movies: Movie[] = data?.results?.slice(0, 6) || [];

  if (isPending) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded mt-2 animate-pulse" />
            </div>
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="opacity-0 animate-fade-in-up">
            <h2 className="text-xl  md:text-3xl font-bold text-gray-900 dark:text-white">
              Top Rated Movies
            </h2>
            <p className="text-gray-600 max-sm:text-xs dark:text-gray-400 mt-1">
              Highest rated movies of all time
            </p>
          </div>
          <Link
            href={`/movies?type=movies&value=toprated&page=1`}
            className="group max-sm:text-xs flex items-center gap-2 px-3 md:px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 opacity-0 animate-fade-in-up"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <TopRatedMovieCard key={index} index={index} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedMovies;
