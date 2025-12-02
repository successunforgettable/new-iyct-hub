// apps/frontend/src/components/ui/VideoPlayer.tsx
import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  src?: string | null;
  title?: string;
  duration?: number;
}

export function VideoPlayer({ src, title, duration }: VideoPlayerProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailError, setThumbnailError] = useState(false);

  // Safe function to extract Vimeo ID
  const getVimeoId = (url: string | null | undefined): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    try {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    } catch (err) {
      return null;
    }
  };

  // Safe function to get thumbnail URL
  const getThumbnailUrl = async (url: string | null | undefined): Promise<string> => {
    const vimeoId = getVimeoId(url);
    
    if (!vimeoId) {
      return '/placeholder-video.jpg'; // Fallback image
    }

    try {
      const response = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      return data[0]?.thumbnail_large || '/placeholder-video.jpg';
    } catch (err) {
      console.warn('Could not fetch Vimeo thumbnail:', err);
      return '/placeholder-video.jpg';
    }
  };

  // Fetch thumbnail on mount
  React.useEffect(() => {
    if (src) {
      getThumbnailUrl(src)
        .then(setThumbnailUrl)
        .catch(() => {
          setThumbnailError(true);
          setThumbnailUrl('/placeholder-video.jpg');
        });
    } else {
      setThumbnailUrl('/placeholder-video.jpg');
    }
  }, [src]);

  const handlePlay = () => {
    if (!src) {
      console.warn('No video URL provided');
      return;
    }
    window.open(src, '_blank');
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1a2332] border border-[#2a3b52]">
      {/* Video Thumbnail or Placeholder */}
      <div className="relative aspect-video bg-gray-800">
        {thumbnailUrl && !thumbnailError ? (
          <img
            src={thumbnailUrl}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
            onError={() => setThumbnailError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a2332] to-[#2a3b52]">
            <div className="text-center">
              <Play className="w-16 h-16 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {src ? 'Loading video...' : 'No video available'}
              </p>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        {src && (
          <div
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all cursor-pointer group"
          >
            <div className="bg-white rounded-full p-4 transform group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-[#0a1628]" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-white text-sm">
            {formatDuration(duration)}
          </div>
        )}
      </div>

      {/* Video Title */}
      {title && (
        <div className="p-4 border-t border-[#2a3b52]">
          <h3 className="text-white text-sm font-medium line-clamp-2">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
