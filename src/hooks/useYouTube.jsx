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
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=35&q=${encodeURIComponent(query)}&type=video&videoDuration=medium&key=${apiKey}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const vids = data.items.map(item => ({
          id: item.id.videoId,
          thumb: item.snippet.thumbnails.high.url,
          title: item.snippet.title,
          desc: item.snippet.description || 'No description available.',
          duration: 'YouTube'
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
