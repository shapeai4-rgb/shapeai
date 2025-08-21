// Содержимое для src/components/ui/AnimatedCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      // Анимация при наведении: карточка приподнимется и чуть увеличится
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}