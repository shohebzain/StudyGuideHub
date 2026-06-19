import React from 'react';

interface CodeViewerProps {
  pseudocode: string[];
  currentLine?: number;
}

export default function CodeViewer({ pseudocode, currentLine }: CodeViewerProps) {
  if (!pseudocode || pseudocode.length === 0) return null;

  return (
    <div className="bg-slate-950 text-slate-300 rounded-xl p-5 shadow-inner border border-slate-900 font-mono text-sm leading-relaxed relative overflow-hidden">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Pseudocode Trace
        </span>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
        </div>
      </div>

      <div className="space-y-1.5 overflow-x-auto">
        {pseudocode.map((line, idx) => {
          const isHighlighted = idx === currentLine;
          return (
            <div
              id={`code-line-${idx}`}
              key={idx}
              className={`flex items-start rounded-md px-3 py-1 transition-all ${
                isHighlighted
                  ? 'bg-indigo-600/20 text-indigo-400 font-bold border-l-4 border-indigo-500 -ml-1 pl-2'
                  : 'text-slate-400 border-l-4 border-transparent'
              }`}
            >
              {/* Line numbering */}
              <span className="w-5 pr-2 text-right select-none text-[10px] font-semibold text-slate-650 opacity-60">
                {idx + 1}
              </span>
              <pre className="flex-1 whitespace-pre-wrap leading-tight text-xs md:text-sm font-mono tracking-tight">
                {line}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
