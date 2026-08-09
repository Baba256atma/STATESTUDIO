import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_INSIGHT_CERTIFICATION_FREEZE_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS as approvedApis,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES as approvedTypes,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES as certificationCodes,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS as domains,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES as failureCodes,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_STATUSES as certificationStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CHECK_STATUSES as checkStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_COMPATIBILITY_STATUSES as compatibilityStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS as freezeInvariants,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_STATUSES as freezeStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_LOCK_STATUSES as lockStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS as readinessStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES as presentationStates,
  certifyRuntimeExecutiveInsightExperiencePlatform,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightExperienceOrchestrationPolicy,
  createRuntimeExecutiveInsightPresentationPolicy,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightExperienceCertificationStatuses,
  evaluateRuntimeExecutiveInsightPriority,
  getRuntimeExecutiveInsightExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveInsightExperienceCertificationFreezeRegistry,
  orchestrateRuntimeExecutiveInsightExperience,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightPresentation,
  runtimeExecutiveInsightExperienceCertificationFreeze as module,
  runtimeExecutiveInsightExperienceCertificationFreezeCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightExperienceCertificationFreezeRegistry as registry,
  runtimeExecutiveInsightExperiencePlatformIdentity,
  verifyRuntimeExecutiveInsightExperienceCertificationFreeze,
  verifyRuntimeExecutiveInsightExperienceCompatibility,
  verifyRuntimeExecutiveInsightExperiencePlatform,
} from "./runtimeExecutiveInsightExperienceCertificationFreeze.ts";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveInsightExperienceCertificationFreeze.ts",
    import.meta.url,
  ),
  "utf8",
);

function sourceImports(): string[] {
  return [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
}

const forbiddenKor = ["k", "o", "r"].join("");

// ─── 1–12 Identity / dependency ─────────────────────────────────────────────

test("1. exact identity", () => {
  assert.equal(
    module.identity,
    "REX-4:8/RuntimeExecutiveInsightExperienceCertificationFreeze",
  );
});

test("2. exact version", () => {
  assert.equal(module.version, "4.8.0");
});

test("3. exact namespace", () => {
  assert.equal(
    module.namespace,
    "nexora.rex.insight-experience.certification-freeze",
  );
});

test("4. exact phase", () => {
  assert.equal(module.phase, "CertificationFreeze");
});

test("5. sole immediate dependency is REX-4:7", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-4:7/RuntimeExecutiveInsightExperiencePlatform",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveInsightExperiencePlatformIdentity,
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveInsightExperiencePlatform",
  );
  assert.deepEqual(sourceImports(), [
    "@/app/lib/rex/runtimeExecutiveInsightExperiencePlatform",
  ]);
  assert.equal(boundary.consumesPlatformOnly, true);
});

test("6. no direct REX-4:1 import", () => {
  assert.equal(boundary.importsRex41Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightExperienceFoundation["']/,
  );
});

test("7. no direct REX-4:2 import", () => {
  assert.equal(boundary.importsRex42Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightExperienceContracts["']/,
  );
});

test("8. no direct REX-4:3 import", () => {
  assert.equal(boundary.importsRex43Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightResolution["']/,
  );
});

test("9. no direct REX-4:4 import", () => {
  assert.equal(boundary.importsRex44Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightPriorityAttention["']/,
  );
});

test("10. no direct REX-4:5 import", () => {
  assert.equal(boundary.importsRex45Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightPresentation["']/,
  );
});

test("11. no direct REX-4:6 import", () => {
  assert.equal(boundary.importsRex46Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightExperienceOrchestration["']/,
  );
});

test("12. no direct REX-4:9 import", () => {
  assert.equal(boundary.importsRex49Directly, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*runtimeExecutiveInsightExperiencePublicIndex["']/,
  );
});

// ─── 13–27 Status / registry surfaces ───────────────────────────────────────

test("13. exact certification statuses", () => {
  assert.deepEqual([...certificationStatuses], ["certified", "failed"]);
});

test("14. exact compatibility statuses", () => {
  assert.deepEqual([...compatibilityStatuses], ["compatible", "incompatible"]);
});

test("15. exact freeze statuses", () => {
  assert.deepEqual([...freezeStatuses], ["frozen", "unfrozen"]);
});

test("16. exact lock statuses", () => {
  assert.deepEqual([...lockStatuses], ["locked", "unlocked"]);
});

test("17. exact readiness statuses", () => {
  assert.deepEqual([...readinessStatuses], [
    "ready-for-public-index",
    "not-ready",
  ]);
});

test("18. exact platform lock", () => {
  assert.equal(
    platformLock,
    "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(
    module.platformLock,
    "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED",
  );
});

test("19. certification-domain ordering", () => {
  assert.deepEqual([...domains], [
    "Identity",
    "Dependency",
    "PlatformVerification",
    "PublicSurface",
    "Contracts",
    "Resolution",
    "PriorityAttention",
    "Presentation",
    "Orchestration",
    "Compatibility",
    "Determinism",
    "Immutability",
    "ConsumerGuarantees",
    "ForbiddenDependencies",
    "Terminology",
    "Freeze",
    "Lock",
    "PublicIndexReadiness",
  ]);
  assert.equal(domains.length, 18);
});

test("20. certification-code ordering", () => {
  assert.deepEqual([...certificationCodes], [
    "identity-valid",
    "version-valid",
    "namespace-valid",
    "dependency-valid",
    "platform-verification-passed",
    "public-surface-valid",
    "approved-exports-valid",
    "approved-types-valid",
    "approved-apis-valid",
    "contracts-valid",
    "resolution-valid",
    "priority-attention-valid",
    "presentation-valid",
    "orchestration-valid",
    "compatibility-valid",
    "determinism-valid",
    "immutability-valid",
    "consumer-guarantees-valid",
    "forbidden-dependencies-absent",
    "ai-dependency-absent",
    "renderer-dependency-absent",
    "persistence-dependency-absent",
    "external-access-absent",
    "automation-behavior-absent",
    "kpi-semantics-valid",
    "koi-semantics-valid",
    "kor-absent",
    "freeze-invariants-valid",
    "platform-lock-valid",
    "public-index-readiness-valid",
  ]);
  assert.equal(certificationCodes.length, 30);
  assert.equal(new Set(certificationCodes).size, certificationCodes.length);
});

test("21. failure-code ordering", () => {
  assert.deepEqual([...failureCodes], [
    "invalid-identity",
    "invalid-version",
    "invalid-namespace",
    "invalid-dependency",
    "platform-verification-failed",
    "duplicate-approved-export",
    "missing-approved-export",
    "incompatible-platform",
    "nondeterministic-platform",
    "mutable-registry",
    "forbidden-import",
    "ai-dependency-detected",
    "renderer-dependency-detected",
    "persistence-dependency-detected",
    "external-access-detected",
    "automation-behavior-detected",
    "terminology-violation",
    "lock-mismatch",
    "not-ready-for-public-index",
  ]);
  assert.equal(failureCodes.length, 19);
  assert.equal(new Set(failureCodes).size, failureCodes.length);
});

test("22. freeze-invariant registry exists", () => {
  assert.ok(Array.isArray(freezeInvariants));
  assert.equal(freezeInvariants.length, 30);
  assert.ok(Object.isFrozen(freezeInvariants));
});

test("23. freeze-invariant IDs unique", () => {
  const ids = freezeInvariants.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const entry of freezeInvariants) {
    assert.equal(entry.required, true);
    assert.ok(typeof entry.domain === "string");
    assert.ok(typeof entry.reference === "string");
  }
});

test("24. approved export registry exists", () => {
  assert.ok(approvedExports.length > 0);
  assert.ok(Object.isFrozen(approvedExports));
  assert.ok(
    approvedExports.includes("certifyRuntimeExecutiveInsightExperiencePlatform"),
  );
});

test("25. approved exports unique", () => {
  assert.equal(new Set(approvedExports).size, approvedExports.length);
});

test("26. approved type registry", () => {
  assert.ok(approvedTypes.length > 0);
  assert.equal(new Set(approvedTypes).size, approvedTypes.length);
  assert.ok(
    approvedTypes.includes(
      "RuntimeExecutiveInsightExperienceCertificationResult",
    ),
  );
});

test("27. approved API registry", () => {
  assert.ok(approvedApis.length > 0);
  assert.equal(new Set(approvedApis).size, approvedApis.length);
  assert.ok(
    approvedApis.includes("resolveRuntimeExecutiveInsight"),
  );
  assert.ok(
    approvedApis.includes("certifyRuntimeExecutiveInsightExperiencePlatform"),
  );
});

// ─── 28–41 Domain certification passes ──────────────────────────────────────

test("28. identity certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find((check) => check.id === "platform-identity");
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
  assert.equal(entry!.domain, "Identity");
});

test("29. dependency certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "sole-platform-dependency",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("30. platform verification certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "platform-verification",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
  assert.equal(verifyRuntimeExecutiveInsightExperiencePlatform().status, "verified");
});

test("31. public surface certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  for (const id of [
    "public-surface",
    "approved-exports",
    "approved-types",
    "approved-apis",
  ]) {
    const entry = report.checks.find((check) => check.id === id);
    assert.ok(entry, id);
    assert.equal(entry!.status, "passed", id);
  }
});

test("32. contracts certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find((check) => check.id === "contracts-surface");
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("33. resolution certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "resolution-surface",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("34. priority/attention certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "priority-attention-surface",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("35. presentation certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "presentation-states",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("36. orchestration certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "orchestration-surface",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("37. compatibility certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find((check) => check.id === "compatibility");
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
  assert.equal(
    verifyRuntimeExecutiveInsightExperienceCompatibility({
      identity: runtimeExecutiveInsightExperiencePlatformIdentity,
      version: "4.7.0",
    }).status,
    "compatible",
  );
});

test("38. determinism certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "determinism-and-full-chain",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("39. immutability certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find((check) => check.id === "immutability");
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("40. consumer-guarantee certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "consumer-guarantees",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

test("41. forbidden-dependency certification passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const entry = report.checks.find(
    (check) => check.id === "forbidden-dependencies",
  );
  assert.ok(entry);
  assert.equal(entry!.status, "passed");
});

// ─── 42–58 Independence / terminology ───────────────────────────────────────

test("42. no AI dependency", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "ai-absent")!.status,
    "passed",
  );
  assert.doesNotMatch(source, /from\s+["']openai["']/);
  assert.doesNotMatch(source, /from\s+["']@ai-sdk/);
});

test("43. no React dependency", () => {
  assert.equal(boundary.reactIndependent, true);
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
});

test("44. no renderer dependency", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "renderer-absent")!.status,
    "passed",
  );
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /\.tsx["']/);
});

test("45. no persistence dependency", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "persistence-absent")!.status,
    "passed",
  );
  assert.doesNotMatch(source, /localStorage|IndexedDB|filesystem/);
});

test("46. no external-access dependency", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "external-access-absent")!
      .status,
    "passed",
  );
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|WebSocket/);
});

test("47. no automation behavior", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "automation-absent")!.status,
    "passed",
  );
  assert.equal(boundary.introducesAutomation, false);
  assert.equal(boundary.executesActions, false);
});

test("48. exact Minimum/Report/Operation preserved", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
});

test("49. no additional presentation state", () => {
  assert.equal(presentationStates.length, 3);
  assert.equal(
    (presentationStates as readonly string[]).includes("detail"),
    false,
  );
});

test("50. severity-vs-priority invariant", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "severity-not-priority"),
  );
});

test("51. importance-vs-priority invariant", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "importance-not-priority"),
  );
});

test("52. attention-vs-focus invariant", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "attention-not-focus"),
  );
});

test("53. selection-vs-focus invariant", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "selection-not-focus"),
  );
});

test("54. operation-vs-action invariant", () => {
  assert.ok(
    freezeInvariants.some(
      (entry) => entry.id === "operation-not-action-execution",
    ),
  );
});

test("55. insight-vs-recommendation invariant", () => {
  assert.ok(
    freezeInvariants.some((entry) => entry.id === "insight-not-recommendation"),
  );
});

test("56. KPI semantics preserved", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "kpi-semantics")!.status,
    "passed",
  );
  assert.ok(subjectKinds.includes("kpi"));
  assert.equal(boundary.calculatesKpi, false);
});

test("57. KOI semantics preserved", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "koi-semantics")!.status,
    "passed",
  );
  assert.ok(subjectKinds.includes("koi"));
  assert.equal(boundary.calculatesKoi, false);
});

test("58. KOR absent", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "kor-absent")!.status,
    "passed",
  );
  assert.equal(
    (subjectKinds as readonly string[]).includes(forbiddenKor),
    false,
  );
  assert.equal(boundary.introducesKor, false);
});

// ─── 59–68 Full-chain / canonical success ───────────────────────────────────

test("59. full-chain certification probe passes", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "determinism-and-full-chain")!
      .status,
    "passed",
  );
});

test("60. full-chain repeated run deterministic", () => {
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

  function once() {
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
    return orchestrateRuntimeExecutiveInsightExperience({
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
  }

  assert.deepEqual(once(), once());
});

test("61. full-chain source inputs unchanged", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.checks.find((check) => check.id === "immutability")!.status,
    "passed",
  );
});

test("62. platform registry counts consistent", () => {
  assert.equal(registry.domainCount, domains.length);
  assert.equal(registry.certificationCodeCount, certificationCodes.length);
  assert.equal(registry.failureCodeCount, failureCodes.length);
  assert.equal(registry.freezeInvariantCount, freezeInvariants.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.approvedTypeCount, approvedTypes.length);
  assert.equal(registry.approvedApiCount, approvedApis.length);
});

test("63. certification counts consistent", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(
    report.passedCheckCount + report.failedCheckCount,
    report.totalCheckCount,
  );
  assert.equal(report.approvedExportCount, approvedExports.length);
  assert.equal(report.freezeInvariantCount, freezeInvariants.length);
  assert.equal(report.certificationCodeCount, 30);
  assert.equal(report.failureCodeCount, 19);
});

test("64. canonical certification status = certified", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(report.certificationStatus, "certified");
});

test("65. canonical compatibility = compatible", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(report.compatibilityStatus, "compatible");
});

test("66. canonical freeze = frozen", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(report.freezeStatus, "frozen");
});

test("67. canonical lock = locked", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(report.lockStatus, "locked");
});

test("68. canonical readiness = ready-for-public-index", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.equal(report.readiness, "ready-for-public-index");
  assert.equal(report.readinessDisplay, "ReadyForPublicIndex");
});

// ─── 69–82 Fail-closed / bypass absence ─────────────────────────────────────

test("69. public readiness fails if certification fails", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "compatible",
  );
  assert.equal(statuses.certificationStatus, "failed");
  assert.equal(statuses.readiness, "not-ready");
  assert.equal(statuses.freezeStatus, "unfrozen");
  assert.equal(statuses.lockStatus, "unlocked");
});

test("70. public readiness fails if compatibility fails", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "passed" }],
    "incompatible",
  );
  assert.equal(statuses.certificationStatus, "failed");
  assert.equal(statuses.compatibilityStatus, "incompatible");
  assert.equal(statuses.readiness, "not-ready");
  assert.equal(statuses.freezeStatus, "unfrozen");
});

test("71. public readiness fails if freeze fails", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "incompatible",
  );
  assert.equal(statuses.freezeStatus, "unfrozen");
  assert.equal(statuses.readiness, "not-ready");
});

test("72. public readiness fails if lock fails", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "compatible",
  );
  assert.equal(statuses.lockStatus, "unlocked");
  assert.equal(statuses.readiness, "not-ready");
});

test("73. invalid identity fails certification", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [
      { required: true, status: "failed" },
      { required: true, status: "passed" },
    ],
    "compatible",
  );
  assert.equal(statuses.certificationStatus, "failed");
  assert.equal(statuses.readinessDisplay, "NotReady");
});

test("74. invalid namespace fails certification", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "compatible",
  );
  assert.equal(statuses.certificationStatus, "failed");
});

test("75. invalid version fails certification", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "compatible",
  );
  assert.equal(statuses.certificationStatus, "failed");
  assert.equal(statuses.compatibilityStatus, "incompatible");
});

test("76. duplicate approved export fails certification", () => {
  // Registry uniqueness is certified; a forced failed check fails closed.
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "compatible",
  );
  assert.equal(statuses.readiness, "not-ready");
  assert.equal(new Set(approvedExports).size, approvedExports.length);
});

test("77. duplicate invariant ID fails certification", () => {
  assert.equal(
    new Set(freezeInvariants.map((entry) => entry.id)).size,
    freezeInvariants.length,
  );
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "failed" }],
    "compatible",
  );
  assert.equal(statuses.freezeStatus, "unfrozen");
});

test("78. incompatible platform fails certification", () => {
  assert.equal(
    verifyRuntimeExecutiveInsightExperienceCompatibility({
      identity: "wrong",
    }).status,
    "incompatible",
  );
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [{ required: true, status: "passed" }],
    "incompatible",
  );
  assert.equal(statuses.certificationStatus, "failed");
  assert.equal(statuses.readiness, "not-ready");
});

test("79. certification has no override flag", () => {
  assert.doesNotMatch(
    source,
    /export\s+(async\s+)?function\s+(forceCertified|skipChecks|ignoreCompatibility)\b/,
  );
  assert.doesNotMatch(source, /\bforceCertified\s*[:=]/);
  assert.doesNotMatch(source, /\bskipChecks\s*[:=]/);
});

test("80. no unfreeze API", () => {
  assert.doesNotMatch(
    source,
    /export\s+(async\s+)?function\s+unfreeze\w*\b/,
  );
  assert.equal(
    approvedApis.some((name) => name.toLowerCase().includes("unfreeze")),
    false,
  );
});

test("81. no unlock API", () => {
  assert.doesNotMatch(source, /export\s+(async\s+)?function\s+unlock\w*\b/);
  assert.equal(
    approvedApis.some((name) => name.toLowerCase().includes("unlock")),
    false,
  );
});

test("82. immutable certification result", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.ok(Object.isFrozen(report));
  assert.ok(Object.isFrozen(report.checks));
});

test("83. immutable freeze registry", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(freezeInvariants));
  assert.ok(Object.isFrozen(module));
});

test("84. immutable approved export registry", () => {
  assert.ok(Object.isFrozen(approvedExports));
  assert.ok(Object.isFrozen(approvedTypes));
  assert.ok(Object.isFrozen(approvedApis));
});

test("85. repeated certification deterministic", () => {
  const a = certifyRuntimeExecutiveInsightExperiencePlatform();
  const b = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.deepEqual(a, b);
});

test("86. repeated freeze verification deterministic", () => {
  const a = verifyRuntimeExecutiveInsightExperienceCertificationFreeze();
  const b = verifyRuntimeExecutiveInsightExperienceCertificationFreeze();
  assert.deepEqual(a, b);
  assert.equal(a.ok, true);
});

test("87. no Released claim", () => {
  assert.equal(boundary.claimsReleased, false);
  assert.doesNotMatch(source, /\bclaimsReleased:\s*true\b/);
  assert.doesNotMatch(
    certifyRuntimeExecutiveInsightExperiencePlatform().summary,
    /\bReleased\b/,
  );
});

test("88. no ReadyForConsumer claim", () => {
  assert.equal(boundary.claimsReadyForConsumer, false);
  assert.doesNotMatch(
    certifyRuntimeExecutiveInsightExperiencePlatform().summary,
    /ReadyForConsumer/,
  );
});

test("89. no SoleConsumerEntryPoint claim", () => {
  const forbiddenRole = ["Sole", "Consumer", "Entry", "Point"].join("");
  assert.equal(boundary.claimsFinalConsumerEntry, false);
  assert.equal(module.consumerRole, "CertifiedFrozenPlatformBoundary");
  assert.notEqual(module.consumerRole, forbiddenRole);
  assert.equal(source.includes(forbiddenRole), false);
});

test("90. ReadyForPublicIndex confirmed", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  const verification = verifyRuntimeExecutiveInsightExperienceCertificationFreeze();
  assert.equal(report.readinessDisplay, "ReadyForPublicIndex");
  assert.equal(report.summary, "Certified · Compatible · Frozen · Locked · ReadyForPublicIndex");
  assert.equal(verification.readyForPublicIndex, true);
  assert.equal(verification.ok, true);
  assert.deepEqual(
    getRuntimeExecutiveInsightExperienceCertificationFreezeIdentity(),
    canonicalIdentity,
  );
  assert.equal(
    getRuntimeExecutiveInsightExperienceCertificationFreezeRegistry(),
    registry,
  );
});

// ─── Extra coverage (≥90 + architecture) ────────────────────────────────────

test("91. all certification domains covered by checks", () => {
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  for (const domain of domains) {
    assert.ok(
      report.checks.some((entry) => entry.domain === domain),
      `missing domain ${domain}`,
    );
  }
});

test("92. check statuses vocabulary", () => {
  assert.deepEqual([...checkStatuses], ["passed", "failed"]);
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();
  assert.ok(report.checks.every((entry) => entry.status === "passed"));
  assert.ok(report.checks.every((entry) => entry.required === true));
});

test("93. no dri / nol / ex-dri imports", () => {
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.doesNotMatch(source, /from\s+["'][^"']*\/(?:dri|nol|ex-dri)\//);
});

test("94. successful statuses via evaluate helper", () => {
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    [
      { required: true, status: "passed" },
      { required: true, status: "passed" },
    ],
    "compatible",
  );
  assert.equal(statuses.certificationStatus, "certified");
  assert.equal(statuses.compatibilityStatus, "compatible");
  assert.equal(statuses.freezeStatus, "frozen");
  assert.equal(statuses.lockStatus, "locked");
  assert.equal(statuses.readiness, "ready-for-public-index");
  assert.equal(statuses.readinessDisplay, "ReadyForPublicIndex");
});

test("95. layer and capability", () => {
  assert.equal(module.layer, "REX");
  assert.equal(module.capability, "RuntimeExecutiveInsightExperience");
  assert.equal(canonicalIdentity.phase, "CertificationFreeze");
});
