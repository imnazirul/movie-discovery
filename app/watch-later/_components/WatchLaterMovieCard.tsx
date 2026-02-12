import { TMDB_IMAGE_BASE } from "@/helpers/api";
import { Bookmark, Clock, Film, Star, X } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

const WatchLaterMovieCard = ({
  removeMovie,
  movie,
  index,
}: {
  removeMovie: any;
  movie: any;
  index: number;
}) => {
  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${100 + index * 50}ms` }}
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
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
              {movie?.vote_average?.toFixed(1)}
            </span>
          </div>

          <div className="absolute top-2 left-2">
            <Bookmark className="w-5 h-5 text-primary fill-primary drop-shadow-lg" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-white text-xs line-clamp-3">
              {movie.overview || "No description available."}
            </p>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          removeMovie(movie.id);
        }}
        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 z-10 translate-x-8 group-hover:translate-x-0"
        title="Remove from watch later"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="p-3 bg-white dark:bg-gray-800">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {moment(movie.addedAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WatchLaterMovieCard;
