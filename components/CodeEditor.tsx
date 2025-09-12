'use client';

import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <MonacoEditor
      height="100%"
      language="javascript"
      value={code}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        fontFamily: 'Fira Code, monospace',
        fontLigatures: true,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
      }}
      onChange={onChange}
      className="rounded-md border border-neutral-700 shadow-lg"
    />
  );
}
