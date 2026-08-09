import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES as attentionStates,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS as intentKinds,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES as orchestrationPresentationStates,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES as orchestrationStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES as apiFamilies,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES as capabilityNames,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES as capabilityStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES as experienceSurfaces,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER as lockPlaceholder,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES as verificationCodes,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS as priorityBands,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES as resolutionCategories,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES as resolutionStatuses,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightExperienceOrchestrationPolicy,
  createRuntimeExecutiveInsightPresentationPolicy,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  getRuntimeExecutiveInsightExperiencePlatformCapabilities,
  getRuntimeExecutiveInsightExperiencePlatformIdentity,
  getRuntimeExecutiveInsightExperiencePlatformRegistry,
  orchestrateRuntimeExecutiveInsightExperience,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightPresentation,
  runtimeExecutiveInsightExperiencePlatform as platform,
  runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry as approvedExports,
  runtimeExecutiveInsightExperiencePlatformCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry as functionalApis,
  runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry as publicTypes,
  runtimeExecutiveInsightExperiencePlatformRegistry as registry,
  supportsRuntimeExecutiveInsightExperienceCapability,
  validateRuntimeExecutiveInsightExperiencePlatform,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceCompatibility,
  verifyRuntimeExecutiveInsightExperienceOrchestration,
  verifyRuntimeExecutiveInsightExperiencePlatform,
} from "./runtimeExecutiveInsightExperiencePlatform.ts";

const source = readFileSync(
  new URL("./runtimeExecutiveInsightExperiencePlatform.ts", import.meta.url),
  "utf8",
);

function sourceImports(): string[] {
  return [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
}

function freezeSnapshot<T>(value: T): T {
  return Object.freeze(
    JSON.parse(JSON.stringify(value)) as T,
  );
}

function equalFrozenSnapshots(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function subject(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveInsightSubjectContract>[0]>,
) {
  return createRuntimeExecutiveInsightSubjectContract({
    subjectId: "project.alpha",
    kind: "nexora-object",
    label: "Project Alpha",
    scope: "object",
    ...overrides,
  });
}

function sourceRef() {
  return createRuntimeExecutiveInsightSourceContract({
    kind: "runtime",
    sourceId: "runtime.1",
  });
}

function metricEvidence(
  payload: Record<string, number | boolean | number[]>,
  id = "ev.metric",
) {
  return createRuntimeExecutiveInsightEvidenceContract({
    evidenceId: id,
    kind: "metric",
    source: sourceRef(),
    subjectId: "project.alpha",
    payload,
    freshness: "current",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
}

function metricSignal(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveInsightSignalContract>[0]>,
) {
  return createRuntimeExecutiveInsightSignalContract({
    signalId: "sig.metric",
    kind: "metric",
    subjectId: "project.alpha",
    source: sourceRef(),
    direction: "decreasing",
    confidence: 0.8,
    freshness: "current",
    ...overrides,
  });
}

function thresholdRule(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveInsightResolutionRule>[0]>,
) {
  return createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.threshold.delivery",
    ruleKind: "threshold",
    targetCategory: "threshold",
    applicableSubjectKinds: ["nexora-object", "kpi"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "require-previous-and-current",
        previousField: "previous",
        currentField: "current",
      },
      {
        kind: "compare-current-to-threshold",
        currentField: "current",
        operator: "less-than",
      },
    ],
    output: {
      category: "threshold",
      directionFrom: "previous-current",
      severity: "high",
      importance: "high",
      confidence: 0.8,
      freshnessFrom: "evidence",
      scope: "object",
      candidateKey: "delivery-reliability-threshold",
    },
    precedence: 10,
    specificity: 5,
    ...overrides,
  });
}

function priorityPolicy() {
  return createRuntimeExecutiveInsightPriorityPolicy({
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
  });
}

function runFullChain() {
  const primary = subject();
  const evidence = metricEvidence({ previous: 94, current: 78, threshold: 85 });
  const signal = metricSignal({ evidenceIds: ["ev.metric"] });
  const rule = thresholdRule();

  const resolution = resolveRuntimeExecutiveInsight({
    primarySubject: primary,
    relatedSubjects: [
      {
        subject: createRuntimeExecutiveInsightSubjectContract({
          subjectId: "kpi.delivery-reliability",
          kind: "kpi",
          label: "Delivery Reliability",
        }),
        role: "related",
        order: 0,
      },
    ],
    evidence: [evidence],
    signals: [signal],
    context: {
      temporalRefIso: "2026-08-08T12:00:00.000Z",
      threshold: { value: 85, operator: "less-than", field: "current" },
      rules: [rule],
    },
    source: sourceRef(),
    scope: "object",
  });

  assert.equal(resolution.status, "resolved");
  assert.ok(resolution.candidate);

  const priority = evaluateRuntimeExecutiveInsightPriority({
    candidate: resolution.candidate!,
    context: {
      focusedSubjectId: primary.subjectId,
      decisionSubjectIds: ["decision.1"],
      executionSubjectIds: ["execution.1"],
    },
    policy: priorityPolicy(),
  });

  const presentation = resolveRuntimeExecutiveInsightPresentation({
    candidate: resolution.candidate!,
    priority,
    requestedState: "report",
    context: {
      focusedSubjectId: primary.subjectId,
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

  const orchestration = orchestrateRuntimeExecutiveInsightExperience({
    presentation,
    eventKind: "insight-selected",
    experienceContext: Object.freeze({
      selectedSubjectId: "project.alpha",
      focusedSubjectId: "project.alpha",
      activeDecisionId: "decision.1",
      activeExecutionId: "execution.1",
      activeScenarioId: "scenario.1",
      activeProblemId: "problem.1",
      activePackId: "pack.1",
      activePresentationState: "report" as const,
    }),
    stageContext: Object.freeze({
      selectedStageSubjectId: "project.alpha",
      sceneRef: "scene.1",
    }),
    advisorContext: Object.freeze({
      currentAdvisorSubjectId: "project.alpha",
    }),
    sceneContext: Object.freeze({
      sceneId: "scene.1",
    }),
    policy: createRuntimeExecutiveInsightExperienceOrchestrationPolicy({
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
    }),
  });

  return Object.freeze({
    resolution,
    priority,
    presentation,
    orchestration,
  });
}

// ─── 1–10 Identity / dependency ─────────────────────────────────────────────

test("1. exact identity", () => {
  assert.equal(
    platform.identity,
    "REX-4:7/RuntimeExecutiveInsightExperiencePlatform",
  );
  assert.equal(
    getRuntimeExecutiveInsightExperiencePlatformIdentity().identity,
    "REX-4:7/RuntimeExecutiveInsightExperiencePlatform",
  );
});

test("2. exact version", () => {
  assert.equal(platform.version, "4.7.0");
  assert.equal(canonicalIdentity.version, "4.7.0");
});

test("3. exact namespace", () => {
  assert.equal(platform.namespace, "nexora.rex.insight-experience.platform");
});

test("4. layer / capability / phase / status", () => {
  assert.equal(platform.layer, "REX");
  assert.equal(platform.capability, "RuntimeExecutiveInsightExperience");
  assert.equal(platform.phase, "Platform");
  assert.equal(platform.status, "PlatformReady");
});

test("5. consumer role PlatformConsumerSurface", () => {
  assert.equal(platform.Identity.consumerRole, "PlatformConsumerSurface");
  assert.equal(
    platform.ConsumerInformation.role,
    "PlatformConsumerSurface",
  );
});

test("6. sole immediate dependency is REX-4:6", () => {
  assert.equal(
    platform.upstreamDependency,
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration",
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration",
  );
  assert.equal(
    platform.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveInsightExperienceOrchestration",
  );
});

test("7. only orchestration import path present", () => {
  assert.deepEqual(sourceImports(), [
    "@/app/lib/rex/runtimeExecutiveInsightExperienceOrchestration",
  ]);
});

test("8. no direct REX-4:1–4:5 imports", () => {
  assert.equal(boundary.importsRex45Directly, false);
  assert.equal(boundary.importsRex44Directly, false);
  assert.equal(boundary.importsRex43Directly, false);
  assert.equal(boundary.importsRex42Directly, false);
  assert.equal(boundary.importsRex41Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightExperienceFoundation["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightExperienceContracts["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightResolution["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightPriorityAttention["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightPresentation["']/,
  );
});

test("9. no direct REX-4:8 / REX-4:9 imports", () => {
  assert.equal(boundary.importsRex48Directly, false);
  assert.equal(boundary.importsRex49Directly, false);
  assert.doesNotMatch(source, /CertificationFreeze|PublicIndex/);
});

test("10. no dri / nol / react imports", () => {
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.reactIndependent, true);
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["'][^"']*\/dri\//);
  assert.doesNotMatch(source, /from\s+["'][^"']*\/nol\//);
  assert.doesNotMatch(source, /from\s+["'][^"']*\/ex-dri\//);
});

// ─── 11–25 Capabilities / surfaces / families / sections ────────────────────

test("11. capability statuses vocabulary", () => {
  assert.deepEqual([...capabilityStatuses], [
    "available",
    "restricted",
    "unavailable",
  ]);
});

test("12. capability names exact order", () => {
  assert.deepEqual([...capabilityNames], [
    "contracts",
    "validation",
    "resolution",
    "candidate-resolution",
    "priority",
    "ranking",
    "attention",
    "presentation",
    "presentation-interactions",
    "orchestration",
    "stage-context",
    "advisor-context",
    "scene-context",
    "related-context",
    "registry",
    "compatibility",
  ]);
});

test("13. all capabilities available", () => {
  assert.equal(capabilities.length, 16);
  for (const entry of capabilities) {
    assert.equal(entry.status, "available");
  }
});

test("14. supportsRuntimeExecutiveInsightExperienceCapability", () => {
  assert.equal(
    supportsRuntimeExecutiveInsightExperienceCapability("contracts"),
    true,
  );
  assert.equal(
    supportsRuntimeExecutiveInsightExperienceCapability("orchestration"),
    true,
  );
  assert.equal(
    supportsRuntimeExecutiveInsightExperienceCapability("missing"),
    false,
  );
});

test("15. getCapabilities returns same ordered entries", () => {
  assert.deepEqual(
    getRuntimeExecutiveInsightExperiencePlatformCapabilities(),
    capabilities,
  );
});

test("16. experience surfaces published", () => {
  assert.deepEqual([...experienceSurfaces], [
    "insight",
    "stage-context",
    "advisor-context",
    "scene-context",
    "evidence-context",
    "relationship-context",
    "pack-context",
    "decision-context",
    "execution-context",
    "scenario-context",
    "problem-context",
  ]);
});

test("17. API families exact order", () => {
  assert.deepEqual([...apiFamilies], [
    "Identity",
    "Validation",
    "Resolution",
    "Priority",
    "Attention",
    "Presentation",
    "Orchestration",
    "Compatibility",
    "Registry",
  ]);
});

test("18. registry sections exact order", () => {
  assert.deepEqual([...registrySections], [
    "Identity",
    "Capabilities",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Compatibility",
    "ExperienceSurfaces",
    "ConsumerGuarantees",
    "RegistryInformation",
  ]);
});

test("19. platform object sections present", () => {
  assert.ok(platform.Identity);
  assert.ok(platform.Types);
  assert.ok(platform.APIs);
  assert.ok(platform.Validation);
  assert.ok(platform.Capabilities);
  assert.ok(platform.Compatibility);
  assert.ok(platform.Registry);
  assert.ok(platform.ConsumerInformation);
});

test("20. approved exports unique ordered", () => {
  assert.equal(new Set(approvedExports).size, approvedExports.length);
  assert.ok(approvedExports.length > 40);
});

test("21. public type registry unique ordered", () => {
  assert.equal(new Set(publicTypes).size, publicTypes.length);
  assert.deepEqual([...publicTypes], [...publicTypeNames]);
});

test("22. functional API registry unique ordered", () => {
  assert.equal(new Set(functionalApis).size, functionalApis.length);
  assert.ok(
    functionalApis.includes(
      "getRuntimeExecutiveInsightExperiencePlatformIdentity",
    ),
  );
  assert.ok(
    functionalApis.includes("verifyRuntimeExecutiveInsightExperiencePlatform"),
  );
});

test("23. registry counts derived dynamically", () => {
  assert.equal(registry.exportCount, approvedExports.length);
  assert.equal(registry.typeCount, publicTypes.length);
  assert.equal(registry.apiCount, functionalApis.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(
    registry.RegistryInformation.countsDerivedDynamically,
    true,
  );
});

test("24. getRegistry returns frozen registry", () => {
  const first = getRuntimeExecutiveInsightExperiencePlatformRegistry();
  const second = getRuntimeExecutiveInsightExperiencePlatformRegistry();
  assert.equal(first, registry);
  assert.equal(second, registry);
  assert.ok(Object.isFrozen(first));
});

test("25. getIdentity deterministic", () => {
  const a = getRuntimeExecutiveInsightExperiencePlatformIdentity();
  const b = getRuntimeExecutiveInsightExperiencePlatformIdentity();
  assert.deepEqual(a, b);
  assert.equal(a, canonicalIdentity);
});

// ─── 26–40 Vocabularies preserved ───────────────────────────────────────────

test("26. presentation states exact minimum/report/operation", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.deepEqual(
    [...presentationStates],
    [...orchestrationPresentationStates],
  );
});

test("27. resolution categories preserved", () => {
  assert.ok(resolutionCategories.includes("threshold"));
  assert.ok(resolutionCategories.includes("risk"));
  assert.ok(resolutionCategories.length >= 10);
});

test("28. resolution statuses preserved", () => {
  assert.deepEqual([...resolutionStatuses], [
    "resolved",
    "unresolved",
    "ineligible",
    "invalid",
    "ambiguous",
  ]);
});

test("29. priority bands preserved", () => {
  assert.deepEqual([...priorityBands], [
    "minimal",
    "low",
    "medium",
    "high",
    "critical",
  ]);
});

test("30. attention states preserved", () => {
  assert.deepEqual([...attentionStates], [
    "none",
    "background",
    "notice",
    "focus",
    "urgent",
  ]);
});

test("31. subject kinds preserve kpi/koi without kor", () => {
  assert.ok(subjectKinds.includes("kpi"));
  assert.ok(subjectKinds.includes("koi"));
  assert.equal(subjectKinds.includes("kor" as never), false);
  assert.equal(subjectSemantics.introducesKor, false);
});

test("32. orchestration statuses preserved", () => {
  assert.deepEqual([...orchestrationStatuses], [
    "orchestrated",
    "no-op",
    "restricted",
    "invalid",
    "conflicted",
  ]);
});

test("33. orchestration intent kinds preserved", () => {
  assert.ok(intentKinds.includes("select-insight"));
  assert.ok(intentKinds.includes("expose-stage-context"));
  assert.ok(intentKinds.includes("expose-advisor-context"));
  assert.ok(intentKinds.includes("sync-presentation-state"));
  assert.equal(intentKinds.length, 16);
});

test("34. registry mirrors presentation state count", () => {
  assert.equal(registry.presentationStateCount, 3);
  assert.deepEqual([...registry.presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
});

test("35. registry mirrors subject kinds", () => {
  assert.deepEqual([...registry.subjectKinds], [...subjectKinds]);
});

test("36. registry mirrors priority bands", () => {
  assert.deepEqual([...registry.priorityBands], [...priorityBands]);
});

test("37. registry mirrors attention states", () => {
  assert.deepEqual([...registry.attentionStates], [...attentionStates]);
});

test("38. registry mirrors orchestration statuses", () => {
  assert.deepEqual(
    [...registry.orchestrationStatuses],
    [...orchestrationStatuses],
  );
});

test("39. experience surfaces on platform and consumer info", () => {
  assert.deepEqual(
    [...platform.experienceSurfaces],
    [...experienceSurfaces],
  );
  assert.deepEqual(
    [...platform.ConsumerInformation.experienceSurfaces],
    [...experienceSurfaces],
  );
});

test("40. all experience surfaces count is 11", () => {
  assert.equal(experienceSurfaces.length, 11);
  assert.equal(registry.ExperienceSurfaces.count, 11);
});

// ─── 41–55 Validation / verification / compatibility ────────────────────────

test("41. validate platform without argument ok", () => {
  const result = validateRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(result.ok, true);
  assert.equal(result.issues.length, 0);
});

test("42. validate platform object ok", () => {
  const result = validateRuntimeExecutiveInsightExperiencePlatform(platform);
  assert.equal(result.ok, true);
});

test("43. validate rejects wrong identity", () => {
  const result = validateRuntimeExecutiveInsightExperiencePlatform({
    ...platform,
    identity: "wrong",
  });
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((entry) => entry.code === "identity-invalid"));
});

test("44. validate rejects missing section", () => {
  const result = validateRuntimeExecutiveInsightExperiencePlatform({
    identity: platform.identity,
    version: platform.version,
    namespace: platform.namespace,
    phase: platform.phase,
    status: platform.status,
    upstreamDependency: platform.upstreamDependency,
  });
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((entry) => entry.code === "section-missing"));
});

test("45. compatibility compatible for exact platform values", () => {
  const result = verifyRuntimeExecutiveInsightExperienceCompatibility({
    identity: platform.identity,
    version: platform.version,
    presentationStates: [...presentationStates],
    capabilities: [...capabilityNames],
  });
  assert.equal(result.status, "compatible");
  assert.equal(result.identityMatch, true);
  assert.equal(result.versionMatch, true);
  assert.equal(result.presentationStatesMatch, true);
  assert.equal(result.capabilitiesMatch, true);
});

test("46. compatibility incompatible for wrong identity", () => {
  const result = verifyRuntimeExecutiveInsightExperienceCompatibility({
    identity: "REX-4:7/Other",
  });
  assert.equal(result.status, "incompatible");
  assert.equal(result.identityMatch, false);
});

test("47. compatibility incompatible for wrong presentation states", () => {
  const result = verifyRuntimeExecutiveInsightExperienceCompatibility({
    presentationStates: ["report", "minimum", "operation"],
  });
  assert.equal(result.status, "incompatible");
  assert.equal(result.presentationStatesMatch, false);
});

test("48. compatibility incompatible for wrong capabilities", () => {
  const result = verifyRuntimeExecutiveInsightExperienceCompatibility({
    capabilities: ["contracts"],
  });
  assert.equal(result.status, "incompatible");
  assert.equal(result.capabilitiesMatch, false);
});

test("49. verify platform status verified", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(result.status, "verified");
  assert.equal(result.failed, 0);
  assert.equal(result.passed, result.total);
  assert.ok(result.total >= 17);
});

test("50. verification codes ordered list complete", () => {
  assert.deepEqual([...verificationCodes], [
    "identity-valid",
    "version-valid",
    "namespace-valid",
    "dependency-valid",
    "capability-registry-valid",
    "export-registry-valid",
    "type-registry-valid",
    "api-registry-valid",
    "registry-counts-valid",
    "presentation-states-valid",
    "compatibility-valid",
    "consumer-guarantees-valid",
    "deterministic-contract-valid",
    "immutable-registry-valid",
    "forbidden-import-detected",
    "duplicate-export-detected",
    "duplicate-capability-detected",
  ]);
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.deepEqual([...result.verificationCodes], [...verificationCodes]);
  assert.equal(result.checks.length, verificationCodes.length);
});

test("51. verification checks all passed", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  for (const check of result.checks) {
    assert.equal(check.passed, true, check.code);
  }
});

test("52. verification includes orchestrationOk", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(result.orchestrationOk, true);
  assert.equal(verifyRuntimeExecutiveInsightExperienceOrchestration().ok, true);
});

test("53. verification noKor and no KPI/KOI calculation", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(result.noKor, true);
  assert.equal(result.calculatesKpi, false);
  assert.equal(result.calculatesKoi, false);
  assert.equal(boundary.calculatesKpi, false);
  assert.equal(boundary.calculatesKoi, false);
  assert.equal(boundary.introducesKor, false);
});

test("54. verification frozen/immutable registry", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(result.frozen, true);
  assert.ok(Object.isFrozen(platform));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(capabilities));
  assert.ok(Object.isFrozen(approvedExports));
});

test("55. repeated verify deterministic", () => {
  const a = verifyRuntimeExecutiveInsightExperiencePlatform();
  const b = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.deepEqual(a, b);
});

// ─── 56–70 Claims / boundaries / guarantees ─────────────────────────────────

test("56. no Certified claim", () => {
  assert.equal(boundary.claimsCertified, false);
  assert.equal(platform.ConsumerInformation.claimsCertified, false);
  assert.equal(platform.status, "PlatformReady");
  assert.doesNotMatch(platform.status, /Certified/);
  assert.doesNotMatch(platform.architecturalStatus, /\bCertified\b/);
});

test("57. no Frozen claim", () => {
  assert.equal(boundary.claimsFrozen, false);
  assert.equal(platform.ConsumerInformation.claimsFrozen, false);
  assert.doesNotMatch(platform.status, /Frozen/);
  assert.doesNotMatch(platform.architecturalStatus, /\bFrozen\b/);
});

test("58. no Locked / Released / ReadyForConsumer claims", () => {
  assert.equal(boundary.claimsLocked, false);
  assert.equal(boundary.claimsReleased, false);
  assert.equal(boundary.claimsReadyForConsumer, false);
  assert.equal(platform.ConsumerInformation.claimsLocked, false);
  assert.equal(platform.ConsumerInformation.claimsReleased, false);
  assert.equal(platform.ConsumerInformation.claimsReadyForConsumer, false);
  assert.doesNotMatch(
    source,
    /REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED/,
  );
  assert.doesNotMatch(platform.status, /ReadyForConsumer|Released|Locked/);
  assert.doesNotMatch(
    platform.architecturalStatus,
    /\bReadyForConsumer\b|\bReleased\b|\bLocked\b/,
  );
});

test("59. prefreeze lock placeholder only", () => {
  assert.equal(
    lockPlaceholder,
    "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-PREFREEZE",
  );
  assert.equal(platform.lockPlaceholder, lockPlaceholder);
  assert.ok(lockPlaceholder.includes("PREFREEZE"));
  assert.ok(!lockPlaceholder.endsWith("-LOCKED"));
});

test("60. consumer guarantees cover determinism and neutrality", () => {
  assert.ok(consumerGuarantees.includes("deterministic-platform-surface"));
  assert.ok(consumerGuarantees.includes("immutable-inputs"));
  assert.ok(consumerGuarantees.includes("immutable-results"));
  assert.ok(consumerGuarantees.includes("immutable-registry"));
  assert.ok(consumerGuarantees.includes("no-ai"));
  assert.ok(consumerGuarantees.includes("no-llm"));
  assert.ok(consumerGuarantees.includes("no-react"));
  assert.ok(consumerGuarantees.includes("no-rendering"));
  assert.ok(consumerGuarantees.includes("no-persistence"));
  assert.ok(consumerGuarantees.includes("no-external-integration"));
  assert.ok(consumerGuarantees.includes("no-automation"));
  assert.ok(consumerGuarantees.includes("no-semantic-rewriting"));
});

test("61. boundary no AI / React / renderer / persistence / automation", () => {
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.reactIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.equal(boundary.introducesPersistence, false);
  assert.equal(boundary.introducesAutomation, false);
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.equal(boundary.rendersUi, false);
});

test("62. boundary no DRI / NOL / EX-DRI", () => {
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
});

test("63. boundary does not invent upstream behavior", () => {
  assert.equal(boundary.inventsUpstreamBehavior, false);
  assert.equal(boundary.recalculatesPriority, false);
  assert.equal(boundary.recalculatesAttention, false);
  assert.equal(boundary.reresolvesInsightSemantics, false);
  assert.equal(boundary.reresolvesPresentation, false);
});

test("64. architectural status is PlatformReady prefreeze", () => {
  assert.match(platform.architecturalStatus, /PlatformReady/);
  assert.match(platform.architecturalStatus, /PrefreezePlaceholder/);
  assert.doesNotMatch(platform.architecturalStatus, /Certified|Frozen|Locked/);
});

test("65. consumer information not final public index", () => {
  assert.equal(
    platform.ConsumerInformation.isFinalPublicConsumerIndex,
    false,
  );
});

test("66. Identity section mirrors top-level identity fields", () => {
  assert.equal(platform.Identity.identity, platform.identity);
  assert.equal(platform.Identity.version, platform.version);
  assert.equal(platform.Identity.namespace, platform.namespace);
  assert.equal(platform.Identity.phase, platform.phase);
  assert.equal(platform.Identity.status, platform.status);
});

test("67. Capabilities section mirrors capability entries", () => {
  assert.deepEqual(platform.Capabilities.entries, capabilities);
  assert.equal(platform.Capabilities.count, 16);
});

test("68. Compatibility section required values", () => {
  assert.equal(
    platform.Compatibility.requiredIdentity,
    platform.identity,
  );
  assert.equal(platform.Compatibility.requiredVersion, "4.7.0");
  assert.deepEqual(
    [...platform.Compatibility.requiredPresentationStates],
    ["minimum", "report", "operation"],
  );
});

test("69. Registry section equals exported registry", () => {
  assert.equal(platform.Registry, registry);
});

test("70. APIs section includes families and registries", () => {
  assert.deepEqual([...platform.APIs.families], [...apiFamilies]);
  assert.deepEqual([...platform.APIs.functionalApis], [...functionalApis]);
  assert.ok(platform.APIs.upstreamApis.includes("resolveRuntimeExecutiveInsight"));
  assert.ok(
    platform.APIs.upstreamApis.includes(
      "orchestrateRuntimeExecutiveInsightExperience",
    ),
  );
});

// ─── 71–86 Semantic preservation / full-chain / determinism ─────────────────

test("71. re-exported subject contract validation works", () => {
  const created = subject();
  const validation = validateRuntimeExecutiveInsightSubjectContract(created);
  assert.equal(validation.valid, true);
});

test("72. re-exported resolveInsight works", () => {
  const result = resolveRuntimeExecutiveInsight({
    primarySubject: subject(),
    relatedSubjects: [],
    evidence: [metricEvidence({ previous: 94, current: 78, threshold: 85 })],
    signals: [metricSignal({ evidenceIds: ["ev.metric"] })],
    context: {
      temporalRefIso: "2026-08-08T12:00:00.000Z",
      threshold: { value: 85, operator: "less-than", field: "current" },
      rules: [thresholdRule()],
    },
    source: sourceRef(),
    scope: "object",
  });
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "threshold");
});

test("73. re-exported evaluatePriority works", () => {
  const chain = runFullChain();
  assert.ok(typeof chain.priority.priorityScore === "number");
  assert.ok(priorityBands.includes(chain.priority.priorityBand));
});

test("74. re-exported resolveAttention works", () => {
  const attention = resolveRuntimeExecutiveInsightAttention(
    "high",
    "high",
    "direct",
    "none",
    "visible",
  );
  assert.equal(attention, "focus");
});

test("75. re-exported resolvePresentation works", () => {
  const chain = runFullChain();
  assert.ok(
    chain.presentation.status === "eligible" ||
      chain.presentation.status === "restricted",
  );
  assert.ok(chain.presentation.descriptor);
  assert.equal(
    chain.presentation.descriptor?.presentationState,
    "report",
  );
});

test("76. re-exported orchestrate works", () => {
  const chain = runFullChain();
  assert.ok(
    chain.orchestration.status === "orchestrated" ||
      chain.orchestration.status === "restricted" ||
      chain.orchestration.status === "no-op",
  );
  assert.ok(Array.isArray(chain.orchestration.intents));
});

test("77. re-exported rankInsights works", () => {
  const chain = runFullChain();
  const ranked = rankRuntimeExecutiveInsights({
    collection: { candidates: [chain.resolution.candidate!] },
    context: {
      focusedSubjectId: "project.alpha",
    },
    policy: priorityPolicy(),
  });
  assert.ok(ranked.ranked.length >= 1);
});

test("78. full-chain flow succeeds", () => {
  const chain = runFullChain();
  assert.equal(chain.resolution.status, "resolved");
  assert.ok(chain.priority.priorityBand);
  assert.ok(chain.presentation.descriptor);
  assert.ok(chain.orchestration.intents.length >= 0);
});

test("79. full-chain deterministic across two runs", () => {
  const first = runFullChain();
  const second = runFullChain();
  assert.deepEqual(
    first.resolution.candidate?.candidateId,
    second.resolution.candidate?.candidateId,
  );
  assert.deepEqual(first.priority.priorityScore, second.priority.priorityScore);
  assert.deepEqual(
    first.presentation.descriptor,
    second.presentation.descriptor,
  );
  assert.deepEqual(first.orchestration.intents, second.orchestration.intents);
  assert.deepEqual(
    first.orchestration.reasonCodes,
    second.orchestration.reasonCodes,
  );
});

test("80. full-chain input immutability via freeze snapshots", () => {
  const primary = subject();
  const evidence = metricEvidence({ previous: 94, current: 78, threshold: 85 });
  const signal = metricSignal({ evidenceIds: ["ev.metric"] });
  const rule = thresholdRule();
  const input = Object.freeze({
    primarySubject: primary,
    relatedSubjects: Object.freeze([]),
    evidence: Object.freeze([evidence]),
    signals: Object.freeze([signal]),
    context: Object.freeze({
      temporalRefIso: "2026-08-08T12:00:00.000Z",
      threshold: Object.freeze({
        value: 85,
        operator: "less-than" as const,
        field: "current",
      }),
      rules: Object.freeze([rule]),
    }),
    source: sourceRef(),
    scope: "object" as const,
  });
  const before = freezeSnapshot(input);
  resolveRuntimeExecutiveInsight(input);
  const after = freezeSnapshot(input);
  assert.ok(equalFrozenSnapshots(before, after));
});

test("81. orchestration intents deterministic for same presentation", () => {
  const chain = runFullChain();
  const again = orchestrateRuntimeExecutiveInsightExperience({
    presentation: chain.presentation,
    eventKind: "insight-selected",
    experienceContext: Object.freeze({
      selectedSubjectId: "project.alpha",
      focusedSubjectId: "project.alpha",
      activeDecisionId: "decision.1",
      activeExecutionId: "execution.1",
      activeScenarioId: "scenario.1",
      activeProblemId: "problem.1",
      activePackId: "pack.1",
      activePresentationState: "report" as const,
    }),
    stageContext: Object.freeze({
      selectedStageSubjectId: "project.alpha",
      sceneRef: "scene.1",
    }),
    advisorContext: Object.freeze({
      currentAdvisorSubjectId: "project.alpha",
    }),
    sceneContext: Object.freeze({ sceneId: "scene.1" }),
    policy: createRuntimeExecutiveInsightExperienceOrchestrationPolicy({
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
    }),
  });
  assert.deepEqual(again.intents, chain.orchestration.intents);
});

test("82. platform does not rewrite presentation states", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(
    consumerGuarantees.includes("presentation-states-preserved"),
    true,
  );
  assert.equal(
    consumerGuarantees.includes("no-semantic-rewriting"),
    true,
  );
});

test("83. no React / JSX / useState / useEffect in source", () => {
  assert.doesNotMatch(source, /\buseState\b/);
  assert.doesNotMatch(source, /\buseEffect\b/);
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /return\s*\(\s*</);
  assert.doesNotMatch(source, /React\.(createElement|Fragment)/);
  assert.equal(boundary.reactIndependent, true);
  assert.equal(boundary.rendersUi, false);
});

test("84. no AI / LLM / prompt language in runtime behavior surface", () => {
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.ok(consumerGuarantees.includes("no-ai"));
  assert.ok(consumerGuarantees.includes("no-llm"));
  assert.doesNotMatch(source, /\bOpenAI\b|\bAnthropic\b|\bpromptTemplate\b/);
});

test("85. immutable registry repeated retrieval", () => {
  const a = getRuntimeExecutiveInsightExperiencePlatformRegistry();
  const b = getRuntimeExecutiveInsightExperiencePlatformRegistry();
  assert.equal(a, b);
  assert.throws(() => {
    (a as { sectionCount: number }).sectionCount = 0;
  });
});

test("86. immutable identity repeated retrieval", () => {
  const a = getRuntimeExecutiveInsightExperiencePlatformIdentity();
  const b = getRuntimeExecutiveInsightExperiencePlatformIdentity();
  assert.equal(a, b);
  assert.throws(() => {
    (a as { version: string }).version = "0.0.0";
  });
});

test("87. upstream verify orchestration green through platform re-export", () => {
  const result = verifyRuntimeExecutiveInsightExperienceOrchestration();
  assert.equal(result.ok, true);
  assert.equal(
    result.identity,
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration",
  );
});

test("88. platform verification counts match registries", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(result.capabilityCount, capabilities.length);
  assert.equal(result.exportCount, approvedExports.length);
  assert.equal(result.typeCount, publicTypes.length);
  assert.equal(result.apiCount, functionalApis.length);
  assert.equal(result.sectionCount, registrySections.length);
});

test("89. capability names have no duplicates", () => {
  assert.equal(new Set(capabilityNames).size, capabilityNames.length);
});

test("90. approved exports include upstream create/resolve/orchestrate APIs", () => {
  assert.ok(approvedExports.includes("createRuntimeExecutiveInsightSubjectContract"));
  assert.ok(approvedExports.includes("resolveRuntimeExecutiveInsight"));
  assert.ok(approvedExports.includes("evaluateRuntimeExecutiveInsightPriority"));
  assert.ok(approvedExports.includes("resolveRuntimeExecutiveInsightPresentation"));
  assert.ok(
    approvedExports.includes("orchestrateRuntimeExecutiveInsightExperience"),
  );
  assert.ok(
    approvedExports.includes("verifyRuntimeExecutiveInsightExperienceOrchestration"),
  );
});

test("91. source mentions only one import path string for modules", () => {
  const matches = [
    ...source.matchAll(/from\s+["']([^"']+)["']/g),
  ].map((match) => match[1]);
  assert.equal(matches.length, 1);
  assert.equal(
    matches[0],
    "@/app/lib/rex/runtimeExecutiveInsightExperienceOrchestration",
  );
});

test("92. platform Compatibility statuses are compatible|incompatible", () => {
  assert.deepEqual([...platform.Compatibility.statuses], [
    "compatible",
    "incompatible",
  ]);
});
