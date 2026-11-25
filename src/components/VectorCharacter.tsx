import React, { useId } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Expression = "calm" | "proud" | "shocked" | "angry";
export type ArmPose = "idle" | "raised" | "blessing";
export type CharacterProp = "none" | "kamandalu" | "garland";

export type VectorCharacterProps = {
  expression?: Expression;
  armPose?: ArmPose;
  prop?: CharacterProp;
  /** Optional previous state — blended into the current one with a spring. */
  fromExpression?: Expression;
  fromArmPose?: ArmPose;
  /** Frame (in the parent timeline) at which the current expression/pose began. */
  transitionStartFrame?: number;
  /** Rendered width in px; height follows the 600x900 viewBox. */
  width?: number;
  style?: React.CSSProperties;
};

/* ----------------------------- palette ----------------------------- */
const C = {
  skin: "#e9a66f",
  skinShade: "#cf8650",
  robe: "#e8772e",
  robeShade: "#c4561d",
  sash: "#b3261e",
  hair: "#2b1d14",
  beard: "#ece6da",
  beardShade: "#cfc6b5",
  gold: "#ffd166",
  goldDeep: "#e0a526",
  lotus: "#f28cb1",
  lotusDeep: "#d9578a",
  mouth: "#5a1a1a",
  eyeWhite: "#fffaf0",
  pupil: "#1a1010",
  tilakRed: "#d7263d",
  ash: "#f5f0e6",
};

/* --------------------------- expressions --------------------------- */
type Face = {
  browY: number; // vertical offset
  browRot: number; // + = inner end down (angry)
  eyeRx: number;
  eyeRy: number;
  pupilR: number;
  lid: number; // 0 open → 1 closed
  mouthW: number;
  mouthCurve: number; // + smile, − frown
  mouthOpen: number;
  headTilt: number; // extra degrees
};

const FACES: Record<Expression, Face> = {
  calm: { browY: 0, browRot: 0, eyeRx: 17, eyeRy: 11, pupilR: 7, lid: 0.3, mouthW: 22, mouthCurve: 6, mouthOpen: 0, headTilt: 0 },
  proud: { browY: -5, browRot: -6, eyeRx: 17, eyeRy: 10, pupilR: 7, lid: 0.55, mouthW: 30, mouthCurve: 12, mouthOpen: 4, headTilt: -5 },
  shocked: { browY: -16, browRot: -4, eyeRx: 19, eyeRy: 16, pupilR: 5, lid: 0, mouthW: 13, mouthCurve: 0, mouthOpen: 28, headTilt: 0 },
  angry: { browY: 6, browRot: 20, eyeRx: 17, eyeRy: 10, pupilR: 7.5, lid: 0.4, mouthW: 24, mouthCurve: -10, mouthOpen: 3, headTilt: 3 },
};

/* ----------------------------- arm poses ---------------------------- */
// Angles in degrees for the screen-left arm; + rotates the arm outward.
type ArmAngles = { upper: number; fore: number };
const ARM_POSES: Record<ArmPose, { left: ArmAngles; right: ArmAngles }> = {
  idle: { left: { upper: 18, fore: -60 }, right: { upper: 18, fore: -60 } },
  raised: { left: { upper: 150, fore: 15 }, right: { upper: 150, fore: 15 } },
  blessing: { left: { upper: 18, fore: -60 }, right: { upper: 25, fore: 135 } },
};

const UPPER_LEN = 125;
const FORE_LEN = 128;
const SHOULDER_L = { x: 208, y: 455 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const blendFace = (a: Face, b: Face, t: number): Face => {
  const out = { ...b };
  (Object.keys(b) as (keyof Face)[]).forEach((k) => {
    out[k] = lerp(a[k], b[k], t);
  });
  return out;
};
const blendArm = (a: ArmAngles, b: ArmAngles, t: number): ArmAngles => ({
  upper: lerp(a.upper, b.upper, t),
  fore: lerp(a.fore, b.fore, t),
});

/** Forward kinematics: hand position relative to the shoulder. */
const handOffset = ({ upper, fore }: ArmAngles) => {
  const r1 = (upper * Math.PI) / 180;
  const r2 = ((upper + fore) * Math.PI) / 180;
  return {
    x: -UPPER_LEN * Math.sin(r1) - FORE_LEN * Math.sin(r2),
    y: UPPER_LEN * Math.cos(r1) + FORE_LEN * Math.cos(r2),
  };
};

/* ------------------------------ pieces ------------------------------ */
const Arm: React.FC<{ angles: ArmAngles; raisedPalm: boolean }> = ({ angles, raisedPalm }) => (
  <g transform={`rotate(${angles.upper})`}>
    {/* upper arm (sleeve) */}
    <line x1={0} y1={0} x2={0} y2={UPPER_LEN} stroke={C.robe} strokeWidth={60} strokeLinecap="round" />
    <line x1={-14} y1={10} x2={-14} y2={UPPER_LEN - 10} stroke={C.robeShade} strokeWidth={10} strokeLinecap="round" opacity={0.5} />
    {/* armband */}
    <rect x={-28} y={UPPER_LEN - 40} width={56} height={12} rx={6} fill={C.gold} />
    <g transform={`translate(0 ${UPPER_LEN}) rotate(${angles.fore})`}>
      <line x1={0} y1={0} x2={0} y2={FORE_LEN - 20} stroke={C.skin} strokeWidth={44} strokeLinecap="round" />
      {/* bracelet */}
      <rect x={-25} y={FORE_LEN - 52} width={50} height={11} rx={5} fill={C.gold} />
      <rect x={-25} y={FORE_LEN - 38} width={50} height={6} rx={3} fill={C.goldDeep} />
      {/* hand */}
      {raisedPalm ? (
        <g transform={`translate(0 ${FORE_LEN})`}>
          <rect x={-24} y={-14} width={48} height={52} rx={20} fill={C.skin} />
          {[-16, -5, 6, 17].map((fx) => (
            <rect key={fx} x={fx - 5} y={22} width={10} height={30} rx={5} fill={C.skin} />
          ))}
          <circle cx={0} cy={12} r={6} fill={C.tilakRed} opacity={0.8} />
        </g>
      ) : (
        <circle cx={0} cy={FORE_LEN} r={28} fill={C.skin} />
      )}
    </g>
  </g>
);

const Kamandalu: React.FC = () => (
  <g transform="translate(0 6)">
    <path d="M-38 -10 Q-48 40 0 52 Q48 40 38 -10 Z" fill="#8a4b22" />
    <path d="M-30 -6 Q-36 30 0 40" fill="none" stroke="#b06a35" strokeWidth={6} strokeLinecap="round" />
    <rect x={-20} y={-30} width={40} height={22} rx={8} fill="#6e3a19" />
    <path d="M20 -24 Q60 -46 50 -6" fill="none" stroke="#6e3a19" strokeWidth={8} strokeLinecap="round" />
    <rect x={-40} y={-14} width={80} height={8} rx={4} fill={C.gold} />
  </g>
);

const Garland: React.FC<{ drop: number }> = ({ drop }) => {
  const N = 19;
  const p0 = { x: 222, y: 448 };
  const p1 = { x: 300, y: 690 };
  const p2 = { x: 378, y: 448 };
  return (
    <g transform={`translate(0 ${interpolate(drop, [0, 1], [-420, 0])})`} opacity={interpolate(drop, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}>
      {new Array(N).fill(0).map((_, i) => {
        const t = i / (N - 1);
        const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
        const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
        const big = i % 2 === 0;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={big ? 17 : 14} fill={big ? "#ff8c1a" : "#ffc93c"} />
            <circle r={big ? 9 : 7} fill={big ? "#e0640b" : "#f4a926"} />
          </g>
        );
      })}
      {/* pendant flower */}
      <g transform="translate(300 600)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-18} rx={11} ry={20} fill="#d7263d" transform={`rotate(${a})`} />
        ))}
        <circle r={10} fill={C.gold} />
      </g>
    </g>
  );
};

/* ---------------------------- character ----------------------------- */
export const VectorCharacter: React.FC<VectorCharacterProps> = ({
  expression = "calm",
  armPose = "idle",
  prop = "kamandalu",
  fromExpression,
  fromArmPose,
  transitionStartFrame = 0,
  width = 720,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const t = frame / fps;

  // Spring-blend from the previous state into the current one.
  const local = frame - transitionStartFrame;
  const blend = spring({ frame: local, fps, config: { damping: 13, stiffness: 140 } });
  const face = fromExpression
    ? blendFace(FACES[fromExpression], FACES[expression], Math.min(1, blend))
    : FACES[expression];
  const fromArms = ARM_POSES[fromArmPose ?? armPose];
  const toArms = ARM_POSES[armPose];
  const leftArm = blendArm(fromArms.left, toArms.left, blend);
  const rightArm = blendArm(fromArms.right, toArms.right, blend);

  // Idle life: breathing, head sway, blinks, and a jolt on each change.
  const breath = Math.sin(t * Math.PI * 2 * 0.28);
  const breathLift = breath * 4;
  const changed = Boolean(fromExpression && fromExpression !== expression);
  const jolt = changed ? Math.sin(Math.min(1, local / 12) * Math.PI) * 5 : 0;
  const headTilt = Math.sin(t * Math.PI * 2 * 0.18) * 2.5 + face.headTilt - jolt;
  const blinkPhase = (frame + 40) % 105;
  const blink = face.lid < 0.05 && expression === "shocked" ? 0 : blinkPhase < 5 ? Math.sin((blinkPhase / 5) * Math.PI) : 0;
  const lid = Math.max(face.lid, blink);

  const lHand = handOffset(leftArm);
  const kamPos = { x: SHOULDER_L.x + lHand.x, y: SHOULDER_L.y + lHand.y - breathLift };
  const garlandDrop = prop === "garland" ? spring({ frame: local, fps, config: { damping: 11, stiffness: 90 } }) : 0;

  const eye = (cx: number, side: "l" | "r") => {
    const cy = 298;
    const id = `${uid}-eye-${side}`;
    return (
      <g>
        <clipPath id={id}>
          <ellipse cx={cx} cy={cy} rx={face.eyeRx} ry={face.eyeRy} />
        </clipPath>
        <ellipse cx={cx} cy={cy} rx={face.eyeRx} ry={face.eyeRy} fill={C.eyeWhite} />
        <g clipPath={`url(#${id})`}>
          <circle cx={cx + (side === "l" ? 2 : -2)} cy={cy + 1} r={face.pupilR} fill={C.pupil} />
          <circle cx={cx + (side === "l" ? 4 : 0)} cy={cy - 2} r={2} fill="#fff" />
          <rect x={cx - 30} y={cy - face.eyeRy - 1} width={60} height={(face.eyeRy * 2 + 2) * lid} fill={C.skin} />
        </g>
        <path
          d={`M${cx - face.eyeRx - 2} ${cy - face.eyeRy * (1 - 2 * lid) + 1} Q${cx} ${cy - face.eyeRy * (1 - 2 * lid) - 6} ${cx + face.eyeRx + 2} ${cy - face.eyeRy * (1 - 2 * lid) + 1}`}
          fill="none"
          stroke={C.hair}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
    );
  };

  const mouthY = 362;
  const mouthPath = `M${300 - face.mouthW} ${mouthY} Q300 ${mouthY + face.mouthCurve} ${300 + face.mouthW} ${mouthY} Q300 ${mouthY + face.mouthCurve + face.mouthOpen * 2} ${300 - face.mouthW} ${mouthY} Z`;

  return (
    <svg viewBox="0 0 600 900" width={width} height={(width * 900) / 600} style={{ overflow: "visible", ...style }}>
      {/* Lotus seat */}
      <g id="seat">
        {[-200, -130, -65, 0, 65, 130, 200].map((dx, i) => (
          <ellipse key={dx} cx={300 + dx} cy={835} rx={58} ry={34} fill={i % 2 ? C.lotus : C.lotusDeep} />
        ))}
        {[-160, -80, 0, 80, 160].map((dx) => (
          <path key={dx} d={`M${300 + dx - 45} 815 Q${300 + dx} 750 ${300 + dx + 45} 815 Z`} fill={C.lotus} stroke={C.lotusDeep} strokeWidth={3} />
        ))}
      </g>

      {/* Torso & crossed legs (breathes) */}
      <g id="torso" transform={`translate(300 790) scale(${1 - breath * 0.004} ${1 + breath * 0.014}) translate(-300 -790)`}>
        <ellipse cx={300} cy={775} rx={215} ry={62} fill={C.robeShade} />
        <path d="M120 770 Q300 700 480 770" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
        <path d="M200 450 Q300 415 400 450 L425 610 Q440 730 405 770 L195 770 Q160 730 175 610 Z" fill={C.robe} />
        {/* neckline */}
        <path d="M262 440 L300 520 L338 440 Z" fill={C.skinShade} />
        {/* sash / uttariya */}
        <path d="M205 452 Q260 470 330 600 Q360 680 410 740 L380 765 Q320 690 290 610 Q240 500 192 480 Z" fill={C.sash} />
        <path d="M205 452 Q260 470 330 600 Q360 680 410 740" fill="none" stroke={C.gold} strokeWidth={6} />
        {/* rudraksha necklace */}
        {new Array(13).fill(0).map((_, i) => {
          const a = Math.PI * (0.15 + (0.7 * i) / 12);
          return <circle key={i} cx={300 + Math.cos(a) * 62} cy={430 + Math.sin(a) * 82} r={8} fill={i === 6 ? C.gold : "#6b3a1f"} />;
        })}
      </g>

      {/* Neck */}
      <rect x={274} y={370 - breathLift} width={52} height={80} rx={20} fill={C.skinShade} />

      {/* Arms (shoulder pivots) */}
      <g transform={`translate(0 ${-breathLift})`}>
        <g id="leftArm" transform={`translate(${SHOULDER_L.x} ${SHOULDER_L.y})`}>
          <Arm angles={leftArm} raisedPalm={false} />
        </g>
        <g id="rightArm" transform="translate(600 0) scale(-1 1)">
          <g transform={`translate(${SHOULDER_L.x} ${SHOULDER_L.y})`}>
            <Arm angles={rightArm} raisedPalm={armPose === "blessing" && blend > 0.5} />
          </g>
        </g>
      </g>

      {/* Head (tilts around the neck) */}
      <g id="head" transform={`translate(0 ${-breathLift}) rotate(${headTilt} 300 400)`}>
        {/* topknot + crown band */}
        <ellipse cx={300} cy={172} rx={54} ry={48} fill={C.hair} />
        <path d="M262 160 Q300 120 338 160" fill="none" stroke="#3d2a1d" strokeWidth={6} />
        <path d="M244 205 L356 205 L346 182 L322 196 L300 168 L278 196 L254 182 Z" fill={C.gold} stroke={C.goldDeep} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={300} cy={190} r={8} fill={C.tilakRed} />
        {/* ears + earrings */}
        <ellipse cx={210} cy={305} rx={16} ry={26} fill={C.skinShade} />
        <ellipse cx={390} cy={305} rx={16} ry={26} fill={C.skinShade} />
        <circle cx={208} cy={344} r={12} fill="none" stroke={C.gold} strokeWidth={6} />
        <circle cx={392} cy={344} r={12} fill="none" stroke={C.gold} strokeWidth={6} />
        {/* face */}
        <ellipse cx={300} cy={300} rx={90} ry={102} fill={C.skin} />
        {/* hair cap */}
        <path d="M210 290 Q205 200 300 196 Q395 200 390 290 Q370 236 300 232 Q230 236 210 290 Z" fill={C.hair} />
        {/* tilak */}
        <path d="M284 230 L292 268 Q300 276 308 268 L316 230" fill="none" stroke={C.ash} strokeWidth={5} strokeLinecap="round" />
        <path d="M300 236 L300 268" stroke={C.tilakRed} strokeWidth={6} strokeLinecap="round" />
        {/* beard */}
        <path d="M216 318 Q222 440 300 462 Q378 440 384 318 Q360 392 300 394 Q240 392 216 318 Z" fill={C.beard} />
        <path d="M250 420 Q300 448 350 420" fill="none" stroke={C.beardShade} strokeWidth={4} strokeLinecap="round" />
        {/* nose */}
        <path d="M300 300 Q292 330 300 338 Q308 340 312 334" fill="none" stroke={C.skinShade} strokeWidth={5} strokeLinecap="round" />

        <g id="eyes">
          {eye(265, "l")}
          {eye(335, "r")}
        </g>

        <g id="brows">
          <path
            d="M-24 4 Q0 -8 24 2"
            transform={`translate(265 ${266 + face.browY}) rotate(${face.browRot})`}
            fill="none"
            stroke={C.beard}
            strokeWidth={9}
            strokeLinecap="round"
          />
          <path
            d="M-24 2 Q0 -8 24 4"
            transform={`translate(335 ${266 + face.browY}) rotate(${-face.browRot})`}
            fill="none"
            stroke={C.beard}
            strokeWidth={9}
            strokeLinecap="round"
          />
        </g>

        <g id="mouth">
          <path d="M262 350 Q280 340 300 348 Q320 340 338 350" fill="none" stroke={C.beard} strokeWidth={8} strokeLinecap="round" />
          <path d={mouthPath} fill={C.mouth} stroke={C.mouth} strokeWidth={5} strokeLinejoin="round" />
        </g>
      </g>

      {/* Prop — drawn after the head so a garland drapes over the beard */}
      <g id="prop">
        {prop === "kamandalu" ? (
          <g transform={`translate(${kamPos.x} ${kamPos.y})`}>
            <Kamandalu />
          </g>
        ) : null}
        {prop === "garland" ? (
          <g transform={`translate(0 ${-breathLift})`}>
            <Garland drop={garlandDrop} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
