// src/data/topics/graphBFS.ts
// Complete data module for Graph BFS

import { TopicData, AlgorithmStep } from "./types";

export function graphBFSSteps(
  adjList?: Record<number, number[]>,
  start?: number
): AlgorithmStep[] {
  const graph = adjList || {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 4],
    3: [1, 5],
    4: [1, 2, 5],
    5: [3, 4],
  };
  const startNode = start ?? 0;
  const steps: AlgorithmStep[] = [];
  let stepNumber = 1;

  const nodes = Object.keys(graph).map(Number);
  const visited = new Set<number>();
  const queue: number[] = [];
  const order: number[] = [];

  steps.push({
    stepNumber: stepNumber++,
    description: `Start BFS from node ${startNode} on graph with ${nodes.length} nodes. Using a queue for level-by-level exploration.`,
    state: { array: nodes, operation: "init" },
    activeLineIndex: 0,
    variables: { start: startNode, nodes: nodes.length, edges: Object.values(graph).reduce((s, a) => s + a.length, 0) / 2 },
    highlights: [{ index: startNode, color: "primary", label: "START" }],
  });

  queue.push(startNode);
  visited.add(startNode);

  steps.push({
    stepNumber: stepNumber++,
    description: `Enqueue start node ${startNode}. Mark as visited. Queue: [${queue.join(", ")}].`,
    state: { array: nodes, operation: "enqueue" },
    activeLineIndex: 2,
    variables: { queue: `[${queue}]`, visited: `{${[...visited]}}`, current: startNode },
    highlights: [{ index: startNode, color: "warning", label: "QUEUED" }],
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    steps.push({
      stepNumber: stepNumber++,
      description: `Dequeue node ${current}. Process it. Neighbors: [${graph[current].join(", ")}].`,
      state: { array: nodes, operation: "process" },
      activeLineIndex: 4,
      variables: {
        current,
        queue: `[${queue}]`,
        visited: `{${[...visited]}}`,
        order: `[${order}]`,
        neighbors: `[${graph[current]}]`,
      },
      highlights: [
        { index: current, color: "primary", label: "PROCESS" },
        ...order.slice(0, -1).map((n) => ({ index: n, color: "success" as const, label: "✓" })),
        ...queue.map((n) => ({ index: n, color: "warning" as const, label: "Q" })),
      ],
    });

    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        steps.push({
          stepNumber: stepNumber++,
          description: `Neighbor ${neighbor} not visited → enqueue. Queue: [${queue.join(", ")}].`,
          state: { array: nodes, operation: "enqueue" },
          activeLineIndex: 6,
          variables: {
            current,
            neighbor,
            queue: `[${queue}]`,
            visited: `{${[...visited]}}`,
          },
          highlights: [
            { index: current, color: "primary", label: "FROM" },
            { index: neighbor, color: "warning", label: "NEW" },
            ...order.map((n) => ({ index: n, color: "success" as const, label: "✓" })),
          ],
        });
      }
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `✅ BFS complete! Traversal order: [${order.join(" → ")}]. All ${order.length} reachable nodes visited.`,
    state: { array: nodes, operation: "done" },
    activeLineIndex: 9,
    variables: { order: `[${order}]`, visited: order.length },
    highlights: order.map((n) => ({ index: n, color: "success" as const, label: "✓" })),
  });

  return steps;
}

export const graphBFSData: TopicData = {
  id: "graph-bfs",
  slug: "graph-bfs",
  title: "Graph BFS",
  category: "graph",
  icon: "🌐",
  shortDescription: "Breadth-first search for shortest paths and level-order traversal.",
  stepGeneratorId: "graphBFS",
  levels: [
    {
      level: 1,
      title: "What is BFS?",
      content: `**Breadth-First Search (BFS)** explores a graph **level by level**, visiting all neighbors before going deeper.

**Core idea:** Use a **queue** (FIFO) to process nodes. Visit all neighbors of the current node before moving to the next level.

**Real-world analogy:** Ripples in a pond 🌊. Drop a stone — waves spread outward in concentric circles, reaching nearby points before distant ones.

**Key Properties:**
- Finds the **shortest path** in unweighted graphs
- Uses a **queue** for traversal
- Must track **visited nodes** to avoid infinite loops
- Time: O(V + E), Space: O(V)

**BFS vs DFS:**
| Feature | BFS | DFS |
|---------|-----|-----|
| Structure | Queue | Stack/Recursion |
| Order | Level by level | As deep as possible |
| Shortest path? | Yes (unweighted) | No guarantee |
| Space | O(V) or O(width) | O(V) or O(height) |`,
    },
    {
      level: 2,
      title: "BFS Algorithm",
      content: `### The Algorithm:
\`\`\`
BFS(graph, start):
  queue = [start]
  visited = {start}

  while queue is not empty:
    node = queue.dequeue()
    process(node)

    for each neighbor of node:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)
\`\`\`

### Why It Finds Shortest Path:
- BFS processes nodes in order of their distance from the start
- All nodes at distance d are processed before any node at distance d+1
- First time you reach a node = shortest path to it

### Complexity:
| | Time | Space |
|--|------|-------|
| Adjacency List | O(V + E) | O(V) |
| Adjacency Matrix | O(V²) | O(V) |

V = vertices (nodes), E = edges.

### Graph Representations:
1. **Adjacency List**: Array of lists — space efficient for sparse graphs
2. **Adjacency Matrix**: 2D boolean array — fast lookups but O(V²) space`,
    },
    {
      level: 3,
      title: "BFS Patterns & Applications",
      content: `### Key BFS Applications:

**1. Shortest Path (Unweighted)**
- Track distance while doing BFS
- First visit = shortest distance from source

**2. Connected Components**
- Run BFS from each unvisited node
- Each BFS run discovers one component

**3. Bipartite Check (2-Coloring)**
- BFS with alternating colors
- If a neighbor has the same color → not bipartite

**4. Multi-Source BFS**
- Start with multiple sources in the queue
- Example: "Rotting Oranges" — all rotten oranges start simultaneously

**5. 0-1 BFS**
- Graph with edge weights 0 and 1 only
- Use deque: weight 0 → push front, weight 1 → push back

**6. Grid BFS (Number of Islands, Shortest Path in Matrix)**
- Treat each cell as a node
- 4 directions (up, down, left, right) are edges
- Mark visited to avoid revisiting`,
    },
  ],
  codeSnippets: [
    {
      language: "javascript",
      code: `// BFS in JavaScript (Adjacency List)
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}

// Shortest path BFS
function shortestPath(graph, start, end) {
  const visited = new Set([start]);
  const queue = [[start, 0]]; // [node, distance]

  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    if (node === end) return dist;

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1; // Not reachable
}`,
      lineDescriptions: {
        0: "Standard BFS using adjacency list representation",
        2: "Mark start as visited immediately — before processing!",
        3: "Queue stores nodes to process in FIFO order",
        7: "Dequeue and process the front node",
        9: "Check all neighbors of current node",
        10: "Only enqueue unvisited neighbors",
        19: "Shortest path: track distance alongside each node",
        24: "If we reach the target, return the distance",
      },
    },
    {
      language: "python",
      code: `# BFS in Python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

# Grid BFS (Number of Islands pattern)
def bfs_grid(grid, row, col):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(row, col)])
    grid[row][col] = '0'  # mark visited

    while queue:
        r, c = queue.popleft()
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                grid[nr][nc] = '0'
                queue.append((nr, nc))`,
    },
    {
      language: "cpp",
      code: `#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

vector<int> bfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited = {start};
    queue<int> q;
    q.push(start);
    vector<int> order;

    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);

        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return order;
}`,
    },
  ],
  practiceQuestions: [
    {
      id: "g-q1",
      title: "Number of Islands",
      description: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands (horizontally/vertically).",
      difficulty: "medium",
      hint: "Iterate through every cell. When you find a '1', increment count and BFS to mark all connected '1's as visited (set to '0').",
      solution: `function numIslands(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        const q = [[r, c]];
        grid[r][c] = '0';
        while (q.length) {
          const [cr, cc] = q.shift();
          for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
            const nr = cr+dr, nc = cc+dc;
            if (nr>=0 && nr<grid.length && nc>=0 && nc<grid[0].length && grid[nr][nc]==='1') {
              grid[nr][nc] = '0';
              q.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}`,
      testCases: [
        { input: "[['1','1','0'],['0','1','0'],['0','0','1']]", expectedOutput: "2", description: "Two islands" },
      ],
    },
    {
      id: "g-q2",
      title: "Shortest Path in Binary Matrix",
      description: "Given an n×n binary grid, find the shortest path from (0,0) to (n-1,n-1). You can move in 8 directions. Return -1 if no path exists.",
      difficulty: "medium",
      hint: "BFS from (0,0), explore all 8 directions. Track distance. First time reaching (n-1,n-1) is the shortest path.",
      solution: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n-1][n-1]) return -1;
  const q = [[0, 0, 1]]; // row, col, distance
  grid[0][0] = 1;
  while (q.length) {
    const [r, c, d] = q.shift();
    if (r === n-1 && c === n-1) return d;
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0 && nr<n && nc>=0 && nc<n && !grid[nr][nc]) {
          grid[nr][nc] = 1;
          q.push([nr, nc, d+1]);
        }
      }
  }
  return -1;
}`,
      testCases: [
        { input: "[[0,0,0],[1,1,0],[1,1,0]]", expectedOutput: "4", description: "Path exists" },
      ],
    },
  ],
  commonMistakes: [
    {
      id: "g-m1",
      title: "Marking Visited Too Late",
      description: "Adding node to visited after dequeuing instead of when enqueuing",
      wrongCode: `// ❌ Mark visited when processing (TOO LATE!)
const node = queue.shift();
visited.add(node);  // Other paths may have already enqueued it!`,
      correctCode: `// ✅ Mark visited when ENQUEUING
if (!visited.has(neighbor)) {
  visited.add(neighbor);  // Mark NOW
  queue.push(neighbor);   // Then enqueue
}`,
      explanation: "If you mark visited only when processing, the same node can be enqueued multiple times from different neighbors, wasting time and causing incorrect results.",
    },
    {
      id: "g-m2",
      title: "Forgetting to Handle Disconnected Graphs",
      description: "BFS from one node doesn't reach disconnected components",
      wrongCode: `// ❌ Only BFS from node 0
bfs(graph, 0);  // Misses disconnected components!`,
      correctCode: `// ✅ BFS from every unvisited node
for (let node = 0; node < n; node++) {
  if (!visited.has(node)) {
    bfs(graph, node);  // New connected component!
    components++;
  }
}`,
      explanation: "A single BFS call only reaches nodes in the same connected component. Loop through all nodes and start BFS from each unvisited one to cover the entire graph.",
    },
    {
      id: "g-m3",
      title: "Using DFS When BFS Is Required",
      description: "DFS does NOT find shortest paths in unweighted graphs",
      wrongCode: `// ❌ DFS for shortest path
function shortestPath(graph, start, end) {
  // DFS may find A path, but NOT the shortest!
}`,
      correctCode: `// ✅ BFS guarantees shortest path in unweighted graphs
function shortestPath(graph, start, end) {
  const queue = [[start, 0]];
  // BFS processes nodes in order of distance
}`,
      explanation: "DFS explores deeply first, so it may find a longer path before a shorter one. BFS processes all nodes at distance d before distance d+1, guaranteeing shortest path.",
    },
  ],
  complexity: {
    time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
    explanation: "BFS visits every vertex once and checks every edge once → O(V+E). Space: queue can hold at most O(V) nodes, and the visited set is O(V). For grid problems: V = rows×cols, E = 4×V.",
  },
  patternTips: [
    "📌 Shortest path in unweighted graph → always BFS, never DFS.",
    "📌 Mark visited WHEN ENQUEUING, not when processing.",
    "📌 Grid BFS: 4 directions = [(0,1),(0,-1),(1,0),(-1,0)].",
    "📌 Multi-source BFS: enqueue all sources at the start for simultaneous expansion.",
    "📌 For weighted graphs, BFS doesn't work — use Dijkstra's algorithm instead.",
  ],
};
