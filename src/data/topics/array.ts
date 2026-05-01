// src/data/topics/array.ts
// Complete data module for Array topic

import { TopicData, AlgorithmStep, HighlightInfo } from "./types";

/**
 * Generates step-by-step execution of common array operations.
 */
export function arrayOperationSteps(
  array: number[],
  operation: "traverse" | "insert" | "delete" | "reverse" = "traverse"
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let stepNumber = 1;

  if (operation === "traverse") {
    steps.push({
      stepNumber: stepNumber++,
      description: `Start traversal of array [${arr.join(", ")}]. We visit each element from index 0 to ${arr.length - 1}.`,
      state: { array: [...arr], operation: "traverse", currentIndex: -1 },
      activeLineIndex: 0,
      variables: { i: "—", "arr[i]": "—", size: arr.length },
      highlights: [],
    });
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Visit index ${i}: arr[${i}] = ${arr[i]}.${i === arr.length - 1 ? " This is the last element." : ""}`,
        state: { array: [...arr], operation: "traverse", currentIndex: i },
        activeLineIndex: 2,
        variables: { i, "arr[i]": arr[i], size: arr.length },
        highlights: [
          { index: i, color: "primary", label: `i=${i}` },
          ...Array.from({ length: i }, (_, j) => ({ index: j, color: "success" as const })),
        ],
      });
    }
    steps.push({
      stepNumber: stepNumber++,
      description: `✅ Traversal complete! Visited all ${arr.length} elements in O(n) time.`,
      state: { array: [...arr], operation: "done", currentIndex: -1 },
      activeLineIndex: 4,
      variables: { i: arr.length, size: arr.length, status: "complete" },
      highlights: arr.map((_, i) => ({ index: i, color: "success" as const, label: "✓" })),
    });
  } else if (operation === "insert") {
    const insertIdx = Math.floor(arr.length / 2);
    const insertVal = 99;
    steps.push({
      stepNumber: stepNumber++,
      description: `Insert value ${insertVal} at index ${insertIdx} in array [${arr.join(", ")}].`,
      state: { array: [...arr], operation: "insert", insertIdx, insertVal },
      activeLineIndex: 0,
      variables: { insertAt: insertIdx, value: insertVal, size: arr.length },
      highlights: [{ index: insertIdx, color: "warning", label: "INSERT" }],
    });
    for (let i = arr.length - 1; i >= insertIdx; i--) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Shift arr[${i}] = ${arr[i]} → arr[${i + 1}]. Making room at index ${insertIdx}.`,
        state: { array: [...arr], operation: "shift", shiftFrom: i, shiftTo: i + 1 },
        activeLineIndex: 3,
        variables: { i, "arr[i]": arr[i], shiftTo: i + 1, size: arr.length },
        highlights: [
          { index: i, color: "danger", label: "FROM" },
          { index: insertIdx, color: "warning", label: "TARGET" },
        ],
      });
    }
    arr.splice(insertIdx, 0, insertVal);
    steps.push({
      stepNumber: stepNumber++,
      description: `✅ Inserted ${insertVal} at index ${insertIdx}! New array: [${arr.join(", ")}]. Size is now ${arr.length}.`,
      state: { array: [...arr], operation: "done", insertIdx },
      activeLineIndex: 5,
      variables: { insertAt: insertIdx, value: insertVal, size: arr.length },
      highlights: [{ index: insertIdx, color: "success", label: "NEW" }],
    });
  } else if (operation === "delete") {
    const delIdx = Math.floor(arr.length / 2);
    const delVal = arr[delIdx];
    steps.push({
      stepNumber: stepNumber++,
      description: `Delete element at index ${delIdx} (value ${delVal}) from array [${arr.join(", ")}].`,
      state: { array: [...arr], operation: "delete", delIdx },
      activeLineIndex: 0,
      variables: { deleteAt: delIdx, value: delVal, size: arr.length },
      highlights: [{ index: delIdx, color: "danger", label: "DEL" }],
    });
    for (let i = delIdx; i < arr.length - 1; i++) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Shift arr[${i + 1}] = ${arr[i + 1]} → arr[${i}]. Filling the gap.`,
        state: { array: [...arr], operation: "shift", shiftFrom: i + 1, shiftTo: i },
        activeLineIndex: 3,
        variables: { i, "arr[i+1]": arr[i + 1], shiftTo: i, size: arr.length },
        highlights: [
          { index: i + 1, color: "primary", label: "FROM" },
          { index: i, color: "warning", label: "TO" },
        ],
      });
    }
    arr.splice(delIdx, 1);
    steps.push({
      stepNumber: stepNumber++,
      description: `✅ Deleted ${delVal} from index ${delIdx}! New array: [${arr.join(", ")}]. Size is now ${arr.length}.`,
      state: { array: [...arr], operation: "done" },
      activeLineIndex: 5,
      variables: { deleted: delVal, size: arr.length },
      highlights: arr.map((_, i) => ({ index: i, color: "success" as const })),
    });
  } else if (operation === "reverse") {
    steps.push({
      stepNumber: stepNumber++,
      description: `Reverse array [${arr.join(", ")}] using two-pointer swap technique.`,
      state: { array: [...arr], operation: "reverse" },
      activeLineIndex: 0,
      variables: { left: 0, right: arr.length - 1, size: arr.length },
      highlights: [
        { index: 0, color: "primary", label: "L" },
        { index: arr.length - 1, color: "secondary", label: "R" },
      ],
    });
    let l = 0, r = arr.length - 1;
    while (l < r) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Swap arr[${l}]=${arr[l]} ↔ arr[${r}]=${arr[r]}.`,
        state: { array: [...arr], operation: "swap", left: l, right: r },
        activeLineIndex: 3,
        variables: { left: l, right: r, "arr[left]": arr[l], "arr[right]": arr[r] },
        highlights: [
          { index: l, color: "warning", label: "SWAP" },
          { index: r, color: "warning", label: "SWAP" },
        ],
      });
      [arr[l], arr[r]] = [arr[r], arr[l]];
      steps.push({
        stepNumber: stepNumber++,
        description: `After swap: arr[${l}]=${arr[l]}, arr[${r}]=${arr[r]}. Move pointers inward.`,
        state: { array: [...arr], operation: "swapped", left: l, right: r },
        activeLineIndex: 4,
        variables: { left: l + 1, right: r - 1, "arr[left]": arr[l], "arr[right]": arr[r] },
        highlights: [
          { index: l, color: "success", label: "✓" },
          { index: r, color: "success", label: "✓" },
        ],
      });
      l++; r--;
    }
    steps.push({
      stepNumber: stepNumber++,
      description: `✅ Array reversed! Result: [${arr.join(", ")}].`,
      state: { array: [...arr], operation: "done" },
      activeLineIndex: 6,
      variables: { size: arr.length, status: "reversed" },
      highlights: arr.map((_, i) => ({ index: i, color: "success" as const, label: "✓" })),
    });
  }
  return steps;
}

export const arrayData: TopicData = {
  id: "array",
  slug: "array",
  title: "Array",
  category: "data-structure",
  icon: "📦",
  shortDescription: "The most fundamental data structure — a contiguous block of memory for storing elements.",
  stepGeneratorId: "array",
  levels: [
    {
      level: 1,
      title: "What is an Array?",
      content: `An **Array** is the simplest and most widely used data structure. It stores elements in **contiguous memory locations**, allowing direct access using an **index**.

**Key properties:**
- **Fixed size** (in most languages) or **dynamic** (JavaScript, Python)
- **Zero-indexed**: first element is at index 0
- **Random access**: access any element in **O(1)** using its index

**Real-world analogy:** Think of a row of lockers 🔒 numbered 0, 1, 2, 3... You can open any locker directly if you know its number — no need to check all the previous ones.

**Why arrays matter:** Almost every algorithm operates on arrays. Sorting, searching, dynamic programming — arrays are the foundation.`,
    },
    {
      level: 2,
      title: "Array Operations & Complexity",
      content: `### Core Operations:

| Operation | Description | Time |
|-----------|-------------|------|
| **Access** | Get element at index i | O(1) |
| **Search** | Find element by value | O(n) |
| **Insert (end)** | Append to the end | O(1)* |
| **Insert (middle)** | Insert at index i | O(n) |
| **Delete (end)** | Remove last element | O(1) |
| **Delete (middle)** | Remove at index i | O(n) |
| **Traverse** | Visit every element | O(n) |

*Amortized O(1) for dynamic arrays.

### Why O(n) for middle insert/delete?
When you insert or delete in the middle, all subsequent elements must shift left or right to fill/make the gap. This shift takes O(n) in the worst case.

### Static vs Dynamic Arrays:
- **Static**: Fixed size, declared at creation (C, Java)
- **Dynamic**: Grow/shrink automatically (JavaScript Array, Python List, C++ vector)
- Dynamic arrays use **doubling strategy** — when full, create a new array 2× the size and copy elements.`,
    },
    {
      level: 3,
      title: "Array Techniques & Patterns",
      content: `### Must-Know Array Patterns:

**1. Two Pointer Technique**
- Use two indices moving towards each other or in the same direction
- Useful for: pair sum, palindrome, partitioning
- Turns O(n²) into O(n)

**2. Sliding Window**
- Maintain a window [left, right] and slide it
- Useful for: subarray sum, longest substring, max in window

**3. Prefix Sum**
- Precompute cumulative sums for O(1) range queries
- \`prefix[i] = prefix[i-1] + arr[i]\`

**4. In-place Modification**
- Modify the array without extra space
- Examples: reverse, rotate, remove duplicates

**5. Kadane's Algorithm**
- Find maximum subarray sum in O(n)
- Track \`currentMax\` and \`globalMax\`

### Common Pitfalls:
- Off-by-one errors (index out of bounds)
- Mutating array while iterating
- Not handling empty arrays`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// Array Operations in JavaScript
const arr = [10, 20, 30, 40, 50];

// Access — O(1)
console.log(arr[2]);           // 30

// Search — O(n)
const idx = arr.indexOf(40);   // 3

// Insert at end — O(1)
arr.push(60);                  // [10,20,30,40,50,60]

// Insert at index 2 — O(n)
arr.splice(2, 0, 25);          // [10,20,25,30,40,50,60]

// Delete at index 2 — O(n)
arr.splice(2, 1);              // [10,20,30,40,50,60]

// Traverse — O(n)
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// Reverse — O(n)
arr.reverse();`,
      lineDescriptions: {
        0: "JavaScript arrays are dynamic (auto-resize)",
        3: "Direct access by index is O(1) — constant time",
        6: "Linear search through array is O(n)",
        9: "Append to end is amortized O(1)",
        12: "splice(index, 0, value) inserts — O(n) due to shifting",
        15: "splice(index, 1) deletes — O(n) due to shifting",
        18: "Standard for-loop traversal visits every element",
        23: "Built-in reverse mutates the array in-place",
      },
    },
    {
      language: "python",
      code: `# Array (List) Operations in Python
arr = [10, 20, 30, 40, 50]

# Access — O(1)
print(arr[2])            # 30

# Search — O(n)
idx = arr.index(40)      # 3

# Insert at end — O(1)
arr.append(60)

# Insert at index 2 — O(n)
arr.insert(2, 25)

# Delete at index 2 — O(n)
arr.pop(2)

# Traverse — O(n)
for i, val in enumerate(arr):
    print(f"arr[{i}] = {val}")

# Reverse — O(n)
arr.reverse()`,
    },
    {
      language: "cpp",
      code: `#include <vector>
using namespace std;

// Dynamic array using vector
vector<int> arr = {10, 20, 30, 40, 50};

// Access — O(1)
int val = arr[2];              // 30

// Search — O(n)
auto it = find(arr.begin(), arr.end(), 40);

// Insert at end — O(1) amortized
arr.push_back(60);

// Insert at index 2 — O(n)
arr.insert(arr.begin() + 2, 25);

// Delete at index 2 — O(n)
arr.erase(arr.begin() + 2);

// Traverse — O(n)
for (int i = 0; i < arr.size(); i++) {
    cout << arr[i] << endl;
}

// Reverse — O(n)
reverse(arr.begin(), arr.end());`,
    },
  ],
  practiceQuestions: [
    {
      id: "arr-q1",
      title: "Find the Maximum Element",
      description: "Given an array of integers, find and return the maximum element.",
      difficulty: "easy",
      hint: "Initialize max as the first element, then compare with every other element.",
      solution: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}`,
      testCases: [
        { input: "[3, 7, 2, 9, 1]", expectedOutput: "9", description: "Max in middle" },
        { input: "[5]", expectedOutput: "5", description: "Single element" },
        { input: "[-3, -1, -7]", expectedOutput: "-1", description: "All negative" },
      ],
    },
    {
      id: "arr-q2",
      title: "Rotate Array by K positions",
      description: "Rotate an array to the right by k positions. Elements that fall off the end wrap around to the beginning.",
      difficulty: "medium",
      hint: "Use the reverse trick: reverse the whole array, then reverse the first k elements, then reverse the rest.",
      solution: `function rotate(arr, k) {
  k = k % arr.length;
  reverse(arr, 0, arr.length - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, arr.length - 1);
}
function reverse(arr, l, r) {
  while (l < r) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    l++; r--;
  }
}`,
      testCases: [
        { input: "[1,2,3,4,5], k=2", expectedOutput: "[4,5,1,2,3]", description: "Rotate right by 2" },
        { input: "[1,2,3], k=3", expectedOutput: "[1,2,3]", description: "Full rotation" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "arr-m1",
      title: "Off-by-One Error (Index Out of Bounds)",
      description: "Accessing index beyond array length",
      wrongCode: `for (let i = 0; i <= arr.length; i++) { // ❌
  console.log(arr[i]); // undefined at last iteration!
}`,
      correctCode: `for (let i = 0; i < arr.length; i++) {  // ✅
  console.log(arr[i]);
}`,
      explanation: "Arrays are zero-indexed, so valid indices are 0 to length-1. Using `<=` accesses index `length` which is out of bounds. This is the most common bug in programming!",
    },
    {
      id: "arr-m2",
      title: "Mutating Array While Iterating",
      description: "Deleting elements during a for loop causes skips",
      wrongCode: `for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) arr.splice(i, 1); // ❌ Skips next element!
}`,
      correctCode: `// Iterate backwards to avoid index shift issues
for (let i = arr.length - 1; i >= 0; i--) {
  if (arr[i] === target) arr.splice(i, 1); // ✅
}`,
      explanation: "When you splice during forward iteration, elements shift left and the next element gets index `i` (which you just passed). Iterate backwards or use filter() to create a new array.",
    },
    {
      id: "arr-m3",
      title: "Shallow Copy vs Deep Copy",
      description: "Assigning arrays creates a reference, not a copy",
      wrongCode: `const copy = arr;         // ❌ Both point to same array!
copy.push(99);            // Modifies original arr too!`,
      correctCode: `const copy = [...arr];    // ✅ Spread creates a shallow copy
// or: const copy = arr.slice();
copy.push(99);            // Original arr is unchanged`,
      explanation: "In JavaScript, arrays are objects. `const copy = arr` copies the reference, not the data. Any change to `copy` also changes `arr`. Use spread `[...arr]`, `slice()`, or `Array.from()` for a copy.",
    },
  ],
  complexity: {
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    explanation: "Array access is O(1) — the fastest possible. Search is O(n) for unsorted arrays, O(log n) for sorted (binary search). Insert/delete at the end is O(1), but middle operations are O(n) due to shifting. Space is O(n) where n is the number of elements stored.",
  },
  patternTips: [
    "📌 If you need O(1) access by index, arrays are your best choice.",
    "📌 If the array is sorted, always consider Binary Search before linear scan.",
    "📌 Two Pointer on sorted arrays can solve many O(n²) problems in O(n).",
    "📌 Prefix sums turn O(n) range queries into O(1) after O(n) preprocessing.",
    "📌 Kadane's algorithm finds max subarray sum in a single O(n) pass.",
    "📌 When order doesn't matter, swap-to-end gives O(1) deletion.",
  ],
};
