import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../theme";

export type ProgressTrackerProps = {
  /** Story stage labels, e.g. ["Seated", "Mocked", "Rejected", "Garland"]. */
  steps: string[];
  /** Frame at which each step becomes active (same length as `steps`). */
  stageStartFrames: number[];
  top?: number;
  /** From this frame on, every step shows as completed (finale). */
  completeAtFrame?: number;
  /** Label font — use a Devanagari-capable font for Hindi labels. */
  labelFont?: string;
  labelSize?: number;
  /** Uppercase labels (Latin only). */
  uppercase?: boolean;
};

const Check: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      fill="none"
      stroke={COLORS.ink}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  stageStartFrames,
  top = 110,
  completeAtFrame,
  labelFont = FONTS.body,
  labelSize = 27,
  uppercase = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let activeIndex = -1;
  stageStartFrames.forEach((start, i) => {
    if (frame >= start) activeIndex = i;
  });
  const allDone = completeAtFrame !== undefined && frame >= completeAtFrame;
  if (allDone) activeIndex = steps.length;

  // Whole bar drops in at the start.
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        display: "flex",
        gap: 12,
        padding: 14,
        borderRadius: 48,
        background: "rgba(10, 15, 44, 0.68)",
        border: `2px solid rgba(255, 209, 102, 0.35)`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        opacity: enter,
        translate: `0px ${interpolate(enter, [0, 1], [-60, 0])}px`,
      }}
    >
      {steps.map((label, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        const start = stageStartFrames[i] ?? 0;
        const pop = isActive
          ? spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 160 } })
          : 0;
        const doneT = isDone
          ? spring({
              frame: frame - (stageStartFrames[i + 1] ?? completeAtFrame ?? 0) - (allDone ? i * 4 : 0),
              fps,
              config: { damping: 10, stiffness: 160 },
            })
          : 0;
        const finaleGlow = allDone ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2) : 0;
        const glow = isActive ? 0.6 + 0.4 * Math.sin((frame / fps) * Math.PI * 2) : 0;
        const scale = isActive ? interpolate(pop, [0, 1], [1, 1.1]) : 1;

        return (
          <div
            key={label + i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "14px 6px 12px",
              borderRadius: 34,
              scale: String(scale),
              zIndex: isActive ? 2 : 1,
              background: isActive
                ? "linear-gradient(180deg, rgba(255,209,102,0.28), rgba(255,209,102,0.08))"
                : "rgba(255,255,255,0.04)",
              border: isActive || allDone
                ? `3px solid ${COLORS.gold}`
                : `3px solid rgba(255,209,102,${isDone ? 0.35 : 0.1})`,
              boxShadow: isActive
                ? `0 0 ${18 + glow * 22}px rgba(255,209,102,${0.55 + glow * 0.35})`
                : allDone
                  ? `0 0 ${14 + finaleGlow * 18}px rgba(255,209,102,0.7)`
                  : "none",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.body,
                fontWeight: 800,
                fontSize: 24,
                color: isActive || isDone ? COLORS.ink : "rgba(255,248,231,0.55)",
                background: isDone || isActive ? COLORS.gold : "rgba(255,255,255,0.08)",
                border: isDone || isActive ? "none" : "2px solid rgba(255,248,231,0.25)",
              }}
            >
              {isDone ? (
                <div style={{ scale: String(interpolate(doneT, [0, 1], [0.4, 1])) }}>
                  <Check size={30} />
                </div>
              ) : (
                i + 1
              )}
            </div>
            <div
              style={{
                fontFamily: labelFont,
                fontWeight: 800,
                fontSize: labelSize,
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
                color: isActive || allDone ? COLORS.gold : COLORS.white,
                opacity: isActive || allDone ? 1 : isDone ? 0.85 : 0.45,
                textTransform: uppercase ? "uppercase" : "none",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
