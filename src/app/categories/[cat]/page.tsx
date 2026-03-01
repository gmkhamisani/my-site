import { getAllPosts, getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ cat: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category.toLowerCase().replace(' ', '-')));
  return Array.from(categories).map((cat) => ({ cat }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  const posts = getPostsByCategory(cat);

  if (posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].category;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-4 text-[var(--foreground)]">
        {categoryName}
      </h1>
      <p className="text-[var(--secondary)] mb-10">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
      </p>

      <div className="space-y-0">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
