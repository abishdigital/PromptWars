import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { Home, ShieldAlert } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-4 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-4xl font-black">
        404
      </div>
      <h1 className="text-3xl font-black text-white">Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
        <Link to="/emergency">
          <Button variant="danger" className="gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Page</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
