import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import type {
  DirectorRuntimeFocusContext,
  DirectorRuntimeFocusContextEntry,
} from "./directorRuntimeFocusContextBinding.ts";

import {
  DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE as classificationPrecedence,
  DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS as directions,
  DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS as pathKinds,
  DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT as emptyResult,
  areDirectorRuntimeAttentionPathsEquivalent,
  createDirectorRuntimeAttentionRelationship,
  directorRuntimeAttentionPathOrchestration as layer,
  directorRuntimeAttentionPathOrchestrationCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionPathOrchestrationPolicy as policy,
  directorRuntimeAttentionPathOrchestrationRegistry as registry,
  findDirectorRuntimeAttentionPathsByKind,
  findDirectorRuntimeAttentionPathsContainingSubject,
  isSubjectInDirectorRuntimeAttentionPath,
  orchestrateDirectorRuntimeAttentionPaths,
  resolveDirectorRuntimeDirectAttentionPaths,
  resolveDirectorRuntimeDownstreamAttentionPaths,
  resolveDirectorRuntimeUpstreamAttentionPaths,
  validateDirectorRuntimeAttentionPath,
  validateDirectorRuntimeAttentionPathOrchestrationInput,
  validateDirectorRuntimeAttentionPathOrchestrationResult,
  validateDirectorRuntimeAttentionPathSegment,
  verifyDirectorRuntimeAttentionPathOrchestration,
  type DirectorRuntimeAttentionPathOrchestrationInput,
  type DirectorRuntimeAttentionRelationship,
} from "./directorRuntimeAttentionPathOrchestration.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionPathOrchestration.ts", import.meta.url),
  "utf8",
);

const production = Object.freeze({ subjectId: "Production", subjectKind: "object" as const });
const shipping = Object.freeze({ subjectId: "Shipping", subjectKind: "object" as const });
const customer = Object.freeze({ subjectId: "Customer", subjectKind: "object" as const });
const warehouse = Object.freeze({ subjectId: "Warehouse", subjectKind: "object" as const });
const supplier = Object.freeze({ subjectId: "Supplier", subjectKind: "object" as const });

function entry(
  subject: DirectorRuntimeFocusContextEntry["subject"],
  attentionLevel: DirectorRuntimeFocusContextEntry["attentionLevel"],
  focusRole: DirectorRuntimeFocusContextEntry["focusRole"],
  winningSignalId: string,
): DirectorRuntimeFocusContextEntry {
  return Object.freeze({
    subject: Object.freeze({ ...subject }),
    attentionLevel,
    focusRole,
    sourceAssignmentId: winningSignalId,
    contributingSignalIds: Object.freeze([winningSignalId]),
  });
}

function context(
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

function rel(
  sourceSubject: DirectorRuntimeAttentionRelationship["source"],
  targetSubject: DirectorRuntimeAttentionRelationship["target"],
  kind: DirectorRuntimeAttentionRelationship["kind"] = "direct",
): DirectorRuntimeAttentionRelationship {
  return createDirectorRuntimeAttentionRelationship({
    source: sourceSubject,
    target: targetSubject,
    kind,
  });
}

function input(
  focusContext: DirectorRuntimeFocusContext,
  relationships: readonly DirectorRuntimeAttentionRelationship[],
): DirectorRuntimeAttentionPathOrchestrationInput {
  return Object.freeze({ focusContext, relationships: Object.freeze([...relationships]) });
}

const executiveContext = context({
  primarySubject: production,
  entries: [
    entry(production, "primary", "focused", "sig-prod"),
    entry(shipping, "secondary", "supporting", "sig-ship"),
    entry(customer, "context", "contextual", "sig-cust"),
  ],
});

const executiveRelationships = Object.freeze([
  rel(warehouse, production, "upstream"),
  rel(production, shipping, "downstream"),
  rel(shipping, customer, "downstream"),
]);

test("1. exact identity", () => {
  assert.equal(layer.identity, "DRI-6:5/DirectorRuntimeAttentionPathOrchestration");
  assert.equal(layer.role, "AttentionPathOrchestration");
  assert.equal(layer.status, "AttentionPathOrchestrationReady");
});

test("2. exact version", () => {
  assert.equal(layer.version, "6.5.0");
  assert.equal(canonicalIdentity.version, "6.5.0");
});

test("3. exact namespace", () => {
  assert.equal(
    layer.namespace,
    "nexora.dri.attention-focus.path-orchestration",
  );
});

test("4. sole immediate dependency = DRI-6:4", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:4/DirectorRuntimeFocusContextBinding",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeFocusContextBinding"],
  );
  assert.equal(source.includes("directorRuntimeAttentionPriorityResolution"), false);
  assert.equal(source.includes("directorRuntimeAttentionSignalContracts"), false);
  assert.equal(source.includes("directorRuntimeAttentionFocusFoundation"), false);
});

test("5. canonical path kinds", () => {
  assert.deepEqual([...pathKinds], [
    "direct",
    "dependency",
    "upstream",
    "downstream",
    "supporting",
    "contextual",
  ]);
  assert.equal(registry.pathKindCount, 6);
});

test("6. canonical direction semantics", () => {
  assert.deepEqual([...directions], ["outbound", "inbound", "bidirectional"]);
  assert.equal(registry.directionCount, 3);
});

test("7. path classification precedence", () => {
  assert.deepEqual([...classificationPrecedence], [
    "dependency",
    "supporting",
    "contextual",
    "upstream",
    "downstream",
    "direct",
  ]);
  assert.equal(registry.classificationPrecedenceCount, 6);
});

test("8. path policy immutability", () => {
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(policy.weightedGraph, false);
  assert.equal(policy.inventsRelationships, false);
});

test("9. capability registry", () => {
  assert.ok(capabilities.includes("CycleSafeTraversal"));
  assert.ok(capabilities.includes("PathClassification"));
  assert.deepEqual([...absentCapabilities], [
    "PriorityResolution",
    "FocusContextBinding",
    "TransitionOrchestration",
    "PresentationBehavior",
    "SceneMutation",
  ]);
});

test("10. canonical empty path result", () => {
  assert.deepEqual(emptyResult.paths, []);
  assert.deepEqual(emptyResult.segments, []);
  assert.equal(emptyResult.rootSubject, null);
  assert.equal(Object.isFrozen(emptyResult), true);
});

test("11. empty focus context → no paths", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({ primarySubject: null, entries: [] }),
    [rel(production, shipping)],
  ));
  assert.equal(result.ok, true);
  assert.equal(result.rootSubject, null);
  assert.deepEqual(result.paths, []);
});

test("12. focused subject with no relationships → no paths", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    [],
  ));
  assert.equal(result.ok, true);
  assert.equal(result.rootSubject?.subjectId, "Production");
  assert.deepEqual(result.paths, []);
});

test("13. direct relationship resolution", () => {
  const result = resolveDirectorRuntimeDirectAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.equal(result.ok, true);
  assert.ok(result.paths.every((path) => path.subjects.length === 2));
  assert.ok(
    result.paths.some((path) =>
      path.subjects[1]?.subjectId === "Shipping"),
  );
});

test("14. upstream path resolution", () => {
  const result = resolveDirectorRuntimeUpstreamAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.equal(result.ok, true);
  assert.ok(result.paths.length >= 1);
  assert.ok(
    result.paths.some((path) =>
      path.direction === "inbound" &&
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Warehouse"),
  );
});

test("15. downstream path resolution", () => {
  const result = resolveDirectorRuntimeDownstreamAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.equal(result.ok, true);
  assert.ok(result.paths.every((path) => path.direction === "outbound"));
  assert.ok(
    result.paths.some((path) =>
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping>Customer"),
  );
});

test("16. dependency path resolution", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "secondary", "supporting", "s"),
      ],
    }),
    [rel(production, shipping, "dependency")],
  ));
  assert.ok(result.paths.some((path) => path.kind === "dependency"));
});

test("17. supporting path classification", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const supporting = findDirectorRuntimeAttentionPathsByKind(result, "supporting");
  assert.ok(
    supporting.some((path) =>
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping"),
  );
});

test("18. contextual path classification", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const contextual = findDirectorRuntimeAttentionPathsByKind(result, "contextual");
  assert.ok(
    contextual.some((path) =>
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping>Customer"),
  );
});

test("19. background/peripheral handling", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "p"),
        entry(shipping, "background", "peripheral", "s"),
      ],
    }),
    [rel(production, shipping)],
  ));
  assert.equal(
    result.paths.some((path) => path.subjects.some((entry) =>
      entry.subjectId === "Shipping" && path.subjects[path.subjects.length - 1]!
        .subjectId === "Shipping")),
    false,
  );
});

test("20. suppressed endpoint exclusion", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: production,
      entries: [entry(production, "primary", "focused", "p")],
      suppressedEntries: [entry(shipping, "suppressed", "none", "s")],
    }),
    [rel(production, shipping)],
  ));
  assert.equal(result.paths.length, 0);
});

test("21. suppression traversal blocking", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "a"),
        entry(customer, "context", "contextual", "c"),
      ],
      suppressedEntries: [entry(shipping, "suppressed", "none", "b")],
    }),
    [
      rel(production, shipping),
      rel(shipping, customer),
    ],
  ));
  assert.equal(
    result.paths.some((path) =>
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping>Customer"),
    false,
  );
});

test("22. disconnected subject does not create path", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "a"),
        entry(shipping, "secondary", "supporting", "b"),
      ],
    }),
    [],
  ));
  assert.deepEqual(result.paths, []);
});

test("23. multiple valid paths retained", () => {
  const midB = Object.freeze({ subjectId: "B", subjectKind: "object" as const });
  const midC = Object.freeze({ subjectId: "C", subjectKind: "object" as const });
  const endD = Object.freeze({ subjectId: "D", subjectKind: "object" as const });
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: production,
      entries: [
        entry(production, "primary", "focused", "a"),
        entry(endD, "context", "contextual", "d"),
      ],
    }),
    [
      rel(production, midB),
      rel(midB, endD),
      rel(production, midC),
      rel(midC, endD),
    ],
  ));
  const toD = result.paths.filter((path) =>
    path.subjects[path.subjects.length - 1]?.subjectId === "D" &&
    path.subjects.length === 3);
  assert.equal(toD.length, 2);
});

test("24. simple-path rule", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  for (const path of result.paths) {
    const keys = path.subjects.map((entry) => `${entry.subjectKind}:${entry.subjectId}`);
    assert.equal(new Set(keys).size, keys.length);
  }
});

test("25. cyclic graph safety", () => {
  const a = Object.freeze({ subjectId: "A", subjectKind: "object" as const });
  const b = Object.freeze({ subjectId: "B", subjectKind: "object" as const });
  const c = Object.freeze({ subjectId: "C", subjectKind: "object" as const });
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: a,
      entries: [
        entry(a, "primary", "focused", "a"),
        entry(b, "secondary", "supporting", "b"),
        entry(c, "context", "contextual", "c"),
      ],
    }),
    [rel(a, b), rel(b, c), rel(c, a)],
  ));
  assert.equal(result.ok, true);
  for (const path of result.paths) {
    const keys = path.subjects.map((entry) => entry.subjectId);
    assert.equal(new Set(keys).size, keys.length);
  }
});

test("26. no repeated subject in path", () => {
  const a = Object.freeze({ subjectId: "A", subjectKind: "object" as const });
  const b = Object.freeze({ subjectId: "B", subjectKind: "object" as const });
  const c = Object.freeze({ subjectId: "C", subjectKind: "object" as const });
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    context({
      primarySubject: a,
      entries: [
        entry(a, "primary", "focused", "a"),
        entry(b, "secondary", "supporting", "b"),
        entry(c, "context", "contextual", "c"),
      ],
    }),
    [rel(a, b), rel(b, c), rel(c, a)],
  ));
  assert.ok(result.paths.every((path) =>
    new Set(path.subjects.map((entry) => entry.subjectId)).size ===
      path.subjects.length));
});

test("27. deterministic traversal", () => {
  const payload = input(executiveContext, executiveRelationships);
  assert.deepEqual(
    orchestrateDirectorRuntimeAttentionPaths(payload),
    orchestrateDirectorRuntimeAttentionPaths(payload),
  );
});

test("28. stable path ordering", () => {
  const first = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const second = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.deepEqual(
    first.paths.map((path) => path.pathId),
    second.paths.map((path) => path.pathId),
  );
});

test("29. path deduplication", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    [
      ...executiveRelationships,
      rel(warehouse, production, "upstream"),
    ],
  ));
  const keys = result.paths.map((path) =>
    `${path.kind}|${path.subjects.map((entry) => entry.subjectId).join(">")}`);
  assert.equal(new Set(keys).size, keys.length);
});

test("30. distinct semantic paths preserved", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.ok(
    result.paths.some((path) =>
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping"),
  );
  assert.ok(
    result.paths.some((path) =>
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping>Customer"),
  );
});

test("31. segment integrity", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  for (const path of result.paths) {
    assert.equal(path.segments.length, path.subjects.length - 1);
    assert.equal(path.relationshipRefs.length, path.segments.length);
  }
});

test("32. ordered subject/segment consistency", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  for (const path of result.paths) {
    path.segments.forEach((segment, index) => {
      const left = path.subjects[index]!;
      const right = path.subjects[index + 1]!;
      const matchesForward =
        segment.source.subjectId === left.subjectId &&
        segment.target.subjectId === right.subjectId;
      const matchesReverse =
        segment.source.subjectId === right.subjectId &&
        segment.target.subjectId === left.subjectId;
      assert.equal(matchesForward || matchesReverse, true);
    });
  }
});

test("33. root consistency", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.equal(result.rootSubject?.subjectId, "Production");
  assert.ok(result.paths.every((path) => path.subjects[0]?.subjectId === "Production"));
});

test("34. focus-role preservation", () => {
  const focusContext = executiveContext;
  const before = JSON.stringify(focusContext);
  orchestrateDirectorRuntimeAttentionPaths(input(focusContext, executiveRelationships));
  assert.equal(JSON.stringify(focusContext), before);
  assert.equal(focusContext.entries[0]?.focusRole, "focused");
});

test("35. attention-level preservation", () => {
  assert.equal(executiveContext.entries[1]?.attentionLevel, "secondary");
  orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.equal(executiveContext.entries[1]?.attentionLevel, "secondary");
});

test("36. subject membership lookup", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const path = result.paths.find((entry) =>
    entry.subjects.map((subject) => subject.subjectId).join(">") ===
      "Production>Shipping>Customer")!;
  assert.equal(isSubjectInDirectorRuntimeAttentionPath(path, customer), true);
  assert.equal(isSubjectInDirectorRuntimeAttentionPath(path, supplier), false);
});

test("37. kind + ID subject matching", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const found = findDirectorRuntimeAttentionPathsContainingSubject(result, shipping);
  assert.ok(found.length >= 1);
});

test("38. same ID/different kind mismatch", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const found = findDirectorRuntimeAttentionPathsContainingSubject(result, {
    subjectId: "Production",
    subjectKind: "goal",
  });
  assert.equal(found.length, 0);
});

test("39. path equivalence", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.ok(result.paths.length >= 2);
  const path = result.paths[0]!;
  const other = result.paths[1]!;
  assert.equal(areDirectorRuntimeAttentionPathsEquivalent(path, path), true);
  assert.equal(areDirectorRuntimeAttentionPathsEquivalent(path, other), false);
});

test("40. invalid path rejection", () => {
  const validation = validateDirectorRuntimeAttentionPath({
    pathId: "bad",
    kind: "direct",
    direction: "outbound",
    relevance: "primary",
    subjects: [production],
    relationshipRefs: [],
    segments: [],
  });
  assert.equal(validation.ok, false);
});

test("41. invalid segment rejection", () => {
  const validation = validateDirectorRuntimeAttentionPathSegment({
    source: production,
    target: shipping,
    relationshipKind: "not-a-kind",
  });
  assert.equal(validation.ok, false);
});

test("42. malformed orchestration input rejection", () => {
  const validation = validateDirectorRuntimeAttentionPathOrchestrationInput({
    focusContext: { primarySubject: null, entries: [], suppressedEntries: [] },
    relationships: [{ source: production, target: shipping, kind: "nope" }],
  });
  assert.equal(validation.ok, false);
});

test("43. malformed result rejection", () => {
  const validation = validateDirectorRuntimeAttentionPathOrchestrationResult({
    ok: true,
    rootSubject: production,
    paths: [{ pathId: "", kind: "direct", subjects: [] }],
    segments: [],
  });
  assert.equal(validation.ok, false);
});

test("44. input focus-context immutability", () => {
  const focusContext = executiveContext;
  const before = JSON.stringify(focusContext);
  orchestrateDirectorRuntimeAttentionPaths(input(focusContext, executiveRelationships));
  assert.equal(JSON.stringify(focusContext), before);
});

test("45. input relationship immutability", () => {
  const relationships = [...executiveRelationships];
  const before = JSON.stringify(relationships);
  orchestrateDirectorRuntimeAttentionPaths(input(executiveContext, relationships));
  assert.equal(JSON.stringify(relationships), before);
});

test("46. output immutability", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.paths), true);
  if (result.paths[0]) {
    assert.equal(Object.isFrozen(result.paths[0]), true);
    assert.equal(Object.isFrozen(result.paths[0].subjects), true);
  }
});

test("47. no priority resolution behavior", () => {
  assert.equal(policy.performsPriorityResolution, false);
  assert.ok(absentCapabilities.includes("PriorityResolution"));
  // Re-export of upstream APIs is allowed; local algorithm duplication is not.
  assert.doesNotMatch(source, /function compareDirectorRuntimeAttentionSignals/);
  assert.doesNotMatch(source, /function resolveDirectorRuntimeAttentionPriority/);
});

test("48. no focus-context rebinding", () => {
  assert.equal(policy.rebindsFocusContext, false);
  assert.ok(absentCapabilities.includes("FocusContextBinding"));
  assert.doesNotMatch(source, /function bindDirectorRuntimeFocusContext/);
  assert.doesNotMatch(source, /mapDirectorRuntimeAttentionLevelToFocusRole/);
});

test("49. no transition behavior", () => {
  assert.ok(absentCapabilities.includes("TransitionOrchestration"));
  assert.doesNotMatch(source, /previousPath|nextPath|pathMorph|focusHandoff|transitionPhase/);
});

test("50. no presentation fields", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  const serialized = JSON.stringify(result);
  for (const token of [
    "color", "opacity", "arrowhead", "stroke", "camera", "bezier", "glow",
  ]) {
    assert.equal(serialized.includes(`"${token}"`), false);
  }
  assert.doesNotMatch(source, /\b(Three\.js|SVG|canvas|easing)\b/);
});

test("51. no scene mutation", () => {
  assert.ok(absentCapabilities.includes("SceneMutation"));
  assert.doesNotMatch(source, /hideNode|selectMesh|setCameraTarget|mutateScene/);
});

test("52. static verification success", () => {
  const verification = verifyDirectorRuntimeAttentionPathOrchestration();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "6.5.0");
  assert.equal(verification.frozen, true);
});

test("53. deterministic repeated verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeAttentionPathOrchestration(),
    verifyDirectorRuntimeAttentionPathOrchestration(),
  );
});

test("54. executive scenario classifications", () => {
  const result = orchestrateDirectorRuntimeAttentionPaths(input(
    executiveContext,
    executiveRelationships,
  ));
  assert.ok(
    result.paths.some((path) =>
      path.kind === "upstream" &&
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Warehouse"),
  );
  assert.ok(
    result.paths.some((path) =>
      path.kind === "supporting" &&
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping"),
  );
  assert.ok(
    result.paths.some((path) =>
      path.kind === "contextual" &&
      path.subjects.map((entry) => entry.subjectId).join(">") ===
        "Production>Shipping>Customer"),
  );
});
