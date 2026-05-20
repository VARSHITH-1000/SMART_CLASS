import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50";
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
    ghost: "hover:bg-slate-800 text-slate-300 hover:text-white"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`glass-panel p-6 ${className}`}>
    {children}
  </div>
);
