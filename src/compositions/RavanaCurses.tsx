import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SunburstBackground } from "../components/SunburstBackground";
import { ProgressTracker } from "../components/ProgressTracker";
import { KineticCaptions } from "../components/KineticCaptions";
import { FONTS } from "../theme";
import {
  RAVANA_BEATS,
  RAVANA_CAPTIONS,
  RAVANA_FPS,
  RAVANA_SFX,
  RAVANA_STEPS,
} from "../data/ravanaScript";
import {
  AnaranyaScene,
  BeatFlash,
  HookScene,
  NalakuvaraScene,
  NandiScene,
  PayoffScene,
  VedavatiScene,
} from "./ravana/Scenes";

export type RavanaCursesProps = {
  hookText: string;
  warningText: string;
  destinyText: string;
  showCaptions: boolean;
  sfxEnabled: boolean;
  sfxVolume: number;
  /** Plays public/<voiceoverFile> if present; auto-disabled when missing. */
  voiceoverEnabled: boolean;
  voiceoverFile: string;
  voiceoverVolume: number;
};

export const calculateRavanaMetadata: CalculateMetadataFunction<RavanaCursesProps> = async ({ props }) => {
  if (!props.voiceoverEnabled) return {};
  try {
    const res = await fetch(staticFile(props.voiceoverFile), { method: "HEAD" });
    const type = res.headers.get("content-type") ?? "";
    return res.ok && !type.includes("text/html") ? {} : { props: { ...props, voiceoverEnabled: false } };
  } catch {
    return { props: { ...props, voiceoverEnabled: false } };
  }
};

const f = (s: number) => Math.round(s * RAVANA_FPS);

/** Background mood for each beat: indigo hook → icy Kailash → fire amber → crimson → dusk → radiant gold. */
const PALETTES = [
  { inner: "#1b266b", mid: "#141c4f", outer: "#0a0f2c" },
  { inner: "#2f4a9e", mid: "#16205a", outer: "#070b24" },
  { inner: "#f0a03a", mid: "#a8401c", outer: "#2b0a06" },
  { inner: "#a3162b", mid: "#5a0a1a", outer: "#1a0208" },
  { inner: "#d9772b", mid: "#6b2a3a", outer: "#1a0d24" },
  { inner: "#ffcf6b", mid: "#b8661c", outer: "#2a0e06" },
];

export const RavanaCurses: React.FC<RavanaCursesProps> = ({
  hookText,
  warningText,
  destinyText,
  showCaptions,
  sfxEnabled,
  sfxVolume,
  voiceoverEnabled,
  voiceoverFile,
  voiceoverVolume,
}) => {
  const frame = useCurrentFrame();

  // Cross-fade palettes over 20 frames at each beat boundary.
  const input: number[] = [0];
  const pick = (k: "inner" | "mid" | "outer") => {
    const out: string[] = [PALETTES[0][k]];
    RAVANA_BEATS.slice(1).forEach((b, i) => {
      out.push(PALETTES[i][k], PALETTES[i + 1][k]);
    });
    return out;
  };
  RAVANA_BEATS.slice(1).forEach((b) => input.push(f(b.start), f(b.start) + 20));
  const colors = {
    inner: interpolateColors(frame, input, pick("inner")),
    mid: interpolateColors(frame, input, pick("mid")),
    outer: interpolateColors(frame, input, pick("outer")),
  };

  const [hook, nandi, vedavati, nalakuvara, anaranya, payoff] = RAVANA_BEATS;
  const seq = (b: (typeof RAVANA_BEATS)[number]) => ({
    from: f(b.start),
    durationInFrames: f(b.end - b.start),
    name: b.name,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0f2c" }}>
      <SunburstBackground colors={colors} center={{ x: 540, y: 900 }} rayCount={18} />

      <Sequence {...seq(hook)}>
        <HookScene hookText={hookText} />
      </Sequence>
      <Sequence {...seq(nandi)}>
        <NandiScene />
        <BeatFlash />
      </Sequence>
      <Sequence {...seq(vedavati)}>
        <VedavatiScene />
        <BeatFlash />
      </Sequence>
      <Sequence {...seq(nalakuvara)}>
        <NalakuvaraScene warningText={warningText} />
        <BeatFlash />
      </Sequence>
      <Sequence {...seq(anaranya)}>
        <AnaranyaScene />
        <BeatFlash />
      </Sequence>
      <Sequence {...seq(payoff)}>
        <PayoffScene destinyText={destinyText} />
        <BeatFlash />
      </Sequence>

      <ProgressTracker
        steps={RAVANA_STEPS}
        stageStartFrames={[nandi, vedavati, nalakuvara, anaranya].map((b) => f(b.start))}
        completeAtFrame={f(payoff.start)}
        labelFont={FONTS.body}
        labelSize={29}
        uppercase={false}
      />

      {showCaptions ? (
        <KineticCaptions cues={RAVANA_CAPTIONS} fontSize={56} wordStagger={2} bottom={290} fontFamily={FONTS.body} />
      ) : null}

      {sfxEnabled
        ? RAVANA_SFX.booms.map((s) => (
            <Sequence key={`boom-${s}`} from={f(s)} durationInFrames={f(1.6)} name={`SFX boom @${s}s`} layout="none">
              <Audio src={staticFile("sfx/boom.wav")} volume={sfxVolume} />
            </Sequence>
          ))
        : null}
      {sfxEnabled
        ? RAVANA_SFX.whooshes.map((s) => (
            <Sequence key={`whoosh-${s}`} from={f(s) - 12} durationInFrames={f(1.4)} name={`SFX whoosh @${s}s`} layout="none">
              <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
            </Sequence>
          ))
        : null}

      {voiceoverEnabled ? <Audio src={staticFile(voiceoverFile)} volume={voiceoverVolume} /> : null}
    </AbsoluteFill>
  );
};
