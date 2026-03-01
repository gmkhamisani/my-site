'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/lib/config';

interface Settings {
  name: string;
  title: string;
  description: string;
  intro: string;
  email: string;
  github: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    name: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    intro: siteConfig.intro,
    email: siteConfig.social.email,
    github: siteConfig.social.github,
  });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'gmkhamisani') {
      setIsAuthenticated(true);
    } else {
      setMessage('Incorrect password');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Settings saved! Changes will be live in ~30 seconds.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to save settings');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-serif font-semibold mb-6 text-center">Settings Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] text-white dark:text-[#1A1A1A] rounded-lg font-medium hover:opacity-90"
          >
            Login
          </button>
          {message && <p className="text-red-500 text-center">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-semibold">Site Settings</h1>
        <div className="flex gap-4">
          <a href="/admin" className="text-sm text-[var(--secondary)] hover:text-[var(--accent)]">
            ← Back to Admin
          </a>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-[var(--secondary)] hover:text-[var(--accent)]">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Page Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (for SEO)</label>
          <input
            type="text"
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Homepage Intro Text</label>
          <textarea
            value={settings.intro}
            onChange={(e) => setSettings({ ...settings, intro: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Username</label>
            <input
              type="text"
              value={settings.github}
              onChange={(e) => setSettings({ ...settings, github: e.target.value })}
              placeholder="username"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        {message && (
          <p className={`${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 bg-[var(--accent)] text-white dark:text-[#1A1A1A] rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {status === 'loading' ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
