import Link from 'next/link';
import { Post } from '@/lib/posts';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const categoryColors: Record<string, string> = {
    Blog: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    Essays: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    Short: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'Op-Ed': 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  };

  const badgeColor = categoryColors[post.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <article className="border-b border-[#E5E0D8] dark:border-[#333] py-6">
      <div className="flex items-center gap-3 mb-2">
        <time className="text-sm text-[#6B6B6B] dark:text-[#A0A0A0]">
          {format(new Date(post.date), 'MMMM d, yyyy')}
        </time>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
          {post.category}
        </span>
      </div>
      
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-serif font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] hover:text-[#D4A574] dark:hover:text-[#E8C9A0] transition-colors">
          {post.title}
        </h2>
      </Link>
      
      {post.description && (
        <p className="mt-2 text-[#6B6B6B] dark:text-[#A0A0A0] leading-relaxed">
          {post.description}
        </p>
      )}
    </article>
  );
}
