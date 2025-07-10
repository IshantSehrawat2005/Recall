import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trash2, ExternalLink, Calendar, Bot, Copy, RefreshCcw } from 'lucide-react';

interface HighlightCardProps {
  text: string;
  source: string;
  tags: string[];
  created_at: string;
}

export default function HighlightCard({ text: initialText, source, tags, created_at }: HighlightCardProps) {
  const [text, setText] = useState(initialText);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (deleted) return null;

  const handleAskAI = async () => {
    setLoading(true);
    setAiSuggestion(null);
    try {
      const res = await fetch('/api/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Improve this note', context: text }),
      });
      const data = await res.json();
      setAiSuggestion(data.answer || 'No suggestion available.');
    } catch (err) {
      setAiSuggestion('Failed to get suggestion.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (aiSuggestion) {
      navigator.clipboard.writeText(aiSuggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleReplace = () => {
    if (aiSuggestion) {
      setText(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 mb-6">
      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            #{tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-1 rounded-full">
            +{tags.length - 3} more
          </Badge>
        )}
      </div>

      {/* Main Text */}
      <div className="text-base font-medium mb-3 text-gray-900 dark:text-gray-100 leading-relaxed">
        {text}
      </div>

      {/* Source and Date */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        <a 
          href={source} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Source
        </a>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Ask AI Button and Suggestion */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleAskAI}
          disabled={loading}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all w-fit flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          {loading ? 'Asking AI...' : 'Ask AI for Suggestion'}
        </button>
        {aiSuggestion && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm border border-blue-200 dark:border-blue-800 flex flex-col gap-2">
            <div className="text-blue-700 dark:text-blue-300 font-semibold">AI Suggestion:</div>
            <div className="text-blue-600 dark:text-blue-400 whitespace-pre-line">{aiSuggestion}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleReplace}
                className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all"
              >
                <RefreshCcw className="w-3 h-3" /> Replace original
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy suggestion'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setDeleted(true)}
          className="rounded-lg p-2 flex items-center justify-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all"
          title="Delete highlight"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 