// src/components/learning/VisualizerSection.tsx
// Main visualizer section combining visualization + controls + variable tracking

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Shuffle, Settings2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ArrayVisualizer from "@/components/visualizers/ArrayVisualizer";
import StackVisualizer from "@/components/visualizers/StackVisualizer";
import PlaybackControls from "@/components/visualizers/PlaybackControls";
import VariableTracker from "@/components/visualizers/VariableTracker";
import { useVisualizerStore } from "@/store/visualizerStore";
import { stepGenerators } from "@/data/topics";
import { TopicData, AlgorithmStep } from "@/data/topics/types";
import { generateRandomArray } from "@/utils/helpers";

interface VisualizerSectionProps {
  topic: TopicData;
}

const arrayOps = [
  { id: "traverse", label: "Traverse", desc: "Visit each element" },
  { id: "insert", label: "Insert", desc: "Insert in middle" },
  { id: "delete", label: "Delete", desc: "Delete from middle" },
  { id: "reverse", label: "Reverse", desc: "Two-pointer reverse" },
] as const;

export default function VisualizerSection({ topic }: VisualizerSectionProps) {
  const { steps, currentStep, setSteps, isInitialized } = useVisualizerStore();
  const [customArray, setCustomArray] = useState("2, 5, 8, 12, 16, 23, 38, 56, 72, 91");
  const [customTarget, setCustomTarget] = useState("23");
  const [arrayOp, setArrayOp] = useState<"traverse" | "insert" | "delete" | "reverse">("traverse");
  const [arrayInput, setArrayInput] = useState("15, 28, 4, 52, 11, 37, 8, 63");

  // Initialize steps on mount
  useEffect(() => {
    const generator = stepGenerators[topic.stepGeneratorId];
    if (generator && !isInitialized) {
      setSteps(generator());
    }
  }, [topic.stepGeneratorId, setSteps, isInitialized]);

  const regenerateSteps = useCallback(() => {
    const generator = stepGenerators[topic.stepGeneratorId];
    if (!generator) return;

    if (topic.stepGeneratorId === "binarySearch") {
      const arr = customArray.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
      const target = parseInt(customTarget) || 23;
      setSteps(generator(arr.length > 0 ? arr : undefined, target));
    } else if (topic.stepGeneratorId === "array") {
      const arr = arrayInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
      setSteps(generator(arr.length > 0 ? arr : undefined, arrayOp));
    } else {
      setSteps(generator());
    }
  }, [topic.stepGeneratorId, customArray, customTarget, arrayOp, arrayInput, setSteps]);

  const randomize = useCallback(() => {
    if (topic.stepGeneratorId === "binarySearch") {
      const arr = generateRandomArray(8, 1, 99).sort((a, b) => a - b);
      const target = arr[Math.floor(Math.random() * arr.length)];
      setCustomArray(arr.join(", "));
      setCustomTarget(String(target));
      const generator = stepGenerators[topic.stepGeneratorId];
      if (generator) setSteps(generator(arr, target));
    } else if (topic.stepGeneratorId === "array") {
      const arr = generateRandomArray(6, 1, 80);
      setArrayInput(arr.join(", "));
      const generator = stepGenerators[topic.stepGeneratorId];
      if (generator) setSteps(generator(arr, arrayOp));
    } else {
      const generator = stepGenerators[topic.stepGeneratorId];
      if (generator) setSteps(generator());
    }
  }, [topic.stepGeneratorId, arrayOp, setSteps]);

  const currentStepData: AlgorithmStep | null = steps[currentStep] || null;

  return (
    <div className="space-y-6">
      {/* Array Operation Controls */}
      {topic.stepGeneratorId === "array" && (
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-gray-300">Array Operation</span>
          </div>
          {/* Operation selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {arrayOps.map((op) => (
              <button
                key={op.id}
                onClick={() => setArrayOp(op.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  arrayOp === op.id
                    ? "bg-purple-600/20 border-purple-500/40 text-purple-300"
                    : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                {op.label}
                <span className="ml-1.5 text-xs opacity-60">({op.desc})</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Array (comma-separated)</label>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-purple-500/50"
                placeholder="15, 28, 4, 52, 11, 37"
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={regenerateSteps} className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">
                Run
              </button>
              <button onClick={randomize} className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white transition-all" title="Random input">
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Binary Search Controls */}
      {topic.stepGeneratorId === "binarySearch" && (
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-gray-300">Custom Input</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Sorted Array (comma-separated)</label>
              <input type="text" value={customArray} onChange={(e) => setCustomArray(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-purple-500/50" placeholder="2, 5, 8, 12, 16, 23" />
            </div>
            <div className="w-32">
              <label className="text-xs text-gray-500 block mb-1">Target</label>
              <input type="number" value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-purple-500/50" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={regenerateSteps} className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">Run</button>
              <button onClick={randomize} className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white transition-all" title="Random input">
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Stack / Queue Controls */}
      {(topic.stepGeneratorId === "stack" || topic.stepGeneratorId === "queue") && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-gray-300">
                {topic.stepGeneratorId === "stack"
                  ? "Demo: Push(10), Push(25), Push(7), Peek, Pop, Push(42), Pop, Pop"
                  : "Demo: Enqueue(10), Enqueue(25), Enqueue(7), Peek, Dequeue, Enqueue(42)"}
              </span>
            </div>
            <button onClick={randomize} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">
              <Shuffle className="w-4 h-4" />
              Reset
            </button>
          </div>
        </GlassCard>
      )}

      {/* Generic Controls for other topics */}
      {["linkedList", "bubbleSort", "mergeSort", "binaryTree", "graphBFS"].includes(topic.stepGeneratorId) && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-gray-300">
                Default demo — step through the visualization
              </span>
            </div>
            <button onClick={randomize} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">
              <Shuffle className="w-4 h-4" />
              Reset
            </button>
          </div>
        </GlassCard>
      )}

      {/* Visualization Area */}
      {currentStepData && (
        <GlassCard className="p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-500/10"
          >
            <p className="text-sm text-gray-200 leading-relaxed">
              <span className="text-purple-400 font-bold mr-2">Step {currentStepData.stepNumber}:</span>
              {currentStepData.description}
            </p>
          </motion.div>

          <div className="flex justify-center mb-6">
            {/* Array-based visualizer: array, binary search, linked list, sorting, tree, graph */}
            {["binarySearch", "array", "linkedList", "bubbleSort", "mergeSort", "binaryTree", "graphBFS"].includes(topic.stepGeneratorId) && (
              <ArrayVisualizer
                array={(currentStepData.state.array as number[]) || []}
                highlights={currentStepData.highlights}
              />
            )}
            {/* Stack-based visualizer: stack and queue */}
            {(topic.stepGeneratorId === "stack" || topic.stepGeneratorId === "queue") && (
              <StackVisualizer
                stack={(currentStepData.state.stack as number[]) || []}
                operation={(currentStepData.state.operation as string) || ""}
                operationValue={(currentStepData.state.value as number | null) ?? null}
                highlights={currentStepData.highlights}
              />
            )}
          </div>

          <VariableTracker variables={currentStepData.variables} />
        </GlassCard>
      )}

      {steps.length > 0 && (
        <GlassCard className="p-4">
          <PlaybackControls />
        </GlassCard>
      )}
    </div>
  );
}
