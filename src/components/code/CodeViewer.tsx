// src/components/code/CodeViewer.tsx
// Code display with syntax highlighting, active line tracking, and line descriptions

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useTopicStore } from "@/store/topicStore";
import { CodeSnippet } from "@/data/topics/types";
import { highlightLine } from "@/utils/syntaxHighlight";

interface CodeViewerProps {
  snippets: CodeSnippet[];
  activeLineIndex?: number;
}

const languageLabels: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
};

const languageColors: Record<string, { active: string; dot: string }> = {
  javascript: { active: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", dot: "bg-yellow-400" },
  python: { active: "text-sky-400 bg-sky-400/10 border-sky-400/30", dot: "bg-sky-400" },
  cpp: { active: "text-blue-400 bg-blue-400/10 border-blue-400/30", dot: "bg-blue-400" },
  java: { active: "text-red-400 bg-red-400/10 border-red-400/30", dot: "bg-red-400" },
};

export default function CodeViewer({
  snippets,
  activeLineIndex = -1,
}: CodeViewerProps) {
  const { selectedLanguage, setSelectedLanguage } = useTopicStore();
  const [copied, setCopied] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const snippet = snippets.find((s) => s.language === selectedLanguage) || snippets[0];
  const lines = snippet.code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0e17] shadow-2xl shadow-black/30">
      {/* Header bar — macOS-style dots + language tabs + copy button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {/* macOS window dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          {/* Language tabs */}
          <div className="flex items-center gap-0.5 ml-2">
            {snippets.map((s) => {
              const colors = languageColors[s.language] || languageColors.javascript;
              const isActive = selectedLanguage === s.language;
              return (
                <button
                  key={s.language}
                  onClick={() =>
                    setSelectedLanguage(s.language as "javascript" | "python" | "cpp" | "java")
                  }
                  className={`
                    flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                    transition-all duration-200 border
                    ${isActive ? colors.active : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/[0.03]"}
                  `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? colors.dot : "bg-gray-600"}`} />
                  {languageLabels[s.language]}
                </button>
              );
            })}
          </div>
        </div>
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto">
        <pre className="py-4 text-[13px] leading-[1.7]">
          {lines.map((line, index) => {
            const isActive = index === activeLineIndex;
            const lineDesc = snippet.lineDescriptions?.[index];
            const isHovered = hoveredLine === index;

            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredLine(index)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                <motion.div
                  className={`
                    flex items-start px-4 py-[1px] transition-colors duration-200
                    ${isActive
                      ? "bg-purple-500/[0.12] border-l-[3px] border-purple-500"
                      : isHovered && lineDesc
                        ? "bg-white/[0.03] border-l-[3px] border-white/10"
                        : "border-l-[3px] border-transparent"
                    }
                  `}
                  animate={
                    isActive
                      ? { backgroundColor: ["rgba(168,85,247,0.12)", "rgba(168,85,247,0.06)", "rgba(168,85,247,0.12)"] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Line number */}
                  <span
                    className={`
                      inline-block w-8 text-right text-xs font-mono select-none flex-shrink-0 pt-[2px] mr-5
                      ${isActive ? "text-purple-400" : isHovered ? "text-gray-400" : "text-gray-600/70"}
                    `}
                  >
                    {index + 1}
                  </span>

                  {/* Syntax-highlighted code */}
                  <code className="font-mono flex-1 whitespace-pre">
                    {highlightLine(line, snippet.language)}
                  </code>
                </motion.div>

                {/* Line description tooltip */}
                {lineDesc && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-4 top-0 z-10 flex items-center h-full"
                  >
                    <div className="px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm rounded-lg text-[11px] text-gray-200 border border-white/[0.1] shadow-xl shadow-black/40 max-w-sm">
                      <span className="text-purple-400 font-bold mr-1">💡</span>
                      {lineDesc}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
