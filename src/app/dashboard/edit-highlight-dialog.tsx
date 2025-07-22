"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/ui/TagInput";
import MoodSelector from "@/components/ui/MoodSelector";
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

interface EditHighlightDialogProps {
  highlight: Highlight;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedHighlight: Highlight) => void;
}

export default function EditHighlightDialog({
  highlight,
  open,
  onOpenChange,
  onUpdate,
}: EditHighlightDialogProps) {
  const [text, setText] = useState(highlight.text);
  const [source, setSource] = useState(highlight.source);
  const [tags, setTags] = useState(highlight.tags);
  const [mood, setMood] = useState(highlight.mood || "");
  const [reflection, setReflection] = useState(highlight.reflection || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("highlights")
        .update({
          text,
          source,
          tags,
          mood: mood || null,
          reflection: reflection || null,
        })
        .eq("id", highlight.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating highlight:", error);
        return;
      }

      const updatedHighlight = {
        ...highlight,
        text,
        source,
        tags,
        mood,
        reflection,
      };

      onUpdate(updatedHighlight);
      onOpenChange(false);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Highlight</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="text">Highlight Text</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your highlight text..."
              className="min-h-[100px] mt-1"
            />
          </div>

          <div>
            <Label htmlFor="source">Source URL</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="mt-1">
              <TagInput
                value={tags}
                onChange={setTags}
                placeholder="Add tags..."
              />
            </div>
          </div>

          <div>
            <Label>Mood</Label>
            <div className="mt-2">
              <MoodSelector value={mood} onChange={setMood} />
            </div>
          </div>

          <div>
            <Label htmlFor="reflection">Personal Reflection</Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Add your thoughts and insights..."
              className="min-h-[80px] mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
