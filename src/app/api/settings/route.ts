import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, title, description, intro, email, github } = await request.json();

    const configContent = `export const siteConfig = {
  name: '${name}',
  title: '${title}',
  description: '${description}',
  intro: "${intro}",
  
  social: {
    email: '${email}',
    twitter: '',
    github: '${github}',
  },
  
  theme: {
    accentColor: '#D4A574',
    accentColorDark: '#E8C9A0',
  },
};

export type SiteConfig = typeof siteConfig;
`;

    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = 'gmkhamisani';
    const repoName = 'my-site';

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const filePath = 'src/lib/config.ts';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    if (!getRes.ok) {
      return NextResponse.json({ error: 'Could not read config file' }, { status: 500 });
    }

    const file = await getRes.json();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Update site settings',
        content: Buffer.from(configContent).toString('base64'),
        sha: file.sha,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      return NextResponse.json(
        { error: 'Failed to save settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
