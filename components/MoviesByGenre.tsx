"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, ChevronLeft, Play } from "lucide-react";
import { get, TMDB_IMAGE_BASE } from "@/helpers/api";
import MovieCard from "./MovieCard";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

const MoviesByGenre = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [genreScrollPosition, setGenreScrollPosition] = useState(0);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await get("/genre/movie/list");
        setGenres(data.genres || []);
        if (data.genres?.length > 0) {
          setSelectedGenre(data.genres[0]);
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setIsLoadingGenres(false);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;

    const genreId = selectedGenre.id;

    const fetchMovies = async () => {
      setIsLoadingMovies(true);
      try {
        const data = await get("/discover/movie", {
          with_genres: genreId,
          sort_by: "popularity.desc",
        });
        setMovies(data.results?.slice(0, 8) || []);
      } catch (error) {
        //err
      } finally {
        setIsLoadingMovies(false);
      }
    };
    fetchMovies();
  }, [selectedGenre]);

  const scrollGenres = (direction: "left" | "right") => {
    const container = document.getElementById("genre-scroll-container");
    if (container) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setGenreScrollPosition(newPosition);
    }
  };

  if (isLoadingGenres) {
    return (
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />
          <div className="flex gap-3 mb-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse flex-shrink-0"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
    <section className="py-16 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Browse by Genre
            </h2>
            <p className="text-gray-600 max-sm:text-xs dark:text-gray-400 mt-1">
              Explore movies across different genres
            </p>
          </div>
          {selectedGenre && (
            <Link
              href={`/genre/${selectedGenre.id}`}
              className="group flex items-center gap-2 max-sm:text-xs px-3 text-center md:px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            >
              View All {selectedGenre.name}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div
          className="relative mb-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <button
            onClick={() => scrollGenres("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-900 shadow-lg rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>

          <div
            id="genre-scroll-container"
            className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {genres.map((genre, index) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre)}
                className={`px-5 py-2.5 rounded-full max-sm:text-xs font-medium text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  selectedGenre?.id === genre.id
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {genre.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollGenres("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-900 shadow-lg rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoadingMovies
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))
            : movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default MoviesByGenre;
