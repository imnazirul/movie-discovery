import MoviesByGenre from "@/components/MoviesByGenre";
import { GenreMoviesContent } from "./[id]/page";
import { Suspense } from "react";

const Page = () => {
    return (
        <div className="pt-12 bg-white dark:bg-black">
            <Suspense
                fallback={<div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />
                    </div>
                </div>
                }>
                <GenreMoviesContent genreId="" />
            </Suspense>
        </div>
    );
};

export default Page;
