// src/data/topics/types.ts
// Type definitions for DSA topic data structures

export interface AlgorithmStep {
  /** Step number (1-indexed) */
  stepNumber: number;
  /** Human-readable description of what happens in this step */
  description: string;
  /** Current state of the data structure for visualization */
  state: Record<string, unknown>;
  /** The line of code being executed (0-indexed) */
  activeLineIndex: number;
  /** Current variable values for the code execution viewer */
  variables: Record<string, string | number | boolean | null>;
  /** Highlight indices in the array/structure */
  highlights: HighlightInfo[];
}

export interface HighlightInfo {
  index: number;
  color: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  label?: string;
}

export interface CodeSnippet {
  language: "javascript" | "python" | "cpp" | "java";
  code: string;
  lineDescriptions?: Record<number, string>;
}

export interface PracticeQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  hint: string;
  solution: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface CommonMistake {
  id: string;
  title: string;
  description: string;
  wrongCode: string;
  correctCode: string;
  explanation: string;
}

export interface ComplexityInfo {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
  explanation: string;
}

export interface TopicLevel {
  level: number;
  title: string;
  content: string;
}

export interface TopicData {
  id: string;
  slug: string;
  title: string;
  category: "searching" | "sorting" | "data-structure" | "graph" | "dynamic-programming" | "other";
  icon: string;
  shortDescription: string;
  levels: TopicLevel[];
  codeSnippets: CodeSnippet[];
  practiceQuestions: PracticeQuestion[];
  commonMistakes: CommonMistake[];
  complexity: ComplexityInfo;
  patternTips: string[];
  /** Function name for step generator */
  stepGeneratorId: string;
}

export interface TopicListItem {
  slug: string;
  title: string;
  category: TopicData["category"];
  icon: string;
  shortDescription: string;
  available: boolean;
}
