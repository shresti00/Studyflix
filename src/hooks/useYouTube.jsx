import { useState } from 'react';

const globalSubjectCache = {};

export default function useYouTube() {
  const [loading, setLoading] = useState(false);

  const fetchSubjectPlaylists = async (subjectKey, query, fallbackData) => {
    if (globalSubjectCache[subjectKey]) {
      return globalSubjectCache[subjectKey];
    }

    setLoading(true);
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    if (!apiKey) {
      console.warn('No YouTube API key. Using fallback for', subjectKey);
      globalSubjectCache[subjectKey] = [fallbackData];
      setLoading(false);
      return [fallbackData];
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=35&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
      );
      const data = await res.json();

      if (data.error) {
        console.error('YouTube API error:', data.error.message);
        globalSubjectCache[subjectKey] = [fallbackData];
        setLoading(false);
        return [fallbackData];
      }

      if (data.items && data.items.length > 0) {
        const vids = data.items.map((item, i) => ({
          id: item.id.videoId,
          thumb: item.snippet.thumbnails.high.url,
          title: item.snippet.title,
          desc: item.snippet.description || 'Click to watch this video on YouTube.',
          duration: '▶ Watch',
        }));

        globalSubjectCache[subjectKey] = [vids];
        setLoading(false);
        return [vids];
      }
    } catch (err) {
      console.error('Fetch error for', subjectKey, err);
    }

    globalSubjectCache[subjectKey] = [fallbackData];
    setLoading(false);
    return [fallbackData];
  };

  return { fetchSubjectPlaylists, loading };
}
