// src/data/topics/bubbleSort.ts
// Complete data module for Bubble Sort

import { TopicData, AlgorithmStep } from "./types";

export function bubbleSortSteps(input?: number[]): AlgorithmStep[] {
  const arr = [...(input || [64, 34, 25, 12, 22, 11, 90])];
  const steps: AlgorithmStep[] = [];
  const n = arr.length;
  let stepNumber = 1;

  steps.push({
    stepNumber: stepNumber++,
    description: `Start Bubble Sort on [${arr.join(", ")}]. We'll make ${n - 1} passes, bubbling the largest element to the end each time.`,
    state: { array: [...arr], operation: "init" },
    activeLineIndex: 0,
    variables: { n, pass: 0, comparisons: 0, swaps: 0 },
    highlights: [],
  });

  let totalComparisons = 0;
  let totalSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      totalComparisons++;
      const comparing = arr[j] > arr[j + 1];
      steps.push({
        stepNumber: stepNumber++,
        description: `Pass ${i + 1}: Compare arr[${j}]=${arr[j]} ${comparing ? ">" : "≤"} arr[${j + 1}]=${arr[j + 1]}.${comparing ? " Swap needed!" : " No swap."}`,
        state: { array: [...arr], operation: "compare" },
        activeLineIndex: 3,
        variables: { pass: i + 1, j, "arr[j]": arr[j], "arr[j+1]": arr[j + 1], swap: comparing, comparisons: totalComparisons },
        highlights: [
          { index: j, color: comparing ? "warning" : "primary", label: "j" },
          { index: j + 1, color: comparing ? "warning" : "secondary", label: "j+1" },
          ...Array.from({ length: i }, (_, k) => ({ index: n - 1 - k, color: "success" as const, label: "✓" })),
        ],
      });

      if (comparing) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        totalSwaps++;
        steps.push({
          stepNumber: stepNumber++,
          description: `Swapped! arr[${j}]=${arr[j]}, arr[${j + 1}]=${arr[j + 1]}.`,
          state: { array: [...arr], operation: "swap" },
          activeLineIndex: 4,
          variables: { pass: i + 1, j, swaps: totalSwaps },
          highlights: [
            { index: j, color: "success" },
            { index: j + 1, color: "success" },
            ...Array.from({ length: i }, (_, k) => ({ index: n - 1 - k, color: "success" as const, label: "✓" })),
          ],
        });
      }
    }

    steps.push({
      stepNumber: stepNumber++,
      description: `Pass ${i + 1} complete! Element ${arr[n - 1 - i]} is now in its correct position at index ${n - 1 - i}.${!swapped ? " No swaps this pass — array is sorted early!" : ""}`,
      state: { array: [...arr], operation: "passComplete" },
      activeLineIndex: 6,
      variables: { pass: i + 1, sorted: arr[n - 1 - i], comparisons: totalComparisons, swaps: totalSwaps },
      highlights: Array.from({ length: i + 1 }, (_, k) => ({
        index: n - 1 - k,
        color: "success" as const,
        label: "✓",
      })),
    });

    if (!swapped) break;
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `✅ Bubble Sort complete! Result: [${arr.join(", ")}]. Total comparisons: ${totalComparisons}, swaps: ${totalSwaps}.`,
    state: { array: [...arr], operation: "done" },
    activeLineIndex: 8,
    variables: { comparisons: totalComparisons, swaps: totalSwaps, status: "sorted" },
    highlights: arr.map((_, i) => ({ index: i, color: "success" as const, label: "✓" })),
  });

  return steps;
}

export const bubbleSortData: TopicData = {
  id: "bubble-sort",
  slug: "bubble-sort",
  title: "Bubble Sort",
  category: "sorting",
  icon: "🫧",
  shortDescription: "Simple sorting algorithm that repeatedly swaps adjacent elements.",
  stepGeneratorId: "bubbleSort",
  levels: [
    {
      level: 1,
      title: "What is Bubble Sort?",
      content: `**Bubble Sort** is the simplest sorting algorithm. It works by repeatedly stepping through the list, comparing adjacent elements, and **swapping** them if they're in the wrong order.

**Why "Bubble"?** The largest elements "bubble up" to the end of the array with each pass — like air bubbles rising in water 🫧.

**How it works:**
1. Compare each pair of adjacent elements
2. Swap if they're in the wrong order
3. Repeat until no more swaps are needed
4. After each pass, the largest unsorted element is in its correct position

**Properties:**
- **Stable** — equal elements maintain their original order
- **In-place** — uses O(1) extra space
- **Adaptive** — if nearly sorted, can finish early with the "swapped" flag`,
    },
    {
      level: 2,
      title: "Algorithm & Complexity",
      content: `### Algorithm:
\`\`\`
for i = 0 to n-2:
  swapped = false
  for j = 0 to n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
      swapped = true
  if !swapped: break   // optimization
\`\`\`

### Complexity:
| Case | Comparisons | Swaps |
|------|-------------|-------|
| **Best** (already sorted) | O(n) | 0 |
| **Average** | O(n²) | O(n²) |
| **Worst** (reverse sorted) | O(n²) | O(n²) |

**Space**: O(1) — only uses a temp variable for swapping.

### Why is Bubble Sort O(n²)?
- n-1 passes through the array
- Each pass makes up to n-1 comparisons
- Total: (n-1) + (n-2) + ... + 1 = n(n-1)/2 ≈ O(n²)

### When to use Bubble Sort:
- Almost never in production! It's primarily for **educational purposes**
- Useful when data is nearly sorted (with the swap flag optimization)
- Good for understanding sorting fundamentals before learning efficient algorithms`,
    },
    {
      level: 3,
      title: "Optimizations & Comparisons",
      content: `### Optimizations:

**1. Early Termination (Swap Flag)**
If no swaps occur during a pass, the array is already sorted. This brings best-case to O(n).

**2. Shrinking Inner Loop**
After each pass, the last i elements are sorted. Inner loop only needs to go to n-i-1.

**3. Cocktail Shaker Sort**
Alternate between left-to-right and right-to-left passes. Helps when small elements are at the end ("turtle" elements).

### Comparison with Other O(n²) Sorts:

| Algorithm | Best | Average | Worst | Stable? | Swaps |
|-----------|------|---------|-------|---------|-------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | Yes | Many |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | No | O(n) |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | Yes | Moderate |

**Key insight**: Insertion Sort is almost always preferred over Bubble Sort — same complexity but fewer swaps and better cache performance.`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// Bubble Sort in JavaScript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;  // Already sorted
  }
  return arr;
}`,
      lineDescriptions: {
        0: "Bubble Sort — O(n²) average, O(n) best case",
        3: "Outer loop: each pass places one element correctly",
        4: "Track if any swaps occurred this pass",
        5: "Inner loop: compare adjacent pairs, stop before sorted portion",
        6: "If left > right, they're out of order",
        7: "Destructuring swap — clean ES6 syntax",
        11: "Optimization: if no swaps, array is already sorted!",
      },
    },
    {
      language: "python",
      code: `# Bubble Sort in Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    },
    {
      language: "cpp",
      code: `#include <vector>
#include <algorithm>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
  ],
  practiceQuestions: [
    {
      id: "bs-q1",
      title: "Sort an Array Using Bubble Sort",
      description: "Implement bubble sort to sort an array of integers in ascending order.",
      difficulty: "easy",
      hint: "Two nested loops: outer for passes, inner for comparisons. Swap adjacent elements if out of order. Add a 'swapped' flag for early termination.",
      solution: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      testCases: [
        { input: "[5, 3, 8, 1, 2]", expectedOutput: "[1, 2, 3, 5, 8]", description: "General case" },
        { input: "[1, 2, 3]", expectedOutput: "[1, 2, 3]", description: "Already sorted" },
      ],
    },
    {
      id: "bs-q2",
      title: "Count Swaps in Bubble Sort",
      description: "Given an array, count how many swaps bubble sort would make to sort it.",
      difficulty: "medium",
      hint: "The number of swaps equals the number of inversions — pairs (i,j) where i < j but arr[i] > arr[j].",
      solution: `function countSwaps(arr) {
  let swaps = 0;
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++)
    for (let j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j+1]) {
        [a[j], a[j+1]] = [a[j+1], a[j]];
        swaps++;
      }
  return swaps;
}`,
      testCases: [
        { input: "[3, 2, 1]", expectedOutput: "3", description: "Reverse sorted — max swaps" },
        { input: "[1, 2, 3]", expectedOutput: "0", description: "Already sorted" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "bs-m1",
      title: "Wrong Inner Loop Bound",
      description: "Not shrinking the inner loop after each pass",
      wrongCode: `for (let j = 0; j < n - 1; j++) {  // ❌ Checks already sorted elements
  if (arr[j] > arr[j+1]) swap...
}`,
      correctCode: `for (let j = 0; j < n - i - 1; j++) {  // ✅ Skip sorted tail
  if (arr[j] > arr[j+1]) swap...
}`,
      explanation: "After pass i, the last i elements are already in their correct positions. Using n-i-1 instead of n-1 avoids redundant comparisons.",
    },
    {
      id: "bs-m2",
      title: "Missing the Swap Flag Optimization",
      description: "Not detecting when array is already sorted",
      wrongCode: `// ❌ Always runs all n-1 passes even if sorted after pass 1
for (let i = 0; i < n - 1; i++)
  for (let j = 0; j < n - i - 1; j++)
    if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);`,
      correctCode: `for (let i = 0; i < n - 1; i++) {
  let swapped = false;
  for (let j = 0; j < n - i - 1; j++)
    if (arr[j] > arr[j+1]) { swap(...); swapped = true; }
  if (!swapped) break;  // ✅ Early exit
}`,
      explanation: "Without the swap flag, bubble sort always runs O(n²) even on sorted arrays. The flag gives O(n) best-case performance.",
    },
    {
      id: "bs-m3",
      title: "Incorrect Swap (Without Temp Variable)",
      description: "Attempting to swap without a temporary variable",
      wrongCode: `arr[j] = arr[j+1];     // ❌ Original arr[j] is lost!
arr[j+1] = arr[j];     // Both are now arr[j+1]`,
      correctCode: `const temp = arr[j];   // ✅ Save before overwriting
arr[j] = arr[j+1];
arr[j+1] = temp;
// Or use destructuring: [arr[j], arr[j+1]] = [arr[j+1], arr[j]]`,
      explanation: "When swapping, you must save one value first. Without a temp variable, you overwrite the original value. Destructuring assignment is the cleanest approach in JS.",
    },
  ],
  complexity: {
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    explanation: "Best case O(n) when array is already sorted (with swap flag). Average and worst case O(n²) — each of n passes does up to n comparisons. Space is O(1) since sorting is done in-place.",
  },
  patternTips: [
    "📌 Bubble Sort is mainly for learning — use QuickSort or MergeSort in practice.",
    "📌 The 'swapped' flag optimization is essential — always include it.",
    "📌 After each pass, the largest unsorted element 'bubbles' to its correct position.",
    "📌 Counting inversions (swaps) is a classic interview variation.",
    "📌 Stable sort — equal elements maintain relative order.",
  ],
};
