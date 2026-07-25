import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`glass-card rounded-2xl p-6 text-slate-100 shadow-xl transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:border-slate-600/80 hover:shadow-2xl' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
