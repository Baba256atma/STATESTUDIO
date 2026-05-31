import type React from "react";

import { getExecutiveHudViewport } from "../layout/executiveHudHydrationRuntime";
import { buildHudAnchorRegistrationSignature } from "../layout/hudLayoutSignature";
import { emitHudLayoutLog, recordHudLayoutWrite } from "../layout/hudLayoutLogGuard";
import { recordRuntimeCycleEvent } from "../runtime/runtimeCycleDetector";
import { devLogOnSignatureChange } from "../runtime/diagnosticIdleGate";
import { shouldProceedRuntimeWrite } from "../runtime/idleRuntimeWriteGuard";
import { isIdleRuntimeLocked } from "../runtime/idleRuntimeStabilityGuard";
import { isStartupPhase } from "../runtime/startupPhase";

export type ExecutiveAnchorZone =
  | "top-left"
  | "top-center"
  | "top-right"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type HudPanelId =
  | "sceneInfoHud"
  | "objectInfoHud"
  | "timelineHud"
  | "quickActionsDock"
  | "executiveStatusHud"
  | "aiAssistant"
  | "scenarioSuggestions"
  | "scenarioComparison"
  | "decisionStrip"
  | "simulationHud"
  | "riskFlowHud"
  | "propagationHud"
  | "customExecutiveWidget";

export type HudAnchorPosition = {
  top?: number | string;
  left?: number | string;
  right?: number;
  bottom?: number | string;
  transform?: string;
};

export type HudViewportOffsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type HudAnchorRegistration = {
  panelId: HudPanelId;
  anchorPosition: HudAnchorPosition;
  dockZone: ExecutiveAnchorZone;
  viewportOffsets: HudViewportOffsets;
  visible: boolean;
  collapsedState: boolean;
  reservedSpace: HudViewportOffsets;
  maxWidth?: string;
  zIndex?: number;
};

export type HudLayoutSnapshot = {
  panels: Readonly<Record<string, HudAnchorRegistration>>;
  reservations: Readonly<Record<ExecutiveAnchorZone, HudViewportOffsets>>;
  viewport: {
    width: number;
    height: number;
  };
};

const DEFAULT_VIEWPORT = Object.freeze({ width: 1440, height: 900 });
const DEFAULT_OFFSETS: HudViewportOffsets = Object.freeze({ top: 12, right: 12, bottom: 12, left: 12 });
const DEFAULT_RESERVATION: HudViewportOffsets = Object.freeze({ top: 0, right: 0, bottom: 0, left: 0 });

const DEFAULT_PANEL_ZONES: Readonly<Record<HudPanelId, ExecutiveAnchorZone>> = Object.freeze({
  sceneInfoHud: "top-left",
  objectInfoHud: "top-right",
  timelineHud: "bottom-center",
  quickActionsDock: "bottom-center",
  executiveStatusHud: "top-right",
  aiAssistant: "right",
  scenarioSuggestions: "right",
  scenarioComparison: "right",
  decisionStrip: "bottom-center",
  simulationHud: "left",
  riskFlowHud: "left",
  propagationHud: "left",
  customExecutiveWidget: "right",
});

const panels = new Map<HudPanelId, HudAnchorRegistration>();
const driftBaselines = new Map<string, string>();
const devLogKeys = new Set<string>();
const sceneActivityHudDriftLogged = { value: false };
const HUD_DRIFT_DEV_COOLDOWN_MS = 20_000;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function devLog(label: string, payload: Record<string, unknown>, dedupeKey: string, warn = false): void {
  if (!isDev()) return;
  const key = `${label}:${dedupeKey}`;
  if (devLogKeys.has(key)) return;
  devLogKeys.add(key);
  const logger = warn ? console.warn : console.debug;
  logger(label, payload);
}

function readViewport() {
  const viewport = getExecutiveHudViewport();
  return {
    width: viewport.width,
    height: viewport.height,
  };
}

function zonePosition(zone: ExecutiveAnchorZone, offsets: HudViewportOffsets): HudAnchorPosition {
  if (zone === "top-left") return { top: offsets.top, left: offsets.left };
  if (zone === "top-center") return { top: offsets.top, left: "50%", transform: "translateX(-50%)" };
  if (zone === "top-right") return { top: offsets.top, right: offsets.right };
  if (zone === "left") return { top: "50%", left: offsets.left, transform: "translateY(-50%)" };
  if (zone === "right") return { top: "50%", right: offsets.right, transform: "translateY(-50%)" };
  if (zone === "bottom-left") return { bottom: offsets.bottom, left: offsets.left };
  if (zone === "bottom-right") return { bottom: offsets.bottom, right: offsets.right };
  return { bottom: offsets.bottom, left: "50%", transform: "translateX(-50%)" };
}

function responsiveZone(panelId: HudPanelId, zone: ExecutiveAnchorZone, viewportWidth: number): ExecutiveAnchorZone {
  if (viewportWidth >= 768) return zone;
  if (panelId === "sceneInfoHud") return "top-left";
  if (panelId === "objectInfoHud") return "top-right";
  if (panelId === "timelineHud" || panelId === "quickActionsDock") return "bottom-center";
  if (zone === "right") return "bottom-right";
  if (zone === "left") return "bottom-left";
  return zone;
}

function withDefaults(input: {
  panelId: HudPanelId;
  anchorPosition?: HudAnchorPosition;
  dockZone?: ExecutiveAnchorZone;
  viewportOffsets?: Partial<HudViewportOffsets>;
  visible?: boolean;
  collapsedState?: boolean;
  reservedSpace?: Partial<HudViewportOffsets>;
  maxWidth?: string;
  zIndex?: number;
}): HudAnchorRegistration {
  const viewport = readViewport();
  const dockZone = responsiveZone(input.panelId, input.dockZone ?? DEFAULT_PANEL_ZONES[input.panelId], viewport.width);
  const viewportOffsets = { ...DEFAULT_OFFSETS, ...input.viewportOffsets };
  return {
    panelId: input.panelId,
    dockZone,
    viewportOffsets,
    anchorPosition: input.anchorPosition ?? zonePosition(dockZone, viewportOffsets),
    visible: input.visible ?? true,
    collapsedState: input.collapsedState ?? false,
    reservedSpace: { ...DEFAULT_RESERVATION, ...input.reservedSpace },
    maxWidth: input.maxWidth,
    zIndex: input.zIndex,
  };
}

export function registerHudPanel(input: Parameters<typeof withDefaults>[0]): HudAnchorRegistration {
  const next = withDefaults(input);
  panels.set(next.panelId, next);
  devLog("[Nexora][HudAnchorRegistered]", {
    panelId: next.panelId,
    dockZone: next.dockZone,
    anchorPosition: next.anchorPosition,
  }, `${next.panelId}:${next.dockZone}`);
  return next;
}

export function unregisterHudPanel(panelId: HudPanelId): void {
  panels.delete(panelId);
}

export function getHudAnchor(panelId: HudPanelId): HudAnchorRegistration | null {
  return panels.get(panelId) ?? null;
}

export function updateHudAnchor(
  panelId: HudPanelId,
  patch: Partial<Omit<HudAnchorRegistration, "panelId">>
): HudAnchorRegistration {
  const previous = panels.get(panelId);
  const viewport = readViewport();
  const next = withDefaults({
    panelId,
    anchorPosition: patch.anchorPosition ?? previous?.anchorPosition,
    dockZone: patch.dockZone ?? previous?.dockZone,
    viewportOffsets: patch.viewportOffsets ?? previous?.viewportOffsets,
    visible: patch.visible ?? previous?.visible,
    collapsedState: patch.collapsedState ?? previous?.collapsedState,
    reservedSpace: patch.reservedSpace ?? previous?.reservedSpace,
    maxWidth: patch.maxWidth ?? previous?.maxWidth,
    zIndex: patch.zIndex ?? previous?.zIndex,
  });

  const nextSignature = buildHudAnchorRegistrationSignature({
    panelId,
    dockZone: next.dockZone,
    anchorPosition: next.anchorPosition as Record<string, unknown>,
    visible: next.visible,
    collapsedState: next.collapsedState,
    viewportWidth: viewport.width,
  });

  if (previous) {
    const previousSignature = buildHudAnchorRegistrationSignature({
      panelId,
      dockZone: previous.dockZone,
      anchorPosition: previous.anchorPosition as Record<string, unknown>,
      visible: previous.visible,
      collapsedState: previous.collapsedState,
      viewportWidth: viewport.width,
    });
    if (previousSignature === nextSignature) {
      return previous;
    }
  }

  panels.set(panelId, next);
  recordHudLayoutWrite("anchor");
  emitHudLayoutLog(
    "[Nexora][HudAnchorUpdated]",
    "HudAnchorUpdated",
    `${panelId}:${nextSignature}`,
    {
      panelId,
      dockZone: next.dockZone,
      anchorPosition: next.anchorPosition,
    }
  );
  return next;
}

export function clampHudToViewport(
  panelId: HudPanelId,
  position: HudAnchorPosition,
  options?: {
    viewportWidth?: number;
    viewportHeight?: number;
    estimatedWidth?: number;
    estimatedHeight?: number;
    margin?: number;
  }
): HudAnchorPosition {
  const viewport = readViewport();
  const width = options?.viewportWidth ?? viewport.width;
  const height = options?.viewportHeight ?? viewport.height;
  const margin = options?.margin ?? 12;
  const estimatedWidth = options?.estimatedWidth ?? 300;
  const estimatedHeight = options?.estimatedHeight ?? 180;
  const next: HudAnchorPosition = { ...position };
  let clamped = false;

  if (typeof next.left === "number") {
    const clampedLeft = Math.max(margin, Math.min(next.left, width - estimatedWidth - margin));
    clamped ||= clampedLeft !== next.left;
    next.left = clampedLeft;
  }
  if (typeof next.right === "number") {
    const clampedRight = Math.max(margin, Math.min(next.right, width - estimatedWidth - margin));
    clamped ||= clampedRight !== next.right;
    next.right = clampedRight;
  }
  if (typeof next.top === "number") {
    const clampedTop = Math.max(margin, Math.min(next.top, height - estimatedHeight - margin));
    clamped ||= clampedTop !== next.top;
    next.top = clampedTop;
  }
  if (typeof next.bottom === "number") {
    const clampedBottom = Math.max(margin, Math.min(next.bottom, height - estimatedHeight - margin));
    clamped ||= clampedBottom !== next.bottom;
    next.bottom = clampedBottom;
  }

  if (clamped) {
    devLog("[Nexora][HudViewportClamp]", { panelId, from: position, to: next }, `${panelId}:${JSON.stringify(next)}`);
  }
  return next;
}

export function getHudLayoutSnapshot(): HudLayoutSnapshot {
  const viewport = readViewport();
  const snapshotPanels = Object.fromEntries(Array.from(panels.entries())) as Record<string, HudAnchorRegistration>;
  const reservations = Array.from(panels.values()).reduce(
    (acc, panel) => {
      const current = acc[panel.dockZone] ?? { ...DEFAULT_RESERVATION };
      acc[panel.dockZone] = {
        top: Math.max(current.top, panel.reservedSpace.top),
        right: Math.max(current.right, panel.reservedSpace.right),
        bottom: Math.max(current.bottom, panel.reservedSpace.bottom),
        left: Math.max(current.left, panel.reservedSpace.left),
      };
      return acc;
    },
    {} as Record<ExecutiveAnchorZone, HudViewportOffsets>
  );
  devLog("[Nexora][HudLayoutSnapshot]", {
    panelCount: panels.size,
    viewport,
  }, `${panels.size}:${viewport.width}x${viewport.height}`);
  return Object.freeze({
    panels: Object.freeze(snapshotPanels),
    reservations: Object.freeze(reservations),
    viewport,
  });
}

export function hudAnchorStyle(
  panelId: HudPanelId,
  input: {
    dockZone?: ExecutiveAnchorZone;
    anchorPosition?: HudAnchorPosition;
    viewportOffsets?: Partial<HudViewportOffsets>;
    visible?: boolean;
    collapsedState?: boolean;
    reservedSpace?: Partial<HudViewportOffsets>;
    maxWidth?: string;
    zIndex?: number;
    transitionMs?: number;
    estimatedWidth?: number;
    estimatedHeight?: number;
  }
): React.CSSProperties {
  const anchor = updateHudAnchor(panelId, {
    dockZone: input.dockZone,
    anchorPosition: input.anchorPosition,
    viewportOffsets: input.viewportOffsets ? { ...DEFAULT_OFFSETS, ...input.viewportOffsets } : undefined,
    visible: input.visible,
    collapsedState: input.collapsedState,
    reservedSpace: input.reservedSpace ? { ...DEFAULT_RESERVATION, ...input.reservedSpace } : undefined,
    maxWidth: input.maxWidth,
    zIndex: input.zIndex,
  });
  const position = clampHudToViewport(panelId, anchor.anchorPosition, {
    estimatedWidth: input.estimatedWidth,
    estimatedHeight: input.estimatedHeight,
  });
  const transitionMs = input.transitionMs ?? 0;
  return {
    position: "absolute",
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
    transform: position.transform,
    maxWidth: anchor.maxWidth,
    zIndex: anchor.zIndex,
    pointerEvents: "none",
    opacity: anchor.visible ? 1 : 0,
    transition: transitionMs
      ? `opacity ${transitionMs}ms ease, max-width ${transitionMs}ms ease`
      : undefined,
  };
}

const lastHudAnchoringDriftSignatureRef = new Map<string, string>();
const lastHudAnchoringDriftEmittedAtRef = new Map<string, number>();

export function markHudDriftBaseline(reason: string): void {
  const snapshot = getHudLayoutSnapshot();
  driftBaselines.set(reason, JSON.stringify(snapshot.panels));
}

export function detectHudDrift(reason: string): void {
  const before = driftBaselines.get(reason);
  if (!before) {
    markHudDriftBaseline(reason);
    return;
  }
  const after = JSON.stringify(getHudLayoutSnapshot().panels);
  if (before === after) {
    return;
  }

  const driftSignature = `${reason}:${after}`;
  const lastSignature = lastHudAnchoringDriftSignatureRef.get(reason) ?? null;
  const now = Date.now();
  const lastEmittedAt = lastHudAnchoringDriftEmittedAtRef.get(reason) ?? 0;
  if (lastSignature === driftSignature) {
    driftBaselines.set(reason, after);
    return;
  }
  lastHudAnchoringDriftSignatureRef.set(reason, driftSignature);
  if (now - lastEmittedAt < HUD_DRIFT_DEV_COOLDOWN_MS) {
    driftBaselines.set(reason, after);
    return;
  }

  if (
    reason === "scene-activity" &&
    (isStartupPhase() || isIdleRuntimeLocked() || sceneActivityHudDriftLogged.value)
  ) {
    driftBaselines.set(reason, after);
    return;
  }
  if (!shouldProceedRuntimeWrite(`hud-drift:${reason}`, driftSignature)) {
    driftBaselines.set(reason, after);
    return;
  }
  if (reason === "scene-activity") {
    sceneActivityHudDriftLogged.value = true;
  }
  lastHudAnchoringDriftEmittedAtRef.set(reason, now);

  devLogOnSignatureChange("[Nexora][HudDriftDetected]", driftSignature, { reason }, "warn", {
    cooldownMs: HUD_DRIFT_DEV_COOLDOWN_MS,
  });

  recordRuntimeCycleEvent("HudDrift", {
    signature: driftSignature,
    source: reason,
  });
}

export function resetHudAnchoringRuntimeForTests(): void {
  panels.clear();
  driftBaselines.clear();
  devLogKeys.clear();
  lastHudAnchoringDriftSignatureRef.clear();
  lastHudAnchoringDriftEmittedAtRef.clear();
  sceneActivityHudDriftLogged.value = false;
}
