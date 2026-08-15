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
  const capacity = evaluation.impacts.find(
    (i) => i.subjectId === "obj-capacity" && i.metricKey === "capacity-pressure",
  );
  const lines: string[] = [`Scenario evaluated: ${scenario.name}.`];
  if (capacity?.direction === "decrease") {
    lines.push("Capacity pressure improves.");
  } else if (capacity?.direction === "increase") {
    lines.push("Capacity pressure worsens.");
  } else if (scenario.kind === "do-nothing") {
    lines.push("Baseline conditions continue without new intervention.");
  }
  const unknown = evaluation.impacts.filter((i) => i.direction === "unknown");
  if (unknown.length > 0) {
    lines.push(
      `${unknown.map((u) => u.subjectId).join(", ")} impact remains unresolved.`,
    );
  }
  if (evaluation.uncertainties[0]) {
    lines.push(`Uncertainty: ${evaluation.uncertainties[0].description}`);
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
        summary: "No evaluated scenario is active for a downside review.",
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
      ...evaluation.uncertainties.map((u) => u.description),
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
          : "No material downside is recorded for the active scenario.",
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
    interventions: input.interventions,
    assumptions: input.assumptions,
    horizon: input.horizon,
    requireHorizon:
      input.requireHorizon ??
      (input.operation === "define-do-nothing" ? true : false),
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
    return Object.freeze({
      status: "unsupported",
      scenario: defined.scenario,
      evaluation: evaluated.evaluation,
      comparison: null,
      nextSession: next,
      clarificationPrompt: null,
      summary: "That change isn't modeled in the current scenario system.",
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
