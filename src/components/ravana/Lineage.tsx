import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../../theme";
import { BowArrowIcon } from "./RavanaIcons";

/** King Anaranya fallen on the battlefield, arm raised and pointing. viewBox 760x300. */
export const FallenKing: React.FC<{ point: number; width?: number; style?: React.CSSProperties }> = ({
  point,
  width = 700,
  style,
}) => {
  const armAngle = interpolate(point, [0, 1], [10, -125]);
  return (
    <svg viewBox="0 0 760 300" width={width} height={(width * 300) / 760} style={{ overflow: "visible", ...style }}>
      <ellipse cx={380} cy={280} rx={360} ry={24} fill="#000" opacity={0.35} />
      {/* legs */}
      <path d="M430 230 L700 250" stroke="#7a1f2e" strokeWidth={56} strokeLinecap="round" />
      <path d="M430 210 L690 196" stroke="#8f2636" strokeWidth={50} strokeLinecap="round" />
      {/* torso armour */}
      <path d="M160 170 Q300 140 450 180 L450 260 Q300 280 170 260 Z" fill="#c9b07a" />
      <path d="M220 170 Q300 158 380 172 L380 262 Q300 272 220 262 Z" fill="#ffd166" />
      <circle cx={300} cy={215} r={18} fill="#d7263d" />
      {/* head + crown */}
      <circle cx={110} cy={210} r={56} fill="#e0a070" />
      <path d="M56 180 L44 130 L72 150 L84 112 L104 146 L122 116 L130 156 L72 186 Z" fill="#ffd166" transform="rotate(-30 90 160)" />
      <path d="M76 196 Q86 206 96 198" fill="none" stroke="#2a1a10" strokeWidth={5} strokeLinecap="round" />
      <path d="M72 236 Q90 246 108 236" fill="none" stroke="#2a1a10" strokeWidth={8} strokeLinecap="round" />
      {/* raised pointing arm (pivot at shoulder) */}
      <g transform={`rotate(${armAngle} 200 190)`}>
        <path d="M200 190 L360 190" stroke="#c9b07a" strokeWidth={36} strokeLinecap="round" />
        <circle cx={372} cy={190} r={20} fill="#e0a070" />
        <path d="M384 186 L420 186" stroke="#e0a070" strokeWidth={10} strokeLinecap="round" />
        <rect x={310} y={174} width={16} height={32} rx={6} fill="#ffd166" />
      </g>
      {/* broken sword */}
      <path d="M520 120 L600 150" stroke="#9aa3b5" strokeWidth={10} strokeLinecap="round" />
      <path d="M500 112 L530 124" stroke="#ffd166" strokeWidth={14} strokeLinecap="round" />
    </svg>
  );
};

export type LineageNode = { label: string; sub?: string };

/** Glowing lineage chain drawn upward node by node; the last node is the hero (with bow). */
export const LineageTree: React.FC<{
  nodes: LineageNode[];
  /** Local frame to start drawing; each node follows `stagger` frames later. */
  start: number;
  stagger?: number;
  heroAt: number;
  /** Screen y of the first (bottom) and last (top / hero) node. */
  bottomY?: number;
  topY?: number;
}> = ({ nodes, start, stagger = 18, heroAt, bottomY = 1300, topY = 560 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = bottomY - topY;
  const step = H / (nodes.length - 1);
  // Gentle zig-zag trunk, from bottom (first node) to top (hero).
  const pts = nodes.map((_, i) => ({ x: 540 + (i % 2 ? 110 : -110) * (i === nodes.length - 1 ? 0 : 1), y: bottomY - i * step }));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {pts.slice(1).map((p, i) => {
          const a = pts[i];
          const len = Math.hypot(p.x - a.x, p.y - a.y);
          const prog = interpolate(frame, [start + i * stagger, start + (i + 1) * stagger], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={p.x}
              y2={p.y}
              stroke="#ffd166"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - prog)}
              style={{ filter: "drop-shadow(0 0 12px #ffd166)" }}
            />
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const isHero = i === nodes.length - 1;
        const at = isHero ? heroAt : start + i * stagger;
        const p = spring({ frame: frame - at, fps, config: { damping: isHero ? 9 : 12, stiffness: 160 } });
        const glow = isHero ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pts[i].x,
              top: pts[i].y,
              translate: "-50% -50%",
              scale: String(p),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: isHero ? "18px 44px 22px" : "12px 32px",
              borderRadius: 999,
              background: isHero ? "linear-gradient(180deg, #ffe08a, #f4a926)" : "rgba(10,15,44,0.85)",
              border: `4px solid #ffd166`,
              boxShadow: `0 0 ${20 + glow * 40}px rgba(255,209,102,${0.6 + glow * 0.4})`,
              whiteSpace: "nowrap",
            }}
          >
            {isHero ? <BowArrowIcon size={96} /> : null}
            <div
              style={{
                fontFamily: FONTS.hindiDisplay,
                fontSize: isHero ? 76 : 48,
                color: isHero ? "#2a0a06" : "#fff3e0",
                lineHeight: 1.1,
              }}
            >
              {n.label}
            </div>
            {n.sub ? (
              <div style={{ fontFamily: FONTS.body, fontWeight: 800, fontSize: isHero ? 38 : 28, color: isHero ? "#5a1a06" : "#ffd166" }}>
                {n.sub}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
