import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'gmkhamisani';
const REPO_NAME = 'my-site';

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/posts`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    const files = await res.json();
    const posts = files
      .filter((f: any) => f.name.endsWith('.md'))
      .map((f: any) => {
        const slug = f.name.replace('.md', '');
        const date = slug.substring(0, 10);
        return { slug, date };
      })
      .sort((a: any, b: any) => b.date.localeCompare(a.date));

    const postsWithMeta = await Promise.all(
      posts.map(async (post: any) => {
        const contentRes = await fetch(post.download_url);
        const content = await contentRes.text();
        const titleMatch = content.match(/title:\s*"([^"]+)"/);
        const descMatch = content.match(/description:\s*"([^"]+)"/);
        const catMatch = content.match(/category:\s*"([^"]+)"/);
        
        return {
          slug: post.slug,
          date: post.date,
          title: titleMatch ? titleMatch[1] : post.slug,
          description: descMatch ? descMatch[1] : '',
          category: catMatch ? catMatch[1] : 'Blog',
        };
      })
    );

    return NextResponse.json({ posts: postsWithMeta });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }

  try {
    const { slug } = await request.json();
    
    const filePath = `content/posts/${slug}.md`;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
    
    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });
    
    if (!getRes.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const file = await getRes.json();
    
    const deleteRes = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Delete post: ${slug}`,
        sha: file.sha,
      }),
    });

    if (!deleteRes.ok) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
