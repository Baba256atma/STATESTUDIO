import type { RightPanelState, RightPanelView } from "./rightPanelTypes";

export type PanelOpenSource =
  | "direct_open"
  | "legacy_alias"
  | "action_intent"
  | "guided_prompt"
  | "left_nav"
  | "inspector_section"
  | "cta"
  | "effect_auto"
  | "adapter_auto"
  | "unknown";

export type PanelRequestIntent = {
  requestedView: RightPanelView | null;
  source: PanelOpenSource;
  rawSource?: string | null;
  contextId?: string | null;
  clickedTab?: string | null;
  clickedNav?: string | null;
  legacyTab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  preserveIfSameContext?: boolean;
  allowAutoOverride?: boolean;
  close?: boolean;
};

export type PanelControllerContext = {
  currentPanelState: RightPanelState;
  explicitPanelIntent: {
    view: RightPanelView;
    source: string;
    clickedTab?: string | null;
    clickedNav?: string | null;
    timestamp: number;
  } | null;
  clickIntentLock: {
    view: RightPanelView;
    contextId: string | null;
    source: string;
    clickedKey: string | null;
    timestamp: number;
  } | null;
  hasMeaningfulObjectContext?: boolean;
  now: number;
};

type PanelDecisionBase = {
  nextState: RightPanelState;
  reason: string;
  normalizedSource: PanelOpenSource;
  resolvedView: RightPanelView;
};

export type PanelDecision =
  | (PanelDecisionBase & {
      kind: "open";
    })
  | (PanelDecisionBase & {
      kind: "preserve";
    })
  | (PanelDecisionBase & {
      kind: "block";
    })
  | (PanelDecisionBase & {
      kind: "close";
    });
