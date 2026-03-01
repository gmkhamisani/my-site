'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: PageProps) {
  const { slug } = use(params);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blog');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/get-post?slug=${slug}`);
      const data = await res.json();
      if (data.post) {
        setTitle(data.post.title);
        setCategory(data.post.category);
        setDescription(data.post.description || '');
        setContent(data.post.content);
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
    }
  };

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
      const res = await fetch('/api/update-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, category, description, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Post updated successfully! It will be live in about 30 seconds.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to update');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-serif font-semibold mb-6 text-center">Edit Post</h1>
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
        <h1 className="text-2xl font-serif font-semibold">Edit Post</h1>
        <Link href="/admin/posts" className="text-sm text-[var(--secondary)] hover:text-[var(--accent)]">
          ← Back to Posts
        </Link>
      </div>

      {status === 'success' ? (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
          <p className="text-green-800 dark:text-green-200 font-medium mb-2">{message}</p>
          <Link href="/admin/posts" className="text-green-700 dark:text-green-300 underline">
            Back to Posts
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y font-mono text-sm"
            />
          </div>

          {message && (
            <p className={`${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 py-3 bg-[var(--accent)] text-white dark:text-[#1A1A1A] rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/posts"
              className="px-6 py-3 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[#F5F3EF] dark:hover:bg-[#252525]"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
