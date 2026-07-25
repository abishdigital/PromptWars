import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Alert from '../components/UI/Alert';
import { UserPlus, Activity, Heart, Users } from 'lucide-react';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { role: 'patient' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const user = await registerAuth(data);
      if (user?.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30 mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white">Create Your Account</h2>
          <p className="text-sm text-slate-400 mt-1">Begin your personalized recovery journey</p>
        </div>

        <Card className="shadow-2xl">
          {error && <Alert type="danger" message={error} className="mb-6" />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Toggle Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'patient'
                      ? 'bg-brand-600/30 border-brand-500 text-white font-semibold'
                      : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    value="patient"
                    {...register('role')}
                    className="sr-only"
                  />
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Recovering Individual</span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'caregiver'
                      ? 'bg-brand-600/30 border-brand-500 text-white font-semibold'
                      : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    value="caregiver"
                    {...register('role')}
                    className="sr-only"
                  />
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">Caregiver / Supporter</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.name && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.email && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.password && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.password.message}</span>
              )}
            </div>

            {selectedRole === 'patient' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Recovery Goal (Optional)
                </label>
                <input
                  type="text"
                  {...register('recoveryGoal')}
                  placeholder="e.g. 90 days sober & managing stress through mindfulness"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 gap-2"
              size="lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
