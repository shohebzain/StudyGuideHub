import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Search, Compass, RefreshCw } from 'lucide-react';
import { audioService } from '../../utils/audio';

// Character trie branch node definition
interface TrieNodeVisual {
  char: string;
  isWord: boolean;
  id: string;
  children: { [key: string]: TrieNodeVisual };
}

export default function HeapTrieVisualizer() {
  const [activeTab, setActiveTab] = useState<'heap' | 'trie'>('heap');
  const [heapType, setHeapType] = useState<'min' | 'max'>('max');
  const [heapArray, setHeapArray] = useState<number[]>([90, 70, 80, 40, 50, 60, 30]);
  const [trieRoot, setTrieRoot] = useState<TrieNodeVisual | null>(null);
  
  // Input fields
  const [heapValue, setHeapValue] = useState<number>(55);
  const [trieWord, setTrieWord] = useState<string>('cat');
  
  // Animation tracer alerts
  const [activeHeapIdx, setActiveHeapIdx] = useState<number | null>(null);
  const [activeHeapIdx2, setActiveHeapIdx2] = useState<number | null>(null);
  const [trieHighlightIds, setTrieHighlightIds] = useState<string[]>([]);
  const [traceLog, setTraceLog] = useState<string>('Interact with the tabs above to visualize Heaps (synced 1D/Tree layouts) and Trie Prefix Trees.');
  
  useEffect(() => {
    if (activeTab === 'trie' && !trieRoot) {
      handleSeedTrie();
    }
  }, [activeTab]);

  const handleSeedTrie = () => {
    let root: TrieNodeVisual = { char: 'ROOT', isWord: false, children: {}, id: 'trie-root' };
    
    // Seed standard prefixes
    const words = ['car', 'cat', 'dog', 'dots'];
    words.forEach(w => {
      insertTrieWord(root, w);
    });
    setTrieRoot(root);
    setTraceLog(`Initialized Trie tree with default words: ${words.join(', ')}.`);
  };

  const insertTrieWord = (root: TrieNodeVisual, word: string) => {
    let curr = root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        curr.children[char] = {
          char,
          isWord: false,
          children: {},
          id: `trie-${char}-${Math.floor(Math.random() * 9999)}`
        };
      }
      curr = curr.children[char];
    }
    curr.isWord = true;
  };

  const handleInsertHeap = () => {
    const val = heapValue || Math.floor(Math.random() * 90) + 10;
    if (heapArray.includes(val)) {
      setTraceLog(`Heap alert: duplicate value ${val} already exists.`);
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }

    const nextArr = [...heapArray, val];
    setHeapArray(nextArr);
    setTraceLog(`Inserted ${val} at index ${nextArr.length - 1} (complete tree leaf). Commencing Up-Heap / bubbleUp heapify...`);
    audioService.playValue(val, 10, 100, 'triangle', 0.12);

    // Bubble up heapify animation
    let i = nextArr.length - 1;
    let tick = 1;

    const interval = setInterval(() => {
      const parent = Math.floor((i - 1) / 2);
      if (i > 0) {
        setActiveHeapIdx(i);
        setActiveHeapIdx2(parent);
        
        let violate = false;
        if (heapType === 'max' && nextArr[i] > nextArr[parent]) violate = true;
        if (heapType === 'min' && nextArr[i] < nextArr[parent]) violate = true;

        if (violate) {
          setTraceLog(`Swap index ${i} (${nextArr[i]}) and parent index ${parent} (${nextArr[parent]}) to restore heap safety.`);
          const temp = nextArr[i];
          nextArr[i] = nextArr[parent];
          nextArr[parent] = temp;
          setHeapArray([...nextArr]);
          audioService.playStep('swap');
          i = parent;
        } else {
          setTraceLog(`Heap safety restored at level i=${i}. Bubble-Up completes successful heapify.`);
          audioService.playStep('success');
          clearInterval(interval);
          setActiveHeapIdx(null);
          setActiveHeapIdx2(null);
        }
      } else {
        setTraceLog(`Heapify completed. Root level reached.`);
        audioService.playStep('success');
        clearInterval(interval);
        setActiveHeapIdx(null);
        setActiveHeapIdx2(null);
      }
      tick++;
    }, 700);
  };

  const handleExtractHeapRoot = () => {
    if (heapArray.length === 0) {
      setTraceLog('Heap Underflow! Cannot extract root.');
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }
    const val = heapArray[0];
    const nextArr = [...heapArray];
    const lastVal = nextArr.pop()!;
    
    if (nextArr.length === 0) {
      setHeapArray([]);
      setTraceLog(`Extracted sole heap root value ${val}.`);
      audioService.playTone(280, 'triangle', 0.12, 0.1);
      return;
    }

    nextArr[0] = lastVal;
    setHeapArray([...nextArr]);
    setTraceLog(`Extracted max root value (${val}). Placed last leaf node (${lastVal}) at indices 0. Running Down-Heap / sinkDown heapify...`);
    audioService.playTone(280, 'triangle', 0.13, 0.1);

    let i = 0;
    const interval = setInterval(() => {
      const n = nextArr.length;
      let targetIdx = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        if (heapType === 'max' && nextArr[left] > nextArr[targetIdx]) targetIdx = left;
        if (heapType === 'min' && nextArr[left] < nextArr[targetIdx]) targetIdx = left;
      }
      if (right < n) {
        if (heapType === 'max' && nextArr[right] > nextArr[targetIdx]) targetIdx = right;
        if (heapType === 'min' && nextArr[right] < nextArr[targetIdx]) targetIdx = right;
      }

      if (targetIdx !== i) {
        setActiveHeapIdx(i);
        setActiveHeapIdx2(targetIdx);
        setTraceLog(`Heap violation: Swap index ${i} (${nextArr[i]}) with largest child index ${targetIdx} (${nextArr[targetIdx]}).`);
        
        const temp = nextArr[i];
        nextArr[i] = nextArr[targetIdx];
        nextArr[targetIdx] = temp;
        setHeapArray([...nextArr]);
        audioService.playStep('swap');
        i = targetIdx;
      } else {
        setTraceLog(`Max-Heap safety resolved successfully.`);
        audioService.playStep('success');
        clearInterval(interval);
        setActiveHeapIdx(null);
        setActiveHeapIdx2(null);
      }
    }, 750);
  };

  // Trie word inserter trigger
  const handleInsertTrie = () => {
    if (!trieWord.trim()) return;
    const word = trieWord.toLowerCase().trim();
    if (!trieRoot) return;

    let rootCopy = { ...trieRoot };
    insertTrieWord(rootCopy, word);
    setTrieRoot(rootCopy);
    setTraceLog(`Successfully inserted word "${word}" into Trie character paths.`);
    audioService.playStep('success');
  };

  const handleSearchTrie = () => {
    if (!trieWord.trim() || !trieRoot) return;
    const word = trieWord.toLowerCase().trim();
    setTraceLog(`Prefix-searching Trie branches for word: "${word}"...`);
    setTrieHighlightIds([]);

    let curr = trieRoot;
    const ids: string[] = [];
    let match = true;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (curr.children[char]) {
        curr = curr.children[char];
        ids.push(curr.id);
      } else {
        match = false;
        break;
      }
    }

    let searchIdx = 0;
    const interval = setInterval(() => {
      if (searchIdx < ids.length) {
        setTrieHighlightIds(prev => [...prev, ids[searchIdx]]);
        audioService.playTone(220 + searchIdx * 80, 'sine', 0.12, 0.12);
        searchIdx++;
      } else {
        clearInterval(interval);
        if (match && curr.isWord) {
          setTraceLog(`EXACT Word MATCH! Word "${word}" successfully located in Trie ending path.`);
          audioService.playStep('success');
        } else if (match) {
          setTraceLog(`PREFIX MATCH! Prefix "${word}" is valid, but is not registered as a separate word endpoint.`);
          audioService.playTone(523.25, 'sine', 0.15, 0.12);
          setTimeout(() => {
            audioService.playTone(659.25, 'sine', 0.2, 0.12);
          }, 50);
        } else {
          setTrieHighlightIds([]);
          setTraceLog(`NOT FOUND! Character layout sequences are not mapping word path prefix "${word}".`);
          audioService.playTone(180, 'sine', 0.25, 0.1);
        }
      }
    }, 450);
  };

  const handleReset = () => {
    if (activeTab === 'heap') {
      setHeapArray([90, 70, 80, 40, 50, 60, 30]);
      setActiveHeapIdx(null);
      setActiveHeapIdx2(null);
      setTraceLog('Heap arrays reset to standard Max-Heap values.');
    } else {
      handleSeedTrie();
      setTrieHighlightIds([]);
    }
  };

  // Trie tree node visual flattener helper
  interface FlatTrieNode {
    id: string;
    char: string;
    x: number;
    y: number;
    isWord: boolean;
    parentId: string | null;
  }

  const flattenTrie = (
    node: TrieNodeVisual,
    x: number,
    y: number,
    widthRange: number,
    parentId: string | null,
    list: FlatTrieNode[]
  ) => {
    list.push({ id: node.id, char: node.char, x, y, isWord: node.isWord, parentId });

    const keys = Object.keys(node.children);
    if (keys.length === 0) return;

    const spacing = widthRange / keys.length;
    let startX = x - (widthRange / 2) + (spacing / 2);

    keys.forEach((k) => {
      flattenTrie(node.children[k], startX, y + 42, spacing, node.id, list);
      startX += spacing;
    });
  };

  const flatTrieNodes: FlatTrieNode[] = [];
  if (trieRoot) {
    flattenTrie(trieRoot, 280, 25, 450, null, flatTrieNodes);
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Tabs list */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            id="tab-heap"
            onClick={() => setActiveTab('heap')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'heap'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            Min/Max Binary Heap
          </button>
          <button
            id="tab-trie"
            onClick={() => setActiveTab('trie')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'trie'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            Trie prefix block
          </button>
        </div>

        {activeTab === 'heap' ? (
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-lg">
            <button
              id="heap-type-max"
              onClick={() => {
                setHeapType('max');
                setHeapArray([90, 70, 80, 40, 50, 60, 30]);
              }}
              className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                heapType === 'max' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Max Heap
            </button>
            <button
              id="heap-type-min"
              onClick={() => {
                setHeapType('min');
                setHeapArray([10, 30, 20, 70, 50, 60, 40]);
              }}
              className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                heapType === 'min' ? 'bg-indigo-650 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Min Heap
            </button>
          </div>
        ) : null}
      </div>

      {/* Main interactive panel view */}
      {activeTab === 'heap' ? (
        /* HEAP INTERACTION SITES */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Array visualization representation row */}
            <div className="border border-slate-150 dark:border-slate-805 bg-slate-50/40 p-4 rounded-xl">
              <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-3 block">
                1D Array Heap Mapping [ Index layout ]
              </h5>
              <div className="flex flex-wrap gap-2">
                {heapArray.map((val, idx) => {
                  const isActive = activeHeapIdx === idx || activeHeapIdx2 === idx;
                  return (
                    <div
                      id={`heap-arr-${idx}`}
                      key={idx}
                      className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg border-2 font-mono transition-all duration-300 ${
                        isActive
                          ? 'bg-amber-400 border-amber-500 text-amber-950 font-extrabold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800'
                      }`}
                    >
                      <span className="text-sm font-bold">{val}</span>
                      <span className="text-[8px] opacity-60">i {idx}</span>
                    </div>
                  );
                })}
                {heapArray.length === 0 && <span className="text-xs text-slate-400">Empty Heap Array</span>}
              </div>
            </div>

            {/* Tree Coordinates mappings */}
            <div className="border border-slate-150 dark:border-slate-805 bg-slate-50/40 p-4 rounded-xl h-60 relative overflow-y-auto">
              <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-3">
                Complete Binary Tree visual layout
              </h5>

              {heapArray.length > 0 ? (
                <div className="relative w-full h-[180px] scale-95 origin-top shrink-0">
                  {/* Dynamic connect lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {heapArray.map((_, idx) => {
                      if (idx === 0) return null;
                      const parent = Math.floor((idx - 1) / 2);
                      const parentCoords = calculateHeapNodeCoords(parent, heapArray.length);
                      const childCoords = calculateHeapNodeCoords(idx, heapArray.length);
                      const isActive = (activeHeapIdx === idx && activeHeapIdx2 === parent) || 
                                       (activeHeapIdx2 === idx && activeHeapIdx === parent);

                      return (
                        <line
                          id={`heap-line-${parent}-to-${idx}`}
                          key={idx}
                          x1={parentCoords.x}
                          y1={parentCoords.y}
                          x2={childCoords.x}
                          y2={childCoords.y}
                          stroke={isActive ? '#f59e0b' : '#cbd5e1'}
                          strokeWidth={isActive ? '3' : '1.5'}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>

                  {/* Draw circular items nodes */}
                  {heapArray.map((val, idx) => {
                    const coords = calculateHeapNodeCoords(idx, heapArray.length);
                    const isActive = activeHeapIdx === idx || activeHeapIdx2 === idx;

                    return (
                      <div
                        id={`heap-node-${idx}`}
                        key={idx}
                        className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 text-xs font-mono font-bold flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-amber-400 border-amber-500 text-amber-950 scale-105'
                            : 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-650 text-slate-800'
                        }`}
                        style={{
                          left: `${coords.x}%`,
                          top: `${coords.y}px`
                        }}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        /* TRIE WORD PREFIX PLACEMENTS */
        <div className="space-y-6">
          <div className="h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl relative bg-slate-50/20 dark:bg-slate-900/10 overflow-auto flex items-center justify-center py-2 px-6">
            {trieRoot ? (
              <div className="relative w-[560px] h-[220px] shrink-0">
                {/* SVG connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {flatTrieNodes.map((n) => {
                    if (n.parentId === null) return null;
                    const parentNode = flatTrieNodes.find((f) => f.id === n.parentId);
                    if (!parentNode) return null;

                    const isLineActive = trieHighlightIds.includes(n.id);

                    return (
                      <line
                        id={`trie-line-${n.parentId}-to-${n.id}`}
                        key={n.id}
                        x1={parentNode.x}
                        y1={parentNode.y}
                        x2={n.x}
                        y2={n.y}
                        stroke={isLineActive ? '#f59e0b' : '#cbd5e1'}
                        strokeWidth={isLineActive ? '3' : '1.5'}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* Flat word characters nodes */}
                {flatTrieNodes.map((n) => {
                  const isHighlighted = trieHighlightIds.includes(n.id);
                  let nodeStyle = 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100';
                  if (isHighlighted) {
                    nodeStyle = 'bg-amber-400 border-amber-500 text-amber-950 font-black scale-102';
                  } else if (n.isWord) {
                    nodeStyle = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-650 dark:text-emerald-400 font-bold';
                  }

                  return (
                    <div
                      id={`trie-node-${n.id}`}
                      key={n.id}
                      className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-md border text-[11px] font-bold flex flex-col items-center justify-center transition-all duration-350 select-none ${nodeStyle}`}
                      style={{
                        left: `${n.x}px`,
                        top: `${n.y}px`
                      }}
                      title={n.isWord ? 'Word completion node' : undefined}
                    >
                      {n.char}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Dynamic terminal log message */}
      <div className="p-3.5 bg-slate-950 text-emerald-450 rounded-xl font-mono text-xs leading-relaxed border border-slate-900 shadow-inner flex gap-2">
        <span className="text-slate-500 font-bold select-none border-r border-slate-800 pr-2">DIRECTORY</span>
        <span className="flex-1">{traceLog}</span>
      </div>

      {/* Dynamic controller toolbar inputs based on tab selected */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {activeTab === 'heap' ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 min-h-[40px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Input Val:</span>
              <input
                id="heap-input"
                type="number"
                value={heapValue}
                onChange={(e) => setHeapValue(Math.min(999, Math.max(1, Number(e.target.value))))}
                className="w-12 bg-transparent text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 outline-none text-center"
              />
            </div>

            <button
              id="heap-insert-btn"
              onClick={handleInsertHeap}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-650 hover:bg-indigo-705 text-white shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Insert Element
            </button>
            <button
              id="heap-extract-btn"
              onClick={handleExtractHeapRoot}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Extract Root
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 min-h-[40px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Word node:</span>
              <input
                id="trie-word-input"
                type="text"
                value={trieWord}
                onChange={(e) => setTrieWord(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
                className="w-20 bg-transparent text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 outline-none text-center"
                placeholder="cat"
                maxLength={8}
              />
            </div>

            <button
              id="trie-insert-btn"
              onClick={handleInsertTrie}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-650 hover:bg-indigo-705 text-white shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Insert word
            </button>
            <button
              id="trie-search-btn"
              onClick={handleSearchTrie}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Prefix Search
            </button>
          </div>
        )}

        <button
          id="visualizer-reset"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Tab
        </button>
      </div>
    </div>
  );
}

// Calculate complete heap tree visual alignment coordinates percentages
function calculateHeapNodeCoords(index: number, n: number) {
  if (index === 0) return { x: 50, y: 35 };

  // Determine tree depth level
  const depth = Math.floor(Math.log2(index + 1));
  const levelFirstIdx = Math.pow(2, depth) - 1;
  const levelOffset = index - levelFirstIdx;
  const nodesInLevel = Math.pow(2, depth);

  // Distribute x alignment percentages evenly inside depth space width bounds
  const xMultiplier = 100 / (nodesInLevel + 1);
  const x = (levelOffset + 1) * xMultiplier;
  const y = 35 + depth * 42;

  return { x, y };
}
