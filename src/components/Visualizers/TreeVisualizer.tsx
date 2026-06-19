import React, { useState, useEffect } from 'react';
import { GitFork, Plus, Trash2, Search, Compass, RefreshCw, Layers } from 'lucide-react';
import { audioService } from '../../utils/audio';

interface TreeNodeType {
  value: number;
  id: string;
  left: TreeNodeType | null;
  right: TreeNodeType | null;
  height: number;
}

export default function TreeVisualizer() {
  const [treeType, setTreeType] = useState<'bst' | 'avl'>('bst');
  const [root, setRoot] = useState<TreeNodeType | null>(null);
  const [inputValue, setInputValue] = useState<number>(45);
  const [searchTarget, setSearchTarget] = useState<number>(30);
  
  // Animation tracer states
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [traceLog, setTraceLog] = useState<string>('Select dynamic BST or self-balancing AVL forms. Run operations or traversals above.');
  const [traversalPrintout, setTraversalPrintout] = useState<number[]>([]);

  // Seed standard tree on load
  useEffect(() => {
    handleInitializeSeed();
  }, [treeType]);

  const handleInitializeSeed = () => {
    let newRoot: TreeNodeType | null = null;
    const items = [50, 30, 70, 20, 40, 60, 80];
    
    for (const val of items) {
      newRoot = insertTreeNode(newRoot, val);
    }
    setRoot(newRoot);
    setVisitedNodes([]);
    setActiveNodeId(null);
    setTraversalPrintout([]);
    setTraceLog(`Initialized random reference Binary Tree with standard values: ${items.join(', ')}.`);
  };

  const getTreeNodeHeight = (node: TreeNodeType | null): number => {
    return node ? node.height : 0;
  };

  const getBalanceFactor = (node: TreeNodeType | null): number => {
    if (!node) return 0;
    return getTreeNodeHeight(node.left) - getTreeNodeHeight(node.right);
  };

  const rotateLeft = (y: TreeNodeType): TreeNodeType => {
    const x = y.right as TreeNodeType;
    const T2 = x.left;

    x.left = y;
    y.right = T2;

    y.height = Math.max(getTreeNodeHeight(y.left), getTreeNodeHeight(y.right)) + 1;
    x.height = Math.max(getTreeNodeHeight(x.left), getTreeNodeHeight(x.right)) + 1;

    setTraceLog(`AVL rotation triggered: Left Rotation on node ${y.value}. Subtree balanced!`);
    return x;
  };

  const rotateRight = (x: TreeNodeType): TreeNodeType => {
    const y = x.left as TreeNodeType;
    const T2 = y.right;

    y.right = x;
    x.left = T2;

    x.height = Math.max(getTreeNodeHeight(x.left), getTreeNodeHeight(x.right)) + 1;
    y.height = Math.max(getTreeNodeHeight(y.left), getTreeNodeHeight(y.right)) + 1;

    setTraceLog(`AVL rotation triggered: Right Rotation on node ${x.value}. Subtree balanced!`);
    return y;
  };

  // BST & AVL insertion helper
  const insertTreeNode = (node: TreeNodeType | null, val: number): TreeNodeType => {
    if (!node) {
      return {
        value: val,
        id: `t-${val}-${Math.floor(Math.random() * 1000)}`,
        left: null,
        right: null,
        height: 1
      };
    }

    if (val < node.value) {
      node.left = insertTreeNode(node.left, val);
    } else if (val > node.value) {
      node.right = insertTreeNode(node.right, val);
    } else {
      return node; // Duplicate values ignored
    }

    // Update height
    node.height = Math.max(getTreeNodeHeight(node.left), getTreeNodeHeight(node.right)) + 1;

    if (treeType === 'avl') {
      const balance = getBalanceFactor(node);

      // Left Left (LL)
      if (balance > 1 && val < (node.left?.value ?? 0)) {
        return rotateRight(node);
      }
      // Right Right (RR)
      if (balance < -1 && val > (node.right?.value ?? 0)) {
        return rotateLeft(node);
      }
      // Left Right (LR)
      if (balance > 1 && val > (node.left?.value ?? 0)) {
        node.left = rotateLeft(node.left as TreeNodeType);
        return rotateRight(node);
      }
      // Right Left (RL)
      if (balance < -1 && val < (node.right?.value ?? 0)) {
        node.right = rotateRight(node.right as TreeNodeType);
        return rotateLeft(node);
      }
    }

    return node;
  };

  // BST deletion helper
  const deleteMinNode = (node: TreeNodeType): TreeNodeType => {
    let curr = node;
    while (curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  };

  const deleteTreeNode = (node: TreeNodeType | null, val: number): TreeNodeType | null => {
    if (!node) return null;

    if (val < node.value) {
      node.left = deleteTreeNode(node.left, val);
    } else if (val > node.value) {
      node.right = deleteTreeNode(node.right, val);
    } else {
      // Node found
      if (!node.left) return node.right;
      else if (!node.right) return node.left;

      // Two children: Get inorder successor min value in right subtree
      const replacement = deleteMinNode(node.right);
      node.value = replacement.value;
      node.right = deleteTreeNode(node.right, replacement.value);
    }

    // Update height
    node.height = Math.max(getTreeNodeHeight(node.left), getTreeNodeHeight(node.right)) + 1;

    if (treeType === 'avl') {
      const balance = getBalanceFactor(node);

      // Left Left Case
      if (balance > 1 && getBalanceFactor(node.left) >= 0) {
        return rotateRight(node);
      }
      // Left Right Case
      if (balance > 1 && getBalanceFactor(node.left) < 0) {
        node.left = rotateLeft(node.left as TreeNodeType);
        return rotateRight(node);
      }
      // Right Right Case
      if (balance < -1 && getBalanceFactor(node.right) <= 0) {
        return rotateLeft(node);
      }
      // Right Left Case
      if (balance < -1 && getBalanceFactor(node.right) > 0) {
        node.right = rotateRight(node.right as TreeNodeType);
        return rotateLeft(node);
      }
    }

    return node;
  };

  const handleInsert = () => {
    const val = inputValue || Math.floor(Math.random() * 90) + 10;
    
    // Simulate path traversal route before confirming insertion
    const path: string[] = [];
    let curr = root;
    let foundDuplicate = false;

    while (curr !== null) {
      path.push(curr.id);
      if (val < curr.value) {
        curr = curr.left;
      } else if (val > curr.value) {
        curr = curr.right;
      } else {
        foundDuplicate = true;
        break;
      }
    }

    if (foundDuplicate) {
      setTraceLog(`Abort insertion! Duplicate exception: cell ${val} ready exists.`);
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }

    setTraceLog(`Evaluating insert path for value ${val}...`);
    // Render path traversal sequentially
    let pIdx = 0;
    const interval = setInterval(() => {
      if (pIdx < path.length) {
        setActiveNodeId(path[pIdx]);
        audioService.playStep('traverse');
        pIdx++;
      } else {
        clearInterval(interval);
        // Commit tree state
        setRoot(prev => insertTreeNode(prev, val));
        setActiveNodeId(null);
        setTraceLog(`Successfully inserted node ${val} into tree structure.`);
        audioService.playValue(val, 10, 100, 'triangle', 0.14);
        setTimeout(() => {
          audioService.playStep('success');
        }, 80);
      }
    }, 400);
  };

  const handleDelete = () => {
    const targetVal = inputValue;
    setTraceLog(`Scanning tree for target node (${targetVal}) to delete...`);
    
    setRoot(prev => deleteTreeNode(prev, targetVal));
    setTraceLog(`Finished delete operations for node value ${targetVal}. Recalculated balance thresholds and child next links.`);
    audioService.playTone(280, 'triangle', 0.12, 0.1);
  };

  const handleSearch = () => {
    setVisitedNodes([]);
    setActiveNodeId(null);
    let curr = root;
    const path: { id: string; value: number }[] = [];

    while (curr !== null) {
      path.push({ id: curr.id, value: curr.value });
      if (searchTarget < curr.value) {
        curr = curr.left;
      } else if (searchTarget > curr.value) {
        curr = curr.right;
      } else {
        break;
      }
    }

    setTraceLog(`Searching BST for target value ${searchTarget}. Root path evaluation trace:`);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < path.length) {
        const item = path[idx];
        setActiveNodeId(item.id);
        setVisitedNodes(prev => [...prev, item.id]);
        
        audioService.playValue(item.value, 10, 100, 'triangle', 0.1);

        if (item.value === searchTarget) {
          setTraceLog(`Node MATCH! Successfully located target binary node ${searchTarget} in directory.`);
          audioService.playStep('success');
          clearInterval(interval);
          return;
        } else {
          setTraceLog(`Visited step node ${item.value} ... Moving directions.`);
        }
        idx++;
      } else {
        setTraceLog(`Search complete: target ${searchTarget} is NOT found in tree branches.`);
        setActiveNodeId(null);
        audioService.playTone(180, 'sine', 0.25, 0.1);
        clearInterval(interval);
      }
    }, 500);
  };

  // Traversals
  const runTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    const sequence: TreeNodeType[] = [];

    const inorder = (node: TreeNodeType | null) => {
      if (!node) return;
      inorder(node.left);
      sequence.push(node);
      inorder(node.right);
    };

    const preorder = (node: TreeNodeType | null) => {
      if (!node) return;
      sequence.push(node);
      preorder(node.left);
      preorder(node.right);
    };

    const postorder = (node: TreeNodeType | null) => {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      sequence.push(node);
    };

    if (type === 'inorder') inorder(root);
    else if (type === 'preorder') preorder(root);
    else postorder(root);

    setTraversalPrintout([]);
    setTraceLog(`Commencing ${type.toUpperCase()} traversal:`);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < sequence.length) {
        const item = sequence[idx];
        setActiveNodeId(item.id);
        setTraversalPrintout(prev => [...prev, item.value]);
        setTraceLog(`Step ${idx + 1}: Visited tree branch value ${item.value}`);
        audioService.playValue(item.value, 10, 100, 'sine', 0.08);
        idx++;
      } else {
        setActiveNodeId(null);
        setTraceLog(`${type.toUpperCase()} traversal executed completely: ${sequence.map(s => s.value).join(' -> ')}`);
        audioService.playStep('success');
        clearInterval(interval);
      }
    }, 605);
  };

  // Coordinate mapper recursive generator for visual layout rendering
  interface FlatNode {
    id: string;
    value: number;
    x: number;
    y: number;
    parentId: string | null;
  }

  const flattenTree = (
    node: TreeNodeType | null,
    x: number,
    y: number,
    widthRange: number,
    parentId: string | null,
    list: FlatNode[]
  ) => {
    if (!node) return;

    list.push({ id: node.id, value: node.value, x, y, parentId });

    // Divide child width range offsets
    const hortOffset = widthRange / 2;
    const vertOffset = 50;

    flattenTree(node.left, x - hortOffset, y + vertOffset, hortOffset, node.id, list);
    flattenTree(node.right, x + hortOffset, y + vertOffset, hortOffset, node.id, list);
  };

  const flatNodes: FlatNode[] = [];
  const containerWidth = 600;
  flattenTree(root, containerWidth / 2, 40, containerWidth / 4, null, flatNodes);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Configuration Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            id="tree-type-bst"
            onClick={() => setTreeType('bst')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              treeType === 'bst'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <GitFork className="w-4 h-4" />
            Standard BST
          </button>
          <button
            id="tree-type-avl"
            onClick={() => setTreeType('avl')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              treeType === 'avl'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <Layers className="w-4 h-4" />
            Self-balancing AVL
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Node Val:</span>
            <input
              id="tree-field-val"
              type="number"
              min="1"
              max="99"
              value={inputValue}
              onChange={(e) => setInputValue(Math.min(99, Math.max(1, Number(e.target.value))))}
              className="w-14 px-1.5 py-1 text-xs text-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 font-sans">Search target:</span>
            <input
              id="tree-field-search"
              type="number"
              min="1"
              max="99"
              value={searchTarget}
              onChange={(e) => setSearchTarget(Math.min(99, Math.max(1, Number(e.target.value))))}
              className="w-14 px-1.5 py-1 text-xs text-center border border-slate-200 dark:border-slate-705 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Main visual Canvas: SVG connecting lines and absolute positioning overlay */}
      <div id="tree-canvas-container" className="h-72 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl relative bg-slate-50/20 dark:bg-slate-900/10 overflow-auto flex items-center justify-center p-3">
        
        {root ? (
          <div className="relative w-[600px] h-[250px] shrink-0">
            {/* SVG Link lines behind node disks */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {flatNodes.map((n) => {
                if (n.parentId === null) return null;
                const parentNode = flatNodes.find((f) => f.id === n.parentId);
                if (!parentNode) return null;

                const isLineActive = visitedNodes.includes(n.id) && visitedNodes.includes(parentNode.id);

                return (
                  <line
                    id={`tree-line-${n.parentId}-to-${n.id}`}
                    key={n.id}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={isLineActive ? '#f59e0b' : '#cbd5e1'}
                    strokeWidth={isLineActive ? '3' : '1.5'}
                    className="transition-all duration-350"
                  />
                );
              })}
            </svg>

            {/* Flat rendered Node structures */}
            {flatNodes.map((n) => {
              const isActive = activeNodeId === n.id;
              const isVisited = visitedNodes.includes(n.id);

              let diskStyle = 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-800 dark:text-neutral-50';
              if (isActive) {
                diskStyle = 'bg-amber-400 border-amber-500 text-amber-950 font-black scale-110 shadow-md animate-bounce';
              } else if (isVisited) {
                diskStyle = 'bg-indigo-50 border-indigo-500 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-bold';
              }

              return (
                <div
                  id={`tree-node-${n.id}`}
                  key={n.id}
                  className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 text-xs font-mono flex items-center justify-center transition-all duration-350 select-none ${diskStyle}`}
                  style={{
                    left: `${n.x}px`,
                    top: `${n.y}px`
                  }}
                >
                  {n.value}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center font-mono text-slate-450 text-xs">
            No active nodes. Seed tree array or insert above.
          </div>
        )}
      </div>

      {/* Traversal sequence outputs */}
      {traversalPrintout.length > 0 && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
          <p className="text-[10px] uppercase font-black tracking-widest text-indigo-500 mb-1 leading-none">
            Traversal Sequence Printout:
          </p>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs font-extrabold text-indigo-650 dark:text-indigo-300">
            {traversalPrintout.map((val, idx) => (
              <span key={idx} className="bg-white dark:bg-slate-900/80 border border-indigo-150 p-1 rounded-md min-w-[24px] text-center">
                {val}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active terminal status */}
      <div className="p-3.5 bg-slate-950 text-emerald-450 rounded-xl font-mono text-xs leading-relaxed border border-slate-900 shadow-inner flex gap-2">
        <span className="text-slate-500 font-bold select-none border-r border-slate-850 pr-2">COMPUTE</span>
        <span className="flex-1">{traceLog}</span>
      </div>

      {/* CRUD Controls Panel Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Insert Node */}
          <button
            id="tree-btn-insert"
            onClick={handleInsert}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-600 hover:bg-indigo-707 text-white shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Insert Node
          </button>

          {/* Delete Node */}
          <button
            id="tree-btn-delete"
            onClick={handleDelete}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-rose-605 hover:bg-rose-700 text-white shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Node
          </button>

          {/* Search Node */}
          <button
            id="tree-btn-search"
            onClick={handleSearch}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            Search Tree
          </button>
        </div>

        {/* Traversal Activators */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="tree-btn-inorder"
            onClick={() => runTraversal('inorder')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Inorder
          </button>
          <button
            id="tree-btn-preorder"
            onClick={() => runTraversal('preorder')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Preorder
          </button>
          <button
            id="tree-btn-postorder"
            onClick={() => runTraversal('postorder')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Postorder
          </button>
          <button
            id="tree-btn-reset"
            onClick={handleInitializeSeed}
            className="p-2 ml-1 rounded-xl border border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 flex items-center justify-center"
            title="Reset to default initial list data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
