"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Film } from "lucide-react";
import { useFetch } from "@/helpers/hooks";
import { fetchGenreList, fetchMoviesByGenre } from "@/helpers/backend";
import { TMDB_IMAGE_BASE } from "@/helpers/api";
import MovieCard from "./MovieCard";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface GenreWithMovies extends Genre {
  movies: Movie[];
}

const PopularMoviesPerGenre = () => {
  const [genresWithMovies, setGenresWithMovies] = useState<GenreWithMovies[]>(
    [],
  );
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);

  const { data: genreData, isPending: isLoadingGenres } = useFetch(
    ["genre-list"],
    fetchGenreList,
  );

  const genres: Genre[] = genreData?.genres || [];

  useEffect(() => {
    if (genres.length === 0) return;

    async function fetchMoviesForGenres() {
      setIsLoadingMovies(true);
      const genresWithMoviesData: GenreWithMovies[] = [];

      for (const genre of genres.slice(0, 10)) {
        try {
          const moviesData = await fetchMoviesByGenre({
            with_genres: genre.id,
            sort_by: "popularity.desc",
            page: 1,
          });

          genresWithMoviesData.push({
            ...genre,
            movies: moviesData.results?.slice(0, 5) || [],
          });
        } catch (error) {
          console.error(`Failed to fetch movies for genre ${genre.name}`);
        }
      }

      setGenresWithMovies(genresWithMoviesData);
      setIsLoadingMovies(false);
    }

    fetchMoviesForGenres();
  }, [genres]);

  const isLoading = isLoadingGenres || isLoadingMovies;

  if (isLoading && genresWithMovies.length === 0) {
    return (
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto space-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 opacity-0 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Popular Movies by Genre
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore top movies across different genres
          </p>
        </div>

        <div className="space-y-14">
          {genresWithMovies.map((genre, genreIndex) => (
            <div
              key={genre.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${genreIndex * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {genre.name}
                  </h3>
                </div>
                <Link
                  href={`/genre/${genre.id}`}
                  className="group flex items-center gap-2 px-4 py-2 text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors"
                >
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {genre.movies.map((movie, movieIndex) => (
                  <MovieCard movie={movie} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex justify-center mt-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <Link
            href="/genre"
            className="group flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg shadow-primary/30"
          >
            Browse All Genres
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularMoviesPerGenre;
