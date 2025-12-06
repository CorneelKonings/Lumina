import { Movie, Platform } from './types';

// ==========================================
// 🔑 CONFIGURATION
// ==========================================

// 👇 PLAK HIER JE TMDB SLEUTEL TUSSEN DE AANHALINGSTEKENS 👇
// Je mag de korte API Key (32 tekens) OF de lange Leestoegangscode (begint met eyJ...) gebruiken.
export const TMDB_KEY = '68ee1b5d9f770fa88d40d5f04567f6cc'; 

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

// ==========================================
// 🔗 PROVIDER MAPPINGS (TMDB IDs)
// ==========================================
export const PROVIDER_IDS: Record<Platform, string> = {
  [Platform.NETFLIX]: '8',
  [Platform.DISNEY]: '337',
  [Platform.PRIME]: '9|119', // Prime US & Global
  [Platform.HBO]: '1899|384', // Max & HBO
  [Platform.YOUTUBE]: '' // YouTube handled separately
};

// ==========================================
// 🎭 GENRES
// ==========================================
export const GENRE_IDS = {
  ACTION: 28,
  SCIFI: 878,
  DRAMA: 18,
  COMEDY: 35,
  HORROR: 27,
  ANIMATION: 16
};

// ==========================================
// 📱 APP CONSTANTS
// ==========================================
export const INITIAL_SUBSCRIPTIONS = [
  Platform.NETFLIX,
  Platform.DISNEY,
];

// Fallback data
export const MOCK_MOVIES: Movie[] = [];

export const CATEGORIES = [
  'Trending Now',
  'Sci-Fi & Fantasy',
  'Action & Thriller',
  'Critically Acclaimed',
  'Animated Hits'
];