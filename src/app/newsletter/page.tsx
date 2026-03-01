'use client';

import { useState } from 'react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [preference, setPreference] = useState<'all' | 'digest' | 'both'>('both');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preference }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-4 text-[var(--foreground)]">
        Newsletter
      </h1>
      <p className="text-[var(--secondary)] mb-10">
        Get new posts delivered to your inbox. No spam, unsubscribe anytime.
      </p>

      {status === 'success' ? (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">
            Thanks for subscribing! Check your email to confirm.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--foreground)]">
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-[var(--foreground)]">
              What would you like to receive?
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'New posts only', desc: 'Get notified when I publish something new' },
                { value: 'digest', label: 'Weekly digest', desc: 'A weekly roundup of my best writing' },
                { value: 'both', label: 'Both', desc: 'New posts + weekly digest' },
              ].map((option) => (
                <label key={option.value} className="flex items-start gap-3 p-3 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[#F5F3EF] dark:hover:bg-[#252525] transition-colors">
                  <input
                    type="radio"
                    name="preference"
                    value={option.value}
                    checked={preference === option.value}
                    onChange={(e) => setPreference(e.target.value as typeof preference)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-medium text-[var(--foreground)]">{option.label}</span>
                    <p className="text-sm text-[var(--secondary)]">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {status === 'error' && (
            <p className="text-red-600 dark:text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto px-8 py-3 bg-[var(--accent)] text-white dark:text-[#1A1A1A] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <h2 className="text-lg font-serif font-semibold mb-4 text-[var(--foreground)]">
          Why subscribe?
        </h2>
        <p className="text-[var(--secondary)]">
          I write about things I find interesting — technology, ideas, and life. 
          When you subscribe, you&apos;ll be the first to know when something new is out. 
          No algorithms, no noise — just writing.
        </p>
      </div>
    </div>
  );
}
