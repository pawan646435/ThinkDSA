// src/store/visualizerStore.ts
// Zustand store for step-by-step visualizer state management

import { create } from "zustand";
import { AlgorithmStep } from "@/data/topics/types";

interface VisualizerState {
  /** All generated steps */
  steps: AlgorithmStep[];
  /** Current step index (0-based) */
  currentStep: number;
  /** Whether auto-play is active */
  isPlaying: boolean;
  /** Playback speed in milliseconds between steps */
  speed: number;
  /** Whether the visualizer is initialized */
  isInitialized: boolean;

  // Actions
  setSteps: (steps: AlgorithmStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1000,
  isInitialized: false,

  setSteps: (steps) =>
    set({ steps, currentStep: 0, isInitialized: true, isPlaying: false }),

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  goToStep: (index) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStep: index, isPlaying: false });
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),

  reset: () =>
    set({
      currentStep: 0,
      isPlaying: false,
    }),
}));
