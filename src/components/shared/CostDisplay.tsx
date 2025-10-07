// src/components/shared/CostDisplay.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Calendar, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CostBreakdown {
  baseGeneration: number;
  wordCost: number;
  daysCost: number;
  additionalOptions: Array<{
    name: string;
    cost: number;
  }>;
}

interface CostDisplayProps {
  totalCost: number;
  breakdown: CostBreakdown;
  userBalance: number;
  canGenerate: boolean;
  isLoading?: boolean;
}

export function CostDisplay({ 
  totalCost, 
  breakdown, 
  userBalance, 
  canGenerate, 
  isLoading = false 
}: CostDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedCost, setAnimatedCost] = useState(totalCost);

  // Анимация изменения стоимости
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCost(totalCost);
    }, 100);
    return () => clearTimeout(timer);
  }, [totalCost]);

  const insufficientTokens = !canGenerate && totalCost > userBalance;
  const additionalOptionsTotal = breakdown.additionalOptions.reduce((sum, opt) => sum + opt.cost, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-card border border-neutral-lines bg-white p-6 shadow-sm"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative grid size-10 place-items-center">
            <div className="absolute inset-0 rounded-full bg-accent/20" />
            <div className="absolute inset-1 rounded-full bg-white" />
            <Coins className="relative size-4 text-accent" />
          </div>
          <div>
            <h3 className="font-headings font-semibold text-neutral-ink">Generation Cost</h3>
            <p className="text-sm text-neutral-slate">Total tokens required</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} breakdown</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="size-4" />
          </motion.div>
        </button>
      </div>

      {/* Общая стоимость */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-neutral-ink">Total Cost</span>
          <motion.div
            key={animatedCost}
            initial={{ scale: 1.1, color: '#10b981' }}
            animate={{ scale: 1, color: insufficientTokens ? '#ef4444' : '#1f2937' }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold"
          >
            {isLoading ? (
              <div className="h-8 w-16 bg-neutral-lines/20 rounded animate-pulse" />
            ) : (
              `${animatedCost} tokens`
            )}
          </motion.div>
        </div>
        
        {/* Статус */}
        <AnimatePresence mode="wait">
          {insufficientTokens && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-700">
                <div className="size-4 rounded-full bg-red-500" />
                <span className="text-sm font-medium">
                  Insufficient tokens. Need {totalCost - userBalance} more.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Детализация */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 pt-4 border-t border-neutral-lines"
          >
            {/* Базовая генерация */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-neutral-slate" />
                <span className="text-sm text-neutral-slate">Base generation</span>
              </div>
              <span className="text-sm font-medium text-neutral-ink">
                {breakdown.baseGeneration} tokens
              </span>
            </div>

            {/* Дни */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-neutral-slate" />
                <span className="text-sm text-neutral-slate">Days</span>
              </div>
              <span className="text-sm font-medium text-neutral-ink">
                {breakdown.daysCost} tokens
              </span>
            </div>

            {/* Дополнительные опции */}
            {additionalOptionsTotal > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-slate">Additional options</span>
                  <span className="text-sm font-medium text-neutral-ink">
                    {additionalOptionsTotal} tokens
                  </span>
                </div>
                <div className="ml-4 space-y-1">
                  {breakdown.additionalOptions.map((option, index) => (
                    <motion.div
                      key={option.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-neutral-slate">{option.name}</span>
                      <span className="text-xs font-medium text-neutral-ink">
                        +{option.cost} tokens
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



