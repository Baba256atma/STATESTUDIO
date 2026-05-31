/**
 * E2:71 — Idle runtime stability watchdog (development diagnostics only).
 */

import { getHudLayoutWriteCounters } from "../layout/hudLayoutLogGuard";
import { devLogOnSignatureChange, stableDiagnosticSignature } from "./diagnosticIdleGate";

type IdleCounters = {
  layoutWrites: number;
  anchorWrites: number;
  auditRuns: number;
  resizeEvents: number;
  sceneWrites: number;
  panelWrites: number;
};

const counters: IdleCounters = {
  layoutWrites: 0,
  anchorWrites: 0,
  auditRuns: 0,
  resizeEvents: 0,
  sceneWrites: 0,
  panelWrites: 0,
};

let lastUserActionAt = Date.now();
let idleReported = false;
let watchdogStarted = false;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function bindUserActivityListeners(): void {
  if (typeof window === "undefined" || watchdogStarted) return;
  watchdogStarted = true;

  const markActive = () => {
    lastUserActionAt = Date.now();
    idleReported = false;
  };

  ["pointerdown", "keydown", "wheel", "touchstart", "resize"].forEach((eventName) => {
    window.addEventListener(eventName, markActive, { passive: true });
  });

  window.setInterval(() => {
    if (!isDev()) return;
    const idleMs = Date.now() - lastUserActionAt;
    if (idleMs < 10_000 || idleReported) return;

    const layout = getHudLayoutWriteCounters();
    const stableSignature = stableDiagnosticSignature({
      layoutWrites: layout.layoutWrites,
      anchorWrites: layout.anchorWrites,
      auditRuns: layout.auditRuns,
      resizeEvents: layout.resizeEvents,
      sceneWrites: counters.sceneWrites,
      panelWrites: counters.panelWrites,
    });
    idleReported = true;
    devLogOnSignatureChange("[Nexora][IdleRuntimeStable]", stableSignature, {
      idleMs,
      layoutWrites: layout.layoutWrites,
      anchorWrites: layout.anchorWrites,
      auditRuns: layout.auditRuns,
      resizeEvents: layout.resizeEvents,
      sceneWrites: counters.sceneWrites,
      panelWrites: counters.panelWrites,
    });
  }, 1000);
}

export function recordIdleRuntimeSceneWrite(): void {
  if (!isDev()) return;
  counters.sceneWrites += 1;
  bindUserActivityListeners();
}

export function recordIdleRuntimePanelWrite(): void {
  if (!isDev()) return;
  counters.panelWrites += 1;
  bindUserActivityListeners();
}

export function startIdleRuntimeWatchdog(): void {
  if (!isDev()) return;
  bindUserActivityListeners();
}

export function resetIdleRuntimeWatchdogForTests(): void {
  counters.layoutWrites = 0;
  counters.anchorWrites = 0;
  counters.auditRuns = 0;
  counters.resizeEvents = 0;
  counters.sceneWrites = 0;
  counters.panelWrites = 0;
  lastUserActionAt = Date.now();
  idleReported = false;
}
