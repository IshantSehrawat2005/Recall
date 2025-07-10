import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trash2, Edit3, Bot, Copy, ExternalLink } from "lucide-react";
import EditHighlightDialog from "./edit-highlight-dialog";
import { createClient } from "../../../supabase/client";

interface Highlight {
  id: string;
  text: string;
  source: string;
  tags: string[];
  mood?: string;
  reflection?: string;
  created_at: string;
}

interface HighlightCardProps extends Highlight {
  onUpdate: (updatedHighlight: Highlight) => void;
  onDelete: (highlightId: string) => void;
}

export default function HighlightCard({
  id,
  text,
  source,
  tags,
  mood,
  reflection,
  created_at,
  onUpdate,
  onDelete,
}: HighlightCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this highlight?")) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("highlights").delete().eq("id", id);
      if (error) {
        alert("Error deleting highlight");
        return;
      }
      onDelete(id);
    } catch (err) {
      alert("Unexpected error deleting highlight");
    } finally {
      setDeleting(false);
    }
  };

  const handleAskAI = async () => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("Failed to get summary.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md p-6 mb-4 transition-all hover:shadow-lg">
      <div className="mb-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            #{tag}
          </Badge>
        ))}
      </div>
      <div className="text-base font-medium mb-3 text-gray-900 dark:text-gray-100 leading-relaxed">
        {text}
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        {source && (
          <a href={source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ExternalLink className="h-3 w-3" />
            Source
          </a>
        )}
        <span>{new Date(created_at).toLocaleDateString()}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          onClick={handleAskAI}
          disabled={loading}
          title="Ask AI for summary"
        >
          <Bot className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          onClick={handleCopy}
          disabled={!summary}
          title="Copy AI summary"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          onClick={() => setEditDialogOpen(true)}
          title="Edit highlight"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete highlight"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {summary && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200 text-sm">
          <strong>AI Summary:</strong> {summary}
        </div>
      )}
      <EditHighlightDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        highlight={{ id, text, source, tags, mood, reflection, created_at }}
        onUpdate={onUpdate}
      />
    </div>
  );
}
