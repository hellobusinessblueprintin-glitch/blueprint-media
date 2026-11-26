import { Composition } from "remotion";
import { calculateMythoMetadata, MythoShort } from "./compositions/MythoShort";
import { calculateRavanaMetadata, RavanaCurses } from "./compositions/RavanaCurses";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MythoShort"
        component={MythoShort}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMythoMetadata}
        defaultProps={{
          steps: ["Seated", "Mocked", "Rejected", "Garland"],
          beat1Captions: [
            { text: "A humble sage took his seat", start: 0.3, end: 2.1, highlight: ["sage"] },
            { text: "in the royal assembly", start: 2.1, end: 4, highlight: ["royal"] },
          ],
          beat2Captions: [
            { text: "The whole court laughed", start: 0.2, end: 2, highlight: ["laughed"] },
            { text: "mocking his simple robes", start: 2, end: 4, highlight: ["mocking"] },
          ],
          beat3Captions: [
            { text: "Then turned him away", start: 0.6, end: 4, highlight: ["away"] },
          ],
          compareTitle: "Expectation vs. Reality",
          expectationLabel: "Expected",
          expectationCaption: "A seat of honour",
          realityLabel: "Reality",
          realityCaption: "Shown the door",
          takeaway: "True worth needs no crown",
          voiceoverEnabled: true,
          voiceoverFile: "voiceover.mp3",
          voiceoverVolume: 1,
        }}
      />
      <Composition
        id="RavanaCurses"
        component={RavanaCurses}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateRavanaMetadata}
        defaultProps={{
          hookText: "रावण को मारने वाले 4 श्राप!",
          warningText: "बिना इच्छा स्पर्श = भस्म",
          destinyText: "नियति का लेख",
          showCaptions: true,
          sfxEnabled: true,
          sfxVolume: 0.8,
          voiceoverEnabled: true,
          voiceoverFile: "ravana-voiceover.mp3",
          voiceoverVolume: 1,
        }}
      />
    </>
  );
};
