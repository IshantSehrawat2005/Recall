"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createClient } from "../../../supabase/client"
import { Plus } from "lucide-react"

const MOODS = [
  { value: "neutral", label: "😐 Neutral" },
  { value: "happy", label: "😊 Happy" },
  { value: "curious", label: "🤔 Curious" },
  { value: "inspired", label: "✨ Inspired" },
  { value: "confused", label: "😕 Confused" },
  { value: "excited", label: "😃 Excited" },
  { value: "sad", label: "😢 Sad" },
  { value: "angry", label: "😡 Angry" },
]

export default function AddHighlightForm() {
  const [highlight, setHighlight] = useState("")
  const [tags, setTags] = useState("")
  const [mood, setMood] = useState("")
  const [reflection, setReflection] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      if (!highlight.trim()) {
        setError("Highlight text is required.")
        setLoading(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("You must be signed in to add a highlight.")
        setLoading(false)
        return
      }
      const { error: dbError } = await supabase.from("highlights").insert({
        user_id: user.id,
        text: highlight,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        mood,
        reflection,
        created_at: new Date().toISOString(),
      })
      if (dbError) {
        setError("Failed to save highlight. Please try again.")
      } else {
        setSuccess(true)
        setHighlight("")
        setTags("")
        setMood("")
        setReflection("")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Add a New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Highlight</span>
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="highlight">Highlight Text <span className="text-red-500">*</span></Label>
            <Textarea
              id="highlight"
              value={highlight}
              onChange={e => setHighlight(e.target.value)}
              placeholder="Paste or type the text you want to save..."
              rows={3}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags <span className="text-xs text-muted-foreground">(comma separated)</span></Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="productivity, ai, learning"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mood">Mood/Context</Label>
            <select
              id="mood"
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select mood/context</option>
              {MOODS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="reflection">Personal Reflection</Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Add your thoughts, context, or why this matters..."
              rows={2}
              className="mt-1"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Highlight saved!</div>}
          <Button
            type="submit"
            className="w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-base font-semibold flex items-center justify-center gap-2"
            disabled={loading}
          >
            <Plus className={`h-5 w-5 transition-transform ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Saving..." : "Save Highlight"}
          </Button>
        </form>
      </div>
    </div>
  )
} 