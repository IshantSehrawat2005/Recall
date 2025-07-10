"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/client";
import { Plus, Link as LinkIcon, Sparkles } from "lucide-react";
import TagInput from "@/components/ui/TagInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddHighlightForm({ onHighlightAdded }: { onHighlightAdded?: () => void }) {
  const [highlight, setHighlight] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      if (!highlight.trim()) {
        setError("Highlight text is required.");
        setLoading(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to add a highlight.");
        setLoading(false);
        return;
      }
      const { error: dbError } = await supabase.from("highlights").insert({
        user_id: user.id,
        text: highlight,
        source: source || "https://example.com",
        tags,
        created_at: new Date().toISOString(),
      });
      if (dbError) {
        setError("Failed to save highlight. Please try again.");
      } else {
        setSuccess(true);
        setHighlight("");
        setSource("");
        setTags([]);
        setTimeout(() => {
          setSuccess(false);
          setIsDialogOpen(false);
          if (onHighlightAdded) onHighlightAdded();
        }, 1200);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="fab group">
          <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Capture New Highlight
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="highlight" className="text-sm font-semibold flex items-center gap-2">
              <span>Highlight Text</span>
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="highlight"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="Paste or type the text you want to save..."
              rows={4}
              required
              className="glass-card resize-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-semibold flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Source URL
            </Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https://example.com (optional)"
              className="glass-card focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Tags</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Add tags to organize your highlight..."
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Highlight saved!</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Highlight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
