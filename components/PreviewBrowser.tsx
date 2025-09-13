import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface PreviewBrowserProps {
  code: string;
}

// NOTE: The sandbox HTML below injects React + a small harness that receives transpiled code.
// We explicitly unmount the previous React tree before executing new code to avoid
// DOMNotFoundError / NotFoundError that occurs when manually nuking innerHTML between
// successive ReactDOM.render calls.
const html = `<!DOCTYPE html><html lang="en"><head><style>body{margin:0;font-family:system-ui,Arial,sans-serif;background:#0a0a0a;color:#fafafa;}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:#333;border-radius:4px}</style></head><body><div id="root"></div><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script>
const parentOrigin = '*';
const reportError = (msg) => {
  try { parent.postMessage({ __preview_error: String(msg) }, parentOrigin); } catch(_){}
};
window.addEventListener('error', e => { reportError(e.message); });
const origCE = console.error; console.error = function(...a){ reportError(a.join(' ')); origCE.apply(console,a); };
// Notify parent that iframe booted & listener will be attached next tick
setTimeout(()=>parent.postMessage({ __preview_boot: true }, parentOrigin), 0);
window.addEventListener('message', (event) => {
  try {
    const code = event.data;
    if (typeof code !== 'string') return;
    const rootEl = document.getElementById('root');
    // Attempt to cleanly unmount previous legacy root if any (safe even if none mounted)
    try { if (rootEl) { ReactDOM.unmountComponentAtNode(rootEl); } } catch(_){ }
    // Execute transpiled user code (which will usually call ReactDOM.render)
    new Function('React','ReactDOM', code)(React, ReactDOM);
    parent.postMessage({ __preview_ready: true }, parentOrigin);
  } catch(e) {
    reportError(e);
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.innerHTML = '<pre style="color:red;padding:12px;font-size:12px;white-space:pre-wrap;">'+e+'</pre>';
  }
}, false);
</script></body></html>`;

const PreviewBrowser = ({ code }: PreviewBrowserProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0); // for refresh
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [booted, setBooted] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const latestCodeRef = useRef(code);

  useEffect(()=>{ latestCodeRef.current = code; }, [code]);

  useEffect(() => {
    function handleMessage(ev: MessageEvent) {
      if (ev.data?.__preview_boot) {
        setBooted(true);
        // send latest code once boot message received
        if (iframeRef.current && latestCodeRef.current) {
          iframeRef.current.contentWindow?.postMessage(latestCodeRef.current, '*');
        }
      }
      if (ev.data?.__preview_error) setError(ev.data.__preview_error);
      if (ev.data?.__preview_ready) { setReady(true); setError(null); }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!code) return;
    setReady(false);
    // If iframe already booted send immediately, else wait for boot handshake
    if (booted && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(code, '*');
    }
  }, [code, key, booted]);

  // Open preview in a new tab, passing the code via URL-encoded query param
  const openInNewTab = () => {
    const encodedCode = encodeURIComponent(code);
    const previewUrl = `/preview?code=${encodedCode}`; // Adjust to your preview route
    window.open(previewUrl, "_blank");
  };

  const handleRefresh = () => {
    setError(null); setReady(false); setBooted(false); setKey(k => k + 1);
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Control Bar */}
      <div className="flex justify-end gap-2 bg-neutral-700 p-2 border-b border-neutral-700 ">
        <button
          onClick={handleRefresh}
          title="Refresh Preview"
          className="p-1 hover:bg-neutral-700 rounded"
        >
          <RefreshCw className="w-5 h-5 text-neutral-300" />
        </button>
        <button
          onClick={openInNewTab}
          title="Open Preview in New Tab"
          className="p-1 hover:bg-neutral-700 rounded"
        >
          <ExternalLink className="w-5 h-5 text-neutral-300" />
        </button>
        <button
          onClick={() => setShowDebug(d => !d)}
          title="Toggle transpiled code"
          className="px-2 text-[10px] rounded bg-neutral-600 hover:bg-neutral-500 text-neutral-200"
        >{showDebug ? 'Hide Code' : 'Show Code'}</button>
      </div>

      {/* Iframe Preview */}
      <iframe
        key={key}
        title="preview"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
        className="flex-1 w-full rounded-b-md"
        style={{ border: 'none' }}
      />
      {/* Error / Status Overlay */}
      {!ready && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] tracking-wide text-neutral-400 bg-neutral-950/40 backdrop-blur-sm">Building preview…</div>
      )}
      {error && (
        <div className="absolute inset-0 overflow-auto bg-neutral-950/85 p-4 text-red-300 text-xs font-mono">
          <div className="mb-2 font-semibold text-red-200">Runtime Error</div>
          <pre className="whitespace-pre-wrap leading-relaxed">{error}</pre>
          <button onClick={() => setError(null)} className="mt-4 px-3 py-1 rounded bg-red-500/20 text-red-200 text-[11px] hover:bg-red-500/30">Dismiss</button>
        </div>
      )}
      {showDebug && !error && (
        <div className="absolute bottom-2 left-2 right-2 max-h-[40%] overflow-auto rounded-lg bg-black/70 backdrop-blur p-3 text-[10px] font-mono text-neutral-300 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-neutral-200">Transpiled Code</span>
            <button onClick={() => navigator.clipboard.writeText(code)} className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px]">Copy</button>
          </div>
          <pre className="whitespace-pre text-[10px] leading-snug">{code}</pre>
        </div>
      )}
    </div>
  );
};

export default PreviewBrowser;
