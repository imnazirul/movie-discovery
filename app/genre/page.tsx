import MoviesByGenre from "@/components/MoviesByGenre";
import { GenreMoviesContent } from "./[id]/page";

const Page = () => {
  return (
    <div className="pt-12 bg-white dark:bg-black">
      <GenreMoviesContent genreId="" />
    </div>
  );
};

export default Page;
