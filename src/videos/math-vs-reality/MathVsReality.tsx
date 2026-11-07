import React, { useEffect, useState } from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import {
  Batches,
  Graduation,
  HundredViewers,
  MathVsLife,
  Mosaic,
  NotEasy,
  OnePercent,
  Payoff,
  RealityCheck,
  Runway,
  Social,
  TheMath,
  ThePlan,
  TwoLevers,
} from "./scenes";
import { EndCard, FavoritePhoto } from "../day6/scenes";
import { LayoutProvider } from "../../shared/layout";
import { loadFonts } from "../../shared/theme";
import { Em } from "../../shared/ui";

export const FPS = 30;
export const DURATION = 4348; // 144.94s source

export const MathVsReality: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    loadFonts().then(() => continueRender(handle));
  }, [handle]);

  return (
    // Measured for this clip: head top ~y=880, burned-in captions ~y=1300–1580.
    <LayoutProvider value={{ panelH: 830 }}>
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {/* A-roll: original talking-head clip with its burned-in captions and voice */}
        <Video name="A-roll" src={staticFile("math-vs-reality/source.mp4")} />

        {/* B-roll cutaways (panel sits above the speaker's head) */}
        <Sequence name="B: The plan (hook)" from={6} durationInFrames={99}>
          <ThePlan />
        </Sequence>
        <Sequence name="B: Social media" from={144} durationInFrames={135}>
          <Social />
        </Sequence>
        <Sequence name="B: 1% conversion" from={324} durationInFrames={156}>
          <OnePercent />
        </Sequence>
        <Sequence name="B: 100 see, 1 tells" from={672} durationInFrames={243}>
          <HundredViewers />
        </Sequence>
        <Sequence
          name="B: Million photos math"
          from={915}
          durationInFrames={185}
        >
          <TheMath />
        </Sequence>
        <Sequence name="B: Not easy" from={1100} durationInFrames={88}>
          <NotEasy />
        </Sequence>
        <Sequence name="B: 10M a month" from={1290} durationInFrames={122}>
          <Runway />
        </Sequence>
        <Sequence name="B: 12 months payoff" from={1412} durationInFrames={233}>
          <Payoff />
        </Sequence>
        <Sequence
          name="B: Math vs real life"
          from={1722}
          durationInFrames={114}
        >
          <MathVsLife />
        </Sequence>
        <Sequence name="B: Reality check" from={1845} durationInFrames={240}>
          <RealityCheck />
        </Sequence>
        <Sequence name="B: Two levers" from={2106} durationInFrames={186}>
          <TwoLevers />
        </Sequence>
        {/* 76–105s: speaker stays on screen (ethics, wanting diverse stories) */}
        <Sequence
          name="B: Graduation niche?"
          from={3150}
          durationInFrames={189}
        >
          <Graduation />
        </Sequence>
        <Sequence name="B: Batches" from={3525} durationInFrames={240}>
          <Batches />
        </Sequence>
        <Sequence name="B: Many groups" from={3828} durationInFrames={162}>
          <Mosaic />
        </Sequence>
        <Sequence
          name="B: Your story on the wall"
          from={4002}
          durationInFrames={138}
        >
          <FavoritePhoto
            title={
              <>
                Tell your <Em>story</Em>
              </>
            }
          />
        </Sequence>
        <Sequence name="B: End card" from={4245} durationInFrames={103}>
          <EndCard claimed={null} />
        </Sequence>
      </AbsoluteFill>
    </LayoutProvider>
  );
};
