import React, { createContext, useContext } from "react";

/**
 * Per-video layout, measured from the source footage (see CLAUDE.md →
 * "Measure the footage"). Each video sets its own values; nothing here is
 * a fixed rule.
 */
export type VideoLayout = {
  /** Bottom edge of the B-roll panel in px. Keep it above the face. */
  panelH: number;
};

const LayoutContext = createContext<VideoLayout>({ panelH: 830 });

export const LayoutProvider: React.FC<{
  value: VideoLayout;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
);

export const useLayout = () => useContext(LayoutContext);
