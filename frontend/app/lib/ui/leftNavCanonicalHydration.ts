/**
 * Canonical left-navigation hydration contract.
 * Server and client must derive active section / nav mode from the same inputs.
 */

import {
  mapLegacyTabToRightPanelView,
  resolveRightPanelShellSectionForView,
} from "./right-panel/rightPanelRouter.ts";
import {
  DEFAULT_NEXORA_LEFT_NAV_MODE,
  type NexoraLeftNavMode,
} from "./nexoraLeftNavContract.ts";
import type { RightPanelView } from "./right-panel/rightPanelTypes.ts";

export type CanonicalActiveSectionKey =
  | "scene"
  | "objects"
  | "sources"
  | "scenario"
  | "settings"
  | "kpi"
  | "risk"
  | "loops"
  | "timeline"
  | "conflict"
  | "explanation"
  | "focus"
  | "memory"
  | "risk_flow"
  | "replay"
  | "advice"
  | "opponent"
  | "patterns"
  | "executive"
  | "war_room"
  | "collaboration"
  | "workspace"
  | "fragility"
  | "reports"
  | "input";

export type CanonicalLeftNavSnapshot = {
  activeSection: CanonicalActiveSectionKey;
  activeNavMode: NexoraLeftNavMode;
  rightPanelView: RightPanelView;
  signature: string;
};

export function resolveSectionForRightPanelView(
  view: RightPanelView | null,
  preferredLegacyTab: string | null = null
): CanonicalActiveSectionKey | null {
  if (!view) return null;
  const section = resolveRightPanelShellSectionForView(view, preferredLegacyTab);
  return section as CanonicalActiveSectionKey | null;
}

export function resolveLeftNavModeForSection(section: CanonicalActiveSectionKey): NexoraLeftNavMode {
  if (section === "sources" || section === "input") return "sources";
  if (section === "scenario" || section === "advice") return "scenario";
  if (section === "timeline") return "timeline";
  if (section === "war_room") return "war_room";
  if (section === "settings") return "settings";
  if (
    section === "risk" ||
    section === "fragility" ||
    section === "conflict" ||
    section === "risk_flow" ||
    section === "explanation"
  ) {
    return "risk";
  }
  return DEFAULT_NEXORA_LEFT_NAV_MODE;
}

export function buildLeftNavHydrationSignature(snapshot: Pick<CanonicalLeftNavSnapshot, "activeSection" | "activeNavMode" | "rightPanelView">): string {
  return JSON.stringify({
    activeSection: snapshot.activeSection,
    activeNavMode: snapshot.activeNavMode,
    rightPanelView: snapshot.rightPanelView ?? null,
  });
}

export function resolveCanonicalLeftNavHydrationState(input: {
  preferredRightPanelTab?: string | null;
  shellMode?: "dashboard" | "studio";
}): CanonicalLeftNavSnapshot {
  const shellMode = input.shellMode ?? "dashboard";
  if (shellMode === "studio") {
    const activeSection: CanonicalActiveSectionKey = "objects";
    const activeNavMode = resolveLeftNavModeForSection(activeSection);
    return {
      activeSection,
      activeNavMode,
      rightPanelView: null,
      signature: buildLeftNavHydrationSignature({
        activeSection,
        activeNavMode,
        rightPanelView: null,
      }),
    };
  }

  const preferredRightPanelTab = input.preferredRightPanelTab ?? null;
  const rightPanelView = mapLegacyTabToRightPanelView(preferredRightPanelTab);
  const activeSection =
    resolveSectionForRightPanelView(rightPanelView, preferredRightPanelTab) ?? "executive";
  const activeNavMode = resolveLeftNavModeForSection(activeSection);
  return {
    activeSection,
    activeNavMode,
    rightPanelView,
    signature: buildLeftNavHydrationSignature({
      activeSection,
      activeNavMode,
      rightPanelView,
    }),
  };
}

export function resolveCanonicalLeftNavSnapshotFromView(
  rightPanelView: RightPanelView | null,
  fallbackSection: CanonicalActiveSectionKey = "executive"
): CanonicalLeftNavSnapshot {
  const activeSection = resolveSectionForRightPanelView(rightPanelView) ?? fallbackSection;
  const activeNavMode = resolveLeftNavModeForSection(activeSection);
  return {
    activeSection,
    activeNavMode,
    rightPanelView,
    signature: buildLeftNavHydrationSignature({
      activeSection,
      activeNavMode,
      rightPanelView,
    }),
  };
}

const hydrationLogKeys = new Set<string>();

function shouldEmitHydrationLog(key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (hydrationLogKeys.has(key)) return false;
  hydrationLogKeys.add(key);
  return true;
}

export function reportLeftNavHydrationCheck(payload: {
  seedSignature: string;
  runtimeSignature: string;
  seed: CanonicalLeftNavSnapshot;
  runtime: CanonicalLeftNavSnapshot;
  matched: boolean;
}): void {
  const key = `check:${payload.seedSignature}:${payload.runtimeSignature}`;
  if (!shouldEmitHydrationLog(key)) return;
  void import("../architecture/nexoraArchitectureFreezeRuntime.ts").then(({ validateNavigationHydrationContract }) => {
    validateNavigationHydrationContract({
      matched: payload.matched,
      seedSignature: payload.seedSignature,
      runtimeSignature: payload.runtimeSignature,
      source: "reportLeftNavHydrationCheck",
    });
  });
  globalThis.console?.info?.("[Nexora][HydrationCheck]", {
    matched: payload.matched,
    seed: {
      activeSection: payload.seed.activeSection,
      activeNavMode: payload.seed.activeNavMode,
      rightPanelView: payload.seed.rightPanelView ?? null,
    },
    runtime: {
      activeSection: payload.runtime.activeSection,
      activeNavMode: payload.runtime.activeNavMode,
      rightPanelView: payload.runtime.rightPanelView ?? null,
    },
  });
}

export function reportLeftNavCanonical(payload: {
  activeSection: CanonicalActiveSectionKey;
  activeNavMode: NexoraLeftNavMode;
  rightPanelView: RightPanelView;
  source: string;
}): void {
  const key = `canonical:${payload.source}:${buildLeftNavHydrationSignature(payload)}`;
  if (!shouldEmitHydrationLog(key)) return;
  globalThis.console?.info?.("[Nexora][LeftNavCanonical]", payload);
}

export function reportLeftNavHydrationMismatch(payload: {
  seed: CanonicalLeftNavSnapshot;
  runtime: CanonicalLeftNavSnapshot;
  preserved: CanonicalLeftNavSnapshot;
  source: string;
}): void {
  const key = `mismatch:${payload.source}:${payload.seed.signature}:${payload.runtime.signature}`;
  if (!shouldEmitHydrationLog(key)) return;
  globalThis.console?.warn?.("[Nexora][HydrationMismatch]", {
    source: payload.source,
    seed: {
      activeSection: payload.seed.activeSection,
      activeNavMode: payload.seed.activeNavMode,
      rightPanelView: payload.seed.rightPanelView ?? null,
    },
    runtime: {
      activeSection: payload.runtime.activeSection,
      activeNavMode: payload.runtime.activeNavMode,
      rightPanelView: payload.runtime.rightPanelView ?? null,
    },
    preserved: {
      activeSection: payload.preserved.activeSection,
      activeNavMode: payload.preserved.activeNavMode,
      rightPanelView: payload.preserved.rightPanelView ?? null,
    },
    action: "preserved_seed_state",
  });
}

export function resetLeftNavHydrationLogsForTests(): void {
  hydrationLogKeys.clear();
}
