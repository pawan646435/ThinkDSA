// src/data/topics/binarySearch.ts
// Complete data module for Binary Search topic

import { TopicData, AlgorithmStep, HighlightInfo } from "./types";

/**
 * Generates step-by-step execution of binary search algorithm.
 * Each step captures the full state for visualization.
 */
export function binarySearchSteps(
  array: number[],
  target: number
): AlgorithmStep[] {
  const sorted = [...array].sort((a, b) => a - b);
  const steps: AlgorithmStep[] = [];
  let left = 0;
  let right = sorted.length - 1;
  let stepNumber = 1;

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: `Initialize: sorted array = [${sorted.join(", ")}], target = ${target}. Set left = 0, right = ${right}.`,
    state: { array: sorted, left, right, mid: -1, target, found: false },
    activeLineIndex: 0,
    variables: { left: 0, right, mid: "—", target, result: "—" },
    highlights: [
      { index: left, color: "primary", label: "L" },
      { index: right, color: "secondary", label: "R" },
    ],
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    const highlights: HighlightInfo[] = [
      { index: left, color: "primary", label: "L" },
      { index: right, color: "secondary", label: "R" },
      { index: mid, color: "warning", label: "M" },
    ];

    steps.push({
      stepNumber: stepNumber++,
      description: `Calculate mid = floor((${left} + ${right}) / 2) = ${mid}. Check arr[${mid}] = ${sorted[mid]}.`,
      state: { array: sorted, left, right, mid, target, found: false },
      activeLineIndex: 2,
      variables: { left, right, mid, target, "arr[mid]": sorted[mid], result: "—" },
      highlights,
    });

    if (sorted[mid] === target) {
      steps.push({
        stepNumber: stepNumber++,
        description: `🎉 Found! arr[${mid}] = ${sorted[mid]} equals target ${target}. Return index ${mid}.`,
        state: { array: sorted, left, right, mid, target, found: true },
        activeLineIndex: 3,
        variables: { left, right, mid, target, "arr[mid]": sorted[mid], result: mid },
        highlights: [{ index: mid, color: "success", label: "✓" }],
      });
      return steps;
    } else if (sorted[mid] < target) {
      steps.push({
        stepNumber: stepNumber++,
        description: `arr[${mid}] = ${sorted[mid]} < target ${target}. Move left to mid + 1 = ${mid + 1}. Discard left half.`,
        state: { array: sorted, left: mid + 1, right, mid, target, found: false },
        activeLineIndex: 5,
        variables: { left: mid + 1, right, mid, target, "arr[mid]": sorted[mid], result: "—" },
        highlights: [
          { index: mid + 1, color: "primary", label: "L" },
          { index: right, color: "secondary", label: "R" },
        ],
      });
      left = mid + 1;
    } else {
      steps.push({
        stepNumber: stepNumber++,
        description: `arr[${mid}] = ${sorted[mid]} > target ${target}. Move right to mid - 1 = ${mid - 1}. Discard right half.`,
        state: { array: sorted, left, right: mid - 1, mid, target, found: false },
        activeLineIndex: 7,
        variables: { left, right: mid - 1, mid, target, "arr[mid]": sorted[mid], result: "—" },
        highlights: [
          { index: left, color: "primary", label: "L" },
          { index: mid - 1, color: "secondary", label: "R" },
        ],
      });
      right = mid - 1;
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `❌ Target ${target} not found. left (${left}) > right (${right}), search space exhausted.`,
    state: { array: sorted, left, right, mid: -1, target, found: false },
    activeLineIndex: 9,
    variables: { left, right, mid: "—", target, result: -1 },
    highlights: [],
  });

  return steps;
}

export const binarySearchData: TopicData = {
  id: "binary-search",
  slug: "binary-search",
  title: "Binary Search",
  category: "searching",
  icon: "🔍",
  shortDescription:
    "An efficient algorithm to find elements in a sorted array by repeatedly dividing the search space in half.",
  stepGeneratorId: "binarySearch",

  levels: [
    {
      level: 1,
      title: "What is Binary Search?",
      content: `**Binary Search** is like finding a word in a dictionary. Instead of checking every page one by one, you open the middle, and decide whether to look left or right.

**Key idea:** If the array is **sorted**, you can eliminate **half** the elements in each step.

**Real-world analogy:** Imagine guessing a number between 1-100. If someone says "higher" or "lower" after each guess, you'd guess 50 first, then 25 or 75, and so on. That's binary search!`,
    },
    {
      level: 2,
      title: "How Does It Work?",
      content: `### Step-by-step process:

1. **Start** with two pointers: \`left = 0\`, \`right = length - 1\`
2. **Find the middle**: \`mid = floor((left + right) / 2)\`
3. **Compare** \`arr[mid]\` with target:
   - If **equal** → 🎉 Found it! Return \`mid\`
   - If **arr[mid] < target** → search right half (\`left = mid + 1\`)
   - If **arr[mid] > target** → search left half (\`right = mid - 1\`)
4. **Repeat** until \`left > right\` (not found)

**Why is it fast?** Each step cuts the search space in half. For 1 million elements, it takes at most **20 comparisons** (log₂1000000 ≈ 20).`,
    },
    {
      level: 3,
      title: "Important Conditions & Edge Cases",
      content: `### Prerequisites:
- The array **must be sorted** (ascending or descending)
- If unsorted, sort first (O(n log n)) then search (O(log n))

### Edge Cases to Watch:
- **Empty array** → return -1 immediately
- **Single element** → check if it matches target
- **Target at boundaries** → algorithm handles this naturally
- **Duplicate elements** → basic binary search finds *any* occurrence
- **Integer overflow** → use \`mid = left + (right - left) / 2\` instead of \`(left + right) / 2\`

### Variants:
- **Lower bound** → find first occurrence
- **Upper bound** → find last occurrence
- **Search in rotated array** → modified binary search`,
    },
  ],

  codeSnippets: [
    {
      language: "javascript",
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;          // Found!
    } else if (arr[mid] < target) {
      left = mid + 1;      // Search right half
    } else {
      right = mid - 1;     // Search left half
    }
  }

  return -1;               // Not found
}`,
      lineDescriptions: {
        0: "Define function with sorted array and target value",
        1: "Initialize left pointer at start of array",
        2: "Initialize right pointer at end of array",
        4: "Loop while search space is valid",
        5: "Calculate middle index",
        7: "Check if middle element is the target",
        8: "Return the index — element found!",
        9: "If middle is less than target...",
        10: "Move left pointer right — discard left half",
        11: "If middle is greater than target...",
        12: "Move right pointer left — discard right half",
        15: "Target not found in the array",
      },
    },
    {
      language: "python",
      code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid           # Found!
        elif arr[mid] < target:
            left = mid + 1       # Search right half
        else:
            right = mid - 1      # Search left half

    return -1                    # Not found`,
    },
    {
      language: "cpp",
      code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
            return mid;              // Found!
        else if (arr[mid] < target)
            left = mid + 1;          // Search right half
        else
            right = mid - 1;         // Search left half
    }

    return -1;                       // Not found
}`,
    },
  ],

  practiceQuestions: [
    {
      id: "bs-q1",
      title: "Find Target in Sorted Array",
      description:
        "Given a sorted array of integers and a target value, return the index of the target if found, otherwise return -1.",
      difficulty: "easy",
      hint: "Use two pointers (left and right) and compare the middle element with the target.",
      solution: `function search(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (arr[m] === target) return m;
    arr[m] < target ? l = m + 1 : r = m - 1;
  }
  return -1;
}`,
      testCases: [
        { input: "[1,3,5,7,9], 5", expectedOutput: "2", description: "Target in middle" },
        { input: "[2,4,6,8], 1", expectedOutput: "-1", description: "Target not present" },
        { input: "[10], 10", expectedOutput: "0", description: "Single element array" },
      ],
    },
    {
      id: "bs-q2",
      title: "Find First Occurrence",
      description:
        "Given a sorted array with duplicates, find the index of the first occurrence of a target value.",
      difficulty: "medium",
      hint: "When you find the target, don't return immediately. Instead, save the index and keep searching left.",
      solution: `function firstOccurrence(arr, target) {
  let l = 0, r = arr.length - 1, result = -1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (arr[m] === target) { result = m; r = m - 1; }
    else if (arr[m] < target) l = m + 1;
    else r = m - 1;
  }
  return result;
}`,
      testCases: [
        { input: "[1,2,2,2,3], 2", expectedOutput: "1", description: "Multiple occurrences" },
        { input: "[1,1,1,1], 1", expectedOutput: "0", description: "All same elements" },
        { input: "[1,2,3], 4", expectedOutput: "-1", description: "Not found" },
      ],
    },
  ],

  commonMistakes: [
    {
      id: "bs-m1",
      title: "Using < instead of <=",
      description: "Forgetting to include the case when left equals right",
      wrongCode: `while (left < right) {  // ❌ Bug!
  // ...
}`,
      correctCode: `while (left <= right) {  // ✅ Correct
  // ...
}`,
      explanation:
        "When `left === right`, there's still one element to check. Using `<` instead of `<=` skips this element and can cause the algorithm to miss the target when it's the last remaining element.",
    },
    {
      id: "bs-m2",
      title: "Integer Overflow in Mid Calculation",
      description: "Using (left + right) / 2 can overflow for large values",
      wrongCode: `const mid = Math.floor((left + right) / 2);  // ⚠️ Can overflow`,
      correctCode: `const mid = left + Math.floor((right - left) / 2);  // ✅ Safe`,
      explanation:
        "In languages with fixed-size integers (Java, C++), `left + right` can overflow. Using `left + (right - left) / 2` avoids this. In JavaScript, this is less of an issue due to floating-point numbers, but it's still a good practice.",
    },
    {
      id: "bs-m3",
      title: "Not Updating Pointers Correctly",
      description: "Setting left = mid or right = mid instead of mid ± 1",
      wrongCode: `if (arr[mid] < target) {
  left = mid;      // ❌ Infinite loop!
}`,
      correctCode: `if (arr[mid] < target) {
  left = mid + 1;  // ✅ Skip the checked element
}`,
      explanation:
        "If you set `left = mid`, the loop can get stuck when `left === mid` (e.g., when there are only two elements). Always use `mid + 1` or `mid - 1` to ensure progress.",
    },
  ],

  complexity: {
    time: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    space: "O(1)",
    explanation:
      "Binary search divides the search space in half each iteration. With n elements, the maximum number of steps is log₂(n). Since we only use a few variables (left, right, mid), space is constant O(1). The best case O(1) occurs when the target is at the middle of the array on the first check.",
  },

  patternTips: [
    "📌 Whenever you see 'sorted array' + 'find element', think Binary Search first.",
    "📌 If the problem says 'minimize the maximum' or 'maximize the minimum', consider Binary Search on the answer.",
    "📌 Binary Search works on any monotonic function, not just arrays. If f(x) changes from false to true, you can binary search for the transition point.",
    "📌 For problems like 'find peak element' or 'search in rotated array', binary search with modified conditions applies.",
    "📌 Two-pointer problems on sorted arrays often have binary search variants that are more efficient.",
  ],
};
