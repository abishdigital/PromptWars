import React, { useState } from 'react';
import { Eye, Ear, Hand, Wind, Utensils, CheckCircle } from 'lucide-react';

const STEPS = [
  { count: 5, sense: 'Things you can SEE', icon: Eye, color: 'text-indigo-400', example: 'Notice colors, shapes, light reflections near you.' },
  { count: 4, sense: 'Things you can TOUCH', icon: Hand, color: 'text-emerald-400', example: 'Feel your clothes, chair texture, or feet on floor.' },
  { count: 3, sense: 'Things you can HEAR', icon: Ear, color: 'text-amber-400', example: 'Listen for room hum, footsteps, distant traffic.' },
  { count: 2, sense: 'Things you can SMELL', icon: Wind, color: 'text-rose-400', example: 'Notice fresh air, coffee aroma, soap fragrance.' },
  { count: 1, sense: 'Thing you can TASTE', icon: Utensils, color: 'text-cyan-400', example: 'Taste a sip of cold water, mint, or fresh breath.' },
];

const GroundingExercise = () => {
  const [completed, setCompleted] = useState([]);

  const toggleStep = (idx) => {
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">5-4-3-2-1 Sensory Grounding</h3>
          <p className="text-xs text-slate-400">Anchor your mind in the present moment through your physical senses.</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {completed.length} / 5 Completed
        </span>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = completed.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 opacity-70'
                  : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50">
                <Icon className={`w-5 h-5 ${step.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    {step.count} - {step.sense}
                  </span>
                  {isDone && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{step.example}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroundingExercise;
