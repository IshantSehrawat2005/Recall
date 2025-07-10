import { Suspense } from 'react';
import Link from 'next/link';

// Component that uses search params (wrapped in Suspense)
function WelcomeContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">Welcome to Recall</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your intelligent learning management system
        </p>
        <div className="space-y-4">
          <Link
            href="/sign-in"
            className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="block w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
} 