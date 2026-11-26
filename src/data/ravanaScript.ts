import type { CaptionCue } from "../components/KineticCaptions";

/**
 * "The 4 Curses That Trapped Ravana" — 80s Hindi Short.
 * All times are in seconds on the master timeline. When the final voiceover is
 * recorded, retime the caption cues (and, if needed, the beat boundaries) here.
 */
export const RAVANA_FPS = 30;
export const RAVANA_DURATION_S = 80;

export const RAVANA_BEATS = [
  { key: "hook", name: "Beat 1 · Hook", start: 0, end: 7 },
  { key: "nandi", name: "Beat 2 · Nandi's curse", start: 7, end: 22 },
  { key: "vedavati", name: "Beat 3 · Vedavati's curse", start: 22, end: 38 },
  { key: "nalakuvara", name: "Beat 4 · Nalakuvara's curse", start: 38, end: 56 },
  { key: "anaranya", name: "Beat 5 · Anaranya's curse", start: 56, end: 70 },
  { key: "payoff", name: "Beat 6 · Payoff", start: 70, end: 80 },
] as const;

/** Top progress bar: step i lights up at the start of beat i + 1. */
export const RAVANA_STEPS = ["नंदी", "वेदवती", "नलकुबेर", "अनरण्य"];

/** SFX cue points (seconds). */
export const RAVANA_SFX = {
  booms: [7, 22, 38, 56, 70],
  whooshes: [35],
};

export const RAVANA_CAPTIONS: CaptionCue[] = [
  // Beat 1 — Hook
  { text: "सब सोचते हैं कि रावण का अंत", start: 0.2, end: 2.0, highlight: ["रावण"] },
  { text: "सिर्फ़ सीता हरण की वजह से हुआ…", start: 2.0, end: 3.6, highlight: ["सीता", "हरण"] },
  { text: "लेकिन असल में रावण पहले ही", start: 3.6, end: 4.8, highlight: ["असल"] },
  { text: "4 ऐसे श्रापों के जाल में फंस चुका था,", start: 4.8, end: 6.0, highlight: ["4", "श्रापों"] },
  { text: "जिनसे बचना नामुमकिन था।", start: 6.0, end: 7.0, highlight: ["नामुमकिन"] },
  // Beat 2 — Nandi
  { text: "पहला श्राप — नंदी का।", start: 7.0, end: 8.8, highlight: ["श्राप", "नंदी"] },
  { text: "जब रावण अपने पुष्पक विमान से", start: 8.8, end: 11.0, highlight: ["पुष्पक", "विमान"] },
  { text: "कैलाश पर्वत के ऊपर से जा रहा था,", start: 11.0, end: 13.0, highlight: ["कैलाश"] },
  { text: "तो नंदी ने उसे रोका।", start: 13.0, end: 14.5, highlight: ["रोका"] },
  { text: "रावण ने नंदी के रूप का मज़ाक उड़ाया।", start: 14.5, end: 17.0, highlight: ["मज़ाक"] },
  { text: "क्रोध में नंदी ने श्राप दिया —", start: 17.0, end: 18.8, highlight: ["क्रोध", "श्राप"] },
  { text: "जिन वानरों का तू मज़ाक उड़ा रहा है,", start: 18.8, end: 20.4, highlight: ["वानरों"] },
  { text: "वही वानर तेरे कुल का विनाश करेंगे!", start: 20.4, end: 22.0, highlight: ["वानर", "विनाश"] },
  // Beat 3 — Vedavati
  { text: "दूसरा श्राप — तपस्विनी वेदवती का।", start: 22.0, end: 24.2, highlight: ["वेदवती"] },
  { text: "हिमालय में भगवान विष्णु को पति रूप में पाने के लिए", start: 24.2, end: 27.0, highlight: ["विष्णु"] },
  { text: "तप कर रही वेदवती को", start: 27.0, end: 28.5, highlight: ["तप"] },
  { text: "रावण ने छूने की कोशिश की।", start: 28.5, end: 30.5, highlight: ["छूने"] },
  { text: "अपमानित होकर वेदवती ने अग्नि में प्रवेश करते हुए कहा —", start: 30.5, end: 33.5, highlight: ["अग्नि"] },
  { text: "मैं फिर से जन्म लूंगी,", start: 33.5, end: 34.8, highlight: ["जन्म"] },
  { text: "और तेरी मृत्यु का कारण बनूंगी।", start: 34.8, end: 36.5, highlight: ["मृत्यु"] },
  { text: "वही अगले जन्म में माता सीता बनीं।", start: 36.5, end: 38.0, highlight: ["सीता"] },
  // Beat 4 — Nalakuvara
  { text: "तीसरा श्राप — नलकुबेर का।", start: 38.0, end: 40.0, highlight: ["नलकुबेर"] },
  { text: "जब रावण ने स्वर्ग की अप्सरा रंभा के साथ दुर्व्यवहार किया,", start: 40.0, end: 43.2, highlight: ["रंभा"] },
  { text: "तब कुबेर के पुत्र नलकुबेर ने उसे श्राप दिया —", start: 43.2, end: 46.0, highlight: ["श्राप"] },
  { text: "कि आज के बाद अगर तूने किसी भी स्त्री को", start: 46.0, end: 48.5, highlight: ["स्त्री"] },
  { text: "उसकी इच्छा के बिना छुआ,", start: 48.5, end: 50.0, highlight: ["इच्छा"] },
  { text: "तो तेरे सिर के सौ टुकड़े हो जाएंगे!", start: 50.0, end: 52.5, highlight: ["सौ", "टुकड़े"] },
  { text: "इसी डर से रावण अशोक वाटिका में", start: 52.5, end: 54.3, highlight: ["अशोक", "वाटिका"] },
  { text: "सीता माता को कभी छू नहीं पाया।", start: 54.3, end: 56.0, highlight: ["छू"] },
  // Beat 5 — Anaranya
  { text: "चौथा श्राप — राजा अनरण्य का।", start: 56.0, end: 58.0, highlight: ["अनरण्य"] },
  { text: "युद्ध में रावण के हाथों वीरगति पाते समय", start: 58.0, end: 60.6, highlight: ["वीरगति"] },
  { text: "इक्ष्वाकु वंश के राजा अनरण्य ने कहा था —", start: 60.6, end: 63.2, highlight: ["इक्ष्वाकु"] },
  { text: "मेरे ही वंश में एक ऐसा योद्धा जन्म लेगा,", start: 63.2, end: 65.8, highlight: ["योद्धा"] },
  { text: "जो तेरा वध करेगा।", start: 65.8, end: 67.2, highlight: ["वध"] },
  { text: "और उसी वंश में जन्मे प्रभु श्री राम!", start: 67.2, end: 70.0, highlight: ["श्री", "राम"] },
  // Beat 6 — Payoff
  { text: "यानी युद्ध शुरू होने से पहले ही", start: 70.0, end: 72.0, highlight: ["पहले"] },
  { text: "नियति ने रावण के अंत की पूरी कहानी लिख दी थी।", start: 72.0, end: 75.0, highlight: ["नियति"] },
  { text: "ऐसे ही अनसुने पौराणिक रहस्यों के लिए", start: 75.0, end: 77.3, highlight: ["रहस्यों"] },
  { text: "सब्सक्राइब ज़रूर करें!", start: 77.3, end: 79.4, highlight: ["सब्सक्राइब"] },
];
