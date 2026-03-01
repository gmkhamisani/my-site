import Link from 'next/link';
import { getAllCategories, getAllPosts } from '@/lib/posts';

export default function CategoriesPage() {
  const categories = getAllCategories();
  const posts = getAllPosts();

  const categoryCounts = categories.map((category) => ({
    name: category,
    count: posts.filter((p) => p.category === category).length,
  }));

  const categoryDescriptions: Record<string, string> = {
    Blog: 'Thoughts on technology, code, and digital topics',
    Essays: 'Long-form pieces exploring ideas in depth',
    Short: 'Brief thoughts and observations',
    'Op-Ed': 'Opinions on current events and trends',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-4 text-[var(--foreground)]">
        Categories
      </h1>
      <p className="text-[var(--secondary)] mb-10">
        Browse writing by type.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categoryCounts.map((cat) => (
          <Link
            key={cat.name}
            href={`/categories/${cat.name.toLowerCase().replace(' ', '-')}`}
            className="block p-6 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            <h2 className="text-lg font-serif font-semibold text-[var(--foreground)]">
              {cat.name}
            </h2>
            <p className="text-sm text-[var(--secondary)] mt-1">
              {categoryDescriptions[cat.name] || 'Posts in this category'}
            </p>
            <p className="text-sm text-[var(--accent)] mt-2">
              {cat.count} {cat.count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
