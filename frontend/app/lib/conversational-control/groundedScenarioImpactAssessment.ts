/**
 * Grounded Scenario Impact Intelligence — CC:9 companion.
 *
 * Connects qualitative interventions to canonical subject KPI bindings.
 * Does not invent downstream Customer/Revenue effects, numeric magnitude,
 * causal proof, Outcome, or Learning. Does not use Stage topology.
 */

import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import type { NexoraExecutiveEvidenceReference } from "./executiveRecommendation.ts";
import type {
  NexoraScenarioAssumption,
  NexoraScenarioIntervention,
} from "./executiveScenarioDefinition.ts";

export const groundedScenarioImpactIdentity =
  "CC:9/GroundedScenarioImpactIntelligence" as const;

export const GROUNDED_SCENARIO_IMPACT_BASES = Object.freeze([
  "canonical-subject-kpi",
  "canonical-kpi-impact-profile",
  "canonical-risk-impact-profile",
  "explicit-object-dependency",
  "scenario-model-binding",
  "data-supported-relationship",
  "core-int3-supported-relationship",
] as const);

export type GroundedScenarioImpactBasis =
  (typeof GROUNDED_SCENARIO_IMPACT_BASES)[number];

export const GROUNDED_SCENARIO_IMPACT_SUPPORT_STATES = Object.freeze([
  "supported",
  "partial",
  "hypothetical-model",
  "unsupported",
  "conflicting",
] as const);

export type GroundedScenarioImpactSupportState =
  (typeof GROUNDED_SCENARIO_IMPACT_SUPPORT_STATES)[number];

export type GroundedScenarioImpactTarget = {
  readonly targetId: string;
  readonly targetKind: "kpi" | "risk" | "constraint" | "subject";
  readonly dimension?: string;
  readonly direction: "increase" | "decrease" | "unknown";
  readonly magnitude?: number;
  readonly unit?: string;
  readonly impactBasis: GroundedScenarioImpactBasis;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly confidence: number;
  readonly supportState: GroundedScenarioImpactSupportState;
};

export type GroundedScenarioImpactAssessment = {
  readonly scenarioId?: string;
  readonly subjectId: string;
  readonly intervention: string;
  readonly state?: string;
  readonly intensity?: string;
  readonly affectedTargets: readonly GroundedScenarioImpactTarget[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly confidence: number;
  readonly uncertainty: string | null;
  readonly supportState: GroundedScenarioImpactSupportState;
  readonly unsupportedReasons: readonly string[];
};

function freezeRef(
  subjectId: string,
  factKey: string,
): NexoraExecutiveEvidenceReference {
  return Object.freeze({
    sourceKind: "kpi" as const,
    sourceId: `grounded-scenario-impact:${subjectId}:${factKey}`,
    subjectId,
    factKey,
  });
}

function interventionKind(
  actionKind: string | undefined,
  operator: string | undefined,
): "delay" | "increase-by" | "decrease-by" | "hold" | "other" {
  const raw = actionKind ?? operator ?? "";
  if (raw === "delay") return "delay";
  if (raw === "increase-by") return "increase-by";
  if (raw === "decrease-by") return "decrease-by";
  if (raw === "hold") return "hold";
  return "other";
}

/**
 * Directional own-KPI binding for delay: a delay stresses the subject's
 * canonical performance KPI. No magnitude. No Stage-neighbor inference.
 */
export function assessGroundedScenarioImpact(input: {
  readonly scenarioId?: string;
  readonly interventions?: readonly NexoraScenarioIntervention[];
  readonly assumptions?: readonly NexoraScenarioAssumption[];
}): GroundedScenarioImpactAssessment {
  const intervention =
    input.interventions?.find((item) => item.subjectId) ?? null;
  const assumption =
    input.assumptions?.find((item) => item.subjectId) ?? null;
  const subjectId = intervention?.subjectId ?? assumption?.subjectId ?? "";
  const kind = interventionKind(
    intervention?.actionKind,
    assumption?.operator,
  );
  const intensity = intervention?.intensity ?? assumption?.intensity;
  const state = intervention?.state ?? assumption?.state;
  const presentation = getNexoraMVPSubjectPresentationFixture(subjectId);
  const primaryKpi = presentation?.primaryKpi ?? null;
  const targets: GroundedScenarioImpactTarget[] = [];
  const unsupportedReasons: string[] = [];
  const evidenceRefs: NexoraExecutiveEvidenceReference[] = [];
  const provenanceRefs: string[] = [];

  if (!subjectId) {
    return Object.freeze({
      scenarioId: input.scenarioId,
      subjectId: "",
      intervention: kind,
      state,
      intensity,
      affectedTargets: Object.freeze([]),
      evidenceRefs: Object.freeze([]),
      provenanceRefs: Object.freeze([]),
      confidence: 0,
      uncertainty: "No intervention subject is available.",
      supportState: "unsupported",
      unsupportedReasons: Object.freeze(["missing-subject"]),
    });
  }

  if (kind === "delay" && primaryKpi) {
    const evidence = freezeRef(subjectId, `primary-kpi:${primaryKpi.id}`);
    evidenceRefs.push(evidence);
    provenanceRefs.push(primaryKpi.id);
    targets.push(
      Object.freeze({
        targetId: primaryKpi.id,
        targetKind: "kpi",
        dimension: primaryKpi.label,
        direction: "decrease",
        impactBasis: "canonical-subject-kpi",
        evidenceRefs: Object.freeze([evidence]),
        provenanceRefs: Object.freeze([primaryKpi.id]),
        confidence: 0,
        supportState: "partial",
      }),
    );
  } else if (kind === "delay" && !primaryKpi) {
    unsupportedReasons.push("no-canonical-subject-kpi");
  } else if (kind === "increase-by" || kind === "decrease-by" || kind === "hold") {
    unsupportedReasons.push("no-canonical-impact-profile-for-intervention");
  } else {
    unsupportedReasons.push("unrecognized-intervention");
  }

  const supportState: GroundedScenarioImpactSupportState =
    targets.length > 0 ? "partial" : "unsupported";
  const uncertainty =
    targets.length > 0
      ? "Impact direction is supported by the subject's canonical KPI binding. Magnitude, downstream Customer/Revenue effects, and causal proof are not in this model."
      : "Nexora does not currently have a supported impact model for that change.";

  return Object.freeze({
    scenarioId: input.scenarioId,
    subjectId,
    intervention: kind,
    state,
    intensity,
    affectedTargets: Object.freeze(targets),
    evidenceRefs: Object.freeze(evidenceRefs),
    provenanceRefs: Object.freeze(provenanceRefs),
    confidence: targets[0]?.confidence ?? 0,
    uncertainty,
    supportState,
    unsupportedReasons: Object.freeze(unsupportedReasons),
  });
}

export function presentGroundedScenarioImpact(input: {
  readonly assessment: GroundedScenarioImpactAssessment;
  readonly subjectLabel: string;
  readonly parentScenarioName?: string | null;
}): string {
  const { assessment, subjectLabel } = input;
  const severe =
    assessment.intensity === "too" ||
    assessment.intensity === "very" ||
    assessment.intensity === "extremely";
  const delayPhrase = severe
    ? `A severe ${subjectLabel} delay`
    : `A ${subjectLabel} delay`;
  const parent = input.parentScenarioName
    ? ` within ${input.parentScenarioName}`
    : "";

  if (assessment.affectedTargets.length === 0) {
    return severe
      ? `I understand you want to test a severe ${subjectLabel} delay${parent}, but I don't currently have a supported impact model for that change.`
      : `I understand that you want to explore this change to ${subjectLabel}${parent}, but I don't currently have a supported impact model for that change.`;
  }

  const kpiNames = assessment.affectedTargets
    .filter((target) => target.targetKind === "kpi")
    .map((target) => target.dimension ?? target.targetId);
  const kpiList = kpiNames.join(" and ");
  return `${delayPhrase}${parent} is projected to put pressure on ${subjectLabel} ${kpiList} performance. The direction is supported by the current Scenario model, but Nexora does not have enough evidence to quantify the size of the impact. This is a projection, not an observed Outcome.`;
}
