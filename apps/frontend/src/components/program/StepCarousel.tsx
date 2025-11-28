/**
 * 📖 DOCUMENTATION REFERENCE:
 * - File: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md
 * - Section: "Step Card in Carousel"
 * - Lines: 280-306
 * 
 * 🎨 DESIGN SPECIFICATIONS:
 * - Card: Navy medium (#2a3b52), rounded-xl, p-6
 * - Border: Navy light (#3d5170), hover: cyan (#5dade2)
 * - Min width: 320px per card
 * - Checkmark: Green (#34c38f) for completed
 * - Thumbnail: aspect-video with play button overlay
 * - Left/Right arrows: Sticky position
 * 
 * 📋 USAGE:
 * <StepCarousel 
 *   steps={weekSteps}
 *   activeStepNumber={1}
 *   completedSteps={[]}
 *   onStepClick={(stepNum) => setActiveStep(stepNum)}
 * />
 */

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react';

interface Step {
  stepNumber: number;
  title: string;
  contentUrl?: string;
  durationMinutes?: number;
}

interface StepCarouselProps {
  steps: Step[];
  activeStepNumber: number;
  completedSteps: number[]; // Array of completed step numbers
  onStepClick: (stepNumber: number) => void;
}

export const StepCarousel: React.FC<StepCarouselProps> = ({
  steps,
  activeStepNumber,
  completedSteps,
  onStepClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width (320) + gap (20)
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  // Generate thumbnail URL from Vimeo URL
  const getThumbnailUrl = (videoUrl?: string) => {
    if (!videoUrl) return 'https://via.placeholder.com/320x180/1a2332/5dade2?text=Step';
    
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    }
    
    return 'https://via.placeholder.com/320x180/1a2332/5dade2?text=Video';
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2a3b52] hover:bg-[#3d5170] rounded-full p-2 shadow-lg transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Carousel container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-12 py-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {steps.map((step) => {
          const isActive = step.stepNumber === activeStepNumber;
          const isCompleted = completedSteps.includes(step.stepNumber);

          return (
            <div
              key={step.stepNumber}
              onClick={() => onStepClick(step.stepNumber)}
              className={`
                bg-[#2a3b52] rounded-xl p-6 border
                min-w-[320px] flex-shrink-0
                transition-all cursor-pointer
                ${
                  isActive
                    ? 'border-[#5dade2] shadow-lg shadow-[#5dade2]/20'
                    : 'border-[#3d5170] hover:border-[#5dade2]'
                }
              `}
            >
              {/* Header with step number and checkmark */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-semibold text-sm">
                  STEP {step.stepNumber}
                </span>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-[#34c38f]" />
                )}
              </div>

              {/* Title */}
              <h4 className="text-white text-base mb-4 line-clamp-2">
                {step.title}
              </h4>

              {/* Thumbnail */}
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={getThumbnailUrl(step.contentUrl)}
                  alt={step.title}
                  className="w-full aspect-video object-cover"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="w-6 h-6 text-[#0a1628] fill-current" />
                  </div>
                </div>

                {/* Duration badge */}
                {step.durationMinutes && (
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                    {step.durationMinutes} min
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2a3b52] hover:bg-[#3d5170] rounded-full p-2 shadow-lg transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

// CSS to hide scrollbar (add to global styles if needed)
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);
