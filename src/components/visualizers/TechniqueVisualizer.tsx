// src/components/visualizers/TechniqueVisualizer.tsx
// Animated mini-visualizations for each DSA problem-solving technique

"use client";

import { motion } from "framer-motion";

interface TechniqueVisualizerProps {
  techniqueId: string;
}

/** Two Pointer visualization — pointers converging from both ends */
function TwoPointerViz() {
  const arr = [2, 7, 11, 15, 19, 23];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-end gap-1.5">
        {arr.map((v, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border ${
                i === 0
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                  : i === arr.length - 1
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-white/[0.04] border-white/[0.1] text-gray-400"
              }`}
            >
              {v}
            </div>
            <span className="text-[9px] text-gray-500 font-mono">{i}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between w-full px-1">
        <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-1">
          <span className="text-purple-400 text-xs font-bold">L →</span>
        </motion.div>
        <motion.div animate={{ x: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-1">
          <span className="text-cyan-400 text-xs font-bold">← R</span>
        </motion.div>
      </div>
    </div>
  );
}

/** Sliding Window visualization — window slides right */
function SlidingWindowViz() {
  const arr = [1, 3, 2, 6, 4, 1, 8, 5];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-end gap-1">
        {arr.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold bg-white/[0.04] border border-white/[0.1] text-gray-400"
          >
            {v}
          </motion.div>
        ))}
        {/* Sliding window overlay */}
        <motion.div
          className="absolute top-0 h-full rounded-lg border-2 border-emerald-400/60 bg-emerald-400/5"
          style={{ width: `${3 * 40}px` }}
          animate={{ left: ["0px", `${5 * 40}px`, "0px"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[10px] text-emerald-400 font-bold tracking-wider">WINDOW K=3</span>
    </div>
  );
}

/** Prefix Sum visualization — cumulative bars */
function PrefixSumViz() {
  const arr = [2, 4, 1, 5, 3];
  const prefix = arr.reduce<number[]>((acc, v) => [...acc, (acc.at(-1) || 0) + v], []);
  return (
    <div className="flex items-end gap-2 h-24">
      {arr.map((v, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center gap-1 flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}
        >
          <span className="text-[9px] text-emerald-400 font-mono">{prefix[i]}</span>
          <motion.div
            className="w-full rounded-t-md bg-gradient-to-t from-emerald-600/30 to-emerald-400/30 border border-emerald-500/30"
            initial={{ height: 0 }}
            animate={{ height: `${(prefix[i] / 15) * 70}px` }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          />
          <span className="text-[9px] text-gray-500 font-mono">{v}</span>
        </motion.div>
      ))}
    </div>
  );
}

/** Fast & Slow Pointer visualization — tortoise and hare on linked list */
function FastSlowViz() {
  const nodes = ["A", "B", "C", "D", "E", "C"];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-0.5">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                i === 5 ? "bg-red-500/20 border-red-500/40 text-red-300" : "bg-white/[0.04] border-white/[0.1] text-gray-400"
              }`}
            >
              {n}
            </motion.div>
            {i < nodes.length - 1 && <span className="text-gray-600 text-xs mx-0.5">→</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-xs font-bold text-amber-400">🐢 Slow</motion.span>
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-xs font-bold text-rose-400">🐇 Fast</motion.span>
      </div>
    </div>
  );
}

/** Binary Search on Answer — searching answer space */
function BinarySearchAnswerViz() {
  const range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] text-gray-500 font-mono">Answer Space</span>
      <div className="flex gap-0.5">
        {range.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center border ${
              v === 5 ? "bg-rose-500/20 border-rose-500/50 text-rose-300" : i < 5 ? "bg-white/[0.02] border-white/[0.06] text-gray-500" : "bg-white/[0.04] border-white/[0.1] text-gray-400"
            }`}
          >
            {v}
          </motion.div>
        ))}
      </div>
      <motion.div animate={{ x: [0, -20, 20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-[10px] text-rose-400 font-bold">
        ↕ mid=5 feasible?
      </motion.div>
    </div>
  );
}

/** Monotonic Stack — bars with decreasing stack */
function MonotonicStackViz() {
  const arr = [3, 1, 4, 1, 5, 9, 2];
  const max = Math.max(...arr);
  return (
    <div className="flex items-end gap-1 h-20">
      {arr.map((v, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center gap-0.5 flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <motion.div
            className={`w-full rounded-t-sm ${
              v === 9 ? "bg-sky-400/40 border border-sky-400/50" : "bg-sky-500/15 border border-sky-500/20"
            }`}
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 55}px` }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          />
          <span className="text-[9px] text-gray-500 font-mono">{v}</span>
        </motion.div>
      ))}
    </div>
  );
}

/** Backtracking — decision tree */
function BacktrackingViz() {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[10px] font-bold text-orange-300">
        ∅
      </motion.div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <div className="w-px h-3 bg-orange-500/30" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="w-6 h-6 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[9px] text-orange-300">1</motion.div>
          <div className="flex gap-3 mt-1">
            <div className="flex flex-col items-center">
              <div className="w-px h-2 bg-orange-500/20" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[8px] text-emerald-300">✓</motion.div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-px h-2 bg-orange-500/20" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[8px] text-red-300">✗</motion.div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-px h-3 bg-orange-500/30" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="w-6 h-6 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[9px] text-orange-300">2</motion.div>
          <div className="flex gap-3 mt-1">
            <div className="flex flex-col items-center">
              <div className="w-px h-2 bg-orange-500/20" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[8px] text-emerald-300">✓</motion.div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-px h-2 bg-orange-500/20" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[8px] text-red-300">✗</motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Greedy — sorted intervals being picked */
function GreedyViz() {
  const intervals = [
    { s: 0, e: 3, pick: true },
    { s: 1, e: 4, pick: false },
    { s: 3, e: 6, pick: true },
    { s: 5, e: 7, pick: false },
    { s: 6, e: 9, pick: true },
  ];
  return (
    <div className="flex flex-col gap-1 w-full">
      {intervals.map((iv, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-2"
        >
          <div
            className={`h-4 rounded-full ${
              iv.pick ? "bg-lime-500/30 border border-lime-500/40" : "bg-gray-500/10 border border-gray-500/20"
            }`}
            style={{ marginLeft: `${iv.s * 16}px`, width: `${(iv.e - iv.s) * 16}px` }}
          />
          <span className={`text-[9px] font-mono ${iv.pick ? "text-lime-400" : "text-gray-600"}`}>
            [{iv.s},{iv.e}]{iv.pick ? " ✓" : " ✗"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** DP — memoization table filling */
function DPViz() {
  const grid = [
    [0, 1, 1, 2],
    [1, 1, 2, 3],
    [1, 2, 2, 4],
    [2, 2, 3, 5],
  ];
  return (
    <div className="flex flex-col items-center gap-0.5">
      {grid.map((row, i) => (
        <div key={i} className="flex gap-0.5">
          {row.map((v, j) => (
            <motion.div
              key={j}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i * 4 + j) * 0.06 }}
              className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold border ${
                i === 3 && j === 3
                  ? "bg-violet-500/30 border-violet-500/50 text-violet-200"
                  : "bg-violet-500/5 border-violet-500/15 text-violet-300/60"
              }`}
            >
              {v}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** BFS/DFS — graph traversal */
function BFSDFSViz() {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-full bg-teal-500/20 border-2 border-teal-500/50 flex items-center justify-center text-[10px] font-bold text-teal-300">0</motion.div>
      <div className="flex gap-8">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-col items-center">
            <div className="w-px h-3 bg-teal-500/30" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 * n }} className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-300">{n}</motion.div>
            <div className="flex gap-3 mt-1">
              {[n * 2 + 1, n * 2 + 2].map((c) => (
                <div key={c} className="flex flex-col items-center">
                  <div className="w-px h-2 bg-teal-500/20" />
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * c }} className="w-5 h-5 rounded-full bg-teal-500/5 border border-teal-500/20 flex items-center justify-center text-[8px] text-teal-400/60">{c}</motion.div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const vizMap: Record<string, React.FC> = {
  "two-pointer": TwoPointerViz,
  "sliding-window": SlidingWindowViz,
  "prefix-sum": PrefixSumViz,
  "fast-slow-pointer": FastSlowViz,
  "binary-search-on-answer": BinarySearchAnswerViz,
  "monotonic-stack": MonotonicStackViz,
  backtracking: BacktrackingViz,
  greedy: GreedyViz,
  "dp-memoization": DPViz,
  "bfs-dfs": BFSDFSViz,
};

export default function TechniqueVisualizer({ techniqueId }: TechniqueVisualizerProps) {
  const Viz = vizMap[techniqueId];
  if (!Viz) return null;

  return (
    <div className="flex justify-center p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
      <Viz />
    </div>
  );
}
