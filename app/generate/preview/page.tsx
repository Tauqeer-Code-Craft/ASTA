"use client";

import React, { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";

import CodeEditor from "@/components/CodeEditor";
import PreviewBrowser from "@/components/PreviewBrowser";
import { useSearchParams } from "next/navigation";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const initialCode =
    searchParams.get("code") ||
    `
function App() {
  return <h1 className="text-2xl font-bold">Hello, edit me!</h1>;
}
ReactDOM.render(<App />, document.getElementById('root'));
`;

  const [code, setCode] = useState(initialCode);
  const [transpiledCode, setTranspiledCode] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        const output = Babel.transform(code, {
          presets: ["react", "env"],
          plugins: ["proposal-class-properties"],
        }).code;
        setTranspiledCode(output || "");
      } catch (error: any) {
        setTranspiledCode(`console.error(${JSON.stringify(error.message)});`);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [code]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-neutral-950 text-neutral-100">
      {/* Editor */}
      <div className="flex-1 border border-white/20 rounded-xl shadow-lg overflow-hidden bg-neutral-900 transition-all duration-300">
        <header className="px-4 py-2 border-b border-white/10 bg-neutral-800 font-semibold text-lg select-none">
          Code Editor
        </header>
        <div className="h-[calc(100vh-96px)]"  >
          <CodeEditor
          code={code}
          onChange={(value) => setCode(value || "")}
          
        />
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 border border-white/20 rounded-xl shadow-lg overflow-hidden bg-neutral-900 transition-all duration-300 flex flex-col">
        <header className="px-4 py-2 border-b border-white/10 bg-neutral-800 font-semibold text-lg select-none">
          Live Preview
        </header>
        <div className="flex-1 bg-white rounded-b-xl overflow-auto">
          <PreviewBrowser code={transpiledCode} />
        </div>
      </div>
    </div>
  );
}
