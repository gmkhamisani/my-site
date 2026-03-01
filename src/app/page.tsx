import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default function Home() {
  const posts = getAllPosts().slice(0, 7);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-3xl font-serif font-semibold text-[var(--foreground)] mb-4">
          Hi, I&apos;m gmkhamisani.
        </h1>
        <p className="text-lg text-[var(--secondary)] leading-relaxed">
          I write about technology, ideas, and whatever else catches my attention.
          Welcome to my corner of the internet.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-semibold mb-6 text-[var(--foreground)]">
          Latest Writing
        </h2>
        
        {posts.length > 0 ? (
          <div className="space-y-0">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--secondary)]">
            No posts yet.{' '}
            <Link href="/newsletter" className="text-[var(--accent)] hover:underline">
              Subscribe to get notified
            </Link>{' '}
            when I publish something new.
          </p>
        )}
      </section>

      <section className="mt-16 p-6 bg-[#F5F3EF] dark:bg-[#252525] rounded-lg">
        <h3 className="text-lg font-serif font-semibold mb-2 text-[var(--foreground)]">
          Enjoyed what you read?
        </h3>
        <p className="text-[var(--secondary)] mb-4">
          Subscribe to get new posts delivered to your inbox.
        </p>
        <Link
          href="/newsletter"
          className="inline-block px-6 py-2 bg-[var(--accent)] text-white dark:text-[#1A1A1A] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Subscribe
        </Link>
      </section>
    </div>
  );
}
