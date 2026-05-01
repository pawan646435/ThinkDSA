// src/app/techniques/page.tsx
// DSA Problem-Solving Techniques page

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Home,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Zap,
  BookOpen,
  Code2,
  Target,
  Clock,
  Layers,
  Search,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import TechniqueVisualizer from "@/components/visualizers/TechniqueVisualizer";
import { highlightLine } from "@/utils/syntaxHighlight";
import { techniques, Technique } from "@/data/techniques";

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/10",
  Medium: "text-amber-400 bg-amber-500/10",
  Hard: "text-red-400 bg-red-500/10",
  "Easy/Medium": "text-cyan-400 bg-cyan-500/10",
};

function TechniqueCard({ t, index }: { t: Technique; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <GlassCard className="overflow-hidden">
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
        >
          <span className="text-3xl flex-shrink-0 mt-0.5">{t.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className={`text-xl font-bold ${t.color}`}>{t.title}</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/10 text-gray-400">
                {t.complexity}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{t.tagline}</p>
          </div>
          <div className="flex-shrink-0 mt-1 text-gray-500">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-6 space-y-5 border-t border-white/[0.06] pt-5">
                {/* Description */}
                <p className="text-gray-300 leading-relaxed text-sm">{t.description}</p>

                {/* Visual Diagram */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-gray-300">📐 Visual Pattern</span>
                  </div>
                  <TechniqueVisualizer techniqueId={t.id} />
                </div>

                {/* When to Use */}
                <div className={`rounded-xl border ${t.borderColor} bg-gradient-to-br ${t.bgColor} p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className={`w-4 h-4 ${t.color}`} />
                    <span className={`text-sm font-bold ${t.color}`}>When to Use This</span>
                  </div>
                  <ul className="space-y-1.5">
                    {t.whenToUse.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-300">
                        <span className={`mt-0.5 ${t.color}`}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How it Works */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-amber-300">How It Works</span>
                  </div>
                  <div className="space-y-2">
                    {t.howItWorks.map((step, i) => (
                      <div key={i} className="flex gap-3 p-2.5 rounded-lg bg-white/[0.02]">
                        <span className="text-xs font-bold text-purple-400 bg-purple-500/10 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template Code */}
                <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0e17] shadow-xl shadow-black/20">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                          Template Code
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">JavaScript</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7]">
                    {t.template.split("\n").map((line: string, i: number) => (
                      <div key={i} className="flex hover:bg-white/[0.02] transition-colors">
                        <span className="inline-block w-8 text-right text-xs font-mono text-gray-600/70 select-none mr-5 pt-[1px]">{i + 1}</span>
                        <code className="font-mono flex-1">{highlightLine(line, "javascript")}</code>
                      </div>
                    ))}
                  </pre>
                </div>

                {/* Key Insight */}
                <div className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/15">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Key Insight</span>
                    <p className="text-sm text-gray-300 mt-1">{t.keyInsight}</p>
                  </div>
                </div>

                {/* Example Problems */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-300">Classic Problems</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.examples.map((ex, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.06] bg-white/[0.02] ${difficultyColors[ex.difficulty] || "text-gray-400"}`}
                      >
                        {ex.name}
                        <span className="text-[9px] opacity-60">({ex.difficulty})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

export default function TechniquesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery.trim()
    ? techniques.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.whenToUse.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : techniques;

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-purple-600/[0.04] rounded-full blur-[160px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/[0.04] rounded-full blur-[140px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Problem-Solving{" "}
              <span className="gradient-text">Techniques</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Master the 10 most important DSA patterns to solve any coding problem
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search techniques... (e.g. 'cycle', 'subarray', 'sorted')"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/10 transition-all"
          />
        </div>

        {/* Quick Nav Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {techniques.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${t.borderColor} bg-white/[0.02] ${t.color} hover:bg-white/[0.05] transition-all`}
            >
              <span>{t.icon}</span>
              {t.title}
            </a>
          ))}
        </div>

        {/* Technique Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((t, i) => (
              <div key={t.id} id={t.id}>
                <TechniqueCard t={t} index={i} />
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No techniques match &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <GlassCard glow="emerald" className="inline-flex items-center gap-3 px-6 py-4">
            <Layers className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-gray-300">
              <span className="text-white font-semibold">Pro Tip:</span> Most interview problems combine 2-3 techniques. Practice recognizing patterns first, then combine them.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
