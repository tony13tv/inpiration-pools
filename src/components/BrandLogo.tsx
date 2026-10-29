import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "full" | "compact";
}

export function BrandLogo({ className = "", variant = "full" }: BrandLogoProps) {
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-3.5 ${className}`}>
        <div className="relative flex h-12 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-b from-slate-900 to-slate-950 p-1.5 shadow-lg shadow-cyan-500/15">
          <svg
            viewBox="0 0 140 110"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="compactWater" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="compactSun" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="compactSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Sun */}
            <circle cx="112" cy="22" r="9" fill="url(#compactSun)" />
            <g stroke="url(#compactSun)" strokeWidth="2.2" strokeLinecap="round">
              <line x1="112" y1="8" x2="112" y2="4" />
              <line x1="112" y1="36" x2="112" y2="40" />
              <line x1="98" y1="22" x2="94" y2="22" />
              <line x1="126" y1="22" x2="130" y2="22" />
              <line x1="122" y1="12" x2="125" y2="9" />
              <line x1="102" y1="32" x2="99" y2="35" />
              <line x1="102" y1="12" x2="99" y2="9" />
              <line x1="122" y1="32" x2="125" y2="35" />
            </g>
            {/* Splash Crown */}
            <path
              d="M22 68 C16 45, 36 26, 52 44 C58 22, 82 20, 88 42 C100 28, 118 36, 110 58 Z"
              fill="url(#compactWater)"
              opacity="0.85"
            />
            <circle cx="24" cy="34" r="3.5" fill="#38bdf8" />
            <circle cx="68" cy="18" r="4" fill="#22d3ee" />
            {/* Swimmer */}
            <path
              d="M36 67 C54 55, 76 41, 94 30 C104 36, 118 49, 125 60 L112 64 C104 55, 96 47, 90 43 C76 52, 62 61, 48 69 Z"
              fill="url(#compactSkin)"
            />
            <circle cx="96" cy="61" r="10.5" fill="url(#compactSkin)" />
            <path
              d="M86 59 C88 49, 103 49, 106 58 C100 55, 92 55, 86 59 Z"
              fill="#0284c7"
            />
            <ellipse
              cx="101"
              cy="61"
              rx="4"
              ry="2.3"
              fill="#0f172a"
              stroke="#e0f2fe"
              strokeWidth="1.2"
            />
            {/* Waves */}
            <path
              d="M8 74 C38 60, 72 82, 104 70 C118 65, 128 72, 134 69 C120 86, 86 90, 52 85 C28 82, 16 86, 8 74 Z"
              fill="url(#compactWater)"
            />
            <path
              d="M22 89 C55 80, 88 96, 122 84 C102 98, 56 100, 22 89 Z"
              fill="#7dd3fc"
            />
          </svg>
        </div>
        <div>
          <span className="block text-base font-extrabold tracking-tight text-white">
            ATL INSPIRATION POOLS
          </span>
          <span className="block text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
            &amp; Construction Inc.
          </span>
          <span className="block text-[10px] font-medium tracking-wider text-amber-300/90 italic">
            “A Family Company”
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 520 320"
        className="w-full max-w-[440px] drop-shadow-[0_10px_25px_rgba(6,182,212,0.22)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ATL Inspiration Pools & Construction Inc. - A Family Company"
      >
        <defs>
          <linearGradient id="heroPoolCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="heroDeepWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="heroSunGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="heroSwimmerSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <path id="heroTopArc" d="M 56,152 A 215,125 0 0,1 464,152" />
        </defs>

        {/* Sun in top-right */}
        <g transform="translate(388, 52)">
          <circle cx="0" cy="0" r="14" fill="url(#heroSunGold)" />
          <g stroke="url(#heroSunGold)" strokeWidth="3" strokeLinecap="round">
            <line x1="0" y1="-20" x2="0" y2="-28" />
            <line x1="0" y1="20" x2="0" y2="28" />
            <line x1="-20" y1="0" x2="-28" y2="0" />
            <line x1="20" y1="0" x2="28" y2="0" />
            <line x1="14" y1="-14" x2="20" y2="-20" />
            <line x1="-14" y1="14" x2="-20" y2="20" />
            <line x1="-14" y1="-14" x2="-20" y2="-20" />
            <line x1="14" y1="14" x2="20" y2="20" />
          </g>
        </g>

        {/* Arched Title */}
        <text
          fill="url(#heroPoolCyan)"
          fontSize="24.5"
          fontWeight="900"
          letterSpacing="3.5"
        >
          <textPath href="#heroTopArc" startOffset="50%" textAnchor="middle">
            ATL INSPIRATION POOLS
          </textPath>
        </text>

        {/* Water Splash Crown */}
        <path
          d="M172 178 C162 144, 188 116, 210 142 C218 110, 248 108, 256 140 C276 114, 306 122, 296 154 C320 142, 340 158, 324 178 Z"
          fill="url(#heroPoolCyan)"
          opacity="0.9"
        />
        <circle cx="168" cy="128" r="4.5" fill="#38bdf8" />
        <circle cx="232" cy="102" r="5" fill="#22d3ee" />
        <circle cx="310" cy="114" r="4.5" fill="#38bdf8" />
        <circle cx="344" cy="140" r="3.5" fill="#7dd3fc" />

        {/* Swimmer Figure */}
        <g>
          <path
            d="M208 174 C234 160, 265 140, 292 124 C306 132, 326 152, 336 166 L318 171 C308 159, 296 148, 288 143 C268 156, 250 168, 230 178 Z"
            fill="url(#heroSwimmerSkin)"
          />
          <circle cx="296" cy="168" r="15" fill="url(#heroSwimmerSkin)" />
          <path
            d="M282 165 C284 152, 306 151, 311 164 C302 160, 290 160, 282 165 Z"
            fill="#0284c7"
          />
          <ellipse
            cx="304"
            cy="168"
            rx="5.5"
            ry="3.2"
            fill="#0f172a"
            stroke="#e0f2fe"
            strokeWidth="1.5"
          />
        </g>

        {/* Waves */}
        <path
          d="M118 184 C165 166, 215 196, 265 180 C315 164, 360 192, 402 178 C376 202, 320 206, 260 200 C200 194, 154 204, 118 184 Z"
          fill="url(#heroDeepWave)"
        />
        <path
          d="M144 202 C195 188, 245 212, 295 196 C340 183, 372 202, 386 196 C356 216, 300 220, 250 214 C200 208, 168 216, 144 202 Z"
          fill="#38bdf8"
        />
        <path
          d="M180 218 C225 210, 275 224, 336 212 C306 228, 235 230, 180 218 Z"
          fill="#7dd3fc"
          opacity="0.9"
        />

        {/* Bottom Text */}
        <text
          x="260"
          y="264"
          textAnchor="middle"
          fill="url(#heroPoolCyan)"
          fontSize="22"
          fontWeight="900"
          letterSpacing="3"
        >
          &amp; CONSTRUCTION INC.
        </text>

        <line
          x1="125"
          y1="287"
          x2="168"
          y2="287"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <text
          x="260"
          y="292"
          textAnchor="middle"
          fill="#fde68a"
          fontSize="13.5"
          fontWeight="800"
          letterSpacing="2.5"
        >
          “A FAMILY COMPANY”
        </text>
        <line
          x1="352"
          y1="287"
          x2="395"
          y2="287"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}
