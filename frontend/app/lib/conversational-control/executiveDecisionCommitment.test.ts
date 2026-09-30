/**
 * CC:10 — Decision Commitment certification.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import { freezeExecutiveContextReference } from "./executiveContextSnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraConversationalSubjectsFromCatalog } from "./conversationalSubjectRegistry.ts";
import {
  createEmptyNexoraExecutiveScenarioSession,
  type NexoraExecutiveScenarioSession,
} from "./executiveScenarioResolver.ts";
import {
  createEmptyNexoraExecutiveDecisionSession,
  type NexoraExecutiveDecisionSession,
} from "./executiveDecisionAuthority.ts";
import {
  createNexoraCanonicalDecisionRuntime,
  type NexoraCanonicalDecisionRuntime,
  type NexoraDecisionRuntimeAdapter,
} from "./executiveDecisionRuntimeAdapter.ts";
import {
  getExecutiveDecisionCommitmentIdentity,
  EXECUTIVE_DECISION_COMMITMENT_BOUNDARY,
} from "./executiveDecisionCommitment.ts";
import { resolveNexoraExecutiveDecisionCommitment } from "./executiveDecisionCommitmentResolver.ts";
import { applyNexoraExecutiveDecisionTransition } from "./executiveDecisionAuthority.ts";
import type { NexoraExecutiveScenario } from "./executiveScenarioDefinition.ts";
import type { NexoraExecutiveScenarioEvaluation } from "./executiveScenarioEvaluation.ts";
import { createNexoraScenarioBaselineSnapshot } from "./executiveScenarioEvaluation.ts";
import {
  getExecutiveDecisionRuntimeConvergenceIdentity,
  EXECUTIVE_DECISION_RUNTIME_CONVERGENCE_BOUNDARY,
} from "./executiveDecisionRuntimeConvergence.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectNexoraConversationalSubjectsFromCatalog({
  objects: catalog.objects,
  contextSubjects: catalog.contextSubjects,
});

function runtimeState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function ctx(opts?: {
  readonly subjectId?: string;
  readonly workspaceId?: string;
  readonly modelId?: string;
  readonly recommendationId?: string;
}) {
  const subjectId = opts?.subjectId ?? null;
  const record = subjectId
    ? subjects.find((s) => s.subjectId === subjectId) ?? null
    : null;
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: record
      ? freezeExecutiveContextReference({
          subjectId: record.subjectId,
          subjectKind: record.subjectKind,
          canonicalName: record.canonicalName,
          source: "conversation",
          turnIndex: 0,
        })
      : null,
    currentWorkspaceId: opts?.workspaceId ?? "overview",
    currentModelId: opts?.modelId ?? null,
    lastRecommendationId: opts?.recommendationId ?? null,
  });
}

function scenario(
  letter: "a" | "b" | "c",
  status: NexoraExecutiveScenario["status"] = "evaluated",
  revision = 1,
): NexoraExecutiveScenario {
  return Object.freeze({
    scenarioId: `cc9:scenario:intervention:obj-capacity:v${revision}:${letter}`,
    name: `Scenario ${letter.toUpperCase()}`,
    revision,
    subjectIds: Object.freeze(["obj-capacity"]),
    assumptions: Object.freeze([]),
    interventions: Object.freeze([
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by" as const,
        value: letter === "b" ? 10 : 5,
        unit: "%" as const,
      }),
    ]),
    horizon: Object.freeze({ amount: 1, unit: "quarter" as const }),
    source: "conversation" as const,
    status,
    kind: "intervention" as const,
  });
}

function evaluationFor(
  s: NexoraExecutiveScenario,
  unknowns: readonly string[] = [],
): NexoraExecutiveScenarioEvaluation {
  const baseline = createNexoraScenarioBaselineSnapshot({
    attentionBySubject: Object.freeze({ "obj-capacity": "important" }),
  });
  return Object.freeze({
    scenarioId: s.scenarioId,
    status: s.status === "unsupported" ? ("unsupported" as const) : ("partial" as const),
    baseline,
    baselinePreserved: true,
    impacts: Object.freeze([]),
    risks: Object.freeze([]),
    tradeoffs: Object.freeze([]),
    uncertainties: Object.freeze(
      unknowns.map((u) =>
        Object.freeze({
          kind: u,
          description: u,
          evidenceRefs: Object.freeze([]),
        }),
      ),
    ),
    evidenceRefs: Object.freeze([
      Object.freeze({
        sourceKind: "runtime" as const,
        sourceId: "obj-capacity",
        subjectId: "obj-capacity",
        factKey: "attention",
      }),
    ]),
    horizon: s.horizon,
  });
}

function sessionWithScenarios(
  letters: readonly ("a" | "b" | "c")[],
  opts?: {
    readonly preferred?: "a" | "b" | "c";
    readonly unsupported?: "a" | "b" | "c";
    readonly unknownsForB?: readonly string[];
  },
): NexoraExecutiveScenarioSession {
  const scenariosById: Record<string, NexoraExecutiveScenario> = {};
  const evaluationsById: Record<string, NexoraExecutiveScenarioEvaluation> = {};
  const ids: string[] = [];
  for (const letter of letters) {
    const status =
      opts?.unsupported === letter ? ("unsupported" as const) : ("evaluated" as const);
    const s = scenario(letter, status);
    scenariosById[s.scenarioId] = s;
    ids.push(s.scenarioId);
    evaluationsById[s.scenarioId] = evaluationFor(
      s,
      letter === "b" ? (opts?.unknownsForB ?? []) : [],
    );
  }
  const preferredId =
    opts?.preferred != null
      ? scenariosById[
          scenario(opts.preferred).scenarioId
        ]?.scenarioId ?? null
      : null;
  return Object.freeze({
    ...createEmptyNexoraExecutiveScenarioSession(),
    scenariosById: Object.freeze(scenariosById),
    evaluationsById: Object.freeze(evaluationsById),
    candidateScenarioIds: Object.freeze(ids),
    activeScenarioId: ids[0] ?? null,
    lastComparison: preferredId
      ? Object.freeze({
          comparisonId: `cc9:compare:${ids.join("+")}`,
          scenarioIds: Object.freeze(ids),
          dimensions: Object.freeze([]),
          preferredScenarioId: preferredId,
          preferenceBasis: "goal-alignment" as const,
          preferenceReasons: Object.freeze(["B preferred"]),
          uncertainties: Object.freeze([]),
          requiresDecisionCommitment: false as const,
        })
      : null,
  });
}

function run(
  utterance: string,
  opts?: {
    readonly executiveContext?: ReturnType<typeof ctx>;
    readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
    readonly decisionSession?: NexoraExecutiveDecisionSession | null;
    readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
    readonly seed?: string;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: opts?.executiveContext ?? ctx({ subjectId: "obj-capacity" }),
    executiveSubjects: subjects,
    runtimeState: runtimeState(),
    catalog,
    scenarioSession: opts?.scenarioSession ?? null,
    decisionSession: opts?.decisionSession ?? null,
    decisionRuntime: opts?.decisionRuntime ?? null,
    decisionCommittedAt: "2026-08-15T12:00:00.000Z",
    messageIdSeed: opts?.seed ?? "cc10",
  });
}

function withRuntime(): NexoraCanonicalDecisionRuntime {
  return createNexoraCanonicalDecisionRuntime({
    authorityId: "test.decision-runtime",
  });
}

test("identity + boundary", () => {
  const id = getExecutiveDecisionCommitmentIdentity();
  assert.equal(id.id, "CC:10/DecisionCommitment");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    id.architecturalRole,
    "ExecutiveDecisionCommitmentAuthority",
  );
  assert.equal(EXECUTIVE_DECISION_COMMITMENT_BOUNDARY.stopsBeforeExecution, true);
  assert.equal(
    EXECUTIVE_DECISION_COMMITMENT_BOUNDARY.recommendationNeverAutoCommits,
    true,
  );
  assert.equal(
    EXECUTIVE_DECISION_COMMITMENT_BOUNDARY.preferenceNeverEqualsCommitment,
    true,
  );
});

test("1 preference-only", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const result = run("I prefer Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "pref",
  });
  assert.equal(result.decisionCommitmentResult?.status, "preference-only");
  assert.equal(result.decisionCommitmentResult?.decision, null);
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
  assert.equal(result.shouldCommitRuntime, false);
});

test("2–3 explicit scenario commitment + approval", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const choose = run("Let's go with Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "choose",
  });
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  assert.equal(choose.decisionCommitmentResult?.decision?.status, "Approved");
  assert.equal(choose.decisionCommitmentResult?.decision?.committedBy, "manager");
  assert.match(choose.response, /approved decision/i);
  assert.equal(choose.shouldCommitRuntime, false);
  // Product truth is in Runtime, not session.
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
  assert.equal(
    decisionRuntime.adapter.listDecisions()[0]?.status,
    "Approved",
  );

  const approve = run("Approve Scenario B", {
    scenarioSession: session,
    decisionSession: choose.nextDecisionSession,
    decisionRuntime: decisionRuntime.adapter,
    seed: "approve",
  });
  assert.equal(approve.decisionCommitmentResult?.status, "already-committed");
});

test("option B ordinal commitment uses the active candidate collection", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const choose = run("Let's go with option B.", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "option-b",
  });
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
  assert.equal(
    choose.decisionCommitmentResult?.decision?.scenarioId,
    scenario("b").scenarioId,
  );

  const second = run("Use the second option.", {
    scenarioSession: session,
    decisionRuntime: withRuntime().adapter,
    seed: "second-option",
  });
  assert.equal(second.decisionCommitmentResult?.status, "applied");
  assert.equal(
    second.decisionCommitmentResult?.decision?.scenarioId,
    scenario("b").scenarioId,
  );

  const discuss = run("What about option B?", {
    scenarioSession: session,
    decisionRuntime: withRuntime().adapter,
    seed: "discuss-b",
  });
  assert.notEqual(discuss.decisionCommitmentResult?.status, "applied");
  assert.equal(discuss.decisionRuntime?.listDecisions().length ?? 0, 0);

  const compared = run("Compare option A and option B.", {
    scenarioSession: session,
    decisionRuntime: withRuntime().adapter,
    seed: "compare-ab",
  });
  assert.notEqual(compared.decisionCommitmentResult?.status, "applied");

  const unknown = run("Use option Z.", {
    scenarioSession: session,
    decisionRuntime: withRuntime().adapter,
    seed: "option-z",
  });
  assert.notEqual(unknown.decisionCommitmentResult?.status, "applied");
  assert.equal(unknown.decisionRuntime?.listDecisions().length ?? 0, 0);

  const outOfRange = run("Choose option C.", {
    scenarioSession: sessionWithScenarios(["a", "b"]),
    decisionRuntime: withRuntime().adapter,
    seed: "option-c",
  });
  assert.equal(outOfRange.decisionCommitmentResult?.status, "clarification-required");
  assert.equal(outOfRange.decisionRuntime?.listDecisions().length ?? 0, 0);
});

test("Approve that option commits the active candidate without replacing it with the current problem", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const choose = run("Approve that option.", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "approve-that",
  });
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  assert.equal(
    choose.decisionCommitmentResult?.decision?.scenarioId,
    scenario("a").scenarioId,
  );
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
});

test("Use that option clarifies when multiple candidates have no active scenario", () => {
  const decisionRuntime = withRuntime();
  const session = Object.freeze({
    ...sessionWithScenarios(["a", "b"]),
    activeScenarioId: null,
  });
  const result = run("Use that option.", {
    executiveContext: ctx(),
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "use-that-ambig",
  });
  assert.equal(result.decisionCommitmentResult?.status, "clarification-required");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
});

test("discussion of option A retains the active option collection for later commitment", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const discuss = run("What about option A?", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "discuss-a-retain",
  });
  assert.equal(discuss.decisionCommitmentResult?.status ?? null, null);
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
  assert.deepEqual(
    discuss.nextScenarioSession?.candidateScenarioIds,
    session.candidateScenarioIds,
  );

  const choose = run("Let's go with option B.", {
    scenarioSession: discuss.nextScenarioSession,
    executiveContext: discuss.nextExecutiveContext,
    decisionRuntime: decisionRuntime.adapter,
    seed: "commit-after-discuss",
  });
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
  assert.equal(
    choose.decisionCommitmentResult?.decision?.scenarioId,
    scenario("b").scenarioId,
  );
});

test("named delivery recovery plan commits the unique intervention candidate", () => {
  const decisionRuntime = withRuntime();
  const doNothing = Object.freeze({
    ...scenario("a"),
    scenarioId: "cc9:scenario:do-nothing:obj-delivery:v1:a",
    name: "No Action on Delivery",
    kind: "do-nothing" as const,
    subjectIds: Object.freeze(["obj-delivery"]),
  });
  const investigate = Object.freeze({
    ...scenario("b"),
    scenarioId: "cc9:scenario:intervention:obj-delivery:v1:b",
    name: "Investigate Delivery",
    kind: "intervention" as const,
    subjectIds: Object.freeze(["obj-delivery"]),
  });
  const session = Object.freeze({
    ...createEmptyNexoraExecutiveScenarioSession(),
    scenariosById: Object.freeze({
      [doNothing.scenarioId]: doNothing,
      [investigate.scenarioId]: investigate,
    }),
    evaluationsById: Object.freeze({
      [doNothing.scenarioId]: evaluationFor(doNothing),
      [investigate.scenarioId]: evaluationFor(investigate),
    }),
    candidateScenarioIds: Object.freeze([doNothing.scenarioId, investigate.scenarioId]),
    activeScenarioId: doNothing.scenarioId,
    lastComparison: null,
  });
  const choose = run("Approve the delivery recovery plan.", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "delivery-plan",
  });
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  assert.equal(
    choose.decisionCommitmentResult?.decision?.scenarioId,
    investigate.scenarioId,
  );
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
});

test("duplicate confirmation does not create a second Decision", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const choose = run("Let's go with option B.", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "commit-once",
  });
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  const yes = run("Yes, make that the decision.", {
    scenarioSession: session,
    decisionSession: choose.nextDecisionSession,
    decisionRuntime: decisionRuntime.adapter,
    seed: "confirm-again",
  });
  assert.equal(yes.decisionCommitmentResult?.status, "already-committed");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
});

test("4 ambiguous commitment", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const cleared = Object.freeze({
    ...session,
    activeScenarioId: null,
  });
  const result = run("Let's do it", {
    executiveContext: ctx(),
    scenarioSession: cleared,
    decisionRuntime: decisionRuntime.adapter,
    seed: "ambig",
  });
  assert.equal(result.decisionCommitmentResult?.status, "clarification-required");
  assert.match(result.response, /which option/i);
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
});

test("5–7 confirmation required, yes, cancel", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const soft = run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "soft",
  });
  assert.equal(soft.status, "confirmation-required");
  assert.equal(soft.decisionCommitmentResult?.status, "confirmation-required");
  assert.ok(soft.nextDecisionSession?.pendingConfirmation);
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);

  const yes = run("Yes", {
    scenarioSession: session,
    decisionSession: soft.nextDecisionSession,
    decisionRuntime: decisionRuntime.adapter,
    seed: "yes",
  });
  assert.equal(yes.decisionCommitmentResult?.status, "applied");
  assert.equal(yes.decisionCommitmentResult?.decision?.status, "Approved");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);

  const changeRuntime = withRuntime();
  const pendingB = run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: changeRuntime.adapter,
    seed: "pending-b",
  });
  const switchA = run("Let's go with option A.", {
    scenarioSession: session,
    decisionSession: pendingB.nextDecisionSession,
    decisionRuntime: changeRuntime.adapter,
    seed: "switch-a",
  });
  assert.notEqual(switchA.decisionCommitmentResult?.decision?.scenarioId, scenario("b").scenarioId);
  assert.equal(changeRuntime.adapter.listDecisions().filter((item) => item.scenarioId === scenario("b").scenarioId).length, 0);

  const soft2 = run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: withRuntime().adapter,
    seed: "soft2",
  });
  const cancelRuntime = withRuntime();
  const soft2b = run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: cancelRuntime.adapter,
    seed: "soft2b",
  });
  const cancel = run("No, cancel", {
    scenarioSession: session,
    decisionSession: soft2b.nextDecisionSession,
    decisionRuntime: cancelRuntime.adapter,
    seed: "cancel",
  });
  assert.equal(cancel.nextDecisionSession?.pendingConfirmation, null);
  assert.equal(cancelRuntime.adapter.listDecisions().length, 0);
  void soft2;
});

test("8 stale confirmation on workspace change", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const soft = run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    executiveContext: ctx({
      subjectId: "obj-capacity",
      workspaceId: "overview",
    }),
    seed: "stale-soft",
  });
  const yes = run("Yes", {
    scenarioSession: session,
    decisionSession: soft.nextDecisionSession,
    decisionRuntime: decisionRuntime.adapter,
    executiveContext: ctx({
      subjectId: "obj-capacity",
      workspaceId: "decision",
    }),
    seed: "stale-yes",
  });
  assert.equal(yes.decisionCommitmentResult?.status, "failed");
  assert.ok(
    yes.decisionCommitmentResult?.reasons.includes("decision-confirmation-stale"),
  );
  assert.equal(yes.decisionCommitmentResult?.decision, null);
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
});

test("9 unsupported scenario", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"], { unsupported: "b" });
  const result = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "unsup",
  });
  assert.ok(
    result.decisionCommitmentResult?.status === "unsupported" ||
      result.decisionCommitmentResult?.status === "invalid-candidate",
  );
  assert.equal(result.decisionCommitmentResult?.decision, null);
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
});

test("10 partial scenario uncertainty preserved", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"], {
    unknownsForB: ["cost-unresolved"],
  });
  const result = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "partial",
  });
  assert.equal(result.decisionCommitmentResult?.status, "applied");
  assert.ok(
    result.decisionCommitmentResult?.decision?.uncertaintyRefs.includes(
      "cost-unresolved",
    ),
  );
  assert.ok(
    result.decisionCommitmentResult?.reasons.includes(
      "decision-partial-uncertainty-preserved",
    ),
  );
});

test("11 duplicate commitment idempotent against Runtime", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const first = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "dup1",
  });
  const second = run("Approve Scenario B", {
    scenarioSession: session,
    decisionSession: first.nextDecisionSession,
    decisionRuntime: decisionRuntime.adapter,
    seed: "dup2",
  });
  assert.equal(first.decisionCommitmentResult?.status, "applied");
  assert.equal(second.decisionCommitmentResult?.status, "already-committed");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
});

test("13 rejection does not delete scenario", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"]);
  const before = session.scenariosById;
  const result = run("Reject Scenario C", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "reject",
  });
  assert.equal(result.decisionCommitmentResult?.status, "applied");
  assert.equal(result.decisionCommitmentResult?.decision?.status, "Rejected");
  assert.deepEqual(
    Object.keys(result.nextScenarioSession?.scenariosById ?? before),
    Object.keys(before),
  );
});

test("14–15 illegal / locked transition", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const approved = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "lock1",
  });
  const decision = approved.decisionCommitmentResult!.decision!;
  assert.equal(decision.locked, true);

  const archived = applyNexoraExecutiveDecisionTransition({
    runtime: decisionRuntime.adapter,
    session: approved.nextDecisionSession!,
    decisionId: decision.decisionId,
    action: "archive",
    title: decision.title,
  });
  assert.equal(archived.decision?.status, "Archived");
  const again = resolveNexoraExecutiveDecisionCommitment({
    action: "approve",
    strength: "explicit",
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    decisionSession: archived.nextSession,
    decisionRuntime: decisionRuntime.adapter,
    scenarioSession: session,
    targetHintRaw: "b",
    committedAt: "2026-08-15T12:00:00.000Z",
  });
  assert.equal(again.status, "transition-not-allowed");
});

test("16 recommendation handoff", () => {
  const decisionRuntime = withRuntime();
  const result = run("Go with your recommendation", {
    executiveContext: ctx({
      subjectId: "obj-capacity",
      recommendationId: "cc8:investigate:obj-capacity",
    }),
    decisionRuntime: decisionRuntime.adapter,
    seed: "rec",
  });
  assert.equal(result.decisionCommitmentResult?.status, "applied");
  assert.equal(
    result.decisionCommitmentResult?.candidate?.source,
    "recommendation",
  );
});

test("17 scenario preference handoff", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b", "c"], { preferred: "b" });
  const result = run("Choose the preferred scenario", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "pref-hand",
  });
  assert.equal(result.decisionCommitmentResult?.status, "applied");
  assert.ok(
    result.decisionCommitmentResult?.decision?.title.includes("B") ||
      result.decisionCommitmentResult?.candidate?.title.includes("B"),
  );
});

test("19 approve this from current scenario", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const withActive = Object.freeze({
    ...session,
    activeScenarioId: scenario("b").scenarioId,
  });
  const executiveContext = createEmptyNexoraExecutiveContextSnapshot({
    ...ctx({ subjectId: "obj-capacity" }),
    currentScenario: freezeExecutiveContextReference({
      subjectId: scenario("b").scenarioId,
      subjectKind: "scenario",
      canonicalName: "Scenario B",
      source: "conversation",
      turnIndex: 1,
    }),
  });
  const result = run("Approve this", {
    executiveContext,
    scenarioSession: withActive,
    decisionRuntime: decisionRuntime.adapter,
    seed: "this",
  });
  assert.equal(result.decisionCommitmentResult?.status, "applied");
});

test("20 workspace scope isolation for yes", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const soft = run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    executiveContext: ctx({ workspaceId: "overview" }),
    seed: "ws1",
  });
  const yes = run("Yes", {
    scenarioSession: session,
    decisionSession: soft.nextDecisionSession,
    decisionRuntime: decisionRuntime.adapter,
    executiveContext: ctx({ workspaceId: "problem" }),
    seed: "ws2",
  });
  assert.equal(yes.decisionCommitmentResult?.status, "failed");
});

test("24–26 provenance + evidence/scenario preservation", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"], {
    unknownsForB: ["cost-unresolved"],
  });
  const beforeEval = session.evaluationsById[scenario("b").scenarioId]!;
  const beforeFp = [
    beforeEval.scenarioId,
    beforeEval.uncertainties.map((u) => u.kind).join(","),
    beforeEval.evidenceRefs.map((e) => e.factKey).join(","),
  ].join("|");
  const result = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "prov",
  });
  assert.equal(result.decisionCommitmentResult?.status, "applied");
  const afterEval =
    result.nextScenarioSession?.evaluationsById[scenario("b").scenarioId] ??
    beforeEval;
  const afterFp = [
    afterEval.scenarioId,
    afterEval.uncertainties.map((u) => u.kind).join(","),
    afterEval.evidenceRefs.map((e) => e.factKey).join(","),
  ].join("|");
  assert.equal(afterFp, beforeFp);
  assert.ok(result.decisionCommitmentResult?.decision?.rationale);
  assert.equal(
    result.decisionCommitmentResult?.decision?.source,
    "conversation",
  );
  const decisionId = result.decisionCommitmentResult!.decision!.decisionId;
  assert.ok(result.nextDecisionSession?.provenanceByDecisionId[decisionId]);
});

test("30–31 no execution; compound defers execution", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const result = run("Approve B and start execution", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "compound",
  });
  assert.ok(
    result.decisionCommitmentResult?.status === "applied" ||
      result.decisionCommitmentResult?.status === "clarification-required",
  );
  if (result.decisionCommitmentResult?.status === "applied") {
    assert.equal(result.decisionCommitmentResult.executionDeferred, true);
    assert.match(result.response, /execution was not started/i);
  }
  assert.equal(result.shouldCommitRuntime, false);
});

test("28–29 no Stage/camera mutation via shouldCommitRuntime false", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const before = runtimeState();
  const result = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "nostage",
  });
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.nextRuntimeState.workspace, before.workspace);
  assert.equal(result.nextRuntimeState.mode, before.mode);
});

test("CC:10R identity + one canonical Runtime truth", () => {
  const id = getExecutiveDecisionRuntimeConvergenceIdentity();
  assert.equal(id.id, "CC:10R/DecisionRuntimeConvergence");
  assert.equal(
    EXECUTIVE_DECISION_RUNTIME_CONVERGENCE_BOUNDARY.oneCanonicalDecisionTruth,
    true,
  );
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  const viaConvo = run("Approve Scenario B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "conv-eq",
  });
  const viaUi = decisionRuntime.adapter.transitionDecision({
    decisionId: viaConvo.decisionCommitmentResult!.decision!.decisionId,
    action: "approve",
    title: "Scenario B",
  });
  assert.equal(viaUi.status, "already-committed");
  assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
});

test("pending confirmation does not mutate Runtime", () => {
  const decisionRuntime = withRuntime();
  const session = sessionWithScenarios(["a", "b"]);
  run("I think we should probably choose B", {
    scenarioSession: session,
    decisionRuntime: decisionRuntime.adapter,
    seed: "pend",
  });
  assert.equal(decisionRuntime.adapter.listDecisions().length, 0);
});

test("empty decision session bootstrap", () => {
  assert.equal(
    createEmptyNexoraExecutiveDecisionSession().pendingConfirmation,
    null,
  );
  assert.equal(
    Object.keys(
      createEmptyNexoraExecutiveDecisionSession().provenanceByDecisionId,
    ).length,
    0,
  );
});
