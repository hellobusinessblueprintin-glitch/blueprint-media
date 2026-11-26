import React from 'react';
import { Composition } from 'remotion';
import { MythologyScene } from './MythologyScene';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MythologyScene"
      component={MythologyScene}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
