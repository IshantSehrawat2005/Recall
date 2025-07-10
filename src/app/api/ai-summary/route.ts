import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  // Use a summarization model, e.g. facebook/bart-large-cnn
  const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    return NextResponse.json({ summary: 'AI summary failed.' }, { status: 500 });
  }

  const data = await response.json();
  // The summary is usually in data[0].summary_text
  const summary = data[0]?.summary_text || 'No summary available.';
  return NextResponse.json({ summary });
} 