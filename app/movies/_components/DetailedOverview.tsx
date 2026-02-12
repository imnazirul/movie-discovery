import {
  Video,
  Users,
  ImageIcon,
  MessageSquare,
  Star,
  Quote,
  ChevronRight,
  User,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const TMDB_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
const TMDB_IMAGE_W200 = "https://image.tmdb.org/t/p/w200";

const DetailedOverview = ({
  setSelectedVideo,
  setSelectedImageIndex,
  videos,
  cast,
  images,
  reviews,
  similarMovies,
  movieDetails,
}: {
  setSelectedVideo: (video: any) => void;
  videos: any;
  setSelectedImageIndex: (index: number) => void;
  cast: any;
  images: any;
  reviews: any;
  similarMovies: any;
  movieDetails: any;
}) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );
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

  return (
    <>
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
            {videos.map((video: any) => (
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
            {cast.map((member: any) => (
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
            {images.map((image: any, index: number) => (
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
            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
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
                      <div className="flex flex-col  gap-1 ">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.author}
                        </p>
                        <p className="flex items-center gap-2 mb-1">
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
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -left-2 -top-2 w-4 h-4 text-gray-200 dark:text-gray-700" />
                      <p
                        className={`text-gray-700 dark:text-gray-300 text-sm  leading-relaxed pl-4 ${
                          !expandedReviews.has(review.id) ? "line-clamp-3" : ""
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
              href={`/movies/${movieDetails.id}/similar`}
              className="group flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarMovies.map((movie: any) => (
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
    </>
  );
};

export default DetailedOverview;
