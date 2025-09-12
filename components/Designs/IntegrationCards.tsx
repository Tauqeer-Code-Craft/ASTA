"use client";
import React from "react";
import { ArrowUp, GitPullRequest } from "lucide-react";

const IntegrationCards: React.FC = () => {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 text-center">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {/* First Card - Start from scratch */}
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 shadow-lg hover:shadow-xl hover:border-fuchsia-500/50 transition duration-300 ease-in-out hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            Start from scratch
          </h3>
          <div className="relative flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 ">
            <span className="flex-1 text-neutral-400 text-sm">
              Ask Fusion to build...
            </span>
            <button className="ml-2 rounded-md bg-gradient-to-r from-fuchsia-500 to-indigo-500 p-2 hover:opacity-90 transition">
              <ArrowUp className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Middle Card - Connect with existing repo */}
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 shadow-lg hover:shadow-xl hover:border-emerald-500/50 transition duration-300 ease-in-out hover:-translate-y-1 flex flex-col items-start">
          <h3 className="text-lg font-semibold text-white mb-4">
            Connect with existing repo
          </h3>
          <button className="rounded-md bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 flex items-center gap-1 hover:bg-emerald-500/30 transition">
            <GitPullRequest className="h-3 w-3" /> Send PR
          </button>
        </div>

        {/* Last Card - Publish via API */}
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 shadow-lg hover:shadow-xl hover:border-indigo-500/50 transition duration-300 ease-in-out hover:-translate-y-1 flex flex-col items-center justify-end">
          <h3 className="text-lg font-semibold text-white mb-4">
            Publish via API
          </h3>
          <button className="mt-20 w-full rounded-lg border border-indigo-400/50 text-indigo-400 px-3 py-2 text-sm font-medium hover:bg-indigo-500/10 transition">
            Publish Update
          </button>
        </div>

      </div>
    </section>
  );
};

export default IntegrationCards;
