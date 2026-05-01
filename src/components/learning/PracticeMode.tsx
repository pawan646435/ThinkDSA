// src/components/learning/PracticeMode.tsx
// Interactive practice questions with hints and solution reveal

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { PracticeQuestion } from "@/data/topics/types";
import { useAI } from "@/hooks/useAI";
import { highlightLine } from "@/utils/syntaxHighlight";

interface PracticeModeProps {
  questions: PracticeQuestion[];
}

const difficultyColors = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function PracticeMode({ questions }: PracticeModeProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSolutions, setShowSolutions] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState<Set<string>>(new Set());
  const [aiHints, setAiHints] = useState<Record<string, string>>({});
  const { giveHint, loading: aiLoading } = useAI();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSolution = (id: string) => {
    const next = new Set(showSolutions);
    next.has(id) ? next.delete(id) : next.add(id);
    setShowSolutions(next);
  };

  const toggleHint = (id: string) => {
    const next = new Set(showHints);
    next.has(id) ? next.delete(id) : next.add(id);
    setShowHints(next);
  };

  const getAIHint = async (q: PracticeQuestion) => {
    const result = await giveHint(q.description);
    if (result) {
      setAiHints((prev) => ({ ...prev, [q.id]: result.text }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Practice Mode</h3>
          <p className="text-sm text-gray-400">
            Solve problems to reinforce your understanding
          </p>
        </div>
      </div>

      {questions.map((q, index) => (
        <GlassCard key={q.id} className="overflow-hidden">
          {/* Question Header */}
          <button
            onClick={() => toggleExpand(q.id)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-purple-400 font-mono">
                #{index + 1}
              </span>
              <div>
                <h4 className="font-semibold text-white">{q.title}</h4>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
              </div>
            </div>
            {expandedId === q.id ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedId === q.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4">
                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {q.description}
                  </p>

                  {/* Test Cases */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-400 mb-2">
                      Test Cases:
                    </h5>
                    <div className="space-y-2">
                      {q.testCases.map((tc, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm"
                        >
                          <span className="text-gray-500 font-mono">
                            Input: <span className="text-cyan-300">{tc.input}</span>
                          </span>
                          <span className="text-gray-500">→</span>
                          <span className="text-gray-500 font-mono">
                            Output: <span className="text-emerald-300">{tc.expectedOutput}</span>
                          </span>
                          <span className="text-xs text-gray-500 italic ml-auto">
                            {tc.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleHint(q.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/20 transition-all"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHints.has(q.id) ? "Hide Hint" : "Show Hint"}
                    </button>

                    <button
                      onClick={() => getAIHint(q)}
                      disabled={aiLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      {aiLoading ? "Thinking..." : "AI Hint"}
                    </button>

                    <button
                      onClick={() => toggleSolution(q.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-all"
                    >
                      {showSolutions.has(q.id) ? (
                        <>
                          <EyeOff className="w-4 h-4" /> Hide Solution
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" /> Show Solution
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hint */}
                  <AnimatePresence>
                    {showHints.has(q.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-bold text-amber-300">
                            Hint
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{q.hint}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Hint */}
                  <AnimatePresence>
                    {aiHints[q.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-bold text-purple-300">
                            AI Hint
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{aiHints[q.id]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Solution */}
                  <AnimatePresence>
                    {showSolutions.has(q.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4"
                      >
                        <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0e17] shadow-xl shadow-black/20">
                          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/[0.05] border-b border-emerald-500/10">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                              Solution
                            </span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7]">
                            {q.solution.split("\n").map((line: string, i: number) => (
                              <div key={i} className="flex hover:bg-white/[0.02] transition-colors">
                                <span className="inline-block w-8 text-right text-xs font-mono text-gray-600/70 select-none mr-5 pt-[1px]">{i + 1}</span>
                                <code className="font-mono flex-1">{highlightLine(line, "javascript")}</code>
                              </div>
                            ))}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      ))}
    </div>
  );
}
