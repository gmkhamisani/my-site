import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'gmkhamisani';
const REPO_NAME = 'my-site';

export async function POST(request: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }

  try {
    const { slug, title, category, description, content } = await request.json();

    const markdown = `---
title: "${title}"
${description ? `description: "${description}"` : ''}
category: "${category}"
---

${content}
`;

    const filePath = `content/posts/${slug}.md`;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    if (!getRes.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const file = await getRes.json();

    const updateRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Update post: ${title}`,
        content: Buffer.from(markdown).toString('base64'),
        sha: file.sha,
      }),
    });

    if (!updateRes.ok) {
      const error = await updateRes.json();
      console.error('GitHub error:', error);
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
