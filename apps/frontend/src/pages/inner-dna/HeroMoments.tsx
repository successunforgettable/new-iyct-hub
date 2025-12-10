import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';

interface HeroOption {
  id: string;
  text: string;
  personalityType: number;
  confidence: number;
}

interface Scenario {
  id: string;
  title: string;
  context: string;
  scenario: string;
  options: HeroOption[];
  difficulty: string;
}

interface TypeScore {
  type: number;
  name: string;
  confidence: number;
}

const TYPE_NAMES: Record<number, string> = {
  1: 'Reformer', 2: 'Helper', 3: 'Achiever', 4: 'Individualist',
  5: 'Investigator', 6: 'Sentinel', 7: 'Enthusiast', 8: 'Challenger', 9: 'Peacemaker',
};

const ENCOURAGEMENTS = [
  "Trust your gut instinct 🎯",
  "There's no wrong answer ✨",
  "Be honest with yourself 💫",
  "Your first reaction is often right 🌟",
  "Almost there! Keep going 🔥",
];

// Floating particles component
const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{
          background: `rgba(${93 + Math.random() * 50}, ${173 + Math.random() * 50}, 226, ${0.3 + Math.random() * 0.4})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100 - Math.random() * 200],
          x: [0, (Math.random() - 0.5) * 100],
          opacity: [0, 1, 0],
          scale: [0, 1 + Math.random(), 0],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

// DNA Strand visualization
const DnaStrand = ({ segments, activeSegment }: { segments: number; activeSegment: number }) => (
  <div className="flex justify-center gap-1 mb-4">
    {[...Array(segments)].map((_, i) => (
      <motion.div
        key={i}
        className="relative"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: i < activeSegment ? 1 : 0.3,
          scale: 1,
        }}
        transition={{ delay: i * 0.1, type: 'spring' }}
      >
        <motion.div
          className={`w-8 h-8 rounded-lg ${i < activeSegment 
            ? 'bg-gradient-to-br from-cyan-400 to-blue-500' 
            : 'bg-[#2a3b52]'
          }`}
          animate={i === activeSegment - 1 ? {
            boxShadow: ['0 0 0px rgba(93,173,226,0)', '0 0 20px rgba(93,173,226,0.8)', '0 0 0px rgba(93,173,226,0)'],
          } : {}}
          transition={{ duration: 1, repeat: i === activeSegment - 1 ? Infinity : 0 }}
        />
        {i < activeSegment && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
          >
            ✓
          </motion.div>
        )}
      </motion.div>
    ))}
  </div>
);

export default function HeroMoments() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [scenarioNumber, setScenarioNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [heroScores, setHeroScores] = useState<TypeScore[]>([]);
  const [leadingType, setLeadingType] = useState<{ type: number; confidence: number } | null>(null);
  const [finalType, setFinalType] = useState<number | null>(null);
  const [encouragement, setEncouragement] = useState(ENCOURAGEMENTS[0]);
  const [showConfidenceBoost, setShowConfidenceBoost] = useState(false);
  const [direction, setDirection] = useState(1);

  // DNA Code for completion reveal
  const [dnaCode] = useState(() => {
    const bases = ['A', 'T', 'G', 'C'];
    const seg1 = Array(4).fill(0).map(() => bases[Math.floor(Math.random() * 4)]).join('');
    const seg2 = Math.floor(Math.random() * 9000 + 1000);
    const seg3 = Array(3).fill(0).map(() => bases[Math.floor(Math.random() * 4)]).join('');
    return `${seg1}-${seg2}-${seg3}`;
  });

  useEffect(() => {
    loadNextScenario();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = (intensity: 'small' | 'medium' | 'large' = 'medium') => {
    const config = {
      small: { particleCount: 30, spread: 50 },
      medium: { particleCount: 80, spread: 70 },
      large: { particleCount: 150, spread: 100 },
    };
    confetti({
      ...config[intensity],
      origin: { y: 0.6 },
      colors: ['#5dade2', '#34c38f', '#f0ad4e', '#ffffff'],
    });
  };

  const loadNextScenario = async () => {
    try {
      setIsLoading(true);
      const response = await api.innerDna.getNextHeroScenario();
      
      if (response.success) {
        if (response.data.completed) {
          setCompleted(true);
          setFinalType(response.data.finalType);
          triggerConfetti('large');
        } else {
          setScenario(response.data.scenario);
          setScenarioNumber(response.data.scenarioNumber);
          setLeadingType(response.data.leadingType ? { type: response.data.leadingType, confidence: response.data.currentConfidence } : null);
          
          // Get assessment ID from user's assessment
          const assessmentResponse = await api.innerDna.getAssessment();
          if (assessmentResponse.success) {
            setAssessmentId(assessmentResponse.data.id);
          }
        }
      }
    } catch (err: any) {
      if (err.response?.data?.error === 'Complete RHETI assessment first.') {
        navigate('/inner-dna/rheti');
      } else {
        setError('Failed to load scenario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = async (option: HeroOption) => {
    if (!assessmentId || !scenario || isSubmitting) return;

    setSelectedOption(option.id);
    setDirection(1);

    setTimeout(async () => {
      try {
        setIsSubmitting(true);
        const response = await api.innerDna.submitHeroAnswer(
          assessmentId,
          scenario.id,
          option.id,
          option.personalityType,
          option.confidence
        );

        if (response.success) {
          // Show confidence boost animation
          if (response.data.currentLeader?.confidence > (leadingType?.confidence || 0)) {
            setShowConfidenceBoost(true);
            setTimeout(() => setShowConfidenceBoost(false), 1500);
            if (response.data.currentLeader.confidence > 0.7) {
              triggerConfetti('small');
            }
          }

          if (response.data.completed) {
            setCompleted(true);
            setFinalType(response.data.finalType);
            triggerConfetti('large');
          } else {
            setScenario(response.data.scenario);
            setScenarioNumber(response.data.scenarioNumber);
            setLeadingType(response.data.currentLeader);
            setSelectedOption(null);
          }
        }
      } catch (err) {
        setError('Failed to submit answer');
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  const handleContinue = () => {
    navigate('/inner-dna/building-blocks');
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading your journey...</p>
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
          <button onClick={loadNextScenario} className="px-6 py-2 rounded-lg text-white" style={{ backgroundColor: '#5dade2' }}>
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Completed state
  if (completed && finalType) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingParticles />
        
        {/* Radial glow */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'radial-gradient(circle at center, rgba(93,173,226,0.15) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ type: 'spring', damping: 12, duration: 1 }}
          className="bg-gradient-to-br from-[#1a2332] to-[#0d1829] border border-cyan-500/30 rounded-3xl p-8 max-w-lg w-full text-center relative overflow-hidden z-10"
        >
          {/* Scanning effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent"
            animate={{ y: [-200, 400] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ height: '100px' }}
          />

          {/* DNA Animation */}
          <motion.div 
            className="relative h-36 mb-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="text-9xl"
              style={{ filter: 'drop-shadow(0 0 40px rgba(93,173,226,0.8))' }}
            >
              🧬
            </motion.div>
            
            {/* Orbiting particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-cyan-400"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 1,
                }}
                style={{
                  transformOrigin: '50px 50px',
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Stage 2 Complete
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mb-8"
          >
            Core Pattern Locked
          </motion.p>

          {/* DNA Code Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="relative mb-8"
          >
            <div className="bg-[#0a1628] rounded-xl p-6 border border-cyan-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-cyan-500/70 uppercase tracking-widest mb-2"
              >
                Classified Genetic Marker
              </motion.div>
              
              <motion.div
                className="font-mono text-3xl font-bold tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {dnaCode.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.05 }}
                    className={char === '-' ? 'text-gray-500' : 'text-cyan-400'}
                    style={{ textShadow: char !== '-' ? '0 0 10px rgba(93,173,226,0.8)' : 'none' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.5, duration: 1 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-xs text-gray-500 mt-2"
              >
                Strand #2 of 5 • Core Pattern Locked
              </motion.div>
            </div>
          </motion.div>

          {/* Progress visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mb-8"
          >
            <DnaStrand segments={5} activeSegment={2} />
            <p className="text-gray-500 text-sm">3 more sequences to discover</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(93,173,226,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{ x: [-300, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue to Building Blocks
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Main scenario view
  return (
    <div className="min-h-screen py-6 px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header with confidence meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-sm">
              Scenario <span className="text-white font-semibold">{scenarioNumber}</span>
            </span>
            {leadingType && (
              <motion.div
                key={leadingType.confidence}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-gray-400 text-sm">Confidence:</span>
                <span className="text-cyan-400 font-bold">
                  {Math.round(leadingType.confidence * 100)}%
                </span>
              </motion.div>
            )}
          </div>

          {/* Confidence progress bar */}
          <div className="w-full h-3 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#2a3b52' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                backgroundColor: leadingType && leadingType.confidence > 0.7 ? '#34c38f' : '#5dade2' 
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(leadingType?.confidence || 0.11) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Target indicator */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="text-cyan-400">Target: 90%</span>
            <span>100%</span>
          </div>

          {/* Confidence boost animation */}
          <AnimatePresence>
            {showConfidenceBoost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-2 text-green-400 font-semibold"
              >
                ⬆️ Confidence increased!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          {scenario && (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.4 }}
            >
              {/* Scenario Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 mb-4"
                style={{ backgroundColor: '#1a2332', border: '1px solid #2a3b52' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-xl font-bold text-white">{scenario.title}</h2>
                </div>
                <p className="text-gray-300 mb-4">{scenario.context}</p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#0d1829' }}>
                  <p className="text-white font-medium">{scenario.scenario}</p>
                </div>
              </motion.div>

              {/* Options */}
              <div className="space-y-3">
                {scenario.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, borderColor: '#5dade2' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectOption(option)}
                    disabled={isSubmitting}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      selectedOption === option.id ? 'ring-2 ring-cyan-400' : ''
                    }`}
                    style={{
                      backgroundColor: selectedOption === option.id ? '#1e3a5f' : '#1a2332',
                      border: `2px solid ${selectedOption === option.id ? '#5dade2' : '#2a3b52'}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <motion.span
                        animate={selectedOption === option.id ? { scale: [1, 1.2, 1] } : {}}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{
                          backgroundColor: selectedOption === option.id ? '#34c38f' : '#2a3b52',
                          color: selectedOption === option.id ? '#0a1628' : '#5dade2',
                        }}
                      >
                        {selectedOption === option.id ? '✓' : String.fromCharCode(65 + index)}
                      </motion.span>
                      <p className="text-white text-sm">{option.text}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer encouragement */}
        <motion.p
          key={encouragement}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          {encouragement}
        </motion.p>

        <p className="text-gray-600 text-center text-xs mt-4">
          Stage 2 of 5 - Inner DNA Test
        </p>
      </div>
    </div>
  );
}
