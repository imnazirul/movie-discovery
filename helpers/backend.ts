import { get } from "./api";

export const fetchGenreList = () => get('/genre/movie/list')
export const fetchTopRatedMovies = () => get('/movie/top_rated')
export const fetchPopularMovies = () => get('/movie/popular')
export const fetchMoviesByGenre = (genreId: number) => get('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc' })