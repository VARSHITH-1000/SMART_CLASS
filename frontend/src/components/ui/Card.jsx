import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Card({ className, children, hoverEffect = false, ...props }) {
  const Comp = hoverEffect ? motion.div : 'div';
  const hoverProps = hoverEffect ? {
    whileHover: { y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  } : {};

  return (
    <Comp
      className={cn("glass-panel p-6 relative overflow-hidden group", className)}
      {...hoverProps}
      {...props}
    >
      {/* Subtle animated gradient overlay on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-ai-cyan/5 to-ai-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Comp>
  );
}
