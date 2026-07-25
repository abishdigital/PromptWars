import React, { useState } from 'react';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import BreathingWidget from '../components/Emergency/BreathingWidget';
import GroundingExercise from '../components/Emergency/GroundingExercise';
import AudioPlayer from '../components/Voice/AudioPlayer';
import { ShieldAlert, PhoneCall, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

const EmergencyPage = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [triggers, setTriggers] = useState(['Severe Urge']);

  const handleActivateEmergency = async () => {
    setLoading(true);
    try {
      const res = await api.post('/emergency/trigger', {
        triggers,
        notes: 'Emergency button clicked from client dashboard',
      });
      if (res.data.success) {
        setEmergencyData(res.data.data);
        setActive(true);
      }
    } catch (err) {
      console.error('Emergency trigger failed:', err.message);
      setActive(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (emergencyData?.emergencyLog?._id) {
      try {
        await api.put(`/emergency/${emergencyData.emergencyLog._id}/resolve`, {
          notes: 'Resolved by user after grounding exercise',
        });
      } catch (err) {
        console.error('Resolve error:', err.message);
      }
    }
    setActive(false);
    setEmergencyData(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-white">Emergency Crisis Protocol</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          If you are experiencing severe cravings, panic, or emotional distress, press below for immediate AI guidance, grounding exercises, and crisis hotline connections.
        </p>
      </div>

      {!active ? (
        /* Large One-Tap Emergency Button Card */
        <Card className="text-center py-12 space-y-8 border-rose-500/40 bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-900">
          <div className="max-w-md mx-auto space-y-4">
            <button
              onClick={handleActivateEmergency}
              disabled={loading}
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xl tracking-wider uppercase shadow-2xl shadow-rose-600/40 border-4 border-rose-400/50 flex flex-col items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-12 h-12 animate-bounce" />
              <span>{loading ? 'Activating...' : 'PRESS FOR HELP'}</span>
            </button>
            <p className="text-xs text-rose-300 font-medium">
              Clicking will alert your designated caregiver and generate immediate de-escalation steps.
            </p>
          </div>

          {/* Hotline Bar */}
          <div className="max-w-2xl mx-auto pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="tel:988"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-5 h-5 text-rose-400" />
              <span>Call / Text 988 Lifeline</span>
            </a>
            <a
              href="tel:18006624357"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-5 h-5 text-brand-400" />
              <span>SAMHSA: 1-800-662-4357</span>
            </a>
          </div>
        </Card>
      ) : (
        /* Active Emergency Crisis Mode Interface */
        <div className="space-y-6">
          {/* AI Immediate Guidance */}
          <Card className="border-rose-500/40 bg-slate-900/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <span>AI Emergency De-escalation Guidance</span>
              </div>
              <AudioPlayer text={emergencyData?.aiGuidance} />
            </div>

            <p className="text-base text-slate-100 leading-relaxed italic bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              "{emergencyData?.aiGuidance || 'You are safe right now. Cravings peak and pass like ocean waves. Focus on your breathing and complete the grounding steps below.'}"
            </p>
          </Card>

          {/* Interactive De-escalation Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BreathingWidget />
            <GroundingExercise />
          </div>

          {/* Emergency Resolution Bar */}
          <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 border-emerald-500/30">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="font-bold text-white text-sm">Feeling more centered?</h4>
                <p className="text-xs text-slate-400">You can safely resolve this emergency log when ready.</p>
              </div>
            </div>
            <Button onClick={handleResolve} variant="success" className="gap-2 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>I Am Grounded & Safe</span>
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmergencyPage;
