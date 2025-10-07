'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

// Определяем пропсы для компонента
type AuthModalProps = {
  open: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onModeChange?: (mode: 'login' | 'signup') => void;
};

// --- Вспомогательные функции ---
function passwordScore(v: string) {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[a-z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  return score;
}

export function AuthModal({ open, mode, onClose, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ api?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // --- Логика для РЕГИСТРАЦИИ ---
    if (mode === 'signup') {
      try {
        await axios.post('/api/register', { email, password, firstName, lastName });
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.ok) {
          window.location.href = '/dashboard';
        } else {
          setErrors({ api: "Registration successful, but login failed." });
        }
      // ★ Исправлен тип 'error' и добавлена проверка
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setErrors({ api: error.response.data as string });
        } else {
          setErrors({ api: "An unexpected error occurred." });
        }
      }
    }

    // --- Логика для ВХОДА ---
    if (mode === 'login') {
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.ok && !result.error) {
          window.location.href = '/dashboard';
        } else {
          setErrors({ api: "Invalid email or password." });
        }
      }
      setLoading(false);
    };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title={mode === 'login' ? 'Log in to your account' : 'Create an account'}>
      <form onSubmit={submit} className="grid gap-4 text-sm" noValidate>
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-neutral-slate">First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required type="text" className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2" />
            </div>
            <div>
              <label className="font-medium text-neutral-slate">Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required type="text" className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2" />
            </div>
          </div>
        )}
        
        <div>
          <label className="font-medium text-neutral-slate">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2" />
        </div>
        
        <div>
          <label className="font-medium text-neutral-slate">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2" />
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-slate">
            <div className="h-1 flex-1 overflow-hidden rounded bg-neutral-lines">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(passwordScore(password) / 4) * 100}%` }} />
            </div>
            <span>Password strength</span>
          </div>
        </div>

        {errors.api && (
          <div className="rounded-md bg-status-danger/10 p-3 text-center text-sm text-status-danger">
            {errors.api}
            {errors.api.includes("already registered") && (
              <button type="button" className="ml-1 font-semibold text-accent hover:underline">
                Forgot password?
              </button>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <div className="flex items-center gap-2">
            <input id="terms" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required className="h-4 w-4 rounded border-neutral-lines text-accent focus:ring-accent" />
            <label htmlFor="terms" className="text-xs text-neutral-slate"> I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-ink">Terms</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-ink">Privacy Policy</a></label>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </Button>
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-t border-neutral-lines" />
            <span className="absolute bg-white px-2 text-xs text-neutral-slate">OR</span>
          </div>
          <button type="button" onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="flex items-center justify-center gap-2 rounded-xl border border-neutral-lines bg-white px-4 py-2 font-semibold text-neutral-ink transition-colors hover:bg-neutral-mist">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18"><path d="M17.64 9.20455c0-.63864-.05727-1.25182-.16364-1.84091H9.18182v3.48182h4.79091c-.20455 1.125-.82727 2.07818-1.79546 2.71636v2.25818h2.90818c1.70182-1.56636 2.68409-3.87318 2.68409-6.61545z" fill="#4285F4"></path><path d="M9.18182 18c2.44773 0 4.50182-.81091 6.00182-2.18182l-2.90818-2.25818c-.81091.54364-1.84091.87091-3.09364.87091-2.35591 0-4.365-1.58955-5.08318-3.71773H1.07182v2.33182C2.56455 16.22318 5.61818 18 9.18182 18z" fill="#34A853"></path><path d="M4.09864 10.8141c-.18727-.54364-.29318-1.125-.29318-1.72864s.10591-1.185.29318-1.72864V4.99818H1.07182C.381818 6.40182 0 7.94773 0 9.57091s.381818 3.16909 1.07182 4.57273l3.02682-2.33z" fill="#FBBC05"></path><path d="M9.18182 3.555c1.33636 0 2.53091.45818 3.48182 1.37091l2.58545-2.58545C13.6759.972727 11.6223 0 9.18182 0 5.61818 0 2.56455 1.77682 1.07182 4.99818l3.02682 2.33182c.71818-2.12818 2.72727-3.715 5.08318-3.715z" fill="#EA4335"></path></svg>
            <span>Continue with Google</span>
          </button>
        </div>
        
        <div className="mt-2 text-center text-xs text-neutral-slate">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button 
            type="button" 
            className="ml-1 font-semibold text-accent hover:underline"
            onClick={() => onModeChange?.(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </form>
    </Modal>
  );
}