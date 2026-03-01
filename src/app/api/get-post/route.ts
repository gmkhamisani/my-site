import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'gmkhamisani';
const REPO_NAME = 'my-site';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug || !GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Missing slug or token' }, { status: 400 });
  }

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/posts/${slug}.md`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const file = await res.json();
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const descMatch = content.match(/description:\s*"([^"]+)"/);
    const catMatch = content.match(/category:\s*"([^"]+)"/);
    
    const contentMatch = content.match(/---[\s\S]*?---\n\n([\s\S]*)/);

    return NextResponse.json({
      post: {
        title: titleMatch ? titleMatch[1] : slug,
        description: descMatch ? descMatch[1] : '',
        category: catMatch ? catMatch[1] : 'Blog',
        content: contentMatch ? contentMatch[1] : '',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
