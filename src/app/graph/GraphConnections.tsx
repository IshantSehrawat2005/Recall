import React, { useEffect, useRef } from 'react';

// Placeholder: In a real app, use vis-network, d3, or cytoscape for interactive graphs
// Here, we just show a simple static SVG for demo

interface HighlightNode {
  id: string;
  text: string;
  tags: string[];
  keywords: string[];
}

interface GraphConnectionsProps {
  highlights: HighlightNode[];
}

export default function GraphConnections({ highlights }: GraphConnectionsProps) {
  // Find connections: two nodes are connected if they share at least one tag or keyword
  const edges: { from: string; to: string }[] = [];
  for (let i = 0; i < highlights.length; i++) {
    for (let j = i + 1; j < highlights.length; j++) {
      const shared = highlights[i].tags.some(tag => highlights[j].tags.includes(tag)) ||
        highlights[i].keywords.some(kw => highlights[j].keywords.includes(kw));
      if (shared) {
        edges.push({ from: highlights[i].id, to: highlights[j].id });
      }
    }
  }

  // Simple static layout for up to 6 nodes
  const positions = [
    { x: 200, y: 50 },
    { x: 350, y: 150 },
    { x: 300, y: 300 },
    { x: 100, y: 300 },
    { x: 50, y: 150 },
    { x: 200, y: 200 },
  ];

  return (
    <div className="w-full flex justify-center">
      <svg width={400} height={350} className="bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl">
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromIdx = highlights.findIndex(h => h.id === edge.from);
          const toIdx = highlights.findIndex(h => h.id === edge.to);
          if (fromIdx === -1 || toIdx === -1) return null;
          return (
            <line
              key={i}
              x1={positions[fromIdx].x}
              y1={positions[fromIdx].y}
              x2={positions[toIdx].x}
              y2={positions[toIdx].y}
              stroke="#6366f1"
              strokeWidth={2}
              opacity={0.5}
            />
          );
        })}
        {/* Nodes */}
        {highlights.slice(0, 6).map((h, i) => (
          <g key={h.id}>
            <circle
              cx={positions[i].x}
              cy={positions[i].y}
              r={28}
              fill="#a5b4fc"
              stroke="#6366f1"
              strokeWidth={3}
            />
            <text
              x={positions[i].x}
              y={positions[i].y + 5}
              textAnchor="middle"
              fontSize={12}
              fill="#1e293b"
              fontWeight="bold"
            >
              {h.text.slice(0, 12)}
              {h.text.length > 12 ? '…' : ''}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
} 