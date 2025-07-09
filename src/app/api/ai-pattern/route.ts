import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  const response = await fetch('https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    return NextResponse.json({ keywords: [] }, { status: 500 });
  }

  const data = await response.json();
  const keywords = data[0] || [];
  return NextResponse.json({ keywords });
} 