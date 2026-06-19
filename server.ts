import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Access token GEMINI_API_KEY is missing from environment. API will return mock/fallback content.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_STANDALONE_RUN",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for multi-turn Gemini-powered explanation and site navigation
  app.post("/api/chat", async (req: express.Request, res: express.Response) => {
    try {
      const { message, history, currentAlgoId } = req.body;

      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt message." });
        return;
      }

      const systemInstruction = `You are "AlgoBot", an advanced, friendly, and highly intelligent computer science tutor and navigation guide for this interactive StudyGuideHub website.

Your twin objectives:
1. Explain any DSA concept step-by-step with brilliant visual analogies, easy-to-read pseudocode, and high-quality Markdown explanations.
2. Directly help users navigate this applet by triggering a specialized UI transition when they ask to find or go to a visualizer.

RESOURCES & NAVIGATION MAP IN THIS WEBSITE:
The user can select and interact with these specific categories and algorithms (algoId) via the sidebar:
- CATEGORY 1: Sorting Algorithms ('sorting')
  * Bubble Sort ('bubble_sort')
  * Selection Sort ('selection_sort')
  * Insertion Sort ('insertion_sort')
  * Merge Sort ('merge_sort')
  * Quick Sort ('quick_sort')
  * Heap Sort ('heap_sort')
- CATEGORY 2: Searching Algorithms ('searching')
  * Linear Search ('linear_search')
  * Binary Search ('binary_search')
  * Jump Search ('jump_search')
- CATEGORY 3: Stacks & Queues ('stack_queue')
  * Custom Stack & Queue operations ('stack_operations', 'queue_operations')
- CATEGORY 4: Linked Lists ('linked_list')
  * Singly, Doubly, and Circular Linked Lists ('linked_list_ops')
- CATEGORY 5: Trees ('trees')
  * Binary Search Trees ('bst_operations')
- CATEGORY 6: Heaps & Tries ('heap_trie')
  * Minimum/Maximum Binary Heaps and Prefix Trie ('heap_trie_ops')
- CATEGORY 7: Graph Algorithms ('graphs')
  * BFS, DFS, Dijkstra's algorithm, and A* Search ('graph_algorithms')

OTHER LAYOUT CAPABILITIES:
- Complexity Panel: Under every visualizer screen, we analyze execution scenarios (Best, Average, Worst Big-O) with inline deep helps. We also feature a robust Compare tab where users select algorithm A and algorithm B to compare their Big-O and space side-by-side!
- Control Hub: Visualizer controls include speed slide controls, play/pause state buttons, singular step back / step forward debug ticks, custom list arrays generators (random generated, static input, fully sorted, reversed reverse).
- Live Code Panel: View syntax-highlighted TS/JS code of the active execution underneath.

INTEGRATED NAVIGATION ACTION:
If a user explicitly asks you to open, visualize, show, go to, or explain a specific sorting/searching/data structure/graph tool (e.g., "show me binary search", "go to Dijkstra's algorithm", "switch to trees", "navigate to comparison mode"), you SHOULD formulate a response explaining it, and then ALWAYS append an action code block.
To trigger navigation on the website, write a single command at the absolute end of your response on its own line exactly like this:
[[[{"action": "navigate", "algoId": "bst_operations"}]]]

The valid 'algoId' values you can use are:
- bubble_sort, selection_sort, insertion_sort, merge_sort, quick_sort, heap_sort
- linear_search, binary_search, jump_search
- stack_operations, queue_operations
- linked_list_ops
- bst_operations
- heap_trie_ops
- graph_algorithms

Do not invent other algorithm IDs. Only include this navigation JSON if they want to switch views or open that specific visualizer. If the user mentions comparing two algorithms, you can navigate them to either of the two, or just explain.

STRICT CONTEXT FOR RELEVANT ASSISTANCE:
- The user is currently studying/viewing the visualizer block of algorithm ID: "${currentAlgoId || "none"}"

COACHING STYLE:
- Always be encouraging, use neat headings, bullet points, and code fragments if suitable.
- Avoid being overly brief; provide a robust, clear explanation when someone asks how an algorithm works.
- If the Gemini API key is missing or we are in mock mode, explain friendly concepts and highlight simulated parameters politely.`;

      // Structure contents array according to @google/genai SDK specs:
      // { role: "user" | "model", parts: [{ text: string }] }
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const item of history) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Lazy load client & call generateContent
      const ai = getGenAI();

      if (!process.env.GEMINI_API_KEY) {
        // Fallback response for standalone local runs of visualizer if key missing
        console.warn("Using local mock DSA system fallback");
        let fallbackText = `I am running in Offline Mode because the Gemini API Key is not set up in your secrets. 

However, let me explain! For the current algorithm **${currentAlgoId || "General DSA"}**:
1. It is a fundamental computer science concept.
2. Space Complexity is optimized to preserve on-device RAM.
3. Time complexity is typically logarithmic or linear.

If you asked to navigate, I can still try to transition your screen! Let me know if you would like me to explain bubble_sort, bst_operations, quick_sort or others.`;

        // Mock simple navigation trigger
        const lowerPrompt = message.toLowerCase();
        for (const possibleId of [
          "bubble_sort", "selection_sort", "insertion_sort", "merge_sort", "quick_sort", "heap_sort",
          "linear_search", "binary_search", "jump_search", "stack_operations", "queue_operations",
          "linked_list_ops", "bst_operations", "heap_trie_ops", "graph_algorithms"
        ]) {
          const words = possibleId.replace("_", " ");
          if (lowerPrompt.includes(words) || lowerPrompt.includes(possibleId)) {
            fallbackText += `\n\n[[[{"action": "navigate", "algoId": "${possibleId}"}]]]`;
            break;
          }
        }
        res.json({ text: fallbackText });
        return;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response?.text || "I was unable to formulate an answer. Could you please rephrase?" });
    } catch (err: any) {
      console.error("Express Gemini Chat Error: ", err);
      res.status(500).json({ error: `AI Assistant server error: ${err.message || err}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
