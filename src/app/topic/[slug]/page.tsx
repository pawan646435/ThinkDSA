// src/app/topic/[slug]/page.tsx
// Dynamic topic page — loads full module for available topics, fallback for others

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  Sparkles,
  BookOpen,
  Home,
} from "lucide-react";
import { getTopicData, isTopicAvailable } from "@/data/topics";
import { useTopicStore } from "@/store/topicStore";
import { useVisualizerStore } from "@/store/visualizerStore";
import { deslugify } from "@/utils/helpers";
import GlassCard from "@/components/ui/GlassCard";
import TabBar from "@/components/ui/TabBar";
import TopicSearch from "@/components/ui/TopicSearch";
import LevelContent from "@/components/learning/LevelContent";
import VisualizerSection from "@/components/learning/VisualizerSection";
import CodeViewer from "@/components/code/CodeViewer";
import PracticeMode from "@/components/learning/PracticeMode";
import MistakeSimulator from "@/components/learning/MistakeSimulator";
import ComplexityView from "@/components/learning/ComplexityView";
import { useAI } from "@/hooks/useAI";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const {
    currentTopic,
    setCurrentTopic,
    activeTab,
    aiExplanation,
    setAiExplanation,
    aiLoading,
    setAiLoading,
  } = useTopicStore();

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { explainSimply } = useAI();

  useEffect(() => {
    // Reset visualizer when topic changes
    useVisualizerStore.getState().setSteps([]);

    if (isTopicAvailable(slug)) {
      const data = getTopicData(slug);
      setCurrentTopic(data);
      setIsAvailable(true);
    } else {
      setCurrentTopic(null);
      setIsAvailable(false);
    }

    return () => {
      // Clean up on unmount
      setCurrentTopic(null);
    };
  }, [slug, setCurrentTopic]);

  const handleAIExplain = async () => {
    setAiLoading(true);
    const topicName = deslugify(slug);
    const result = await explainSimply(topicName);
    if (result) {
      setAiExplanation(result.text);
    }
    setAiLoading(false);
  };

  // Loading state
  if (isAvailable === null) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  // Topic not available — show fallback
  if (!isAvailable || !currentTopic) {
    const topicName = deslugify(slug);
    return (
      <div className="min-h-screen bg-[#050510] text-white">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <GlassCard className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-amber-400" />
              </div>

              <h1 className="text-2xl font-bold mb-3">{topicName}</h1>

              <p className="text-gray-400 mb-6">
                This topic is not available as a full module yet. We&apos;re working
                on adding more topics!
              </p>

              {/* AI Explain button — only triggered on explicit click */}
              {!aiExplanation && (
                <button
                  onClick={handleAIExplain}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:from-purple-500 hover:to-cyan-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25"
                >
                  <Sparkles className="w-5 h-5" />
                  {aiLoading
                    ? "Generating explanation..."
                    : "Get AI Explanation"}
                </button>
              )}

              {/* AI Response */}
              <AnimatePresence>
                {aiExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-left"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-bold text-purple-300">
                        AI Explanation
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {aiExplanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search for another topic */}
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">
                  Try searching for another topic:
                </p>
                <TopicSearch variant="compact" />
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Full topic module
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentTopic.icon}</span>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {currentTopic.title}
                </h1>
              </div>
              <p className="text-sm text-gray-400 mt-1 ml-12">
                {currentTopic.shortDescription}
              </p>
            </div>
          </div>

          <TopicSearch variant="compact" placeholder="Switch topic..." />
        </div>

        {/* Tab Bar */}
        <div className="mb-8">
          <TabBar />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "learn" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LevelContent levels={currentTopic.levels} />
                </div>
                <div>
                  <ComplexityView
                    complexity={currentTopic.complexity}
                    patternTips={currentTopic.patternTips}
                  />
                </div>
              </div>
            )}

            {activeTab === "visualize" && (
              <VisualizerSection topic={currentTopic} />
            )}

            {activeTab === "code" && (
              <div className="max-w-4xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">
                      Code Implementation
                    </h2>
                  </div>
                  <p className="text-sm text-gray-400">
                    Hover over any line to see its explanation. Switch between
                    languages using the tabs.
                  </p>
                </div>
                <CodeViewer snippets={currentTopic.codeSnippets} />
              </div>
            )}

            {activeTab === "practice" && (
              <PracticeMode questions={currentTopic.practiceQuestions} />
            )}

            {activeTab === "mistakes" && (
              <MistakeSimulator mistakes={currentTopic.commonMistakes} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
