// src/data/topics/mergeSort.ts
// Complete data module for Merge Sort

import { TopicData, AlgorithmStep } from "./types";

export function mergeSortSteps(input?: number[]): AlgorithmStep[] {
  const original = [...(input || [38, 27, 43, 3, 9, 82, 10])];
  const steps: AlgorithmStep[] = [];
  let stepNumber = 1;

  steps.push({
    stepNumber: stepNumber++,
    description: `Start Merge Sort on [${original.join(", ")}]. Divide the array into halves recursively until single elements, then merge sorted halves.`,
    state: { array: [...original], operation: "init" },
    activeLineIndex: 0,
    variables: { n: original.length, phase: "divide" },
    highlights: [],
  });

  // Simulate iterative bottom-up merge sort for step generation
  const arr = [...original];
  const n = arr.length;

  // Show the divide phase
  for (let i = 0; i < n; i++) {
    steps.push({
      stepNumber: stepNumber++,
      description: `Divide: Element [${arr[i]}] is a sorted subarray of size 1.`,
      state: { array: [...arr], operation: "divide" },
      activeLineIndex: 1,
      variables: { index: i, value: arr[i], subarraySize: 1 },
      highlights: [{ index: i, color: "primary", label: `[${arr[i]}]` }],
    });
  }

  // Bottom-up merge
  let mergeCount = 0;
  for (let size = 1; size < n; size *= 2) {
    for (let left = 0; left < n - size; left += 2 * size) {
      const mid = left + size;
      const right = Math.min(left + 2 * size, n);
      const leftArr = arr.slice(left, mid);
      const rightArr = arr.slice(mid, right);

      steps.push({
        stepNumber: stepNumber++,
        description: `Merge [${leftArr.join(",")}] + [${rightArr.join(",")}] — compare and merge in sorted order.`,
        state: { array: [...arr], operation: "merge" },
        activeLineIndex: 4,
        variables: { left: `[${leftArr}]`, right: `[${rightArr}]`, mergeSize: size * 2 },
        highlights: [
          ...Array.from({ length: mid - left }, (_, i) => ({ index: left + i, color: "primary" as const, label: i === 0 ? "L" : undefined })),
          ...Array.from({ length: right - mid }, (_, i) => ({ index: mid + i, color: "secondary" as const, label: i === 0 ? "R" : undefined })),
        ],
      });

      // Actual merge
      let i = 0, j = 0, k = left;
      const temp: number[] = [];
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) { temp.push(leftArr[i++]); }
        else { temp.push(rightArr[j++]); }
      }
      while (i < leftArr.length) temp.push(leftArr[i++]);
      while (j < rightArr.length) temp.push(rightArr[j++]);

      for (let t = 0; t < temp.length; t++) arr[left + t] = temp[t];
      mergeCount++;

      steps.push({
        stepNumber: stepNumber++,
        description: `Merged result: [${temp.join(", ")}] placed at indices ${left}-${right - 1}.`,
        state: { array: [...arr], operation: "merged" },
        activeLineIndex: 6,
        variables: { merged: `[${temp}]`, merges: mergeCount },
        highlights: Array.from({ length: right - left }, (_, i) => ({
          index: left + i, color: "success" as const,
        })),
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `✅ Merge Sort complete! Result: [${arr.join(", ")}]. Total merges: ${mergeCount}.`,
    state: { array: [...arr], operation: "done" },
    activeLineIndex: 8,
    variables: { merges: mergeCount, status: "sorted" },
    highlights: arr.map((_, i) => ({ index: i, color: "success" as const, label: "✓" })),
  });

  return steps;
}

export const mergeSortData: TopicData = {
  id: "merge-sort",
  slug: "merge-sort",
  title: "Merge Sort",
  category: "sorting",
  icon: "🔀",
  shortDescription: "Efficient divide-and-conquer sorting with O(n log n) guarantee.",
  stepGeneratorId: "mergeSort",
  levels: [
    {
      level: 1,
      title: "What is Merge Sort?",
      content: `**Merge Sort** is a divide-and-conquer sorting algorithm that guarantees **O(n log n)** performance in all cases.

**The idea is brilliantly simple:**
1. **Divide** the array into two halves
2. **Recursively sort** each half
3. **Merge** the two sorted halves into one sorted array

**Real-world analogy:** Imagine sorting a deck of cards 🃏. Split the deck in half, sort each half, then merge them by comparing the top cards of each pile.

**Key properties:**
- **Stable** — preserves relative order of equal elements
- **Not in-place** — needs O(n) extra space for merging
- **Guaranteed O(n log n)** — unlike QuickSort which can degrade to O(n²)
- **Parallelizable** — each half can be sorted independently`,
    },
    {
      level: 2,
      title: "The Merge Process",
      content: `### The key operation: Merge two sorted arrays

Given two sorted arrays, merge them into one sorted array:
1. Compare the first elements of both arrays
2. Take the smaller one, add it to the result
3. Move that array's pointer forward
4. Repeat until one array is exhausted
5. Append remaining elements from the other array

### Complexity Analysis:
| Case | Time | Space |
|------|------|-------|
| **Best** | O(n log n) | O(n) |
| **Average** | O(n log n) | O(n) |
| **Worst** | O(n log n) | O(n) |

**Why O(n log n)?**
- **log n levels** of recursion (halving each time)
- **O(n) work** at each level (merging)
- Total: O(n) × O(log n) = **O(n log n)**

### Why O(n) space?
The merge step requires a temporary array to hold merged elements. This is the main drawback compared to QuickSort's O(log n) space.`,
    },
    {
      level: 3,
      title: "Merge Sort Patterns & Applications",
      content: `### Important Applications:

**1. Counting Inversions**
- Modified merge sort counts how many pairs (i,j) have i < j but arr[i] > arr[j]
- Count during merge: when right element is smaller, inversions += leftRemaining

**2. External Sorting**
- Sorting data that doesn't fit in RAM
- Merge sort works with sequential access — perfect for disk/tape

**3. Sorting Linked Lists**
- Merge sort is the preferred algorithm for linked lists
- Finding middle with slow/fast pointer, no extra space needed for merge

**4. Merge K Sorted Arrays**
- Generalization of merge — use a min-heap for efficiency
- Each merge operation takes O(n log k)

### Comparison:
| Feature | Merge Sort | Quick Sort |
|---------|-----------|-----------|
| Worst case | O(n log n) | O(n²) |
| Space | O(n) | O(log n) |
| Stable? | Yes | No |
| Cache-friendly? | No | Yes |
| In-place? | No | Yes |`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// Merge Sort in JavaScript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      lineDescriptions: {
        0: "Merge Sort — O(n log n) guaranteed, stable, divide-and-conquer",
        2: "Base case: single element is already sorted",
        4: "Find middle, split into two halves",
        5: "Recursively sort left half",
        6: "Recursively sort right half",
        8: "Merge two sorted halves",
        11: "Merge function — the core logic",
        15: "Compare front elements, take smaller one",
        19: "Append remaining elements from whichever array isn't exhausted",
      },
    },
    {
      language: "python",
      code: `# Merge Sort in Python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    },
    {
      language: "cpp",
      code: `#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin()+l, arr.begin()+m+1);
    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);

    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
    },
  ],
  practiceQuestions: [
    {
      id: "ms-q1",
      title: "Implement Merge Sort",
      description: "Sort an array of integers using the merge sort algorithm.",
      difficulty: "medium",
      hint: "Split the array in half recursively until you have single elements, then merge sorted halves.",
      solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(l, r) {
  const res = []; let i=0, j=0;
  while (i<l.length && j<r.length)
    res.push(l[i]<=r[j] ? l[i++] : r[j++]);
  return [...res, ...l.slice(i), ...r.slice(j)];
}`,
      testCases: [
        { input: "[38,27,43,3,9,82,10]", expectedOutput: "[3,9,10,27,38,43,82]", description: "General" },
      ],
    },
    {
      id: "ms-q2",
      title: "Count Inversions in an Array",
      description: "Count the number of inversions: pairs (i,j) where i < j but arr[i] > arr[j].",
      difficulty: "hard",
      hint: "Modify merge sort. During merge, when you pick from the right array, add the number of remaining elements in the left array to the count.",
      solution: `function countInversions(arr) {
  if (arr.length <= 1) return { arr, count: 0 };
  const mid = Math.floor(arr.length / 2);
  const left = countInversions(arr.slice(0, mid));
  const right = countInversions(arr.slice(mid));
  let count = left.count + right.count;
  const merged = []; let i=0, j=0;
  while (i<left.arr.length && j<right.arr.length) {
    if (left.arr[i] <= right.arr[j]) merged.push(left.arr[i++]);
    else { merged.push(right.arr[j++]); count += left.arr.length - i; }
  }
  return { arr: [...merged, ...left.arr.slice(i), ...right.arr.slice(j)], count };
}`,
      testCases: [
        { input: "[3, 1, 2]", expectedOutput: "2", description: "Two inversions: (3,1), (3,2)" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "ms-m1",
      title: "Forgetting the Base Case",
      description: "Infinite recursion without a base case",
      wrongCode: `function mergeSort(arr) {
  const mid = Math.floor(arr.length / 2); // ❌ No base case!
  return merge(mergeSort(arr.slice(0,mid)), mergeSort(arr.slice(mid)));
}`,
      correctCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;   // ✅ Base case
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0,mid)), mergeSort(arr.slice(mid)));
}`,
      explanation: "Without the base case, the function recurses infinitely. Arrays of length 0 or 1 are already sorted — return them immediately.",
    },
    {
      id: "ms-m2",
      title: "Unstable Merge (Using < instead of <=)",
      description: "Breaking stability by not preserving order of equal elements",
      wrongCode: `if (left[i] < right[j])    // ❌ Equal elements from right go first
  result.push(left[i++]);  //    Breaking stability!`,
      correctCode: `if (left[i] <= right[j])   // ✅ Equal elements from left go first
  result.push(left[i++]);  //    Preserves original order`,
      explanation: "Using <= ensures that when elements are equal, the one from the left subarray (which appeared first in the original) goes first. This maintains stability.",
    },
    {
      id: "ms-m3",
      title: "Not Appending Remaining Elements",
      description: "Forgetting to add leftover elements after the while loop",
      wrongCode: `while (i < left.length && j < right.length) {
  // ... comparison logic
}
return result;  // ❌ Remaining elements are lost!`,
      correctCode: `while (i < left.length && j < right.length) {
  // ... comparison logic
}
// ✅ Don't forget the leftovers!
return [...result, ...left.slice(i), ...right.slice(j)];`,
      explanation: "After the while loop, one array may still have remaining elements. These are already sorted and must be appended to the result.",
    },
  ],
  complexity: {
    time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    space: "O(n)",
    explanation: "Merge Sort always divides in half (log n levels) and does O(n) work per level for merging. Unlike QuickSort, it has no worst-case degradation. The O(n) extra space is for the temporary arrays during merge.",
  },
  patternTips: [
    "📌 Merge Sort guarantees O(n log n) — no worst-case surprises unlike QuickSort.",
    "📌 It's the best choice for sorting linked lists (no random access needed).",
    "📌 Modified merge sort counts inversions — a classic interview pattern.",
    "📌 External sorting (disk-based) uses merge sort because it works with sequential access.",
    "📌 The merge step is the key — practice writing it cleanly.",
  ],
};
