import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Shuffle, Check, Compass, Search, Zap, List } from 'lucide-react';
import { VizStep, AlgorithmInfo } from '../../types';
import { audioService } from '../../utils/audio';

interface SearchingVisualizerProps {
  currentAlgo: AlgorithmInfo;
  setSelectedAlgoId: (id: string) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  animationSteps: VizStep[];
  setAnimationSteps: (steps: VizStep[]) => void;
}

export default function SearchingVisualizer({
  currentAlgo,
  setSelectedAlgoId,
  currentStepIndex,
  setCurrentStepIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  animationSteps,
  setAnimationSteps
}: SearchingVisualizerProps) {
  const [array, setArray] = useState<number[]>([12, 17, 23, 32, 45, 54, 62, 70, 85, 91, 98]);
  const [target, setTarget] = useState<number>(62);
  const [customInput, setCustomInput] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [comparisons, setComparisons] = useState<number>(0);

  // Generate Steps when array, target, or algorithm id changes
  useEffect(() => {
    generateSearchSteps();
  }, [array, target, currentAlgo.id]);

  // Real-time Audio Melodic Sonification Feedbacks
  useEffect(() => {
    if (animationSteps.length === 0 || currentStepIndex <= 0 || currentStepIndex >= animationSteps.length) {
      return;
    }
    const step = animationSteps[currentStepIndex];
    if (!step) return;

    if (step.foundIndex !== undefined) {
      // High-register bell on match found
      audioService.playStep('success');
    } else if (step.compareIndexes && step.compareIndexes.length > 0) {
      const idx = step.compareIndexes[0];
      const val = step.array ? step.array[idx] : null;
      if (val !== null && val !== undefined) {
        audioService.playValue(val, 10, 100, 'triangle', 0.12);
      } else {
        audioService.playStep('compare');
      }
    } else if (currentStepIndex === animationSteps.length - 1) {
      // Low tone for search finished (unsuccessful)
      audioService.playTone(180, 'sine', 0.25, 0.1);
    }
  }, [currentStepIndex, animationSteps]);

  // Track Statistics
  useEffect(() => {
    if (animationSteps.length === 0 || currentStepIndex < 0) {
      setComparisons(0);
      return;
    }
    let compCount = 0;
    const maxStep = Math.min(currentStepIndex, animationSteps.length - 1);
    for (let i = 0; i <= maxStep; i++) {
      const s = animationSteps[i];
      if (s.compareIndexes && s.compareIndexes.length > 0) compCount++;
    }
    setComparisons(compCount);
  }, [currentStepIndex, animationSteps]);

  const generateRandomSortedArray = () => {
    const newArr: number[] = [];
    const size = 11;
    let base = Math.floor(Math.random() * 15) + 5;
    for (let i = 0; i < size; i++) {
      newArr.push(base);
      base += Math.floor(Math.random() * 12) + 4; // Ensures sorted ascending integers
    }
    setInputError('');
    setArray(newArr);
    // Picks a random element from the arrays as target
    const randomTargetIdx = Math.floor(Math.random() * size);
    setTarget(newArr[randomTargetIdx]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const parts = customInput.split(',').map(s => Number(s.trim()));
    const valid = parts.every(n => !isNaN(n) && n > 0 && n <= 150);

    if (parts.length < 5 || parts.length > 15) {
      setInputError('Please enter between 5 and 15 values.');
      return;
    }
    if (!valid) {
      setInputError('Values must be positive integers <= 150.');
      return;
    }

    // Sort ascending (required for Binary and Jump Search)
    const sortedParts = [...parts].sort((a, b) => a - b);
    setInputError('');
    setArray(sortedParts);
    // Reset target to one of the values or input default
    setTarget(sortedParts[Math.floor(sortedParts.length / 2)]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const generateSearchSteps = () => {
    const steps: VizStep[] = [];
    const n = array.length;

    steps.push({
      array: [...array],
      description: `Initial state: search array generated. Target value is ${target}.`,
      codeLine: 0
    });

    switch (currentAlgo.id) {
      case 'linear_search':
        linearSearchSim(array, target, steps);
        break;
      case 'binary_search':
        binarySearchSim(array, target, steps);
        break;
      case 'jump_search':
        jumpSearchSim(array, target, steps);
        break;
      case 'ternary_search':
        ternarySearchSim(array, target, steps);
        break;
      case 'exponential_search':
        exponentialSearchSim(array, target, steps);
        break;
      default:
        break;
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
  };

  // --- LINEAR SEARCH SIMULATION ---
  const linearSearchSim = (arr: number[], searchVal: number, steps: VizStep[]) => {
    const n = arr.length;
    const discarded: number[] = [];

    for (let i = 0; i < n; i++) {
      steps.push({
        array: [...arr],
        compareIndexes: [i],
        sortedIndexes: [...discarded],
        description: `Comparing cell index ${i} value (${arr[i]}) with search target (${searchVal}).`,
        codeLine: 2
      });

      if (arr[i] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: i,
          sortedIndexes: [...discarded],
          description: `MATCH detected at index ${i}! Target value ${searchVal} found.`,
          codeLine: 3
        });
        return;
      } else {
        discarded.push(i);
        steps.push({
          array: [...arr],
          sortedIndexes: [...discarded],
          description: `Element ${arr[i]} at index ${i} doesn't match the target. Discarding index.`,
          codeLine: 1
        });
      }
    }

    steps.push({
      array: [...arr],
      sortedIndexes: [...discarded],
      description: `Linear search complete. Target value ${searchVal} was NOT found in the array.`,
      codeLine: 4
    });
  };

  // --- BINARY SEARCH SIMULATION ---
  const binarySearchSim = (arr: number[], searchVal: number, steps: VizStep[]) => {
    let low = 0;
    let high = arr.length - 1;
    const discarded: number[] = [];

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      // Compute indices to gray out as discarded
      const currentDiscarded: number[] = [];
      for (let i = 0; i < arr.length; i++) {
        if (i < low || i > high) {
          currentDiscarded.push(i);
        }
      }

      steps.push({
        array: [...arr],
        compareIndexes: [mid],
        currentIndexes: [low, high], // highlight bounds
        sortedIndexes: currentDiscarded,
        description: `Narrowing bounds: Low index = ${low}, High index = ${high}. Compute Mid = ${mid} (value ${arr[mid]}).`,
        codeLine: 3
      });

      if (arr[mid] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: mid,
          sortedIndexes: currentDiscarded,
          description: `MATCH detected on middle index ${mid}! Target value ${searchVal} found.`,
          codeLine: 4
        });
        return;
      } else if (arr[mid] < searchVal) {
        low = mid + 1;
        steps.push({
          array: [...arr],
          currentIndexes: [mid],
          sortedIndexes: Array.from({ length: mid + 1 }, (_, k) => k),
          description: `Since mid value ${arr[mid]} < target ${searchVal}, target must lie in high half. Slide Low boundary to ${low}.`,
          codeLine: 5
        });
      } else {
        high = mid - 1;
        steps.push({
          array: [...arr],
          currentIndexes: [mid],
          sortedIndexes: Array.from({ length: arr.length - mid }, (_, k) => mid + k),
          description: `Since mid value ${arr[mid]} > target ${searchVal}, target must lie in lower half. Slide High boundary to ${high}.`,
          codeLine: 6
        });
      }
    }

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: arr.length }, (_, k) => k),
      description: `Binary search complete. Target ${searchVal} does NOT exist in this sorted array.`,
      codeLine: 7
    });
  };

  // --- JUMP SEARCH SIMULATION ---
  const jumpSearchSim = (arr: number[], searchVal: number, steps: VizStep[]) => {
    const n = arr.length;
    const stepSize = Math.floor(Math.sqrt(n));
    let prev = 0;
    let currentLimit = stepSize;

    steps.push({
      array: [...arr],
      description: `Calculating constant jump blocks. Jump step width = √${n} = ${stepSize} elements.`,
      codeLine: 1
    });

    while (arr[Math.min(currentLimit, n) - 1] < searchVal) {
      const checkedIdx = Math.min(currentLimit, n) - 1;
      
      steps.push({
        array: [...arr],
        compareIndexes: [checkedIdx],
        currentIndexes: [prev, checkedIdx],
        description: `Checking end of jump block (index ${checkedIdx}, value ${arr[checkedIdx]}). Since it is less than target ${searchVal}, jump forward!`,
        codeLine: 3
      });

      prev = currentLimit;
      currentLimit += stepSize;
      
      if (prev >= n) {
        steps.push({
          array: [...arr],
          sortedIndexes: Array.from({ length: n }, (_, k) => k),
          description: `Jump bounds crossed array boundary size (${n}). Target is not found in jump loops.`,
          codeLine: 6
        });
        return;
      }
    }

    // Perform linear search inside the block [prev, min(currentLimit, n)]
    const searchLimit = Math.min(currentLimit, n);
    steps.push({
      array: [...arr],
      currentIndexes: [prev, searchLimit - 1],
      description: `Found prospective block [indices ${prev} to ${searchLimit - 1}]. Commencing linear backtracking.`,
      codeLine: 7
    });

    for (let i = prev; i < searchLimit; i++) {
      steps.push({
        array: [...arr],
        compareIndexes: [i],
        description: `Linear Search check inside block: A[${i}] = ${arr[i]}.`,
        codeLine: 8
      });

      if (arr[i] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: i,
          description: `MATCH detected at index ${i}! Target ${searchVal} is successfully located.`,
          codeLine: 10
        });
        return;
      }
    }

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: n }, (_, k) => k),
      description: `Jump Search complete. Linear scan failed to find target ${searchVal}.`,
      codeLine: 11
    });
  };

  // --- TERNARY SEARCH SIMULATION ---
  const ternarySearchSim = (arr: number[], searchVal: number, steps: VizStep[]) => {
    let low = 0;
    let high = arr.length - 1;
    const n = arr.length;

    while (low <= high) {
      const mid1 = low + Math.floor((high - low) / 3);
      const mid2 = high - Math.floor((high - low) / 3);

      const currentDiscarded: number[] = [];
      for (let i = 0; i < n; i++) {
        if (i < low || i > high) {
          currentDiscarded.push(i);
        }
      }

      steps.push({
        array: [...arr],
        compareIndexes: [mid1, mid2],
        currentIndexes: [low, high],
        sortedIndexes: [...currentDiscarded],
        description: `Dividing search space [index ${low} to ${high}] into three segments. computed mid1 = ${mid1} (value ${arr[mid1]}), mid2 = ${mid2} (value ${arr[mid2]}).`,
        codeLine: 3
      });

      // Compare mid1
      steps.push({
        array: [...arr],
        compareIndexes: [mid1],
        currentIndexes: [low, high],
        sortedIndexes: [...currentDiscarded],
        description: `Checking if mid1 element A[${mid1}] (${arr[mid1]}) matches target (${searchVal}).`,
        codeLine: 5
      });

      if (arr[mid1] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: mid1,
          sortedIndexes: [...currentDiscarded],
          description: `MATCH found at mid1 index ${mid1}! Target ${searchVal} is located.`,
          codeLine: 5
        });
        return;
      }

      // Compare mid2
      steps.push({
        array: [...arr],
        compareIndexes: [mid2],
        currentIndexes: [low, high],
        sortedIndexes: [...currentDiscarded],
        description: `mid1 element did not match target. Now checking mid2 element A[${mid2}] (${arr[mid2]}) with target (${searchVal}).`,
        codeLine: 6
      });

      if (arr[mid2] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: mid2,
          sortedIndexes: [...currentDiscarded],
          description: `MATCH found at mid2 index ${mid2}! Target ${searchVal} is located.`,
          codeLine: 6
        });
        return;
      }

      // Narrow range
      if (searchVal < arr[mid1]) {
        high = mid1 - 1;
        const newDiscarded = [...currentDiscarded];
        for (let idx = mid1; idx < n; idx++) {
          if (!newDiscarded.includes(idx)) newDiscarded.push(idx);
        }
        steps.push({
          array: [...arr],
          sortedIndexes: newDiscarded,
          description: `Target ${searchVal} < A[mid1] (${arr[mid1]}). Search boundaries narrowed to left segment: indices [${low} to ${high}].`,
          codeLine: 7
        });
      } else if (searchVal > arr[mid2]) {
        low = mid2 + 1;
        const newDiscarded = [...currentDiscarded];
        for (let idx = 0; idx <= mid2; idx++) {
          if (!newDiscarded.includes(idx)) newDiscarded.push(idx);
        }
        steps.push({
          array: [...arr],
          sortedIndexes: newDiscarded,
          description: `Target ${searchVal} > A[mid2] (${arr[mid2]}). Search boundaries narrowed to right segment: indices [${low} to ${high}].`,
          codeLine: 8
        });
      } else {
        low = mid1 + 1;
        high = mid2 - 1;
        const newDiscarded = [...currentDiscarded];
        for (let idx = 0; idx < n; idx++) {
          if (idx <= mid1 || idx >= mid2) {
            if (!newDiscarded.includes(idx)) newDiscarded.push(idx);
          }
        }
        steps.push({
          array: [...arr],
          sortedIndexes: newDiscarded,
          description: `Target ${searchVal} lies between A[mid1] (${arr[mid1]}) and A[mid2] (${arr[mid2]}). Range narrowed to the middle segment: indices [${low} to ${high}].`,
          codeLine: 9
        });
      }
    }

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: n }, (_, k) => k),
      description: `Ternary Search complete. Target ${searchVal} does NOT exist in the array.`,
      codeLine: 10
    });
  };

  // --- EXPONENTIAL SEARCH SIMULATION ---
  const exponentialSearchSim = (arr: number[], searchVal: number, steps: VizStep[]) => {
    const n = arr.length;
    
    steps.push({
      array: [...arr],
      compareIndexes: [0],
      description: `Step 1: Checking base index 0 element structure (A[0] = ${arr[0]}).`,
      codeLine: 1
    });

    if (arr[0] === searchVal) {
      steps.push({
        array: [...arr],
        foundIndex: 0,
        description: `MATCH detected on initial boundary index 0! target ${searchVal} is solved.`,
        codeLine: 1
      });
      return;
    }

    let i = 1;
    while (i < n && arr[i] <= searchVal) {
      steps.push({
        array: [...arr],
        compareIndexes: [i],
        description: `Jump bounds doubling phase: A[${i}] = ${arr[i]} is <= target ${searchVal}. Doubling step index...`,
        codeLine: 3
      });

      if (arr[i] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: i,
          description: `MATCH detected at index ${i} during boundary doubling checks!`,
          codeLine: 3
        });
        return;
      }

      i = i * 2;
    }

    const low = Math.floor(i / 2);
    const high = Math.min(i, n - 1);
    
    const discarded: number[] = [];
    for (let idx = 0; idx < n; idx++) {
      if (idx < low || idx > high) {
        discarded.push(idx);
      }
    }

    steps.push({
      array: [...arr],
      currentIndexes: [low, high],
      sortedIndexes: [...discarded],
      description: `Bounded range for Binary Search found: indices [${low} to ${high}]. All other regions are safely discarded.`,
      codeLine: 5
    });

    // Subarray Binary Search Phase
    let bLow = low;
    let bHigh = high;
    while (bLow <= bHigh) {
      const mid = Math.floor((bLow + bHigh) / 2);
      const currDiscarded: number[] = [];
      for (let idx = 0; idx < n; idx++) {
        if (idx < bLow || idx > bHigh) {
          currDiscarded.push(idx);
        }
      }

      steps.push({
        array: [...arr],
        compareIndexes: [mid],
        currentIndexes: [bLow, bHigh],
        sortedIndexes: currDiscarded,
        description: `[Binary Search Phase] Checking mid index ${mid}, value is ${arr[mid]}. Bounds are [${bLow} to ${bHigh}].`,
        codeLine: 5
      });

      if (arr[mid] === searchVal) {
        steps.push({
          array: [...arr],
          foundIndex: mid,
          sortedIndexes: currDiscarded,
          description: `MATCH found! Target value ${searchVal} is located at index ${mid}.`,
          codeLine: 5
        });
        return;
      } else if (arr[mid] < searchVal) {
        bLow = mid + 1;
        const newD = [...currDiscarded];
        for (let idx = low; idx <= mid; idx++) {
          if (!newD.includes(idx)) newD.push(idx);
        }
        steps.push({
          array: [...arr],
          sortedIndexes: newD,
          description: `Value ${arr[mid]} < target ${searchVal}. Narrowing binary search space to upper half [${bLow} to ${bHigh}].`,
          codeLine: 5
        });
      } else {
        bHigh = mid - 1;
        const newD = [...currDiscarded];
        for (let idx = mid; idx <= high; idx++) {
          if (!newD.includes(idx)) newD.push(idx);
        }
        steps.push({
          array: [...arr],
          sortedIndexes: newD,
          description: `Value ${arr[mid]} > target ${searchVal}. Narrowing binary search space to lower half [${bLow} to ${bHigh}].`,
          codeLine: 5
        });
      }
    }

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: n }, (_, k) => k),
      description: `Exponential search complete. Binary segment scan failed to find target ${searchVal}.`,
      codeLine: 5
    });
  };

  const getCellColor = (index: number) => {
    const step = animationSteps[currentStepIndex];
    if (!step) return 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';

    if (step.foundIndex === index) {
      return 'bg-emerald-500 border-emerald-600 text-white font-black scale-105 shadow-md shadow-emerald-500/20';
    }
    if (step.compareIndexes?.includes(index)) {
      return 'bg-yellow-400 border-yellow-500 text-yellow-950 font-bold scale-102 shadow-sm animate-pulse';
    }
    if (step.currentIndexes?.includes(index)) {
      return 'bg-indigo-550 border-indigo-650 text-white font-semibold scale-102';
    }
    if (step.sortedIndexes?.includes(index)) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800/40 opacity-50';
    }
    return 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50';
  };

  const activeStep = animationSteps[currentStepIndex] || { array, description: 'Prepare search array' };
  const displayArray = activeStep.array || array;

  const searchingAlgosList = [
    { id: 'linear_search', name: 'Linear Search', avgCase: 'O(n)', desc: 'Sequential scanning', icon: List, hoverColor: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/30' },
    { id: 'binary_search', name: 'Binary Search', avgCase: 'O(log n)', desc: 'Divide & conquer', icon: Search, hoverColor: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/30' },
    { id: 'jump_search', name: 'Jump Search', avgCase: 'O(√n)', desc: 'Jump-step blocks', icon: Compass, hoverColor: 'hover:border-sky-500/40 dark:hover:border-sky-500/30' },
    { id: 'ternary_search', name: 'Ternary Search', avgCase: 'O(log₃ n)', desc: 'Three-way partitioning', icon: Zap, hoverColor: 'hover:border-amber-500/40 dark:hover:border-amber-500/30' },
    { id: 'exponential_search', name: 'Exponential Search', avgCase: 'O(log i)', desc: 'Bounded range doubling', icon: Play, hoverColor: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/30' }
  ];

  return (
    <div className="space-y-6">
      {/* Searching Algorithms Interactive Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100 flex items-center gap-1.5 leading-snug">
              <Search className="w-4.5 h-4.5 text-indigo-550 dark:text-indigo-405" />
              <span>Searching Algorithms Hub</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Select an algorithm below to load its dynamic trace context, custom array limits, and real-time step visualization.
            </p>
          </div>
          <span className="shrink-0 text-[10px] bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold uppercase py-1 px-2.5 rounded-lg leading-none border dark:border-slate-800/80">
            {searchingAlgosList.length} Models Loaded
          </span>
        </div>

        {/* Responsive Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {searchingAlgosList.map((algo) => {
            const isSelected = currentAlgo.id === algo.id;
            const IconComp = algo.icon;
            return (
              <button
                id={`search-hub-card-${algo.id}`}
                key={algo.id}
                type="button"
                onClick={() => {
                  setSelectedAlgoId(algo.id);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between h-24 cursor-pointer relative overflow-hidden group select-none ${
                  isSelected
                    ? 'bg-indigo-55/40 dark:bg-indigo-950/20 border-indigo-550 dark:border-indigo-505 shadow-xs ring-1 ring-indigo-550/20'
                    : `bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/85 hover:bg-slate-50 dark:hover:bg-slate-800/25 ${algo.hoverColor}`
                }`}
              >
                <div className="flex items-start justify-between gap-1 w-full relative z-10">
                  <div className={`p-1.5 rounded-lg ${
                    isSelected 
                      ? 'bg-indigo-125 dark:bg-indigo-925 text-indigo-600 dark:text-indigo-400' 
                      : 'bg-slate-100 dark:bg-slate-805 text-slate-500 dark:text-slate-400 group-hover:scale-105 transition-transform'
                  }`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider leading-none select-none ${
                    isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-305'
                      : 'bg-slate-150/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {algo.avgCase}
                  </span>
                </div>
                
                <div className="pt-2 relative z-10">
                  <p className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-indigo-705 dark:text-indigo-300 font-extrabold' : 'text-slate-750 dark:text-slate-200'
                  }`}>
                    {algo.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {algo.desc}
                  </p>
                </div>

                {/* Subtle highlight bar on selection */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-550 dark:bg-indigo-505 rounded-l-xl" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Search Input Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Random Generation Button */}
          <button
            id="search-btn-generate"
            onClick={generateRandomSortedArray}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-705 dark:text-slate-350 transition-all min-h-[40px] shadow-sm"
          >
            <Shuffle className="w-4 h-4" />
            Random Sorted Array
          </button>

          {/* Quick Target Select dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 min-h-[40px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target:</span>
            <select
              id="search-select-target"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-indigo-650 dark:text-indigo-400 outline-none pr-2 cursor-pointer"
            >
              <option value={999}>999 (Not Found Case)</option>
              {array.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomInputSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              id="search-custom-values"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 20, 35, 50, 75, 90"
              className="w-full sm:w-56 px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-707 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 dark:text-neutral-50 pr-8"
            />
            {customInput.length > 0 && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                title="Apply Custom Array"
              >
                <Check className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="hidden sm:inline text-[10px] text-slate-450 dark:text-slate-500">
            (Sorted on load)
          </span>
        </form>
      </div>

      {inputError && (
        <p className="text-xs text-rose-500 flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-950">
          ⚠️ {inputError}
        </p>
      )}

      {/* Grid Of Array Columns Visualizer */}
      <div className="block py-6">
        <div className="flex flex-wrap items-center justify-center gap-3 select-none">
          {displayArray.map((val, idx) => {
            const styleClass = getCellColor(idx);
            return (
              <div
                id={`search-item-${idx}`}
                key={idx}
                className={`w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-xl border-2 font-mono transition-all duration-300 ${styleClass}`}
              >
                <span className="text-sm md:text-base font-extrabold">{val}</span>
                <span className="text-[9px] font-bold opacity-60 mt-0.5">idx {idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Description Trace */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-805 text-xs md:text-sm text-slate-700 dark:text-slate-300 italic flex items-start gap-2.5">
        <span className="text-indigo-505 font-bold uppercase tracking-wider text-[10px] bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded leading-none shrink-0 mt-0.5">
          Step Explain
        </span>
        <span className="leading-snug">{activeStep.description}</span>
      </div>

      {/* Run Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Target Value</p>
          <p className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1.5">{target}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Target Checks</p>
          <p className="text-xl font-mono font-bold text-slate-850 dark:text-slate-100 mt-1.5">{comparisons}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Scanning Frames</p>
          <p className="text-xl font-mono font-bold text-slate-800 dark:text-slate-100 mt-1.5">
            {currentStepIndex + 1} <span className="text-xs text-slate-400">/ {animationSteps.length || 1}</span>
          </p>
        </div>
        <div className="text-center md:text-left col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Speed Multiplier</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-500 font-bold select-none">[ {speed}ms / {speed * 1000}μs ]</span>
            <input
              id="search-speed-slider"
              type="range"
              min="10"
              max="1500"
              step="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              title="Drag to change animation processing speed"
            />
          </div>
        </div>
      </div>

      {/* Bottom Main Controller Toolbar */}
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          {/* Back Step */}
          <button
            id="search-btn-prev"
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Step Backward"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>

          {/* Play/Pause */}
          <button
            id="search-btn-play-pause"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white transition-all shadow-md shadow-indigo-500/20"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Search
              </>
            )}
          </button>

          {/* Forward Step */}
          <button
            id="search-btn-next"
            onClick={() => setCurrentStepIndex(prev => Math.min(animationSteps.length - 1, prev + 1))}
            disabled={currentStepIndex === animationSteps.length - 1}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Reset */}
        <button
          id="search-btn-reset"
          onClick={() => {
            setCurrentStepIndex(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-650 dark:text-slate-400 transition-colors min-h-[40px]"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Trace
        </button>
      </div>
    </div>
  </div>
  );
}
