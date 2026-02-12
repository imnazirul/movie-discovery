"use client";

import { use, useEffect } from "react";
import {
  fetchMovieDetails,
  fetchMovieImages,
  fetchSimilarMovies,
  fetchMovieCredits,
  fetchMovieReviews,
  fetchMovieWatchProviders,
  fetchMovieVideos,
} from "@/helpers/backend";
import { useFetch } from "@/helpers/hooks";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, ChevronRight, Bookmark } from "lucide-react";
import { useState } from "react";
import { useProvider } from "@/contexts/ProviderContext";
import MovieOverview from "../_components/MovieOverview";
import WatchProviders from "../_components/WatchProviders";
import DetailedOverview from "../_components/DetailedOverview";

interface Genre {
  id: number;
  name: string;
}

interface MovieDetails {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
  status: string;
  budget: number;
  revenue: number;
  original_language: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

interface MovieImage {
  file_path: string;
  aspect_ratio: number;
  width: number;
  height: number;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
}

interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProviderData {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

interface VideoData {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const TMDB_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const { toggleWatchLaterMovie, isInWatchLater, addRecentlyViewedMovie } =
    useProvider();

  const { data: movie, isPending: isLoadingMovie } = useFetch(
    ["movie-details", id],
    () => fetchMovieDetails(id),
  );

  useEffect(() => {
    if (movie) {
      addRecentlyViewedMovie({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      });
    }
  }, [movie]);

  const { data: imagesData } = useFetch(["movie-images", id], () =>
    fetchMovieImages(id),
  );

  const { data: similarData } = useFetch(["similar-movies", id], () =>
    fetchSimilarMovies(id, { sort_by: "popularity.desc" }),
  );

  const { data: creditsData } = useFetch(["movie-credits", id], () =>
    fetchMovieCredits(id),
  );

  const { data: reviewsData } = useFetch(["movie-reviews", id], () =>
    fetchMovieReviews(id),
  );

  const { data: providersData } = useFetch(["movie-providers", id], () =>
    fetchMovieWatchProviders(id),
  );

  const { data: videosData } = useFetch(["movie-videos", id], () =>
    fetchMovieVideos(id),
  );

  const movieDetails: MovieDetails | null = movie || null;
  const images: MovieImage[] = imagesData?.backdrops?.slice(0, 8) || [];
  const similarMovies: SimilarMovie[] = similarData?.results?.slice(0, 6) || [];
  const cast: CastMember[] = creditsData?.cast?.slice(0, 10) || [];
  const crew: CrewMember[] =
    creditsData?.crew
      ?.filter((c: CrewMember) =>
        ["Director", "Writer", "Screenplay", "Producer"].includes(c.job),
      )
      .slice(0, 6) || [];
  const reviews: Review[] = reviewsData?.results?.slice(0, 3) || [];
  const watchProviders: WatchProviderData | null =
    providersData?.results?.US || null;
  const videos: VideoData[] =
    videosData?.results
      ?.filter(
        (v: VideoData) =>
          v.site === "YouTube" &&
          ["Trailer", "Teaser", "Clip", "Featurette"].includes(v.type),
      )
      .slice(0, 4) || [];

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <div className="relative h-[60vh] bg-gray-300 dark:bg-gray-800 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-64 h-96 bg-gray-300 dark:bg-gray-800 rounded-2xl animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-4 pt-8">
              <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-32 bg-gray-300 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Movie not found
          </h1>
          <Link href="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const mainTrailer = videos.find((v) => v.type === "Trailer") || videos[0];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="relative h-[60vh] overflow-hidden">
        {movieDetails.backdrop_path ? (
          <Image
            src={`${TMDB_IMAGE_BASE}${movieDetails.backdrop_path}`}
            alt={movieDetails.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/80 dark:from-gray-950/80 via-transparent to-transparent" />

        <Link
          href="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors opacity-0 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-48 md:-mt-64 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0 opacity-0 animate-fade-in-up">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
              {movieDetails.poster_path ? (
                <Image
                  src={`${TMDB_IMAGE_W500}${movieDetails.poster_path}`}
                  alt={movieDetails.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {mainTrailer && (
              <button
                onClick={() => setSelectedVideo(mainTrailer)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg shadow-primary/30"
              >
                <Play className="w-5 h-5 fill-white" />
                Watch Trailer
              </button>
            )}

            <button
              onClick={() =>
                toggleWatchLaterMovie({
                  id: movieDetails.id,
                  title: movieDetails.title,
                  poster_path: movieDetails.poster_path,
                  vote_average: movieDetails.vote_average,
                  release_date: movieDetails.release_date,
                  overview: movieDetails.overview,
                })
              }
              className={`w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isInWatchLater(movieDetails.id)
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${isInWatchLater(movieDetails.id) ? "fill-primary" : ""}`}
              />
              {isInWatchLater(movieDetails.id) ? "Watch Later" : "Watch Later"}
            </button>
          </div>

          <MovieOverview crew={crew} movieDetails={movieDetails} />
        </div>

        <WatchProviders watchProviders={watchProviders} />
        <DetailedOverview
          cast={cast}
          images={images}
          reviews={reviews}
          similarMovies={similarMovies}
          movieDetails={movieDetails}
          setSelectedVideo={setSelectedVideo}
          setSelectedImageIndex={setSelectedImageIndex}
          videos={videos}
        />
      </div>

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setSelectedImageIndex(null)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="relative w-full max-w-5xl aspect-video">
            <Image
              src={`${TMDB_IMAGE_BASE}${images[selectedImageIndex].file_path}`}
              alt={`${movieDetails.title} - Full Image`}
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute left-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev !== null
                  ? prev === 0
                    ? images.length - 1
                    : prev - 1
                  : null,
              );
            }}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev !== null
                  ? prev === images.length - 1
                    ? 0
                    : prev + 1
                  : null,
              );
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
            onClick={() => setSelectedVideo(null)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
              title={selectedVideo.name}
              className="w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
