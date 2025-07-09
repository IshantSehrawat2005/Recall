import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { question, context } = await req.json();
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  const response = await fetch('https://api-inference.huggingface.co/models/deepset/roberta-base-squad2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, context }),
  });

  if (!response.ok) {
    return NextResponse.json({ answer: 'AI Q&A failed.' }, { status: 500 });
  }

  const data = await response.json();
  const answer = data.answer || 'No answer available.';
  return NextResponse.json({ answer });
} 