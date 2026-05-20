import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-ai-blue text-white shadow-lg shadow-ai-blue/20 hover:shadow-ai-blue/40 border border-transparent",
    neon: "bg-transparent border border-ai-cyan text-ai-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:bg-ai-cyan/10",
    emerald: "bg-ai-emerald text-white shadow-lg shadow-ai-emerald/20 hover:shadow-ai-emerald/40 border border-transparent",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
    destructive: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
Button.displayName = "Button";
