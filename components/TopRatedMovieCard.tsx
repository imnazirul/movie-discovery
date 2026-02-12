import { TMDB_IMAGE_BASE } from "@/helpers/api";
import { useWatchLater } from "@/helpers/useLocalStorage";
import { Bookmark, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";

const TopRatedMovieCard = ({ movie, index }: { movie: any; index: number }) => {
  const { toggleMovie: toggleWatchLater, isInWatchLater } = useWatchLater();
  return (
    <div
      key={movie.id}
      className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="aspect-[2/3] relative">
          {movie.poster_path ? (
            <Image
              src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                No Image
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs line-clamp-3 mb-2">
              {movie.overview}
            </p>
            <span className="text-primary text-xs font-medium">
              Click to view details
            </span>
          </div>
        </div>
      </Link>
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
      <Button
        className="absolute top-0 size-7 z-100 -left-2"
        onClick={(e) => {
          console.log("hello");
          e.preventDefault();
          e.stopPropagation();
          toggleWatchLater(movie);
        }}
      >
        <Bookmark
          className={`w-7 h-7 ${isInWatchLater(movie.id) ? "fill-primary" : ""} text-white`}
        />
      </Button>
    </div>
  );
};

export default TopRatedMovieCard;
