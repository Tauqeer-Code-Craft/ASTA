"use client";
import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 text-center">
      {/* Section Header */}
      <h3 className="text-sm font-semibold text-fuchsia-500 tracking-wide uppercase">
        Visual Development Platform
      </h3>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
        Bring the power of development to your entire team
      </h2>
      <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
        Let both developers and non-developers leverage your existing code
        to innovate, iterate, and ship faster.
      </p>

      {/* Features Grid */}
      <div className="mt-16 space-y-32">
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image placeholder */}
          <div className="w-full md:w-1/2 h-64 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500">
            Image Placeholder
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Use your existing code
            </h3>
            <p className="mt-3 text-neutral-400">
              Connect to any code repository.  
              Leverage design systems, components, and real data.  
              Automatically keep everything in sync across your project.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          {/* Image placeholder */}
          <div className="w-full md:w-1/2 h-64 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500">
            Image Placeholder
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Bring in your Figma designs
            </h3>
            <p className="mt-3 text-neutral-400">
              Import your existing Figma designs seamlessly.  
              Convert them to responsive code instantly.  
              Keep your design handoff smooth and efficient.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image placeholder */}
          <div className="w-full md:w-1/2 h-64 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500">
            Image Placeholder
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Visually edit anything
            </h3>
            <p className="mt-3 text-neutral-400">
              Modify layouts, styles, and content with a visual editor.  
              Save changes directly into your codebase.  
              Empower your team to collaborate without breaking workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
