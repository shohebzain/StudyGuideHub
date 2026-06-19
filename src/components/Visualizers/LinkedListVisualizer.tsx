import React, { useState } from 'react';
import { Network, Plus, Trash2, Search, ArrowRightLeft, Eye, RefreshCw, Star } from 'lucide-react';
import { audioService } from '../../utils/audio';

interface LinkedNode {
  id: string;
  value: number;
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<LinkedNode[]>([
    { id: 'n1', value: 12 },
    { id: 'n2', value: 45 },
    { id: 'n3', value: 78 },
    { id: 'n4', value: 91 }
  ]);
  const [inputValue, setInputValue] = useState<number>(33);
  const [insertIndex, setInsertIndex] = useState<number>(0);
  const [searchTarget, setSearchTarget] = useState<number>(45);
  
  // Animation highlights
  const [activeNodeIdx, setActiveNodeIdx] = useState<number | null>(null);
  const [foundNodeIdx, setFoundNodeIdx] = useState<number | null>(null);
  const [traceLog, setTraceLog] = useState<string>('Linked List is active. Type a value below to push, delete, search, or reverse nodes.');

  const handleInsertHead = () => {
    const val = inputValue || Math.floor(Math.random() * 90) + 10;
    const newNode: LinkedNode = {
      id: `n-${Date.now()}`,
      value: val
    };
    setNodes(prev => [newNode, ...prev]);
    setTraceLog(`Inserted value ${val} at the Head. Adjusted Head pointer to point directly to the new node.`);
    audioService.playValue(val);
  };

  const handleInsertTail = () => {
    const val = inputValue || Math.floor(Math.random() * 90) + 10;
    const newNode: LinkedNode = {
      id: `n-${Date.now()}`,
      value: val
    };
    setNodes(prev => [...prev, newNode]);
    setTraceLog(`Inserted value ${val} at the Tail. Linked the previous tail node's "next" pointer to this new tail.`);
    audioService.playValue(val);
  };

  const handleInsertAtIndex = () => {
    const val = inputValue || Math.floor(Math.random() * 90) + 10;
    const idx = Math.min(nodes.length, Math.max(0, insertIndex));
    const newNode: LinkedNode = {
      id: `n-${Date.now()}`,
      value: val
    };
    
    const newNodes = [...nodes];
    newNodes.splice(idx, 0, newNode);
    setNodes(newNodes);
    setTraceLog(`Inserted value ${val} at index ${idx}. Directed node next to preceding node, and preceding node next to this node.`);
    audioService.playValue(val);
  };

  const handleDeleteNode = (valueToDelete: number) => {
    const index = nodes.findIndex(n => n.value === valueToDelete);
    if (index === -1) {
      setTraceLog(`Error! Value ${valueToDelete} was not found in the list.`);
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }

    const value = nodes[index].value;
    setNodes(prev => prev.filter((_, idx) => idx !== index));
    setTraceLog(`Deleted node containing value ${value} at index ${index}. Linked preceding node's next pointer directly to target's next node to bypass it.`);
    audioService.playTone(280, 'triangle', 0.12, 0.1);
  };

  const handleSearchNode = () => {
    setFoundNodeIdx(null);
    let currentIdx = 0;

    setTraceLog(`Searching for target value ${searchTarget}. Commencing from Head pointer.`);

    const interval = setInterval(() => {
      if (currentIdx >= nodes.length) {
        setTraceLog(`Search complete! Visited entire list but target value ${searchTarget} was NOT found.`);
        setActiveNodeIdx(null);
        audioService.playTone(180, 'sine', 0.25, 0.1);
        clearInterval(interval);
        return;
      }

      setActiveNodeIdx(currentIdx);
      const val = nodes[currentIdx].value;
      audioService.playValue(val, 10, 100, 'triangle', 0.1);

      if (val === searchTarget) {
        setFoundNodeIdx(currentIdx);
        setTraceLog(`MATCH detected! Successfully located target value ${searchTarget} at block index ${currentIdx}.`);
        audioService.playStep('success');
        clearInterval(interval);
        return;
      } else {
        setTraceLog(`Visiting index ${currentIdx} (value ${val}). Not matching. Trailing next pointer.`);
      }

      currentIdx++;
    }, 600);
  };

  const handleReverseList = () => {
    setTraceLog('Executing pointer reversal: curr.next is swapped backwards with prev iteratively.');
    let stepCount = 0;
    
    const interval = setInterval(() => {
      if (stepCount >= nodes.length) {
        setNodes(prev => [...prev].reverse());
        setActiveNodeIdx(null);
        setTraceLog('Reversal Complete! All next arrows flipped. Adjusted Head pointer to the final node.');
        audioService.playStep('success');
        clearInterval(interval);
        return;
      }
      setActiveNodeIdx(stepCount);
      const val = nodes[stepCount]?.value;
      if (val !== undefined) {
        audioService.playValue(val, 10, 100, 'sine', 0.08);
      }
      stepCount++;
    }, 400);
  };

  const handleReset = () => {
    setNodes([
      { id: 'n1', value: 12 },
      { id: 'n2', value: 45 },
      { id: 'n3', value: 78 },
      { id: 'n4', value: 91 }
    ]);
    setActiveNodeIdx(null);
    setFoundNodeIdx(null);
    setTraceLog('Linked list reset to standard initial layout.');
    audioService.playStep('compare');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Upper toolbar parameters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Node Int Value:</span>
          <input
            id="node-input-val"
            type="number"
            min="1"
            max="999"
            value={inputValue}
            onChange={(e) => setInputValue(Math.min(999, Math.max(1, Number(e.target.value))))}
            className="w-16 px-1.5 py-1 text-xs text-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-mono font-bold"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Insert Index:</span>
            <input
              id="node-insert-index"
              type="number"
              min="0"
              max={nodes.length}
              value={insertIndex}
              onChange={(e) => setInsertIndex(Math.min(nodes.length, Math.max(0, Number(e.target.value))))}
              className="w-14 px-1 py-1 text-xs text-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white"
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Valid: 0 to {nodes.length}</span>
        </div>
      </div>

      {/* Main Container visual display */}
      <div className="h-48 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center relative bg-slate-50/25 dark:bg-slate-900/10 overflow-x-auto px-6">
        
        <div className="flex items-center gap-2 select-none min-w-max">
          {/* Head Label pointer flag */}
          <div className="flex flex-col items-center mr-4">
            <span className="text-[9px] uppercase font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-950">
              Head
            </span>
            <span className="text-slate-400 font-extrabold text-xs">⬇</span>
          </div>

          {nodes.map((n, idx) => {
            const isActive = activeNodeIdx === idx;
            const isFound = foundNodeIdx === idx;
            
            return (
              <React.Fragment key={n.id}>
                <div
                  id={`link-node-${idx}`}
                  className={`flex items-stretch rounded-xl border-2 shadow-sm transition-all duration-300 min-h-[50px] overflow-hidden ${
                    isFound
                      ? 'bg-emerald-500 border-emerald-600 text-white font-extrabold scale-105 shadow-md shadow-emerald-505/20'
                      : isActive
                      ? 'bg-amber-400 border-amber-500 text-amber-950 font-bold scale-102 animate-pulse'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {/* Left part: Value field */}
                  <div className="flex flex-col justify-center items-center px-4 py-2 bg-transparent select-all font-mono">
                    <span className="text-base font-black">{n.value}</span>
                    <span className="text-[8px] opacity-60">idx {idx}</span>
                  </div>

                  {/* Right part: pointer next reference block */}
                  <div className="border-l border-slate-200 dark:border-slate-800/80 px-2.5 bg-slate-50/60 dark:bg-slate-800/20 flex flex-col items-center justify-center font-mono text-[9px] tracking-tight opacity-80 shrink-0">
                    <span className="text-[7px] uppercase font-bold text-indigo-400">Next</span>
                    <span>{idx === nodes.length - 1 ? 'NULL' : `ptr➔`}</span>
                  </div>
                </div>

                {/* Arrow visual from custom code */}
                {idx < nodes.length - 1 && (
                  <div className="text-xl font-bold text-slate-350 dark:text-slate-700 mx-1 flex flex-col items-center">
                    <span className="animate-pulse">➔</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {nodes.length === 0 && (
            <div className="text-center font-mono text-slate-400 text-xs">
              <Network className="w-6 h-6 stroke-1 px-1 opacity-70 mb-1 mx-auto" />
              Empty List (Head points to NULL)
            </div>
          )}
        </div>
      </div>

      {/* Traversal console log */}
      <div className="p-3.5 bg-slate-950 text-emerald-450 rounded-xl font-mono text-xs leading-relaxed border border-slate-900 shadow-inner flex gap-2">
        <span className="text-slate-500 font-bold select-none border-r border-slate-850 pr-2">POINTER</span>
        <span className="flex-1">{traceLog}</span>
      </div>

      {/* CRUD Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Insert Head */}
          <button
            id="link-btn-insert-head"
            onClick={handleInsertHead}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            At Head
          </button>

          {/* Insert Tail */}
          <button
            id="link-btn-insert-tail"
            onClick={handleInsertTail}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            At Tail
          </button>

          {/* Insert Index */}
          <button
            id="link-btn-insert-idx"
            onClick={handleInsertAtIndex}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Insert Index
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 bg-white dark:bg-slate-900 min-h-[40px]">
            <input
              id="link-search-target"
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(Number(e.target.value))}
              className="w-12 bg-transparent text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 outline-none text-center"
              placeholder="Val"
            />
            <button
              id="link-btn-search"
              onClick={handleSearchNode}
              className="p-1 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 hover:scale-105 transition-all"
              title="Search Item"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Reverse */}
          <button
            id="link-btn-reverse"
            onClick={handleReverseList}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Reverse pointers
          </button>

          {/* Reset */}
          <button
            id="link-btn-reset"
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 flex items-center justify-center"
            title="Reset to default initial list data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
