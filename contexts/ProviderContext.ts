"use client";
import { createContext, useContext } from "react";

export const ProviderContext = createContext({
  watchLater: [] as any[],
  recentlyViewed: [] as any[],
  toggleWatchLaterMovie: (e: any) => { },
  removeWatchLaterMovie: (e: any) => { },
  isInWatchLater: Boolean as any,
  clearAllWatchLater: () => { },
  removeRecentlyViewedMovie: (e: any) => { },
  addRecentlyViewedMovie: (e: any) => { },
  clearAllRecentlyViewed: () => { },
});

export const useProvider = () => useContext(ProviderContext);
