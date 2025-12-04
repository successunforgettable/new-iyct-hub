// ProgramDetailPage.tsx
// Location: apps/frontend/src/pages/programs/ProgramDetailPage.tsx
// Matches PHP hub program detail layout exactly

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Types
interface Step {
  id: string;
  title: string;
  description: string;
  order: number;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  hasAssignment?: boolean;
}

interface Week {
  id: string;
  title: string;
  weekNumber: number;
  steps: Step[];
}

interface Program {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  weeks: Week[];
}

interface Enrollment {
  id: string;
  odId: string;
  progress: number;
  currentWeek: number;
  currentStep: number;
  completedSteps: string[];
}

// Circular Progress Ring (for progress display)
const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ progress, size = 80 }) => {
  const strokeWidth = size > 60 ? 8 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a2332"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#5dade2"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {progress === 100 ? (
          <svg className="w-6 h-6 text-[#5dade2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
          </svg>
        ) : (
          <span className="text-white font-bold text-sm">{progress}%</span>
        )}
      </div>
    </div>
  );
};

// Linear Progress Bar
const LinearProgress: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-2 bg-[#1a2332] rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#5dade2] rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-[#5dade2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
      </svg>
      <span className="text-white font-bold">{progress}%</span>
    </div>
  </div>
);

// Section Tab (Week Tab)
const SectionTab: React.FC<{
  week: Week;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}> = ({ week, isActive, isCompleted, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
      transition-all duration-200
      ${isActive 
        ? 'bg-[#5dade2] text-white shadow-lg shadow-[#5dade2]/20' 
        : isCompleted
          ? 'bg-[#1a2332] text-white border border-[#5dade2]/30'
          : 'bg-[#1a2332] text-gray-400 hover:text-white hover:bg-[#2a3b52]'
      }
    `}
  >
    {week.title}
    {isCompleted && (
      <svg className="w-4 h-4 text-[#34c38f]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )}
  </button>
);

// Video Player Component
const VideoPlayer: React.FC<{
  videoUrl?: string;
  thumbnail?: string;
  duration?: string;
  currentStep: number;
  totalSteps: number;
}> = ({ videoUrl, thumbnail, duration, currentStep, totalSteps }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract Vimeo ID if it's a Vimeo URL
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = videoUrl ? getVimeoId(videoUrl) : null;
  const thumbnailUrl = thumbnail || (vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : null);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1a2332] aspect-video">
      {isPlaying && vimeoId ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] to-[#0a1628]" />
          )}
          
          {/* Play button overlay */}
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
              <svg className="w-8 h-8 text-[#0a1628] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>

          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-white text-sm font-medium">
              {duration}
            </div>
          )}
        </>
      )}

      {/* Step counter */}
      <div className="absolute bottom-3 right-3 text-[#5dade2] text-sm font-medium">
        {currentStep} of {totalSteps} steps
      </div>
    </div>
  );
};

// Step Card for Carousel
const StepCard: React.FC<{
  step: Step;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}> = ({ step, stepNumber, isActive, isCompleted, onClick }) => {
  // Get Vimeo thumbnail
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const vimeoId = step.videoUrl ? getVimeoId(step.videoUrl) : null;
  const thumbnail = step.videoThumbnail || (vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : null);

  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 w-72 bg-[#1a2332] rounded-xl overflow-hidden text-left
        transition-all duration-200 border-2
        ${isActive 
          ? 'border-[#5dade2] shadow-lg shadow-[#5dade2]/10' 
          : 'border-transparent hover:border-[#2a3b52]'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-[#0a1628]">
        {thumbnail ? (
          <img src={thumbnail} alt={step.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a2332] to-[#0a1628]" />
        )}
        
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0a1628] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-bold text-sm">STEP {stepNumber}</span>
          {isCompleted && (
            <svg className="w-4 h-4 text-[#34c38f]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">{step.title}</p>
      </div>
    </button>
  );
};

// Main Component
const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const carouselRef = useRef<HTMLDivElement>(null);

  // State
  const [program, setProgram] = useState<Program | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch program data
  useEffect(() => {
    // Strong guard - check for undefined, null, empty, or literal "undefined" string
    if (!programId || programId === 'undefined' || !token) {
      setLoading(false);
      return;
    }
    
    const fetchProgram = async () => {
      try {
        setLoading(true);
        
        // Fetch program details
        const programRes = await fetch(`http://localhost:3001/api/v1/programs/${programId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!programRes.ok) throw new Error('Failed to fetch program');
        const programData = await programRes.json();
        setProgram(programData.data);

        // Fetch enrollment
        const enrollmentRes = await fetch('http://localhost:3001/api/v1/programs/user/enrolled', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (enrollmentRes.ok) {
          const enrollmentData = await enrollmentRes.json();
          const myEnrollment = enrollmentData.data?.find(
            (e: any) => e.program?.id === programId || e.programId === programId
          );
          if (myEnrollment) {
            setEnrollment(myEnrollment);
            // Set active week/step based on enrollment
            if (myEnrollment.currentWeek) {
              setActiveWeekIndex(myEnrollment.currentWeek - 1);
            }
            if (myEnrollment.currentStep) {
              setActiveStepIndex(myEnrollment.currentStep - 1);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setError('Failed to load program');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId, token]);

  // Get current week and step
  const currentWeek = program?.weeks?.[activeWeekIndex];
  const currentStep = currentWeek?.steps?.[activeStepIndex];
  const totalSteps = currentWeek?.steps?.length || 0;

  // Check if step is completed
  const isStepCompleted = (stepId: string) => {
    return enrollment?.completedSteps?.includes(stepId) || false;
  };

  // Check if week is completed
  const isWeekCompleted = (week: Week) => {
    return week.steps.every(step => isStepCompleted(step.id));
  };

  // Handle step completion
  const handleMarkComplete = async () => {
    if (!currentStep || !enrollment) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/programs/${programId}/weeks/${currentWeek?.id}/steps/${currentStep.id}/complete`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        // Update local state
        setEnrollment(prev => prev ? {
          ...prev,
          completedSteps: [...(prev.completedSteps || []), currentStep.id],
        } : null);
      }
    } catch (err) {
      console.error('Error marking step complete:', err);
    }
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (activeStepIndex < totalSteps - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else if (activeWeekIndex < (program?.weeks?.length || 0) - 1) {
      setActiveWeekIndex(prev => prev + 1);
      setActiveStepIndex(0);
    }
  };

  // Carousel scroll
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5dade2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <p>{error || 'Program not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-[#5dade2] text-white rounded-lg hover:bg-[#4a9bc9]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400">Program</span>
        <span className="text-gray-600">&gt;</span>
        <span className="text-gray-400">{program.title}</span>
        <span className="text-gray-600">&gt;</span>
        <span className="text-gray-400">{currentWeek?.title}</span>
        <span className="text-gray-600">&gt;</span>
        <span className="text-white font-medium">STEP {activeStepIndex + 1}</span>
      </div>

      {/* Program Header - Logo + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Program Logo Card */}
        <div className="bg-[#1a2332] rounded-xl p-6 flex items-center justify-center">
          {program.thumbnailUrl ? (
            <img src={program.thumbnailUrl} alt={program.title} className="max-h-24 object-contain" />
          ) : (
            <div className="text-center">
              <div className="text-2xl font-bold text-white">THE</div>
              <div className="text-3xl font-bold text-white">INCREDIBLE</div>
              <div className="text-3xl font-bold text-red-500">YOU</div>
              <div className="text-lg font-semibold text-[#5dade2] mt-2">COACH TRAINING</div>
            </div>
          )}
        </div>

        {/* Progress Card */}
        <div className="bg-[#1a2332] rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">Program Progress</h3>
          <LinearProgress progress={enrollment?.progress || 0} />
        </div>
      </div>

      {/* Section Tabs (Weeks) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {program.weeks?.map((week, index) => (
          <SectionTab
            key={week.id}
            week={week}
            isActive={index === activeWeekIndex}
            isCompleted={isWeekCompleted(week)}
            onClick={() => {
              setActiveWeekIndex(index);
              setActiveStepIndex(0);
            }}
          />
        ))}
      </div>

      {/* Main Content - 2 Column Layout */}
      {currentStep && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Step Content */}
          <div className="bg-[#1a2332] rounded-xl p-6 lg:p-8">
            <div className="text-gray-400 text-sm font-medium mb-2">
              STEP {activeStepIndex + 1}
            </div>
            <h2 className="text-[#5dade2] text-xl lg:text-2xl font-bold uppercase mb-4">
              {currentStep.title}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {currentStep.description || 'Watch this video to learn more about this step.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              {currentStep.hasAssignment && (
                <button className="px-6 py-3 bg-[#5dade2] text-white rounded-lg font-medium hover:bg-[#4a9bc9] transition-colors">
                  Assignments
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-[#5dade2] text-white rounded-lg font-medium hover:bg-[#4a9bc9] transition-colors"
              >
                Next Step
              </button>
            </div>

            {/* Completion Status */}
            {isStepCompleted(currentStep.id) ? (
              <div className="flex items-center gap-2 text-[#34c38f] font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Step Completed
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="text-[#5dade2] hover:text-[#7dc8f0] font-medium transition-colors"
              >
                Mark as Complete
              </button>
            )}
          </div>

          {/* Right Column - Video Player */}
          <div>
            <VideoPlayer
              videoUrl={currentStep.videoUrl}
              thumbnail={currentStep.videoThumbnail}
              duration={currentStep.videoDuration}
              currentStep={activeStepIndex + 1}
              totalSteps={totalSteps}
            />
          </div>
        </div>
      )}

      {/* Step Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scrollCarousel('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#5dade2] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#4a9bc9] transition-colors -ml-5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentWeek?.steps?.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              stepNumber={index + 1}
              isActive={index === activeStepIndex}
              isCompleted={isStepCompleted(step.id)}
              onClick={() => setActiveStepIndex(index)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scrollCarousel('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#5dade2] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#4a9bc9] transition-colors -mr-5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
