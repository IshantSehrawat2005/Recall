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
import { useEffect, useState } from "react";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Determine active section
      const sections = ["hero", "features", "how-it-works", "faq", "cta"];
      const sectionElements = sections.map((id) => document.getElementById(id));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative">
      {/* Progress Line */}
      <div className="fixed left-8 top-0 z-50 h-full w-1 bg-slate-200 dark:bg-slate-700">
        <div
          className="w-full bg-gradient-to-b from-indigo-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
        {/* Section Indicators */}
        <div
          className="absolute top-20 -left-2 w-5 h-5 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 transition-all duration-300"
          style={{ opacity: activeSection === "hero" ? 1 : 0.3 }}
        />
        <div
          className="absolute top-1/4 -left-2 w-5 h-5 rounded-full bg-purple-500 border-4 border-white dark:border-slate-900 transition-all duration-300"
          style={{ opacity: activeSection === "features" ? 1 : 0.3 }}
        />
        <div
          className="absolute top-2/4 -left-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 transition-all duration-300"
          style={{ opacity: activeSection === "how-it-works" ? 1 : 0.3 }}
        />
        <div
          className="absolute top-3/4 -left-2 w-5 h-5 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900 transition-all duration-300"
          style={{ opacity: activeSection === "faq" ? 1 : 0.3 }}
        />
        <div
          className="absolute bottom-20 -left-2 w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 transition-all duration-300"
          style={{ opacity: activeSection === "cta" ? 1 : 0.3 }}
        />
      </div>

      <div className="ml-16">
        <Navbar />
        <section id="hero">
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-on-scroll">
              <Badge variant="outline" className="mb-4">
                <Lightbulb className="w-3 h-3 mr-1" />
                Core Features
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Organize, Contextualize & Discover Your Learning
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Save highlights from any website, organize by topics, add
                AI-generated context, and discover patterns in your learning
                journey - all in one intelligent workspace.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-on-scroll">
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

              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-on-scroll">
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

              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-on-scroll">
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

              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-on-scroll">
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

              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-on-scroll">
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

              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-on-scroll">
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

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-24 bg-slate-50 dark:bg-slate-900"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-on-scroll">
              <Badge variant="outline" className="mb-4">
                <BookOpen className="w-3 h-3 mr-1" />
                Simple Process
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Build Your Knowledge Empire in Three Steps
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                From scattered highlights to organized insights - create your
                personal learning system.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center animate-on-scroll">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Highlight & Capture
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Select text from any website and instantly save it with
                  automatic topic detection and AI-generated context to enhance
                  understanding.
                </p>
              </div>

              <div className="text-center animate-on-scroll">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Organize & Connect
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Create notes, link related ideas, and organize everything by
                  topics. Build a comprehensive knowledge base from all your
                  sources.
                </p>
              </div>

              <div className="text-center animate-on-scroll">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Gain Insights
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Discover patterns in your learning, get personalized
                  recommendations, and watch your knowledge network grow with
                  real-time insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-on-scroll">
              <Badge variant="outline" className="mb-4">
                <Brain className="w-3 h-3 mr-1" />
                Frequently Asked Questions
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Everything You Need to Know
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Learn how Recall transforms your web browsing into meaningful
                learning experiences.
              </p>
            </div>

            <div className="max-w-4xl mx-auto animate-on-scroll">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem
                  value="item-1"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-slate-900 dark:text-slate-100 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      How do I capture highlights from websites?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
                    Simply select any text on a website while browsing. Recall
                    will capture the highlighted text along with the source URL,
                    allowing you to save meaningful passages instantly. You can
                    then add your personal reflections and emotional context to
                    create rich learning moments.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-slate-900 dark:text-slate-100 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      What makes this different from regular bookmarking?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
                    Unlike bookmarks that just save links, Recall captures the
                    specific text that caught your attention, your personal
                    insights about it, and your emotional response. This creates
                    a searchable timeline of learning moments with context,
                    making it easy to rediscover and build upon your knowledge
                    over time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-slate-900 dark:text-slate-100 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      How can I organize and find my saved content?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
                    Recall offers multiple ways to organize your learning:
                    filter by mood to find content that resonated emotionally,
                    sort by source to see patterns in your reading habits, or
                    search by topic tags. The clean timeline view makes it easy
                    to browse chronologically, while powerful search helps you
                    find specific insights instantly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-4"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-slate-900 dark:text-slate-100 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      What insights can I discover about my learning patterns?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
                    The insights page reveals fascinating patterns in your
                    learning journey. See which topics you explore most, how
                    your mood correlates with different types of content, and
                    track your intellectual growth over time. These
                    visualizations help you understand your learning preferences
                    and discover new areas of interest.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-5"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-slate-900 dark:text-slate-100 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Can I search through all my saved highlights and
                      reflections?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
                    Absolutely! Every piece of text you highlight, every
                    reflection you write, and every tag you add becomes
                    searchable. Whether you're looking for a specific quote, a
                    particular insight, or content from a certain time period,
                    Recall's search functionality helps you rediscover your
                    knowledge instantly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-6"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-slate-900 dark:text-slate-100 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      How does the timeline view help with learning?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
                    The timeline creates a visual story of your intellectual
                    journey. See how your interests evolved, revisit insights
                    from months ago, and notice connections between ideas you
                    captured at different times. This chronological view helps
                    you build upon previous learning and see the bigger picture
                    of your knowledge development.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Start Your Learning Journey
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Transform how you capture and reflect on knowledge. Begin
                building your personal timeline of insights today.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Begin Capturing
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
