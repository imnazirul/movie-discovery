import Hero from "@/components/HeroSlider";
import MoviesByGenre from "@/components/MoviesByGenre";
import PopularMovies from "@/components/PopularMovies";
import PopularMoviesPerGenre from "@/components/PopularMoviesPerGenre";
import TopRatedMovies from "@/components/TopRatedMovies";

const Page = () => {
  return (
    <div>
      <Hero />
      <TopRatedMovies />
      <PopularMovies />
      <PopularMoviesPerGenre />
      <MoviesByGenre />
    </div>
  );
};

export default Page;
