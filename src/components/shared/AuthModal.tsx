'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal'; // Используем наш стилизованный базовый компонент

// Определяем пропсы для компонента
type AuthModalProps = {
  open: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
};

// --- Вспомогательные функции (остаются внутри, т.к. используются только здесь) ---

// Простая, но надежная валидация email без сложных regex
function validateEmail(v: string) {
  const at = v.indexOf('@');
  const dot = v.lastIndexOf('.');
  return at > 0 && dot > at + 1 && dot < v.length - 1;
}

// Оценка надежности пароля для UX
function passwordScore(v: string) {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[a-z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  // Упростим, убрав проверку на спецсимволы для лучшего UX
  return score; // 0..4
}


export function AuthModal({ open, mode, onClose }: AuthModalProps) {
  // --- Состояние компонента (State) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; agree?: string }>({});

  // --- Логика отправки формы ---
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!validateEmail(email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (passwordScore(password) < 3) {
      nextErrors.password = 'Password must be 8+ characters and include letters & numbers';
    }
    if (mode === 'signup' && !agree) {
      nextErrors.agree = 'You must agree to the terms';
    }
    
    setErrors(nextErrors);

    // Если ошибок нет, "отправляем" форму и закрываем модальное окно
    if (Object.keys(nextErrors).length === 0) {
      onClose();
      // В реальном приложении здесь будет вызов API
      alert(`Success! Simulating ${mode === 'login' ? 'login' : 'account creation'}.`);
    }
  }

  // Не рендерим ничего, если модальное окно закрыто
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title={mode === 'login' ? 'Log in to your account' : 'Create an account'}>
      <form onSubmit={submit} className="grid gap-4 text-sm" noValidate>
        {/* Поле Email */}
        <div>
          <label className="font-medium text-neutral-slate">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2"
          />
          {errors.email && <div className="mt-1 text-xs text-status-danger">{errors.email}</div>}
        </div>

        {/* Поле Password */}
        <div>
          <label className="font-medium text-neutral-slate">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2"
          />
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-slate">
            <div className="h-1 flex-1 overflow-hidden rounded bg-neutral-lines">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(passwordScore(password) / 4) * 100}%` }}
              />
            </div>
            <span>Password strength</span>
          </div>
          {errors.password && <div className="mt-1 text-xs text-status-danger">{errors.password}</div>}
        </div>

        {/* Чекбокс "Agree to Terms" (только для регистрации) */}
        {mode === 'signup' && (
          <div className="flex items-center gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-lines text-accent focus:ring-accent"
            />
            <label htmlFor="terms" className="text-xs text-neutral-slate">
              I agree to the <a href="#" className="underline hover:text-neutral-ink">Terms</a> and <a href="#" className="underline hover:text-neutral-ink">Privacy Policy</a>
            </label>
            {errors.agree && <span className="text-xs text-status-danger">· Required</span>}
          </div>
        )}

        {/* Кнопки действий */}
        <div className="mt-2 flex flex-col gap-3">
          <button
            type="submit"
            className="rounded-xl bg-accent px-4 py-2 text-white font-headings font-semibold shadow-soft transition-opacity hover:opacity-90"
          >
            Continue
          </button>
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-t border-neutral-lines" />
            <span className="absolute bg-white px-2 text-xs text-neutral-slate">OR</span>
          </div>
          <button
            type="button"
            className="rounded-xl border border-neutral-lines bg-white px-4 py-2 font-semibold text-neutral-ink transition-colors hover:bg-neutral-mist"
          >
            Continue with Google
          </button>
        </div>
        
        <div className="mt-2 text-center text-xs text-neutral-slate">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" className="ml-1 font-semibold text-accent hover:underline">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </form>
    </Modal>
  );
}