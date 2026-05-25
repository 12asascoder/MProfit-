import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassmorphism?: boolean;
}

export function Card({ className, glassmorphism = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        glassmorphism 
          ? 'bg-surface/70 backdrop-blur-md border-white/20 shadow-card' 
          : 'bg-surface border-border shadow-card',
        className
      )}
      {...props}
    />
  );
}

export interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  glassmorphism?: boolean;
}

export function AnimatedCard({ className, glassmorphism = false, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.06), 0px 4px 8px rgba(0, 0, 0, 0.04)' }}
      className={cn(
        'rounded-2xl border transition-colors',
        glassmorphism 
          ? 'bg-surface/70 backdrop-blur-md border-white/20 shadow-card' 
          : 'bg-surface border-border shadow-card',
        className
      )}
      {...props}
    />
  );
}
