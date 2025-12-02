// StepCarousel.tsx - FIX for undefined completedStepIds
// Line 99 error: Cannot read properties of undefined (reading 'includes')
// Solution: Add defensive checks for completedStepIds

import React, { useRef } from 'react';

interface Step {
  id: string;
  title: string;
  contentUrl?: string;
  durationMinutes?: number;
}

interface StepCarouselProps {
  steps: Step[];
  activeStepId: string;
  completedStepIds?: string[]; // Make optional with ?
  onStepClick: (stepId: string) => void;
}

export const StepCarousel: React.FC<StepCarouselProps> = ({
  steps,
  activeStepId,
  completedStepIds = [], // ✅ DEFAULT TO EMPTY ARRAY
  onStepClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // ✅ DEFENSIVE: Ensure completedStepIds is always an array
  const safeCompletedStepIds = Array.isArray(completedStepIds) ? completedStepIds : [];

  console.log('🎠 StepCarousel render:', {
    stepsCount: steps?.length || 0,
    activeStepId,
    completedStepIds: safeCompletedStepIds,
    completedCount: safeCompletedStepIds.length
  });

  // ✅ DEFENSIVE: Handle empty or undefined steps
  if (!steps || steps.length === 0) {
    return (
      <div className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52] text-center">
        <p className="text-gray-400">No steps available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2a3b52] hover:bg-[#3d5170] text-white p-3 rounded-full transition-all"
        aria-label="Scroll left"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-12"
        style={{ scrollBehavior: 'smooth' }}
      >
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          // ✅ SAFE: Use safeCompletedStepIds instead of completedStepIds
          const isCompleted = safeCompletedStepIds.includes(step.id);

          return (
            <div
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={`
                flex-shrink-0 w-80 bg-[#2a3b52] rounded-xl p-6 cursor-pointer
                transition-all hover:border-[#5dade2]
                ${isActive ? 'border-2 border-[#5dade2]' : 'border-2 border-transparent'}
              `}
            >
              {/* Step Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">
                  STEP {index + 1}
                </span>
                {isCompleted && (
                  <svg className="w-5 h-5 text-[#34c38f]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Step Title */}
              <h4 className="text-white text-base mb-4 line-clamp-2">
                {step.title}
              </h4>

              {/* Thumbnail Placeholder */}
              <div className="relative rounded-lg overflow-hidden bg-[#1a2332] aspect-video">
                {step.contentUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <span className="text-sm">No video</span>
                  </div>
                )}

                {/* Duration Badge */}
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

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2a3b52] hover:bg-[#3d5170] text-white p-3 rounded-full transition-all"
        aria-label="Scroll right"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
