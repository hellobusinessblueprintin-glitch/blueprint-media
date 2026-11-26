import type { CaptionCue } from "../components/KineticCaptions";

/**
 * "The 4 Curses That Trapped Ravana" — Hindi Short.
 * All times are seconds on the master timeline, aligned to the AI Awaaz voiceover
 * (voice: Vikram, public/ravana-voiceover.mp3, 91.2s). Beat boundaries sit in the
 * [pause]s between curses; caption cues follow the sentence pauses in the audio.
 * If you regenerate the voiceover, retime this file — nothing else needs touching.
 */
export const RAVANA_FPS = 30;
export const RAVANA_DURATION_S = 92;

export const RAVANA_BEATS = [
  { key: "hook", name: "Beat 1 · Hook", start: 0, end: 10.9 },
  { key: "nandi", name: "Beat 2 · Nandi's curse", start: 10.9, end: 28.8 },
  { key: "vedavati", name: "Beat 3 · Vedavati's curse", start: 28.8, end: 47.9 },
  { key: "nalakuvara", name: "Beat 4 · Nalakuvara's curse", start: 47.9, end: 67.4 },
  { key: "anaranya", name: "Beat 5 · Anaranya's curse", start: 67.4, end: 82.4 },
  { key: "payoff", name: "Beat 6 · Payoff", start: 82.4, end: 92 },
] as const;

/** Scene cue points, in seconds relative to the start of each beat. */
export const RAVANA_CUES = {
  hook: { chainsAt: 4.9 }, // "4 ऐसे श्रापों के जाल में…"
  nandi: { stopAt: 6.2, laughAt: 8.1, curseAt: 10.7 }, // "नंदी ने उसे रोका" / "मज़ाक उड़ाया" / "क्रोध में…श्राप"
  vedavati: { ravanaAt: 6.4, fireAt: 9.5, morphAt: 16.75 }, // "छूने की कोशिश" / "अग्नि में प्रवेश" / "माता सीता"
  nalakuvara: { shieldAt: 6.9, warnAt: 9.05, hitAt: 13.4, vatikaAt: 15.3 }, // "श्राप दिया" / "इच्छा के बिना" / "सौ टुकड़े" / "अशोक वाटिका"
  anaranya: { pointAt: 5.6, treeAt: 8.4, heroAt: 13.3 }, // "कहा था" / "मेरे ही वंश" / "श्री राम"
  payoff: { mergeAt: 2.0, subscribeAt: 6.8 }, // "नियति ने…" / "सब्सक्राइब"
};

/** Top progress bar: step i lights up at the start of beat i + 1. */
export const RAVANA_STEPS = ["नंदी", "वेदवती", "नलकुबेर", "अनरण्य"];

/** SFX cue points (seconds, master timeline). */
export const RAVANA_SFX = {
  booms: [10.9, 28.8, 47.9, 67.4, 82.4],
  whooshes: [45.55],
};

export const RAVANA_CAPTIONS: CaptionCue[] = [
  // Beat 1 — Hook
  { text: "सब सोचते हैं कि रावण का अंत", start: 0.0, end: 2.0, highlight: ["रावण"] },
  { text: "सिर्फ़ सीता हरण की वजह से हुआ…", start: 2.0, end: 4.2, highlight: ["सीता", "हरण"] },
  { text: "लेकिन असल में रावण पहले ही", start: 4.2, end: 6.1, highlight: ["असल"] },
  { text: "4 ऐसे श्रापों के जाल में फंस चुका था,", start: 6.1, end: 8.7, highlight: ["4", "श्रापों"] },
  { text: "जिनसे बचना नामुमकिन था।", start: 8.7, end: 10.9, highlight: ["नामुमकिन"] },
  // Beat 2 — Nandi
  { text: "पहला श्राप — नंदी का।", start: 10.9, end: 13.1, highlight: ["श्राप", "नंदी"] },
  { text: "जब रावण अपने पुष्पक विमान से", start: 13.1, end: 15.1, highlight: ["पुष्पक", "विमान"] },
  { text: "कैलाश पर्वत के ऊपर से जा रहा था,", start: 15.1, end: 17.3, highlight: ["कैलाश"] },
  { text: "तो नंदी ने उसे रोका।", start: 17.3, end: 18.9, highlight: ["रोका"] },
  { text: "रावण ने नंदी के रूप का मज़ाक उड़ाया।", start: 18.9, end: 21.5, highlight: ["मज़ाक"] },
  { text: "क्रोध में नंदी ने श्राप दिया —", start: 21.5, end: 23.4, highlight: ["क्रोध", "श्राप"] },
  { text: "कि जिन वानरों का तू मज़ाक उड़ा रहा है,", start: 23.4, end: 25.85, highlight: ["वानरों"] },
  { text: "वही वानर तेरे पूरे कुल का विनाश करेंगे!", start: 25.85, end: 28.8, highlight: ["वानर", "विनाश"] },
  // Beat 3 — Vedavati
  { text: "दूसरा श्राप — तपस्विनी वेदवती का।", start: 28.8, end: 31.8, highlight: ["वेदवती"] },
  { text: "हिमालय में भगवान विष्णु को पति रूप में पाने के लिए", start: 31.8, end: 34.95, highlight: ["विष्णु"] },
  { text: "तप कर रही वेदवती को", start: 34.95, end: 36.2, highlight: ["तप"] },
  { text: "रावण ने छूने की कोशिश की।", start: 36.2, end: 38.2, highlight: ["छूने"] },
  { text: "अपमानित होकर वेदवती ने अग्नि में प्रवेश करते हुए कहा —", start: 38.2, end: 41.85, highlight: ["अग्नि"] },
  { text: "मैं फिर से जन्म लूंगी,", start: 41.85, end: 43.35, highlight: ["जन्म"] },
  { text: "और तेरी मृत्यु का कारण बनूंगी।", start: 43.35, end: 45.5, highlight: ["मृत्यु"] },
  { text: "वही अगले जन्म में माता सीता बनीं।", start: 45.5, end: 47.9, highlight: ["सीता"] },
  // Beat 4 — Nalakuvara
  { text: "तीसरा श्राप — नलकुबेर का।", start: 47.9, end: 50.3, highlight: ["नलकुबेर"] },
  { text: "जब रावण ने स्वर्ग की अप्सरा रंभा के साथ दुर्व्यवहार किया,", start: 50.3, end: 53.9, highlight: ["रंभा"] },
  { text: "तब कुबेर के पुत्र नलकुबेर ने उसे श्राप दिया —", start: 53.9, end: 56.9, highlight: ["श्राप"] },
  { text: "कि आज के बाद अगर तूने किसी भी स्त्री को", start: 56.9, end: 58.9, highlight: ["स्त्री"] },
  { text: "उसकी इच्छा के बिना छुआ,", start: 58.9, end: 60.85, highlight: ["इच्छा"] },
  { text: "तो तेरे सिर के सौ टुकड़े हो जाएंगे!", start: 60.85, end: 63.05, highlight: ["सौ", "टुकड़े"] },
  { text: "इसी डर से रावण अशोक वाटिका में", start: 63.05, end: 65.0, highlight: ["अशोक", "वाटिका"] },
  { text: "सीता माता को कभी छू नहीं पाया।", start: 65.0, end: 67.4, highlight: ["छू"] },
  // Beat 5 — Anaranya
  { text: "चौथा श्राप — राजा अनरण्य का।", start: 67.4, end: 70.2, highlight: ["अनरण्य"] },
  { text: "युद्ध में रावण के हाथों वीरगति पाते समय", start: 70.2, end: 72.9, highlight: ["वीरगति"] },
  { text: "इक्ष्वाकु वंश के राजा अनरण्य ने कहा था —", start: 72.9, end: 75.75, highlight: ["इक्ष्वाकु"] },
  { text: "मेरे ही वंश में एक ऐसा योद्धा जन्म लेगा,", start: 75.75, end: 78.55, highlight: ["योद्धा"] },
  { text: "जो तेरा वध करेगा।", start: 78.55, end: 80.0, highlight: ["वध"] },
  { text: "और उसी वंश में जन्मे प्रभु श्री राम!", start: 80.0, end: 82.4, highlight: ["श्री", "राम"] },
  // Beat 6 — Payoff
  { text: "यानी युद्ध शुरू होने से पहले ही", start: 82.4, end: 84.5, highlight: ["पहले"] },
  { text: "नियति ने रावण के अंत की पूरी कहानी लिख दी थी।", start: 84.5, end: 87.3, highlight: ["नियति"] },
  { text: "ऐसे ही अनसुने पौराणिक रहस्यों के लिए", start: 87.3, end: 89.3, highlight: ["रहस्यों"] },
  { text: "सब्सक्राइब ज़रूर करें!", start: 89.3, end: 91.4, highlight: ["सब्सक्राइब"] },
];
