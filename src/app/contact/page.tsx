'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/Button';

// ★ Примечание: Метаданные для динамических страниц лучше всего задавать в layout или page файле верхнего уровня,
// но для простоты мы опустим их здесь, так как страница клиентская.

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.status === 200) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Очищаем форму
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      console.error('Contact form error:', error);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-3xl/tight md:text-5xl/tight font-headings font-semibold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-neutral-slate md:text-lg">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* --- Левая колонка: Контактные данные --- */}
        <div className="space-y-4 text-neutral-slate">
          <h2 className="text-xl font-semibold text-neutral-ink">Our Details</h2>
          <p><strong>Company:</strong> PREPARING BUSINESS LTD</p>
          <p><strong>Email:</strong> info@shapeai.co.uk</p>
          <p><strong>Phone:</strong> +44 7822016497</p>
          <p>
            We aim to respond to all inquiries within 2 business days.
          </p>
        </div>

        {/* --- Правая колонка: Форма обратной связи --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-slate">Your Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-xl border-neutral-lines px-3 py-2 shadow-sm focus:border-accent focus:ring focus:ring-accent/50" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-slate">Your Email</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-xl border-neutral-lines px-3 py-2 shadow-sm focus:border-accent focus:ring focus:ring-accent/50" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-slate">Message</label>
            <textarea name="message" id="message" required rows={5} value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-xl border-neutral-lines px-3 py-2 shadow-sm focus:border-accent focus:ring focus:ring-accent/50" />
          </div>
          <div>
            <Button type="submit" disabled={status === 'loading'} className="w-full md:w-auto">
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
          {status === 'success' && (
            <p className="text-status-success">Thank you! Your message has been sent.</p>
          )}
          {status === 'error' && (
            <p className="text-status-danger">{errorMessage}</p>
          )}
        </form>
      </div>
    </main>
  );
}