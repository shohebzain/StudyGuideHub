import React, { useState, useEffect } from 'react';
import { AlgorithmInfo, ALGORITHMS_LIST } from '../types';
import { ShieldCheck, Flame, Scale, Hourglass, ArrowRightLeft, BarChart2, Award, Zap, HelpCircle, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

interface ComplexityPanelProps {
  currentAlgo: AlgorithmInfo;
}

interface Insight {
  pros: string[];
  cons: string[];
  applications: string;
}

const getInsights = (id: string): Insight => {
  switch (id) {
    case 'bubble_sort':
      return {
        pros: ['Very simple to understand and implement', 'Is stable (preserves original order of duplicates)', 'In-place (requires O(1) extra space)'],
        cons: ['Extremely inefficient on large datasets (O(n²))', 'Performs unnecessary iterations even if array sorts early (unless optimized)'],
        applications: 'Used primarily as a fundamental academic teaching aid to introduce the concept of sorting.'
      };
    case 'selection_sort':
      return {
        pros: ['Simple and performs fewer swaps than Bubble Sort', 'In-place sorting with minimal memory requirements.'],
        cons: ['Poor time complexity O(n²)', 'Not stable because elements are swapped over long intervals.'],
        applications: 'Useful when memory writes are extremely expensive because it minimizes the total count of swap operations.'
      };
    case 'insertion_sort':
      return {
        pros: ['Highly efficient for nearly sorted small datasets', 'Stable and sorts in-place', 'An online algorithm (can sort stream data item-by-item).'],
        cons: ['Performance degrades severely for backwards or random large datasets (O(n²)).'],
        applications: 'Ideal for small arrays or as the fallback subroutine in modern hybrid algorithms like Timsort.'
      };
    case 'merge_sort':
      return {
        pros: ['Guaranteed worst-case O(n log n) runtime', 'Stable sort preserving original relative order'],
        cons: ['Requires O(n) temporary space auxiliary allocation'],
        applications: 'Used for external sorting where data does not fit in RAM, and widely adopted in database engines.'
      };
    case 'quick_sort':
      return {
        pros: ['Cache-friendly and works in-place', 'Extremely fast real-world performance average.'],
        cons: ['Worst-case O(n²) if pivots are chosen poorly', 'Unstable sorting behavior.'],
        applications: 'Adopted in standard library systems (like Java DualPivotQuicksort, C++ std::sort) for rapid in-memory pipelines.'
      };
    case 'heap_sort':
      return {
        pros: ['Guaranteed worst-case O(n log n) performance', 'In-place sorting with O(1) extra space.'],
        cons: ['Unstable sort', 'Not optimal for CPU caching due to tree-hop pointers in arrays.'],
        applications: 'Critical systems with tight physical memory limits where predictable timing guarantees are strictly required.'
      };
    case 'linear_search':
      return {
        pros: ['Works on unsorted arrays', 'Simplest search algorithm with no pre-sorting constraints.'],
        cons: ['Inefficient worst case on large arrays (makes up to N checks).'],
        applications: 'Quickly searching lightweight lists, database lookups where records are not indexed.'
      };
    case 'binary_search':
      return {
        pros: ['Incredibly fast search log times', 'Halves search boundaries with each step.'],
        cons: ['Requires the entire dataset to be sorted beforehand.'],
        applications: 'Core index search routines, SQL databases, lookup tables, and binary subdivision physics engines.'
      };
    case 'jump_search':
      return {
        pros: ['Better than linear search and avoids backtracking', 'Allows skipping elements.'],
        cons: ['Slow compared to Binary Search', 'Requires pre-sorted lists.'],
        applications: 'Systems with high backtracking penalty costs to jump directly over data chunks (e.g. read heads on physical media).'
      };
    case 'stack_operations':
      return {
        pros: ['Perfect constant time O(1) for push/pop elements', 'Provides deterministic memory tracking for recursion and function calls.'],
        cons: ['Strictly sequential access (LIFO order limit only).'],
        applications: 'Function call management runtime traces, browser historical page routes, and undo/redo buffers.'
      };
    case 'queue_operations':
      return {
        pros: ['O(1) constant queue actions', 'Excellent asynchronous buffer model.'],
        cons: ['Limits data viewing strictly to endpoints (FIFO constraints).'],
        applications: 'Print queue listings, network routing packet buffers, and thread work distribution pools.'
      };
    case 'linked_list_ops':
      return {
        pros: ['Dynamic allocation prevents memory pre-sizing constraints', 'Efficient O(1) insertion and deletion at pointers.'],
        cons: ['No direct indexing (requires O(N) traversal search).'],
        applications: 'Ad-hoc heap blocks tracking, hash collision buckets, memory management directories.'
      };
    case 'bst_operations':
      return {
        pros: ['Maintains data sorted order dynamically', 'AVL self-balancing guarantees rapid logarithmic O(log n) searches.'],
        cons: ['Unbalanced BST splits degrade performance to O(n) linear chains.'],
        applications: 'Database search indexes, memory folder hierarchies, set membership lists, and local dictionaries.'
      };
    case 'heap_trie_ops':
      return {
        pros: ['Max-Heaps fetch priorities in logarithmic boundaries', 'Tries search dynamic string prefixes in character lengths.'],
        cons: ['Tries require high memory overhead for unused children nodes.'],
        applications: 'Search engine autocomplete fields, priority event queue loops, routing prefix listings.'
      };
    case 'graph_algorithms':
      return {
        pros: ['A* search maps heuristically optimized shortest blocks', 'Prim\'s resolves minimum spanning tree connections perfectly.'],
        cons: ['Extremely complex recursive space boundaries for raw arrays.'],
        applications: 'GPS maps layout trackers, computer network nodes layout builders, obstacle puzzle-solving bots.'
      };
    default:
      return {
        pros: ['Dynamically tracks data transitions', 'Highly visual object flows', 'Clean node routing'],
        cons: ['Must manage references carefully', 'Needs dynamic reallocation indicators.'],
        applications: 'Enforces optimal memory structure usage, dynamic sizing, non-linear indexing, and path routing.'
      };
  }
};

const getComplexityScore = (complexityStr: string, isSpace: boolean = false): { score: number, label: string } => {
  const clean = complexityStr.toLowerCase().replace(/\s+/g, '');
  if (isSpace) {
    if (clean === 'o(1)') return { score: 10, label: 'Optimal O(1)' };
    if (clean.includes('longn') || clean.includes('logn')) return { score: 8, label: 'Excellent O(log n)' };
    if (clean.includes('√n') || clean.includes('sqrt')) return { score: 7, label: 'Good O(√n)' };
    if (clean === 'o(n)' || clean.includes('o(v+e)') || clean.includes('o(n*l)') || clean.includes('o(v)')) return { score: 5, label: 'Moderate O(n)' };
    return { score: 3, label: 'Heavy O(n²)' };
  } else {
    // Time complexity
    if (clean === 'o(1)') return { score: 10, label: 'Constant O(1)' };
    if (clean.includes('logn')) return { score: 9, label: 'Logarithmic O(log n)' };
    if (clean.includes('√n') || clean.includes('sqrt')) return { score: 8, label: 'Sub-linear O(√n)' };
    if (clean === 'o(n)' || clean.includes('o(v+e)') || clean.includes('o(v)')) return { score: 6, label: 'Linear O(n)' };
    if (clean.includes('nlogn')) return { score: 5, label: 'Linearithmic O(n log n)' };
    if (clean.includes('n^2') || clean.includes('n²') || clean.includes('v^2') || clean.includes('v²')) return { score: 2, label: 'Quadratic O(n²)' };
    return { score: 4, label: 'Complex' };
  }
};

const getScenarioExplanation = (id: string, scenario: 'best' | 'average' | 'worst'): string => {
  const mapping: Record<string, Record<'best' | 'average' | 'worst', string>> = {
    bubble_sort: {
      best: "The array is already sorted. The visualizer makes only 1 pass (no swaps) and immediately highlights elements green under O(n) checks.",
      average: "Randomly shuffled list. The visualizer scans back and forth repeatedly, bubbles floating back-to-front needing roughly N²/2 swaps and comparisons.",
      worst: "The array is sorted in descending order (reverse). Every single item must bubble all the way across, requiring maximum possible comparisons and swaps."
    },
    selection_sort: {
      best: "Even if already sorted, the visualizer still sweeps the entire remaining portion to verify each minimum, resulting in O(n²) comparisons although 0 swaps are performed.",
      average: "Elements are randomly distributed. The visualizer scans the remaining array to find the global minimum for each slot, then swaps it into place.",
      worst: "Values positioned such that we perform O(n) swaps, but we still make O(n²) comparisons. Time complexity is always quadratic because selection sort is blind to order."
    },
    insertion_sort: {
      best: "Already sorted array. The insertion pointer instantly exits each inner loop because the neighbor is already smaller, making only N-1 comparisons (no shift animations).",
      average: "Randomly ordered bars. For each bar, index sweeps backward, shifting taller bars to the right until finding the correct slot.",
      worst: "Reversed array order. For every new item, the visualizer has to shift all previous items one-by-one, resulting in maximum shift actions."
    },
    merge_sort: {
      best: "Stable O(n log n). The visualizer recursively splits the array down to single items, and reconstructs lists using helper auxiliary blocks regardless of sorted order.",
      average: "The divide-and-conquer strategy recursively splits elements and merges subarrays. Consistently fast with highly parallel partition blocks.",
      worst: "Takes exact same O(n log n) divisions and merges to reconstruct the sorted elements. The visualizer steps are completely predictable."
    },
    quick_sort: {
      best: "The pivot is always chosen perfectly as the median, dividing subarrays exactly in half at each step of the quicksort partition tree.",
      average: "Pivot values split the array in reasonably balanced chunks, bringing elegant fast swapping visual patterns in O(n log n) steps.",
      worst: "The pivot picked is consistently the smallest/largest element (e.g. key endpoint elements in reverse-sorted lists), nesting recursive calls down to O(n²)."
    },
    heap_sort: {
      best: "The visualizer constructs a Max-Heap array representation and extracts the largest value. predictability takes O(n log n) steps.",
      average: "Converts the unsorted list to a binary heap structure, then heapifies repeatedly to bubble down intermediate items.",
      worst: "Stable O(n log n) transitions. Elements are structured to trigger the maximum number of bubble-down root adjustments."
    },
    linear_search: {
      best: "Target element is located at the very first element (index 0). The visualizer immediately flags index 0 green and terminates.",
      average: "Target is in the middle of lists. The search pointer sweeps element-by-element, checking and flashing colors sequentially.",
      worst: "Target is at the last index or entirely absent. The visualizer sweeps the entire list to the end before reporting it was not found."
    },
    binary_search: {
      best: "The target is located exactly at the middle element of the sorted list. Found on the absolute first comparison!",
      average: "Subdivisions narrow down the search span by 50% with each step, highlighting left/right boundaries converging on the target.",
      worst: "Target is in the last remaining 1-element subarray or missing, requiring maximum divisions log₂(n) steps."
    },
    jump_search: {
      best: "The target is located at the first index (index 0) or first jump boundary, yielding immediate retrieval.",
      average: "The pointer jumps over blocks of size √N, then performs a linear scan within the matching block to pinpoint the target.",
      worst: "Target is near the end or absent. Reaches the end of the array jumps and scans the full trailing block size."
    },
    stack_operations: {
      best: "Continuous O(1) performance. Instant direct access to elements at the very top of the stack.",
      average: "All stack pushes/pops operate at the active top element, requiring no indexing or traversal of lower levels.",
      worst: "Even under heavy storage limits, popping or pushing elements always scales predictably at constant O(1) duration."
    },
    queue_operations: {
      best: "Continuous O(1). Inserting at the tail or removing at the head operates immediately.",
      average: "Actions are performed strictly at endpoints (FIFO queue models), requiring zero steps to search internal objects.",
      worst: "Regardless of queues contents, enqueue/dequeue triggers direct element updates at constant O(1) cost."
    },
    linked_list_ops: {
      best: "Adding/removing at the head. Modifies next pointers in constant O(1) time with immediate visual updates.",
      average: "Modifying items in the middle of the linked list. The pointer must follow the chain link-by-link to reach the index.",
      worst: "Finding/deleting from the tail or checking an item that doesn't exist, requiring full N steps traversal."
    },
    bst_operations: {
      best: "The BST is perfectly balanced. Searching, inserting, or deleting cuts search paths in half at each child level (O(log n) height).",
      average: "Nodes populated in random order create a semi-balanced tree structure with efficient logarithmic navigation.",
      worst: "Inserting keys in progressive sorted order (all right-heavy or left-heavy), collapsing the tree layout into a linear list of O(N)."
    },
    heap_trie_ops: {
      best: "Finding or inserting elements that reside directly at the root node or shortest branch levels.",
      average: "Standard hierarchy insertions. Max-heap bubbles up values to restore heap invariants; Trie matches string characters key-by-key.",
      worst: "Heap nodes bubble all the way from the leaf to root; Trie searches long word links."
    },
    graph_algorithms: {
      best: "Direct connection or destination target sits neighboring the start node, requiring only simple edge exploration.",
      average: "Pathfinding searches explore adjacent grid squares, keeping track of weighted distances and expanding optimal candidate nodes.",
      worst: "No path exists between source and target, forcing full graph node traversal through all coordinates before failing."
    }
  };

  const algoMap = mapping[id] || mapping['bubble_sort'];
  return algoMap[scenario] || "Interactive step-by-step visual calculations tracking element operations.";
};

export default function ComplexityPanel({ currentAlgo }: ComplexityPanelProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'compare' | 'charts'>('insights');
  const [algoAId, setAlgoAId] = useState<string>(currentAlgo.id);
  const [algoBId, setAlgoBId] = useState<string>('bubble_sort');
  const [activeHelp, setActiveHelp] = useState<'best' | 'average' | 'worst' | null>(null);
  const [activeHelpA, setActiveHelpA] = useState<'best' | 'average' | 'worst' | null>(null);
  const [activeHelpB, setActiveHelpB] = useState<'best' | 'average' | 'worst' | null>(null);

  // Growth curve data helper
  const getActiveComplexityClass = (algo: AlgorithmInfo): 'O(1)' | 'O(log N)' | 'O(N)' | 'O(N log N)' | 'O(N²)' => {
    const avg = algo.timeComplexity.average.toLowerCase().replace(/\s+/g, '');
    if (avg.includes('o(1)') || avg === '1') return 'O(1)';
    if (avg.includes('logn') && !avg.includes('nlogn')) return 'O(log N)';
    if (avg.includes('nlogn')) return 'O(N log N)';
    if (avg.includes('n^2') || avg.includes('n²') || avg.includes('v^2') || avg.includes('v²')) return 'O(N²)';
    if (avg.includes('o(n)') || avg.includes('o(v+e)') || avg.includes('o(v)') || avg === 'n') return 'O(N)';
    return 'O(N)';
  };

  const activeCurveClass = getActiveComplexityClass(currentAlgo);

  const curveData = [5, 10, 15, 20, 25, 30, 35, 40].map(n => ({
    n: `N=${n}`,
    "O(1)": 1,
    "O(log N)": parseFloat(Math.log2(n).toFixed(1)),
    "O(N)": n,
    "O(N log N)": parseFloat((n * Math.log2(n)).toFixed(1)),
    "O(N²)": n * n
  }));

  // Operations and swaps benchmark dataset for BarChart
  const getCategoryComparisonData = (category: string) => {
    switch (category) {
      case 'sorting':
        return [
          { name: 'Bubble Sort', Comparisons: 380, Swaps: 320, Performance: 700 },
          { name: 'Selection Sort', Comparisons: 380, Swaps: 40, Performance: 420 },
          { name: 'Insertion Sort', Comparisons: 190, Swaps: 150, Performance: 340 },
          { name: 'Merge Sort', Comparisons: 80, Swaps: 90, Performance: 170 },
          { name: 'Quick Sort', Comparisons: 95, Swaps: 85, Performance: 180 },
          { name: 'Heap Sort', Comparisons: 110, Swaps: 100, Performance: 210 },
        ];
      case 'searching':
        return [
          { name: 'Linear Search', Comparisons: 250, Swaps: 0, Performance: 250 },
          { name: 'Jump Search', Comparisons: 35, Swaps: 0, Performance: 35 },
          { name: 'Binary Search', Comparisons: 9, Swaps: 0, Performance: 9 },
        ];
      case 'stack_queue':
        return [
          { name: 'Stack Base', Comparisons: 2, Swaps: 0, Performance: 2 },
          { name: 'Queue Base', Comparisons: 2, Swaps: 0, Performance: 2 },
          { name: 'Linked List', Comparisons: 80, Swaps: 10, Performance: 90 },
        ];
      case 'trees':
      case 'heap_trie':
        return [
          { name: 'Binary Tree', Comparisons: 8, Swaps: 0, Performance: 8 },
          { name: 'Max Heap', Comparisons: 12, Swaps: 8, Performance: 20 },
          { name: 'Trie Map', Comparisons: 5, Swaps: 0, Performance: 5 },
        ];
      case 'graphs':
        return [
          { name: 'BFS Algo', Comparisons: 120, Swaps: 0, Performance: 120 },
          { name: 'DFS Algo', Comparisons: 120, Swaps: 0, Performance: 120 },
          { name: 'Dijkstra', Comparisons: 240, Swaps: 85, Performance: 325 },
          { name: 'A* Search', Comparisons: 90, Swaps: 40, Performance: 130 },
        ];
      default:
        return [
          { name: 'Linear Scans', Comparisons: 200, Swaps: 0, Performance: 200 },
          { name: 'Tree Division', Comparisons: 10, Swaps: 0, Performance: 10 },
          { name: 'Heap Nodes', Comparisons: 15, Swaps: 12, Performance: 27 },
        ];
    }
  };

  const categoryChartData = getCategoryComparisonData(currentAlgo.category);

  // Auxiliary space overhead dataset for AreaChart
  const getSpaceComplexityData = () => {
    const nValues = [10, 50, 100, 250, 500, 1000];
    const cleanSpace = currentAlgo.spaceComplexity.toLowerCase().replace(/\s+/g, '');
    
    return nValues.map(n => {
      let activeMemoryBytes = 4; // default constant baseline
      if (cleanSpace.includes('logn')) {
        activeMemoryBytes = Math.ceil(Math.log2(n) * 4);
      } else if (cleanSpace.includes('n*l') || cleanSpace.includes('nlogn')) {
        activeMemoryBytes = Math.ceil(n * Math.log2(n) * 2);
      } else if (cleanSpace.includes('o(n)') || cleanSpace.includes('o(v+e)') || cleanSpace.includes('o(v)')) {
        activeMemoryBytes = n * 4;
      } else if (cleanSpace.includes('o(1)')) {
        activeMemoryBytes = 4;
      }

      return {
        n: `N=${n}`,
        "O(1) In-Place": 4,
        "O(log N) Stack": Math.ceil(Math.log2(n) * 4),
        "O(N) Linear": n * 4,
        "Active Memory": activeMemoryBytes,
      };
    });
  };

  const spaceChartData = getSpaceComplexityData();

  // Custom tooltips styling
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg text-xs font-sans">
          <p className="font-extrabold text-slate-800 dark:text-neutral-50 mb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
                <span className="text-slate-500 dark:text-slate-400 font-medium">{p.name}:</span>
                <span className="font-extrabold text-slate-800 dark:text-neutral-200">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Sync Algo A when user selects another algorithm on sidebar/header
  useEffect(() => {
    setAlgoAId(currentAlgo.id);
    if (currentAlgo.id === algoBId) {
      const other = ALGORITHMS_LIST.find(a => a.id !== currentAlgo.id);
      if (other) {
        setAlgoBId(other.id);
      }
    }
  }, [currentAlgo.id]);

  const algoA = ALGORITHMS_LIST.find(a => a.id === algoAId) || currentAlgo;
  const algoB = ALGORITHMS_LIST.find(a => a.id === algoBId) || ALGORITHMS_LIST[0];

  const insightsA = getInsights(algoA.id);
  const insightsB = getInsights(algoB.id);

  // Score mappings for the visual comparator progress bars
  const scoreAvgA = getComplexityScore(algoA.timeComplexity.average);
  const scoreAvgB = getComplexityScore(algoB.timeComplexity.average);

  const scoreWorstA = getComplexityScore(algoA.timeComplexity.worst);
  const scoreWorstB = getComplexityScore(algoB.timeComplexity.worst);

  const scoreSpaceA = getComplexityScore(algoA.spaceComplexity, true);
  const scoreSpaceB = getComplexityScore(algoB.spaceComplexity, true);

  const renderComparisonBar = (label: string, scoreA: number, textA: string, scoreB: number, textB: string) => {
    const pctA = (scoreA / 10) * 100;
    const pctB = (scoreB / 10) * 100;

    const getColor = (s: number) => {
      if (s >= 8) return 'bg-emerald-500 dark:bg-emerald-400';
      if (s >= 5) return 'bg-indigo-500 dark:bg-indigo-400';
      return 'bg-rose-500 dark:bg-rose-400';
    };

    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <h5 className="font-extrabold text-[10px] tracking-wider uppercase text-slate-400 mb-3 block">
          {label} (Higher percentage = Faster/More Efficient)
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Algo A Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-350">{algoA.name}</span>
              <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-neutral-50">{textA}</code>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getColor(scoreA)} transition-all duration-500`} 
                style={{ width: `${pctA}%` }} 
              />
            </div>
          </div>

          {/* Algo B Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-350">{algoB.name}</span>
              <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-neutral-50">{textB}</code>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getColor(scoreB)} transition-all duration-500`} 
                style={{ width: `${pctB}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeInsights = getInsights(currentAlgo.id);

  return (
    <div className="space-y-6">
      {/* Comparative View Selection Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            id="tab-single-insights"
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'insights'
                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            Active Algorithm Insights
          </button>
          <button
            id="tab-compare-metrics"
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'compare'
                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-500 animate-pulse" />
            Complexity Comparator Matrix
          </button>
          <button
            id="tab-visual-charts"
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'charts'
                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-500" />
            Visual Analytics Charts
          </button>
        </div>
        
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:inline-block">
          {activeTab === 'compare' ? 'Side-by-Side Analysis Mode' : activeTab === 'charts' ? 'Performance Analytics Mode' : 'Selected insights of current element'}
        </span>
      </div>

      {activeTab === 'insights' ? (
        /* SINGLE ALGORITHM ACTIVE INSIGHTS */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Time Complexity Card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Hourglass className="w-4 h-4 text-orange-500" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                Time Complexity Analysis
              </h4>
            </div>
            
            <div className="space-y-3 text-sm mt-3">
              <div className="flex flex-col border-b border-dashed border-slate-205 dark:border-slate-800 pb-2">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-xs font-semibold">Best Case Scenario</span>
                    <button
                      type="button"
                      onClick={() => setActiveHelp(activeHelp === 'best' ? null : 'best')}
                      className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Explain Best Case visualizer context"
                      aria-label="Explain Best Case visualizer context"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <code className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                    {currentAlgo.timeComplexity.best}
                  </code>
                </div>
                {activeHelp === 'best' && (
                  <div className="mt-1 p-2 bg-emerald-50/45 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-lg text-[11px] text-slate-600 dark:text-slate-355 leading-relaxed transition-all">
                    <strong className="text-emerald-700 dark:text-emerald-400">Best Case in Visualizer:</strong> {getScenarioExplanation(currentAlgo.id, 'best')}
                  </div>
                )}
              </div>

              <div className="flex flex-col border-b border-dashed border-slate-205 dark:border-slate-800 pb-2">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-xs font-semibold">Average Case Scenario</span>
                    <button
                      type="button"
                      onClick={() => setActiveHelp(activeHelp === 'average' ? null : 'average')}
                      className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Explain Average Case visualizer context"
                      aria-label="Explain Average Case visualizer context"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <code className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 font-mono text-xs font-bold">
                    {currentAlgo.timeComplexity.average}
                  </code>
                </div>
                {activeHelp === 'average' && (
                  <div className="mt-1 p-2 bg-indigo-50/45 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-lg text-[11px] text-slate-600 dark:text-slate-355 leading-relaxed transition-all">
                    <strong className="text-indigo-700 dark:text-indigo-400">Average Case in Visualizer:</strong> {getScenarioExplanation(currentAlgo.id, 'average')}
                  </div>
                )}
              </div>

              <div className="flex flex-col pb-1">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-xs font-semibold">Worst Case Scenario</span>
                    <button
                      type="button"
                      onClick={() => setActiveHelp(activeHelp === 'worst' ? null : 'worst')}
                      className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Explain Worst Case visualizer context"
                      aria-label="Explain Worst Case visualizer context"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <code className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold">
                    {currentAlgo.timeComplexity.worst}
                  </code>
                </div>
                {activeHelp === 'worst' && (
                  <div className="mt-1 p-2 bg-rose-50/45 dark:bg-rose-955/10 border border-rose-100/50 dark:border-rose-900/30 rounded-lg text-[11px] text-slate-600 dark:text-slate-355 leading-relaxed transition-all">
                    <strong className="text-rose-700 dark:text-rose-400">Worst Case in Visualizer:</strong> {getScenarioExplanation(currentAlgo.id, 'worst')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses (Pros/Cons) */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 rounded-xl p-5 shadow-sm md:col-span-2 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pros */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                    Advantages
                  </h5>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {activeInsights.pros.map((p, i) => (
                    <li key={i} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Cons */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                    Limitations
                  </h5>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {activeInsights.cons.map((c, i) => (
                    <li key={i} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-rose-500 mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real-world usage summary */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-450">
              <span className="font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mr-1.5">
                Real-World Application:
              </span>
              {activeInsights.applications}
            </div>
          </div>
        </div>
      ) : activeTab === 'compare' ? (
        /* ALGORITHM COMPARATOR SYSTEM MATRIX */
        <div className="space-y-6">
          {/* Algorithm A & B Dropdowns selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 p-4 rounded-2xl">
            {/* Algorithm A Selection */}
            <div className="space-y-1">
              <label htmlFor="algo-a-select" className="block text-[10px] uppercase font-extrabold text-slate-400">
                Algorithm A (Compared Baseline)
              </label>
              <select
                id="algo-a-select"
                value={algoAId}
                onChange={(e) => setAlgoAId(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 text-slate-800 dark:text-neutral-50 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 shadow-xs outline-none focus:ring-1 focus:ring-indigo-550"
              >
                {ALGORITHMS_LIST.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.category.toUpperCase().replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Algorithm B Selection */}
            <div className="space-y-1">
              <label htmlFor="algo-b-select" className="block text-[10px] uppercase font-extrabold text-slate-400">
                Algorithm B (Compared Target)
              </label>
              <select
                id="algo-b-select"
                value={algoBId}
                onChange={(e) => setAlgoBId(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 text-slate-800 dark:text-neutral-50 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 shadow-xs outline-none focus:ring-1 focus:ring-indigo-550"
              >
                {ALGORITHMS_LIST.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.category.toUpperCase().replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visual Rating progress bars charts series */}
          <div className="grid grid-cols-1 gap-4">
            {renderComparisonBar('Average Time Efficiency', scoreAvgA.score, algoA.timeComplexity.average, scoreAvgB.score, algoB.timeComplexity.average)}
            {renderComparisonBar('Worst Case Safeguards', scoreWorstA.score, algoA.timeComplexity.worst, scoreWorstB.score, algoB.timeComplexity.worst)}
            {renderComparisonBar('Helper Space Efficiency', scoreSpaceA.score, algoA.spaceComplexity, scoreSpaceB.score, algoB.spaceComplexity)}
          </div>

          {/* Side-by-Side Detailed Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Base Card: Algorithm A */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  A
                </span>
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-neutral-100">{algoA.name}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">{algoA.description}</p>

              {/* Stats table */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl p-3 space-y-2">
                <div className="flex flex-col border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Best Case Time</span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpA(activeHelpA === 'best' ? null : 'best')}
                        className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Explain Best Case"
                        aria-label="Explain Best Case"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoA.timeComplexity.best}</code>
                  </div>
                  {activeHelpA === 'best' && (
                    <div className="mt-1 p-2 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed transition-all">
                      {getScenarioExplanation(algoA.id, 'best')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-semibold font-semibold">Average Case Time</span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpA(activeHelpA === 'average' ? null : 'average')}
                        className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Explain Average Case"
                        aria-label="Explain Average Case"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoA.timeComplexity.average}</code>
                  </div>
                  {activeHelpA === 'average' && (
                    <div className="mt-1 p-2 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed transition-all">
                      {getScenarioExplanation(algoA.id, 'average')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Worst Case Time</span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpA(activeHelpA === 'worst' ? null : 'worst')}
                        className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Explain Worst Case"
                        aria-label="Explain Worst Case"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="bg-rose-50 dark:bg-rose-950/20 text-rose-650 dark:text-rose-405 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoA.timeComplexity.worst}</code>
                  </div>
                  {activeHelpA === 'worst' && (
                    <div className="mt-1 p-2 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed transition-all">
                      {getScenarioExplanation(algoA.id, 'worst')}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate-400">Auxiliary Space</span>
                  <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoA.spaceComplexity}</code>
                </div>
              </div>

              {/* Pros & Cons side list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h5 className="flex items-center gap-1 font-bold text-[10px] uppercase text-slate-400 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Pros
                  </h5>
                  <ul className="space-y-1.5">
                    {insightsA.pros.map((p, i) => (
                      <li key={i} className="text-[11px] text-slate-500 leading-snug flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="flex items-center gap-1 font-bold text-[10px] uppercase text-slate-400 mb-2">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Cons
                  </h5>
                  <ul className="space-y-1.5">
                    {insightsA.cons.map((c, i) => (
                      <li key={i} className="text-[11px] text-slate-500 leading-snug flex items-start gap-1">
                        <span className="text-rose-505 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Real-world usage</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">{insightsA.applications}</p>
              </div>
            </div>

            {/* Target Card: Algorithm B */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-650 dark:text-rose-405 flex items-center justify-center font-bold text-xs">
                  B
                </span>
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-neutral-100">{algoB.name}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">{algoB.description}</p>

              {/* Stats table */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl p-3 space-y-2">
                <div className="flex flex-col border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Best Case Time</span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpB(activeHelpB === 'best' ? null : 'best')}
                        className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Explain Best Case"
                        aria-label="Explain Best Case"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoB.timeComplexity.best}</code>
                  </div>
                  {activeHelpB === 'best' && (
                    <div className="mt-1 p-2 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed transition-all">
                      {getScenarioExplanation(algoB.id, 'best')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-semibold font-semibold">Average Case Time</span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpB(activeHelpB === 'average' ? null : 'average')}
                        className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Explain Average Case"
                        aria-label="Explain Average Case"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoB.timeComplexity.average}</code>
                  </div>
                  {activeHelpB === 'average' && (
                    <div className="mt-1 p-2 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed transition-all">
                      {getScenarioExplanation(algoB.id, 'average')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Worst Case Time</span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpB(activeHelpB === 'worst' ? null : 'worst')}
                        className="text-slate-400 hover:text-indigo-550 dark:hover:text-indigo-400 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Explain Worst Case"
                        aria-label="Explain Worst Case"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="bg-rose-50 dark:bg-rose-950/20 text-rose-650 dark:text-rose-405 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoB.timeComplexity.worst}</code>
                  </div>
                  {activeHelpB === 'worst' && (
                    <div className="mt-1 p-2 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed transition-all">
                      {getScenarioExplanation(algoB.id, 'worst')}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate-400">Auxiliary Space</span>
                  <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded">{algoB.spaceComplexity}</code>
                </div>
              </div>

              {/* Pros & Cons side list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h5 className="flex items-center gap-1 font-bold text-[10px] uppercase text-slate-400 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Pros
                  </h5>
                  <ul className="space-y-1.5">
                    {insightsB.pros.map((p, i) => (
                      <li key={i} className="text-[11px] text-slate-500 leading-snug flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="flex items-center gap-1 font-bold text-[10px] uppercase text-slate-400 mb-2">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Cons
                  </h5>
                  <ul className="space-y-1.5">
                    {insightsB.cons.map((c, i) => (
                      <li key={i} className="text-[11px] text-slate-500 leading-snug flex items-start gap-1">
                        <span className="text-rose-505 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Real-world usage</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">{insightsB.applications}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VISUAL ANALYTICS CHARTS (RECHARTS) */
        <div className="space-y-6">
          {/* Top Row: Growth rate curves and Space footprint */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Time Growth curves */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 flex items-center gap-1.5 font-sans">
                    <Activity className="w-4 h-4" />
                    <span>Time Complexity Growth Rate Comparison</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    How execution cycles scale as dataset size (N) grows. The current algorithm's class <span className="font-bold text-[#7C3AED] dark:text-purple-400">({activeCurveClass})</span> is highlighted.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-black bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] border border-blue-100 dark:border-blue-900/30">
                  Big-O Matrix
                </span>
              </div>
              
              <div className="h-[260px] w-full font-mono text-[9px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="n" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="O(1)" 
                      stroke={activeCurveClass === 'O(1)' ? '#7C3AED' : '#94a3b8'} 
                      strokeWidth={activeCurveClass === 'O(1)' ? 3.5 : 1} 
                      strokeDasharray={activeCurveClass === 'O(1)' ? '0' : '4 4'}
                      dot={activeCurveClass === 'O(1)'}
                      name="Constant O(1)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="O(log N)" 
                      stroke={activeCurveClass === 'O(log N)' ? '#7C3AED' : '#c084fc'} 
                      strokeWidth={activeCurveClass === 'O(log N)' ? 3.5 : 1} 
                      strokeDasharray={activeCurveClass === 'O(log N)' ? '0' : '4 4'}
                      dot={activeCurveClass === 'O(log N)'}
                      name="Logarithmic O(log N)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="O(N)" 
                      stroke={activeCurveClass === 'O(N)' ? '#7C3AED' : '#60a5fa'} 
                      strokeWidth={activeCurveClass === 'O(N)' ? 3.5 : 1} 
                      strokeDasharray={activeCurveClass === 'O(N)' ? '0' : '4 4'}
                      dot={activeCurveClass === 'O(N)'}
                      name="Linear O(N)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="O(N log N)" 
                      stroke={activeCurveClass === 'O(N log N)' ? '#7C3AED' : '#3b82f6'} 
                      strokeWidth={activeCurveClass === 'O(N log N)' ? 3.5 : 1} 
                      strokeDasharray={activeCurveClass === 'O(N log N)' ? '0' : '4 4'}
                      dot={activeCurveClass === 'O(N log N)'}
                      name="Linearithmic O(N log N)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="O(N²)" 
                      stroke={activeCurveClass === 'O(N²)' ? '#7C3AED' : '#f87171'} 
                      strokeWidth={activeCurveClass === 'O(N²)' ? 3.5 : 1} 
                      strokeDasharray={activeCurveClass === 'O(N²)' ? '0' : '4 4'}
                      dot={activeCurveClass === 'O(N²)'}
                      name="Quadratic O(N²)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Space Complexity footprint */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-purple-400 flex items-center gap-1.5 font-sans">
                    <Scale className="w-4 h-4" />
                    <span>Memory Usage Footprint Benchmark (Auxiliary Space)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Workspace memory size in heap/stack allocated at different sizes N. The active model's footprint scales at <span className="font-extrabold text-[#7C3AED] dark:text-purple-400">{currentAlgo.spaceComplexity}</span>.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-black bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED] border border-purple-100 dark:border-purple-900/30">
                  RAM Cost Units
                </span>
              </div>
              
              <div className="h-[260px] w-full font-mono text-[9px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spaceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLinear" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="n" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Area 
                      type="monotone" 
                      dataKey="O(1) In-Place" 
                      stroke="#10b981" 
                      fillOpacity={0}
                      strokeWidth={1.5} 
                      strokeDasharray="4 4"
                      name="O(1) In-Place Baseline"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="O(N) Linear" 
                      stroke="#94a3b8" 
                      fill="url(#colorLinear)"
                      strokeWidth={1.5}
                      name="O(N) Linear Baseline"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Active Memory" 
                      stroke="#2563EB" 
                      fill="url(#colorActive)" 
                      strokeWidth={3}
                      name="Active Memory Overlay"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Bottom Custom comparisons, swaps and relative execution speed */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 flex items-center gap-1.5 font-sans">
                  <BarChart2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>Interactive Swaps, Checks, and Cumulative Relative Execution Cost</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Performance audit metrics comparing active algorithm category peers <span className="font-bold text-[#7C3AED]">("{currentAlgo.category.toUpperCase().replace('_', ' ')}")</span> on uniform workloads.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#2563EB]/10 border border-[#2563EB]/20 text-[10px] font-bold text-[#2563EB]">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>Blue: Rel. Execution Cost</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[10px] font-bold text-[#f59e0b]">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>Orange: Comparisons</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#ef4444]/10 border border-[#ef4444]/20 text-[10px] font-bold text-[#ef4444]">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span>Red: Swaps</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full font-mono text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Bar dataKey="Performance" fill="#2563EB" name="Rel. Execution Cost" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Comparisons" fill="#f59e0b" name="Checks/Comparisons" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Swaps" fill="#ef4444" name="Data Swaps/Writes" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
