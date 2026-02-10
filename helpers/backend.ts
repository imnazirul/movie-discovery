import { get } from "./api";

export const fetchGenreList = () => get('/genre/movie/list')
export const fetchTopRatedMovies = () => get('/movie/top_rated')
export const fetchPopularMovies = () => get('/movie/popular')
export const fetchMoviesByGenre = (genreId: number) => get('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc' })
export const fetchMovieDetails = (movieId: string) => get(`/movie/${movieId}`)
export const fetchMovieImages = (movieId: string) => get(`/movie/${movieId}/images`)
export const fetchSimilarMovies = (movieId: string) => get(`/movie/${movieId}/similar`)
export const fetchMovieCredits = (movieId: string) => get(`/movie/${movieId}/credits`)
export const fetchMovieReleaseDates = (movieId: string) => get(`/movie/${movieId}/release_dates`)
export const fetchMovieReviews = (movieId: string) => get(`/movie/${movieId}/reviews`)
export const fetchMovieWatchProviders = (movieId: string) => get(`/movie/${movieId}/watch/providers`)
export const fetchMovieVideos = (movieId: string) => get(`/movie/${movieId}/videos`)