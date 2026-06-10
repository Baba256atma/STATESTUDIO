/**
 * Phase 5:1 — Executive Advisory logging.
 */

import type {
  AdvisoryConfidenceCard,
  AdvisoryFocusCard,
  AdvisoryNarrativeCard,
  ExecutiveAdvisorySurfaceModel,
  GuidanceCandidatesCard,
  PrioritySignalsCard,
} from "./executiveAdvisoryContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportExecutiveAdvisory(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `advisory:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveAdvisory]", detail);
}

export function reportAdvisoryFocus(focus: AdvisoryFocusCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `focus:${focus.focus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryFocus]", focus);
}

export function reportPrioritySignal(signals: PrioritySignalsCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `priority:${signals.signals.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PrioritySignal]", signals);
}

export function reportAdvisoryNarrative(narrative: AdvisoryNarrativeCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `narrative:${narrative.situationSummary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryNarrative]", narrative);
}

export function reportGuidanceCandidate(candidates: GuidanceCandidatesCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `guidance:${candidates.candidates.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GuidanceCandidate]", candidates);
}

export function reportAdvisoryConfidence(confidence: AdvisoryConfidenceCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${confidence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryConfidence]", confidence);
}

export function reportExecutiveAdvisorySurface(model: ExecutiveAdvisorySurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveAdvisory]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    focus: model.snapshot.focus.focus,
    confidence: model.snapshot.confidence.level,
    topPriority: model.snapshot.prioritySignals.topPriority,
  });
}

export function resetExecutiveAdvisoryLoggingForTests(): void {
  loggedKeys.clear();
}
