// components/Provider.tsx
"use client";
import { ProviderContext } from "@/contexts/ProviderContext";
import { useCallback, useEffect, useState } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storedWatchLater = localStorage.getItem("movzen_watch_later");
      if (storedWatchLater) {
        setWatchLater(JSON.parse(storedWatchLater));
      }
      const storedRecentlyViewed = localStorage.getItem(
        "movzen_recently_viewed",
      );
      if (storedRecentlyViewed) {
        setRecentlyViewed(JSON.parse(storedRecentlyViewed));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  //recently viewed
  const UpdateRecentlyViewedLocalStorage = (movies: any) => {
    localStorage.setItem("movzen_recently_viewed", JSON.stringify(movies));
  };

  const addRecentlyViewedMovie = (movie: any) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);

      const updated = [{ ...movie, addedAt: Date.now() }, ...filtered];

      return updated.slice(0, 100);
    });
    UpdateRecentlyViewedLocalStorage(recentlyViewed);
  };

  const removeRecentlyViewedMovie = (movieId: number) => {
    setRecentlyViewed((prev) => prev.filter((m) => m.id !== movieId));
    UpdateRecentlyViewedLocalStorage(recentlyViewed);
  };

  const clearAllRecentlyViewed = () => {
    setRecentlyViewed([]);
    UpdateRecentlyViewedLocalStorage(recentlyViewed);
  };

  // watch later functions
  const removeWatchLaterMovie = (movieId: number) => {
    setWatchLater((prev) => prev.filter((m) => m.id !== movieId));
  };

  const updateWatchLaterLocalStorage = (movies: any) => {
    localStorage.setItem("movzen_watch_later", JSON.stringify(movies));
  };

  const toggleWatchLaterMovie = (movie: any) => {
    const exists = watchLater?.find((m) => m.id === movie.id);
    if (exists) {
      const moviesList = watchLater?.filter((m) => m.id !== movie.id);
      setWatchLater(moviesList);
      updateWatchLaterLocalStorage(moviesList);
    } else {
      const moviesList = [...watchLater, { ...movie, addedAt: Date.now() }];
      setWatchLater(moviesList);
      updateWatchLaterLocalStorage(moviesList);
    }
  };

  const isInWatchLater = useCallback(
    (movieId: number) => {
      return watchLater.find((m) => m.id === movieId) ? true : false;
    },
    [watchLater],
  );

  const clearAllWatchLater = () => {
    setWatchLater([]);
    updateWatchLaterLocalStorage([]);
  };

  return (
    <ProviderContext.Provider
      value={{
        addRecentlyViewedMovie,
        clearAllRecentlyViewed,
        removeRecentlyViewedMovie,
        watchLater,
        recentlyViewed,
        toggleWatchLaterMovie,
        removeWatchLaterMovie,
        isInWatchLater,
        clearAllWatchLater,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export default Provider;
