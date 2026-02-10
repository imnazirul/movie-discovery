# MovieDB - Movie Discovery Application

A modern, responsive movie discovery application built with Next.js and powered by The Movie Database (TMDB) API.

## Features

### Core Features
- **Home Page**: Browse top-rated and popular movies, explore all available genres
- **Genre Browsing**: Filter movies by genre with multiple sorting options
- **Advanced Search**: Search movies by title with pagination support
- **Movie Details**: View comprehensive information about movies including cast, similar movies, ratings, budget, and revenue
- **Watch Later List**: Save movies you want to watch (persisted in localStorage)
- **Recently Viewed**: Track your movie browsing history
- **Dark/Light Mode**: Toggle between dark and light themes
- **Fully Responsive**: Mobile-first design that works perfectly on all devices

### Additional Features
- Loading states with skeleton screens
- Empty states for better UX
- Error handling for API failures
- Pagination for large result sets
- Real-time theme switching
- Movie cast information display
- Similar movies recommendations

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Theme Management**: next-themes
- **Data Fetching**: SWR
- **State Management**: React Hooks + localStorage
- **Testing**: Jest + React Testing Library
- **API**: The Movie Database (TMDB) API v3

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- TMDB API key (get one free at https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd moviedb
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
```bash
# Copy the environment template
cp .env.example .env.local

# Add your TMDB API key
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
moviedb/
├── app/
│   ├── api/                 # API route handlers
│   │   └── movies/         # Movie-related endpoints
│   ├── genre/              # Genre browsing pages
│   ├── movie/              # Movie details pages
│   ├── search/             # Search results page
│   ├── watch-later/        # Watch later list page
│   ├── recently-viewed/    # Recently viewed page
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── header.tsx          # Navigation header
│   ├── movie-card.tsx      # Movie card component
│   ├── movie-grid.tsx      # Movie grid layout
│   ├── skeleton-grid.tsx   # Loading skeleton
│   └── ui/                 # Shadcn UI components
├── hooks/
│   └── useMovies.ts        # Custom hooks for TMDB API
├── lib/
│   ├── tmdb.ts            # TMDB API utilities
│   ├── storage.ts         # Local storage helpers
│   └── utils.ts           # General utilities
├── __tests__/
│   ├── tmdb.test.ts       # TMDB utilities tests
│   └── storage.test.ts    # Storage utilities tests
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup file
└── package.json            # Dependencies and scripts
```

## API Routes

### GET `/api/genres`
Get all available movie genres.

### GET `/api/movies`
Get movies by type (top-rated or popular).
- Query params: `type` (top-rated|popular), `page` (default: 1)

### GET `/api/movies/[id]`
Get movie details including cast and crew.
- Path params: `id` (movie ID)
- Query params: `type` (details|similar)

### GET `/api/movies/by-genre`
Get movies filtered by genre.
- Query params: `genreId`, `page`, `sortBy`

### GET `/api/movies/search`
Search for movies by title.
- Query params: `query`, `page`

## Sorting Options

- Popularity (High to Low) - `popularity.desc`
- Popularity (Low to High) - `popularity.asc`
- Release Date (Newest) - `release_date.desc`
- Release Date (Oldest) - `release_date.asc`
- Rating (High to Low) - `vote_average.desc`
- Rating (Low to High) - `vote_average.asc`
- Title (A-Z) - `title.asc`
- Title (Z-A) - `title.desc`

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Tests cover:
- TMDB utility functions (formatting, image URLs)
- Storage utilities (watch later, recently viewed)

## Design System

The app uses a custom design system with cinema-inspired colors:

- **Primary**: Deep Cinema Blue (#1E40AF)
- **Accent**: Warm Gold (#FBBF24)
- **Background**: Dark (#0B0F19)
- **Neutral**: Light Gray (#F3F4F6)

All colors follow accessibility guidelines with proper contrast ratios.

## Performance Optimizations

- Image optimization with Next.js Image component
- SWR for efficient data fetching and caching
- CSS-in-JS with Tailwind for minimal bundle size
- Lazy loading of components
- Responsive images with srcSet
- Font optimization with next/font

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Key Components

### MovieCard
Displays a single movie with poster, rating, and watch later action.
```tsx
<MovieCard movie={movie} onWatchLaterChange={handleChange} />
```

### MovieGrid
Responsive grid layout for displaying multiple movies.
```tsx
<MovieGrid movies={movies} onWatchLaterChange={handleChange} />
```

### Header
Navigation bar with search, theme toggle, and quick links.

## Hooks

### useGenres()
Fetch all available genres.

### useTopRatedMovies(page)
Fetch top-rated movies.

### usePopularMovies(page)
Fetch popular movies.

### useMoviesByGenre(genreId, page, sortBy)
Fetch movies filtered by genre.

### useMovieDetails(movieId)
Fetch detailed information about a movie.

### useSimilarMovies(movieId)
Fetch movies similar to a given movie.

### useSearchMovies(query, page)
Search for movies by title.

## Storage

Movies are persisted in browser localStorage:
- **Watch Later**: Saved movies to watch later
- **Recently Viewed**: History of viewed movies (limited to 20 items)

Data is stored with timestamps for sorting.

## Error Handling

The application includes robust error handling:
- API error responses are caught and logged
- UI displays user-friendly error messages
- Fallback loading states during data fetching
- Empty states for zero results

## SEO

The application is optimized for search engines:
- Dynamic metadata for each page
- Open Graph meta tags
- Structured data with semantic HTML
- Mobile-friendly responsive design
- Fast page load times

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
git push origin main
```

## License

This project is open source and available under the MIT License.

## Credits

- Movies data by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Built with [Next.js](https://nextjs.org/)
- UI Components from [Shadcn/UI](https://ui.shadcn.com/)

## Support

For issues and questions, please open an issue on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This application is for educational purposes and demonstrates best practices in modern web development with React and Next.js.
