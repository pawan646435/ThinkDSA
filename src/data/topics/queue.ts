// src/data/topics/queue.ts
// Complete data module for Queue topic

import { TopicData, AlgorithmStep } from "./types";

export function queueOperationSteps(
  operations?: Array<{ type: "enqueue" | "dequeue" | "peek"; value?: number }>
): AlgorithmStep[] {
  const ops = operations || [
    { type: "enqueue", value: 10 },
    { type: "enqueue", value: 25 },
    { type: "enqueue", value: 7 },
    { type: "peek" },
    { type: "dequeue" },
    { type: "enqueue", value: 42 },
    { type: "dequeue" },
    { type: "dequeue" },
  ];
  const steps: AlgorithmStep[] = [];
  const queue: number[] = [];
  let stepNumber = 1;

  steps.push({
    stepNumber: stepNumber++,
    description: "Initialize an empty queue. FIFO — First In, First Out.",
    state: { stack: [], operation: "init" },
    activeLineIndex: 0,
    variables: { size: 0, front: "—", rear: "—" },
    highlights: [],
  });

  for (const op of ops) {
    if (op.type === "enqueue" && op.value !== undefined) {
      queue.push(op.value);
      steps.push({
        stepNumber: stepNumber++,
        description: `Enqueue ${op.value} → added to the REAR of the queue. Queue: [${queue.join(" → ")}].`,
        state: { stack: [...queue], operation: "push", value: op.value },
        activeLineIndex: 2,
        variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1], enqueued: op.value },
        highlights: [{ index: queue.length - 1, color: "success", label: "REAR" }],
      });
    } else if (op.type === "dequeue") {
      if (queue.length === 0) {
        steps.push({
          stepNumber: stepNumber++,
          description: "Dequeue failed! Queue is empty — nothing to remove.",
          state: { stack: [], operation: "error" },
          activeLineIndex: 4,
          variables: { size: 0, error: "Queue Underflow" },
          highlights: [],
        });
      } else {
        const val = queue.shift()!;
        steps.push({
          stepNumber: stepNumber++,
          description: `Dequeue → removed ${val} from the FRONT. Queue: [${queue.length > 0 ? queue.join(" → ") : "empty"}].`,
          state: { stack: [...queue], operation: "pop", value: val },
          activeLineIndex: 5,
          variables: { size: queue.length, front: queue[0] ?? "—", rear: queue[queue.length - 1] ?? "—", dequeued: val },
          highlights: queue.length > 0 ? [{ index: 0, color: "warning", label: "NEW FRONT" }] : [],
        });
      }
    } else if (op.type === "peek") {
      steps.push({
        stepNumber: stepNumber++,
        description: queue.length > 0
          ? `Peek → front element is ${queue[0]}. Queue unchanged.`
          : "Peek failed — queue is empty.",
        state: { stack: [...queue], operation: "peek", value: queue[0] ?? null },
        activeLineIndex: 7,
        variables: { size: queue.length, front: queue[0] ?? "—", rear: queue[queue.length - 1] ?? "—", peeked: queue[0] ?? "—" },
        highlights: queue.length > 0 ? [{ index: 0, color: "primary", label: "PEEK" }] : [],
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `✅ All operations complete! Final queue: [${queue.length > 0 ? queue.join(" → ") : "empty"}]. Size: ${queue.length}.`,
    state: { stack: [...queue], operation: "done" },
    activeLineIndex: 9,
    variables: { size: queue.length, front: queue[0] ?? "—", rear: queue[queue.length - 1] ?? "—" },
    highlights: queue.map((_, i) => ({ index: i, color: "success" as const })),
  });

  return steps;
}

export const queueData: TopicData = {
  id: "queue",
  slug: "queue",
  title: "Queue",
  category: "data-structure",
  icon: "🚶",
  shortDescription: "FIFO data structure for scheduling, BFS, and buffering.",
  stepGeneratorId: "queue",
  levels: [
    {
      level: 1,
      title: "What is a Queue?",
      content: `A **Queue** is a linear data structure that follows the **FIFO** principle — **First In, First Out**.

Think of a real-world queue: a line at a ticket counter 🎟️. The person who arrives first gets served first.

**Core operations:**
- **Enqueue**: Add an element to the **rear** (back)
- **Dequeue**: Remove an element from the **front**
- **Peek/Front**: View the front element without removing
- **isEmpty**: Check if the queue is empty

**Where queues are used:**
- BFS (Breadth-First Search)
- CPU scheduling / Task scheduling
- Print queue / Message buffers
- Handling asynchronous data (streams, events)`,
    },
    {
      level: 2,
      title: "Queue Operations & Complexity",
      content: `### Time Complexity:

| Operation | Array-based | Linked List-based |
|-----------|------------|-------------------|
| **Enqueue** | O(1)* | O(1) |
| **Dequeue** | O(n)** | O(1) |
| **Peek** | O(1) | O(1) |
| **isEmpty** | O(1) | O(1) |

*Amortized for dynamic arrays.
**O(n) because shifting is needed; use circular array for O(1).

### Implementation Strategies:
1. **Array-based**: Simple but dequeue is O(n) due to shifting. Use circular buffer to fix this.
2. **Linked List-based**: Both enqueue and dequeue are O(1) with head and tail pointers.
3. **Circular Queue**: Fixed-size array with front/rear pointers wrapping around — O(1) for all ops.

### Variants:
- **Deque** (Double-Ended Queue): Insert/remove from both ends
- **Priority Queue**: Elements have priorities, highest priority dequeued first
- **Circular Queue**: Fixed-size with wraparound`,
    },
    {
      level: 3,
      title: "Queue Patterns in Problem Solving",
      content: `### Key Patterns:

**1. BFS (Breadth-First Search)**
- Queues are the backbone of BFS — process level by level
- Shortest path in unweighted graphs

**2. Sliding Window Maximum (using Deque)**
- Maintain a monotonic deque for O(n) max in each window
- Front of deque = current window maximum

**3. Task Scheduling**
- Round-robin scheduling uses a circular queue
- Process tasks in order, re-enqueue if not finished

**4. Level Order Traversal**
- Traverse trees level by level using a queue
- Track level boundaries with null markers or size counting

**5. Stream Processing**
- Buffer incoming data in a queue
- Process in FIFO order for fairness`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// Queue using Array in JavaScript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);      // Add to rear
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();      // Remove from front
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];           // View front
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`,
      lineDescriptions: {
        0: "Array-based queue implementation",
        2: "Initialize with empty array",
        6: "Enqueue adds to the end (rear) of the array",
        10: "Dequeue removes from the start (front) — O(n) due to shift",
        14: "Peek returns front element without removing",
        18: "Helper to check if queue is empty",
      },
    },
    {
      language: "python",
      code: `# Queue using collections.deque in Python
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, element):
        self.items.append(element)     # Add to rear

    def dequeue(self):
        if self.is_empty():
            return None
        return self.items.popleft()    # Remove from front - O(1)

    def peek(self):
        if self.is_empty():
            return None
        return self.items[0]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)`,
    },
    {
      language: "cpp",
      code: `#include <queue>
using namespace std;

// Using STL queue
queue<int> q;

// Enqueue
q.push(10);
q.push(20);
q.push(30);

// Peek front
int front = q.front();    // 10

// Peek back
int back = q.back();      // 30

// Dequeue
q.pop();                  // Removes 10

// Size and empty check
int sz = q.size();        // 2
bool empty = q.empty();   // false`,
    },
  ],
  practiceQuestions: [
    {
      id: "q-q1",
      title: "Implement Queue using Two Stacks",
      description: "Implement a FIFO queue using only two stacks. Support push, pop, peek, and empty operations.",
      difficulty: "easy",
      hint: "Use one stack for enqueue operations and another for dequeue. Transfer elements between stacks when needed.",
      solution: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) { this.inStack.push(x); }
  pop() {
    this.peek();
    return this.outStack.pop();
  }
  peek() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0)
        this.outStack.push(this.inStack.pop());
    }
    return this.outStack[this.outStack.length - 1];
  }
  empty() { return !this.inStack.length && !this.outStack.length; }
}`,
      testCases: [
        { input: "push(1), push(2), peek()", expectedOutput: "1", description: "FIFO order" },
        { input: "push(1), push(2), pop(), peek()", expectedOutput: "2", description: "After pop" },
      ],
    },
    {
      id: "q-q2",
      title: "Number of Recent Calls",
      description: "Implement a RecentCounter that counts the number of recent requests within a 3000ms window.",
      difficulty: "easy",
      hint: "Use a queue. On each ping, enqueue the timestamp. Then dequeue all timestamps older than t - 3000. The queue size is the answer.",
      solution: `class RecentCounter {
  constructor() { this.queue = []; }
  ping(t) {
    this.queue.push(t);
    while (this.queue[0] < t - 3000)
      this.queue.shift();
    return this.queue.length;
  }
}`,
      testCases: [
        { input: "ping(1), ping(100), ping(3001), ping(3002)", expectedOutput: "1, 2, 3, 3", description: "Sliding window of 3000ms" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "q-m1",
      title: "Using shift() for O(1) Dequeue",
      description: "Array.shift() is O(n), not O(1)",
      wrongCode: `// ❌ O(n) dequeue with array
dequeue() {
  return this.items.shift(); // Shifts ALL remaining elements
}`,
      correctCode: `// ✅ O(1) dequeue with linked list or deque
// Use collections.deque (Python) or LinkedList (Java)
// Or implement circular buffer with front pointer`,
      explanation: "Array.shift() removes the first element but must shift every other element left — O(n). For true O(1) dequeue, use a linked list, deque, or circular buffer.",
    },
    {
      id: "q-m2",
      title: "Forgetting to Check Empty Queue",
      description: "Dequeue or peek on empty queue causes errors",
      wrongCode: `const val = queue.dequeue(); // ❌ Crashes if empty
console.log(val.toString());`,
      correctCode: `if (!queue.isEmpty()) {       // ✅ Always check first
  const val = queue.dequeue();
  console.log(val.toString());
}`,
      explanation: "Always guard dequeue/peek with an isEmpty check to prevent undefined behavior or null pointer errors.",
    },
    {
      id: "q-m3",
      title: "Confusing FIFO vs LIFO",
      description: "Queue is FIFO, Stack is LIFO — mixing them up causes logic bugs",
      wrongCode: `// ❌ Using a stack when you need FIFO order
const stack = [];
stack.push(1); stack.push(2); stack.push(3);
stack.pop(); // Returns 3, not 1!`,
      correctCode: `// ✅ Use a queue for FIFO
const queue = [];
queue.push(1); queue.push(2); queue.push(3);
queue.shift(); // Returns 1 — first in, first out`,
      explanation: "If you need first-come-first-served ordering (BFS, scheduling), use a Queue. If you need last-in-first-out (undo, DFS), use a Stack.",
    },
  ],
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "O(n)",
    explanation: "All queue operations (enqueue, dequeue, peek) are O(1) when using a linked list or circular buffer. Array-based dequeue is O(n) due to shifting. Space is O(n) for n elements.",
  },
  patternTips: [
    "📌 BFS always uses a queue — it's the defining structure for level-order traversal.",
    "📌 For sliding window max/min, use a monotonic deque, not a regular queue.",
    "📌 Two stacks can simulate a queue with amortized O(1) operations.",
    "📌 Circular queues avoid the O(n) shift problem of array-based queues.",
    "📌 Priority queues are NOT regular queues — they use heaps internally.",
  ],
};
