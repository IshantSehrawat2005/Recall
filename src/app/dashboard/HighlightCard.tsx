import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trash2 } from 'lucide-react';

interface HighlightCardProps {
  text: string;
  source: string;
  tags: string[];
  mood?: string;
  reflection?: string;
  created_at: string;
}

export default function HighlightCard({ text, source, tags, mood, reflection, created_at }: HighlightCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  // Q&A state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [qaLoading, setQaLoading] = useState(false);
  // Pattern detection state
  const [keywords, setKeywords] = useState<string[]>([]);
  const [patternLoading, setPatternLoading] = useState(false);

  const getSummary = async () => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary('Failed to get summary.');
    }
    setLoading(false);
  };

  const getAnswer = async () => {
    setQaLoading(true);
    setAnswer(null);
    try {
      const res = await fetch('/api/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: text }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer('Failed to get answer.');
    }
    setQaLoading(false);
  };

  const getKeywords = async () => {
    setPatternLoading(true);
    setKeywords([]);
    try {
      const res = await fetch('/api/ai-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setKeywords(data.keywords);
    } catch (err) {
      setKeywords([]);
    }
    setPatternLoading(false);
  };

  // Demo delete (no backend)
  const [deleted, setDeleted] = useState(false);
  if (deleted) return null;

  return (
    <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md p-6 mb-4 transition-all hover:shadow-lg">
      <div className="mb-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 rounded-full">
            #{tag}
          </Badge>
        ))}
        {mood && (
          <Badge variant="outline" className="text-xs px-2 py-1 rounded-full border-blue-400 text-blue-600">
            {mood}
          </Badge>
        )}
      </div>
      <div className={`text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100 transition-all ${done ? 'line-through opacity-60' : ''}`}>
        {text}
      </div>
      {reflection && (
        <div className="italic text-slate-500 dark:text-slate-400 mb-2">
          {reflection}
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 mt-2">
        <a href={source} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
          {source}
        </a>
        <span>{new Date(created_at).toLocaleString()}</span>
      </div>
      {/* AI Summary */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={getSummary}
          disabled={loading}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-fit"
        >
          {loading ? 'Summarizing...' : 'Get AI Summary'}
        </button>
        {summary && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm">
            <strong>AI Summary:</strong> {summary}
          </div>
        )}
      </div>
      {/* Q&A */}
      <div className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question about this highlight..."
          className="border rounded px-2 py-1 text-sm"
        />
        <button
          onClick={getAnswer}
          disabled={qaLoading || !question}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-fit"
        >
          {qaLoading ? 'Answering...' : 'Ask AI'}
        </button>
        {answer && (
          <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm">
            <strong>AI Answer:</strong> {answer}
          </div>
        )}
      </div>
      {/* Pattern Detection */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={getKeywords}
          disabled={patternLoading}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-fit"
        >
          {patternLoading ? 'Detecting...' : 'Detect Patterns'}
        </button>
        {keywords.length > 0 && (
          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded text-sm">
            <strong>Keywords:</strong> {keywords.join(', ')}
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setDone(d => !d)}
          className={`rounded-full p-2 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${done ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : ''}`}
          title={done ? 'Mark as not done' : 'Mark as done'}
        >
          <CheckCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => setDeleted(true)}
          className="rounded-full p-2 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-all"
          title="Delete highlight"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 