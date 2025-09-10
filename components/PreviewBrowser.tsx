'use client';

import React, { useEffect, useRef, useState } from 'react'

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

const PreviewBrowser = ({code}:PreviewBrowserProps) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() =>{
        if (iframeRef.current && code){
            iframeRef.current.contentWindow?.postMessage(code,"*");
        }
    },[code])

  return (
    <iframe 
    title='preview'
    ref= {iframeRef}
    sandbox='allow-scripts'
    srcDoc={html}
    className="w-full h-full"    
    ></iframe>
  );
}

export default PreviewBrowser