import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Shuffle, Database, Check, Layers, Target, ListOrdered, GitMerge, Zap } from 'lucide-react';
import { VizStep, AlgorithmInfo } from '../../types';
import { audioService } from '../../utils/audio';

interface SortingVisualizerProps {
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

export default function SortingVisualizer({
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
}: SortingVisualizerProps) {
  const [array, setArray] = useState<number[]>([45, 12, 85, 32, 9, 70, 54, 23, 62, 17]);
  const [customInput, setCustomInput] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);

  // Generate Steps whenever array or algorithm changes
  useEffect(() => {
    generateSteps();
  }, [array, currentAlgo.id]);

  // Real-time Audio Melodic Sonification Feedbacks
  useEffect(() => {
    if (animationSteps.length === 0 || currentStepIndex <= 0 || currentStepIndex >= animationSteps.length) {
      return;
    }
    const step = animationSteps[currentStepIndex];
    if (!step) return;

    // Detect last step or active comparison/swap
    if (currentStepIndex === animationSteps.length - 1 && animationSteps.length > 2) {
      audioService.playStep('success');
    } else if (step.swapIndexes && step.swapIndexes.length > 0) {
      const idx = step.swapIndexes[0];
      const val = step.array ? step.array[idx] : null;
      if (val !== null && val !== undefined) {
        audioService.playValue(val, 10, 100, 'triangle', 0.12);
      } else {
        audioService.playStep('swap');
      }
    } else if (step.compareIndexes && step.compareIndexes.length > 0) {
      const idx = step.compareIndexes[0];
      const val = step.array ? step.array[idx] : null;
      if (val !== null && val !== undefined) {
        audioService.playValue(val, 10, 100, 'sine', 0.08);
      } else {
        audioService.playStep('compare');
      }
    }
  }, [currentStepIndex, animationSteps]);

  // Track Statistics
  useEffect(() => {
    if (animationSteps.length === 0 || currentStepIndex < 0) {
      setComparisons(0);
      setSwaps(0);
      return;
    }

    // Accumulate stats up to the current step
    let compCount = 0;
    let swapCount = 0;
    const maxStep = Math.min(currentStepIndex, animationSteps.length - 1);
    for (let i = 0; i <= maxStep; i++) {
      const s = animationSteps[i];
      if (s.compareIndexes && s.compareIndexes.length > 0) compCount++;
      if (s.swapIndexes && s.swapIndexes.length > 0) swapCount++;
    }
    setComparisons(compCount);
    setSwaps(swapCount);
  }, [currentStepIndex, animationSteps]);

  const generateRandomArray = () => {
    const newArr: number[] = [];
    const size = 10;
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 90) + 10); // Values between 10 and 100
    }
    setInputError('');
    setArray(newArr);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const parts = customInput.split(',').map(s => Number(s.trim()));
    const valid = parts.every(n => !isNaN(n) && n > 0 && n <= 100);
    
    if (parts.length < 5 || parts.length > 15) {
      setInputError('Please enter between 5 and 15 values.');
      return;
    }
    if (!valid) {
      setInputError('Values must be positive integers not exceeding 100.');
      return;
    }

    setInputError('');
    setArray(parts);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const generateSteps = () => {
    const steps: VizStep[] = [];
    const arrCopy = [...array];

    // Push initial step
    steps.push({
      array: [...arrCopy],
      description: 'Initial state: array generation completed. Hover or press start to begin.',
      codeLine: 0
    });

    switch (currentAlgo.id) {
      case 'bubble_sort':
        bubbleSortSim(arrCopy, steps);
        break;
      case 'selection_sort':
        selectionSortSim(arrCopy, steps);
        break;
      case 'insertion_sort':
        insertionSortSim(arrCopy, steps);
        break;
      case 'merge_sort':
        mergeSortSim(arrCopy, steps);
        break;
      case 'quick_sort':
        quickSortSim(arrCopy, steps);
        break;
      case 'heap_sort':
        heapSortSim(arrCopy, steps);
        break;
      default:
        break;
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
  };

  // --- BUBBLE SORT SIMULATION ---
  const bubbleSortSim = (arr: number[], steps: VizStep[]) => {
    const n = arr.length;
    const sortedIdxs: number[] = [];
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Step 1: Highlight comparison
        steps.push({
          array: [...arr],
          compareIndexes: [j, j + 1],
          sortedIndexes: [...sortedIdxs],
          description: `Comparing elements A[${j}] (${arr[j]}) and A[${j + 1}] (${arr[j + 1]})`,
          codeLine: 2
        });

        if (arr[j] > arr[j + 1]) {
          // Swap values
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          // Step 2: Highlight swap
          steps.push({
            array: [...arr],
            swapIndexes: [j, j + 1],
            sortedIndexes: [...sortedIdxs],
            description: `Swapped indices ${j} and ${j + 1} because ${arr[j + 1]} > ${arr[j]}`,
            codeLine: 4
          });
        }
      }
      // Index n - i - 1 is sorted
      sortedIdxs.unshift(n - i - 1);
      steps.push({
        array: [...arr],
        sortedIndexes: [...sortedIdxs],
        description: `Element at index ${n - i - 1} (${arr[n - i - 1]}) is placed in its final sorted position.`,
        codeLine: 1
      });
    }

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: n }, (_, i) => i),
      description: 'Bubble sort executed completely. All elements successfully sorted!',
      codeLine: 0
    });
  };

  // --- SELECTION SORT SIMULATION ---
  const selectionSortSim = (arr: number[], steps: VizStep[]) => {
    const n = arr.length;
    const sortedIdxs: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        array: [...arr],
        currentIndexes: [i],
        sortedIndexes: [...sortedIdxs],
        description: `Set index ${i} (${arr[i]}) as temporary minimum (minIndex).`,
        codeLine: 2
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...arr],
          compareIndexes: [j, minIdx],
          sortedIndexes: [...sortedIdxs],
          description: `Is A[${j}] (${arr[j]}) smaller than currently known minimum A[${minIdx}] (${arr[minIdx]})?`,
          codeLine: 4
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            array: [...arr],
            currentIndexes: [minIdx],
            sortedIndexes: [...sortedIdxs],
            description: `New minimum found at index ${minIdx} (${arr[minIdx]}).`,
            codeLine: 4
          });
        }
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;

        steps.push({
          array: [...arr],
          swapIndexes: [i, minIdx],
          sortedIndexes: [...sortedIdxs],
          description: `Swapped minimum element ${arr[i]} (index ${minIdx}) with element ${arr[minIdx]} (index ${i}).`,
          codeLine: 6
        });
      }

      sortedIdxs.push(i);
    }
    
    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: n }, (_, i) => i),
      description: 'Selection Sort completed. Beautifully sorted array achieved.',
      codeLine: 0
    });
  };

  // --- INSERTION SORT SIMULATION ---
  const insertionSortSim = (arr: number[], steps: VizStep[]) => {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        array: [...arr],
        currentIndexes: [i],
        description: `Selected element A[${i}] (${key}) as the "key" to insert into sorted partition.`,
        codeLine: 2
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          array: [...arr],
          compareIndexes: [j, j + 1],
          description: `Compare: element at A[${j}] (${arr[j]}) is greater than key (${key}). Shift indices right.`,
          codeLine: 4
        });

        arr[j + 1] = arr[j];
        j = j - 1;

        steps.push({
          array: [...arr],
          swapIndexes: [j + 1, j + 2],
          description: `Shifted element from index ${j + 1} to index ${j + 2}.`,
          codeLine: 5
        });
      }

      arr[j + 1] = key;
      steps.push({
        array: [...arr],
        currentIndexes: [j + 1],
        description: `Placed key (${key}) into its correct sorted insertion index ${j + 1}.`,
        codeLine: 7
      });
    }

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: n }, (_, i) => i),
      description: 'Insertion Sort completed. Insertion bounds resolved.',
      codeLine: 0
    });
  };

  // --- MERGE SORT SIMULATION ---
  const mergeSortSim = (arr: number[], steps: VizStep[]) => {
    const merge = (low: number, mid: number, high: number) => {
      const temp: number[] = [];
      let i = low;
      let j = mid + 1;

      steps.push({
        array: [...arr],
        currentIndexes: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        description: `Preparing to merge interval [${low} ... ${mid}] with [${mid + 1} ... ${high}]`,
        codeLine: 5
      });

      while (i <= mid && j <= high) {
        steps.push({
          array: [...arr],
          compareIndexes: [i, j],
          description: `Compare A[${i}] (${arr[i]}) and A[${j}] (${arr[j]})`,
          codeLine: 5
        });

        if (arr[i] <= arr[j]) {
          temp.push(arr[i++]);
        } else {
          temp.push(arr[j++]);
        }
      }

      while (i <= mid) {
        temp.push(arr[i++]);
      }
      while (j <= high) {
        temp.push(arr[j++]);
      }

      for (let k = 0; k < temp.length; k++) {
        arr[low + k] = temp[k];
        steps.push({
          array: [...arr],
          swapIndexes: [low + k],
          description: `Writing merged element ${temp[k]} to sorted index ${low + k}`,
          codeLine: 5
        });
      }
    };

    const divideAndSort = (low: number, high: number) => {
      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        steps.push({
          array: [...arr],
          currentIndexes: [low, mid, high],
          description: `Dividing current slot [${low}...${high}] into [${low}...${mid}] and [${mid + 1}...${high}]`,
          codeLine: 2
        });

        divideAndSort(low, mid);
        divideAndSort(mid + 1, high);
        merge(low, mid, high);
      }
    };

    divideAndSort(0, arr.length - 1);
    
    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: arr.length }, (_, k) => k),
      description: 'Merge Sort complete. Array fully restored in sorted linear layout.',
      codeLine: 0
    });
  };

  // --- QUICK SORT SIMULATION ---
  const quickSortSim = (arr: number[], steps: VizStep[]) => {
    const partition = (low: number, high: number): number => {
      const pivotValue = arr[high];
      steps.push({
        array: [...arr],
        currentIndexes: [high],
        description: `Starting partition: Chose A[${high}] (${pivotValue}) as the pivot value block.`,
        codeLine: 2
      });

      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...arr],
          compareIndexes: [j, high],
          currentIndexes: i >= low ? [i] : [],
          description: `Is boundary A[${j}] (${arr[j]}) less than pivot ${pivotValue}?`,
          codeLine: 2
        });

        if (arr[j] < pivotValue) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            array: [...arr],
            swapIndexes: [i, j],
            description: `Swapped smaller item A[${j}] to pointer mark index ${i} to partition.`,
            codeLine: 2
          });
        }
      }

      const temp2 = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp2;

      steps.push({
        array: [...arr],
        swapIndexes: [i + 1, high],
        description: `Swap pivot element into its exact partitioned line coordinate: slot index ${i + 1}.`,
        codeLine: 2
      });

      return i + 1;
    };

    const sortRecurse = (low: number, high: number) => {
      if (low < high) {
        const pIdx = partition(low, high);
        sortRecurse(low, pIdx - 1);
        sortRecurse(pIdx + 1, high);
      }
    };

    sortRecurse(0, arr.length - 1);

    steps.push({
      array: [...arr],
      sortedIndexes: Array.from({ length: arr.length }, (_, k) => k),
      description: 'Quick Sort complete. All pivot partitions successfully aligned.',
      codeLine: 0
    });
  };

  // --- HEAP SORT SIMULATION ---
  const heapSortSim = (arr: number[], steps: VizStep[]) => {
    const heapify = (size: number, idx: number) => {
      let largest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      steps.push({
        array: [...arr],
        currentIndexes: [idx],
        description: `Running heapify on parent node at index ${idx} (${arr[idx]}).`,
        codeLine: 4
      });

      if (left < size) {
        steps.push({
          array: [...arr],
          compareIndexes: [largest, left],
          description: `Compare largest index ${largest} (${arr[largest]}) with left child index ${left} (${arr[left]}).`,
          codeLine: 4
        });
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        steps.push({
          array: [...arr],
          compareIndexes: [largest, right],
          description: `Compare largest index ${largest} (${arr[largest]}) with right child index ${right} (${arr[right]}).`,
          codeLine: 4
        });
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== idx) {
        const swap = arr[idx];
        arr[idx] = arr[largest];
        arr[largest] = swap;

        steps.push({
          array: [...arr],
          swapIndexes: [idx, largest],
          description: `Heap violation detected: swapped indices ${idx} and ${largest} to assert Max-Heap rule.`,
          codeLine: 4
        });

        heapify(size, largest);
      }
    };

    const n = arr.length;
    // Build heap (rearrange array)
    steps.push({
      array: [...arr],
      description: 'First, rearranging array into a valid Max-Heap layout.',
      codeLine: 1
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // One by one extract elements
    const sortedIdxs: number[] = [];
    for (let i = n - 1; i > 0; i--) {
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      sortedIdxs.unshift(i);

      steps.push({
        array: [...arr],
        swapIndexes: [0, i],
        sortedIndexes: [...sortedIdxs],
        description: `Extracted max-root ${temp} from raw top. Swapped index 0 with boundary index ${i}`,
        codeLine: 3
      });

      heapify(i, 0);
    }
    sortedIdxs.unshift(0);

    steps.push({
      array: [...arr],
      sortedIndexes: sortedIdxs,
      description: 'Heap Sort successfully complete! Predictable worst-case O(n log n) boundaries maintained.',
      codeLine: 0
    });
  };

  const getBarColor = (index: number) => {
    const step = animationSteps[currentStepIndex];
    if (!step) return 'bg-indigo-500';

    if (step.sortedIndexes?.includes(index)) {
      return 'bg-emerald-500 text-emerald-100 shadow-sm shadow-emerald-500/20';
    }
    if (step.swapIndexes?.includes(index)) {
      return 'bg-rose-500 text-rose-105 shadow-md shadow-rose-500/30 font-bold scale-102';
    }
    if (step.compareIndexes?.includes(index)) {
      return 'bg-yellow-405 text-yellow-950 border border-yellow-500 animate-pulse';
    }
    if (step.currentIndexes?.includes(index)) {
      return 'bg-sky-505 text-slate-900 border-2 border-sky-600 scale-105';
    }
    return 'bg-slate-350 hover:bg-slate-400 dark:bg-slate-705 dark:hover:bg-slate-650';
  };

  const activeStep = animationSteps[currentStepIndex] || { array, description: 'Prepare array to sort' };
  const displayArray = activeStep.array || array;

  const sortingAlgosList = [
    { id: 'bubble_sort', name: 'Bubble Sort', avgCase: 'O(n²)', desc: 'Scan and bubble values', icon: Layers, hoverColor: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/30' },
    { id: 'selection_sort', name: 'Selection Sort', avgCase: 'O(n²)', desc: 'Find sequential minimums', icon: Target, hoverColor: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/30' },
    { id: 'insertion_sort', name: 'Insertion Sort', avgCase: 'O(n²)', desc: 'Construct sorted subarrays', icon: ListOrdered, hoverColor: 'hover:border-sky-500/40 dark:hover:border-sky-500/30' },
    { id: 'merge_sort', name: 'Merge Sort', avgCase: 'O(n log n)', desc: 'Divide, sort, merge halves', icon: GitMerge, hoverColor: 'hover:border-amber-500/40 dark:hover:border-amber-500/30' },
    { id: 'quick_sort', name: 'Quick Sort', avgCase: 'O(n log n)', desc: 'Partition around a pivot', icon: Zap, hoverColor: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/30' },
    { id: 'heap_sort', name: 'Heap Sort', avgCase: 'O(n log n)', desc: 'Binary heap queue structure', icon: Database, hoverColor: 'hover:border-rose-500/40 dark:hover:border-rose-500/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Sorting Algorithms Interactive Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100 flex items-center gap-1.5 leading-snug">
              <Layers className="w-4.5 h-4.5 text-indigo-550 dark:text-indigo-405" />
              <span>Sorting Algorithms Hub</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Select a sorting algorithm to generate its execution trace and visualize custom array bar operations step-by-step.
            </p>
          </div>
          <span className="shrink-0 text-[10px] bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold uppercase py-1 px-2.5 rounded-lg leading-none border dark:border-slate-800/80">
            {sortingAlgosList.length} Models Loaded
          </span>
        </div>

        {/* Responsive Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {sortingAlgosList.map((algo) => {
            const isSelected = currentAlgo.id === algo.id;
            const IconComp = algo.icon;
            return (
              <button
                id={`sort-hub-card-${algo.id}`}
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
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-350'
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
      {/* Control Area */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-2">
          {/* Random Generation Button */}
          <button
            id="sort-btn-generate"
            onClick={generateRandomArray}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition-all min-h-[40px] shadow-sm"
          >
            <Shuffle className="w-4 h-4" />
            Generate Array
          </button>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomInputSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              id="sort-custom-values"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 10, 45, 80, 20, 5"
              className="w-full sm:w-56 px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 dark:text-neutral-50 pr-8"
            />
            {customInput.length > 0 && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all"
                title="Apply Custom Array"
              >
                <Check className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="hidden sm:inline text-[10px] text-slate-450 dark:text-slate-500 max-w-xs">
            (5-15 comma entries)
          </span>
        </form>
      </div>

      {inputError && (
        <p className="text-xs text-rose-500 flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-950">
          ⚠️ {inputError}
        </p>
      )}

      {/* Array Bars Visualization */}
      <div className="relative block">
        <div className="flex items-end justify-center gap-1 sm:gap-2.5 h-64 border-b border-slate-200 dark:border-slate-805 pt-10 px-2 select-none relative overflow-x-auto min-w-full">
          {displayArray.map((val, idx) => {
            // Calculate relative height percentage
            const maxVal = Math.max(...displayArray, 100);
            const heightPerc = `${Math.min(95, Math.max(12, (val / maxVal) * 100))}%`;
            const colorClass = getBarColor(idx);

            return (
              <div
                id={`sorting-bar-${idx}`}
                key={idx}
                className="flex flex-col items-center justify-end w-12 sm:w-14 relative group rounded-t-lg transition-all duration-300 overflow-hidden"
                style={{ height: heightPerc }}
              >
                {/* Numeric label on hover */}
                <div className="absolute top-2 font-mono text-[10px] font-bold tracking-tight opacity-90 text-slate-800 dark:text-slate-100">
                  {val}
                </div>
                
                {/* Visual block */}
                <div className={`w-full h-full rounded-t-md transition-all duration-200 ${colorClass}`} />
                
                {/* Sub-label indices */}
                <span className="absolute -bottom-6 font-mono text-[9px] font-semibold text-slate-400">
                  {idx}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Description Trace */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 italic flex items-start gap-2.5">
        <span className="text-indigo-500 font-bold uppercase tracking-wider text-[10px] bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded leading-none shrink-0 mt-0.5">
          Step Explain
        </span>
        <span className="leading-snug">{activeStep.description}</span>
      </div>

      {/* Run Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Comparisons</p>
          <p className="text-xl font-mono font-bold text-slate-800 dark:text-slate-100 mt-1.5">{comparisons}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Swap Operations</p>
          <p className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1.5">{swaps}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Execution Steps</p>
          <p className="text-xl font-mono font-bold text-slate-800 dark:text-slate-100 mt-1.5">
            {currentStepIndex + 1} <span className="text-xs text-slate-400">/ {animationSteps.length || 1}</span>
          </p>
        </div>
        <div className="text-center md:text-left col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Speed Multiplier</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-500 font-bold select-none">[ {speed}ms / {speed * 1000}μs ]</span>
            <input
              id="sort-speed-slider"
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
            id="sort-btn-prev"
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Step Backward"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>

          {/* Play/Pause */}
          <button
            id="sort-btn-play-pause"
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
                Start Simulation
              </>
            )}
          </button>

          {/* Forward Step */}
          <button
            id="sort-btn-next"
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
          id="sort-btn-reset"
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
