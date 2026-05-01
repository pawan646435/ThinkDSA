// src/hooks/useAutoPlay.ts
// Hook for managing auto-play functionality in the visualizer

import { useEffect, useRef } from "react";
import { useVisualizerStore } from "@/store/visualizerStore";

/**
 * Manages auto-play interval for step-by-step visualization.
 * Automatically advances steps at the configured speed.
 */
export function useAutoPlay() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isPlaying, speed, nextStep, steps, currentStep } =
    useVisualizerStore();

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, nextStep, currentStep, steps.length]);

  // Stop playing when reaching the end
  useEffect(() => {
    if (isPlaying && currentStep >= steps.length - 1) {
      useVisualizerStore.getState().pause();
    }
  }, [currentStep, steps.length, isPlaying]);
}
