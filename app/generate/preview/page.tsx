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
    <div className="flex flex-col md:flex-row gap-4 p-4 h-screen">
      {/* Editor */}
      <div className="flex-1 border rounded shadow-md overflow-hidden">
        <CodeEditor code={code} onChange={(value) => setCode(value || "")} />
      </div>

      {/* Preview */}
      <div className="flex-1 border rounded shadow-md overflow-hidden bg-white">
        <PreviewBrowser code={transpiledCode} />
      </div>
    </div>
  );
}
