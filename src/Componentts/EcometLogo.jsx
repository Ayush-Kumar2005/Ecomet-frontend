import React from "react";

/**
 * Ecomet brand mark — bag + orbit accent (SVG, no external assets).
 */
const EcometLogo = ({ size = 40, showWordmark = true, className = "" }) => {
  const id = React.useId().replace(/:/g, "");

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="8" y1="4" x2="40" y2="44">
            <stop stopColor="#34d399" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id={`${id}-orbit`} x1="0" y1="24" x2="48" y2="24">
            <stop stopColor="#6ee7b7" stopOpacity="0.9" />
            <stop offset="1" stopColor="#14b8a6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="12"
          fill={`url(#${id}-bg)`}
        />

        {/* Orbit ring */}
        <ellipse
          cx="24"
          cy="26"
          rx="14"
          ry="5"
          stroke={`url(#${id}-orbit)`}
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />

        {/* Bag body */}
        <path
          d="M16 20h16l-1.2 14H17.2L16 20z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M19 20v-2.5a5 5 0 0 1 10 0V20"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Comet dot */}
        <circle cx="36" cy="14" r="3" fill="#a7f3d0" />
        <circle cx="36" cy="14" r="1.2" fill="white" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            ECOMET
          </span>
          <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400 mt-0.5">
            Shop Smart
          </span>
        </div>
      )}
    </div>
  );
};

export default EcometLogo;
