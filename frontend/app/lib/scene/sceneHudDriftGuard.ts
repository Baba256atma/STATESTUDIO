import { recordRuntimeCycleEvent } from "../runtime/runtimeCycleDetector";
import { devLogOnSignatureChange } from "../runtime/diagnosticIdleGate";
import { shouldProceedRuntimeWrite } from "../runtime/idleRuntimeWriteGuard";
import { isIdleRuntimeLocked } from "../runtime/idleRuntimeStabilityGuard";
import { isStartupPhase } from "../runtime/startupPhase";
import { traceDriftSkipped } from "../runtime/runtimeChurnDiagnostics";
import { recordHudDriftIgnored } from "../debug/startupNoiseAudit";
import { shouldEmitSceneHudDriftWarning, resetSceneHudDriftWarningDeduperForTests } from "./sceneHudDriftWarningDeduper";
import {
  areHudLayoutRectsStable,
  buildSceneHudLayoutSignature,
  inferSceneHudDriftReason,
  normalizeHudLayoutRect,
  readSceneHudLayoutSnapshot,
  type SceneHudDriftPanelId,
  type SceneHudLayoutRect,
  type SceneHudLayoutSnapshot,
} from "./sceneHudLayoutSignature";

export type { SceneHudDriftPanelId } from "./sceneHudLayoutSignature";
export { HUD_DRIFT_PIXEL_TOLERANCE } from "./sceneHudLayoutSignature";

export type SceneHudDriftRect = SceneHudLayoutRect;

export type SceneHudDriftReport = {
  panelId: SceneHudDriftPanelId;
  before: SceneHudDriftRect;
  after: SceneHudDriftRect;
  action: string;
  driftReason?: string;
};

const PANEL_SELECTORS: Readonly<Record<SceneHudDriftPanelId, string>> = Object.freeze({
  sceneInfoHud: '[data-scene-hud-panel="sceneInfoHud"]',
  objectInfoHud: '[data-scene-hud-panel="objectInfoHud"]',
  timelineHud: '[data-scene-hud-panel="timelineHud"]',
  sceneToolbar: '[data-scene-hud-panel="sceneToolbar"]',
  executiveStatusHud: '[data-scene-hud-panel="executiveStatusHud"]',
  executiveWarRoomRibbon: '[data-scene-hud-panel="executiveWarRoomRibbon"]',
  quickActionsDock: '[data-scene-hud-panel="quickActionsDock"]',
});

type PanelLayoutState = {
  rect: SceneHudDriftRect;
  snapshot: SceneHudLayoutSnapshot;
};

const driftBaselines = new Map<string, Readonly<Partial<Record<SceneHudDriftPanelId, PanelLayoutState>>>>();
const lastDriftSignatureRef = new Map<string, string>();
const lastDriftEmittedAtRef = new Map<string, number>();
const pendingFrameJobs = new Map<string, number>();
const sceneActivityDriftCoarseKeys = new Set<string>();
const SCENE_HUD_DRIFT_DEV_COOLDOWN_MS = 20_000;

function isSceneActivityAction(action: string): boolean {
  return action.includes("scene-activity") || action.includes("scene_activity");
}

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function cancelPendingJob(key: string): void {
  const frameId = pendingFrameJobs.get(key);
  if (frameId != null && typeof window !== "undefined") {
    window.cancelAnimationFrame(frameId);
  }
  pendingFrameJobs.delete(key);
}

function scheduleAfterLayoutSettled(key: string, run: () => void): void {
  if (typeof window === "undefined") {
    run();
    return;
  }
  cancelPendingJob(key);
  const firstFrameId = window.requestAnimationFrame(() => {
    const frameId = window.requestAnimationFrame(() => {
      pendingFrameJobs.delete(key);
      run();
    });
    pendingFrameJobs.set(key, frameId);
  });
  pendingFrameJobs.set(key, firstFrameId);
}

function readPanelLayoutStates(root?: ParentNode | null): Partial<Record<SceneHudDriftPanelId, PanelLayoutState>> | null {
  if (typeof document === "undefined") return null;
  const scope = root ?? document;
  const states = {} as Partial<Record<SceneHudDriftPanelId, PanelLayoutState>>;
  const entries = Object.entries(PANEL_SELECTORS) as Array<[SceneHudDriftPanelId, string]>;

  for (const [panelId, selector] of entries) {
    const node = scope.querySelector(selector);
    if (!(node instanceof HTMLElement)) continue;
    const snapshot = readSceneHudLayoutSnapshot(node, panelId);
    states[panelId] = {
      rect: normalizeHudLayoutRect(snapshot),
      snapshot,
    };
  }

  return states;
}

function snapshotToRect(snapshot: SceneHudLayoutSnapshot): SceneHudDriftRect {
  return normalizeHudLayoutRect(snapshot);
}

export function buildSceneHudDriftSignature(
  panelId: SceneHudDriftPanelId,
  before: SceneHudDriftRect,
  after: SceneHudDriftRect,
  action: string
): string {
  return JSON.stringify({
    action,
    panelId,
    before,
    after,
    driftReason: inferSceneHudDriftReason(before, after),
  });
}

export function markSceneHudDriftBaseline(action: string, root?: ParentNode | null): void {
  const states = readPanelLayoutStates(root);
  if (!states) return;
  driftBaselines.set(action, states);
}

export function scheduleSceneHudDriftBaseline(action: string, root?: ParentNode | null): void {
  scheduleAfterLayoutSettled(`${action}:baseline`, () => {
    markSceneHudDriftBaseline(action, root);
  });
}

export function detectSceneHudDrift(action: string, root?: ParentNode | null): SceneHudDriftReport[] {
  if (!isDev()) return [];

  const beforeStates = driftBaselines.get(action);
  const afterStates = readPanelLayoutStates(root);
  if (!beforeStates || !afterStates) {
    markSceneHudDriftBaseline(action, root);
    return [];
  }

  const reports: SceneHudDriftReport[] = [];
  const nextBaseline = { ...beforeStates } as Partial<Record<SceneHudDriftPanelId, PanelLayoutState>>;

  (Object.keys(PANEL_SELECTORS) as SceneHudDriftPanelId[]).forEach((panelId) => {
    const beforeState = beforeStates[panelId];
    const afterState = afterStates[panelId];
    if (!beforeState || !afterState) return;

    const beforeRect = beforeState.rect;
    const afterRect = afterState.rect;
    const beforeLayoutSignature = buildSceneHudLayoutSignature(beforeState.snapshot);
    const afterLayoutSignature = buildSceneHudLayoutSignature(afterState.snapshot);

    if (beforeLayoutSignature === afterLayoutSignature) {
      nextBaseline[panelId] = afterState;
      return;
    }

    if (areHudLayoutRectsStable(beforeRect, afterRect)) {
      nextBaseline[panelId] = afterState;
      return;
    }

    const driftReason = inferSceneHudDriftReason(beforeRect, afterRect);
    if (isSceneActivityAction(action)) {
      const coarseKey = `${panelId}:${afterLayoutSignature}`;
      if (
        isStartupPhase() ||
        isIdleRuntimeLocked() ||
        sceneActivityDriftCoarseKeys.has(coarseKey)
      ) {
        recordHudDriftIgnored();
        nextBaseline[panelId] = afterState;
        return;
      }
      sceneActivityDriftCoarseKeys.add(coarseKey);
    }
    const driftSignature = buildSceneHudDriftSignature(panelId, beforeRect, afterRect, action);
    const driftKey = `${action}:${panelId}`;
    const lastDriftSignature = lastDriftSignatureRef.get(driftKey) ?? null;
    const now = Date.now();
    const lastEmittedAt = lastDriftEmittedAtRef.get(driftKey) ?? 0;

    if (lastDriftSignature === driftSignature) {
      traceDriftSkipped({
        action,
        panelId,
        driftReason,
        driftSignature,
      });
      nextBaseline[panelId] = afterState;
      return;
    }

    lastDriftSignatureRef.set(driftKey, driftSignature);
    if (now - lastEmittedAt < SCENE_HUD_DRIFT_DEV_COOLDOWN_MS) {
      traceDriftSkipped({
        action,
        panelId,
        driftReason,
        driftSignature,
      });
      nextBaseline[panelId] = afterState;
      return;
    }

    const report: SceneHudDriftReport = {
      panelId,
      before: beforeRect,
      after: afterRect,
      action,
      driftReason,
    };
    reports.push(report);

    if (
      shouldEmitSceneHudDriftWarning(driftSignature) &&
      shouldProceedRuntimeWrite(`scene-hud-drift:${action}`, driftSignature)
    ) {
      lastDriftEmittedAtRef.set(driftKey, now);
      recordRuntimeCycleEvent("HudDrift", {
        signature: driftSignature,
        panelId,
        source: action,
      });
      devLogOnSignatureChange("[Nexora][SceneHudDriftDetected]", driftSignature, report, "warn", {
        cooldownMs: SCENE_HUD_DRIFT_DEV_COOLDOWN_MS,
      });
    }
  });

  if (reports.length === 0) {
    driftBaselines.set(action, afterStates);
    return reports;
  }

  driftBaselines.set(action, nextBaseline);
  return reports;
}

export function scheduleSceneHudDriftDetect(action: string, root?: ParentNode | null): void {
  scheduleAfterLayoutSettled(`${action}:detect`, () => {
    detectSceneHudDrift(action, root ?? null);
  });
}

export function resetSceneHudDriftGuardForTests(): void {
  driftBaselines.clear();
  lastDriftSignatureRef.clear();
  lastDriftEmittedAtRef.clear();
  pendingFrameJobs.clear();
  sceneActivityDriftCoarseKeys.clear();
  resetSceneHudDriftWarningDeduperForTests();
}
