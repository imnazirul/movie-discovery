'use client'

import { useState, useEffect, useCallback } from 'react'

export interface StoredMovie {
    id: number
    title: string
    poster_path: string | null
    vote_average: number
    release_date: string
    overview?: string
    addedAt: number
}




export const useRecentlyViewed = () => {
    const [movies, setMovies] = useState<StoredMovie[]>([])
    const [isLoaded, setIsLoaded] = useState(false)


    useEffect(() => {
        try {
            const stored = localStorage.getItem('movzen_recently_viewed')
            if (stored) {
                setMovies(JSON.parse(stored))
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoaded(true)
    }, [])


    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('movzen_recently_viewed', JSON.stringify(movies))
            } catch (error) {
                console.error(error)
            }
        }
    }, [movies, isLoaded])

    const addMovie = useCallback((movie: Omit<StoredMovie, 'addedAt'>) => {
        setMovies(prev => {

            const filtered = prev.filter(m => m.id !== movie.id)

            const updated = [{ ...movie, addedAt: Date.now() }, ...filtered]

            return updated.slice(0, 100)
        })
    }, [])

    const removeMovie = useCallback((movieId: number) => {
        setMovies(prev => prev.filter(m => m.id !== movieId))
    }, [])

    const clearAll = useCallback(() => {
        setMovies([])
    }, [])

    return { movies, addMovie, removeMovie, clearAll, isLoaded }
}


export const useWatchLater = () => {
    const [movies, setMovies] = useState<StoredMovie[]>([])
    const [isLoaded, setIsLoaded] = useState(false)


    useEffect(() => {
        try {
            const stored = localStorage.getItem('movzen_watch_later')
            if (stored) {
                setMovies(JSON.parse(stored))
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('movzen_watch_later', JSON.stringify(movies))
            } catch (error) {
                console.error(error)
            }
        }
    }, [movies, isLoaded])

    const addMovie = useCallback((movie: Omit<StoredMovie, 'addedAt'>) => {
        setMovies(prev => {

            if (prev.some(m => m.id === movie.id)) {
                return prev
            }

            return [{ ...movie, addedAt: Date.now() }, ...prev]
        })
    }, [])

    const removeMovie = useCallback((movieId: number) => {
        setMovies(prev => prev.filter(m => m.id !== movieId))
    }, [])

    const toggleMovie = useCallback((movie: Omit<StoredMovie, 'addedAt'>) => {
        setMovies(prev => {
            const exists = prev.some(m => m.id === movie.id)
            if (exists) {
                return prev.filter(m => m.id !== movie.id)
            }
            return [{ ...movie, addedAt: Date.now() }, ...prev]
        })
    }, [])

    const isInWatchLater = useCallback((movieId: number) => {
        return movies.some(m => m.id === movieId)
    }, [movies])

    const clearAll = useCallback(() => {
        setMovies([])
    }, [])

    return { movies, addMovie, removeMovie, toggleMovie, isInWatchLater, clearAll, isLoaded }
}
