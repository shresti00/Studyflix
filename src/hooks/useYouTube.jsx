import { useState } from 'react';

// Central simple cache shared globally since it's just meant for this session
const globalSubjectCache = {};

export default function useYouTube() {
  const [loading, setLoading] = useState(false);

  const fetchSubjectPlaylists = async (subjectKey, query, fallbackData) => {
    if (globalSubjectCache[subjectKey]) {
      return globalSubjectCache[subjectKey];
    }

    setLoading(true);
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    
    const constructFallback = () => {
      // Create 7 modules from fallback repeating it
      const modules = [];
      for(let i=1; i<=7; i++) {
        modules.push(fallbackData.map(v => ({...v, title: `Module ${i}: ${v.title}`, id: v.id + '-' + i})));
      }
      return modules;
    };

    if (!apiKey) {
      console.warn("No API key, returning fallback module chunks");
      const fb = constructFallback();
      globalSubjectCache[subjectKey] = fb;
      setLoading(false);
      return fb;
    }

    try {
      const enhancedQuery = `${query} technical tutorial english`;
      // Fetch more items in search to account for the local filtering
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(enhancedQuery)}&type=video&relevanceLanguage=en&key=${apiKey}`);
      const data = await response.json();
      
      const nonEnglishKeywords = ['hindi', 'tamil', 'telugu', 'malayalam', 'kannada', 'marathi', 'punjabi', 'bengali', 'gujarati', 'urdu'];

      if (data.items && data.items.length > 0) {
        // 1. Get IDs for detailed info (contentDetails contains duration)
        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`);
        const detailsData = await detailsResponse.json();

        if (!detailsData.items) throw new Error("No details found");

        const vids = detailsData.items
          .filter(item => {
            // Local language filter
            const title = (item.snippet.title || '').toLowerCase();
            const desc = (item.snippet.description || '').toLowerCase();
            const isEnglish = !nonEnglishKeywords.some(word => title.includes(word) || desc.includes(word));
            
            // Local duration filter (>= 180 seconds)
            const { seconds } = parseISO8601Duration(item.contentDetails.duration);
            return isEnglish && seconds >= 180;
          })
          .map(item => ({
            id: item.id,
            thumb: item.snippet.thumbnails.high.url,
            title: item.snippet.title,
            desc: item.snippet.description || 'No description available.',
            duration: parseISO8601Duration(item.contentDetails.duration).label
          }));
        
        const modules = [];
        for(let i = 0; i < 7; i++) {
          const chunk = vids.slice(i * 5, (i + 1) * 5);
          // If api returned less than 35, pad with fallback items to guarantee 5 videos per module
          if (chunk.length < 5) {
             const fbMod = constructFallback()[i];
             chunk.push(...fbMod.slice(chunk.length, 5));
          }
          modules.push(chunk);
        }
        globalSubjectCache[subjectKey] = modules;
        setLoading(false);
        return modules;
      }
    } catch(err) {
      console.error(err);
    }
    
    const fb = constructFallback();
    globalSubjectCache[subjectKey] = fb;
    setLoading(false);
    return fb;
  };

  return { fetchSubjectPlaylists, loading };
}

/**
 * Parses YouTube's ISO 8601 duration format (e.g., PT15M33S)
 * Returns { seconds: number, label: string }
 */
function parseISO8601Duration(duration) {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return { seconds: 0, label: "0:00" };

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Format label: H:MM:SS or M:SS
  let label = "";
  if (hours > 0) {
    label += hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  } else {
    label += minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  }

  return { seconds: totalSeconds, label };
}
