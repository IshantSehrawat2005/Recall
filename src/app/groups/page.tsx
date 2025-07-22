import DashboardNavbar from '@/components/dashboard-navbar';

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            Groups
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Discover and join groups by topic and vibe. Connect with like-minded learners.
          </p>
          <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-12 flex flex-col items-center justify-center min-h-[300px]">
            <span className="text-2xl text-slate-400 dark:text-slate-600 mb-4">👥</span>
            <span className="text-lg text-slate-500 dark:text-slate-400">Groups feature coming soon!</span>
          </div>
        </div>
      </div>
    </div>
  );
} 