"use client";

import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { createClient } from "../../../supabase/client";
import HighlightCard from "./HighlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Filter, Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Highlight {
  id: string;
  text: string;
  source: string;
  tags: string[];
  mood?: string;
  reflection?: string;
  created_at: string;
}

const HighlightsList = forwardRef(function HighlightsList(_props, ref) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [filteredHighlights, setFilteredHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry");

  // Fetch highlights
  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHighlights([]);
        setFilteredHighlights([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("highlights")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        setError("Failed to fetch highlights.");
      } else {
        setHighlights(data || []);
        setFilteredHighlights(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  useImperativeHandle(ref, () => ({ refresh: fetchHighlights }), [fetchHighlights]);

  // Filter highlights based on search and tag
  useEffect(() => {
    let filtered = highlights;
    if (searchQuery) {
      filtered = filtered.filter(
        (h) =>
          h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.reflection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }
    if (selectedTag) {
      filtered = filtered.filter((h) => h.tags.includes(selectedTag));
    }
    setFilteredHighlights(filtered);
  }, [highlights, searchQuery, selectedTag]);

  // Get all unique tags for filter
  const allTags = Array.from(new Set(highlights.flatMap((h) => h.tags)));

  // Handlers for updating/deleting highlights
  const handleUpdateHighlight = (updated: Highlight) => {
    setHighlights((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    setFilteredHighlights((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };
  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    setFilteredHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className={viewMode === "masonry" ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6" : "space-y-4"}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={viewMode === "masonry" ? "break-inside-avoid" : ""}>
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchHighlights} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredHighlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 glass-card rounded-2xl">
        <Sparkles className="h-12 w-12 text-blue-400 mb-4" />
        <div className="text-2xl font-semibold mb-2 text-center">
          No highlights yet
        </div>
        <div className="text-muted-foreground text-center max-w-md">
          Start by adding your first highlight. When you capture something inspiring, it will appear here.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters/Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex-1 flex gap-2 items-center">
          <Input
            placeholder="Search highlights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "masonry" ? "default" : "outline"}
            onClick={() => setViewMode("masonry")}
            size="icon"
          >
            <Grid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            size="icon"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Highlights List */}
      <div className={viewMode === "masonry" ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6" : "space-y-4"}>
        {filteredHighlights.map((h) => (
          <div key={h.id} className={viewMode === "masonry" ? "break-inside-avoid" : ""}>
            <HighlightCard {...h} onUpdate={handleUpdateHighlight} onDelete={handleDeleteHighlight} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default HighlightsList;
