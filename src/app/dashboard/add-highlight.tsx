"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/client";
import { Plus, Link as LinkIcon, Sparkles, X } from "lucide-react";
import TagInput from "@/components/ui/TagInput";
import MoodSelector from "@/components/ui/MoodSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddHighlightForm() {
  const [highlight, setHighlight] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [reflection, setReflection] = useState("");
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
        mood: mood || null,
        reflection: reflection || null,
        created_at: new Date().toISOString(),
      });
      if (dbError) {
        setError("Failed to save highlight. Please try again.");
      } else {
        setSuccess(true);
        setHighlight("");
        setSource("");
        setTags([]);
        setMood("");
        setReflection("");
        setTimeout(() => {
          setSuccess(false);
          setIsDialogOpen(false);
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
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
              <Label
                htmlFor="highlight"
                className="text-sm font-semibold flex items-center gap-2"
              >
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
              <Label
                htmlFor="source"
                className="text-sm font-semibold flex items-center gap-2"
              >
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

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Mood & Context</Label>
              <MoodSelector value={mood} onChange={setMood} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reflection" className="text-sm font-semibold">
                Personal Reflection
              </Label>
              <Textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Add your thoughts, insights, or why this matters to you..."
                rows={3}
                className="glass-card resize-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Highlight saved successfully!
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 glass-card border-white/20 hover:bg-white/70 dark:hover:bg-black/70"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                disabled={loading || !highlight.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Save Highlight</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Add Card */}
      <div className="glass-card rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Capture Your Next Insight
          </h2>
          <p className="text-muted-foreground mb-4">
            Save highlights from articles, videos, books, or any content that
            inspires you
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Highlight
          </Button>
        </div>
      </div>
    </>
  );
}
