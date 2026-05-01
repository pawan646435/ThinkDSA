// src/data/topics/stack.ts
// Complete data module for Stack topic

import { TopicData, AlgorithmStep, HighlightInfo } from "./types";

/**
 * Generates step-by-step execution of stack operations.
 * Demonstrates push, pop, and peek operations.
 */
export function stackOperationSteps(
  operations: Array<{ type: "push" | "pop" | "peek"; value?: number }>
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const stack: number[] = [];
  let stepNumber = 1;

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: "Initialize an empty stack. The stack follows LIFO (Last In, First Out) principle.",
    state: { stack: [...stack], operation: "init", value: null, top: -1 },
    activeLineIndex: 0,
    variables: { stack: "[]", top: -1, size: 0 },
    highlights: [],
  });

  for (const op of operations) {
    if (op.type === "push" && op.value !== undefined) {
      stack.push(op.value);
      const highlights: HighlightInfo[] = [
        { index: stack.length - 1, color: "success", label: "NEW" },
      ];
      if (stack.length > 1) {
        highlights.push({ index: stack.length - 2, color: "info", label: "prev top" });
      }

      steps.push({
        stepNumber: stepNumber++,
        description: `Push ${op.value} onto the stack. New top = ${op.value}, size = ${stack.length}.`,
        state: { stack: [...stack], operation: "push", value: op.value, top: stack.length - 1 },
        activeLineIndex: 2,
        variables: {
          stack: `[${stack.join(", ")}]`,
          top: stack.length - 1,
          size: stack.length,
          "pushed value": op.value,
        },
        highlights,
      });
    } else if (op.type === "pop") {
      if (stack.length === 0) {
        steps.push({
          stepNumber: stepNumber++,
          description: "❌ Cannot pop from empty stack! This is a Stack Underflow error.",
          state: { stack: [...stack], operation: "pop_error", value: null, top: -1 },
          activeLineIndex: 4,
          variables: { stack: "[]", top: -1, size: 0, error: "Stack Underflow" },
          highlights: [],
        });
      } else {
        const popped = stack.pop()!;
        steps.push({
          stepNumber: stepNumber++,
          description: `Pop ${popped} from the stack. ${stack.length > 0 ? `New top = ${stack[stack.length - 1]}` : "Stack is now empty"}, size = ${stack.length}.`,
          state: { stack: [...stack], operation: "pop", value: popped, top: stack.length - 1 },
          activeLineIndex: 5,
          variables: {
            stack: `[${stack.join(", ")}]`,
            top: stack.length > 0 ? stack.length - 1 : -1,
            size: stack.length,
            "popped value": popped,
          },
          highlights:
            stack.length > 0
              ? [{ index: stack.length - 1, color: "warning", label: "new top" }]
              : [],
        });
      }
    } else if (op.type === "peek") {
      if (stack.length === 0) {
        steps.push({
          stepNumber: stepNumber++,
          description: "❌ Cannot peek at empty stack!",
          state: { stack: [...stack], operation: "peek_error", value: null, top: -1 },
          activeLineIndex: 7,
          variables: { stack: "[]", top: -1, size: 0, error: "Stack Empty" },
          highlights: [],
        });
      } else {
        steps.push({
          stepNumber: stepNumber++,
          description: `Peek: top element is ${stack[stack.length - 1]}. Stack remains unchanged.`,
          state: {
            stack: [...stack],
            operation: "peek",
            value: stack[stack.length - 1],
            top: stack.length - 1,
          },
          activeLineIndex: 8,
          variables: {
            stack: `[${stack.join(", ")}]`,
            top: stack.length - 1,
            size: stack.length,
            "peek value": stack[stack.length - 1],
          },
          highlights: [{ index: stack.length - 1, color: "info", label: "TOP" }],
        });
      }
    }
  }

  // Final state
  steps.push({
    stepNumber: stepNumber++,
    description: `All operations complete. Final stack: [${stack.join(", ")}], size = ${stack.length}.`,
    state: { stack: [...stack], operation: "done", value: null, top: stack.length - 1 },
    activeLineIndex: -1,
    variables: {
      stack: `[${stack.join(", ")}]`,
      top: stack.length > 0 ? stack.length - 1 : -1,
      size: stack.length,
    },
    highlights: stack.map((_, i) => ({
      index: i,
      color: "primary" as const,
      label: i === stack.length - 1 ? "TOP" : undefined,
    })),
  });

  return steps;
}

export const stackData: TopicData = {
  id: "stack",
  slug: "stack",
  title: "Stack",
  category: "data-structure",
  icon: "📚",
  shortDescription:
    "A linear data structure following LIFO (Last In, First Out) principle. Think of a stack of plates!",
  stepGeneratorId: "stack",

  levels: [
    {
      level: 1,
      title: "What is a Stack?",
      content: `A **Stack** is like a stack of plates 🍽️. You can only:
- **Add (push)** a plate on **top**
- **Remove (pop)** the plate from the **top**
- **Look (peek)** at the **top** plate

This is called **LIFO** — Last In, First Out.

**Real-world examples:**
- 🔙 Browser back button (history stack)
- ↩️ Undo/Redo in text editors
- 📱 App navigation stack on your phone
- 🥞 Stack of pancakes!`,
    },
    {
      level: 2,
      title: "Core Operations",
      content: `### Stack Operations & Their Complexity:

| Operation | Description | Time |
|-----------|-------------|------|
| **push(x)** | Add element x on top | O(1) |
| **pop()** | Remove & return top element | O(1) |
| **peek()/top()** | View top element without removing | O(1) |
| **isEmpty()** | Check if stack is empty | O(1) |
| **size()** | Get number of elements | O(1) |

### How it works internally:
- **Array-based**: Use an array with a \`top\` pointer
- **Linked list-based**: Each node points to the one below it

All operations are **O(1)** — that's what makes stacks so powerful!`,
    },
    {
      level: 3,
      title: "Applications & Advanced Uses",
      content: `### Where Stacks Shine:

**1. Expression Evaluation**
- Infix to Postfix conversion
- Evaluating postfix expressions
- Balanced parentheses checking: \`({[]})\`

**2. Function Call Stack**
- Every function call pushes a frame
- Return pops the frame
- Stack overflow = too many frames (deep recursion!)

**3. Algorithms**
- DFS (Depth-First Search) uses a stack
- Backtracking problems
- Next Greater Element problem
- Stock Span problem
- Histogram area calculation

**4. Undo Mechanisms**
- Push each action onto a stack
- Undo = pop the last action`,
    },
  ],

  codeSnippets: [
    {
      language: "javascript",
      code: `class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack Underflow");
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`,
      lineDescriptions: {
        0: "Define the Stack class",
        1: "Constructor initializes empty array",
        5: "Push: add element to the top",
        8: "Pop: remove and return top element",
        9: "Guard against popping from empty stack",
        12: "Remove and return the last element",
        15: "Peek: view top element without removing",
        16: "Guard against peeking empty stack",
        19: "Return the last element",
        22: "Check if stack has no elements",
        26: "Return the number of elements",
      },
    },
    {
      language: "python",
      code: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, element):
        self.items.append(element)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack Underflow")
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)`,
    },
    {
      language: "cpp",
      code: `#include <stack>
using namespace std;

// Using STL stack
stack<int> s;
s.push(10);     // Push
s.push(20);
s.top();        // Peek → 20
s.pop();        // Pop → removes 20
s.empty();      // Check empty → false
s.size();       // Size → 1

// Custom implementation
class Stack {
    int arr[1000];
    int topIndex = -1;
public:
    void push(int x) { arr[++topIndex] = x; }
    int pop() { return arr[topIndex--]; }
    int top() { return arr[topIndex]; }
    bool isEmpty() { return topIndex == -1; }
};`,
    },
  ],

  practiceQuestions: [
    {
      id: "st-q1",
      title: "Valid Parentheses",
      description:
        "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string has valid (balanced) brackets.",
      difficulty: "easy",
      hint: "Push opening brackets onto a stack. For each closing bracket, check if it matches the top of the stack.",
      solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      testCases: [
        { input: '"([])"', expectedOutput: "true", description: "Nested brackets" },
        { input: '"([)]"', expectedOutput: "false", description: "Mismatched brackets" },
        { input: '""', expectedOutput: "true", description: "Empty string" },
      ],
    },
    {
      id: "st-q2",
      title: "Min Stack",
      description:
        "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      difficulty: "medium",
      hint: "Use a second stack to track the minimum values. Push to min stack only when the value is <= current minimum.",
      solution: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    if (!this.minStack.length || val <= this.getMin()) {
      this.minStack.push(val);
    }
  }
  pop() {
    if (this.stack.pop() === this.getMin()) {
      this.minStack.pop();
    }
  }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}`,
      testCases: [
        {
          input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
          expectedOutput: "-3, 0, -2",
          description: "Standard min stack operations",
        },
      ],
    },
  ],

  commonMistakes: [
    {
      id: "st-m1",
      title: "Not Checking for Empty Stack",
      description: "Popping or peeking without checking if the stack is empty",
      wrongCode: `function peek(stack) {
  return stack[stack.length - 1]; // ❌ undefined if empty!
}`,
      correctCode: `function peek(stack) {
  if (stack.length === 0) {
    throw new Error("Stack is empty");
  }
  return stack[stack.length - 1]; // ✅ Safe
}`,
      explanation:
        "Always check `isEmpty()` before `pop()` or `peek()`. In production code, accessing an empty stack can cause undefined behavior, null pointer exceptions, or silent bugs.",
    },
    {
      id: "st-m2",
      title: "Using shift() Instead of pop()",
      description: "Using array shift to remove from the wrong end",
      wrongCode: `// ❌ This is a Queue, not a Stack!
const removed = stack.shift();`,
      correctCode: `// ✅ Pop from the top (end of array)
const removed = stack.pop();`,
      explanation:
        "Array `shift()` removes from the front (index 0), which is Queue behavior (FIFO). Stack uses `pop()` which removes from the end. Also, `shift()` is O(n) while `pop()` is O(1).",
    },
    {
      id: "st-m3",
      title: "Stack Overflow from Unbounded Recursion",
      description: "Not having a base case in recursive functions",
      wrongCode: `function factorial(n) {
  return n * factorial(n - 1); // ❌ No base case!
}`,
      correctCode: `function factorial(n) {
  if (n <= 1) return 1;         // ✅ Base case
  return n * factorial(n - 1);
}`,
      explanation:
        "Every recursive call uses stack space. Without a base case, the function calls itself infinitely, causing a Stack Overflow. Always define a clear stopping condition.",
    },
  ],

  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    space: "O(n)",
    explanation:
      "All core stack operations (push, pop, peek, isEmpty) run in constant time O(1) because we always operate on the top element. Space complexity is O(n) where n is the number of elements stored. For array-based stacks, occasional resize operations may take O(n), but amortized push remains O(1).",
  },

  patternTips: [
    "📌 If you see 'matching/balancing' (brackets, tags), think Stack immediately.",
    "📌 'Next Greater/Smaller Element' problems almost always use a Monotonic Stack.",
    "📌 Any problem involving 'undo' or 'backtracking' is stack-friendly.",
    "📌 DFS traversal can be implemented iteratively using a stack.",
    "📌 When recursion hits limits, convert to iterative approach using an explicit stack.",
    "📌 Stock span, histogram area, and temperature problems use stack-based O(n) solutions.",
  ],
};
