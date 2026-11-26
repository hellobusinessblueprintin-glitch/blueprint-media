import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

const CURTAIN_WIDTH = 560;
const CURTAIN_TRAVEL = 440;

const Curtain: React.FC<{ side: 'left' | 'right'; offsetX: number }> = ({ side, offsetX }) => {
  const id = `curtain-${side}`;
  // Vertical folds: alternating light/dark bands
  const folds = 7;
  const foldWidth = CURTAIN_WIDTH / folds;

  return (
    <svg
      width={CURTAIN_WIDTH}
      height={1920}
      style={{
        position: 'absolute',
        top: 0,
        [side]: 0,
        transform: `translateX(${offsetX}px)`,
      }}
    >
      <defs>
        <linearGradient id={`${id}-fold`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A0A12" />
          <stop offset="45%" stopColor="#9E1B2A" />
          <stop offset="70%" stopColor="#7A1220" />
          <stop offset="100%" stopColor="#3A060D" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
          <stop offset="30%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {Array.from({ length: folds }).map((_, i) => (
        <rect
          key={i}
          x={i * foldWidth}
          y={0}
          width={foldWidth + 1}
          height={1920}
          fill={`url(#${id}-fold)`}
        />
      ))}
      <rect width={CURTAIN_WIDTH} height={1920} fill={`url(#${id}-shade)`} />
      {/* Gold trim along the inner edge */}
      <rect
        x={side === 'left' ? CURTAIN_WIDTH - 10 : 0}
        y={0}
        width={10}
        height={1920}
        fill="#C9A23F"
      />
    </svg>
  );
};

export const StageTheater: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Curtains open over the first 25 frames, close over the last 25 frames
  const openProgress = interpolate(
    frame,
    [0, 25, durationInFrames - 25, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  const leftCurtainX = interpolate(openProgress, [0, 1], [0, -CURTAIN_TRAVEL]);
  const rightCurtainX = interpolate(openProgress, [0, 1], [0, CURTAIN_TRAVEL]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#090D1E', overflow: 'hidden' }}>
      {/* Radial Deep Indigo Backdrop + Top Spotlight */}
      <svg width="1080" height="1920" style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="stageBg" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1E254D" />
            <stop offset="100%" stopColor="#070A17" />
          </radialGradient>
          <linearGradient id="spotlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFD27D" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FFD27D" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#stageBg)" />
        {/* Spotlight Cone */}
        <polygon points="340,0 740,0 980,1920 100,1920" fill="url(#spotlight)" />
        {/* Stage floor */}
        <rect x="0" y="1480" width="1080" height="440" fill="#2A1A10" />
        <rect x="0" y="1480" width="1080" height="8" fill="#5C3A1E" />
      </svg>

      {/* Main Stage Content (Props, Puppets, Strings) */}
      <AbsoluteFill>{children}</AbsoluteFill>

      {/* Subtle Paper Grain Overlay */}
      <svg
        width="1080"
        height="1920"
        style={{ position: 'absolute', pointerEvents: 'none', mixBlendMode: 'overlay' }}
      >
        <defs>
          <filter id="paperGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed={frame % 4} />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0" />
          </filter>
        </defs>
        <rect width="1080" height="1920" filter="url(#paperGrain)" />
      </svg>

      {/* Curtains */}
      <Curtain side="left" offsetX={leftCurtainX} />
      <Curtain side="right" offsetX={rightCurtainX} />

      {/* Valance (top drape) */}
      <svg width="1080" height="160" style={{ position: 'absolute', top: 0 }}>
        <path
          d="M0,0 H1080 V110 Q945,170 810,110 Q675,170 540,110 Q405,170 270,110 Q135,170 0,110 Z"
          fill="#7A1220"
        />
        <path
          d="M0,110 Q135,170 270,110 Q405,170 540,110 Q675,170 810,110 Q945,170 1080,110"
          fill="none"
          stroke="#C9A23F"
          strokeWidth={6}
        />
      </svg>
    </AbsoluteFill>
  );
};
