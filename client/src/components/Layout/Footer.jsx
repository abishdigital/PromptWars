import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-dark-bg/80 text-slate-500 dark:text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            AuraRecovery - AI-Powered Recovery &amp; Prevention Platform
          </p>
          <p className="text-slate-500 mt-1">
            Empathetic, judgment-free support. Not a replacement for emergency medical care.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
          <a href="tel:iCall" className="font-medium text-rose-500 hover:underline">
            iCall Helpline: 9152987821
          </a>
          <span>•</span>
          <a href="tel:14416" className="hover:underline hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            Vandrevala Foundation: 1860-2662-345
          </a>
          <span>•</span>
          <a href="tel:112" className="hover:underline hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            National Emergency: 112
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
