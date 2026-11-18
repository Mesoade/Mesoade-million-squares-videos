import { Composition } from "remotion";
import { DURATION, Day6, FPS } from "./videos/day6/Day6";
import {
  Bachmeier,
  DURATION as BACHMEIER_DURATION,
  FPS as BACHMEIER_FPS,
} from "./videos/bachmeier/Bachmeier";

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
        id="Bachmeier"
        component={Bachmeier}
        durationInFrames={BACHMEIER_DURATION}
        fps={BACHMEIER_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
