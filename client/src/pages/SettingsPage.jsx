import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import { Settings as SettingsIcon, UserCheck, Save, Heart } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [recoveryGoal, setRecoveryGoal] = useState(user?.recoveryGoal || '');
  const [caregiverCode, setCaregiverCode] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState(user?.emergencyContacts || []);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateProfile({ name, recoveryGoal, emergencyContacts });
      setMessage('Profile settings updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCaregiver = async (e) => {
    e.preventDefault();
    if (!caregiverCode.trim()) return;
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/link-caregiver', { caregiverCode });
      if (res.data.success) {
        setMessage(res.data.message);
        setCaregiverCode('');
      }
    } catch (err) {
      setError(err.message || 'Failed to link caregiver.');
    } finally {
      setLoading(false);
    }
  };

  const addEmergencyContact = () => {
    if (!emergencyName || !emergencyPhone) return;
    setEmergencyContacts((prev) => [
      ...prev,
      { name: emergencyName, phone: emergencyPhone, relationship: 'Support Contact' },
    ]);
    setEmergencyName('');
    setEmergencyPhone('');
  };

  const removeEmergencyContact = (idx) => {
    setEmergencyContacts((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Account & Recovery Settings</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Manage goals, caregiver pairing, and emergency support network.</p>
        </div>
      </div>

      {message && <Alert type="success" message={message} />}
      {error && <Alert type="danger" message={error} />}

      {/* 1. Recovery Profile */}
      <Card className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-500" />
          <span>Personal Recovery Profile</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Recovery Goal Statement
            </label>
            <input
              type="text"
              value={recoveryGoal}
              onChange={(e) => setRecoveryGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>

          {/* Emergency Contacts */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Trusted Emergency Contacts
            </label>
            <div className="space-y-2 mb-3">
              {emergencyContacts.map((contact, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{contact.name}</span> ({contact.phone})
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEmergencyContact(i)}
                    className="text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Contact Name"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />
                <Button type="button" size="sm" onClick={addEmergencyContact}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </Button>
        </form>
      </Card>

      {/* 2. Link Caregiver */}
      <Card className="space-y-4 border-indigo-500/20">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-500" />
          <span>Caregiver Connection</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Enter the unique Caregiver Code (e.g., <strong className="text-slate-900 dark:text-white">CG-XXXXXX</strong>) provided by your supporter.
        </p>

        <form onSubmit={handleLinkCaregiver} className="flex gap-3">
          <input
            type="text"
            value={caregiverCode}
            onChange={(e) => setCaregiverCode(e.target.value)}
            placeholder="CG-123456"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm uppercase"
          />
          <Button type="submit" disabled={loading || !caregiverCode.trim()}>
            Link Caregiver
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
