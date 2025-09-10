"use client";

import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
}

export default function CodeEditor({code, onChange}: CodeEditorProps) {

    return (
        <MonacoEditor
            height="400px"
            language="javascript"
            value={code}
            theme="vs-dark"
            options={{minimap: {enabled: false}, 
            fontSize: 14,
            wordWrap: 'on',
            }}
            onChange={onChange}
        />
    );
}
