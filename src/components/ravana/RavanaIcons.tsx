import React from "react";

type IconProps = { size?: number };

/** Ego / arrogance: a tilted gold crown with a smirk spark. */
export const EgoCrownIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g transform="rotate(-12 100 110)">
      <path d="M30 150 L20 60 L65 100 L100 40 L135 100 L180 60 L170 150 Z" fill="#ffd166" stroke="#b07a12" strokeWidth={6} strokeLinejoin="round" />
      <rect x={28} y={146} width={144} height={22} rx={8} fill="#e0a526" />
      <circle cx={100} cy={120} r={12} fill="#d7263d" />
      <circle cx={60} cy={126} r={8} fill="#2a8cff" />
      <circle cx={140} cy={126} r={8} fill="#2a8cff" />
    </g>
  </svg>
);

/** Vanar (monkey) face. */
export const MonkeyIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx={36} cy={96} r={26} fill="#8a4b22" />
    <circle cx={164} cy={96} r={26} fill="#8a4b22" />
    <circle cx={36} cy={96} r={14} fill="#e9b48a" />
    <circle cx={164} cy={96} r={14} fill="#e9b48a" />
    <circle cx={100} cy={100} r={70} fill="#8a4b22" />
    <path d="M60 92 Q60 56 100 66 Q140 56 140 92 Q150 150 100 162 Q50 150 60 92 Z" fill="#e9b48a" />
    <ellipse cx={80} cy={92} rx={9} ry={11} fill="#1a1010" />
    <ellipse cx={120} cy={92} rx={9} ry={11} fill="#1a1010" />
    <circle cx={83} cy={88} r={3} fill="#fff" />
    <circle cx={123} cy={88} r={3} fill="#fff" />
    <path d="M92 116 Q100 122 108 116" fill="none" stroke="#5a2a12" strokeWidth={4} strokeLinecap="round" />
    <path d="M76 134 Q100 152 124 134" fill="none" stroke="#5a2a12" strokeWidth={5} strokeLinecap="round" />
    {/* tilak */}
    <path d="M100 46 L100 66" stroke="#d7263d" strokeWidth={7} strokeLinecap="round" />
  </svg>
);

/** Shield emblem (Nalakuvara's protection). */
export const ShieldIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M100 16 L170 44 Q172 130 100 184 Q28 130 30 44 Z" fill="#ffd166" stroke="#b07a12" strokeWidth={6} strokeLinejoin="round" />
    <path d="M100 40 L150 60 Q150 122 100 160 Q50 122 50 60 Z" fill="#b3261e" />
    <path d="M78 98 L94 114 L124 80" fill="none" stroke="#ffd166" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Lotus (Sita). */
export const LotusIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {[-60, -30, 0, 30, 60].map((a, i) => (
      <ellipse key={a} cx={100} cy={86} rx={20} ry={56} fill={i % 2 ? "#ff9ec4" : "#f26fa3"} stroke="#ffd166" strokeWidth={3} transform={`rotate(${a} 100 150)`} />
    ))}
    <path d="M36 150 Q100 184 164 150 Q100 170 36 150 Z" fill="#2a7a3d" />
    <circle cx={100} cy={140} r={10} fill="#ffd166" />
  </svg>
);

/** Ikshvaku lineage crown. */
export const LineageIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M100 180 L100 40 M100 120 L50 80 M100 90 L150 56" stroke="#ffd166" strokeWidth={10} strokeLinecap="round" />
    {[
      [100, 40],
      [50, 80],
      [150, 56],
      [100, 180],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={18} fill={i === 0 ? "#ff8c1a" : "#ffd166"} stroke="#b07a12" strokeWidth={4} />
    ))}
    {/* sun of the Suryavansh */}
    <circle cx={100} cy={40} r={8} fill="#fff3b0" />
  </svg>
);

/** Sri Rama's bow (Kodanda) and arrow. */
export const BowArrowIcon: React.FC<IconProps> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <path d="M60 12 Q170 100 60 188" fill="none" stroke="#7a3a12" strokeWidth={14} strokeLinecap="round" />
    <path d="M60 12 Q170 100 60 188" fill="none" stroke="#ffd166" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 14" />
    <line x1={60} y1={12} x2={60} y2={188} stroke="#fff3e0" strokeWidth={3} />
    <line x1={20} y1={100} x2={186} y2={100} stroke="#3a1f12" strokeWidth={7} strokeLinecap="round" />
    <path d="M200 100 L176 86 L176 114 Z" fill="#ffd166" stroke="#b07a12" strokeWidth={3} />
    <path d="M20 100 L6 88 M20 100 L6 112 M32 100 L18 88 M32 100 L18 112" stroke="#d7263d" strokeWidth={5} strokeLinecap="round" />
  </svg>
);
