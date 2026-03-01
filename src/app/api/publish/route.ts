import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'gmkhamisani';
const REPO_NAME = 'my-site';

export async function POST(request: Request) {
  console.log('GITHUB_TOKEN available:', !!GITHUB_TOKEN);
  
  try {
    const { title, category, description, content } = await request.json();

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Title, category, and content are required' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${today}-${slug}.md`;

    const markdown = `---
title: "${title}"
${description ? `description: "${description}"` : ''}
category: "${category}"
---

${content}
`;

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const filePath = `content/posts/${filename}`;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Add new post: ${title}`,
        content: Buffer.from(markdown).toString('base64'),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      return NextResponse.json(
        { error: 'Failed to create post on GitHub' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
