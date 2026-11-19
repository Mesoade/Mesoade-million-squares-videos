import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sfx } from "../../shared/Sfx";
import {
  C,
  EASE_IN_OUT,
  EASE_OUT,
  SANS,
  SERIF,
  clamp,
} from "../../shared/theme";
import {
  BrandMark,
  Em,
  PHOTOS,
  mix,
  photo,
  useProgress,
} from "../../shared/ui";
import { K, Print, Scrim, Stamp, TYPE, Typed, img } from "./look";

/*
 * Documentary B-roll. Most scenes are FULL SCREEN (the voice carries on
 * underneath); a couple are overlays above the speaker's head.
 * All frame numbers are local to the scene's Sequence.
 */

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

/** Doc-style lower third: tracked caps name + thin rule + dim subline. */
export const LowerThird: React.FC<{
  at: number;
  name: string;
  sub?: string;
  y?: number;
}> = ({ at, name, sub, y = 1250 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 14], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: y,
        opacity: t,
        translate: `${mix(t, -30, 0)}px 0px`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: "0.22em",
          color: "#f4efe6",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}
      >
        {name}
      </div>
      <div
        style={{
          marginTop: 12,
          width: 90 * t,
          height: 3,
          background: K.red,
        }}
      />
      {sub ? (
        <div
          style={{
            marginTop: 12,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "0.18em",
            color: "rgba(244,239,230,0.75)",
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

/** Bottom + top darkening so labels and captions read over photos. */
const Shade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)",
    }}
  />
);

type Move = {
  /** scale at start / end of the shot */
  s: [number, number];
  /** translate in px at start / end (x, y) */
  x?: [number, number];
  y?: [number, number];
};

/**
 * Full-screen archive photo. `cover` fills the frame; otherwise the photo
 * sits full-width over a blurred, darkened copy of itself. Slow Ken Burns
 * move across the whole shot, plus optional snap-zooms for drama.
 */
export const Archive: React.FC<{
  src: string;
  cover?: boolean;
  move: Move;
  gray?: number;
  objectPosition?: string;
  /** [frame, extra scale] snap zooms */
  snaps?: [number, number][];
  dim?: [number, number, number]; // [from frame, to frame, brightness]
  children?: React.ReactNode;
  aspect?: number; // w/h of the photo, for contain layout
}> = ({
  src,
  cover,
  move,
  gray = 0,
  objectPosition = "50% 40%",
  snaps = [],
  dim,
  children,
  aspect = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const k = interpolate(frame, [0, d], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  let s = mix(k, move.s[0], move.s[1]);
  for (const [at, extra] of snaps) {
    s += interpolate(frame, [at, at + 5], [0, extra], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
  }
  const tx = move.x ? mix(k, move.x[0], move.x[1]) : 0;
  const ty = move.y ? mix(k, move.y[0], move.y[1]) : 0;
  const bright = dim
    ? interpolate(frame, [dim[0], dim[1]], [1, dim[2]], clamp)
    : 1;
  const filter = `grayscale(${gray}) sepia(0.14) contrast(1.08) brightness(${bright})`;
  const h = 1080 / aspect;
  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      {!cover ? (
        <Img
          src={src}
          style={{
            position: "absolute",
            inset: -80,
            width: 1240,
            height: 2080,
            objectFit: "cover",
            filter: `${filter} blur(40px) brightness(0.45)`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          transformOrigin: "50% 45%",
        }}
      >
        {cover ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
              filter,
            }}
          />
        ) : (
          <Img
            src={src}
            style={{
              position: "absolute",
              left: 0,
              top: 860 - h / 2,
              width: 1080,
              height: h,
              objectFit: "cover",
              objectPosition,
              filter,
              boxShadow: "0 0 120px rgba(0,0,0,0.8)",
            }}
          />
        )}
      </AbsoluteFill>
      <Shade />
      {children}
    </AbsoluteFill>
  );
};

/** Full-screen title card: black, a typed date, a subline. Slow push. */
export const TitleCard: React.FC<{
  big: string;
  sub?: string;
  sub2?: string;
  bigFont?: "type" | "stamp";
  size?: number;
}> = ({ big, sub, sub2, bigFont = "type", size = 120 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const s = interpolate(frame, [0, d], [1, 1.08], clamp);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070707",
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 50% 45%, #1c1a18 0%, #070707 75%)",
      }}
    >
      <Sfx at={0} name="boom" volume={0.32} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 260,
          scale: String(s),
        }}
      >
        {bigFont === "stamp" ? (
          <Stamp text={big} at={2} size={size * 2.4} sfx={null} />
        ) : (
          <Typed text={big} at={2} speed={1.4} style={{ fontSize: size }} />
        )}
        {sub ? (
          <div style={{ marginTop: 36 }}>
            <Typed
              text={sub}
              at={14}
              sound={false}
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 34,
                letterSpacing: "0.28em",
                color: "rgba(236,230,218,0.8)",
              }}
            />
          </div>
        ) : null}
        {sub2 ? (
          <div style={{ marginTop: 18 }}>
            <Typed
              text={sub2}
              at={30}
              sound={false}
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 28,
                letterSpacing: "0.24em",
                color: K.dim,
              }}
            />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

/** Hook (abs 0–84): "In 1981, a mother walked into a courtroom in Germany" */
export const Hook: React.FC = () => (
  <TitleCard
    big="1981"
    bigFont="stamp"
    size={110}
    sub="LÜBECK · WEST GERMANY"
  />
);

/** abs 210–276: "Her name was Marianne Bachmeier." */
export const Marianne: React.FC = () => (
  <Archive
    src={img("marianne1982_hd.jpg")}
    aspect={244 / 279}
    move={{ s: [1.0, 1.14], y: [0, -30] }}
    gray={1}
    objectPosition="50% 30%"
  >
    <Sfx at={0} name="whoosh" volume={0.14} />
    <LowerThird at={24} name="MARIANNE BACHMEIER" sub="ANNA'S MOTHER" />
  </Archive>
);

/** abs 276–330: "On May 5, 1980," */
export const May1980: React.FC = () => (
  <TitleCard big="5 MAY 1980" size={118} />
);

/** abs 330–428: "her daughter, Anna, skipped school. That morning," */
export const Anna: React.FC = () => (
  <Archive
    src={img("anna_hd.jpg")}
    aspect={318 / 313}
    move={{ s: [1.32, 1.48], x: [0, 20] }}
    objectPosition="50% 40%"
  >
    <LowerThird at={14} name="ANNA BACHMEIER" sub="AGE 7" />
  </Archive>
);

/** abs 428–546: "a man named Klaus Grabowski lured her … and murdered her." */
export const Grabowski: React.FC = () => (
  <Archive
    src={img("grabowski_hd.jpg")}
    aspect={421 / 237}
    move={{ s: [1.25, 1.55], x: [30, 0] }}
    gray={1}
    objectPosition="44% 40%"
    snaps={[[90, 0.4]]}
    dim={[88, 100, 0.55]}
  >
    <Sfx at={90} name="boom" volume={0.42} />
    <LowerThird at={8} name="KLAUS GRABOWSKI" sub="35 · BUTCHER" />
  </Archive>
);

/** Overlay over the speaker (abs 546–686): prior conviction. */
export const Conviction: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = interpolate(frame, [0, 6, d - 8, d], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={1} h={780} />
      <Print
        src={img("grabowski.jpg")}
        at={2}
        x={540}
        y={330}
        w={520}
        h={430}
        rotate={-2}
        objectPosition="45% 40%"
        caption="KLAUS GRABOWSKI"
      />
      {/* "convicted" at abs 612 = local 66 */}
      <div style={{ position: "absolute", left: 560, top: 380 }}>
        <Stamp
          text="PRIOR CONVICTION"
          at={64}
          size={64}
          color={K.red}
          rotate={-9}
          boxed
          style={{
            background: "rgba(236,230,218,0.88)",
            display: "inline-block",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** abs 686–790: "Ten months later, Marianne walked into the courtroom…" */
export const Trial: React.FC = () => (
  <TitleCard
    big="6 MARCH 1981"
    size={104}
    sub="LÜBECK DISTRICT COURT"
    sub2="DAY 3 OF THE TRIAL"
  />
);

/** abs 990–1044: "Grabowski died in that courtroom" */
export const Died: React.FC = () => (
  <Archive
    src={img("grabowski_hd.jpg")}
    aspect={421 / 237}
    move={{ s: [1.8, 1.5] }}
    gray={1}
    objectPosition="44% 40%"
    dim={[10, 40, 0.45]}
  >
    <LowerThird
      at={20}
      name="KLAUS GRABOWSKI"
      sub="DIED IN THE COURTROOM · 6 MARCH 1981"
    />
  </Archive>
);

/** abs 1044–1124: "and Marianne was immediately arrested." Pan across the press. */
export const Press: React.FC = () => {
  const frame = useCurrentFrame();
  const pops = [6, 13, 24, 33, 47, 58];
  const flash = Math.max(
    0,
    ...pops.map((a) =>
      interpolate(frame, [a, a + 1, a + 4], [0, 0.55, 0], clamp),
    ),
  );
  return (
    <Archive
      src={img("marianne_press_hd.jpg")}
      cover
      move={{ s: [1.05, 1.18], x: [-260, 300] }}
      gray={1}
      objectPosition="50% 50%"
    >
      {pops.map((a) => (
        <Sfx key={a} at={a} name="shutter" volume={0.2} />
      ))}
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
      <LowerThird
        at={12}
        name="MARIANNE BACHMEIER"
        sub="FACING THE PRESS · 1982"
      />
    </Archive>
  );
};

/** abs 1124–1300: "Her actions divided Germany. Some saw… while others…" */
export const Divided: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 14], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const topS = interpolate(frame, [0, 176], [1.05, 1.18], clamp);
  const bottom = interpolate(frame, [128, 140], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#060606" }}>
      <Sfx at={0} name="boom" volume={0.3} />
      {/* top half: the grieving mother */}
      <AbsoluteFill style={{ height: 900, overflow: "hidden" }}>
        <Img
          src={img("marianne1982_hd.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 22%",
            filter: "grayscale(1) sepia(0.15) brightness(0.55) contrast(1.1)",
            scale: String(topS),
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 620,
            textAlign: "center",
          }}
        >
          <Stamp text="A GRIEVING MOTHER" at={60} size={110} />
          <div
            style={{ marginTop: 14, display: "flex", justifyContent: "center" }}
          >
            <Typed
              text="PUSHED TO HER LIMITS"
              at={98}
              style={{ fontSize: 34, color: "rgba(236,230,218,0.8)" }}
            />
          </div>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 898,
          left: 540 - 540 * line,
          width: 1080 * line,
          height: 6,
          background: K.red,
        }}
      />
      {/* bottom half: taking justice into her own hands */}
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: bottom,
        }}
      >
        <Stamp text="JUSTICE IN" at={140} size={120} color={K.red} />
        <Stamp
          text="HER OWN HANDS"
          at={144}
          size={120}
          color={K.red}
          sfx={null}
        />
      </div>
    </AbsoluteFill>
  );
};

/** abs 1384–1540: "In 1983… six years in prison but only served three." */
export const Sentence: React.FC = () => {
  const frame = useCurrentFrame();
  const BAR_AT = 66;
  const SERVED_AT = 122;
  const s = interpolate(frame, [0, 156], [1, 1.07], clamp);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070707",
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 50% 40%, #1c1a18 0%, #070707 75%)",
      }}
    >
      <AbsoluteFill style={{ scale: String(s) }}>
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <Stamp text="1983" at={4} size={280} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 590,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typed text="SENTENCED: 6 YEARS" at={48} style={{ fontSize: 56 }} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const a = BAR_AT + i * 4;
            const t = interpolate(frame, [a, a + 8], [0, 1], {
              ...clamp,
              easing: EASE_OUT,
            });
            const cut =
              i >= 3
                ? interpolate(frame, [SERVED_AT, SERVED_AT + 8], [0, 1], clamp)
                : 0;
            return (
              <div key={i} style={{ position: "relative" }}>
                <Sfx at={a} name="tick" />
                <div
                  style={{
                    width: 130,
                    height: 190,
                    background: cut > 0.5 ? "transparent" : K.paper,
                    border: `5px solid ${K.paper}`,
                    boxSizing: "border-box",
                    opacity: t * mix(cut, 1, 0.5),
                    translate: `0px ${mix(t, 40, 0)}px`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: -12,
                    top: 90,
                    width: 154 * cut,
                    height: 8,
                    background: K.red,
                    rotate: "-30deg",
                  }}
                />
                <div
                  style={{
                    marginTop: 12,
                    textAlign: "center",
                    fontFamily: TYPE,
                    fontSize: 28,
                    color: K.dim,
                    opacity: t,
                  }}
                >
                  {`YR ${i + 1}`}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            top: 1030,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <Stamp text="SERVED: 3" at={SERVED_AT} size={130} color={K.red} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** abs 1878–1992: "…how deeply love and loss can change someone." */
export const Grave: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = interpolate(frame, [0, 12, d - 10, d], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Archive
        src={img("grave_hd.jpg")}
        cover
        move={{ s: [1.0, 1.2], y: [20, -20] }}
        objectPosition="42% 30%"
      >
        <LowerThird
          at={18}
          name="ANNA & MARIANNE"
          sub="BURGTOR CEMETERY · LÜBECK"
        />
      </Archive>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* The wall — full screen, brand look (abs 2030 → 2470)                */
/* ------------------------------------------------------------------ */
const COLS = 7;
const ROWS = 13;
const CELL = 128;
const GAP = 14;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const GRID_H = ROWS * CELL + (ROWS - 1) * GAP;
const GRID_X = (1080 - GRID_W) / 2;
const GRID_Y = (1920 - GRID_H) / 2;
const cellXY = (r: number, c: number) => ({
  x: GRID_X + c * (CELL + GAP),
  y: GRID_Y + r * (CELL + GAP),
});
const M = { r: 5, c: 3 };
const OTHERS: [number, number][] = [
  [3, 1],
  [6, 5],
  [8, 2],
  [2, 5],
  [7, 0],
  [4, 6],
  [9, 4],
  [1, 2],
  [10, 6],
  [0, 4],
  [11, 1],
  [12, 5],
];

/**
 * @param zoomOutAt local frame where the camera pulls back from Marianne's
 *        square to the whole wall ("ordinary everyday people").
 */
export const Wall: React.FC<{ zoomOutAt: number; glowAt: number }> = ({
  zoomOutAt,
  glowAt,
}) => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const FLY = 6;
  const fly = interpolate(frame, [FLY, FLY + 16], [0, 1], {
    ...clamp,
    easing: EASE_IN_OUT,
  });
  const m = cellXY(M.r, M.c);
  const cx = m.x + CELL / 2;
  const cy = m.y + CELL / 2;
  // camera: start tight on Marianne's square, pull back later
  const pull = interpolate(frame, [zoomOutAt, zoomOutAt + 40], [0, 1], {
    ...clamp,
    easing: EASE_IN_OUT,
  });
  const camS = mix(
    pull,
    interpolate(frame, [0, zoomOutAt], [2.3, 2.5], clamp),
    1,
  );
  const size = mix(fly, 900, CELL);
  const px = mix(fly, cx - 450, m.x);
  const py = mix(fly, cy - 450, m.y);
  const glow = interpolate(
    frame,
    [FLY + 16, FLY + 24, FLY + 70],
    [0, 1, 0.6],
    clamp,
  );
  const allGlow = interpolate(
    frame,
    [glowAt, glowAt + 8, glowAt + 40],
    [0, 1, 0.45],
    clamp,
  );
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 45%, #241d18 0%, ${C.bg} 75%)`,
      }}
    >
      <Sfx at={FLY} name="whoosh" />
      <Sfx at={FLY + 16} name="pop" />
      <Sfx at={FLY + 18} name="ding" />
      <Sfx at={zoomOutAt} name="whoosh" volume={0.2} />
      <Sfx at={glowAt} name="ding" volume={0.15} />
      <AbsoluteFill
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: `translate(${540 - cx}px, ${860 - cy}px) scale(${camS})`,
        }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const { x, y } = cellXY(r, c);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CELL,
                height: CELL,
                border: `2px solid ${C.line}`,
                boxSizing: "border-box",
                background: C.bgRaised,
              }}
            />
          );
        })}
        {OTHERS.map(([r, c], i) => {
          const a = zoomOutAt + 18 + i * 4;
          const t = interpolate(frame, [a, a + 10], [0, 1], {
            ...clamp,
            easing: EASE_OUT,
          });
          const { x, y } = cellXY(r, c);
          return (
            <React.Fragment key={i}>
              {i % 2 === 0 ? <Sfx at={a} name="pop" volume={0.13} /> : null}
              <Img
                src={photo(PHOTOS[i % PHOTOS.length])}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: CELL,
                  height: CELL,
                  objectFit: "cover",
                  opacity: t,
                  scale: String(mix(t, 1.6, 1)),
                  outline:
                    allGlow > 0.05
                      ? `3px solid rgba(232,105,47,${allGlow})`
                      : undefined,
                  boxShadow: `0 0 ${28 * allGlow}px ${C.orange}`,
                }}
              />
            </React.Fragment>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: px,
            top: py,
            width: size,
            height: size,
            opacity: p(0, 6),
            overflow: "hidden",
            outline: `${mix(fly, 8, 3)}px solid ${glow > 0.05 ? C.orange : C.cream}`,
            boxShadow: `0 0 ${50 * glow}px ${C.orange}`,
          }}
        >
          <Img
            src={img("marianne1982_hd.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 25%",
              filter: "grayscale(1)",
            }}
          />
        </div>
      </AbsoluteFill>
      {/* name card while we're tight on her square */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 72,
          color: C.cream,
          opacity: p(30, 44) * (1 - pull),
          translate: `0px ${mix(p(30, 44), 30, 0)}px`,
        }}
      >
        <Em>Marianne</Em> Bachmeier
      </div>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          opacity: p(10, 22),
        }}
      >
        <BrandMark size={36} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: "0.3em",
            color: C.cream,
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          THE MILLION SQUARES
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* End card over the speaker (top of frame)                            */
/* ------------------------------------------------------------------ */
export const End: React.FC = () => {
  const p = useProgress();
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [70, 78, 90], [1, 1.08, 1], clamp);
  return (
    <AbsoluteFill>
      <Sfx at={0} name="whoosh" />
      <Sfx at={72} name="ding" />
      <AbsoluteFill
        style={{
          height: 800,
          opacity: p(0, 8),
          background:
            "linear-gradient(to bottom, rgba(19,17,15,0.97) 0%, rgba(19,17,15,0.95) 80%, rgba(19,17,15,0) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ height: 700, alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: p(2, 12),
          }}
        >
          <BrandMark size={48} />
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 38,
              letterSpacing: "0.3em",
              color: C.cream,
            }}
          >
            THE MILLION SQUARES
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: SERIF,
            fontSize: 88,
            lineHeight: 1.06,
            color: C.cream,
            textAlign: "center",
            opacity: p(8, 22),
            translate: `0px ${mix(p(8, 22), 40, 0)}px`,
          }}
        >
          One photo.
          <br />
          One <Em>story.</Em> Forever.
        </div>
        <div
          style={{
            marginTop: 48,
            padding: "24px 54px",
            borderRadius: 999,
            background: C.orange,
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 40,
            opacity: p(20, 32),
            scale: String(mix(p(20, 32), 0.85, 1) * pulse),
          }}
        >
          Claim your square — $10
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
