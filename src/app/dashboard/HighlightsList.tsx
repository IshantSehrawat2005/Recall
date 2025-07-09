"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../supabase/client';
import HighlightCard from './HighlightCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHighlights([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('highlights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) {
          setError('Failed to fetch highlights.');
        } else {
          setHighlights(data || []);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (highlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Sparkles className="h-8 w-8 text-blue-400 mb-3" />
        <div className="text-lg font-semibold mb-1 text-center">No highlights yet</div>
        <div className="text-muted-foreground text-center max-w-md">Start by adding your first highlight. When you capture something inspiring, it will appear here.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {highlights.map((h) => (
        <HighlightCard key={h.id} {...h} />
      ))}
    </div>
  );
} 