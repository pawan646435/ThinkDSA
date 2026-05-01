// src/components/visualizers/ArrayVisualizer.tsx
// Interactive array visualization with animated bars and highlights

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useVisualizerStore } from "@/store/visualizerStore";
import { HighlightInfo } from "@/data/topics/types";

interface ArrayVisualizerProps {
  /** The array to visualize */
  array: number[];
  /** Indices to highlight with colors and labels */
  highlights: HighlightInfo[];
  /** Maximum value for scaling bar heights */
  maxValue?: number;
}

const highlightColorMap: Record<HighlightInfo["color"], string> = {
  primary: "from-purple-500 to-purple-600",
  secondary: "from-cyan-500 to-cyan-600",
  success: "from-emerald-500 to-emerald-600",
  danger: "from-red-500 to-red-600",
  warning: "from-amber-500 to-amber-600",
  info: "from-sky-500 to-sky-600",
};

const highlightBorderMap: Record<HighlightInfo["color"], string> = {
  primary: "border-purple-400",
  secondary: "border-cyan-400",
  success: "border-emerald-400",
  danger: "border-red-400",
  warning: "border-amber-400",
  info: "border-sky-400",
};

const highlightTextMap: Record<HighlightInfo["color"], string> = {
  primary: "text-purple-400",
  secondary: "text-cyan-400",
  success: "text-emerald-400",
  danger: "text-red-400",
  warning: "text-amber-400",
  info: "text-sky-400",
};

export default function ArrayVisualizer({
  array,
  highlights,
  maxValue,
}: ArrayVisualizerProps) {
  const max = maxValue || Math.max(...array, 1);
  const highlightMap = new Map<number, HighlightInfo>();
  highlights.forEach((h) => highlightMap.set(h.index, h));

  return (
    <div className="w-full">
      {/* Bar visualization */}
      <div className="flex items-end justify-center gap-1 sm:gap-2 h-48 sm:h-56 mb-4 px-2">
        <AnimatePresence mode="popLayout">
          {array.map((value, index) => {
            const highlight = highlightMap.get(index);
            const barHeight = (value / max) * 100;
            const isHighlighted = !!highlight;

            return (
              <motion.div
                key={`${index}-${value}`}
                className="flex flex-col items-center gap-1 flex-1 max-w-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Label above bar */}
                {highlight?.label && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-xs font-bold ${highlightTextMap[highlight.color]} mb-1`}
                  >
                    {highlight.label}
                  </motion.span>
                )}

                {/* Bar */}
                <motion.div
                  className={`
                    w-full rounded-t-lg relative overflow-hidden
                    ${
                      isHighlighted
                        ? `bg-gradient-to-t ${highlightColorMap[highlight!.color]} border-2 ${highlightBorderMap[highlight!.color]}`
                        : "bg-gradient-to-t from-gray-700 to-gray-600 border border-gray-500/30"
                    }
                  `}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(barHeight, 8)}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.03,
                  }}
                >
                  {/* Shimmer effect for highlighted bars */}
                  {isHighlighted && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </motion.div>

                {/* Value label */}
                <motion.span
                  className={`
                    text-xs font-mono font-bold
                    ${isHighlighted ? "text-white" : "text-gray-400"}
                  `}
                  animate={
                    isHighlighted
                      ? { scale: [1, 1.2, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {value}
                </motion.span>

                {/* Index label */}
                <span className="text-[10px] text-gray-500 font-mono">
                  [{index}]
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
