
export enum Platform {
  NETFLIX = 'Netflix',
  DISNEY = 'Disney+',
  PRIME = 'Prime Video',
  HBO = 'HBO Max',
  YOUTUBE = 'YouTube'
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  backdropUrl?: string; // For the Hero section
  platform: Platform;
  year: number;
  genre: string;
  rating: string;
  trailerUrl?: string;
  streamUrl?: string;
  cast?: string[];
  director?: string;
  category?: string; // e.g., "Trending Now", "Sci-Fi"
  mediaType: 'movie' | 'tv'; // Critical for API calls
}

export interface CategoryGroup {
  title: string;
  movies: Movie[];
}

export interface UserPreferences {
  subscriptions: Platform[];
  favoriteGenres: string[];
}
