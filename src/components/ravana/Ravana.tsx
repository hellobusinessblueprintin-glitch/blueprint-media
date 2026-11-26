import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type RavanaProps = {
  /** 0 = full colour, 1 = black silhouette with glowing gold rim + red eyes. */
  silhouette?: number;
  /** 0..1 — opens the mouths and shakes the heads in an arrogant laugh. */
  laugh?: number;
  /** 0..1 — red eye glow intensity. */
  eyeGlow?: number;
  /** 0..1 — draws crack lines across the heads (Nalakuvara's curse). */
  crack?: number;
  width?: number;
  style?: React.CSSProperties;
};

const C = {
  skin: "#557099",
  skinShade: "#3f5677",
  armor: "#2a1640",
  armorLight: "#45255f",
  dhoti: "#8f1d2c",
  gold: "#ffd166",
  goldDeep: "#e0a526",
  hair: "#0d0a14",
  eye: "#fff3e0",
  red: "#ff2a3c",
};

// 10 heads: main head (k = 0) plus 5 to the left and 4 to the right.
const HEAD_SLOTS = [-5, -4, -3, -2, -1, 4, 3, 2, 1, 0];

type HeadStyle = { fill: string; shade: string; gold: string; hair: string; eye: string; stroke?: string };

const Head: React.FC<{
  s: HeadStyle;
  laugh: number;
  eyeGlow: number;
  crack: number;
  main: boolean;
}> = ({ s, laugh, eyeGlow, crack, main }) => {
  const open = 4 + laugh * 26;
  const stroke = s.stroke ? { stroke: s.stroke, strokeWidth: 4 } : {};
  return (
    <g>
      {/* crown (mukut) */}
      <path
        d="M-40 -46 L-46 -96 L-26 -80 L-14 -118 L0 -88 L14 -118 L26 -80 L46 -96 L40 -46 Z"
        fill={s.gold}
        {...stroke}
        strokeLinejoin="round"
      />
      <circle cx={0} cy={-66} r={8} fill={s.stroke ? s.gold : C.red} />
      {/* ears + earrings */}
      <ellipse cx={-46} cy={4} rx={10} ry={16} fill={s.shade} {...stroke} />
      <ellipse cx={46} cy={4} rx={10} ry={16} fill={s.shade} {...stroke} />
      <circle cx={-47} cy={26} r={8} fill="none" stroke={s.gold} strokeWidth={5} />
      <circle cx={47} cy={26} r={8} fill="none" stroke={s.gold} strokeWidth={5} />
      {/* face */}
      <ellipse cx={0} cy={0} rx={44} ry={54} fill={s.fill} {...stroke} />
      <rect x={-44} y={-52} width={88} height={12} rx={6} fill={s.gold} />
      {/* angry brows */}
      <path d="M-34 -22 L-8 -12" stroke={s.hair} strokeWidth={8} strokeLinecap="round" />
      <path d="M34 -22 L8 -12" stroke={s.hair} strokeWidth={8} strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx={-18} cy={-4} rx={10} ry={6} fill={s.eye} />
      <ellipse cx={18} cy={-4} rx={10} ry={6} fill={s.eye} />
      <circle cx={-16} cy={-4} r={4} fill={C.red} opacity={0.4 + eyeGlow * 0.6} />
      <circle cx={16} cy={-4} r={4} fill={C.red} opacity={0.4 + eyeGlow * 0.6} />
      {eyeGlow > 0.05 ? (
        <g opacity={eyeGlow} style={{ filter: `drop-shadow(0 0 8px ${C.red})` }}>
          <circle cx={-16} cy={-4} r={5} fill={C.red} />
          <circle cx={16} cy={-4} r={5} fill={C.red} />
        </g>
      ) : null}
      {/* tilak */}
      <path d="M-10 -38 L10 -38" stroke={s.stroke ? s.gold : "#f5f0e6"} strokeWidth={4} strokeLinecap="round" />
      {/* mouth */}
      <path
        d={`M-16 26 Q0 ${26 + open * 0.3} 16 26 Q0 ${26 + open} -16 26 Z`}
        fill={s.stroke ? s.gold : "#3a0610"}
        opacity={s.stroke ? 0.6 * laugh : 1}
      />
      {laugh > 0.3 && !s.stroke ? <rect x={-11} y={27} width={22} height={5} rx={2} fill="#fff" opacity={laugh} /> : null}
      {/* curled mustache */}
      <path
        d="M0 18 Q-18 10 -32 20 Q-42 28 -36 12 M0 18 Q18 10 32 20 Q42 28 36 12"
        fill="none"
        stroke={s.hair}
        strokeWidth={7}
        strokeLinecap="round"
      />
      {/* cracks */}
      {crack > 0 ? (
        <path
          d="M-8 -50 L-2 -30 L-12 -12 L0 4 L-6 24 M20 -48 L14 -28 L24 -10"
          fill="none"
          stroke={main ? "#ffe9a8" : "#ffd166"}
          strokeWidth={3}
          strokeDasharray={200}
          strokeDashoffset={200 * (1 - crack)}
          style={{ filter: "drop-shadow(0 0 6px #ffd166)" }}
        />
      ) : null}
    </g>
  );
};

export const Ravana: React.FC<RavanaProps> = ({
  silhouette = 0,
  laugh = 0,
  eyeGlow = 0.5,
  crack = 0,
  width = 900,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const breath = Math.sin(t * Math.PI * 2 * 0.3);

  const colorStyle: HeadStyle = { fill: C.skin, shade: C.skinShade, gold: C.gold, hair: C.hair, eye: C.eye };
  const silStyle: HeadStyle = { fill: "#07060d", shade: "#07060d", gold: "#07060d", hair: "#07060d", eye: "#07060d", stroke: C.gold };

  const figure = (s: HeadStyle, isSil: boolean) => {
    const st = isSil ? { stroke: C.gold, strokeWidth: 5 } : {};
    return (
      <g>
        {/* body */}
        <g transform={`translate(400 900) scale(1 ${1 + breath * 0.012}) translate(-400 -900)`}>
          {/* arms */}
          <path d="M215 400 Q150 520 175 680" fill="none" stroke={isSil ? "#07060d" : C.armorLight} strokeWidth={70} strokeLinecap="round" />
          <path d="M585 400 Q650 520 625 680" fill="none" stroke={isSil ? "#07060d" : C.armorLight} strokeWidth={70} strokeLinecap="round" />
          {isSil ? (
            <>
              <path d="M215 400 Q150 520 175 680" fill="none" stroke={C.gold} strokeWidth={4} opacity={0.6} />
              <path d="M585 400 Q650 520 625 680" fill="none" stroke={C.gold} strokeWidth={4} opacity={0.6} />
            </>
          ) : (
            <>
              <circle cx={175} cy={690} r={34} fill={C.skin} />
              <circle cx={625} cy={690} r={34} fill={C.skin} />
              <rect x={140} y={630} width={70} height={16} rx={8} fill={C.gold} />
              <rect x={590} y={630} width={70} height={16} rx={8} fill={C.gold} />
              <rect x={150} y={470} width={64} height={16} rx={8} fill={C.gold} transform="rotate(-20 182 478)" />
              <rect x={586} y={470} width={64} height={16} rx={8} fill={C.gold} transform="rotate(20 618 478)" />
            </>
          )}
          {/* torso armour */}
          <path d="M210 390 Q400 340 590 390 L560 760 Q400 800 240 760 Z" fill={isSil ? "#07060d" : C.armor} {...st} />
          {!isSil ? (
            <>
              <path d="M300 420 Q400 400 500 420 L480 560 Q400 590 320 560 Z" fill={C.goldDeep} />
              <path d="M320 440 Q400 424 480 440 L466 540 Q400 562 334 540 Z" fill={C.gold} />
              <circle cx={400} cy={490} r={22} fill={C.red} stroke={C.goldDeep} strokeWidth={6} />
              {/* shoulder guards */}
              <ellipse cx={220} cy={400} rx={62} ry={40} fill={C.gold} />
              <ellipse cx={580} cy={400} rx={62} ry={40} fill={C.gold} />
              {/* belt + dhoti */}
              <rect x={240} y={700} width={320} height={34} rx={10} fill={C.gold} />
              <path d="M245 734 L555 734 L590 900 L210 900 Z" fill={C.dhoti} />
            </>
          ) : (
            <path d="M245 734 L555 734 L590 900 L210 900 Z" fill="#07060d" {...st} />
          )}
        </g>
        {/* heads */}
        {HEAD_SLOTS.map((k) => {
          const main = k === 0;
          const shake = laugh * Math.sin(t * 22 + k * 1.7) * 4;
          const x = 400 + k * 68;
          const y = 300 + Math.abs(k) * 12 - (main ? 20 : 0) + shake - breath * 3;
          const sc = main ? 1.15 : 0.82;
          const rot = k * 4 + laugh * Math.sin(t * 9 + k) * 6 - (main ? laugh * 8 : 0);
          return (
            <g key={k} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
              <Head s={s} laugh={laugh} eyeGlow={isSil ? 1 : eyeGlow} crack={crack} main={main} />
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 800 900" width={width} height={(width * 900) / 800} style={{ overflow: "visible", ...style }}>
      {silhouette < 1 ? <g opacity={1 - silhouette}>{figure(colorStyle, false)}</g> : null}
      {silhouette > 0 ? (
        <g opacity={silhouette} style={{ filter: "drop-shadow(0 0 14px rgba(255,209,102,0.8))" }}>
          {figure(silStyle, true)}
        </g>
      ) : null}
    </svg>
  );
};
