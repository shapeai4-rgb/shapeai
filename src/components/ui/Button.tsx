'use client';

import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils'; // ★★★ 1. Импортируем новую функцию 'cn'

type ButtonProps = {
  as?: React.ElementType;
  locked?: boolean;
} & React.ComponentProps<'button'> & MotionProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ as: Component = 'button', className, children, locked, ...props }, ref) => {
    const MotionComponent = motion(Component);
    return (
      <MotionComponent
        ref={ref}
        whileHover={{ scale: locked ? 1 : 1.03, y: locked ? 0 : -2 }}
        whileTap={{ scale: locked ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        // ★★★ 2. Используем 'cn' вместо 'cx'
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-5 py-3 font-headings font-semibold shadow-soft transition-colors',
          // ★★★ 3. Теперь этот синтаксис абсолютно корректен
          {
            'bg-accent text-white': !locked,
            'bg-neutral-lines text-neutral-slate cursor-not-allowed': locked,
          },
          className
        )}
        {...props}
      >
        {children}
        {locked && <Lock className="ml-2 h-4 w-4" />}
      </MotionComponent>
    );
  }
);

Button.displayName = 'Button';