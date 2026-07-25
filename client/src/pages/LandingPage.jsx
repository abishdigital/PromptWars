import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, HeartHandshake, Bot, BookOpen, Users, Sparkles } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Recovery & Relapse Prevention</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Your Empathetic Digital Partner in <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Recovery</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed font-normal">
            A comprehensive, judgment-free platform supporting daily sobriety check-ins, real-time AI recovery coaching, instant crisis de-escalation, voice interactivity, and connected caregiver oversight.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="shadow-lg shadow-brand-500/25">
                Start Your Recovery Journey
              </Button>
            </Link>
            <Link to="/emergency">
              <Button variant="danger" size="lg" className="gap-2">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                Emergency Crisis Button
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card hover className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Gemini AI Recovery Coach</h3>
            <p className="text-sm text-slate-400">
              Conversational companion trained to provide empathetic, non-judgmental guidance, craving management techniques, and active listening.
            </p>
          </Card>

          <Card hover className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Daily Check-In & Risk Scoring</h3>
            <p className="text-sm text-slate-400">
              Track mood trends, craving intensity, triggers, and sleep. Receive instant risk evaluation scores and tailored daily coping steps.
            </p>
          </Card>

          <Card hover className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">One-Tap Emergency Protocol</h3>
            <p className="text-sm text-slate-400">
              Immediate crisis de-escalation featuring interactive 5-4-3-2-1 sensory grounding, 4-7-8 box breathing, caregiver alerts, and 988 lifeline.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
