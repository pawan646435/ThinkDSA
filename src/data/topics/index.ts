// src/data/topics/index.ts
// Topic registry — central export for all topic data

import { TopicData, TopicListItem } from "./types";
import { binarySearchData, binarySearchSteps } from "./binarySearch";
import { stackData, stackOperationSteps } from "./stack";
import { arrayData, arrayOperationSteps } from "./array";
import { queueData, queueOperationSteps } from "./queue";
import { linkedListData, linkedListSteps } from "./linkedList";
import { bubbleSortData, bubbleSortSteps } from "./bubbleSort";
import { mergeSortData, mergeSortSteps } from "./mergeSort";
import { binaryTreeData, binaryTreeSteps } from "./binaryTree";
import { graphBFSData, graphBFSSteps } from "./graphBFS";
import { AlgorithmStep } from "./types";

/** Map of all fully-implemented topics */
export const topicDataMap: Record<string, TopicData> = {
  array: arrayData,
  "binary-search": binarySearchData,
  stack: stackData,
  queue: queueData,
  "linked-list": linkedListData,
  "bubble-sort": bubbleSortData,
  "merge-sort": mergeSortData,
  "binary-tree": binaryTreeData,
  "graph-bfs": graphBFSData,
};

/** Registry of step generator functions */
export const stepGenerators: Record<
  string,
  (...args: unknown[]) => AlgorithmStep[]
> = {
  binarySearch: (array?: unknown, target?: unknown) =>
    binarySearchSteps(
      (array as number[]) || [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      (target as number) ?? 23
    ),
  stack: (operations?: unknown) =>
    stackOperationSteps(
      (operations as Array<{ type: "push" | "pop" | "peek"; value?: number }>) || [
        { type: "push", value: 10 },
        { type: "push", value: 25 },
        { type: "push", value: 7 },
        { type: "peek" },
        { type: "pop" },
        { type: "push", value: 42 },
        { type: "pop" },
        { type: "pop" },
      ]
    ),
  array: (arr?: unknown, operation?: unknown) =>
    arrayOperationSteps(
      (arr as number[]) || [15, 28, 4, 52, 11, 37, 8, 63],
      (operation as "traverse" | "insert" | "delete" | "reverse") || "traverse"
    ),
  queue: (operations?: unknown) =>
    queueOperationSteps(
      (operations as Array<{ type: "enqueue" | "dequeue" | "peek"; value?: number }>) || undefined
    ),
  linkedList: (operations?: unknown) =>
    linkedListSteps(
      (operations as Array<{ type: "insertHead" | "insertTail" | "delete" | "search"; value: number }>) || undefined
    ),
  bubbleSort: (arr?: unknown) =>
    bubbleSortSteps((arr as number[]) || undefined),
  mergeSort: (arr?: unknown) =>
    mergeSortSteps((arr as number[]) || undefined),
  binaryTree: (values?: unknown, traversal?: unknown) =>
    binaryTreeSteps(
      (values as number[]) || undefined,
      (traversal as "inorder" | "preorder" | "levelorder") || undefined
    ),
  graphBFS: (adjList?: unknown, start?: unknown) =>
    graphBFSSteps(
      (adjList as Record<number, number[]>) || undefined,
      (start as number) || undefined
    ),
};

/** List of all topics for the search/browse UI */
export const topicList: TopicListItem[] = [
  {
    slug: "array",
    title: "Array",
    category: "data-structure",
    icon: "📦",
    shortDescription: "The most fundamental data structure — contiguous memory for O(1) access.",
    available: true,
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    category: "searching",
    icon: "🔍",
    shortDescription: "Find elements efficiently in sorted arrays using divide and conquer.",
    available: true,
  },
  {
    slug: "stack",
    title: "Stack",
    category: "data-structure",
    icon: "📚",
    shortDescription: "LIFO data structure — essential for recursion, undo, and parsing.",
    available: true,
  },
  {
    slug: "queue",
    title: "Queue",
    category: "data-structure",
    icon: "🚶",
    shortDescription: "FIFO data structure for scheduling, BFS, and buffering.",
    available: true,
  },
  {
    slug: "linked-list",
    title: "Linked List",
    category: "data-structure",
    icon: "🔗",
    shortDescription: "Dynamic linear structure with efficient insertions and deletions.",
    available: true,
  },
  {
    slug: "bubble-sort",
    title: "Bubble Sort",
    category: "sorting",
    icon: "🫧",
    shortDescription: "Simple sorting algorithm that repeatedly swaps adjacent elements.",
    available: true,
  },
  {
    slug: "merge-sort",
    title: "Merge Sort",
    category: "sorting",
    icon: "🔀",
    shortDescription: "Efficient divide-and-conquer sorting with O(n log n) guarantee.",
    available: true,
  },
  {
    slug: "binary-tree",
    title: "Binary Tree",
    category: "data-structure",
    icon: "🌳",
    shortDescription: "Hierarchical structure with nodes having at most two children.",
    available: true,
  },
  {
    slug: "graph-bfs",
    title: "Graph BFS",
    category: "graph",
    icon: "🌐",
    shortDescription: "Breadth-first search for shortest paths and level-order traversal.",
    available: true,
  },
];

/** Get topic data by slug, returns null if not available */
export function getTopicData(slug: string): TopicData | null {
  return topicDataMap[slug] || null;
}

/** Check if a topic is fully implemented */
export function isTopicAvailable(slug: string): boolean {
  return slug in topicDataMap;
}

/** Search topics by query string */
export function searchTopics(query: string): TopicListItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return topicList;
  return topicList.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}

export type { TopicData, TopicListItem, AlgorithmStep };
