"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, ArrowUp, Github, Figma, Server, Puzzle } from "lucide-react";

const phrases = [
  "Build a SaaS landing page",
  "Generate a full-stack dashboard",
  "Design a modern portfolio",
  "Create a marketing hero section",
];

const ChatBox: React.FC = () => {
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  // 🔹 Typing placeholder effect
  useEffect(() => {
    if (isFocused || text.length > 0) {
      setPlaceholder(""); // stop animation when user types
      return;
    }

    const type = () => {
      const currentPhrase = phrases[phraseIndex.current];

      if (!deleting.current) {
        setPlaceholder(currentPhrase.slice(0, charIndex.current + 1));
        charIndex.current++;
        if (charIndex.current === currentPhrase.length) {
          deleting.current = true;
          return;
        }
      } else {
        setPlaceholder(currentPhrase.slice(0, charIndex.current - 1));
        charIndex.current--;
        if (charIndex.current === 0) {
          deleting.current = false;
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        }
      }
    };

    const interval = setInterval(type, deleting.current ? 120 : 180);
    return () => clearInterval(interval);
  }, [isFocused, text]);

  // 🔹 Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <section className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-8 text-center">
      {/* Input box */}
      <div className="w-full max-w-3xl">
        <div className="relative flex items-end rounded-xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg backdrop-blur-md">
          {/* Attachment button bottom-left */}
          <button className="absolute bottom-2 left-3 flex items-center gap-1 text-xs font-medium rounded-md border border-white/10 px-2 py-1 hover:bg-white/10">
            <Plus className="h-4 w-4 text-neutral-300" /> Attach
          </button>

          {/* Textarea with auto-resize + typing placeholder */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none bg-transparent text-neutral-200 text-sm sm:text-base 
             placeholder-neutral-400 placeholder:text-sm focus:outline-none pb-4
             min-h-[70px] max-h-[100px] overflow-y-auto leading-tight"
          />
          {/* Send button */}
          <button
            disabled={!text.trim()}
            className={`absolute bottom-2 right-3 rounded-md p-1 transition-colors ${
              text.trim()
                ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                : "bg-neutral-700"
            }`}
          >
            <ArrowUp className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Action pill buttons */}
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
};

export default ChatBox;
