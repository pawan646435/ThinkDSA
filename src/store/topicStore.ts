// src/store/topicStore.ts
// Zustand store for topic state management

import { create } from "zustand";
import { TopicData } from "@/data/topics/types";

interface TopicState {
  /** Currently loaded topic data */
  currentTopic: TopicData | null;
  /** Current learning level (1-indexed) */
  currentLevel: number;
  /** Active tab in the topic view */
  activeTab: "learn" | "visualize" | "code" | "practice" | "mistakes";
  /** Code language selection */
  selectedLanguage: "javascript" | "python" | "cpp" | "java";
  /** Search query */
  searchQuery: string;
  /** Whether AI explanation is loading */
  aiLoading: boolean;
  /** Cached AI explanation for unavailable topics */
  aiExplanation: string | null;

  // Actions
  setCurrentTopic: (topic: TopicData | null) => void;
  setCurrentLevel: (level: number) => void;
  setActiveTab: (tab: TopicState["activeTab"]) => void;
  setSelectedLanguage: (lang: TopicState["selectedLanguage"]) => void;
  setSearchQuery: (query: string) => void;
  setAiLoading: (loading: boolean) => void;
  setAiExplanation: (explanation: string | null) => void;
  resetTopic: () => void;
}

export const useTopicStore = create<TopicState>((set) => ({
  currentTopic: null,
  currentLevel: 1,
  activeTab: "learn",
  selectedLanguage: "javascript",
  searchQuery: "",
  aiLoading: false,
  aiExplanation: null,

  setCurrentTopic: (topic) =>
    set({ currentTopic: topic, currentLevel: 1, aiExplanation: null }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setAiLoading: (loading) => set({ aiLoading: loading }),
  setAiExplanation: (explanation) => set({ aiExplanation: explanation }),
  resetTopic: () =>
    set({
      currentTopic: null,
      currentLevel: 1,
      activeTab: "learn",
      aiExplanation: null,
    }),
}));
