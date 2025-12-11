import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { apiClient } from '../../api/client';

// ============================================
// ALL 135 BEHAVIORS (9 types × 5 states × 3 each)
// ============================================
const STATE_BEHAVIORS: Record<number, Record<string, string[]>> = {
  1: {
    GRN: ["I accept that \"good enough\" is often enough", "I laugh at my own imperfections", "I inspire through example, not criticism"],
    BLU: ["I hold high standards while allowing for mistakes", "I speak up about what's wrong but offer solutions", "I follow my principles even when inconvenient"],
    YLW: ["I notice errors and feel compelled to point them out", "I have a running mental checklist of what needs improving", "I work harder than others to make sure things are done right"],
    ORG: ["I get frustrated when others don't meet my standards", "I criticize more than I praise", "I feel resentful carrying the burden of responsibility"],
    RED: ["I exempt myself from rules I impose on others", "I become harsh and unforgiving when standards slip", "I become moody and feel nobody understands how hard I try"]
  },
  2: {
    GRN: ["I give without keeping track of what I'm owed", "I take care of my own needs without guilt", "I love others without needing them to need me"],
    BLU: ["I offer help but respect when it's declined", "I express my own needs directly", "I support people while trusting they can handle things"],
    YLW: ["I sense what others need before they ask", "I make myself indispensable to important people", "I show different sides of myself depending on who I'm with"],
    ORG: ["I remind people of what I've done for them", "I give advice even when it's not requested", "I feel hurt when my help isn't appreciated enough"],
    RED: ["I become aggressive when I feel taken for granted", "I manipulate through guilt about all I've sacrificed", "I feel entitled to control those I've helped"]
  },
  3: {
    GRN: ["My worth doesn't depend on my achievements", "I can be vulnerable about my failures", "I help others succeed without needing credit"],
    BLU: ["I work hard but know when to stop", "I'm authentic even when it's not impressive", "I celebrate others' success genuinely"],
    YLW: ["I'm always working on the next achievement", "I adapt my image to what each situation requires", "I compare myself to others to gauge my success"],
    ORG: ["I exaggerate accomplishments to stay impressive", "I cut corners to maintain my successful image", "I dismiss others who might outshine me"],
    RED: ["I deceive others to protect my reputation", "I've become an empty shell just going through motions", "I sabotage anyone who threatens my position"]
  },
  4: {
    GRN: ["I create from a place of fullness, not emptiness", "I find beauty in ordinary moments", "I transform my pain into something that helps others"],
    BLU: ["I express my feelings without being consumed by them", "I appreciate what I have while honoring what I feel", "I connect with others through shared humanity"],
    YLW: ["I feel different from others in ways they don't understand", "I dwell on what's missing in my life", "I express myself to stand out from the crowd"],
    ORG: ["I push people away then feel abandoned", "I wallow in my emotions to prove how deeply I feel", "I resent those who seem to have what I lack"],
    RED: ["I've given up on ever being truly happy", "I demand constant proof that people love me", "I don't know who I'd be without my pain"]
  },
  5: {
    GRN: ["I share my knowledge generously with others", "I engage with life, not just observe it", "I trust my competence without needing more preparation"],
    BLU: ["I balance thinking with doing", "I connect with people while maintaining boundaries", "I contribute my expertise when it's needed"],
    YLW: ["I find social interaction draining even when I enjoy it", "I prefer to observe before participating", "I accumulate knowledge in case I need it later"],
    ORG: ["I withdraw when demands feel overwhelming", "I hoard resources, time, and energy", "I disconnect from feelings to stay functional"],
    RED: ["I've cut myself off from almost everyone", "I reject the world that feels too demanding", "I jump frantically between distractions to escape myself"]
  },
  6: {
    GRN: ["I trust myself to handle whatever comes", "I feel secure even in uncertain situations", "I give others the benefit of the doubt"],
    BLU: ["I prepare reasonably but don't over-worry", "I'm loyal while maintaining my own judgment", "I face fears rather than avoiding them"],
    YLW: ["I scan for what could go wrong in situations", "I seek reassurance from authorities or trusted people", "I question people's motives even when they seem supportive"],
    ORG: ["I suspect hidden agendas in people's actions", "I become defensive when I feel questioned", "I divide people into allies and potential threats"],
    RED: ["I see enemies and conspiracies everywhere", "I attack first to prevent being attacked", "I lash out and blame others to protect my position"]
  },
  7: {
    GRN: ["I find deep satisfaction in simple moments", "I stay present even when things get hard", "I commit fully to what matters most"],
    BLU: ["I pursue joy while honoring responsibilities", "I process difficult emotions instead of avoiding them", "I follow through on commitments even when bored"],
    YLW: ["I keep my options open to avoid missing out", "I reframe negatives into positives quickly", "I plan future experiences to stay excited"],
    ORG: ["I escape into distractions when things get hard", "I become scattered trying to do everything", "I resent anything that limits my freedom"],
    RED: ["I'll do anything to avoid pain or boredom", "I've burned through relationships and experiences", "I become harsh and critical when I can't escape my pain"]
  },
  8: {
    GRN: ["I use my power to lift others up, not control them", "I openly share what I'm struggling with", "I champion causes bigger than myself"],
    BLU: ["I speak directly but make sure people feel respected", "I take responsibility when things go wrong", "I set firm boundaries without intimidating"],
    YLW: ["I take charge of situations automatically", "I decide quickly and expect others to keep up", "I test people before I fully trust them"],
    ORG: ["I raise my intensity until people back down", "I refuse to show weakness even when I'm hurting", "I write people off when they disappoint me"],
    RED: ["Once someone crosses me, I cut them out permanently", "I'd rather blow things up than let someone control me", "I strike first before threats can materialize"]
  },
  9: {
    GRN: ["I'm fully present and engaged with life", "I take action on what matters to me", "I stay connected to myself even in conflict"],
    BLU: ["I express my preferences without causing drama", "I create genuine harmony, not just surface peace", "I balance others' needs with my own"],
    YLW: ["I go along with others to keep the peace", "I avoid topics that might cause conflict", "I tune out when things get too intense"],
    ORG: ["I honestly don't know what I want most of the time", "I become stubborn when pushed too hard", "I disappear emotionally from difficult situations"],
    RED: ["I've checked out completely from my life", "When pushed too far, I snap and blame everyone around me", "I neglect everything, including myself"]
  }
};

// 10 TRIAD COMBINATIONS
const TRIAD_COMBOS: [string, string, string][] = [
  ['GRN', 'BLU', 'YLW'], ['GRN', 'BLU', 'ORG'], ['GRN', 'BLU', 'RED'],
  ['GRN', 'YLW', 'ORG'], ['GRN', 'YLW', 'RED'], ['GRN', 'ORG', 'RED'],
  ['BLU', 'YLW', 'ORG'], ['BLU', 'YLW', 'RED'], ['BLU', 'ORG', 'RED'],
  ['YLW', 'ORG', 'RED']
];

// State info with CORRECT names
const STATE_INFO: Record<string, { name: string; color: string }> = {
  GRN: { name: 'Very Good', color: '#22c55e' },
  BLU: { name: 'Good', color: '#3b82f6' },
  YLW: { name: 'Average', color: '#eab308' },
  ORG: { name: 'Below Average', color: '#f97316' },
  RED: { name: 'Destructive', color: '#ef4444' }
};

// Generate DNA code
const generateDnaCode = (primary: string, secondary: string, pct1: number, pct2: number) => {
  return `${primary}-${secondary}-${pct1.toString().padStart(2, '0')}${pct2.toString().padStart(2, '0')}`;
};

// Floating particles component (matching BuildingBlocks)
const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {[...Array(15)].map((_, i) => (
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

// DNA Strand visualization (matching BuildingBlocks)
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

// ============================================
// MAIN COMPONENT
// ============================================
export default function ColorStates() {
  const navigate = useNavigate();
  
  const [phase, setPhase] = useState<'loading' | 'intro' | 'triads' | 'complete'>('loading');
  const [userType, setUserType] = useState<number | null>(null);
  const [currentTriad, setCurrentTriad] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ GRN: 0, BLU: 0, YLW: 0, ORG: 0, RED: 0 });
  const [mostPick, setMostPick] = useState<string | null>(null);
  const [leastPick, setLeastPick] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [history, setHistory] = useState<Array<{ triad: number; most: string; least: string; scores: Record<string, number> }>>([]);
  const [results, setResults] = useState<{ primaryState: string; primaryStatePct: number; secondaryState: string; secondaryStatePct: number } | null>(null);
  const [behaviorIndices] = useState<Record<string, number>>(() => {
    const indices: Record<string, number> = {};
    ['GRN', 'BLU', 'YLW', 'ORG', 'RED'].forEach(state => {
      indices[state] = Math.floor(Math.random() * 3);
    });
    return indices;
  });

  // Shuffle cards for each triad
  const shuffledTriad = useMemo(() => {
    const triad = [...TRIAD_COMBOS[currentTriad]];
    for (let i = triad.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [triad[i], triad[j]] = [triad[j], triad[i]];
    }
    return triad;
  }, [currentTriad]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await apiClient.get('/inner-dna/assessment');
        if (response.data.data?.finalType) {
          setUserType(response.data.data.finalType);
          setPhase('intro');
        } else {
          navigate('/inner-dna');
        }
      } catch (error) {
        navigate('/inner-dna');
      }
    };
    fetchAssessment();
  }, [navigate]);

  const getBehavior = (state: string): string => {
    if (!userType) return '';
    const behaviors = STATE_BEHAVIORS[userType]?.[state];
    if (!behaviors) return '';
    const index = (behaviorIndices[state] + currentTriad) % 3;
    return behaviors[index];
  };

  const handleCardTap = (state: string) => {
    if (isTransitioning) return;
    
    if (!mostPick) {
      setMostPick(state);
    } else if (state !== mostPick) {
      setLeastPick(state);
      
      // Save to history for undo
      setHistory(prev => [...prev, { triad: currentTriad, most: mostPick, least: state, scores: { ...scores } }]);
      
      // Calculate scores
      const triadStates = TRIAD_COMBOS[currentTriad];
      const middleState = triadStates.find(s => s !== state && s !== mostPick);
      const newScores = { ...scores };
      newScores[mostPick] += 2;
      if (middleState) newScores[middleState] += 1;
      setScores(newScores);
      
      setIsTransitioning(true);
      setTimeout(() => {
        if (currentTriad < 9) {
          setCurrentTriad(prev => prev + 1);
          setMostPick(null);
          setLeastPick(null);
          setIsTransitioning(false);
        } else {
          calculateResults(newScores);
        }
      }, 600);
    }
  };

  const handleUndo = () => {
    if (mostPick && !leastPick) {
      setMostPick(null);
    } else if (history.length > 0 && currentTriad > 0) {
      const lastEntry = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setScores(lastEntry.scores);
      setCurrentTriad(lastEntry.triad);
      setMostPick(null);
      setLeastPick(null);
    }
  };

  const calculateResults = (finalScores: Record<string, number>) => {
    const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0];
    const secondary = sorted[1];
    const total = primary[1] + secondary[1];
    
    const calculatedResults = {
      primaryState: primary[0],
      primaryStatePct: Math.round((primary[1] / total) * 100),
      secondaryState: secondary[0],
      secondaryStatePct: Math.round((secondary[1] / total) * 100)
    };
    
    setResults(calculatedResults);
    setPhase('complete');
    saveResults(calculatedResults);
    
    // Trigger confetti
    const colors = ['#5dade2', '#3498db', '#1abc9c', '#2ecc71', '#9b59b6', '#00ffff'];
    setTimeout(() => confetti({ particleCount: 40, spread: 100, origin: { y: 0.5, x: 0.5 }, colors, scalar: 1.5 }), 0);
    setTimeout(() => confetti({ particleCount: 25, spread: 70, origin: { y: 0.3, x: 0.3 }, colors }), 200);
    setTimeout(() => confetti({ particleCount: 25, spread: 70, origin: { y: 0.3, x: 0.7 }, colors }), 400);
  };

  const saveResults = async (data: typeof results) => {
    try {
      await apiClient.post('/inner-dna/color-states/save', data);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  
  // Loading state
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
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
            Calibrating State Analysis...
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

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingParticles />
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, rgba(93,173,226,0.1) 0%, transparent 70%)' }}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="text-8xl mb-6"
            style={{ filter: 'drop-shadow(0 0 30px rgba(93,173,226,0.6))' }}
          >
            🧬
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Operating States
          </motion.h1>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1a2332] rounded-xl p-6 border border-cyan-500/20 mb-8"
          >
            <p className="text-gray-300 text-lg mb-4">10 quick rounds to map your behavioral patterns</p>
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">1</div>
                <p className="text-gray-400">Tap the behavior <span className="text-green-400 font-semibold">MOST</span> like you</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">2</div>
                <p className="text-gray-400">Then tap the one <span className="text-red-400 font-semibold">LEAST</span> like you</p>
              </div>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(93,173,226,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('triads')}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{ x: [-300, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">Begin State Analysis →</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Triads screen
  if (phase === 'triads') {
    return (
      <div className="min-h-screen bg-[#0a1628] py-6 px-4 relative overflow-hidden">
        <FloatingParticles />
        
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
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
              <h1 className="text-2xl font-bold text-white">State Mapping</h1>
            </motion.div>
          </motion.div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentTriad ? 'bg-cyan-400' : 
                  i === currentTriad ? 'bg-cyan-400' : 'bg-gray-700'
                }`}
                animate={i === currentTriad ? { 
                  scale: [1, 1.4, 1],
                  boxShadow: ['0 0 0 0 rgba(6,182,212,0)', '0 0 0 8px rgba(6,182,212,0.3)', '0 0 0 0 rgba(6,182,212,0)']
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
            <span className="text-cyan-400 font-mono font-bold ml-2">{currentTriad + 1}/10</span>
          </div>

          {/* Undo Button */}
          {(mostPick || currentTriad > 0) && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleUndo}
              className="absolute top-6 left-4 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors z-20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Undo</span>
            </motion.button>
          )}

          {/* Instruction - BIG and CLEAR */}
          <motion.div
            key={mostPick ? 'least' : 'most'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            {!mostPick ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl py-4 px-6 inline-block">
                <p className="text-2xl text-green-400 font-bold">
                  👆 Tap MOST like you
                </p>
              </div>
            ) : (
              <motion.div 
                className="bg-red-500/10 border border-red-500/30 rounded-xl py-4 px-6 inline-block"
                animate={{ scale: [1, 1.02, 1], borderColor: ['rgba(239,68,68,0.3)', 'rgba(239,68,68,0.6)', 'rgba(239,68,68,0.3)'] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <p className="text-2xl text-red-400 font-bold">
                  👇 Now tap LEAST like you
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Cards */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {shuffledTriad.map((state, index) => {
                const isSelected = state === mostPick;
                const isLeast = state === leastPick;
                const shouldPulse = mostPick && !leastPick && !isSelected;
                
                return (
                  <motion.div
                    key={`${currentTriad}-${state}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: shouldPulse ? [1, 1.01, 1] : 1,
                      borderColor: shouldPulse ? ['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.2)'] : undefined
                    }}
                    exit={{ opacity: 0, scale: 0.9, x: isSelected ? 0 : 50 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.1,
                      scale: { duration: 1.2, repeat: shouldPulse ? Infinity : 0 }
                    }}
                    onClick={() => !(isSelected && mostPick) && handleCardTap(state)}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'bg-green-500/10 border-green-500 shadow-lg shadow-green-500/20' 
                        : isLeast
                          ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-500/20'
                          : 'bg-[#1a2332] border-[#2a3b52] hover:border-cyan-500/50'
                    } ${isSelected ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: STATE_INFO[state].color }}
                      />
                      <p className="text-white text-lg leading-relaxed flex-1">
                        {getBehavior(state)}
                      </p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                        >
                          ✓ MOST
                        </motion.div>
                      )}
                      {isLeast && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                        >
                          ✗ LEAST
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETION SCREEN - Matching BuildingBlocks style
  if (phase === 'complete' && results) {
    const dnaCode = generateDnaCode(results.primaryState, results.secondaryState, results.primaryStatePct, results.secondaryStatePct);
    
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
                animate={{ rotate: 360 }}
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
            States Mapped
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mb-6"
          >
            Operating frequencies identified
          </motion.p>

          {/* DNA Code Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="relative mb-6"
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
              
              <motion.div className="font-mono text-3xl font-bold tracking-wider">
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
                Strand #3 of 4 • Color States Complete
              </motion.div>
            </div>
          </motion.div>

          {/* Results breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="flex justify-center gap-6 mb-6"
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto border-2"
                style={{ 
                  borderColor: STATE_INFO[results.primaryState].color,
                  backgroundColor: `${STATE_INFO[results.primaryState].color}20`
                }}
              >
                <span className="text-xl font-bold" style={{ color: STATE_INFO[results.primaryState].color }}>
                  {results.primaryStatePct}%
                </span>
              </div>
              <p className="text-white font-medium">{STATE_INFO[results.primaryState].name}</p>
              <p className="text-gray-500 text-xs">Primary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto border-2"
                style={{ 
                  borderColor: STATE_INFO[results.secondaryState].color,
                  backgroundColor: `${STATE_INFO[results.secondaryState].color}20`
                }}
              >
                <span className="text-xl font-bold" style={{ color: STATE_INFO[results.secondaryState].color }}>
                  {results.secondaryStatePct}%
                </span>
              </div>
              <p className="text-white font-medium">{STATE_INFO[results.secondaryState].name}</p>
              <p className="text-gray-500 text-xs">Secondary</p>
            </div>
          </motion.div>

          {/* Progress visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="mb-6"
          >
            <DnaStrand segments={4} activeSegment={3} />
            <p className="text-gray-500 text-sm">1 more sequence to discover</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6 }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(93,173,226,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/inner-dna/subtype-tokens')}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{ x: [-300, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue to Final Strand
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

  return null;
}
