import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Ravana } from "./Ravana";

/** Snow-capped Mount Kailash with a faint glowing trishul. viewBox 1080x900. */
export const Kailash: React.FC<{ width?: number; glow?: number; style?: React.CSSProperties }> = ({
  width = 1080,
  glow = 0.6,
  style,
}) => (
  <svg viewBox="0 0 1080 900" width={width} height={(width * 900) / 1080} style={{ overflow: "visible", ...style }}>
    <path d="M-40 900 L200 520 L330 640 L540 220 L760 600 L880 480 L1120 900 Z" fill="#33406e" />
    <path d="M540 220 L700 500 L640 470 L600 540 L560 470 L520 520 L470 470 L420 500 Z" fill="#eef3ff" />
    <path d="M540 220 L420 500 L470 470 L520 520 L540 480 Z" fill="#c9d4f2" />
    <path d="M200 520 L260 610 L230 600 L200 630 L170 600 L150 610 Z" fill="#eef3ff" />
    <path d="M880 480 L950 590 L910 575 L880 610 L850 575 L820 590 Z" fill="#eef3ff" />
    <path d="M-40 900 L300 760 L540 820 L800 740 L1120 900 Z" fill="#232d55" />
    {/* trishul */}
    <g transform="translate(540 120)" opacity={glow} style={{ filter: "drop-shadow(0 0 16px #ffd166)" }}>
      <rect x={-4} y={-10} width={8} height={110} fill="#ffd166" />
      <path d="M-34 -40 Q-34 10 0 10 Q34 10 34 -40 M0 -60 L0 10" fill="none" stroke="#ffd166" strokeWidth={8} strokeLinecap="round" />
    </g>
  </svg>
);

/** Distant Himalayan range for Vedavati's tapasya. viewBox 1080x600. */
export const Himalaya: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 1080, style }) => (
  <svg viewBox="0 0 1080 600" width={width} height={(width * 600) / 1080} style={{ overflow: "visible", ...style }}>
    <path d="M-40 600 L120 300 L260 420 L420 160 L600 400 L760 220 L900 380 L1120 260 L1120 600 Z" fill="#6b2a1a" opacity={0.65} />
    <path d="M420 160 L500 270 L460 260 L420 300 L380 260 L350 270 Z" fill="#ffe2c2" opacity={0.85} />
    <path d="M760 220 L830 320 L790 305 L760 340 L730 305 L700 315 Z" fill="#ffe2c2" opacity={0.85} />
    <path d="M-40 600 L200 470 L460 540 L720 460 L1120 600 Z" fill="#3d150c" />
  </svg>
);

/** Pushpak Viman — golden flying temple-chariot carrying Ravana. viewBox 520x360. */
export const PushpakViman: React.FC<{ width?: number; laugh?: number; style?: React.CSSProperties }> = ({
  width = 520,
  laugh = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flap = Math.sin((frame / fps) * Math.PI * 2 * 2) * 8;
  return (
    <svg viewBox="0 0 520 360" width={width} height={(width * 360) / 520} style={{ overflow: "visible", ...style }}>
      {/* wings */}
      <path d={`M150 230 Q40 ${150 + flap} -20 ${200 + flap} Q60 230 150 260 Z`} fill="#ffd166" stroke="#e0a526" strokeWidth={4} />
      <path d={`M370 230 Q480 ${150 + flap} 540 ${200 + flap} Q460 230 370 260 Z`} fill="#ffd166" stroke="#e0a526" strokeWidth={4} />
      {/* shikhara canopy pillars */}
      <rect x={140} y={120} width={14} height={130} fill="#e0a526" />
      <rect x={366} y={120} width={14} height={130} fill="#e0a526" />
      <path d="M120 130 Q260 20 400 130 Z" fill="#f4a926" stroke="#b07a12" strokeWidth={4} opacity={0.95} />
      <path d="M255 40 L260 0 L265 40 Z" fill="#ffd166" />
      <path d="M262 4 L300 14 L262 22 Z" fill="#d7263d" />
      {/* Ravana riding */}
      <g transform="translate(135 -10)">
        <Ravana width={250} laugh={laugh} eyeGlow={0.6} />
      </g>
      {/* deck */}
      <path d="M90 240 L430 240 L400 300 L120 300 Z" fill="#ffd166" stroke="#b07a12" strokeWidth={5} />
      {[140, 190, 240, 290, 340, 390].map((x) => (
        <circle key={x} cx={x} cy={270} r={9} fill="#d7263d" stroke="#b07a12" strokeWidth={3} />
      ))}
      {/* swan prow */}
      <path d="M90 240 Q40 220 50 160 Q60 130 80 150 Q70 180 110 240 Z" fill="#fff8e7" stroke="#e0a526" strokeWidth={4} />
      <path d="M50 160 L30 168 L52 172 Z" fill="#f4a926" />
      {/* glow underneath */}
      <ellipse cx={260} cy={320} rx={170} ry={22} fill="#ffd166" opacity={0.35} />
    </svg>
  );
};

/** Ashoka tree with red blossoms. viewBox 500x700. */
export const AshokaTree: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 500, style }) => (
  <svg viewBox="0 0 500 700" width={width} height={(width * 700) / 500} style={{ overflow: "visible", ...style }}>
    <path d="M230 700 L240 420 Q200 360 150 340 M245 430 Q300 360 360 330 M240 480 L270 380" fill="none" stroke="#3a1f12" strokeWidth={34} strokeLinecap="round" />
    {[
      [250, 250, 170],
      [140, 320, 110],
      [370, 300, 120],
      [250, 140, 120],
    ].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#1f4a2a" : "#2a5e35"} />
    ))}
    {new Array(26).fill(0).map((_, i) => {
      const a = i * 2.39;
      const rr = 40 + ((i * 37) % 150);
      return <circle key={i} cx={250 + Math.cos(a) * rr} cy={250 + Math.sin(a) * rr * 0.7} r={10} fill="#ff4d3a" />;
    })}
  </svg>
);

/** Dusky battlefield: broken spears & arrows stuck in the ground. viewBox 1080x500. */
export const Battlefield: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 1080, style }) => (
  <svg viewBox="0 0 1080 500" width={width} height={(width * 500) / 1080} style={{ overflow: "visible", ...style }}>
    <path d="M-40 500 L-40 260 Q300 200 540 240 Q800 280 1120 220 L1120 500 Z" fill="#2a1420" />
    {[
      [120, 250, -18],
      [210, 235, 12],
      [820, 250, -10],
      [930, 230, 20],
      [700, 255, 6],
    ].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <rect x={-3} y={-130} width={6} height={130} fill="#5a3a26" />
        <path d="M0 -150 L-10 -128 L10 -128 Z" fill="#9aa3b5" />
      </g>
    ))}
    <path d="M60 300 L180 290 M880 300 L990 285" stroke="#5a3a26" strokeWidth={6} strokeLinecap="round" />
  </svg>
);
