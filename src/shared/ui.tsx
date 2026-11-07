import React from "react";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE_OUT, SERIF, clamp } from "./theme";

/** 0→1 progress between two frames, eased. */
export const useProgress = () => {
  const frame = useCurrentFrame();
  return (a: number, b: number, easing = EASE_OUT) =>
    interpolate(frame, [a, b], [0, 1], { ...clamp, easing });
};

export const mix = (p: number, a: number, b: number) => a + (b - a) * p;

export const Title: React.FC<{
  children: React.ReactNode;
  top: number;
  p: number;
  size?: number;
}> = ({ children, top, p, size = 92 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 80,
      right: 80,
      textAlign: "center",
      fontFamily: SERIF,
      fontWeight: 400,
      fontSize: size,
      lineHeight: 1.08,
      color: C.cream,
      opacity: p,
      translate: `0px ${mix(p, 40, 0)}px`,
    }}
  >
    {children}
  </div>
);

export const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontStyle: "italic", color: C.orange }}>{children}</span>
);

export const PHOTOS = [
  "girl",
  "hands",
  "pets",
  "tulips",
  "balloon",
  "kids",
] as const;
export const photo = (name: (typeof PHOTOS)[number]) =>
  staticFile(`brand/photos/${name}.jpg`);

/** Brand mark: 2x2 squares, top-left orange. */
export const BrandMark: React.FC<{ size?: number }> = ({ size = 52 }) => {
  const t = (size * 22) / 52;
  const o = size - t;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={0} y={0} width={t} height={t} fill={C.orange} />
      <rect x={o} y={0} width={t} height={t} fill={C.cream} />
      <rect x={0} y={o} width={t} height={t} fill={C.cream} />
      <rect x={o} y={o} width={t} height={t} fill={C.cream} />
    </svg>
  );
};
