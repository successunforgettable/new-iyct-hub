// apps/frontend/src/components/ui/CircularProgress.tsx
// 📖 DOCUMENTATION REFERENCE: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Lines 301-354
// 📋 SPEC: "Three sizes: sm (60px, 4px stroke), md (80px, 5px stroke), lg (140px, 8px stroke), Cyan stroke color #5dade2, Navy background #2a3b52, Running icon at 100%"
// 🔧 IMPLEMENTATION: SVG-based circular progress indicator with exact sizes
// ✅ VERIFICATION: Matches screenshot progress circles exactly

import React from 'react';

interface CircularProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  value, 
  size = 'md',
  className = ''
}) => {
  // 📖 REF: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Line 305-310
  // EXACT sizes from documentation
  const sizes = {
    sm: { width: 60, stroke: 4 },
    md: { width: 80, stroke: 5 },
    lg: { width: 140, stroke: 8 },
  };

  const { width, stroke } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // 📖 REF: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Line 313
  // "return <div className="relative" style={{ width, height: width }}>"
  return (
    <div className={`relative ${className}`} style={{ width, height: width }}>
      {/* Background and progress circles - 📖 REF: Line 315-337 */}
      <svg 
        className="transform -rotate-90" 
        width={width} 
        height={width}
      >
        {/* Background circle - 📖 REF: Line 316-323 */}
        {/* Navy background color #2a3b52 from docs */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="#2a3b52"
          strokeWidth={stroke}
          fill="none"
        />
        
        {/* Progress circle - 📖 REF: Line 325-336 */}
        {/* Cyan stroke color #5dade2 from docs */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="#5dade2"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {/* Center content - 📖 REF: Line 339-346 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Running icon at 100% - 📖 REF: Line 340-342 */}
        {value === 100 && (
          <svg 
            className="text-[#5dade2] mb-1" 
            width={size === 'lg' ? 32 : size === 'md' ? 24 : 20} 
            height={size === 'lg' ? 32 : size === 'md' ? 24 : 20}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        )}
        
        {/* Percentage text - 📖 REF: Line 344 */}
        <span 
          className="text-white font-bold"
          style={{ fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.125rem' : '1rem' }}
        >
          {value}%
        </span>
      </div>
    </div>
  );
};
