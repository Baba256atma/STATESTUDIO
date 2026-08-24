/**
 * CC:9 — Primary scenario conversation resolver (define → evaluate → compare).
 * Pure. Session drafts only. Stops before Decision commitment.
 */

import type { NexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import {
  EXECUTIVE_SCENARIO_REASON,
  type ExecutiveScenarioReasonCode,
} from "./executiveScenarioConversation.ts";
import {
  compareNexoraExecutiveScenarios,
  type NexoraScenarioComparison,
} from "./executiveScenarioComparison.ts";
import {
  defineNexoraExecutiveScenario,
  type NexoraExecutiveScenario,
  type NexoraScenarioAssumption,
  type NexoraScenarioHorizon,
  type NexoraScenarioIntervention,
} from "./executiveScenarioDefinition.ts";
import {
  createNexoraScenarioBaselineSnapshot,
  evaluateNexoraExecutiveScenario,
  type NexoraExecutiveScenarioEvaluation,
  type NexoraScenarioBaselineSnapshot,
} from "./executiveScenarioEvaluation.ts";
import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import {
  presentGroundedScenarioImpact,
} from "./groundedScenarioImpactAssessment.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";

export type NexoraExecutiveScenarioSession = {
  readonly scenariosById: Readonly<Record<string, NexoraExecutiveScenario>>;
  readonly evaluationsById: Readonly<
    Record<string, NexoraExecutiveScenarioEvaluation>
  >;
  readonly candidateScenarioIds: readonly string[];
  readonly activeScenarioId: string | null;
  readonly lastComparison: NexoraScenarioComparison | null;
  readonly baseline: NexoraScenarioBaselineSnapshot;
  readonly recommendationHandoffId: string | null;
};

export type NexoraExecutiveScenarioConversationStatus =
  | "defined"
  | "evaluated"
  | "partial"
  | "compared"
  | "unsupported"
  | "insufficient-data"
  | "clarification-required"
  | "commitment-handoff"
  | "invalid";

export type NexoraExecutiveScenarioConversationResult = {
  readonly status: NexoraExecutiveScenarioConversationStatus;
  readonly scenario: NexoraExecutiveScenario | null;
  readonly evaluation: NexoraExecutiveScenarioEvaluation | null;
  readonly comparison: NexoraScenarioComparison | null;
  readonly nextSession: NexoraExecutiveScenarioSession;
  readonly clarificationPrompt: string | null;
  readonly summary: string;
  readonly trace: {
    readonly operation: string;
    readonly reasons: readonly ExecutiveScenarioReasonCode[];
  };
};

export type NexoraExecutiveScenarioConversationInput = {
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly operation:
    | "define-do-nothing"
    | "define-intervention"
    | "modify"
    | "add-assumption"
    | "evaluate"
    | "compare"
    | "explain"
    | "downside"
    | "open-candidate"
    | "describe"
    | "confidence"
    | "affected"
    | "kpi-impact"
    | "impact-why"
    | "commitment-attempt";
  readonly primarySubjectId?: string | null;
  readonly secondarySubjectId?: string | null;
  readonly interventions?: readonly NexoraScenarioIntervention[];
  readonly assumptions?: readonly NexoraScenarioAssumption[];
  readonly horizon?: NexoraScenarioHorizon | null;
  readonly requireHorizon?: boolean;
  readonly compareScenarioIds?: readonly string[];
  readonly candidateOrdinal?: number | null;
  readonly session?: NexoraExecutiveScenarioSession | null;
  readonly baselineAttentionBySubject?: Readonly<
    Record<string, "normal" | "elevated" | "important" | "critical" | undefined>
  >;
  readonly relatedSubjectIds?: readonly string[];
  readonly recommendationId?: string | null;
  readonly nameHint?: string | null;
  readonly subjectIds?: readonly string[];
};

export function createEmptyNexoraExecutiveScenarioSession(input?: {
  readonly baselineAttentionBySubject?: Readonly<
    Record<string, "normal" | "elevated" | "important" | "critical" | undefined>
  >;
  readonly recommendationHandoffId?: string | null;
}): NexoraExecutiveScenarioSession {
  return Object.freeze({
    scenariosById: Object.freeze({}),
    evaluationsById: Object.freeze({}),
    candidateScenarioIds: Object.freeze([]),
    activeScenarioId: null,
    lastComparison: null,
    baseline: createNexoraScenarioBaselineSnapshot({
      attentionBySubject: input?.baselineAttentionBySubject ?? {},
    }),
    recommendationHandoffId: input?.recommendationHandoffId ?? null,
  });
}

function pushCandidate(
  ids: readonly string[],
  scenarioId: string,
): readonly string[] {
  const next = [scenarioId, ...ids.filter((id) => id !== scenarioId)];
  return Object.freeze(next.slice(0, 8));
}

function sessionWithScenario(
  session: NexoraExecutiveScenarioSession,
  scenario: NexoraExecutiveScenario,
  evaluation: NexoraExecutiveScenarioEvaluation | null,
): NexoraExecutiveScenarioSession {
  return Object.freeze({
    ...session,
    scenariosById: Object.freeze({
      ...session.scenariosById,
      [scenario.scenarioId]: scenario,
    }),
    evaluationsById: evaluation
      ? Object.freeze({
          ...session.evaluationsById,
          [evaluation.scenarioId]: evaluation,
        })
      : session.evaluationsById,
    candidateScenarioIds: pushCandidate(
      session.candidateScenarioIds,
      scenario.scenarioId,
    ),
    activeScenarioId: scenario.scenarioId,
  });
}

function summarizeEvaluation(
  scenario: NexoraExecutiveScenario,
  evaluation: NexoraExecutiveScenarioEvaluation,
): string {
  const grounded = evaluation.groundedImpact;
  if (grounded && grounded.affectedTargets.length > 0) {
    const subjectId =
      grounded.subjectId ||
      scenario.interventions[0]?.subjectId ||
      scenario.assumptions[0]?.subjectId;
    return presentGroundedScenarioImpact({
      assessment: grounded,
      subjectLabel: subjectLabelFromId(subjectId),
      parentScenarioName: scenario.parentScenarioId
        ? subjectLabelFromId(scenario.parentScenarioId)
        : null,
    });
  }
  const capacity = evaluation.impacts.find(
    (i) => i.subjectId === "obj-capacity" && i.metricKey === "capacity-pressure",
  );
  if (scenario.kind === "do-nothing") {
    const primaryId =
      scenario.subjectIds.find((id) => id.startsWith("obj-") || id.startsWith("ctx-problem") || id.startsWith("ctx-")) ??
      scenario.subjectIds[0];
    const subject = subjectLabelFromId(primaryId);
    const related = scenario.subjectIds
      .filter((id) => id !== primaryId && !id.startsWith("cc9:"))
      .map(subjectLabelFromId)
      .filter((label, index, all) => all.indexOf(label) === index && label !== subject);
    const relatedClause =
      related.length > 0
        ? `concerns around ${related.slice(0, 3).join(" and ")} may continue or become more significant.`
        : `current conditions around ${subject} may continue.`;
    const goalUnknown = !scenario.subjectIds.some((id) =>
      id.startsWith("ctx-goal") || id.includes("goal"),
    );
    const goalLine = goalUnknown
      ? "I can’t yet judge the impact against a specific business goal."
      : null;
    return [
      `If ${subject} remains without intervention, ${relatedClause}`,
      "We don’t yet have enough evidence to quantify that impact, so this is a scenario rather than a prediction.",
      goalLine,
      "I can compare doing nothing with investigating now.",
    ]
      .filter(Boolean)
      .join(" ");
  }
  if (scenario.interventions.some((item) => item.actionKind === "investigate")) {
    const subject = subjectLabelFromId(
      scenario.interventions[0]?.subjectId ?? scenario.subjectIds[0],
    );
    return [
      `Investigate ${subject} is an alternative to taking no action.`,
      "It does not commit a Decision, and we do not yet have enough evidence to quantify the benefit.",
      "This is a scenario rather than a prediction.",
    ].join(" ");
  }
  const lines: string[] = [`Scenario evaluated: ${scenario.name}.`];
  if (capacity?.direction === "decrease") {
    lines.push("Capacity pressure improves.");
  } else if (capacity?.direction === "increase") {
    lines.push("Capacity pressure worsens.");
  }
  const unknown = evaluation.impacts.filter((i) => i.direction === "unknown");
  if (unknown.length > 0) {
    lines.push(
      `${unknown
        .map((u) => subjectLabelFromId(u.subjectId))
        .filter((label, index, all) => all.indexOf(label) === index)
        .join(", ")} impact remains unresolved.`,
    );
  }
  if (evaluation.uncertainties[0]) {
    lines.push(`Uncertainty: ${evaluation.uncertainties[0].description}`);
  }
  return lines.join(" ");
}

function subjectLabelFromId(subjectId: string | undefined): string {
  if (!subjectId) return "that subject";
  const labeled =
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((item) => item.id === subjectId)
      ?.label ??
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((item) => item.id === subjectId)
      ?.label;
  if (labeled) return labeled;
  const raw = subjectId
    .replace(/^obj-/, "")
    .replace(/^ctx-(?:problem|scenario|decision|execution)-/, "")
    .replace(/-/g, " ");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export type NexoraScenarioExplanationProjection = {
  readonly scenarioId: string;
  readonly scenarioName: string;
  readonly definition: string;
  readonly representedChange: string | null;
  readonly modeledEffects: readonly string[];
  readonly relatedSubjects: readonly string[];
  readonly assumptions: readonly string[];
  readonly risks: readonly string[];
  readonly uncertainty: readonly string[];
  readonly evidenceState: "canonical-model" | "insufficient";
  readonly projectionStatus: "projection-not-observed-outcome";
};

export function projectNexoraScenarioExplanation(input: {
  readonly scenarioName: string;
  readonly subjectId: string;
  readonly relatedSubjectIds?: readonly string[];
}): NexoraScenarioExplanationProjection {
  const presentation = getNexoraMVPSubjectPresentationFixture(input.subjectId);
  const related =
    presentation?.relationships.map((rel) => rel.label) ??
    input.relatedSubjectIds?.map(subjectLabelFromId) ??
    [];
  const modeledEffects = related.map(
    (label) =>
      `The current scenario model associates it with ${label}. That association is not a proven causal finding.`,
  );
  const uncertainty =
    related.length === 0
      ? Object.freeze([
          "Some relationships remain uncertain, so projected effects are not treated as proven.",
        ])
      : Object.freeze([
          "Unsupported causal claims are withheld; modeled association is not causal proof.",
        ]);
  return Object.freeze({
    scenarioId: input.subjectId,
    scenarioName: input.scenarioName,
    definition: `${input.scenarioName} is a scenario.`,
    representedChange: presentation?.summary ?? null,
    modeledEffects: Object.freeze(modeledEffects),
    relatedSubjects: Object.freeze([...related]),
    assumptions: Object.freeze([]),
    risks: Object.freeze([]),
    uncertainty,
    evidenceState: presentation ? ("canonical-model" as const) : ("insufficient" as const),
    projectionStatus: "projection-not-observed-outcome",
  });
}

function describeScenarioSummary(input: {
  readonly scenarioName: string;
  readonly subjectId: string;
  readonly relatedSubjectIds?: readonly string[];
}): string {
  const projection = projectNexoraScenarioExplanation(input);
  const lines = [
    `Scenario: ${projection.scenarioName}.`,
    projection.definition,
  ];
  if (projection.representedChange) {
    lines.push(`What it represents: ${projection.representedChange}`);
  }
  if (projection.modeledEffects.length > 0) {
    lines.push(projection.modeledEffects.join(" "));
  }
  lines.push("This is a scenario projection, not an observed outcome.");
  if (projection.uncertainty.length > 0) {
    lines.push(projection.uncertainty.join(" "));
  }
  return lines.join(" ");
}

/**
 * Primary CC:9 API.
 */
export function resolveNexoraExecutiveScenarioConversation(
  input: NexoraExecutiveScenarioConversationInput,
): NexoraExecutiveScenarioConversationResult {
  const session =
    input.session ??
    createEmptyNexoraExecutiveScenarioSession({
      baselineAttentionBySubject: input.baselineAttentionBySubject,
      recommendationHandoffId: input.recommendationId ?? null,
    });

  // Preserve baseline identity across operations (integrity).
  const baseline =
    input.baselineAttentionBySubject != null
      ? createNexoraScenarioBaselineSnapshot({
          baselineId: session.baseline.baselineId,
          attentionBySubject: input.baselineAttentionBySubject,
        })
      : session.baseline;

  const baseSession: NexoraExecutiveScenarioSession = Object.freeze({
    ...session,
    baseline,
    recommendationHandoffId:
      input.recommendationId ?? session.recommendationHandoffId,
  });

  if (input.operation === "commitment-attempt") {
    return Object.freeze({
      status: "commitment-handoff",
      scenario: baseSession.activeScenarioId
        ? baseSession.scenariosById[baseSession.activeScenarioId] ?? null
        : null,
      evaluation: null,
      comparison: null,
      nextSession: baseSession,
      clarificationPrompt: null,
      summary:
        "Scenario reference available — Decision commitment is handled by CC:10.",
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.DECISION_COMMITMENT_DEFERRED,
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
        ]),
      }),
    });
  }

  if (input.operation === "describe") {
    const subjectId =
      input.primarySubjectId ??
      input.executiveContext.currentScenario?.subjectId ??
      input.executiveContext.currentSubject?.subjectId ??
      null;
    if (!subjectId) {
      return Object.freeze({
        status: "insufficient-data",
        scenario: null,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: "Which scenario should I explain?",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    const existing = baseSession.scenariosById[subjectId] ?? null;
    const defined =
      existing ??
      defineNexoraExecutiveScenario({
        executiveContext: input.executiveContext,
        requestKind: "open-existing",
        existingScenarioId: subjectId,
        existingScenarioName: subjectLabelFromId(subjectId),
        nameHint: subjectLabelFromId(subjectId),
      }).scenario;
    if (!defined) {
      return Object.freeze({
        status: "insufficient-data",
        scenario: null,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: "That scenario isn't available in the current set.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    const next = sessionWithScenario(baseSession, defined, null);
    return Object.freeze({
      status: "defined",
      scenario: defined,
      evaluation: null,
      comparison: null,
      nextSession: next,
      clarificationPrompt: null,
      summary: describeScenarioSummary({
        scenarioName: defined.name,
        subjectId,
        relatedSubjectIds: input.relatedSubjectIds,
      }),
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.SCENARIO_DEFINED,
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
        ]),
      }),
    });
  }

  if (input.operation === "confidence") {
    const activeId = baseSession.activeScenarioId;
    const evaluation = activeId
      ? baseSession.evaluationsById[activeId] ?? null
      : null;
    const scenario = activeId
      ? baseSession.scenariosById[activeId] ?? null
      : null;
    if (!evaluation || !scenario) {
      return Object.freeze({
        status: "insufficient-data",
        scenario,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: scenario
          ? "This Scenario is a projection, not an observed outcome. Without an evaluated intervention, Nexora cannot state a stronger confidence. That is not causal or outcome confidence."
          : "I don't have a scenario evaluation yet, so I can't state scenario confidence. This is not causal or outcome confidence.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    const uncertainty = evaluation.uncertainties[0]?.description;
    return Object.freeze({
      status: evaluation.status === "partial" ? "partial" : "evaluated",
      scenario,
      evaluation,
      comparison: null,
      nextSession: baseSession,
      clarificationPrompt: null,
      summary: uncertainty
        ? `${uncertainty} That confidence applies to the scenario projection, not to Reality, Actual Outcome, or causal proof.`
        : "Scenario confidence is limited to the evaluated projection. This is not Reality, Actual Outcome, or causal proof.",
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.SCENARIO_EVALUATED,
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
        ]),
      }),
    });
  }

  if (
    input.operation === "affected" ||
    input.operation === "kpi-impact" ||
    input.operation === "impact-why"
  ) {
    const activeId = baseSession.activeScenarioId;
    const evaluation = activeId
      ? baseSession.evaluationsById[activeId] ?? null
      : null;
    const scenario = activeId
      ? baseSession.scenariosById[activeId] ?? null
      : null;
    const grounded = evaluation?.groundedImpact ?? null;
    if (!scenario) {
      return Object.freeze({
        status: "insufficient-data",
        scenario,
        evaluation,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: "There isn't a current Scenario impact assessment to explain.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    if (!evaluation) {
      const projection = projectNexoraScenarioExplanation({
        scenarioName: scenario.name,
        subjectId: scenario.scenarioId,
        relatedSubjectIds: input.relatedSubjectIds ?? scenario.subjectIds,
      });
      const related = projection.relatedSubjects.join(", ");
      const summary =
        input.operation === "affected"
          ? related
            ? `The current scenario model associates ${projection.scenarioName} with ${related}. Additional intervention impact is not established yet. This remains a Scenario projection, not Reality or Actual Outcome.`
            : "No additional affected dimensions are supported by the current Scenario model."
          : input.operation === "kpi-impact"
            ? "No canonical KPI impact is supported without a Scenario intervention evaluation. Magnitude is not invented."
            : related
              ? `The current scenario model associates ${projection.scenarioName} with ${related}. That association is not a proven causal finding.`
              : "There is no supported impact basis to explain.";
      return Object.freeze({
        status: "insufficient-data",
        scenario,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary,
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.SCENARIO_CAUSALITY_NOT_MODELED,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    const kpis = (grounded?.affectedTargets ?? []).filter(
      (target) => target.targetKind === "kpi",
    );
    const risks = evaluation.risks;
    let summary = summarizeEvaluation(scenario, evaluation);
    if (input.operation === "affected") {
      summary =
        kpis.length > 0
          ? `Supported affected dimensions: ${kpis
              .map((target) => target.dimension ?? target.targetId)
              .join(", ")}. Downstream effects without a canonical binding are omitted. This remains a Scenario projection, not Reality or Actual Outcome.`
          : "No additional affected dimensions are supported by the current Scenario model.";
    } else if (input.operation === "kpi-impact") {
      summary =
        kpis.length > 0
          ? `Supported KPI pressure: ${kpis
              .map((target) => `${target.dimension ?? target.targetId} (${target.direction})`)
              .join("; ")}. Magnitude is not quantified.`
          : "No canonical KPI impact is supported for this Scenario intervention.";
    } else if (input.operation === "impact-why") {
      const basis = kpis[0]?.impactBasis ?? "unsupported";
      summary =
        kpis.length > 0
          ? `The current Scenario model binds this intervention to ${kpis[0]?.dimension ?? "the subject's KPI"} via ${basis.replace(/-/g, " ")}. This is a modeled relationship; it is not proof that a future observed change was caused by this intervention.`
          : "There is no supported impact basis to explain.";
    }
    if (input.operation === "affected" && risks.length === 0) {
      summary += " No canonical Risk impact is attached.";
    }
    return Object.freeze({
      status: evaluation.status === "partial" ? "partial" : "evaluated",
      scenario,
      evaluation,
      comparison: null,
      nextSession: baseSession,
      clarificationPrompt: null,
      summary,
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          EXECUTIVE_SCENARIO_REASON.SCENARIO_CAUSALITY_NOT_MODELED,
        ]),
      }),
    });
  }

  if (input.operation === "open-candidate") {
    const ordinal = input.candidateOrdinal;
    const id =
      ordinal != null && ordinal >= 0
        ? baseSession.candidateScenarioIds[ordinal] ?? null
        : input.primarySubjectId;
    const scenario = id ? baseSession.scenariosById[id] ?? null : null;
    if (!scenario) {
      return Object.freeze({
        status: "insufficient-data",
        scenario: null,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: "That scenario isn't in the current presented set.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    return Object.freeze({
      status: "defined",
      scenario,
      evaluation: baseSession.evaluationsById[scenario.scenarioId] ?? null,
      comparison: null,
      nextSession: Object.freeze({
        ...baseSession,
        activeScenarioId: scenario.scenarioId,
      }),
      clarificationPrompt: null,
      summary: `Opened ${scenario.name}.`,
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.SCENARIO_DEFINED,
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
        ]),
      }),
    });
  }

  if (input.operation === "downside") {
    const activeId = baseSession.activeScenarioId;
    const evaluation = activeId
      ? baseSession.evaluationsById[activeId] ?? null
      : null;
    const scenario = activeId
      ? baseSession.scenariosById[activeId] ?? null
      : null;
    if (!evaluation || !scenario) {
      return Object.freeze({
        status: "insufficient-data",
        scenario,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: scenario
          ? "No canonical Risk impact is supported for this Scenario. That is not a proven causal finding."
          : "No evaluated scenario is active for a downside review.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    const parts = [
      ...evaluation.risks.map((r) => r.summary),
      ...evaluation.tradeoffs.map(
        (t) => `Trade-off (${t.dimension}): ${t.downside}`,
      ),
    ];
    return Object.freeze({
      status: evaluation.status === "partial" ? "partial" : "evaluated",
      scenario,
      evaluation,
      comparison: null,
      nextSession: baseSession,
      clarificationPrompt: null,
      summary:
        parts.length > 0
          ? parts.join(" ")
          : "No canonical Risk impact is supported for this Scenario intervention. That is not a proven causal finding.",
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.SCENARIO_EVALUATED,
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
        ]),
      }),
    });
  }

  if (input.operation === "explain") {
    const comparison = baseSession.lastComparison;
    if (!comparison?.preferredScenarioId) {
      return Object.freeze({
        status: "insufficient-data",
        scenario: null,
        evaluation: null,
        comparison,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: "No scenario comparison preference is available to explain.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: Object.freeze([
            EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
            EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
          ]),
        }),
      });
    }
    return Object.freeze({
      status: "compared",
      scenario:
        baseSession.scenariosById[comparison.preferredScenarioId] ?? null,
      evaluation:
        baseSession.evaluationsById[comparison.preferredScenarioId] ?? null,
      comparison,
      nextSession: baseSession,
      clarificationPrompt: null,
      summary: comparison.preferenceReasons.join(" "),
      trace: Object.freeze({
        operation: input.operation,
        reasons: Object.freeze([
          EXECUTIVE_SCENARIO_REASON.SCENARIO_PREFERENCE_DERIVED,
          EXECUTIVE_SCENARIO_REASON.DECISION_COMMITMENT_DEFERRED,
          EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
        ]),
      }),
    });
  }

  if (input.operation === "compare") {
    const ids =
      input.compareScenarioIds && input.compareScenarioIds.length >= 2
        ? input.compareScenarioIds
        : baseSession.candidateScenarioIds.slice(0, 2);
    const scenarios = ids
      .map((id) => baseSession.scenariosById[id])
      .filter((s): s is NexoraExecutiveScenario => Boolean(s));
    const evaluations = ids
      .map((id) => baseSession.evaluationsById[id])
      .filter((e): e is NexoraExecutiveScenarioEvaluation => Boolean(e));
    const compared = compareNexoraExecutiveScenarios({
      scenarios,
      evaluations,
      goalSubjectId: input.executiveContext.currentGoal?.subjectId ?? null,
      problemSubjectId: input.executiveContext.currentProblem?.subjectId ?? null,
    });
    if (!compared.comparison) {
      return Object.freeze({
        status: "insufficient-data",
        scenario: null,
        evaluation: null,
        comparison: null,
        nextSession: baseSession,
        clarificationPrompt: null,
        summary: "I need at least two evaluated scenarios to compare.",
        trace: Object.freeze({
          operation: input.operation,
          reasons: compared.trace.reasons,
        }),
      });
    }
    const preferred = compared.comparison.preferredScenarioId;
    const preferredName = preferred
      ? baseSession.scenariosById[preferred]?.name ?? preferred
      : null;
    return Object.freeze({
      status: "compared",
      scenario: preferred
        ? baseSession.scenariosById[preferred] ?? null
        : null,
      evaluation: preferred
        ? baseSession.evaluationsById[preferred] ?? null
        : null,
      comparison: compared.comparison,
      nextSession: Object.freeze({
        ...baseSession,
        lastComparison: compared.comparison,
        activeScenarioId: preferred ?? baseSession.activeScenarioId,
      }),
      clarificationPrompt: null,
      summary: preferredName
        ? `Comparison complete. ${preferredName} aligns better under current evidence, but this is not a Decision commitment.`
        : "Comparison complete. Trade-offs remain explicit; no commitment.",
      trace: Object.freeze({
        operation: input.operation,
        reasons: compared.trace.reasons,
      }),
    });
  }

  // Define / modify / add-assumption / evaluate
  const previous =
    input.operation === "modify" ||
    input.operation === "add-assumption" ||
    input.operation === "evaluate"
      ? baseSession.activeScenarioId
        ? baseSession.scenariosById[baseSession.activeScenarioId] ?? null
        : null
      : null;

  const requestKind =
    input.operation === "define-do-nothing"
      ? ("do-nothing" as const)
      : input.operation === "modify"
        ? ("modify" as const)
        : input.operation === "add-assumption"
          ? ("add-assumption" as const)
          : input.operation === "evaluate" && previous
            ? ("modify" as const)
            : ("intervention" as const);

  const defined = defineNexoraExecutiveScenario({
    executiveContext: input.executiveContext,
    requestKind:
      input.operation === "define-do-nothing"
        ? "do-nothing"
        : requestKind === "modify"
          ? "modify"
          : requestKind === "add-assumption"
            ? "add-assumption"
            : "intervention",
    primarySubjectId: input.primarySubjectId,
    subjectIds: input.subjectIds ?? input.relatedSubjectIds,
    interventions: input.interventions,
    assumptions: input.assumptions,
    horizon: input.horizon,
    requireHorizon:
      input.requireHorizon ??
      (input.operation === "define-do-nothing" ? true : false),
    nameHint: input.nameHint,
    previousScenario: previous,
    recommendationId:
      input.recommendationId ?? baseSession.recommendationHandoffId,
  });

  if (defined.status === "clarification-required" || !defined.scenario) {
    return Object.freeze({
      status: "clarification-required",
      scenario: null,
      evaluation: null,
      comparison: null,
      nextSession: baseSession,
      clarificationPrompt: defined.clarificationPrompt,
      summary: defined.clarificationPrompt ?? "Clarification required.",
      trace: Object.freeze({
        operation: input.operation,
        reasons: defined.trace.reasons,
      }),
    });
  }

  const evaluated = evaluateNexoraExecutiveScenario({
    scenario: defined.scenario,
    baseline,
    goalSubjectId: input.executiveContext.currentGoal?.subjectId ?? null,
    problemSubjectId: input.executiveContext.currentProblem?.subjectId ?? null,
    relatedSubjectIds: input.relatedSubjectIds,
    requireHorizonForDoNothing: input.requireHorizon ?? true,
  });

  if (evaluated.status === "clarification-required") {
    // Keep defined draft in session without evaluation.
    const next = sessionWithScenario(baseSession, defined.scenario, null);
    return Object.freeze({
      status: "clarification-required",
      scenario: defined.scenario,
      evaluation: null,
      comparison: null,
      nextSession: next,
      clarificationPrompt: evaluated.clarificationPrompt,
      summary: evaluated.clarificationPrompt ?? "For what time horizon?",
      trace: Object.freeze({
        operation: input.operation,
        reasons: evaluated.trace.reasons,
      }),
    });
  }

  const next = sessionWithScenario(
    baseSession,
    defined.scenario,
    evaluated.evaluation,
  );

  if (evaluated.status === "unsupported") {
    const intervention = defined.scenario.interventions[0];
    const assumption = defined.scenario.assumptions[0];
    const conditionId = intervention?.subjectId ?? assumption?.subjectId;
    const subjectLabel = subjectLabelFromId(conditionId);
    const parentName =
      defined.scenario.parentScenarioId
        ? subjectLabelFromId(defined.scenario.parentScenarioId)
        : defined.scenario.name;
    const delayed =
      intervention?.actionKind === "delay" || assumption?.operator === "delay";
    const intensity = intervention?.intensity ?? assumption?.intensity;
    const severe =
      intensity === "too" ||
      intensity === "very" ||
      intensity === "extremely";
    const direction = delayed
      ? "late"
      : intervention?.actionKind === "decrease-by" ||
          assumption?.operator === "decrease-by"
        ? "decreasing"
        : "increasing";
    const summary = delayed
      ? defined.scenario.parentScenarioId
        ? severe
          ? `I understand you want to test a severe ${subjectLabel} delay within the ${parentName} scenario, but I don't currently have a supported impact model for that change.`
          : `I understand that you want to test late ${subjectLabel} within the ${parentName} scenario, but Nexora does not currently have a supported impact model for that condition.`
        : severe
          ? `I understand you want to test a severe ${subjectLabel} delay, but I don't currently have a supported impact model for that change.`
          : `I understand that you want to test late ${subjectLabel}, but Nexora does not currently have a supported impact model for that condition.`
      : `I understand that you want to explore ${direction} ${subjectLabel}, but I don't currently have a supported impact model for that change.`;
    return Object.freeze({
      status: "unsupported",
      scenario: defined.scenario,
      evaluation: evaluated.evaluation,
      comparison: null,
      nextSession: next,
      clarificationPrompt: null,
      summary,
      trace: Object.freeze({
        operation: input.operation,
        reasons: evaluated.trace.reasons,
      }),
    });
  }

  if (evaluated.status === "insufficient-data" || !evaluated.evaluation) {
    return Object.freeze({
      status: "insufficient-data",
      scenario: defined.scenario,
      evaluation: evaluated.evaluation,
      comparison: null,
      nextSession: next,
      clarificationPrompt: null,
      summary: "I don't have enough trusted data to evaluate that scenario.",
      trace: Object.freeze({
        operation: input.operation,
        reasons: evaluated.trace.reasons,
      }),
    });
  }

  return Object.freeze({
    status: evaluated.status === "partial" ? "partial" : "evaluated",
    scenario: defined.scenario,
    evaluation: evaluated.evaluation,
    comparison: null,
    nextSession: next,
    clarificationPrompt: null,
    summary: summarizeEvaluation(defined.scenario, evaluated.evaluation),
    trace: Object.freeze({
      operation: input.operation,
      reasons: Object.freeze([
        ...defined.trace.reasons,
        ...evaluated.trace.reasons,
      ]),
    }),
  });
}
