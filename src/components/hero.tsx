import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, Brain } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-black glass">
      {/* Subtle background pattern (remove or make black) */}
      <div className="absolute inset-0 bg-none dark:bg-none" />
      <div className="relative pt-12 pb-24 sm:pt-16 sm:pb-32 flex flex-col justify-center items-center min-h-[60vh]">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-8 tracking-tight leading-tight">
            Capture <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Insights</span> from Every Learning Moment
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your web browsing into meaningful learning. Save
            highlighted text with personal reflections and emotional context,
            creating a searchable timeline of your intellectual journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-white bg-black dark:bg-white dark:text-black rounded-full hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors text-lg font-medium shadow-lg"
            >
              Start Capturing
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center px-8 py-4 text-black dark:text-white bg-white dark:bg-black/80 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-lg font-medium border border-slate-200 dark:border-slate-700"
            >
              See How It Works
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Highlight & Save
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Capture meaningful text from any website
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Add Context
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Include reflections and emotional insights
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Discover Patterns
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Visualize your learning journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
