import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type ChainSpec = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Local frame at which this chain drops in. */
  at: number;
};

const Padlock: React.FC<{ glow: number }> = ({ glow }) => (
  <g style={{ filter: `drop-shadow(0 0 ${8 + glow * 24}px #ffd166)` }}>
    <path d="M-20 -14 L-20 -30 Q0 -52 20 -30 L20 -14" fill="none" stroke="#e0a526" strokeWidth={9} />
    <rect x={-30} y={-16} width={60} height={46} rx={10} fill="#ffd166" stroke="#b07a12" strokeWidth={4} />
    <circle cx={0} cy={4} r={6} fill="#5a3a06" />
    <rect x={-3} y={6} width={6} height={14} fill="#5a3a06" />
  </g>
);

/** Golden chains that drop from off-screen and lock onto anchor points. Coordinates are in px of the parent. */
export const Chains: React.FC<{ chains: ChainSpec[]; width: number; height: number }> = ({ chains, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {chains.map((c, ci) => {
        const p = spring({ frame: frame - c.at, fps, config: { damping: 11, stiffness: 120 } });
        if (frame < c.at) return null;
        const lock = spring({ frame: frame - c.at - 10, fps, config: { damping: 8, stiffness: 200 } });
        const flash = interpolate(frame - c.at - 10, [0, 4, 18], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const dx = c.to.x - c.from.x;
        const dy = c.to.y - c.from.y;
        const len = Math.hypot(dx, dy);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const n = Math.floor(len / 34);
        // Slide along its own axis from beyond the start point.
        const slide = interpolate(p, [0, 1], [-len, 0]);
        return (
          <g key={ci} transform={`translate(${c.from.x} ${c.from.y}) rotate(${ang})`}>
            <g transform={`translate(${slide} 0)`}>
              {new Array(n).fill(0).map((_, i) => (
                <ellipse
                  key={i}
                  cx={i * 34 + 17}
                  cy={0}
                  rx={22}
                  ry={i % 2 ? 6 : 12}
                  fill="none"
                  stroke={i % 2 ? "#e0a526" : "#ffd166"}
                  strokeWidth={8}
                />
              ))}
              <g transform={`translate(${len} 0) rotate(${-ang}) scale(${lock})`}>
                <Padlock glow={flash} />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
