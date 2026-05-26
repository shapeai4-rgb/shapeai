// src/components/shared/InsufficientTokensModal.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Coins, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useI18n } from '@/i18n/client';

interface InsufficientTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: () => void;
  requiredTokens: number;
  availableTokens: number;
  shortfall: number;
}

export function InsufficientTokensModal({
  isOpen,
  onClose,
  onTopUp,
  requiredTokens,
  availableTokens,
  shortfall
}: InsufficientTokensModalProps) {
  const { messages } = useI18n();

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal open={isOpen} onClose={onClose} title={messages.insufficientTokens.title}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-card p-8 max-w-md mx-auto"
          >
            {/* Иконка и заголовок */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="relative inline-flex items-center justify-center w-16 h-16 mb-4"
              >
                <div className="absolute inset-0 rounded-full bg-red-100" />
                <AlertTriangle className="relative w-8 h-8 text-red-500" />
              </motion.div>
              
              <h2 className="text-xl font-headings font-semibold text-neutral-ink mb-2">
                {messages.insufficientTokens.title}
              </h2>
              <p className="text-neutral-slate">
                {messages.insufficientTokens.message}
              </p>
            </div>

            {/* Детали */}
            <div className="bg-neutral-lines/10 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-slate">{messages.cost.totalRequired}</span>
                  <span className="font-medium text-neutral-ink">{requiredTokens}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-slate">Available {messages.common.tokens}</span>
                  <span className="font-medium text-neutral-ink">{availableTokens}</span>
                </div>
                <div className="border-t border-neutral-lines pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">{messages.cost.insufficient}</span>
                    <span className="font-bold text-red-600">{shortfall} {messages.common.tokens}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                className="flex-1 bg-neutral-lines text-neutral-ink hover:bg-neutral-lines/80"
              >
                {messages.common.back}
              </Button>
              <Button
                onClick={onTopUp}
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                <Coins className="w-4 h-4 mr-2" />
                {messages.insufficientTokens.buyMore}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}



