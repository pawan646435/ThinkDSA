// src/components/learning/ComplexityView.tsx
// Algorithm complexity visualization with comparison bars

"use client";

import { motion } from "framer-motion";
import { BarChart3, Clock, HardDrive } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { ComplexityInfo } from "@/data/topics/types";

interface ComplexityViewProps {
  complexity: ComplexityInfo;
  patternTips: string[];
}

/** Maps complexity strings to visual bar widths */
const complexityScale: Record<string, number> = {
  "O(1)": 10,
  "O(log n)": 25,
  "O(√n)": 35,
  "O(n)": 50,
  "O(n log n)": 65,
  "O(n²)": 80,
  "O(2^n)": 95,
  "O(n!)": 100,
};

const complexityColor: Record<string, string> = {
  "O(1)": "from-emerald-500 to-emerald-400",
  "O(log n)": "from-green-500 to-emerald-400",
  "O(√n)": "from-lime-500 to-green-400",
  "O(n)": "from-yellow-500 to-amber-400",
  "O(n log n)": "from-amber-500 to-orange-400",
  "O(n²)": "from-orange-500 to-red-400",
  "O(2^n)": "from-red-500 to-rose-400",
  "O(n!)": "from-rose-500 to-red-600",
};

function ComplexityBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  const width = complexityScale[value] || 50;
  const color = complexityColor[value] || "from-gray-500 to-gray-400";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-16 text-right">{label}</span>
      <div className="flex-1 h-7 bg-white/[0.03] rounded-lg overflow-hidden relative">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-lg flex items-center justify-end pr-3`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{
            delay,
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <span className="text-xs font-bold text-white drop-shadow">
            {value}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export default function ComplexityView({
  complexity,
  patternTips,
}: ComplexityViewProps) {
  return (
    <div className="space-y-6">
      {/* Time Complexity */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Time Complexity</h3>
            <p className="text-sm text-gray-400">
              How the runtime scales with input size
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <ComplexityBar
            label="Best"
            value={complexity.time.best}
            delay={0}
          />
          <ComplexityBar
            label="Average"
            value={complexity.time.average}
            delay={0.1}
          />
          <ComplexityBar
            label="Worst"
            value={complexity.time.worst}
            delay={0.2}
          />
        </div>
      </GlassCard>

      {/* Space Complexity */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Space Complexity</h3>
          </div>
        </div>
        <ComplexityBar label="Space" value={complexity.space} delay={0.3} />
      </GlassCard>

      {/* Explanation */}
      <GlassCard className="p-6">
        <p className="text-gray-300 leading-relaxed text-sm">
          {complexity.explanation}
        </p>
      </GlassCard>

      {/* Pattern Tips */}
      <GlassCard glow="emerald" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            Pattern Recognition Tips
          </h3>
        </div>
        <div className="space-y-3">
          {patternTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <span className="text-sm text-gray-300 leading-relaxed">
                {tip}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
