import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../api/client';

const INSTINCTS = {
  sp: { code: 'SP-X#76', gradient: 'from-amber-500/20 to-amber-600/30', border: 'border-amber-500', glow: 'rgba(245, 158, 11, 0.6)', text: 'text-amber-400' },
  sx: { code: 'SX-G#99', gradient: 'from-rose-500/20 to-rose-600/30', border: 'border-rose-500', glow: 'rgba(244, 63, 94, 0.6)', text: 'text-rose-400' },
  so: { code: 'SO-Y#32', gradient: 'from-blue-500/20 to-blue-600/30', border: 'border-blue-500', glow: 'rgba(59, 130, 246, 0.6)', text: 'text-blue-400' }
};

const BATTLES = [
  { id: 1, left: 'sp', right: 'sx', leftText: "I secure my basics first", rightText: "I chase deep connection first" },
  { id: 2, left: 'sp', right: 'so', leftText: "I protect my resources carefully", rightText: "I stay plugged into my circles" },
  { id: 3, left: 'sx', right: 'so', leftText: "One deep bond beats many", rightText: "Being part of groups energizes me" }
];

const generateDnaCode = (stack: string[]) => {
  const scores = { sp: 0, sx: 0, so: 0 };
  if (stack[0]) scores[stack[0] as keyof typeof scores] = 7;
  if (stack[1]) scores[stack[1] as keyof typeof scores] = 2;
  if (stack[2]) scores[stack[2] as keyof typeof scores] = 1;
  return `SP${String(scores.sp).padStart(2, '0')}-SX${String(scores.sx).padStart(2, '0')}-SO${String(scores.so).padStart(2, '0')}`;
};

const calculateStack = (wins: Record<string, number>): string[] | null => {
  const entries = Object.entries(wins).sort((a, b) => b[1] - a[1]);
  if (entries[0][1] === 1 && entries[1][1] === 1 && entries[2][1] === 1) return null;
  return entries.map(e => e[0]);
};

const FloatingParticle = ({ delay }: { delay: number }) => {
  const bases = ['A', 'T', 'G', 'C'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const startX = Math.random() * 100;
  return (
    <motion.div
      className="absolute text-cyan-500/20 font-mono text-sm pointer-events-none"
      style={{ left: `${startX}%`, top: '100%' }}
      animate={{ y: [0, -800], opacity: [0, 0.3, 0.3, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'linear' }}
    >
      {base}
    </motion.div>
  );
};

const DnaStrand = ({ segments, activeSegment }: { segments: number; activeSegment: number }) => (
  <div className="flex items-center justify-center gap-1 mb-2">
    {Array.from({ length: segments }).map((_, i) => (
      <React.Fragment key={i}>
        <motion.div
          className={`w-3 h-3 rounded-full ${i < activeSegment ? 'bg-cyan-500' : 'bg-gray-700'}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
        {i < segments - 1 && (
          <div className={`w-6 h-0.5 ${i < activeSegment - 1 ? 'bg-cyan-500/50' : 'bg-gray-700/50'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const SubtypeTokens: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'battle' | 'tiebreaker' | 'complete'>('intro');
  const [currentBattle, setCurrentBattle] = useState(0);
  const [wins, setWins] = useState<Record<string, number>>({ sp: 0, sx: 0, so: 0 });
  const [battleResults, setBattleResults] = useState<(string | null)[]>([null, null, null]);
  const [selectedWinner, setSelectedWinner] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stack, setStack] = useState<string[]>([]);
  const [dnaCode, setDnaCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startBattles = () => {
    setPhase('battle');
    setCurrentBattle(0);
    setWins({ sp: 0, sx: 0, so: 0 });
    setBattleResults([null, null, null]);
    setSelectedWinner(null);
    setIsTransitioning(false);
  };

  const handleBattleSelect = (side: 'left' | 'right') => {
    if (isTransitioning) return;
    
    const winner = side === 'left' ? BATTLES[currentBattle].left : BATTLES[currentBattle].right;
    const newWins = { ...wins, [winner]: wins[winner] + 1 };
    setWins(newWins);
    
    const newResults = [...battleResults];
    newResults[currentBattle] = winner;
    setBattleResults(newResults);
    
    setSelectedWinner(side);
    setIsTransitioning(true);

    // Wait for swipe out animation, then move to next
    setTimeout(() => {
      setSelectedWinner(null);
      setIsTransitioning(false);
      
      if (currentBattle < 2) {
        setCurrentBattle(currentBattle + 1);
      } else {
        const calculatedStack = calculateStack(newWins);
        if (calculatedStack === null) {
          setPhase('tiebreaker');
        } else {
          setStack(calculatedStack);
          setDnaCode(generateDnaCode(calculatedStack));
          setPhase('complete');
        }
      }
    }, 600);
  };

  const handleTiebreaker = (dominant: string) => {
    const all = ['sp', 'sx', 'so'];
    const others = all.filter(x => x !== dominant);
    let secondary = '', blind = '';
    for (const battle of BATTLES) {
      if (battle.left === dominant || battle.right === dominant) {
        const opponent = battle.left === dominant ? battle.right : battle.left;
        const battleIndex = battle.id - 1;
        if (battleResults[battleIndex] === dominant) secondary = opponent;
        else blind = opponent;
      }
    }
    if (!secondary) secondary = others[0];
    if (!blind) blind = others.find(x => x !== secondary) || others[1];
    const finalStack = [dominant, secondary, blind];
    setStack(finalStack);
    setDnaCode(generateDnaCode(finalStack));
    setPhase('complete');
  };

  const saveAndContinue = async () => {
    setIsSaving(true);
    try {
      const tokens = {
        sp: stack[0] === 'sp' ? 7 : stack[1] === 'sp' ? 2 : 1,
        sx: stack[0] === 'sx' ? 7 : stack[1] === 'sx' ? 2 : 1,
        so: stack[0] === 'so' ? 7 : stack[1] === 'so' ? 2 : 1
      };
      await apiClient.post('/inner-dna/subtype-tokens/save', { tokens, order: stack, dnaCode });
      navigate('/inner-dna/pre-report');
    } catch (error) {
      console.error('Save error:', error);
      navigate('/inner-dna/pre-report');
    }
  };

  const particles = Array.from({ length: 10 }, (_, i) => <FloatingParticle key={i} delay={i * 0.5} />);

  const currentBattleData = BATTLES[currentBattle];
  const leftInfo = INSTINCTS[currentBattleData?.left as keyof typeof INSTINCTS];
  const rightInfo = INSTINCTS[currentBattleData?.right as keyof typeof INSTINCTS];

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">{particles}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 min-h-screen flex flex-col">
        {phase !== 'complete' && (
          <div className="text-center mb-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2332] border border-cyan-500/30 mb-4">
              <span className="text-cyan-400 text-sm font-mono">STRAND 5 OF 5</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">Instinct Sequence</span>
            </motion.div>
            
            <div className="flex items-center justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((strand) => (
                <React.Fragment key={strand}>
                  <motion.div
                    className={`w-3 h-3 rounded-full ${strand < 5 ? 'bg-cyan-500' : 'bg-cyan-500/50 animate-pulse'}`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: strand * 0.1 }}
                  />
                  {strand < 5 && <div className="w-6 h-0.5 bg-cyan-500/50" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            
            {/* INTRO */}
            {phase === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <motion.div className="text-6xl mb-6" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🧬</motion.div>
                <h1 className="text-2xl font-bold text-white mb-3">Gene Sequence Match</h1>
                <p className="text-gray-400 mb-2">3 quick matches. Pick the statement that's <span className="text-cyan-400">MORE true</span> of you.</p>
                <p className="text-gray-500 text-sm mb-8">Trust your gut. No right or wrong answers.</p>
                <motion.button onClick={startBattles}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Begin Sequence
                </motion.button>
              </motion.div>
            )}

            {/* BATTLE WITH SWIPE CARDS */}
            {phase === 'battle' && (
              <motion.div 
                key={`battle-${currentBattle}`} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="w-full"
              >
                <div className="text-center mb-6">
                  <motion.div 
                    className="text-xl font-bold text-white mb-4" 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    MATCH {currentBattle + 1} OF 3
                  </motion.div>
                  <p className="text-gray-400">Which is <span className="text-cyan-400 font-medium">MORE true</span> of you?</p>
                </div>

                <div className="relative h-[280px] flex items-center justify-center">
                  {/* LEFT CARD */}
                  <motion.button
                    key={`left-${currentBattle}`}
                    onClick={() => handleBattleSelect('left')}
                    disabled={isTransitioning}
                    className={`absolute left-0 w-[45%] p-5 rounded-2xl border-2 bg-gradient-to-br ${leftInfo.gradient} ${leftInfo.border}/50 cursor-pointer`}
                    initial={{ x: -300, opacity: 0, rotate: -10 }}
                    animate={
                      selectedWinner === 'left' 
                        ? { y: -200, opacity: 0, scale: 0.8, rotate: 0 }
                        : selectedWinner === 'right'
                        ? { x: -400, opacity: 0, rotate: -30 }
                        : { x: 0, opacity: 1, rotate: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    whileHover={!isTransitioning ? { scale: 1.05, boxShadow: `0 0 30px ${leftInfo.glow}` } : {}}
                    whileTap={!isTransitioning ? { scale: 0.95 } : {}}
                    style={{ boxShadow: `0 0 20px ${leftInfo.glow}40` }}
                  >
                    <div className={`text-xs font-mono ${leftInfo.text} mb-3 tracking-wider`}>{leftInfo.code}</div>
                    <div className="text-white text-base leading-relaxed">"{currentBattleData.leftText}"</div>
                  </motion.button>

                  {/* VS */}
                  <motion.div 
                    className="text-gray-600 font-bold text-xl z-10"
                    animate={{ scale: [1, 1.2, 1], opacity: isTransitioning ? 0 : 1 }}
                    transition={{ duration: 1, repeat: isTransitioning ? 0 : Infinity }}
                  >
                    VS
                  </motion.div>

                  {/* RIGHT CARD */}
                  <motion.button
                    key={`right-${currentBattle}`}
                    onClick={() => handleBattleSelect('right')}
                    disabled={isTransitioning}
                    className={`absolute right-0 w-[45%] p-5 rounded-2xl border-2 bg-gradient-to-br ${rightInfo.gradient} ${rightInfo.border}/50 cursor-pointer`}
                    initial={{ x: 300, opacity: 0, rotate: 10 }}
                    animate={
                      selectedWinner === 'right' 
                        ? { y: -200, opacity: 0, scale: 0.8, rotate: 0 }
                        : selectedWinner === 'left'
                        ? { x: 400, opacity: 0, rotate: 30 }
                        : { x: 0, opacity: 1, rotate: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    whileHover={!isTransitioning ? { scale: 1.05, boxShadow: `0 0 30px ${rightInfo.glow}` } : {}}
                    whileTap={!isTransitioning ? { scale: 0.95 } : {}}
                    style={{ boxShadow: `0 0 20px ${rightInfo.glow}40` }}
                  >
                    <div className={`text-xs font-mono ${rightInfo.text} mb-3 tracking-wider`}>{rightInfo.code}</div>
                    <div className="text-white text-base leading-relaxed">"{currentBattleData.rightText}"</div>
                  </motion.button>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-3 mt-4">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      className={`w-4 h-4 rounded-full border-2 ${battleResults[i] !== null ? 'bg-cyan-500 border-cyan-500' : i === currentBattle ? 'border-cyan-400 animate-pulse' : 'border-gray-700'}`}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* TIEBREAKER */}
            {phase === 'tiebreaker' && (
              <motion.div key="tiebreaker" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
                <motion.div className="text-5xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>🎯</motion.div>
                <h2 className="text-xl font-bold text-white mb-2">Final Match</h2>
                <p className="text-gray-400 mb-8">Close results. Pick your <span className="text-cyan-400">strongest</span> pattern:</p>
                <div className="space-y-3">
                  {Object.entries(INSTINCTS).map(([key, info]) => (
                    <motion.button key={key} onClick={() => handleTiebreaker(key)}
                      className={`w-full p-4 rounded-xl border-2 bg-gradient-to-br ${info.gradient} ${info.border}/50 text-left`}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ scale: 1.02, boxShadow: `0 0 25px ${info.glow}` }} 
                      whileTap={{ scale: 0.98 }}>
                      <div className={`text-xs font-mono ${info.text} mb-1`}>{info.code}</div>
                      <div className="text-white text-sm">
                        {key === 'sp' && '"I secure my basics first"'}
                        {key === 'sx' && '"I chase deep connection first"'}
                        {key === 'so' && '"I stay plugged into my circles"'}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMPLETE */}
            {phase === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Sequence Complete
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 mb-8"
                >
                  Final genetic marker decoded successfully
                </motion.p>

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
                      Strand #5 of 5 • Instinct Pattern Complete
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="mb-8"
                >
                  <DnaStrand segments={5} activeSegment={5} />
                  <p className="text-gray-500 text-sm">All sequences captured</p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(93,173,226,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={saveAndContinue}
                  disabled={isSaving}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg relative overflow-hidden group disabled:opacity-50"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="relative z-10">{isSaving ? 'Saving...' : 'Generate DNA Report'}</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SubtypeTokens;
