// src/components/visualizers/PlaybackControls.tsx
// Visualizer playback controls: play/pause, step, speed, progress

"use client";

import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
} from "lucide-react";
import { useVisualizerStore } from "@/store/visualizerStore";
import { useAutoPlay } from "@/hooks/useAutoPlay";

const speedOptions = [
  { label: "0.5x", value: 2000 },
  { label: "1x", value: 1000 },
  { label: "1.5x", value: 667 },
  { label: "2x", value: 500 },
  { label: "3x", value: 333 },
];

export default function PlaybackControls() {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    setSpeed,
  } = useVisualizerStore();

  // Activate auto-play hook
  useAutoPlay();

  const progress =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;
  const currentSpeedLabel =
    speedOptions.find((s) => s.value === speed)?.label || "1x";

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
        {/* Step dots */}
        <div className="absolute inset-0 flex items-center justify-between px-0.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => useVisualizerStore.getState().goToStep(i)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${
                  i <= currentStep
                    ? "bg-white scale-100"
                    : "bg-white/20 scale-75 hover:bg-white/40 hover:scale-100"
                }
              `}
              title={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Reset */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={reset}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          {/* Previous */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={prevStep}
            disabled={currentStep === 0}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous step"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={togglePlay}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/25 transition-all"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          {/* Next */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next step"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Step counter */}
        <div className="text-sm font-mono text-gray-400">
          Step{" "}
          <span className="text-white font-bold">{currentStep + 1}</span> of{" "}
          <span className="text-white">{steps.length}</span>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-0.5 border border-white/[0.06]">
            {speedOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSpeed(opt.value)}
                className={`
                  px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200
                  ${
                    speed === opt.value
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
