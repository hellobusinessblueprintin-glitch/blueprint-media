import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";

export type SunburstBackgroundProps = {
  /** 0 = royal indigo, 1 = warm crimson/gold. Animate this to shift moods. */
  warmth?: number;
  /** Explicit gradient colors — overrides `warmth` when given. */
  colors?: { inner: string; mid: string; outer: string };
  /** Number of sunburst rays (16–20 recommended). */
  rayCount?: number;
  rayOpacity?: number;
  rayColor?: string;
  /** Degrees per second of continuous ray rotation. */
  rotationDegPerSecond?: number;
  /** Center of the sunburst in px. Defaults to slightly above frame center. */
  center?: { x: number; y: number };
  particleCount?: number;
  /** Change the seed to get a different (but still deterministic) dust layout. */
  seed?: string;
};

const mod = (v: number, m: number) => ((v % m) + m) % m;

export const SunburstBackground: React.FC<SunburstBackgroundProps> = ({
  warmth = 0,
  colors,
  rayCount = 18,
  rayOpacity = 0.18,
  rayColor = COLORS.gold,
  rotationDegPerSecond = 4,
  center,
  particleCount = 70,
  seed = "mytho-dust",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const cx = center?.x ?? width / 2;
  const cy = center?.y ?? height * 0.45;

  const w = Math.max(0, Math.min(1, warmth));
  const inner = colors?.inner ?? interpolateColors(w, [0, 1], [COLORS.indigoInner, COLORS.crimsonInner]);
  const mid = colors?.mid ?? interpolateColors(w, [0, 1], ["#141c4f", COLORS.crimsonMid]);
  const outer = colors?.outer ?? interpolateColors(w, [0, 1], [COLORS.indigoOuter, COLORS.crimsonOuter]);

  // Rays: wedges radiating from the center, rotating continuously.
  const R = Math.hypot(width, height);
  const rays = useMemo(() => {
    const step = (Math.PI * 2) / rayCount;
    const half = step * 0.22;
    return new Array(rayCount).fill(0).map((_, i) => {
      const a = i * step;
      const p1 = `${R * Math.cos(a - half)},${R * Math.sin(a - half)}`;
      const p2 = `${R * Math.cos(a + half)},${R * Math.sin(a + half)}`;
      return `0,0 ${p1} ${p2}`;
    });
  }, [rayCount, R]);

  // Deterministic dust: every value is derived from random(seed + index).
  const particles = useMemo(
    () =>
      new Array(particleCount).fill(0).map((_, i) => ({
        x: random(`${seed}-x-${i}`) * width,
        y: random(`${seed}-y-${i}`) * height,
        speed: 18 + random(`${seed}-s-${i}`) * 55,
        size: 2 + random(`${seed}-r-${i}`) * 6,
        swayAmp: 8 + random(`${seed}-a-${i}`) * 22,
        swayFreq: 0.3 + random(`${seed}-f-${i}`) * 0.7,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
        sparkle: random(`${seed}-k-${i}`) > 0.8,
      })),
    [particleCount, seed, width, height],
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${cx}px ${cy}px, ${inner} 0%, ${mid} 45%, ${outer} 100%)`,
        overflow: "hidden",
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ray-fade" cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={rayColor} stopOpacity={1} />
            <stop offset="0.55" stopColor={rayColor} stopOpacity={0.35} />
            <stop offset="1" stopColor={rayColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        <g
          transform={`translate(${cx} ${cy}) rotate(${t * rotationDegPerSecond})`}
          opacity={rayOpacity}
        >
          {rays.map((points, i) => (
            <polygon key={i} points={points} fill="url(#ray-fade)" />
          ))}
        </g>
        {/* Soft halo behind the subject */}
        <circle cx={cx} cy={cy} r={360} fill={rayColor} opacity={0.08 + 0.04 * w} />
      </svg>

      {particles.map((p, i) => {
        const y = mod(p.y - t * p.speed, height + 40) - 20;
        const x = p.x + Math.sin(t * p.swayFreq * Math.PI * 2 + p.phase) * p.swayAmp;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 3 + p.phase * 3);
        const opacity = 0.25 + 0.75 * twinkle;
        if (p.sparkle) {
          const s = p.size * 3.2 * (0.7 + 0.3 * twinkle);
          return (
            <svg
              key={i}
              width={s}
              height={s}
              viewBox="-10 -10 20 20"
              style={{
                position: "absolute",
                left: x - s / 2,
                top: y - s / 2,
                opacity,
                filter: `drop-shadow(0 0 6px ${rayColor})`,
              }}
            >
              <path d="M0,-10 L2,-2 L10,0 L2,2 L0,10 L-2,2 L-10,0 L-2,-2 Z" fill={rayColor} />
            </svg>
          );
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - p.size / 2,
              top: y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: rayColor,
              opacity,
              boxShadow: `0 0 ${p.size * 2}px ${rayColor}`,
            }}
          />
        );
      })}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
