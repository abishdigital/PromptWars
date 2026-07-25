import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-dark-bg/80 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <p className="font-semibold text-slate-300">
            AuraRecovery - AI-Powered Recovery & Prevention Platform
          </p>
          <p className="text-slate-500 mt-1">
            Empathetic, judgment-free support. Not a replacement for emergency medical care.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <span className="font-medium text-rose-400">24/7 Crisis Hotline: Call or text 988</span>
          <span>•</span>
          <span>SAMHSA: 1-800-662-4357</span>
          <span>•</span>
          <span>Medical Emergency: 911</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
