import React, { useState } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded-lg px-3 py-2 bg-white/70 dark:bg-black/70 focus-within:ring-2 ring-blue-400">
      {value.map((tag) => (
        <span key={tag} className="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium mr-1 mb-1">
          {tag}
          <button
            type="button"
            className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
            onClick={() => removeTag(tag)}
            aria-label={`Remove tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        className="flex-1 min-w-[100px] bg-transparent outline-none text-sm py-1"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder || 'Add tag...'}
      />
    </div>
  );
} 