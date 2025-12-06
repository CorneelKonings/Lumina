
import { Movie, Platform } from '../types';
import { TMDB_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE, TMDB_BACKDROP_BASE, PROVIDER_IDS, GENRE_IDS } from '../constants';

// Helper to construct Deep Links (Fallback)
const getSearchLink = (platform: Platform, title: string) => {
  const encodedTitle = encodeURIComponent(title);
  switch (platform) {
    case Platform.NETFLIX: 
      return `https://www.netflix.com/search?q=${encodedTitle}`;
    case Platform.DISNEY: 
      return `https://www.disneyplus.com/search?q=${encodedTitle}`;
    case Platform.PRIME: 
      return `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video`;
    case Platform.HBO: 
      return `https://play.max.com/search?q=${encodedTitle}`;
    case Platform.YOUTUBE: 
      return `https://www.youtube.com/results?search_query=${encodedTitle}`;
    default: 
      return `https://google.com/search?q=watch+${encodedTitle}`;
  }
};

/**
 * 🪄 THE AUTOMATIC LINK TRANSFORMER
 * This function detects if we have a direct Netflix 'title' link 
 * and converts it to a 'watch' link for instant playback.
 */
const optimizeStreamUrl = (homepage: string | null, platform: Platform, title: string): string => {
    // 1. Check if we have a specific homepage link from TMDB
    if (homepage) {
        // Netflix Specific Logic
        // Regex looks for /title/ followed by digits and replaces it with /watch/ followed by those digits
        if (platform === Platform.NETFLIX && homepage.includes('/title/')) {
            return homepage.replace(/\/title\/(\d+)/, '/watch/$1');
        }
        
        // Disney+ Specific Logic
        if (platform === Platform.DISNEY && homepage.includes('disneyplus.com')) {
            return homepage;
        }

        // Generic check: if homepage matches the platform domain, use it
        if (platform === Platform.HBO && homepage.includes('max.com')) return homepage;
        if (platform === Platform.PRIME && homepage.includes('amazon.com')) return homepage;
    }

    // 2. Fallback to Search if no direct link is available
    return getSearchLink(platform, title);
};

const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const rawKey = TMDB_KEY || '';
  const cleanKey = rawKey.trim();

  if (!cleanKey || cleanKey.length < 5) {
    console.warn("⚠️ TMDB Key missing or invalid in constants.ts");
    throw new Error("MISSING_KEY");
  }

  const queryParams = new URLSearchParams({
    language: 'en-US',
    include_adult: 'false',
    include_video: 'true',
    ...params
  });

  const isBearer = cleanKey.length > 50; 
  let url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;
  const headers: Record<string, string> = { accept: 'application/json' };

  if (isBearer) {
    headers['Authorization'] = `Bearer ${cleanKey}`;
  } else {
    url += `&api_key=${cleanKey}`;
  }

  try {
    const res = await fetch(url, { method: 'GET', headers });
    if (!res.ok) {
        if (res.status === 401) throw new Error("INVALID_KEY");
        if (res.status === 404) {
            console.warn(`TMDB 404 for ${endpoint}`);
            return null; // Return null instead of throwing for 404s
        }
        throw new Error(`TMDB Error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    if (error.message === 'MISSING_KEY' || error.message === 'INVALID_KEY') throw error;
    console.error("Fetch failed", error);
    return null;
  }
};

const mapResultToMovie = (item: any, category: string, platform: Platform, forcedMediaType?: 'movie' | 'tv'): Movie => {
  // Determine date
  const dateStr = item.release_date || item.first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() : new Date().getFullYear();
  
  // Determine Type (Critical for 404 prevention)
  const mediaType = forcedMediaType || (item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie');

  return {
    id: item.id.toString(),
    title: item.title || item.name, 
    description: item.overview,
    thumbnailUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : '',
    backdropUrl: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : '',
    platform: platform,
    year: year,
    genre: 'Unknown', 
    rating: item.vote_average ? `${item.vote_average.toFixed(1)}` : 'NR',
    trailerUrl: '', 
    streamUrl: getSearchLink(platform, item.title || item.name),
    director: 'Unknown',
    cast: [],
    category: category,
    mediaType: mediaType
  };
};

export const fetchDashboardContent = async (subscriptions: Platform[]): Promise<Movie[]> => {
  if (subscriptions.length === 0) return [];

  const providerString = subscriptions
    .map(s => PROVIDER_IDS[s])
    .filter(id => id)
    .join('|');

  const displayPlatform = subscriptions[0]; 
  const allMovies: Movie[] = [];

  const addMovies = (data: any, cat: string, type?: 'movie' | 'tv') => {
      if (data?.results) {
          const items = data.results.slice(0, 8).map((m: any) => mapResultToMovie(m, cat, displayPlatform, type));
          allMovies.push(...items);
      }
  };

  try {
    // 1. Trending (Mixed Types)
    const trendingData = await fetchFromTMDB('/trending/all/week', { watch_region: 'US', page: '1' });
    addMovies(trendingData, 'Trending Now');

    // 2. Action (Movies)
    const actionData = await fetchFromTMDB('/discover/movie', {
        sort_by: 'popularity.desc',
        with_genres: `${GENRE_IDS.ACTION}`,
        with_watch_providers: providerString,
        watch_region: 'US',
        page: '1'
    });
    addMovies(actionData, 'Action & Thriller', 'movie');

    // 3. Sci-Fi (Movies)
    const scifiData = await fetchFromTMDB('/discover/movie', {
        sort_by: 'popularity.desc',
        with_genres: `${GENRE_IDS.SCIFI}`,
        with_watch_providers: providerString,
        watch_region: 'US',
        page: '1'
    });
    addMovies(scifiData, 'Sci-Fi & Fantasy', 'movie');

    // 4. Critically Acclaimed (Movies)
    const topData = await fetchFromTMDB('/movie/top_rated', {
        with_watch_providers: providerString,
        watch_region: 'US',
        page: '1'
    });
    addMovies(topData, 'Critically Acclaimed', 'movie');

  } catch (e: any) {
      if (e.message === 'INVALID_KEY' || e.message === 'MISSING_KEY') throw e;
  }

  return allMovies;
};

export const fetchMovieDetails = async (movieId: string, mediaType: 'movie' | 'tv', currentPlatform: Platform = Platform.NETFLIX): Promise<Partial<Movie> | null> => {
    try {
        // DYNAMIC ENDPOINT: Uses /movie/ or /tv/ based on the item type
        const endpoint = `/${mediaType}/${movieId}`;
        
        const data = await fetchFromTMDB(endpoint, {
            append_to_response: 'videos,credits,release_dates,external_ids'
        });
    
        if (!data) return null;
    
        // Find trailer
        const trailer = data.videos?.results.find(
            (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
    
        const director = data.credits?.crew?.find((c: any) => c.job === 'Director' || c.job === 'Executive Producer')?.name;
        const cast = data.credits?.cast?.slice(0, 3).map((c: any) => c.name);
        const genre = data.genres?.map((g: any) => g.name).slice(0, 2).join(' • ');

        // Apply automatic /title/ -> /watch/ logic
        const directStreamUrl = optimizeStreamUrl(data.homepage, currentPlatform, data.title || data.name);
    
        return {
            trailerUrl: trailer?.key,
            director: director || 'Unknown',
            cast: cast || [],
            genre: genre || 'General',
            streamUrl: directStreamUrl
        };
    } catch (e) {
        console.error("Error fetching details", e);
        return null;
    }
};
