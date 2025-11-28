/**
 * 📖 DOCUMENTATION REFERENCE:
 * - File: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md
 * - Section: "Section Tabs (Program Sections)"
 * - Lines: 246-278
 * 
 * 🎨 DESIGN SPECIFICATIONS:
 * - Active tab: Cyan background (#5dade2)
 * - Completed tab: Navy medium (#2a3b52) with cyan border and green checkmark
 * - Inactive tab: Navy dark (#1a2332) with gray text
 * - Spacing: gap-3, px-6 py-2.5
 * - Font: text-sm font-medium
 * - Checkmark: Green (#34c38f) for completed
 * 
 * 📋 USAGE:
 * <SectionTabs 
 *   weeks={weekData}
 *   activeWeekNumber={1}
 *   completedWeeks={[]}
 *   onWeekChange={(weekNum) => setActiveWeek(weekNum)}
 * />
 */

import React from 'react';
import { Check } from 'lucide-react';

interface Week {
  weekNumber: number;
  title: string;
}

interface SectionTabsProps {
  weeks: Week[];
  activeWeekNumber: number;
  completedWeeks: number[]; // Array of completed week numbers
  onWeekChange: (weekNumber: number) => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  weeks,
  activeWeekNumber,
  completedWeeks,
  onWeekChange,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
      {weeks.map((week) => {
        const isActive = week.weekNumber === activeWeekNumber;
        const isCompleted = completedWeeks.includes(week.weekNumber);
        const isAccessible = true; // TODO: Add logic for locked weeks

        return (
          <button
            key={week.weekNumber}
            onClick={() => isAccessible && onWeekChange(week.weekNumber)}
            disabled={!isAccessible}
            className={`
              px-6 py-2.5 rounded-lg text-sm font-medium
              transition-all whitespace-nowrap flex items-center gap-2
              ${
                isActive
                  ? 'bg-[#5dade2] text-white'
                  : isCompleted
                  ? 'bg-[#2a3b52] text-white border border-[#5dade2]/30'
                  : isAccessible
                  ? 'bg-[#1a2332] text-white border border-[#3d5170]'
                  : 'bg-[#1a2332] text-gray-400 border border-[#3d5170] opacity-50 cursor-not-allowed'
              }
            `}
          >
            {/* Week title */}
            <span>Week {week.weekNumber}</span>

            {/* Checkmark for completed weeks */}
            {isCompleted && (
              <Check className="w-5 h-5 text-[#34c38f]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
