// The /games/ showcase: four gameplay trailers (AV1 with H.264 fallbacks, hover previews), posters in
// public/games/<slug>/, fonts in public/games/fonts/.

export interface GameTrailer {
  slug: string;
  title: string;
  tagline: string;
  genre: string;
  blurb: string;
  accent: string;
  /** CSS font-family stack for the title, in the game's own typeface. */
  titleFont: string;
  /** Uppercase display titles read better slightly tracked; script faces don't. */
  titleCase: "upper" | "none";
  facts: string[];
  beats: string[];
  credits: string[];
  /** AV1 trailer size, shown on the download link. */
  sizeMb: number;
}

// 8-bit AV1: some hardware decoders (Chrome's VA-API path on Linux/NVIDIA) render 10-bit AV1 as black.
export const AV1_TYPE = 'video/mp4; codecs="av01.0.08M.08"';
export const H264_TYPE = 'video/mp4; codecs="avc1.640028"';

// Videos live in public/games/media/ — gitignored, rsynced to the server's shared/games-media, which each
// release links back in (ServerChirp linked path) — so they never bloat the repo.
/** Bump when the videos are re-encoded: the query string busts browser and Cloudflare caches. */
export const MEDIA_VERSION = "2";
const v = `?v=${MEDIA_VERSION}`;

export const media = (slug: string) => ({
  trailerAv1: `/games/media/${slug}/trailer.av1.mp4${v}`,
  trailerH264: `/games/media/${slug}/trailer.h264.mp4${v}`,
  previewAv1: `/games/media/${slug}/preview.av1.mp4${v}`,
  previewH264: `/games/media/${slug}/preview.h264.mp4${v}`,
  poster: `/games/${slug}/poster.webp`,
  posterJpg: `/games/${slug}/poster.jpg`,
});

export const games: GameTrailer[] = [
  {
    slug: "dynasty",
    title: "A Most Unfortunate Dynasty",
    tagline: "Build a dynasty. Inherit the disaster.",
    genre: "Dynastic strategy",
    blurb:
      "Four rival houses share one valley and several centuries of bad decisions. Scheme for honours, seize land, and watch history happen to your heirs.",
    accent: "#d9b77c",
    titleFont: '"Cinzel Decorative", "EB Garamond", Georgia, serif',
    titleCase: "upper",
    facts: ["1–4 players", "Online with friends", "Coming to Steam"],
    beats: ["Four rival houses", "Make terrible choices", "Steal their honours", "Take their land", "Bury your rulers", "History happens"],
    credits: [
      "Gameplay, procedural models and UI: A Most Unfortunate Dynasty. Every gameplay shot is real play from seeded matches, presented by the game's own stager.",
      "Music, sound effects and the herald's voice generated with ElevenLabs for the game.",
      "Fonts: Cinzel Decorative and EB Garamond, SIL OFL 1.1.",
      "Icons: game-icons.net, CC BY 3.0. Textures: Poly Haven, CC0.",
    ],
    sizeMb: 18,
  },
  {
    slug: "gear_to_glory",
    title: "Gear to Glory",
    tagline: "Build your company. Chase your legend.",
    genre: "Mercenary company RPG",
    blurb:
      "Lead a company of sellswords across a frozen frontier. Wear what you win, swear their oaths, choose the road together — and accept that not everyone comes home.",
    accent: "#9cc4e4",
    titleFont: '"Cinzel", "EB Garamond", Georgia, serif',
    titleCase: "upper",
    facts: ["Party combat", "Loot & oath trees", "Co-op campaign map"],
    beats: ["Lead a company of sellswords", "Wear what you win", "Swear their oaths", "Choose your road together", "Not everyone comes home"],
    credits: [
      "Gameplay, music, voice barks and sound effects from the Gear to Glory project assets. No new voiceover.",
      "Cinzel and Alegreya Sans: SIL Open Font License 1.1.",
      "Captured from an isolated copy of the game with fresh user data.",
    ],
    sizeMb: 20,
  },
  {
    slug: "emberhold",
    title: "Emberhold",
    tagline: "Settle by day. Survive the night.",
    genre: "Settlement survival",
    blurb:
      "Raise a village in five wild valleys, face rival clans, and hold your land when the dead rise every night — under omens, storms and the Blood Moon.",
    accent: "#f2994a",
    titleFont: '"Cinzel", "EB Garamond", Georgia, serif',
    titleCase: "upper",
    facts: ["Solo & co-op campaign", "Versus up to 4 clans", "Five valleys"],
    beats: ["Settle by day", "Claim the land", "Face rival clans", "The dead rise every night", "Hold the high ground", "Endure the Blood Moon"],
    credits: [
      "Gameplay captured from Emberhold in an isolated project copy with fresh user data. All footage is the live simulation with its original mechanics; the dusk is a time-lapse.",
      "Existing Emberhold music, sound effects and narrator lines. No new voice-over.",
      "Cinzel and Alegreya Sans: SIL Open Font License 1.1.",
    ],
    sizeMb: 21,
  },
  {
    slug: "walled_garden",
    title: "Walled Garden",
    tagline: "Clock in. Act out. Walk out.",
    genre: "Office stealth & sabotage",
    blurb:
      "Recruit your coworkers, sabotage the servers, humiliate management and organize the whole floor — while HARMONY, the corporate AI, begs for one normal day.",
    accent: "#ef5145",
    titleFont: '"Permanent Marker", "Alegreya Sans", system-ui, sans-serif',
    titleCase: "none",
    facts: ["Stealth & sabotage", "Recruit your coworkers", "Five floors to liberate"],
    beats: ["Recruit", "Sabotage", "Torch", "Lights out", "Vanish", "Walk out"],
    credits: [
      "Gameplay and original assets: Walled Garden. HARMONY's voice and game SFX were generated with ElevenLabs for the game.",
      "“Opportunity Walks” and “Glitter Blast” by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 — creativecommons.org/licenses/by/4.0/. Excerpts edited and mixed with gameplay sound.",
      "Game icons: Lorc, Skoll and Delapouite, game-icons.net (CC BY 3.0).",
      "Title font: Permanent Marker, Apache 2.0.",
    ],
    sizeMb: 20,
  },
];
