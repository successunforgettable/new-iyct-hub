/**
 * 📖 DOCUMENTATION REFERENCE:
 * - File: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md
 * - Section: "Breadcrumb Navigation"
 * - Lines: 226-244
 * 
 * 🎨 DESIGN SPECIFICATIONS:
 * - Format: ← Back | Program > Week 1 > Step 1
 * - Colors: Gray text (#a0a0a0), white for current (#ffffff), cyan for links (#5dade2)
 * - Spacing: gap-2 between items
 * - Icons: ArrowLeft, ChevronRight
 * 
 * 📋 USAGE:
 * <Breadcrumb 
 *   programName="The Incredible You 10 week coaching"
 *   weekNumber={1}
 *   stepNumber={1}
 *   onBack={() => navigate('/programs')}
 * />
 */

import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  programName: string;
  sectionName?: string;
  weekNumber?: number;
  stepNumber?: number;
  onBack?: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  programName,
  sectionName,
  weekNumber,
  stepNumber,
  onBack,
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      {/* Back button */}
      {onBack && (
        <>
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-gray-600">|</span>
        </>
      )}

      {/* Program name */}
      <span className="hover:text-white transition-colors cursor-pointer">
        {programName}
      </span>

      {/* Section name (if provided) */}
      {sectionName && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-white transition-colors">
            {sectionName}
          </span>
        </>
      )}

      {/* Week number (if provided) */}
      {weekNumber && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-white transition-colors">
            Week {weekNumber}
          </span>
        </>
      )}

      {/* Step number (if provided) - highlighted as current */}
      {stepNumber && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium">
            Step {stepNumber}
          </span>
        </>
      )}
    </div>
  );
};
