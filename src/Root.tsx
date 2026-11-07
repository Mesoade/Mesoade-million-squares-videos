import { Composition } from "remotion";
import { DURATION, Day6, FPS } from "./videos/day6/Day6";
import {
  DURATION as MVR_DURATION,
  FPS as MVR_FPS,
  MathVsReality,
} from "./videos/math-vs-reality/MathVsReality";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Day6"
        component={Day6}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MathVsReality"
        component={MathVsReality}
        durationInFrames={MVR_DURATION}
        fps={MVR_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
