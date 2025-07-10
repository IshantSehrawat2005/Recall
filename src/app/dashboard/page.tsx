"use client";

import AddHighlightForm from "./add-highlight";
import HighlightsList from "./HighlightsList";
import { useRef } from "react";

export default function DashboardPage() {
  const listRef = useRef<{ refresh: () => void } | null>(null);

  return (
    <div className="min-h-screen bg-black dark:bg-black relative">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-center">
              Your Knowledge Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Effortlessly capture, organize, and discover insights from your highlights.
            </p>
          </div>
          <div className="mb-10">
            <AddHighlightForm onHighlightAdded={() => listRef.current?.refresh()} />
          </div>
          <div className="mb-8">
            <HighlightsList ref={listRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
