import Hero from "@/components/HeroSlider";
import MoviesByGenre from "@/components/MoviesByGenre";
import PopularMovies from "@/components/PopularMovies";
import TopRatedMovies from "@/components/TopRatedMovies";

const Page = () => {
  return (
    <div>
      <Hero />
      <TopRatedMovies />
      <PopularMovies />
      <MoviesByGenre />
    </div>
  );
};

export default Page;
