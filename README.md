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


