import { Composition } from "remotion";
import { DURATION, Day6, FPS } from "./videos/day6/Day6";
import {
  DURATION as PROPOSAL_DURATION,
  FPS as PROPOSAL_FPS,
  Proposal,
} from "./videos/proposal/Proposal";

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
        id="Proposal"
        component={Proposal}
        durationInFrames={PROPOSAL_DURATION}
        fps={PROPOSAL_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
