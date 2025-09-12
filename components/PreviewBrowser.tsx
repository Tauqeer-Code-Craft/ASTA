import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface PreviewBrowserProps {
  code: string;
}

const html = `
<!DOCTYPE html>
  <html lang="en">
  <head><style>body{margin:0;}</style></head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script>
      window.addEventListener('message', (event) => {
        try {
          const code = event.data;
          document.getElementById('root').innerHTML = '';
          new Function('React', 'ReactDOM', code)(React, ReactDOM);
        } catch(e) {
          document.getElementById('root').innerHTML = '<pre style="color: red;">' + e + '</pre>';
        }
      }, false);
    </script>
  </body>
</html>
`;

const PreviewBrowser = ({ code }: PreviewBrowserProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0); // for refresh

  useEffect(() => {
    if (iframeRef.current && code) {
      iframeRef.current.contentWindow?.postMessage(code, "*");
    }
  }, [code, key]);

  // Open preview in a new tab, passing the code via URL-encoded query param
  const openInNewTab = () => {
    const encodedCode = encodeURIComponent(code);
    const previewUrl = `/preview?code=${encodedCode}`; // Adjust to your preview route
    window.open(previewUrl, "_blank");
  };

  const handleRefresh = () => {
    setKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col h-full">
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
    </div>
  );
};

export default PreviewBrowser;
