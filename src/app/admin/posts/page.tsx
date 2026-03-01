'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  description?: string;
  category: string;
  date: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState<{ slug: string; status: 'idle' | 'loading' | 'success' | 'error' }>({ slug: '', status: 'idle' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin-posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'gmkhamisani') {
      setIsAuthenticated(true);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeleteStatus({ slug, status: 'loading' });

    try {
      const res = await fetch('/api/admin-posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        setPosts(posts.filter(p => p.slug !== slug));
        setDeleteStatus({ slug, status: 'success' });
      } else {
        setDeleteStatus({ slug, status: 'error' });
      }
    } catch {
      setDeleteStatus({ slug, status: 'error' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-serif font-semibold mb-6 text-center">Manage Posts</h1>
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
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-semibold">Manage Posts</h1>
        <div className="flex gap-4">
          <Link href="/admin" className="text-sm text-[var(--secondary)] hover:text-[var(--accent)]">
            ← Back to Admin
          </Link>
          <Link href="/admin" className="text-sm text-[var(--accent)] hover:underline">
            + New Post
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-[var(--secondary)]">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-[var(--secondary)]">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg hover:bg-[#F5F3EF] dark:hover:bg-[#252525] transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {post.category}
                  </span>
                  <time className="text-xs text-[var(--secondary)]">{post.date}</time>
                </div>
                <h3 className="font-medium text-[var(--foreground)]">{post.title}</h3>
                {post.description && (
                  <p className="text-sm text-[var(--secondary)] mt-1">{post.description}</p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Link
                  href={`/posts/${post.slug}`}
                  className="px-3 py-1 text-sm text-[var(--secondary)] hover:text-[var(--foreground)] border border-[var(--border)] rounded"
                >
                  View
                </Link>
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="px-3 py-1 text-sm text-[var(--accent)] hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  disabled={deleteStatus.slug === post.slug && deleteStatus.status === 'loading'}
                  className="px-3 py-1 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  {deleteStatus.slug === post.slug && deleteStatus.status === 'loading' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <h2 className="text-lg font-serif font-semibold mb-4">Post Timeline</h2>
        {posts.length === 0 ? (
          <p className="text-[var(--secondary)]">No posts yet.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border)]"></div>
            {posts.map((post) => (
              <div key={post.slug} className="relative pl-10 pb-8 last:pb-0">
                <div className="absolute left-2.5 w-3 h-3 rounded-full bg-[var(--accent)]"></div>
                <div className="text-xs text-[var(--secondary)]">{post.date}</div>
                <div className="font-medium">{post.title}</div>
                <div className="text-sm text-[var(--secondary)]">{post.category}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
