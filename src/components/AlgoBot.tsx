import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot,  
  Send,  
  X, 
  Sparkles, 
  MessageSquare, 
  RotateCcw, 
  CornerDownLeft, 
  BookOpen, 
  HelpCircle,
  Terminal
} from 'lucide-react';
import { ALGORITHMS_LIST } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface AlgoBotProps {
  currentAlgoId: string;
  onNavigate: (algoId: string) => void;
}

export default function AlgoBot({ currentAlgoId, onNavigate }: AlgoBotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am **AlgoBot**, your personal DSA guide and assistant tutor. 🤖✨\n\nI can explain complex topics like recursively splitting arrays in Merge Sort, binary tree balancing, or finding weights in Dijkstra. I can also **navigate the website** for you!\n\nJust ask me anything or try: *'Let's visualize Binary Search node operations'*.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Hide short bubble tooltip after some seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Conversation restarted. What algorithm or data structure shall we explore today? 🎓📚",
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add user message to thread
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Map history to server endpoint standard
      const formattedHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          history: formattedHistory,
          currentAlgoId
        })
      });

      if (!res.ok) {
        throw new Error('Failed to reach educational server. Please try again.');
      }

      const data = await res.json();
      let responseText = data.text || "I apologize, but I received empty telemetry instructions.";

      // Scan for structural navigation brackets [[[{"action": "navigate", "algoId": "..."}]]]
      const actionRegex = /\[\[\[(.*?)\]\]\]/;
      const match = responseText.match(actionRegex);
      
      if (match && match[1]) {
        try {
          const actionDetails = JSON.parse(match[1]);
          if (actionDetails.action === 'navigate' && actionDetails.algoId) {
            // Trigger parent navigation callback
            onNavigate(actionDetails.algoId);
          }
        } catch (jsonErr) {
          console.error("Failed to parse navigation action json context", jsonErr);
        }
        // Scrub the bracket block from the render path to avoid layout noise
        responseText = responseText.replace(actionRegex, '').trim();
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error("AlgoBot Chat Fail:", err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "⚠️ **Connection Timeout**: I am experiencing trouble syncing with my artificial intelligence processor. Please verify the server is running or retry shortly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Humanized message text parser to support neat styled boldings, backticks codes, and custom bullets
  const renderMessageText = (text: string) => {
    // Escape or process segments
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\n)/);
    
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-rose-500 dark:text-rose-450 font-mono text-xs border border-slate-200/50 dark:border-slate-700/40">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part === '\n') {
        return <br key={idx} />;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Helper template questions to quickly interact
  const SUGGESTIONS = [
    { label: "Explain Jump Search", q: "How does Jump Search work structurally? Show its complexity." },
    { label: "Show me Dijkstra", q: "Switch to Dijkstra's pathfinding and explain the algorithm." },
    { label: "What is BST Worst Case?", q: "Explain why Binary Search Tree degenerates to O(N) in worst case." }
  ];

  return (
    <>
      {/* Absolute floating trigger button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
        
        {/* Help Tooltip bubble */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-3 px-4 py-3 bg-indigo-650 text-white rounded-2xl shadow-xl max-w-xs text-xs relative pointer-events-auto cursor-pointer border border-indigo-500/30"
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Need a tutor?</span>
              </div>
              <p className="text-[11px] text-indigo-100 leading-normal">
                Ask me tricky DSA logic, or tell me to "open the Linked List visualizer"!
              </p>
              {/* Little arrow */}
              <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-indigo-650 rotate-45 border-r border-b border-indigo-500/30" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button itself */}
        <motion.button
          id="algobot-trigger-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setIsOpen(prev => !prev);
            setShowTooltip(false);
          }}
          className={`pointer-events-auto p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all border ${
            isOpen 
              ? 'bg-rose-550 border-rose-600 text-white hover:bg-rose-600' 
              : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 shadow-indigo-600/30'
          }`}
          title="Open AI DSA Assistant Tutor"
          aria-label="Open AI DSA Assistant Tutor"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Floating Chat Dashboard Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.93 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-4 md:right-6 w-[410px] h-[610px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden pointer-events-auto"
          >
            {/* Header Branding */}
            <div className="bg-indigo-600 px-5 py-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl relative">
                  <Bot className="w-5 h-5 text-indigo-100" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-450 border border-indigo-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 leading-tight">
                    <span>AlgoBot AI Tutor</span>
                    <span className="text-[10px] font-sans font-medium bg-emerald-450/20 text-emerald-300 border border-emerald-400/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider">Tutor</span>
                  </h3>
                  <p className="text-[10px] text-indigo-100/80 mt-0.5">
                    Ask computer science questions or request navigation
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors"
                  title="Clear conversation history"
                  aria-label="Clear conversation history"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors"
                  title="Close AI Tutor"
                  aria-label="Close AI Tutor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Thread Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/45 scrollbar-thin">
              {messages.map((item) => {
                const isBot = item.role === 'model';
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 mt-1 shrink-0">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isBot
                          ? 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none'
                          : 'bg-indigo-600 text-white rounded-tr-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {renderMessageText(item.text)}
                      </div>
                      
                      {/* Timestamp mark */}
                      <span className={`block text-[9px] mt-1.5 text-right ${
                        isBot ? 'text-slate-400 dark:text-slate-500' : 'text-indigo-200'
                      }`}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Bot thinking placeholder */}
              {isLoading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 mt-1 shrink-0 animate-pulse">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[70%] shadow-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_100ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_300ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_500ms]" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Helper Suggestions Rail */}
            <div className="border-t border-slate-100 dark:border-slate-850 px-3 py-2 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
                Quick Questions:
              </span>
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputValue(s.q);
                  }}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-white dark:bg-slate-820 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-350 transition-colors shadow-xs cursor-pointer shrink-0"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* User Input controls form */}
            <form
              id="algobot-input-container"
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5 pointer-events-auto relative z-10"
            >
              <div className="flex-1 relative pointer-events-auto">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask AlgoBot to explain or navigate..."
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500/80 dark:focus:border-indigo-400/80 text-xs text-slate-800 dark:text-slate-100 shadow-inner pointer-events-auto"
                  disabled={isLoading}
                  autoFocus
                />
                
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400 text-[10px] font-mono leading-none border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 bg-white dark:bg-slate-900 shadow-xs pointer-events-none">
                  <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer disabled:opacity-45 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-600/10 pointer-events-auto"
                title="Send instruction to AlgoBot"
                aria-label="Send instruction to AlgoBot"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
