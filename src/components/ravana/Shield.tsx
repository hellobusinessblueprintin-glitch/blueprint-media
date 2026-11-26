import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../../theme";

/** Graceful standing female silhouette with a gold rim. viewBox 300x700. */
export const WomanSilhouette: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 260, style }) => (
  <svg viewBox="0 0 300 700" width={width} height={(width * 700) / 300} style={{ overflow: "visible", ...style }}>
    <g fill="#120814" stroke="#ffd166" strokeWidth={4} style={{ filter: "drop-shadow(0 0 12px rgba(255,209,102,0.7))" }}>
      <circle cx={150} cy={86} r={52} />
      <circle cx={196} cy={60} r={26} />
      <path d="M126 134 L174 134 L180 164 Q240 190 236 300 L220 420 Q260 560 250 690 L60 690 Q48 560 84 420 L64 300 Q60 190 120 164 Z" />
      {/* pallu drape */}
      <path d="M120 170 Q60 260 70 420 Q90 300 150 240 Z" fill="#2a1030" />
    </g>
  </svg>
);

/** Glowing golden hex-pattern dome. `form` 0..1 builds it; `hit` 0..1 makes it flare (on contact). */
export const ShieldDome: React.FC<{ form: number; hit?: number; size?: number; style?: React.CSSProperties }> = ({
  form,
  hit = 0,
  size = 640,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 0.9);
  const hexes: { x: number; y: number }[] = [];
  for (let r = -6; r <= 6; r++) {
    for (let c = -6; c <= 6; c++) {
      const x = c * 52 + (r % 2 ? 26 : 0);
      const y = r * 45;
      if (Math.hypot(x, y) < 290) hexes.push({ x, y });
    }
  }
  const hex = "M0 -26 L22.5 -13 L22.5 13 L0 26 L-22.5 13 L-22.5 -13 Z";
  return (
    <svg viewBox="-320 -320 640 640" width={size} height={size} style={{ overflow: "visible", ...style }}>
      <defs>
        <clipPath id="dome-clip">
          <circle r={300 * form} />
        </clipPath>
      </defs>
      <circle r={300} fill="#ffd166" opacity={(0.08 + 0.06 * pulse + hit * 0.25) * form} />
      <g clipPath="url(#dome-clip)" opacity={0.55 + hit * 0.45}>
        {hexes.map((h, i) => (
          <path key={i} d={hex} transform={`translate(${h.x} ${h.y})`} fill="none" stroke="#ffd166" strokeWidth={2.5} />
        ))}
      </g>
      <circle
        r={300 * form}
        fill="none"
        stroke="#ffe9a8"
        strokeWidth={8 + hit * 10}
        style={{ filter: `drop-shadow(0 0 ${16 + pulse * 14 + hit * 30}px #ffd166)` }}
      />
    </svg>
  );
};

/** Flashing warning card, e.g. "बिना इच्छा स्पर्श = भस्म". */
export const WarningCard: React.FC<{ text: string; appear: number }> = ({ text, appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Smooth pulse (a hard on/off blink strobes on video).
  const blink = 0.75 + 0.25 * Math.sin((frame / fps) * Math.PI * 2 * 1.6);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "26px 40px",
        borderRadius: 36,
        background: "rgba(20, 2, 6, 0.9)",
        border: "5px solid #ff3b4a",
        boxShadow: `0 0 ${30 + blink * 30}px rgba(255,59,74,${0.5 + blink * 0.4})`,
        scale: String(interpolate(appear, [0, 1], [0.3, 1])),
        opacity: appear,
      }}
    >
      <svg width={96} height={86} viewBox="0 0 100 90" style={{ flexShrink: 0, opacity: blink }}>
        <path d="M50 4 L96 86 L4 86 Z" fill="#ffd166" stroke="#ff3b4a" strokeWidth={6} strokeLinejoin="round" />
        <rect x={45} y={30} width={10} height={32} rx={4} fill="#1a0208" />
        <circle cx={50} cy={73} r={6} fill="#1a0208" />
      </svg>
      <div style={{ fontFamily: FONTS.hindiDisplay, fontSize: 66, color: "#fff3e0", lineHeight: 1.2 }}>{text}</div>
    </div>
  );
};
