/**
 * Phase 4:4 — Timeline Intelligence logging.
 */

import type {
  DecisionWindowsCard,
  EventDensityCard,
  MilestonePressureCard,
  ScheduleDriftCard,
  TimelineIntelligenceSurfaceModel,
  TimelineMomentumCard,
} from "./timelineIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportTimelineIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `timeline:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TimelineIntelligence]", detail);
}

export function reportTimelineMomentum(momentum: TimelineMomentumCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `momentum:${momentum.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TimelineMomentum]", momentum);
}

export function reportMilestonePressure(pressure: MilestonePressureCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `milestone:${pressure.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][MilestonePressure]", pressure);
}

export function reportScheduleDrift(drift: ScheduleDriftCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `drift:${drift.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ScheduleDrift]", drift);
}

export function reportEventDensity(density: EventDensityCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `density:${density.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][EventDensity]", density);
}

export function reportDecisionWindow(window: DecisionWindowsCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `window:${window.status}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DecisionWindow]", window);
}

export function reportTimelineIntelligenceSurface(model: TimelineIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TimelineIntelligence]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    momentum: model.snapshot.momentum.level,
    milestonePressure: model.snapshot.milestonePressure.level,
    decisionWindow: model.snapshot.decisionWindows.status,
  });
}

export function resetTimelineIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
