"use client"

import { reactViteTemplate } from '@/utils/webcontainerTemplate';
import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useRef, useState } from 'react'

type WebContainerManagerProps = {
    files: Record<string, string>;
    entryFile: string;
};

const WebContainerManager:React.FC<WebContainerManagerProps> = () => {

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [status,setStatus] = useState('Booting...')

    useEffect(()=>{
        const boot = async ()=>{
            setStatus('Starting WebContainer...');
            const webcontainer = await WebContainer.boot();
            setStatus('Mounting FS...');
            await webcontainer.mount(reactViteTemplate);

            setStatus('Installing dependencies');
            const install = await webcontainer.spawn('npm',['install']);
            install.output.pipeTo(
                new WritableStream({
                    write: (data)=> console.log('[install]',data),
                })
            );
            await install.exit;

            setStatus('Starting dev server...');
            const dev = await webcontainer.spawn('npm',['run','dev']);
            dev.output.pipeTo(
                new WritableStream({
                    write: (data) => console.log('[vite]',data),
                })
            );

            webcontainer.on('server-ready',(port,url)=>{
                console.log('Dev server ready at: ',url);
                setStatus('Running');
                if (iframeRef.current) {
                    iframeRef.current.src = url;
                } 
            });
        };
        boot();
    },[]);

  return (
     <div className="w-full h-full flex flex-col">
      <div className="p-2 text-sm text-neutral-300 border-b border-white/10 bg-white/5">
        Status: {status}
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 w-full"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}

export default WebContainerManager