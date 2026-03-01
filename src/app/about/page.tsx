import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-[var(--foreground)]">
        About
      </h1>

      <div className="prose">
        <p className="text-lg text-[var(--secondary)] leading-relaxed mb-6">
          Hi, I&apos;m gmkhamisani — a writer exploring ideas at the intersection of 
          technology, culture, and life.
        </p>

        <p>
          I started this site as a place to share my thoughts and connect with 
          others who are curious about the world. Whether it&apos;s a deep dive into 
          a technical topic, a personal essay, or just a quick observation, I 
          hope you find something here worth your time.
        </p>

        <h2>What I Write About</h2>
        <ul>
          <li><strong>Blog</strong> — Technical thoughts and tutorials</li>
          <li><strong>Essays</strong> — Long-form explorations of ideas</li>
          <li><strong>Short</strong> — Brief, off-the-cuff observations</li>
          <li><strong>Op-Ed</strong> — Opinions on trending topics</li>
        </ul>

        <h2>Get in Touch</h2>
        <p>
          I&apos;d love to hear from you. Whether you have feedback on something 
          I&apos;ve written, want to collaborate, or just want to say hello, feel free 
          to reach out.
        </p>

        <h2>Newsletter</h2>
        <p>
          If you want to follow along, I send occasional updates when I publish 
          new posts. No spam, no noise — just writing. You can{' '}
          <Link href="/newsletter" className="text-[var(--accent)] hover:underline">
            subscribe here
          </Link>.
        </p>
      </div>
    </div>
  );
}
