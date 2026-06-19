import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Award, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Download, 
  Send, 
  HelpCircle, 
  Flame, 
  TrendingUp, 
  Activity, 
  Code, 
  Tag, 
  Sparkles, 
  Brain, 
  CheckCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  MapPin,
  GitFork,
  Database,
  ArrowUpDown,
  SearchIcon,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

// --- STUDY GUIDE DATA MODEL ---
interface TopicContent {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  overview: string;
  timeComplexity: {
    insert: string;
    delete: string;
    search: string;
  };
  spaceComplexity: string;
  codeSnippets: {
    java: string;
    python: string;
    cpp: string;
    javascript: string;
  };
  realWorldApps: {
    title: string;
    desc: string;
    icon: React.ComponentType<any>;
  }[];
  interviewPrep: {
    faqs: string[];
    mistakes: string[];
    edges: string[];
    optimization: string;
    followups: string[];
    leetcodeDifficulty: 'Easy' | 'Medium' | 'Hard';
  };
  problems: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    estTime: string;
    url?: string;
  }[];
  defaultPlayground: number[]; // Initial numbers for simulator
  operations: string[];
}

const STUDY_TOPICS: Record<string, TopicContent> = {
  arrays: {
    id: 'arrays',
    name: 'Arrays',
    difficulty: 'Beginner',
    tags: ['Data Structures', 'Contiguous Memory', 'Offset Indexing'],
    overview: `■ CONCEPT & CONTIGUOUS LAYOUT
An Array is a foundational linear data structure that stores elements of identical types in contiguous (directly adjacent) memory blocks. When you initialize an array, the system reserves a solid, uninterrupted sequence of RAM bytes fit to host the specified capacity. Because slots are back-to-back, the compiler needs only the starting (base) coordinate to look up any value in O(1) time using simple index pointer arithmetic: MemoryAddress[i] = BaseAddress + (i * TypeSizeInBytes).

■ DETAILED CRITICAL OPERATIONS & TIME COMPLEXITY ANALYSIS
1. ACCESS [ O(1) ]: Reading or writing a values at a known index resides at absolute O(1) complexity. Index offsets map directly to mechanical physical layout, entirely skipping list iteration overhead.
2. SEARCH [ O(N) ]: Standard searching for an arbitrary value takes linear O(N) time because we must traverse and inspect slots from index 0 up to N-1 (linear sweep). However, if elements are pre-sorted, we can optimize search tracking to O(log N) using Binary Search bisection.
3. INSERTION [ O(N) ]: Adding a new element at any arbitrary index requires shifting all succeeding values one index to the right to prevent splitting contiguity. Tail insertions are O(1) average (amortized in dynamic lists like Java's ArrayList), but inserting at the front incurs a heavy O(N) relocation penalty.
4. DELETION [ O(N) ]: Deleting a record leaves a hole in the sequence. To sustain direct contiguous physical mapping, all trailing elements must slide leftward by one slot, requiring O(N) linear operations.

■ BIG-O COMPLEXITY REFERENCE CHART
• Access: O(1) Constant (Immediate register lookup)
• Search: O(N) Linear (Worst-case scan of N slots)
• Insertion: O(N) Linear (Overhead of element shift loops)
• Deletion: O(N) Linear (Overhead of left-shift compaction)`,
    timeComplexity: { insert: 'O(N)', delete: 'O(N)', search: 'O(N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java Array Masterclass: Core Operations
public class ArrayOverview {
    public static void main(String[] args) {
        // 1. Declaration & fixed memory allocation
        int[] numbers = new int[6];
        
        // 2. Direct O(1) Indexed Insertion/Access
        numbers[0] = 5;
        numbers[1] = 12;
        numbers[2] = 19;
        numbers[3] = 23;
        
        System.out.println("O(1) Access: " + numbers[2]); // Prints 19
        
        // 3. Search Operation (O(N) Linear Scan)
        int target = 19;
        int targetIndex = linearSearch(numbers, target);
        System.out.println("Found target at index: " + targetIndex);
        
        // 4. Insertion in Middle (O(N) shifts)
        // Inserting 99 at index 1
        numbers = insertAt(numbers, 1, 99, 4);
    }
    
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
    
    public static int[] insertAt(int[] arr, int idx, int val, int currentSize) {
        // Shift trailing elements to write space
        for (int i = currentSize; i > idx; i--) {
            arr[i] = arr[i - 1];
        }
        arr[idx] = val; // Store value
        return arr;
    }
}`,
      python: `# Python Array & List Operations Masterclass

# 1. Declaration (Dynamic Array / List)
num_list = [5, 12, 19, 23]

# 2. O(1) Direct Index Access
accessed_value = num_list[2]
print(f"O(1) Instant Lookup at index 2: {accessed_value}")

# 3. O(N) Linear Search Implementation
def search_array(target_val, target_list):
    for index, val in enumerate(target_list):
        if val == target_val:
            return index # O(N) match
    return -1

match_index = search_array(19, num_list)
print(f"Target found at index: {match_index}")

# 4. Insertion at Arbitrary Location (O(N) Shifting)
# Inserting value 99 at index 1 shifts all trailing items to the right
num_list.insert(1, 99)
print(f"List after O(N) insertion: {num_list}")

# 5. Deletion from Arbitrary Location (O(N) Left-Shifts)
# Removing element at index 3 forces succeeding values to slide left
num_list.pop(3)
print(f"List after O(N) deletion: {num_list}")`,
      cpp: `// C++ STL Vector operations
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec = {5, 12, 19, 23};
    vec.push_back(42); // Amortized O(1) tail insert
    cout << "O(1) Access: " << vec[2] << endl;
    return 0;
}`,
      javascript: `// JavaScript Arrays
const arr = [5, 12, 19, 23];
arr.splice(1, 0, 99); // O(N) insertion
console.log("O(1) Access: " + arr[2]);`
    },
    realWorldApps: [
      { title: 'Database Record Indexes', desc: 'Saves memory record keys sequentially, enabling rapid random-offset disk/RAM hits.', icon: Database },
      { title: 'Graphic Frame Buffering', desc: 'Flat pixel matrices mapped contiguously enable instant O(1) rendering updates.', icon: Layers },
      { title: 'Network Data Packet Queues', desc: 'Pre-allocates bulk sequential arrays to handle fast high-throughput packet indexing.', icon: Cpu }
    ],
    interviewPrep: {
      faqs: [
        'Can arrays alter size dynamically? Static arrays cannot; dynamic arrays (like Java ArrayList) allocate a 2x scale array and copy items when filled.',
        'Why do index markers root at 0? The key index represents the numeric offset scale from the base memory start pointer.'
      ],
      mistakes: [
        'Falling into Off-By-One loop limits (attempting to write elements at arr[length]).',
        'Confusing amortized tail inserts O(1) with linear operations inside arbitrary indices.'
      ],
      edges: [
        'Uninitialized lists / Null parameter errors.',
        'Accessing index coordinates on single-item indexes.',
        'Failing to scale capacity bounds when loading inputs.'
      ],
      optimization: 'Leverage dual left/right pointers to traverse sorted arrays in-place to avoid extra space copies.',
      followups: [
        'Explain the resizing load factor thresholds inside Java Vector models.',
        'Can you sort dynamic arrays of strings in stable O(N) auxiliary space constraints?'
      ],
      leetcodeDifficulty: 'Easy'
    },
    problems: [
      { id: 'arr-1', title: 'Two Sum (Hash Map Lookup)', difficulty: 'Easy', estTime: '15 mins' },
      { id: 'arr-2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', estTime: '12 mins' },
      { id: 'arr-3', title: 'Container With Most Water', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'arr-4', title: 'Maximum Subarray (Kadane\'s)', difficulty: 'Medium', estTime: '20 mins' },
      { id: 'arr-5', title: 'First Missing Positive', difficulty: 'Hard', estTime: '45 mins' }
    ],
    defaultPlayground: [5, 12, 19, 23, 42, 6],
    operations: ['Insert', 'Delete', 'Lookup', 'Reverse', 'Randomize']
  },
  strings: {
    id: 'strings',
    name: 'Strings',
    difficulty: 'Beginner',
    tags: ['Sequences', 'Immutable', 'Char'],
    overview: 'Strings are sequences of characters. In many programming ecosystems, string objects are immutable, meaning any mutation builds a new string copy. Pattern matching is a core string discipline.',
    timeComplexity: { insert: 'O(N)', delete: 'O(N)', search: 'O(N + M)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java String builder optimization\nStringBuilder sb = new StringBuilder();\nsb.append("Hello ");\nsb.append("World");\nString res = sb.toString(); // O(N) build`,
      python: `# Python string manipulation\ns = "algorithm"\nreversed_s = s[::-1] # Fast slice reverse\n\n# Substring validation\nhas_sub = "gori" in s`,
      cpp: `// C++ std::string\n#include <string>\nusing namespace std;\nstring s = "Interactive classroom";\ns += " engine"; // Concats dynamically`,
      javascript: `// JavaScript patterns\nlet str = "LeetCode Learn";\nlet token = str.substring(0, 8); // "LeetCode"\nconst matched = str.includes("Learn");`
    },
    realWorldApps: [
      { title: 'Search Engine Queries', desc: 'Autocomplete inputs processing millions of text query tokens per sec.', icon: SearchIcon },
      { title: 'DNA Sequencing Matching', desc: 'Evaluating genomic sequences (A, C, T, G combinations) for mutations.', icon: GitFork },
      { title: 'HTML Layout Parsing', desc: 'Interpreting bracket markup strings into visual nested render trees.', icon: Code }
    ],
    interviewPrep: {
      faqs: [
        'Why are strings immutable in Java? For thread-safety, security, and caching in the string constant pool.',
        'What is a palindrome string? A string that reads the exact same forwards and backwards.'
      ],
      mistakes: [
        'Concatenating strings inside a loop using simple "+" prefixes, causing catastrophic O(N²) memory allocation blocks.',
        'Ignoring case mismatch rules when comparing characters directly.'
      ],
      edges: [
        'Empty strings "" inputs.',
        'Single character strings.',
        'Strings filled with spaces only.'
      ],
      optimization: 'Use a dynamic sliding window sequence to evaluate subpatterns in exactly O(N) linear time.',
      followups: [
        'How does Rabin-Karp use rolling hashes to accelerate pattern searches?',
        'Can you implement pattern lookup without comparing every character sequentially?'
      ],
      leetcodeDifficulty: 'Easy'
    },
    problems: [
      { id: 'str-1', title: 'Valid Palindrome', difficulty: 'Easy', estTime: '12 mins' },
      { id: 'str-2', title: 'Longest Substring Without Repeating Chars', difficulty: 'Medium', estTime: '30 mins' },
      { id: 'str-3', title: 'Minimum Window Substring', difficulty: 'Hard', estTime: '55 mins' }
    ],
    defaultPlayground: [65, 76, 71, 79, 82, 73], // ASCII codes for ALGORI
    operations: ['Uppercase', 'Reverse', 'Find Pattern', 'Check Palindrome', 'Reset']
  },
  stack: {
    id: 'stack',
    name: 'Stack',
    difficulty: 'Intermediate',
    tags: ['LIFO', 'Linear', 'Restricted'],
    overview: 'A Stack is a Last-In-First-Out (LIFO) data structure. The element inserted last is the first one to be removed. All operations occur at a single boundary point called the top.',
    timeComplexity: { insert: 'O(1)', delete: 'O(1)', search: 'O(N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java Stack implementation\nimport java.util.Stack;\nStack<Integer> stk = new Stack<>();\nstk.push(10); // O(1)\nstk.push(20);\nint topElement = stk.peek(); // 20 - O(1)\nint deleted = stk.pop(); // 20 - O(1)`,
      python: `# Python List as Stack\nstack = []\nstack.append(50)  # Push\nstack.append(100)\n\n# Peek & Pop\ntop_val = stack[-1]\npopped_val = stack.pop()`,
      cpp: `// C++ STL std::stack\n#include <stack>\nusing namespace std;\nstack<int> s;\ns.push(5); s.push(3);\nint curRef = s.top(); // Peek\ns.pop(); // Pop element`,
      javascript: `// JavaScript Stack array\nconst stack = [];\nstack.push("page_1"); // Push\nstack.push("page_2");\n\nconst curPage = stack[stack.length - 1]; // Peek\nconst lastVisited = stack.pop(); // Pop`
    },
    realWorldApps: [
      { title: 'Undo / Redo Managers', desc: 'Pushes editor state objects to a stack; popping restores previous edits.', icon: RotateCcw },
      { title: 'Browser Navigation History', desc: 'Pops standard visited pages as you press the back arrow button.', icon: BookOpen },
      { title: 'Language Recusive Call Stacks', desc: 'CPU pushes instruction pointers on nested compiler functions.', icon: Cpu }
    ],
    interviewPrep: {
      faqs: [
        'How can you implement a stack with O(1) support for retrieving the minimum element? Use an auxiliary minStack to track parallel minimums.',
        'What causes a StackOverflow error? Exceeding stack bounds from infinite, nested recursive calls.'
      ],
      mistakes: [
        'Attempting to pop from an empty stack, generating fatal NullPointer/Underflow errors.',
        'Storing items with variable sizes without adjusting capacity offsets.'
      ],
      edges: [
        'Pop on empty stack bounds.',
        'Extremely deep recursion layers.',
        'Capacity caps on array-based static stack frames.'
      ],
      optimization: 'Use a linked list internally to avoid resizing arrays when stack expands beyond pre-allocated boundaries.',
      followups: [
        'How would you sort a stack using recursion and no extra stack instances?',
        'Can you build a queue using two stacks?'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'stk-1', title: 'Valid Parentheses', difficulty: 'Easy', estTime: '15 mins' },
      { id: 'stk-2', title: 'Min Stack', difficulty: 'Medium', estTime: '20 mins' },
      { id: 'stk-3', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', estTime: '50 mins' }
    ],
    defaultPlayground: [10, 20, 30],
    operations: ['Push', 'Pop', 'Peek', 'Is Empty', 'Reset']
  },
  queue: {
    id: 'queue',
    name: 'Queue',
    difficulty: 'Intermediate',
    tags: ['FIFO', 'Linear', 'Buffer'],
    overview: 'A Queue is structured as First-In-First-Out (FIFO). Elements entry at the back (rear) and exit/depart from the front. Ensures fair, chronological sequence management.',
    timeComplexity: { insert: 'O(1)', delete: 'O(1)', search: 'O(N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java LinkedList as Queue\nimport java.util.Queue;\nimport java.util.LinkedList;\nQueue<String> q = new LinkedList<>();\nq.offer("Job A"); // Enqueue\nq.offer("Job B");\nString processing = q.poll(); // Dequeue - O(1)`,
      python: `# Python deque for O(1) queue bounds\nfrom collections import deque\nq = deque()\nq.append("Task 1") # Enqueue\nq.append("Task 2")\n\nactive = q.popleft() # Dequeue - True O(1)`,
      cpp: `// C++ Queue standard header\n#include <queue>\nusing namespace std;\nqueue<int> q;\nq.push(100); q.push(200); // Enqueue\nint frontVal = q.front(); // Peek\nq.pop(); // Dequeue`,
      javascript: `// JS Shift causes O(N) array rebuilding - use custom Queue node class instead!\nclass SimpleQueue {\n  constructor() { this.items = {}; this.head = 0; this.tail = 0; }\n  enqueue(v) { this.items[this.tail++] = v; }\n  dequeue() { return this.items[this.head++]; }\n}`
    },
    realWorldApps: [
      { title: 'CPU Process Scheduling', desc: 'OS schedules lightweight threads on logical queues awaiting execution.', icon: Cpu },
      { title: 'Network Packet Buffers', desc: 'Queues dynamic streaming data router frames sequentially to prevent jitter.', icon: Layers },
      { title: 'Concert Ticket Booking', desc: 'Fair FIFO system resolving customer transactions in absolute queue order.', icon: Activity }
    ],
    interviewPrep: {
      faqs: [
        'Why not use traditional JS arrays as queues? Calling .shift() takes O(N) time because it shifts remaining items.',
        'What is a circular queue? A queue where the last index loops back to the first, maximizing space reuse.'
      ],
      mistakes: [
        'Failing to monitor tail bound wrap-arounds for circular queue indexes.',
        'Confusing static queue sizes with dynamic buffers.'
      ],
      edges: [
        'Queue overflow when capacity limits are hit.',
        'Dequeue on empty queues.',
        'Priority key collisons on queue lookups.'
      ],
      optimization: 'Use a dynamic Circular Buffer or dynamic array list pointer layout to avoid shifting elements on pop.',
      followups: [
        'How do you design a high-throughput multi-producer multi-consumer thread queue?',
        'Can you simulate a stack using queues?'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'q-1', title: 'Implement Queue using Stacks', difficulty: 'Easy', estTime: '15 mins' },
      { id: 'q-2', title: 'Design Circular Queue', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'q-3', title: 'Sliding Window Maximum', difficulty: 'Hard', estTime: '45 mins' }
    ],
    defaultPlayground: [100, 105, 110],
    operations: ['Enqueue', 'Dequeue', 'Peek Front', 'Is Full', 'Reset']
  },
  trees: {
    id: 'trees',
    name: 'Binary Search Tree',
    difficulty: 'Advanced',
    tags: ['Hierarchy', 'Recursive', 'Trees'],
    overview: 'A Binary Search Tree (BST) stores elements where left child is less than root node, and right child is larger. If balanced, it resolves inserts, deletions, and searches in O(log N) time.',
    timeComplexity: { insert: 'O(log N)', delete: 'O(log N)', search: 'O(log N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java BST node representation\nclass Node {\n    int val;\n    Node left, right;\n    Node(int v) { val = v; }\n}\n\npublic Node insert(Node r, int val) {\n    if (r == null) return new Node(val);\n    if (val < r.val) r.left = insert(r.left, val);\n    else r.right = insert(r.right, val);\n    return r;\n}`,
      python: `# Python BST node\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef search_bst(root, key):\n    if root is None or root.val == key:\n        return root\n    if key < root.val:\n        return search_bst(root.left, key)\n    return search_bst(root.right, key)`,
      cpp: `// C++ BST insertion\nstruct Node {\n    int val;\n    Node* left = nullptr;\n    Node* right = nullptr;\n    Node(int v) : val(v) {}\n};\n\nNode* insert(Node* r, int val) {\n    if (!r) return new Node(val);\n    if (val < r->val) r->left = insert(r->left, val);\n    else r->right = insert(r->right, val);\n    return r;\n}`,
      javascript: `// JS BST Class definition\nclass TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}`
    },
    realWorldApps: [
      { title: 'Drive Folders Directory', desc: 'Underlying directory hierarchies use dynamic trees to represent file systems.', icon: Database },
      { title: 'Compiled AST Syntax Trees', desc: 'Browsers parse JavaScript code strings into dynamic nested syntax trees.', icon: Code },
      { title: 'HTML Document Object Model', desc: 'The DOM tree represents parent-child elements (div, body, span) sequentially.', icon: Layers }
    ],
    interviewPrep: {
      faqs: [
        'What is an AVL tree? A self-balancing search tree where heights of children vary by at most 1, avoiding O(N) line degradation.',
        'What traversal prints a BST in sorted ascending order? An In-Order (Left, Root, Right) traversal.'
      ],
      mistakes: [
        'Forgetting to reassign search boundaries, losing reference pointers when building child nodes.',
        'Confusing Binary Tree (general) rules with Binary Search Tree ordering bounds.'
      ],
      edges: [
        'Skewed tree degraded to a linear list (height = O(N)).',
        'Duplicate elements insertion conflict management.',
        'Node deletion with two nested child elements (requires successor search).'
      ],
      optimization: 'Employ AVL rotations or Red-Black trees to enforce O(log N) balance bounds under chaotic operations.',
      followups: [
        'Implement an in-order successor search routine.',
        'Convert a binary tree to a doubly linked list in-place.'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'tree-1', title: 'Validate Binary Search Tree', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'tree-2', title: 'Kth Smallest Element in a BST', difficulty: 'Medium', estTime: '20 mins' },
      { id: 'tree-3', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', estTime: '50 mins' }
    ],
    defaultPlayground: [50, 30, 70, 20, 40, 60, 80],
    operations: ['Insert Node', 'In-Order Traversal', 'Search Key', 'Find Min/Max', 'Clear']
  },
  'complexity-time': {
    id: 'complexity-time',
    name: 'Time Complexity',
    difficulty: 'Beginner',
    tags: ['Analysis', 'Asymptotics', 'Big-O', 'Scaling'],
    overview: 'Time Complexity measures how the execution time of an algorithm grows asymptotically as the input size (N) scales. Big-O notation acts as an upper-bound indicator, neglecting scalar variables and focus purely on dominant factors.',
    timeComplexity: { insert: 'O(1)', delete: 'O(N)', search: 'O(log N)' },
    spaceComplexity: 'O(1)',
    codeSnippets: {
      java: `// Classic Time Complexity Scaling Examples\nvoid constantTime(int[] arr) {\n    int val = arr[0]; // O(1) direct offset access\n}\n\nvoid linearTime(int[] arr) {\n    for (int num : arr) {\n        System.out.println(num); // O(N) sweep loop\n    }\n}\n\nvoid quadraticTime(int[] arr) {\n    for (int i : arr) {\n        for (int j : arr) {\n            System.out.println(i + j); // O(N²) nested matrix checks\n        }\n    }\n}`,
      python: `# Python Asymptotic Loop Behaviors\ndef logarithmicTime(n):\n    count = 0\n    while n > 1:\n        n //= 2\n        count += 1\n    return count # O(log N) bisection reduction`,
      cpp: `// C++ STL Complexity analysis\n#include <vector>\n#include <iostream>\nusing namespace std;\n\nvoid linearPass(const vector<int>& v) {\n    for(size_t i = 0; i < v.size(); ++i) {\n        cout << v[i] << " "; // O(N) step\n    }\n}`,
      javascript: `// JS Big-O complexity snippets\nfunction constantSample(v) {\n  return v[3] ?? null; // O(1) instant read\n}`
    },
    realWorldApps: [
      { title: 'Scaling Live Database Clusters', desc: 'Predicting connection and query response limits under Millions of peak requests.', icon: Database },
      { title: 'Latency Bound Guarantees', desc: 'Sustaining smooth frame updates (e.g. 120Hz gaming engines requiring < 8ms renders).', icon: Clock },
      { title: 'HFT Trading Systems Strategy', desc: 'Optimizing algorithmic micro-swaps down to nanosecond cycles.', icon: Cpu }
    ],
    interviewPrep: {
      faqs: [
        'How does Average Case differ from Worst Case? Average case reflects random uniform inputs while worst case is the absolute maximum bound.',
        'Why do helper loops not multiply complexity when sequential? Sequential operations are additive (O(N + M)), not nested (O(N * M)).'
      ],
      mistakes: [
        'Including minor coefficients (writing O(3N) instead of O(N)).',
        'Confusing simple loops incrementing by multiplication (log N) with standard single decrements (N).'
      ],
      edges: [
        'Empty inputs where early returns terminate execution in O(1).',
        'Extremely unbalanced dataset skew'
      ],
      optimization: 'Always analyze the bottleneck of nested helper actions and look for opportunities to replace nested loops with linear pointers or memoized tables.',
      followups: [
        'How does Amortized time complexity apply to dynamic array resizes?',
        'Can an algorithm achieve O(1) search time in worst-case arbitrary boundaries?'
      ],
      leetcodeDifficulty: 'Easy'
    },
    problems: [
      { id: 'cmplx-1', title: 'Fibonacci Asymptotic Scaling', difficulty: 'Easy', estTime: '10 mins' },
      { id: 'cmplx-2', title: 'Analyze Quadratic Nested Search Loops', difficulty: 'Medium', estTime: '15 mins' }
    ],
    defaultPlayground: [1, 10, 100, 1000],
    operations: ['O(1) Access', 'O(N) Loop', 'O(N²) Nested', 'O(log N) Split', 'Reset']
  },
  'complexity-space': {
    id: 'complexity-space',
    name: 'Space Complexity',
    difficulty: 'Beginner',
    tags: ['Memory', 'Auxiliary', 'In-place', 'Stack'],
    overview: 'Space Complexity describes the total amount of extra memory (auxiliary space) allocated by an algorithm during execution relative to input size N. Programs aiming for memory efficiency attempt in-place mutations (O(1)).',
    timeComplexity: { insert: 'O(1)', delete: 'O(1)', search: 'O(N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java Stack & Heap memory usage patterns\nint[] copyArr(int[] parent) {\n    int[] copy = new int[parent.length]; // O(N) auxiliary space\n    System.arraycopy(parent, 0, copy, 0, parent.length);\n    return copy;\n}`,
      python: `# Python Recursion depth heap stack frames\ndef recurse_sum(n):\n    if n <= 1: return n\n    return n + recurse_sum(n - 1) # O(N) recursion stack memory allocation`,
      cpp: `// C++ Memory Allocation\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> buildGrid(int n) {\n    return vector<vector<int>>(n, vector<int>(n, 0)); // O(N²) storage space\n}`,
      javascript: `// In-place pointer swap (O(1) auxiliary space)\nfunction reverseInPlace(arr) {\n  let l = 0, r = arr.length - 1;\n  while(l < r) {\n    let temp = arr[l]; arr[l] = arr[r]; arr[r] = temp; // O(1) variables\n    l++; r--;\n  }\n}`
    },
    realWorldApps: [
      { title: 'Embedded Electronics Systems', desc: 'Operating microcontrollers where RAM limits are extremely strict (< 64KB buffers).', icon: Cpu },
      { title: 'Memory-Mapped File Caching', desc: 'Loading chunks of text indexes selectively so they do not starve operational caches.', icon: Layers },
      { title: 'Thread Scheduler Pools', desc: 'Allocating lightweight thread stacks safely without crashing systems.', icon: Database }
    ],
    interviewPrep: {
      faqs: [
        'Does the input footprint count toward Space Complexity? No, standard analysis focuses on extra (auxiliary) space created.',
        'Why does recursion consume memory? Each nested call pushes a function activation stack frame onto the Call Stack.'
      ],
      mistakes: [
        'Assuming recursive functions run in O(1) space simply because no extra collection variable is created.',
        'Failing to deallocate pointers sequentially in non-garbage-collected environments.'
      ],
      edges: [
        'Deep recursion thresholds triggering immediate StackOverflow errors.',
        'Integer bit transformations triggering memory over-allocation.'
      ],
      optimization: 'Replace function call recursions with standard loop iterations to maintain O(1) frame bounds.',
      followups: [
        'What is Tail Call Optimization and does your current compiler support it?',
        'Does garbage-collection latency alter real-world memory profiles?'
      ],
      leetcodeDifficulty: 'Easy'
    },
    problems: [
      { id: 'sp-1', title: 'Evaluate Call Stack Recursion Bounds', difficulty: 'Easy', estTime: '10 mins' },
      { id: 'sp-2', title: 'In-Place Array Elements Rotation', difficulty: 'Medium', estTime: '20 mins' }
    ],
    defaultPlayground: [2, 4, 8, 16],
    operations: ['O(1) Var', 'O(N) Copy', 'O(N²) Grid', 'Heap Check', 'Reset']
  },
  'linked_list': {
    id: 'linked_list',
    name: 'Linked List',
    difficulty: 'Intermediate',
    tags: ['References', 'Dynamic', 'Pointers', 'Linear'],
    overview: 'A Linked List organizes records sequentially as a chain of nodes, where each node embeds its own value alongside a forward pointing pointer reference. Offers constant-time boundary insertion and deletion with dynamic sizing.',
    timeComplexity: { insert: 'O(1)', delete: 'O(1)', search: 'O(N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java Singly Linked List Node\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\n// Reversing LinkedList\npublic ListNode reverse(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      python: `# Python linked list traversal\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef count_nodes(head):\n    curr = head\n    count = 0\n    while curr:\n        count += 1\n        curr = curr.next\n    return count`,
      cpp: `// C++ Linked List definition\nstruct ListNode {\n    int val;\n    ListNode* next = nullptr;\n    ListNode(int x) : val(x) {}\n};`,
      javascript: `// Javascript Linked node assignment\nconst head = { val: 10, next: { val: 20, next: null } };`
    },
    realWorldApps: [
      { title: 'Dynamic Memory Lists', desc: 'Allocators like malloc track available system segments in sequential lists.', icon: GitFork },
      { title: 'Browser Tab Histories', desc: 'Dynamic Doubly Linked Lists allow forward and backward page navigation.', icon: BookOpen },
      { title: 'Sound Tracks Queueing', desc: 'Iterators jump to adjacent tracks smoothly using sequential references.', icon: Activity }
    ],
    interviewPrep: {
      faqs: [
        'How do you find cycles inside a Linked List? Use Floyds Tortoise and Hare double cursor speed matching.',
        'Why would you pick Linked List over Dynamic Array? When you need continuous O(1) insertions at the front.'
      ],
      mistakes: [
        'Losing references to subsequent list nodes during inter-node pointer reassignments.',
        'Not handling updates to boundary head and tail references correctly.'
      ],
      edges: [
        'Deleting nodes from elements of length 1.',
        'Empty listings causing null references.',
        'Circular looping links.'
      ],
      optimization: 'Always initialize a fake "dummy" head node to simplify boundary re-linking logic.',
      followups: [
        'Can you sort a linked list in O(N log N) time and O(1) extra space?',
        'How would you clone a list featuring random pointers?'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'll-1', title: 'Reverse Linked List', difficulty: 'Easy', estTime: '15 mins' },
      { id: 'll-2', title: 'Linked List Cycle', difficulty: 'Easy', estTime: '15 mins' },
      { id: 'll-3', title: 'Merge Two Sorted Lists', difficulty: 'Easy', estTime: '15 mins' }
    ],
    defaultPlayground: [12, 18, 25, 34],
    operations: ['Insert Head', 'Delete Head', 'Reverse Links', 'Find Middle', 'Reset']
  },
  'hash_table': {
    id: 'hash_table',
    name: 'Hash Table',
    difficulty: 'Intermediate',
    tags: ['Mapping', 'Direct', 'Key-Value', 'Constant'],
    overview: 'A Hash Table maps keys to values utilizing a mathematical hashing function to resolve array indices. It guarantees O(1) operations on average. When hash index collides, separate chaining or open addressing resolve them.',
    timeComplexity: { insert: 'O(1) Avg', delete: 'O(1) Avg', search: 'O(1) Avg' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java Hash Map usage\nimport java.util.HashMap;\nHashMap<String, Integer> map = new HashMap<>();\nmap.put("key_A", 100); // O(1)\nint val = map.getOrDefault("key_A", 0); // O(1)`,
      python: `# Python Dictionary usage\nmapping = {"alpha": 1, "beta": 2}\n# Fast key presence verification\nif "alpha" in mapping:\n    print(mapping["alpha"])`,
      cpp: `// C++ std::unordered_map\n#include <unordered_map>\n#include <string>\nusing namespace std;\nunordered_map<string, double> priceMap;\npriceMap["apple"] = 1.99; // Constant avg lookup`,
      javascript: `// JavaScript ES6 Map patterns\nconst map = new Map();\nmap.set('alice', 23);\nconsole.log(map.get('alice'));`
    },
    realWorldApps: [
      { title: 'In-Memory Cache (Redis)', desc: 'Managing massive collections of session details resolved via dynamic keys.', icon: Database },
      { title: 'Sub-pattern Cryptography', desc: 'Validating matched digital checksums instantaneously.', icon: Shield },
      { title: 'Database Index Directories', desc: 'Finding file pointers sequentially mapped directly from primary keys.', icon: Database }
    ],
    interviewPrep: {
      faqs: [
        'What generates a hash collision? When distinct keys parse to identical table address slots.',
        'Why does search degrade to linear O(N) in worse-cases? When all keys index to a singleton bucket.'
      ],
      mistakes: [
        'Using mutable attributes as table search keys, throwing off dynamic index lookup locations.',
        'Failing to resize table buckets when threshold load factors (usually 0.75) are exceeded.'
      ],
      edges: [
        'Using custom objects missing overridden hashCode or equals equations.',
        'Massive collision loads.'
      ],
      optimization: 'Choose prime number buckets to naturally disperse modulo hashes evenly.',
      followups: [
        'How does Java Map resolve worst-case collisions (since Java 8 converting chains to red-black trees)?',
        'Can you construct a thread-safe Hash Table using locks?'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'hash-1', title: 'Two Sum Map Technique', difficulty: 'Easy', estTime: '10 mins' },
      { id: 'hash-2', title: 'Group Anagrams', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'hash-3', title: 'Longest Consecutive Sequence', difficulty: 'Medium', estTime: '30 mins' }
    ],
    defaultPlayground: [7, 31, 19, 41],
    operations: ['Hash Insert', 'Resolve Collision', 'Search Table', 'Clear Buckets', 'Reset']
  },
  'binary_search': {
    id: 'binary_search',
    name: 'Binary Search',
    difficulty: 'Intermediate',
    tags: ['Sorted', 'Bisection', 'Divide & Conquer', 'Logarithmic'],
    overview: 'Binary Search is an exceptionally rapid bisection method on pre-sorted arrays. By comparing targeting parameters against the center index, it immediately rules out half the search range with each loop.',
    timeComplexity: { insert: 'O(N)', delete: 'O(N)', search: 'O(log N)' },
    spaceComplexity: 'O(1)',
    codeSnippets: {
      java: `// Java Iterative Binary Search\npublic int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2; // Avoid overflow\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      python: `# Python recursive binary search\ndef binary_search_rec(arr, low, high, target):\n    if low > high: return -1\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    if arr[mid] < target:\n        return binary_search_rec(arr, mid + 1, high, target)\n    return binary_search_rec(arr, low, mid - 1, target)`,
      cpp: `// C++ STL binary search utility\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nbool hasItem(const vector<int>& v, int key) {\n    return binary_search(v.begin(), v.end(), key);\n}`,
      javascript: `// JavaScript binary lookup algorithm\nconst sorted = [1, 5, 8, 12, 19];\nlet idx = sorted.indexOf(12); // Linear JS built-in search`
    },
    realWorldApps: [
      { title: 'Dynamic SQLite Index Routing', desc: 'Finding specific records inside large alphabetically structured databases.', icon: Database },
      { title: 'Git Bug Bisecting tools', desc: 'Pinpointing which commit broke codebases across thousands of revisions.', icon: GitFork },
      { title: 'Library Catalog Resolving', desc: 'Pinpointing target reference parameters instantly within numeric indexes.', icon: BookOpen }
    ],
    interviewPrep: {
      faqs: [
        'Why choose low + (high - low)/2 over (low + high)/2? To prevent memory variable integer bounds overflow.',
        'Does Binary Search work on unsorted lists? No, inputs must stay strictly sorted first.'
      ],
      mistakes: [
        'Entering infinite loops due to misaligned index step updates (forgetting mid + 1 or mid - 1).',
        'Failing to calibrate loop boundaries (low <= high vs low < high).'
      ],
      edges: [
        'Arrays of size 1.',
        'Target value placed completely outside array limits.'
      ],
      optimization: 'Apply lower_bound binary searches to retrieve insertion targets for dynamic structures instantly.',
      followups: [
        'How would you use binary search inside an infinite continuous stream of sorted items?',
        'Can you search for values inside a 2D sorted coordinate matrix?'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'bs-1', title: 'Binary Search Implementation', difficulty: 'Easy', estTime: '10 mins' },
      { id: 'bs-2', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'bs-3', title: 'Find First and Last Position of Element', difficulty: 'Medium', estTime: '20 mins' }
    ],
    defaultPlayground: [5, 12, 19, 23, 37, 45, 59],
    operations: ['Bisect Mid', 'Check Left Half', 'Check Right Half', 'Validate Match', 'Reset']
  },
  'avl_tree': {
    id: 'avl_tree',
    name: 'AVL Tree',
    difficulty: 'Advanced',
    tags: ['Self-Balancing', 'Height', 'Rotations', 'log N'],
    overview: 'An AVL Tree is a self-balancing Binary Search Tree. It tracks the Height difference between children subtrees (the Balance Factor). If this factor exceeds +/- 1, it performs Left or Right Rotations.',
    timeComplexity: { insert: 'O(log N)', delete: 'O(log N)', search: 'O(log N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java AVL Tree node depth tracker\nclass AVLNode {\n    int val, height;\n    AVLNode left, right;\n    AVLNode(int d) { val = d; height = 1; }\n}\n\n// AVL Right Rotation\nAVLNode rightRotate(AVLNode y) {\n    AVLNode x = y.left;\n    AVLNode T2 = x.right;\n    x.right = y;\n    y.left = T2;\n    y.height = Math.max(height(y.left), height(y.right)) + 1;\n    x.height = Math.max(height(x.left), height(x.right)) + 1;\n    return x;\n}`,
      python: `# Python AVL node balancing check\ndef get_balance(root):\n    if not root: return 0\n    return get_height(root.left) - get_height(root.right)`,
      cpp: `// C++ AVL Tree structures\nstruct AVLNode {\n    int key;\n    int height = 1;\n    AVLNode* left = nullptr;\n    AVLNode* right = nullptr;\n};`,
      javascript: `// Javascript AVL balance codes\nfunction getHeight(node) {\n  return node ? node.height : 0;\n}`
    },
    realWorldApps: [
      { title: 'Read-Heavy Database Indexes', desc: 'Underpinning transactional indices requiring strict lookup bound guarantees.', icon: Database },
      { title: 'Computational Physics Systems', desc: 'Verifying intersecting collision boundaries at high scale recursively.', icon: Cpu },
      { title: 'Language Compiler Lookups', desc: 'Evaluating nested namespaces where structural heights should stay minimal.', icon: Code }
    ],
    interviewPrep: {
      faqs: [
        'How does AVL compare to Red-Black Trees? AVL Trees are more strictly balanced, optimizing reads over frequent writes.',
        'What are the four rotation cases? Left-Left (LL), Right-Right (RR), Left-Right (LR), and Right-Left (RL).'
      ],
      mistakes: [
        'Forgetting to update heights on the rotated nodes recursively after pointer swaps.',
        'Confusing balance factor absolute checks causing unnecessary heap rotations.'
      ],
      edges: [
        'Inserting already-sorted sequences (triggers continuous automatic rebalancing passes).',
        'Removing nodes with two children.'
      ],
      optimization: 'Store balance calculations inside nodes locally to avoid re-evaluating depth branches.',
      followups: [
        'Can you construct an AVL tree using only binary bit indicators?',
        'How does tree deletion differ from insertion rotations?'
      ],
      leetcodeDifficulty: 'Hard'
    },
    problems: [
      { id: 'avl-1', title: 'Convert Sorted Array to Binary Search Tree', difficulty: 'Easy', estTime: '15 mins' },
      { id: 'avl-2', title: 'Validate Balance of Binary Tree', difficulty: 'Easy', estTime: '15 mins' }
    ],
    defaultPlayground: [40, 20, 10, 30],
    operations: ['Check Balance', 'Rotate Left', 'Rotate Right', 'Rebalance Tree', 'Reset']
  },
  'trie': {
    id: 'trie',
    name: 'Trie Map',
    difficulty: 'Advanced',
    tags: ['Strings', 'Search Trees', 'Retrieval', 'Prefixes'],
    overview: 'A Trie (or Prefix Tree) organizes string values as character path steps down a nested node tree. It enables prefix-matching and prefix searches to execute in O(Length of Query) time.',
    timeComplexity: { insert: 'O(L)', delete: 'O(L)', search: 'O(L)' },
    spaceComplexity: 'O(N * L * Σ)',
    codeSnippets: {
      java: `// Java Trie Node representation\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord;\n}\n\npublic class Trie {\n    private TrieNode root = new TrieNode();\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();\n            curr = curr.children[idx];\n        }\n        curr.isEndOfWord = true;\n    }\n}`,
      python: `# Python Trie mapping implementation\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()`,
      cpp: `// C++ Trie Prefix Tree structure\n#include <unordered_map>\nusing namespace std;\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isWord = false;\n};`,
      javascript: `// Javascript Trie node structure\nconst trie = { children: { 'a': { children: {}, isWord: true } } };`
    },
    realWorldApps: [
      { title: 'Search Engine Autocomplete', desc: 'Predicting trailing query paths instantly as users type.', icon: SearchIcon },
      { title: 'Router IP Routing Protocols', desc: 'Validating network packages matches on longest prefix boundaries.', icon: Cpu },
      { title: 'Keyboard Spell Checking', desc: 'Validating lexicon existence and suggesting typos in O(L) steps.', icon: FileText }
    ],
    interviewPrep: {
      faqs: [
        'How does Trie compare to Hash Map? Tries permit prefix lookups (startsWith), find all matching prefixes, and avoid collisions.',
        'Why is memory footprint high? Empty pointers are allocated for alphabet parameters at each recursive step.'
      ],
      mistakes: [
        'Forgetting to flag isEndOfWord on nested inserts.',
        'Not cleaning up child nodes on recursive deletions.'
      ],
      edges: [
        'Empty strings insert attempts.',
        'Accessing characters outside alphabet range.'
      ],
      optimization: 'Implement children pointers as dynamic hash maps to save memory over static size offsets.',
      followups: [
        'Can you construct a compressed Triebelt configuration (e.g., Radix Tree)?',
        'How do you print all strings starting with a given query prefix?'
      ],
      leetcodeDifficulty: 'Medium'
    },
    problems: [
      { id: 'tr-1', title: 'Implement Trie Prefix Tree', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'tr-2', title: 'Design Add and Search Words', difficulty: 'Medium', estTime: '30 mins' }
    ],
    defaultPlayground: [97, 108, 103, 111],
    operations: ['Insert Prefix', 'Search Prefix', 'Match Partial', 'Autocomplete', 'Reset']
  },
  'graph': {
    id: 'graph',
    name: 'Graph Traversal',
    difficulty: 'Advanced',
    tags: ['Networks', 'Vertices', 'BFS/DFS', 'Shortest-Path'],
    overview: 'A Graph is a set of Vertices connected by weighted or directed Edges. Traversal algorithms search graph structures level-by-level (BFS Queue) or in-depth recursively (DFS Stack), predicting shortest paths.',
    timeComplexity: { insert: 'O(1)', delete: 'O(V+E)', search: 'O(V+E)' },
    spaceComplexity: 'O(V+E)',
    codeSnippets: {
      java: `// Java Adjacency list graph declaration\nimport java.util.*;\nclass Graph {\n    private Map<Integer, List<Integer>> adj = new HashMap<>();\n    public void addEdge(int u, int v) {\n        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);\n    }\n    \n    // Depth-First Search recursive core\n    public void dfs(int node, Set<Integer> visited) {\n        if (visited.contains(node)) return;\n        visited.add(node);\n        for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {\n            dfs(neighbor, visited);\n        }\n    }\n}`,
      python: `# Python BFS Queue traversal\nfrom collections import deque\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    while queue:\n        curr = queue.popleft()\n        for neighbor in graph[curr]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)`,
      cpp: `// C++ Graph structural definitions\n#include <vector>\nusing namespace std;\nusing Graph = vector<vector<int>>; // Adjacency list layout`,
      javascript: `// JavaScript Directed Graph edge map\nconst adjList = {\n  0: [1, 2],\n  1: [2],\n  2: [0]\n};`
    },
    realWorldApps: [
      { title: 'Google Maps GPS Engine', desc: 'Predicting minimum traffic delays between coordinates using Dijkstra.', icon: MapPin },
      { title: 'Social Network Connections', desc: 'Calculating degrees of connection (1st, 2nd, 3rd bands) on LinkedIn.', icon: GitFork },
      { title: 'Internet Routing Protocols', desc: 'Forwarding TCP/IP packet boundaries along minimum hopped routes.', icon: Cpu }
    ],
    interviewPrep: {
      faqs: [
        'When to select BFS over DFS? Choose BFS to locate shortest paths in unweighted coordinate systems.',
        'What prevents infinite loop traps? Always keep a set tracker of visited nodes.'
      ],
      mistakes: [
        'Confusing adjacency matrix representations costing O(V²) space with adjacency lists.',
        'Not handling isolated graph sub-groups successfully.'
      ],
      edges: [
        'Graphs containing isolated non-connected islands.',
        'Cycles in undirected loops.'
      ],
      optimization: 'Use a Priority Queue (Min-Heap) inside Dijkstras to optimize route extraction to O(E log V).',
      followups: [
        'What is a topological sort and did you resolve Course Schedule using it?',
        'How does A* differ from standard Dijkstra algorithms?'
      ],
      leetcodeDifficulty: 'Hard'
    },
    problems: [
      { id: 'grph-1', title: 'Number of Islands', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'grph-2', title: 'Course Schedule', difficulty: 'Medium', estTime: '30 mins' },
      { id: 'grph-3', title: 'Network Delay Time', difficulty: 'Medium', estTime: '35 mins' }
    ],
    defaultPlayground: [0, 1, 2, 3],
    operations: ['Run BFS', 'Run DFS', 'Add Vertex Link', 'Shortest Route', 'Reset']
  },
  'dp': {
    id: 'dp',
    name: 'Dynamic Program',
    difficulty: 'Advanced',
    tags: ['Optimization', 'Memoization', 'Overlapping', 'Subproblems'],
    overview: 'Dynamic Programming optimizes exponential recursive structures by caching subproblem outputs. Resolves overlapping calculations using top-down Memoization dictionaries or bottom-up Tabulation vectors.',
    timeComplexity: { insert: 'O(1)', delete: 'N/A', search: 'O(N)' },
    spaceComplexity: 'O(N)',
    codeSnippets: {
      java: `// Java Climb Stairs Fibonacci DP\npublic int climbStairs(int n) {\n    if (n <= 2) return n;\n    int[] dp = new int[n + 1]; // Tabulation table\n    dp[1] = 1; dp[2] = 2;\n    for (int i = 3; i <= n; i++) {\n        dp[i] = dp[i-1] + dp[i-2];\n    }\n    return dp[n];\n}`,
      python: `# Python top-down subproblem memoization\ndef rob_memo(nums, i, memo):\n    if i >= len(nums): return 0\n    if i in memo: return memo[i]\n    rob = nums[i] + rob_memo(nums, i + 2, memo)\n    skip = rob_memo(nums, i + 1, memo)\n    memo[i] = max(rob, skip)\n    return memo[i]`,
      cpp: `// C++ Tabulation knapsack example\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxProfit(const vector<int>& v) {\n    int n = v.size();\n    vector<int> dp(n, 0);\n    return dp[n-1];\n}`,
      javascript: `// JavaScript basic memoized cache dictionary\nconst memo = {};\nfunction fib(n) {\n  if(n <= 1) return n;\n  if(n in memo) return memo[n];\n  return memo[n] = fib(n-1) + fib(n-2);\n}`
    },
    realWorldApps: [
      { title: 'Diff File Utility Engines', desc: 'Predicting sequence mismatch alignments dynamically between codebases.', icon: GitFork },
      { title: 'Bioinformatics Genomic Align', desc: 'Matching complex DNA sequences to analyze genetic transformations.', icon: Activity },
      { title: 'Visual Word Wrap Editors', desc: 'Distributing character strings evenly across variable screen margins.', icon: FileText }
    ],
    interviewPrep: {
      faqs: [
        'How does dynamic programming differ from divide & conquer? DP is reserved for overlapping subproblems; Divide & Conquer handles distinct blocks.',
        'What is tabulation? Building bottom-up iterations to construct complete solution directories sequentially.'
      ],
      mistakes: [
        'Forgetting to calibrate base conditions, causing index-out-of-bounds errors.',
        'Creating dynamic state mappings that are redundant, degrading complexity.'
      ],
      edges: [
        'Zero parameters or negative limits.',
        'Extremely large states exhausting memory cache space.'
      ],
      optimization: 'Conserve space from O(N) to O(1) by storing only the previous two calculation states.',
      followups: [
        'How would you map coordinate states inside a 2D knapsack matrix?',
        'Can you optimize matrix chain multiplication down to sub-cubic limits?'
      ],
      leetcodeDifficulty: 'Hard'
    },
    problems: [
      { id: 'dp-1', title: 'Climbing Stairs', difficulty: 'Easy', estTime: '10 mins' },
      { id: 'dp-2', title: 'Coin Change', difficulty: 'Medium', estTime: '25 mins' },
      { id: 'dp-3', title: 'Longest Common Subsequence', difficulty: 'Medium', estTime: '30 mins' }
    ],
    defaultPlayground: [1, 1, 2, 3, 5, 8],
    operations: ['Memoize State', 'Compute Fibonacci', 'Solve Subproblem', 'Tabulate Values', 'Reset']
  }
};

// Roadmaps list mapping
const ROADMAP_TOPICS = {
  Beginner: [
    { id: 'arrays', name: 'Arrays', icon: TableIcon, timeLimit: '2 hours' },
    { id: 'strings', name: 'Strings', icon: FileText, timeLimit: '3 hours' },
    { id: 'complexity-time', name: 'Time Complexity', icon: Clock, timeLimit: '1.5 hours', isConceptOnly: true },
    { id: 'complexity-space', name: 'Space Complexity', icon: Layers, timeLimit: '1 hour', isConceptOnly: true },
  ],
  Intermediate: [
    { id: 'stack', name: 'Stack', icon: ArrowUpDown, timeLimit: '3 hours' },
    { id: 'queue', name: 'Queue', icon: Activity, timeLimit: '3 hours' },
    { id: 'linked_list', name: 'Linked List', icon: GitFork, timeLimit: '4 hours', isConceptOnly: true },
    { id: 'hash_table', name: 'Hash Table', icon: Database, timeLimit: '3.5 hours', isConceptOnly: true },
    { id: 'binary_search', name: 'Binary Search', icon: Search, timeLimit: '3 hours', isConceptOnly: true }
  ],
  Advanced: [
    { id: 'trees', name: 'Trees & BST', icon: Activity, timeLimit: '5 hours' },
    { id: 'avl_tree', name: 'AVL Tree', icon: Sparkles, timeLimit: '4 hours', isConceptOnly: true },
    { id: 'trie', name: 'Trie Prefix Map', icon: SearchIcon, timeLimit: '3 hours', isConceptOnly: true },
    { id: 'graph', name: 'Graph Traversal', icon: Sparkles, timeLimit: '6 hours', isConceptOnly: true },
    { id: 'dp', name: 'Dynamic Program', icon: Brain, timeLimit: '9 hours', isConceptOnly: true }
  ]
};

function TableIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3h18v18H3z"/>
      <path d="M3 9h18"/>
      <path d="M3 15h18"/>
      <path d="M9 3v18"/>
      <path d="M15 3v18"/>
    </svg>
  );
}

// Mock AI smart questions and answers
const AI_FAQ_SUGGESTIONS = [
  'How do I calculate Big-O asymptotically?',
  'Why does QuickSort run faster than MergeSort in practice?',
  'When should I choose Stack instead of Queue?',
  'Explain the difference between BST and Hash Map.',
  'How to detect rings or cycles inside a graph?'
];

const AI_MOCK_RESPONSES: Record<string, string> = {
  'how do i calculate big-o asymptotically?': 'To calculate Big-O asymptotically, follow these steps:\n1. Identify the input size parameter (usually N).\n2. Count the maximum operations as a function of N.\n3. Keep only the fastest-growing term (dominant term).\n4. Drop any scalar coefficients. (For example, 3N² + 5N + 10 becomes O(N²)).',
  'why does quicksort run faster than mergesort in practice?': 'QuickSort is generally faster because:\n- **Cache Locality**: It scans elements sequentially in contiguous space, aligning naturally with hardware RAM cache lines.\n- **Zero Dynamic Allocations**: Unlike MergeSort which copies arrays to auxiliary indexes, QuickSort partitions in-place.\n- Excellent average-case execution speeds.',
  'when should i choose stack instead of queue?': 'Choose a **Stack** (LIFO) when you need to process elements in the absolute reverse order of arrival (e.g. tracking nested markers, recursion backtracks, or history reversers).\nChoose a **Queue** (FIFO) when fairness is key, and tasks should be resolved in chronological arrival order (e.g. pipeline tasks, operating system scheduling, or buffering logs).',
  'explain the difference between bst and hash map.': '- **BST**: Keeps values in strict sorted order. Lookup, insert, and delete take **O(log N)** time. Supports range lookups (e.g., finding keys between 10 and 50) efficiently.\n- **Hash Map**: Direct key-to-bucket mappings. Avg metrics are **O(1)** constant time. Does NOT maintain sorted order and handles key lookup ranges poorly.',
  'how to detect rings or cycles inside a graph?': 'Use **DFS** with a cycle detection strategy:\n- In a directed graph, keep a recursive active call stack array. If you visit a node already present in the active recursion call line, a cycle is present.\n- In undirected graphs, if you encounter an already visited node that is not the direct parent, a cycle is detected.'
};

export default function StudyGuideHub() {
  // State elements
  const [activeTopicId, setActiveTopicId] = useState<string>('arrays');
  const [activeCodeLang, setActiveCodeLang] = useState<'java' | 'python' | 'cpp' | 'javascript'>('javascript');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  
  // Toast notifications state
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 4000);
  };

  // Bookmarks & Solved Problems persistent store
  const [bookmarks, setBookmarks] = useState<string[]>(['stack']);
  const [completedTopics, setCompletedTopics] = useState<string[]>(['arrays']);
  const [solvedProblems, setSolvedProblems] = useState<string[]>(['arr-1']);
  
  // Custom Notes state
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('dsa_study_notes');
    return saved ? JSON.parse(saved) : {
      arrays: "Dynamic arrays double capacity on exhaustion. Shift cost is high.",
      stack: "Excellent tool for reversing sequences and tracking nesting markers."
    };
  });
  const [notesInput, setNotesInput] = useState<string>('');
  
  // AI Bot state
  const [aiExpanded, setAiExpanded] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'user' | 'bot', text: string }[]>([
    { sender: 'bot', text: 'Hi! I am your DSA AI Tutor clone. Ask me anything about Big-O, optimization, or recursive structures for standard interviews.' }
  ]);

  // Simulator/Playground custom states
  const [playData, setPlayData] = useState<number[]>([10, 20, 30, 40]);
  const [highlightedSimIdxs, setHighlightedSimIdxs] = useState<number[]>([]);
  const [simMessage, setSimMessage] = useState<string>('Sandbox simulation ready. Load operations below!');
  const [speedMs, setSpeedMs] = useState<number>(500);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Live Interactive Problems states
  const [activeViewMode, setActiveViewMode] = useState<'study' | 'problems'>('study');
  const [selectedProblemDifficultyFilter, setSelectedProblemDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [attemptingProblem, setAttemptingProblem] = useState<{ id: string; title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; estTime: string } | null>(null);
  const [attemptCode, setAttemptCode] = useState<string>('');
  const [isExecutingCode, setIsExecutingCode] = useState<boolean>(false);
  const [codeOutputCode, setCodeOutputCode] = useState<string>('');

  // Helper template selector for live sandbox
  const getProblemTemplate = (title: string, lang: 'javascript' | 'java' | 'python' | 'cpp'): string => {
    const norm = title.toLowerCase();
    if (norm.includes('two sum')) {
      if (lang === 'javascript') {
        return `function twoSum(nums, target) {\n    // Hash Map approach: O(N) Time, O(N) Space\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`;
      }
      if (lang === 'python') {
        return `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Optimal Hash Map strategy\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`;
      }
      if (lang === 'java') {
        return `import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                return new int[] { map.get(comp), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`;
      }
      return `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`;
    }
    
    if (norm.includes('palindrome')) {
      if (lang === 'javascript') {
        return `function isPalindrome(s) {\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    let l = 0, r = clean.length - 1;\n    while (l < r) {\n        if (clean[l] !== clean[r]) return false;\n        l++; r--;\n    }\n    return true;\n}`;
      }
      if (lang === 'python') {
        return `def isPalindrome(s: str) -> bool:\n    clean = "".join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]`;
      }
      if (lang === 'java') {
        return `class Solution {\n    public boolean isPalindrome(String s) {\n        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        int l = 0, r = clean.length() - 1;\n        while (l < r) {\n            if (clean.charAt(l) != clean.charAt(r)) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}`;
      }
      return `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        string clean = "";\n        for (char c : s) if (isalnum(c)) clean += tolower(c);\n        int l = 0, r = (int)clean.length() - 1;\n        while (l < r) {\n            if (clean[l] != clean[r]) return false;\n            l++; r--;\n        }\n        return true;\n    }\n};`;
    }

    if (lang === 'javascript') {
      return `function solveChallenge(input) {\n    // TODO: Implement O(N) optimized algorithm\n    let result = null;\n    \n    return result;\n}`;
    } else if (lang === 'python') {
      return `def solve_challenge(input):\n    # TODO: Implement optimized approach\n    result = None\n    \n    return result`;
    } else if (lang === 'java') {
      return `class Solution {\n    public Object solveChallenge(Object input) {\n        // TODO: Implement optimized system\n        Object result = null;\n        return result;\n    }\n}`;
    } else {
      return `class Solution {\npublic:\n    void solveChallenge(auto input) {\n        // TODO: Implement design\n    }\n};`;
    }
  };

  // Load selected topic
  const activeTopicObj = STUDY_TOPICS[activeTopicId] || STUDY_TOPICS['arrays'];

  useEffect(() => {
    // Reset simulation details on topic change
    setPlayData([...(activeTopicObj.defaultPlayground || [1, 2, 3])]);
    setHighlightedSimIdxs([]);
    setSimMessage(`Loaded active ${activeTopicObj.name} playground. Execute an operation!`);
    setNotesInput(personalNotes[activeTopicId] || '');
    setActiveViewMode('study');
    setSelectedProblemDifficultyFilter('All');
    setAttemptingProblem(null);
    setAttemptCode('');
    setCodeOutputCode('');
  }, [activeTopicId]);

  // Save notes handler
  const handleSaveNotes = () => {
    const updated = { ...personalNotes, [activeTopicId]: notesInput };
    setPersonalNotes(updated);
    localStorage.setItem('dsa_study_notes', JSON.stringify(updated));
    showToast('Notes saved to local storage successfully!', 'success');
  };

  // Export notes handler
  const handleExportNotes = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(personalNotes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "my_dsa_notes.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTopicObj.codeSnippets[activeCodeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Search logic
  const matchRoadmapTopic = (topicName: string) => {
    if (!searchQuery) return true;
    return topicName.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Toggle bookmarked status
  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(b => b !== id));
    } else {
      setBookmarks(prev => [...prev, id]);
    }
  };

  // Toggle complete state
  const toggleCompleteTopic = (id: string) => {
    if (completedTopics.includes(id)) {
      setCompletedTopics(prev => prev.filter(c => c !== id));
    } else {
      setCompletedTopics(prev => [...prev, id]);
    }
  };

  // Toggle dynamic problem checklist
  const toggleProblemSolved = (probId: string) => {
    if (solvedProblems.includes(probId)) {
      setSolvedProblems(prev => prev.filter(p => p !== probId));
    } else {
      setSolvedProblems(prev => [...prev, probId]);
    }
  };

  // AI query engine
  const handleSendAiQuery = (customText?: string) => {
    const textToSend = customText || aiQuery;
    if (!textToSend.trim()) return;

    const nextLogs = [...aiChatLogs, { sender: 'user' as const, text: textToSend }];
    setAiChatLogs(nextLogs);
    setAiQuery('');

    const matchedKey = textToSend.toLowerCase().trim();
    let reply = "I am processing that concept! Ask about QuickSort bounds, Big-O calculation, Palindrome logic, or Stack vs Queue.";
    
    // exact search or partial
    const matchedResponseKey = Object.keys(AI_MOCK_RESPONSES).find(k => matchedKey.includes(k) || k.includes(matchedKey));
    if (matchedResponseKey) {
      reply = AI_MOCK_RESPONSES[matchedResponseKey];
    } else {
      reply = `As your AI Tutor, let's look at ${activeTopicObj.name}. Specifically, remember that ${activeTopicObj.overview} It evaluates at ${activeTopicObj.timeComplexity.search} search bounds and performs exceptionally near O(1) in ideal memory patterns. Try a practical LeetCode puzzle listed inside the problems card on this screen!`;
    }

    setTimeout(() => {
      setAiChatLogs(prev => [...prev, { sender: 'bot' as const, text: reply }]);
    }, 600);
  };

  // SIMULATOR PLAYGROUND HANDLERS
  const executeSimAction = async (action: string) => {
    if (isSimulating) return;
    setIsSimulating(true);

    if (activeTopicId === 'arrays') {
      if (action === 'Insert') {
        setSimMessage('Inserting element 99... shifting remaining values right.');
        setHighlightedSimIdxs([2]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => {
          const next = [...prev];
          next.splice(2, 0, 99);
          return next;
        });
        setSimMessage('Successfully inserted 99 at Index 2! Shifts required: O(N) operations.');
      } else if (action === 'Delete') {
        setSimMessage('Removing element at Index 1... shifting rightward items left.');
        setHighlightedSimIdxs([1]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => prev.filter((_, idx) => idx !== 1));
        setSimMessage('Successfully removed Index 1 element! O(N) shift completed.');
      } else if (action === 'Lookup') {
        // Linear sweep visual emulation
        setSimMessage('Looking up element 23 sequentially...');
        for(let i=0; i<playData.length; i++) {
          setHighlightedSimIdxs([i]);
          await new Promise(r => setTimeout(r, speedMs));
          if (playData[i] === 23) {
            setSimMessage(`Found element 23 at Index ${i}! Lookup terminated in O(N) time.`);
            setIsSimulating(false);
            return;
          }
        }
        setSimMessage('Element 23 not discovered in linear scan.');
      } else if (action === 'Reverse') {
        setSimMessage('Reversing in-place with dual pointers starting at ends...');
        setHighlightedSimIdxs([0, playData.length - 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => [...prev].reverse());
        setSimMessage('Array inversion complete! Space consumed: O(1) in-place.');
      } else {
        setPlayData([4, 15, 8, 23, 42, 6]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset workspace variables.');
      }
    } else if (activeTopicId === 'strings') {
      if (action === 'Reverse') {
        setSimMessage('Flipping ASCII buffer blocks in-place...');
        setHighlightedSimIdxs([0, playData.length - 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => [...prev].reverse());
        setSimMessage('Successfully inverted characters.');
      } else if (action === 'Uppercase') {
        setSimMessage('Converting string indexes to uppercase character points...');
        setHighlightedSimIdxs(playData.map((_, i) => i));
        await new Promise(r => setTimeout(r, speedMs / 2));
        setPlayData(prev => prev.map(v => v + 5)); // shift ASCII
        setSimMessage('Manipulated internal character offsets.');
      } else if (action === 'Find Pattern') {
        setSimMessage('Running Knuth-Morris-Pratt (KMP) matcher...');
        setHighlightedSimIdxs([1, 2]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Matched target pattern at character slice Index 1 to 2.');
      } else if (action === 'Check Palindrome') {
        setSimMessage('Running sliding window comparison from margins...');
        setHighlightedSimIdxs([0, playData.length - 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Valid palindrome confirmation returned: TRUE');
      } else {
        setPlayData([65, 76, 71, 79, 82, 73]);
        setHighlightedSimIdxs([]);
        setSimMessage('ASCII registers fully cleared.');
      }
    } else if (activeTopicId === 'stack') {
      if (action === 'Push') {
        const itemVal = Math.floor(Math.random() * 90) + 10;
        setSimMessage(`Pushing ${itemVal} to the top of standard stack...`);
        setHighlightedSimIdxs([playData.length]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => [...prev, itemVal]);
        setSimMessage(`Command complete! ${itemVal} appended at top index.`);
      } else if (action === 'Pop') {
        if (playData.length === 0) {
          setSimMessage('Stack Underflow Alert! Pop failed.');
        } else {
          setSimMessage('Popping supreme top element from the stack...');
          setHighlightedSimIdxs([playData.length - 1]);
          await new Promise(r => setTimeout(r, speedMs));
          setPlayData(prev => prev.slice(0, -1));
          setSimMessage('Top element removed! O(1) operation resolved.');
        }
      } else if (action === 'Peek') {
        if (playData.length === 0) {
          setSimMessage('Empty stack.');
        } else {
          setHighlightedSimIdxs([playData.length - 1]);
          setSimMessage(`Topmost pointer item value is ${playData[playData.length - 1]}.`);
        }
      } else if (action === 'Is Empty') {
        setSimMessage(`Evaluated state: ${playData.length === 0 ? "TRUE (Stack Empty)" : "FALSE (Contains items)"}`);
      } else {
        setPlayData([10, 20, 30]);
        setHighlightedSimIdxs([]);
        setSimMessage('Populated baseline stack sequence.');
      }
    } else if (activeTopicId === 'queue') {
      if (action === 'Enqueue') {
        const itemVal = Math.floor(Math.random() * 90) + 10;
        setSimMessage(`Queueing ${itemVal} rear-end of the pipeline...`);
        setHighlightedSimIdxs([playData.length]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => [...prev, itemVal]);
        setSimMessage(`Successfully enqueued ${itemVal}!`);
      } else if (action === 'Dequeue') {
        if (playData.length === 0) {
          setSimMessage('Queue Underflow! Nothing left to process.');
        } else {
          setSimMessage('Dequeuing oldest front-most element from index 0...');
          setHighlightedSimIdxs([0]);
          await new Promise(r => setTimeout(r, speedMs));
          setPlayData(prev => prev.slice(1));
          setSimMessage('Front-of-queue element dispatched! Remaining shifted left recursively.');
        }
      } else if (action === 'Peek Front') {
        if (playData.length === 0) {
          setSimMessage('Empty queue pipeline.');
        } else {
          setHighlightedSimIdxs([0]);
          setSimMessage(`Queue Head is checking item value: ${playData[0]}.`);
        }
      } else if (action === 'Is Full') {
        setSimMessage('Evaluated queue space exhaustion: FALSE (Dynamic List bounds)');
      } else {
        setPlayData([100, 105, 110]);
        setHighlightedSimIdxs([]);
        setSimMessage('Loaded front-to-rear queue buffer.');
      }
    } else if (activeTopicId === 'complexity-time') {
      if (action === 'O(1) Access') {
        setSimMessage('Constant time operation: directly reading index 3 reference...');
        setHighlightedSimIdxs([3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage(`A[3] = ${playData[3]} retrieved instantly in O(1) step independent of array size!`);
      } else if (action === 'O(N) Loop') {
        setSimMessage('Linear time operation: scanning every memory cell in order...');
        for(let i=0; i<playData.length; i++) {
          setHighlightedSimIdxs([i]);
          await new Promise(r => setTimeout(r, speedMs));
        }
        setSimMessage(`Scanned ${playData.length} cells. Total operations scale directly with N: O(N).`);
      } else if (action === 'O(N²) Nested') {
        setSimMessage('Quadratic time operation: executing nested index comparisons (N x N)...');
        setHighlightedSimIdxs([0, 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setHighlightedSimIdxs([1, 2]);
        await new Promise(r => setTimeout(r, speedMs));
        setHighlightedSimIdxs([2, 3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Operations grow exponentially with squared dimensions: O(N²). Dangerous for large inputs!');
      } else if (action === 'O(log N) Split') {
        setSimMessage('Logarithmic time: continually halving the search space boundaries...');
        setHighlightedSimIdxs([0, playData.length - 1]);
        await new Promise(r => setTimeout(r, speedMs));
        const mid = Math.floor(playData.length / 2);
        setHighlightedSimIdxs([mid]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Reduced remaining search range by 50% in a single bisection block: O(log N). Highly optimal!');
      } else {
        setPlayData([1, 10, 100, 1000]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset complexity baseline parameters.');
      }
    } else if (activeTopicId === 'complexity-space') {
      if (action === 'O(1) Var') {
        setSimMessage('Constant extra space: mutating storage pointers directly in-place...');
        setHighlightedSimIdxs([0]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Allocated exactly 1 local auxiliary registers. Total Space: O(1). Perfect economy!');
      } else if (action === 'O(N) Copy') {
        setSimMessage('Linear auxiliary space: duplicating collection inside the heap...');
        setHighlightedSimIdxs([0]);
        await new Promise(r => setTimeout(r, speedMs / 2));
        setHighlightedSimIdxs([0, 1]);
        await new Promise(r => setTimeout(r, speedMs / 2));
        setHighlightedSimIdxs([0, 1, 2]);
        await new Promise(r => setTimeout(r, speedMs / 2));
        setHighlightedSimIdxs([0, 1, 2, 3]);
        await new Promise(r => setTimeout(r, speedMs / 2));
        setSimMessage(`Duplicated N=${playData.length} elements to duplicate buffers. Total extra space: O(N).`);
      } else if (action === 'O(N²) Grid') {
        setSimMessage('Quadratic space: constructing an N x N connection adjacency grid...');
        setHighlightedSimIdxs(playData.map((_, i) => i));
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage(`Grid represents N² = ${playData.length * playData.length} cells. Space: O(N²). Heavy RAM footprint!`);
      } else if (action === 'Heap Check') {
        setSimMessage('Checking current dynamic allocated stack frame limits...');
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Heap memory utilization is nominal and stable.');
      } else {
        setPlayData([2, 4, 8, 16]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset space complexity registers.');
      }
    } else if (activeTopicId === 'linked_list') {
      if (action === 'Insert Head') {
        const itemVal = Math.floor(Math.random() * 90) + 10;
        setSimMessage(`Creating new Node(${itemVal}). Pointer pointing to current head...`);
        setHighlightedSimIdxs([0]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => [itemVal, ...prev]);
        setSimMessage(`Successfully inserted Node(${itemVal}) at head in constant O(1) time!`);
      } else if (action === 'Delete Head') {
        if (playData.length === 0) {
          setSimMessage('Linked List underflow! Nothing to delete.');
        } else {
          setSimMessage('Unlinking head Node reference pointing head to next node...');
          setHighlightedSimIdxs([0]);
          await new Promise(r => setTimeout(r, speedMs));
          setPlayData(prev => prev.slice(1));
          setSimMessage('Successfully deleted head node in O(1) time!');
        }
      } else if (action === 'Reverse Links') {
        setSimMessage('Reversing pointer directions iteratively: Prev -> Current -> Next...');
        setHighlightedSimIdxs([0, playData.length - 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => [...prev].reverse());
        setSimMessage('Reversed all arrow references and set a new head pointer!');
      } else if (action === 'Find Middle') {
        if (playData.length === 0) {
          setSimMessage('Empty linked list.');
        } else {
          setSimMessage('Running Slow-Fast split pointers tracking middle...');
          const midIdx = Math.floor(playData.length / 2);
          setHighlightedSimIdxs([midIdx]);
          await new Promise(r => setTimeout(r, speedMs));
          setSimMessage(`Fast pointer reached tail! Slow pointer settled on Middle Node: ${playData[midIdx]}.`);
        }
      } else {
        setPlayData([12, 18, 25, 34]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset Linked List pointers.');
      }
    } else if (activeTopicId === 'hash_table') {
      if (action === 'Hash Insert') {
        const itemVal = Math.floor(Math.random() * 90) + 10;
        const bucket = itemVal % 4;
        setSimMessage(`Hashing key ${itemVal} ... Formula: key % 4 = Bucket ${bucket}`);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => {
          const next = [...prev];
          next[bucket] = itemVal;
          return next;
        });
        setHighlightedSimIdxs([bucket]);
        setSimMessage(`Inserted value ${itemVal} directly into Bucket ${bucket} in O(1) time!`);
      } else if (action === 'Resolve Collision') {
        setSimMessage('Demonstrating separate chaining: appending nodes together in same bucket...');
        setHighlightedSimIdxs([1]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Created standard overflow linked list node in entry bucket chain.');
      } else if (action === 'Search Table') {
        const target = playData[Math.floor(Math.random() * playData.length)] || 31;
        const bucket = target % 4;
        setSimMessage(`Seeking key ${target}. Fetch bucket pointer Index ${bucket} in O(1) time...`);
        setHighlightedSimIdxs([bucket]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage(`MATCH found at bucket ${bucket}! Target key located instantly.`);
      } else if (action === 'Clear Buckets') {
        setPlayData([0, 0, 0, 0]);
        setHighlightedSimIdxs([]);
        setSimMessage('Cleaned all hash bucket memory slots.');
      } else {
        setPlayData([7, 31, 19, 41]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset Hash Table buckets map.');
      }
    } else if (activeTopicId === 'binary_search') {
      if (action === 'Bisect Mid') {
        const mid = Math.floor(playData.length / 2);
        setSimMessage(`Step 1: Finding middle element between index 0 - ${playData.length-1}. Mid is indices ${mid} (value ${playData[mid]}).`);
        setHighlightedSimIdxs([mid]);
        await new Promise(r => setTimeout(r, speedMs));
      } else if (action === 'Check Left Half') {
        setSimMessage('Comparing: Target is smaller than current middle. Shifting High boundary leftwards...');
        setHighlightedSimIdxs([0, 1, 2]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Discarded entire upper right half of search space!');
      } else if (action === 'Check Right Half') {
        setSimMessage('Comparing: Target is larger than current middle. Shifting Low boundary rightwards...');
        setHighlightedSimIdxs([4, 5, 6]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Discarded entire lower left half of search space!');
      } else if (action === 'Validate Match') {
        setSimMessage('Bisection check bounds overlap: MATCH confirmed!');
        setHighlightedSimIdxs([4]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Successfully found key output in fast O(log N) operations.');
      } else {
        setPlayData([5, 12, 19, 23, 37, 45, 59]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset bisection search list.');
      }
    } else if (activeTopicId === 'avl_tree') {
      if (action === 'Check Balance') {
        setSimMessage('Evaluating balance factors on recursion layers...');
        setHighlightedSimIdxs([0, 1, 2]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Imbalance detected at root node! Balance factor = +2.');
      } else if (action === 'Rotate Left') {
        setSimMessage('Rotating Left... Pulling right child up, pushing root down.');
        setHighlightedSimIdxs([2, 3]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData([20, 10, 30, 40]);
        setSimMessage('Rotation completed. Tree balance restored.');
      } else if (action === 'Rotate Right') {
        setSimMessage('Rotating Right... Pulling left child up, pushing root down.');
        setHighlightedSimIdxs([0, 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData([20, 10, 40, 30]);
        setSimMessage('Rotation completed. Balanced subtrees successfully.');
      } else if (action === 'Rebalance Tree') {
        setSimMessage('Running self-balancing pass on all nodes...');
        setHighlightedSimIdxs(playData.map((_, i) => i));
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Binary Tree verified balanced! Max height is log(N).');
      } else {
        setPlayData([40, 20, 10, 30]);
        setHighlightedSimIdxs([]);
        setSimMessage('Loaded standard unbalanced tree.');
      }
    } else if (activeTopicId === 'trie') {
      if (action === 'Insert Prefix') {
        setSimMessage('Inserting word characters into Trie chain: a -> l -> g -> o...');
        for(let i=0; i<playData.length; i++) {
          setHighlightedSimIdxs([i]);
          await new Promise(r => setTimeout(r, speedMs / 2));
        }
        setSimMessage('Successfully mapped character paths in prefix trie.');
      } else if (action === 'Search Prefix') {
        setSimMessage('Searching prefix string: "alg"...');
        setHighlightedSimIdxs([0, 1, 2]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Prefix matches branch pointers successfully!');
      } else if (action === 'Match Partial') {
        setSimMessage('Scanning root descendants for children markers...');
        setHighlightedSimIdxs([3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Discovered prefix matches in nested keys.');
      } else if (action === 'Autocomplete') {
        setSimMessage('Matching candidate characters under prefix "algo"...');
        setHighlightedSimIdxs([0, 1, 2, 3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Autocomplete suggestions returned: ["algorithm", "algorithmic", "algobot"]!');
      } else {
        setPlayData([97, 108, 103, 111]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset prefix trie buffer.');
      }
    } else if (activeTopicId === 'graph') {
      if (action === 'Run BFS') {
        setSimMessage('Running Breadth-First Search queue: Level-by-Level path tracing...');
        for(let i=0; i<playData.length; i++) {
          setHighlightedSimIdxs([i]);
          await new Promise(r => setTimeout(r, speedMs));
        }
        setSimMessage('Traversals: Node 0 -> 1 -> 2 -> 3. Visited all vertices!');
      } else if (action === 'Run DFS') {
        setSimMessage('Running Depth-First Search: tracing depth recursively with active stack...');
        const dfsOrder = [0, 2, 3, 1];
        for(let i=0; i<dfsOrder.length; i++) {
          const idx = playData.indexOf(dfsOrder[i]);
          if (idx !== -1) setHighlightedSimIdxs([idx]);
          await new Promise(r => setTimeout(r, speedMs));
        }
        setSimMessage('DFS path completed! Backtracks processed correctly.');
      } else if (action === 'Add Vertex Link') {
        setSimMessage('Adding dynamic edge link: Node 1 <---> Node 3...');
        setHighlightedSimIdxs([1, 3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Updated Adjacency matrix weighted edges.');
      } else if (action === 'Shortest Route') {
        setSimMessage("Invoking Dijkstra's shortest path...");
        setHighlightedSimIdxs([0, 2, 3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Resolved shortest path routing weight in O(E + V log V) time!');
      } else {
        setPlayData([0, 1, 2, 3]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset network topology vertices.');
      }
    } else if (activeTopicId === 'dp') {
      if (action === 'Memoize State') {
        setSimMessage('Checking memoization lookup directory cache before computing...');
        setHighlightedSimIdxs([0, 1]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Subproblem result loaded instantly from Cache Table in O(1)! Saving recalculation.');
      } else if (action === 'Compute Fibonacci') {
        setSimMessage('Calculating Fibonacci index values sequentially...');
        for(let i=2; i<playData.length; i++) {
          setHighlightedSimIdxs([i-2, i-1]);
          await new Promise(r => setTimeout(r, speedMs));
          setHighlightedSimIdxs([i]);
          await new Promise(r => setTimeout(r, speedMs / 2));
        }
        setSimMessage('Transition Formula computed: F(n) = F(n-1) + F(n-2) correctly!');
      } else if (action === 'Solve Subproblem') {
        setSimMessage('Solving bottom-up subproblems recursively...');
        setHighlightedSimIdxs([3]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Subtask completed. Value populated into lookup table.');
      } else if (action === 'Tabulate Values') {
        setSimMessage('Building entire linear bottom-up tabulation DP-array...');
        setHighlightedSimIdxs(playData.map((_, i) => i));
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage('Linear lookup table populated. Space: O(N), Time: O(N). Fast scaling!');
      } else {
        setPlayData([1, 1, 2, 3, 5, 8]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset dynamic programming registers.');
      }
    } else { // bst / trees
      if (action === 'Insert Node') {
        const randomNode = Math.floor(Math.random() * 80) + 15;
        setSimMessage(`Adding node key ${randomNode}... traversing tree levels.`);
        await new Promise(r => setTimeout(r, speedMs));
        setPlayData(prev => {
          if (prev.includes(randomNode)) return prev;
          return [...prev, randomNode];
        });
        setSimMessage(`Inserted node ${randomNode} at leaf location.`);
      } else if (action === 'In-Order Traversal') {
        setSimMessage('Invoking In-Order recursion (Left, Root, Right)...');
        const sorted = [...playData].sort((a,b) => a-b);
        for(let i=0; i<sorted.length; i++) {
          const originalIdx = playData.indexOf(sorted[i]);
          if(originalIdx !== -1) setHighlightedSimIdxs([originalIdx]);
          await new Promise(r => setTimeout(r, speedMs));
        }
        setSimMessage(`Traversal logs: [ ${sorted.join(', ')} ]. Elements printed ascending!`);
      } else if (action === 'Search Key') {
        const target = playData[Math.floor(Math.random() * playData.length)] || 50;
        setSimMessage(`Searching for key ${target}... comparing binary boundaries.`);
        await new Promise(r => setTimeout(r, speedMs));
        const originalIdx = playData.indexOf(target);
        if(originalIdx !== -1) setHighlightedSimIdxs([originalIdx]);
        setSimMessage(`Found node ${target} in O(log N) operations!`);
      } else if (action === 'Find Min/Max') {
        setSimMessage('Traversing to extreme left leaf edge...');
        const minVal = Math.min(...playData);
        setHighlightedSimIdxs([playData.indexOf(minVal)]);
        await new Promise(r => setTimeout(r, speedMs));
        setSimMessage(`Leftmost minimum element in BST is: ${minVal}`);
      } else {
        setPlayData([50, 30, 70, 20, 40, 60, 80]);
        setHighlightedSimIdxs([]);
        setSimMessage('Reset tree root registers.');
      }
    }

    setHighlightedSimIdxs([]);
    setIsSimulating(false);
  };

  // Gamification & Progress radar data
  const radarData = [
    { subject: 'Contiguous List (Array)', A: completedTopics.includes('arrays') ? 100 : 40, fullMark: 100 },
    { subject: 'Dynamic Strings', A: completedTopics.includes('strings') ? 100 : 30, fullMark: 100 },
    { subject: 'Sequential (Stack/Queue)', A: solvedProblems.length >= 2 ? 85 : 45, fullMark: 100 },
    { subject: 'Hierarchal (Trees)', A: completedTopics.includes('trees') ? 95 : 20, fullMark: 100 },
    { subject: 'Logarithmic Analysis', A: solvedProblems.length >= 1 ? 90 : 35, fullMark: 100 },
    { subject: 'Practical Problem solving', A: Math.min(100, (solvedProblems.length / 5) * 100), fullMark: 100 },
  ];

  const earnedXP = (completedTopics.length * 150) + (solvedProblems.length * 80) + (bookmarks.length * 20);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* =========================================================================
                                     LEFT COLUMN: ROADMAPS & FILTERS 
         ========================================================================= */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Progress & Gamification Dashboard Widget */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/5 dark:bg-indigo-400/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 mb-3">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest block">Classroom Standing</span>
              <h3 className="font-sans font-black text-slate-800 dark:text-neutral-100 text-base leading-tight">Elite DSA Scholar</h3>
            </div>
          </div>

          {/* XP & Streak details */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 mb-4">
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Total XP</span>
              <span className="font-mono font-black text-xs text-[#2563EB]">{earnedXP} pts</span>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Day Streak</span>
              <span className="font-mono font-black text-xs text-amber-500 flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                <span>6 Days</span>
              </span>
            </div>
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Rank</span>
              <span className="font-mono font-black text-xs text-[#7C3AED]">Top 4%</span>
            </div>
          </div>

          {/* Circular/Radar Recharts diagram display */}
          <div className="h-[180px] w-full flex items-center justify-center font-sans text-[8px] dark:text-neutral-400 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 7, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 6 }} />
                <Radar name="Student Metrics" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
            <span className="text-[10px] text-slate-405 dark:text-slate-500">
              Solve topics & problems to increase algorithm coverage.
            </span>
          </div>
        </div>

        {/* Roadmaps & Search Navigation list card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              id="study-search-input"
              type="text" 
              placeholder="Search topic, category, difficulty..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-neutral-200 transition-all font-sans placeholder-slate-400"
            />
          </div>

          {/* Difficulty Quick Filters */}
          <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl shrink-0 text-[10px] font-bold">
            {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficultyFilter(d)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-center cursor-pointer transition-all ${
                  difficultyFilter === d
                    ? 'bg-indigo-650 text-white shadow-xs'
                    : 'text-slate-505 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {d === 'all' ? 'All tiers' : d}
              </button>
            ))}
          </div>

          {/* Study Roadmap Chapters: Beginner, Intermediate, Advanced */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
            
            {/* Loop categories of Roadmap */}
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((difficulty) => {
              // skip if filtered
              if (difficultyFilter !== 'all' && difficultyFilter !== difficulty) return null;
              
              const filteredList = ROADMAP_TOPICS[difficulty].filter(item => matchRoadmapTopic(item.name));
              if (filteredList.length === 0) return null;

              return (
                <div key={difficulty} className="space-y-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-1 block ${
                    difficulty === 'Beginner' ? 'text-emerald-500' : difficulty === 'Intermediate' ? 'text-amber-500' : 'text-purple-500'
                  }`}>
                    {difficulty} Level Roadmap
                  </span>

                  <div className="space-y-1.5">
                    {filteredList.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = activeTopicId === item.id;
                      const isCompleted = completedTopics.includes(item.id);
                      const isBookmarked = bookmarks.includes(item.id);

                      return (
                        <div 
                          key={item.id}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group ${
                            isSelected
                              ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/20'
                          }`}
                        >
                          <button
                            id={`roadmap-item-${item.id}`}
                            type="button"
                            onClick={() => {
                              setActiveTopicId(item.id);
                            }}
                            className="flex-1 flex items-center gap-3 min-w-0"
                          >
                            {/* Check circle state */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompleteTopic(item.id);
                              }}
                              className="cursor-pointer text-slate-300 dark:text-slate-700 hover:text-indigo-600 transition-colors"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/10" />
                              ) : (
                                <Circle className="w-4.5 h-4.5" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold leading-none ${
                                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-350'
                                }`}>
                                  {item.name}
                                </span>
                                {item.isConceptOnly && (
                                  <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1 py-0.2 rounded font-mono">
                                    Concept
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 block flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-300 dark:text-slate-700" />
                                <span>{item.timeLimit}</span>
                              </span>
                            </div>
                          </button>

                          {/* Action elements */}
                          <div className="flex items-center gap-1 text-slate-300 dark:text-slate-755">
                            <button
                              id={`bookmark-${item.id}`}
                              type="button"
                              onClick={() => toggleBookmark(item.id)}
                              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                                isBookmarked ? 'text-amber-500' : 'hover:text-slate-600'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamification Badge Showcase */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] dark:text-blue-400">
              Badge & Achievements Unlocked
            </h4>
            <span className="text-[9px] font-mono text-slate-450">3 of 7 Earned</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <span className="text-xl">🏆</span>
              <div>
                <h5 className="text-[10px] font-extrabold text-slate-850 dark:text-neutral-200">First Steps</h5>
                <p className="text-[8px] text-slate-405 leading-none mt-0.5">Completed Array chapter</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <span className="text-xl">🔥</span>
              <div>
                <h5 className="text-[10px] font-extrabold text-slate-850 dark:text-neutral-200">Consistency</h5>
                <p className="text-[8px] text-slate-405 leading-none mt-0.5">Maintained 5D play streak</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <span className="text-xl">🛠️</span>
              <div>
                <h5 className="text-[10px] font-extrabold text-slate-850 dark:text-neutral-200">Editor Champion</h5>
                <p className="text-[8px] text-slate-405 leading-none mt-0.5">Drafted dynamic offline notes</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-dashed border-slate-200 dark:border-slate-800 p-2.5 rounded-xl opacity-40">
              <span className="text-xl grayscale">👑</span>
              <div>
                <h5 className="text-[10px] font-extrabold text-slate-855 dark:text-neutral-200">Recursion Overlord</h5>
                <p className="text-[8px] text-slate-405 leading-none mt-0.5">Unlocks on Graph solved</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
                               MAIN TOPIC EDUCATION LAB & INTEGRATIONS
         ========================================================================= */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Topic Title Header with description */}
        <div id="study-guide-main-frame" className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-1.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-black text-2xl text-slate-800 dark:text-neutral-100 tracking-tight">
                {activeTopicObj.name}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                activeTopicObj.difficulty === 'Beginner' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                  : activeTopicObj.difficulty === 'Intermediate' 
                    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                    : 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
              }`}>
                {activeTopicObj.difficulty}
              </span>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleCompleteTopic(activeTopicObj.id)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  completedTopics.includes(activeTopicObj.id)
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{completedTopics.includes(activeTopicObj.id) ? 'Completed!' : 'Mark Completed'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-505 dark:text-slate-400 max-w-2xl leading-relaxed space-y-2">
            {activeTopicObj.overview.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {activeTopicObj.tags.map(t => (
              <span key={t} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-[10px] font-bold text-slate-405 dark:text-slate-400 px-2 py-0.5 rounded-md">
                <Tag className="w-2.5 h-2.5" />
                <span>{t}</span>
              </span>
            ))}
          </div>

          {/* View Mode Switching Tabs */}
          <div className="flex flex-wrap gap-2.5 border-t border-slate-100 dark:border-slate-850 pt-4 mt-4">
            <button
              type="button"
              id="btn-view-mode-study"
              onClick={() => {
                setActiveViewMode('study');
                showToast("Switched to concept lecture and interactive play workspace!", "info");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activeViewMode === 'study'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-50/60 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 border-slate-150 dark:border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 Concept Study & Simulator</span>
            </button>
            
            <button
              type="button"
              id="btn-view-mode-problems"
              onClick={() => {
                setActiveViewMode('problems');
                showToast(`Let's solve ${activeTopicObj.name} coding problems!`, "success");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activeViewMode === 'problems'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-50/60 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 border-slate-150 dark:border-slate-800'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>✍️ Practice Problems & Sandbox ({activeTopicObj.problems.length})</span>
            </button>
          </div>
        </div>

        {activeViewMode === 'study' ? (
          <div className="space-y-6">
            {/* -------------------------------------------------------------
                           INTERACTIVE PLAYGROUND / TOY SIMULATOR
               ------------------------------------------------------------- */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Interactive Simulator Playground</span>
                </h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">Speed Ms:</span>
                  <select 
                    value={speedMs} 
                    onChange={(e) => setSpeedMs(parseInt(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded px-1.5 py-0.5 text-[9px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={10}>Turbo (10ms / 10Kμs)</option>
                    <option value={200}>Fast (200ms)</option>
                    <option value={500}>Medium (500ms)</option>
                    <option value={800}>Slow (800ms)</option>
                  </select>
                </div>
              </div>

              {/* SIMULATION VISUAL BOX */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative">
                <div className="text-[10px] font-mono text-slate-400 absolute top-2 left-3">
                  Memory Array Registers Model
                </div>

                {/* Animation state text log */}
                <div className="text-center max-w-md mx-auto mb-5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-neutral-200 mt-1 leading-snug">
                    {simMessage}
                  </p>
                </div>

                <div className="flex items-end justify-center gap-2 flex-wrap min-h-[50px] px-4 w-full">
                  <AnimatePresence mode="popLayout">
                    {playData.map((val, idx) => {
                      const isHighlighted = highlightedSimIdxs.includes(idx);
                      return (
                        <motion.div
                          key={`${idx}-${val}`}
                          layout
                          initial={{ scale: 0.8, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0, y: -15 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className={`relative flex flex-col items-center justify-center min-w-[34px] h-[34px] shadow-xs text-xs font-mono font-black rounded-lg transition-colors leading-none border ${
                            isHighlighted 
                              ? 'bg-amber-400 text-slate-900 border-amber-400 animate-pulse'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-neutral-200 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <span>{val}</span>
                          <span className="absolute -bottom-4 text-[7px] text-slate-400 font-bold">
                            i={idx}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* SIMULATOR OPERATOR CONTROLS */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                {activeTopicObj.operations.map((opName) => (
                  <button
                    key={opName}
                    type="button"
                    disabled={isSimulating}
                    onClick={() => executeSimAction(opName)}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-50 hover:bg-indigo-50 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-150 dark:border-slate-800 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 select-none cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-[#2563EB]" />
                    <span>{opName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* -------------------------------------------------------------
                           COMPLEXITY MATRIX TABLE & CODE VIEWER
               ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Operations Complexity table card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-purple-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#7C3AED]" />
                  <span>Complexity Boundaries Analysis</span>
                </h4>

                <div className="overflow-hidden border border-slate-150 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-slate-100/50 dark:bg-slate-950/20 text-[10px] font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="p-3">Operation Target</th>
                        <th className="p-3 text-center">Time</th>
                        <th className="p-3 text-center">Space</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="p-3 font-medium text-slate-500">Insert element</td>
                        <td className="p-3 text-center font-bold text-[#f59e0b]">{activeTopicObj.timeComplexity.insert}</td>
                        <td className="p-3 text-center text-slate-400">{activeTopicObj.spaceComplexity}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-slate-500">Delete element</td>
                        <td className="p-3 text-center font-bold text-[#ef4444]">{activeTopicObj.timeComplexity.delete}</td>
                        <td className="p-3 text-center text-slate-400">{activeTopicObj.spaceComplexity}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-slate-500">Search value</td>
                        <td className="p-3 text-center font-bold text-[#2563EB]">{activeTopicObj.timeComplexity.search}</td>
                        <td className="p-3 text-center text-slate-400">{activeTopicObj.spaceComplexity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Note prompt card */}
                <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-900/30 p-3.5 rounded-xl flex gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                    <strong>Big-O Tip:</strong> When evaluating arrays, indices let the compiler read space locations in exact <span className="font-bold text-amber-600">O(1)</span> time. Shift iterations drag values sequentially, giving rise to <span className="font-bold text-red-500">O(N)</span>.
                  </p>
                </div>
              </div>

              {/* Syntax-Highlighted Code Tabs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-neutral-200 flex items-center gap-1.5 font-sans">
                    <Code className="w-4 h-4 text-indigo-500" />
                    <span>Reference Snippets</span>
                  </h4>

                  {/* Languages tabs */}
                  <select
                    id="code-lang-selector"
                    value={activeCodeLang}
                    onChange={(e) => setActiveCodeLang(e.target.value as any)}
                    className="bg-slate-55 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-sans font-bold text-slate-600 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java Class</option>
                    <option value="python">Python 3</option>
                    <option value="cpp">C++ std::</option>
                  </select>
                </div>

                {/* Code Box */}
                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-150 dark:border-slate-800 rounded-xl p-3.5 font-mono text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto min-h-[140px] relative flex-1">
                  <button
                    id="copy-code-element"
                    type="button"
                    onClick={handleCopyCode}
                    className="absolute top-2.5 right-2.5 p-1 rounded bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-505" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre>{activeTopicObj.codeSnippets[activeCodeLang]}</pre>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                           REAL-WORLD APPLICATIONS SECTION
               ------------------------------------------------------------- */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                <span>Industrial Real-World Impact Scenarios</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTopicObj.realWorldApps.map((app, idx) => {
                  const IconComponent = app.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-xl space-y-2 hover:bg-slate-100/30 transition-colors"
                    >
                      <div className="p-2 w-max rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h5 className="text-[11px] font-black text-slate-800 dark:text-neutral-100 uppercase tracking-tight">
                        {app.title}
                      </h5>
                      <p className="text-[10px] text-slate-455 dark:text-slate-400 leading-normal">
                        {app.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* -------------------------------------------------------------
                           INTERVIEW PREPARATION SECTION
               ------------------------------------------------------------- */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-purple-400 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#7C3AED]" />
                  <span>Interview Masterclass Prep</span>
                </h4>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">Suggested LeetCode tier:</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${
                    activeTopicObj.interviewPrep.leetcodeDifficulty === 'Easy'
                      ? 'bg-emerald-500'
                      : activeTopicObj.interviewPrep.leetcodeDifficulty === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}>
                    {activeTopicObj.interviewPrep.leetcodeDifficulty}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Frequently Asked Questions */}
                <div className="space-y-2.5">
                  <h5 className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider block">Frequently Asked Questions</h5>
                  <div className="space-y-2">
                    {activeTopicObj.interviewPrep.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 p-3 rounded-lg">
                        <p className="font-semibold text-slate-700 dark:text-neutral-200">Q: {faq.split('?')[0] + '?'}</p>
                        <p className="text-[10px] text-slate-455 dark:text-slate-400 mt-1 leading-snug">A: {faq.split('?')[1]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edge Cases, Common Mistakes & Followups */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider block">Common Mistakes</h5>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[10px] leading-snug text-slate-505 dark:text-slate-400">
                      {activeTopicObj.interviewPrep.mistakes.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider block">Primary Edge Cases</h5>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[10px] leading-snug text-slate-505 dark:text-slate-400">
                      {activeTopicObj.interviewPrep.edges.map((e, idx) => (
                        <li key={idx}>{e}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-150/40 dark:border-indigo-900/20 p-3.5 rounded-xl">
                    <h6 className="text-[10px] font-black uppercase text-indigo-650 dark:text-indigo-400 mb-1 leading-none">Best Optimization Strategy</h6>
                    <p className="text-[10px] text-slate-500 leading-snug font-sans">
                      {activeTopicObj.interviewPrep.optimization}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Track Prompt to Problems */}
            <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-sans font-extrabold text-base">Completed Reading the Concept?</h4>
                <p className="text-xs text-indigo-100">Toggle above to active Practice Mode and attempts simulated problems with test suites!</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveViewMode('problems');
                  showToast(`Let's solve ${activeTopicObj.name} coding problems!`, "success");
                }}
                className="bg-white hover:bg-neutral-150 text-indigo-700 text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                Start Practice Challenges →
              </button>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------------
                         PRACTICE PROBLEMS LISTING & LIVE INTERACTIVE SANDBOX
             ------------------------------------------------------------- */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Recommended categorized problems */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-blue-400">
                      Challenge Workbook
                    </h4>
                    <span className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                      {activeTopicObj.problems.filter(p => solvedProblems.includes(p.id)).length} / {activeTopicObj.problems.length} solved
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-455 dark:text-slate-400 leading-normal">
                    Select a question to load its active code template and run assertion suites inside the interactive console.
                  </p>
                </div>

                {/* Difficulty Category Filters */}
                <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-150 dark:border-slate-850">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
                    const count = diff === 'All' 
                      ? activeTopicObj.problems.length 
                      : activeTopicObj.problems.filter(p => p.difficulty === diff).length;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedProblemDifficultyFilter(diff)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          selectedProblemDifficultyFilter === diff
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-450 shadow-xs border border-slate-100 dark:border-slate-800'
                            : 'text-slate-505 dark:text-slate-400 hover:text-indigo-600'
                        }`}
                      >
                        {diff} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Problems Scroll container */}
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {activeTopicObj.problems
                    .filter(p => selectedProblemDifficultyFilter === 'All' || p.difficulty === selectedProblemDifficultyFilter)
                    .map((prob) => {
                      const isSolved = solvedProblems.includes(prob.id);
                      const isSelected = attemptingProblem?.id === prob.id;
                      return (
                        <div
                          key={prob.id}
                          onClick={() => {
                            setAttemptingProblem(prob);
                            setAttemptCode(getProblemTemplate(prob.title, activeCodeLang));
                            setCodeOutputCode('');
                            showToast(`Loaded ${prob.title} editor workspace!`, 'success');
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                            isSelected
                              ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500'
                              : isSolved
                                ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-150 dark:border-emerald-950/50 hover:bg-slate-50/60'
                                : 'bg-slate-50/40 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/80 hover:bg-slate-55'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                                : prob.difficulty === 'Medium'
                                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                                  : 'bg-red-50 dark:bg-red-950/20 text-red-600'
                            }`}>
                              {prob.difficulty}
                            </span>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProblemSolved(prob.id);
                              }}
                              className="text-slate-400 hover:text-indigo-650 transition-colors shrink-0"
                            >
                              {isSolved ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                            {prob.title}
                          </h5>

                          <div className="flex justify-between items-center text-[9px] text-slate-400 mt-2.5">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-2.5 h-2.5" />
                              {prob.estTime}
                            </span>
                            <span className="text-[10px] text-indigo-505 font-bold group-hover:underline flex items-center gap-0.5 select-none">
                              <span>{isSelected ? 'Active Sandbox' : 'Attempt'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {activeTopicObj.problems.filter(p => selectedProblemDifficultyFilter === 'All' || p.difficulty === selectedProblemDifficultyFilter).length === 0 && (
                    <div className="text-center py-10 text-xs text-slate-400 space-y-1">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p>No practice items found matching "{selectedProblemDifficultyFilter}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: High-tech Dark Interactive Sandbox Terminal */}
              <div className="lg:col-span-7 bg-[#090d16] text-slate-200 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between min-h-[500px]">
                
                {/* Terminal top header */}
                <div className="bg-slate-900 border-b border-slate-850 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase ml-1 tracking-wider">
                      Console Compiler V1.9_Alpha
                    </span>
                  </div>

                  {attemptingProblem && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttemptingProblem(null);
                        setAttemptCode('');
                        setCodeOutputCode('');
                      }}
                      className="text-slate-400 hover:text-white text-[9px] uppercase font-mono font-bold tracking-wider hover:underline"
                    >
                      [Close Console]
                    </button>
                  )}
                </div>

                {!attemptingProblem ? (
                  /* Welcome active state */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500/15 rounded-full blur-xl animate-pulse" />
                      <Cpu className="w-12 h-12 text-indigo-400 relative" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h5 className="font-sans font-extrabold text-sm text-neutral-100">
                        Interactive Sandbox Compiler
                      </h5>
                      <p className="text-[11px] text-slate-455 font-sans leading-relaxed">
                        To activate this workspace, click any recommended coding problem from the list. The system will load optimal function skeletons and evaluate test assertion gates in real-time.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                      <span className="px-2.5 py-1 text-[9px] font-mono rounded bg-slate-900/60 border border-slate-800/80 text-slate-400">
                        ✓ Standard Mock Assertions
                      </span>
                      <span className="px-2.5 py-1 text-[9px] font-mono rounded bg-slate-900/60 border border-slate-800/80 text-slate-400">
                        ✓ O(1) Guidance Hints
                      </span>
                      <span className="px-2.5 py-1 text-[9px] font-mono rounded bg-slate-900/60 border border-slate-800/80 text-slate-400">
                        ✓ Multi-Language Headers
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Code Editor workspace panel */
                  <div className="flex-1 flex flex-col justify-between">
                    
                    {/* Active Question Info band */}
                    <div className="bg-slate-950/60 px-4 py-3 border-b border-slate-850 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-white">{attemptingProblem.title}</h4>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                            attemptingProblem.difficulty === 'Easy'
                              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/40'
                              : attemptingProblem.difficulty === 'Medium'
                                ? 'bg-amber-950/50 text-amber-400 border-amber-900/40'
                                : 'bg-red-950/50 text-red-405 border-red-900/40'
                          }`}>
                            {attemptingProblem.difficulty}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-mono">
                          Benchmark standard time limit: <span className="text-indigo-400 font-bold">{attemptingProblem.estTime}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase font-mono">Syntax:</span>
                        <select
                          id="sandbox-syntax-picker"
                          value={activeCodeLang}
                          onChange={(e) => {
                            const nextLang = e.target.value as any;
                            setActiveCodeLang(nextLang);
                            setAttemptCode(getProblemTemplate(attemptingProblem.title, nextLang));
                            setCodeOutputCode('');
                          }}
                          className="bg-slate-900 border border-slate-750 text-[10px] font-mono font-bold px-2 py-1 rounded text-neutral-200 focus:outline-none"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python 3</option>
                          <option value="java">Java Class</option>
                          <option value="cpp">C++ std::</option>
                        </select>
                      </div>
                    </div>

                    {/* TextArea layout */}
                    <div className="flex-1 p-4 flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          Workspace Code registers
                        </label>
                        <span className="text-[8px] font-mono text-indigo-400/80">editable block</span>
                      </div>
                      <textarea
                        value={attemptCode}
                        onChange={(e) => setAttemptCode(e.target.value)}
                        rows={13}
                        className="w-full bg-[#05080f] text-emerald-400 font-mono text-[11px] p-3 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none leading-relaxed resize-none flex-1 placeholder:text-slate-850"
                        placeholder="// Enter your custom DSA solution code here..."
                      />
                    </div>

                    {/* Console log outputs segment */}
                    {codeOutputCode && (
                      <div className="mx-4 mb-2 bg-[#030509] border border-slate-850 p-3 rounded-xl font-mono text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500 border-b border-slate-850 pb-1 mb-1">
                          <span className="font-extrabold uppercase text-[8px] tracking-widest text-[#2563EB]">
                            Console Output
                          </span>
                          <button
                            type="button"
                            onClick={() => setCodeOutputCode('')}
                            className="hover:text-white"
                          >
                            [Clear]
                          </button>
                        </div>
                        <pre className="text-slate-205 leading-normal max-h-[110px] overflow-y-auto whitespace-pre-wrap">
                          {codeOutputCode}
                        </pre>
                      </div>
                    )}

                    {/* compiler layout actions */}
                    <div className="bg-slate-900/60 p-4 border-t border-slate-850 flex flex-wrap gap-2.5 justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const hintText = 
                              attemptingProblem.title.toLowerCase().includes('two sum') 
                                ? `💡 INTUITION: Hash Map frequency/lookup cache.\nIterating with nested loops takes brute-force O(N²) time. To reduce this bounds, record each item's value and index on-the-fly. If (target - current) is already index-cached in the map, lookup resolved instantly in O(1)!`
                                : attemptingProblem.title.toLowerCase().includes('palindrome')
                                  ? `💡 INTUITION: Dual Pointer sweep.\nInitialize left pointer at index 0 and right pointer at index length - 1. Filter out spaces and punctuation. Moving both towards each other ensures O(N) linear scan and O(1) auxiliary space!`
                                  : `💡 DSA ALGORITHMIC HEURISTIC:\nAnalyze if sliding windows, auxiliary caches, or fast/slow dual pointers can eliminate redundant nested iterations. Look for sorted order flags to use Binary Search!`;
                            setCodeOutputCode(hintText);
                            showToast("Loaded problem intuition guidelines!", "info");
                          }}
                          className="px-3 py-1.5 text-[10px] hover:text-white font-mono bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 rounded-lg transition-all cursor-pointer"
                        >
                          💡 Reveal Hint
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Reset current solution workspace template?")) {
                              setAttemptCode(getProblemTemplate(attemptingProblem.title, activeCodeLang));
                              setCodeOutputCode('');
                              showToast("Template reset completed!", "info");
                            }
                          }}
                          className="px-3 py-1.5 text-[10px] hover:text-white font-mono bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 rounded-lg transition-all cursor-pointer"
                        >
                          🧪 Reset
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={isExecutingCode}
                        onClick={async () => {
                          setIsExecutingCode(true);
                          setCodeOutputCode("⚡ ALLOCATING VIRTUAL MEMORY...\n⚙️ Parsing workspace registers syntax... [SUCCESS]\n🔍 Injecting test assertions...");
                          
                          await new Promise(r => setTimeout(r, 700));
                          setCodeOutputCode(prev => prev + "\n🧪 INJECTING LEETCODE MOCK SUITE ITERATORS...");
                          
                          await new Promise(r => setTimeout(r, 900));
                          
                          const testOutput = 
                            `\n\n🟢 COMPILATION VERDICT:\n` +
                            `-----------------------------------------------------\n` +
                            `✔ assertion 1 (normal set): Passed! [25μs execution duration]\n` +
                            `✔ assertion 2 (extreme boundary checks): Passed!\n` +
                            `✔ assertion 3 (empty bounds nullification): Passed!\n` +
                            `-----------------------------------------------------\n` +
                            `💡 OPTIMIZATION REPORT:\n` +
                            `• Algorithm runtime complexity order: O(N) Space & Time linear limits!\n` +
                            `🎉 RESULTS: Solution Verified and Saved! Great work.`;
                          setCodeOutputCode(prev => prev + testOutput);
                          
                          if (!solvedProblems.includes(attemptingProblem.id)) {
                            const newSolved = [...solvedProblems, attemptingProblem.id];
                            setSolvedProblems(newSolved);
                          }
                          showToast(`Congratulations! Solution verified for ${attemptingProblem.title}!`, "success");
                          setIsExecutingCode(false);
                        }}
                        className="px-4 py-1.5 text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-505/20 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                      >
                        {isExecutingCode ? (
                          <>
                            <span className="w-2.5 h-2.5 border-2 border-white/45 border-t-white rounded-full animate-spin inline-block" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Run Code & Verify</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
                       PERSONAL NOTES CORNER (PERSISTENT LOGS)
           ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-purple-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#7C3AED]" />
              <span>Personal Study Notebook (autosaved)</span>
            </h4>

            <button
              id="export-notes-btn"
              type="button"
              onClick={handleExportNotes}
              className="text-[9px] uppercase font-black text-slate-500 hover:text-indigo-650 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Export Notes</span>
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              id="notes-textarea-input"
              rows={4}
              placeholder={`Write down custom findings or test cases about ${activeTopicObj.name} here... state will remain stored inside browser cookie indexes!`}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-150 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-neutral-200 font-sans"
            />
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-455 font-mono">Character length: {notesInput.length}</span>
              <button
                id="notes-save-btn"
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-indigo-500/10 cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
                                FLOATING AI LEARNING TUTOR CHATFEED
         ========================================================================= */}
      <div 
        id="study-assistant-overlay"
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none"
      >
        <AnimatePresence>
          {aiExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-80 sm:w-96 h-[440px] bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 pointer-events-auto"
            >
              {/* Header */}
              <div className="p-3.5 bg-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-405 fill-amber-400" />
                  <div>
                    <h5 className="text-xs font-black leading-none">AI Mentor Classroom</h5>
                    <span className="text-[8px] opacity-75 mt-0.5 block">Learning copilot active</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAiExpanded(false)}
                  className="text-white hover:text-slate-100 text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              {/* Chat Log lists */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin dark:bg-slate-950/20">
                {aiChatLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 max-w-[85%] rounded-xl text-xs font-sans leading-relaxed ${
                      log.sender === 'user'
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-neutral-200 border border-slate-100 dark:border-slate-800/80'
                    }`}>
                      <p className="whitespace-pre-line">{log.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick suggestions links list */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex gap-1 overflow-x-auto shrink-0 select-none scrollbar-none">
                {AI_FAQ_SUGGESTIONS.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendAiQuery(prompt)}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-[9px] text-slate-550 dark:text-slate-350 hover:text-indigo-600 hover:border-indigo-200 truncate shrink-0 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input field */}
              <div className="p-3 border-t border-slate-150 dark:border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask a technical DSA question..." 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendAiQuery();
                  }}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-705 dark:text-neutral-200"
                />
                <button
                  id="send-ai-btn"
                  type="button"
                  onClick={() => handleSendAiQuery()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger bubble */}
        <button
          id="study-ai-tutor-bubble"
          type="button"
          onClick={() => setAiExpanded(!aiExpanded)}
          className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl pointer-events-auto relative group hover:scale-105 transition-all cursor-pointer"
        >
          <Brain className="w-6 h-6 text-white" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
            📚 Ask Mentor
          </span>
        </button>
      </div>

      {/* Toast Announcement element */}
      <AnimatePresence>
        {toastInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-[60] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800 dark:border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-600 shrink-0 select-none" />
            <span className="text-xs font-semibold font-sans">{toastInfo.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
