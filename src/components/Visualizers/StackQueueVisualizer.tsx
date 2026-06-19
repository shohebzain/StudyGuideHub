import React, { useState, useEffect } from 'react';
import { Layers, Database, Radio, ArrowDownToLine, ArrowUpFromLine, RefreshCw, Sparkles, Check, HelpCircle } from 'lucide-react';
import { VizStep } from '../../types';
import { audioService } from '../../utils/audio';

export default function StackQueueVisualizer() {
  const [activeMode, setActiveMode] = useState<'stack' | 'queue'>('stack');
  const [queueType, setQueueType] = useState<'linear' | 'circular' | 'priority'>('linear');
  const [items, setItems] = useState<number[]>([15, 34, 82, 47]);
  const [priorities, setPriorities] = useState<number[]>([1, 3, 2, 4]); // Only for Priority Queue
  
  // Controls
  const [inputValue, setInputValue] = useState<number>(50);
  const [inputPriority, setInputPriority] = useState<number>(2); // 1 to 5, lower = higher priority
  const [traceLog, setTraceLog] = useState<string>('Welcome! Perform linear data operations above to see execution logs and pointer movements.');
  const [activeElement, setActiveElement] = useState<number | null>(null);
  const [isPointerAction, setIsPointerAction] = useState<string | null>(null);

  // Constants
  const MAX_CAPACITY = 6;

  const handlePushStack = () => {
    if (items.length >= MAX_CAPACITY) {
      setTraceLog('Stack Overflow Error! Cannot push because the stack is fully filled (Max capacity = 6).');
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }
    const val = inputValue || Math.floor(Math.random() * 90) + 10;
    setActiveElement(val);
    setIsPointerAction('push');
    setTraceLog(`Executing push(${val}): Increment top index, then write value ${val} at Stack[top].`);
    audioService.playValue(val, 10, 100, 'triangle', 0.12);
    
    setTimeout(() => {
      setItems(prev => [...prev, val]);
      setActiveElement(null);
      setIsPointerAction(null);
    }, 450);
  };

  const handlePopStack = () => {
    if (items.length === 0) {
      setTraceLog('Stack Underflow Error! Cannot pop because the stack has zero elements.');
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }
    const poppedVal = items[items.length - 1];
    setActiveElement(poppedVal);
    setIsPointerAction('pop');
    setTraceLog(`Executing pop(): Reading top value (${poppedVal}), then decrementing top index pointer.`);
    audioService.playTone(280, 'triangle', 0.11, 0.08);

    setTimeout(() => {
      setItems(prev => prev.slice(0, -1));
      setActiveElement(null);
      setIsPointerAction(null);
    }, 450);
  };

  const handlePeekStack = () => {
    if (items.length === 0) {
      setTraceLog('Stack is Empty. Peek returns null.');
      return;
    }
    const topVal = items[items.length - 1];
    setActiveElement(topVal);
    setIsPointerAction('peek');
    setTraceLog(`Executing peek(): Querying the element at current index top without removing it. Value is ${topVal}.`);
    audioService.playValue(topVal, 10, 100, 'sine', 0.08);
    
    setTimeout(() => {
      setActiveElement(null);
      setIsPointerAction(null);
    }, 1000);
  };

  const handleEnqueueQueue = () => {
    if (items.length >= MAX_CAPACITY) {
      setTraceLog('Queue Overflow Error! Maximum queue capacity reached.');
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }
    const val = inputValue || Math.floor(Math.random() * 90) + 10;
    const prio = inputPriority;

    setActiveElement(val);
    setIsPointerAction('enqueue');
    audioService.playValue(val, 10, 100, 'triangle', 0.12);

    setTimeout(() => {
      if (queueType === 'priority') {
        const newItems = [...items];
        const newPri = [...priorities];
        let insertIdx = 0;
        while (insertIdx < items.length && priorities[insertIdx] <= prio) {
          insertIdx++;
        }
        newItems.splice(insertIdx, 0, val);
        newPri.splice(insertIdx, 0, prio);
        setItems(newItems);
        setPriorities(newPri);
        setTraceLog(`Enqueue Priority: Element ${val} with Priority ${prio} inserted at index ${insertIdx} to satisfy heap/priority sorted alignment.`);
      } else {
        setItems(prev => [...prev, val]);
        setTraceLog(`Enqueue Linear: rear pointer advanced to index ${items.length}, writing element value ${val} in queue cell.`);
      }
      setActiveElement(null);
      setIsPointerAction(null);
    }, 450);
  };

  const handleDequeueQueue = () => {
    if (items.length === 0) {
      setTraceLog('Queue Underflow Error! Queue is empty. No elements available to pull.');
      audioService.playTone(180, 'sine', 0.25, 0.1);
      return;
    }
    const dequeuedVal = items[0];
    setActiveElement(dequeuedVal);
    setIsPointerAction('dequeue');
    setTraceLog(`Executing dequeue(): Retrieving front cell value (${dequeuedVal}), then advancing front pointer.`);
    audioService.playTone(280, 'triangle', 0.11, 0.08);

    setTimeout(() => {
      setItems(prev => prev.slice(1));
      if (queueType === 'priority') {
        setPriorities(prev => prev.slice(1));
      }
      setActiveElement(null);
      setIsPointerAction(null);
    }, 450);
  };

  const handleClear = () => {
    setItems([]);
    setPriorities([]);
    setTraceLog('Data structures flushed! Pointers reset to default values.');
    audioService.playStep('compare');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            id="stack-mode-btn"
            onClick={() => {
              setActiveMode('stack');
              setItems([15, 34, 82, 47]);
              setTraceLog('Switched to Stack module.');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeMode === 'stack'
                ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-355'
            }`}
          >
            <Layers className="w-4 h-4" />
            Stack Visualizer
          </button>
          <button
            id="queue-mode-btn"
            onClick={() => {
              setActiveMode('queue');
              setItems([15, 34, 82, 47]);
              setTraceLog('Switched to Queue module.');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeMode === 'queue'
                ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-355'
            }`}
          >
            <Database className="w-4 h-4" />
            Queue Visualizer
          </button>
        </div>

        {/* Input variables block */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Value:</span>
            <input
              id="linear-field-value"
              type="number"
              min="1"
              max="999"
              value={inputValue}
              onChange={(e) => setInputValue(Math.min(999, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-xs text-center font-mono font-bold border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white"
            />
          </div>

          {activeMode === 'queue' && queueType === 'priority' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Priority:</span>
              <select
                id="queue-field-priority"
                value={inputPriority}
                onChange={(e) => setInputPriority(Number(e.target.value))}
                className="px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white"
              >
                <option value={1}>1 (Highest)</option>
                <option value={2}>2 (Medium High)</option>
                <option value={3}>3 (Normal)</option>
                <option value={4}>4 (Low)</option>
                <option value={5}>5 (Lowest)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {activeMode === 'queue' && (
        <div className="flex flex-wrap gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 self-center mr-2">Queue Form:</span>
          {(['linear', 'circular', 'priority'] as const).map((type) => (
            <button
              id={`queue-type-${type}`}
              key={type}
              onClick={() => {
                setQueueType(type);
                handleClear();
              }}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                queueType === type
                  ? 'bg-indigo-650 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-705'
              }`}
            >
              {type === 'linear' ? 'Linear Queue' : type === 'circular' ? 'Circular' : 'Priority Queue'}
            </button>
          ))}
        </div>
      )}

      {/* Main Simulation View Area */}
      <div className="h-72 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center relative bg-slate-50/20 dark:bg-slate-900/5 overflow-hidden">
        
        {activeMode === 'stack' ? (
          /* STACK VISUALIZER (Vertical Bucket Container) */
          <div className="flex flex-col items-center h-full justify-end pb-8 w-full relative">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 absolute top-5">
              Stack Container Limit (Max {MAX_CAPACITY})
            </div>

            {/* Stack Glass container */}
            <div className="w-56 border-x-4 border-b-4 border-slate-350 dark:border-slate-700 rounded-b-2xl flex flex-col-reverse justify-start p-1.5 min-h-[190px] relative">
              
              {/* Stack items */}
              {items.map((val, idx) => {
                const isTop = idx === items.length - 1;
                const isHighlight = isTop && isPointerAction !== null;
                return (
                  <div
                    id={`stack-item-${idx}`}
                    key={idx}
                    className={`h-7 my-1 rounded-lg border flex items-center justify-between px-3.5 font-mono text-xs transition-all duration-300 ${
                      isHighlight
                        ? 'bg-amber-400 border-amber-500 text-amber-950 font-black scale-102 shadow-md animate-pulse'
                        : 'bg-indigo-600 border-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    <span className="font-bold">{val}</span>
                    <span className="text-[9px] uppercase tracking-wide opacity-80">
                      {isTop ? 'Top Pointer' : `idx [${idx}]`}
                    </span>
                  </div>
                );
              })}

              {/* Empty state inside stack */}
              {items.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-slate-400 text-xs">
                  <Database className="w-6 h-6 stroke-1.5 mb-1.5 opacity-60" />
                  <span>Stack is Empty</span>
                  <span>(Underflow ready)</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* QUEUE VISUALIZER */
          <div className="flex items-center justify-center h-full w-full relative px-6">
            
            {queueType === 'circular' ? (
              /* Circular Queue diagram representation */
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-slate-205 dark:border-slate-805" />
                
                {/* 6 fixed circle positions indices */}
                {Array.from({ length: 6 }).map((_, idx) => {
                  const angle = (idx * 60) * (Math.PI / 180);
                  const radius = 80; // Distance from center
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  const isItemPresent = idx < items.length;
                  const itemValue = isItemPresent ? items[idx] : null;

                  return (
                    <div
                      id={`circular-queue-${idx}`}
                      key={idx}
                      className={`absolute w-12 h-12 flex flex-col items-center justify-center rounded-full border-2 font-mono text-xs transition-all duration-300 cursor-help ${
                        isItemPresent
                          ? 'bg-indigo-605 border-indigo-705 text-white font-bold shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-405 border-slate-200 dark:border-slate-800'
                      }`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                      title={`Circular index ${idx}`}
                    >
                      <span className="text-xs">{itemValue !== null ? itemValue : '•'}</span>
                      <span className="text-[8px] opacity-70">idx {idx}</span>
                    </div>
                  );
                })}

                {/* Circular Center Pointers */}
                <div className="text-center font-mono select-none z-10 bg-white dark:bg-slate-950 p-3 rounded-full border-2 border-slate-100 dark:border-slate-900 shadow-sm leading-tight">
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-500">FrontIdx: 0</p>
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-500 mt-1">
                    RearIdx: {Math.max(0, items.length - 1)}
                  </p>
                </div>
              </div>
            ) : (
              /* Linear and Priority queue diagrams */
              <div className="flex flex-col items-center w-full max-w-xl">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-450 mb-4 text-center">
                  {queueType === 'priority' ? 'Priority Queue Queue Lane (Sorted by Priority)' : 'Standard Linear FIFO Queue Lane'}
                </p>

                {/* Queue box container */}
                <div className="w-full flex items-center justify-start gap-2 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl min-h-[85px] relative overflow-x-auto">
                  {items.map((val, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === items.length - 1;
                    const priorityValue = queueType === 'priority' ? priorities[idx] : null;

                    return (
                      <div
                        id={`queue-lane-item-${idx}`}
                        key={idx}
                        className="flex flex-col items-center min-w-[70px] shrink-0"
                      >
                        {/* Pointer tags */}
                        <div className="h-6 flex items-end">
                          {isFront && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-450 px-1 py-0.5 rounded leading-none border border-rose-100 dark:border-rose-950">
                              Front
                            </span>
                          )}
                        </div>

                        {/* Node content block */}
                        <div className="w-full text-center py-2 px-1.5 rounded-xl bg-indigo-650 border border-indigo-700 text-white font-mono text-xs flex flex-col justify-center shadow-sm">
                          <span className="font-bold">{val}</span>
                          {priorityValue !== null && (
                            <span className="text-[8px] bg-indigo-950/40 text-indigo-300 font-extrabold px-1 rounded-sm mt-0.5 py-0.5">
                              Prio: {priorityValue}
                            </span>
                          )}
                        </div>

                        {/* Pointer label bottom */}
                        <div className="h-6 flex items-start mt-1">
                          {isRear && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 px-1 py-0.5 rounded leading-none border border-emerald-100 dark:border-emerald-900/30">
                              Rear
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-405 text-xs font-medium gap-1.5">
                      <HelpCircle className="w-5 h-5 stroke-1.5" />
                      <span>Queue Lane is Empty</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal log message */}
      <div className="p-3.5 bg-slate-950 text-emerald-450 rounded-xl font-mono text-xs leading-relaxed border border-slate-900 shadow-inner flex gap-2">
        <span className="text-slate-500 font-bold tracking-tight select-none border-r border-slate-800 pr-2">RUNNING</span>
        <span className="flex-1">{traceLog}</span>
      </div>

      {/* Controller Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {activeMode === 'stack' ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="stack-push-btn"
              onClick={handlePushStack}
              className="flex items-center gap-1.5 px-5.5 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-600 text-slate-50 hover:bg-indigo-707 transition-all shadow-md shadow-indigo-500/20"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Push Object
            </button>
            <button
              id="stack-pop-btn"
              onClick={handlePopStack}
              className="flex items-center gap-1.5 px-5.5 py-2.5 text-xs font-bold uppercase rounded-xl bg-rose-600 hover:bg-rose-700 text-slate-50 transition-all shadow-md shadow-rose-500/20"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Pop Object
            </button>
            <button
              id="stack-peek-btn"
              onClick={handlePeekStack}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-300 transition-all"
            >
              Peek Top
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="queue-enqueue-btn"
              onClick={handleEnqueueQueue}
              className="flex items-center gap-1.5 px-5.5 py-2.5 text-xs font-bold uppercase rounded-xl bg-indigo-600 text-slate-50 hover:bg-indigo-707 transition-all shadow-md shadow-indigo-500/20"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Enqueue Object
            </button>
            <button
              id="queue-dequeue-btn"
              onClick={handleDequeueQueue}
              className="flex items-center gap-1.5 px-5.5 py-2.5 text-xs font-bold uppercase rounded-xl bg-rose-600 hover:bg-rose-700 text-slate-50 transition-all shadow-md shadow-rose-500/20"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Dequeue Object
            </button>
          </div>
        )}

        <button
          id="linear-clear-btn"
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Flush All
        </button>
      </div>
    </div>
  );
}
