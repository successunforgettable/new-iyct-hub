import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';

// State phrases for all 9 types - neutral, non-judgmental wording
const STATE_PHRASES: Record<number, string[]> = {
  1: [
    "I inspire through integrity",
    "I uphold what's right",
    "I correct what's wrong",
    "I criticize what falls short",
    "I condemn all failure"
  ],
  2: [
    "I give freely without needing",
    "I support those I love",
    "I help to feel needed",
    "I give to get",
    "I demand what I'm owed"
  ],
  3: [
    "I succeed by being true",
    "I achieve and inspire",
    "I perform to impress",
    "I win at any cost",
    "I deceive to stay on top"
  ],
  4: [
    "I create from wholeness",
    "I feel deeply and express",
    "I long for what's missing",
    "I dwell in my pain",
    "I'm defined by suffering"
  ],
  5: [
    "I share wisdom freely",
    "I observe and understand",
    "I withdraw to conserve",
    "I detach from everything",
    "I isolate completely"
  ],
  6: [
    "I trust myself and life",
    "I prepare and stay loyal",
    "I scan for what's wrong",
    "I suspect everyone",
    "I see enemies everywhere"
  ],
  7: [
    "I savor each moment",
    "I explore and inspire",
    "I chase the next thing",
    "I escape discomfort",
    "I numb all pain"
  ],
  8: [
    "I lead with quiet power",
    "I protect what matters",
    "I stay ready for anything",
    "I control the battlefield",
    "I eliminate all threats"
  ],
  9: [
    "I'm present and engaged",
    "I create harmony",
    "I keep the peace",
    "I disappear to avoid",
    "I'm numb to everything"
  ]
};

const STATE_COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];
const STATE_CODES = ['GRN', 'BLU', 'YLW', 'ORG', 'RED'];

// Floating DNA particles background
const FloatingDnaParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 6 + 3,
    duration: Math.random() * 15 + 20,
    delay: Math.random() * 5,
    color: ['#06b6d4', '#3b82f6', '#22c55e', '#8b5cf6'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            background: `radial-gradient(circle, ${particle.color}99 0%, ${particle.color}00 70%)`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}66`
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// DNA strand progress indicator
const DnaStrand: React.FC<{ completedStrands: number }> = ({ completedStrands }) => {
  const strands = [
    { id: 1, label: 'RHETI' },
    { id: 2, label: 'Hero' },
    { id: 3, label: 'Blocks' },
    { id: 4, label: 'States' },
    { id: 5, label: 'Tokens' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {strands.map((strand, index) => (
        <React.Fragment key={strand.id}>
          <motion.div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
              index < completedStrands
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : index === completedStrands
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500'
                : 'bg-slate-700/50 text-slate-500'
            }`}
            animate={index === completedStrands ? { 
              scale: [1, 1.1, 1],
              boxShadow: ['0 0 0px #06b6d4', '0 0 20px #06b6d4', '0 0 0px #06b6d4']
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {index < completedStrands ? '✓' : strand.id}
          </motion.div>
          {index < strands.length - 1 && (
            <div className={`w-8 h-1 rounded-full ${index < completedStrands ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// DNA Helix animation
const DnaHelix: React.FC = () => {
  const nucleotides = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <div className="relative w-24 h-36 mx-auto">
      {nucleotides.map((i) => (
        <React.Fragment key={i}>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              boxShadow: '0 0 10px #06b6d4',
              left: '50%',
              top: i * 16
            }}
            animate={{
              x: [Math.sin(i * 0.7) * 30, Math.sin(i * 0.7 + Math.PI) * 30],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              boxShadow: '0 0 10px #8b5cf6',
              left: '50%',
              top: i * 16
            }}
            animate={{
              x: [Math.sin(i * 0.7 + Math.PI) * 30, Math.sin(i * 0.7) * 30],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

// Selection card component
const SelectionCard: React.FC<{
  phrase: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}> = ({ phrase, index, selected, onSelect }) => {
  const color = STATE_COLORS[index];
  
  return (
    <motion.button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected 
          ? 'border-cyan-500 bg-cyan-500/20' 
          : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
      }`}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex items-center gap-3">
        <div 
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            selected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-600'
          }`}
          style={{ borderColor: selected ? color : undefined, backgroundColor: selected ? color : undefined }}
        >
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white text-xs"
            >
              ✓
            </motion.div>
          )}
        </div>
        <span className="text-white font-medium">{phrase}</span>
      </div>
    </motion.button>
  );
};

// Tug of war slider component
const TugOfWarSlider: React.FC<{
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ leftLabel, rightLabel, leftColor, rightColor, value, onChange }) => {
  const leftPercent = 100 - value;
  const rightPercent = value;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-start mb-6">
        {/* Left card */}
        <motion.div 
          className="w-32 p-4 rounded-xl text-center"
          style={{ 
            backgroundColor: `${leftColor}20`,
            border: `2px solid ${leftColor}50`
          }}
          animate={{ scale: leftPercent > 50 ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-xs text-slate-400 mb-1 uppercase">Best Days</div>
          <div className="text-white font-medium text-sm leading-tight">{leftLabel}</div>
          <div className="text-2xl font-bold mt-2" style={{ color: leftColor }}>{leftPercent}%</div>
        </motion.div>

        {/* Right card */}
        <motion.div 
          className="w-32 p-4 rounded-xl text-center"
          style={{ 
            backgroundColor: `${rightColor}20`,
            border: `2px solid ${rightColor}50`
          }}
          animate={{ scale: rightPercent > 50 ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-xs text-slate-400 mb-1 uppercase">Toughest Days</div>
          <div className="text-white font-medium text-sm leading-tight">{rightLabel}</div>
          <div className="text-2xl font-bold mt-2" style={{ color: rightColor }}>{rightPercent}%</div>
        </motion.div>
      </div>

      {/* Slider track */}
      <div className="relative h-12 mb-4">
        {/* Background track */}
        <div className="absolute inset-y-4 inset-x-0 h-4 rounded-full bg-slate-700/50 overflow-hidden">
          {/* Left fill */}
          <motion.div 
            className="absolute left-0 top-0 h-full rounded-l-full"
            style={{ 
              width: `${leftPercent}%`,
              background: `linear-gradient(to right, ${leftColor}, ${leftColor}80)`
            }}
            animate={{ width: `${leftPercent}%` }}
          />
          {/* Right fill */}
          <motion.div 
            className="absolute right-0 top-0 h-full rounded-r-full"
            style={{ 
              width: `${rightPercent}%`,
              background: `linear-gradient(to left, ${rightColor}, ${rightColor}80)`
            }}
            animate={{ width: `${rightPercent}%` }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          min="15"
          max="85"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-4 border-cyan-500 pointer-events-none"
          style={{ left: `calc(${value}% - 16px)` }}
          animate={{ 
            boxShadow: ['0 0 10px #06b6d4', '0 0 20px #06b6d4', '0 0 10px #06b6d4']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <p className="text-center text-slate-400 text-sm">
        ◀ Drag to adjust your split ▶
      </p>
    </div>
  );
};

// Main component
const ColorStates: React.FC = () => {
  const navigate = useNavigate();
  
  // Hardcoded to Type 8 for now - will come from previous stages
  const userType = 8;
  const phrases = STATE_PHRASES[userType];
  
  const [stage, setStage] = useState<'intro' | 'best' | 'toughest' | 'same-toughest' | 'slider' | 'complete'>('intro');
  const [bestDaySelection, setBestDaySelection] = useState<number | null>(null);
  const [toughestDaySelection, setToughestDaySelection] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [dnaCode, setDnaCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Generate DNA code when complete
  useEffect(() => {
    if (stage === 'complete' && bestDaySelection !== null && toughestDaySelection !== null) {
      const bestCode = STATE_CODES[bestDaySelection];
      const toughestCode = STATE_CODES[toughestDaySelection];
      const bestPercent = 100 - sliderValue;
      const code = `${bestCode}-${toughestCode}-${bestPercent.toString().padStart(2, '0')}${sliderValue.toString().padStart(2, '0')}`;
      setDnaCode(code);
    }
  }, [stage, bestDaySelection, toughestDaySelection, sliderValue]);

  const handleBestDaySelect = (index: number) => {
    setBestDaySelection(index);
    setTimeout(() => setStage('toughest'), 300);
  };

  const handleToughestDaySelect = (index: number) => {
    setToughestDaySelection(index);
    
    if (index === bestDaySelection) {
      // Same selection - need to ask for second option
      setTimeout(() => setStage('same-toughest'), 300);
    } else {
      setTimeout(() => setStage('slider'), 300);
    }
  };

  const handleSameToughestSelect = (index: number) => {
    setToughestDaySelection(index);
    setTimeout(() => setStage('slider'), 300);
  };

  const handleConfirm = () => {
    setStage('complete');
  };

  const handleContinue = async () => {
    if (bestDaySelection === null || toughestDaySelection === null) return;
    setIsSaving(true);
    try {
      const STATE_CODES_MAP = ["GRN", "BLU", "YLW", "ORG", "RED"];
      const primaryState = STATE_CODES_MAP[bestDaySelection];
      const secondaryState = STATE_CODES_MAP[toughestDaySelection];
      const primaryStatePct = 100 - sliderValue;
      const secondaryStatePct = sliderValue;
      await apiClient.post("/inner-dna/color-states/save", {
        primaryState,
        primaryStatePct,
        secondaryState,
        secondaryStatePct
      });
      navigate("/inner-dna/subtype-tokens");
    } catch (error) {
      console.error("Save error:", error);
      navigate("/inner-dna/subtype-tokens");
    } finally {
      setIsSaving(false);
    }
  };
  // Intro screen
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
        <FloatingDnaParticles />
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <DnaStrand completedStrands={3} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <DnaHelix />
            
            <motion.h1 
              className="text-3xl font-bold mb-2 mt-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
            >
              Operating Modes
            </motion.h1>
            
            <p className="text-slate-400 mb-6">Stage 4 of 5</p>

            <motion.div 
              className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-cyan-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-slate-300">
                We all operate differently on our best days vs our toughest days.
              </p>
              <p className="text-slate-300 mt-3">
                Two quick questions to map your patterns.
              </p>
            </motion.div>

            <motion.button
              onClick={() => setStage('best')}
              className="relative px-10 py-4 rounded-xl font-semibold text-lg overflow-hidden group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative">Let's Go</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Best days selection
  if (stage === 'best') {
    return (
      <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
        <FloatingDnaParticles />
        
        <div className="flex-1 flex flex-col p-6 relative z-10">
          <DnaStrand completedStrands={3} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                On your <span className="text-green-400">BEST</span> days...
              </motion.h2>
              <p className="text-slate-400">How do you typically operate?</p>
            </div>

            <div className="space-y-3">
              {phrases.map((phrase, index) => (
                <SelectionCard
                  key={index}
                  phrase={phrase}
                  index={index}
                  selected={bestDaySelection === index}
                  onSelect={() => handleBestDaySelect(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Toughest days selection
  if (stage === 'toughest') {
    return (
      <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
        <FloatingDnaParticles />
        
        <div className="flex-1 flex flex-col p-6 relative z-10">
          <DnaStrand completedStrands={3} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                On your <span className="text-orange-400">TOUGHEST</span> days...
              </motion.h2>
              <p className="text-slate-400">How do you typically operate?</p>
            </div>

            <div className="space-y-3">
              {phrases.map((phrase, index) => (
                <SelectionCard
                  key={index}
                  phrase={phrase}
                  index={index}
                  selected={toughestDaySelection === index}
                  onSelect={() => handleToughestDaySelect(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Same selection - ask for second option
  if (stage === 'same-toughest') {
    const remainingPhrases = phrases.filter((_, index) => index !== bestDaySelection);
    const remainingIndices = phrases.map((_, index) => index).filter(index => index !== bestDaySelection);

    return (
      <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
        <FloatingDnaParticles />
        
        <div className="flex-1 flex flex-col p-6 relative z-10">
          <DnaStrand completedStrands={3} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="text-center mb-8">
              <motion.div
                className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-slate-400 text-sm">You selected the same for both</p>
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                What's your <span className="text-orange-400">second</span> most common mode?
              </motion.h2>
            </div>

            <div className="space-y-3">
              {remainingIndices.map((originalIndex, i) => (
                <SelectionCard
                  key={originalIndex}
                  phrase={phrases[originalIndex]}
                  index={originalIndex}
                  selected={toughestDaySelection === originalIndex}
                  onSelect={() => handleSameToughestSelect(originalIndex)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Slider screen
  if (stage === 'slider') {
    return (
      <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
        <FloatingDnaParticles />
        
        <div className="flex-1 flex flex-col p-6 relative z-10">
          <DnaStrand completedStrands={3} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                How do you split your time?
              </motion.h2>
            </div>

            <TugOfWarSlider
              leftLabel={phrases[bestDaySelection!]}
              rightLabel={phrases[toughestDaySelection!]}
              leftColor={STATE_COLORS[bestDaySelection!]}
              rightColor={STATE_COLORS[toughestDaySelection!]}
              value={sliderValue}
              onChange={setSliderValue}
            />

            <motion.button
              onClick={handleConfirm}
              className="mt-12 mx-auto relative px-10 py-4 rounded-xl font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative">Confirm</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
        <FloatingDnaParticles />
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <DnaStrand completedStrands={4} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            {/* DNA helix with glow */}
            <div className="relative mb-8">
              <motion.div
                className="absolute inset-0 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <DnaHelix />
              
              {/* Orbiting particles */}
              {[0, 72, 144, 216, 288].map((degree, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    top: '50%', 
                    left: '50%',
                    background: STATE_COLORS[i],
                    boxShadow: `0 0 10px ${STATE_COLORS[i]}`
                  }}
                  animate={{
                    x: Math.cos((degree * Math.PI) / 180) * 60,
                    y: Math.sin((degree * Math.PI) / 180) * 60,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    scale: { duration: 1.5, repeat: Infinity, delay: i * 0.2 }
                  }}
                />
              ))}
            </div>

            <motion.p
              className="text-cyan-400 text-sm mb-2 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              STRAND #4 OF 5 • OPERATING MODES MAPPED
            </motion.p>

            <motion.h2
              className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Pattern Captured
            </motion.h2>

            {/* DNA Code card */}
            <motion.div
              className="relative bg-slate-800/80 rounded-2xl p-6 mb-8 border border-cyan-500/30 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

              {/* Scanning effect */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute inset-x-0 h-12 bg-gradient-to-b from-cyan-500/30 via-cyan-500/10 to-transparent"
                  animate={{ top: ['-20%', '120%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              <p className="text-slate-400 text-xs mb-3 uppercase tracking-widest font-mono">DNA Sequence Fragment</p>
              
              {/* Animated DNA code */}
              <div className="font-mono text-3xl text-cyan-400 tracking-widest flex justify-center gap-1">
                {dnaCode.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className={char === '-' ? 'text-slate-600' : ''}
                    style={{
                      textShadow: char !== '-' ? '0 0 20px #06b6d4' : 'none'
                    }}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.9 + i * 0.08, type: "spring", stiffness: 200 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* State indicator bar */}
              <motion.div
                className="h-1.5 mt-5 rounded-full overflow-hidden bg-slate-700/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${STATE_COLORS[bestDaySelection!]}, ${STATE_COLORS[toughestDaySelection!]})`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.7, duration: 1.2, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>

            <motion.button
              onClick={handleContinue}
              className="relative w-full py-4 rounded-xl font-semibold text-lg overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative flex items-center justify-center gap-3">
                Continue to Final Strand
                <motion.span
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default ColorStates;
