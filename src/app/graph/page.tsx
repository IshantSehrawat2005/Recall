"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../supabase/client';
import GraphConnections from './GraphConnections';
import DashboardNavbar from '@/components/dashboard-navbar';

export default function GraphPage() {
  const [highlights, setHighlights] = useState<any[]>([]);
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
          // For demo, fetch keywords for each highlight (could be optimized)
          const highlightsWithKeywords = await Promise.all(
            (data || []).map(async (h: any) => {
              let keywords: string[] = [];
              try {
                const res = await fetch('/api/ai-pattern', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: h.text }),
                });
                const d = await res.json();
                keywords = d.keywords || [];
              } catch {}
              return { ...h, keywords };
            })
          );
          setHighlights(highlightsWithKeywords);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Knowledge</span> Graph
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Visualize the connections between your notes, highlights, and ideas.
          </p>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading graph...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : highlights.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No highlights to visualize yet.</div>
          ) : (
            <GraphConnections highlights={highlights.slice(0, 6)} />
          )}
        </div>
      </div>
    </div>
  );
} 