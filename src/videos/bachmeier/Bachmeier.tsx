import React, { useEffect, useState } from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Sfx } from "../../shared/Sfx";
import { clamp, loadFonts } from "../../shared/theme";
import { Captions, Flash, Grain, Vignette, loadCaseFonts } from "./look";
import {
  Board,
  Divided,
  End,
  Grave,
  Hook,
  Marianne,
  Press,
  Sentence,
  Shots,
  TrialSlug,
  Wall,
} from "./scenes";

export const FPS = 30;
export const DURATION = 2641; // 88.03s source

/*
 * Measured for this clip (no burned-in captions): head top ~y=790,
 * chin ~y=1360, hands come up to the chest. Overlays live above y≈760;
 * our captions sit at y≈1480, under the chin even at the 1.18 punch-in.
 */
const FACE = { x: 540, y: 1070 };
const CAPTION_Y = 1478;

/** Story sections are graded; the present day (the wall) is clean. */
const PRESENT = 1992;

const IMPACTS = [130, 966, 972, 978];

type Seg = [from: number, to: number, s0: number, s1: number];
const ZOOM: Seg[] = [
  [0, 129, 1.0, 1.05],
  [130, 210, 1.17, 1.1], // punch-in on "shot"
  [210, 686, 1.0, 1.0],
  [686, 965, 1.0, 1.08], // slow push while she walks into court
  [966, 1044, 1.18, 1.1], // punch-in on the shots
  [1044, 1540, 1.0, 1.0],
  [1540, 1990, 1.0, 1.13], // slow push on the personal lines
  [1990, DURATION, 1.0, 1.0],
];

const useCamera = () => {
  const frame = useCurrentFrame();
  const seg = ZOOM.find(([a, b]) => frame >= a && frame < b) ?? ZOOM[0];
  const [a, b, s0, s1] = seg;
  const punch = s0 > s1;
  const s = interpolate(frame, [a, b], [s0, s1], {
    ...clamp,
    easing: punch ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad),
  });
  let dx = 0;
  let dy = 0;
  for (const i of IMPACTS) {
    const t = frame - i;
    if (t >= 0 && t < 14) {
      const k = Math.exp(-t / 3.5);
      dx += 16 * Math.sin(t * 2.4) * k;
      dy += 10 * Math.cos(t * 3.1) * k;
    }
  }
  return { s, dx, dy };
};

export const Bachmeier: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    Promise.all([loadFonts(), loadCaseFonts()]).then(() =>
      continueRender(handle),
    );
  }, [handle]);

  const frame = useCurrentFrame();
  const { s, dx, dy } = useCamera();
  const g = interpolate(frame, [PRESENT, PRESENT + 18], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* A-roll with camera moves and the case-file grade */}
      <AbsoluteFill
        style={{
          transformOrigin: `${FACE.x}px ${FACE.y}px`,
          transform: `translate(${dx}px, ${dy}px) scale(${s})`,
          filter: `grayscale(${0.62 * g}) sepia(${0.12 * g}) contrast(${
            1 + 0.14 * g
          }) brightness(${1 - 0.06 * g})`,
        }}
      >
        <Video name="A-roll" src={staticFile("bachmeier/source.mp4")} />
      </AbsoluteFill>
      <Vignette opacity={g} />

      {/* Cutaways (above the head only) */}
      <Sequence name="1981 · Lübeck court"  durationInFrames={120}>
        <Hook />
      </Sequence>
      <Sequence name="Her name: Marianne" from={210} durationInFrames={66}>
        <Marianne />
      </Sequence>
      <Sequence
        name="Board: 5 May 1980 · Anna · Grabowski · conviction"
        from={276}
        durationInFrames={410}
      >
        <Board />
      </Sequence>
      <Sequence name="6 March 1981 slug" from={688} durationInFrames={110}>
        <TrialSlug />
      </Sequence>
      <Sequence name="Pistol · shots · died" from={900} durationInFrames={144}>
        <Shots />
      </Sequence>
      <Sequence name="Arrested · press photo" from={1044} durationInFrames={80}>
        <Press />
      </Sequence>
      <Sequence name="Germany divided" from={1124} durationInFrames={252}>
        <Divided />
      </Sequence>
      <Sequence
        name="1983 · 6 years, served 3"
        from={1384}
        durationInFrames={156}
      >
        <Sentence />
      </Sequence>
      {/* 1540–1878: speaker only (personal lines) */}
      <Sequence name="Grave: love and loss" from={1878} durationInFrames={112}>
        <Grave />
      </Sequence>
      <Sequence name="Present: the wall" from={PRESENT} durationInFrames={486}>
        <Wall />
      </Sequence>
      <Sequence name="End card" from={2478} durationInFrames={DURATION - 2478}>
        <End />
      </Sequence>

      <Grain opacity={0.32 * g} />
      <Flash at={IMPACTS} />

      {/* Sound design (voice is the clip's own audio) */}
      <Sfx at={0} name="drone" volume={0.14} />
      <Sfx at={130} name="shot" volume={0.22} />
      <Sfx at={130} name="boom" volume={0.3} />
      <Sfx at={690} name="drone" volume={0.12} />
      <Sfx at={934} name="riser" volume={0.2} />
      <Sfx at={966} name="shot" volume={0.26} />
      <Sfx at={972} name="shot" volume={0.22} />
      <Sfx at={978} name="shot" volume={0.24} />

      <Captions y={CAPTION_Y} />
    </AbsoluteFill>
  );
};
