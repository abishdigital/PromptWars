import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', title, message, className = '' }) => {
  const styles = {
    info: {
      bg: 'bg-indigo-950/40 border-indigo-800/50 text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-800/50 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    danger: {
      bg: 'bg-rose-950/40 border-rose-800/50 text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${current.bg} ${className}`}>
      {current.icon}
      <div className="text-sm">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default Alert;
