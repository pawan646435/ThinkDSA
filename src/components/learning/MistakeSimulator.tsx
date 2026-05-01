// src/components/learning/MistakeSimulator.tsx
// Common mistakes section with wrong vs correct code comparison

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { CommonMistake } from "@/data/topics/types";
import { highlightLine } from "@/utils/syntaxHighlight";

interface MistakeSimulatorProps {
  mistakes: CommonMistake[];
}

export default function MistakeSimulator({ mistakes }: MistakeSimulatorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Common Mistakes</h3>
          <p className="text-sm text-gray-400">
            Learn from mistakes others make — avoid them yourself!
          </p>
        </div>
      </div>

      {mistakes.map((mistake, index) => (
        <GlassCard key={mistake.id} glow="rose" className="overflow-hidden">
          <button
            onClick={() =>
              setExpandedId(expandedId === mistake.id ? null : mistake.id)
            }
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-white">{mistake.title}</h4>
                <p className="text-sm text-gray-400">{mistake.description}</p>
              </div>
            </div>
            {expandedId === mistake.id ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedId === mistake.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4">
                  {/* Wrong vs Correct comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Wrong Code */}
                    <div className="rounded-xl overflow-hidden border border-red-500/20 bg-[#0a0e17] shadow-lg shadow-black/20">
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/[0.08] border-b border-red-500/10">
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                          Wrong
                        </span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7]">
                        {mistake.wrongCode.split("\n").map((line: string, i: number) => (
                          <div key={i} className="flex hover:bg-white/[0.02] transition-colors">
                            <code className="font-mono flex-1">{highlightLine(line, "javascript")}</code>
                          </div>
                        ))}
                      </pre>
                    </div>

                    {/* Correct Code */}
                    <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-[#0a0e17] shadow-lg shadow-black/20">
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/[0.08] border-b border-emerald-500/10">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          Correct
                        </span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7]">
                        {mistake.correctCode.split("\n").map((line: string, i: number) => (
                          <div key={i} className="flex hover:bg-white/[0.02] transition-colors">
                            <code className="font-mono flex-1">{highlightLine(line, "javascript")}</code>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h5 className="text-sm font-bold text-amber-300 mb-2">
                      Why is this wrong?
                    </h5>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {mistake.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      ))}
    </div>
  );
}
