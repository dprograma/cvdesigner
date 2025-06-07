import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the Markdown file
    const filePath = path.join(process.cwd(), 'public', 'SUPABASE_SETUP_GUIDE.md');
    const markdown = fs.readFileSync(filePath, 'utf8');

    // Return the Markdown content with proper headers
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'inline; filename="SUPABASE_SETUP_GUIDE.md"',
      },
    });
  } catch (error: unknown) {
    console.error('Error serving setup guide:', error);
    return NextResponse.json(
      { error: 'Failed to serve setup guide' },
      { status: 500 }
    );
  }
}
