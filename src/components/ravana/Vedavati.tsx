import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** Meditating Vedavati (eyes closed, dhyana mudra). viewBox 600x800. */
export const Vedavati: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 560, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = Math.sin((frame / fps) * Math.PI * 2 * 0.25);
  return (
    <svg viewBox="0 0 600 800" width={width} height={(width * 800) / 600} style={{ overflow: "visible", ...style }}>
      {/* aura */}
      <circle cx={300} cy={280} r={170} fill="#ffd166" opacity={0.14 + breath * 0.04} />
      {/* long hair behind */}
      <path d="M205 230 Q190 480 230 560 L370 560 Q410 480 395 230 Z" fill="#1a1010" />
      {/* seated body / saree */}
      <g transform={`translate(300 740) scale(1 ${1 + breath * 0.012}) translate(-300 -740)`}>
        <ellipse cx={300} cy={700} rx={210} ry={62} fill="#d9c9a8" />
        <path d="M220 380 Q300 350 380 380 L410 560 Q420 660 390 700 L210 700 Q180 660 190 560 Z" fill="#fff4dc" />
        <path d="M220 384 Q300 470 360 690 L320 700 Q270 520 200 430 Z" fill="#f4a926" />
        <path d="M220 384 Q300 470 360 690" fill="none" stroke="#b3261e" strokeWidth={8} />
        {/* arms into dhyana mudra in lap */}
        <path d="M220 400 Q170 520 250 610" fill="none" stroke="#e9a66f" strokeWidth={38} strokeLinecap="round" />
        <path d="M380 400 Q430 520 350 610" fill="none" stroke="#e9a66f" strokeWidth={38} strokeLinecap="round" />
        <ellipse cx={300} cy={615} rx={62} ry={22} fill="#e9a66f" />
        <rect x={228} y={574} width={44} height={10} rx={5} fill="#ffd166" transform="rotate(40 250 579)" />
        <rect x={328} y={574} width={44} height={10} rx={5} fill="#ffd166" transform="rotate(-40 350 579)" />
        {/* rudraksha mala */}
        {new Array(11).fill(0).map((_, i) => {
          const a = Math.PI * (0.18 + (0.64 * i) / 10);
          return <circle key={i} cx={300 + Math.cos(a) * 48} cy={372 + Math.sin(a) * 64} r={7} fill="#6b3a1f" />;
        })}
      </g>
      {/* neck + head */}
      <rect x={278} y={310} width={44} height={70} rx={16} fill="#d48a55" />
      <g transform={`translate(0 ${-breath * 3})`}>
        <ellipse cx={300} cy={250} rx={76} ry={88} fill="#e9a66f" />
        {/* hair parting + bun */}
        <path d="M224 250 Q220 160 300 158 Q380 160 376 250 Q360 196 300 192 Q240 196 224 250 Z" fill="#1a1010" />
        <circle cx={300} cy={150} r={40} fill="#1a1010" />
        <path d="M270 140 Q300 120 330 140" fill="none" stroke="#ffd166" strokeWidth={5} />
        {/* bindi */}
        <circle cx={300} cy={214} r={7} fill="#d7263d" />
        {/* closed eyes */}
        <path d="M252 252 Q268 262 284 252" fill="none" stroke="#2a1a10" strokeWidth={5} strokeLinecap="round" />
        <path d="M316 252 Q332 262 348 252" fill="none" stroke="#2a1a10" strokeWidth={5} strokeLinecap="round" />
        <path d="M296 260 Q290 282 300 288" fill="none" stroke="#c97a48" strokeWidth={4} strokeLinecap="round" />
        <path d="M284 308 Q300 316 316 308" fill="none" stroke="#a3332a" strokeWidth={5} strokeLinecap="round" />
        <circle cx={226} cy={290} r={9} fill="none" stroke="#ffd166" strokeWidth={4} />
        <circle cx={374} cy={290} r={9} fill="none" stroke="#ffd166" strokeWidth={4} />
      </g>
    </svg>
  );
};

/** Ring of flickering flames. `intensity` 0..1 grows them from the ground. viewBox 800x700. */
export const SacredFire: React.FC<{ intensity: number; width?: number; style?: React.CSSProperties }> = ({
  intensity,
  width = 800,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const N = 11;
  return (
    <svg viewBox="0 0 800 700" width={width} height={(width * 700) / 800} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id="fire-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff3d00" />
          <stop offset="0.5" stopColor="#ff8c1a" />
          <stop offset="1" stopColor="#ffe066" />
        </linearGradient>
      </defs>
      {new Array(N).fill(0).map((_, i) => {
        const x = 40 + (i * 720) / (N - 1);
        const center = 1 - Math.abs(i - (N - 1) / 2) / ((N - 1) / 2);
        const h = (220 + center * 380) * intensity * (0.85 + 0.15 * Math.sin(t * 9 + i * 1.3));
        const w = 70 + center * 40;
        const sway = Math.sin(t * 6 + i) * 18 * intensity;
        return (
          <g key={i} opacity={Math.min(1, intensity * 2)}>
            <path
              d={`M${x - w / 2} 700 Q${x - w / 2} ${700 - h * 0.5} ${x + sway} ${700 - h} Q${x + w / 2} ${700 - h * 0.5} ${x + w / 2} 700 Z`}
              fill="url(#fire-g)"
            />
            <path
              d={`M${x - w / 4} 700 Q${x - w / 4} ${700 - h * 0.3} ${x + sway * 0.6} ${700 - h * 0.6} Q${x + w / 4} ${700 - h * 0.3} ${x + w / 4} 700 Z`}
              fill="#fff3b0"
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>
  );
};

/** Glowing lotus (symbol of Sita). `bloom` 0..1 opens the petals. viewBox 400x320. */
export const GlowingLotus: React.FC<{ bloom: number; width?: number; style?: React.CSSProperties }> = ({
  bloom,
  width = 420,
  style,
}) => {
  const petals = [-70, -42, -14, 14, 42, 70];
  return (
    <svg viewBox="0 0 400 320" width={width} height={(width * 320) / 400} style={{ overflow: "visible", ...style }}>
      <circle cx={200} cy={190} r={170} fill="#ffd166" opacity={0.2 * bloom} />
      {petals.map((a, i) => (
        <ellipse
          key={a}
          cx={200}
          cy={150}
          rx={34}
          ry={92}
          fill={i % 2 ? "#ff9ec4" : "#f26fa3"}
          stroke="#ffd166"
          strokeWidth={4}
          transform={`rotate(${a * bloom} 200 250)`}
        />
      ))}
      <ellipse cx={200} cy={150} rx={36} ry={96} fill="#ffc2da" stroke="#ffd166" strokeWidth={4} />
      <path d="M90 250 Q200 300 310 250 Q200 280 90 250 Z" fill="#2a7a3d" />
      <circle cx={200} cy={232} r={16} fill="#ffd166" />
    </svg>
  );
};

export const fireIntensity = (frame: number, start: number, peak: number, end: number) =>
  interpolate(frame, [start, peak, end - 10, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
