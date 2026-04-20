import type React from "react";
import type { LayoutMode, HUDTabKey as ContractHUDTabKey } from "../../lib/contracts";

export type HUDTabKey = ContractHUDTabKey | "kpi" | "scene" | "object" | "decisions";

export type HUDPanelsMap = Partial<Record<HUDTabKey, React.ReactNode>>;

export type HUDDockSide = "left" | "right";

export type HUDShellStatus = {
  loopsCount?: number;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  modeName?: string | null;
  modeLabel?: string | null;
};

export type HUDTheme = {
  bg?: string;
  border?: string;
  text?: string;
  mutedText?: string;
  accent?: string;
  panelBg?: string;
} | null;

export type HUDShellLayoutMode = LayoutMode;
