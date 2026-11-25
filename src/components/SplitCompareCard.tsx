import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../theme";

export type CompareSide = {
  label: string;
  caption: string;
  icon: React.ReactNode;
  /** Glow/border color of the panel. */
  accent: string;
};

export type SplitCompareCardProps = {
  title?: string;
  left: CompareSide;
  right: CompareSide;
  /** Local frame (inside the parent <Sequence>) where the card starts animating. */
  delay?: number;
  top?: number;
};

const Panel: React.FC<{
  side: CompareSide;
  progress: number;
  from: "left" | "right";
  pulse: number;
}> = ({ side, progress, from, pulse }) => {
  const dx = interpolate(progress, [0, 1], [from === "left" ? -700 : 700, 0]);
  const rot = interpolate(progress, [0, 1], [from === "left" ? -8 : 8, 0]);
  return (
    <div
      style={{
        flex: 1,
        height: 640,
        borderRadius: 40,
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, rgba(20,24,64,0.92), rgba(8,10,32,0.95))",
        border: `4px solid ${side.accent}`,
        boxShadow: `0 0 ${24 + pulse * 26}px ${side.accent}, inset 0 0 40px rgba(0,0,0,0.5)`,
        translate: `${dx}px 0px`,
        rotate: `${rot}deg`,
        opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 50,
          color: side.accent,
          textTransform: "uppercase",
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        {side.label}
      </div>
      <div style={{ scale: String(interpolate(progress, [0.4, 1], [0.6, 1], { extrapolateLeft: "clamp" })) }}>
        {side.icon}
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.15,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        {side.caption}
      </div>
    </div>
  );
};

export const SplitCompareCard: React.FC<SplitCompareCardProps> = ({
  title = "Expectation vs. Reality",
  left,
  right,
  delay = 0,
  top = 470,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const leftIn = spring({ frame: f, fps, config: { damping: 14, stiffness: 120 } });
  const rightIn = spring({ frame: f - 6, fps, config: { damping: 14, stiffness: 120 } });
  const vs = spring({ frame: f - 14, fps, config: { damping: 8, stiffness: 180 } });
  const titleIn = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 18 });
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 0.8);

  return (
    <div style={{ position: "absolute", top, left: 80, right: 80 }}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 64,
          color: COLORS.gold,
          textAlign: "center",
          marginBottom: 36,
          textShadow: "0 4px 0 #000, 0 0 30px rgba(255,209,102,0.6)",
          opacity: titleIn,
          translate: `0px ${interpolate(titleIn, [0, 1], [30, 0])}px`,
        }}
      >
        {title}
      </div>
      <div style={{ position: "relative", display: "flex", gap: 40 }}>
        <Panel side={left} progress={leftIn} from="left" pulse={pulse} />
        <Panel side={right} progress={rightIn} from="right" pulse={1 - pulse} />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 120,
            height: 120,
            marginLeft: -60,
            marginTop: -60,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle, ${COLORS.gold}, ${COLORS.goldDeep})`,
            border: "6px solid #0a0f2c",
            boxShadow: `0 0 ${30 + pulse * 30}px ${COLORS.gold}`,
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 46,
            color: COLORS.ink,
            scale: String(vs),
            rotate: `${interpolate(vs, [0, 1], [-90, 0])}deg`,
          }}
        >
          VS
        </div>
      </div>
    </div>
  );
};
