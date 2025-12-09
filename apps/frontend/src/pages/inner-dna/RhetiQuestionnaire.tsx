import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';

interface Question {
  id: number;
  optionA: string;
  optionB: string;
  columnA: string;
  columnB: string;
}

interface Assessment {
  id: string;
  status: string;
  rhetiScores: Record<string, number> | null;
  topTypes: number[];
}

interface TopType {
  type: number;
  name: string;
  score: number;
}

const MILESTONES = [9, 18, 27, 36];
const ENCOURAGEMENTS = [
  "Trust your instincts! 🎯",
  "You're doing great! ⭐",
  "Keep going! 💪",
  "Almost there! 🚀",
  "You've got this! 🔥",
  "Perfect pace! ✨",
];

const MILESTONE_MESSAGES: Record<number, { title: string; subtitle: string; emoji: string }> = {
  9: { title: "25% Complete!", subtitle: "Great start! You're finding your rhythm.", emoji: "🌟" },
  18: { title: "Halfway There!", subtitle: "You're crushing it! Keep trusting your gut.", emoji: "🔥" },
  27: { title: "75% Done!", subtitle: "The finish line is in sight!", emoji: "🚀" },
  36: { title: "All Done!", subtitle: "Amazing work! Let's see your results.", emoji: "🎉" },
};

export default function RhetiQuestionnaire() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(36);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{
    rhetiScores: Record<string, number>;
    topTypesWithNames: TopType[];
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [streak, setStreak] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const [encouragement, setEncouragement] = useState(ENCOURAGEMENTS[0]);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  useEffect(() => {
    startAssessment();
  }, []);

  // Rotate encouragements
  useEffect(() => {
    const interval = setInterval(() => {
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5dade2', '#34c38f', '#f0ad4e', '#ffffff'],
    });
  };

  const startAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await api.innerDna.startAssessment();
      if (response.success) {
        setAssessment(response.data.assessment);
        setQuestionNumber(response.data.currentQuestion);
        setCurrentQuestion(response.data.question);
        
        if (response.data.assessment.status !== 'STARTED') {
          setCompleted(true);
          setResults({
            rhetiScores: response.data.assessment.rhetiScores,
            topTypesWithNames: response.data.assessment.topTypes.map((t: number) => ({
              type: t,
              name: getTypeName(t),
              score: response.data.assessment.rhetiScores?.[`type${t}`] || 0,
            })),
          });
        }
      }
    } catch (err) {
      setError('Failed to start assessment');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeName = (type: number): string => {
    const names: Record<number, string> = {
      1: 'Reformer', 2: 'Helper', 3: 'Achiever', 4: 'Individualist',
      5: 'Investigator', 6: 'Sentinel', 7: 'Enthusiast', 8: 'Challenger', 9: 'Peacemaker',
    };
    return names[type] || 'Unknown';
  };

  const handleSelectOption = async (option: 'A' | 'B') => {
    if (!assessment || isSubmitting) return;

    setSelectedOption(option);
    setDirection(1);
    
    // Delay to show selection animation
    setTimeout(async () => {
      try {
        setIsSubmitting(true);
        const response = await api.innerDna.submitAnswer(assessment.id, questionNumber, option);

        if (response.success) {
          setStreak((s) => s + 1);
          
          if (response.data.completed) {
            // Check for final milestone
            setCurrentMilestone(36);
            setShowMilestone(true);
            triggerConfetti();
            
            setTimeout(() => {
              setShowMilestone(false);
              setCompleted(true);
              setResults({
                rhetiScores: response.data.rhetiScores,
                topTypesWithNames: response.data.topTypesWithNames,
              });
            }, 2500);
          } else {
            const nextQ = response.data.nextQuestion;
            
            // Check for milestone
            if (MILESTONES.includes(questionNumber) && questionNumber < 36) {
              setCurrentMilestone(questionNumber);
              setShowMilestone(true);
              triggerConfetti();
              
              setTimeout(() => {
                setShowMilestone(false);
                setQuestionNumber(nextQ);
                setCurrentQuestion(response.data.question);
                setSelectedOption(null);
              }, 2000);
            } else {
              setQuestionNumber(nextQ);
              setCurrentQuestion(response.data.question);
              setSelectedOption(null);
            }
          }
        }
      } catch (err) {
        setError('Failed to submit answer');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleGoBack = async () => {
    if (questionNumber > 1) {
      setDirection(-1);
      const prevQuestion = questionNumber - 1;
      setStreak(0);
      
      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/inner-dna/rheti/question/${prevQuestion}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const data = await response.json();
        if (data.success) {
          setQuestionNumber(prevQuestion);
          setCurrentQuestion(data.data.question);
          setSelectedOption(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleContinueToHeroMoments = () => {
    navigate('/inner-dna/hero-moments');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Preparing your journey...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={startAssessment} className="px-6 py-2 rounded-lg text-white" style={{ backgroundColor: '#5dade2' }}>
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Milestone celebration overlay
  if (showMilestone && currentMilestone) {
    const milestone = MILESTONE_MESSAGES[currentMilestone];
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="text-8xl mb-6"
          >
            {milestone.emoji}
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {milestone.title}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            {milestone.subtitle}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Completed state
  if (completed && results) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0a1628' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#1a2332', border: '1px solid #2a3b52' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl text-center mb-4">
              🎯
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Stage 1 Complete!</h1>
            <p className="text-gray-400 text-center mb-8">Your personality screening is complete</p>
            
            <h2 className="text-lg font-semibold text-white mb-4">We discovered 3 pieces of your Inner DNA!</h2>
            <div className="space-y-3 mb-8">
              {results.topTypesWithNames.map((t, index) => (
                <motion.div
                  key={t.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: index === 0 ? '#1e3a5f' : '#0d1829', border: '1px solid #2a3b52' }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: '#5dade2', color: '#0a1628' }}
                    >
                      {index + 1}
                    </span>
                    <p className="text-white font-medium">🧬 DNA Strand {index + 1}</p>
                  </div>
                  <span className="text-cyan-400 font-semibold">discovered</span>
                </motion.div>
              ))}
            </div>

            <p className="text-gray-400 text-sm mb-6 text-center">
              Next, we'll use Hero Moments scenarios to narrow down your exact type with 90% confidence.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueToHeroMoments}
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: '#5dade2' }}
            >
              Continue to Hero Moments →
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Progress percentage
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              {questionNumber > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoBack}
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#1a2332' }}
                >
                  <span>←</span> Back
                </motion.button>
              )}
              <span className="text-gray-400 text-sm">
                Question <span className="text-white font-semibold">{questionNumber}</span> of {totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {streak >= 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: '#34c38f20', color: '#34c38f' }}
                >
                  🔥 {streak} streak!
                </motion.div>
              )}
              <span className="text-cyan-400 text-sm font-bold">{progressPercent}%</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#2a3b52' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#5dade2' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          
          {/* Encouragement */}
          <motion.p
            key={encouragement}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 text-sm mt-3"
          >
            {encouragement}
          </motion.p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl p-8"
            style={{ backgroundColor: '#1a2332', border: '1px solid #2a3b52' }}
          >
            <h1 className="text-xl font-bold text-white mb-2 text-center">
              Which statement describes you better?
            </h1>
            <p className="text-gray-400 text-center mb-8 text-sm">
              Choose the option that fits you most of the time
            </p>

            {currentQuestion && (
              <div className="space-y-4">
                {/* Option A */}
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: '#5dade2' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption('A')}
                  disabled={isSubmitting}
                  className={`w-full p-5 rounded-lg text-left transition-all duration-200 ${
                    selectedOption === 'A' ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  style={{
                    backgroundColor: selectedOption === 'A' ? '#1e3a5f' : '#0d1829',
                    border: `2px solid ${selectedOption === 'A' ? '#5dade2' : '#2a3b52'}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.span
                      animate={selectedOption === 'A' ? { scale: [1, 1.2, 1] } : {}}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                      style={{
                        backgroundColor: selectedOption === 'A' ? '#34c38f' : '#5dade2',
                        color: '#0a1628',
                      }}
                    >
                      {selectedOption === 'A' ? '✓' : 'A'}
                    </motion.span>
                    <p className="text-white">{currentQuestion.optionA}</p>
                  </div>
                </motion.button>

                {/* Option B */}
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: '#5dade2' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption('B')}
                  disabled={isSubmitting}
                  className={`w-full p-5 rounded-lg text-left transition-all duration-200 ${
                    selectedOption === 'B' ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  style={{
                    backgroundColor: selectedOption === 'B' ? '#1e3a5f' : '#0d1829',
                    border: `2px solid ${selectedOption === 'B' ? '#5dade2' : '#2a3b52'}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.span
                      animate={selectedOption === 'B' ? { scale: [1, 1.2, 1] } : {}}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                      style={{
                        backgroundColor: selectedOption === 'B' ? '#34c38f' : '#5dade2',
                        color: '#0a1628',
                      }}
                    >
                      {selectedOption === 'B' ? '✓' : 'B'}
                    </motion.span>
                    <p className="text-white">{currentQuestion.optionB}</p>
                  </div>
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <p className="text-gray-500 text-center text-sm mt-6">
          Stage 1 of 5 - Inner DNA Test
        </p>
      </div>
    </div>
  );
}
