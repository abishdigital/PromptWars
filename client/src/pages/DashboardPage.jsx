import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  Flame,
  HeartHandshake,
  Bot,
  ShieldAlert,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/checkins/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getRiskBadge = (score) => {
    if (score >= 70) return <Badge variant="danger">High Risk ({score}/100)</Badge>;
    if (score >= 40) return <Badge variant="warning font-semibold">Moderate Risk ({score}/100)</Badge>;
    return <Badge variant="success font-semibold">Low Risk ({score}/100)</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-400">Welcome back,</span>
            <span className="text-sm font-bold text-white">{user?.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Recovery Overview
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            "{user?.recoveryGoal || 'Building daily resilience and emotional stability step-by-step.'}"
          </p>
        </div>

        {/* Sobriety Streak Display */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl shrink-0">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Sobriety Streak
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">{user?.streak || 0}</span>
              <span className="text-sm font-medium text-amber-400">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Check In Prompt */}
        <Card hover className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 w-fit rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Daily Check-In</h3>
            <p className="text-xs text-slate-400">
              Log your mood, craving score, triggers, and journal notes for AI risk evaluation.
            </p>
          </div>
          <Link to="/check-in">
            <Button size="md" className="w-full gap-2">
              <Calendar className="w-4 h-4" />
              <span>Log Today's Check-In</span>
            </Button>
          </Link>
        </Card>

        {/* AI Recovery Coach */}
        <Card hover className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Recovery Coach</h3>
            <p className="text-xs text-slate-400">
              Chat or speak with Gemini Recovery Coach for non-judgmental guidance and craving support.
            </p>
          </div>
          <Link to="/ai-coach">
            <Button variant="secondary" size="md" className="w-full gap-2 border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Talk to Recovery Coach</span>
            </Button>
          </Link>
        </Card>

        {/* Crisis Emergency Button */}
        <Card hover className="flex flex-col justify-between space-y-4 border-rose-500/30">
          <div className="space-y-2">
            <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white">Emergency Mode</h3>
            <p className="text-xs text-slate-400">
              One-tap crisis de-escalation, guided 5-4-3-2-1 grounding, box breathing, and caregiver alerts.
            </p>
          </div>
          <Link to="/emergency">
            <Button variant="danger" size="md" className="w-full gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Activate Emergency Protocol</span>
            </Button>
          </Link>
        </Card>
      </div>

      {/* Analytics & Risk Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-400" />
                <span>Mood & Craving Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Tracking daily trends over recent check-ins</p>
            </div>
            {stats && getRiskBadge(stats.averageRiskScore)}
          </div>

          {stats?.recentTrends?.length > 0 ? (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentTrends}>
                  <defs>
                    <linearGradient id="moodColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cravingColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151c28',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    name="Mood (1-5)"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#moodColor)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="craving"
                    name="Craving Level (1-10)"
                    stroke="#f43f5e"
                    fillOpacity={1}
                    fill="url(#cravingColor)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              No check-in data logged yet. Complete your first daily check-in to generate trends.
            </div>
          )}
        </Card>

        {/* Caregiver Status & Quick Stats */}
        <Card className="space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Recovery Summary</span>
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Total Check-Ins</span>
                <span className="font-bold text-white">{stats?.totalCheckIns || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Avg Mood Rating</span>
                <span className="font-bold text-emerald-400">{stats?.averageMood || 0} / 5</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Avg Craving Level</span>
                <span className="font-bold text-rose-400">{stats?.averageCraving || 0} / 10</span>
              </div>
            </div>
          </div>

          {/* Caregiver Link */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>Caregiver Support Status</span>
            </div>
            {user?.caregiverId ? (
              <p className="text-slate-300">Connected to designated caregiver.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-400">No caregiver linked yet. Link a caregiver in settings.</p>
                <Link to="/settings" className="text-brand-400 font-semibold hover:underline block">
                  Link Caregiver Code &rarr;
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
