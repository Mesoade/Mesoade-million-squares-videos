import React from "react";
import {
  AbsoluteFill,
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

/* All frame numbers below are local to the scene's Sequence. */

/** Fade a whole scene in/out (no wipe: this edit cuts and dissolves). */
const useInOut = (inF = 4, outF = 8) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return interpolate(frame, [0, inF, d - outF, d], [0, 1, 1, 0], clamp);
};

const Center: React.FC<{ y: number; children: React.ReactNode }> = ({
  y,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* 1. Hook: "In 1981, a mother walked into a courtroom in Germany"     */
/* ------------------------------------------------------------------ */
export const Hook: React.FC = () => {
  const o = useInOut(1, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={1} h={720} />
      <Center y={70}>
        <Typed
          text="CASE FILE  ·  WEST GERMANY"
          at={2}
          style={{ fontSize: 34, color: K.dim }}
        />
      </Center>
      <Center y={150}>
        <Stamp text="1981" at={8} size={330} />
      </Center>
      <Center y={480}>
        <Typed text="LÜBECK DISTRICT COURT" at={60} style={{ fontSize: 46 }} />
      </Center>
      <Underline at={74} y={548} w={560} />
    </AbsoluteFill>
  );
};

const Underline: React.FC<{ at: number; y: number; w: number }> = ({
  at,
  y,
  w,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 10], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 540 - w / 2,
        width: w * t,
        height: 6,
        background: K.red,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 2. "Her name was Marianne Bachmeier."                               */
/* ------------------------------------------------------------------ */
export const Marianne: React.FC = () => {
  const o = useInOut(4, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={1} h={760} />
      <Print
        src={img("marianne1982.jpg")}
        at={10}
        x={540}
        y={320}
        w={380}
        h={440}
        rotate={-3}
        objectPosition="50% 25%"
      />
      <Center y={580}>
        <Typed text="MARIANNE BACHMEIER" at={26} style={{ fontSize: 54 }} />
      </Center>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3. The board: date, Anna, Grabowski, red string, prior conviction   */
/*    (abs 276 → 686)                                                  */
/* ------------------------------------------------------------------ */
export const Board: React.FC = () => {
  const frame = useCurrentFrame();
  const o = useInOut(4, 10);
  // Anna slides left when Grabowski enters.
  const slide = interpolate(frame, [140, 156], [0, 1], {
    ...clamp,
    easing: EASE_IN_OUT,
  });
  const annaX = mix(slide, 540, 285);
  const string = interpolate(frame, [242, 256], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={1} h={790} />
      <Center y={52}>
        <Stamp text="5 MAY 1980" at={2} size={120} />
      </Center>
      <Print
        src={img("anna.jpg")}
        at={62}
        x={annaX}
        y={420}
        w={360}
        h={420}
        rotate={-2.5}
        gray={0.35}
        caption="ANNA, 7"
        objectPosition="50% 40%"
      />
      <Print
        src={img("grabowski.jpg")}
        at={152}
        x={790}
        y={420}
        w={420}
        h={420}
        rotate={2}
        caption="KLAUS GRABOWSKI, 35"
        objectPosition="45% 40%"
      />
      {/* red string between the two prints, on "murdered" */}
      {frame >= 242 ? (
        <>
          <Sfx at={242} name="boom" volume={0.35} />
          <svg
            width={1080}
            height={800}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <line
              x1={285}
              y1={232}
              x2={285 + (790 - 285) * string}
              y2={232 + (226 - 232) * string}
              stroke={K.red}
              strokeWidth={5}
            />
            <circle cx={285} cy={232} r={11} fill={K.red} />
            {string >= 1 ? (
              <circle cx={790} cy={226} r={11} fill={K.red} />
            ) : null}
          </svg>
        </>
      ) : null}
      {/* "convicted" lands at abs 612 = local 336 */}
      <div style={{ position: "absolute", left: 590, top: 360, width: 400 }}>
        <Stamp
          text="PRIOR CONVICTION"
          at={334}
          size={64}
          color={K.red}
          rotate={-9}
          boxed
          style={{
            background: "rgba(236,230,218,0.85)",
            display: "inline-block",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4. "Ten months later… the courtroom where he was standing trial"    */
/* ------------------------------------------------------------------ */
export const TrialSlug: React.FC = () => {
  const o = useInOut(6, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={0.85} h={360} />
      <Center y={70}>
        <Typed text="6 MARCH 1981" at={4} style={{ fontSize: 64 }} />
      </Center>
      <Center y={160}>
        <Typed
          text="TRIAL OF KLAUS GRABOWSKI · DAY 3"
          at={20}
          style={{ fontSize: 34, color: K.dim }}
        />
      </Center>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Pistol → shots → "Grabowski died in that courtroom"  (abs 900)   */
/* ------------------------------------------------------------------ */
export const Shots: React.FC = () => {
  const frame = useCurrentFrame();
  const slugO = interpolate(frame, [0, 6, 56, 64], [0, 1, 1, 0], clamp);
  const printO = interpolate(frame, [88, 92, 136, 144], [0, 1, 1, 0], clamp);
  const gray = interpolate(frame, [114, 124], [0.6, 1], clamp);
  const dark = interpolate(frame, [114, 124], [1, 0.55], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: slugO }}>
        <Scrim p={0.85} h={360} />
        <Center y={80}>
          <Typed
            text="SMUGGLED IN:"
            at={8}
            style={{ fontSize: 34, color: K.dim }}
          />
        </Center>
        <Center y={140}>
          <Stamp text="A BERETTA PISTOL" at={17} size={110} sfx={null} />
        </Center>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: printO }}>
        <Scrim p={1} h={780} />
        <div style={{ filter: `brightness(${dark})` }}>
          <Print
            src={img("grabowski.jpg")}
            at={92}
            x={540}
            y={330}
            w={520}
            h={440}
            rotate={-1.5}
            gray={gray}
            objectPosition="45% 40%"
            sfx={false}
          />
        </div>
        <Center y={590}>
          <Typed
            text="DIED IN THE COURTROOM"
            at={116}
            style={{ fontSize: 50, color: K.paper }}
          />
        </Center>
        <Underline at={128} y={652} w={620} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6. "Marianne was immediately arrested" — press photo (abs 1044)     */
/* ------------------------------------------------------------------ */
export const Press: React.FC = () => {
  const frame = useCurrentFrame();
  const o = useInOut(3, 4);
  const pops = [42, 47, 56, 63, 70];
  const flash = Math.max(
    0,
    ...pops.map((a) =>
      interpolate(frame, [a, a + 1, a + 4], [0, 0.7, 0], clamp),
    ),
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={1} h={780} />
      {pops.map((a) => (
        <Sfx key={a} at={a} name="shutter" volume={0.18} />
      ))}
      <Print
        src={img("marianne_press.jpg")}
        at={2}
        x={540}
        y={350}
        w={960}
        h={600}
        rotate={-1.2}
        gray={1}
        objectPosition="40% 50%"
        sfx={false}
      />
      <AbsoluteFill
        style={{
          height: 700,
          background: "white",
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />
      <div style={{ position: "absolute", left: 80, top: 668 }}>
        <Typed
          text="MARIANNE BACHMEIER, 1982"
          at={10}
          style={{ fontSize: 30, color: K.paper }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7. "Her actions divided Germany"  (abs 1124)                        */
/* ------------------------------------------------------------------ */
export const Divided: React.FC = () => {
  const frame = useCurrentFrame();
  const o = useInOut(2, 10);
  const line = interpolate(frame, [0, 12], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sfx at={0} name="boom" volume={0.3} />
      <Scrim p={1} h={780} />
      <Center y={56}>
        <Typed
          text="A COUNTRY DIVIDED"
          at={2}
          style={{ fontSize: 40, color: K.dim }}
        />
      </Center>
      <div
        style={{
          position: "absolute",
          left: 537,
          top: 130,
          width: 6,
          height: 520 * line,
          background: K.red,
        }}
      />
      {/* left: sympathy */}
      <div
        style={{
          position: "absolute",
          left: 30,
          width: 480,
          top: 230,
          textAlign: "center",
        }}
      >
        <Stamp text="A GRIEVING" at={62} size={104} sfx="thud" />
        <Stamp text="MOTHER" at={66} size={150} sfx={null} />
        <div
          style={{ marginTop: 26, display: "flex", justifyContent: "center" }}
        >
          <Typed
            text="PUSHED TO HER LIMITS"
            at={100}
            style={{ fontSize: 30, color: K.dim }}
          />
        </div>
      </div>
      {/* right: condemnation */}
      <div
        style={{
          position: "absolute",
          left: 570,
          width: 480,
          top: 230,
          textAlign: "center",
        }}
      >
        <Stamp text="JUSTICE IN" at={160} size={104} color={K.red} />
        <Stamp text="HER HANDS" at={164} size={104} color={K.red} sfx={null} />
        <div
          style={{ marginTop: 26, display: "flex", justifyContent: "center" }}
        >
          <Typed
            text="NEVER JUSTIFIED"
            at={228}
            style={{ fontSize: 30, color: K.dim }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8. "In 1983… six years in prison but only served three" (abs 1384)  */
/* ------------------------------------------------------------------ */
export const Sentence: React.FC = () => {
  const frame = useCurrentFrame();
  const o = useInOut(2, 10);
  const BAR_AT = 66;
  const SERVED_AT = 122;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={1} h={780} />
      <Center y={60}>
        <Stamp text="1983" at={4} size={190} />
      </Center>
      <Center y={262}>
        <Typed text="SENTENCED: 6 YEARS" at={48} style={{ fontSize: 44 }} />
      </Center>
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 26,
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
                  width: 110,
                  height: 160,
                  background: cut > 0.5 ? "transparent" : K.paper,
                  border: `4px solid ${K.paper}`,
                  boxSizing: "border-box",
                  opacity: t * mix(cut, 1, 0.5),
                  translate: `0px ${mix(t, 40, 0)}px`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 76,
                  width: 130 * cut,
                  height: 7,
                  background: K.red,
                  rotate: "-28deg",
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  textAlign: "center",
                  fontFamily: TYPE,
                  fontSize: 26,
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
      <Center y={600}>
        <Stamp text="SERVED: 3" at={SERVED_AT} size={96} color={K.red} />
      </Center>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9. "…how deeply love and loss can change someone" — grave (abs 1878)*/
/* ------------------------------------------------------------------ */
export const Grave: React.FC = () => {
  const o = useInOut(14, 14);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Scrim p={0.95} h={780} />
      <Print
        src={img("grave.jpg")}
        at={0}
        x={540}
        y={340}
        w={600}
        h={500}
        rotate={1.5}
        gray={0.2}
        objectPosition="45% 25%"
        sfx={false}
      />
      <Center y={630}>
        <Typed
          text="ANNA & MARIANNE · LÜBECK"
          at={16}
          sound={false}
          style={{ fontSize: 34, color: K.paper }}
        />
      </Center>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 10. Present day: the wall (brand look returns)   (abs 1992 → 2478)  */
/* ------------------------------------------------------------------ */
const COLS = 7;
const ROWS = 4;
const CELL = 112;
const GAP = 12;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const GRID_X = (1080 - GRID_W) / 2;
const GRID_Y = 150;
const cellXY = (r: number, c: number) => ({
  x: GRID_X + c * (CELL + GAP),
  y: GRID_Y + r * (CELL + GAP),
});
const MARIANNE_CELL = { r: 1, c: 3 };
const OTHER_CELLS: [number, number][] = [
  [0, 1],
  [2, 5],
  [3, 2],
  [0, 5],
  [2, 0],
  [3, 6],
];

const BrandPanel: React.FC<{ children: React.ReactNode; o: number }> = ({
  children,
  o,
}) => (
  <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill
      style={{
        height: 790,
        background: `linear-gradient(to bottom, rgba(19,17,15,0.97) 0%, rgba(19,17,15,0.95) 80%, rgba(19,17,15,0) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        height: 640,
        backgroundImage: `radial-gradient(ellipse 80% 70% at 50% 45%, rgba(36,29,24,0.9) 0%, rgba(19,17,15,0) 70%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

export const Wall: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const o = interpolate(frame, [0, 10], [0, 1], clamp);
  const FLY = 40;
  const fly = interpolate(frame, [FLY, FLY + 14], [0, 1], {
    ...clamp,
    easing: EASE_IN_OUT,
  });
  const m = cellXY(MARIANNE_CELL.r, MARIANNE_CELL.c);
  const mSize = mix(fly, 420, CELL);
  const mx = mix(fly, 540 - 210, m.x);
  const my = mix(fly, 130, m.y);
  const mIn = p(FLY - 12, FLY - 2);
  const glow = interpolate(
    frame,
    [FLY + 14, FLY + 22, FLY + 60],
    [0, 1, 0.55],
    clamp,
  );
  const ALL_GLOW = 371;
  const allGlow = interpolate(
    frame,
    [ALL_GLOW, ALL_GLOW + 8, ALL_GLOW + 40],
    [0, 1, 0.4],
    clamp,
  );
  return (
    <BrandPanel o={o}>
      <Sfx at={0} name="whoosh" />
      <div
        style={{
          position: "absolute",
          top: 62,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          opacity: p(2, 12),
        }}
      >
        <BrandMark size={34} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: "0.3em",
            color: C.cream,
          }}
        >
          THE MILLION SQUARES
        </div>
      </div>
      {/* empty squares */}
      {Array.from({ length: ROWS * COLS }).map((_, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const { x, y } = cellXY(r, c);
        const t = p(4 + i * 0.7, 16 + i * 0.7);
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
              opacity: t,
              scale: String(mix(t, 0.6, 1)),
            }}
          />
        );
      })}
      {/* other people's photos arrive on "ordinary everyday people" (abs 2256) */}
      {OTHER_CELLS.map(([r, c], i) => {
        const a = 262 + i * 5;
        const t = interpolate(frame, [a, a + 10], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const { x, y } = cellXY(r, c);
        return (
          <React.Fragment key={i}>
            <Sfx at={a} name="pop" volume={0.15} />
            <Img
              src={photo(PHOTOS[i])}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CELL,
                height: CELL,
                objectFit: "cover",
                opacity: t,
                scale: String(mix(t, 1.6, 1)),
                boxShadow: `0 0 ${30 * allGlow}px ${C.orange}`,
                outline:
                  allGlow > 0.05
                    ? `3px solid rgba(232,105,47,${allGlow})`
                    : undefined,
              }}
            />
          </React.Fragment>
        );
      })}
      {/* Marianne's picture goes on the wall */}
      <Sfx at={FLY - 10} name="whoosh" />
      <Sfx at={FLY + 14} name="pop" />
      <Sfx at={FLY + 16} name="ding" />
      <Sfx at={ALL_GLOW} name="ding" volume={0.15} />
      <div
        style={{
          position: "absolute",
          left: mx,
          top: my,
          width: mSize,
          height: mSize,
          opacity: mIn,
          boxShadow: `0 0 ${50 * glow}px ${C.orange}, 0 20px 50px rgba(0,0,0,0.5)`,
          outline: `${mix(fly, 10, 3)}px solid ${glow > 0.05 ? C.orange : C.cream}`,
          overflow: "hidden",
        }}
      >
        <Img
          src={img("marianne1982.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 25%",
            filter: "grayscale(1)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: GRID_Y + ROWS * (CELL + GAP) + 18,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 56,
          color: C.cream,
          opacity: p(70, 84),
          translate: `0px ${mix(p(70, 84), 30, 0)}px`,
        }}
      >
        <Em>Marianne</Em> Bachmeier
      </div>
    </BrandPanel>
  );
};

/* ------------------------------------------------------------------ */
/* 11. End card over "The Million Squares is a world for a million…"   */
/* ------------------------------------------------------------------ */
export const End: React.FC = () => {
  const p = useProgress();
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [60, 68, 80], [1, 1.08, 1], clamp);
  return (
    <BrandPanel o={1}>
      <Sfx at={62} name="ding" />
      <AbsoluteFill
        style={{
          height: 700,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: p(0, 10),
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
    </BrandPanel>
  );
};
