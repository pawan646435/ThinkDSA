// src/app/page.tsx
// Home page — Hero section with topic search and topic cards

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap,
  Code2,
  Eye,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Brain,
  Layers,
  Target,
} from "lucide-react";
import TopicSearch from "@/components/ui/TopicSearch";
import GlassCard from "@/components/ui/GlassCard";
import { topicList } from "@/data/topics";

const features = [
  {
    icon: Eye,
    title: "Step-by-Step Visualization",
    description: "Watch algorithms execute with animated visuals, variable tracking, and playback controls.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Code2,
    title: "Multi-Language Code",
    description: "See implementations in JavaScript, Python, and C++ with line-by-line explanations.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Hints",
    description: "Get concise explanations and hints on demand — only when you need them.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: Target,
    title: "Practice & Mistakes",
    description: "Solve problems with hints, and learn from common mistakes other students make.",
    color: "from-emerald-500 to-emerald-600",
  },
];

const categoryColors: Record<string, string> = {
  searching: "from-purple-500/20 to-purple-600/20 border-purple-500/20",
  sorting: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/20",
  "data-structure": "from-emerald-500/20 to-emerald-600/20 border-emerald-500/20",
  graph: "from-amber-500/20 to-amber-600/20 border-amber-500/20",
  "dynamic-programming": "from-rose-500/20 to-rose-600/20 border-rose-500/20",
  other: "from-gray-500/20 to-gray-600/20 border-gray-500/20",
};

const categoryBadgeColors: Record<string, string> = {
  searching: "text-purple-300 bg-purple-500/15",
  sorting: "text-cyan-300 bg-cyan-500/15",
  "data-structure": "text-emerald-300 bg-emerald-500/15",
  graph: "text-amber-300 bg-amber-500/15",
  "dynamic-programming": "text-rose-300 bg-rose-500/15",
  other: "text-gray-300 bg-gray-500/15",
};

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/[0.04] rounded-full blur-[150px] animate-float" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/[0.04] rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/[0.02] rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 sm:px-10 py-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Think<span className="gradient-text">DSA</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => router.push("/techniques")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white text-sm font-medium transition-all border border-white/[0.06] hover:border-purple-500/30"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              Techniques
            </button>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300 mb-8"
            >
              <Zap className="w-4 h-4" />
              Interactive DSA Learning Platform
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Master DSA with
              <br />
              <span className="gradient-text">Visual Learning</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Step-by-step visualizations, interactive code execution, and
              AI-powered explanations. Learn any algorithm by{" "}
              <span className="text-white font-medium">seeing it in action</span>.
            </p>

            {/* Topic Search */}
            <TopicSearch variant="hero" />
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlassCard hover className="p-5 h-full">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Techniques CTA Banner */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard
              glow="cyan"
              hover
              className="p-6 sm:p-8 cursor-pointer group"
              onClick={() => router.push("/techniques")}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      Problem-Solving Techniques
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Master Two Pointer, Sliding Window, DP, Backtracking &amp; 7 more essential patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-400 group-hover:text-purple-300 font-medium">
                  <span>Explore All 10 Techniques</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Topic Cards */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Explore Topics
                </h2>
                <p className="text-gray-400 mt-1">
                  Dive deep into data structures and algorithms
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {topicList.filter((t) => t.available).length} full modules
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topicList.map((topic, index) => (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  <GlassCard
                    hover
                    glow={topic.available ? "purple" : "amber"}
                    className="p-5 cursor-pointer group h-full"
                    onClick={() => router.push(`/topic/${topic.slug}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{topic.icon}</span>
                      {topic.available ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                          Ready
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-500 uppercase tracking-widest">
                          Soon
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {topic.title}
                    </h3>

                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${categoryBadgeColors[topic.category]}`}
                    >
                      {topic.category.replace("-", " ")}
                    </span>

                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {topic.shortDescription}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span>{topic.available ? "Start Learning" : "Preview"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.05] py-8 text-center">
          <p className="text-sm text-gray-500">
            Built with ❤️ for DSA learners everywhere •{" "}
            <span className="gradient-text font-semibold">ThinkDSA</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
