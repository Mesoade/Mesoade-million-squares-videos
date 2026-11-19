import React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Sfx } from "../../shared/Sfx";
import { EASE_OUT, clamp } from "../../shared/theme";
import { mix } from "../../shared/ui";
import { CAPTIONS } from "./captions";

/**
 * "Case file" look for the Bachmeier story: a deliberate break from the
 * house panel style. Graded, grainy footage; typed dates; real photos as
 * taped prints; one blood-red accent. The brand look only returns when the
 * story reaches the present day (the wall).
 */
export const K = {
  ink: "#0b0a09",
  paper: "#ece6da",
  red: "#c8281e",
  dim: "#9b948a",
};
export const TYPE = "Special Elite";
export const STAMP = "Bebas Neue";
export const CAP = "Montserrat";

let p: Promise<unknown> | null = null;
export const loadCaseFonts = () => {
  if (p) return p;
  const f = (family: string, file: string, weight: string) =>
    loadFont({ family, url: staticFile(`fonts/${file}`), weight });
  p = Promise.all([
    f(TYPE, "special-elite-latin-400-normal.woff2", "400"),
    f(STAMP, "bebas-neue-latin-400-normal.woff2", "400"),
    f(CAP, "montserrat-latin-800-normal.woff2", "800"),
    f(CAP, "montserrat-latin-600-normal.woff2", "600"),
  ]);
  return p;
};

export const img = (name: string) => staticFile(`bachmeier/img/${name}`);

/* ------------------------------------------------------------------ */
/* Film grain + vignette                                               */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${frame}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={frame % 12}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill
    style={{
      opacity,
      background:
        "radial-gradient(ellipse 85% 70% at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)",
    }}
  />
);

/** White flash for impacts. */
export const Flash: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const o = Math.max(
    0,
    ...at.map((a) =>
      interpolate(frame, [a, a + 1, a + 6], [0, 0.85, 0], clamp),
    ),
  );
  return <AbsoluteFill style={{ backgroundColor: "white", opacity: o }} />;
};

/** Dark scrim over the top of the frame (above the head), fading out. */
export const Scrim: React.FC<{ p: number; h?: number }> = ({ p, h = 780 }) => (
  <AbsoluteFill
    style={{
      height: h,
      opacity: p,
      background: `linear-gradient(to bottom, rgba(11,10,9,0.94) 0%, rgba(11,10,9,0.9) ${
        ((h - 150) / h) * 100
      }%, rgba(11,10,9,0) 100%)`,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

/** Typewriter text: one character per `speed` frames, a key sound every 2. */
export const Typed: React.FC<{
  text: string;
  at: number;
  speed?: number;
  style?: React.CSSProperties;
  sound?: boolean;
}> = ({ text, at, speed = 1, style, sound = true }) => {
  const frame = useCurrentFrame();
  const n = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - at) / speed)),
  );
  const keys = [];
  if (sound) {
    for (let i = 0; i < text.length; i += 2) {
      if (text[i] !== " ")
        keys.push(<Sfx key={i} at={Math.round(at + i * speed)} name="type" />);
    }
  }
  return (
    <>
      {keys}
      <div
        style={{
          fontFamily: TYPE,
          color: K.paper,
          fontSize: 40,
          letterSpacing: "0.06em",
          whiteSpace: "pre",
          ...style,
        }}
      >
        {text.slice(0, n)}
        <span style={{ opacity: 0 }}>{text.slice(n)}</span>
      </div>
    </>
  );
};

/** Big condensed stamp that slams 1.8→1 with a thud. */
export const Stamp: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  rotate?: number;
  boxed?: boolean;
  style?: React.CSSProperties;
  sfx?: "thud" | "boom" | null;
}> = ({
  text,
  at,
  size = 200,
  color = K.paper,
  rotate = 0,
  boxed,
  style,
  sfx = "thud",
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 7], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <>
      {sfx ? <Sfx at={at} name={sfx} /> : null}
      <div
        style={{
          fontFamily: STAMP,
          fontSize: size,
          lineHeight: 0.9,
          color,
          opacity: frame < at ? 0 : Math.min(1, t * 2),
          scale: String(mix(t, 1.8, 1)),
          rotate: `${rotate}deg`,
          letterSpacing: "0.02em",
          ...(boxed
            ? {
                border: `6px solid ${color}`,
                padding: "6px 22px 0",
                borderRadius: 6,
              }
            : {}),
          ...style,
        }}
      >
        {text}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Photo print                                                         */
/* ------------------------------------------------------------------ */

/**
 * A real photo as a taped print. Drops in (scale 1.25→1, fade) with a
 * shutter sound and drifts slowly (Ken Burns) while on screen.
 */
export const Print: React.FC<{
  src: string;
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  caption?: string;
  gray?: number;
  objectPosition?: string;
  sfx?: boolean;
  out?: number;
}> = ({
  src,
  at,
  x,
  y,
  w,
  h,
  rotate = 0,
  caption,
  gray = 0.9,
  objectPosition = "50% 30%",
  sfx = true,
  out,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 10], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const o =
    out === undefined ? 1 : interpolate(frame, [out, out + 8], [1, 0], clamp);
  const drift = interpolate(frame, [at, at + 240], [1.0, 1.08], clamp);
  return (
    <>
      {sfx ? <Sfx at={at} name="shutter" /> : null}
      <div
        style={{
          position: "absolute",
          left: x - w / 2,
          top: y - h / 2,
          width: w,
          height: h,
          opacity: frame < at ? 0 : t * o,
          scale: String(mix(t, 1.25, 1)),
          rotate: `${mix(t, rotate * 2.5, rotate)}deg`,
          background: K.paper,
          padding: 12,
          paddingBottom: caption ? 62 : 12,
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
              scale: String(drift),
              filter: `grayscale(${gray}) contrast(1.1)`,
            }}
          />
        </div>
        {caption ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 14,
              textAlign: "center",
              fontFamily: TYPE,
              fontSize: 30,
              color: K.ink,
              letterSpacing: "0.04em",
            }}
          >
            {caption}
          </div>
        ) : null}
        {/* tape */}
        <div
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            width: 130,
            height: 38,
            marginLeft: -65,
            rotate: "-4deg",
            background: "rgba(236,230,218,0.55)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Captions: white, very thin black stroke, words build as spoken      */
/* ------------------------------------------------------------------ */

export const Captions: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const page = CAPTIONS.find(
    (c, i) =>
      frame >= c.from &&
      frame < Math.max(c.to + 4, 0) &&
      (CAPTIONS[i + 1] === undefined || frame < CAPTIONS[i + 1].from),
  );
  if (!page) return null;
  const t = interpolate(frame, [page.from, page.from + 4], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        columnGap: 20,
        scale: String(mix(t, 0.94, 1)),
      }}
    >
      {page.words.map((w, i) => {
        const on = frame >= w.f;
        const wt = interpolate(frame, [w.f, w.f + 3], [0, 1], clamp);
        return (
          <span
            key={i}
            style={{
              fontFamily: CAP,
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 1.15,
              color: "white",
              WebkitTextStroke: "2.5px black",
              paintOrder: "stroke fill",
              textShadow: "0 3px 12px rgba(0,0,0,0.35)",
              opacity: on ? 1 : 0,
              translate: `0px ${mix(wt, 10, 0)}px`,
              display: "inline-block",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
