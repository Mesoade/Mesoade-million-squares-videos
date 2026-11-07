import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { Panel } from "../../shared/Panel";
import { Sfx } from "../../shared/Sfx";
import {
  C,
  EASE_IN_OUT,
  EASE_OUT,
  SANS,
  SERIF,
  clamp,
} from "../../shared/theme";
import { Em, PHOTOS, Title, mix, photo, useProgress } from "../../shared/ui";

// ---------- small helpers ----------

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Orange-outlined pill used for verdicts ("felt conservative", ...). */
const Chip: React.FC<{
  children: React.ReactNode;
  p: number;
  top: number;
  solid?: boolean;
}> = ({ children, p, top, solid }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        padding: "14px 40px",
        borderRadius: 999,
        backgroundColor: solid ? C.orange : C.orangeSoft,
        border: `3px solid ${C.orange}`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 46,
        color: C.cream,
        opacity: p,
        scale: mix(p, 0.85, 1),
      }}
    >
      {children}
    </div>
  </div>
);

/** Rotated stamp that lands 1.8→1 (pair with a thud). */
const Stamp: React.FC<{ p: number; children: React.ReactNode }> = ({
  p,
  children,
}) => (
  <div
    style={{
      border: `10px solid ${C.orange}`,
      borderRadius: 24,
      padding: "14px 44px",
      backgroundColor: "rgba(19,17,15,0.88)",
      rotate: "-8deg",
      opacity: p,
      scale: mix(p, 1.8, 1),
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 92,
      letterSpacing: "0.12em",
      color: C.orange,
    }}
  >
    {children}
  </div>
);

const Small: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      color: C.dim,
      ...style,
    }}
  >
    {children}
  </div>
);

const PlayIcon: React.FC<{ size: number; color?: string }> = ({
  size,
  color = C.cream,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M13 9 L31 20 L13 31 Z" fill={color} />
  </svg>
);

const EyeIcon: React.FC<{ size: number; color?: string }> = ({
  size,
  color = C.cream,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path
      d="M3 20 C10 9, 30 9, 37 20 C30 31, 10 31, 3 20 Z"
      fill="none"
      stroke={color}
      strokeWidth={3}
    />
    <circle cx={20} cy={20} r={6} fill={color} />
  </svg>
);

const CapIcon: React.FC<{ size: number; color?: string }> = ({
  size,
  color = C.cream,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 8 L38 16 L20 24 L2 16 Z" fill={color} />
    <path d="M10 20 L10 28 C14 32, 26 32, 30 28 L30 20 L20 25 Z" fill={color} />
    <path d="M34 18 L34 29" stroke={color} strokeWidth={2.5} />
  </svg>
);

// ---------- 1. Hook: the original plan ----------

export const ThePlan: React.FC = () => {
  const p = useProgress();
  const frame = useCurrentFrame();
  const count = interpolate(frame, [4, 26], [0, 1_000_000], {
    ...clamp,
    easing: EASE_OUT,
  });
  const steps: { name: string; icon: React.ReactNode }[] = [
    { name: "Videos", icon: <PlayIcon size={80} /> },
    { name: "Views", icon: <EyeIcon size={84} /> },
    {
      name: "Stories",
      icon: (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            backgroundColor: C.orange,
          }}
        />
      ),
    },
  ];
  const BOX = 230;
  const GAP = 90;
  const W = 3 * BOX + 2 * GAP;
  const X0 = (1080 - W) / 2;
  const glow = p(60, 70);

  return (
    <Panel label="The original plan">
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={30 + i * 9} name="pop" volume={0.2} />
      ))}
      <Sfx at={60} name="ding" />
      <Title top={100} p={p(0, 12)} size={86}>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(count)}</span>{" "}
        <Em>stories</Em>
      </Title>
      {steps.map((s, i) => {
        const pr = p(30 + i * 9, 42 + i * 9);
        const x = X0 + i * (BOX + GAP);
        const isLast = i === 2;
        return (
          <React.Fragment key={s.name}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: 300,
                width: BOX,
                height: BOX,
                borderRadius: 28,
                backgroundColor: C.bgRaised,
                border: `3px solid ${isLast && glow > 0 ? C.orange : C.line}`,
                boxShadow: isLast
                  ? `0 0 ${glow * 50}px ${C.orange}`
                  : undefined,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                opacity: pr,
                translate: `0px ${mix(pr, 40, 0)}px`,
                scale: isLast ? mix(glow, 1, 1.06) : 1,
              }}
            >
              {s.icon}
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 36,
                  color: isLast ? C.orange : C.cream,
                }}
              >
                {s.name}
              </div>
            </div>
            {i < 2 ? (
              <div
                style={{
                  position: "absolute",
                  left: x + BOX + 18,
                  top: 300 + BOX / 2 - 30,
                  fontFamily: SANS,
                  fontSize: 52,
                  color: C.dim,
                  opacity: p(36 + i * 9, 46 + i * 9),
                }}
              >
                →
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 50,
          color: C.dim,
          opacity: p(64, 76),
        }}
      >
        That was the plan.
      </div>
    </Panel>
  );
};

// ---------- 2. User acquisition through social media ----------

export const Social: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const phones = [
    { x: 540, scale: 1, delay: 4 },
    { x: 250, scale: 0.82, delay: 10 },
    { x: 830, scale: 0.82, delay: 14 },
  ];
  const PW = 230;
  const PH = 410;

  return (
    <Panel label="User acquisition">
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={40 + i * 10} name="pop" volume={0.13} />
      ))}
      <Title top={100} p={p(0, 12)} size={80}>
        Through <Em>social media</Em>
      </Title>
      {/* view "particles": small squares rising out of the phones */}
      {new Array(26).fill(0).map((_, i) => {
        const ph = phones[i % 3];
        const start = 36 + i * 3.4;
        const t = interpolate(frame, [start, start + 40], [0, 1], clamp);
        const drift = ((i * 37) % 9) - 4;
        const size = 14 + ((i * 13) % 12);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ph.x + drift * 18 - size / 2,
              top: mix(t, 470, 220) - size / 2,
              width: size,
              height: size,
              borderRadius: 3,
              backgroundColor: i % 5 === 0 ? C.orange : C.cream,
              opacity: t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.9 : 0,
            }}
          />
        );
      })}
      {[...phones].reverse().map((ph, i) => {
        const pr = p(ph.delay, ph.delay + 14);
        const play = interpolate(
          frame,
          [ph.delay + 14, ph.delay + 110],
          [0, 1],
          clamp,
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ph.x - PW / 2,
              top: 260,
              width: PW,
              height: PH,
              borderRadius: 34,
              backgroundColor: "#0b0a09",
              border: `6px solid ${C.line}`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              opacity: pr,
              scale: ph.scale * mix(pr, 0.85, 1),
              translate: `0px ${mix(pr, 50, 0)}px`,
              overflow: "hidden",
            }}
          >
            <AbsoluteFill
              style={{
                backgroundImage: `radial-gradient(ellipse at 50% 35%, #2a221c 0%, #0b0a09 75%)`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: "rgba(242,236,226,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayIcon size={60} />
              </div>
            </AbsoluteFill>
            <div
              style={{
                position: "absolute",
                left: 18,
                bottom: 52,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <EyeIcon size={34} color={C.orange} />
              <div
                style={{
                  height: 12,
                  width: mix(play, 10, 130),
                  borderRadius: 6,
                  backgroundColor: C.orange,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                height: 8,
                width: `${play * 100}%`,
                backgroundColor: C.cream,
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 50,
          color: C.dim,
          opacity: p(88, 100),
        }}
      >
        get a lot of views…
      </div>
    </Panel>
  );
};

// ---------- 3. My assumption: 1% conversion ----------

export const OnePercent: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const val = interpolate(frame, [8, 30], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const landed = p(30, 40);

  return (
    <Panel label="My assumption">
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={10 + i * 4} name="tick" />
      ))}
      <Sfx at={30} name="ding" />
      <Sfx at={100} name="pop" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 300,
            lineHeight: 1,
            color: C.orange,
            fontVariantNumeric: "tabular-nums",
            opacity: p(0, 8),
            scale: mix(landed, 1.12, 1),
            textShadow: `0 0 ${landed * 40}px rgba(232,105,47,0.45)`,
          }}
        >
          {val >= 0.999 ? "1" : val.toFixed(1)}%
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 64,
            color: C.cream,
            marginTop: 10,
            opacity: p(26, 38),
            translate: `0px ${mix(p(26, 38), 30, 0)}px`,
          }}
        >
          <Em>conversion</Em>
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 36,
            color: C.dim,
            marginTop: 14,
            opacity: p(40, 52),
          }}
        >
          of people who see a video tell their story
        </div>
      </AbsoluteFill>
      <Chip p={p(100, 112)} top={650}>
        felt conservative
      </Chip>
    </Panel>
  );
};

// ---------- 4. What 1% means: 100 see a video, 1 tells a story ----------

export const HundredViewers: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const CELL = 40;
  const GAP = 10;
  const W = 10 * CELL + 9 * GAP;
  const X0 = (1080 - W) / 2;
  const ONE = 44;
  const ON = 123;
  const on = p(ON, ON + 10);
  const swap = p(165, 177);
  const seen = Math.min(
    100,
    Math.floor(interpolate(frame, [6, 66], [0, 100], clamp)),
  );

  return (
    <Panel label="What 1% means" noExit>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} at={10 + i * 10} name="tick" volume={0.16} />
      ))}
      <Sfx at={ON} name="ding" />
      <Sfx at={165} name="pop" volume={0.22} />
      <Title top={100} p={p(0, 12) * (1 - swap)} size={80}>
        <Em>100</Em> people see a video
      </Title>
      <Title top={100} p={swap} size={80}>
        <Em>1</Em> tells their story
      </Title>
      {new Array(100).fill(0).map((_, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const t = 6 + i * 0.6;
        const appear = interpolate(frame, [t, t + 8], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const isOne = i === ONE;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + col * (CELL + GAP),
              top: 232 + row * (CELL + GAP),
              width: CELL,
              height: CELL,
              borderRadius: 6,
              backgroundColor: isOne && on > 0 ? C.orange : "#3a322b",
              border: `2px solid ${isOne && on > 0 ? C.orange : C.line}`,
              opacity: appear * (isOne ? 1 : mix(on, 1, 0.6)),
              scale:
                mix(appear, 0.6, 1) * (isOne && on > 0 ? mix(on, 2.2, 1) : 1),
              boxShadow:
                isOne && on > 0 ? `0 0 ${24 * on}px ${C.orange}` : undefined,
              zIndex: isOne ? 2 : 1,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 740,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 36,
          color: C.dim,
          opacity: p(6, 16),
        }}
      >
        <span style={{ color: C.cream, fontVariantNumeric: "tabular-nums" }}>
          {on > 0 ? "1" : seen}
        </span>
        {on > 0 ? " of 100 posts a story on the wall" : " people watching"}
      </div>
    </Panel>
  );
};

// ---------- 5. The math: a million photos needs 100M views ----------

export const TheMath: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const views = interpolate(frame, [104, 136], [0, 100_000_000], {
    ...clamp,
    easing: EASE_OUT,
  });
  const done = p(136, 146);
  const row = (top: number, pr: number, children: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 24,
        opacity: pr,
        translate: `0px ${mix(pr, 40, 0)}px`,
      }}
    >
      {children}
    </div>
  );
  const big: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 116,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  };
  const unit: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 40,
    color: C.dim,
  };

  return (
    <Panel label="The math" noEnter noExit>
      <Sfx at={4} name="pop" />
      <Sfx at={50} name="pop" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={106 + i * 6} name="tick" />
      ))}
      <Sfx at={136} name="ding" />
      <Title top={100} p={p(0, 12)} size={80}>
        A <Em>million</Em> photos
      </Title>
      {row(
        260,
        p(4, 16),
        <>
          <span style={{ ...big, color: C.cream }}>1,000,000</span>
          <span style={unit}>stories</span>
        </>,
      )}
      {row(
        405,
        p(50, 62),
        <>
          <span style={{ ...big, fontSize: 90, color: C.orange }}>÷ 1%</span>
          <span style={unit}>conversion</span>
        </>,
      )}
      <div
        style={{
          position: "absolute",
          top: 530,
          left: 160,
          right: 160,
          height: 4,
          backgroundColor: C.line,
          scale: `${p(90, 104)} 1`,
        }}
      />
      {row(
        570,
        p(100, 110),
        <>
          <span
            style={{
              ...big,
              color: done > 0 ? C.orange : C.cream,
              scale: mix(done, 1.08, 1),
            }}
          >
            {fmt(views)}
          </span>
          <span style={unit}>views</span>
        </>,
      )}
    </Panel>
  );
};

// ---------- 6. 100M views is not easy ----------

export const NotEasy: React.FC = () => {
  const p = useProgress();
  const stamp = p(46, 54);

  return (
    <Panel label="The catch" noEnter>
      <Sfx at={46} name="thud" />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
          opacity: mix(stamp, 1, 0.6),
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 150,
            color: C.cream,
            lineHeight: 1,
          }}
        >
          100,000,000
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 48,
            color: C.dim,
            marginTop: 16,
          }}
        >
          views
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 330,
        }}
      >
        <Stamp p={stamp}>NOT EASY</Stamp>
      </AbsoluteFill>
    </Panel>
  );
};

// ---------- 7. The runway: 10M views a month ----------

export const Runway: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const W_ = 140;
  const H_ = 120;
  const G = 16;
  const W = 6 * W_ + 5 * G;
  const X0 = (1080 - W) / 2;
  const FILL0 = 52;
  const STEP = 4;

  return (
    <Panel label="The runway" noExit>
      {new Array(12).fill(0).map((_, i) => (
        <Sfx key={i} at={FILL0 + i * STEP} name="tick" volume={0.16} />
      ))}
      <Title top={100} p={p(0, 12)} size={80}>
        <Em>10M</Em> views a month
      </Title>
      {new Array(12).fill(0).map((_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const appear = interpolate(frame, [4 + i * 1.2, 14 + i * 1.2], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const fill = p(FILL0 + i * STEP, FILL0 + i * STEP + 6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + col * (W_ + G),
              top: 270 + row * (H_ + 70),
              width: W_,
              height: H_,
              borderRadius: 16,
              border: `3px solid ${fill > 0 ? C.orange : C.line}`,
              backgroundColor: fill > 0 ? C.orange : "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: appear,
              scale: mix(appear, 0.7, 1) * (fill > 0 ? mix(fill, 1.15, 1) : 1),
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 40,
                color: fill > 0 ? C.bg : C.dim,
              }}
            >
              10M
            </div>
            <div
              style={{
                position: "absolute",
                top: H_ + 12,
                fontFamily: SANS,
                fontSize: 20,
                letterSpacing: "0.12em",
                whiteSpace: "nowrap",
                color: C.dim,
              }}
            >
              MONTH {i + 1}
            </div>
          </div>
        );
      })}
    </Panel>
  );
};

// ---------- 8. 12 months → 120M views → every square filled ----------

export const Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const views = interpolate(frame, [62, 100], [10_000_000, 120_000_000], {
    ...clamp,
    easing: EASE_OUT,
  });
  const stories = interpolate(frame, [150, 172], [0, 1_200_000], {
    ...clamp,
    easing: EASE_OUT,
  });
  const bar = p(172, 200, EASE_IN_OUT);
  const full = p(200, 210);
  const BAR_W = 840;

  return (
    <Panel label="Within 12 months" noEnter>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} at={64 + i * 6} name="tick" volume={0.18} />
      ))}
      <Sfx at={100} name="pop" />
      <Sfx at={126} name="pop" volume={0.2} />
      <Sfx at={150} name="pop" />
      <Sfx at={200} name="ding" />
      <Title top={100} p={p(0, 12)} size={80}>
        If the math <Em>holds</Em>
      </Title>
      <div
        style={{
          position: "absolute",
          top: 232,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: p(40, 52),
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 104,
            color: C.cream,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmt(views)}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 38, color: C.dim }}>
          {" "}
          views
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 372,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 48,
          color: C.orange,
          opacity: p(126, 136),
          translate: `0px ${mix(p(126, 136), 30, 0)}px`,
        }}
      >
        × 1% conversion
      </div>
      <div
        style={{
          position: "absolute",
          top: 448,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: p(150, 160),
          translate: `0px ${mix(p(150, 160), 30, 0)}px`,
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 92,
            color: C.orange,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          = {fmt(stories)}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 38, color: C.dim }}>
          {" "}
          stories
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 610,
          left: (1080 - BAR_W) / 2,
          width: BAR_W,
          height: 56,
          borderRadius: 14,
          border: `3px solid ${full > 0 ? C.orange : C.line}`,
          overflow: "hidden",
          opacity: p(166, 176),
          boxShadow: `0 0 ${full * 40}px rgba(232,105,47,0.5)`,
        }}
      >
        <div
          style={{
            width: `${bar * 100}%`,
            height: "100%",
            backgroundColor: C.orange,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 690,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 36,
          color: C.dim,
          opacity: p(166, 176),
        }}
      >
        1,000,000 squares
        <span
          style={{
            color: C.cream,
            fontWeight: 600,
            opacity: full,
          }}
        >
          {"  ·  all filled ✓"}
        </span>
      </div>
    </Panel>
  );
};

// ---------- 9. Math vs real life ----------

export const MathVsLife: React.FC = () => {
  const p = useProgress();
  const X0 = 150;
  const X1 = 930;
  const Y0 = 720;
  const Y1 = 260;
  const plan = p(10, 40, EASE_IN_OUT);
  const real = p(40, 80, EASE_IN_OUT);
  const N = 40;
  const realPts = new Array(N + 1).fill(0).map((_, i) => {
    const t = i / N;
    const y = Y0 - 18 - t * 60 - Math.sin(t * 13) * 12 - Math.sin(t * 29) * 5;
    return [X0 + t * (X1 - X0), y] as const;
  });
  const realD = realPts
    .map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`)
    .join(" ");
  const LEN = 900;

  return (
    <Panel label="But">
      <Sfx at={40} name="whoosh" volume={0.14} />
      <Sfx at={82} name="pop" volume={0.2} />
      <Title top={100} p={p(0, 12)} size={80}>
        Math ≠ <Em>real life</Em>
      </Title>
      <svg width={1080} height={830} style={{ position: "absolute" }}>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={C.line} strokeWidth={3} />
        <line
          x1={X0}
          y1={Y0}
          x2={X0}
          y2={Y1 - 20}
          stroke={C.line}
          strokeWidth={3}
        />
        <line
          x1={X0}
          y1={Y0}
          x2={mix(plan, X0, X1)}
          y2={mix(plan, Y0, Y1)}
          stroke={C.cream}
          strokeWidth={6}
          strokeDasharray="18 14"
        />
        <path
          d={realD}
          fill="none"
          stroke={C.orange}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={LEN * (1 - real)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: X1 - 260,
          top: Y1 - 10,
          fontFamily: SANS,
          fontSize: 34,
          color: C.cream,
          opacity: p(36, 46),
        }}
      >
        the math
      </div>
      <div
        style={{
          position: "absolute",
          left: X1 - 220,
          top: Y0 - 150,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          color: C.orange,
          opacity: p(76, 86),
        }}
      >
        real life
      </div>
    </Panel>
  );
};

// ---------- 10. Reality check: views and stories ----------

export const RealityCheck: React.FC = () => {
  const p = useProgress();
  const BAR_W = 840;
  const X0 = (1080 - BAR_W) / 2;
  const row = (
    top: number,
    label: string,
    note: string,
    a: number,
    planText: string,
    actualW: number,
    actualText: string,
  ) => {
    const pr = p(a, a + 14);
    const act = p(a + 26, a + 38);
    return (
      <div
        style={{
          position: "absolute",
          top,
          left: X0,
          width: BAR_W,
          opacity: pr,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Small>{label}</Small>
          <Small style={{ letterSpacing: "0.08em", textTransform: "none" }}>
            {note}
          </Small>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 64,
            width: BAR_W * mix(pr, 0.3, 1),
            borderRadius: 12,
            backgroundColor: "#2b2520",
            border: `2px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            fontFamily: SANS,
            fontSize: 32,
            color: C.dim,
            boxSizing: "border-box",
          }}
        >
          {planText}
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              height: 64,
              width: actualW,
              borderRadius: 4,
              backgroundColor: C.orange,
              opacity: act,
              boxShadow: `0 0 ${act * 20}px ${C.orange}`,
            }}
          />
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 34,
              color: C.orange,
              opacity: act,
              translate: `${mix(act, -20, 0)}px 0px`,
            }}
          >
            {actualText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Panel label="Reality check">
      <Sfx at={36} name="pop" />
      <Sfx at={186} name="thud" volume={0.4} />
      <Title top={100} p={p(0, 12)} size={80}>
        Way <Em>less</Em> than planned
      </Title>
      {/* 2,000 / 10,000,000 of 840px is under a pixel: drawn at the 6px minimum */}
      {row(
        250,
        "Views",
        "to scale",
        10,
        "Plan: 10,000,000 a month",
        6,
        "Now: a couple thousand",
      )}
      {row(
        510,
        "Stories",
        "not to scale",
        150,
        "Plan: 1 in every 100 viewers",
        60,
        "Now: way less",
      )}
    </Panel>
  );
};

// ---------- 11. Two levers ----------

export const TwoLevers: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const tick = interpolate(frame, [56, 84], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const target = tick < 0.5 ? "100M" : "1B";
  const bump = interpolate(frame, [70, 76, 86], [1, 1.15, 1], clamp);
  const CW = 420;
  const CH = 420;
  const card = (
    x: number,
    pr: number,
    label: string,
    body: React.ReactNode,
    caption: string,
    hot: boolean,
  ) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 250,
        width: CW,
        height: CH,
        borderRadius: 30,
        backgroundColor: C.bgRaised,
        border: `3px solid ${hot ? C.orange : C.line}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        opacity: pr,
        translate: `0px ${mix(pr, 50, 0)}px`,
      }}
    >
      <Small>{label}</Small>
      {body}
      <div style={{ fontFamily: SANS, fontSize: 30, color: C.dim }}>
        {caption}
      </div>
    </div>
  );
  const bigNum: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 120,
    lineHeight: 1.1,
    color: C.orange,
  };

  return (
    <Panel label="So, either">
      <Sfx at={8} name="pop" volume={0.22} />
      <Sfx at={72} name="ding" />
      <Sfx at={100} name="pop" volume={0.2} />
      <Sfx at={112} name="pop" />
      <Title top={100} p={p(0, 12)} size={80}>
        Two <Em>levers</Em>
      </Title>
      {card(
        80,
        p(8, 22),
        "More views",
        <div style={{ ...bigNum, scale: bump }}>{target}</div>,
        "views to reach",
        tick > 0.5,
      )}
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 425,
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: C.bg,
          border: `3px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 38,
          color: C.cream,
          opacity: p(100, 110),
          scale: mix(p(100, 110), 0.6, 1),
          zIndex: 2,
        }}
      >
        or
      </div>
      {card(
        580,
        p(112, 126),
        "Better stories",
        <div
          style={{ ...bigNum, display: "flex", alignItems: "center", gap: 10 }}
        >
          1%
          <span
            style={{
              fontSize: 90,
              translate: `0px ${mix(p(126, 140), 20, -6)}px`,
            }}
          >
            ↑
          </span>
        </div>,
        "a higher conversion rate",
        p(126, 140) > 0.5,
      )}
    </Panel>
  );
};

// ---------- 12. Niche down to graduation stories? ----------

export const Graduation: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const COLS = 8;
  const ROWS = 4;
  const T = 92;
  const G = 12;
  const W = COLS * T + (COLS - 1) * G;
  const X0 = (1080 - W) / 2;

  return (
    <Panel label="Niche it down?">
      <Sfx at={150} name="pop" />
      <Title top={100} p={p(0, 12)} size={80}>
        Just <Em>graduation</Em> stories?
      </Title>
      {new Array(COLS * ROWS).fill(0).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const t = 6 + (col + row) * 1.2;
        const appear = interpolate(frame, [t, t + 10], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + col * (T + G),
              top: 250 + row * (T + G),
              width: T,
              height: T,
              borderRadius: 12,
              backgroundColor: C.bgRaised,
              border: `2px solid ${C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: appear,
              scale: mix(appear, 0.6, 1),
            }}
          >
            <CapIcon size={52} color={C.dim} />
          </div>
        );
      })}
      <Chip p={p(150, 162)} top={700}>
        a short-term fix
      </Chip>
    </Panel>
  );
};

// ---------- 13. Unless in batches: one group a week ----------

export const Batches: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const COLW = 280;
  const GAP = 40;
  const X0 = (1080 - (3 * COLW + 2 * GAP)) / 2;
  const T = 50;
  const G = 8;
  const weeks = [
    { name: "Graduation", color: C.orange, fill: 22 },
    { name: "Football", color: C.cream, fill: 168 },
    { name: "Next group…", color: C.dim, fill: -1 },
  ];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);

  return (
    <Panel label="Unless… in batches">
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`a${i}`} at={22 + i * 8} name="pop" volume={0.14} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`b${i}`} at={168 + i * 8} name="pop" volume={0.14} />
      ))}
      <Title top={100} p={p(0, 12)} size={80}>
        One <Em>group</Em> at a time
      </Title>
      {weeks.map((w, wi) => {
        const x = X0 + wi * (COLW + GAP);
        const colIn = p(4 + wi * 5, 16 + wi * 5);
        const isNext = w.fill < 0;
        const active = !isNext && frame >= w.fill;
        return (
          <div
            key={w.name}
            style={{
              position: "absolute",
              left: x,
              top: 240,
              width: COLW,
              height: 470,
              borderRadius: 24,
              border: isNext
                ? `3px dashed ${C.line}`
                : `3px solid ${active ? w.color : C.line}`,
              backgroundColor: isNext ? "transparent" : C.bgRaised,
              opacity:
                colIn * (isNext ? mix(p(200, 214), 0.5, 0.5 + 0.5 * pulse) : 1),
              translate: `0px ${mix(colIn, 40, 0)}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 26,
              boxSizing: "border-box",
            }}
          >
            <Small>Week {wi + 1}</Small>
            <div
              style={{
                marginTop: 26,
                width: 4 * T + 3 * G,
                display: "flex",
                flexWrap: "wrap",
                gap: G,
              }}
            >
              {new Array(16).fill(0).map((_, i) => {
                const on = isNext ? 0 : p(w.fill + i * 2, w.fill + i * 2 + 6);
                return (
                  <div
                    key={i}
                    style={{
                      width: T,
                      height: T,
                      borderRadius: 7,
                      backgroundColor: on > 0 ? w.color : "transparent",
                      border: `2px solid ${on > 0 ? w.color : C.line}`,
                      scale: on > 0 ? mix(on, 1.4, 1) : 1,
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                marginTop: 30,
                fontFamily: SERIF,
                fontStyle: isNext ? "italic" : "normal",
                fontSize: 40,
                color: active ? w.color : C.dim,
              }}
            >
              {w.name}
            </div>
          </div>
        );
      })}
    </Panel>
  );
};

// ---------- 14. The end goal: many groups, many stories ----------

export const Mosaic: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const COLS = 14;
  const ROWS = 6;
  const T = 52;
  const G = 8;
  const W = COLS * T + (COLS - 1) * G;
  const X0 = (1080 - W) / 2;
  // Groups are blocks of columns; real photo tiles sprinkled in.
  const groupColor = (col: number, row: number) => {
    const g = (Math.floor(col / 3.5) + (row >= 3 ? 1 : 0)) % 4;
    return [C.orange, C.cream, C.dim, "rgba(232,105,47,0.5)"][g];
  };
  const photos: Record<number, (typeof PHOTOS)[number]> = {
    15: "girl",
    24: "pets",
    37: "tulips",
    48: "balloon",
    61: "kids",
    74: "hands",
  };

  return (
    <Panel label="The end goal">
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={14 + i * 7} name="pop" volume={0.13} />
      ))}
      <Sfx at={110} name="pop" />
      <Title top={100} p={p(0, 12)} size={68}>
        <Em>Many</Em> groups, many stories
      </Title>
      {new Array(COLS * ROWS).fill(0).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const t = 6 + (col + row) * 1.6;
        const appear = interpolate(frame, [t, t + 10], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const ph = photos[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + col * (T + G),
              top: 250 + row * (T + G),
              width: T,
              height: T,
              borderRadius: 7,
              overflow: "hidden",
              backgroundColor: groupColor(col, row),
              opacity: appear,
              scale: mix(appear, 1.6, 1),
            }}
          >
            {ph ? (
              <Img
                src={photo(ph)}
                style={{ width: T, height: T, objectFit: "cover" }}
              />
            ) : null}
          </div>
        );
      })}
      <Chip p={p(110, 122)} top={660}>
        not just one story
      </Chip>
    </Panel>
  );
};
