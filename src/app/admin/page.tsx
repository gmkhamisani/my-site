'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blog');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Post published successfully! It will be live in about 30 seconds.');
        setTitle('');
        setDescription('');
        setContent('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to publish');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-serif font-semibold mb-6 text-center">Admin Login</h1>
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
        <h1 className="text-2xl font-serif font-semibold">Create New Post</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-sm text-[var(--secondary)] hover:text-[var(--accent)]"
        >
          Logout
        </button>
      </div>

      {status === 'success' ? (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
          <p className="text-green-800 dark:text-green-200 font-medium mb-2">{message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-green-700 dark:text-green-300 underline"
          >
            Create another post
          </button>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your post title"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="Blog">Blog</option>
              <option value="Essays">Essays</option>
              <option value="Short">Short</option>
              <option value="Op-Ed">Op-Ed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description for the homepage"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here... You can use Markdown!"
              rows={12}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y font-mono text-sm"
            />
            <p className="text-xs text-[var(--secondary)] mt-2">
              Supports Markdown: ## for headings, **bold**, *italic*, - for lists
            </p>
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
            {status === 'loading' ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      )}
    </div>
  );
}
