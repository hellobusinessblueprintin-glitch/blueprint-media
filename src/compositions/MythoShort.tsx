import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SunburstBackground } from "../components/SunburstBackground";
import { ProgressTracker } from "../components/ProgressTracker";
import {
  ArmPose,
  CharacterProp,
  Expression,
  VectorCharacter,
} from "../components/VectorCharacter";
import { SplitCompareCard } from "../components/SplitCompareCard";
import { CaptionCue, KineticCaptions } from "../components/KineticCaptions";
import { LightningFlash } from "../components/LightningFlash";
import { RejectedIcon, ThroneIcon } from "../components/icons";
import { COLORS, FONTS } from "../theme";

/* ------------------------------------------------------------------ */
/* Timeline (30fps, 450 frames = 15s)                                  */
/* ------------------------------------------------------------------ */
const FPS = 30;
export const BEATS = [
  { name: "Beat 1 · Seated", from: 0 * FPS, duration: 4 * FPS },
  { name: "Beat 2 · Mocked", from: 4 * FPS, duration: 4 * FPS },
  { name: "Beat 3 · Rejected", from: 8 * FPS, duration: 4 * FPS },
  { name: "Beat 4 · Garland", from: 12 * FPS, duration: 3 * FPS },
] as const;
export const MYTHO_DURATION = 15 * FPS;

type CharacterState = {
  expression: Expression;
  armPose: ArmPose;
  prop: CharacterProp;
};

/** What the character is doing in each beat (index-aligned with BEATS). */
const CHARACTER_BEATS: CharacterState[] = [
  { expression: "calm", armPose: "idle", prop: "kamandalu" },
  { expression: "shocked", armPose: "raised", prop: "kamandalu" },
  { expression: "angry", armPose: "idle", prop: "kamandalu" },
  { expression: "proud", armPose: "blessing", prop: "garland" },
];

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
export type MythoShortProps = {
  steps: string[];
  beat1Captions: CaptionCue[];
  beat2Captions: CaptionCue[];
  beat3Captions: CaptionCue[];
  compareTitle: string;
  expectationLabel: string;
  expectationCaption: string;
  realityLabel: string;
  realityCaption: string;
  takeaway: string;
  /** Plays public/<voiceoverFile> if it exists. Auto-disabled when the file is missing. */
  voiceoverEnabled: boolean;
  voiceoverFile: string;
  voiceoverVolume: number;
};

/** Turns the voiceover off when public/<voiceoverFile> isn't there, so the template renders either way. */
export const calculateMythoMetadata: CalculateMetadataFunction<MythoShortProps> = async ({ props }) => {
  if (!props.voiceoverEnabled) return {};
  try {
    const res = await fetch(staticFile(props.voiceoverFile), { method: "HEAD" });
    const type = res.headers.get("content-type") ?? "";
    const found = res.ok && !type.includes("text/html");
    return found ? {} : { props: { ...props, voiceoverEnabled: false } };
  } catch {
    return { props: { ...props, voiceoverEnabled: false } };
  }
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MythoShort: React.FC<MythoShortProps> = ({
  steps,
  beat1Captions,
  beat2Captions,
  beat3Captions,
  compareTitle,
  expectationLabel,
  expectationCaption,
  realityLabel,
  realityCaption,
  takeaway,
  voiceoverEnabled,
  voiceoverFile,
  voiceoverVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [b1, b2, b3, b4] = BEATS;

  // Background mood: indigo → crimson/gold (beat 2) → cooler (beat 3) → radiant gold (beat 4).
  const warmth = interpolate(
    frame,
    [b2.from, b2.from + 30, b3.from, b3.from + 30, b4.from, b4.from + 8],
    [0, 1, 1, 0.55, 0.55, 1],
    clamp,
  );

  // Camera: push-in during beat 2, hold, then snap back on the lightning.
  const camera = interpolate(
    frame,
    [b2.from, b2.from + b2.duration, b4.from, b4.from + 20],
    [1, 1.08, 1.08, 1],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );

  // Background blur + dim while the comparison card is up.
  const blur = interpolate(frame, [b3.from, b3.from + 14, b4.from, b4.from + 6], [0, 10, 10, 0], clamp);
  const dim = interpolate(frame, [b3.from, b3.from + 14, b4.from, b4.from + 6], [0, 0.35, 0.35, 0], clamp);

  // Character entrance (beat 1).
  const enter = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 110 } });

  // Which beat are we in → character state + the state it blends from.
  let beatIndex = 0;
  BEATS.forEach((b, i) => {
    if (frame >= b.from) beatIndex = i;
  });
  const current = CHARACTER_BEATS[beatIndex];
  const previous = beatIndex > 0 ? CHARACTER_BEATS[beatIndex - 1] : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* ---------- Scene layer (camera + blur) ---------- */}
      <AbsoluteFill
        style={{
          scale: String(camera),
          transformOrigin: "50% 38%",
          filter: `blur(${blur}px)`,
        }}
      >
        <SunburstBackground warmth={warmth} center={{ x: 540, y: 700 }} />
        <AbsoluteFill style={{ alignItems: "center", top: 330 }}>
          <div
            style={{
              scale: String(enter),
              translate: `0px ${interpolate(enter, [0, 1], [220, 0])}px`,
              transformOrigin: "50% 100%",
            }}
          >
            <VectorCharacter
              expression={current.expression}
              armPose={current.armPose}
              prop={current.prop}
              fromExpression={previous?.expression}
              fromArmPose={previous?.armPose}
              transitionStartFrame={BEATS[beatIndex].from}
              width={720}
            />
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: dim }} />
      </AbsoluteFill>

      {/* ---------- Beat overlays ---------- */}
      <Sequence from={b1.from} durationInFrames={b1.duration} name={b1.name}>
        <KineticCaptions cues={beat1Captions} />
      </Sequence>

      <Sequence from={b2.from} durationInFrames={b2.duration} name={b2.name}>
        <KineticCaptions cues={beat2Captions} />
      </Sequence>

      <Sequence from={b3.from} durationInFrames={b3.duration} name={b3.name}>
        <SplitCompareCard
          title={compareTitle}
          delay={4}
          left={{
            label: expectationLabel,
            caption: expectationCaption,
            icon: <ThroneIcon size={220} />,
            accent: COLORS.gold,
          }}
          right={{
            label: realityLabel,
            caption: realityCaption,
            icon: <RejectedIcon size={220} />,
            accent: "#ff4d5e",
          }}
        />
        <KineticCaptions cues={beat3Captions} />
      </Sequence>

      <Sequence from={b4.from} durationInFrames={b4.duration} name={b4.name}>
        <Takeaway text={takeaway} />
        <LightningFlash duration={22} />
      </Sequence>

      {/* ---------- Persistent UI ---------- */}
      <ProgressTracker steps={steps} stageStartFrames={BEATS.map((b) => b.from)} />

      {voiceoverEnabled ? (
        <Audio src={staticFile(voiceoverFile)} volume={voiceoverVolume} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Final takeaway                                                      */
/* ------------------------------------------------------------------ */
const Takeaway: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const shimmer = interpolate(frame, [10, 70], [-30, 130], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 150,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 26,
        rowGap: 0,
      }}
    >
      {words.map((word, i) => {
        const p = spring({ frame: frame - 8 - i * 4, fps, config: { damping: 9, stiffness: 170 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.1,
              textTransform: "uppercase",
              backgroundImage: `linear-gradient(100deg, ${COLORS.goldDeep} ${shimmer - 30}%, #fffbe6 ${shimmer}%, ${COLORS.gold} ${shimmer + 30}%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 6px 0 #000) drop-shadow(0 0 28px rgba(255,209,102,0.7))",
              scale: String(interpolate(p, [0, 1], [2.2, 1])),
              opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
