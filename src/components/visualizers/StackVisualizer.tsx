// src/components/visualizers/StackVisualizer.tsx
// Interactive stack visualization with push/pop animations

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HighlightInfo } from "@/data/topics/types";

interface StackVisualizerProps {
  /** Current stack state */
  stack: number[];
  /** Operation being performed */
  operation: string;
  /** Value being operated on */
  operationValue: number | null;
  /** Highlight information */
  highlights: HighlightInfo[];
}

const highlightBgMap: Record<HighlightInfo["color"], string> = {
  primary: "from-purple-500/30 to-purple-600/30 border-purple-500/50",
  secondary: "from-cyan-500/30 to-cyan-600/30 border-cyan-500/50",
  success: "from-emerald-500/30 to-emerald-600/30 border-emerald-500/50",
  danger: "from-red-500/30 to-red-600/30 border-red-500/50",
  warning: "from-amber-500/30 to-amber-600/30 border-amber-500/50",
  info: "from-sky-500/30 to-sky-600/30 border-sky-500/50",
};

export default function StackVisualizer({
  stack,
  operation,
  operationValue,
  highlights,
}: StackVisualizerProps) {
  const highlightMap = new Map<number, HighlightInfo>();
  highlights.forEach((h) => highlightMap.set(h.index, h));

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Operation indicator */}
      <AnimatePresence mode="wait">
        {operation && operation !== "init" && operation !== "done" && (
          <motion.div
            key={operation + operationValue}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`
              px-4 py-2 rounded-xl font-mono text-sm font-bold
              ${
                operation === "push"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : operation === "pop"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : operation === "peek"
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }
            `}
          >
            {operation === "push" && `PUSH(${operationValue})`}
            {operation === "pop" && `POP() → ${operationValue}`}
            {operation === "peek" && `PEEK() → ${operationValue}`}
            {operation === "pop_error" && "❌ STACK UNDERFLOW"}
            {operation === "peek_error" && "❌ STACK EMPTY"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stack container */}
      <div className="relative w-48 min-h-[280px] flex flex-col justify-end">
        {/* Stack walls */}
        <div className="absolute bottom-0 left-0 w-2 h-full bg-gradient-to-t from-purple-500/40 to-transparent rounded-tl-lg" />
        <div className="absolute bottom-0 right-0 w-2 h-full bg-gradient-to-t from-purple-500/40 to-transparent rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500/40 via-purple-500/60 to-purple-500/40 rounded-b-lg" />

        {/* TOP indicator */}
        {stack.length > 0 && (
          <motion.div
            className="absolute -right-16 flex items-center gap-1"
            animate={{
              top: `${(1 - stack.length / Math.max(stack.length, 6)) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-6 h-0.5 bg-purple-400" />
            <span className="text-xs font-bold text-purple-400 whitespace-nowrap">
              TOP
            </span>
          </motion.div>
        )}

        {/* Stack elements */}
        <div className="flex flex-col-reverse gap-1 px-3 pb-3">
          <AnimatePresence mode="popLayout">
            {stack.map((value, index) => {
              const highlight = highlightMap.get(index);
              const isTop = index === stack.length - 1;

              return (
                <motion.div
                  key={`stack-${index}-${value}`}
                  layout
                  initial={{ opacity: 0, x: -50, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className={`
                    relative w-full h-10 flex items-center justify-center
                    rounded-lg border font-mono font-bold text-lg
                    ${
                      highlight
                        ? `bg-gradient-to-r ${highlightBgMap[highlight.color]}`
                        : isTop
                          ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/40 text-white"
                          : "bg-white/[0.05] border-white/[0.1] text-gray-300"
                    }
                  `}
                >
                  {value}

                  {/* Label badge */}
                  {highlight?.label && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -left-14 text-xs font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded"
                    >
                      {highlight.label}
                    </motion.span>
                  )}

                  {/* Index */}
                  <span className="absolute right-2 text-[10px] text-gray-500">
                    [{index}]
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {stack.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-20 text-gray-500 text-sm italic"
          >
            Empty Stack
          </motion.div>
        )}
      </div>

      {/* Size indicator */}
      <div className="text-sm text-gray-400 font-mono">
        Size: <span className="text-white font-bold">{stack.length}</span>
      </div>
    </div>
  );
}
