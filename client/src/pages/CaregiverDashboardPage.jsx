import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Users, ShieldAlert, Heart, TrendingUp, CheckCircle, Copy, AlertTriangle } from 'lucide-react';

const CaregiverDashboardPage = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCaregiverData();
  }, []);

  const fetchCaregiverData = async () => {
    try {
      const [patientsRes, alertsRes] = await Promise.all([
        api.get('/caregiver/patients'),
        api.get('/caregiver/alerts'),
      ]);

      if (patientsRes.data.success) {
        setPatients(patientsRes.data.patients || []);
        if (patientsRes.data.patients.length > 0) {
          fetchPatientOverview(patientsRes.data.patients[0]._id);
        }
      }
      if (alertsRes.data.success) {
        setAlerts(alertsRes.data.alerts || []);
      }
    } catch (err) {
      console.error('Caregiver data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientOverview = async (patientId) => {
    setSelectedPatient(patientId);
    try {
      const res = await api.get(`/caregiver/patients/${patientId}`);
      if (res.data.success) {
        setPatientDetails(res.data);
      }
    } catch (err) {
      console.error('Fetch patient overview error:', err.message);
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const res = await api.put(`/caregiver/alerts/${alertId}/read`);
      if (res.data.success) {
        setAlerts((prev) =>
          prev.map((a) => (a._id === alertId ? { ...a, read: true } : a))
        );
      }
    } catch (err) {
      console.error('Acknowledge alert error:', err.message);
    }
  };

  const copyCaregiverCode = () => {
    if (user?.caregiverCode) {
      navigator.clipboard.writeText(user.caregiverCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Caregiver Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white">Supporter Dashboard</h1>
          <p className="text-xs text-slate-300 max-w-lg mt-1">
            Monitor recovery progress, daily check-in risk trends, and emergency alerts for individuals who linked you as their caregiver.
          </p>
        </div>

        {/* Caregiver Code Display */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-1.5 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Your Unique Caregiver Code:</span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono font-black text-brand-400">{user?.caregiverCode || 'CG-N/A'}</span>
            <button
              onClick={copyCaregiverCode}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="Copy code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-emerald-400 font-semibold">Copied to clipboard!</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Linked Patients List & Emergency Alert Feed */}
        <div className="space-y-6">
          {/* Linked Patients List */}
          <Card className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" />
              <span>Assigned Individuals ({patients.length})</span>
            </h3>

            {patients.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                No individuals have linked your Caregiver Code yet. Provide your code (<strong className="text-brand-400">{user?.caregiverCode}</strong>) to them.
              </div>
            ) : (
              <div className="space-y-2">
                {patients.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => fetchPatientOverview(p._id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      selectedPatient === p._id
                        ? 'bg-brand-600/20 border-brand-500 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.email}</p>
                    </div>
                    <Badge variant="success">{p.streak} Days</Badge>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Caregiver Emergency Alert Feed */}
          <Card className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Caregiver Alerts ({alerts.length})</span>
            </h3>

            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400">No active alerts recorded.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {alerts.map((a) => (
                  <div
                    key={a._id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      a.severity === 'critical'
                        ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                        : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider">{a.alertType}</span>
                      <span className="text-slate-400">{new Date(a.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="leading-relaxed">{a.message}</p>
                    {!a.read && (
                      <button
                        onClick={() => handleAcknowledgeAlert(a._id)}
                        className="text-xs font-semibold underline text-slate-300 hover:text-white"
                      >
                        Acknowledge Alert
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Selected Patient Overview */}
        <div className="lg:col-span-2 space-y-6">
          {patientDetails ? (
            <>
              {/* Summary Header */}
              <Card className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{patientDetails.patient.name}</h2>
                    <p className="text-xs text-slate-400">{patientDetails.patient.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success" className="text-sm px-3 py-1">
                      {patientDetails.patient.streak} Days Sobriety Streak
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Evaluated Avg Risk</span>
                    <span className="text-2xl font-black text-amber-400">
                      {patientDetails.summaryStats.averageRiskScore} / 100
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Recent Check-Ins</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {patientDetails.summaryStats.recentCheckInCount}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Emergency Logs</span>
                    <span className="text-2xl font-black text-rose-400">
                      {patientDetails.emergencyLogs.length}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Recent Check-Ins Timeline */}
              <Card className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span>Recent Daily Check-Ins</span>
                </h3>

                <div className="space-y-3">
                  {patientDetails.checkIns.map((c) => (
                    <div
                      key={c._id}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-bold">{c.date}</span>
                        <span>Risk Score: <strong className="text-white">{c.riskScore}/100</strong></span>
                      </div>
                      <div className="flex gap-4 text-slate-400">
                        <span>Mood: <strong className="text-emerald-400">{c.mood}/5</strong></span>
                        <span>Craving: <strong className="text-rose-400">{c.cravingLevel}/10</strong></span>
                        <span>Sleep: <strong className="text-indigo-400">{c.sleepHours} hrs</strong></span>
                      </div>
                      {c.notes && (
                        <p className="text-slate-300 italic pt-1 border-t border-slate-800/60">
                          "{c.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="h-64 flex items-center justify-center text-slate-500 text-sm">
              Select an assigned individual from the list to view their recovery overview.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboardPage;
