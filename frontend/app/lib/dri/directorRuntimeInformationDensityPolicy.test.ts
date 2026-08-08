import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  type DirectorRuntimeAttentionEmphasisPolicyResult,
  type DirectorRuntimeAttentionLevel,
} from "./directorRuntimeAttentionEmphasisPolicy.ts";
import {
  resolveDirectorRuntimePresentationState,
  type DirectorRuntimePresentationState,
} from "./directorRuntimePresentationStateResolver.ts";
import {
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES as densities,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE as precedence,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK as densityRank,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS as reasonCodes,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS as signals,
  compareDirectorRuntimeInformationDensities,
  describeDirectorRuntimeInformationDensityTransition,
  directorRuntimeInformationDensityPolicy as layer,
  directorRuntimeInformationDensityPolicyCanonicalIdentity as canonicalIdentity,
  directorRuntimeInformationDensityPolicyRegistry as registry,
  isDirectorRuntimeInformationDensityAtLeast,
  resolveDirectorRuntimeInformationDensities,
  resolveDirectorRuntimeInformationDensity,
  validateDirectorRuntimeInformationDensityPolicyInput,
  verifyDirectorRuntimeInformationDensityPolicy,
  type DirectorRuntimeInformationDensityPolicyInput,
} from "./directorRuntimeInformationDensityPolicy.ts";

const source = readFileSync(
  new URL("./directorRuntimeInformationDensityPolicy.ts", import.meta.url),
  "utf8",
);

const subject = { subjectId: "Inventory", subjectKind: "NexoraObject" };

function attentionPolicy(
  attention: DirectorRuntimeAttentionLevel = "normal",
  state: DirectorRuntimePresentationState = "report",
): DirectorRuntimeAttentionEmphasisPolicyResult {
  const resolvedState = resolveDirectorRuntimePresentationState({
    subject,
    requiresExecutiveReport: state !== "minimum",
    requiresOperation: state === "operation",
    preferredState: state === "minimum" ? "minimum" : undefined,
  });
  return resolveDirectorRuntimeAttentionEmphasisPolicy({
    subject,
    resolvedState,
    signal: attention === "normal"
      ? "baseline"
      : attention === "notice"
      ? "informational"
      : attention === "warning"
      ? "risk"
      : "exception",
    riskPresent: attention === "warning",
    actionRequired: false,
    exceptionPresent: attention === "critical",
    requestedAttention: attention === "notice" || attention === "warning" || attention === "critical"
      ? undefined
      : undefined,
  });
}

function input(
  overrides: Partial<DirectorRuntimeInformationDensityPolicyInput> = {},
): DirectorRuntimeInformationDensityPolicyInput {
  return {
    subject,
    attentionPolicy: attentionPolicy("normal", "report"),
    signal: "baseline",
    inspectionRequired: false,
    analysisRequired: false,
    decisionContextRequired: false,
    operationContextRequired: false,
    ...overrides,
  };
}

test("1. publishes exact DRI-5:5 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: layer.phase,
    name: layer.name,
    identity: layer.identity,
    namespace: layer.namespace,
    version: layer.version,
  }, {
    phase: "DRI-5:5",
    name: "DirectorRuntimeInformationDensityPolicy",
    identity: "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
    namespace: "nexora.dri.adaptive-presentation.information-density-policy",
    version: "5.5.0",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
    version: "5.5.0",
    namespace: "nexora.dri.adaptive-presentation.information-density-policy",
    upstream: "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
  });
  assert.equal(Object.isFrozen(layer), true);
});

test("2. sole immediate dependency is DRI-5:4 Attention & Emphasis Policy", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  assert.equal(layer.attentionPolicyBoundary, "DRI-5:4-attention-emphasis-policy-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionEmphasisPolicy"],
  );
  assert.doesNotMatch(
    source,
    /directorRuntimePresentationStateResolver|directorRuntimePresentationIntent|directorRuntimeAdaptivePresentationFoundation|directorRuntimeInteractionOrchestrationPublicIndex/,
  );
});

test("3. density vocabulary and signals are exact and ordered", () => {
  assert.deepEqual([...densities], ["minimal", "standard", "expanded"]);
  assert.deepEqual([...signals], [
    "baseline", "inspection", "analysis", "decision-context", "operation-context",
    "explicit-director",
  ]);
  assert.deepEqual([...reasonCodes], [
    "operation-context", "decision-context", "analysis", "inspection",
    "explicit-director", "baseline",
  ]);
  assert.deepEqual([...precedence], [...reasonCodes]);
  assert.equal(Object.isFrozen(densities), true);
  assert.equal(Object.isFrozen(signals), true);
});

test("4. baseline resolves to minimal", () => {
  const result = resolveDirectorRuntimeInformationDensity(input());
  assert.deepEqual({
    density: result.density,
    resolvedBy: result.resolvedBy,
    reasonCode: result.reasonCode,
  }, {
    density: "minimal",
    resolvedBy: "baseline",
    reasonCode: "baseline",
  });
  assert.equal(Object.isFrozen(result), true);
});

test("5. inspection floors at standard and cannot be downgraded to minimal", () => {
  const result = resolveDirectorRuntimeInformationDensity(input({
    signal: "inspection",
    inspectionRequired: true,
  }));
  assert.equal(result.density, "standard");
  assert.equal(result.resolvedBy, "inspection");

  const cannotDowngrade = resolveDirectorRuntimeInformationDensity(input({
    inspectionRequired: true,
    requestedDensity: "minimal",
  }));
  assert.equal(cannotDowngrade.density, "standard");
});

test("6. analysis, decision-context, and operation-context floor at expanded", () => {
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({
      signal: "analysis",
      analysisRequired: true,
    })).density,
    "expanded",
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({
      signal: "decision-context",
      decisionContextRequired: true,
    })).density,
    "expanded",
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({
      signal: "operation-context",
      operationContextRequired: true,
    })).density,
    "expanded",
  );
});

test("7. explicit density is preserved when no stronger requirement exists", () => {
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({ requestedDensity: "minimal" })).density,
    "minimal",
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({ requestedDensity: "standard" })).density,
    "standard",
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({
      signal: "explicit-director",
      requestedDensity: "expanded",
    })).density,
    "expanded",
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity(input({
      requestedDensity: "expanded",
    })).resolvedBy,
    "explicit-director",
  );
});

test("8. precedence follows operation > decision > analysis > inspection > explicit > baseline", () => {
  const analysisOverInspection = resolveDirectorRuntimeInformationDensity(input({
    inspectionRequired: true,
    analysisRequired: true,
    requestedDensity: "minimal",
  }));
  assert.equal(analysisOverInspection.density, "expanded");
  assert.equal(analysisOverInspection.resolvedBy, "analysis");

  const elevateInspection = resolveDirectorRuntimeInformationDensity(input({
    inspectionRequired: true,
    requestedDensity: "expanded",
  }));
  assert.equal(elevateInspection.density, "expanded");
  assert.equal(elevateInspection.resolvedBy, "explicit-director");

  const allStrong = resolveDirectorRuntimeInformationDensity(input({
    inspectionRequired: true,
    analysisRequired: true,
    decisionContextRequired: true,
    operationContextRequired: true,
    requestedDensity: "minimal",
  }));
  assert.equal(allStrong.density, "expanded");
  assert.equal(allStrong.resolvedBy, "operation-context");
});

test("9. presentation state does not secretly determine density", () => {
  for (const state of ["minimum", "report", "operation"] as const) {
    const result = resolveDirectorRuntimeInformationDensity(input({
      attentionPolicy: attentionPolicy("normal", state),
    }));
    assert.equal(result.density, "minimal", state);
  }
});

test("10. attention/emphasis do not secretly determine density", () => {
  for (const attention of ["normal", "warning", "critical"] as const) {
    const result = resolveDirectorRuntimeInformationDensity(input({
      attentionPolicy: attentionPolicy(attention, "report"),
      inspectionRequired: false,
      analysisRequired: false,
      decisionContextRequired: false,
      operationContextRequired: false,
    }));
    assert.equal(result.density, "minimal", attention);
  }
});

test("11. density rank and comparison helpers", () => {
  assert.deepEqual(densityRank, { minimal: 0, standard: 1, expanded: 2 });
  assert.ok(compareDirectorRuntimeInformationDensities("minimal", "standard") < 0);
  assert.ok(compareDirectorRuntimeInformationDensities("standard", "expanded") < 0);
  assert.equal(compareDirectorRuntimeInformationDensities("standard", "standard"), 0);
  assert.equal(isDirectorRuntimeInformationDensityAtLeast("expanded", "standard"), true);
  assert.equal(isDirectorRuntimeInformationDensityAtLeast("minimal", "standard"), false);
  assert.equal(Object.isFrozen(densityRank), true);
});

test("12. transition description is semantic only", () => {
  assert.deepEqual(
    describeDirectorRuntimeInformationDensityTransition("minimal", "minimal"),
    { from: "minimal", to: "minimal", changed: false },
  );
  assert.deepEqual(
    describeDirectorRuntimeInformationDensityTransition("minimal", "standard"),
    { from: "minimal", to: "standard", changed: true },
  );
  assert.deepEqual(
    describeDirectorRuntimeInformationDensityTransition("standard", "expanded"),
    { from: "standard", to: "expanded", changed: true },
  );
  assert.deepEqual(
    describeDirectorRuntimeInformationDensityTransition("expanded", "minimal"),
    { from: "expanded", to: "minimal", changed: true },
  );
  const transition = describeDirectorRuntimeInformationDensityTransition("minimal", "standard");
  assert.equal(Object.isFrozen(transition), true);
  assert.doesNotMatch(JSON.stringify(transition), /duration|fade|scale|panel|camera/i);
});

test("13. validation rejects structural defects at runtime boundaries", () => {
  const valid = input({ reasonCode: "scene-inspection" });
  assert.equal(validateDirectorRuntimeInformationDensityPolicyInput(valid).valid, true);

  const checks: readonly [unknown, string][] = [
    [{ ...valid, subject: { subjectId: "", subjectKind: "Object" } }, "invalid-subject-id"],
    [{ ...valid, attentionPolicy: { attention: {} } }, "invalid-attention-policy"],
    [{ ...valid, signal: "viewport" }, "invalid-density-signal"],
    [{ ...valid, requestedDensity: "maximum" }, "invalid-requested-density"],
    [{ ...valid, inspectionRequired: "yes" }, "invalid-inspection-required"],
    [{ ...valid, analysisRequired: 1 }, "invalid-analysis-required"],
    [{ ...valid, decisionContextRequired: "true" }, "invalid-decision-context-required"],
    [{ ...valid, operationContextRequired: null }, "invalid-operation-context-required"],
  ];

  for (const [value, code] of checks) {
    const result = validateDirectorRuntimeInformationDensityPolicyInput(value);
    assert.equal(result.valid, false, code);
    assert.equal(result.issues.some((entry) => entry.code === code), true, code);
    assert.equal(Object.isFrozen(result), true);
  }
});

test("14. batch resolution preserves order and is subject-local", () => {
  const inputs = [
    input({ subject: { subjectId: "A", subjectKind: "Object" } }),
    input({
      subject: { subjectId: "B", subjectKind: "Object" },
      inspectionRequired: true,
      signal: "inspection",
    }),
    input({
      subject: { subjectId: "C", subjectKind: "Object" },
      analysisRequired: true,
      signal: "analysis",
    }),
  ];
  const before = JSON.stringify(inputs);
  const results = resolveDirectorRuntimeInformationDensities(inputs);
  assert.equal(JSON.stringify(inputs), before);
  assert.deepEqual(results.map((entry) => entry.subject.subjectId), ["A", "B", "C"]);
  assert.deepEqual(results.map((entry) => entry.density), ["minimal", "standard", "expanded"]);
  assert.equal(Object.isFrozen(results), true);
});

test("15. immutability of canonical structures and results", () => {
  assert.throws(() => {
    (densities as unknown as string[]).push("maximum");
  }, TypeError);
  assert.throws(() => {
    (signals as unknown as string[])[0] = "mutated";
  }, TypeError);
  assert.throws(() => {
    (densityRank as { minimal: number }).minimal = 9;
  }, TypeError);
  assert.throws(() => {
    (registry as { densityCount: number }).densityCount = 99;
  }, TypeError);

  const result = resolveDirectorRuntimeInformationDensity(input());
  assert.throws(() => {
    (result as { density: string }).density = "expanded";
  }, TypeError);

  const verification = verifyDirectorRuntimeInformationDensityPolicy();
  assert.throws(() => {
    (verification as { ok: boolean }).ok = false;
  }, TypeError);
});

test("16. invariants, registry, and verification", () => {
  assert.equal(invariants.length, 30);
  assert.equal(registry.invariantCount, 30);
  assert.equal(registry.densityCount, 3);
  assert.equal(registry.densitySignalCount, 6);
  assert.equal(registry.densityReasonCount, 6);
  assert.equal(registry.precedenceRuleCount, 6);
  assert.equal(registry.defaultDensity, "minimal");
  assert.equal(registry.inspectionFloor, "standard");
  assert.equal(registry.analysisFloor, "expanded");
  assert.equal(registry.decisionContextFloor, "expanded");
  assert.equal(registry.operationContextFloor, "expanded");
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(registry), true);

  const first = verifyDirectorRuntimeInformationDensityPolicy();
  const second = verifyDirectorRuntimeInformationDensityPolicy();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.deepEqual({
    identity: first.identity,
    version: first.version,
    namespace: first.namespace,
    dependency: first.dependency,
    densityCount: first.densityCount,
    densitySignalCount: first.densitySignalCount,
    densityReasonCount: first.densityReasonCount,
    precedenceRuleCount: first.precedenceRuleCount,
    invariantCount: first.invariantCount,
    frozen: first.frozen,
  }, {
    identity: "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
    version: "5.5.0",
    namespace: "nexora.dri.adaptive-presentation.information-density-policy",
    dependency: "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
    densityCount: 3,
    densitySignalCount: 6,
    densityReasonCount: 6,
    precedenceRuleCount: 6,
    invariantCount: 30,
    frozen: true,
  });
});

test("17. boundary protection — no renderer, orchestration, KPI, or viewport logic", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three|framer-motion)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|WebGL|HTMLElement|Object3D|Mesh|Material)\b/,
  );
  assert.doesNotMatch(source, /\b(?:fontSize|panelWidth|cameraDistance|screenSize|window\.innerWidth)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:orchestratePresentation|presentationPlan|calculateKpi|calculateKoi|selectContentFields)\b/,
  );
  assert.doesNotMatch(source, /\b(?:objectCount\s*[><=]|viewportWidth|deviceType)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:orchestrateDirectorRuntimeAdaptivePresentation|AdaptivePresentationPlatform|directorRuntimeAdaptivePresentationOrchestration)\b/,
  );
  assert.match(source, /ReadyForAdaptivePresentationOrchestration/);
  assert.match(source, /DRI-5:6 orchestration is not implemented/);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID)\b/);
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|fetch)\b/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/components\//);
  assert.doesNotMatch(source, /minimum\s*→\s*minimal|report\s*→\s*standard|operation\s*→\s*expanded/);
  assert.doesNotMatch(source, /critical\s*→\s*expanded|dominant\s*→\s*expanded|urgent\s*→\s*expanded/);
  assert.equal(
    layer.architecturalStatus,
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForAdaptivePresentationOrchestration",
  );
});

test("18. determinism and no input mutation", () => {
  const value = input({
    inspectionRequired: true,
    requestedDensity: "expanded",
    reasonCode: "inspect-detail",
  });
  const before = JSON.stringify(value);
  const one = resolveDirectorRuntimeInformationDensity(value);
  const two = resolveDirectorRuntimeInformationDensity(value);
  assert.equal(JSON.stringify(value), before);
  assert.deepEqual(one, two);
  assert.notEqual(one, two);
  assert.equal(one.density, "expanded");
  assert.equal(one.resolvedBy, "explicit-director");
  assert.equal(one.inputReasonCode, "inspect-detail");
});
