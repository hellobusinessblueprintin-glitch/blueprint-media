import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const cinzel = loadCinzel("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});
const poppins = loadPoppins("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

export const FONTS = {
  /** Mythic serif for titles & takeaways. */
  display: cinzel.fontFamily,
  /** Heavy sans for captions & UI. */
  body: poppins.fontFamily,
};

export const COLORS = {
  gold: "#ffd166",
  goldDeep: "#f4a926",
  indigoInner: "#1b266b",
  indigoOuter: "#0a0f2c",
  crimsonInner: "#d9772b",
  crimsonMid: "#8f1d2c",
  crimsonOuter: "#2a0710",
  ink: "#0a0f2c",
  white: "#fff8e7",
};
