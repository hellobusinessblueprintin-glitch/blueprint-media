import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export type LightningFlashProps = {
  /** Total length of the effect in frames. */
  duration?: number;
  color?: string;
};

const BOLT = "M620 0 L470 560 L600 560 L380 1100 L560 1100 L300 1920 L740 960 L560 960 L760 420 L620 420 L760 0 Z";

/** A jagged bolt strike + white/gold screen flash for dramatic beat changes. */
export const LightningFlash: React.FC<LightningFlashProps> = ({ duration = 24, color = COLORS.gold }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const flash = interpolate(frame, [0, 2, 5, 7, duration], [0, 1, 0.35, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bolt = interpolate(frame, [0, 1, 8, 12], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jitter = frame % 2 === 0 ? 1 : -1;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, #ffffff 0%, ${color} 45%, rgba(255,140,26,0.4) 100%)`,
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />
      <svg
        width={width}
        height={height}
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          opacity: bolt,
          translate: `${jitter * 6}px 0px`,
          filter: `drop-shadow(0 0 30px ${color}) drop-shadow(0 0 60px #ffffff)`,
        }}
      >
        <path d={BOLT} fill="#fffbe6" stroke={color} strokeWidth={10} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
