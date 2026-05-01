// src/data/topics/binaryTree.ts
// Complete data module for Binary Tree

import { TopicData, AlgorithmStep } from "./types";

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function buildTree(values: (number | null)[]): TreeNode | null {
  if (!values.length || values[0] === null) return null;
  const root: TreeNode = { val: values[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (i < values.length && queue.length) {
    const node = queue.shift()!;
    if (i < values.length && values[i] !== null) {
      node.left = { val: values[i]!, left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      node.right = { val: values[i]!, left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

export function binaryTreeSteps(
  values?: number[],
  traversal?: "inorder" | "preorder" | "levelorder"
): AlgorithmStep[] {
  const treeValues = values || [1, 2, 3, 4, 5, 6, 7];
  const mode = traversal || "inorder";
  const steps: AlgorithmStep[] = [];
  let stepNumber = 1;
  const result: number[] = [];

  steps.push({
    stepNumber: stepNumber++,
    description: `Start ${mode} traversal on binary tree with values [${treeValues.join(", ")}].`,
    state: { array: [...treeValues], operation: "init" },
    activeLineIndex: 0,
    variables: { traversal: mode, nodes: treeValues.length, visited: 0 },
    highlights: [],
  });

  if (mode === "inorder") {
    // Simulate inorder: left → root → right
    const inorder = (idx: number) => {
      if (idx >= treeValues.length || treeValues[idx] === undefined) return;
      inorder(2 * idx + 1); // left
      result.push(treeValues[idx]);
      steps.push({
        stepNumber: stepNumber++,
        description: `Visit node ${treeValues[idx]} (index ${idx}). Inorder: Left → Root → Right.`,
        state: { array: [...treeValues], operation: "visit" },
        activeLineIndex: 2,
        variables: { current: treeValues[idx], visited: result.length, result: `[${result.join(", ")}]` },
        highlights: [
          { index: idx, color: "primary", label: "VISIT" },
          ...result.slice(0, -1).map((v) => {
            const vi = treeValues.indexOf(v);
            return { index: vi, color: "success" as const, label: "✓" };
          }),
        ],
      });
      inorder(2 * idx + 2); // right
    };
    inorder(0);
  } else if (mode === "preorder") {
    const preorder = (idx: number) => {
      if (idx >= treeValues.length || treeValues[idx] === undefined) return;
      result.push(treeValues[idx]);
      steps.push({
        stepNumber: stepNumber++,
        description: `Visit node ${treeValues[idx]} (index ${idx}). Preorder: Root → Left → Right.`,
        state: { array: [...treeValues], operation: "visit" },
        activeLineIndex: 2,
        variables: { current: treeValues[idx], visited: result.length, result: `[${result.join(", ")}]` },
        highlights: [
          { index: idx, color: "primary", label: "VISIT" },
          ...result.slice(0, -1).map((v) => {
            const vi = treeValues.indexOf(v);
            return { index: vi, color: "success" as const, label: "✓" };
          }),
        ],
      });
      preorder(2 * idx + 1);
      preorder(2 * idx + 2);
    };
    preorder(0);
  } else {
    // Level order (BFS)
    for (let i = 0; i < treeValues.length; i++) {
      result.push(treeValues[i]);
      steps.push({
        stepNumber: stepNumber++,
        description: `Level order: Visit node ${treeValues[i]} at index ${i} (level ${Math.floor(Math.log2(i + 1))}).`,
        state: { array: [...treeValues], operation: "visit" },
        activeLineIndex: 2,
        variables: { current: treeValues[i], level: Math.floor(Math.log2(i + 1)), visited: result.length, result: `[${result.join(", ")}]` },
        highlights: [
          { index: i, color: "primary", label: "VISIT" },
          ...Array.from({ length: i }, (_, j) => ({ index: j, color: "success" as const })),
        ],
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `✅ ${mode} traversal complete! Result: [${result.join(", ")}].`,
    state: { array: [...treeValues], operation: "done" },
    activeLineIndex: 5,
    variables: { result: `[${result.join(", ")}]`, visited: result.length },
    highlights: treeValues.map((_, i) => ({ index: i, color: "success" as const, label: "✓" })),
  });

  return steps;
}

export const binaryTreeData: TopicData = {
  id: "binary-tree",
  slug: "binary-tree",
  title: "Binary Tree",
  category: "data-structure",
  icon: "🌳",
  shortDescription: "Hierarchical structure with nodes having at most two children.",
  stepGeneratorId: "binaryTree",
  levels: [
    {
      level: 1,
      title: "What is a Binary Tree?",
      content: `A **Binary Tree** is a hierarchical data structure where each node has **at most two children**: left and right.

**Terminology:**
- **Root** — the topmost node
- **Leaf** — a node with no children
- **Height** — longest path from root to a leaf
- **Depth** — distance from root to a node
- **Parent/Child** — direct hierarchical relationship

**Real-world analogy:** A family tree 👨‍👩‍👧‍👦 or a tournament bracket. Each node branches into two possibilities.

**Types of Binary Trees:**
- **Full**: Every node has 0 or 2 children
- **Complete**: All levels filled except possibly the last (filled left to right)
- **Perfect**: All internal nodes have 2 children, all leaves at same level
- **BST** (Binary Search Tree): Left < Root < Right for all nodes
- **Balanced**: Height is O(log n)`,
    },
    {
      level: 2,
      title: "Tree Traversals",
      content: `### The 4 Essential Traversals:

**1. Inorder (Left → Root → Right)**
- Gives sorted order for BSTs
- Use: Validate BST, get sorted elements

**2. Preorder (Root → Left → Right)**
- Root is visited first
- Use: Serialize a tree, create a copy

**3. Postorder (Left → Right → Root)**
- Root is visited last
- Use: Delete a tree, evaluate expressions

**4. Level Order (BFS)**
- Visit level by level using a queue
- Use: Find width, shortest path, zigzag traversal

### Complexity:
| Operation | Time | Space |
|-----------|------|-------|
| Any traversal | O(n) | O(h)* |
| Search | O(n) | O(h) |
| Insert/Delete | O(n) | O(h) |

*h = height. O(log n) for balanced trees, O(n) for skewed.

### Array representation:
For node at index i: Left child = 2i+1, Right child = 2i+2, Parent = (i-1)/2`,
    },
    {
      level: 3,
      title: "Binary Tree Patterns",
      content: `### Must-Know Interview Patterns:

**1. Recursive DFS Template**
Most tree problems follow this pattern: process root, recurse left, recurse right.

**2. Max Depth / Height**
\`height(node) = 1 + max(height(left), height(right))\`

**3. Same Tree / Symmetric Tree**
Compare two trees recursively: check values, then check subtrees.

**4. Lowest Common Ancestor (LCA)**
If root is one of the targets, root is the LCA. Otherwise check left and right subtrees.

**5. Path Sum Problems**
Track running sum while traversing. Subtract current node's value and recurse.

**6. Level Order Variations**
- Zigzag traversal (alternate direction per level)
- Right side view (last node of each level)
- Maximum width (max nodes at any level)

### Key Insight:
Almost every tree problem is solved with **recursion + DFS** or **BFS with a queue**. Learn both templates thoroughly.`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// Binary Tree Traversals in JavaScript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Inorder: Left → Root → Right
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// Preorder: Root → Left → Right
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// Level Order (BFS)
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// Max Depth
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      lineDescriptions: {
        0: "TreeNode class — each node has val, left, right",
        9: "Inorder (LNR): Visit left subtree, then root, then right",
        17: "Preorder (NLR): Visit root first, then left, then right",
        25: "Level Order BFS: Use a queue to visit level by level",
        29: "Track level boundaries using queue size",
        39: "Max Depth: Height is 1 + max of children's heights",
      },
    },
    {
      language: "python",
      code: `# Binary Tree Traversals in Python
class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def preorder(root):
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def level_order(root):
    if not root: return []
    result, queue = [], [root]
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result

def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
    },
    {
      language: "cpp",
      code: `#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);
    inorder(root->right, res);
}

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        vector<int> level;
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}

int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
    },
  ],
  practiceQuestions: [
    {
      id: "bt-q1",
      title: "Maximum Depth of Binary Tree",
      description: "Given the root of a binary tree, return its maximum depth (number of nodes along the longest path from root to leaf).",
      difficulty: "easy",
      hint: "Recursive: depth = 1 + max(depth(left), depth(right)). Base case: null → 0.",
      solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      testCases: [
        { input: "[3,9,20,null,null,15,7]", expectedOutput: "3", description: "Depth = 3" },
        { input: "[1]", expectedOutput: "1", description: "Single node" },
      ],
    },
    {
      id: "bt-q2",
      title: "Invert a Binary Tree",
      description: "Given the root of a binary tree, invert the tree (mirror it) and return the root.",
      difficulty: "easy",
      hint: "Swap left and right children at each node, then recurse.",
      solution: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
      testCases: [
        { input: "[4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]", description: "Full tree" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "bt-m1",
      title: "Forgetting the Null Base Case",
      description: "Not handling null nodes causes crashes",
      wrongCode: `function maxDepth(root) {
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
  // ❌ Crashes when root is null!
}`,
      correctCode: `function maxDepth(root) {
  if (!root) return 0;   // ✅ Base case
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      explanation: "Every recursive tree function MUST check for null (empty tree). This is the base case that stops recursion.",
    },
    {
      id: "bt-m2",
      title: "Confusing Height vs Depth",
      description: "Height counts from bottom up, depth counts from top down",
      wrongCode: `// ❌ Mixing up height and depth
// Height of root = 0? No! Height of root = max height`,
      correctCode: `// ✅ Height = longest path from node to a leaf (bottom-up)
// Depth = path from root to node (top-down)
// Height of tree = Height of root = max depth of any leaf`,
      explanation: "Height of a node: distance to deepest leaf below it. Depth of a node: distance from root. Root has depth 0 but may have large height.",
    },
    {
      id: "bt-m3",
      title: "Level Order Without Tracking Levels",
      description: "Using BFS without separating levels",
      wrongCode: `const result = [];
while (queue.length) {
  const node = queue.shift();
  result.push(node.val); // ❌ All values in one flat array
}`,
      correctCode: `const result = [];
while (queue.length) {
  const level = [];
  const size = queue.length;  // ✅ Snapshot current level size
  for (let i = 0; i < size; i++) {
    const node = queue.shift();
    level.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  result.push(level);
}`,
      explanation: "To get level-by-level output, snapshot queue.length before processing each level. Without this, you get a flat array with no level boundaries.",
    },
  ],
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(h) — height",
    explanation: "All traversals visit every node once → O(n). Space depends on height: O(log n) for balanced trees, O(n) for skewed (worst case). BFS uses O(w) space where w is max width.",
  },
  patternTips: [
    "📌 Most tree problems = recursion. Think: what should this node do? Then recurse on children.",
    "📌 Inorder on BST gives sorted order — use this for validation.",
    "📌 Level order = BFS with queue. Track level boundaries with size snapshot.",
    "📌 DFS can be done with recursion (implicit stack) or explicit stack.",
    "📌 Draw the tree! Visual debugging catches most tree bugs.",
  ],
};
