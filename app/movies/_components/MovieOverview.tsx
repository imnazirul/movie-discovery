import { Star } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import Link from "next/link";

const MovieOverview = ({
  movieDetails,
  crew,
}: {
  movieDetails: any;
  crew: any;
}) => {
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
  return (
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
        {movieDetails.genres.map((genre: any) => (
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
            {crew.map((member: any, index: number) => (
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {movieDetails.status}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(movieDetails.budget)}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
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
  );
};

export default MovieOverview;
