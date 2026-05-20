import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-ai-emerald/10 text-ai-emerald border-ai-emerald/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    danger: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    ai: "bg-ai-purple/10 text-ai-purple border-ai-purple/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
