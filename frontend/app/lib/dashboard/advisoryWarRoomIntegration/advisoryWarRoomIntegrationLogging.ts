/**
 * Phase 5:6 — Advisory–War Room Integration logging.
 */

import type { AdvisoryWarRoomIntegrationBundle } from "./advisoryWarRoomIntegrationContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportAdvisoryWarRoomIntegration(bundle: AdvisoryWarRoomIntegrationBundle): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `integration:${bundle.trace.pathLabel}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryWarRoomIntegration]", {
    path: bundle.trace.pathLabel,
    readiness: bundle.intake.readiness,
    focus: bundle.guidanceDelivery.snapshot.decisionFocus.focus,
  });
}

export function reportWarRoomIntake(intake: AdvisoryWarRoomIntegrationBundle["intake"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `intake:${intake.decisionFocus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][WarRoomIntake]", intake);
}

export function reportAdvisoryTransformation(
  transformation: AdvisoryWarRoomIntegrationBundle["transformation"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `transform:${transformation.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryTransformation]", transformation);
}

export function reportConfidencePropagation(
  propagation: AdvisoryWarRoomIntegrationBundle["confidencePropagation"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${propagation.evaluation.overall.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConfidencePropagation]", propagation);
}

export function reportExplainabilityPropagation(
  propagation: AdvisoryWarRoomIntegrationBundle["explainabilityPropagation"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `explain:${propagation.reasoningPath}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExplainabilityPropagation]", propagation);
}

export function reportTradeoffPropagation(
  propagation: AdvisoryWarRoomIntegrationBundle["tradeoffPropagation"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tradeoff:${propagation.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TradeoffPropagation]", propagation);
}

export function reportGuidanceDelivery(delivery: AdvisoryWarRoomIntegrationBundle["guidanceDelivery"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `delivery:${delivery.snapshot.decisionFocus.focus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GuidanceDelivery]", delivery);
}

export function resetAdvisoryWarRoomIntegrationLoggingForTests(): void {
  loggedKeys.clear();
}
