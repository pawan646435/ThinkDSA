// src/components/ui/TopicSearch.tsx
// Topic search bar with autocomplete and topic suggestions

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, X } from "lucide-react";
import { searchTopics, topicList, TopicListItem } from "@/data/topics";

interface TopicSearchProps {
  /** Size variant */
  variant?: "hero" | "compact";
  /** Placeholder text */
  placeholder?: string;
}

export default function TopicSearch({
  variant = "hero",
  placeholder = "Search any DSA topic... (e.g., Binary Search, Stack)",
}: TopicSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TopicListItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchTopics(value));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const navigateToTopic = useCallback(
    (slug: string) => {
      setIsOpen(false);
      setQuery("");
      router.push(`/topic/${slug}`);
    },
    [router]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        navigateToTopic(results[selectedIndex].slug);
      } else if (query.trim()) {
        const slug = query.toLowerCase().trim().replace(/\s+/g, "-");
        navigateToTopic(slug);
      }
    },
    [query, results, selectedIndex, navigateToTopic]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [results.length]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHero = variant === "hero";

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className={`
            relative flex items-center gap-3 
            bg-white/[0.05] backdrop-blur-xl 
            border border-white/[0.1] 
            rounded-2xl transition-all duration-300
            focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/20
            ${isHero ? "px-6 py-4" : "px-4 py-3"}
          `}
        >
          <Search
            className={`text-purple-400 flex-shrink-0 ${isHero ? "w-6 h-6" : "w-5 h-5"}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              flex-1 bg-transparent outline-none 
              text-white placeholder-gray-400
              ${isHero ? "text-lg" : "text-base"}
            `}
            id="topic-search-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className={`
              flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600
              text-white font-medium rounded-xl
              hover:from-purple-500 hover:to-cyan-500
              transition-all duration-300
              ${isHero ? "px-5 py-2.5 text-base" : "px-4 py-2 text-sm"}
            `}
          >
            <Sparkles className="w-4 h-4" />
            Learn
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl overflow-hidden"
          >
            {results.map((topic, index) => (
              <button
                key={topic.slug}
                onClick={() => navigateToTopic(topic.slug)}
                className={`
                  w-full flex items-center gap-4 px-5 py-3.5
                  transition-all duration-200 text-left
                  ${
                    index === selectedIndex
                      ? "bg-purple-600/20 border-l-2 border-purple-500"
                      : "hover:bg-white/[0.05] border-l-2 border-transparent"
                  }
                `}
              >
                <span className="text-2xl flex-shrink-0">{topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {topic.title}
                    </span>
                    {topic.available ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                        Full Module
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {topic.shortDescription}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Suggestions (Hero variant only) */}
      {isHero && !isOpen && (
        <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
          <span className="text-sm text-gray-500">Popular:</span>
          {topicList
            .filter((t) => t.available)
            .map((topic) => (
              <button
                key={topic.slug}
                onClick={() => navigateToTopic(topic.slug)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-sm text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
              >
                <span>{topic.icon}</span>
                <span>{topic.title}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
