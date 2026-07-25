import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Alert from '../components/UI/Alert';
import { LogIn, Activity, UserCheck, ShieldCheck, KeyRound, BookOpen } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      if (user?.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-500 border border-brand-500/30 mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Sign in to access your recovery dashboard
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Panel */}
        <Card className="mb-6 p-4 border-dashed border-brand-500/40 bg-brand-50/50 dark:bg-brand-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              <span>Demo Accounts (1-Click Fill)</span>
            </div>
            <Link
              to="/docs"
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <BookOpen className="w-3 h-3" />
              <span>Guide</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('user@example.com', 'Password123!')}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-medium transition-colors text-center"
            >
              <UserCheck className="w-3.5 h-3.5 mx-auto mb-1 text-brand-500" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('caregiver@example.com', 'Password123!')}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-medium transition-colors text-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-500" />
              <span>Caregiver</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@example.com', 'Password123!')}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-medium transition-colors text-center"
            >
              <Activity className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-500" />
              <span>Admin</span>
            </button>
          </div>
        </Card>

        <Card className="shadow-2xl">
          {error && <Alert type="danger" message={error} className="mb-6" />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.email && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.password && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 gap-2"
              size="lg"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
