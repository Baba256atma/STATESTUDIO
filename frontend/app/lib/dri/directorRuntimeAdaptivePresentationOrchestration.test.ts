import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  resolveDirectorRuntimeAttentionEmphasisPolicy,
} from "./directorRuntimeAttentionEmphasisPolicy.ts";
import {
  createDirectorRuntimePresentationIntent,
  type DirectorRuntimePresentationIntent,
} from "./directorRuntimePresentationIntent.ts";
import {
  resolveDirectorRuntimePresentationState,
} from "./directorRuntimePresentationStateResolver.ts";
import {
  resolveDirectorRuntimeInformationDensity,
} from "./directorRuntimeInformationDensityPolicy.ts";
import {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES as modes,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS as changeDimensions,
  areDirectorRuntimeAdaptivePresentationPlansEqual,
  assessDirectorRuntimeAdaptivePresentationCompatibility,
  compareDirectorRuntimeAdaptivePresentationPlans,
  createDirectorRuntimeAdaptivePresentationPlanSnapshot,
  deriveDirectorRuntimeAdaptivePresentationPlanId,
  directorRuntimeAdaptivePresentationOrchestration as layer,
  directorRuntimeAdaptivePresentationOrchestrationCanonicalIdentity as canonicalIdentity,
  directorRuntimeAdaptivePresentationOrchestrationRegistry as registry,
  findDirectorRuntimeAdaptivePresentationPlanById,
  findDirectorRuntimeAdaptivePresentationPlansBySubjectId,
  orchestrateDirectorRuntimeAdaptivePresentation,
  orchestrateDirectorRuntimeAdaptivePresentations,
  validateDirectorRuntimeAdaptivePresentationOrchestrationInput,
  validateDirectorRuntimeAdaptivePresentationPlanCollection,
  verifyDirectorRuntimeAdaptivePresentationOrchestration,
  type DirectorRuntimeAdaptivePresentationOrchestrationInput,
  type DirectorRuntimeAdaptivePresentationPlan,
} from "./directorRuntimeAdaptivePresentationOrchestration.ts";

const source = readFileSync(
  new URL("./directorRuntimeAdaptivePresentationOrchestration.ts", import.meta.url),
  "utf8",
);

function buildInput(options: {
  readonly subjectId?: string;
  readonly state?: "minimum" | "report" | "operation";
  readonly attention?: "normal" | "notice" | "warning" | "critical";
  readonly density?: "minimal" | "standard" | "expanded";
  readonly priority?: "low" | "normal" | "high" | "urgent";
  readonly visibility?: "visible" | "hidden" | "collapsed";
  readonly interactionExposure?: "none" | "inspect" | "select" | "operate";
  readonly intentId?: string;
  readonly mismatchStateSubject?: boolean;
}): DirectorRuntimeAdaptivePresentationOrchestrationInput {
  const subject = {
    subjectId: options.subjectId ?? "Inventory",
    subjectKind: "NexoraObject",
  };
  const state = options.state ?? "report";
  const attention = options.attention ?? "warning";
  const density = options.density ?? "standard";
  const priority = options.priority ?? "high";
  const visibility = options.visibility ?? "visible";
  const interactionExposure = options.interactionExposure ?? "inspect";

  const intent = createDirectorRuntimePresentationIntent({
    intentId: options.intentId ?? "intent-inventory-1",
    subject,
    state,
    attention,
    density,
    priority,
    visibility,
    interactionExposure,
    source: "scene",
    reason: { code: "risk-attention", source: "scene", detail: "Inventory risk elevated." },
    context: { contextId: "scene-1", contextKind: "scene" },
  });

  const stateResolution = resolveDirectorRuntimePresentationState({
    subject: options.mismatchStateSubject
      ? { subjectId: "Production", subjectKind: "NexoraObject" }
      : subject,
    requiresExecutiveReport: state !== "minimum",
    requiresOperation: state === "operation",
    preferredState: state === "minimum" ? "minimum" : undefined,
  });

  const attentionEmphasis = resolveDirectorRuntimeAttentionEmphasisPolicy({
    subject,
    resolvedState: resolveDirectorRuntimePresentationState({
      subject,
      requiresExecutiveReport: state !== "minimum",
      requiresOperation: state === "operation",
      preferredState: state === "minimum" ? "minimum" : undefined,
    }),
    signal: attention === "critical"
      ? "exception"
      : attention === "warning"
      ? "risk"
      : attention === "notice"
      ? "informational"
      : "baseline",
    riskPresent: attention === "warning",
    actionRequired: false,
    exceptionPresent: attention === "critical",
    requestedAttention: attention === "normal" || attention === "notice"
      ? attention
      : undefined,
  });

  const densityResolution = resolveDirectorRuntimeInformationDensity({
    subject,
    attentionPolicy: attentionEmphasis,
    signal: density === "expanded"
      ? "analysis"
      : density === "standard"
      ? "inspection"
      : "baseline",
    inspectionRequired: density === "standard",
    analysisRequired: density === "expanded",
    decisionContextRequired: false,
    operationContextRequired: false,
    requestedDensity: density === "minimal" ? "minimal" : undefined,
  });

  return {
    intent,
    stateResolution,
    attentionEmphasis,
    densityResolution,
  };
}

function requirePlan(
  input: DirectorRuntimeAdaptivePresentationOrchestrationInput,
): DirectorRuntimeAdaptivePresentationPlan {
  const result = orchestrateDirectorRuntimeAdaptivePresentation(input);
  assert.equal(result.ok, true);
  assert.ok(result.plan);
  return result.plan!;
}

test("1. publishes exact DRI-5:6 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: layer.phase,
    name: layer.name,
    identity: layer.identity,
    namespace: layer.namespace,
    version: layer.version,
  }, {
    phase: "DRI-5:6",
    name: "DirectorRuntimeAdaptivePresentationOrchestration",
    identity: "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
    namespace: "nexora.dri.adaptive-presentation.orchestration",
    version: "5.6.0",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
    version: "5.6.0",
    namespace: "nexora.dri.adaptive-presentation.orchestration",
    upstream: "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
  });
  assert.equal(Object.isFrozen(layer), true);
});

test("2. sole immediate dependency is DRI-5:5 Information Density Policy", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  assert.equal(layer.densityPolicyBoundary, "DRI-5:5-information-density-policy-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeInformationDensityPolicy"],
  );
  assert.doesNotMatch(
    source,
    /directorRuntimeAttentionEmphasisPolicy|directorRuntimePresentationStateResolver|directorRuntimePresentationIntent|directorRuntimeAdaptivePresentationFoundation|directorRuntimeInteractionOrchestrationPublicIndex/,
  );
});

test("3. orchestration modes are exactly single, batch", () => {
  assert.deepEqual([...modes], ["single", "batch"]);
  assert.deepEqual([...changeDimensions], [
    "subject", "state", "attention", "emphasis", "density", "priority",
    "visibility", "interactionExposure", "source", "reason", "context",
  ]);
  assert.equal(Object.isFrozen(modes), true);
  assert.equal(Object.isFrozen(changeDimensions), true);
});

test("4. normal composition preserves report/warning/prominent/standard plan", () => {
  const plan = requirePlan(buildInput({
    state: "report",
    attention: "warning",
    density: "standard",
    priority: "high",
    visibility: "visible",
    interactionExposure: "inspect",
  }));
  assert.deepEqual({
    state: plan.state,
    attention: plan.attention,
    emphasis: plan.emphasis,
    density: plan.density,
    priority: plan.priority,
    visibility: plan.visibility,
    interactionExposure: plan.interactionExposure,
  }, {
    state: "report",
    attention: "warning",
    emphasis: "prominent",
    density: "standard",
    priority: "high",
    visibility: "visible",
    interactionExposure: "inspect",
  });
  assert.equal(Object.isFrozen(plan), true);
});

test("5. unusual combination is preserved without hidden policy rewrite", () => {
  const plan = requirePlan(buildInput({
    state: "minimum",
    attention: "critical",
    density: "expanded",
    priority: "low",
    visibility: "collapsed",
    interactionExposure: "none",
  }));
  assert.deepEqual({
    state: plan.state,
    attention: plan.attention,
    emphasis: plan.emphasis,
    density: plan.density,
    priority: plan.priority,
    visibility: plan.visibility,
    interactionExposure: plan.interactionExposure,
  }, {
    state: "minimum",
    attention: "critical",
    emphasis: "dominant",
    density: "expanded",
    priority: "low",
    visibility: "collapsed",
    interactionExposure: "none",
  });
});

test("6. plan identity is deterministic and content-sensitive", () => {
  const input = buildInput({ intentId: "stable-1" });
  const one = requirePlan(input);
  const two = requirePlan(input);
  assert.equal(one.planId, two.planId);
  assert.equal(
    one.planId,
    deriveDirectorRuntimeAdaptivePresentationPlanId({
      intentId: one.intentId,
      subject: one.subject,
      state: one.state,
      attention: one.attention,
      emphasis: one.emphasis,
      density: one.density,
      priority: one.priority,
      visibility: one.visibility,
      interactionExposure: one.interactionExposure,
    }),
  );
  const different = requirePlan(buildInput({ intentId: "stable-1", state: "operation" }));
  assert.notEqual(one.planId, different.planId);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID)\b/);
});

test("7. provenance is preserved from intent", () => {
  const plan = requirePlan(buildInput({ intentId: "prov-1" }));
  assert.equal(plan.intentId, "prov-1");
  assert.equal(plan.subject.subjectId, "Inventory");
  assert.equal(plan.source, "scene");
  assert.deepEqual(plan.reason, {
    code: "risk-attention",
    source: "scene",
    detail: "Inventory risk elevated.",
  });
  assert.deepEqual(plan.context, { contextId: "scene-1", contextKind: "scene" });
  assert.equal(Object.isFrozen(plan.reason), true);
  assert.equal(Object.isFrozen(plan.context), true);
});

test("8. subject mismatch is structurally incompatible", () => {
  const input = buildInput({ mismatchStateSubject: true });
  const compatibility = assessDirectorRuntimeAdaptivePresentationCompatibility(input);
  assert.equal(compatibility.compatible, false);
  assert.equal(
    compatibility.issues.some((entry) => entry.code === "subject-mismatch"),
    true,
  );
  const result = orchestrateDirectorRuntimeAdaptivePresentation(input);
  assert.equal(result.ok, false);
  assert.equal(result.plan, undefined);
  assert.equal(result.issues.some((entry) => entry.code === "subject-mismatch"), true);
});

test("9. no re-resolution of state, attention, emphasis, or density", () => {
  const input = buildInput({
    state: "minimum",
    attention: "critical",
    density: "expanded",
  });
  const plan = requirePlan(input);
  assert.equal(plan.state, input.stateResolution.state);
  assert.equal(plan.attention, input.attentionEmphasis.attention.attention);
  assert.equal(plan.emphasis, input.attentionEmphasis.emphasis.emphasis);
  assert.equal(plan.density, input.densityResolution.density);
  assert.doesNotMatch(source, /\b(?:requiresOperation|riskPresent|analysisRequired)\b/);
});

test("10. priority, visibility, and interaction exposure pass through unchanged", () => {
  for (const priority of ["low", "normal", "high", "urgent"] as const) {
    assert.equal(requirePlan(buildInput({ priority })).priority, priority);
  }
  for (const visibility of ["visible", "hidden", "collapsed"] as const) {
    assert.equal(requirePlan(buildInput({ visibility })).visibility, visibility);
  }
  for (const interactionExposure of ["none", "inspect", "select", "operate"] as const) {
    assert.equal(
      requirePlan(buildInput({ interactionExposure })).interactionExposure,
      interactionExposure,
    );
  }
});

test("11. semantic equality and comparison report exact changed dimensions", () => {
  const base = requirePlan(buildInput({
    attention: "normal",
    density: "minimal",
    intentId: "cmp-1",
  }));
  const same = requirePlan(buildInput({
    attention: "normal",
    density: "minimal",
    intentId: "cmp-1",
  }));
  assert.notEqual(base, same);
  assert.equal(areDirectorRuntimeAdaptivePresentationPlansEqual(base, same), true);

  const next = requirePlan(buildInput({
    attention: "warning",
    density: "standard",
    intentId: "cmp-1",
  }));
  assert.equal(areDirectorRuntimeAdaptivePresentationPlansEqual(base, next), false);
  const comparison = compareDirectorRuntimeAdaptivePresentationPlans(base, next);
  assert.equal(comparison.changed, true);
  assert.deepEqual([...comparison.changedDimensions], ["attention", "emphasis", "density"]);
  assert.equal(Object.isFrozen(comparison), true);
  assert.doesNotMatch(JSON.stringify(comparison), /yellow|glow|scale|camera/i);
});

test("12. batch orchestration preserves order and is subject-local", () => {
  const inputs = [
    buildInput({ subjectId: "A", intentId: "a", state: "minimum", attention: "normal", density: "minimal" }),
    buildInput({ subjectId: "B", intentId: "b", state: "report", attention: "warning", density: "standard" }),
    buildInput({ subjectId: "C", intentId: "c", state: "operation", attention: "critical", density: "expanded" }),
  ];
  const before = JSON.stringify(inputs);
  const results = orchestrateDirectorRuntimeAdaptivePresentations(inputs);
  assert.equal(JSON.stringify(inputs), before);
  assert.deepEqual(results.map((entry) => entry.plan?.subject.subjectId), ["A", "B", "C"]);
  assert.deepEqual(results.map((entry) => entry.plan?.state), ["minimum", "report", "operation"]);
  assert.equal(Object.isFrozen(results), true);
  assert.ok(results.every((entry) => entry.ok && Object.isFrozen(entry)));
});

test("13. duplicate plan IDs are detectable and not silently merged", () => {
  const plan = requirePlan(buildInput({ intentId: "dup-1" }));
  const validation = validateDirectorRuntimeAdaptivePresentationPlanCollection([plan, plan]);
  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate-plan-id"), true);
  assert.throws(() => createDirectorRuntimeAdaptivePresentationPlanSnapshot([plan, plan]), TypeError);

  const snapshot = createDirectorRuntimeAdaptivePresentationPlanSnapshot([
    requirePlan(buildInput({ intentId: "s1", subjectId: "A" })),
    requirePlan(buildInput({ intentId: "s2", subjectId: "B" })),
  ]);
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.plans), true);
  assert.equal(findDirectorRuntimeAdaptivePresentationPlanById(snapshot.plans, snapshot.plans[0]!.planId), snapshot.plans[0]);
  assert.deepEqual(
    findDirectorRuntimeAdaptivePresentationPlansBySubjectId(snapshot.plans, "A")
      .map((entry) => entry.subject.subjectId),
    ["A"],
  );
});

test("14. validation rejects structural defects at runtime boundaries", () => {
  const valid = buildInput({});
  assert.equal(validateDirectorRuntimeAdaptivePresentationOrchestrationInput(valid).valid, true);

  const checks: readonly [unknown, string][] = [
    [{ ...valid, intent: { intentId: "" } }, "invalid-intent"],
    [{ ...valid, stateResolution: { state: "report" } }, "invalid-state-resolution"],
    [{ ...valid, attentionEmphasis: { attention: {} } }, "invalid-attention-policy"],
    [{ ...valid, densityResolution: { density: "standard" } }, "invalid-density-resolution"],
  ];

  for (const [value, code] of checks) {
    const result = validateDirectorRuntimeAdaptivePresentationOrchestrationInput(value);
    assert.equal(result.valid, false, code);
    assert.equal(result.issues.some((entry) => entry.code === code), true, code);
  }
});

test("15. immutability of canonical structures and results", () => {
  assert.throws(() => {
    (modes as unknown as string[]).push("scene");
  }, TypeError);
  assert.throws(() => {
    (changeDimensions as unknown as string[])[0] = "color";
  }, TypeError);
  assert.throws(() => {
    (registry as { invariantCount: number }).invariantCount = 0;
  }, TypeError);

  const result = orchestrateDirectorRuntimeAdaptivePresentation(buildInput({}));
  assert.throws(() => {
    (result as { ok: boolean }).ok = false;
  }, TypeError);
  assert.throws(() => {
    (result.plan as { state: string }).state = "operation";
  }, TypeError);

  const verification = verifyDirectorRuntimeAdaptivePresentationOrchestration();
  assert.throws(() => {
    (verification as { ok: boolean }).ok = false;
  }, TypeError);
});

test("16. invariants, registry, and verification", () => {
  assert.equal(invariants.length, 32);
  assert.equal(registry.invariantCount, 32);
  assert.equal(registry.orchestrationModeCount, 2);
  assert.equal(registry.planChangeDimensionCount, 11);
  assert.equal(registry.validationIssueCount, 9);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(registry), true);

  const first = verifyDirectorRuntimeAdaptivePresentationOrchestration();
  const second = verifyDirectorRuntimeAdaptivePresentationOrchestration();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.deepEqual({
    identity: first.identity,
    version: first.version,
    namespace: first.namespace,
    dependency: first.dependency,
    orchestrationModeCount: first.orchestrationModeCount,
    planChangeDimensionCount: first.planChangeDimensionCount,
    validationIssueCount: first.validationIssueCount,
    invariantCount: first.invariantCount,
    frozen: first.frozen,
  }, {
    identity: "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
    version: "5.6.0",
    namespace: "nexora.dri.adaptive-presentation.orchestration",
    dependency: "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
    orchestrationModeCount: 2,
    planChangeDimensionCount: 11,
    validationIssueCount: 9,
    invariantCount: 32,
    frozen: true,
  });
});

test("17. boundary protection — no renderer, scene, platform, or content materialization", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three|framer-motion)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|WebGL|HTMLElement|Object3D|Mesh|Material)\b/,
  );
  assert.doesNotMatch(source, /\b(?:color|hex|rgb|opacity|fontSize|mesh|shader|camera|animation)\b/i);
  assert.doesNotMatch(
    source,
    /\b(?:centerSubject|dimOthers|showHalo|zoomCamera|openAdvisor|expandPanel|kpiChart)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:AdaptivePresentationPlatform|certifyDirectorRuntime|directorRuntimeAdaptivePresentationPlatform)\b/,
  );
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|fetch)\b/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/components\//);
  assert.match(source, /ReadyForAdaptivePresentationPlatform/);
  assert.match(source, /DRI-5:7 platform behavior is not implemented/);
  assert.equal(
    layer.architecturalStatus,
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForAdaptivePresentationPlatform",
  );
});

test("18. determinism and no input mutation", () => {
  const value = buildInput({ intentId: "det-1" });
  const before = JSON.stringify(value);
  const one = orchestrateDirectorRuntimeAdaptivePresentation(value);
  const two = orchestrateDirectorRuntimeAdaptivePresentation(value);
  assert.equal(JSON.stringify(value), before);
  assert.deepEqual(one, two);
  assert.notEqual(one, two);
  assert.equal(one.ok, true);
  assert.equal(one.plan?.intentId, "det-1");
});

test("19. intent object identity is not required for provenance fields", () => {
  const input = buildInput({});
  const mutatedIntent = {
    ...input.intent,
    subject: { ...input.intent.subject },
  } as DirectorRuntimePresentationIntent;
  const result = orchestrateDirectorRuntimeAdaptivePresentation({
    ...input,
    intent: mutatedIntent,
  });
  assert.equal(result.ok, true);
  assert.equal(result.plan?.subject.subjectId, "Inventory");
});
