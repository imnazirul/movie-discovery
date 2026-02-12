"use client";

import Link from "next/link";
import { Bookmark, Trash2, ArrowLeft } from "lucide-react";
import WatchLaterMovieCard from "./_components/WatchLaterMovieCard";
import { useProvider } from "@/contexts/ProviderContext";

const WatchLaterPage = () => {
  const { watchLater, removeWatchLaterMovie, clearAllWatchLater } =
    useProvider();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-6 opacity-0 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "50ms" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-primary fill-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Watch Later
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {watchLater.length}{" "}
                {watchLater.length === 1 ? "movie" : "movies"} saved to watch
              </p>
            </div>
          </div>

          {watchLater.length > 0 && (
            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to clear your watch later list?",
                  )
                ) {
                  clearAllWatchLater();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {watchLater.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Bookmark className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your watch later list is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              Save movies you want to watch by clicking the bookmark icon on any
              movie. They will appear here for easy access.
            </p>
            <Link
              href="/movies"
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {watchLater.map((movie, index) => (
              <WatchLaterMovieCard
                key={index}
                movie={movie}
                index={index}
                removeMovie={removeWatchLaterMovie}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLaterPage;
