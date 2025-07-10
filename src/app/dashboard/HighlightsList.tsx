"use client";

import React, { useEffect, useState } from "react";
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

export default function HighlightsList() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [filteredHighlights, setFilteredHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry");

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setHighlights([]);
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
    };
    fetchHighlights();
  }, []);

  // Filter highlights based on search and filters
  useEffect(() => {
    let filtered = highlights;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (h) =>
          h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.reflection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Mood filter
    if (selectedMood) {
      filtered = filtered.filter((h) => h.mood === selectedMood);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((h) => h.tags.includes(selectedTag));
    }

    setFilteredHighlights(filtered);
  }, [highlights, searchQuery, selectedMood, selectedTag]);

  // Get all unique tags and moods for filters
  const allTags = Array.from(new Set(highlights.flatMap((h) => h.tags)));
  const allMoods = Array.from(
    new Set(highlights.map((h) => h.mood).filter(Boolean)),
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className={viewMode === "masonry" ? "masonry" : "space-y-4"}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={viewMode === "masonry" ? "masonry-item" : ""}
            >
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
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 glass-card rounded-2xl">
        <Sparkles className="h-12 w-12 text-blue-400 mb-4" />
        <div className="text-2xl font-semibold mb-2 text-center">
          No highlights yet
        </div>
        <div className="text-muted-foreground text-center max-w-md mb-6">
          Start by adding your first highlight. When you capture something
          inspiring, it will appear here in a beautiful, organized layout.
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Organize with tags</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Add personal reflections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Track your mood</span>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateHighlight = (updatedHighlight: Highlight) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === updatedHighlight.id ? updatedHighlight : h)),
    );
  };

  const handleDeleteHighlight = (highlightId: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search highlights, reflections, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-white/20"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-32 glass-card border-white/20">
                <SelectValue placeholder="Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Moods</SelectItem>
                {allMoods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-32 glass-card border-white/20">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border border-white/20 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "masonry" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("masonry")}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedMood || selectedTag) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                Search: {searchQuery}
              </span>
            )}
            {selectedMood && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                Mood: {selectedMood}
              </span>
            )}
            {selectedTag && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                Tag: #{selectedTag}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedMood("");
                setSelectedTag("");
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredHighlights.length} of {highlights.length} highlights
      </div>

      {/* Highlights Grid */}
      {filteredHighlights.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-lg font-semibold mb-2">No highlights found</div>
          <div className="text-muted-foreground">
            Try adjusting your search or filters
          </div>
        </div>
      ) : (
        <div className={viewMode === "masonry" ? "masonry" : "space-y-4"}>
          {filteredHighlights.map((h) => (
            <div
              key={h.id}
              className={viewMode === "masonry" ? "masonry-item" : ""}
            >
              <HighlightCard
                {...h}
                onUpdate={handleUpdateHighlight}
                onDelete={handleDeleteHighlight}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
