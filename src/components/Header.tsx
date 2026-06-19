import React, { useState } from 'react';
import { Menu, Sun, Moon, Info, Zap, Sparkles, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { AlgorithmInfo } from '../types';
import { audioService } from '../utils/audio';

interface HeaderProps {
  currentAlgo: AlgorithmInfo;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  viewMode: 'visualizer' | 'guide_hub';
  setViewMode: (mode: 'visualizer' | 'guide_hub') => void;
}

export default function Header({
  currentAlgo,
  sidebarOpen,
  setSidebarOpen,
  theme,
  setTheme,
  viewMode,
  setViewMode
}: HeaderProps) {
  const [muted, setMuted] = useState<boolean>(audioService.isMuted());

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-40 transition-colors">
      <div className="flex items-center gap-3">
        <button
          id="toggle-sidebar-mobile"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sans font-bold text-slate-950 dark:text-neutral-50 text-xl tracking-tight leading-none">
              {currentAlgo.name}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-black bg-indigo-50 dark:bg-indigo-950/40 text-indigo-605 dark:text-indigo-400">
              {currentAlgo.category.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-455 mt-1 max-w-sm xl:max-w-xl truncate">
            {currentAlgo.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        {/* Toggle Mode Control Selector for Lab vs Study Guide */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/80 gap-1 text-[11px] font-semibold">
          <button
            id="header-switch-visualizer"
            type="button"
            onClick={() => setViewMode('visualizer')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'visualizer'
                ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sandbox Lab</span>
          </button>
          <button
            id="header-switch-guidehub"
            type="button"
            onClick={() => setViewMode('guide_hub')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'guide_hub'
                ? 'bg-white dark:bg-slate-800 text-[#7C3AED] dark:text-purple-400 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Guide Hub</span>
          </button>
        </div>

        {/* Action Controls rightmost */}
        <div className="flex items-center gap-2">
          {/* Audio Feedback Toggle */}
          <button
            id="audio-mute-toggle-btn"
            onClick={() => {
              const nextMuted = audioService.toggleMute();
              setMuted(nextMuted);
              if (!nextMuted) {
                // Play a pleasant chime if unmuted
                audioService.playStep('success');
              }
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-205 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center cursor-pointer"
            title={muted ? 'Unmute Audio Notes' : 'Mute Audio Notes'}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />
            )}
          </button>

          {/* Theme Switcher */}
          <button
            id="theme-switcher-btn"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-205 hover:bg-slate-50 dark:hover:bg-slate-800/81 transition-all flex items-center justify-center cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
