"use client";

import HighlightsList from './HighlightsList';
import { useState, useRef } from 'react';
import { createClient } from '../../../supabase/client';

export default function DashboardPage({ showEditor, setShowEditor }: { showEditor: boolean, setShowEditor: (v: boolean) => void }) {
  // Simple modal note editor
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const refreshRef = useRef<() => void>();

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("highlights").insert({
        user_id: user.id,
        text: noteText,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setShowEditor(false);
      setNoteText("");
      // Refresh highlights list
      if (refreshRef.current) refreshRef.current();
    } catch (err) {
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black relative">
      {/* Main Content: Highlights/Notes List */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <HighlightsList onRefreshRegister={cb => (refreshRef.current = cb)} />
        </div>
      </div>

      {/* Modal Note Editor */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-2 text-center">Add Note</h2>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={5}
              placeholder="Write your note..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              disabled={saving}
            />
            <div className="flex gap-4 justify-end mt-2">
              <button
                className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                onClick={() => setShowEditor(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform"
                onClick={handleSave}
                disabled={!noteText.trim() || saving}
              >
                {saving ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
