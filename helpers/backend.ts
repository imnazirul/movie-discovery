import { get } from "./api";

export const fetchGenreList = () => get('/genre/movie/list')
export const fetchTopRatedMovies = () => get('/movie/top_rated')   