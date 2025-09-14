"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';
import WebContainerManager from '@/components/WebContainerManager';

import PreviewBrowser from '@/components/PreviewBrowser';
import { GradientText, Button, Card } from '@/components/ui/aceternity';
import { useFadeInOnScroll, useStaggerChildren, useParallax } from '@/lib/animations';
import { clsx } from 'clsx';
import { demoTree, FileSystemNode, FileLeaf, DirectoryNode } from '@/lib/fileTree';

/**
 * PreviewPage – Overhauled playground experience
 * - Left: Project Explorer (fake tree + future real FS)
 * - Center: Editor / Preview with animated tab underline
 * - Right: Assistant / Chat placeholder
 * - Top: Hero style intro with parallax accent & quick actions
 */
export default function PreviewPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || `\nfunction App() {\n  return <h1>Hello, edit me!</h1>;\n}\nReactDOM.render(<App />, document.getElementById('root'));\n`;

  const [code, setCode] = useState(initialCode);
  // const [transpiledCode, setTranspiledCode] = useState('');
  // const [compileError, setCompileError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    // File state needed for Babel filename earlier than transform effect
    const [openDirs, setOpenDirs] = useState<Set<string>>(new Set(['/','/components','/hooks']));
    const [activeFile, setActiveFile] = useState<string>('/App.tsx');

  // Anim hooks
  const heroRef = useFadeInOnScroll<HTMLDivElement>({ y: 40 });
  const actionsRef = useStaggerChildren<HTMLDivElement>();
  const accentRef = useParallax<HTMLDivElement>(0.5);



  // ---------------- File Explorer State ----------------
    // ---------------- File Explorer State ---------------- (moved above for ordering)

  // ---------------- Resizable Panels ----------------
  // Panel widths (user-resizable) in pixels
  const [leftWidth, setLeftWidth] = useState(240); // explorer
  const [rightWidth, setRightWidth] = useState(300); // assistant
  const minLeft = 180, maxLeft = 400, minRight = 240, maxRight = 480;
  // Basic drag handler – attaches window mousemove/up listeners for resizing
  const startDrag = (side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startLeft = leftWidth;
    const startRight = rightWidth;
    function onMove(ev: MouseEvent) {
      const dx = ev.clientX - startX;
      if (side === 'left') {
        setLeftWidth(Math.min(maxLeft, Math.max(minLeft, startLeft + dx)));
      } else {
        setRightWidth(Math.min(maxRight, Math.max(minRight, startRight - dx)));
      }
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const toggleDir = useCallback((path: string) => {
    setOpenDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);

  // Recursively render directory tree with collapsible folders
  const renderTree = (node: FileSystemNode, depth = 0): React.ReactNode => {
    if (node.type === 'dir') {
      const isOpen = openDirs.has(node.path);
      return (
        <div key={node.path} className="select-none">
          <button
            onClick={() => toggleDir(node.path)}
            className={clsx('w-full flex items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] font-medium tracking-wide',
              'hover:bg-white/5 text-neutral-300',
            )}
            aria-expanded={isOpen}
          >
            <span className={clsx('transition-transform', isOpen ? 'rotate-90' : 'rotate-0')}>▶</span>
            <span className="text-indigo-200">{node.name}</span>
          </button>
          {isOpen && (
            <div className="pl-3 border-l border-white/5 ml-2 space-y-0.5">
              {node.children.map(c => renderTree(c, depth + 1))}
            </div>
          )}
        </div>
      );
    }
    const file: FileLeaf = node;
    const isActive = activeFile === file.path;
    return (
      <button
        key={file.path}
        onClick={() => setActiveFile(file.path)}
        className={clsx('group w-full flex items-center gap-2 rounded px-2 py-1 text-[11px] font-normal',
          'hover:bg-white/5',
          isActive && 'bg-white/10 text-white shadow-inner')}
      >
        <span className={clsx('h-2 w-2 rounded-sm',
          file.ext === 'tsx' && 'bg-fuchsia-400',
          file.ext === 'ts' && 'bg-cyan-400',
          file.ext === 'css' && 'bg-indigo-400',
          !['tsx','ts','css'].includes(file.ext || '') && 'bg-neutral-400'
        )} />
        <span className="truncate text-neutral-300 group-hover:text-white text-[11px]">{file.name}</span>
      </button>
    );
  };

  // ---------------- Assistant Panel Mock ----------------
  interface ChatItem { id: string; role: 'user' | 'assistant'; content: string; }
  const [chat, setChat] = useState<ChatItem[]>([
    { id: '1', role: 'assistant', content: 'Hi! Paste or edit code – I can soon help explain or refactor it.' },
  ]);
  const [draft, setDraft] = useState('How can I optimize rendering?');
  // Simulated send + delayed placeholder response
  const send = () => {
    if (!draft.trim()) return;
    setChat(c => [...c, { id: Date.now().toString(), role: 'user', content: draft.trim() }]);
    setDraft('');
    // simulate pending assistant
    setTimeout(() => {
      setChat(c => [...c, { id: Date.now().toString(), role: 'assistant', content: 'Assistant response placeholder (model integration pending).' }]);
    }, 600);
  };

  const suggestionPills = [
    'Explain selected code',
    'Improve performance',
    'Convert to hooks',
    'Add prop types',
  ];

  return (
    <div className="relative flex h-[calc(100vh-5rem)] w-full flex-col font-sans">{/* height minus nav maybe */}
      {/* Decorative gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div ref={accentRef} className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Hero / Header */}
      <header ref={heroRef} className="relative z-10 px-6 pt-6 pb-4 flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
          <GradientText>Interactive Playground</GradientText>
          <span className="text-sm font-normal text-neutral-400 hidden sm:inline">— Build & Preview React snippets instantly</span>
        </h1>
        <div ref={actionsRef} className="flex flex-wrap gap-3" aria-label="Quick actions">
          <Button data-animate size="sm" variant="glass" onClick={() => setActiveTab('editor')}>Editor</Button>
            <Button data-animate size="sm" variant="glass" onClick={() => setActiveTab('preview')}>Live Preview</Button>
          <Button data-animate size="sm" variant="outline" onClick={() => setCode(initialCode)}>Reset</Button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden px-4 pb-4 gap-3 min-h-0">{/* min-h-0 ensures children can shrink */}
        {/* File Explorer (collapsible + resizable) */}
        <div style={{ width: leftWidth }} className="group flex flex-col shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="text-[11px] font-semibold tracking-wide uppercase text-neutral-300">Explorer</span>
            <span className="text-[10px] text-neutral-500">Demo</span>
          </div>
          <div className="flex-1 overflow-auto px-2 py-2 space-y-0.5 text-[11px] font-mono">
            {renderTree(demoTree)}
          </div>
          <div className="border-t border-white/10 p-2 flex gap-2">
            <Button size="sm" variant="glass" className="flex-1" onClick={() => setOpenDirs(new Set(['/']))}>Collapse</Button>
            <Button size="sm" variant="outline" onClick={() => setOpenDirs(new Set(['/','/components','/hooks','/utils']))}>Expand</Button>
          </div>
        </div>
        <div
          onMouseDown={(e) => startDrag('left', e)}
          className="w-1 cursor-col-resize bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full opacity-60 hover:opacity-100 transition"
          aria-label="Resize explorer"
        />

        {/* Editor / Preview Column */}
        <div className="flex flex-col flex-1 min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur overflow-hidden">
          <div className="relative flex items-center gap-6 px-4 border-b border-white/10 bg-white/5">
            {['editor', 'preview'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'editor' | 'preview')}
                className={clsx('relative py-3 text-xs font-medium tracking-wide transition-colors', activeTab === tab ? 'text-white' : 'text-neutral-400 hover:text-neutral-200')}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab === 'editor' ? 'Code' : 'Preview'}
                {activeTab === tab && (
                  <span className="pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400" />
                )}
              </button>
            ))}
            <div className="ml-auto flex gap-2 py-2">
              <Button size="sm" variant="glass" onClick={() => navigator.clipboard.writeText(code)}>Copy</Button>
              <Button size="sm" variant="outline" onClick={() => setCode(initialCode)}>Reset</Button>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                
                {activeTab === 'editor' ? (
  <div className="flex-1 min-h-0">
    <CodeEditor code={code} onChange={(value) => setCode(value || '')} />
  </div>
) : (
  <div className="flex-1 min-h-0 flex flex-col">
    <div className="px-4 py-2 text-[10px] font-mono tracking-wide text-neutral-400 border-b border-white/10 bg-white/5 flex items-center justify-between">
      <span>runtime sandbox (WebContainer)</span>
      <Button size="sm" variant="subtle" onClick={() => setActiveTab('editor')}>Edit</Button>
    </div>
    <div className="flex-1 min-h-0">
      <WebContainerManager files={{ [activeFile]: code }} entryFile={activeFile} />
    </div>
  </div>
)}

          </div>
        </div>

        {/* Assistant / Chat (resizable) */}
        <div
          style={{ width: rightWidth }}
          className="flex flex-col shrink-0 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="text-[11px] font-semibold tracking-wide uppercase text-neutral-300">Assistant</span>
            <span className="text-[10px] text-cyan-300/80">alpha</span>
          </div>
          <div className="px-3 py-2 flex flex-wrap gap-2 border-b border-white/5 bg-white/5">
            {suggestionPills.map(s => (
              <button key={s} onClick={() => setDraft(s)} className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition">{s}</button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-auto px-3 py-3 space-y-3 text-[12px] leading-relaxed">
            {chat.map(item => (
              <div key={item.id} className={clsx('rounded-md px-3 py-2 max-w-[92%] shadow-sm',
                item.role === 'assistant' ? 'bg-cyan-500/10 border border-cyan-400/20 text-cyan-100' : 'bg-fuchsia-500/10 border border-fuchsia-400/20 ml-auto text-fuchsia-100')}>
                {item.content}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-white/10 p-2 flex items-center gap-2 bg-white/5">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Ask something about the code..."
              className="flex-1 bg-white/10 text-[11px] px-3 py-2 rounded-md outline-none focus:ring-2 ring-fuchsia-400/40 placeholder:text-neutral-500"
            />
            <Button size="sm" variant="glass" type="submit">Send</Button>
          </form>
        </div>
        <div
          onMouseDown={(e) => startDrag('right', e)}
          className="w-1 cursor-col-resize bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full opacity-60 hover:opacity-100 transition"
          aria-label="Resize assistant"
        />
      </div>

      {/* Footer meta strip inside page scope (not global) */}
      <div className="relative z-10 px-6 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500 border-t border-white/5 bg-neutral-950/60 backdrop-blur">
      </div>
    </div>
  );
}
