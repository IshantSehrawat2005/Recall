import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, Brain } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Knowledge Capture & Reflection
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-8 tracking-tight leading-tight">
              Capture{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Insights
              </span>{" "}
              from Every Learning Moment
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your web browsing into meaningful learning. Save
              highlighted text with personal reflections and emotional context,
              creating a searchable timeline of your intellectual journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors text-lg font-medium shadow-lg"
              >
                Start Capturing
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors text-lg font-medium border border-slate-200 dark:border-slate-700"
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
    </div>
  );
}
