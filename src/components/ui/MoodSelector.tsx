import React from 'react';

const MOODS = [
  { label: 'Inspired', value: 'inspired', emoji: '✨' },
  { label: 'Curious', value: 'curious', emoji: '🤔' },
  { label: 'Excited', value: 'excited', emoji: '🔥' },
  { label: 'Calm', value: 'calm', emoji: '🌿' },
  { label: 'Confused', value: 'confused', emoji: '😕' },
  { label: 'Motivated', value: 'motivated', emoji: '🚀' },
];

interface MoodSelectorProps {
  value?: string;
  onChange: (mood: string) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all text-sm font-medium focus:outline-none
            ${value === mood.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
              : 'bg-white/70 dark:bg-black/70 text-blue-700 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30'}
          `}
          onClick={() => onChange(mood.value)}
          aria-pressed={value === mood.value}
        >
          <span className="text-lg">{mood.emoji}</span>
          {mood.label}
        </button>
      ))}
    </div>
  );
} 