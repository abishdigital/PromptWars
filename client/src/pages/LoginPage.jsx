import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Alert from '../components/UI/Alert';
import { LogIn, Activity } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30 mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to access your recovery dashboard</p>
        </div>

        <Card className="shadow-2xl">
          {error && <Alert type="danger" message={error} className="mb-6" />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.password && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.password.message}</span>
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

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
