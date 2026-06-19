export interface StudyGuideItem {
  id: string;
  name: string;
  concept: string;
  whyLearn: string;
  analogy: string;
  useCases: string[];
}

export const STUDY_GUIDES: Record<string, StudyGuideItem> = {
  bubble_sort: {
    id: "bubble_sort",
    name: "Bubble Sort",
    concept: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements slowly drift ('bubble') to the end of the array with each pass.",
    whyLearn: "It serves as the standard introduction to sorting logic. It teaches the basic mechanics of loops, condition-checking, indexing swaps, and nested loop limits, establishing low-level computer intuition.",
    analogy: "Like bubbles rising in a glass of soda. The biggest bubble (largest value) rises to the surface (the end of the list) quickest, followed by the next largest, until everything is settled.",
    useCases: [
      "Educational instruction to introduce algorithmic comparison and time complexity concepts.",
      "Sorting tiny datasets where simplicity is vital and code footprint is strictly minimized.",
      "Check if an array is already sorted in exactly O(N) time with a single optimized sweep."
    ]
  },
  selection_sort: {
    id: "selection_sort",
    name: "Selection Sort",
    concept: "Divides the array into sorted and unsorted regions. It continuously sweeps the unsorted part to locate the absolute smallest element, then swaps it directly to its final position at the front.",
    whyLearn: "Teaches the concept of keeping status indicators (like indices of global minimums) and minimizes actual write/swap cycles to O(N) operations, which is highly optimal when writing to memory is expensive.",
    analogy: "Imagine picking the shortest person in a random crowd, swapping them with the person at the front, then selecting the next shortest in the remaining crowd, repeating until they are lined up.",
    useCases: [
      "Systems with flash memory or EEPROM, where writing data is significantly more costly than reading it (swaps are capped at O(N)).",
      "Finding top K items within a list without fully sorting the rest of the array.",
      "Embedded microcontrollers running ultra-low memory footprints."
    ]
  },
  insertion_sort: {
    id: "insertion_sort",
    name: "Insertion Sort",
    concept: "Iterates through the list, removing one element at a time and sliding it backward until it lands in its correct position among the already-sorted items.",
    whyLearn: "Demonstrates online-sorting (sorting data as it arrives sequentially). Highly efficient for arrays that are already nearly sorted, performing in close to linear time.",
    analogy: "Like sorting a hand of playing cards deals. You hold some sorted cards, pick up a new card, slide it backward past higher cards, and drop it into its natural spot.",
    useCases: [
      "Adaptive hybrid engines like Timsort (used in Python and Java) which fall back to Insertion Sort for sub-chunks smaller than 64 items.",
      "Real-time sensor arrays receiving small chunks of streaming data that need immediate ordering.",
      "Sorting a user list that is already 95% sorted with bare-minimum CPU overhead."
    ]
  },
  merge_sort: {
    id: "merge_sort",
    name: "Merge Sort",
    concept: "A brilliant divide-and-conquer strategy. It repeatedly splits the list in halves down to single-element arrays, then merges those tiny sorted segments back together in sorted order.",
    whyLearn: "Introduces recursion, divide-and-conquer paradigms, and the trade-off of using auxiliary memory (Space O(N)) to guarantee stable, predictable sorting speed (O(N log N)) under all conditions.",
    analogy: "Think of a large pile of documents. You split the pile in half among two assistants, who split theirs among four others, and so on. Once they arrange their tiny single-page slots, they pass them back, merging them sequentially.",
    useCases: [
      "External sorting of massive databases that are too large to fit in RAM (runs from disk streams).",
      "Guarantees stable sorting where identical values maintain their original relative order (vital in spreadsheet columns).",
      "E-commerce product lists merging multiple pre-sorted inventory channels."
    ]
  },
  quick_sort: {
    id: "quick_sort",
    name: "Quick Sort",
    concept: "Selects a 'pivot' value, partitions all other items into two camps (those smaller than pivot, and those larger), then recursively applies the same strategy to both halves.",
    whyLearn: "Teaches partition mathematics and shows how random or median pivot selection keeps recursive trees shallow, achieving superb cache locality and outstanding average-case performance.",
    analogy: "A teacher organizing children by height. They pick one student in the middle, tell all shorter kids to stand on the left, taller kids on the right, then repeat the drill for each partition group.",
    useCases: [
      "General-purpose standard sorting systems (like dual-pivot Quicksort in Java arrays, C++ std::sort).",
      "Virtual memory sorting environments where minimizing extra auxiliary space overhead is paramount.",
      "High-speed numerical engines valuing excellent cache utilization."
    ]
  },
  heap_sort: {
    id: "heap_sort",
    name: "Heap Sort",
    concept: "Converts the array into a Binary Max-Heap visualization. It repeatedly swaps the root element (the absolute maximum) with the last element of the heap, and refilters the new root to maintain heap rules.",
    whyLearn: "Integrates tree logic (heaps) directly inside flat linear arrays without dynamic pointer overhead. Combines the best of Selection Sort (selection behavior) with speed of trees.",
    analogy: "A tournament bracket where the eventual winner is determined at the top, taken away, and the remaining contestants re-compete for the silver, and so forth.",
    useCases: [
      "Embedded operating systems where worst-case memory boundaries must be strictly calculated (O(log n) auxiliary stack space, O(N log N) speed maximum).",
      "Real-time graphics systems or flight controllers with safety-critical loops.",
      "In-place sorting without extra dynamic RAM allocations."
    ]
  },
  linear_search: {
    id: "linear_search",
    name: "Linear Search",
    concept: "Inspects elements one by one, from top to bottom, until a matching target value is discovered or the index list is completely exhausted.",
    whyLearn: "Establishes the fundamental baseline for lookup queries. Teaches worst-case analysis (element not present) and linear scans.",
    analogy: "Walking down a long hotel corridor knocking on every single door in numerical order to see if your friend is inside.",
    useCases: [
      "Scanning highly unsorted, small data groups where overhead of sorting first outweighs sequential lookup cost.",
      "Searching single linked lists or simple streams of items.",
      "Validating input fields or searching dynamic keys in basic associative models."
    ]
  },
  binary_search: {
    id: "binary_search",
    name: "Binary Search",
    concept: "An incredibly fast binary-division technique. It targets the middle element of a pre-sorted list, discards the half that cannot contain the target, and repeats.",
    whyLearn: "Demonstrates the massive mathematical scale of logarithmic time O(log n). For example, searching 1 Billion items takes at most 30 comparison operations!",
    analogy: "Searching for a name in a massive paper dictionary. You flip to the middle page, determine if your word is earlier or later alphabetically, tear the other half away, and continue.",
    useCases: [
      "Database systems finding keys in sorted indexes or B-Tree nodes.",
      "Debugging tools running 'git bisect' to check which commit introduced a breaking compiler bug.",
      "Searching for elements in vast directories, lookup lists, or IP address routers."
    ]
  },
  jump_search: {
    id: "jump_search",
    name: "Jump Search",
    concept: "Works on pre-sorted arrays. Steps forward by fixed intervals of size √N. Once it overshoots the target value, it backtracks and performs a linear search inside that specific block.",
    whyLearn: "Shows how to combine jumping steps (to avoid excessive lookups) with linear scans, proving that the optimal gap size is mathematically standard at around √N steps.",
    analogy: "An elevator in a tall building. If you want floor 23, you take an express elevator that only stops at floors 10, 20, 30. You jump to 30, realize you went too far, and take local steps down/up.",
    useCases: [
      "Systems where backtracking is cheap but jumping forward is expensive.",
      "Reading audio/video media blocks that are highly indexed and streamed.",
      "Searching in sequential storage media where scanning linearly inside small zones is optimized by cache hardware."
    ]
  },
  stack_operations: {
    id: "stack_operations",
    name: "Stack Operations",
    concept: "Provides a Last-In, First-Out (LIFO) visualizer container. Items are added (pushed) to the top and retrieved (popped) from the exact same top end.",
    whyLearn: "Fundamental for tracking state, nested operations, memory frames, recursive return chains, and managing backtracking coordinates.",
    analogy: "A vertical stack of dinner plates. You can only safely put a new plate on the very top, and to clean or use one, you must lift it off the top.",
    useCases: [
      "The call stack mechanism in programming languages tracking active functions and local variable contexts.",
      "Implementing 'Undo' (Ctrl+Z) functionality in text editors, graphic design suites, or word processes.",
      "Syntactic parsing of balanced parenthesis, bracket groups, or XML/HTML markup nests."
    ]
  },
  queue_operations: {
    id: "queue_operations",
    name: "Queue Operations",
    concept: "Provides a First-In, First-Out (FIFO) linear buffer. Elements join from the rear (enqueue) and depart from the front (dequeue). Priority queues order items based on priority rules.",
    whyLearn: "Shows how to govern fair, orderly processing pipelines. Introduces wrap-around modular buffers (circular queues) and prioritization logic (heaps).",
    analogy: "A standard checkout line at a retail store. The first customer to stand in line is the first one served and checked out.",
    useCases: [
      "Operating system thread schedulers and printer spoolers queueing incoming jobs dynamically.",
      "Buffering streaming packet layers (audio/video players) to ensure continuous, steady playback speed.",
      "Spreading server workloads across worker nodes in distributed queue pipelines (e.g., RabbitMQ, Kafka)."
    ]
  },
  linked_list_ops: {
    id: "linked_list_ops",
    name: "Linked List Operations",
    concept: "A flexible sequence of node packages connected by explicit reference links (pointers). Inserting or deleting items is as simple as re-routing pointer directions.",
    whyLearn: "Bypasses the static memory sizes of standard sequential arrays. Demonstrates reference manipulation, pointer updates, and dynamic heap RAM structures.",
    analogy: "A scavenger hunt game. Each clue has a box of treasure and a handwritten note indicating the coordinates of the next box.",
    useCases: [
      "Underpinning other data structures like queue and stack engines.",
      "The underlying architecture of browser history backward and forward tabs (Doubly Linked Lists).",
      "Managing memory blocks in low-level operating system memory allocators."
    ]
  },
  bst_operations: {
    id: "bst_operations",
    name: "Binary Search Tree",
    concept: "A highly hierarchical dynamic tree layout. Each node has at most two children. The left subtree contains smaller values, whereas the right contains higher values, dividing search space recursively.",
    whyLearn: "Teaches parent-child navigation, recursive insertions, tree traversal paths (In-order, Pre-order, Post-order), and highlights the need for dynamic self-balancing rules (like AVL/Red-Black).",
    analogy: "A highly organized corporate hierarchy. When a query is made, it moves down to the corresponding branch manager, repeatedly diving until finding the exact staff member.",
    useCases: [
      "File systems on computer hard drives (folders containing subfolders and individual files).",
      "Dynamic database indexes allowing fast logarithmic queries and high-speed in-order ranges.",
      "Representing complex hierarchical relationships in game engine rendering trees."
    ]
  },
  heap_trie_ops: {
    id: "heap_trie_ops",
    name: "Heap & Trie Structures",
    concept: "Heaps maintain constant access to the highest-priority element while Tries are specialized character-link structures that match text prefixes instantly.",
    whyLearn: "Teaches key-based hierarchy search optimization and suffix/prefix matching. Demonstrates search spaces based on character inputs rather than numerical value comparisons.",
    analogy: "An alphabetized book index or phonebook directory. Searching for 'ALGO' starts at 'A', then crawls directly down the child leaf for 'L', then 'G', then 'O'.",
    useCases: [
      "Auto-complete and predictive keyboards resolving words as you type in search engines.",
      "Router IP routing tables checking longest prefix match filters.",
      "Spell checkers resolving dictionary spelling errors immediately."
    ]
  },
  graph_algorithms: {
    id: "graph_algorithms",
    name: "Graph Pathfinding & Traversals",
    concept: "Analyzes nodes (vertices) linked by highways (edges). It tracks the exploration of paths (Breadth-First, Depth-First) and finds shortest distances on highway weights (Dijkstra, A*).",
    whyLearn: "The peak of computer science structure modeling. Shows how to model real-world networks (roads, social bonds, routers) and resolve path finding on weighted structures.",
    analogy: "A GPS navigation system calculating the fastest route to your destination. It checks traffic weights on various exit ramps and picks the mathematical shortest path.",
    useCases: [
      "GPS map applications (Google Maps, Apple Maps) computing step-by-step navigation instructions.",
      "Social media friend suggestion algorithms (Facebook, LinkedIn showing 1st, 2nd, 3rd connections).",
      "Network routing protocols determining which server paths forward internet packets quickest."
    ]
  }
};
