"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { get } from "@/helpers/api";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  backdrop_path: string | null;
  poster_path: string | null;
}

interface GenreWithImage extends Genre {
  backdropUrl: string;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

export default function HeroSlider() {
  const [genres, setGenres] = useState<GenreWithImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function fetchGenresWithImages() {
      try {
        const genreData = await get("/genre/movie/list");
        const genresWithImages: GenreWithImage[] = [];

        for (const genre of genreData.genres) {
          try {
            const moviesData = await get("/discover/movie", {
              with_genres: genre.id,
              sort_by: "popularity.desc",
              page: 1,
            });

            const movieWithBackdrop = moviesData.results?.find(
              (movie: Movie) => movie.backdrop_path,
            );

            if (movieWithBackdrop) {
              genresWithImages.push({
                ...genre,
                backdropUrl: `${TMDB_IMAGE_BASE}${movieWithBackdrop.backdrop_path}`,
              });
            }
          } catch (error) {
            //err
          }
        }

        setGenres(genresWithImages);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }

    fetchGenresWithImages();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning],
  );

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? genres.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, genres.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === genres.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, genres.length, goToSlide]);

  useEffect(() => {
    if (genres.length === 0) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [genres.length, goToNext]);

  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </section>
    );
  }

  if (genres.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      {genres.map((genre, index) => (
        <div
          key={genre.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={genre.backdropUrl}
            alt={genre.name}
            fill
            className="object-cover"
            priority={index === 0}
          />

          <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent" />
        </div>
      ))}

      <div className="relative h-full flex items-center justify-center z-10 pt-16">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="relative flex items-center justify-center">
            <button
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 z-20 p-2 md:p-3 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-white/20 text-white hover:bg-white/30 dark:hover:bg-black/50 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Previous genre"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="flex items-center justify-center gap-3 md:gap-5 overflow-hidden px-14 md:px-20">
              {genres.map((genre, index) => {
                const distance = Math.abs(index - currentIndex);
                const isActive = index === currentIndex;
                const isVisible = distance <= 2;

                if (!isVisible) return null;

                return (
                  <button
                    key={genre.id}
                    onClick={() => goToSlide(index)}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-500 flex-shrink-0 shadow-2xl ${
                      isActive
                        ? "w-52 h-36 md:w-72 md:h-48 scale-100 z-10"
                        : distance === 1
                          ? "w-36 h-28 md:w-48 md:h-36 scale-95 opacity-70"
                          : "w-28 h-22 md:w-36 md:h-28 scale-85 opacity-40"
                    }`}
                  >
                    <Image
                      src={genre.backdropUrl}
                      alt={genre.name}
                      fill
                      className="object-cover"
                    />

                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                          : "bg-black/50 dark:bg-black/60"
                      }`}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`font-bold text-white text-center px-3 drop-shadow-lg transition-all duration-500 ${
                          isActive
                            ? "text-xl md:text-3xl"
                            : "text-sm md:text-base"
                        }`}
                      >
                        {genre.name}
                      </span>
                    </div>

                    {isActive && (
                      <div className="absolute inset-0 border-3 border-primary rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 z-20 p-2 md:p-3 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-white/20 text-white hover:bg-white/30 dark:hover:bg-black/50 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Next genre"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            {genres.map((genre, index) => (
              <button
                key={genre.id}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-10 h-2.5 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to ${genre.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
