/**
 * NEX-EXP:3 — deterministic reality extraction, precedence, gap, and relevance.
 * Consumes Data Reality / catalog observations. Does not invent KPIs, causes, or gaps.
 */

import { tokenizeGoalText } from "@/app/lib/manager-object/managerObjectGoalContext.ts";
import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID } from "./nexoraEntranceTypes.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import {
  extractCurrentState,
  extractTargetState,
} from "./nexoraGoalDiscoveryResolution.ts";
import type {
  ExecutiveGoalRealityGap,
  ExecutiveRealityDiscoveryContext,
  ExecutiveRealityObservation,
  RealityEmergedObject,
  RealityFreshness,
  RealityObservationSource,
  RealitySufficiency,
  RealityTimeClass,
} from "./nexoraRealityDiscoveryTypes.ts";

const SOURCE_RANK: Record<RealityObservationSource, number> = {
  VALIDATED_DATA: 90,
  RUNTIME_OBSERVED: 80,
  CONNECTED_DATA: 70,
  MANAGER_REPORTED: 50,
  WORKSPACE: 40,
  INFERRED: 20,
  PRESENTATION_FIXTURE: 10,
  UNKNOWN: 0,
};

const BANNED_OBJECT_LABELS = new Set([
  "timestamp",
  "csv column",
  "source row",
  "order count",
  "row",
  "column",
]);

export function emptyRealityContext(
  goalId: string | null,
  goalTitle: string | null,
  targetState: string | null,
): ExecutiveRealityDiscoveryContext {
  return freezeContext({
    goalId,
    goalTitle,
    observations: [],
    measurements: [],
    kpis: [],
    states: [],
    constraints: [],
    knownIssues: [],
    knownRisks: [],
    knownOpportunities: [],
    currentStateSummary: null,
    targetState,
    gap: unknownGap(goalId, targetState),
    evidence: [],
    provenance: [],
    unknowns: ["current state"],
    freshness: "UNKNOWN",
    confidence: "UNKNOWN",
    epistemicStatus: "UNKNOWN",
    sufficiency: "INSUFFICIENT",
    conflicts: [],
  });
}

export function sourceOutranks(
  winner: RealityObservationSource,
  loser: RealityObservationSource,
): boolean {
  return SOURCE_RANK[winner] > SOURCE_RANK[loser];
}

export function isGoalRelevantSubject(
  subject: string,
  goalTitle: string | null,
): "relevant" | "unrelated" | "unknown" {
  if (!subject.trim()) return "unknown";
  if (!goalTitle) return "unknown";
  if (overlap(subject, goalTitle) >= 1) return "relevant";
  if (isGenericExecutiveSubject(subject)) return "relevant";
  return "unknown";
}

export function observationMayBecomeObject(
  observation: ExecutiveRealityObservation,
): boolean {
  if (observation.goalRelevance === "unrelated") return false;
  if (BANNED_OBJECT_LABELS.has(observation.subject.trim().toLowerCase())) {
    return false;
  }
  if (observation.epistemicStatus === "UNKNOWN") return false;
  return Boolean(
    observation.value != null ||
      observation.state != null ||
      observation.source === "VALIDATED_DATA" ||
      observation.source === "MANAGER_REPORTED",
  );
}

export function extractRealityObservations(
  utterance: string,
  goalTitle: string | null,
): readonly ExecutiveRealityObservation[] {
  const text = utterance.trim();
  if (!text) return Object.freeze([]);
  const found: ExecutiveRealityObservation[] = [];
  const named = [
    ...text.matchAll(
      /\b([A-Za-z][A-Za-z0-9][A-Za-z0-9 /-]{1,40}?)\s+(?:is|are|was)\s+(?:currently\s+|around\s+|about\s+|nearly\s+|almost\s+)?([^.;]+)/gi,
    ),
  ];
  for (const match of named) {
    const subject = titleCase(cleanPhrase(match[1] ?? ""));
    const raw = cleanPhrase(match[2] ?? "");
    if (!subject || isNoiseSubject(subject)) continue;
    found.push(
      makeObservation({
        subject,
        raw,
        source: "MANAGER_REPORTED",
        goalTitle,
        authority: "manager-reported",
      }),
    );
  }
  const current = extractCurrentState(text) ?? extractBarePercent(text);
  if (current && !found.some((entry) => entry.value === current)) {
    found.push(
      makeObservation({
        subject: inferMeasureSubject(text, goalTitle) ?? "Current measure",
        raw: current,
        source: "MANAGER_REPORTED",
        goalTitle,
        authority: "manager-reported",
      }),
    );
  }
  const weeks = text.match(/\b(\d+)\s+weeks? behind\b/i);
  if (weeks?.[1]) {
    found.push(
      makeObservation({
        subject: inferMeasureSubject(text, goalTitle) ?? "Schedule",
        raw: `${weeks[1]} weeks behind`,
        source: "MANAGER_REPORTED",
        goalTitle,
        authority: "manager-reported",
      }),
    );
  }
  return Object.freeze(mergeObservations(found).observations);
}

export function extractTargetFromUtterance(utterance: string): string | null {
  return extractTargetState(utterance);
}

export function extractConstraints(utterance: string): readonly string[] {
  const found: string[] = [];
  const budget = utterance.match(
    /\b(budget ceiling|budget constraint|headcount freeze|contractual limit(?:ation)?|machine capacity|technical dependency)\b/i,
  );
  if (budget?.[1]) found.push(cleanPhrase(budget[1]));
  return Object.freeze(found);
}

export function extractRiskSignals(utterance: string): readonly string[] {
  if (!/\brisk\b/i.test(utterance)) return Object.freeze([]);
  return Object.freeze(["risk signal"]);
}

export function extractOpportunitySignals(utterance: string): readonly string[] {
  if (!/\bopportunit(?:y|ies)\b/i.test(utterance)) return Object.freeze([]);
  return Object.freeze(["opportunity signal"]);
}

export function extractIssueSignalsFromReality(
  utterance: string,
): readonly string[] {
  const because = utterance.match(/\bbecause\s+([^.;]+)/i);
  const maybe = utterance.match(
    /\b([A-Za-z][A-Za-z0-9 /-]{2,40})\s+may be (?:a |the )?problem\b/i,
  );
  const found: string[] = [];
  if (because?.[1]) found.push(cleanPhrase(because[1]));
  if (maybe?.[1]) found.push(cleanPhrase(maybe[1]));
  return Object.freeze(found);
}

export function extractCausalHypothesis(utterance: string): string | null {
  if (/\bcaused the gap|root cause|causing the\b/i.test(utterance)) {
    return cleanPhrase(utterance);
  }
  if (/\bbecause\b/i.test(utterance)) return cleanPhrase(utterance);
  return null;
}

export function collectCatalogObservations(
  catalog: NexoraMVPObjectInteractionCatalog,
  goalTitle: string | null,
): readonly ExecutiveRealityObservation[] {
  const observations: ExecutiveRealityObservation[] = [];
  for (const object of catalog.objects) {
    if (
      object.id === NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID ||
      object.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID ||
      object.id.startsWith("goal-") ||
      object.id.startsWith("reality-")
    ) {
      continue;
    }
    const kpi = getNexoraMVPSubjectPresentationFixture(object.id)?.primaryKpi;
    if (!kpi) continue;
    observations.push(
      makeObservation({
        subject: object.label,
        raw: String(kpi.value),
        source: "PRESENTATION_FIXTURE",
        goalTitle,
        authority: "NEX-MVP:6/presentation-fixture",
        objectId: object.id,
        unit: inferUnit(String(kpi.value)),
      }),
    );
  }
  return Object.freeze(observations);
}

export function mergeObservations(
  incoming: readonly ExecutiveRealityObservation[],
  existing: readonly ExecutiveRealityObservation[] = [],
): {
  readonly observations: readonly ExecutiveRealityObservation[];
  readonly conflicts: readonly string[];
} {
  const byKey = new Map<string, ExecutiveRealityObservation>();
  const conflicts: string[] = [];
  for (const observation of [...existing, ...incoming]) {
    const key = observation.subject.trim().toLowerCase();
    const prior = byKey.get(key);
    if (!prior) {
      byKey.set(key, observation);
      continue;
    }
    if (
      prior.value &&
      observation.value &&
      prior.value !== observation.value &&
      prior.source !== observation.source
    ) {
      const winner = sourceOutranks(observation.source, prior.source)
        ? observation
        : prior;
      const loser = winner === observation ? prior : observation;
      conflicts.push(
        `The ${labelSource(winner.source)} reports ${winner.value}, while the ${labelSource(loser.source)} value is ${loser.value}. Nexora is using the higher-authority source as current truth.`,
      );
      byKey.set(key, { ...winner, id: prior.id, objectId: prior.objectId });
      continue;
    }
    byKey.set(key, {
      ...prior,
      value: observation.value ?? prior.value,
      numericValue: observation.numericValue ?? prior.numericValue,
      unit: observation.unit ?? prior.unit,
      state: observation.state ?? prior.state,
      freshness: observation.freshness === "STALE" ? "STALE" : prior.freshness,
    });
  }
  return {
    observations: Object.freeze([...byKey.values()]),
    conflicts: Object.freeze(conflicts),
  };
}

export function markStale(
  observations: readonly ExecutiveRealityObservation[],
): readonly ExecutiveRealityObservation[] {
  return Object.freeze(
    observations.map((observation) =>
      Object.freeze({ ...observation, freshness: "STALE" as const }),
    ),
  );
}

export function computeGap(
  goalId: string | null,
  observations: readonly ExecutiveRealityObservation[],
  targetState: string | null,
): ExecutiveGoalRealityGap {
  const current = pickCurrentMeasure(observations);
  const currentValue = current?.value ?? null;
  const parsedTarget = parseNumeric(targetState);
  const parsedCurrent = current?.numericValue ?? parseNumeric(currentValue);
  if (parsedCurrent == null || parsedTarget == null) {
    return Object.freeze({
      goalId,
      measure: current?.subject ?? null,
      currentValue,
      targetValue: targetState,
      delta: null,
      numericDelta: null,
      unit: current?.unit ?? inferUnit(targetState),
      direction: null,
      status: currentValue || targetState ? "UNKNOWN" : "NOT_MEASURABLE",
      evidence: Object.freeze([]),
      epistemicStatus: "UNKNOWN",
    });
  }
  const delta = round1(parsedTarget - parsedCurrent);
  const unitLabel =
    (current?.unit ?? inferUnit(targetState)) === "%"
      ? "percentage points"
      : current?.unit ?? "units";
  return Object.freeze({
    goalId,
    measure: current?.subject ?? null,
    currentValue,
    targetValue: targetState,
    delta: `${Math.abs(delta)} ${unitLabel}`.trim(),
    numericDelta: delta,
    unit: current?.unit ?? inferUnit(targetState),
    direction:
      delta > 0 ? "below-target" : delta < 0 ? "above-target" : "on-target",
    status: "KNOWN",
    evidence: Object.freeze(
      [current?.sourceAuthority].filter(Boolean) as string[],
    ),
    epistemicStatus: current?.epistemicStatus ?? "KNOWN",
  });
}

export function realitySufficiencyOf(input: {
  readonly observations: readonly ExecutiveRealityObservation[];
  readonly gap: ExecutiveGoalRealityGap | null;
}): RealitySufficiency {
  const usable = input.observations.filter(
    (observation) => observation.goalRelevance !== "unrelated",
  );
  if (usable.length === 0) return "INSUFFICIENT";
  if (input.gap?.status === "KNOWN" || usable.length >= 2) return "SUFFICIENT";
  return "PARTIAL";
}

export function summarizeReality(
  observations: readonly ExecutiveRealityObservation[],
  gap: ExecutiveGoalRealityGap | null,
  unknowns: readonly string[],
): string {
  const parts: string[] = [];
  if (gap?.status === "KNOWN" && gap.currentValue && gap.targetValue) {
    parts.push(
      `${gap.measure ?? "The current measure"} is currently ${gap.currentValue} against a ${gap.targetValue} target (${gap.delta} ${gap.direction === "below-target" ? "below target" : "relative to target"}).`,
    );
  } else if (observations[0]?.value) {
    parts.push(
      `${observations[0].subject} is currently ${observations[0].value}.`,
    );
  }
  const extras = observations.slice(1, 4).map((observation) =>
    observation.value
      ? `${observation.subject} is ${observation.value}`
      : `${observation.subject} is ${observation.state ?? "recorded"}`,
  );
  if (extras.length) parts.push(`${extras.join("; ")}.`);
  if (unknowns[0]) parts.push(`The main missing piece is ${unknowns[0]}.`);
  return parts.join(" ").trim() || "Current reality is not yet established.";
}

export function prioritizeUnknown(
  observations: readonly ExecutiveRealityObservation[],
  gap: ExecutiveGoalRealityGap | null,
  targetState: string | null,
): readonly string[] {
  const unknowns: string[] = [];
  if (!observations.some((observation) => observation.value || observation.state)) {
    unknowns.push("the current measure relevant to this Goal");
  } else if (!targetState && gap?.status !== "KNOWN") {
    unknowns.push("a measurable target for this Goal");
  } else if (gap?.status !== "KNOWN") {
    unknowns.push("a comparable current/target pair");
  }
  if (observations.some((observation) => observation.freshness === "STALE")) {
    unknowns.push("whether the latest evidence is still current");
  }
  return Object.freeze(unknowns.slice(0, 3));
}

export function emergeRealityObjects(
  observations: readonly ExecutiveRealityObservation[],
  catalog: NexoraMVPObjectInteractionCatalog,
): readonly RealityEmergedObject[] {
  const emerged: RealityEmergedObject[] = [];
  for (const observation of observations) {
    if (!observationMayBecomeObject(observation)) continue;
    if (emerged.length >= 5) break;
    const existing = catalog.objects.find(
      (object) =>
        object.label.toLowerCase() === observation.subject.toLowerCase() ||
        object.id === observation.objectId,
    );
    const reused =
      existing != null &&
      existing.id !== NEXORA_EXECUTIVE_GOAL_OBJECT_ID &&
      existing.id !== NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID &&
      !existing.id.startsWith("goal-");
    emerged.push(
      Object.freeze({
        id: reused && existing ? existing.id : observation.objectId,
        displayName: observation.subject,
        kind: "object" as const,
        observationId: observation.id,
        reusedExisting: Boolean(reused),
      }),
    );
  }
  return Object.freeze(emerged);
}

export function applyRealityUtterance(
  previous: ExecutiveRealityDiscoveryContext,
  utterance: string,
  catalog: NexoraMVPObjectInteractionCatalog,
  extraAuthoritative: readonly ExecutiveRealityObservation[] = [],
): ExecutiveRealityDiscoveryContext {
  const extracted = extractRealityObservations(utterance, previous.goalTitle);
  const catalogObs =
    previous.observations.length === 0
      ? collectCatalogObservations(catalog, previous.goalTitle)
      : [];
  const staleRequested =
    /(?:that number is old|figure is old|is stale|no longer current)/i.test(
      utterance,
    );
  const base = staleRequested ? markStale(previous.observations) : previous.observations;
  const historicalMark = /\bhistorically|last year|baseline\b/i.test(utterance);
  const merged = mergeObservations(
    [...extraAuthoritative, ...catalogObs, ...extracted],
    base,
  );
  const historical = historicalMark
    ? merged.observations.map((observation) =>
        Object.freeze({
          ...observation,
          timeClass: "HISTORICAL" as RealityTimeClass,
        }),
      )
    : merged.observations;
  const target = extractTargetFromUtterance(utterance) ?? previous.targetState;
  const gap = computeGap(previous.goalId, historical, target);
  const constraints = unique([
    ...previous.constraints,
    ...extractConstraints(utterance),
  ]);
  const issues = unique([
    ...previous.knownIssues,
    ...extractIssueSignalsFromReality(utterance),
  ]);
  const risks = unique([...previous.knownRisks, ...extractRiskSignals(utterance)]);
  const opportunities = unique([
    ...previous.knownOpportunities,
    ...extractOpportunitySignals(utterance),
  ]);
  const unknowns = prioritizeUnknown(historical, gap, target);
  const sufficiency = realitySufficiencyOf({ observations: historical, gap });
  const summary = summarizeReality(historical, gap, unknowns);
  return freezeContext({
    ...previous,
    observations: historical,
    measurements: unique(
      historical
        .map((observation) => observation.value)
        .filter((value): value is string => Boolean(value)),
    ),
    kpis: unique(
      historical
        .filter(
          (observation) =>
            observation.unit === "%" || observation.source === "VALIDATED_DATA",
        )
        .map((observation) => observation.subject),
    ),
    states: unique(
      historical
        .map((observation) => observation.state)
        .filter((value): value is string => Boolean(value)),
    ),
    constraints,
    knownIssues: issues,
    knownRisks: risks,
    knownOpportunities: opportunities,
    currentStateSummary: historical.length ? summary : null,
    targetState: target,
    gap,
    evidence: unique(historical.map((observation) => observation.sourceAuthority)),
    provenance: unique(
      historical
        .map((observation) => observation.provenance)
        .filter((value): value is string => Boolean(value)),
    ),
    unknowns,
    freshness: historical.some((observation) => observation.freshness === "STALE")
      ? "STALE"
      : historical.length
        ? "CURRENT"
        : "UNKNOWN",
    confidence:
      sufficiency === "INSUFFICIENT"
        ? "UNKNOWN"
        : historical.some((observation) => observation.epistemicStatus === "INFERRED")
          ? "INFERRED"
          : "KNOWN",
    epistemicStatus:
      sufficiency === "INSUFFICIENT"
        ? "UNKNOWN"
        : historical.every((observation) => observation.source === "MANAGER_REPORTED")
          ? "INFERRED"
          : "KNOWN",
    sufficiency,
    conflicts: unique([...previous.conflicts, ...merged.conflicts]),
  });
}

export function toMoGap(gap: ExecutiveGoalRealityGap | null): {
  readonly quantification: "measured" | "unknown";
  readonly desiredState: string | null;
  readonly currentState: string | null;
  readonly summary: string;
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
} {
  if (!gap || gap.status !== "KNOWN") {
    return Object.freeze({
      quantification: "unknown" as const,
      desiredState: gap?.targetValue ?? null,
      currentState: gap?.currentValue ?? null,
      summary:
        "The goal is known, but Nexora does not yet have enough measured data to quantify the gap.",
      epistemicStatus: "UNKNOWN" as const,
    });
  }
  return Object.freeze({
    quantification: "measured" as const,
    desiredState: gap.targetValue,
    currentState: gap.currentValue,
    summary: `Current ${gap.measure ?? "measure"} is ${gap.currentValue} against ${gap.targetValue} (${gap.delta}). This is a performance gap, not a confirmed cause.`,
    epistemicStatus: gap.epistemicStatus,
  });
}

function makeObservation(input: {
  readonly subject: string;
  readonly raw: string;
  readonly source: RealityObservationSource;
  readonly goalTitle: string | null;
  readonly authority: string;
  readonly objectId?: string;
  readonly unit?: string | null;
}): ExecutiveRealityObservation {
  const parsed = parseNumeric(input.raw);
  const unit = input.unit ?? inferUnit(input.raw);
  const state = qualitativeState(input.raw);
  const value =
    parsed != null && unit === "%"
      ? `${trimNum(parsed)}%`
      : parsed != null && !state
        ? `${trimNum(parsed)}${unit && unit !== "%" ? ` ${unit}` : ""}`
        : state
          ? null
          : cleanPhrase(input.raw);
  return Object.freeze({
    id: `obs-${slug(input.subject)}`,
    subject: input.subject,
    objectId: input.objectId ?? `reality-${slug(input.subject)}`,
    value,
    numericValue: parsed,
    unit,
    state,
    timestamp: null,
    source: input.source,
    sourceAuthority: input.authority,
    provenance: input.authority,
    freshness: "CURRENT" as RealityFreshness,
    timeClass: "CURRENT" as RealityTimeClass,
    epistemicStatus:
      input.source === "INFERRED"
        ? "INFERRED"
        : input.source === "UNKNOWN"
          ? "UNKNOWN"
          : "KNOWN",
    goalRelevance: isGoalRelevantSubject(input.subject, input.goalTitle),
  });
}

function unknownGap(
  goalId: string | null,
  targetState: string | null,
): ExecutiveGoalRealityGap {
  return Object.freeze({
    goalId,
    measure: null,
    currentValue: null,
    targetValue: targetState,
    delta: null,
    numericDelta: null,
    unit: inferUnit(targetState),
    direction: null,
    status: targetState ? "UNKNOWN" : "NOT_MEASURABLE",
    evidence: Object.freeze([]),
    epistemicStatus: "UNKNOWN",
  });
}

function freezeContext(
  input: ExecutiveRealityDiscoveryContext,
): ExecutiveRealityDiscoveryContext {
  return Object.freeze({
    ...input,
    observations: Object.freeze([...input.observations]),
    measurements: Object.freeze([...input.measurements]),
    kpis: Object.freeze([...input.kpis]),
    states: Object.freeze([...input.states]),
    constraints: Object.freeze([...input.constraints]),
    knownIssues: Object.freeze([...input.knownIssues]),
    knownRisks: Object.freeze([...input.knownRisks]),
    knownOpportunities: Object.freeze([...input.knownOpportunities]),
    evidence: Object.freeze([...input.evidence]),
    provenance: Object.freeze([...input.provenance]),
    unknowns: Object.freeze([...input.unknowns]),
    conflicts: Object.freeze([...input.conflicts]),
  });
}

function pickCurrentMeasure(
  observations: readonly ExecutiveRealityObservation[],
): ExecutiveRealityObservation | null {
  return (
    observations.find(
      (observation) =>
        observation.numericValue != null && observation.timeClass === "CURRENT",
    ) ??
    observations.find((observation) => observation.numericValue != null) ??
    observations[0] ??
    null
  );
}

function inferMeasureSubject(text: string, goalTitle: string | null): string | null {
  const named = text.match(
    /\b(on[- ]time delivery|otd|backlog|capacity|cash|schedule|milestone)\b/i,
  );
  if (named?.[1]) return titleCase(named[1]);
  return goalTitle ? `${goalTitle} current measure` : null;
}

function isGenericExecutiveSubject(subject: string): boolean {
  return /\b(backlog|capacity|cash|budget|schedule|milestone|bug|deployment|retention|churn|orders?|inventory|staff|supplier)\b/i.test(
    subject,
  );
}

function isNoiseSubject(subject: string): boolean {
  return /^(?:we|i|it|this|that|our|the|current|target)$/i.test(subject.trim());
}

function qualitativeState(raw: string): string | null {
  const lower = raw.toLowerCase();
  if (/almost full|nearly full|elevated|high/.test(lower)) return "elevated";
  if (/too low|behind|blocked/.test(lower)) return "watch";
  return null;
}

function overlap(left: string, right: string): number {
  const a = tokenizeGoalText(left);
  const b = tokenizeGoalText(right);
  let hits = 0;
  for (const token of a) if (b.has(token)) hits += 1;
  return hits;
}

function parseNumeric(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function inferUnit(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/%/.test(value)) return "%";
  if (/\$|usd/i.test(value)) return "$";
  if (/week/i.test(value)) return "weeks";
  return null;
}

function extractBarePercent(text: string): string | null {
  const match = text.match(/\b(\d+(?:\.\d+)?)%/);
  return match?.[1] ? `${match[1]}%` : null;
}

function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "subject"
  );
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(" ");
}

function cleanPhrase(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[.!?]+$/g, "").trim();
}

function trimNum(value: number): string {
  return Number.isInteger(value) ? String(value) : String(round1(value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function labelSource(source: RealityObservationSource): string {
  if (source === "VALIDATED_DATA" || source === "RUNTIME_OBSERVED") {
    return "validated operational source";
  }
  if (source === "MANAGER_REPORTED") return "manager-reported";
  if (source === "PRESENTATION_FIXTURE") return "presentation fixture";
  return source.toLowerCase().replace(/_/g, " ");
}
