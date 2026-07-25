import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import VoiceInput from '../components/Voice/VoiceInput';
import { HeartHandshake, Smile, Frown, Meh, SmilePlus, CheckCircle2, Sparkles } from 'lucide-react';

const TRIGGER_OPTIONS = [
  'Emotional Stress',
  'Fatigue / Lack of Sleep',
  'Social / Peer Pressure',
  'Environmental Cues',
  'Boredom',
  'Relationship Conflict',
  'Financial Anxiety',
  'Physical Pain',
];

const MOOD_LEVELS = [
  { val: 1, label: 'Very Low', icon: Frown, color: 'text-rose-400 border-rose-500/40 bg-rose-950/20' },
  { val: 2, label: 'Low', icon: Meh, color: 'text-amber-400 border-amber-500/40 bg-amber-950/20' },
  { val: 3, label: 'Neutral', icon: Smile, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20' },
  { val: 4, label: 'Good', icon: SmilePlus, color: 'text-teal-400 border-teal-500/40 bg-teal-950/20' },
  { val: 5, label: 'Great', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20' },
];

const CheckInPage = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(3);
  const [cravingLevel, setCravingLevel] = useState(2);
  const [triggers, setTriggers] = useState([]);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const toggleTrigger = (item) => {
    setTriggers((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  };

  const handleVoiceTranscript = (text) => {
    setNotes((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/checkins', {
        mood,
        cravingLevel,
        triggers,
        sleepHours: Number(sleepHours),
        notes,
      });

      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-1">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Daily Recovery Check-In</h1>
        <p className="text-sm text-slate-400">
          Be honest with yourself. Tracking daily mood and urges strengthens self-awareness and recovery resilience.
        </p>
      </div>

      {result ? (
        /* Check-In Success & AI Feedback Display Card */
        <Card className="space-y-6 border-emerald-500/30">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-white">Check-In Saved!</h3>
              <p className="text-xs text-emerald-300">
                Your sobriety streak is now <span className="font-bold text-white">{result.streak} Days</span>.
              </p>
            </div>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-brand-400 font-bold">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>AI Recovery Coach Feedback</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{result.checkIn.aiFeedback}"
            </p>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Evaluated Risk Score: <strong className="text-white">{result.checkIn.riskScore}/100</strong></span>
              <span>Craving Rating: <strong className="text-white">{result.checkIn.cravingLevel}/10</strong></span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      ) : (
        /* Form */
        <Card className="shadow-2xl">
          {error && <Alert type="danger" message={error} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Mood Selection */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                1. How are you feeling overall today?
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {MOOD_LEVELS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.val;
                  return (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setMood(m.val)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? `${m.color} ring-2 ring-brand-500 scale-105 font-bold`
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Craving Intensity (1-10) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-white">
                  2. Craving / Urge Intensity (1 to 10)
                </label>
                <span className="text-lg font-black text-rose-400">{cravingLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={cravingLevel}
                onChange={(e) => setCravingLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 (No Cravings)</span>
                <span>5 (Moderate Urge)</span>
                <span>10 (Severe Crisis)</span>
              </div>
            </div>

            {/* 3. Triggers Multi-select */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                3. Triggers or Vulnerabilities Identified Today
              </label>
              <div className="flex flex-wrap gap-2">
                {TRIGGER_OPTIONS.map((item) => {
                  const isSelected = triggers.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTrigger(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-brand-600/30 text-brand-300 border-brand-500'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Sleep Hours */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                4. Hours of Restful Sleep Last Night
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* 5. Voice & Text Journal Notes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-white">
                  5. Daily Journal Notes & Thoughts
                </label>
                <VoiceInput onTranscript={handleVoiceTranscript} />
              </div>
              <textarea
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write or click the microphone to speak your thoughts, emotions, or victories today..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? 'Analyzing Check-In...' : 'Submit Daily Check-In'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default CheckInPage;
