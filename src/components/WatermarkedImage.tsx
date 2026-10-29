"use client";

import React from "react";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  variant?: "hero" | "thumbnail";
}

export function WatermarkedImage({
  src,
  alt,
  className = "",
  variant = "hero",
}: WatermarkedImageProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Underlying Project Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`pointer-events-none select-none ${className}`}
      />

      {variant === "hero" ? (
        <>
          {/* Repeating Diagonal Tiled Watermark Pattern Across Entire Photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-16 flex -rotate-24 flex-wrap items-center justify-center gap-x-12 gap-y-10 opacity-25"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 whitespace-nowrap font-sans text-xs font-black tracking-[0.22em] text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                <span>ATL INSPIRATION POOLS &amp; CONSTRUCTION INC.</span>
              </div>
            ))}
          </div>

          {/* Center-Bottom Translucent Brand Seal */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/65 px-3 py-1 backdrop-blur-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt=""
              draggable={false}
              className="h-5 w-6 object-contain"
            />
            <span className="font-sans text-[10px] font-extrabold tracking-widest text-white/85 uppercase">
              © ATL Inspiration Pools • (404) 573-9665
            </span>
          </div>
        </>
      ) : (
        /* Compact Watermark for Thumbnail Strip */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/15"
        >
          <span className="-rotate-18 font-sans text-[8px] font-black tracking-widest text-white/45 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
            ATL POOLS
          </span>
        </div>
      )}
    </div>
  );
}
