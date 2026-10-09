/**
 * STAGE-GUIDANCE:1 — project existing DTH:8–12 advisorReadable copy onto
 * the existing Advisor Situation / Why / Recommendation fields.
 * Does not own workflow, conversation, or a second Advisor.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreReadinessEvidence } from "./nexoraDecisionTheatreExecutionReadiness.ts";

export const nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity =
  "DTH:1/AdvisorGuidanceProjection" as const;

export const NEXORA_DECISION_THEATRE_ADVISOR_GUIDANCE_PHASES = Object.freeze([
  "commitment",
  "execution-readiness",
  "live-execution",
  "outcome-observation",
  "learning-reassessment",
] as const);

export type NexoraDecisionTheatreAdvisorGuidancePhase =
  (typeof NEXORA_DECISION_THEATRE_ADVISOR_GUIDANCE_PHASES)[number];

export type NexoraDecisionTheatreAdvisorReadinessRow = Readonly<{
  dimension: string;
  status: NexoraDecisionTheatreReadinessEvidence["status"];
  value: string;
}>;

export type NexoraDecisionTheatreAdvisorHierarchy = Readonly<{
  situationHeadline: string | null;
  situationStatus: string | null;
  readinessRows: readonly NexoraDecisionTheatreAdvisorReadinessRow[];
  readinessNote: string | null;
  recommendationHeading: "Next Best Action" | null;
}>;

export type NexoraDecisionTheatreAdvisorGuidance = Readonly<{
  identity: typeof nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity;
  phase: NexoraDecisionTheatreAdvisorGuidancePhase;
  source:
    | "decision-commitment"
    | "execution-readiness"
    | "live-execution"
    | "outcome-observation"
    | "learning-reassessment";
  situation: string;
  whyItMatters: string | null;
  recommendation: string | null;
  evidenceSummary: string | null;
  hierarchy: NexoraDecisionTheatreAdvisorHierarchy;
  writesBusinessState: false;
}>;

const DIMENSION_LABEL = Object.freeze({
  owner: "Owner",
  timing: "Timing",
  resources: "Resources",
  dependencies: "Dependencies",
  constraints: "Constraints",
  risk: "Risk",
});

function readinessValue(evidence: NexoraDecisionTheatreReadinessEvidence): string {
  if (evidence.status === "unknown") return "Not established";
  if (evidence.status === "blocked") return "Blocked";
  return evidence.summary.replace(/\s+/g, " ").trim();
}

function readinessRowsFromDimensions(
  dimensions: Readonly<{
    owner: NexoraDecisionTheatreReadinessEvidence;
    timing: NexoraDecisionTheatreReadinessEvidence;
    resources: NexoraDecisionTheatreReadinessEvidence;
    dependencies: NexoraDecisionTheatreReadinessEvidence;
    constraints: NexoraDecisionTheatreReadinessEvidence;
    risk: NexoraDecisionTheatreReadinessEvidence;
  }>,
): readonly NexoraDecisionTheatreAdvisorReadinessRow[] {
  return Object.freeze(
    (Object.keys(DIMENSION_LABEL) as readonly (keyof typeof DIMENSION_LABEL)[]).map(
      (key) =>
        Object.freeze({
          dimension: DIMENSION_LABEL[key] ?? key,
          status: dimensions[key].status,
          value: readinessValue(dimensions[key]),
        }),
    ),
  );
}

function emptyHierarchy(
  partial?: Partial<NexoraDecisionTheatreAdvisorHierarchy>,
): NexoraDecisionTheatreAdvisorHierarchy {
  return Object.freeze({
    situationHeadline: partial?.situationHeadline ?? null,
    situationStatus: partial?.situationStatus ?? null,
    readinessRows: Object.freeze([...(partial?.readinessRows ?? [])]),
    readinessNote: partial?.readinessNote ?? null,
    recommendationHeading: partial?.recommendationHeading ?? "Next Best Action",
  });
}

function executionReadinessStatus(
  readiness: NonNullable<NexoraDecisionTheatreFoundation["executionReadiness"]>,
): string | null {
  if (
    readiness.readiness === "COMMITTED_AWAITING_EXECUTION" ||
    readiness.readiness === "EXECUTION_READY"
  ) {
    return "Committed Decision · Execution not started";
  }
  if (readiness.readiness === "EXECUTION_BLOCKED") {
    return "Committed Decision · Execution blocked";
  }
  return null;
}

function uniqueSentences(
  ...parts: readonly (string | null | undefined)[]
): string | null {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const trimmed = part?.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out.length > 0 ? out.join(" ") : null;
}

export function projectNexoraDecisionTheatreAdvisorGuidance(
  theatre: NexoraDecisionTheatreFoundation | null | undefined,
): NexoraDecisionTheatreAdvisorGuidance | null {
  if (theatre == null) return null;
  const learning = theatre.learningReassessment;
  if (learning != null && learning.evidenceQuality !== "insufficient") {
    const copy = learning.advisorReadable;
    return Object.freeze({
      identity: nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity,
      phase: "learning-reassessment",
      source: "learning-reassessment",
      situation: uniqueSentences(copy.scene, copy.learned, copy.changed) ?? copy.scene,
      whyItMatters: uniqueSentences(copy.uncertain, copy.hindsight),
      recommendation: uniqueSentences(copy.reconsider, copy.recommend),
      evidenceSummary: copy.evidence,
      hierarchy: emptyHierarchy({
        situationHeadline: null,
        situationStatus: copy.learned,
        recommendationHeading: "Next Best Action",
      }),
      writesBusinessState: false,
    });
  }
  const outcome = theatre.outcomeObservation;
  if (outcome != null) {
    const copy = outcome.advisorReadable;
    return Object.freeze({
      identity: nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity,
      phase: "outcome-observation",
      source: "outcome-observation",
      situation: uniqueSentences(copy.scene, copy.result) ?? copy.scene,
      whyItMatters: uniqueSentences(copy.goal, copy.delta, copy.early),
      recommendation: uniqueSentences(copy.success, copy.causality),
      evidenceSummary: uniqueSentences(copy.evidence, copy.unknown),
      hierarchy: emptyHierarchy({
        situationHeadline: null,
        situationStatus: copy.result,
        recommendationHeading: "Next Best Action",
      }),
      writesBusinessState: false,
    });
  }
  const live = theatre.liveExecution;
  if (live != null) {
    const copy = live.advisorReadable;
    return Object.freeze({
      identity: nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity,
      phase: "live-execution",
      source: "live-execution",
      situation: uniqueSentences(copy.scene, copy.happeningNow) ?? copy.scene,
      whyItMatters: uniqueSentences(copy.attention, copy.blocked, copy.unknown),
      recommendation: uniqueSentences(copy.progress, copy.outcome),
      evidenceSummary: uniqueSentences(copy.known, copy.unknown),
      hierarchy: emptyHierarchy({
        situationHeadline: live.decisionTitle,
        situationStatus: copy.happeningNow,
        recommendationHeading: "Next Best Action",
      }),
      writesBusinessState: false,
    });
  }
  const readiness = theatre.executionReadiness;
  if (readiness != null) {
    const copy = readiness.advisorReadable;
    return Object.freeze({
      identity: nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity,
      phase: "execution-readiness",
      source: "execution-readiness",
      situation: uniqueSentences(copy.scene, copy.hasStarted) ?? copy.scene,
      whyItMatters: uniqueSentences(copy.readiness, copy.missing),
      recommendation: copy.whatHappensNext,
      evidenceSummary: copy.missing,
      hierarchy: emptyHierarchy({
        situationHeadline: readiness.decisionTitle,
        situationStatus: executionReadinessStatus(readiness),
        readinessRows: readinessRowsFromDimensions(readiness.supportedDimensions),
        readinessNote: copy.readiness,
        recommendationHeading: "Next Best Action",
      }),
      writesBusinessState: false,
    });
  }
  const commitment = theatre.decisionCommitment;
  if (commitment != null) {
    const copy = commitment.advisorReadable;
    return Object.freeze({
      identity: nexoraDecisionTheatreAdvisorGuidanceProjectionIdentity,
      phase: "commitment",
      source: "decision-commitment",
      situation: uniqueSentences(copy.reviewing, copy.haveIDecided) ?? copy.reviewing,
      whyItMatters: uniqueSentences(copy.why, copy.uncertainty),
      recommendation: uniqueSentences(copy.next, copy.recommendationDistinct),
      evidenceSummary: uniqueSentences(copy.evidence, copy.tradeOffs),
      hierarchy: emptyHierarchy({
        situationHeadline: commitment.candidateLabel,
        situationStatus:
          commitment.state === "COMMITTED"
            ? "Committed Decision"
            : "Not yet committed",
        recommendationHeading: "Next Best Action",
      }),
      writesBusinessState: false,
    });
  }
  return null;
}

export function applyNexoraDecisionTheatreAdvisorGuidance<
  T extends {
    readonly situation: string | null;
    readonly whyItMatters: string | null;
    readonly recommendation: string | null;
    readonly evidenceSummary: string | null;
  },
>(narrative: T, theatre: NexoraDecisionTheatreFoundation | null | undefined): T {
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(theatre);
  if (guidance == null) return narrative;
  return Object.freeze({
    ...narrative,
    situation: guidance.situation,
    whyItMatters: guidance.whyItMatters ?? narrative.whyItMatters,
    recommendation: guidance.recommendation ?? narrative.recommendation,
    evidenceSummary: guidance.evidenceSummary ?? narrative.evidenceSummary,
  }) as T;
}
