import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { programsAPI } from '@/api/client';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SectionTabs } from '@/components/program/SectionTabs';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { StepCarousel } from '@/components/program/StepCarousel';

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  contentType: 'VIDEO' | 'TEXT' | 'ASSIGNMENT';
  contentHtml: string;
  contentUrl: string;
  durationMinutes: number;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  steps: Step[];
}

interface Program {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  logoUrl?: string;
}

export function ProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const [activeWeekNumber, setActiveWeekNumber] = useState(1);
  const [activeStepNumber, setActiveStepNumber] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const { data: programResponse, isLoading: programLoading } = useQuery({
    queryKey: ['program', programId],
    queryFn: () => programsAPI.getProgramById(programId!),
    enabled: !!programId,
  });

  const { data: weeksResponse, isLoading: weeksLoading } = useQuery({
    queryKey: ['programWeeks', programId],
    queryFn: () => programsAPI.getProgramWeeks(programId!),
    enabled: !!programId,
  });

  const program: Program | undefined = programResponse?.data?.data;
  const weeks: Week[] = weeksResponse?.data?.data || [];

  const isLoading = programLoading || weeksLoading;

  const activeWeek = weeks.find((w) => w.weekNumber === activeWeekNumber);
  const activeStep = activeWeek?.steps?.find((s) => s.stepNumber === activeStepNumber);

  const completedWeeks = weeks
    .filter((week) => week.steps.every((step) => completedSteps.includes(step.id)))
    .map((week) => week.weekNumber);

  const totalSteps = weeks.reduce((acc, week) => acc + week.steps.length, 0);
  const completionPercentage = totalSteps > 0
    ? Math.round((completedSteps.length / totalSteps) * 100)
    : 0;

  const handleWeekChange = (weekNumber: number) => {
    setActiveWeekNumber(weekNumber);
    setActiveStepNumber(1);
  };

  const handleStepClick = (stepNumber: number) => {
    setActiveStepNumber(stepNumber);
  };

  const handleNextStep = () => {
    if (!activeWeek) return;

    const currentStepIndex = activeWeek.steps.findIndex((s) => s.stepNumber === activeStepNumber);
    
    if (currentStepIndex < activeWeek.steps.length - 1) {
      setActiveStepNumber(activeWeek.steps[currentStepIndex + 1].stepNumber);
    } else if (activeWeekNumber < weeks.length) {
      setActiveWeekNumber(activeWeekNumber + 1);
      setActiveStepNumber(1);
    }
  };

  const handlePreviousStep = () => {
    if (!activeWeek) return;

    const currentStepIndex = activeWeek.steps.findIndex((s) => s.stepNumber === activeStepNumber);
    
    if (currentStepIndex > 0) {
      setActiveStepNumber(activeWeek.steps[currentStepIndex - 1].stepNumber);
    } else if (activeWeekNumber > 1) {
      const previousWeek = weeks.find((w) => w.weekNumber === activeWeekNumber - 1);
      if (previousWeek) {
        setActiveWeekNumber(activeWeekNumber - 1);
        setActiveStepNumber(previousWeek.steps[previousWeek.steps.length - 1].stepNumber);
      }
    }
  };

  const handleMarkComplete = () => {
    if (!activeStep) return;
    
    if (!completedSteps.includes(activeStep.id)) {
      setCompletedSteps([...completedSteps, activeStep.id]);
    }
  };

  const handleBack = () => {
    navigate('/programs');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#5dade2] border-r-transparent"></div>
          <p className="text-gray-400 mt-4">Loading program...</p>
        </div>
      </div>
    );
  }

  if (!program || weeks.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Failed to load program</p>
          <button
            onClick={handleBack}
            className="text-[#5dade2] hover:text-[#7dc8f0]"
          >
            ← Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="border-b border-[#2a3b52]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Breadcrumb
            programName={program.name}
            weekNumber={activeWeekNumber}
            stepNumber={activeStepNumber}
            onBack={handleBack}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {program.logoUrl && (
              <img
                src={program.logoUrl}
                alt={program.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">
                {program.name}
              </h1>
              <p className="text-gray-400 mt-1">
                Week {activeWeekNumber} of {weeks.length}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-4xl font-bold text-[#5dade2]">
              {completionPercentage}%
            </p>
            <p className="text-sm text-gray-400">Complete</p>
            <p className="text-xs text-gray-500 mt-1">
              {completedSteps.length} of {totalSteps} steps
            </p>
          </div>
        </div>

        <div className="mb-8">
          <SectionTabs
            weeks={weeks}
            activeWeekNumber={activeWeekNumber}
            completedWeeks={completedWeeks}
            onWeekChange={handleWeekChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52]">
            {activeStep ? (
              <>
                <h2 className="text-3xl font-semibold uppercase text-[#5dade2] mb-6">
                  {activeStep.title}
                </h2>

                <div
                  className="prose prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: activeStep.contentHtml }}
                />

                <div className="flex justify-between mt-8 pt-6 border-t border-[#2a3b52]">
                  <button
                    onClick={handlePreviousStep}
                    disabled={activeWeekNumber === 1 && activeStepNumber === 1}
                    className="px-6 py-3 rounded-lg border border-[#2a3b52] text-white hover:border-[#5dade2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={handleMarkComplete}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      completedSteps.includes(activeStep.id)
                        ? 'bg-[#34c38f] text-white'
                        : 'bg-[#2a3b52] text-white hover:bg-[#3d5170]'
                    }`}
                  >
                    {completedSteps.includes(activeStep.id) ? '✓ Completed' : 'Mark Complete'}
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={
                      activeWeekNumber === weeks.length &&
                      activeStepNumber === activeWeek.steps.length
                    }
                    className="px-6 py-3 rounded-lg bg-[#5dade2] text-white hover:bg-[#7dc8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-400">No step selected</p>
            )}
          </div>

          <div>
            {activeStep && activeStep.contentType === 'VIDEO' && activeStep.contentUrl && (
              <VideoPlayer
                videoUrl={activeStep.contentUrl}
                title={activeStep.title}
                duration={activeStep.durationMinutes}
              />
            )}
          </div>
        </div>

        {activeWeek && (
          <StepCarousel
            steps={activeWeek.steps}
            activeStepNumber={activeStepNumber}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        )}
      </div>
    </div>
  );
}
