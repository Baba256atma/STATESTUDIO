/**
 * CC:9 — Scenario definition contracts and pure define/modify APIs.
 */

import type { NexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import {
  EXECUTIVE_SCENARIO_REASON,
  type ExecutiveScenarioReasonCode,
} from "./executiveScenarioConversation.ts";

export const NEXORA_SCENARIO_SOURCES = Object.freeze([
  "conversation",
  "existing-scenario",
  "recommendation-handoff",
] as const);

export type NexoraScenarioSource = (typeof NEXORA_SCENARIO_SOURCES)[number];

export const NEXORA_SCENARIO_DEFINITION_STATUSES = Object.freeze([
  "draft",
  "defined",
  "evaluated",
  "unsupported",
  "invalid",
  "clarification-required",
] as const);

export type NexoraScenarioDefinitionStatus =
  (typeof NEXORA_SCENARIO_DEFINITION_STATUSES)[number];

export const NEXORA_SCENARIO_ASSUMPTION_OPERATORS = Object.freeze([
  "set",
  "increase-by",
  "decrease-by",
  "hold",
  "remove",
  "delay",
] as const);

export type NexoraScenarioAssumptionOperator =
  (typeof NEXORA_SCENARIO_ASSUMPTION_OPERATORS)[number];

export type NexoraScenarioHorizon = {
  readonly amount: number;
  readonly unit: "day" | "week" | "month" | "quarter" | "year";
};

export type NexoraScenarioAssumption = {
  readonly key: string;
  readonly subjectId?: string;
  readonly metricKey?: string;
  readonly operator: NexoraScenarioAssumptionOperator;
  readonly value?: number | string;
  readonly unit?: string;
  readonly state?: string;
  readonly intensity?: string;
  readonly evidenceSource?: string;
};

export type NexoraScenarioIntervention = {
  readonly subjectId: string;
  readonly actionKind: string;
  readonly value?: number | string;
  readonly unit?: string;
  readonly state?: string;
  readonly intensity?: string;
};

export type NexoraExecutiveScenario = {
  readonly scenarioId: string;
  readonly name: string;
  readonly revision: number;
  readonly baseContextId?: string;
  readonly subjectIds: readonly string[];
  readonly assumptions: readonly NexoraScenarioAssumption[];
  readonly interventions: readonly NexoraScenarioIntervention[];
  readonly horizon: NexoraScenarioHorizon | null;
  readonly source: NexoraScenarioSource;
  readonly status: NexoraScenarioDefinitionStatus;
  readonly recommendationId?: string | null;
  readonly parentScenarioId?: string | null;
  readonly kind: "do-nothing" | "intervention" | "custom";
};

export type NexoraExecutiveScenarioDefinitionTrace = {
  readonly requestKind: string;
  readonly subjectIds: readonly string[];
  readonly assumptionKeys: readonly string[];
  readonly interventionSubjects: readonly string[];
  readonly horizon: NexoraScenarioHorizon | null;
  readonly revision: number;
  readonly reasons: readonly ExecutiveScenarioReasonCode[];
};

export type NexoraExecutiveScenarioDefinitionResult = {
  readonly scenario: NexoraExecutiveScenario | null;
  readonly status: NexoraScenarioDefinitionStatus;
  readonly clarificationPrompt: string | null;
  readonly trace: NexoraExecutiveScenarioDefinitionTrace;
};

export type NexoraDefineExecutiveScenarioInput = {
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly requestKind:
    | "do-nothing"
    | "intervention"
    | "modify"
    | "add-assumption"
    | "open-existing";
  readonly primarySubjectId?: string | null;
  readonly subjectIds?: readonly string[];
  readonly assumptions?: readonly NexoraScenarioAssumption[];
  readonly interventions?: readonly NexoraScenarioIntervention[];
  readonly horizon?: NexoraScenarioHorizon | null;
  readonly requireHorizon?: boolean;
  readonly previousScenario?: NexoraExecutiveScenario | null;
  readonly recommendationId?: string | null;
  readonly existingScenarioId?: string | null;
  readonly existingScenarioName?: string | null;
  readonly nameHint?: string | null;
};

function freezeAssumption(
  a: NexoraScenarioAssumption,
): NexoraScenarioAssumption {
  return Object.freeze({ ...a });
}

function freezeIntervention(
  i: NexoraScenarioIntervention,
): NexoraScenarioIntervention {
  return Object.freeze({ ...i });
}

function buildScenarioId(input: {
  readonly kind: string;
  readonly subjectKey: string;
  readonly revision: number;
}): string {
  return `cc9:scenario:${input.kind}:${input.subjectKey}:v${input.revision}`;
}

function nameFor(input: {
  readonly kind: "do-nothing" | "intervention" | "custom";
  readonly interventions: readonly NexoraScenarioIntervention[];
  readonly assumptions: readonly NexoraScenarioAssumption[];
  readonly nameHint?: string | null;
  readonly existingName?: string | null;
}): string {
  if (input.nameHint) return input.nameHint;
  if (input.existingName) return input.existingName;
  if (input.kind === "do-nothing") return "Do Nothing";
  const intervention = input.interventions[0];
  if (intervention) {
    const label = intervention.subjectId.replace(/^obj-/, "").replace(/-/g, " ");
    const title = label.charAt(0).toUpperCase() + label.slice(1);
    if (
      typeof intervention.value === "number" &&
      (intervention.actionKind === "increase-by" ||
        intervention.actionKind === "decrease-by")
    ) {
      const sign = intervention.actionKind === "increase-by" ? "+" : "-";
      const unit = intervention.unit === "%" ? "%" : intervention.unit ?? "";
      return `${title} ${sign}${intervention.value}${unit}`;
    }
    return `${title} intervention`;
  }
  if (input.assumptions[0]?.subjectId) {
    const label = input.assumptions[0].subjectId
      .replace(/^obj-/, "")
      .replace(/-/g, " ");
    return `${label.charAt(0).toUpperCase()}${label.slice(1)} assumption case`;
  }
  return "Custom scenario";
}

/**
 * Pure scenario definition / modification. Does not evaluate.
 */
export function defineNexoraExecutiveScenario(
  input: NexoraDefineExecutiveScenarioInput,
): NexoraExecutiveScenarioDefinitionResult {
  const reasons: ExecutiveScenarioReasonCode[] = [
    EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
  ];

  if (input.recommendationId) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.RECOMMENDATION_HANDOFF);
  }

  if (
    input.requireHorizon === true &&
    input.requestKind === "do-nothing" &&
    !input.horizon &&
    !input.previousScenario?.horizon
  ) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_HORIZON_REQUIRED);
    return Object.freeze({
      scenario: null,
      status: "clarification-required",
      clarificationPrompt: "For what time horizon?",
      trace: Object.freeze({
        requestKind: input.requestKind,
        subjectIds: Object.freeze([...(input.subjectIds ?? [])]),
        assumptionKeys: Object.freeze([]),
        interventionSubjects: Object.freeze([]),
        horizon: null,
        revision: input.previousScenario?.revision ?? 0,
        reasons: Object.freeze(reasons),
      }),
    });
  }

  const previous = input.previousScenario ?? null;
  const revision =
    input.requestKind === "modify" || input.requestKind === "add-assumption"
      ? (previous?.revision ?? 0) + 1
      : previous?.revision ?? 1;

  if (
    input.requestKind === "modify" ||
    input.requestKind === "add-assumption"
  ) {
    reasons.push(
      EXECUTIVE_SCENARIO_REASON.SCENARIO_MODIFIED,
      EXECUTIVE_SCENARIO_REASON.REVISION_ADVANCED,
    );
  } else {
    reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_DEFINED);
  }

  let interventions = Object.freeze(
    [...(previous?.interventions ?? [])].map(freezeIntervention),
  );
  let assumptions = Object.freeze(
    [...(previous?.assumptions ?? [])].map(freezeAssumption),
  );

  if (input.requestKind === "intervention" || input.requestKind === "do-nothing") {
    interventions = Object.freeze(
      [...(input.interventions ?? [])].map(freezeIntervention),
    );
    assumptions = Object.freeze(
      [...(input.assumptions ?? [])].map(freezeAssumption),
    );
  }

  if (input.requestKind === "modify") {
    interventions = Object.freeze(
      [...(input.interventions ?? previous?.interventions ?? [])].map(
        freezeIntervention,
      ),
    );
    assumptions = Object.freeze(
      [...(input.assumptions ?? previous?.assumptions ?? [])].map(
        freezeAssumption,
      ),
    );
  }

  if (input.requestKind === "add-assumption") {
    assumptions = Object.freeze(
      [
        ...(previous?.assumptions ?? []),
        ...(input.assumptions ?? []),
      ].map(freezeAssumption),
    );
    interventions = Object.freeze(
      [...(input.interventions ?? previous?.interventions ?? [])].map(
        freezeIntervention,
      ),
    );
    reasons.push(EXECUTIVE_SCENARIO_REASON.ASSUMPTION_ADDED);
  }

  if (input.requestKind === "do-nothing") {
    interventions = Object.freeze([]);
    reasons.push(EXECUTIVE_SCENARIO_REASON.DO_NOTHING_DEFINED);
  }

  if (interventions.length > 0) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.INTERVENTION_DEFINED);
  }

  const kind =
    input.requestKind === "do-nothing" ||
    (previous?.kind === "do-nothing" && interventions.length === 0)
      ? ("do-nothing" as const)
      : interventions.length > 0
        ? ("intervention" as const)
        : ("custom" as const);

  const primarySubjectId =
    input.primarySubjectId ??
    interventions[0]?.subjectId ??
    assumptions[0]?.subjectId ??
    input.executiveContext.currentSubject?.subjectId ??
    null;

  if (primarySubjectId) {
    reasons.push(
      input.primarySubjectId
        ? EXECUTIVE_SCENARIO_REASON.EXPLICIT_SUBJECT_SCOPE
        : EXECUTIVE_SCENARIO_REASON.CONTEXT_SUBJECT_SCOPE,
    );
  }

  const subjectIds = Object.freeze(
    [
      ...(input.subjectIds ?? []),
      ...(primarySubjectId ? [primarySubjectId] : []),
      ...interventions.map((i) => i.subjectId),
      ...assumptions
        .map((a) => a.subjectId)
        .filter((id): id is string => Boolean(id)),
      ...(input.executiveContext.currentGoal
        ? [input.executiveContext.currentGoal.subjectId]
        : []),
      ...(input.executiveContext.currentProblem
        ? [input.executiveContext.currentProblem.subjectId]
        : []),
    ].filter((id, index, all) => all.indexOf(id) === index),
  );

  const subjectKey =
    kind === "do-nothing"
      ? "do-nothing"
      : (primarySubjectId ?? "custom").replace(/[^a-z0-9-]/gi, "");

  const horizon = input.horizon ?? previous?.horizon ?? null;
  const scenarioId =
    input.requestKind === "open-existing" && input.existingScenarioId
      ? input.existingScenarioId
      : buildScenarioId({ kind, subjectKey, revision });

  const scenario: NexoraExecutiveScenario = Object.freeze({
    scenarioId,
    name: nameFor({
      kind,
      interventions,
      assumptions,
      nameHint: input.nameHint,
      existingName: input.existingScenarioName,
    }),
    revision,
    baseContextId:
      previous?.baseContextId ??
      input.executiveContext.currentWorkspaceId ??
      undefined,
    subjectIds,
    assumptions,
    interventions,
    horizon,
    source: input.recommendationId
      ? "recommendation-handoff"
      : input.requestKind === "open-existing"
        ? "existing-scenario"
        : "conversation",
    status: "defined",
    recommendationId:
      input.recommendationId ?? previous?.recommendationId ?? null,
    parentScenarioId: previous?.scenarioId ?? null,
    kind,
  });

  if (input.executiveContext.currentGoal) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.GOAL_ALIGNMENT);
  }
  if (input.executiveContext.currentProblem) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.PROBLEM_ALIGNMENT);
  }

  return Object.freeze({
    scenario,
    status: "defined",
    clarificationPrompt: null,
    trace: Object.freeze({
      requestKind: input.requestKind,
      subjectIds,
      assumptionKeys: Object.freeze(assumptions.map((a) => a.key)),
      interventionSubjects: Object.freeze(
        interventions.map((i) => i.subjectId),
      ),
      horizon,
      revision,
      reasons: Object.freeze(reasons),
    }),
  });
}
