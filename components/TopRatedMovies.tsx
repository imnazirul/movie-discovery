'use client'

import { fetchTopRatedMovies } from "@/helpers/backend"
import { useFetch } from "@/helpers/hooks"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronRight } from "lucide-react"

interface Movie {
    id: number
    title: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    release_date: string
    overview: string
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

const TopRatedMovies = () => {
    const { data, isPending } = useFetch(['top-rated-movies'], fetchTopRatedMovies)

    const movies: Movie[] = data?.results?.slice(0, 6) || []

    if (isPending) {
        return (
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded mt-2 animate-pulse" />
                        </div>
                        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">

                <div className="flex items-center justify-between mb-10">
                    <div className="opacity-0 animate-fade-in-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Top Rated Movies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Highest rated movies of all time
                        </p>
                    </div>
                    <Link
                        href="/top-rated"
                        className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 opacity-0 animate-fade-in-up"
                    >
                        View All
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {movies.map((movie, index) => (
                        <Link
                            key={movie.id}
                            href={`/movie/${movie.id}`}
                            className="group relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >

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
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
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
                                        Click to view details →
                                    </span>
                                </div>
                            </div>


                            <div className="p-3 bg-white dark:bg-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                    {movie.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TopRatedMovies
