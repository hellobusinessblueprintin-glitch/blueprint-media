import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ravana } from "../../components/ravana/Ravana";
import { Chains } from "../../components/ravana/Chains";
import { Nandi } from "../../components/ravana/Nandi";
import { AshokaTree, Battlefield, Himalaya, Kailash, PushpakViman } from "../../components/ravana/Scenery";
import { fireIntensity, GlowingLotus, SacredFire, Vedavati } from "../../components/ravana/Vedavati";
import { ShieldDome, WarningCard, WomanSilhouette } from "../../components/ravana/Shield";
import { FallenKing, LineageTree } from "../../components/ravana/Lineage";
import {
  BowArrowIcon,
  EgoCrownIcon,
  LineageIcon,
  LotusIcon,
  MonkeyIcon,
  ShieldIcon,
} from "../../components/ravana/RavanaIcons";
import { SplitCompareCard } from "../../components/SplitCompareCard";
import { COLORS, FONTS } from "../../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = 30; // frames per second — scene timings below are written as seconds * S

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

/** Big Hindi headline under the progress bar, e.g. "पहला श्राप" / "नंदी का श्राप". */
export const BeatTitle: React.FC<{ kicker?: string; title: string; hideAt?: number; size?: number }> = ({
  kicker,
  title,
  hideAt,
  size = 92,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 150 } });
  const out = hideAt === undefined ? 1 : interpolate(frame, [hideAt, hideAt + 8], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: Math.min(p, out),
        scale: String(interpolate(p, [0, 1], [0.6, 1])),
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: 800,
            fontSize: 40,
            color: COLORS.ink,
            background: COLORS.gold,
            padding: "4px 28px",
            borderRadius: 999,
            marginBottom: 6,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONTS.hindiDisplay,
          fontSize: size,
          lineHeight: 1.25,
          textAlign: "center",
          color: COLORS.gold,
          textShadow: "0 6px 0 #000, 0 0 34px rgba(255,209,102,0.65)",
        }}
      >
        {title}
      </div>
    </div>
  );
};

/** Quick gold-white bloom used on every beat change. */
export const BeatFlash: React.FC<{ at?: number; strength?: number }> = ({ at = 0, strength = 0.65 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 3, 14], [0, strength, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 45%, #ffffff 0%, #ffd166 55%, rgba(255,140,26,0.3) 100%)",
        opacity: o,
        pointerEvents: "none",
      }}
    />
  );
};

const Shake: React.FC<{ amount: number; children: React.ReactNode }> = ({ amount, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ translate: `${Math.sin(frame * 2.7) * amount}px ${Math.cos(frame * 3.1) * amount}px` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Beat 1 — Hook: silhouette + 4 golden chains                         */
/* ------------------------------------------------------------------ */
export const HookScene: React.FC<{ hookText: string }> = ({ hookText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const lastLock = 4.6 * S + 10;
  const struggle = interpolate(frame, [3.6 * S, lastLock, lastLock + 20], [0, 6, 1.5], clamp);
  // Loop seam: the video ends on a white flash, so it opens from white.
  const fromWhite = interpolate(frame, [0, 12], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <Shake amount={struggle}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 560,
            opacity: enter,
            scale: String(interpolate(enter, [0, 1], [1.12, 1])),
          }}
        >
          <Ravana silhouette={1} width={860} />
        </div>
        <Chains
          width={1080}
          height={1920}
          chains={[
            { from: { x: -260, y: 420 }, to: { x: 330, y: 1150 }, at: 3.6 * S },
            { from: { x: 1340, y: 420 }, to: { x: 750, y: 1150 }, at: 3.6 * S + 8 },
            { from: { x: -300, y: 1560 }, to: { x: 400, y: 1280 }, at: 4.1 * S },
            { from: { x: 1380, y: 1560 }, to: { x: 680, y: 1280 }, at: 4.1 * S + 8 },
          ]}
        />
      </Shake>
      <BeatTitle title={hookText} size={96} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: fromWhite }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Beat 2 — Nandi's curse                                              */
/* ------------------------------------------------------------------ */
export const NandiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mountain = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  // Viman glides in and is stopped dead at ~6s.
  const stopAt = 6 * S;
  const vx = interpolate(frame, [0, stopAt], [1150, 120], { ...clamp, easing: Easing.out(Easing.cubic) });
  const jolt = frame > stopAt ? Math.sin((frame - stopAt) * 0.9) * 10 * Math.exp(-(frame - stopAt) / 12) : 0;
  const bob = Math.sin((frame / fps) * Math.PI * 2 * 0.5) * 8;
  // Nandi steps forward from the right.
  const nandiIn = interpolate(frame, [5.6 * S, 7.4 * S], [1200, 600], { ...clamp, easing: Easing.out(Easing.quad) });
  const walking = frame > 5.6 * S && frame < 7.4 * S;
  const anger = interpolate(frame, [10 * S, 10.6 * S], [0, 1], clamp);
  const laugh = interpolate(frame, [7.5 * S, 7.9 * S, 9.6 * S, 10 * S], [0, 1, 1, 0], clamp);
  const bubble = spring({ frame: frame - 7.6 * S, fps, config: { damping: 9, stiffness: 180 } });
  const cardOn = frame >= 10 * S;
  const dim = interpolate(frame, [10 * S, 10.5 * S], [0, 0.55], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${dim * 14}px)` }}>
        <div style={{ position: "absolute", left: 0, top: interpolate(mountain, [0, 1], [1400, 900]) }}>
          <Kailash width={1080} glow={0.4 + anger * 0.6} />
        </div>
        <div style={{ position: "absolute", left: vx, top: 640 + bob, rotate: `${-jolt}deg` }}>
          <PushpakViman width={460} laugh={laugh} />
          {laugh > 0 ? (
            <div
              style={{
                position: "absolute",
                left: 250,
                top: -120,
                scale: String(bubble),
                fontFamily: FONTS.hindiDisplay,
                fontSize: 76,
                color: COLORS.ink,
                background: "#fff3e0",
                padding: "4px 30px",
                borderRadius: 40,
                border: "5px solid #000",
                whiteSpace: "nowrap",
                opacity: interpolate(laugh, [0, 0.2], [0, 1], clamp),
              }}
            >
              हा हा हा!
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", left: nandiIn, top: 960 }}>
          <Nandi width={430} anger={anger} walking={walking} />
        </div>
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: dim }} />
      </AbsoluteFill>

      <BeatTitle kicker="श्राप #1" title="नंदी का श्राप" hideAt={10 * S} />

      {cardOn ? (
        <SplitCompareCard
          title="घमंड का फल"
          badgeText="→"
          delay={10 * S + 2}
          top={360}
          panelHeight={600}
          titleFont={FONTS.hindiDisplay}
          labelFont={FONTS.hindiDisplay}
          captionFont={FONTS.body}
          left={{ label: "घमंड", caption: "वानरों का मज़ाक", icon: <EgoCrownIcon size={210} />, accent: COLORS.gold }}
          right={{ label: "वानर सेना", caption: "कुल का विनाश", icon: <MonkeyIcon size={210} />, accent: "#ff4d5e" }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Beat 3 — Vedavati's curse                                           */
/* ------------------------------------------------------------------ */
export const VedavatiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const fireStart = 8.5 * S;
  const morph = 13 * S; // = 00:35 on the master timeline (whoosh)
  const fire = fireIntensity(frame, fireStart, fireStart + 1.5 * S, morph + 15);
  const ravanaX = interpolate(
    frame,
    [6.3 * S, 8.4 * S, fireStart + 6, fireStart + 40],
    [-700, -210, -210, -760],
    { ...clamp, easing: Easing.inOut(Easing.quad) },
  );
  const vedavatiFade = interpolate(frame, [11 * S, morph], [1, 0], clamp);
  const lotus = spring({ frame: frame - morph, fps, config: { damping: 12, stiffness: 90 } });
  const label = spring({ frame: frame - morph - 20, fps, config: { damping: 10, stiffness: 160 } });
  const flash = interpolate(frame - morph, [-4, 0, 14], [0, 0.9, 0], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 1060, opacity: enter }}>
        <Himalaya width={1080} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 270,
          top: 660,
          opacity: Math.min(enter, vedavatiFade),
          translate: `0px ${interpolate(enter, [0, 1], [60, 0])}px`,
        }}
      >
        <Vedavati width={540} />
      </div>
      {frame >= 6 * S && frame < fireStart + 45 ? (
        <div style={{ position: "absolute", left: ravanaX, top: 640 }}>
          <Ravana width={620} silhouette={0.25} eyeGlow={1} />
        </div>
      ) : null}
      {fire > 0 ? (
        <div style={{ position: "absolute", left: 90, top: 760 }}>
          <SacredFire intensity={fire} width={900} />
        </div>
      ) : null}
      {frame >= morph ? (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1010,
            translate: "-50% -50%",
            scale: String(interpolate(lotus, [0, 1], [0.2, 1])),
            filter: "drop-shadow(0 0 40px #ffd166)",
          }}
        >
          <GlowingLotus bloom={lotus} width={520} />
        </div>
      ) : null}
      {frame >= morph + 20 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1250,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.hindiDisplay,
              fontSize: 84,
              color: COLORS.ink,
              background: "linear-gradient(180deg, #ffe08a, #f4a926)",
              padding: "4px 48px",
              borderRadius: 999,
              boxShadow: "0 0 40px rgba(255,209,102,0.9)",
              scale: String(label),
            }}
          >
            माता सीता
          </div>
        </div>
      ) : null}
      <BeatTitle kicker="श्राप #2" title="वेदवती का श्राप" />
      <AbsoluteFill style={{ backgroundColor: "#fff3d0", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Beat 4 — Nalakuvara's curse                                         */
/* ------------------------------------------------------------------ */
export const NalakuvaraScene: React.FC<{ warningText: string }> = ({ warningText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const shield = spring({ frame: frame - 5 * S, fps, config: { damping: 14, stiffness: 70 } });
  const warn = spring({ frame: frame - 8 * S, fps, config: { damping: 10, stiffness: 150 } });
  const warnOut = interpolate(frame, [11.6 * S, 12 * S], [1, 0], clamp);
  const hitAt = 12.6 * S;
  const ravanaX = interpolate(
    frame,
    [0, 4 * S, 12 * S, hitAt, hitAt + 14, 14.5 * S, 16 * S],
    [-760, -330, -330, -180, -480, -480, -560],
    { ...clamp, easing: Easing.inOut(Easing.quad) },
  );
  const hit = interpolate(frame - hitAt, [0, 3, 22], [0, 1, 0], clamp);
  const crack = interpolate(frame - hitAt, [0, 18], [0, 1], clamp);
  const vatika = spring({ frame: frame - 14.5 * S, fps, config: { damping: 200 }, durationInFrames: 30 });
  const vatikaLabel = spring({ frame: frame - 14.8 * S, fps, config: { damping: 10, stiffness: 160 } });

  return (
    <AbsoluteFill>
      {/* Ashoka Vatika backdrop for the last 3.5s */}
      <div style={{ position: "absolute", left: -60, top: 560, opacity: vatika * 0.9 }}>
        <AshokaTree width={460} />
      </div>
      <div style={{ position: "absolute", right: -80, top: 600, opacity: vatika * 0.9, scale: "-1 1" }}>
        <AshokaTree width={420} />
      </div>

      <Shake amount={hit * 10}>
        <div style={{ position: "absolute", left: ravanaX, top: 640 }}>
          <Ravana width={640} silhouette={0.85} eyeGlow={1} crack={crack} />
        </div>
      </Shake>

      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1000,
          translate: "-50% -50%",
          opacity: enter,
        }}
      >
        <WomanSilhouette width={230} />
      </div>
      {frame >= 5 * S ? (
        <div style={{ position: "absolute", left: 540, top: 1000, translate: "-50% -50%" }}>
          <ShieldDome form={shield} hit={hit} size={680} />
        </div>
      ) : null}

      {frame >= 8 * S && frame < 12 * S ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 520,
            display: "flex",
            justifyContent: "center",
            opacity: warnOut,
          }}
        >
          <WarningCard text={warningText} appear={warn} />
        </div>
      ) : null}

      {frame >= 14.8 * S ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: FONTS.hindiDisplay,
              fontSize: 64,
              color: "#fff3e0",
              background: "rgba(26,2,8,0.85)",
              border: "4px solid #ffd166",
              padding: "2px 40px",
              borderRadius: 999,
              scale: String(vatikaLabel),
            }}
          >
            अशोक वाटिका
          </div>
        </div>
      ) : null}

      <BeatTitle kicker="श्राप #3" title="नलकुबेर का श्राप" />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Beat 5 — King Anaranya's curse                                      */
/* ------------------------------------------------------------------ */
export const AnaranyaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const point = spring({ frame: frame - 4.6 * S, fps, config: { damping: 12, stiffness: 90 } });
  const treeStart = 7.2 * S;
  const heroAt = 11.2 * S;
  const kingDim = interpolate(frame, [treeStart, treeStart + 20], [1, 0.75], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 1080, opacity: enter }}>
        <Battlefield width={1080} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 1090,
          opacity: enter * kingDim,
          translate: `${interpolate(enter, [0, 1], [-200, 0])}px 0px`,
        }}
      >
        <FallenKing point={point} width={700} />
      </div>
      <LineageTree
        start={treeStart}
        stagger={26}
        heroAt={heroAt}
        bottomY={1040}
        topY={500}
        nodes={[
          { label: "अनरण्य", sub: "राजा" },
          { label: "रघु" },
          { label: "दशरथ" },
          { label: "श्री राम", sub: "इक्ष्वाकु वंश" },
        ]}
      />
      <BeatTitle kicker="श्राप #4" title="राजा अनरण्य का श्राप" size={84} hideAt={heroAt - 10} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Beat 6 — Payoff: 4 icons merge into Rama's bow                      */
/* ------------------------------------------------------------------ */
const PAYOFF_ICONS = [
  { label: "नंदी", icon: <MonkeyIcon size={170} />, x: 300, y: 700 },
  { label: "वेदवती", icon: <LotusIcon size={170} />, x: 780, y: 700 },
  { label: "नलकुबेर", icon: <ShieldIcon size={170} />, x: 300, y: 1060 },
  { label: "अनरण्य", icon: <LineageIcon size={170} />, x: 780, y: 1060 },
];

export const PayoffScene: React.FC<{ destinyText: string }> = ({ destinyText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mergeStart = 3 * S;
  const mergeEnd = 4.2 * S;
  const merge = interpolate(frame, [mergeStart, mergeEnd], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const bow = spring({ frame: frame - mergeEnd, fps, config: { damping: 10, stiffness: 120 } });
  const destiny = spring({ frame: frame - mergeEnd - 8, fps, config: { damping: 12, stiffness: 150 } });
  const sub = spring({ frame: frame - 7.3 * S, fps, config: { damping: 8, stiffness: 180 } });
  const flash = interpolate(frame - mergeEnd, [-2, 0, 14], [0, 1, 0], clamp);
  const toWhite = interpolate(frame, [9.4 * S, 10 * S - 1], [0, 1], clamp);
  const glow = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill>
      {merge < 1
        ? PAYOFF_ICONS.map((it, i) => {
            const pop = spring({ frame: frame - 6 - i * 7, fps, config: { damping: 10, stiffness: 170 } });
            const x = interpolate(merge, [0, 1], [it.x, 540]);
            const y = interpolate(merge, [0, 1], [it.y, 880]);
            return (
              <div
                key={it.label}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  translate: "-50% -50%",
                  scale: String(pop * interpolate(merge, [0, 1], [1, 0.2])),
                  rotate: `${merge * 180}deg`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: 20,
                  width: 280,
                  borderRadius: 40,
                  background: "rgba(10,15,44,0.8)",
                  border: "4px solid #ffd166",
                  boxShadow: "0 0 30px rgba(255,209,102,0.7)",
                }}
              >
                {it.icon}
                <div style={{ fontFamily: FONTS.hindiDisplay, fontSize: 50, color: COLORS.gold }}>{it.label}</div>
                <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: "absolute", top: -18, right: -18 }}>
                  <circle cx={12} cy={12} r={12} fill="#ffd166" />
                  <path d="M6 12.5l4 4L18 8" fill="none" stroke="#0a0f2c" strokeWidth={3} strokeLinecap="round" />
                </svg>
              </div>
            );
          })
        : null}

      {frame >= mergeEnd ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 840,
              translate: "-50% -50%",
              scale: String(bow),
              rotate: `${interpolate(bow, [0, 1], [-40, -8])}deg`,
              filter: `drop-shadow(0 0 ${30 + glow * 30}px #ffd166)`,
            }}
          >
            <BowArrowIcon size={440} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 1110,
              textAlign: "center",
              fontFamily: FONTS.hindiDisplay,
              fontSize: 100,
              lineHeight: 1.2,
              color: COLORS.gold,
              textShadow: "0 6px 0 #000, 0 0 40px rgba(255,209,102,0.8)",
              scale: String(interpolate(destiny, [0, 1], [1.8, 1])),
              opacity: destiny,
            }}
          >
            {destinyText}
          </div>
        </>
      ) : null}

      {/* Subscribe nudge */}
      {frame >= 7.3 * S ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "14px 44px",
              borderRadius: 999,
              background: "#e62117",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              scale: String(sub),
              fontFamily: FONTS.body,
              fontWeight: 800,
              fontSize: 54,
              color: "#fff",
            }}
          >
            <svg width={56} height={56} viewBox="0 0 24 24" style={{ rotate: `${Math.sin(frame * 0.8) * 18 * Math.exp(-(frame - 7.3 * S) / 30)}deg` }}>
              <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" fill="#fff" />
            </svg>
            सब्सक्राइब करें
          </div>
        </div>
      ) : null}

      <AbsoluteFill style={{ backgroundColor: "#fff3d0", opacity: flash, pointerEvents: "none" }} />
      {/* Loop seam → back to the hook */}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: toWhite, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
