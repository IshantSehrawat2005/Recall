"use client";

import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  BookOpen,
  Heart,
  Brain,
  Search,
  Filter,
  BarChart3,
  Moon,
  Sun,
  Clock,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
      {/* Animated gradient blobs for interactivity (removed for pure black) */}
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4">
        <Navbar />
        <section id="hero" className="mb-4">
          <Hero />
        </section>
        {/* How it works / feature icons section */}
        <section id="how-it-works" className="mb-20 mt-8">
          <div className="container mx-auto px-6 sm:px-8 md:px-16">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-2">
                <Lightbulb className="w-3 h-3 mr-1" />
                Core Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold animated-gradient text-3d text-center mb-4 animate-fade-in-up">
                Organize, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 transition-colors duration-300 cursor-pointer">Contextualize</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 transition-colors duration-300 cursor-pointer">Discover</span> Your Learning
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Save highlights from any website, organize by topics, add
                AI-generated context, and discover patterns in your learning
                journey - all in one intelligent workspace.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 md:gap-x-20 md:gap-y-16">
              {/* Cards with glass effect */}
              <Card className="card-animate glass rounded-2xl border border-white/20 shadow-2xl p-6 mb-4 animate-fade-in-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:rotate-12">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    Topic-Wise Organization
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Automatically organize your highlights by topics and themes.
                    Create custom categories and watch your knowledge structure
                    emerge naturally.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-animate glass rounded-2xl border border-white/20 shadow-2xl p-6 mb-4 animate-fade-in-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:rotate-12">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    AI-Generated Context
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Get intelligent context and connections for your highlights.
                    AI helps explain concepts, suggest related topics, and
                    enhance your understanding.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-animate glass rounded-2xl border border-white/20 shadow-2xl p-6 mb-4 animate-fade-in-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:rotate-12">
                    <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    Pattern Discovery
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Discover hidden connections between your ideas. Visualize
                    learning patterns, topic relationships, and knowledge
                    evolution over time.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-animate glass rounded-2xl border border-white/20 shadow-2xl p-6 mb-4 animate-fade-in-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:rotate-12">
                    <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    Unified Knowledge Hub
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Save highlights from any website in one centralized
                    workspace. Create interconnected notes and organize all your
                    ideas in one place.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-animate glass rounded-2xl border border-white/20 shadow-2xl p-6 mb-4 animate-fade-in-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:rotate-12">
                    <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    Smart Note Creation
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Transform highlights into organized notes. Connect ideas
                    across sources, add personal thoughts, and build
                    comprehensive knowledge documents.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="card-animate glass rounded-2xl border border-white/20 shadow-2xl p-6 mb-4 animate-fade-in-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:rotate-12">
                    <Search className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    Real-Time Insights
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Gain insights as you learn with intelligent suggestions,
                    topic recommendations, and knowledge gap identification.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section id="how-it-works" className="mb-20 mt-20">
          <div className="container mx-auto px-6 sm:px-8 md:px-16">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-2">
                <Clock className="w-3 h-3 mr-1" />
                How It Works
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold animated-gradient text-3d text-center mb-4 animate-fade-in-up">
                Simple Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Organized Learning</span>
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8 animate-fade-in-up">
                Get started with Recall in just a few simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Capture Highlights</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Save important text from any website with our browser extension or web app
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">AI Processing</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our AI automatically tags, categorizes, and generates context for your highlights
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Discover Insights</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Explore connections, patterns, and insights across your knowledge base
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-20 mt-20">
          <div className="container mx-auto px-6 sm:px-8 md:px-16">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-2">
                <Search className="w-3 h-3 mr-1" />
                FAQ
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold animated-gradient text-3d text-center mb-4 animate-fade-in-up">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How does Recall organize my highlights?
                  </AccordionTrigger>
                  <AccordionContent>
                    Recall uses AI to automatically categorize your highlights by topics, themes, and concepts. You can also create custom tags and categories to organize your knowledge exactly how you want.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Can I use Recall on any website?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! Recall works on any website. You can highlight text directly in your browser or copy and paste content into our web app. We're also developing browser extensions for even easier capture.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Is my data secure and private?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolutely. Your highlights and personal data are encrypted and stored securely. We never share your data with third parties, and you have complete control over your information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    How does the AI help me learn better?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our AI analyzes your highlights to identify patterns, suggest related topics, generate summaries, and help you understand connections between different concepts. It's like having a personal learning assistant.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Can I export my highlights?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! You can export your highlights in various formats including PDF, Markdown, and JSON. We're also working on integrations with popular note-taking apps.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
