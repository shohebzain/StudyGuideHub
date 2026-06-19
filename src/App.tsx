import React, { useState, useEffect } from 'react';
import { AlgorithmCategory, ALGORITHMS_LIST, AlgorithmInfo, VizStep } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CodeViewer from './components/CodeViewer';
import ComplexityPanel from './components/ComplexityPanel';
import AlgoBot from './components/AlgoBot';
import StudyGuideHub from './components/StudyGuideHub';

// Visualizer imports
import SortingVisualizer from './components/Visualizers/SortingVisualizer';
import SearchingVisualizer from './components/Visualizers/SearchingVisualizer';
import StackQueueVisualizer from './components/Visualizers/StackQueueVisualizer';
import LinkedListVisualizer from './components/Visualizers/LinkedListVisualizer';
import TreeVisualizer from './components/Visualizers/TreeVisualizer';
import HeapTrieVisualizer from './components/Visualizers/HeapTrieVisualizer';
import GraphVisualizer from './components/Visualizers/GraphVisualizer';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory>('sorting');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('bubble_sort');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });
  const [viewMode, setViewMode] = useState<'visualizer' | 'guide_hub'>('visualizer');

  // Synchronize theme state with the html document elements for tailwindcss engine
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Synchronize theme persistence across multiple tabs and browser restarts
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app-theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue as 'light' | 'dark');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Animation tracer execution states (Shared for steps-based visualizers like Sorting/Searching)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500); // interval ms
  const [animationSteps, setAnimationSteps] = useState<VizStep[]>([]);

  // Find the exact active algorithm information block
  const currentAlgo = ALGORITHMS_LIST.find(a => a.id === selectedAlgoId) || ALGORITHMS_LIST[0];

  const handleBotNavigate = (algoId: string) => {
    const targetAlgo = ALGORITHMS_LIST.find(a => a.id === algoId);
    if (targetAlgo) {
      setSelectedCategory(targetAlgo.category);
      setSelectedAlgoId(targetAlgo.id);
      setIsPlaying(false);
      setCurrentStepIndex(0);
    }
  };

  // Global Keypress handlers to support self-paced step-through keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if typing in form inputs/textareas to let space/arrows behave normally
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || activeEl.hasAttribute('contenteditable')) {
          return;
        }
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        setCurrentStepIndex(prev => Math.min(animationSteps.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        setCurrentStepIndex(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animationSteps.length]);

  // Synchronized playback tick interval
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < animationSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, animationSteps.length, speed]);

  const renderActiveVisualizer = () => {
    switch (selectedCategory) {
      case 'sorting':
        return (
          <SortingVisualizer
            currentAlgo={currentAlgo}
            setSelectedAlgoId={setSelectedAlgoId}
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speed={speed}
            setSpeed={setSpeed}
            animationSteps={animationSteps}
            setAnimationSteps={setAnimationSteps}
          />
        );
      case 'searching':
        return (
          <SearchingVisualizer
            currentAlgo={currentAlgo}
            setSelectedAlgoId={setSelectedAlgoId}
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speed={speed}
            setSpeed={setSpeed}
            animationSteps={animationSteps}
            setAnimationSteps={setAnimationSteps}
          />
        );
      case 'stack_queue':
        return <StackQueueVisualizer />;
      case 'linked_list':
        return <LinkedListVisualizer />;
      case 'trees':
        return <TreeVisualizer />;
      case 'heaps_tries':
        return <HeapTrieVisualizer />;
      case 'graphs':
        return <GraphVisualizer />;
      default:
        return (
          <div className="p-10 text-center text-slate-500 font-medium">
            Active Visualizer Module Coming Soon
          </div>
        );
    }
  };

  const activeStep: VizStep | null = animationSteps[currentStepIndex] || null;
  const currentLine = activeStep ? activeStep.codeLine : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-800 dark:text-neutral-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedAlgoId={selectedAlgoId}
        setSelectedAlgoId={setSelectedAlgoId}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        setViewMode={setViewMode}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Controls Area */}
        <Header
          currentAlgo={currentAlgo}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          setTheme={setTheme}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Content Body Grid */}
        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
          {viewMode === 'guide_hub' ? (
            <StudyGuideHub />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Active Canvas Visualizer Area */}
                <section className="lg:col-span-8 space-y-6">
                  {renderActiveVisualizer()}
                </section>

                {/* Right: Code trace and active notes */}
                <aside className="lg:col-span-4 space-y-6">
                  <CodeViewer
                    pseudocode={currentAlgo.pseudocode}
                    currentLine={currentLine}
                  />
                  
                  {/* Keyboard shortcuts tip block */}
                  <div className="bg-slate-100/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4 text-xs text-slate-500 leading-relaxed font-sans shadow-sm">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-indigo-500 block mb-2">
                      ⌨️ Classroom Shortcuts
                    </span>
                    <p>• Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 rounded border dark:border-slate-800 shadow-xs font-mono font-bold text-[10px]">Spacebar</kbd> to quickly Play/Pause current traces.</p>
                    <p className="mt-1">• Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 rounded border dark:border-slate-800 shadow-xs font-mono font-bold text-[10px]">Left / Right Arrow</kbd> to step backward or forward manually.</p>
                  </div>
                </aside>
              </div>

              {/* Bottom Row: Deeper Complexity metrics bento boxes */}
              <section id="complexity-section" className="pt-2">
                <ComplexityPanel currentAlgo={currentAlgo} />
              </section>
            </>
          )}
        </main>
      </div>

      {/* Floating AI Classroom Tutor chatbot overlay */}
      <AlgoBot currentAlgoId={selectedAlgoId} onNavigate={handleBotNavigate} />
    </div>
  );
}
