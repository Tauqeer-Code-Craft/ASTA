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
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

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
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden ">
      

      {/* File Tree - 15% */}
      <aside className="w-[15%] border-r border-neutral-800 bg-neutral-900 p-4 flex flex-col shadow-lg">
        <h2 className="text-lg font-semibold mb-4 select-none tracking-wide">📂 Files</h2>
        <ul className="flex-1 overflow-auto space-y-2 text-neutral-300 font-medium text-sm">
          {/* Example files */}
          {["index.tsx", "App.tsx", "styles.css", "Header.tsx", "helpers.ts"].map((file) => (
            <li
              key={file}
              className="cursor-pointer hover:bg-neutral-800 rounded px-2 py-1 transition-colors duration-200 truncate"
              title={file}
            >
              {file}
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor + Preview - 60% */}
      <section className="w-[60%] flex flex-col shadow-lg bg-neutral-900 overflow-hidden">
        {/* Tabs */}
        <nav className="flex border-b border-neutral-700 bg-neutral-950">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-3 text-center font-semibold tracking-wide transition-colors duration-200
              ${
                activeTab === "editor"
                  ? "border-b-4 border-blue-500 text-white bg-neutral-900"
                  : "text-neutral-400 hover:bg-neutral-800"
              }
            `}
            aria-selected={activeTab === "editor"}
            role="tab"
            type="button"
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-3 text-center font-semibold tracking-wide transition-colors duration-200
              ${
                activeTab === "preview"
                  ? "border-b-4 border-blue-500 text-white bg-neutral-900"
                  : "text-neutral-400 hover:bg-neutral-800"
              }
            `}
            aria-selected={activeTab === "preview"}
            role="tab"
            type="button"
          >
            Live Preview
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <CodeEditor code={code} onChange={(value) => setCode(value || "")} />
          ) : (
            <PreviewBrowser code={transpiledCode} />
          )}
        </div>
      </section>

        {/* Chatbox - 25% */}


      <aside className="w-[25%]  border-r border-neutral-800 bg-neutral-900 p-6 flex flex-col rounded-r-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6 select-none tracking-wide">💬 Chatbox</h2>
        <div className="flex-1 bg-neutral-800 rounded-lg p-4 overflow-auto shadow-inner">
          <p className="text-neutral-300 italic">Chat interface coming soon...</p>
        </div>
      </aside>
    </div>
  );
}
