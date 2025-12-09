import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import confetti from 'canvas-confetti';
import { apiClient } from '../../api/client';

interface Question {
  id: string;
  optionA: string;
  optionB: string;
}

interface Answer {
  questionId: string;
  selected: 'A' | 'B';
}

// Generate mysterious DNA code
const generateDnaCode = () => {
  const bases = ['A', 'T', 'G', 'C'];
  const segment1 = Array(4).fill(0).map(() => bases[Math.floor(Math.random() * 4)]).join('');
  const segment2 = Math.floor(Math.random() * 9000 + 1000);
  const segment3 = Array(3).fill(0).map(() => bases[Math.floor(Math.random() * 4)]).join('');
  return `${segment1}-${segment2}-${segment3}`;
};

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

// Neural link notification
const NeuralNotification = ({ show, message }: { show: boolean; message: string }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-lg border border-cyan-500/30 rounded-full px-6 py-3 flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="w-2 h-2 rounded-full bg-cyan-400"
          />
          <span className="text-cyan-300 text-sm font-medium">{message}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
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

export default function BuildingBlocks() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [dnaCode] = useState(generateDnaCode());
  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [scanLine, setScanLine] = useState(false);
  const [clarity, setClarity] = useState(0);

  // Progress animation
  const progressValue = useMotionValue(0);
  const progressWidth = useTransform(progressValue, [0, 100], ['0%', '100%']);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    const targetProgress = ((currentIndex + (selectedSide ? 1 : 0)) / questions.length) * 100;
    animate(progressValue, targetProgress, { duration: 0.8, ease: 'easeOut' });
  }, [currentIndex, selectedSide, questions.length]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/inner-dna/building-blocks/questions');
      if (response.data.success) {
        setQuestions(response.data.data.questions);
      } else {
        setError(response.data.error || 'Failed to load questions');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const triggerSelectionEffects = (side: 'A' | 'B') => {
    // Sci-fi particle burst
    const colors = side === 'A' ? ['#5dade2', '#3498db', '#00ffff'] : ['#9b59b6', '#8e44ad', '#ff00ff'];
    const x = side === 'A' ? 0.35 : 0.65;
    
    // Main burst
    confetti({
      particleCount: 15,
      spread: 50,
      origin: { y: 0.6, x },
      colors,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ['circle'],
    });

    // Trigger scan line
    setScanLine(true);
    setTimeout(() => setScanLine(false), 500);

    // Update clarity
    setClarity(prev => prev + 2);

    // Show neural notification
    const messages = [
      'Neural Link Strengthened',
      'Pattern Recognized',
      'Genome Decoded +2%',
      'DNA Sequence Locked',
      'Trait Identified',
    ];
    showNotification(messages[currentIndex] || messages[0]);
  };

  const handleSelect = async (selected: 'A' | 'B') => {
    setSelectedSide(selected);
    triggerSelectionEffects(selected);
    
    setTimeout(async () => {
      const newAnswer: Answer = { questionId: questions[currentIndex].id, selected };
      const newAnswers = [...answers.slice(0, currentIndex), newAnswer];
      setAnswers(newAnswers);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedSide(null);
      } else {
        await submitAnswers(newAnswers);
      }
    }, 800);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedSide(null);
      setClarity(prev => Math.max(0, prev - 2));
    }
  };

  const submitAnswers = async (finalAnswers: Answer[]) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post('/inner-dna/building-blocks/answer', { answers: finalAnswers });
      if (response.data.success) {
        setCompleted(true);
        // Epic completion sequence
        const colors = ['#5dade2', '#3498db', '#1abc9c', '#2ecc71', '#9b59b6', '#00ffff'];
        
        // Radial burst
        setTimeout(() => confetti({ particleCount: 40, spread: 100, origin: { y: 0.5, x: 0.5 }, colors, scalar: 1.5 }), 0);
        setTimeout(() => confetti({ particleCount: 25, spread: 70, origin: { y: 0.3, x: 0.3 }, colors }), 200);
        setTimeout(() => confetti({ particleCount: 25, spread: 70, origin: { y: 0.3, x: 0.7 }, colors }), 400);
        setTimeout(() => confetti({ particleCount: 30, spread: 100, origin: { y: 0.7, x: 0.5 }, colors, gravity: 0.5 }), 600);
      } else {
        setError(response.data.error || 'Failed to submit answers');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state with DNA initialization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        
        {/* Scanning lines */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(93,173,226,0.03) 2px, rgba(93,173,226,0.03) 4px)',
          }}
          animate={{ y: [0, 10] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />

        <motion.div className="flex flex-col items-center gap-6 z-10">
          <motion.div
            className="relative"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-8xl filter drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 30px rgba(93,173,226,0.8))' }}>🧬</span>
          </motion.div>
          
          <motion.div
            className="text-cyan-400 text-lg font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing Genome Analysis...
          </motion.div>

          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-8 bg-cyan-500/30 rounded-full"
                animate={{ 
                  scaleY: [1, 1.5, 1],
                  backgroundColor: ['rgba(93,173,226,0.3)', 'rgba(93,173,226,0.8)', 'rgba(93,173,226,0.3)']
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a2332] border border-red-500/30 rounded-xl p-6 max-w-md text-center"
        >
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => navigate('/inner-dna')} className="px-6 py-2 bg-cyan-500 text-white rounded-lg">
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // Completion screen with DNA code reveal
  if (completed) {
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
            Sequence Identified
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mb-8"
          >
            New genetic marker decoded successfully
          </motion.p>

          {/* DNA Code Display - Classified File Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="relative mb-8"
          >
            <div className="bg-[#0a1628] rounded-xl p-6 border border-cyan-500/50 relative overflow-hidden">
              {/* Corner decorations */}
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
                Strand #1 of 4 • Building Block Complete
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
            <DnaStrand segments={4} activeSegment={2} />
            <p className="text-gray-500 text-sm">2 more sequences to discover</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(93,173,226,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/inner-dna/color-states')}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{ x: [-300, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue Analysis
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

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#0a1628] py-6 px-4 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Scan line effect */}
      <AnimatePresence>
        {scanLine && (
          <motion.div
            initial={{ top: 0, opacity: 0.8 }}
            animate={{ top: '100%', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-50"
            style={{ boxShadow: '0 0 20px rgba(93,173,226,0.8)' }}
          />
        )}
      </AnimatePresence>

      {/* Neural notification */}
      <NeuralNotification show={!!notification} message={notification || ''} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span 
              className="text-4xl"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ filter: 'drop-shadow(0 0 15px rgba(93,173,226,0.6))' }}
            >
              🧬
            </motion.span>
            <h1 className="text-3xl font-bold text-white">Building DNA</h1>
          </motion.div>
          <p className="text-gray-400">Trust your instincts • Quick selections</p>
        </motion.div>

        {/* DNA Strand Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <DnaStrand segments={questions.length} activeSegment={currentIndex + (selectedSide ? 1 : 0)} />
        </motion.div>

        {/* Progress bar with liquid fill effect */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-cyan-400"
              />
              Sequence {currentIndex + 1} of {questions.length}
            </span>
            {currentIndex > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                ← Reanalyze
              </motion.button>
            )}
          </div>
          
          <div className="h-3 bg-[#1a2332] rounded-full overflow-hidden relative border border-[#2a3b52]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 relative"
              style={{ width: progressWidth }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Drip effect at end */}
              <motion.div
                className="absolute right-0 top-0 w-3 h-full bg-white/50 rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          {/* Clarity counter */}
          <motion.div 
            className="flex justify-end mt-1"
            animate={clarity > 0 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs text-cyan-400/70 font-mono">+{clarity}% clarity</span>
          </motion.div>
        </motion.div>

        {/* Question Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <div className="space-y-4">
              {/* Option A */}
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  boxShadow: '0 10px 40px rgba(93, 173, 226, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !selectedSide && !isSubmitting && handleSelect('A')}
                disabled={!!selectedSide || isSubmitting}
                className={`w-full relative bg-gradient-to-br from-[#1a2332] to-[#0d1829] border-2 rounded-2xl p-6 text-left transition-all overflow-hidden ${
                  selectedSide === 'A' 
                    ? 'border-cyan-400 scale-[1.02]' 
                    : selectedSide === 'B'
                    ? 'border-[#2a3b52] opacity-30 scale-95'
                    : 'border-[#2a3b52] hover:border-cyan-500/50'
                }`}
              >
                {/* Selection glow */}
                <AnimatePresence>
                  {selectedSide === 'A' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-cyan-400/40"
                      />
                    </>
                  )}
                </AnimatePresence>
                
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 transition-all duration-300 ${
                      selectedSide === 'A' 
                        ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/50' 
                        : 'bg-[#2a3b52] text-gray-400'
                    }`}
                    animate={selectedSide === 'A' ? { 
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedSide === 'A' ? '✓' : 'A'}
                  </motion.div>
                  <p className="text-white text-lg leading-relaxed pt-3">{currentQuestion.optionA}</p>
                </div>
              </motion.button>

              {/* VS Divider */}
              <div className="flex items-center justify-center gap-4 py-2">
                <motion.div 
                  className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="w-12 h-12 rounded-full bg-[#1a2332] border border-[#2a3b52] flex items-center justify-center"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    borderColor: ['rgba(42,59,82,1)', 'rgba(93,173,226,0.5)', 'rgba(42,59,82,1)']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-gray-400 font-bold">VS</span>
                </motion.div>
                <motion.div 
                  className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </div>

              {/* Option B */}
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  boxShadow: '0 10px 40px rgba(155, 89, 182, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !selectedSide && !isSubmitting && handleSelect('B')}
                disabled={!!selectedSide || isSubmitting}
                className={`w-full relative bg-gradient-to-br from-[#1a2332] to-[#0d1829] border-2 rounded-2xl p-6 text-left transition-all overflow-hidden ${
                  selectedSide === 'B' 
                    ? 'border-purple-400 scale-[1.02]' 
                    : selectedSide === 'A'
                    ? 'border-[#2a3b52] opacity-30 scale-95'
                    : 'border-[#2a3b52] hover:border-purple-500/50'
                }`}
              >
                {/* Selection glow */}
                <AnimatePresence>
                  {selectedSide === 'B' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-purple-400/40"
                      />
                    </>
                  )}
                </AnimatePresence>

                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 transition-all duration-300 ${
                      selectedSide === 'B' 
                        ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-500/50' 
                        : 'bg-[#2a3b52] text-gray-400'
                    }`}
                    animate={selectedSide === 'B' ? { 
                      rotate: [0, 10, -10, 5, -5, 0],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedSide === 'B' ? '✓' : 'B'}
                  </motion.div>
                  <p className="text-white text-lg leading-relaxed pt-3">{currentQuestion.optionB}</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-8 flex items-center justify-center gap-2"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⚡
          </motion.span>
          Select the pattern that resonates with you
        </motion.p>
      </div>
    </div>
  );
}
