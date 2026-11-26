import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type NandiProps = {
  /** 0..1 — glowing eyes + aura when angered. */
  anger?: number;
  /** Walk cycle on/off (legs swing). */
  walking?: boolean;
  width?: number;
  style?: React.CSSProperties;
};

/** Side view of Nandi the sacred bull, facing left. viewBox 600x480. */
export const Nandi: React.FC<NandiProps> = ({ anger = 0, walking = false, width = 520, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const swing = walking ? Math.sin(t * Math.PI * 2 * 1.6) * 12 : 0;
  const bob = walking ? Math.abs(Math.sin(t * Math.PI * 2 * 1.6)) * -6 : Math.sin(t * 2) * 2;

  const leg = (x: number, phase: number) => (
    <g transform={`rotate(${swing * phase} ${x} 330)`}>
      <rect x={x - 17} y={320} width={34} height={120} rx={14} fill="#e8e3d6" />
      <rect x={x - 19} y={428} width={38} height={22} rx={6} fill="#4a3b2a" />
      <rect x={x - 18} y={400} width={36} height={8} rx={4} fill="#ffd166" />
    </g>
  );

  return (
    <svg viewBox="0 0 600 480" width={width} height={(width * 480) / 600} style={{ overflow: "visible", ...style }}>
      {anger > 0 ? <ellipse cx={300} cy={250} rx={300} ry={220} fill="#ffd166" opacity={anger * 0.18} /> : null}
      <g transform={`translate(0 ${bob})`}>
        {leg(430, -1)}
        {leg(200, 1)}
        {/* tail */}
        <path d={`M520 230 Q${570 + swing} 300 ${555 + swing} 370`} fill="none" stroke="#e8e3d6" strokeWidth={10} strokeLinecap="round" />
        <ellipse cx={555 + swing} cy={378} rx={10} ry={18} fill="#4a3b2a" />
        {/* body */}
        <ellipse cx={350} cy={250} rx={200} ry={110} fill="#f4f1ea" />
        {/* hump */}
        <path d="M200 175 Q230 100 290 150 Z" fill="#f4f1ea" />
        {/* saddle cloth */}
        <path d="M260 160 Q350 140 450 165 L460 290 Q350 310 250 290 Z" fill="#b3261e" />
        <path d="M250 290 Q350 310 460 290" fill="none" stroke="#ffd166" strokeWidth={10} />
        <path d="M260 160 Q350 140 450 165" fill="none" stroke="#ffd166" strokeWidth={6} />
        {[280, 320, 360, 400, 440].map((x) => (
          <circle key={x} cx={x} cy={300} r={7} fill="#ffd166" />
        ))}
        {leg(470, 1)}
        {leg(240, -1)}
        {/* neck + head */}
        <path d="M120 170 Q190 150 230 190 L240 320 Q170 320 130 270 Z" fill="#ece7db" />
        <g transform="translate(95 190)">
          <ellipse cx={0} cy={0} rx={62} ry={74} fill="#f4f1ea" />
          <ellipse cx={-28} cy={48} rx={36} ry={30} fill="#d9cfc0" />
          <circle cx={-42} cy={50} r={6} fill="#4a3b2a" />
          <circle cx={-18} cy={56} r={6} fill="#4a3b2a" />
          {/* horns */}
          <path d="M-10 -60 Q-40 -120 -10 -140" fill="none" stroke="#c9b48a" strokeWidth={16} strokeLinecap="round" />
          <path d="M30 -56 Q40 -120 76 -130" fill="none" stroke="#c9b48a" strokeWidth={16} strokeLinecap="round" />
          <circle cx={-10} cy={-140} r={8} fill="#ffd166" />
          <circle cx={76} cy={-130} r={8} fill="#ffd166" />
          {/* ears */}
          <ellipse cx={60} cy={-30} rx={30} ry={13} fill="#e8e3d6" transform="rotate(-20 60 -30)" />
          {/* forehead ornament */}
          <path d="M-14 -44 L14 -44 L0 -10 Z" fill="#ffd166" />
          <circle cx={0} cy={-34} r={6} fill="#d7263d" />
          {/* eye */}
          <ellipse cx={-6} cy={-4} rx={11} ry={9} fill="#2a1d12" />
          <circle cx={-9} cy={-6} r={3} fill="#fff" />
          {anger > 0.05 ? (
            <g opacity={anger} style={{ filter: "drop-shadow(0 0 10px #ffd166) drop-shadow(0 0 22px #ff8c1a)" }}>
              <ellipse cx={-6} cy={-4} rx={12} ry={10} fill="#fff3b0" />
              <path d="M-24 -22 L10 -14" stroke="#2a1d12" strokeWidth={7} strokeLinecap="round" />
            </g>
          ) : null}
        </g>
        {/* bell collar */}
        <path d="M150 250 Q190 290 236 270" fill="none" stroke="#b3261e" strokeWidth={12} />
        <path d="M180 278 L172 312 Q186 322 200 312 L192 278 Z" fill="#ffd166" stroke="#b07a12" strokeWidth={3} />
      </g>
    </svg>
  );
};
