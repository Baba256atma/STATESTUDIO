import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  resolveDirectorRuntimePresentationState,
  type DirectorRuntimePresentationState,
  type DirectorRuntimePresentationStateResolution,
} from "./directorRuntimePresentationStateResolver.ts";
import {
  DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING as attentionEmphasisMapping,
  DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ATTENTION_LEVELS as attentionLevels,
  DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE as precedence,
  DIRECTOR_RUNTIME_ATTENTION_RANK as attentionRank,
  DIRECTOR_RUNTIME_ATTENTION_REASONS as attentionReasons,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS as attentionSignals,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS as emphasisLevels,
  DIRECTOR_RUNTIME_EMPHASIS_RANK as emphasisRank,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  directorRuntimeAttentionEmphasisPolicy as layer,
  directorRuntimeAttentionEmphasisPolicyCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionEmphasisPolicyRegistry as registry,
  isDirectorRuntimeAttentionAtLeast,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  validateDirectorRuntimeAttentionPolicyInput,
  verifyDirectorRuntimeAttentionEmphasisPolicy,
  type DirectorRuntimeAttentionPolicyInput,
} from "./directorRuntimeAttentionEmphasisPolicy.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionEmphasisPolicy.ts", import.meta.url),
  "utf8",
);

const subject = { subjectId: "Inventory", subjectKind: "NexoraObject" };

function resolvedState(
  state: DirectorRuntimePresentationState = "report",
): DirectorRuntimePresentationStateResolution {
  return resolveDirectorRuntimePresentationState({
    subject,
    requiresExecutiveReport: state !== "minimum",
    requiresOperation: state === "operation",
    preferredState: state === "minimum" ? "minimum" : undefined,
  });
}

function input(
  overrides: Partial<DirectorRuntimeAttentionPolicyInput> = {},
): DirectorRuntimeAttentionPolicyInput {
  return {
    subject,
    resolvedState: resolvedState("report"),
    signal: "baseline",
    riskPresent: false,
    actionRequired: false,
    exceptionPresent: false,
    ...overrides,
  };
}

test("1. publishes exact DRI-5:4 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: layer.phase,
    name: layer.name,
    identity: layer.identity,
    namespace: layer.namespace,
    version: layer.version,
  }, {
    phase: "DRI-5:4",
    name: "DirectorRuntimeAttentionEmphasisPolicy",
    identity: "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
    namespace: "nexora.dri.adaptive-presentation.attention-emphasis-policy",
    version: "5.4.0",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
    version: "5.4.0",
    namespace: "nexora.dri.adaptive-presentation.attention-emphasis-policy",
    upstream: "DRI-5:3/DirectorRuntimePresentationStateResolver",
  });
  assert.equal(Object.isFrozen(layer), true);
});

test("2. sole immediate dependency is DRI-5:3 State Resolver", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-5:3/DirectorRuntimePresentationStateResolver",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  assert.equal(layer.stateResolverBoundary, "DRI-5:3-state-resolver-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimePresentationStateResolver"],
  );
  assert.doesNotMatch(source, /directorRuntimePresentationIntent[^S]|directorRuntimeAdaptivePresentationFoundation|directorRuntimeInteractionOrchestrationPublicIndex/);
});

test("3. emphasis vocabulary and attention signals are exact and ordered", () => {
  assert.deepEqual([...emphasisLevels], ["none", "subtle", "prominent", "dominant"]);
  assert.deepEqual([...attentionSignals], [
    "baseline", "informational", "risk", "action-required", "exception", "explicit-director",
  ]);
  assert.deepEqual([...attentionReasons], [
    "exception", "action-required", "risk", "explicit-director", "informational", "baseline",
  ]);
  assert.deepEqual([...precedence], [...attentionReasons]);
  assert.deepEqual([...attentionLevels], ["normal", "notice", "warning", "critical"]);
  assert.equal(Object.isFrozen(emphasisLevels), true);
  assert.equal(Object.isFrozen(attentionSignals), true);
});

test("4. baseline resolves to normal / none emphasis", () => {
  const result = resolveDirectorRuntimeAttentionEmphasisPolicy(input({
    signal: "baseline",
  }));
  assert.equal(result.attention.attention, "normal");
  assert.equal(result.attention.resolvedBy, "baseline");
  assert.equal(result.attention.reasonCode, "baseline");
  assert.equal(result.emphasis.emphasis, "none");
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.attention), true);
  assert.equal(Object.isFrozen(result.emphasis), true);
});

test("5. informational resolves to notice / subtle", () => {
  const result = resolveDirectorRuntimeAttentionEmphasisPolicy(input({
    signal: "informational",
  }));
  assert.equal(result.attention.attention, "notice");
  assert.equal(result.attention.resolvedBy, "informational");
  assert.equal(result.emphasis.emphasis, "subtle");
});

test("6. riskPresent floors at warning and preserves stronger critical request", () => {
  const warning = resolveDirectorRuntimeAttention(input({
    signal: "risk",
    riskPresent: true,
  }));
  assert.equal(warning.attention, "warning");
  assert.equal(warning.resolvedBy, "risk");
  assert.equal(resolveDirectorRuntimeEmphasis(warning).emphasis, "prominent");

  const cannotDowngrade = resolveDirectorRuntimeAttention(input({
    riskPresent: true,
    requestedAttention: "normal",
  }));
  assert.equal(cannotDowngrade.attention, "warning");

  const elevate = resolveDirectorRuntimeAttention(input({
    riskPresent: true,
    requestedAttention: "critical",
  }));
  assert.equal(elevate.attention, "critical");
  assert.equal(elevate.resolvedBy, "explicit-director");
});

test("7. actionRequired floors at warning without forcing critical", () => {
  const result = resolveDirectorRuntimeAttention(input({
    signal: "action-required",
    actionRequired: true,
  }));
  assert.equal(result.attention, "warning");
  assert.equal(result.resolvedBy, "action-required");
  assert.notEqual(result.attention, "critical");
});

test("8. exceptionPresent forces critical / dominant over weaker requests", () => {
  const result = resolveDirectorRuntimeAttentionEmphasisPolicy(input({
    signal: "exception",
    exceptionPresent: true,
    riskPresent: true,
    actionRequired: true,
    requestedAttention: "normal",
  }));
  assert.equal(result.attention.attention, "critical");
  assert.equal(result.attention.resolvedBy, "exception");
  assert.equal(result.emphasis.emphasis, "dominant");
});

test("9. explicit attention is preserved when no stronger requirement exists", () => {
  assert.equal(
    resolveDirectorRuntimeAttention(input({ requestedAttention: "notice" })).attention,
    "notice",
  );
  assert.equal(
    resolveDirectorRuntimeAttention(input({ requestedAttention: "warning" })).attention,
    "warning",
  );
  assert.equal(
    resolveDirectorRuntimeAttention(input({ requestedAttention: "critical" })).attention,
    "critical",
  );
  assert.equal(
    resolveDirectorRuntimeAttention(input({ requestedAttention: "critical" })).resolvedBy,
    "explicit-director",
  );
});

test("10. presentation state does not secretly determine attention", () => {
  for (const state of ["minimum", "report", "operation"] as const) {
    const result = resolveDirectorRuntimeAttention(input({
      resolvedState: resolvedState(state),
      signal: "baseline",
      riskPresent: false,
      actionRequired: false,
      exceptionPresent: false,
    }));
    assert.equal(result.attention, "normal", state);
  }
});

test("11. attention and emphasis ranks are exact", () => {
  assert.deepEqual(attentionRank, { normal: 0, notice: 1, warning: 2, critical: 3 });
  assert.deepEqual(emphasisRank, { none: 0, subtle: 1, prominent: 2, dominant: 3 });
  assert.ok(compareDirectorRuntimeAttentionLevels("normal", "notice") < 0);
  assert.ok(compareDirectorRuntimeAttentionLevels("notice", "warning") < 0);
  assert.ok(compareDirectorRuntimeAttentionLevels("warning", "critical") < 0);
  assert.equal(compareDirectorRuntimeAttentionLevels("warning", "warning"), 0);
  assert.equal(isDirectorRuntimeAttentionAtLeast("critical", "warning"), true);
  assert.equal(isDirectorRuntimeAttentionAtLeast("notice", "warning"), false);
  assert.ok(compareDirectorRuntimeEmphasisLevels("none", "subtle") < 0);
  assert.ok(compareDirectorRuntimeEmphasisLevels("subtle", "prominent") < 0);
  assert.ok(compareDirectorRuntimeEmphasisLevels("prominent", "dominant") < 0);
});

test("12. canonical attention → emphasis mapping is exact", () => {
  assert.deepEqual(attentionEmphasisMapping, {
    normal: "none",
    notice: "subtle",
    warning: "prominent",
    critical: "dominant",
  });
  for (const attention of attentionLevels) {
    assert.equal(
      resolveDirectorRuntimeEmphasis(attention).emphasis,
      attentionEmphasisMapping[attention],
    );
  }
});

test("13. validation rejects structural defects at runtime boundaries", () => {
  const valid = input({ reasonCode: "scene-focus" });
  assert.equal(validateDirectorRuntimeAttentionPolicyInput(valid).valid, true);

  const checks: readonly [unknown, string][] = [
    [{ ...valid, subject: { subjectId: "", subjectKind: "Object" } }, "invalid-subject-id"],
    [{ ...valid, subject: { subjectId: "x", subjectKind: "" } }, "invalid-subject-kind"],
    [{ ...valid, resolvedState: { state: "report" } }, "invalid-resolved-state"],
    [{ ...valid, signal: "glowing" }, "invalid-attention-signal"],
    [{ ...valid, requestedAttention: "red" }, "invalid-requested-attention"],
    [{ ...valid, riskPresent: "yes" }, "invalid-risk-present"],
    [{ ...valid, actionRequired: 1 }, "invalid-action-required"],
    [{ ...valid, exceptionPresent: "true" }, "invalid-exception-present"],
  ];

  for (const [value, code] of checks) {
    const result = validateDirectorRuntimeAttentionPolicyInput(value);
    assert.equal(result.valid, false, code);
    assert.equal(result.issues.some((entry) => entry.code === code), true, code);
    assert.equal(Object.isFrozen(result), true);
  }
});

test("14. batch evaluation preserves order and is subject-local", () => {
  const inputs = [
    input({
      subject: { subjectId: "A", subjectKind: "Object" },
      signal: "baseline",
    }),
    input({
      subject: { subjectId: "B", subjectKind: "Object" },
      riskPresent: true,
      signal: "risk",
    }),
    input({
      subject: { subjectId: "C", subjectKind: "Object" },
      exceptionPresent: true,
      signal: "exception",
    }),
  ];
  const before = JSON.stringify(inputs);
  const results = resolveDirectorRuntimeAttentionEmphasisPolicies(inputs);
  assert.equal(JSON.stringify(inputs), before);
  assert.deepEqual(
    results.map((entry) => entry.attention.subject.subjectId),
    ["A", "B", "C"],
  );
  assert.deepEqual(
    results.map((entry) => entry.attention.attention),
    ["normal", "warning", "critical"],
  );
  assert.equal(Object.isFrozen(results), true);
});

test("15. immutability of canonical structures and results", () => {
  assert.throws(() => {
    (emphasisLevels as unknown as string[]).push("extreme");
  }, TypeError);
  assert.throws(() => {
    (attentionSignals as unknown as string[])[0] = "mutated";
  }, TypeError);
  assert.throws(() => {
    (attentionRank as { normal: number }).normal = 9;
  }, TypeError);
  assert.throws(() => {
    (attentionEmphasisMapping as { normal: string }).normal = "dominant";
  }, TypeError);
  assert.throws(() => {
    (registry as { attentionLevelCount: number }).attentionLevelCount = 99;
  }, TypeError);

  const result = resolveDirectorRuntimeAttentionEmphasisPolicy(input());
  assert.throws(() => {
    (result.attention as { attention: string }).attention = "critical";
  }, TypeError);

  const verification = verifyDirectorRuntimeAttentionEmphasisPolicy();
  assert.throws(() => {
    (verification as { ok: boolean }).ok = false;
  }, TypeError);
});

test("16. invariants, registry, and verification", () => {
  assert.equal(invariants.length, 30);
  assert.equal(registry.invariantCount, 30);
  assert.equal(registry.attentionLevelCount, 4);
  assert.equal(registry.attentionSignalCount, 6);
  assert.equal(registry.attentionReasonCount, 6);
  assert.equal(registry.emphasisLevelCount, 4);
  assert.equal(registry.precedenceRuleCount, 6);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(registry), true);

  const first = verifyDirectorRuntimeAttentionEmphasisPolicy();
  const second = verifyDirectorRuntimeAttentionEmphasisPolicy();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.deepEqual({
    identity: first.identity,
    version: first.version,
    namespace: first.namespace,
    dependency: first.dependency,
    attentionLevelCount: first.attentionLevelCount,
    attentionSignalCount: first.attentionSignalCount,
    attentionReasonCount: first.attentionReasonCount,
    emphasisLevelCount: first.emphasisLevelCount,
    precedenceRuleCount: first.precedenceRuleCount,
    invariantCount: first.invariantCount,
    frozen: first.frozen,
  }, {
    identity: "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
    version: "5.4.0",
    namespace: "nexora.dri.adaptive-presentation.attention-emphasis-policy",
    dependency: "DRI-5:3/DirectorRuntimePresentationStateResolver",
    attentionLevelCount: 4,
    attentionSignalCount: 6,
    attentionReasonCount: 6,
    emphasisLevelCount: 4,
    precedenceRuleCount: 6,
    invariantCount: 30,
    frozen: true,
  });
});

test("17. boundary protection — no renderer, density, orchestration, or risk engines", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three|framer-motion)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|WebGL|HTMLElement|Object3D|Mesh|Material)\b/,
  );
  assert.doesNotMatch(source, /\b(?:green|yellow|red|orange|glow|pulse|blink|opacity|zIndex|z-index)\b/i);
  assert.doesNotMatch(
    source,
    /\b(?:resolveDensity|densityPolicy|orchestratePresentation|presentationPlan|kpiThreshold|riskEngine)\b/,
  );
  assert.doesNotMatch(
    source,
    /DRI-5:[5-9]|InformationDensityPolicy|AdaptivePresentationOrchestration|AdaptivePresentationPlatform/,
  );
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID)\b/);
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|fetch)\b/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/components\//);
  assert.doesNotMatch(source, /minimum\s*→\s*normal|report\s*→\s*warning|operation\s*→\s*critical/);
  assert.doesNotMatch(source, /critical\s*→\s*expanded|urgent\s*→\s*critical/);
  assert.equal(
    layer.architecturalStatus,
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForDensityPolicy",
  );
});

test("18. determinism and no input mutation", () => {
  const value = input({
    riskPresent: true,
    signal: "risk",
    requestedAttention: "critical",
    reasonCode: "runtime-risk",
  });
  const before = JSON.stringify(value);
  const one = resolveDirectorRuntimeAttentionEmphasisPolicy(value);
  const two = resolveDirectorRuntimeAttentionEmphasisPolicy(value);
  assert.equal(JSON.stringify(value), before);
  assert.deepEqual(one, two);
  assert.notEqual(one, two);
  assert.equal(one.attention.attention, "critical");
  assert.equal(one.emphasis.emphasis, "dominant");
  assert.equal(one.attention.inputReasonCode, "runtime-risk");
});
