"use client";
import React, { ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface DashboardPageProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [showEditor, setShowEditor] = useState(false);

  // Pass showEditor and setShowEditor to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { showEditor, setShowEditor } as DashboardPageProps);
    }
    return child;
  });

  return (
    <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Sidebar onAddNote={() => setShowEditor(true)} />
      <main className="flex-1 min-h-screen transition-all duration-300">
        {childrenWithProps}
      </main>
    </div>
  );
} 