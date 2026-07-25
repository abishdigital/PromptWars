import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import {
  BookOpen,
  ShieldAlert,
  Bot,
  Activity,
  HeartHandshake,
  Users,
  Lock,
  Mic,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Platform Overview', icon: Activity },
    { id: 'ai-coach', title: 'Gemini AI Recovery Coach', icon: Bot },
    { id: 'emergency', title: 'Emergency Crisis Mode', icon: ShieldAlert },
    { id: 'checkin', title: 'Daily Check-In & Tracking', icon: HeartHandshake },
    { id: 'caregiver', title: 'Caregiver Portal', icon: Users },
    { id: 'education', title: 'Education & Coping Tools', icon: BookOpen },
    { id: 'voice', title: 'Voice Input & Speech', icon: Mic },
    { id: 'security', title: 'Security & Data Privacy', icon: Lock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-brand-500/20 text-brand-500 border border-brand-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Platform Documentation & User Guide
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl">
          Comprehensive guidance on how the Aura Recovery & Prevention Platform leverages AI, real-time risk assessment, crisis intervention, and caregiver support networks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{sec.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Card className="p-6 md:p-8 space-y-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="primary" className="mb-2">Overview</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    About Aura Recovery & Prevention
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Aura Recovery is an intelligent, compassionate web platform engineered to assist individuals in addiction recovery, mental health management, and relapse prevention. By pairing real-time subjective check-in data with Google Gemini AI models, Aura provides continuous, non-judgmental guidance and rapid crisis intervention.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-brand-500" />
                      Patient Centric Design
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Empowers individuals with daily check-ins, urge-surfing guidance, interactive grounding tools, and an empathetic AI recovery coach available 24/7.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      Caregiver Integration
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Enables designated counselors, sponsors, or clinical caregivers to securely monitor risk trends and receive immediate notifications during high-risk events.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'ai-coach' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="info" className="mb-2">AI Architecture</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Google Gemini AI Recovery Coach
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  The AI Recovery Coach is powered by Google Gemini 1.5 Flash models configured with strict clinical safety instructions.
                </p>
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Key Capabilities:</h3>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc pl-5">
                    <li><strong>Conversational Support</strong>: Active listening, empathetic framing, and cognitive behavioral coping strategies.</li>
                    <li><strong>Markdown Formatting</strong>: Structuring responses with clear action steps, bold key takeaways, and bulleted lists.</li>
                    <li><strong>Fallback Resilience</strong>: High-reliability offline fallbacks ensure support remains continuous even during network interruptions.</li>
                    <li><strong>Safety Boundaries</strong>: Never provides medical diagnosis; immediately detects self-harm or crisis keywords and provides iCall (9152987821) and Vandrevala Foundation (1860-2662-345) helpline support.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'emergency' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="danger" className="mb-2">Crisis Intervention</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Emergency Crisis Mode
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Activated via the prominent top navigation button, Emergency Crisis Mode provides immediate de-escalation for intense cravings or acute distress.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                    <h4 className="font-bold text-rose-900 dark:text-rose-300 text-xs mb-1">1. Box Breathing</h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400">Visual animated 4-4-4-4 breathing circle to slow heart rate.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                    <h4 className="font-bold text-rose-900 dark:text-rose-300 text-xs mb-1">2. 5-4-3-2-1 Grounding</h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400">Interactive sensory wizard guiding sight, touch, sound, smell, and taste.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                    <h4 className="font-bold text-rose-900 dark:text-rose-300 text-xs mb-1">3. Caregiver Alert</h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400">Instant alert dispatch to connected caregiver accounts.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'checkin' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="success" className="mb-2">Daily Progress</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Daily Check-In & Risk Analytics
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Daily check-ins log mood, craving intensity (1-10), sleep hours, triggers, and personal reflections.
                </p>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Automated Risk Score Calculation:</h3>
                  <code className="text-xs text-brand-600 dark:text-brand-400 block bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    Risk Score = min(95, max(5, (6 - Mood) * 12 + CravingLevel * 4 + TriggersCount * 5 + SleepPenalty))
                  </code>
                </div>
              </div>
            )}

            {activeSection === 'caregiver' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="primary" className="mb-2">Caregivers</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Caregiver Portal & Code Linking
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Caregivers receive a unique Caregiver Code (e.g. <code>CG-AURA99</code>) upon registration. Patients enter this code in their settings to link accounts safely.
                </p>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="warning" className="mb-2">Education</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Educational Articles & AI Summaries
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Curated evidence-based articles on CBT, urge-surfing, neuroplasticity, and mindfulness. Includes 1-click AI summarization powered by Gemini.
                </p>
              </div>
            )}

            {activeSection === 'voice' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="info" className="mb-2">Accessibility</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Voice Input & Text-to-Speech
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Uses native Web Speech API for voice dictation into the AI chat input and text-to-speech reading of AI coach responses for enhanced accessibility.
                </p>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <Badge variant="success" className="mb-2">Security</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Security & Data Protection
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Built with enterprise-grade security standards including JWT tokens with 7-day expiration, bcrypt password hashing, Helmet HTTP headers, express-rate-limit protection, express-mongo-sanitize for NoSQL injection prevention, and strict Joi schema validation.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
