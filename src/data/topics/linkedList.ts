// src/data/topics/linkedList.ts
// Complete data module for Linked List topic

import { TopicData, AlgorithmStep } from "./types";

export function linkedListSteps(
  operations?: Array<{ type: "insertHead" | "insertTail" | "delete" | "search"; value: number }>
): AlgorithmStep[] {
  const ops = operations || [
    { type: "insertHead", value: 10 },
    { type: "insertTail", value: 20 },
    { type: "insertTail", value: 30 },
    { type: "insertHead", value: 5 },
    { type: "search", value: 20 },
    { type: "delete", value: 20 },
    { type: "insertTail", value: 40 },
  ];
  const steps: AlgorithmStep[] = [];
  const list: number[] = [];
  let stepNumber = 1;

  steps.push({
    stepNumber: stepNumber++,
    description: "Initialize an empty singly linked list. Head → null.",
    state: { array: [], operation: "init" },
    activeLineIndex: 0,
    variables: { head: "null", size: 0 },
    highlights: [],
  });

  for (const op of ops) {
    if (op.type === "insertHead") {
      list.unshift(op.value);
      steps.push({
        stepNumber: stepNumber++,
        description: `Insert ${op.value} at HEAD. New node points to old head. List: ${list.join(" → ")}.`,
        state: { array: [...list], operation: "insertHead" },
        activeLineIndex: 2,
        variables: { head: list[0], size: list.length, inserted: op.value },
        highlights: [{ index: 0, color: "success", label: "HEAD" }],
      });
    } else if (op.type === "insertTail") {
      list.push(op.value);
      steps.push({
        stepNumber: stepNumber++,
        description: `Insert ${op.value} at TAIL. Traverse to end, link last node. List: ${list.join(" → ")}.`,
        state: { array: [...list], operation: "insertTail" },
        activeLineIndex: 4,
        variables: { head: list[0], tail: op.value, size: list.length },
        highlights: [{ index: list.length - 1, color: "success", label: "TAIL" }],
      });
    } else if (op.type === "delete") {
      const idx = list.indexOf(op.value);
      if (idx === -1) {
        steps.push({
          stepNumber: stepNumber++,
          description: `Delete ${op.value} — NOT FOUND in list. No change.`,
          state: { array: [...list], operation: "notFound" },
          activeLineIndex: 6,
          variables: { head: list[0], size: list.length, target: op.value, found: false },
          highlights: [],
        });
      } else {
        list.splice(idx, 1);
        steps.push({
          stepNumber: stepNumber++,
          description: `Delete ${op.value} — found at position ${idx}. Previous node now points to next. List: ${list.join(" → ")}.`,
          state: { array: [...list], operation: "delete" },
          activeLineIndex: 7,
          variables: { head: list[0] ?? "null", size: list.length, deleted: op.value },
          highlights: idx < list.length ? [{ index: idx, color: "warning", label: "RELINKED" }] : [],
        });
      }
    } else if (op.type === "search") {
      const idx = list.indexOf(op.value);
      const searchHighlights = list.map((_, i) => ({
        index: i,
        color: (i <= (idx === -1 ? list.length - 1 : idx) ? (i === idx ? "success" : "secondary") : "default") as "success" | "secondary" | "default",
        label: i === idx ? "FOUND" : undefined,
      }));
      steps.push({
        stepNumber: stepNumber++,
        description: idx !== -1
          ? `Search for ${op.value} — found at position ${idx}! Traversed ${idx + 1} nodes.`
          : `Search for ${op.value} — NOT FOUND. Traversed entire list (${list.length} nodes).`,
        state: { array: [...list], operation: "search" },
        activeLineIndex: 8,
        variables: { head: list[0], size: list.length, target: op.value, found: idx !== -1, position: idx },
        highlights: searchHighlights,
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `✅ All operations complete! Final list: ${list.length > 0 ? list.join(" → ") : "empty"}. Size: ${list.length}.`,
    state: { array: [...list], operation: "done" },
    activeLineIndex: 10,
    variables: { head: list[0] ?? "null", size: list.length },
    highlights: list.map((_, i) => ({ index: i, color: "success" as const })),
  });

  return steps;
}

export const linkedListData: TopicData = {
  id: "linked-list",
  slug: "linked-list",
  title: "Linked List",
  category: "data-structure",
  icon: "🔗",
  shortDescription: "Dynamic linear structure with efficient insertions and deletions.",
  stepGeneratorId: "linkedList",
  levels: [
    {
      level: 1,
      title: "What is a Linked List?",
      content: `A **Linked List** is a linear data structure where elements (nodes) are stored in **non-contiguous memory**. Each node contains:
1. **Data** — the actual value
2. **Next pointer** — reference to the next node

**Key difference from arrays:** No indexing! You must traverse from the head to find elements.

**Real-world analogy:** A treasure hunt 🗺️ — each clue tells you where the next one is. You can't jump to clue #5 directly.

**Types:**
- **Singly Linked List**: Each node points to the next only
- **Doubly Linked List**: Each node points to both next and previous
- **Circular Linked List**: Last node points back to head

**Why use linked lists?**
- O(1) insertions/deletions (when you have the reference)
- Dynamic size — no wasted memory
- Efficient for frequent insertions in the middle`,
    },
    {
      level: 2,
      title: "Operations & Complexity",
      content: `### Time Complexity:

| Operation | Singly | Doubly |
|-----------|--------|--------|
| **Access by index** | O(n) | O(n) |
| **Search** | O(n) | O(n) |
| **Insert at head** | O(1) | O(1) |
| **Insert at tail** | O(n)* | O(1)** |
| **Delete head** | O(1) | O(1) |
| **Delete by value** | O(n) | O(n) |

*O(1) if tail pointer is maintained.
**Doubly linked has prev pointer, making tail ops O(1).

### Memory:
- Each node needs extra space for pointer(s)
- Singly: 1 pointer per node
- Doubly: 2 pointers per node

### Array vs Linked List:
| Feature | Array | Linked List |
|---------|-------|-------------|
| Access | O(1) | O(n) |
| Insert/Delete (middle) | O(n) | O(1)* |
| Memory | Contiguous | Scattered |
| Cache performance | Excellent | Poor |

*O(1) only if you already have the reference to the node.`,
    },
    {
      level: 3,
      title: "Linked List Patterns",
      content: `### Must-Know Patterns:

**1. Fast & Slow Pointer (Floyd's)**
- Detect cycles, find middle, find kth from end
- Slow moves 1 step, fast moves 2 steps

**2. Reverse a Linked List**
- Use 3 pointers: prev, current, next
- Reassign current.next = prev in each step
- This is asked in nearly every interview!

**3. Merge Two Sorted Lists**
- Use a dummy node as starting point
- Compare heads, attach smaller, advance pointer

**4. Dummy Head Technique**
- Create a dummy node before the real head
- Simplifies edge cases (empty list, single node)
- Return dummy.next as the result

**5. Runner Technique**
- Use two pointers with a fixed gap
- Find nth from end: start second pointer n steps after first`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// Singly Linked List in JavaScript
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  insertHead(val) {
    const node = new Node(val);
    node.next = this.head;
    this.head = node;
  }

  insertTail(val) {
    const node = new Node(val);
    if (!this.head) { this.head = node; return; }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = node;
  }

  delete(val) {
    if (!this.head) return;
    if (this.head.val === val) {
      this.head = this.head.next; return;
    }
    let curr = this.head;
    while (curr.next && curr.next.val !== val)
      curr = curr.next;
    if (curr.next) curr.next = curr.next.next;
  }

  reverse() {
    let prev = null, curr = this.head;
    while (curr) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    this.head = prev;
  }
}`,
      lineDescriptions: {
        0: "Node class holds value and pointer to next node",
        8: "LinkedList with head pointer only",
        10: "Insert at head — O(1): new node points to old head",
        16: "Insert at tail — O(n): traverse to end, then link",
        23: "Delete by value — handle head case separately",
        32: "Reverse — the most important linked list operation!",
        34: "Three pointers: prev, curr, next — reassign links",
      },
    },
    {
      language: "python",
      code: `# Singly Linked List in Python
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_head(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node

    def insert_tail(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = node

    def delete(self, val):
        if not self.head:
            return
        if self.head.val == val:
            self.head = self.head.next
            return
        curr = self.head
        while curr.next and curr.next.val != val:
            curr = curr.next
        if curr.next:
            curr.next = curr.next.next

    def reverse(self):
        prev, curr = None, self.head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        self.head = prev`,
    },
    {
      language: "cpp",
      code: `#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};

class LinkedList {
public:
    Node* head = nullptr;

    void insertHead(int val) {
        Node* node = new Node(val);
        node->next = head;
        head = node;
    }

    void insertTail(int val) {
        Node* node = new Node(val);
        if (!head) { head = node; return; }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = node;
    }

    void reverse() {
        Node* prev = nullptr;
        Node* curr = head;
        while (curr) {
            Node* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }
};`,
    },
  ],
  practiceQuestions: [
    {
      id: "ll-q1",
      title: "Reverse a Linked List",
      description: "Given the head of a singly linked list, reverse the list and return the reversed list.",
      difficulty: "easy",
      hint: "Use three pointers: prev (starts null), curr (starts head), next (saves curr.next). In each step: save next, reverse link, move forward.",
      solution: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      testCases: [
        { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", description: "Standard reverse" },
        { input: "[1]", expectedOutput: "[1]", description: "Single node" },
      ],
    },
    {
      id: "ll-q2",
      title: "Detect Cycle in Linked List",
      description: "Given head of a linked list, determine if it has a cycle. A cycle exists if a node can be reached again by following next pointers.",
      difficulty: "easy",
      hint: "Use Floyd's cycle detection: slow moves 1 step, fast moves 2 steps. If they ever meet, there's a cycle.",
      solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      testCases: [
        { input: "[3,2,0,-4] cycle at pos 1", expectedOutput: "true", description: "Has cycle" },
        { input: "[1,2] no cycle", expectedOutput: "false", description: "No cycle" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "ll-m1",
      title: "Losing the Next Pointer During Reversal",
      description: "Not saving curr.next before overwriting it",
      wrongCode: `curr.next = prev;          // ❌ Lost reference to next!
curr = curr.next;          // This is now prev, not the original next!`,
      correctCode: `const next = curr.next;    // ✅ Save next FIRST
curr.next = prev;          // Then reverse
prev = curr;
curr = next;               // Move forward using saved reference`,
      explanation: "When you set curr.next = prev, you lose the pointer to the rest of the list. Always save curr.next in a temp variable before modifying it.",
    },
    {
      id: "ll-m2",
      title: "Not Handling Edge Cases (null head)",
      description: "Assuming head is never null leads to crashes",
      wrongCode: `function getLength(head) {
  let len = 0;
  let curr = head;
  while (curr.next) {       // ❌ Crashes if head is null
    len++; curr = curr.next;
  }
}`,
      correctCode: `function getLength(head) {
  let len = 0;
  let curr = head;
  while (curr) {             // ✅ Check curr, not curr.next
    len++; curr = curr.next;
  }
  return len;
}`,
      explanation: "If head is null, accessing head.next throws an error. Always use `while (curr)` not `while (curr.next)`, and handle the empty list case.",
    },
    {
      id: "ll-m3",
      title: "Memory Leak (in C/C++)",
      description: "Deleting nodes without freeing memory",
      wrongCode: `// ❌ C++ — node removed but memory not freed
curr->next = curr->next->next;  // Skipped node is leaked!`,
      correctCode: `// ✅ Free the deleted node
Node* toDelete = curr->next;
curr->next = curr->next->next;
delete toDelete;               // Free memory`,
      explanation: "In languages without garbage collection (C/C++), skipping a node without deleting it causes a memory leak. In JS/Python/Java, the GC handles it automatically.",
    },
  ],
  complexity: {
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    explanation: "Insert/delete at head is O(1). Searching, accessing by index, or deleting by value requires O(n) traversal. Space is O(n) for n nodes, with extra overhead for pointers.",
  },
  patternTips: [
    "📌 'Reverse a linked list' is the most frequently asked LL question — master it.",
    "📌 Use a dummy head node to simplify edge cases (empty list, deletion of head).",
    "📌 Fast & slow pointers solve cycle detection, middle finding, and more.",
    "📌 Draw diagrams! Linked list bugs are almost always pointer logic errors.",
    "📌 When merging sorted lists, use a dummy node and a tail pointer.",
  ],
};
