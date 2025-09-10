'use client';

import React, { ChangeEvent, useState } from 'react';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const generateCode = async () => {
    try {
      const res = await fetch('/api/ai-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok)
        throw new Error('Failed to generate code: ' + res.statusText);

      const data: { code: string } = await res.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error('Error generating code:', error);
      setGeneratedCode('Error generating code. Please try again.');
    }
  };

  const onPromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Generate AI Code</h1>

      <textarea
        rows={4}
        value={prompt}
        onChange={onPromptChange}
        placeholder="Enter your prompt here..."
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <button
        onClick={generateCode}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Generate
      </button>

      {generatedCode && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-2">Generated Code Preview:</h2>
          <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-sm overflow-x-auto">
            {generatedCode}
          </pre>

          <a
            href={`/generate/preview?code=${encodeURIComponent(
              generatedCode
            )}`}
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Preview
          </a>
        </div>
      )}
    </div>
  );
}
