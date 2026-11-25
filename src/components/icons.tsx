import React from "react";

type IconProps = { size?: number };

/** Throne / seat of honour. */
export const ThroneIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M50 40 Q100 0 150 40 L150 120 L50 120 Z" fill="#b3261e" stroke="#ffd166" strokeWidth={8} strokeLinejoin="round" />
    <rect x={36} y={112} width={128} height={34} rx={10} fill="#ffd166" />
    <rect x={46} y={146} width={16} height={40} rx={4} fill="#e0a526" />
    <rect x={138} y={146} width={16} height={40} rx={4} fill="#e0a526" />
    <path d="M80 56 L90 70 L100 50 L110 70 L120 56 L116 86 L84 86 Z" fill="#ffd166" />
  </svg>
);

/** Shut gate with a red cross — rejection. */
export const RejectedIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M40 186 L40 70 Q100 18 160 70 L160 186 Z" fill="#3a2a4d" stroke="#8b7aa8" strokeWidth={6} />
    <line x1={100} y1={40} x2={100} y2={186} stroke="#8b7aa8" strokeWidth={6} />
    <circle cx={88} cy={120} r={6} fill="#ffd166" />
    <circle cx={112} cy={120} r={6} fill="#ffd166" />
    <g stroke="#ff3b4a" strokeWidth={18} strokeLinecap="round">
      <line x1={50} y1={60} x2={150} y2={160} />
      <line x1={150} y1={60} x2={50} y2={160} />
    </g>
  </svg>
);

/** Marigold garland — honour bestowed. */
export const GarlandIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {new Array(15).fill(0).map((_, i) => {
      const t = i / 14;
      const x = (1 - t) ** 2 * 40 + 2 * (1 - t) * t * 100 + t ** 2 * 160;
      const y = (1 - t) ** 2 * 40 + 2 * (1 - t) * t * 210 + t ** 2 * 40;
      return <circle key={i} cx={x} cy={y} r={i % 2 ? 11 : 14} fill={i % 2 ? "#ffc93c" : "#ff8c1a"} />;
    })}
  </svg>
);
