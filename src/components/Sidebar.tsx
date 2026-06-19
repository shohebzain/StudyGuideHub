import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  Layers, 
  Network, 
  GitFork, 
  Database, 
  Compass,
  Menu,
  X,
  BookOpen,
  Sparkles,
  Award,
  Cpu,
  Bookmark
} from 'lucide-react';
import { AlgorithmCategory, ALGORITHMS_LIST, AlgorithmInfo } from '../types';
import { STUDY_GUIDES } from '../data/studyGuides';

interface SidebarProps {
  selectedCategory: AlgorithmCategory;
  setSelectedCategory: (category: AlgorithmCategory) => void;
  selectedAlgoId: string;
  setSelectedAlgoId: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setViewMode: (mode: 'visualizer' | 'guide_hub') => void;
}

export default function Sidebar({
  selectedCategory,
  setSelectedCategory,
  selectedAlgoId,
  setSelectedAlgoId,
  isOpen,
  setIsOpen,
  setViewMode
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'modules' | 'guide'>('modules');

  const categories: { id: AlgorithmCategory; name: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'sorting', name: 'Sorting Visualizer', icon: ArrowUpDown, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { id: 'searching', name: 'Searching Visualizer', icon: Search, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { id: 'stack_queue', name: 'Stack & Queue', icon: Layers, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20' },
    { id: 'linked_list', name: 'Linked List', icon: Network, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20' },
    { id: 'trees', name: 'Binary Trees (BST/AVL)', icon: GitFork, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { id: 'heaps_tries', name: 'Heap & Trie', icon: Database, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20' },
    { id: 'graphs', name: 'Graph & Pathfinding', icon: Compass, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' }
  ];

  const handleCategorySelect = (category: AlgorithmCategory) => {
    setSelectedCategory(category);
    // Auto-select the first algorithm from that category
    const firstAlgo = ALGORITHMS_LIST.find(a => a.category === category);
    if (firstAlgo) {
      setSelectedAlgoId(firstAlgo.id);
    }
  };

  const activeGuide = STUDY_GUIDES[selectedAlgoId] || STUDY_GUIDES['bubble_sort'];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-45 md:hidden transition-opacity duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="sidebar-navigation"
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 md:sticky transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center text-lg select-none">
              📚
            </div>
            <div>
              <h1 className="font-sans font-bold tracking-tight text-slate-900 dark:text-neutral-50 text-base leading-tight">
                StudyGuideHub
              </h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Interactive Learning Hub
              </p>
            </div>
          </div>
          
          <button 
            id="close-sidebar-btn"
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented control tabs */}
        <div className="px-4 py-3 border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2 shrink-0">
          <button
            id="sidebar-tab-modules"
            type="button"
            onClick={() => {
              setActiveTab('modules');
              setViewMode('visualizer');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Modules</span>
          </button>
          <button
            id="sidebar-tab-guide"
            type="button"
            onClick={() => {
              setActiveTab('guide');
              setViewMode('guide_hub');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Study Guide</span>
          </button>
        </div>

        {/* Scrollable Container Wrapper */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          {activeTab === 'modules' ? (
            <div className="space-y-1">
              {/* Interactive Study Hub Launcher Card */}
              <div className="mb-4 bg-indigo-50/40 dark:bg-slate-950/45 border border-indigo-100/50 dark:border-indigo-900/40 p-3.5 rounded-xl shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-[11px] font-black text-slate-805 dark:text-neutral-100">Classroom Learn Centre</span>
                </div>
                <p className="text-[9px] text-slate-455 mt-1 leading-snug">
                  Access live roadmap tracking, personal notes compilers, interview prep & interactive simulator playgrounds!
                </p>
                <button
                  id="sidebar-launch-studyguide-hub"
                  type="button"
                  onClick={() => {
                    setActiveTab('guide');
                    setViewMode('guide_hub');
                  }}
                  className="w-full mt-2.5 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                  <span>Launch Study Hub</span>
                </button>
              </div>

              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                Categories & Modules
              </span>

              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    id={`sidebar-category-${cat.id}`}
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.id);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-sans text-left min-h-[46px] group ${
                      isSelected 
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-transform group-hover:scale-105 ${cat.color} ${
                      isSelected ? 'scale-105' : ''
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-sm tracking-tight">{cat.name}</span>
                  </button>
                );
              })}

              <div className="pt-6">
                <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                  Module Algorithms
                </span>
                <div className="space-y-1 pl-1">
                  {ALGORITHMS_LIST.filter(a => a.category === selectedCategory).map((algo) => {
                    const isSelected = selectedAlgoId === algo.id;
                    return (
                      <button
                        id={`sidebar-algo-${algo.id}`}
                        key={algo.id}
                        onClick={() => {
                          setSelectedAlgoId(algo.id);
                          if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs rounded-lg transition-colors truncate block min-h-[38px] ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        • {algo.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Conceptual Study Guide Section */
            <div className="space-y-5">
              <div className="px-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-670 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md">
                    Target Concept
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-neutral-100 mt-2 flex items-center gap-1.5 leading-tight">
                  <Bookmark className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{activeGuide.name}</span>
                </h2>
              </div>

              {/* Core Concept Summary */}
              <div className="bg-slate-50 dark:bg-slate-880/45 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Core Logic</span>
                </h4>
                <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-sans">
                  {activeGuide.concept}
                </p>
              </div>

              {/* Brilliant Physical Analogy Callout Card */}
              <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/30 rounded-xl p-3.5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Physical Analogy</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic font-sans">
                  "{activeGuide.analogy}"
                </p>
              </div>

              {/* Why are we learning this? */}
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/20 rounded-xl p-3.5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-650 dark:text-indigo-400 mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Why Learn This?</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                  {activeGuide.whyLearn}
                </p>
              </div>

              {/* Real-World Use Cases */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block px-1">
                  Real-World Applications
                </span>
                <div className="space-y-2">
                  {activeGuide.useCases.map((useCase, idx) => (
                    <div 
                      key={idx}
                      className="text-xs text-slate-650 dark:text-slate-350 bg-slate-50/55 dark:bg-slate-900/40 hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-colors p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded bg-indigo-50 dark:bg-indigo-955/30 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info (humble literal labels, no system/credit telemetry) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">
            StudyGuideHub Learning Engine
          </p>
          <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-0.5">
            Phase 1 Interactive Sandbox
          </p>
        </div>
      </aside>
    </>
  );
}
