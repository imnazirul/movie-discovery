import { TMDB_IMAGE_BASE } from "@/helpers/api";
import { Bookmark, Film, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";
import { useProvider } from "@/contexts/ProviderContext";

const MovieCard = ({ movie, index }: { movie: any; index?: number }) => {
  const { toggleWatchLaterMovie, isInWatchLater } = useProvider();

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300  hover:-translate-y-2"
      style={index || index == 0 ? { animationDelay: `${index * 100}ms` } : {}}
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="aspect-[2/3] overflow-hidden relative">
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
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-white text-xs line-clamp-3">
              {movie.overview || "No description available."}
            </p>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-gray-800">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </p>
        </div>
      </Link>
      <Button
        className="absolute top-0 size-7 z-100 left-0"
        onClick={(e) => {
          e.stopPropagation();
          toggleWatchLaterMovie(movie);
        }}
      >
        <Bookmark
          className={`w-7 h-7 ${isInWatchLater(movie.id) ? "fill-primary" : ""} text-white`}
        />
      </Button>
    </div>
  );
};

export default MovieCard;
