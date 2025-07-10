import AddHighlightForm from "./add-highlight";
import HighlightsList from "./HighlightsList";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-center">
              Your Knowledge Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Effortlessly capture, organize, and discover insights from your
              highlights.
            </p>
          </div>

          {/* Add Highlight Form */}
          <div className="mb-10">
            <AddHighlightForm />
          </div>

          {/* Highlights List */}
          <div className="mb-8">
            <HighlightsList />
          </div>
        </div>
      </div>
    </div>
  );
}
