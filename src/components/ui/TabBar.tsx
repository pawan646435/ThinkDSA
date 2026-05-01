// src/components/ui/TabBar.tsx
// Animated tab bar with Framer Motion underline indicator

"use client";

import { motion } from "framer-motion";
import { BookOpen, Eye, Code2, Dumbbell, AlertTriangle } from "lucide-react";
import { useTopicStore } from "@/store/topicStore";

const tabs = [
  { id: "learn" as const, label: "Learn", icon: BookOpen },
  { id: "visualize" as const, label: "Visualize", icon: Eye },
  { id: "code" as const, label: "Code", icon: Code2 },
  { id: "practice" as const, label: "Practice", icon: Dumbbell },
  { id: "mistakes" as const, label: "Mistakes", icon: AlertTriangle },
];

export default function TabBar() {
  const { activeTab, setActiveTab } = useTopicStore();

  return (
    <div className="flex items-center gap-1 p-1 bg-white/[0.03] backdrop-blur-lg rounded-2xl border border-white/[0.06]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-xl
              text-sm font-medium transition-colors duration-300
              ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200"}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
