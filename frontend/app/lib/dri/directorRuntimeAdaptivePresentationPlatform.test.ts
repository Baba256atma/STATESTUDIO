import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  orchestrateDirectorRuntimeAdaptivePresentation as orchestrateFromOrchestration,
  type DirectorRuntimeAdaptivePresentationOrchestrationInput,
} from "./directorRuntimeAdaptivePresentationOrchestration.ts";
import {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS as approvedApis,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS as capabilityDescriptors,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY as compatibility,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST as manifest,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS as platformStatus,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUSES as statuses,
  areDirectorRuntimeAdaptivePresentationPlansEqual,
  compareDirectorRuntimeAdaptivePresentationPlans,
  createDirectorRuntimeAdaptivePresentationPlanSnapshot,
  createDirectorRuntimePresentationIntent,
  directorRuntimeAdaptivePresentationPlatform as platform,
  directorRuntimeAdaptivePresentationPlatformCanonicalIdentity as canonicalIdentity,
  directorRuntimeAdaptivePresentationPlatformLayer as layer,
  directorRuntimeAdaptivePresentationPlatformRegistry as registry,
  findDirectorRuntimeAdaptivePresentationPlanById,
  getDirectorRuntimeAdaptivePresentationCapability,
  hasDirectorRuntimeAdaptivePresentationCapability,
  orchestrateDirectorRuntimeAdaptivePresentation,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  validateDirectorRuntimeAdaptivePresentationPlatform,
  validateDirectorRuntimePresentationIntent,
  verifyDirectorRuntimeAdaptivePresentationPlatform,
  verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility,
} from "./directorRuntimeAdaptivePresentationPlatform.ts";

const source = readFileSync(
  new URL("./directorRuntimeAdaptivePresentationPlatform.ts", import.meta.url),
  "utf8",
);

function buildInput(options?: {
  readonly subjectId?: string;
  readonly state?: "minimum" | "report" | "operation";
  readonly attention?: "normal" | "notice" | "warning" | "critical";
  readonly density?: "minimal" | "standard" | "expanded";
}): DirectorRuntimeAdaptivePresentationOrchestrationInput {
  const subject = {
    subjectId: options?.subjectId ?? "Inventory",
    subjectKind: "NexoraObject" as const,
  };
  const state = options?.state ?? "report";
  const attention = options?.attention ?? "warning";
  const density = options?.density ?? "standard";

  const intent = createDirectorRuntimePresentationIntent({
    intentId: "intent-inventory-1",
    subject,
    state,
    attention,
    density,
    priority: "high",
    visibility: "visible",
    interactionExposure: "inspect",
    source: "scene",
    reason: { code: "risk-attention", source: "scene", detail: "Inventory risk elevated." },
    context: { contextId: "scene-1", contextKind: "scene" },
  });

  const stateResolution = resolveDirectorRuntimePresentationState({
    subject,
    requiresExecutiveReport: state !== "minimum",
    requiresOperation: state === "operation",
    preferredState: state === "minimum" ? "minimum" : undefined,
  });

  const attentionEmphasis = resolveDirectorRuntimeAttentionEmphasisPolicy({
    subject,
    resolvedState: stateResolution,
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

test("1. publishes exact DRI-5:7 identity, version, and namespace", () => {
  assert.deepEqual({
    identity: platform.identity,
    version: platform.version,
    namespace: platform.namespace,
  }, {
    identity: "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform",
    version: "5.7.0",
    namespace: "nexora.dri.adaptive-presentation.platform",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform",
    version: "5.7.0",
    namespace: "nexora.dri.adaptive-presentation.platform",
    dependency: "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
  });
  assert.equal(layer.phase, "DRI-5:7");
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
});

test("2. sole immediate dependency is DRI-5:6 Orchestration", () => {
  assert.equal(
    platform.dependency,
    "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
  );
  assert.equal(registry.dependency, platform.dependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAdaptivePresentationOrchestration"],
  );
  assert.doesNotMatch(
    source,
    /directorRuntimeInformationDensityPolicy|directorRuntimeAttentionEmphasisPolicy|directorRuntimePresentationStateResolver|directorRuntimePresentationIntent|directorRuntimeAdaptivePresentationFoundation|directorRuntimeInteractionOrchestrationPublicIndex/,
  );
});

test("3. exactly eight capabilities in canonical order, all available", () => {
  assert.deepEqual([...capabilities], [
    "foundation",
    "intent",
    "state-resolution",
    "attention-emphasis",
    "information-density",
    "orchestration",
    "plan-inspection",
    "batch-orchestration",
  ]);
  assert.equal(new Set(capabilities).size, 8);
  assert.equal(capabilityDescriptors.length, 8);
  for (const descriptor of capabilityDescriptors) {
    assert.equal(descriptor.available, true);
    assert.equal(typeof descriptor.semanticRole, "string");
    assert.equal(Object.isFrozen(descriptor), true);
  }
  assert.equal(Object.isFrozen(capabilities), true);
  assert.equal(Object.isFrozen(capabilityDescriptors), true);
});

test("4. exactly eight guarantees in canonical order", () => {
  assert.deepEqual([...guarantees], [
    "deterministic",
    "immutable",
    "semantic",
    "renderer-independent",
    "framework-independent",
    "side-effect-free",
    "ordered",
    "upstream-preserving",
  ]);
  assert.equal(new Set(guarantees).size, 8);
  assert.equal(Object.isFrozen(guarantees), true);
});

test("5. platform status is ready-for-certification without release claims", () => {
  assert.deepEqual([...statuses], ["established", "ready-for-certification"]);
  assert.equal(platformStatus, "ready-for-certification");
  assert.equal(platform.status, "ready-for-certification");
  assert.equal(platform.certified, false);
  assert.equal(platform.frozen, false);
  assert.equal(platform.released, false);
  assert.equal(platform.readyForConsumer, false);
  assert.equal(platform.soleConsumerEntryPoint, false);
  assert.equal(platform.publicIndex, false);
  assert.doesNotMatch(
    `${platform.status}|${layer.status}|${layer.architecturalStatus}`,
    /\bcertified\b|\bfrozen\b|\breleased\b|ready-for-consumer/i,
  );
});

test("6. capability query returns true for canonical and false for unknown", () => {
  for (const capability of capabilities) {
    assert.equal(hasDirectorRuntimeAdaptivePresentationCapability(capability), true);
    const descriptor = getDirectorRuntimeAdaptivePresentationCapability(capability);
    assert.ok(descriptor);
    assert.equal(descriptor.capability, capability);
    assert.equal(descriptor.available, true);
  }
  assert.equal(hasDirectorRuntimeAdaptivePresentationCapability("rendering"), false);
  assert.equal(hasDirectorRuntimeAdaptivePresentationCapability(null), false);
  assert.equal(hasDirectorRuntimeAdaptivePresentationCapability(42), false);
});

test("7. platform manifest integrity", () => {
  assert.equal(manifest.identity, platform.identity);
  assert.equal(manifest.version, "5.7.0");
  assert.equal(manifest.namespace, platform.namespace);
  assert.equal(manifest.dependency, platform.dependency);
  assert.deepEqual([...manifest.capabilities], [...capabilities]);
  assert.deepEqual([...manifest.guarantees], [...guarantees]);
  assert.equal(manifest.approvedApis.length, approvedApis.length);
  assert.equal(manifest.invariants.length, invariants.length);
  assert.equal(Object.isFrozen(manifest), true);
});

test("8. API preservation for intent, state, attention/emphasis, density", () => {
  const intent = createDirectorRuntimePresentationIntent({
    intentId: "intent-api-1",
    subject: { subjectId: "Orders", subjectKind: "NexoraObject" },
    state: "report",
    attention: "notice",
    density: "standard",
    priority: "normal",
    visibility: "visible",
    interactionExposure: "inspect",
    source: "runtime",
  });
  assert.equal(validateDirectorRuntimePresentationIntent(intent).valid, true);

  const state = resolveDirectorRuntimePresentationState({
    subject: intent.subject,
    requiresExecutiveReport: true,
    requiresOperation: false,
  });
  assert.equal(state.state, "report");

  const attention = resolveDirectorRuntimeAttentionEmphasisPolicy({
    subject: intent.subject,
    resolvedState: state,
    signal: "informational",
    riskPresent: false,
    actionRequired: false,
    exceptionPresent: false,
    requestedAttention: "notice",
  });
  assert.equal(attention.attention.attention, "notice");

  const density = resolveDirectorRuntimeInformationDensity({
    subject: intent.subject,
    attentionPolicy: attention,
    signal: "inspection",
    inspectionRequired: true,
    analysisRequired: false,
    decisionContextRequired: false,
    operationContextRequired: false,
  });
  assert.equal(density.density, "standard");
});

test("9. orchestration parity with DRI-5:6", () => {
  const input = buildInput({
    state: "report",
    attention: "warning",
    density: "standard",
  });
  const fromPlatform = orchestrateDirectorRuntimeAdaptivePresentation(input);
  const fromOrchestration = orchestrateFromOrchestration(input);
  assert.deepEqual(fromPlatform, fromOrchestration);
  assert.equal(fromPlatform.ok, true);
  assert.ok(fromPlatform.plan);
  assert.equal(fromPlatform.plan!.emphasis, "prominent");
});

test("10. plan inspection surface remains available", () => {
  const planA = orchestrateDirectorRuntimeAdaptivePresentation(buildInput()).plan!;
  const planB = orchestrateDirectorRuntimeAdaptivePresentation(
    buildInput({ attention: "critical", density: "expanded" }),
  ).plan!;
  assert.equal(areDirectorRuntimeAdaptivePresentationPlansEqual(planA, planA), true);
  assert.equal(areDirectorRuntimeAdaptivePresentationPlansEqual(planA, planB), false);
  const comparison = compareDirectorRuntimeAdaptivePresentationPlans(planA, planB);
  assert.equal(comparison.changed, true);
  assert.ok(comparison.changedDimensions.includes("attention"));
  const snapshot = createDirectorRuntimeAdaptivePresentationPlanSnapshot([planA, planB]);
  assert.equal(snapshot.plans.length, 2);
  assert.equal(
    findDirectorRuntimeAdaptivePresentationPlanById(snapshot.plans, planA.planId)?.planId,
    planA.planId,
  );
});

test("11. compatibility with DRI-5:6 is compatible and immutable", () => {
  assert.equal(compatibility.status, "compatible");
  assert.equal(
    compatibility.expectedDependency,
    "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
  );
  const first = verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility();
  const second = verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility();
  assert.equal(first.compatible, true);
  assert.equal(first.status, "compatible");
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(compatibility), true);
});

test("12. validation detects malformed platform descriptors", () => {
  const valid = validateDirectorRuntimeAdaptivePresentationPlatform(platform);
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.issues, []);

  const fixtures: Array<{
    readonly label: string;
    readonly code: string;
    readonly input: Parameters<typeof validateDirectorRuntimeAdaptivePresentationPlatform>[0];
  }> = [
    {
      label: "wrong identity",
      code: "wrong-identity",
      input: { ...platform, identity: "DRI-5:7/Wrong" },
    },
    {
      label: "wrong version",
      code: "wrong-version",
      input: { ...platform, version: "0.0.0" },
    },
    {
      label: "wrong namespace",
      code: "wrong-namespace",
      input: { ...platform, namespace: "wrong.namespace" },
    },
    {
      label: "wrong dependency",
      code: "wrong-dependency",
      input: { ...platform, dependency: "DRI-5:5/DirectorRuntimeInformationDensityPolicy" },
    },
    {
      label: "missing capability",
      code: "missing-capability",
      input: {
        ...platform,
        capabilities: capabilities.filter((value) => value !== "intent"),
      },
    },
    {
      label: "duplicate capability",
      code: "duplicate-capability",
      input: {
        ...platform,
        capabilities: [...capabilities, "intent"],
      },
    },
    {
      label: "wrong capability order",
      code: "wrong-capability-order",
      input: {
        ...platform,
        capabilities: [...capabilities].reverse(),
      },
    },
    {
      label: "missing guarantee",
      code: "missing-guarantee",
      input: {
        ...platform,
        guarantees: guarantees.filter((value) => value !== "deterministic"),
      },
    },
    {
      label: "duplicate guarantee",
      code: "duplicate-guarantee",
      input: {
        ...platform,
        guarantees: [...guarantees, "deterministic"],
      },
    },
    {
      label: "wrong guarantee order",
      code: "wrong-guarantee-order",
      input: {
        ...platform,
        guarantees: [...guarantees].reverse(),
      },
    },
    {
      label: "invalid manifest",
      code: "invalid-manifest",
      input: {
        ...platform,
        manifest: { identity: "bad", version: "0", namespace: "bad", dependency: "bad" },
      },
    },
  ];

  for (const fixture of fixtures) {
    const result = validateDirectorRuntimeAdaptivePresentationPlatform(fixture.input);
    assert.equal(result.valid, false, fixture.label);
    assert.ok(
      result.issues.some((entry) => entry.code === fixture.code),
      `${fixture.label} should include ${fixture.code}: ${JSON.stringify(result.issues)}`,
    );
    assert.equal(Object.isFrozen(result), true);
  }
});

test("13. no policy duplication in platform source", () => {
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_PRESENTATION_STATE_PRECEDENCE/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE/);
  assert.doesNotMatch(source, /function\s+deriveDirectorRuntimeAdaptivePresentationPlanId/);
  assert.doesNotMatch(source, /function\s+orchestrateDirectorRuntimeAdaptivePresentation\s*\(/);
  assert.match(source, /export\s*\{[\s\S]*orchestrateDirectorRuntimeAdaptivePresentation/);
});

test("14. practical runtime immutability", () => {
  const verification = verifyDirectorRuntimeAdaptivePresentationPlatform();
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(capabilities), true);
  assert.equal(Object.isFrozen(capabilityDescriptors), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(approvedApis), true);
  assert.equal(Object.isFrozen(compatibility), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(verification), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.throws(() => {
    (platform as { status?: string }).status = "certified";
  });
});

test("15. renderer and framework independence", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']next\//);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
  assert.doesNotMatch(source, /framer-motion/);
  assert.doesNotMatch(source, /document\.|window\.|localStorage|CSSStyle|HTMLElement/);
  assert.doesNotMatch(source, /from\s+["'][^"']*components[^"']*["']/);
});

test("16. boundary protection against certification, freeze, public index, adapters, stores", () => {
  assert.doesNotMatch(source, /ReadyForConsumer|SoleConsumerEntryPoint/);
  assert.doesNotMatch(source, /certificationDomains|freezeLock|frozenExportManifest/);
  assert.doesNotMatch(source, /PresentationStore|PlatformStore|createContext\(|EventEmitter/);
  assert.doesNotMatch(source, /React adapter|Three\.js adapter|scene adapter|renderer adapter/i);
  assert.equal(invariants.includes("platform-is-not-certified-in-dri-5-7"), true);
  assert.equal(invariants.includes("platform-is-not-frozen-in-dri-5-7"), true);
  assert.equal(invariants.includes("platform-is-not-the-public-index"), true);
  assert.equal(invariants.includes("dri-5-8-plus-behavior-is-not-implemented"), true);
  assert.equal(invariants.length, 34);
});

test("17. platform verification succeeds with deterministic counts", () => {
  const verification = verifyDirectorRuntimeAdaptivePresentationPlatform();
  assert.equal(verification.ok, true);
  assert.equal(verification.capabilityCount, 8);
  assert.equal(verification.guaranteeCount, 8);
  assert.equal(verification.approvedApiCount, approvedApis.length);
  assert.equal(verification.invariantCount, 34);
  assert.equal(verification.namespaceSectionCount, 12);
  assert.equal(verification.certified, false);
  assert.equal(verification.publicIndex, false);
  assert.equal(verification.compatibility.compatible, true);
  assert.equal(verification.validation.valid, true);
  assert.deepEqual(
    verifyDirectorRuntimeAdaptivePresentationPlatform(),
    verification,
  );
});

test("18. registry exposes static platform surface without runtime plans", () => {
  assert.equal(registry.identity, platform.identity);
  assert.equal(registry.status, "ready-for-certification");
  assert.equal(registry.capabilityCount, 8);
  assert.equal(registry.guaranteeCount, 8);
  assert.equal(registry.approvedApiCount, approvedApis.length);
  assert.equal(registry.invariantCount, 34);
  assert.equal(registry.manifest, manifest);
  assert.equal("plans" in registry, false);
  assert.equal(Object.isFrozen(registry), true);
});
