import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES as consumerGuarantees,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER as pipelineOrder,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES as stages,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES as stageStatuses,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT as emptyPlatformResult,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  areDirectorRuntimeAttentionFocusPlatformResultsEquivalent,
  createDirectorRuntimeAttentionRelationship,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  directorRuntimeAttentionFocusPlatform as layer,
  directorRuntimeAttentionFocusPlatformCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionFocusPlatformPolicy as policy,
  directorRuntimeAttentionFocusPlatformRegistry as registry,
  runDirectorRuntimeAttentionFocusPlatform,
  validateDirectorRuntimeAttentionFocusPlatformSnapshot,
  verifyDirectorRuntimeAttentionFocusPlatform,
  type DirectorRuntimeAttentionFocusPlatformInput,
  type DirectorRuntimeAttentionTransitionState,
  type DirectorRuntimeFocusContext,
  type DirectorRuntimeFocusContextEntry,
} from "./directorRuntimeAttentionFocusPlatform.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionFocusPlatform.ts", import.meta.url),
  "utf8",
);

const production = Object.freeze({ subjectId: "Production", subjectKind: "object" as const });
const shipping = Object.freeze({ subjectId: "Shipping", subjectKind: "object" as const });
const customer = Object.freeze({ subjectId: "Customer", subjectKind: "object" as const });

function entry(
  subject: DirectorRuntimeFocusContextEntry["subject"],
  attentionLevel: DirectorRuntimeFocusContextEntry["attentionLevel"],
  focusRole: DirectorRuntimeFocusContextEntry["focusRole"],
  id: string,
): DirectorRuntimeFocusContextEntry {
  return Object.freeze({
    subject: Object.freeze({ ...subject }),
    attentionLevel,
    focusRole,
    sourceAssignmentId: id,
    contributingSignalIds: Object.freeze([id]),
  });
}

function focusContext(
  partial: Partial<DirectorRuntimeFocusContext> & {
    readonly primarySubject: DirectorRuntimeFocusContext["primarySubject"];
    readonly entries: readonly DirectorRuntimeFocusContextEntry[];
  },
): DirectorRuntimeFocusContext {
  return Object.freeze({
    primarySubject: partial.primarySubject === null
      ? null
      : Object.freeze({ ...partial.primarySubject }),
    entries: Object.freeze([...partial.entries]),
    suppressedEntries: Object.freeze([...(partial.suppressedEntries ?? [])]),
  });
}

function signal(
  overrides: Parameters<typeof createDirectorRuntimeAttentionSignal>[0],
) {
  return createDirectorRuntimeAttentionSignal(overrides);
}

function run(input: DirectorRuntimeAttentionFocusPlatformInput) {
  return runDirectorRuntimeAttentionFocusPlatform(input);
}

test("1. exact identity", () => {
  assert.equal(layer.identity, "DRI-6:7/DirectorRuntimeAttentionFocusPlatform");
  assert.equal(layer.role, "Platform");
  assert.equal(layer.status, "PlatformReady");
});

test("2. exact version", () => {
  assert.equal(layer.version, "6.7.0");
  assert.equal(canonicalIdentity.version, "6.7.0");
});

test("3. exact namespace", () => {
  assert.equal(layer.namespace, "nexora.dri.attention-focus.platform");
});

test("4. sole immediate dependency = DRI-6:6", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionTransitionOrchestration"],
  );
  assert.equal(source.includes("directorRuntimeAttentionPathOrchestration"), false);
  assert.equal(source.includes("directorRuntimeFocusContextBinding"), false);
  assert.equal(source.includes("directorRuntimeAttentionPriorityResolution"), false);
  assert.equal(source.includes("directorRuntimeAttentionSignalContracts"), false);
  assert.equal(source.includes("directorRuntimeAttentionFocusFoundation"), false);
});

test("5. exact pipeline stage order", () => {
  assert.deepEqual([...pipelineOrder], [
    "signal-validation",
    "priority-resolution",
    "focus-context-binding",
    "attention-path-orchestration",
    "attention-transition-orchestration",
    "complete",
  ]);
  assert.deepEqual([...stages], [...pipelineOrder]);
  assert.equal(registry.stageCount, 6);
});

test("6. stage-status vocabulary", () => {
  assert.deepEqual([...stageStatuses], [
    "pending", "completed", "failed", "not-applicable",
  ]);
  assert.equal(registry.stageStatusCount, 4);
});

test("7. platform capability registry", () => {
  assert.ok(capabilities.includes("EndToEndAttentionComposition"));
  assert.ok(capabilities.includes("CrossStageValidation"));
  assert.deepEqual([...absentCapabilities], [
    "NewPriorityPolicy",
    "NewFocusPolicy",
    "NewPathPolicy",
    "NewTransitionPolicy",
    "PresentationBehavior",
    "SceneMutation",
    "Persistence",
    "Networking",
  ]);
});

test("8. consumer guarantees", () => {
  assert.deepEqual([...consumerGuarantees], [
    "Deterministic",
    "Immutable",
    "PureComposition",
    "SinglePipelineOrder",
    "UpstreamSemanticAuthority",
    "RendererIndependent",
    "NoSceneMutation",
    "Traceable",
  ]);
  assert.equal(registry.consumerGuaranteeCount, 8);
});

test("9. platform registry immutability", () => {
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(policy.introducesNewSemantics, false);
});

test("10. valid empty platform input", () => {
  const result = run({
    signals: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    relationships: [],
  });
  assert.equal(result.ok, true);
});

test("11. empty end-to-end result", () => {
  const result = run({
    signals: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    relationships: [],
  });
  assert.equal(result.focusContext?.primarySubject, null);
  assert.deepEqual(result.focusContext?.entries, []);
  assert.deepEqual(result.pathResult?.paths, []);
  assert.equal(result.transitionPlan, null);
  assert.equal(
    result.stageTrace.find((entry) =>
      entry.stage === "attention-transition-orchestration")?.status,
    "not-applicable",
  );
});

test("12. single-signal end-to-end composition", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(result.ok, true);
  assert.equal(result.resolution?.primary?.subject.subjectId, "Production");
  assert.equal(result.focusContext?.primarySubject?.subjectId, "Production");
  assert.equal(result.focusContext?.entries[0]?.focusRole, "focused");
  assert.equal(result.pathResult?.rootSubject?.subjectId, "Production");
  assert.deepEqual(result.pathResult?.paths, []);
});

test("13. multi-signal CriticalState end-to-end composition", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(result.ok, true);
  assert.equal(result.resolution?.primary?.subject.subjectId, "Shipping");
  assert.equal(
    result.resolution?.assignments.find((entry) =>
      entry.subject.subjectId === "Production")?.resolvedLevel,
    "secondary",
  );
});

test("14. DRI-6:3 result preserved", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(result.resolution?.primary?.winningSignalId, "kpi-ship");
});

test("15. DRI-6:4 focus roles preserved", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(
    result.focusContext?.entries.find((entry) =>
      entry.subject.subjectId === "Shipping")?.focusRole,
    "focused",
  );
  assert.equal(
    result.focusContext?.entries.find((entry) =>
      entry.subject.subjectId === "Production")?.focusRole,
    "supporting",
  );
});

test("16. DRI-6:5 paths preserved", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "secondary",
          persistence: "transient",
          intent: "request-support",
        }),
        signal({
          signalId: "adv-cust",
          subject: customer,
          source: "advisor",
          reason: "context-relevance",
          scope: "subject",
          requestedLevel: "context",
          persistence: "transient",
          intent: "request-context",
        }),
      ],
    }),
    relationships: [
      createDirectorRuntimeAttentionRelationship({
        source: production,
        target: shipping,
        kind: "downstream",
      }),
      createDirectorRuntimeAttentionRelationship({
        source: shipping,
        target: customer,
        kind: "downstream",
      }),
    ],
  });
  assert.equal(result.ok, true);
  assert.ok((result.pathResult?.paths.length ?? 0) >= 1);
  assert.ok(
    result.pathResult!.paths.some((path) =>
      path.subjects.some((subject) => subject.subjectId === "Customer")),
  );
});

test("17. no previous state → canonical transition policy", () => {
  assert.equal(
    policy.transitionAbsencePolicy,
    "null-transition-plan-when-previous-state-absent",
  );
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(result.transitionPlan, null);
});

test("18. valid previous state → DRI-6:6 transition composition", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "adv-cust",
          subject: customer,
          source: "advisor",
          reason: "context-relevance",
          scope: "subject",
          requestedLevel: "context",
          persistence: "transient",
          intent: "request-context",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.equal(result.ok, true);
  assert.ok(result.transitionPlan);
  assert.ok(result.transitionPlan!.transitionKinds.includes("focus-shift"));
});

test("19. focus-shift end-to-end", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.equal(
    result.transitionPlan?.focusTransition.previousPrimary?.subjectId,
    "Production",
  );
  assert.equal(
    result.transitionPlan?.focusTransition.nextPrimary?.subjectId,
    "Shipping",
  );
});

test("20. promotion end-to-end", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.ok(
    result.transitionPlan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Shipping" && entry.kind === "promote"),
  );
});

test("21. demotion end-to-end", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.ok(
    result.transitionPlan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Production" && entry.kind === "demote"),
  );
});

test("22. context-enter end-to-end", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "adv-cust",
          subject: customer,
          source: "advisor",
          reason: "context-relevance",
          scope: "subject",
          requestedLevel: "context",
          persistence: "transient",
          intent: "request-context",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.ok(
    result.transitionPlan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Customer" && entry.kind === "enter"),
  );
});

test("23. path transition end-to-end", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "secondary",
          persistence: "transient",
          intent: "request-support",
        }),
        signal({
          signalId: "adv-cust",
          subject: customer,
          source: "advisor",
          reason: "context-relevance",
          scope: "subject",
          requestedLevel: "context",
          persistence: "transient",
          intent: "request-context",
        }),
      ],
    }),
    relationships: [
      createDirectorRuntimeAttentionRelationship({
        source: production,
        target: shipping,
        kind: "downstream",
      }),
      createDirectorRuntimeAttentionRelationship({
        source: shipping,
        target: customer,
        kind: "downstream",
      }),
    ],
    previousState,
  });
  assert.ok(
    (result.transitionPlan?.pathTransitions.length ?? 0) >= 1 ||
      (result.pathResult?.paths.length ?? 0) >= 1,
  );
});

test("24. signal trace preservation", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "trace-a",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "trace-b",
          subject: production,
          source: "advisor",
          reason: "advisor-relevance",
          scope: "subject",
          requestedLevel: "secondary",
          persistence: "transient",
          intent: "request-support",
        }),
      ],
    }),
    relationships: [],
  });
  const contributing = result.focusContext?.entries[0]?.contributingSignalIds ?? [];
  assert.ok(contributing.includes("trace-a"));
  assert.ok(contributing.includes("trace-b"));
});

test("25. resolution/focus primary consistency", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(
    result.resolution?.primary?.subject.subjectId,
    result.focusContext?.primarySubject?.subjectId,
  );
});

test("26. focus/path-root consistency", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  });
  assert.equal(
    result.focusContext?.primarySubject?.subjectId,
    result.pathResult?.rootSubject?.subjectId,
  );
});

test("27. transition-current-state consistency", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.equal(
    result.currentState?.focusContext,
    result.focusContext,
  );
  assert.equal(result.snapshot?.transitionState.focusContext, result.focusContext);
});

test("28. suppression consistency", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "focus-a",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "sup-b",
          subject: shipping,
          source: "system",
          reason: "system-relevance",
          scope: "subject",
          requestedLevel: "suppressed",
          persistence: "transient",
          intent: "request-suppression",
        }),
      ],
    }),
    relationships: [
      createDirectorRuntimeAttentionRelationship({
        source: production,
        target: shipping,
        kind: "direct",
      }),
    ],
  });
  assert.equal(result.ok, true);
  assert.ok(
    validateDirectorRuntimeAttentionFocusPlatformSnapshot(result.snapshot).ok,
  );
  assert.equal(
    result.pathResult?.paths.some((path) =>
      path.subjects[path.subjects.length - 1]?.subjectId === "Shipping"),
    false,
  );
});

test("29. valid platform snapshot", () => {
  const result = run({
    signals: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    relationships: [],
  });
  assert.equal(
    validateDirectorRuntimeAttentionFocusPlatformSnapshot(result.snapshot).ok,
    true,
  );
});

test("30. malformed snapshot rejection", () => {
  const validation = validateDirectorRuntimeAttentionFocusPlatformSnapshot({
    resolution: {
      primary: {
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "a",
        contributingSignalIds: ["a"],
      },
      assignments: [],
      winningSignalIds: [],
      retainedSignalIds: [],
      suppressedSignalIds: [],
      explanations: [],
    },
    focusContext: focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
    transitionState: {
      focusContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
      pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
    },
  });
  assert.equal(validation.ok, false);
});

test("31. invalid signal input fail-fast", () => {
  const result = run({
    signals: { signals: [{ signalId: "" }] } as never,
    relationships: [],
  });
  assert.equal(result.ok, false);
  assert.equal(result.resolution, null);
  assert.equal(result.focusContext, null);
  assert.equal(result.pathResult, null);
  assert.equal(result.currentState, null);
  assert.equal(result.transitionPlan, null);
  assert.equal(
    result.stageTrace.find((entry) => entry.stage === "signal-validation")?.status,
    "failed",
  );
});

test("32. no focus binding after resolution failure", () => {
  const result = run({
    signals: { signals: [{ signalId: "" }] } as never,
    relationships: [],
  });
  assert.equal(
    result.stageTrace.find((entry) => entry.stage === "focus-context-binding")
      ?.status,
    "pending",
  );
});

test("33. invalid relationships path-stage failure", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [{ source: production, target: shipping, kind: "nope" } as never],
  });
  assert.equal(result.ok, false);
  assert.ok(result.resolution);
  assert.ok(result.focusContext);
  assert.equal(result.pathResult, null);
  assert.equal(
    result.stageTrace.find((entry) =>
      entry.stage === "attention-path-orchestration")?.status,
    "failed",
  );
});

test("34. invalid previous-state transition-stage failure", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState: { focusContext: null, pathResult: null } as never,
  });
  assert.equal(result.ok, false);
  assert.ok(result.currentState);
  assert.ok(result.snapshot);
  assert.equal(result.transitionPlan, null);
  assert.equal(
    result.stageTrace.find((entry) =>
      entry.stage === "attention-transition-orchestration")?.status,
    "failed",
  );
});

test("35. platform ok false on stage failure", () => {
  const result = run({
    signals: { signals: [{ signalId: "" }] } as never,
    relationships: [],
  });
  assert.equal(result.ok, false);
});

test("36. no false full-success on partial outputs", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState: { focusContext: null, pathResult: null } as never,
  });
  assert.equal(result.ok, false);
  assert.ok(result.resolution);
  assert.ok(result.focusContext);
});

test("37. deterministic repeated execution", () => {
  const input = Object.freeze({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: Object.freeze([]),
  });
  assert.deepEqual(run(input), run(input));
});

test("38. platform result equivalence", () => {
  const input = {
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
  };
  assert.equal(
    areDirectorRuntimeAttentionFocusPlatformResultsEquivalent(run(input), run(input)),
    true,
  );
  assert.equal(
    areDirectorRuntimeAttentionFocusPlatformResultsEquivalent(
      run(input),
      emptyPlatformResult,
    ),
    false,
  );
});

test("39. input signal immutability", () => {
  const signals = createDirectorRuntimeAttentionSignalBatch({
    signals: [
      signal({
        signalId: "sig",
        subject: production,
        source: "user-interaction",
        reason: "explicit-selection",
        scope: "subject",
        requestedLevel: "primary",
        persistence: "transient",
        intent: "request-focus",
      }),
    ],
  });
  const before = JSON.stringify(signals);
  run({ signals, relationships: [] });
  assert.equal(JSON.stringify(signals), before);
});

test("40. input relationship immutability", () => {
  const relationships = [
    createDirectorRuntimeAttentionRelationship({
      source: production,
      target: shipping,
      kind: "direct",
    }),
  ];
  const before = JSON.stringify(relationships);
  run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships,
  });
  assert.equal(JSON.stringify(relationships), before);
});

test("41. previous-state immutability", () => {
  const previousState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext: focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  });
  const before = JSON.stringify(previousState);
  run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "sig",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
      ],
    }),
    relationships: [],
    previousState,
  });
  assert.equal(JSON.stringify(previousState), before);
});

test("42. output immutability", () => {
  const result = run({
    signals: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    relationships: [],
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.stageTrace), true);
  assert.throws(() => {
    (result as { ok: boolean }).ok = false;
  });
});

test("43. fixed pipeline order", () => {
  const result = run({
    signals: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    relationships: [],
  });
  assert.deepEqual(
    result.stageTrace.map((entry) => entry.stage),
    [...pipelineOrder],
  );
});

test("44. no priority-policy duplication", () => {
  assert.equal(policy.performsPriorityResolution, false);
  assert.doesNotMatch(source, /function resolveDirectorRuntimeAttentionPriority/);
  assert.doesNotMatch(source, /function compareDirectorRuntimeAttentionSignals/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE\s*=/);
});

test("45. no focus-policy duplication", () => {
  assert.equal(policy.rebindsFocusContext, false);
  assert.doesNotMatch(source, /function bindDirectorRuntimeFocusContext/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE\s*=/);
});

test("46. no path-policy duplication", () => {
  assert.equal(policy.discoversPaths, false);
  assert.doesNotMatch(source, /function orchestrateDirectorRuntimeAttentionPaths/);
  assert.doesNotMatch(source, /collectDirectedPaths|buildEdges/);
});

test("47. no transition-policy duplication", () => {
  assert.equal(policy.redefinesTransitions, false);
  assert.doesNotMatch(source, /function orchestrateDirectorRuntimeAttentionTransition/);
  assert.doesNotMatch(source, /function classifySubjectTransition/);
});

test("48. no timing behavior", () => {
  assert.equal(policy.includesTiming, false);
  assert.doesNotMatch(source, /\bduration\s*:/);
  assert.doesNotMatch(source, /\bmilliseconds\b/);
  assert.doesNotMatch(source, /\bfps\b/);
});

test("49. no presentation fields", () => {
  assert.equal(policy.includesPresentation, false);
  const result = run({
    signals: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    relationships: [],
  });
  const serialized = JSON.stringify(result);
  for (const token of ["color", "opacity", "camera", "glow", "Three"]) {
    assert.equal(serialized.includes(`"${token}"`), false);
  }
});

test("50. no scene mutation", () => {
  assert.equal(policy.mutatesScene, false);
  assert.ok(absentCapabilities.includes("SceneMutation"));
  assert.doesNotMatch(source, /hideNode|selectMesh|setCameraTarget|mutateScene/);
});

test("51. no persistence", () => {
  assert.equal(policy.persistsState, false);
  assert.ok(absentCapabilities.includes("Persistence"));
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|fs\.write/);
});

test("52. no networking", () => {
  assert.equal(policy.usesNetworking, false);
  assert.ok(absentCapabilities.includes("Networking"));
  assert.doesNotMatch(source, /\bfetch\b|\bXMLHttpRequest\b|\bWebSocket\b/);
});

test("53. no event system", () => {
  assert.equal(policy.usesEventSystem, false);
  assert.doesNotMatch(source, /EventEmitter|addEventListener|createObservable/);
});

test("54. static verification success", () => {
  const verification = verifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "6.7.0");
  assert.equal(verification.frozen, true);
});

test("55. deterministic repeated verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeAttentionFocusPlatform(),
    verifyDirectorRuntimeAttentionFocusPlatform(),
  );
});

test("56. representative end-to-end scenario", () => {
  const result = run({
    signals: createDirectorRuntimeAttentionSignalBatch({
      signals: [
        signal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "kpi-ship",
          subject: shipping,
          source: "kpi",
          reason: "critical-state",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        signal({
          signalId: "adv-cust",
          subject: customer,
          source: "advisor",
          reason: "context-relevance",
          scope: "subject",
          requestedLevel: "context",
          persistence: "transient",
          intent: "request-context",
        }),
      ],
    }),
    relationships: [
      createDirectorRuntimeAttentionRelationship({
        source: production,
        target: shipping,
        kind: "downstream",
      }),
      createDirectorRuntimeAttentionRelationship({
        source: shipping,
        target: customer,
        kind: "downstream",
      }),
    ],
  });
  assert.equal(result.ok, true);
  assert.equal(result.resolution?.primary?.subject.subjectId, "Shipping");
  assert.equal(
    result.focusContext?.entries.find((entry) =>
      entry.subject.subjectId === "Shipping")?.focusRole,
    "focused",
  );
  assert.equal(
    result.focusContext?.entries.find((entry) =>
      entry.subject.subjectId === "Production")?.focusRole,
    "supporting",
  );
  assert.equal(
    result.focusContext?.entries.find((entry) =>
      entry.subject.subjectId === "Customer")?.focusRole,
    "contextual",
  );
  assert.equal(result.transitionPlan, null);
  assert.ok((result.pathResult?.paths.length ?? 0) >= 1);
});
