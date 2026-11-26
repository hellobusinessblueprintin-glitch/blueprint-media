import React from 'react';
import { Easing, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { StageTheater } from './StageTheater';
import { PuppetRig } from './PuppetRig';
import { HinglishCaptions, WordTiming } from './HinglishCaptions';

const SAMPLE_CAPTIONS: WordTiming[] = [
  { word: 'Brahma', startSec: 0.3, endSec: 0.8 },
  { word: 'aur', startSec: 0.8, endSec: 1.0 },
  { word: 'Vishnu', startSec: 1.0, endSec: 1.5 },
  { word: 'mein', startSec: 1.5, endSec: 1.8 },
  { word: 'bahas', startSec: 1.8, endSec: 2.3 },
  { word: 'chid', startSec: 2.3, endSec: 2.6 },
  { word: 'gayi...', startSec: 2.6, endSec: 3.2 },
];

const GESTURE_PERIOD = 45;

// Eases between two poses every GESTURE_PERIOD frames instead of snapping.
const gesture = (frame: number, a: number, b: number) => {
  const cycle = Math.floor(frame / GESTURE_PERIOD);
  const local = frame % GESTURE_PERIOD;
  const t = interpolate(local, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const [from, to] = cycle % 2 === 0 ? [b, a] : [a, b];
  return cycle === 0 ? a : from + (to - from) * t;
};

const FirePillar: React.FC = () => {
  const frame = useCurrentFrame(); // local to the Sequence
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const flicker = 1 + Math.sin(frame / 3) * 0.06;

  return (
    <svg
      width="1080"
      height="1920"
      style={{ position: 'absolute', pointerEvents: 'none', opacity }}
    >
      <defs>
        <linearGradient id="firePillar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF5722" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={540 - 45 * flicker}
        y="0"
        width={90 * flicker}
        height="1920"
        fill="url(#firePillar)"
      />
    </svg>
  );
};

export const MythologyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <StageTheater>
      {/* Left Puppet */}
      <PuppetRig
        x={310}
        y={1460}
        headTilt={gesture(frame, 6, -3)}
        leftArmAngle={20}
        rightArmAngle={gesture(frame, -75, -30)}
        scale={1.05}
      />

      {/* Right Puppet */}
      <PuppetRig
        x={770}
        y={1460}
        headTilt={gesture(frame, -3, 6)}
        leftArmAngle={gesture(frame, 30, 75)}
        rightArmAngle={-20}
        scale={1.05}
        bodyColor="#2E6FD9"
        accentColor="#F2C14E"
      />

      {/* Central Glowing Pillar of Fire (Appears at frame 60) */}
      <Sequence from={60} layout="none">
        <FirePillar />
      </Sequence>

      <HinglishCaptions words={SAMPLE_CAPTIONS} />
    </StageTheater>
  );
};
