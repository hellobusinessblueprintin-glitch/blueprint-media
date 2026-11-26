import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordTiming {
  word: string;
  startSec: number;
  endSec: number;
}

const CHUNK_SIZE = 4;

export const HinglishCaptions: React.FC<{ words: WordTiming[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Latest word that has started. Using this (instead of an exact match) keeps
  // the caption on screen through small gaps between words.
  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].startSec <= currentTime) activeIndex = i;
    else break;
  }
  if (activeIndex === -1) return null;

  const chunkStart = Math.floor(activeIndex / CHUNK_SIZE) * CHUNK_SIZE;
  const visibleWords = words.slice(chunkStart, chunkStart + CHUNK_SIZE);
  const chunkEnd = visibleWords[visibleWords.length - 1].endSec;

  // Hide the last chunk shortly after its final word ends.
  if (currentTime > chunkEnd + 0.4) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '23%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 80px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '14px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '54px',
          fontWeight: 800,
          lineHeight: 1.25,
          textShadow: '0 4px 16px rgba(0, 0, 0, 0.9)',
        }}
      >
        {visibleWords.map((item, idx) => {
          const isCurrent = chunkStart + idx === activeIndex && currentTime <= item.endSec;
          // CSS transitions don't run during rendering, so animate from the frame.
          const sinceStart = currentTime - item.startSec;
          const scale = isCurrent
            ? interpolate(sinceStart, [0, 0.08], [1, 1.08], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 1;
          return (
            <span
              key={chunkStart + idx}
              style={{
                color: isCurrent ? '#FFD166' : '#FFFFFF',
                transform: `scale(${scale})`,
                display: 'inline-block',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
