import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BreathingWidget = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Shift to next phase
            if (phase === 'Inhale') {
              setPhase('Hold (In)');
              return 4;
            } else if (phase === 'Hold (In)') {
              setPhase('Exhale');
              return 4;
            } else if (phase === 'Exhale') {
              setPhase('Hold (Out)');
              return 4;
            } else {
              setPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleBreathing = () => {
    setIsActive((prev) => !prev);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('Inhale');
    setTimer(4);
  };

  return (
    <div className="glass-card rounded-2xl p-6 text-center border border-indigo-500/20">
      <h3 className="text-lg font-bold text-white mb-2">Box Breathing (4-4-4-4)</h3>
      <p className="text-xs text-slate-400 mb-6">
        Calm your nervous system by focusing on deep, rhythmic breathing steps.
      </p>

      {/* Breathing Animated Visualizer Circle */}
      <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full transition-all duration-1000 ${
            phase === 'Inhale'
              ? 'bg-brand-500/30 scale-100 border-4 border-brand-400 animate-pulse'
              : phase === 'Hold (In)'
              ? 'bg-emerald-500/30 scale-105 border-4 border-emerald-400'
              : phase === 'Exhale'
              ? 'bg-indigo-500/20 scale-75 border-4 border-indigo-400'
              : 'bg-slate-700/30 scale-75 border-4 border-slate-500'
          }`}
        />
        <div className="relative z-10">
          <p className="text-2xl font-extrabold text-white tracking-wide mb-1">{phase}</p>
          <p className="text-4xl font-black text-brand-400">{timer}s</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleBreathing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-colors shadow-lg shadow-brand-500/20"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Start Exercise'}</span>
        </button>
        <button
          onClick={resetBreathing}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Reset exercise"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BreathingWidget;
