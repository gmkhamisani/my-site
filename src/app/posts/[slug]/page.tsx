import { getPostBySlug, getAllPosts, markdownToHtml } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content);

  const categoryColors: Record<string, string> = {
    Blog: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    Essays: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    Short: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'Op-Ed': 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  };

  const badgeColor = categoryColors[post.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="text-sm text-[var(--secondary)] hover:text-[var(--accent)] transition-colors mb-8 inline-block"
      >
        ← Back to Home
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm text-[var(--secondary)]">
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>
          <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
            {post.category}
          </span>
        </div>
        <h1 className="text-4xl font-serif font-semibold text-[var(--foreground)] leading-tight">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 text-lg text-[var(--secondary)]">
            {post.description}
          </p>
        )}
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
