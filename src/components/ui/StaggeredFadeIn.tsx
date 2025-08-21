// Содержимое для src/components/ui/StaggeredFadeIn.tsx
'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

// Определяем варианты анимации для родительского контейнера
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Задержка между появлением дочерних элементов
      staggerChildren: 0.1, // 100ms
    },
  },
};

// Экспортируем варианты для дочерних элементов, чтобы использовать их снаружи
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Изначально невидимы и сдвинуты вниз
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  }, // Появляются и встают на место
};

type StaggeredFadeInProps = {
  children: React.ReactNode;
  className?: string;
};

// Сам компонент-обертка
export function StaggeredFadeIn({ children, className }: StaggeredFadeInProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}