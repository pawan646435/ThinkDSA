// src/components/visualizers/VariableTracker.tsx
// Displays current variable values during step execution

"use client";

import { motion } from "framer-motion";

interface VariableTrackerProps {
  variables: Record<string, string | number | boolean | null>;
}

export default function VariableTracker({ variables }: VariableTrackerProps) {
  const entries = Object.entries(variables);

  return (
    <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Variable Tracker
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {entries.map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
          >
            <span className="text-xs text-purple-400 font-mono font-bold">
              {key}
            </span>
            <span className="text-xs text-gray-500">=</span>
            <motion.span
              key={String(value)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-white font-mono font-bold"
            >
              {value === null ? "null" : String(value)}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
