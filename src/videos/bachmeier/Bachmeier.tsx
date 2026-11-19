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
import { Captions, Flash, Grain, loadCaseFonts } from "./look";
import {
  Anna,
  Conviction,
  Died,
  Divided,
  End,
  Grabowski,
  Grave,
  Hook,
  Marianne,
  May1980,
  Press,
  Sentence,
  Trial,
  Wall,
} from "./scenes";

export const FPS = 30;
export const DURATION = 2641; // 88.03s source

/*
 * Documentary edit. The A-roll is pre-graded with ffmpeg (Netflix-doc look:
 * lifted teal shadows, warm skin, soft highlight roll-off, vignette) using
 * scripts/doc-grade.txt → public/bachmeier/graded.mp4.
 *
 * About half the runtime is full-screen B-roll with the voice underneath;
 * the speaker is on screen for the hook-to-shot beat, the shots, and the
 * personal lines.
 *
 * Measured: head top ~y=790, chin ~y=1360. Captions sit at y≈1478.
 */
const FACE = { x: 540, y: 1070 };
const CAPTION_Y = 1478;

const IMPACTS = [130, 966, 972, 978];

type Seg = [from: number, to: number, s0: number, s1: number];
// Camera on the speaker (only matters where the speaker is visible).
const ZOOM: Seg[] = [
  [84, 129, 1.0, 1.05],
  [130, 210, 1.22, 1.12], // punch-in on "shot"
  [546, 686, 1.0, 1.07],
  [790, 965, 1.0, 1.12], // slow creep: "she secretly brought a pistol"
  [966, 990, 1.24, 1.16], // punch-in on the shots
  [1300, 1341, 1.0, 1.04],
  [1342, 1384, 1.18, 1.14], // snap on "never ever be justified"
  [1540, 1712, 1.0, 1.08],
  [1713, 1878, 1.16, 1.22], // snap on "taking the life of your beloved daughter"
  [1992, 2030, 1.0, 1.04],
  [2160, 2256, 1.0, 1.06],
];

const useCamera = () => {
  const frame = useCurrentFrame();
  const seg = ZOOM.find(([a, b]) => frame >= a && frame < b);
  let s = 1;
  if (seg) {
    const [a, b, s0, s1] = seg;
    const punch = s0 > s1;
    s = interpolate(frame, [a, b], [s0, s1], {
      ...clamp,
      easing: punch ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad),
    });
  }
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

/** Hide the wall while the speaker talks between its two halves. */
const WallWindow: React.FC = () => {
  const frame = useCurrentFrame(); // local to the Sequence (abs 2030)
  const hidden = frame >= 130 && frame < 226; // abs 2160–2256
  return (
    <AbsoluteFill style={{ opacity: hidden ? 0 : 1 }}>
      <Wall zoomOutAt={226} glowAt={333} />
    </AbsoluteFill>
  );
};

export const Bachmeier: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    Promise.all([loadFonts(), loadCaseFonts()]).then(() =>
      continueRender(handle),
    );
  }, [handle]);

  const { s, dx, dy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* A-roll (pre-graded) with camera moves */}
      <AbsoluteFill
        style={{
          transformOrigin: `${FACE.x}px ${FACE.y}px`,
          transform: `translate(${dx}px, ${dy}px) scale(${s})`,
        }}
      >
        <Video name="A-roll" src={staticFile("bachmeier/graded.mp4")} />
      </AbsoluteFill>

      {/* ---- B-roll: full screen unless noted ---- */}
      <Sequence name="FS: 1981 · Lübeck" durationInFrames={84}>
        <Hook />
      </Sequence>
      {/* 84–210 speaker: "pulled out a gun and shot…" */}
      <Sequence name="FS: Marianne" from={210} durationInFrames={66}>
        <Marianne />
      </Sequence>
      <Sequence name="FS: 5 May 1980" from={276} durationInFrames={54}>
        <May1980 />
      </Sequence>
      <Sequence name="FS: Anna" from={330} durationInFrames={98}>
        <Anna />
      </Sequence>
      <Sequence name="FS: Grabowski" from={428} durationInFrames={118}>
        <Grabowski />
      </Sequence>
      <Sequence
        name="Overlay: prior conviction"
        from={546}
        durationInFrames={140}
      >
        <Conviction />
      </Sequence>
      <Sequence name="FS: 6 March 1981" from={686} durationInFrames={104}>
        <Trial />
      </Sequence>
      {/* 790–990 speaker: pistol, shots */}
      <Sequence name="FS: Grabowski died" from={990} durationInFrames={54}>
        <Died />
      </Sequence>
      <Sequence name="FS: Press" from={1044} durationInFrames={80}>
        <Press />
      </Sequence>
      <Sequence name="FS: Divided" from={1124} durationInFrames={176}>
        <Divided />
      </Sequence>
      {/* 1300–1384 speaker: "never ever be justified" */}
      <Sequence name="FS: 1983 sentence" from={1384} durationInFrames={156}>
        <Sentence />
      </Sequence>
      {/* 1540–1878 speaker: personal lines */}
      <Sequence name="FS: Grave" from={1878} durationInFrames={114}>
        <Grave />
      </Sequence>
      {/* 1992–2030 speaker: "Today, this is the picture…" */}
      <Sequence name="FS: The wall" from={2030} durationInFrames={440}>
        <WallWindow />
      </Sequence>
      <Sequence
        name="Overlay: end card"
        from={2470}
        durationInFrames={DURATION - 2470}
      >
        <End />
      </Sequence>

      <Grain opacity={0.14} />
      <Flash at={IMPACTS} />

      {/* Sound design (voice is the clip's own audio) */}
      <Sfx at={0} name="drone" volume={0.14} />
      <Sfx at={130} name="shot" volume={0.22} />
      <Sfx at={130} name="boom" volume={0.3} />
      <Sfx at={430} name="drone" volume={0.12} />
      <Sfx at={934} name="riser" volume={0.2} />
      <Sfx at={966} name="shot" volume={0.26} />
      <Sfx at={972} name="shot" volume={0.22} />
      <Sfx at={978} name="shot" volume={0.24} />
      <Sfx at={1342} name="thud" volume={0.35} />
      <Sfx at={1713} name="thud" volume={0.25} />

      <Captions y={CAPTION_Y} />
    </AbsoluteFill>
  );
};
