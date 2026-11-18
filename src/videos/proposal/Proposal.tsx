import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// Proposal film: venue → walking in → the proposal → celebration.
// Silent, no captions. 1920×1080 @ 30fps. Media lives in public/proposal/
// (git-ignored: private footage).

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

type Move = { scale: number; x: number; y: number }; // x/y in % of frame
type Transition = "cut" | "fade" | "black" | "white";

type Shot = {
  name: string;
  dur: number; // seconds on screen (including the incoming transition)
  in: Transition;
  inLen?: number; // frames for the incoming transition
  leak?: boolean; // warm light leak over the incoming transition
} & (
  | { kind: "video"; clip: string; at: number; rate?: number; from?: Move; to?: Move }
  | { kind: "photo"; photo: string; from: Move; to: Move }
);

const still = (scale: number, x = 0, y = 0): Move => ({ scale, x, y });

const SHOTS: Shot[] = [
  // ── Act 1: the venue at dusk ─────────────────────────────────────────
  { name: "Gate", kind: "photo", photo: "p71", dur: 4.2, in: "black", inLen: 36, from: still(1.0), to: still(1.14, 0, 1) },
  { name: "Treehouse approach", kind: "video", clip: "C0002", at: 0.4, dur: 5.2, in: "fade", inLen: 18, leak: true },
  { name: "Heart bridge", kind: "photo", photo: "p76", dur: 3.6, in: "fade", inLen: 18, from: still(1.04, 0, 0), to: still(1.18, 2, 3) },
  { name: "Walking the lit bridge", kind: "video", clip: "C0003", at: 3.3, dur: 5.6, in: "fade", inLen: 15 },
  { name: "Swing", kind: "photo", photo: "p77", dur: 3.2, in: "fade", inLen: 15, leak: true, from: still(1.12, -3, 0), to: still(1.12, 3, 0) },
  { name: "Dinner set", kind: "photo", photo: "treetopia", dur: 3.2, in: "fade", inLen: 15, from: still(1.02), to: still(1.12, 0, -2) },
  { name: "Dome and kitchen", kind: "photo", photo: "p81", dur: 3.0, in: "fade", inLen: 15, from: still(1.14, 3, 0), to: still(1.06, -2, 0) },
  { name: "Tub deck", kind: "photo", photo: "p72", dur: 3.0, in: "fade", inLen: 15, from: still(1.04, 0, 2), to: still(1.14, 0, 0) },
  { name: "Walkway", kind: "photo", photo: "p73", dur: 3.2, in: "fade", inLen: 15, leak: true, from: still(1.16, 0, 0), to: still(1.04, 0, 0) },

  // ── Night falls ──────────────────────────────────────────────────────
  { name: "Deck at night", kind: "video", clip: "C0007", at: 0.5, dur: 4.4, in: "black", inLen: 24, from: still(1.0), to: still(1.08) },
  { name: "Night railing", kind: "photo", photo: "p70", dur: 3.2, in: "fade", inLen: 18, from: still(1.04), to: still(1.15, -2, 1) },

  // ── Act 2: walking in ────────────────────────────────────────────────
  { name: "They arrive", kind: "video", clip: "C0009", at: 0.4, dur: 8.6, in: "fade", inLen: 20 },
  { name: "Walking the deck", kind: "video", clip: "C0009", at: 10.6, dur: 7.8, in: "cut" },
  { name: "Her laugh (photo)", kind: "photo", photo: "p35", dur: 3.0, in: "fade", inLen: 12, from: still(1.04), to: still(1.12, 3, 1) },
  { name: "Toward the corner", kind: "video", clip: "C0009", at: 20.4, dur: 8.6, in: "fade", inLen: 12 },
  { name: "The sign reveal", kind: "video", clip: "C0009", at: 30.0, dur: 6.6, in: "cut", from: still(1.0), to: still(1.1, 4, 0) },

  // ── Act 3: the proposal ──────────────────────────────────────────────
  { name: "Will you marry me", kind: "photo", photo: "p75", dur: 3.4, in: "white", inLen: 16, from: still(1.02, 0, 0), to: still(1.2, 6, 4) },
  { name: "On one knee", kind: "photo", photo: "p64", dur: 3.8, in: "fade", inLen: 14, from: still(1.04, 0, 0), to: still(1.2, 4, 2) },
  { name: "Her hands on his face", kind: "photo", photo: "p65", dur: 3.4, in: "fade", inLen: 14, from: still(1.06, 1, 0), to: still(1.16, 3, 1) },
  { name: "Her reaction", kind: "video", clip: "C0009", at: 40.9, dur: 1.9, in: "cut", rate: 0.85, from: still(1.06), to: still(1.12) },
  { name: "The ring", kind: "photo", photo: "p43", dur: 4.0, in: "white", inLen: 14, from: still(1.0), to: still(1.22, -2, 4) },

  // ── Celebration ──────────────────────────────────────────────────────
  { name: "Together by the sign", kind: "video", clip: "C0009", at: 46.4, dur: 2.6, in: "fade", inLen: 15 },
  { name: "Embrace", kind: "video", clip: "C0010", at: 0.0, dur: 9.0, in: "fade", inLen: 15, leak: true },
  { name: "Joy (photo)", kind: "photo", photo: "p22", dur: 3.0, in: "fade", inLen: 12, from: still(1.04), to: still(1.14, 2, 0) },
  { name: "B&W hug", kind: "photo", photo: "p25", dur: 2.4, in: "fade", inLen: 10, from: still(1.06), to: still(1.14) },
  { name: "B&W pose", kind: "photo", photo: "p07", dur: 2.4, in: "fade", inLen: 10, from: still(1.12, 2, 0), to: still(1.04, 0, 0) },
  { name: "B&W kiss", kind: "photo", photo: "p11", dur: 2.6, in: "fade", inLen: 10, from: still(1.04), to: still(1.16, 3, 0) },
  { name: "Close-up and kiss", kind: "video", clip: "C0011", at: 1.0, dur: 6.6, in: "fade", inLen: 15 },
  { name: "Kiss (photo)", kind: "photo", photo: "p10", dur: 3.2, in: "fade", inLen: 12, from: still(1.02), to: still(1.12) },
  { name: "Wine toast", kind: "video", clip: "C0012", at: 31.0, dur: 6.6, in: "fade", inLen: 15, leak: true },
  { name: "Kitchen kiss (B&W)", kind: "photo", photo: "p02", dur: 3.6, in: "fade", inLen: 15, from: still(1.04), to: still(1.14) },
  { name: "Final embrace", kind: "video", clip: "C0011", at: 8.4, dur: 5.4, in: "fade", inLen: 20 },
];

// Lay shots out: each one overlaps the previous by its fade length.
type Placed = Shot & { start: number; len: number; tLen: number; nextIn?: Transition; nextLen: number };
const placeShots = (): Placed[] => {
  const out: Placed[] = [];
  let cursor = 0;
  SHOTS.forEach((shot, i) => {
    const tLen = shot.in === "cut" ? 0 : shot.inLen ?? 15;
    const overlap = shot.in === "fade" ? tLen : 0;
    const start = Math.max(0, cursor - overlap);
    const len = s(shot.dur);
    const next = SHOTS[i + 1];
    out.push({
      ...shot,
      start,
      len,
      tLen,
      nextIn: next?.in,
      nextLen: next && next.in !== "cut" ? next.inLen ?? 15 : 0,
    });
    cursor = start + len;
  });
  return out;
};
const PLACED = placeShots();
export const DURATION = PLACED[PLACED.length - 1].start + PLACED[PLACED.length - 1].len;

const EASE = Easing.bezier(0.45, 0, 0.55, 1);

const ShotView: React.FC<{ shot: Placed }> = ({ shot }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, shot.len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const from = shot.from ?? still(1.0);
  const to = shot.to ?? still(1.06);
  const scale = from.scale + (to.scale - from.scale) * t;
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;

  // Incoming: fade over the previous shot, or rise out of black/white.
  let opacity = 1;
  if (shot.in === "fade" || shot.in === "black") {
    opacity = interpolate(f, [0, shot.tLen], [0, 1], { extrapolateRight: "clamp", easing: EASE });
  }
  // Outgoing into a dip-to-black: fade this shot down at its tail.
  if (shot.nextIn === "black") {
    opacity *= interpolate(f, [shot.len - shot.nextLen, shot.len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  }

  const media: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translate(${x}%, ${y}%) scale(${scale})`,
  };

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "black" }}>
      {shot.kind === "video" ? (
        <Video
          src={staticFile(`proposal/clips/${shot.clip}.mp4`)}
          trimBefore={s(shot.at)}
          playbackRate={shot.rate ?? 1}
          muted
          style={media}
        />
      ) : (
        <Img src={staticFile(`proposal/photos/${shot.photo}.jpg`)} style={media} />
      )}
    </AbsoluteFill>
  );
};

// White bloom across a cut (the reveal and the ring).
const WhiteFlash: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const half = len / 2;
  const o = interpolate(f, [0, half * 0.6, half, len], [0, 0.95, 0.95, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: "radial-gradient(ellipse at center, #fffaf0 0%, #fff3df 55%, #ffe2b8 100%)",
      }}
    />
  );
};

// Warm light leak sweeping across a fade.
const LightLeak: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, len], [0, 1], { extrapolateRight: "clamp" });
  const o = interpolate(p, [0, 0.4, 0.6, 1], [0, 0.55, 0.55, 0]);
  const cx = -20 + p * 140;
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        mixBlendMode: "screen",
        background: `radial-gradient(circle at ${cx}% 35%, rgba(255,170,90,0.9) 0%, rgba(255,120,60,0.45) 22%, rgba(255,90,40,0) 50%)`,
      }}
    />
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 12} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
    }}
  />
);

const Bookends: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [DURATION - s(2.2), DURATION - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return <AbsoluteFill style={{ backgroundColor: "black", opacity: o }} />;
};

export const Proposal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Gentle warm grade on everything underneath the overlays. */}
      <AbsoluteFill style={{ filter: "contrast(1.05) saturate(1.06) brightness(1.02)" }}>
        {PLACED.map((shot) => (
          <Sequence key={shot.name} name={shot.name} from={shot.start} durationInFrames={shot.len} premountFor={45}>
            <ShotView shot={shot} />
          </Sequence>
        ))}
      </AbsoluteFill>

      {PLACED.filter((p) => p.in === "white").map((p) => (
        <Sequence key={`flash-${p.name}`} name={`Flash: ${p.name}`} from={p.start - Math.round(p.tLen / 2)} durationInFrames={p.tLen}>
          <WhiteFlash len={p.tLen} />
        </Sequence>
      ))}
      {PLACED.filter((p) => p.leak).map((p) => (
        <Sequence key={`leak-${p.name}`} name={`Leak: ${p.name}`} from={p.start - 6} durationInFrames={p.tLen + 24}>
          <LightLeak len={p.tLen + 24} />
        </Sequence>
      ))}

      <Vignette />
      <Grain />
      <Bookends />
    </AbsoluteFill>
  );
};
