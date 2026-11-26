# blueprint-media

Remotion puppet-theatre shorts (1080×1920, 30 fps).

```bash
npm install
npm run studio     # live preview
npm run render     # out/mythology.mp4
```

- `src/StageTheater.tsx` – backdrop, spotlight, grain, animated curtains
- `src/PuppetRig.tsx` – SVG string puppet (pose via head tilt / arm angles)
- `src/HinglishCaptions.tsx` – word-timed 4-word caption chunks
- `src/MythologyScene.tsx` – sample scene
