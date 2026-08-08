import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  type DirectorRuntimeAttentionPath,
  type DirectorRuntimeAttentionPathOrchestrationResult,
  type DirectorRuntimeFocusContext,
  type DirectorRuntimeFocusContextEntry,
} from "./directorRuntimeAttentionPathOrchestration.ts";

import {
  DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS as pathTransitionKinds,
  DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS as subjectTransitionKinds,
  DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS as transitionKinds,
  DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES as phases,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE as emptyState,
  DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN as noChangePlan,
  areDirectorRuntimeAttentionTransitionPlansEquivalent,
  directorRuntimeAttentionTransitionOrchestration as layer,
  directorRuntimeAttentionTransitionOrchestrationCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionTransitionOrchestrationPolicy as policy,
  directorRuntimeAttentionTransitionOrchestrationRegistry as registry,
  orchestrateDirectorRuntimeAttentionTransition,
  resolveDirectorRuntimeAttentionPathTransitions,
  resolveDirectorRuntimeAttentionSubjectTransitions,
  resolveDirectorRuntimeFocusTransition,
  validateDirectorRuntimeAttentionSubjectTransition,
  validateDirectorRuntimeAttentionTransitionPlan,
  validateDirectorRuntimeAttentionTransitionState,
  verifyDirectorRuntimeAttentionTransitionOrchestration,
  type DirectorRuntimeAttentionTransitionInput,
  type DirectorRuntimeAttentionTransitionState,
} from "./directorRuntimeAttentionTransitionOrchestration.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionTransitionOrchestration.ts", import.meta.url),
  "utf8",
);

const production = Object.freeze({ subjectId: "Production", subjectKind: "object" as const });
const shipping = Object.freeze({ subjectId: "Shipping", subjectKind: "object" as const });
const customer = Object.freeze({ subjectId: "Customer", subjectKind: "object" as const });
const warehouse = Object.freeze({ subjectId: "Warehouse", subjectKind: "object" as const });

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

function makePath(
  pathId: string,
  subjects: readonly DirectorRuntimeFocusContextEntry["subject"][],
  kind: DirectorRuntimeAttentionPath["kind"] = "direct",
): DirectorRuntimeAttentionPath {
  const frozenSubjects = subjects.map((subject) => Object.freeze({ ...subject }));
  const segments = frozenSubjects.slice(0, -1).map((sourceSubject, index) =>
    Object.freeze({
      source: sourceSubject,
      target: frozenSubjects[index + 1]!,
      relationshipKind: "direct" as const,
    }));
  return Object.freeze({
    pathId,
    kind,
    direction: "outbound" as const,
    relevance: "primary" as const,
    subjects: Object.freeze(frozenSubjects),
    relationshipRefs: Object.freeze(
      segments.map((segment) =>
        `rel:${segment.source.subjectKind}:${segment.source.subjectId}>` +
        `${segment.target.subjectKind}:${segment.target.subjectId}:direct`),
    ),
    segments: Object.freeze(segments),
  });
}

function pathResult(
  paths: readonly DirectorRuntimeAttentionPath[],
  rootSubject: DirectorRuntimeFocusContext["primarySubject"] = null,
): DirectorRuntimeAttentionPathOrchestrationResult {
  const segments = paths.flatMap((path) => path.segments);
  return Object.freeze({
    ok: true,
    rootSubject: rootSubject === null ? null : Object.freeze({ ...rootSubject }),
    paths: Object.freeze([...paths]),
    segments: Object.freeze([...segments]),
    counts: Object.freeze({
      pathCount: paths.length,
      segmentCount: segments.length,
      upstreamPathCount: 0,
      downstreamPathCount: 0,
      supportingPathCount: 0,
      contextualPathCount: 0,
      dependencyPathCount: 0,
      directPathCount: paths.length,
    }),
    issues: Object.freeze([]),
  });
}

function state(
  focus: DirectorRuntimeFocusContext,
  paths: DirectorRuntimeAttentionPathOrchestrationResult =
    DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
): DirectorRuntimeAttentionTransitionState {
  return Object.freeze({ focusContext: focus, pathResult: paths });
}

function orchestrate(
  previous: DirectorRuntimeAttentionTransitionState,
  next: DirectorRuntimeAttentionTransitionState,
) {
  const input: DirectorRuntimeAttentionTransitionInput = Object.freeze({
    previous,
    next,
  });
  return orchestrateDirectorRuntimeAttentionTransition(input);
}

test("1. exact identity", () => {
  assert.equal(
    layer.identity,
    "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration",
  );
  assert.equal(layer.role, "AttentionTransitionOrchestration");
  assert.equal(layer.status, "AttentionTransitionOrchestrationReady");
});

test("2. exact version", () => {
  assert.equal(layer.version, "6.6.0");
  assert.equal(canonicalIdentity.version, "6.6.0");
});

test("3. exact namespace", () => {
  assert.equal(
    layer.namespace,
    "nexora.dri.attention-focus.transition-orchestration",
  );
});

test("4. sole immediate dependency = DRI-6:5", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:5/DirectorRuntimeAttentionPathOrchestration",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionPathOrchestration"],
  );
  assert.equal(source.includes("directorRuntimeFocusContextBinding"), false);
  assert.equal(source.includes("directorRuntimeAttentionPriorityResolution"), false);
  assert.equal(source.includes("directorRuntimeAttentionSignalContracts"), false);
  assert.equal(source.includes("directorRuntimeAttentionFocusFoundation"), false);
});

test("5. canonical high-level transition kinds", () => {
  assert.deepEqual([...transitionKinds], [
    "no-change",
    "focus-shift",
    "focus-retain",
    "focus-release",
    "context-expansion",
    "context-reduction",
    "path-shift",
    "path-expansion",
    "path-reduction",
    "suppression-change",
  ]);
  assert.equal(registry.transitionKindCount, 10);
});

test("6. canonical subject transition kinds", () => {
  assert.deepEqual([...subjectTransitionKinds], [
    "enter", "retain", "promote", "demote", "suppress", "unsuppress", "exit",
  ]);
  assert.equal(registry.subjectTransitionKindCount, 7);
});

test("7. canonical path transition kinds", () => {
  assert.deepEqual([...pathTransitionKinds], [
    "activate", "retain", "replace", "retire",
  ]);
  assert.equal(registry.pathTransitionKindCount, 4);
});

test("8. canonical phase ordering", () => {
  assert.deepEqual([...phases], ["release", "handoff", "acquire", "stabilize"]);
  assert.equal(registry.phaseCount, 4);
});

test("9. transition policy immutability", () => {
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(policy.includesTiming, false);
  assert.equal(policy.discoversPaths, false);
});

test("10. capability registry", () => {
  assert.ok(capabilities.includes("FocusHandoffDetection"));
  assert.ok(capabilities.includes("PathShiftDetection"));
  assert.deepEqual([...absentCapabilities], [
    "PriorityResolution",
    "FocusContextBinding",
    "PathDiscovery",
    "Rendering",
    "Animation",
    "SceneMutation",
  ]);
});

test("11. empty-to-empty = NoChange", () => {
  const result = orchestrate(emptyState, emptyState);
  assert.equal(result.ok, true);
  assert.deepEqual(result.plan?.transitionKinds, ["no-change"]);
  assert.deepEqual(result.plan, noChangePlan);
});

test("12. no-change exclusivity", () => {
  const validation = validateDirectorRuntimeAttentionTransitionPlan({
    transitionKinds: ["no-change", "focus-shift"],
    focusTransition: {
      previousPrimary: null,
      nextPrimary: null,
      kind: "no-change",
    },
    subjectTransitions: [],
    pathTransitions: [],
    phases: ["stabilize"],
    explanation: noChangePlan.explanation,
    subjectTransitionCount: 0,
    pathTransitionCount: 0,
  });
  assert.equal(validation.ok, false);
  assert.ok(
    validation.issues.some((entry) =>
      entry.code === "no-change-exclusivity-violation"),
  );
});

test("13. empty-to-focused acquisition", () => {
  const next = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const result = orchestrate(emptyState, next);
  assert.equal(result.plan?.focusTransition.kind, "focus-shift");
  assert.equal(result.plan?.focusTransition.nextPrimary?.subjectId, "Production");
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Production" && entry.kind === "enter"),
  );
});

test("14. focused-to-empty release", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const result = orchestrate(previous, emptyState);
  assert.equal(result.plan?.focusTransition.kind, "focus-release");
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Production" && entry.kind === "exit"),
  );
});

test("15. same-primary retention", () => {
  const snapshot = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const result = orchestrate(snapshot, snapshot);
  assert.deepEqual(result.plan?.transitionKinds, ["no-change"]);
  assert.ok(
    result.plan?.subjectTransitions.every((entry) => entry.kind === "retain"),
  );
});

test("16. primary focus shift", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(shipping, "secondary", "supporting", "s"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [
      entry(shipping, "primary", "focused", "s"),
      entry(production, "secondary", "supporting", "p"),
    ],
  }));
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.transitionKinds.includes("focus-shift"));
  assert.equal(result.plan?.focusTransition.previousPrimary?.subjectId, "Production");
  assert.equal(result.plan?.focusTransition.nextPrimary?.subjectId, "Shipping");
});

test("17. subject Enter", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const next = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(customer, "context", "contextual", "c"),
    ],
  }));
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Customer" && entry.kind === "enter"),
  );
});

test("18. subject Retain", () => {
  const snapshot = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const transitions = resolveDirectorRuntimeAttentionSubjectTransitions(
    snapshot.focusContext,
    snapshot.focusContext,
  );
  assert.equal(transitions[0]?.kind, "retain");
});

test("19. subject Promote", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(shipping, "secondary", "supporting", "s"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [
      entry(shipping, "primary", "focused", "s"),
      entry(production, "secondary", "supporting", "p"),
    ],
  }));
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Shipping" && entry.kind === "promote"),
  );
});

test("20. subject Demote", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(shipping, "secondary", "supporting", "s"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [
      entry(shipping, "primary", "focused", "s"),
      entry(production, "secondary", "supporting", "p"),
    ],
  }));
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Production" && entry.kind === "demote"),
  );
});

test("21. subject Suppress", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "a"),
      entry(shipping, "secondary", "supporting", "b"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "a")],
    suppressedEntries: [entry(shipping, "suppressed", "none", "b")],
  }));
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Shipping" && entry.kind === "suppress"),
  );
  assert.equal(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Shipping" && entry.kind === "exit"),
    false,
  );
});

test("22. subject Unsuppress", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "a")],
    suppressedEntries: [entry(shipping, "suppressed", "none", "b")],
  }));
  const next = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "a"),
      entry(shipping, "context", "contextual", "b"),
    ],
  }));
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Shipping" && entry.kind === "unsuppress"),
  );
  assert.ok(result.plan?.transitionKinds.includes("context-expansion"));
});

test("23. subject Exit", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(warehouse, "context", "contextual", "w"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Warehouse" && entry.kind === "exit"),
  );
});

test("24. same subject not exit+enter on role change", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(shipping, "secondary", "supporting", "s"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [
      entry(shipping, "primary", "focused", "s"),
      entry(production, "secondary", "supporting", "p"),
    ],
  }));
  const result = orchestrate(previous, next);
  const productionKinds = result.plan!.subjectTransitions
    .filter((entry) => entry.subject.subjectId === "Production")
    .map((entry) => entry.kind);
  assert.deepEqual(productionKinds, ["demote"]);
  assert.equal(productionKinds.includes("exit"), false);
  assert.equal(productionKinds.includes("enter"), false);
});

test("25. context expansion", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const next = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(customer, "context", "contextual", "c"),
    ],
  }));
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.transitionKinds.includes("context-expansion"));
});

test("26. context reduction", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "a"),
      entry(shipping, "secondary", "supporting", "b"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "a")],
    suppressedEntries: [entry(shipping, "suppressed", "none", "b")],
  }));
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.transitionKinds.includes("context-reduction"));
  assert.ok(result.plan?.transitionKinds.includes("suppression-change"));
});

test("27. path Activate", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult([], production),
  );
  const next = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([makePath("p1", [production, shipping])], production),
  );
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.pathTransitions.some((entry) => entry.kind === "activate"));
});

test("28. path Retain", () => {
  const path = makePath("same", [production, shipping]);
  const snapshot = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([path], production),
  );
  const result = orchestrate(snapshot, snapshot);
  assert.ok(result.plan?.pathTransitions.every((entry) => entry.kind === "retain"));
});

test("29. path Retire", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([makePath("old", [production, shipping])], production),
  );
  const next = state(
    focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult([], production),
  );
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.pathTransitions.some((entry) => entry.kind === "retire"));
});

test("30. path Replace or canonical retire+activate policy", () => {
  const midB = Object.freeze({ subjectId: "B", subjectKind: "object" as const });
  const midC = Object.freeze({ subjectId: "C", subjectKind: "object" as const });
  const endD = Object.freeze({ subjectId: "D", subjectKind: "object" as const });
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "a"),
        entry(endD, "context", "contextual", "d"),
      ],
    }),
    pathResult([makePath("abd", [production, midB, endD])], production),
  );
  const next = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "a"),
        entry(endD, "context", "contextual", "d"),
      ],
    }),
    pathResult([makePath("acd", [production, midC, endD])], production),
  );
  const transitions = resolveDirectorRuntimeAttentionPathTransitions(
    previous.pathResult,
    next.pathResult,
  );
  assert.ok(transitions.some((entry) => entry.kind === "replace"));
  assert.equal(policy.pathReplacePolicy, "same-root-and-endpoint-different-structure");
});

test("31. path shift classification", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([makePath("wh-prod-ship", [warehouse, production, shipping], "upstream")], production),
  );
  const next = state(
    focusContext({
      primarySubject: shipping,
      entries: [
        entry(shipping, "primary", "focused", "s"),
        entry(production, "secondary", "supporting", "p"),
        entry(customer, "context", "contextual", "c"),
      ],
    }),
    pathResult([makePath("prod-ship-cust", [production, shipping, customer])], shipping),
  );
  const result = orchestrate(previous, next);
  assert.ok(
    result.plan?.transitionKinds.includes("path-shift") ||
      result.plan?.transitionKinds.includes("path-expansion"),
  );
});

test("32. path expansion classification", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult([], production),
  );
  const next = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([makePath("new", [production, shipping])], production),
  );
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.transitionKinds.includes("path-expansion"));
});

test("33. path reduction classification", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([makePath("old", [production, shipping])], production),
  );
  const next = state(
    focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult([], production),
  );
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.transitionKinds.includes("path-reduction"));
});

test("34. structural path equivalence use", () => {
  const pathA = makePath("id-a", [production, shipping]);
  const pathB = makePath("id-b", [production, shipping]);
  const previous = pathResult([pathA], production);
  const next = pathResult([pathB], production);
  const transitions = resolveDirectorRuntimeAttentionPathTransitions(previous, next);
  assert.deepEqual(transitions.map((entry) => entry.kind), ["retain"]);
});

test("35. root shift handling", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
    pathResult([makePath("from-prod", [production, shipping])], production),
  );
  const next = state(
    focusContext({
      primarySubject: shipping,
      entries: [entry(shipping, "primary", "focused", "s")],
    }),
    pathResult([makePath("from-ship", [shipping, customer])], shipping),
  );
  const result = orchestrate(previous, next);
  assert.equal(result.plan?.focusTransition.kind, "focus-shift");
  assert.equal(result.plan?.focusTransition.nextPrimary?.subjectId, "Shipping");
});

test("36. stable subject transition order", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(shipping, "secondary", "supporting", "s"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [
      entry(shipping, "primary", "focused", "s"),
      entry(production, "secondary", "supporting", "p"),
      entry(customer, "context", "contextual", "c"),
    ],
  }));
  const first = resolveDirectorRuntimeAttentionSubjectTransitions(
    previous.focusContext,
    next.focusContext,
  );
  const second = resolveDirectorRuntimeAttentionSubjectTransitions(
    previous.focusContext,
    next.focusContext,
  );
  assert.deepEqual(
    first.map((entry) => entry.subject.subjectId),
    second.map((entry) => entry.subject.subjectId),
  );
  assert.equal(first[0]?.subject.subjectId, "Production");
  assert.equal(first[1]?.subject.subjectId, "Shipping");
});

test("37. stable path transition order", () => {
  const previous = pathResult([
    makePath("p1", [production, shipping]),
    makePath("p2", [production, customer]),
  ], production);
  const next = pathResult([
    makePath("p1b", [production, shipping]),
    makePath("p3", [production, warehouse]),
  ], production);
  const first = resolveDirectorRuntimeAttentionPathTransitions(previous, next);
  const second = resolveDirectorRuntimeAttentionPathTransitions(previous, next);
  assert.deepEqual(first, second);
});

test("38. deterministic repeated orchestration", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [
      entry(production, "primary", "focused", "p"),
      entry(shipping, "secondary", "supporting", "s"),
    ],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [
      entry(shipping, "primary", "focused", "s"),
      entry(production, "secondary", "supporting", "p"),
      entry(customer, "context", "contextual", "c"),
    ],
  }));
  assert.deepEqual(orchestrate(previous, next), orchestrate(previous, next));
});

test("39. transition plan equivalence", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [entry(shipping, "primary", "focused", "s")],
  }));
  const a = orchestrate(previous, next).plan!;
  const b = orchestrate(previous, next).plan!;
  assert.equal(areDirectorRuntimeAttentionTransitionPlansEquivalent(a, b), true);
});

test("40. valid transition-state validation", () => {
  assert.equal(
    validateDirectorRuntimeAttentionTransitionState(emptyState).ok,
    true,
  );
});

test("41. malformed state rejection", () => {
  assert.equal(
    validateDirectorRuntimeAttentionTransitionState({ focusContext: null }).ok,
    false,
  );
});

test("42. malformed focus transition rejection", () => {
  const focus = resolveDirectorRuntimeFocusTransition(
    emptyState.focusContext,
    focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    }),
  );
  assert.equal(focus.kind, "focus-shift");
  assert.equal(
    validateDirectorRuntimeAttentionTransitionPlan({
      ...noChangePlan,
      focusTransition: { previousPrimary: null, nextPrimary: null, kind: "bad" },
    }).ok,
    false,
  );
});

test("43. malformed subject transition rejection", () => {
  assert.equal(
    validateDirectorRuntimeAttentionSubjectTransition({
      subject: production,
      previousLevel: "primary",
      nextLevel: "secondary",
      previousRole: "focused",
      nextRole: "supporting",
      kind: "not-real",
    }).ok,
    false,
  );
});

test("44. malformed path transition rejection", () => {
  assert.equal(
    validateDirectorRuntimeAttentionTransitionPlan({
      ...noChangePlan,
      transitionKinds: ["path-shift"],
      pathTransitions: [{ previousPathId: "a", nextPathId: "b", kind: "nope" }],
    }).ok,
    false,
  );
});

test("45. contradictory transition rejection", () => {
  assert.equal(
    validateDirectorRuntimeAttentionSubjectTransition({
      subject: production,
      previousLevel: null,
      nextLevel: null,
      previousRole: null,
      nextRole: null,
      kind: "promote",
    }).ok,
    false,
  );
});

test("46. NoChange + other kind rejection", () => {
  assert.equal(
    validateDirectorRuntimeAttentionTransitionPlan({
      ...noChangePlan,
      transitionKinds: ["no-change", "context-expansion"],
    }).ok,
    false,
  );
});

test("47. input previous-state immutability", () => {
  const previous = state(focusContext({
    primarySubject: production,
    entries: [entry(production, "primary", "focused", "p")],
  }));
  const before = JSON.stringify(previous);
  orchestrate(previous, emptyState);
  assert.equal(JSON.stringify(previous), before);
});

test("48. input next-state immutability", () => {
  const next = state(focusContext({
    primarySubject: shipping,
    entries: [entry(shipping, "primary", "focused", "s")],
  }));
  const before = JSON.stringify(next);
  orchestrate(emptyState, next);
  assert.equal(JSON.stringify(next), before);
});

test("49. output immutability", () => {
  const result = orchestrate(
    emptyState,
    state(focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    })),
  );
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.plan), true);
  assert.equal(Object.isFrozen(result.plan!.transitionKinds), true);
});

test("50. no priority resolution", () => {
  assert.equal(policy.performsPriorityResolution, false);
  assert.ok(absentCapabilities.includes("PriorityResolution"));
  // Re-export of upstream APIs is allowed; local algorithm duplication is not.
  assert.doesNotMatch(source, /function resolveDirectorRuntimeAttentionPriority/);
  assert.doesNotMatch(source, /function compareDirectorRuntimeAttentionSignals/);
});

test("51. no focus rebinding", () => {
  assert.equal(policy.rebindsFocusContext, false);
  assert.ok(absentCapabilities.includes("FocusContextBinding"));
  assert.doesNotMatch(source, /function bindDirectorRuntimeFocusContext/);
  assert.doesNotMatch(source, /mapDirectorRuntimeAttentionLevelToFocusRole/);
});

test("52. no path discovery", () => {
  assert.equal(policy.discoversPaths, false);
  assert.ok(absentCapabilities.includes("PathDiscovery"));
  assert.doesNotMatch(source, /function orchestrateDirectorRuntimeAttentionPaths/);
  assert.doesNotMatch(source, /collectDirectedPaths|buildEdges/);
});

test("53. no timing/duration fields", () => {
  assert.equal(policy.includesTiming, false);
  assert.doesNotMatch(source, /\bduration\s*:/);
  assert.doesNotMatch(source, /\bmilliseconds\b/);
  assert.doesNotMatch(source, /\bfps\b/);
  assert.doesNotMatch(source, /\bstiffness\b/);
  assert.doesNotMatch(source, /\bdamping\b/);
  assert.doesNotMatch(source, /\bspring\b/);
});

test("54. no presentation fields", () => {
  const result = orchestrate(
    emptyState,
    state(focusContext({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
    })),
  );
  const serialized = JSON.stringify(result.plan);
  for (const token of ["color", "opacity", "camera", "glow", "arrow", "stroke"]) {
    assert.equal(serialized.includes(`"${token}"`), false);
  }
});

test("55. no scene mutation", () => {
  assert.ok(absentCapabilities.includes("SceneMutation"));
  assert.doesNotMatch(source, /hideNode|selectMesh|setCameraTarget|mutateScene/);
});

test("56. static verification success", () => {
  const verification = verifyDirectorRuntimeAttentionTransitionOrchestration();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "6.6.0");
  assert.equal(verification.frozen, true);
});

test("57. deterministic repeated verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeAttentionTransitionOrchestration(),
    verifyDirectorRuntimeAttentionTransitionOrchestration(),
  );
});

test("58. representative focus shift scenario", () => {
  const previous = state(
    focusContext({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    pathResult([makePath("prod-ship", [production, shipping])], production),
  );
  const next = state(
    focusContext({
      primarySubject: shipping,
      entries: [
        entry(shipping, "primary", "focused", "s"),
        entry(production, "secondary", "supporting", "p"),
        entry(customer, "context", "contextual", "c"),
      ],
    }),
    pathResult(
      [makePath("prod-ship-cust", [production, shipping, customer])],
      shipping,
    ),
  );
  const result = orchestrate(previous, next);
  assert.ok(result.plan?.transitionKinds.includes("focus-shift"));
  assert.ok(result.plan?.transitionKinds.includes("context-expansion"));
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Production" && entry.kind === "demote"),
  );
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Shipping" && entry.kind === "promote"),
  );
  assert.ok(
    result.plan?.subjectTransitions.some((entry) =>
      entry.subject.subjectId === "Customer" && entry.kind === "enter"),
  );
  assert.ok(
    result.plan?.transitionKinds.includes("path-shift") ||
      result.plan?.transitionKinds.includes("path-expansion"),
  );
});
