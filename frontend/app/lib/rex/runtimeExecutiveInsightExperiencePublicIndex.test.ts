import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES as approvedTypes,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS as freezeInvariants,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_COMPATIBILITY_API_NAMES as compatibilityApis,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_CERTIFICATION_NAMES as certificationApis,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_APPROVED_EXPORTS as publicIndexApprovedExports,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_INVARIANTS as publicIndexInvariants,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_SECTIONS as sections,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_VERIFICATION_CODES as verificationCodes,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES as validationApis,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS as publishedRuntimeSymbols,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES as attentionStates,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES as orchestrationStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES as experienceSurfaces,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS as priorityBands,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES as insightCategories,
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
  getRuntimeExecutiveInsightExperiencePublicIndexIdentity,
  getRuntimeExecutiveInsightExperiencePublicIndexRegistry,
  orchestrateRuntimeExecutiveInsightExperience,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightExperiencePublicIndexRelease,
  resolveRuntimeExecutiveInsightPresentation,
  runtimeExecutiveInsightExperiencePublicIndex as publicIndex,
  runtimeExecutiveInsightExperiencePublicIndexCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightExperiencePublicIndexModule as publicIndexModule,
  runtimeExecutiveInsightExperiencePublicIndexRegistry as registry,
  runtimeExecutiveInsightExperienceReleaseInformation as releaseInformation,
  verifyRuntimeExecutiveInsightExperiencePublicationCompleteness,
  verifyRuntimeExecutiveInsightExperiencePublicIndex,
} from "./runtimeExecutiveInsightExperiencePublicIndex.ts";

import {
  runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
  resolveRuntimeExecutiveInsight as resolveFromFreeze,
  verifyRuntimeExecutiveInsightExperienceCertificationFreeze,
} from "@/app/lib/rex/runtimeExecutiveInsightExperienceCertificationFreeze";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveInsightExperiencePublicIndex.ts",
    import.meta.url,
  ),
  "utf8",
);

const korToken = ["k", "o", "r"].join("");

function cloneSnapshot<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function runFullConsumerFlow() {
  const primary = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "project.alpha",
    kind: "nexora-object",
    label: "Project Alpha",
    scope: "object",
  });
  const sourceRef = createRuntimeExecutiveInsightSourceContract({
    kind: "runtime",
    sourceId: "runtime.1",
  });
  const evidence = createRuntimeExecutiveInsightEvidenceContract({
    evidenceId: "ev.metric",
    kind: "metric",
    source: sourceRef,
    subjectId: "project.alpha",
    payload: { previous: 94, current: 78, threshold: 85 },
    freshness: "current",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
  const signal = createRuntimeExecutiveInsightSignalContract({
    signalId: "sig.metric",
    kind: "metric",
    subjectId: "project.alpha",
    source: sourceRef,
    direction: "decreasing",
    confidence: 0.8,
    freshness: "current",
    evidenceIds: ["ev.metric"],
  });
  const rule = createRuntimeExecutiveInsightResolutionRule({
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
  });

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
    source: sourceRef,
    scope: "object",
  });
  const priority = evaluateRuntimeExecutiveInsightPriority({
    candidate: resolution.candidate!,
    context: {
      focusedSubjectId: primary.subjectId,
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
  const attention = resolveRuntimeExecutiveInsightAttention(
    priority.priorityBand,
    priority.urgency,
    priority.executiveRelevance,
    priority.escalationState,
    priority.suppressionState,
  );
  const presentation = resolveRuntimeExecutiveInsightPresentation({
    candidate: resolution.candidate!,
    priority,
    requestedState: "operation",
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
      activePresentationState: "operation" as const,
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

  return Object.freeze({
    primary,
    sourceRef,
    evidence,
    signal,
    rule,
    resolution,
    priority,
    attention,
    presentation,
    orchestration,
  });
}

test("1. exact identity", () => {
  assert.equal(
    publicIndexModule.identity,
    "REX-4:9/RuntimeExecutiveInsightExperiencePublicIndex",
  );
});

test("2. exact version", () => {
  assert.equal(publicIndexModule.version, "4.9.0");
});

test("3. exact namespace", () => {
  assert.equal(
    publicIndexModule.namespace,
    "nexora.rex.insight-experience.public-index",
  );
});

test("4. exact phase", () => {
  assert.equal(publicIndexModule.phase, "PublicIndex");
});

test("5. exact consumer role", () => {
  assert.equal(publicIndexModule.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(publicIndexModule.role, "SoleConsumerEntryPoint");
});

test("6. sole immediate dependency is REX-4:8", () => {
  assert.equal(
    publicIndexModule.upstreamDependency,
    "REX-4:8/RuntimeExecutiveInsightExperienceCertificationFreeze",
  );
  assert.equal(
    publicIndexModule.upstreamDependency,
    runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
  );
  assert.equal(
    publicIndexModule.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveInsightExperienceCertificationFreeze",
  );
});

test("7. no direct REX-4:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperienceFoundation["']/,
  );
});

test("8. no direct REX-4:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperienceContracts["']/,
  );
});

test("9. no direct REX-4:3 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightResolution["']/,
  );
});

test("10. no direct REX-4:4 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightPriorityAttention["']/,
  );
});

test("11. no direct REX-4:5 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightPresentation["']/,
  );
});

test("12. no direct REX-4:6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperienceOrchestration["']/,
  );
});

test("13. no direct REX-4:7 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperiencePlatform["']/,
  );
});

test("14. exact supported consumer import path", () => {
  assert.equal(
    publicIndexModule.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex",
  );
});

test("15. public index object exists", () => {
  assert.ok(publicIndex);
  assert.ok(Object.isFrozen(publicIndex));
});

test("16. exact nine namespace sections", () => {
  assert.equal(sections.length, 9);
  assert.equal(Object.keys(publicIndex).length, 9);
});

test("17. exact namespace section order", () => {
  assert.deepEqual([...sections], [
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ]);
  assert.deepEqual(Object.keys(publicIndex), [...sections]);
});

test("18. Identity section valid", () => {
  assert.equal(
    publicIndex.Identity.identity,
    "REX-4:9/RuntimeExecutiveInsightExperiencePublicIndex",
  );
  assert.equal(publicIndex.Identity.capability, "RuntimeExecutiveInsightExperience");
  assert.equal(publicIndex.Identity.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(
    publicIndex.Identity.soleImmediateDependency,
    "REX-4:8/RuntimeExecutiveInsightExperienceCertificationFreeze",
  );
});

test("19. PublicTypes section valid", () => {
  assert.ok(publicIndex.PublicTypes.typeCount > 0);
  assert.equal(publicIndex.PublicTypes.typeCount, publicTypes.length);
  assert.ok(publicIndex.PublicTypes.approvedPublicTypes.length > 0);
});

test("20. PublicAPIs section valid", () => {
  assert.ok(publicIndex.PublicAPIs.apiCount > 0);
  assert.equal(typeof publicIndex.PublicAPIs.resolveRuntimeExecutiveInsight, "function");
  assert.equal(
    typeof publicIndex.PublicAPIs.orchestrateRuntimeExecutiveInsightExperience,
    "function",
  );
});

test("21. Validation section valid", () => {
  assert.ok(publicIndex.Validation.validationApiCount > 0);
  assert.equal(
    typeof publicIndex.Validation.validateRuntimeExecutiveInsightContract,
    "function",
  );
});

test("22. Certification section valid", () => {
  assert.equal(publicIndex.Certification.certificationStatus, "Certified");
  assert.equal(publicIndex.Certification.freezeStatus, "Frozen");
  assert.equal(publicIndex.Certification.lockStatus, "Locked");
  assert.equal(publicIndex.Certification.failedCheckCount, 0);
});

test("23. ReleaseInformation section valid", () => {
  assert.equal(publicIndex.ReleaseInformation.releaseStatus, "Released");
  assert.equal(publicIndex.ReleaseInformation.stability, "Stable");
  assert.equal(publicIndex.ReleaseInformation.consumerReadiness, "ReadyForConsumer");
  assert.equal(publicIndex.ReleaseInformation.version, "4.9.0");
});

test("24. Compatibility section valid", () => {
  assert.equal(publicIndex.Compatibility.overallStatus, "Compatible");
  assert.ok(publicIndex.Compatibility.compatibilityApiCount > 0);
});

test("25. Registry section valid", () => {
  assert.equal(publicIndex.Registry.sectionCount, 9);
  assert.equal(publicIndex.Registry.approvedExportCount, approvedExports.length);
  assert.equal(
    publicIndex.Registry.presentationStateCount,
    presentationStates.length,
  );
});

test("26. ConsumerInformation section valid", () => {
  assert.equal(
    publicIndex.ConsumerInformation.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex",
  );
  assert.equal(publicIndex.ConsumerInformation.readiness, "ReadyForConsumer");
  assert.equal(publicIndex.ConsumerInformation.consumerRole, "SoleConsumerEntryPoint");
});

test("27. release status = Released", () => {
  assert.equal(publicIndexModule.releaseStatus, "Released");
});

test("28. certification status = Certified", () => {
  assert.equal(publicIndexModule.certificationStatus, "Certified");
});

test("29. compatibility status = Compatible", () => {
  assert.equal(publicIndexModule.compatibilityStatus, "Compatible");
});

test("30. freeze status = Frozen", () => {
  assert.equal(publicIndexModule.freezeStatus, "Frozen");
});

test("31. lock status = Locked", () => {
  assert.equal(publicIndexModule.lockStatus, "Locked");
});

test("32. stability = Stable", () => {
  assert.equal(publicIndexModule.stability, "Stable");
});

test("33. readiness = ReadyForConsumer", () => {
  assert.equal(publicIndexModule.consumerReadiness, "ReadyForConsumer");
});

test("34. role = SoleConsumerEntryPoint", () => {
  assert.equal(publicIndexModule.role, "SoleConsumerEntryPoint");
});

test("35. exact platform lock", () => {
  assert.equal(
    platformLock,
    "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(publicIndexModule.platformLock, platformLock);
});

test("36. approved export registry exists", () => {
  assert.ok(approvedExports.length > 0);
  assert.ok(publicIndexApprovedExports.length >= approvedExports.length);
});

test("37. approved export names unique", () => {
  assert.equal(new Set(approvedExports).size, approvedExports.length);
  assert.equal(
    new Set(publicIndexApprovedExports).size,
    publicIndexApprovedExports.length,
  );
});

test("38. approved frozen exports complete", () => {
  const completeness =
    verifyRuntimeExecutiveInsightExperiencePublicationCompleteness();
  assert.equal(completeness.ok, true);
  assert.equal(completeness.missingApprovedRuntimeSymbols.length, 0);
  for (const symbol of approvedExports) {
    assert.ok(
      (publishedRuntimeSymbols as readonly string[]).includes(symbol),
      `missing published runtime symbol: ${symbol}`,
    );
  }
});

test("39. unauthorized exports absent", () => {
  for (const symbol of publishedRuntimeSymbols) {
    assert.ok(
      (approvedExports as readonly string[]).includes(symbol),
      `unauthorized published symbol: ${symbol}`,
    );
  }
  assert.equal(boundary.publishesApprovedExportsOnly, true);
});

test("40. approved public types exposed", () => {
  for (const typeName of approvedTypes) {
    assert.ok(
      (publicTypes as readonly string[]).includes(typeName),
      `missing public type: ${typeName}`,
    );
  }
});

test("41. approved functional APIs exposed", () => {
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsight"));
  assert.ok(publicApis.includes("evaluateRuntimeExecutiveInsightPriority"));
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsightPresentation"));
  assert.ok(publicApis.includes("orchestrateRuntimeExecutiveInsightExperience"));
  assert.ok(publicApis.includes("certifyRuntimeExecutiveInsightExperiencePlatform"));
});

test("42. validation APIs exposed", () => {
  assert.ok(validationApis.includes("validateRuntimeExecutiveInsightContract"));
  assert.ok(validationApis.includes("validateRuntimeExecutiveInsightExperiencePlatform"));
});

test("43. compatibility APIs exposed", () => {
  assert.ok(
    compatibilityApis.includes("verifyRuntimeExecutiveInsightExperienceCompatibility"),
  );
});

test("44. certification verification exposed", () => {
  assert.ok(
    certificationApis.includes(
      "verifyRuntimeExecutiveInsightExperienceCertificationFreeze",
    ),
  );
  assert.ok(
    certificationApis.includes("certifyRuntimeExecutiveInsightExperiencePlatform"),
  );
});

test("45. Public Index verification exposed", () => {
  assert.ok(
    publicApis.includes("verifyRuntimeExecutiveInsightExperiencePublicIndex"),
  );
  assert.equal(typeof verifyRuntimeExecutiveInsightExperiencePublicIndex, "function");
});

test("46. Public Index verification succeeds", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePublicIndex();
  assert.equal(result.status, "verified");
  assert.equal(result.ok, true);
});

test("47. verification counts correct", () => {
  const result = verifyRuntimeExecutiveInsightExperiencePublicIndex();
  assert.equal(result.totalCheckCount, verificationCodes.length);
  assert.equal(result.passedCheckCount, verificationCodes.length);
  assert.equal(result.failedCheckCount, 0);
  assert.equal(
    result.passedCheckCount + result.failedCheckCount,
    result.totalCheckCount,
  );
});

test("48. verification code order deterministic", () => {
  assert.deepEqual([...verificationCodes], [
    "public-index-identity-valid",
    "public-index-version-valid",
    "public-index-namespace-valid",
    "sole-dependency-valid",
    "consumer-import-path-valid",
    "namespace-sections-valid",
    "public-types-valid",
    "public-apis-valid",
    "validation-surface-valid",
    "certification-surface-valid",
    "release-information-valid",
    "compatibility-valid",
    "registry-valid",
    "consumer-information-valid",
    "approved-exports-complete",
    "unauthorized-exports-absent",
    "release-status-valid",
    "certification-status-valid",
    "freeze-status-valid",
    "lock-status-valid",
    "stability-valid",
    "consumer-readiness-valid",
    "platform-lock-valid",
    "registry-counts-valid",
    "consumer-guarantees-valid",
  ]);
  const result = verifyRuntimeExecutiveInsightExperiencePublicIndex();
  assert.deepEqual(
    result.checks.map((entry) => entry.code),
    [...verificationCodes],
  );
});

test("49. public registry counts derived correctly", () => {
  assert.equal(registry.sectionCount, sections.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, publicApis.length);
  assert.equal(registry.validationApiCount, validationApis.length);
  assert.equal(registry.certificationApiCount, certificationApis.length);
  assert.equal(registry.compatibilityApiCount, compatibilityApis.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.insightCategoryCount, insightCategories.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.resolutionStatusCount, resolutionStatuses.length);
  assert.equal(registry.priorityBandCount, priorityBands.length);
  assert.equal(registry.attentionStateCount, attentionStates.length);
  assert.equal(registry.orchestrationStatusCount, orchestrationStatuses.length);
  assert.equal(registry.experienceSurfaceCount, experienceSurfaces.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
});

test("50. consumer guarantees exist", () => {
  assert.ok(consumerGuarantees.length >= 24);
  assert.ok(consumerGuarantees.some((g) => g.id === "sole-supported-rex-4-entry"));
  assert.ok(
    consumerGuarantees.some((g) => g.id === "semantic-equivalence-with-rex-4-8"),
  );
});

test("51. consumer guarantees immutable", () => {
  assert.ok(Object.isFrozen(consumerGuarantees));
  for (const entry of consumerGuarantees) {
    assert.ok(Object.isFrozen(entry));
  }
});

test("52. exact Minimum/Report/Operation preserved", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
});

test("53. no extra presentation state", () => {
  assert.equal(presentationStates.length, 3);
  assert.equal(
    new Set(presentationStates).size,
    presentationStates.length,
  );
});

test("54. insight-category surface preserved", () => {
  assert.ok(insightCategories.includes("threshold"));
  assert.ok(insightCategories.includes("risk"));
  assert.ok(insightCategories.includes("attention"));
  assert.equal(registry.insightCategoryCount, insightCategories.length);
});

test("55. subject-kind surface preserved", () => {
  for (const kind of [
    "nexora-object",
    "kpi",
    "koi",
    "goal",
    "problem",
    "scenario",
    "decision",
    "execution",
    "pack",
    "connection",
    "scene",
  ]) {
    assert.ok((subjectKinds as readonly string[]).includes(kind), kind);
  }
});

test("56. resolution surface preserved", () => {
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsight"));
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsights"));
  assert.ok(resolutionStatuses.includes("resolved"));
});

test("57. priority surface preserved", () => {
  assert.ok(publicApis.includes("evaluateRuntimeExecutiveInsightPriority"));
  assert.ok(priorityBands.includes("critical"));
});

test("58. ranking surface preserved", () => {
  assert.ok(publicApis.includes("rankRuntimeExecutiveInsights"));
});

test("59. attention surface preserved", () => {
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsightAttention"));
  assert.ok(attentionStates.includes("urgent"));
});

test("60. presentation surface preserved", () => {
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsightPresentation"));
  assert.ok(publicApis.includes("resolveRuntimeExecutiveInsightInteractions"));
});

test("61. orchestration surface preserved", () => {
  assert.ok(publicApis.includes("orchestrateRuntimeExecutiveInsightExperience"));
  assert.ok(orchestrationStatuses.includes("orchestrated"));
});

test("62. Stage context surface preserved", () => {
  assert.ok(experienceSurfaces.includes("stage-context"));
});

test("63. Advisor context surface preserved", () => {
  assert.ok(experienceSurfaces.includes("advisor-context"));
});

test("64. scene context surface preserved", () => {
  assert.ok(experienceSurfaces.includes("scene-context"));
});

test("65. related context surfaces preserved", () => {
  for (const surface of [
    "evidence-context",
    "relationship-context",
    "pack-context",
    "decision-context",
    "execution-context",
    "scenario-context",
    "problem-context",
  ]) {
    assert.ok((experienceSurfaces as readonly string[]).includes(surface), surface);
  }
});

test("66. severity ≠ priority invariant preserved", () => {
  assert.ok(freezeInvariants.some((entry) => entry.id === "severity-not-priority"));
});

test("67. importance ≠ priority invariant preserved", () => {
  assert.ok(freezeInvariants.some((entry) => entry.id === "importance-not-priority"));
});

test("68. attention ≠ focus invariant preserved", () => {
  assert.ok(freezeInvariants.some((entry) => entry.id === "attention-not-focus"));
});

test("69. selection ≠ focus invariant preserved", () => {
  assert.ok(freezeInvariants.some((entry) => entry.id === "selection-not-focus"));
});

test("70. operation ≠ action execution invariant preserved", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "operation-not-action-execution"),
  );
});

test("71. insight ≠ recommendation invariant preserved", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "insight-not-recommendation"),
  );
});

test("72. KPI semantics preserved", () => {
  assert.ok(freezeInvariants.some((entry) => entry.id === "kpi-structured-context-only"));
  assert.match(
    freezeInvariants.find((entry) => entry.id === "kpi-structured-context-only")!
      .reference,
    /Key Performance Indicator/,
  );
  assert.equal(boundary.calculatesKpi, false);
});

test("73. KOI semantics preserved", () => {
  assert.ok(freezeInvariants.some((entry) => entry.id === "koi-structured-context-only"));
  assert.match(
    freezeInvariants.find((entry) => entry.id === "koi-structured-context-only")!
      .reference,
    /Key Output Index/,
  );
  assert.equal(boundary.calculatesKoi, false);
});

test("74. KOR absent", () => {
  assert.equal(
    (subjectKinds as readonly string[]).includes(korToken),
    false,
  );
  assert.equal(
    (insightCategories as readonly string[]).includes(korToken),
    false,
  );
  assert.equal(
    (approvedExports as readonly string[]).some((name) =>
      name.toLowerCase().split(/[^a-z0-9]+/).includes(korToken),
    ),
    false,
  );
  assert.equal(
    (publicApis as readonly string[]).some((name) =>
      name.toLowerCase().split(/[^a-z0-9]+/).includes(korToken),
    ),
    false,
  );
  assert.equal(boundary.introducesKor, false);
  assert.ok(consumerGuarantees.some((entry) => entry.id === "kor-prohibition"));
  assert.ok(publicIndexInvariants.some((entry) => entry.id === "kor-absent"));
});

test("75. no KPI calculation", () => {
  assert.doesNotMatch(source, /\bcalculateKpi\b/i);
  assert.equal(boundary.calculatesKpi, false);
});

test("76. no KOI calculation", () => {
  assert.doesNotMatch(source, /\bcalculateKoi\b/i);
  assert.equal(boundary.calculatesKoi, false);
});

test("77. no AI/LLM", () => {
  assert.doesNotMatch(source, /from\s+["'][^"']*(openai|anthropic|llm)[^"']*["']/i);
  assert.equal(boundary.aiProviderIndependent, true);
});

test("78. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /\b(ReactNode|useEffect|useState)\b/);
  assert.equal(boundary.reactIndependent, true);
});

test("79. no renderer dependency", () => {
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.rendersUi, false);
});

test("80. no private DRI import", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/dri\//);
  assert.equal(boundary.importsDriDirectly, false);
});

test("81. no private NOL import", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/nol\//);
  assert.equal(boundary.importsNolDirectly, false);
});

test("82. no persistence", () => {
  assert.doesNotMatch(source, /\b(localStorage|indexedDB|fs\.write)\b/);
  assert.equal(boundary.introducesPersistence, false);
});

test("83. no external access", () => {
  assert.doesNotMatch(source, /\b(fetch\(|WebSocket|graphql)\b/i);
  assert.equal(boundary.introducesExternalIntegration, false);
});

test("84. no automation", () => {
  assert.equal(boundary.introducesAutomation, false);
  assert.doesNotMatch(source, /\b(scheduleWorkflow|sendNotification|approveDecision)\b/);
});

test("85. no unfreeze API", () => {
  assert.doesNotMatch(source, /\bunfreeze\b/i);
});

test("86. no unlock API", () => {
  assert.doesNotMatch(source, /\bfunction\s+unlock|\bunlockRuntime|\bunlockPlatform\b/);
});

test("87. no certification override", () => {
  assert.doesNotMatch(source, /\b(forceCertified|skipChecks|bypassCertification)\b/);
});

test("88. full consumer flow using only REX-4:9", () => {
  const flow = runFullConsumerFlow();
  assert.ok(flow.resolution.candidate);
  assert.ok(flow.priority);
  assert.ok(flow.attention);
  assert.ok(flow.presentation);
  assert.ok(flow.orchestration);
});

test("89. full consumer flow deterministic repeat", () => {
  assert.deepEqual(runFullConsumerFlow(), runFullConsumerFlow());
});

test("90. full consumer flow input immutability", () => {
  const primary = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "project.alpha",
    kind: "nexora-object",
    label: "Project Alpha",
    scope: "object",
  });
  const sourceRef = createRuntimeExecutiveInsightSourceContract({
    kind: "runtime",
    sourceId: "runtime.1",
  });
  const evidence = createRuntimeExecutiveInsightEvidenceContract({
    evidenceId: "ev.metric",
    kind: "metric",
    source: sourceRef,
    subjectId: "project.alpha",
    payload: { previous: 94, current: 78, threshold: 85 },
    freshness: "current",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
  const signal = createRuntimeExecutiveInsightSignalContract({
    signalId: "sig.metric",
    kind: "metric",
    subjectId: "project.alpha",
    source: sourceRef,
    direction: "decreasing",
    confidence: 0.8,
    freshness: "current",
    evidenceIds: ["ev.metric"],
  });
  const before = {
    primary: cloneSnapshot(primary),
    sourceRef: cloneSnapshot(sourceRef),
    evidence: cloneSnapshot(evidence),
    signal: cloneSnapshot(signal),
  };
  runFullConsumerFlow();
  assert.deepEqual(primary, before.primary);
  assert.deepEqual(sourceRef, before.sourceRef);
  assert.deepEqual(evidence, before.evidence);
  assert.deepEqual(signal, before.signal);
});

test("91. semantic equivalence with frozen APIs", () => {
  assert.equal(resolveRuntimeExecutiveInsight, resolveFromFreeze);
  assert.doesNotMatch(source, /function\s+resolveRuntimeExecutiveInsight\s*\(/);
  assert.doesNotMatch(
    source,
    /function\s+orchestrateRuntimeExecutiveInsightExperience\s*\(/,
  );
});

test("92. identity retrieval deterministic", () => {
  assert.deepEqual(
    getRuntimeExecutiveInsightExperiencePublicIndexIdentity(),
    getRuntimeExecutiveInsightExperiencePublicIndexIdentity(),
  );
  assert.deepEqual(
    getRuntimeExecutiveInsightExperiencePublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("93. registry retrieval deterministic", () => {
  assert.deepEqual(
    getRuntimeExecutiveInsightExperiencePublicIndexRegistry(),
    getRuntimeExecutiveInsightExperiencePublicIndexRegistry(),
  );
  assert.equal(
    getRuntimeExecutiveInsightExperiencePublicIndexRegistry(),
    registry,
  );
});

test("94. Public Index verification deterministic", () => {
  const first = verifyRuntimeExecutiveInsightExperiencePublicIndex();
  const second = verifyRuntimeExecutiveInsightExperiencePublicIndex();
  assert.deepEqual(first, second);
});

test("95. release information immutable", () => {
  assert.ok(Object.isFrozen(releaseInformation));
  assert.ok(Object.isFrozen(publicIndex.ReleaseInformation));
});

test("96. registry immutable", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(publicIndex.Registry));
});

test("97. no hidden runtime state", () => {
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bcrypto\.randomUUID\b/);
});

test("98. no semantic wrapper drift", () => {
  assert.equal(boundary.introducesInsightBehavior, false);
  assert.equal(publicIndexModule.introducesInsightBehavior, false);
  assert.equal(resolveRuntimeExecutiveInsight, resolveFromFreeze);
});

test("99. ReadyForPublicIndex not used as final consumer readiness", () => {
  assert.equal(publicIndexModule.consumerReadiness, "ReadyForConsumer");
  assert.notEqual(publicIndexModule.consumerReadiness, "ReadyForPublicIndex");
  assert.equal(publicIndex.ConsumerInformation.readiness, "ReadyForConsumer");
  assert.equal(
    publicIndex.Certification.readinessDisplay,
    "ReadyForPublicIndex",
  );
});

test("100. final complete status equals Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer", () => {
  assert.equal(
    publicIndexModule.architecturalStatus,
    "REX-4:9 Runtime Executive Insight Experience Public Index — Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer",
  );
  assert.equal(publicIndexModule.releaseStatus, "Released");
  assert.equal(publicIndexModule.certificationStatus, "Certified");
  assert.equal(publicIndexModule.compatibilityStatus, "Compatible");
  assert.equal(publicIndexModule.freezeStatus, "Frozen");
  assert.equal(publicIndexModule.lockStatus, "Locked");
  assert.equal(publicIndexModule.stability, "Stable");
  assert.equal(publicIndexModule.consumerReadiness, "ReadyForConsumer");
});

test("101. architectural sole import from CertificationFreeze only", () => {
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightExperienceCertificationFreeze",
  ]);
  assert.equal(boundary.consumesCertificationFreezeOnly, true);
  assert.equal(boundary.importsPlatformDirectly, false);
  assert.equal(boundary.importsOrchestrationDirectly, false);
  assert.equal(boundary.importsRex47Directly, false);
});

test("102. type-only imports also respect REX-4:8 boundary", () => {
  const typeFromClauses = [
    ...source.matchAll(/export type\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']/g),
  ].map((match) => match[1]);
  assert.ok(typeFromClauses.length > 0);
  assert.ok(
    typeFromClauses.every(
      (path) =>
        path ===
        "@/app/lib/rex/runtimeExecutiveInsightExperienceCertificationFreeze",
    ),
  );
});

test("103. no private REX-2/REX-3 module imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Stage|Advisor)/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabled/,
  );
});

test("104. forceReleaseFailure fail-closed", () => {
  const failed = resolveRuntimeExecutiveInsightExperiencePublicIndexRelease({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "Unreleased");
  assert.equal(failed.consumerReadiness, "NotReadyForConsumer");
  assert.equal(failed.gatePassed, false);
});

test("105. public index invariants registry complete", () => {
  assert.equal(publicIndexInvariants.length, 24);
  assert.ok(Object.isFrozen(publicIndexInvariants));
  assert.ok(
    publicIndexInvariants.some((entry) => entry.id === "sole-dependency-rex-4-8"),
  );
  assert.ok(publicIndexInvariants.some((entry) => entry.id === "kor-absent"));
});

test("106. freeze verification remains healthy through public surface", () => {
  assert.equal(
    verifyRuntimeExecutiveInsightExperienceCertificationFreeze().ok,
    true,
  );
});
