import axios from "axios";

export const baseURL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

const axiosApi = axios.create({
  baseURL: baseURL,
});

axiosApi.interceptors.request.use(async (config) => {
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export async function get(url: string, params = {}, config = {}) {
  try {
    const response = await axiosApi.get(url, { ...config, params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

