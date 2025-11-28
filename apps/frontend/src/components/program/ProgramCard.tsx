// apps/frontend/src/components/program/ProgramCard.tsx
// 📖 DOCUMENTATION REFERENCE: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Lines 228-297
// 📋 SPEC: "Two variants: Hero (large, 32px padding, large progress) and Grid (smaller, medium progress), Background navy.dark #1a2332, Hover effect changes border from navy.light to cyan.primary"
// 🔧 IMPLEMENTATION: Complete program card with both variants matching screenshots
// ✅ VERIFICATION: Matches screenshot program cards exactly - sizes, colors, layout

import React from 'react';
import { CircularProgress } from '../ui/CircularProgress';

interface ProgramCardProps {
  title: string;
  currentWeek?: number;
  currentStep?: string;
  progress: number;
  onResume: () => void;
  onSendPaymentLink?: () => void;
  variant?: 'hero' | 'grid';
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  currentWeek,
  currentStep,
  progress,
  onResume,
  onSendPaymentLink,
  variant = 'grid'
}) => {
  // 📖 REF: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Line 234-291
  // Hero variant: Large card with logo, progress circle, Resume button
  if (variant === 'hero') {
    return (
      <div className="bg-[#1a2332] rounded-xl p-8 flex justify-between items-center">
        <div className="flex-1">
          {/* Logo - 📖 REF: Line 237-242 */}
          <div className="mb-4">
            <div className="text-white font-bold text-2xl">THE</div>
            <div className="text-white font-bold text-3xl">INCREDIBLE</div>
            <div className="text-red-500 font-bold text-3xl">YOU</div>
          </div>
          
          {/* Title - 📖 REF: Line 245-247 */}
          <h2 className="text-[#5dade2] text-2xl font-semibold mb-6">
            {title}
          </h2>
          
          {/* Status - 📖 REF: Line 250-253 */}
          {currentWeek && (
            <div className="text-white text-base mb-2">
              You are on - Week {currentWeek}
            </div>
          )}
          {currentStep && (
            <div className="text-gray-400 text-sm mb-6">
              {currentStep}
            </div>
          )}
          
          {/* Actions - 📖 REF: Line 256-265 */}
          <button 
            onClick={onResume}
            className="bg-[#5dade2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#7dc8f0] transition-colors mb-3"
          >
            Resume ▸
          </button>
          
          {onSendPaymentLink && (
            <button 
              onClick={onSendPaymentLink}
              className="bg-transparent text-gray-400 px-8 py-3 rounded-lg font-medium hover:text-white hover:bg-[#2a3b52] transition-all block mt-4"
            >
              Send upload payment link
            </button>
          )}
        </div>
        
        {/* Progress Circle - 📖 REF: Line 268-270 */}
        <div className="ml-8">
          <CircularProgress value={progress} size="lg" />
        </div>
      </div>
    );
  }
  
  // 📖 REF: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Line 275-297
  // Grid variant: Smaller card for program grid
  return (
    <div className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52] hover:border-[#5dade2] transition-all">
      {/* Header - 📖 REF: Line 277-279 */}
      <h3 className="text-white text-lg font-semibold mb-4">
        {title}
      </h3>
      
      {/* Status - 📖 REF: Line 282-287 */}
      {currentWeek && (
        <div className="text-gray-400 text-sm mb-2">
          Week {currentWeek}
        </div>
      )}
      {currentStep && (
        <div className="text-gray-300 text-sm mb-6">
          {currentStep}
        </div>
      )}
      
      {/* Progress and Button - 📖 REF: Line 290-296 */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onResume}
          className="bg-[#5dade2] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7dc8f0] transition-colors"
        >
          Resume ▸
        </button>
        
        <CircularProgress value={progress} size="md" />
      </div>
    </div>
  );
};
