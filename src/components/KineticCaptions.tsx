import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../theme";

export type CaptionCue = {
  text: string;
  /** Start / end in seconds (relative to the timeline this component sits in). */
  start: number;
  end: number;
  /** Words to color gold (case-insensitive, punctuation ignored). */
  highlight?: string[];
};

export type KineticCaptionsProps = {
  cues: CaptionCue[];
  position?: "center" | "lower";
  /** Frames between each word popping in. */
  wordStagger?: number;
  fontSize?: number;
  fontFamily?: string;
  /** Distance from the bottom edge when position = "lower". */
  bottom?: number;
};

// Strip punctuation (incl. Hindi danda/ellipsis) but keep letters of any script.
const clean = (w: string) => w.toLowerCase().replace(/[\s.,!?;:'"…—–\-।]/g, "");

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  cues,
  position = "lower",
  wordStagger = 3,
  fontSize = 66,
  fontFamily = FONTS.body,
  bottom = 360,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cue = cues.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;

  const startF = Math.round(cue.start * fps);
  const endF = Math.round(cue.end * fps);
  const local = frame - startF;
  const words = cue.text.split(/\s+/).filter(Boolean);
  const highlights = new Set((cue.highlight ?? []).map(clean));

  const pill = spring({ frame: local, fps, config: { damping: 200 }, durationInFrames: 10 });
  const out = interpolate(frame, [endF - 6, endF], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        ...(position === "lower" ? { bottom } : { top: "50%", translate: "0 -50%" }),
        display: "flex",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: fontSize * 0.3,
          rowGap: 4,
          padding: "22px 40px",
          borderRadius: 999,
          background: "rgba(5, 6, 20, 0.78)",
          border: "2px solid rgba(255,209,102,0.3)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          scale: String(interpolate(pill, [0, 1], [0.85, 1])),
          opacity: pill,
        }}
      >
        {words.map((word, i) => {
          const p = spring({
            frame: local - 2 - i * wordStagger,
            fps,
            config: { damping: 10, stiffness: 220 },
          });
          const isHi = highlights.has(clean(word));
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                // Some Devanagari conjuncts (e.g. श्र) overhang their advance width.
                padding: "0 6px",
                fontFamily,
                fontWeight: 800,
                fontSize,
                lineHeight: 1.3,
                textTransform: "uppercase",
                color: isHi ? COLORS.gold : "#ffffff",
                WebkitTextStroke: "3px #000",
                paintOrder: "stroke fill",
                textShadow: isHi
                  ? "0 5px 0 #000, 0 0 24px rgba(255,209,102,0.8)"
                  : "0 5px 0 #000",
                scale: String(interpolate(p, [0, 1], [0.3, 1])),
                translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
                opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
