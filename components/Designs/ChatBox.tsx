"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Plus, ArrowUp, Github, Figma, Server, Puzzle } from "lucide-react";

const phrases = [
  "Build a SaaS landing page",
  "Generate a full-stack dashboard",
  "Design a modern portfolio",
  "Create a marketing hero section",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  // Typing animation
  useEffect(() => {
    if (isFocused || prompt.length > 0) {
      setPlaceholder("");
      return;
    }

    const type = () => {
      const current = phrases[phraseIndex.current];

      if (!deleting.current) {
        setPlaceholder(current.slice(0, charIndex.current + 1));
        charIndex.current++;
        if (charIndex.current === current.length) {
          deleting.current = true;
          return;
        }
      } else {
        setPlaceholder(current.slice(0, charIndex.current - 1));
        charIndex.current--;
        if (charIndex.current === 0) {
          deleting.current = false;
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        }
      }
    };

    const interval = setInterval(type, deleting.current ? 120 : 180);
    return () => clearInterval(interval);
  }, [isFocused, prompt]);

  // Auto resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // API Call
  const generateCode = async () => {
  try {
    const res = await fetch("/api/ai-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model: selectedModel }),
    });

    if (!res.ok) throw new Error("Failed to generate code");

    const data = await res.json();

    // ✅ Encode aur pass karo preview page ko
    const encoded = encodeURIComponent(data.code);
    window.open(`/generate/preview?code=${encoded}`, "_blank");
  } catch (err) {
    console.error(err);
    alert("Error generating code. Please try again.");
  }
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && selectedModel && prompt.trim()) {
      e.preventDefault();
      generateCode();
    }
  };

  return (
    <section className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-8 text-center">
      <h1 className="text-2xl font-semibold mb-6">AI Code Generator</h1>

      <div className="w-full max-w-3xl">
        <div className="relative flex items-end rounded-xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg backdrop-blur-md">
          {/* Attach Button */}
          <button className="absolute bottom-2 left-3 flex items-center gap-1 text-xs font-medium rounded-md border border-white/10 px-2 py-1 hover:bg-white/10">
            <Plus className="h-4 w-4 text-neutral-300" /> Attach
          </button>

          {/* LLM Select */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="absolute bottom-2 left-20 text-xs rounded-md border border-white/10 bg-transparent text-neutral-200 px-2 py-1 focus:outline-none"
          >
            <option value="">Select LLM</option>
            <option value="gpt-4">GPT-4 (OpenAI)</option>
            <option value="gemini">Gemini</option>
          </select>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setPrompt(e.target.value)
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none bg-transparent text-neutral-200 text-sm sm:text-base 
            placeholder-neutral-400 placeholder:text-sm focus:outline-none pb-4
            min-h-[70px] max-h-[100px] overflow-y-auto leading-tight"
          />

          {/* Send Button */}
          <button
            onClick={generateCode}
            disabled={!prompt.trim() || !selectedModel}
            className={`absolute bottom-2 right-3 rounded-md p-1 transition-colors ${
              prompt.trim() && selectedModel
                ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                : "bg-neutral-700"
            }`}
          >
            <ArrowUp className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          <Github className="h-4 w-4" /> Connect a repo
        </button>
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          <Figma className="h-4 w-4" /> Figma Import
        </button>
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          <Server className="h-4 w-4" /> MCP Servers
        </button>
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          <Puzzle className="h-4 w-4" /> Get Extension
        </button>
      </div>
    </section>
  );
}
