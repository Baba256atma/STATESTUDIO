import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS as eventKinds,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS as intentKinds,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES as intentPriorities,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS as intentTargets,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES as reasonCodes,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES as statuses,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  createRuntimeExecutiveInsightExperienceOrchestrationPolicy,
  getRuntimeExecutiveInsightExperienceOrchestrationIdentity,
  getRuntimeExecutiveInsightExperienceOrchestrationRegistry,
  orchestrateRuntimeExecutiveInsightExperience,
  orchestrateRuntimeExecutiveInsightFocus,
  orchestrateRuntimeExecutiveInsightSelection,
  resolveRuntimeExecutiveInsightExperienceContexts,
  resolveRuntimeExecutiveInsightExperienceIntents,
  runtimeExecutiveInsightExperienceOrchestration as orchestrationModule,
  runtimeExecutiveInsightExperienceOrchestrationApiNames as apiNames,
  runtimeExecutiveInsightExperienceOrchestrationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightExperienceOrchestrationRegistry as registry,
  validateRuntimeExecutiveInsightExperienceOrchestrationInput,
  verifyRuntimeExecutiveInsightExperienceOrchestration,
  type RuntimeExecutiveInsightExperienceOrchestrationInput,
  type RuntimeExecutiveInsightExperienceOrchestrationPolicy,
} from "./runtimeExecutiveInsightExperienceOrchestration.ts";

import {
  createRuntimeExecutiveInsightPresentationPolicy,
  resolveRuntimeExecutiveInsightPresentation,
  runtimeExecutiveInsightPresentationIdentity,
  runtimeExecutiveInsightPresentationSupportedImportPath,
  verifyRuntimeExecutiveInsightPresentation,
  type RuntimeExecutiveInsightPresentationCandidate,
  type RuntimeExecutiveInsightPresentationResult,
  type RuntimeExecutiveInsightPresentationState,
} from "@/app/lib/rex/runtimeExecutiveInsightPresentation";

import {
  createRuntimeExecutiveInsightPriorityPolicy,
  evaluateRuntimeExecutiveInsightPriority,
  verifyRuntimeExecutiveInsightPriorityAttention,
} from "@/app/lib/rex/runtimeExecutiveInsightPriorityAttention";

import { verifyRuntimeExecutiveInsightResolution } from "@/app/lib/rex/runtimeExecutiveInsightResolution";
import { verifyRuntimeExecutiveInsightExperienceContracts } from "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts";
import { verifyRuntimeExecutiveInsightExperienceFoundation } from "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveInsightExperienceOrchestration.ts",
    import.meta.url,
  ),
  "utf8",
);

function candidate(
  overrides?: Partial<RuntimeExecutiveInsightPresentationCandidate>,
): RuntimeExecutiveInsightPresentationCandidate {
  return Object.freeze({
    candidateId: "rex.insight.candidate:threshold:project.alpha:default",
    category: "threshold",
    primarySubject: Object.freeze({
      subjectId: "project.alpha",
      kind: "nexora-object",
      label: "Project Alpha",
      scope: "object",
    }),
    relatedSubjects: Object.freeze([
      Object.freeze({
        subject: Object.freeze({
          subjectId: "kpi.delivery",
          kind: "kpi",
        }),
        role: "related",
        order: 0,
      }),
      Object.freeze({
        subject: Object.freeze({
          subjectId: "koi.north-star",
          kind: "koi",
        }),
        role: "related",
        order: 1,
      }),
    ]),
    evidenceIds: Object.freeze(["ev.1", "ev.2"]),
    signalIds: Object.freeze(["sig.1"]),
    direction: "decreasing",
    severity: "high",
    importance: "medium",
    confidence: 0.9,
    freshness: "current",
    scope: "object",
    source: Object.freeze({ kind: "runtime", sourceId: "runtime.1" }),
    relationships: Object.freeze([
      Object.freeze({
        relationshipId: "rel.1",
        kind: "related-to",
        direction: "forward",
        from: Object.freeze({
          endpointKind: "insight",
          endpointId: "rex.insight.candidate:threshold:project.alpha:default",
        }),
        to: Object.freeze({
          endpointKind: "subject",
          endpointId: "kpi.delivery",
        }),
      }),
    ]),
    matchedRuleIds: Object.freeze(["rule.1"]),
    resolutionCodes: Object.freeze(["resolved"]),
    resolutionIdentity: "REX-4:3/RuntimeExecutiveInsightResolution",
    resolutionVersion: "4.3.0",
    ...overrides,
  }) as RuntimeExecutiveInsightPresentationCandidate;
}

function presentation(
  state: RuntimeExecutiveInsightPresentationState = "report",
  c: RuntimeExecutiveInsightPresentationCandidate = candidate(),
): RuntimeExecutiveInsightPresentationResult {
  const priority = evaluateRuntimeExecutiveInsightPriority({
    candidate: c,
    context: {
      focusedSubjectId: c.primarySubject.subjectId,
      decisionSubjectIds: ["decision.1"],
      executionSubjectIds: ["execution.1"],
    },
    policy: createRuntimeExecutiveInsightPriorityPolicy({
      policyId: "policy.priority",
      weights: Object.freeze({
        severity: 0.1,
        importance: 0.1,
        urgency: 0.1,
        confidence: 0.1,
        freshness: 0.1,
        scope: 0.1,
        "focus-relevance": 0.1,
        "goal-relevance": 0.1,
        "decision-relevance": 0.1,
        "execution-relevance": 0.1,
      }),
    }),
  });
  return resolveRuntimeExecutiveInsightPresentation({
    candidate: c,
    priority,
    requestedState: state,
    context: {
      focusedSubjectId: c.primarySubject.subjectId,
      decisionRefs: ["decision.1"],
      executionRefs: ["execution.1"],
      scenarioRefs: ["scenario.1"],
      problemRefs: ["problem.1"],
      packRefs: ["pack.1"],
    },
    policy: createRuntimeExecutiveInsightPresentationPolicy({
      policyId: "policy.presentation",
      requireOperationContext: true,
      showPriorityScore: true,
    }),
  });
}

function policy(
  overrides?: Partial<RuntimeExecutiveInsightExperienceOrchestrationPolicy>,
): RuntimeExecutiveInsightExperienceOrchestrationPolicy {
  return createRuntimeExecutiveInsightExperienceOrchestrationPolicy({
    policyId: "policy.orchestration",
    policyVersion: "1",
    enabledCapabilities: [
      "StageSupportsFocus",
      "AdvisorContextAvailable",
      "SceneRelationshipExposureAvailable",
      "OperationInteractionAvailable",
    ],
    requireUniqueStageFocus: true,
    allowSparseMinimum: true,
    syncPresentationState: true,
    ...overrides,
  });
}

function baseInput(
  overrides?: Partial<RuntimeExecutiveInsightExperienceOrchestrationInput>,
): RuntimeExecutiveInsightExperienceOrchestrationInput {
  return {
    presentation: overrides?.presentation ?? presentation("report"),
    eventKind: overrides?.eventKind ?? "insight-selected",
    experienceContext: overrides?.experienceContext ??
      Object.freeze({
        selectedSubjectId: "project.alpha",
        focusedSubjectId: "project.alpha",
        activeDecisionId: "decision.1",
        activeExecutionId: "execution.1",
        activeScenarioId: "scenario.1",
        activeProblemId: "problem.1",
        activePackId: "pack.1",
        activePresentationState: "report" as const,
      }),
    stageContext: overrides?.stageContext ??
      Object.freeze({
        selectedStageSubjectId: "project.alpha",
        sceneRef: "scene.1",
      }),
    advisorContext: overrides?.advisorContext ??
      Object.freeze({
        currentAdvisorSubjectId: "project.alpha",
      }),
    sceneContext: overrides?.sceneContext ??
      Object.freeze({
        sceneId: "scene.1",
      }),
    policy: overrides?.policy ?? policy(),
    ...(overrides?.competingFocusSubjectIds !== undefined
      ? { competingFocusSubjectIds: overrides.competingFocusSubjectIds }
      : {}),
  };
}

// 1–3 identity
test("exact identity", () => {
  assert.equal(
    orchestrationModule.identity,
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration",
  );
  assert.equal(
    getRuntimeExecutiveInsightExperienceOrchestrationIdentity().identity,
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration",
  );
});

test("exact version", () => {
  assert.equal(orchestrationModule.version, "4.6.0");
  assert.equal(canonicalIdentity.version, "4.6.0");
});

test("exact namespace", () => {
  assert.equal(
    orchestrationModule.namespace,
    "nexora.rex.insight-experience.orchestration",
  );
});

// 4–8 dependency
test("sole immediate dependency is REX-4:5", () => {
  assert.equal(
    orchestrationModule.upstreamDependency,
    runtimeExecutiveInsightPresentationIdentity,
  );
  assert.equal(
    orchestrationModule.dependencyPath,
    runtimeExecutiveInsightPresentationSupportedImportPath,
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "REX-4:5/RuntimeExecutiveInsightPresentation",
  );
});

test("no direct import from REX-4:1", () => {
  assert.equal(boundary.importsRex41Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightExperienceFoundation["']/,
  );
});

test("no direct import from REX-4:2", () => {
  assert.equal(boundary.importsRex42Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightExperienceContracts["']/,
  );
});

test("no direct import from REX-4:3", () => {
  assert.equal(boundary.importsRex43Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightResolution["']/,
  );
});

test("no direct import from REX-4:4", () => {
  assert.equal(boundary.importsRex44Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightPriorityAttention["']/,
  );
});

// 9–14 vocabularies
test("canonical event kinds", () => {
  assert.deepEqual([...eventKinds], [
    "insight-selected",
    "insight-deselected",
    "insight-focused",
    "insight-unfocused",
    "subject-selected",
    "subject-focused",
    "presentation-changed",
    "attention-changed",
    "related-context-requested",
    "operation-context-requested",
  ]);
});

test("canonical intent kinds", () => {
  assert.ok(intentKinds.includes("select-insight"));
  assert.ok(intentKinds.includes("focus-subject"));
  assert.ok(intentKinds.includes("expose-stage-context"));
  assert.ok(intentKinds.includes("expose-advisor-context"));
  assert.ok(intentKinds.includes("sync-presentation-state"));
  assert.ok(intentKinds.includes("clear-related-context"));
  assert.equal(intentKinds.length, 16);
});

test("canonical intent targets", () => {
  assert.ok(intentTargets.includes("insight"));
  assert.ok(intentTargets.includes("stage"));
  assert.ok(intentTargets.includes("advisor"));
  assert.ok(intentTargets.includes("scene"));
  assert.ok(intentTargets.includes("presentation"));
  assert.equal(intentTargets.length, 13);
});

test("canonical intent priorities", () => {
  assert.deepEqual([...intentPriorities], [
    "background",
    "normal",
    "high",
    "critical",
  ]);
});

test("canonical orchestration statuses", () => {
  assert.deepEqual([...statuses], [
    "orchestrated",
    "no-op",
    "restricted",
    "invalid",
    "conflicted",
  ]);
});

test("canonical reason codes", () => {
  for (const code of [
    "insight-selected",
    "insight-focused",
    "stage-context-exposed",
    "advisor-context-exposed",
    "presentation-synchronized",
    "intent-suppressed-by-policy",
    "capability-unavailable",
    "conflict-resolved",
    "conflict-unresolved",
    "no-context-change",
  ] as const) {
    assert.ok(reasonCodes.includes(code));
  }
});

// 15–16 validation
test("valid orchestration input", () => {
  const validated = validateRuntimeExecutiveInsightExperienceOrchestrationInput(
    baseInput(),
  );
  assert.equal(validated.valid, true);
});

test("invalid orchestration input", () => {
  const validated = validateRuntimeExecutiveInsightExperienceOrchestrationInput({
    eventKind: "insight-selected",
  });
  assert.equal(validated.valid, false);
});

// 17–24 events
test("insight-selected event", () => {
  const result = orchestrateRuntimeExecutiveInsightSelection(baseInput());
  assert.equal(result.status, "orchestrated");
  assert.ok(result.intents.some((intent) => intent.kind === "select-insight"));
  assert.ok(result.reasonCodes.includes("insight-selected"));
});

test("insight-focused event", () => {
  const result = orchestrateRuntimeExecutiveInsightFocus(
    baseInput({ eventKind: "insight-focused" }),
  );
  assert.ok(result.intents.some((intent) => intent.kind === "focus-insight"));
  assert.ok(result.reasonCodes.includes("insight-focused"));
});

test("insight-deselected event", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "insight-deselected" }),
  );
  assert.equal(result.status, "no-op");
  assert.ok(
    result.intents.some((intent) => intent.kind === "clear-related-context"),
  );
});

test("insight-unfocused event", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "insight-unfocused" }),
  );
  assert.equal(result.status, "no-op");
  assert.ok(result.reasonCodes.includes("no-context-change"));
});

test("subject-selected event", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "subject-selected" }),
  );
  assert.ok(result.intents.some((intent) => intent.kind === "select-subject"));
  assert.ok(result.reasonCodes.includes("subject-selected"));
});

test("subject-focused event", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "subject-focused" }),
  );
  assert.ok(result.intents.some((intent) => intent.kind === "focus-subject"));
  assert.ok(result.reasonCodes.includes("subject-focused"));
});

test("presentation-changed event", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "presentation-changed" }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "sync-presentation-state"),
  );
  assert.ok(result.reasonCodes.includes("presentation-synchronized"));
});

test("attention-changed event", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "attention-changed" }),
  );
  assert.ok(result.intents.some((intent) => intent.kind === "focus-insight"));
  assert.ok(
    result.intents.some(
      (intent) => intent.attentionState !== undefined,
    ),
  );
});

// 25–28 presentation-state coordination
test("Minimum coordination remains sparse", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("minimum"),
      eventKind: "insight-selected",
    }),
  );
  assert.ok(result.intents.some((intent) => intent.kind === "select-insight"));
  assert.equal(
    result.intents.some((intent) => intent.kind === "expose-evidence-context"),
    false,
  );
  assert.equal(
    result.intents.some((intent) => intent.kind === "expose-advisor-context"),
    false,
  );
});

test("Report coordination exposes richer context", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("report"),
      eventKind: "insight-selected",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-advisor-context"),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-evidence-context"),
  );
});

test("Operation coordination exposes operation intents", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("operation"),
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-decision-context"),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-execution-context"),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-pack-context"),
  );
});

test("Operation intent does not execute action", () => {
  assert.equal(boundary.operationDistinctFromAction, true);
  assert.doesNotMatch(source, /executeDecision|startExecution|approveDecision/);
});

// 29–38 context exposure
test("Stage context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-stage-context"),
  );
  assert.ok(result.contexts.stage?.subjectId === "project.alpha");
  assert.ok(result.reasonCodes.includes("stage-context-exposed"));
});

test("Advisor context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-advisor-context"),
  );
  assert.equal(
    result.contexts.advisor?.insightId,
    "rex.insight.candidate:threshold:project.alpha:default",
  );
});

test("scene context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-scene-context"),
  );
  assert.equal(result.contexts.scene?.sceneId, "scene.1");
});

test("evidence context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-evidence-context"),
  );
  assert.ok((result.contexts.advisor?.evidenceRefs.length ?? 0) > 0);
});

test("relationship context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(
    result.intents.some(
      (intent) => intent.kind === "expose-relationship-context",
    ),
  );
});

test("Pack context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("operation"),
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-pack-context"),
  );
  assert.ok(result.contexts.packRefs.includes("pack.1"));
});

test("Decision context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("operation"),
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-decision-context"),
  );
});

test("Execution context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("operation"),
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-execution-context"),
  );
});

test("Scenario context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("operation"),
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-scenario-context"),
  );
});

test("Problem context exposure", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: presentation("operation"),
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-problem-context"),
  );
});

// 39–43 distinctions / sync
test("presentation synchronization", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "presentation-changed" }),
  );
  const sync = result.intents.find(
    (intent) => intent.kind === "sync-presentation-state",
  );
  assert.ok(sync);
  assert.equal(sync!.presentationState, "report");
  assert.equal(sync!.reference, "report");
});

test("no presentation re-resolution", () => {
  assert.equal(boundary.reresolvesPresentation, false);
  // May transitively re-export presentation APIs; must not redefine them.
  assert.doesNotMatch(
    source,
    /function resolveRuntimeExecutiveInsightPresentation\b/,
  );
  assert.doesNotMatch(
    source,
    /function resolveRuntimeExecutiveInsightMinimumPresentation\b|function resolveRuntimeExecutiveInsightReportPresentation\b|function resolveRuntimeExecutiveInsightOperationPresentation\b/,
  );
});

test("selection/focus distinction", () => {
  assert.equal(boundary.selectionDistinctFromFocus, true);
  const selected = orchestrateRuntimeExecutiveInsightSelection(baseInput());
  const focused = orchestrateRuntimeExecutiveInsightFocus(
    baseInput({ eventKind: "insight-focused" }),
  );
  assert.ok(selected.intents.some((intent) => intent.kind === "select-insight"));
  assert.ok(focused.intents.some((intent) => intent.kind === "focus-insight"));
  assert.notDeepEqual(
    selected.intents.map((intent) => intent.kind),
    focused.intents.map((intent) => intent.kind),
  );
});

test("attention/focus distinction", () => {
  assert.equal(boundary.attentionDistinctFromFocus, true);
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({ eventKind: "attention-changed" }),
  );
  const focusIntent = result.intents.find(
    (intent) => intent.kind === "focus-insight",
  );
  assert.ok(focusIntent?.attentionState);
  assert.notEqual(focusIntent!.kind, focusIntent!.attentionState);
});

test("operation-state/action distinction", () => {
  assert.equal(boundary.operationDistinctFromAction, true);
  const pres = presentation("operation");
  assert.equal(pres.resolvedState, "operation");
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      presentation: pres,
      eventKind: "operation-context-requested",
    }),
  );
  assert.ok(result.status === "orchestrated" || result.status === "restricted");
  assert.ok(
    result.intents.some((intent) => intent.kind === "expose-decision-context"),
  );
  assert.doesNotMatch(source, /executeOperation\(|runOperation\(/);
});

// 44–49 ordering / dedupe / suppression
test("deterministic intent order", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  const orders = result.intents.map((intent) => intent.order);
  assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
  const kinds = result.intents.map((intent) => intent.kind);
  const selectIndex = kinds.indexOf("select-insight");
  const syncIndex = kinds.indexOf("sync-presentation-state");
  const stageIndex = kinds.indexOf("expose-stage-context");
  const advisorIndex = kinds.indexOf("expose-advisor-context");
  assert.ok(selectIndex >= 0 && stageIndex >= 0);
  assert.ok(selectIndex < syncIndex);
  assert.ok(syncIndex < stageIndex);
  assert.ok(stageIndex < advisorIndex);
});

test("deterministic intent deduplication", () => {
  const resolved = resolveRuntimeExecutiveInsightExperienceIntents(baseInput());
  const keys = resolved.intents.map(
    (intent) =>
      `${intent.kind}|${intent.target}|${intent.sourceInsightId}|${intent.reference ?? ""}`,
  );
  assert.equal(keys.length, new Set(keys).size);
});

test("duplicate intents removed correctly", () => {
  const a = resolveRuntimeExecutiveInsightExperienceIntents(baseInput());
  const b = resolveRuntimeExecutiveInsightExperienceIntents(baseInput());
  assert.deepEqual(
    a.intents.map((intent) => intent.kind),
    b.intents.map((intent) => intent.kind),
  );
});

test("intent suppression by policy", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      policy: policy({
        suppressIntentKinds: ["expose-advisor-context"],
      }),
    }),
  );
  assert.equal(
    result.intents.some((intent) => intent.kind === "expose-advisor-context"),
    false,
  );
  assert.ok(
    result.suppressedIntents.some(
      (intent) => intent.kind === "expose-advisor-context",
    ),
  );
  assert.ok(result.reasonCodes.includes("intent-suppressed-by-policy"));
});

test("unavailable capability suppression", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      policy: policy({
        enabledCapabilities: ["StageSupportsFocus"],
        suppressWhenCapabilityMissing: true,
      }),
    }),
  );
  assert.ok(result.reasonCodes.includes("capability-unavailable"));
  assert.ok(
    result.suppressedIntents.some(
      (intent) => intent.kind === "expose-advisor-context",
    ),
  );
});

test("explicit suppressed-intent metadata", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      policy: policy({
        suppressIntentKinds: ["expose-scene-context"],
      }),
    }),
  );
  assert.ok(result.suppressedIntents.length > 0);
  assert.ok(Object.isFrozen(result.suppressedIntents));
  assert.ok(
    result.suppressedIntents[0]!.reasonCodes.includes(
      "intent-suppressed-by-policy",
    ),
  );
});

// 50–55 conflicts / precedence
test("deterministic conflict resolution", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      eventKind: "insight-focused",
      experienceContext: Object.freeze({
        focusedSubjectId: "project.alpha",
        selectedSubjectId: "project.alpha",
      }),
      competingFocusSubjectIds: ["project.beta", "project.alpha"],
      policy: policy({ requireUniqueStageFocus: true }),
    }),
  );
  assert.equal(result.conflictResolved, true);
  assert.ok(result.reasonCodes.includes("conflict-resolved"));
  const focus = result.intents.filter(
    (intent) => intent.kind === "focus-subject",
  );
  assert.equal(focus.length, 1);
  assert.equal(focus[0]!.reference, "project.alpha");
});

test("unresolved conflict returns conflicted", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      eventKind: "related-context-requested",
      competingFocusSubjectIds: ["project.alpha", "project.beta"],
      policy: policy({ requireUniqueStageFocus: true }),
    }),
  );
  assert.equal(result.status, "conflicted");
  assert.equal(result.conflictUnresolved, true);
  assert.ok(result.reasonCodes.includes("conflict-unresolved"));
});

test("stable ID tie-break", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      eventKind: "insight-focused",
      experienceContext: Object.freeze({}),
      competingFocusSubjectIds: ["project.zeta", "project.alpha"],
      policy: policy({ requireUniqueStageFocus: true }),
    }),
  );
  // user event with no focused/selected → stable ASCII preferred among competing + focus intents
  assert.equal(result.conflictResolved, true);
  const focus = result.intents.find((intent) => intent.kind === "focus-subject");
  assert.ok(focus);
  assert.ok(["project.alpha", "project.zeta"].includes(focus!.reference!));
});

test("explicit user event precedence", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(
    baseInput({
      eventKind: "subject-focused",
      experienceContext: Object.freeze({
        focusedSubjectId: "project.user-choice",
      }),
      competingFocusSubjectIds: ["project.other", "project.user-choice"],
    }),
  );
  assert.equal(result.conflictResolved, true);
  assert.equal(
    result.intents.find((intent) => intent.kind === "focus-subject")?.reference,
    "project.user-choice",
  );
});

test("upstream attention may participate without recomputation", () => {
  assert.equal(boundary.recalculatesAttention, false);
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(
    result.intents.some((intent) => intent.attentionState !== undefined),
  );
  assert.doesNotMatch(
    source,
    /function resolveRuntimeExecutiveInsightAttention\b/,
  );
});

test("upstream priority may participate without reranking", () => {
  assert.equal(boundary.recalculatesPriority, false);
  const contexts = resolveRuntimeExecutiveInsightExperienceContexts(baseInput());
  assert.ok(contexts.advisor?.priorityBand);
  assert.doesNotMatch(
    source,
    /function rankRuntimeExecutiveInsights\b|function evaluateRuntimeExecutiveInsightPriority\b/,
  );
});

// 56–66 boundaries
test("no insight re-resolution", () => {
  assert.equal(boundary.reresolvesInsightSemantics, false);
  assert.doesNotMatch(
    source,
    /function resolveRuntimeExecutiveInsight\b|function resolveRuntimeExecutiveInsights\b/,
  );
});

test("no priority recalculation", () => {
  assert.equal(boundary.recalculatesPriority, false);
});

test("no attention recalculation", () => {
  assert.equal(boundary.recalculatesAttention, false);
});

test("no Stage execution", () => {
  assert.equal(boundary.introducesStageExecution, false);
  assert.doesNotMatch(source, /highlightObject|moveCamera|mutateStage|selectStageSubject\(/);
});

test("no Advisor invocation", () => {
  assert.doesNotMatch(source, /invokeAdvisor|callAdvisor|askAdvisor\(/);
});

test("no Advisor prose generation", () => {
  assert.equal(boundary.introducesAdvisorProse, false);
  assert.doesNotMatch(source, /generateAdvisor|advisorMessage|executiveSummary\s*=/);
});

test("no scene mutation", () => {
  assert.equal(boundary.introducesSceneMutation, false);
  assert.doesNotMatch(source, /mutateScene|addSceneNode|removeSceneNode/);
});

test("no renderer behavior", () => {
  assert.equal(boundary.rendererIndependent, true);
  assert.doesNotMatch(source, /\bWebGL\b|canvas\.getContext|from ["']three["']/);
});

test("no React dependency", () => {
  assert.equal(boundary.reactIndependent, true);
  assert.doesNotMatch(source, /from ["']react["']|useState|useEffect|jsx/);
});

test("no DRI internal dependency", () => {
  assert.equal(boundary.importsDriDirectly, false);
  assert.doesNotMatch(source, /from ["'][^"']*\/dri\//);
});

test("no NOL internal dependency", () => {
  assert.equal(boundary.importsNolDirectly, false);
  assert.doesNotMatch(source, /from ["'][^"']*\/nol\//);
});

// 67–71 KPI/KOI
test("KPI context support", () => {
  assert.ok(subjectKinds.includes("kpi"));
  const contexts = resolveRuntimeExecutiveInsightExperienceContexts(baseInput());
  assert.ok(contexts.advisor?.kpiRefs.includes("kpi.delivery"));
});

test("KOI context support", () => {
  assert.ok(subjectKinds.includes("koi"));
  const contexts = resolveRuntimeExecutiveInsightExperienceContexts(baseInput());
  assert.ok(contexts.advisor?.koiRefs.includes("koi.north-star"));
});

test("KOR absence", () => {
  const forbidden = ["k", "o", "r"].join("");
  assert.equal((subjectKinds as readonly string[]).includes(forbidden), false);
  assert.equal(boundary.introducesKor, false);
  assert.equal(subjectSemantics.introducesKor, false);
  assert.doesNotMatch(source, /\bkor\b/i);
});

test("no KPI calculation", () => {
  assert.equal(boundary.calculatesKpi, false);
  assert.doesNotMatch(source, /calculateKpi|computeKpi|kpiValue\s*=/);
});

test("no KOI calculation", () => {
  assert.equal(boundary.calculatesKoi, false);
  assert.doesNotMatch(source, /calculateKoi|computeKoi|koiValue\s*=/);
});

// 72–78 immutability / registry
test("repeated identical input produces identical output", () => {
  const input = baseInput();
  const a = orchestrateRuntimeExecutiveInsightExperience(input);
  const b = orchestrateRuntimeExecutiveInsightExperience(input);
  assert.deepEqual(
    {
      status: a.status,
      kinds: a.intents.map((intent) => intent.kind),
      reasons: [...a.reasonCodes],
    },
    {
      status: b.status,
      kinds: b.intents.map((intent) => intent.kind),
      reasons: [...b.reasonCodes],
    },
  );
});

test("input not mutated", () => {
  const input = baseInput();
  const before = JSON.stringify(input);
  orchestrateRuntimeExecutiveInsightExperience(input);
  assert.equal(JSON.stringify(input), before);
});

test("policy not mutated", () => {
  const p = policy();
  const before = JSON.stringify(p);
  orchestrateRuntimeExecutiveInsightExperience(baseInput({ policy: p }));
  assert.equal(JSON.stringify(p), before);
});

test("contexts not mutated", () => {
  const input = baseInput();
  const before = JSON.stringify({
    e: input.experienceContext,
    s: input.stageContext,
    a: input.advisorContext,
    c: input.sceneContext,
  });
  orchestrateRuntimeExecutiveInsightExperience(input);
  assert.equal(
    JSON.stringify({
      e: input.experienceContext,
      s: input.stageContext,
      a: input.advisorContext,
      c: input.sceneContext,
    }),
    before,
  );
});

test("immutable intent collection", () => {
  const result = orchestrateRuntimeExecutiveInsightExperience(baseInput());
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.intents));
  assert.ok(Object.isFrozen(result.intents[0]));
});

test("immutable registry", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(
    Object.isFrozen(getRuntimeExecutiveInsightExperienceOrchestrationRegistry()),
  );
  assert.ok(Object.isFrozen(orchestrationModule));
});

test("registry counts derived correctly", () => {
  assert.equal(registry.eventKindCount, eventKinds.length);
  assert.equal(registry.intentKindCount, intentKinds.length);
  assert.equal(registry.intentTargetCount, intentTargets.length);
  assert.equal(registry.intentPriorityCount, intentPriorities.length);
  assert.equal(registry.orchestrationStatusCount, statuses.length);
  assert.equal(registry.reasonCodeCount, reasonCodes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
});

// 79–82 AI / external / automation
test("no AI/LLM", () => {
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bchatgpt\b/i);
  assert.ok(consumerGuarantees.includes("no-ai"));
  assert.ok(consumerGuarantees.includes("no-llm"));
});

test("no external API/DB", () => {
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.doesNotMatch(source, /\b(fetch\(|axios|prisma|sql)\b/);
  assert.doesNotMatch(source, /Date\.now\(|Math\.random\(/);
});

test("no persistence", () => {
  assert.equal(boundary.introducesPersistence, false);
  assert.doesNotMatch(source, /localStorage|indexedDB|writeFile/);
});

test("no automation", () => {
  assert.equal(boundary.introducesAutomation, false);
  assert.equal(boundary.introducesNotifications, false);
  assert.doesNotMatch(source, /sendEmail|createTask|notifyUser|triggerWorkflow/);
});

test("architectural dependency imports only REX-4:5 among REX-4", () => {
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1]!,
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightPresentation",
  ]);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperienceFoundation/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperienceContracts/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightResolution/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightPriorityAttention/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperiencePlatform/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperiencePublicIndex/);
  assert.doesNotMatch(source, /runtimeExecutiveStage/);
  assert.doesNotMatch(source, /runtimeExecutiveAdvisor/);
  assert.doesNotMatch(source, /\/dri\//);
  assert.doesNotMatch(source, /\/nol\//);
  assert.doesNotMatch(source, /ex-dri/);
  assert.doesNotMatch(source, /from ["']react["']/);
});

test("verifyRuntimeExecutiveInsightExperienceOrchestration passes", () => {
  const verification = verifyRuntimeExecutiveInsightExperienceOrchestration();
  assert.equal(verification.ok, true);
  assert.equal(verification.selectionDistinctFromFocus, true);
  assert.equal(verification.attentionDistinctFromFocus, true);
  assert.equal(verification.operationDistinctFromAction, true);
});

test("upstream REX-4:1–4:5 verification remains green", () => {
  assert.equal(verifyRuntimeExecutiveInsightExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightResolution().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightPriorityAttention().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightPresentation().ok, true);
});
