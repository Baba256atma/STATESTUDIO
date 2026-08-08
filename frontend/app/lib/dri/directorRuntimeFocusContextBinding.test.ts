import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  resolveDirectorRuntimeAttentionPriority,
  type DirectorRuntimeAttentionResolutionOutcome,
  type DirectorRuntimeResolvedAttentionAssignment,
} from "./directorRuntimeAttentionPriorityResolution.ts";

import {
  DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE as levelToRole,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT as emptyContext,
  DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES as capabilities,
  areDirectorRuntimeAttentionSubjectsEqual,
  areDirectorRuntimeFocusContextsEquivalent,
  bindDirectorRuntimeFocusContext,
  bindDirectorRuntimeFocusContextEntry,
  directorRuntimeFocusContextBinding as layer,
  directorRuntimeFocusContextBindingCanonicalIdentity as canonicalIdentity,
  directorRuntimeFocusContextBindingPolicy as policy,
  directorRuntimeFocusContextBindingRegistry as registry,
  filterDirectorRuntimeFocusContextEntriesByLevel,
  filterDirectorRuntimeFocusContextEntriesByRole,
  findDirectorRuntimeFocusContextEntryBySubject,
  getDirectorRuntimePrimaryFocusEntry,
  mapDirectorRuntimeAttentionLevelToFocusRole,
  validateDirectorRuntimeFocusContext,
  verifyDirectorRuntimeFocusContextBinding,
} from "./directorRuntimeFocusContextBinding.ts";

const source = readFileSync(
  new URL("./directorRuntimeFocusContextBinding.ts", import.meta.url),
  "utf8",
);

const production = Object.freeze({
  subjectId: "Production",
  subjectKind: "object" as const,
});

const shipping = Object.freeze({
  subjectId: "Shipping",
  subjectKind: "object" as const,
});

const warehouse = Object.freeze({
  subjectId: "Warehouse",
  subjectKind: "object" as const,
});

function assignment(
  overrides: Partial<DirectorRuntimeResolvedAttentionAssignment> &
    Pick<DirectorRuntimeResolvedAttentionAssignment, "subject" | "resolvedLevel" | "winningSignalId">,
): DirectorRuntimeResolvedAttentionAssignment {
  return Object.freeze({
    subject: Object.freeze({ ...overrides.subject }),
    resolvedLevel: overrides.resolvedLevel,
    winningSignalId: overrides.winningSignalId,
    contributingSignalIds: Object.freeze(
      [...(overrides.contributingSignalIds ?? [overrides.winningSignalId])],
    ),
  });
}

function outcome(
  partial: Partial<DirectorRuntimeAttentionResolutionOutcome> & {
    readonly assignments: readonly DirectorRuntimeResolvedAttentionAssignment[];
  },
): DirectorRuntimeAttentionResolutionOutcome {
  const primary = partial.primary === undefined
    ? partial.assignments.find((entry) => entry.resolvedLevel === "primary") ?? null
    : partial.primary;
  return Object.freeze({
    primary,
    assignments: Object.freeze([...partial.assignments]),
    winningSignalIds: Object.freeze(
      partial.winningSignalIds ??
        partial.assignments.map((entry) => entry.winningSignalId),
    ),
    retainedSignalIds: Object.freeze(partial.retainedSignalIds ?? []),
    suppressedSignalIds: Object.freeze(partial.suppressedSignalIds ?? []),
    explanations: Object.freeze(partial.explanations ?? []),
  });
}

function bind(resolution: DirectorRuntimeAttentionResolutionOutcome) {
  return bindDirectorRuntimeFocusContext({ resolution });
}

test("1. exact identity", () => {
  assert.equal(layer.identity, "DRI-6:4/DirectorRuntimeFocusContextBinding");
  assert.equal(layer.phase, "DRI-6:4");
  assert.equal(layer.name, "DirectorRuntimeFocusContextBinding");
  assert.equal(layer.role, "FocusContextBinding");
  assert.equal(layer.status, "FocusContextBindingReady");
});

test("2. exact version", () => {
  assert.equal(layer.version, "6.4.0");
  assert.equal(canonicalIdentity.version, "6.4.0");
  assert.equal(registry.version, "6.4.0");
});

test("3. exact namespace", () => {
  assert.equal(
    layer.namespace,
    "nexora.dri.attention-focus.context-binding",
  );
});

test("4. sole immediate dependency = DRI-6:3", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:3/DirectorRuntimeAttentionPriorityResolution",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionPriorityResolution"],
  );
  assert.equal(source.includes("directorRuntimeAttentionSignalContracts"), false);
  assert.equal(source.includes("directorRuntimeAttentionFocusFoundation"), false);
  assert.equal(source.includes("directorRuntimeAdaptivePresentation"), false);
});

test("5. canonical attention-level → focus-role mapping", () => {
  assert.deepEqual({ ...levelToRole }, {
    primary: "focused",
    secondary: "supporting",
    context: "contextual",
    background: "peripheral",
    suppressed: "none",
  });
  assert.equal(registry.levelToRoleMappingCount, 5);
  assert.equal(mapDirectorRuntimeAttentionLevelToFocusRole("primary"), "focused");
});

test("6. binding policy immutability", () => {
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(Object.isFrozen(levelToRole), true);
  assert.equal(policy.performsPriorityResolution, false);
  assert.equal(policy.discoversRelatedSubjects, false);
});

test("7. capability registry", () => {
  assert.deepEqual([...capabilities], [
    "FocusContextBinding",
    "AttentionLevelRoleMapping",
    "PrimarySubjectBinding",
    "SecondarySubjectBinding",
    "ContextualSubjectBinding",
    "PeripheralSubjectBinding",
    "SuppressionBinding",
    "SignalTracePreservation",
    "ContextValidation",
    "SubjectLookup",
  ]);
  assert.deepEqual([...absentCapabilities], [
    "PriorityResolution",
    "ContextDiscovery",
    "PathOrchestration",
    "TransitionOrchestration",
    "PresentationBehavior",
  ]);
});

test("8. empty resolution → empty focus context", () => {
  const result = bind(outcome({ assignments: [] }));
  assert.equal(result.ok, true);
  assert.deepEqual(result.context, emptyContext);
  assert.equal(result.boundSubjectCount, 0);
  assert.equal(result.suppressedSubjectCount, 0);
});

test("9. single primary binding", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "win-ship",
      }),
    ],
  }));
  assert.equal(result.ok, true);
  assert.equal(result.context?.primarySubject?.subjectId, "Shipping");
  assert.equal(result.context?.entries[0]?.focusRole, "focused");
  assert.equal(result.context?.entries[0]?.attentionLevel, "primary");
});

test("10. primary subject identity consistency", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "p1",
      }),
      assignment({
        subject: production,
        resolvedLevel: "secondary",
        winningSignalId: "s1",
      }),
    ],
  }));
  const primary = getDirectorRuntimePrimaryFocusEntry(result.context!);
  assert.ok(primary);
  assert.equal(
    areDirectorRuntimeAttentionSubjectsEqual(
      result.context!.primarySubject!,
      primary.subject,
    ),
    true,
  );
});

test("11. secondary → supporting", () => {
  const entry = bindDirectorRuntimeFocusContextEntry(assignment({
    subject: production,
    resolvedLevel: "secondary",
    winningSignalId: "sec",
  }));
  assert.equal(entry.attentionLevel, "secondary");
  assert.equal(entry.focusRole, "supporting");
});

test("12. context → contextual", () => {
  const entry = bindDirectorRuntimeFocusContextEntry(assignment({
    subject: warehouse,
    resolvedLevel: "context",
    winningSignalId: "ctx",
  }));
  assert.equal(entry.focusRole, "contextual");
});

test("13. background → peripheral", () => {
  const entry = bindDirectorRuntimeFocusContextEntry(assignment({
    subject: warehouse,
    resolvedLevel: "background",
    winningSignalId: "bg",
  }));
  assert.equal(entry.focusRole, "peripheral");
});

test("14. suppressed → none", () => {
  const entry = bindDirectorRuntimeFocusContextEntry(assignment({
    subject: production,
    resolvedLevel: "suppressed",
    winningSignalId: "sup",
  }));
  assert.equal(entry.focusRole, "none");
});

test("15. suppressed entry preservation", () => {
  const result = bind(outcome({
    primary: null,
    assignments: [
      assignment({
        subject: production,
        resolvedLevel: "suppressed",
        winningSignalId: "sup-prod",
      }),
    ],
    suppressedSignalIds: ["sup-prod"],
  }));
  assert.equal(result.ok, true);
  assert.equal(result.context?.entries.length, 0);
  assert.equal(result.context?.suppressedEntries.length, 1);
  assert.equal(result.context?.suppressedEntries[0]?.subject.subjectId, "Production");
  assert.equal(result.suppressedSubjectCount, 1);
});

test("16. one entry per subject", () => {
  const result = bind(outcome({
    primary: null,
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "secondary",
        winningSignalId: "a",
        contributingSignalIds: ["a"],
      }),
      assignment({
        subject: shipping,
        resolvedLevel: "secondary",
        winningSignalId: "a",
        contributingSignalIds: ["b"],
      }),
    ],
  }));
  assert.equal(result.ok, true);
  assert.equal(result.context?.entries.length, 1);
  assert.deepEqual(
    [...result.context!.entries[0]!.contributingSignalIds].sort(),
    ["a", "b"],
  );
});

test("17. same-subject duplicate rejection/normalization behavior", () => {
  const conflicting = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "a",
      }),
      assignment({
        subject: shipping,
        resolvedLevel: "secondary",
        winningSignalId: "b",
      }),
    ],
  }));
  assert.equal(conflicting.ok, false);
  assert.ok(conflicting.issues.some((entry) => entry.code === "duplicate-subject"));
});

test("18. stable entry ordering", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: warehouse,
        resolvedLevel: "background",
        winningSignalId: "bg",
      }),
      assignment({
        subject: production,
        resolvedLevel: "secondary",
        winningSignalId: "sec",
      }),
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "pri",
      }),
      assignment({
        subject: Object.freeze({ subjectId: "GoalA", subjectKind: "goal" as const }),
        resolvedLevel: "context",
        winningSignalId: "ctx",
      }),
    ],
  }));
  assert.deepEqual(
    result.context!.entries.map((entry) => entry.attentionLevel),
    ["primary", "secondary", "context", "background"],
  );
});

test("19. contributing signal IDs preserved", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: production,
        resolvedLevel: "primary",
        winningSignalId: "user-click",
        contributingSignalIds: ["user-click", "advisor-topic", "problem-risk"],
      }),
    ],
  }));
  assert.deepEqual(
    [...result.context!.entries[0]!.contributingSignalIds],
    ["user-click", "advisor-topic", "problem-risk"],
  );
});

test("20. winning signal trace preserved where supported", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "kpi-critical",
        contributingSignalIds: ["kpi-critical", "advisor-note"],
      }),
    ],
  }));
  assert.equal(result.context!.entries[0]!.sourceAssignmentId, "kpi-critical");
});

test("21. deterministic repeated binding", () => {
  const resolution = outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "a",
      }),
      assignment({
        subject: production,
        resolvedLevel: "secondary",
        winningSignalId: "b",
      }),
    ],
  });
  assert.deepEqual(bind(resolution), bind(resolution));
});

test("22. binding idempotence", () => {
  const resolution = outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "idem",
      }),
    ],
  });
  const first = bind(resolution);
  const second = bind(resolution);
  assert.equal(
    areDirectorRuntimeFocusContextsEquivalent(first.context!, second.context!),
    true,
  );
  assert.equal(first.boundSubjectCount, second.boundSubjectCount);
});

test("23. subject lookup by kind + ID", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "s",
      }),
      assignment({
        subject: production,
        resolvedLevel: "secondary",
        winningSignalId: "p",
      }),
    ],
  }));
  const found = findDirectorRuntimeFocusContextEntryBySubject(
    result.context!,
    production,
  );
  assert.equal(found?.sourceAssignmentId, "p");
});

test("24. same ID/different kind does not match", () => {
  const goalProduction = Object.freeze({
    subjectId: "Production",
    subjectKind: "goal" as const,
  });
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: production,
        resolvedLevel: "primary",
        winningSignalId: "obj",
      }),
    ],
  }));
  assert.equal(
    findDirectorRuntimeFocusContextEntryBySubject(result.context!, goalProduction),
    null,
  );
});

test("25. primary lookup", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "pri",
      }),
      assignment({
        subject: production,
        resolvedLevel: "secondary",
        winningSignalId: "sec",
      }),
    ],
  }));
  assert.equal(getDirectorRuntimePrimaryFocusEntry(result.context!)?.subject.subjectId, "Shipping");
});

test("26. role filtering", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "pri",
      }),
      assignment({
        subject: production,
        resolvedLevel: "secondary",
        winningSignalId: "sec",
      }),
      assignment({
        subject: warehouse,
        resolvedLevel: "suppressed",
        winningSignalId: "sup",
      }),
    ],
  }));
  assert.equal(filterDirectorRuntimeFocusContextEntriesByRole(result.context!, "supporting").length, 1);
  assert.equal(filterDirectorRuntimeFocusContextEntriesByRole(result.context!, "none").length, 1);
});

test("27. level filtering", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "pri",
      }),
      assignment({
        subject: warehouse,
        resolvedLevel: "context",
        winningSignalId: "ctx",
      }),
    ],
  }));
  assert.equal(
    filterDirectorRuntimeFocusContextEntriesByLevel(result.context!, "context")[0]
      ?.subject.subjectId,
    "Warehouse",
  );
});

test("28. valid context validation", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "v",
      }),
    ],
  }));
  assert.equal(validateDirectorRuntimeFocusContext(result.context).ok, true);
});

test("29. invalid role-level pair rejection", () => {
  const validation = validateDirectorRuntimeFocusContext({
    primarySubject: shipping,
    entries: [{
      subject: shipping,
      attentionLevel: "primary",
      focusRole: "supporting",
      sourceAssignmentId: "x",
      contributingSignalIds: ["x"],
    }],
    suppressedEntries: [],
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((entry) => entry.code === "inconsistent-role-level"));
});

test("30. two-primary context rejection", () => {
  const validation = validateDirectorRuntimeFocusContext({
    primarySubject: shipping,
    entries: [
      {
        subject: shipping,
        attentionLevel: "primary",
        focusRole: "focused",
        sourceAssignmentId: "a",
        contributingSignalIds: ["a"],
      },
      {
        subject: production,
        attentionLevel: "primary",
        focusRole: "focused",
        sourceAssignmentId: "b",
        contributingSignalIds: ["b"],
      },
    ],
    suppressedEntries: [],
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((entry) => entry.code === "multiple-primary-subjects"));
});

test("31. mismatched primarySubject rejection", () => {
  const validation = validateDirectorRuntimeFocusContext({
    primarySubject: production,
    entries: [{
      subject: shipping,
      attentionLevel: "primary",
      focusRole: "focused",
      sourceAssignmentId: "a",
      contributingSignalIds: ["a"],
    }],
    suppressedEntries: [],
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((entry) => entry.code === "mismatched-primary-subject"));
});

test("32. malformed subject rejection", () => {
  const validation = validateDirectorRuntimeFocusContext({
    primarySubject: null,
    entries: [{
      subject: { subjectId: "", subjectKind: "object" },
      attentionLevel: "secondary",
      focusRole: "supporting",
      sourceAssignmentId: "a",
      contributingSignalIds: ["a"],
    }],
    suppressedEntries: [],
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((entry) => entry.code === "invalid-subject"));
});

test("33. invalid contributing signal trace rejection", () => {
  const validation = validateDirectorRuntimeFocusContext({
    primarySubject: null,
    entries: [{
      subject: production,
      attentionLevel: "secondary",
      focusRole: "supporting",
      sourceAssignmentId: "a",
      contributingSignalIds: [],
    }],
    suppressedEntries: [],
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((entry) => entry.code === "invalid-signal-trace"));
});

test("34. input immutability", () => {
  const resolution = outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "imm",
      }),
    ],
  });
  const before = JSON.stringify(resolution);
  bind(resolution);
  assert.equal(JSON.stringify(resolution), before);
});

test("35. output immutability", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "out",
      }),
    ],
  }));
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.context), true);
  assert.equal(Object.isFrozen(result.context!.entries), true);
  assert.equal(Object.isFrozen(result.context!.entries[0]), true);
  assert.throws(() => {
    (result.context as { primarySubject: unknown }).primarySubject = null;
  });
});

test("36. equivalent-context comparison", () => {
  const resolution = outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "eq",
      }),
    ],
  });
  const a = bind(resolution).context!;
  const b = bind(resolution).context!;
  assert.equal(areDirectorRuntimeFocusContextsEquivalent(a, b), true);
  assert.equal(
    areDirectorRuntimeFocusContextsEquivalent(a, emptyContext),
    false,
  );
});

test("37. no re-resolution behavior", () => {
  assert.equal(policy.performsPriorityResolution, false);
  assert.ok(absentCapabilities.includes("PriorityResolution"));
  // Re-export of DRI-6:3 APIs is allowed; local algorithm duplication is not.
  assert.doesNotMatch(source, /function compareDirectorRuntimeAttentionSignals/);
  assert.doesNotMatch(source, /function deriveDirectorRuntimeAttentionPriorityVector/);
  assert.doesNotMatch(source, /function resolveDirectorRuntimeAttentionPriority/);
});

test("38. no context discovery", () => {
  assert.equal(policy.discoversRelatedSubjects, false);
  assert.ok(absentCapabilities.includes("ContextDiscovery"));
  assert.doesNotMatch(source, /expandFocus|discoverRelated|loadNeighbor/);
});

test("39. no graph traversal", () => {
  assert.ok(absentCapabilities.includes("PathOrchestration"));
  assert.doesNotMatch(source, /findDependencies|findNeighbors|expandFocusGraph|resolveUpstream|resolveDownstream/);
});

test("40. no path creation", () => {
  assert.doesNotMatch(source, /pathId|graphEdge|attentionPath|shortestPath/);
});

test("41. no transition semantics", () => {
  assert.ok(absentCapabilities.includes("TransitionOrchestration"));
  assert.doesNotMatch(source, /previousFocus|nextFocus|transitionPhase|transitionDuration|focusHandoff/);
});

test("42. no presentation fields", () => {
  const result = bind(outcome({
    assignments: [
      assignment({
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "pres",
      }),
    ],
  }));
  const serialized = JSON.stringify(result.context);
  for (const token of [
    "color", "opacity", "camera", "scale", "position", "glow", "material", "geometry",
  ]) {
    assert.equal(serialized.includes(`"${token}"`), false);
  }
  assert.doesNotMatch(source, /\b(Three\.js|CSS|easing)\b/);
});

test("43. no scene mutation", () => {
  assert.doesNotMatch(source, /hideNode|selectMesh|setCameraTarget|mutateScene|sceneGraph/);
});

test("44. verification success", () => {
  const verification = verifyDirectorRuntimeFocusContextBinding();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "6.4.0");
  assert.equal(verification.frozen, true);
});

test("45. deterministic repeated verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeFocusContextBinding(),
    verifyDirectorRuntimeFocusContextBinding(),
  );
});

test("46. end-to-end bind of DRI-6:3 critical override outcome", () => {
  const resolved = resolveDirectorRuntimeAttentionPriority(
    createDirectorRuntimeAttentionSignalBatch({
      signals: [
        createDirectorRuntimeAttentionSignal({
          signalId: "user-prod",
          subject: production,
          source: "user-interaction",
          reason: "explicit-selection",
          scope: "subject",
          requestedLevel: "primary",
          persistence: "transient",
          intent: "request-focus",
        }),
        createDirectorRuntimeAttentionSignal({
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
  );
  assert.equal(resolved.ok, true);
  const bound = bind(resolved.outcome!);
  assert.equal(bound.ok, true);
  assert.equal(bound.context?.primarySubject?.subjectId, "Shipping");
  assert.equal(
    findDirectorRuntimeFocusContextEntryBySubject(bound.context!, production)?.focusRole,
    "supporting",
  );
});
