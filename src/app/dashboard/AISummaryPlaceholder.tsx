import React from 'react';

export default function AISummaryPlaceholder() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-6 flex flex-col items-center justify-center text-center mb-8">
      <div className="text-3xl mb-2">🤖</div>
      <h2 className="text-xl font-semibold mb-2">AI-Powered Insights (Coming Soon)</h2>
      <p className="text-muted-foreground mb-2">
        Get smart summaries, instant Q&A, and pattern detection for your highlights. Our AI will help you learn faster and discover new connections.
      </p>
      <span className="text-xs text-slate-400">(This feature will use OpenAI, Hugging Face, or your preferred AI provider.)</span>
    </div>
  );
} 