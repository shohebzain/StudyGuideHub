export type AlgorithmCategory = 'sorting' | 'searching' | 'stack_queue' | 'linked_list' | 'trees' | 'heaps_tries' | 'graphs';

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  pseudocode: string[];
}

export interface VizStep {
  array?: number[];
  currentIndexes?: number[];
  compareIndexes?: number[];
  swapIndexes?: number[];
  sortedIndexes?: number[];
  foundIndex?: number;
  highlightedNodes?: string[]; // BST, Heap, Trie, Graph nodes
  highlightedEdges?: string[]; // Graph edges
  description: string;
  codeLine?: number; // 0-indexed line number in the pseudocode
  
  // Dynamic general state metadata
  stackState?: { values: number[]; activeElement?: number; action?: 'push' | 'pop' | 'peek' | 'idle' };
  queueState?: { values: number[]; activeElement?: number; action?: 'enqueue' | 'dequeue' | 'peek' | 'idle'; type: 'linear' | 'circular' | 'priority' };
  linkedListState?: { nodes: { id: string; value: number; nextId: string | null }[]; activeNodeId?: string | null; action?: string };
  treeState?: { root: TreeNode | null; activeId?: string | null; visitedIds?: string[] };
  heapState?: { array: number[]; activeIdx?: number; swapIdx1?: number; swapIdx2?: number };
  trieState?: { words: string[]; searchWord: string; pathFound: string[]; searchResult: boolean };
  graphState?: { 
    nodes: GraphNode[]; 
    edges: GraphEdge[]; 
    visitedNodes?: string[]; 
    pathNodes?: string[]; 
    activeNodeId?: string | null;
    activeEdgeId?: string | null;
  };
}

// Tree structure interface
export interface TreeNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
  height: number;
  balance?: number;
  // Position coordinates for rendering
  x?: number;
  y?: number;
}

// Trie Node representation
export interface TrieNode {
  char: string;
  isEnd: boolean;
  children: { [key: string]: TrieNode };
}

// Graph interfaces
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  isDirected?: boolean;
}

export const ALGORITHMS_LIST: AlgorithmInfo[] = [
  // Sorting Category
  {
    id: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'bubbleSort(A):',
      '  for i from 0 to A.length - 1:',
      '    for j from 0 to A.length - i - 2:',
      '      if A[j] > A[j+1] then:',
      '        swap(A[j], A[j+1])'
    ]
  },
  {
    id: 'selection_sort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Selection Sort divides the input list into two parts: a sorted sublist at the beginning, and an unsorted remaining sublist. It repeatedly finds the minimum element from the unsorted sublist and moves it to the beginning of the unsorted sublist.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'selectionSort(A):',
      '  for i from 0 to A.length - 1:',
      '    minIndex = i',
      '    for j from i + 1 to A.length - 1:',
      '      if A[j] < A[minIndex] then: minIndex = j',
      '    if minIndex != i then:',
      '      swap(A[i], A[minIndex])'
    ]
  },
  {
    id: 'insertion_sort',
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Insertion Sort builds the final sorted array one item at a time. It takes each element from the unsorted region and inserts it into its correct position within the sorted region, shifting larger elements as needed.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'insertionSort(A):',
      '  for i from 1 to A.length - 1:',
      '    key = A[i]',
      '    j = i - 1',
      '    while j >= 0 and A[j] > key:',
      '      A[j + 1] = A[j]',
      '      j = j - 1',
      '    A[j + 1] = key'
    ]
  },
  {
    id: 'merge_sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'Merge Sort is a Divide-and-Conquer algorithm. It recursively divides the array into halves, sorts each half, and then merges the sorted halves into a single sorted array.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'mergeSort(A, left, right):',
      '  if left < right then:',
      '    mid = (left + right) / 2',
      '    mergeSort(A, left, mid)',
      '    mergeSort(A, mid + 1, right)',
      '    merge(A, left, mid, right)'
    ]
  },
  {
    id: 'quick_sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'Quick Sort is a highly efficient Divide-and-Conquer sorting algorithm. It selects a "pivot" element and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'quickSort(A, low, high):',
      '  if low < high then:',
      '    pivotIndex = partition(A, low, high)',
      '    quickSort(A, low, pivotIndex - 1)',
      '    quickSort(A, pivotIndex + 1, high)'
    ]
  },
  {
    id: 'heap_sort',
    name: 'Heap Sort',
    category: 'sorting',
    description: 'Heap Sort utilizes a Binary Heap data structure. It first transforms the unsorted array into a Max-Heap, then repeatedly extracts the maximum element and restores the heap property on the remaining elements.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'heapSort(A):',
      '  buildMaxHeap(A)',
      '  for i from A.length - 1 down to 1:',
      '    swap(A[0], A[i])',
      '    maxHeapify(A, 0, i)'
    ]
  },

  // Searching Category
  {
    id: 'linear_search',
    name: 'Linear Search',
    category: 'searching',
    description: 'Linear Search scans each element of the array sequentially starting from the beginning until a match is found or the end of the array is reached.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'linearSearch(A, target):',
      '  for i from 0 to A.length - 1:',
      '    if A[i] == target then:',
      '      return i',
      '  return -1'
    ]
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'searching',
    description: 'Binary Search is a fast interval-halving algorithm. It works on sorted arrays by repeatedly comparing the target to the middle element, discarding the half where the target cannot lie.',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'binarySearch(A, target):',
      '  low = 0, high = A.length - 1',
      '  while low <= high:',
      '    mid = (low + high) / 2',
      '    if A[mid] == target then return mid',
      '    else if A[mid] < target then low = mid + 1',
      '    else high = mid - 1',
      '  return -1'
    ]
  },
  {
    id: 'jump_search',
    name: 'Jump Search',
    category: 'searching',
    description: 'Jump Search works on sorted arrays by jumping forward by constant steps of size √n, then performing a backward linear search once the interval containing the target is found.',
    timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'jumpSearch(A, target):',
      '  n = A.length, step = floor(sqrt(n))',
      '  prev = 0',
      '  while A[min(step, n) - 1] < target:',
      '    prev = step',
      '    step = step + floor(sqrt(n))',
      '    if prev >= n return -1',
      '  while A[prev] < target:',
      '    prev = prev + 1',
      '    if prev == min(step, n) return -1',
      '  if A[prev] == target return prev',
      '  return -1'
    ]
  },
  {
    id: 'ternary_search',
    name: 'Ternary Search',
    category: 'searching',
    description: 'Ternary Search is a divide-and-conquer algorithm that divides the search space into three equal parts using two midpoints (mid1 and mid2), reducing the search range logarithmic to base 3.',
    timeComplexity: { best: 'O(1)', average: 'O(log₃ n)', worst: 'O(log₃ n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'ternarySearch(A, target):',
      '  low = 0, high = A.length - 1',
      '  while low <= high:',
      '    mid1 = low + (high - low) / 3',
      '    mid2 = high - (high - low) / 3',
      '    if A[mid1] == target return mid1',
      '    if A[mid2] == target return mid2',
      '    if target < A[mid1] high = mid1 - 1',
      '    else if target > A[mid2] low = mid2 + 1',
      '    else low = mid1 + 1, high = mid2 - 1',
      '  return -1'
    ]
  },
  {
    id: 'exponential_search',
    name: 'Exponential Search',
    category: 'searching',
    description: 'Exponential Search dynamically finds the range where the target resides by doubling the index step size (1, 2, 4, 8...), then executes a targeted binary search within that discovered subarray.',
    timeComplexity: { best: 'O(1)', average: 'O(log i)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'exponentialSearch(A, target):',
      '  if A[0] == target return 0',
      '  i = 1',
      '  while i < A.length and A[i] <= target:',
      '    i = i * 2',
      '  return binarySearch(A, target, i/2, min(i, A.length - 1))'
    ]
  },

  // Stack & Queue
  {
    id: 'stack_operations',
    name: 'Stack operations',
    category: 'stack_queue',
    description: 'A Stack is a Last-In, First-Out (LIFO) linear data structure. Elements are inserted (Push) and removed (Pop) from the same end, called the Top.',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'push(item):',
      '  top = top + 1',
      '  Stack[top] = item',
      'pop():',
      '  if isEmpty() error Underflow',
      '  item = Stack[top]',
      '  top = top - 1',
      '  return item'
    ]
  },
  {
    id: 'queue_operations',
    name: 'Queue operations',
    category: 'stack_queue',
    description: 'A Queue is a First-In, First-Out (FIFO) linear data structure. Elements are inserted at the back (Enqueue) and removed from the front (Dequeue). Priority Queues pull highest priority, while Circular Queues wrap around.',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'enqueue(item):',
      '  if full index wrap-around / overflow',
      '  rear = (rear + 1) % size',
      '  Queue[rear] = item',
      'dequeue():',
      '  if emptyIndex error Underflow',
      '  item = Queue[front]',
      '  front = (front + 1) % size',
      '  return item'
    ]
  },

  // Linked List
  {
    id: 'linked_list_ops',
    name: 'Linked List ops',
    category: 'linked_list',
    description: 'A Linked List is a dynamic linear collection of nodes where each node points to the next node. Allows for efficient insertion and deletion compared to standard arrays.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'insertAtHead(value):',
      '  newNode = create Node(value)',
      '  newNode.next = head',
      '  head = newNode',
      'deleteNode(value):',
      '  curr = head, prev = null',
      '  find node and adjust pointers:',
      '  prev.next = curr.next'
    ]
  },

  // Trees (BST, AVL)
  {
    id: 'bst_operations',
    name: 'BST operations',
    category: 'trees',
    description: 'A Binary Search Tree (BST) is a hierarchical node-based structure where left child is less than root, and right child is greater than root. AVL Trees self-balance such that heights of subtrees differ by at most 1.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'insertBST(node, val):',
      '  if node is null return Node(val)',
      '  if val < node.val:',
      '    node.left = insertBST(node.left, val)',
      '  else:',
      '    node.right = insertBST(node.right, val)',
      '  return node'
    ]
  },

  // Heaps & Tries
  {
    id: 'heap_trie_ops',
    name: 'Heap & Trie operations',
    category: 'heaps_tries',
    description: 'Min/Max Heaps are complete binary trees visualizable as arrays satisfying heap properties. Tries are prefix search trees optimal for lookup of words and prefixes.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n * L) where L is length of strings',
    pseudocode: [
      'insertTrie(word):',
      '  curr = root',
      '  for char in word:',
      '    if curr.children[char] is empty:',
      '      curr.children[char] = Node',
      '    curr = curr.children[char]',
      '  curr.isEndOfWord = true'
    ]
  },

  // Graphs
  {
    id: 'graph_algorithms',
    name: 'Graph and Pathfinding',
    category: 'graphs',
    description: 'Explore fundamental Graph traversals (BFS, DFS, Topological Sort) and Pathfinding (Dijkstra, Prim, Kruskal, A* search) with custom node placements or responsive obstacle grids.',
    timeComplexity: { best: 'O(E log V)', average: 'O(V + E)', worst: 'O(V²)' },
    spaceComplexity: 'O(V + E)',
    pseudocode: [
      'dijkstra(Graph, source):',
      '  dist[source] = 0',
      '  PQ.push({0, source})',
      '  while PQ is not empty:',
      '    u = PQ.pop()',
      '    for each neighbor v of u:',
      '      if dist[u] + weight(u, v) < dist[v]:',
      '        dist[v] = dist[u] + weight(u, v)',
      '        PQ.push({dist[v], v})'
    ]
  }
];
