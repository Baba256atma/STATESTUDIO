/**
 * NEX-EXP:8 — plan projection, readiness, and CC:11 start/cancel routing.
 * Does not invent owners, dates, or progress percentages.
 */

import { executiveExecutionFollowUpIdentity } from "@/app/lib/conversational-control/executiveExecutionFollowUp.ts";
import type { NexoraExecutionRuntimeAdapter } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import { EXECUTION_OUTCOME_LEARNING_BOUNDARY } from "@/app/lib/executive-intelligence/executionOutcomeLearningIntelligence.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type {
  ExecutionBlocker,
  ExecutionReadiness,
  ExecutiveExecutionAction,
  ExecutiveExecutionPlan,
  NexoraOutcomeMonitoringHandoff,
} from "./nexoraExecutionPlanningTypes.ts";

export function isExecutionPlanningUtterance(normalized: string): boolean {
  return (
    /what happens next/.test(normalized) ||
    /what(?:'s| is) the execution plan/.test(normalized) ||
    /what exactly needs to happen/.test(normalized) ||
    /who owns (?:this|it|execution)/.test(normalized) ||
    /what comes first/.test(normalized) ||
    /what can happen in parallel/.test(normalized) ||
    /what is blocking/.test(normalized) ||
    /are we ready to start/.test(normalized) ||
    /can we start/.test(normalized) ||
    /why aren'?t we ready/.test(normalized) ||
    /what assumptions remain/.test(normalized) ||
    /what constraints matter/.test(normalized) ||
    /what will tell us execution is progressing/.test(normalized) ||
    /does this mean the goal is achieved/.test(normalized) ||
    /i like (?:this |the )?plan/.test(normalized) ||
    /did execution start/.test(normalized) ||
    /let'?s (?:start|execute)/.test(normalized) ||
    /^(?:start it|start execution|start the plan)$/.test(normalized) ||
    /what is the execution status/.test(normalized) ||
    /change the plan/.test(normalized) ||
    /make .+ first/.test(normalized) ||
    /^remove /.test(normalized) ||
    /pause execution/.test(normalized) ||
    /cancel execution/.test(normalized) ||
    /assign .+ as owner/.test(normalized) ||
    /the (?:operational )?owner is /.test(normalized)
  );
}

export function isBareExecutionConfirmation(normalized: string): boolean {
  return /^(?:yes|confirm(?: it)?|yes,? confirm)$/.test(normalized);
}

export function executionAuthorities() {
  return Object.freeze({
    cc11: executiveExecutionFollowUpIdentity,
    runtime: "CC:11/CanonicalExecution",
    ei6: EXECUTION_OUTCOME_LEARNING_BOUNDARY.executionAuthority,
    ei6OwnsOutcome: false,
  });
}

export function buildExecutionPlan(
  entrance: NexoraEntranceSession,
): ExecutiveExecutionPlan | null {
  const handoff = entrance.decisionExperience?.handoff;
  const decision = entrance.decisionExperience?.canonicalRecord;
  if (!handoff || decision?.status !== "Approved") return null;
  const scenario =
    entrance.scenarioDiscovery?.scenarios.find(
      (entry) => entry.id === handoff.chosenScenario,
    ) ?? null;
  const unknowns = unique([
    ...handoff.unknowns,
    ...(scenario?.unknowns ?? []),
  ]);
  const assumptions = unique([
    ...handoff.assumptions,
    ...(scenario?.assumptions
      .filter((entry) => !entry.validated)
      .map((entry) => entry.statement) ?? []),
  ]);
  const constraints = unique([
    ...(scenario?.constraints ?? []),
    ...(entrance.realityDiscovery?.context.constraints ?? []),
  ]);
  const confirmActions: ExecutiveExecutionAction[] = unknowns.slice(0, 4).map(
    (unknown, index) =>
      freezeAction({
        actionId: `action-confirm-${index + 1}`,
        title: `Confirm ${unknown}`,
        description: "Material unknown carried from the committed Decision.",
        owner: null,
        sequence: 1,
        dependsOn: [],
        dueDate: null,
        milestoneId: null,
        status: "planned",
        evidence: [],
        epistemicStatus: "UNKNOWN",
      }),
  );
  const validateActions: ExecutiveExecutionAction[] = assumptions
    .slice(0, 2)
    .map((assumption, index) =>
      freezeAction({
        actionId: `action-validate-${index + 1}`,
        title: `Validate: ${assumption}`,
        description: "Unvalidated assumption remains visible until evidenced.",
        owner: null,
        sequence: 1,
        dependsOn: [],
        dueDate: null,
        milestoneId: null,
        status: "planned",
        evidence: [],
        epistemicStatus: "UNKNOWN",
      }),
    );
  const ownerAction = freezeAction({
    actionId: "action-assign-owner",
    title: "Assign operational owner",
    description: "Owner is not yet assigned. The manager is not auto-assigned.",
    owner: null,
    sequence: 1,
    dependsOn: [],
    dueDate: null,
    milestoneId: null,
    status: "planned",
    evidence: [],
    epistemicStatus: "UNKNOWN",
  });
  const priorIds = [
    ...confirmActions,
    ...validateActions,
    ownerAction,
  ].map((entry) => entry.actionId);
  const activate = freezeAction({
    actionId: "action-activate",
    title: `Activate ${scenario?.title ?? decision.title}`,
    description: "Start the committed Decision’s operational path.",
    owner: null,
    sequence: priorIds.length > 0 ? 2 : 1,
    dependsOn: priorIds,
    dueDate: null,
    milestoneId: "ms-activated",
    status: "planned",
    evidence: [],
    epistemicStatus: "KNOWN",
  });
  const monitor = freezeAction({
    actionId: "action-monitor",
    title: "Monitor recorded progress signals",
    description: "Watch action status and canonical execution state. Not Goal achievement.",
    owner: null,
    sequence: (activate.sequence ?? 1) + 1,
    dependsOn: Object.freeze([activate.actionId]),
    dueDate: null,
    milestoneId: "ms-monitor-handoff",
    status: "planned",
    evidence: [],
    epistemicStatus: "KNOWN",
  });
  const actions = Object.freeze([
    ...confirmActions,
    ...validateActions,
    ownerAction,
    activate,
    monitor,
  ]);
  const blockers = deriveBlockers(unknowns);
  const readiness = readinessOf(blockers, unknowns);
  const startBits = [
    unknowns.length > 0 ? "material unknowns confirmed" : null,
    "operational owner assigned",
  ].filter((value): value is string => Boolean(value));
  return Object.freeze({
    executionPlanId: `exp8:plan:${decision.decisionId}`,
    decisionId: decision.decisionId,
    goalId: entrance.goalDiscovery?.object?.id ?? null,
    objective: `Carry out ${decision.title} for ${entrance.goalDiscovery?.context.goalTitle ?? "the active Goal"}.`,
    actions,
    owners: Object.freeze([]),
    dependencies: Object.freeze(
      actions.flatMap((action) =>
        action.dependsOn.map((from) => Object.freeze({ from, to: action.actionId })),
      ),
    ),
    milestones: Object.freeze([
      Object.freeze({
        milestoneId: "ms-activated",
        label: "Plan activated",
      }),
      Object.freeze({
        milestoneId: "ms-monitor-handoff",
        label: "Monitoring handoff performed",
      }),
    ]),
    constraints,
    risks: Object.freeze([...handoff.risks, ...(scenario?.risks ?? [])]),
    assumptions,
    unknowns,
    startCondition:
      startBits.length > 0 ? `Start when ${startBits.join(" and ")}.` : null,
    completionCriteria: Object.freeze([
      "Committed execution actions have been carried through.",
      "Monitoring handoff has been performed.",
      "Execution complete is not Goal achieved.",
    ]),
    progressSignals: Object.freeze([
      "action status",
      "canonical execution state",
      "milestone reached",
    ]),
    status: readiness === "READY" ? "PLAN_READY" : "PLAN_PARTIAL",
    readiness,
    committed: false,
    started: false,
  });
}

export function deriveBlockers(unknowns: readonly string[]): readonly ExecutionBlocker[] {
  return Object.freeze([
    Object.freeze({
      kind: "MISSING_OWNER" as const,
      subject: "execution-owner",
      reason: "No execution owner is currently assigned.",
      evidence: Object.freeze([]),
      owner: null,
      severity: "material" as const,
      epistemicStatus: "KNOWN" as const,
    }),
    ...(unknowns.length > 0
      ? [
          Object.freeze({
            kind: "MISSING_EVIDENCE" as const,
            subject: unknowns[0] ?? null,
            reason: `${unknowns[0]} remains UNKNOWN and is not treated as ready.`,
            evidence: Object.freeze([...unknowns]),
            owner: null,
            severity: "material" as const,
            epistemicStatus: "UNKNOWN" as const,
          }),
        ]
      : []),
  ]);
}

export function readinessOf(
  blockers: readonly ExecutionBlocker[],
  unknowns: readonly string[],
): ExecutionReadiness {
  if (blockers.some((entry) => entry.kind === "MISSING_OWNER")) return "BLOCKED";
  if (unknowns.length > 0) return "PARTIAL";
  if (blockers.length > 0) return "NOT_READY";
  return "READY";
}

export function applyOwnerToPlan(
  plan: ExecutiveExecutionPlan,
  owner: string,
): ExecutiveExecutionPlan {
  const trimmed = owner.trim();
  if (!trimmed) return plan;
  return Object.freeze({
    ...plan,
    owners: Object.freeze([trimmed]),
    actions: Object.freeze(
      plan.actions.map((action) =>
        action.actionId === "action-assign-owner"
          ? freezeAction({ ...action, owner: trimmed, epistemicStatus: "KNOWN" })
          : action,
      ),
    ),
    readiness: plan.unknowns.length > 0 ? "PARTIAL" : "READY",
    status: plan.unknowns.length > 0 ? "PLAN_PARTIAL" : "PLAN_READY",
  });
}

export function applyFirstAction(
  plan: ExecutiveExecutionPlan,
  titleFragment: string,
): ExecutiveExecutionPlan {
  const match = plan.actions.find((action) =>
    action.title.toLowerCase().includes(titleFragment.toLowerCase()),
  );
  if (!match) return plan;
  const others = plan.actions.filter((action) => action.actionId !== match.actionId);
  const reordered = [
    freezeAction({ ...match, sequence: 1 }),
    ...others.map((action, index) =>
      freezeAction({ ...action, sequence: index + 2 }),
    ),
  ];
  return Object.freeze({
    ...plan,
    actions: Object.freeze(reordered),
  });
}

export function removeActionByFragment(
  plan: ExecutiveExecutionPlan,
  fragment: string,
): ExecutiveExecutionPlan {
  const next = plan.actions.filter(
    (action) => !action.title.toLowerCase().includes(fragment.toLowerCase()),
  );
  if (next.length === plan.actions.length) return plan;
  return Object.freeze({
    ...plan,
    actions: Object.freeze(next),
  });
}

export function planFingerprint(plan: ExecutiveExecutionPlan | null): string {
  if (!plan) return "";
  return [plan.executionPlanId, plan.actions.map((entry) => entry.actionId).join("|"), plan.owners.join("|")].join(":");
}

export function namedOtherScenario(
  entrance: NexoraEntranceSession,
  utterance: string,
): string | null {
  const chosen = entrance.decisionExperience?.handoff?.chosenScenario;
  const match = entrance.scenarioDiscovery?.scenarios.find((entry) => {
    if (entry.id === chosen) return false;
    return (
      utterance.toLowerCase().includes(entry.title.toLowerCase()) ||
      new RegExp(`scenario\\s+${entry.letter}\\b`, "i").test(utterance)
    );
  });
  return match?.title ?? null;
}

export function summarizePlan(plan: ExecutiveExecutionPlan): string {
  const critical = plan.actions
    .filter((entry) => entry.sequence === 1)
    .slice(0, 3)
    .map((entry) => entry.title);
  const owner = plan.owners[0] ?? "not yet assigned";
  return `The Decision is committed. Execution is not started yet. Critical actions: ${critical.join("; ") || "define required actions"}. Owner: ${owner}. Readiness: ${plan.readiness}. Execution complete would still not mean the Goal is achieved.`;
}

export function toOutcomeMonitoringHandoff(input: {
  readonly entrance: NexoraEntranceSession;
  readonly plan: ExecutiveExecutionPlan | null;
  readonly runtimeStatus: string | null;
}): NexoraOutcomeMonitoringHandoff {
  const scenario =
    input.entrance.scenarioDiscovery?.scenarios.find(
      (entry) =>
        entry.id === input.entrance.decisionExperience?.handoff?.chosenScenario,
    ) ?? null;
  return Object.freeze({
    activeGoal: input.entrance.goalDiscovery?.context ?? null,
    committedDecision: input.entrance.decisionExperience?.canonicalRecord ?? null,
    executionPlan: input.plan,
    executionRuntimeState: input.runtimeStatus,
    expectedOutcomes: Object.freeze(
      (scenario?.expectedEffects ?? []).map((effect) => `PREDICTED: ${effect}`),
    ),
    successSignals: Object.freeze(input.plan?.progressSignals ?? []),
    progressSignals: Object.freeze(input.plan?.progressSignals ?? []),
    risks: Object.freeze(input.plan?.risks ?? []),
    unknowns: Object.freeze(input.plan?.unknowns ?? []),
    conversationContext: input.entrance.conversationNotes.slice(-6).join(" | "),
    startsOutcomeMonitoring: false,
  });
}

export function ensurePlannedExecution(input: {
  readonly adapter: NexoraExecutionRuntimeAdapter | null;
  readonly decisionId: string | null;
  readonly title: string;
}): {
  readonly executionId: string | null;
  readonly status: string | null;
  readonly reason: string;
} {
  if (!input.adapter) {
    return {
      executionId: null,
      status: null,
      reason: "missing-canonical-runtime",
    };
  }
  if (!input.decisionId) {
    return { executionId: null, status: null, reason: "missing-decision" };
  }
  const existing = input.adapter.findExecutionByDecisionId(input.decisionId);
  if (existing) {
    return {
      executionId: existing.executionId,
      status: existing.status,
      reason: "reused",
    };
  }
  const created = input.adapter.createExecution({
    decisionId: input.decisionId,
    title: input.title,
  });
  return {
    executionId: created.execution?.executionId ?? null,
    status: created.execution?.status ?? null,
    reason: created.status,
  };
}

export function startThroughCanonicalRuntime(input: {
  readonly adapter: NexoraExecutionRuntimeAdapter | null;
  readonly decisionId: string | null;
  readonly title: string;
}): {
  readonly executionId: string | null;
  readonly status: string | null;
  readonly reason: string;
} {
  if (!input.adapter) {
    return {
      executionId: null,
      status: null,
      reason: "missing-canonical-runtime",
    };
  }
  const planned = ensurePlannedExecution(input);
  if (!planned.executionId) return planned;
  let current = input.adapter.getExecution(planned.executionId);
  if (!current) return planned;
  if (current.status === "planned") {
    const prepared = input.adapter.transitionExecution({
      executionId: current.executionId,
      action: "prepare",
    });
    current = prepared.execution ?? current;
  }
  if (current.status === "ready") {
    const started = input.adapter.transitionExecution({
      executionId: current.executionId,
      action: "start",
    });
    return {
      executionId: started.execution?.executionId ?? current.executionId,
      status: started.execution?.status ?? current.status,
      reason: started.status,
    };
  }
  return {
    executionId: current.executionId,
    status: current.status,
    reason: "already-advanced",
  };
}

export function cancelThroughCanonicalRuntime(input: {
  readonly adapter: NexoraExecutionRuntimeAdapter | null;
  readonly executionId: string | null;
}): {
  readonly status: string | null;
  readonly reason: string;
} {
  if (!input.adapter || !input.executionId) {
    return { status: null, reason: "missing-canonical-runtime" };
  }
  const result = input.adapter.transitionExecution({
    executionId: input.executionId,
    action: "cancel",
  });
  return {
    status: result.execution?.status ?? null,
    reason: result.status,
  };
}

function freezeAction(action: ExecutiveExecutionAction): ExecutiveExecutionAction {
  return Object.freeze({
    ...action,
    dependsOn: Object.freeze([...action.dependsOn]),
    evidence: Object.freeze([...action.evidence]),
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}
