import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Movie, Platform } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getRecommendations = async (
  subscriptions: Platform[]
): Promise<Movie[]> => {
  const ai = getClient();
  if (!ai) return [];

  const subString = subscriptions.join(', ');
  
  // Define Schema for categorized output
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: "One of: Trending Now, Sci-Fi & Fantasy, Action & Adventure, Hidden Gems" },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        platform: { type: Type.STRING, enum: Object.values(Platform) },
        year: { type: Type.INTEGER },
        genre: { type: Type.STRING },
        rating: { type: Type.STRING },
        trailerUrl: { type: Type.STRING, description: "YouTube ID e.g. dQw4w9WgXcQ" },
        director: { type: Type.STRING },
        cast: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["category", "title", "description", "platform", "genre", "rating"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: `You are the backend engine for "Lumina", a high-end streaming hub.
        
        TASK:
        Generate a diverse list of 20 real, high-quality movies/series available on: ${subString}.
        
        DISTRIBUTION:
        - 5 items for "Trending Now"
        - 5 items for "Sci-Fi & Fantasy"
        - 5 items for "Action & Adventure"
        - 5 items for "Hidden Gems" (High rated but less known)

        REQUIREMENTS:
        - Titles must be REAL movies/shows.
        - Descriptions must be punchy.
        - Accurate ratings.
        
        Output raw JSON.
        `,
      },
      contents: `Generate the database based on subscriptions: ${subString}`,
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as any[];
    
    return data.map((item, index) => {
        // Construct deep links based on platform logic
        let streamUrl = '';
        const encodedTitle = encodeURIComponent(item.title);
        
        switch (item.platform) {
            case Platform.NETFLIX:
                streamUrl = `https://www.netflix.com/search?q=${encodedTitle}`;
                break;
            case Platform.DISNEY:
                streamUrl = `https://www.disneyplus.com/search?q=${encodedTitle}`;
                break;
            case Platform.PRIME:
                streamUrl = `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video`;
                break;
            case Platform.HBO:
                streamUrl = `https://play.max.com/search?q=${encodedTitle}`;
                break;
            case Platform.YOUTUBE:
                streamUrl = `https://www.youtube.com/results?search_query=${encodedTitle}`;
                break;
            default:
                streamUrl = `https://google.com/search?q=watch+${encodedTitle}`;
        }

        // Use Pollinations AI to generate a consistent looking "Poster" based on the title
        // This is much better than random stock photos.
        const safeTitle = item.title.replace(/[^a-zA-Z0-9 ]/g, '');
        const thumbnailUrl = `https://image.pollinations.ai/prompt/movie%20poster%20for%20${safeTitle}%20minimalist%20high%20quality%20cinematic?width=400&height=600&nologo=true&seed=${index}`;
        const backdropUrl = `https://image.pollinations.ai/prompt/wide%20cinematic%20shot%20scene%20from%20movie%20${safeTitle}%204k?width=1200&height=600&nologo=true&seed=${index}`;

        return {
            ...item,
            id: `ai-${Date.now()}-${index}`, 
            streamUrl,
            thumbnailUrl,
            backdropUrl
        };
    });

  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
};