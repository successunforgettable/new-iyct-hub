/**
 * 📖 DOCUMENTATION REFERENCE:
 * - File: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md
 * - Section: "Video Player Component"
 * - Lines: 595-639
 * 
 * 🎨 DESIGN SPECIFICATIONS:
 * - Aspect ratio: 16/9
 * - Thumbnail: Full width with overlay
 * - Play button: White circle with play icon
 * - Duration: Bottom right, black/70 background
 * - Step counter: Bottom right, cyan text
 * - Border radius: rounded-xl
 * 
 * 📋 USAGE:
 * <VideoPlayer 
 *   videoUrl="https://vimeo.com/745896321"
 *   thumbnailUrl="https://..."
 *   duration="08:45"
 *   stepInfo="1 of 4 steps"
 *   onPlay={() => openVideoModal()}
 * />
 */

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  stepInfo?: string;
  title?: string;
  onPlay?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  duration,
  stepInfo,
  title,
  onPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Extract Vimeo ID from URL if it's a Vimeo link
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  // Generate Vimeo thumbnail if no thumbnail provided
  const getThumbnailUrl = () => {
    if (thumbnailUrl) return thumbnailUrl;
    
    const vimeoId = getVimeoId(videoUrl);
    if (vimeoId) {
      // Vimeo thumbnail format
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }
    
    // Fallback placeholder
    return 'https://via.placeholder.com/1280x720/1a2332/5dade2?text=Video';
  };

  const handleClick = () => {
    if (onPlay) {
      onPlay();
    } else {
      // Default behavior: open video in new tab
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1a2332]">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={getThumbnailUrl()}
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
        />

        {/* Play overlay */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            bg-black/20 hover:bg-black/30 transition-all cursor-pointer
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {/* Play button */}
          <div
            className={`
              bg-white rounded-full p-4
              transform transition-transform
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
          >
            <Play className="w-8 h-8 text-[#0a1628] fill-current" />
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-white text-sm">
            {duration}
          </div>
        )}

        {/* Step counter */}
        {stepInfo && (
          <div className="absolute bottom-4 right-20 text-[#5dade2] text-sm font-medium">
            {stepInfo}
          </div>
        )}
      </div>

      {/* Optional title bar below video */}
      {title && (
        <div className="px-4 py-3 bg-[#2a3b52]">
          <h4 className="text-white text-sm font-medium">{title}</h4>
        </div>
      )}
    </div>
  );
};
