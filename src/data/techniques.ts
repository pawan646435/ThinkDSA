// src/data/techniques.ts
// DSA problem-solving techniques data

export interface Technique {
  id: string;
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  tagline: string;
  description: string;
  whenToUse: string[];
  howItWorks: string[];
  template: string;
  examples: { name: string; difficulty: string }[];
  complexity: string;
  keyInsight: string;
}

export const techniques: Technique[] = [
  {
    id: "two-pointer",
    title: "Two Pointer",
    icon: "👉👈",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "from-purple-500/10 to-purple-600/10",
    tagline: "Squeeze from both ends or chase with two runners",
    description:
      "Use two pointers that move towards each other (opposite direction) or in the same direction to solve problems on sorted arrays or linked lists in O(n) time instead of O(n²).",
    whenToUse: [
      "Array is sorted or can be sorted",
      "Find pair with a given sum / difference",
      "Remove duplicates in-place",
      "Comparing elements from both ends (palindrome check)",
      "Partitioning arrays (Dutch National Flag)",
    ],
    howItWorks: [
      "Place one pointer at the start, another at the end (or both at start)",
      "Compare elements at both pointers",
      "Move pointers inward based on condition (too small → move left, too big → move right)",
      "Repeat until pointers meet or cross",
    ],
    template: `function twoPointer(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
    examples: [
      { name: "Two Sum II (sorted array)", difficulty: "Easy" },
      { name: "Container With Most Water", difficulty: "Medium" },
      { name: "3Sum", difficulty: "Medium" },
      { name: "Trapping Rain Water", difficulty: "Hard" },
    ],
    complexity: "O(n) time, O(1) space",
    keyInsight: "Sorted array + pair search = Two Pointer. It eliminates the need for nested loops.",
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    icon: "🪟",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgColor: "from-cyan-500/10 to-cyan-600/10",
    tagline: "Maintain a window that slides across the array",
    description:
      "Maintain a subset (window) of elements and slide it across the data. Avoids recomputation by adding/removing one element at a time — turning O(n×k) into O(n).",
    whenToUse: [
      "Find max/min sum of subarray of size k",
      "Longest/shortest substring with a condition",
      "Contiguous subarray or substring problems",
      "String anagram or permutation matching",
      "Problems mentioning 'consecutive' or 'contiguous'",
    ],
    howItWorks: [
      "Initialize window with first k elements (fixed) or empty (variable)",
      "Slide right boundary to expand the window",
      "If condition breaks, shrink from left boundary",
      "Track the answer (max length, min length, max sum, etc.)",
    ],
    template: `function slidingWindow(arr, k) {
  let windowSum = 0, maxSum = -Infinity;
  let left = 0;
  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right];          // expand
    if (right - left + 1 > k) {
      windowSum -= arr[left];         // shrink
      left++;
    }
    if (right - left + 1 === k) {
      maxSum = Math.max(maxSum, windowSum);
    }
  }
  return maxSum;
}`,
    examples: [
      { name: "Maximum Sum Subarray of Size K", difficulty: "Easy" },
      { name: "Longest Substring Without Repeating Chars", difficulty: "Medium" },
      { name: "Minimum Window Substring", difficulty: "Hard" },
      { name: "Permutation in String", difficulty: "Medium" },
    ],
    complexity: "O(n) time, O(1) or O(k) space",
    keyInsight: "If you see 'subarray/substring of size k' or 'longest/shortest with condition' → Sliding Window.",
  },
  {
    id: "prefix-sum",
    title: "Prefix Sum",
    icon: "📊",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgColor: "from-emerald-500/10 to-emerald-600/10",
    tagline: "Precompute cumulative sums for instant range queries",
    description:
      "Build a prefix sum array where prefix[i] = sum of elements from index 0 to i. Any range sum can then be computed in O(1) using prefix[right] - prefix[left-1].",
    whenToUse: [
      "Multiple range sum queries on a static array",
      "Subarray sum equals target",
      "Count subarrays with a given sum",
      "2D matrix region sum queries",
      "Difference array for range updates",
    ],
    howItWorks: [
      "Build prefix array: prefix[i] = prefix[i-1] + arr[i]",
      "Range sum(l, r) = prefix[r] - prefix[l-1]",
      "For subarray sum = k, use hashmap: check if (currentSum - k) exists in map",
      "Each query is now O(1) instead of O(n)",
    ],
    template: `function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const num of nums) {
    sum += num;
    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}`,
    examples: [
      { name: "Range Sum Query", difficulty: "Easy" },
      { name: "Subarray Sum Equals K", difficulty: "Medium" },
      { name: "Contiguous Array (0s and 1s)", difficulty: "Medium" },
      { name: "2D Matrix Region Sum", difficulty: "Hard" },
    ],
    complexity: "O(n) build, O(1) per query",
    keyInsight: "Prefix sum + hashmap = O(n) subarray sum problems. Think cumulative!",
  },
  {
    id: "fast-slow-pointer",
    title: "Fast & Slow Pointer",
    icon: "🐢🐇",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "from-amber-500/10 to-amber-600/10",
    tagline: "Tortoise and Hare — detect cycles and find midpoints",
    description:
      "Use two pointers moving at different speeds. The fast pointer moves 2 steps, slow moves 1. They'll meet inside a cycle, or fast reaches the end (no cycle). Also finds the middle of a linked list in one pass.",
    whenToUse: [
      "Detect cycle in linked list or array",
      "Find the start of a cycle",
      "Find the middle of a linked list",
      "Detect if a number is a happy number",
      "Find duplicate number in array (Floyd's algorithm)",
    ],
    howItWorks: [
      "Initialize slow = head, fast = head",
      "Move slow by 1 step, fast by 2 steps each iteration",
      "If they meet → cycle exists; if fast reaches null → no cycle",
      "To find cycle start: reset one pointer to head, move both by 1",
    ],
    template: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    examples: [
      { name: "Linked List Cycle Detection", difficulty: "Easy" },
      { name: "Find Cycle Start Node", difficulty: "Medium" },
      { name: "Middle of Linked List", difficulty: "Easy" },
      { name: "Find the Duplicate Number", difficulty: "Medium" },
    ],
    complexity: "O(n) time, O(1) space",
    keyInsight: "Cycle detection or finding middle without extra space? Floyd's Tortoise and Hare.",
  },
  {
    id: "binary-search-on-answer",
    title: "Binary Search on Answer",
    icon: "🎯",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgColor: "from-rose-500/10 to-rose-600/10",
    tagline: "Don't search in the array — search in the answer space",
    description:
      "Instead of searching for an element, binary search over possible answer values. If you can check whether a candidate answer is feasible in O(n), the whole problem becomes O(n log(range)).",
    whenToUse: [
      "'Minimize the maximum' or 'maximize the minimum'",
      "Allocate/distribute resources optimally",
      "Answer lies in a known numeric range",
      "Feasibility check is monotonic (if x works, x+1 also works)",
      "Koko eating bananas, book allocation, painter partition",
    ],
    howItWorks: [
      "Define the search range [low, high] for possible answers",
      "Binary search: mid = (low + high) / 2",
      "Check if mid is a feasible answer using a helper function",
      "If feasible → try smaller (right = mid); else → try larger (left = mid + 1)",
    ],
    template: `function binarySearchOnAnswer(arr, constraint) {
  let low = 1, high = Math.max(...arr);
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (isFeasible(arr, mid, constraint)) {
      high = mid;       // mid works, try smaller
    } else {
      low = mid + 1;    // mid doesn't work, need larger
    }
  }
  return low;
}`,
    examples: [
      { name: "Koko Eating Bananas", difficulty: "Medium" },
      { name: "Split Array Largest Sum", difficulty: "Hard" },
      { name: "Capacity to Ship Packages", difficulty: "Medium" },
      { name: "Aggressive Cows (SPOJ)", difficulty: "Medium" },
    ],
    complexity: "O(n × log(range))",
    keyInsight: "If the problem asks to optimize a value and you can verify in O(n), binary search on the answer!",
  },
  {
    id: "monotonic-stack",
    title: "Monotonic Stack",
    icon: "📶",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bgColor: "from-sky-500/10 to-sky-600/10",
    tagline: "Stack that stays sorted — for next greater/smaller problems",
    description:
      "Maintain a stack where elements are always in increasing or decreasing order. Pop elements that violate the order — the popped element just found its answer. Solves 'next greater/smaller element' in O(n).",
    whenToUse: [
      "Next Greater Element / Next Smaller Element",
      "Previous Greater / Previous Smaller",
      "Stock span problem",
      "Largest rectangle in histogram",
      "Daily temperatures / days until warmer",
    ],
    howItWorks: [
      "Iterate through the array",
      "While stack top violates monotonic property with current element, pop it",
      "The popped element's answer is the current element (or current index)",
      "Push current element onto stack",
    ],
    template: `function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // stores indices
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack.at(-1)] < nums[i]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
    examples: [
      { name: "Next Greater Element I & II", difficulty: "Easy/Medium" },
      { name: "Daily Temperatures", difficulty: "Medium" },
      { name: "Largest Rectangle in Histogram", difficulty: "Hard" },
      { name: "Stock Span Problem", difficulty: "Medium" },
    ],
    complexity: "O(n) time, O(n) space",
    keyInsight: "Each element is pushed and popped at most once → O(n) total even though there's a while loop inside the for loop.",
  },
  {
    id: "backtracking",
    title: "Backtracking",
    icon: "🔙",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bgColor: "from-orange-500/10 to-orange-600/10",
    tagline: "Try all paths, undo bad choices, find all valid solutions",
    description:
      "Build solutions incrementally. At each step, make a choice and recurse. If the choice leads to a dead end, undo it (backtrack) and try the next option. Explores all possibilities efficiently by pruning invalid branches early.",
    whenToUse: [
      "Generate all permutations / combinations / subsets",
      "Solve constraint satisfaction (Sudoku, N-Queens)",
      "Path finding with constraints",
      "Word search in a grid",
      "Problems asking for 'all possible' solutions",
    ],
    howItWorks: [
      "Define the choice space at each step",
      "Make a choice → add to current solution",
      "Recurse to next step",
      "If invalid or complete → backtrack (undo the choice)",
      "Prune early: skip choices that can't lead to valid solutions",
    ],
    template: `function backtrack(result, current, choices, start) {
  if (isComplete(current)) {
    result.push([...current]);
    return;
  }
  for (let i = start; i < choices.length; i++) {
    current.push(choices[i]);       // choose
    backtrack(result, current, choices, i + 1);
    current.pop();                  // un-choose
  }
}`,
    examples: [
      { name: "Subsets / Power Set", difficulty: "Medium" },
      { name: "Permutations", difficulty: "Medium" },
      { name: "N-Queens", difficulty: "Hard" },
      { name: "Word Search", difficulty: "Medium" },
    ],
    complexity: "O(2^n) or O(n!) depending on problem",
    keyInsight: "Backtracking = recursion + undo. The 'push → recurse → pop' pattern is the backbone.",
  },
  {
    id: "greedy",
    title: "Greedy",
    icon: "🤑",
    color: "text-lime-400",
    borderColor: "border-lime-500/30",
    bgColor: "from-lime-500/10 to-lime-600/10",
    tagline: "Make the locally optimal choice at every step",
    description:
      "At each step, pick the option that looks best right now without worrying about future consequences. Works when local optimal choices lead to a global optimum. Proof often involves exchange argument or greedy stays ahead.",
    whenToUse: [
      "Activity selection / interval scheduling",
      "Huffman coding / merge cost minimization",
      "Fractional knapsack (not 0/1)",
      "Jump game / minimum jumps",
      "Task scheduling with deadlines",
    ],
    howItWorks: [
      "Sort the input if needed (by end time, ratio, deadline, etc.)",
      "Iterate and always pick the 'best' available option",
      "Never reconsider a past choice",
      "Prove correctness: would swapping any greedy choice with another improve the result?",
    ],
    template: `function intervalScheduling(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // sort by end
  let count = 1, end = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= end) {
      count++;
      end = intervals[i][1];
    }
  }
  return count;
}`,
    examples: [
      { name: "Activity Selection / Meeting Rooms", difficulty: "Easy" },
      { name: "Jump Game I & II", difficulty: "Medium" },
      { name: "Task Scheduler", difficulty: "Medium" },
      { name: "Minimum Platforms", difficulty: "Medium" },
    ],
    complexity: "Usually O(n log n) due to sorting",
    keyInsight: "Greedy works when you can prove 'no swap improves the solution'. Sort first, then greedily pick.",
  },
  {
    id: "dp-memoization",
    title: "Dynamic Programming",
    icon: "🧠",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bgColor: "from-violet-500/10 to-violet-600/10",
    tagline: "Remember past results to avoid redundant computation",
    description:
      "Break a problem into overlapping subproblems. Solve each subproblem once and cache its result. Two approaches: top-down (memoization with recursion) or bottom-up (tabulation with iteration).",
    whenToUse: [
      "Optimal substructure + overlapping subproblems",
      "Counting paths / ways to reach a target",
      "0/1 Knapsack, coin change, edit distance",
      "Longest common subsequence / substring",
      "Problems where greedy doesn't give optimal",
    ],
    howItWorks: [
      "Define state: what parameters uniquely identify a subproblem?",
      "Define recurrence: how does the answer depend on smaller subproblems?",
      "Define base case: smallest subproblem you can solve directly",
      "Memoize (top-down) or tabulate (bottom-up) to avoid recomputation",
    ],
    template: `// Top-down (Memoization)
function dp(i, target, memo = {}) {
  if (target === 0) return 1;
  if (i < 0 || target < 0) return 0;
  const key = \`\${i},\${target}\`;
  if (key in memo) return memo[key];
  memo[key] = dp(i-1, target, memo) + dp(i-1, target-arr[i], memo);
  return memo[key];
}`,
    examples: [
      { name: "Climbing Stairs / Fibonacci", difficulty: "Easy" },
      { name: "0/1 Knapsack", difficulty: "Medium" },
      { name: "Longest Common Subsequence", difficulty: "Medium" },
      { name: "Edit Distance", difficulty: "Hard" },
    ],
    complexity: "O(states × transition cost)",
    keyInsight: "If recursion has overlapping subproblems (same calls repeated), add a cache → DP!",
  },
  {
    id: "bfs-dfs",
    title: "BFS / DFS Traversal",
    icon: "🌐",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bgColor: "from-teal-500/10 to-teal-600/10",
    tagline: "Explore graphs level-by-level or depth-first",
    description:
      "BFS uses a queue to explore neighbors level by level — ideal for shortest path in unweighted graphs. DFS uses a stack (or recursion) to explore as deep as possible before backtracking — ideal for connectivity, cycle detection, and topological sort.",
    whenToUse: [
      "Shortest path in unweighted graph → BFS",
      "Connected components, flood fill → BFS or DFS",
      "Cycle detection → DFS with coloring",
      "Topological sort → DFS or Kahn's BFS",
      "Tree traversals, island counting → Either",
    ],
    howItWorks: [
      "BFS: enqueue start → while queue not empty → dequeue → process → enqueue unvisited neighbors",
      "DFS: push start → while stack not empty → pop → process → push unvisited neighbors",
      "Mark nodes as visited to avoid infinite loops",
      "Track parent/distance for path reconstruction",
    ],
    template: `// BFS
function bfs(graph, start) {
  const queue = [start], visited = new Set([start]);
  while (queue.length) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    examples: [
      { name: "Number of Islands", difficulty: "Medium" },
      { name: "Shortest Path in Binary Matrix", difficulty: "Medium" },
      { name: "Course Schedule (Topological Sort)", difficulty: "Medium" },
      { name: "Word Ladder", difficulty: "Hard" },
    ],
    complexity: "O(V + E) for both BFS and DFS",
    keyInsight: "Shortest path (unweighted) → BFS. Explore all paths / detect cycles → DFS.",
  },
];
