"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, ChevronLeft, Play } from "lucide-react";
import { get } from "@/helpers/api";

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

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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

    async function fetchMovies() {
      setIsLoadingMovies(true);
      try {
        const data = await get("/discover/movie", {
          with_genres: genreId,
          sort_by: "popularity.desc",
        });
        setMovies(data.results?.slice(0, 8) || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoadingMovies(false);
      }
    }
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Browse by Genre
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Explore movies across different genres
            </p>
          </div>
          {selectedGenre && (
            <Link
              href={`/genre/${selectedGenre.id}`}
              className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105"
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
                className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
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
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
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
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          No Image
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-semibold">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <p className="text-gray-300 text-xs line-clamp-2">
                        {movie.overview}
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
      </div>
    </section>
  );
};

export default MoviesByGenre;
