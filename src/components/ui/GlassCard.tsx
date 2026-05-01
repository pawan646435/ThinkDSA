// src/components/ui/GlassCard.tsx
// Reusable glassmorphism card component with Framer Motion

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  /** Enable hover scale animation */
  hover?: boolean;
  /** Glow color accent */
  glow?: "purple" | "cyan" | "emerald" | "amber" | "rose";
}

const glowColors = {
  purple: "shadow-purple-500/20 hover:shadow-purple-500/30",
  cyan: "shadow-cyan-500/20 hover:shadow-cyan-500/30",
  emerald: "shadow-emerald-500/20 hover:shadow-emerald-500/30",
  amber: "shadow-amber-500/20 hover:shadow-amber-500/30",
  rose: "shadow-rose-500/20 hover:shadow-rose-500/30",
};

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = "purple",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-2xl
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.08]
        shadow-2xl ${glowColors[glow]}
        transition-shadow duration-500
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
