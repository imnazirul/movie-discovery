import { get } from "./api";

export const fetchGenreList = () => get('/genre/movie/list')