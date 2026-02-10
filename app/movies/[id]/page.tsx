"use client";

import { use } from "react";
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
import {
  Star,
  Calendar,
  Clock,
  Play,
  ArrowLeft,
  ChevronRight,
  ImageIcon,
  Users,
  MessageSquare,
  Tv,
  Video,
  User,
  Quote,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

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
const TMDB_IMAGE_W200 = "https://image.tmdb.org/t/p/w200";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );

  const { data: movie, isPending: isLoadingMovie } = useFetch(
    ["movie-details", id],
    () => fetchMovieDetails(id),
  );

  const { data: imagesData } = useFetch(["movie-images", id], () =>
    fetchMovieImages(id),
  );

  const { data: similarData } = useFetch(["similar-movies", id], () =>
    fetchSimilarMovies(id),
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

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

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
          </div>

          <div className="flex-1 pt-0 md:pt-24">
            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {movieDetails.title}
              </h1>
              {movieDetails.tagline && (
                <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-4">
                  &quot;{movieDetails.tagline}&quot;
                </p>
              )}
            </div>

            <div
              className="flex flex-wrap items-center gap-4 mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {movieDetails.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  ({movieDetails.vote_count.toLocaleString()})
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {movieDetails.release_date
                    ? new Date(movieDetails.release_date).getFullYear()
                    : "N/A"}
                </span>
              </div>

              {movieDetails.runtime > 0 && (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatRuntime(movieDetails.runtime)}</span>
                </div>
              )}

              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full uppercase">
                {movieDetails.original_language}
              </span>
            </div>

            <div
              className="flex flex-wrap gap-2 mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              {movieDetails.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "250ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Overview
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movieDetails.overview || "No overview available."}
              </p>
            </div>

            {crew.length > 0 && (
              <div
                className="mt-6 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "280ms" }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {crew.map((member, index) => (
                    <div key={`${member.id}-${member.job}-${index}`}>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {member.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {member.job}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {movieDetails.status}
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Budget
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(movieDetails.budget)}
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Revenue
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(movieDetails.revenue)}
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Release Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {movieDetails.release_date
                    ? new Date(movieDetails.release_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {watchProviders &&
          (watchProviders.flatrate ||
            watchProviders.rent ||
            watchProviders.buy) && (
            <div
              className="mt-16 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "320ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Tv className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Where to Watch
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6">
                {watchProviders.flatrate &&
                  watchProviders.flatrate.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        Stream
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {watchProviders.flatrate.map((provider) => (
                          <div
                            key={provider.provider_id}
                            className="relative group"
                          >
                            <Image
                              src={`${TMDB_IMAGE_W200}${provider.logo_path}`}
                              alt={provider.provider_name}
                              width={50}
                              height={50}
                              className="rounded-lg shadow-md hover:scale-110 transition-transform"
                            />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {provider.provider_name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {watchProviders.rent && watchProviders.rent.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Rent
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.rent.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="relative group"
                        >
                          <Image
                            src={`${TMDB_IMAGE_W200}${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={50}
                            height={50}
                            className="rounded-lg shadow-md hover:scale-110 transition-transform"
                          />
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {provider.provider_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {watchProviders.buy && watchProviders.buy.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Buy
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.buy.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="relative group"
                        >
                          <Image
                            src={`${TMDB_IMAGE_W200}${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={50}
                            height={50}
                            className="rounded-lg shadow-md hover:scale-110 transition-transform"
                          />
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {provider.provider_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {watchProviders.link && (
                  <a
                    href={watchProviders.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    View all options on JustWatch
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

        {videos.length > 0 && (
          <div
            className="mt-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "340ms" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Video className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Videos
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform shadow-xl">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white text-sm font-medium line-clamp-1">
                      {video.name}
                    </p>
                    <p className="text-gray-300 text-xs">{video.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {cast.length > 0 && (
          <div
            className="mt-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "360ms" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Cast
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {cast.map((member) => (
                <div key={member.id} className="group text-center">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 bg-gray-200 dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-shadow">
                    {member.profile_path ? (
                      <Image
                        src={`${TMDB_IMAGE_W200}${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-xs line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-1">
                    {member.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div
            className="mt-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "380ms" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Images
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={`${TMDB_IMAGE_W500}${image.file_path}`}
                    alt={`${movieDetails.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div
            className="mt-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reviews
              </h2>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                      {review.author_details.avatar_path ? (
                        <Image
                          src={
                            review.author_details.avatar_path.startsWith(
                              "/http",
                            )
                              ? review.author_details.avatar_path.substring(1)
                              : `${TMDB_IMAGE_W200}${review.author_details.avatar_path}`
                          }
                          alt={review.author}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.author}
                        </p>
                        {review.author_details.rating && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 rounded-full">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {review.author_details.rating}
                            </span>
                          </div>
                        )}
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -left-2 -top-2 w-6 h-6 text-gray-200 dark:text-gray-700" />
                        <p
                          className={`text-gray-700 dark:text-gray-300 leading-relaxed pl-4 ${
                            !expandedReviews.has(review.id)
                              ? "line-clamp-3"
                              : ""
                          }`}
                        >
                          {review.content}
                        </p>
                        {review.content.length > 300 && (
                          <button
                            onClick={() => toggleReviewExpand(review.id)}
                            className="text-primary text-sm font-medium mt-2 hover:underline"
                          >
                            {expandedReviews.has(review.id)
                              ? "Show less"
                              : "Read more"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similarMovies.length > 0 && (
          <div
            className="mt-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "420ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Similar Movies
              </h2>
              <Link
                href={`/movies/${id}/similar`}
                className="group flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View All
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similarMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="aspect-[2/3] relative">
                    {movie.poster_path ? (
                      <Image
                        src={`${TMDB_IMAGE_W500}${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-semibold">
                        {movie.vote_average.toFixed(1)}
                      </span>
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
        )}
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
