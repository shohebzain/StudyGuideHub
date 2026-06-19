import React, { useState, useRef, useEffect } from 'react';
import { Compass, Plus, Trash2, Play, Circle, Grid, RefreshCw, Layers } from 'lucide-react';
import { GraphNode, GraphEdge, VizStep } from '../../types';
import { audioService } from '../../utils/audio';

export default function GraphVisualizer() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'grid'>('sandbox');

  // --- TAB 1: GRAPH SANDBOX SYSTEM ---
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'A', label: 'A', x: 80, y: 50 },
    { id: 'B', label: 'B', x: 260, y: 50 },
    { id: 'C', label: 'C', x: 80, y: 170 },
    { id: 'D', label: 'D', x: 260, y: 170 },
    { id: 'E', label: 'E', x: 440, y: 110 }
  ]);
  const [edges, setEdges] = useState<GraphEdge[]>([
    { id: 'AB', source: 'A', target: 'B', weight: 4 },
    { id: 'AC', source: 'A', target: 'C', weight: 2 },
    { id: 'CD', source: 'C', target: 'D', weight: 3 },
    { id: 'BD', source: 'B', target: 'D', weight: 1 },
    { id: 'BE', source: 'B', target: 'E', weight: 3 },
    { id: 'DE', source: 'D', target: 'E', weight: 5 }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<number>(3);
  
  // Sandbox active tracer highlights
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [resultEdges, setResultEdges] = useState<string[]>([]); // Highlighting MST/Path branches

  // --- TAB 2: GRID PATHFINDING SYSTEM ---
  const ROWS = 9;
  const COLS = 13;
  const [grid, setGrid] = useState<string[][]>(() => createInitialGrid());
  const [startCell, setStartCell] = useState<{ r: number; c: number }>({ r: 2, c: 2 });
  const [endCell, setEndCell] = useState<{ r: number; c: number }>({ r: 6, c: 10 });
  const [gridMode, setGridMode] = useState<'draw_wall' | 'set_start' | 'set_end'>('draw_wall');
  const [gridVisiting, setGridVisiting] = useState<{ r: number; c: number }[]>([]);
  const [gridFinalPath, setGridFinalPath] = useState<{ r: number; c: number }[]>([]);

  // Unified directory log
  const [traceLog, setTraceLog] = useState<string>('Select Sandbox or Obstacle Grid modes. Perform custom configurations to run solvers.');

  function createInitialGrid() {
    const freshGrid: string[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: string[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push('empty');
      }
      freshGrid.push(row);
    }
    return freshGrid;
  }

  // Handle adding node by clicking on Sandbox container
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTab !== 'sandbox') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Limit nodes coordinates size to avoid overflow
    if (x < 20 || x > rect.width - 20 || y < 20 || y > rect.height - 20) return;

    // Create a new distinct node label
    const charCode = 65 + nodes.length; // 'A' + length
    const label = String.fromCharCode(charCode <= 90 ? charCode : charCode + 6);
    const id = label;

    if (nodes.length >= 10) {
      setTraceLog('Limit: Sandbox is limited to a maximum of 10 nodes for clean visuals.');
      return;
    }

    const newNode: GraphNode = { id, label, x, y };
    setNodes(prev => [...prev, newNode]);
    setTraceLog(`Added Node ${label} at coordinate (${x}, ${y}). Select two nodes and enter weights below to bind an edge link!`);
  };

  const handleConnectEdges = (targetNodeId: string) => {
    if (!selectedNodeId) {
      setSelectedNodeId(targetNodeId);
      setTraceLog(`Selected node ${targetNodeId}. Now click a second node to forge a link connection!`);
    } else {
      if (selectedNodeId === targetNodeId) {
        setSelectedNodeId(null);
        return;
      }
      // Direct duplicate edge check
      const exists = edges.some(
        e => (e.source === selectedNodeId && e.target === targetNodeId) ||
             (e.source === targetNodeId && e.target === selectedNodeId)
      );
      if (exists) {
        setTraceLog(`Edge already exists between ${selectedNodeId} and ${targetNodeId}.`);
        setSelectedNodeId(null);
        return;
      }

      const newEdge: GraphEdge = {
        id: `${selectedNodeId}${targetNodeId}`,
        source: selectedNodeId,
        target: targetNodeId,
        weight: edgeWeight
      };

      setEdges(prev => [...prev, newEdge]);
      setTraceLog(`Forged Edge connection from ${selectedNodeId} to ${targetNodeId} with weight value = ${edgeWeight}.`);
      setSelectedNodeId(null);
    }
  };

  const handleDeleteAllGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setVisitedNodes([]);
    setResultEdges([]);
    setTraceLog('Flushed Sandbox workspace completely! Click inside container above to place brand new custom nodes.');
  };

  // --- SOLVER ALGORITHMS IN GRAPH SANDBOX ---
  const runBFSSandbox = () => {
    if (nodes.length === 0) return;
    setVisitedNodes([]);
    setResultEdges([]);
    setActiveNode(null);

    const start = nodes[0].id;
    const queue: string[] = [start];
    const visited: string[] = [start];
    const order: string[] = [];

    // Adjacency mapper
    const adj: { [key: string]: string[] } = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(e => {
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    });

    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr);
      adj[curr].forEach(neigh => {
        if (!visited.includes(neigh)) {
          visited.push(neigh);
          queue.push(neigh);
        }
      });
    }

    setTraceLog(`Starting Breadth-First-Search (BFS) traversal from Node ${start}:`);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < order.length) {
        const u = order[idx];
        setActiveNode(u);
        setVisitedNodes(prev => [...prev, u]);
        setTraceLog(`Visited Node ${u} inside search queue frame.`);
        const charCode = u.charCodeAt(0) || 65;
        audioService.playValue(charCode, 65, 80, 'sine', 0.12);
        idx++;
      } else {
        clearInterval(interval);
        setActiveNode(null);
        setTraceLog(`BFS Traversal Complete! Order resolved: ${order.join(' -> ')}`);
        audioService.playStep('success');
      }
    }, 600);
  };

  const runDFSSandbox = () => {
    if (nodes.length === 0) return;
    setVisitedNodes([]);
    setResultEdges([]);
    setActiveNode(null);

    const start = nodes[0].id;
    const visited: string[] = [];
    const order: string[] = [];

    // Adjacency mapper
    const adj: { [key: string]: string[] } = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(e => {
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    });

    function dfs(u: string) {
      visited.push(u);
      order.push(u);
      adj[u].forEach(v => {
        if (!visited.includes(v)) {
          dfs(v);
        }
      });
    }
    dfs(start);

    setTraceLog(`Starting Depth-First-Search (DFS) traversal from Node ${start}:`);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < order.length) {
        const u = order[idx];
        setActiveNode(u);
        setVisitedNodes(prev => [...prev, u]);
        setTraceLog(`DFS Deep-Dive: Visited Node ${u}.`);
        const charCode = u.charCodeAt(0) || 65;
        audioService.playValue(charCode, 65, 80, 'sine', 0.12);
        idx++;
      } else {
        clearInterval(interval);
        setActiveNode(null);
        setTraceLog(`DFS Traversal Complete! Exploration order resolved: ${order.join(' -> ')}`);
        audioService.playStep('success');
      }
    }, 600);
  };

  const runDijkstraSandbox = () => {
    if (nodes.length === 0) return;
    setVisitedNodes([]);
    setResultEdges([]);
    setActiveNode(null);

    const start = nodes[0].id;
    const dist: { [key: string]: number } = {};
    const prevNode: { [key: string]: string | null } = {};
    const unvisited = new Set<string>(nodes.map(n => n.id));

    nodes.forEach(n => {
      dist[n.id] = Infinity;
      prevNode[n.id] = null;
    });
    dist[start] = 0;

    // Adjacency mapper with weight thresholds
    const adj: { [key: string]: { node: string; weight: number; edgeId: string }[] } = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(e => {
      adj[e.source].push({ node: e.target, weight: e.weight, edgeId: e.id });
      adj[e.target].push({ node: e.source, weight: e.weight, edgeId: e.id });
    });

    const executionOrder: { node: string; distVal: number; visitedList: string[]; highlightedEdges: string[] }[] = [];

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minNode: string | null = null;
      let minDist = Infinity;
      unvisited.forEach(n => {
        if (dist[n] < minDist) {
          minDist = dist[n];
          minNode = n;
        }
      });

      if (minNode === null) break;
      unvisited.delete(minNode);

      // Record visual state framing
      const currentVisited = nodes.map(n => n.id).filter(nid => !unvisited.has(nid));
      const currentEdges: string[] = [];
      nodes.forEach(nid => {
        if (prevNode[nid]) {
          const edge = edges.find(
            e => (e.source === nid && e.target === prevNode[nid]) ||
                 (e.source === prevNode[nid] && e.target === nid)
          );
          if (edge) currentEdges.push(edge.id);
        }
      });

      executionOrder.push({
        node: minNode,
        distVal: minDist,
        visitedList: [...currentVisited],
        highlightedEdges: [...currentEdges]
      });

      adj[minNode].forEach(neigh => {
        if (unvisited.has(neigh.node)) {
          const alt = dist[minNode!] + neigh.weight;
          if (alt < dist[neigh.node]) {
            dist[neigh.node] = alt;
            prevNode[neigh.node] = minNode;
          }
        }
      });
    }

    setTraceLog(`Running Dijkstra Shortest-Path from node ${start}:`);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < executionOrder.length) {
        const step = executionOrder[idx];
        setActiveNode(step.node);
        setVisitedNodes(step.visitedList);
        setResultEdges(step.highlightedEdges);
        setTraceLog(`Dijkstra optimal node index locked: Node ${step.node} with cumulative distance weight sum = ${step.distVal}`);
        const charCode = step.node.charCodeAt(0) || 65;
        audioService.playValue(charCode, 65, 80, 'sine', 0.12);
        idx++;
      } else {
        clearInterval(interval);
        setActiveNode(null);
        setTraceLog(`Dijkstra Shortest Path layout solved. All optimal nodes highlighted in purple.`);
        audioService.playStep('success');
      }
    }, 600);
  };

  const runPrimSandbox = () => {
    if (nodes.length === 0 || edges.length === 0) return;
    setVisitedNodes([]);
    setResultEdges([]);
    setActiveNode(null);

    const start = nodes[0].id;
    const visited = new Set<string>([start]);
    const mstEdges: string[] = [];
    const executionOrder: { node: string; visitedList: string[]; edgesHighlight: string[] }[] = [];

    while (visited.size < nodes.length) {
      let minEdge: GraphEdge | null = null;
      let minW = Infinity;

      edges.forEach(e => {
        const uVisit = visited.has(e.source);
        const vVisit = visited.has(e.target);
        if (uVisit !== vVisit) { // Only crossing edges
          if (e.weight < minW) {
            minW = e.weight;
            minEdge = e;
          }
        }
      });

      if (minEdge === null) break; // Disconnected graph

      const nextNode = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
      visited.add(nextNode);
      mstEdges.push(minEdge.id);

      executionOrder.push({
        node: nextNode,
        visitedList: Array.from(visited),
        edgesHighlight: [...mstEdges]
      });
    }

    setTraceLog('Running Prim\'s Minimum Spanning Tree algorithm (greedy edge aggregation):');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < executionOrder.length) {
        const step = executionOrder[idx];
        setActiveNode(step.node);
        setVisitedNodes(step.visitedList);
        setResultEdges(step.edgesHighlight);
        setTraceLog(`Linked Spanning node ${step.node} across minimal weight edge.`);
        const charCode = step.node.charCodeAt(0) || 65;
        audioService.playValue(charCode, 65, 80, 'sine', 0.12);
        idx++;
      } else {
        clearInterval(interval);
        setActiveNode(null);
        setTraceLog(`Prim's MST solved. Minimal physical connector nodes highlighted successfully.`);
        audioService.playStep('success');
      }
    }, 600);
  };

  // --- GRID INTERACTION SOLVERS ---
  const handleCellClick = (r: number, c: number) => {
    if (activeTab !== 'grid') return;
    // Disallow overriding start/end targets directly as wall drawn
    if (r === startCell.r && c === startCell.c) return;
    if (r === endCell.r && c === endCell.c) return;

    if (gridMode === 'set_start') {
      setStartCell({ r, c });
      setGridMode('draw_wall');
      setTraceLog(`Redefined Start Node target block coordinate to (${r}, ${c}).`);
    } else if (gridMode === 'set_end') {
      setEndCell({ r, c });
      setGridMode('draw_wall');
      setTraceLog(`Redefined End Node target block coordinate to (${r}, ${c}).`);
    } else {
      // Toggle Wall obstacle block
      setGrid(prev => {
        const nextGrid = prev.map(row => [...row]);
        nextGrid[r][c] = nextGrid[r][c] === 'wall' ? 'empty' : 'wall';
        return nextGrid;
      });
    }
  };

  const handleClearGrid = () => {
    setGrid(createInitialGrid());
    setGridVisiting([]);
    setGridFinalPath([]);
    setTraceLog('Grid boundaries flushed! Start/End points remain. Draw obstacle walls above.');
  };

  // --- GRID GRAPH PATHFINDER BFS SOLVER ---
  const runGridBFSSolver = () => {
    setGridVisiting([]);
    setGridFinalPath([]);

    const queue: { r: number; c: number; parent: any }[] = [];
    const visited = new Set<string>();
    
    const serializeCell = (r: number, c: number) => `${r},${c}`;
    
    queue.push({ r: startCell.r, c: startCell.c, parent: null });
    visited.add(serializeCell(startCell.r, startCell.c));

    const checkOrder: { r: number; c: number }[] = [];
    let endNode: any = null;

    // Movement offsets (Left, Right, Up, Down)
    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      checkOrder.push({ r: curr.r, c: curr.c });

      if (curr.r === endCell.r && curr.c === endCell.c) {
        endNode = curr;
        break;
      }

      for (const d of dirs) {
        const nr = curr.r + d.dr;
        const nc = curr.c + d.dc;

        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const serialized = serializeCell(nr, nc);
          if (!visited.has(serialized) && grid[nr][nc] !== 'wall') {
            visited.add(serialized);
            queue.push({ r: nr, c: nc, parent: curr });
          }
        }
      }
    }

    if (!endNode) {
      setTraceLog('BFS Solver: Blocked! Target endpoint is completely unreachable due to wall boundaries.');
      return;
    }

    // Reconstruct path
    const path: { r: number; c: number }[] = [];
    let backtracker = endNode;
    while (backtracker !== null) {
      path.unshift({ r: backtracker.r, c: backtracker.c });
      backtracker = backtracker.parent;
    }

    // Sequentially animate cell scans
    setTraceLog('Commencing standard BFS Grid Shortest-Path expansion:');
    let scanIdx = 0;
    const interval = setInterval(() => {
      if (scanIdx < checkOrder.length) {
        const cell = checkOrder[scanIdx];
        setGridVisiting(prev => [...prev, cell]);
        audioService.playTone(180 + (cell.r * 15) + (cell.c * 5), 'sine', 0.05, 0.03);
        scanIdx += 2; // Increments slightly faster so user doesn't wait
      } else {
        clearInterval(interval);
        setGridFinalPath(path);
        setTraceLog(`BFS Pathfinding Complete! Safely resolved shortest cell route of length = ${path.length} blocks.`);
        audioService.playStep('success');
      }
    }, 80);
  };

  // --- GRID GRAPH PATHFINDER A* SEARCH SOLVER ---
  const runGridAStarSolver = () => {
    setGridVisiting([]);
    setGridFinalPath([]);

    interface AStarNode {
      r: number;
      c: number;
      g: number; // cost to cell
      h: number; // heuristic manhattan
      f: number; // total
      parent: AStarNode | null;
    }

    const startNode: AStarNode = {
      r: startCell.r,
      c: startCell.c,
      g: 0,
      h: Math.abs(startCell.r - endCell.r) + Math.abs(startCell.c - endCell.c),
      f: Math.abs(startCell.r - endCell.r) + Math.abs(startCell.c - endCell.c),
      parent: null
    };

    const openList: AStarNode[] = [startNode];
    const closedList = new Set<string>();
    const checkOrder: { r: number; c: number }[] = [];
    let endNode: AStarNode | null = null;

    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];

    while (openList.length > 0) {
      // Find node with minimum f
      let minIdx = 0;
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < openList[minIdx].f) {
          minIdx = i;
        }
      }

      const curr = openList.splice(minIdx, 1)[0];
      checkOrder.push({ r: curr.r, c: curr.c });
      closedList.add(`${curr.r},${curr.c}`);

      if (curr.r === endCell.r && curr.c === endCell.c) {
        endNode = curr;
        break;
      }

      for (const d of dirs) {
        const nr = curr.r + d.dr;
        const nc = curr.c + d.dc;

        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const key = `${nr},${nc}`;
          if (closedList.has(key) || grid[nr][nc] === 'wall') continue;

          const gScore = curr.g + 1;
          const hScore = Math.abs(nr - endCell.r) + Math.abs(nc - endCell.c);
          const fScore = gScore + hScore;

          const existingOpen = openList.find(o => o.r === nr && o.c === nc);
          if (existingOpen && gScore >= existingOpen.g) continue;

          const neighborNode: AStarNode = {
            r: nr,
            c: nc,
            g: gScore,
            h: hScore,
            f: fScore,
            parent: curr
          };

          if (!existingOpen) {
            openList.push(neighborNode);
          } else {
            existingOpen.g = gScore;
            existingOpen.f = fScore;
            existingOpen.parent = curr;
          }
        }
      }
    }

    if (!endNode) {
      setTraceLog('A* Search solver failed: Target endpoint is completely blocked by drawing actions.');
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }

    const path: { r: number; c: number }[] = [];
    let backtracker: AStarNode | null = endNode;
    while (backtracker !== null) {
      path.unshift({ r: backtracker.r, c: backtracker.c });
      backtracker = backtracker.parent;
    }

    setTraceLog('Commencing A* (Manhattan Distance heuristically boosted) path solver loops:');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < checkOrder.length) {
        const cell = checkOrder[idx];
        setGridVisiting(prev => [...prev, cell]);
        audioService.playTone(180 + (cell.r * 15) + (cell.c * 5), 'sine', 0.05, 0.03);
        idx += 2;
      } else {
        clearInterval(interval);
        setGridFinalPath(path);
        setTraceLog(`A* heuristic resolved shortest route coordinates successfully of weight size = ${path.length}`);
        audioService.playStep('success');
      }
    }, 100);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Visual Workspace Tab Toggle */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex gap-2 p-1 bg-slate-105 dark:bg-slate-800 rounded-xl">
          <button
            id="tab-sandbox"
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'sandbox'
                ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <Compass className="w-4 h-4" />
            Graph Sandbox
          </button>
          <button
            id="tab-grid"
            onClick={() => {
              setActiveTab('grid');
              setGridVisiting([]);
              setGridFinalPath([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'grid'
                ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-350'
            }`}
          >
            <Grid className="w-4 h-4" />
            A* Grid Pathfinding
          </button>
        </div>

        {/* Dynamic top toolbars bar options */}
        {activeTab === 'sandbox' ? (
          <div className="flex items-center gap-1.5 border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 min-h-[40px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Edge Weight:</span>
            <input
              id="sandbox-edge-weight"
              type="number"
              min="1"
              max="20"
              value={edgeWeight}
              onChange={(e) => setEdgeWeight(Math.min(20, Math.max(1, Number(e.target.value))))}
              className="w-10 bg-transparent text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 outline-none text-center"
            />
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              id="grid-draw-wall"
              onClick={() => setGridMode('draw_wall')}
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                gridMode === 'draw_wall' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
              }`}
            >
              Draw Wall
            </button>
            <button
              id="grid-set-start"
              onClick={() => setGridMode('set_start')}
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                gridMode === 'set_start' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-650 dark:bg-slate-800'
              }`}
            >
              Start Pt
            </button>
            <button
              id="grid-set-end"
              onClick={() => setGridMode('set_end')}
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                gridMode === 'set_end' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-655 dark:bg-slate-800'
              }`}
            >
              End Pt
            </button>
          </div>
        )}
      </div>

      {/* Main Sandbox Interactive Display */}
      {activeTab === 'sandbox' ? (
        <div
          id="sandbox-canvas"
          onClick={handleCanvasClick}
          className="h-80 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl relative bg-slate-50/20 dark:bg-slate-900/10 overflow-hidden cursor-crosshair select-none"
          title="Click to drop a custom node on the sandbox board!"
        >
          {/* Edge connection SVG lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((e) => {
              const u = nodes.find(n => n.id === e.source);
              const v = nodes.find(n => n.id === e.target);
              if (!u || !v) return null;

              const isMstHighlight = resultEdges.includes(e.id);
              return (
                <g key={e.id}>
                  <line
                    id={`sandbox-edge-line-${e.id}`}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={isMstHighlight ? '#8a5cf6' : '#cbd5e1'}
                    strokeWidth={isMstHighlight ? '4' : '2'}
                    className="transition-all duration-300"
                  />
                  {/* Weight tag bubble visually centered */}
                  <foreignObject
                    x={(u.x + v.x) / 2 - 12}
                    y={(u.y + v.y) / 2 - 12}
                    width="24"
                    height="24"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-neutral-50 text-[10px] font-mono font-bold flex items-center justify-center border border-slate-200 shadow-xs leading-none">
                      {e.weight}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* Render circular draggable nodes list */}
          {nodes.map((n) => {
            const isActive = activeNode === n.id;
            const isVisited = visitedNodes.includes(n.id);
            const isChosen = selectedNodeId === n.id;

            let nodeClass = 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-neutral-55';
            if (isActive) {
              nodeClass = 'bg-amber-400 border-amber-500 text-amber-950 font-black scale-105 shadow-md animate-pulse';
            } else if (isChosen) {
              nodeClass = 'bg-indigo-600 border-indigo-700 text-white font-extrabold scale-105';
            } else if (isVisited) {
              nodeClass = 'bg-purple-100 dark:bg-purple-950/20 border-purple-500 text-purple-700 font-bold';
            }

            return (
              <div
                id={`sandbox-node-${n.id}`}
                key={n.id}
                onClick={(e) => {
                  e.stopPropagation(); // Avoid dropping another node on top
                  handleConnectEdges(n.id);
                }}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 text-xs font-sans font-bold flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm ${nodeClass}`}
                style={{
                  left: `${n.x}px`,
                  top: `${n.y}px`
                }}
              >
                {n.label}
              </div>
            );
          })}

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Compass className="w-7 h-7 stroke-1.25 mb-1.5 animate-spin" />
              <span>Sandbox is Empty!</span>
              <span>Click any coordinate inside this panel to drop node anchors.</span>
            </div>
          )}
        </div>
      ) : (
        /* GRID OBSTACLE AND CELL INTERACTION SYSTEM */
        <div className="block py-4">
          <div className="flex flex-col items-center justify-center select-none gap-0.5 max-w-full overflow-x-auto">
            {grid.map((row, r) => (
              <div key={r} className="flex gap-0.5">
                {row.map((cellState, c) => {
                  const isStart = r === startCell.r && c === startCell.c;
                  const isEnd = r === endCell.r && c === endCell.c;
                  const isWall = cellState === 'wall';
                  const isVisited = gridVisiting.some(v => v.r === r && v.c === c);
                  const isPath = gridFinalPath.some(p => p.r === r && p.c === c);

                  let blockColor = 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800/40 text-transparent';
                  let innerText = '';
                  
                  if (isStart) {
                    blockColor = 'bg-emerald-500 border-emerald-600 text-white font-black scale-102';
                    innerText = 'S';
                  } else if (isEnd) {
                    blockColor = 'bg-rose-500 border-rose-600 text-white font-black scale-102 animate-pulse';
                    innerText = 'E';
                  } else if (isWall) {
                    blockColor = 'bg-slate-800 border-slate-900 text-transparent';
                  } else if (isPath) {
                    blockColor = 'bg-amber-400 border-amber-500 text-amber-950 font-black scale-102';
                  } else if (isVisited) {
                    blockColor = 'bg-indigo-100/80 dark:bg-indigo-950/20 border-indigo-200 text-transparent';
                  }

                  return (
                    <div
                      id={`grid-cell-${r}-${c}`}
                      key={c}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-10 h-10 border text-xs flex items-center justify-center rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.05] ${blockColor}`}
                    >
                      {innerText}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traversal console logging */}
      <div className="p-3.5 bg-slate-950 text-emerald-450 rounded-xl font-mono text-xs leading-relaxed border border-slate-900 shadow-inner flex gap-2">
        <span className="text-slate-500 font-bold select-none border-r border-slate-850 pr-2">TRAVERSE</span>
        <span className="flex-1">{traceLog}</span>
      </div>

      {/* Solver triggering buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {activeTab === 'sandbox' ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="sandbox-bfs-btn"
              onClick={runBFSSandbox}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-605 text-white hover:bg-indigo-705 transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              BFS Traverse
            </button>
            <button
              id="sandbox-dfs-btn"
              onClick={runDFSSandbox}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-605 text-white hover:bg-indigo-705 transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              DFS Traverse
            </button>
            <button
              id="sandbox-dijkstra-btn"
              onClick={runDijkstraSandbox}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-violet-605 text-white hover:bg-violet-705 transition-all shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              Dijkstra
            </button>
            <button
              id="sandbox-prim-btn"
              onClick={runPrimSandbox}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              Prim's MST
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="grid-bfs-solver-btn"
              onClick={runGridBFSSolver}
              className="px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-650 text-white hover:bg-indigo-705 shadow-sm"
            >
              BFS Pathfind
            </button>
            <button
              id="grid-astar-solver-btn"
              onClick={runGridAStarSolver}
              className="px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            >
              A* Solver
            </button>
          </div>
        )}

        <button
          id="sandbox-flush-btn"
          onClick={activeTab === 'sandbox' ? handleDeleteAllGraph : handleClearGrid}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/65 text-slate-500 hover:text-slate-805 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear parameters
        </button>
      </div>
    </div>
  );
}
