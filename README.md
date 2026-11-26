# blueprint-media
Vertical (1080x1920, 30fps) mythological motion-graphics Short template built with Remotion.

- `npm run dev` – open Remotion Studio, composition `MythoShort`
- `npx remotion render MythoShort out/mytho.mp4` – render
- Drop a voiceover at `public/voiceover.mp3` – it plays automatically (skipped if absent)

Components live in `src/components/`, the 4-beat demo sequence in `src/compositions/MythoShort.tsx`.

## RavanaCurses — "रावण को मारने वाले 4 श्राप" (92s Hindi Short)

- Composition `RavanaCurses` (2760 frames). Beat timings, the progress-bar labels, the Hindi caption cues and the SFX cue points all live in `src/data/ravanaScript.ts` (in seconds) — retime them there once the real voiceover is recorded.
- Scenes: `src/compositions/ravana/Scenes.tsx`; characters/props (10-headed Ravana, chains, Nandi, Pushpak Viman, Vedavati + sacred fire + lotus, shield dome, Anaranya + lineage tree, icons): `src/components/ravana/`.
- Voiceover: `public/ravana-voiceover.mp3` — AI Awaaz, voice "Vikram" (V3), 91.2s. Timings in `ravanaScript.ts` are aligned to this file; replace it and retime to swap voices.
- SFX: `public/sfx/boom.wav` (each new curse) and `public/sfx/whoosh.wav` (Vedavati → Sita at 00:35), synthesised locally.
- Render: `npx remotion render RavanaCurses out/ravana-curses.mp4`
