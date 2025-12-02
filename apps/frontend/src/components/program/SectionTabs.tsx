// apps/frontend/src/components/program/SectionTabs.tsx
import React from 'react';

interface Week {
  id: string;
  weekNumber: number;
  title: string;
}

interface SectionTabsProps {
  weeks: Week[];
  activeWeek: number;
  completedWeeks?: string[]; // Optional, defaults to empty array
  onWeekChange: (weekNumber: number) => void;
}

export function SectionTabs({
  weeks,
  activeWeek,
  completedWeeks = [], // Default to empty array
  onWeekChange,
}: SectionTabsProps) {
  // Defensive check
  if (!weeks || weeks.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {weeks.map((week) => {
        const isActive = week.weekNumber === activeWeek;
        const isCompleted = completedWeeks?.includes(week.id) || false; // Safe check

        return (
          <button
            key={week.id}
            onClick={() => onWeekChange(week.weekNumber)}
            className={`
              px-6 py-2.5 rounded-lg text-sm font-medium
              transition-all whitespace-nowrap min-w-[120px]
              ${
                isActive
                  ? 'bg-[#5dade2] text-white'
                  : isCompleted
                  ? 'bg-[#2a3b52] text-white border border-[#5dade2]/30'
                  : 'bg-[#2a3b52] text-gray-400 border border-[#3d5170]'
              }
              hover:border-[#5dade2]
            `}
          >
            <div className="flex items-center gap-2">
              <span>Week {week.weekNumber}</span>
              {isCompleted && (
                <svg
                  className="w-4 h-4 text-[#34c38f]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Named export
export default SectionTabs;
