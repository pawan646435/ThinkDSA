// src/components/learning/LevelContent.tsx
// Multi-level learning content renderer with markdown-like formatting

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { TopicLevel } from "@/data/topics/types";
import { useTopicStore } from "@/store/topicStore";
import { useAI } from "@/hooks/useAI";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

interface LevelContentProps {
  levels: TopicLevel[];
}

/** Simple markdown-to-JSX renderer for learning content */
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={i} className="h-3" />);
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mt-5 mb-3">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("| ")) {
      // Table row — collect all consecutive table rows
      const tableRows = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        if (!lines[j].trim().match(/^\|[-\s|]+\|$/)) {
          tableRows.push(lines[j].trim());
        }
        j++;
      }
      if (tableRows.length > 0 && !elements.find((el) => el && typeof el === 'object' && 'key' in el && (el as React.ReactElement).key === `table-${i}`)) {
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {tableRows[0]
                    .split("|")
                    .filter(Boolean)
                    .map((cell, ci) => (
                      <th
                        key={ci}
                        className="px-3 py-2 text-left text-purple-300 font-bold border-b border-white/10 bg-white/[0.02]"
                      >
                        {cell.trim().replace(/\*\*/g, "")}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-white/[0.04]">
                    {row
                      .split("|")
                      .filter(Boolean)
                      .map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 text-gray-300">
                          {cell.trim().replace(/\*\*/g, "")}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2 my-0.5">
          <span className="text-purple-400 mt-1">•</span>
          <span
            className="text-gray-300"
            dangerouslySetInnerHTML={{
              __html: formatInline(trimmed.slice(2)),
            }}
          />
        </div>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s/)?.[1];
      elements.push(
        <div key={i} className="flex gap-2 ml-2 my-0.5">
          <span className="text-cyan-400 font-bold min-w-[1.5rem]">
            {num}.
          </span>
          <span
            className="text-gray-300"
            dangerouslySetInnerHTML={{
              __html: formatInline(trimmed.replace(/^\d+\.\s/, "")),
            }}
          />
        </div>
      );
    } else {
      elements.push(
        <p
          key={i}
          className="text-gray-300 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  });

  return elements;
}

/** Format inline markdown: bold, code, links */
function formatInline(text: string): string {
  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-white font-semibold">$1</strong>'
    )
    .replace(
      /`(.*?)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 text-sm font-mono">$1</code>'
    )
    .replace(
      /📌/g,
      '<span class="inline-block mr-1">📌</span>'
    );
}

export default function LevelContent({ levels }: LevelContentProps) {
  const { currentLevel, setCurrentLevel, currentTopic } = useTopicStore();
  const { explainSimply, loading: aiLoading } = useAI();
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const level = levels[currentLevel - 1];
  if (!level) return null;

  const handleExplainSimply = async () => {
    if (!currentTopic) return;
    const result = await explainSimply(`${currentTopic.title} - ${level.title}`);
    if (result) setAiResponse(result.text);
  };

  return (
    <div className="space-y-6">
      {/* Level selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {levels.map((l) => (
            <button
              key={l.level}
              onClick={() => setCurrentLevel(l.level)}
              className={`
                relative w-9 h-9 rounded-xl flex items-center justify-center
                text-sm font-bold transition-all duration-300
                ${
                  currentLevel === l.level
                    ? "text-white"
                    : currentLevel > l.level
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-gray-500 bg-white/[0.03] border border-white/[0.06]"
                }
              `}
            >
              {currentLevel === l.level && (
                <motion.div
                  layoutId="levelIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{l.level}</span>
            </button>
          ))}
        </div>

        {/* Explain Simply Button — AI triggered only on click */}
        <button
          onClick={handleExplainSimply}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-300 hover:text-amber-200 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {aiLoading ? "Thinking..." : "Explain Simply"}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                Level {level.level}: {level.title}
              </h2>
            </div>
            <div className="space-y-1">{renderContent(level.content)}</div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* AI Response */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard glow="amber" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-300">
                  AI Simplified Explanation
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {aiResponse}
              </p>
              <button
                onClick={() => setAiResponse(null)}
                className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
          disabled={currentLevel === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Level
        </button>
        <button
          onClick={() =>
            setCurrentLevel(Math.min(levels.length, currentLevel + 1))
          }
          disabled={currentLevel === levels.length}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next Level
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
