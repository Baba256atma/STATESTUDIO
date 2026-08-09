import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_ATTENTION_STATES as attentionStates,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES as categories,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS as evidenceKinds,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES as families,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FRESHNESS_VALUES as freshnessValues,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_IMPORTANCE_VALUES as importanceValues,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES as lifecycleStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_DIRECTIONS as relationshipDirections,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS as relationshipKinds,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SCOPES as scopes,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SEVERITIES as severities,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS as signalKinds,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SOURCE_KINDS as sourceKinds,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES as validationCodes,
  RUNTIME_EXECUTIVE_INSIGHT_RELATED_SUBJECT_ROLES as relatedRoles,
  createRuntimeExecutiveInsightCollectionContract,
  createRuntimeExecutiveInsightContract,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightRelationshipContract,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  getRuntimeExecutiveInsightExperienceContractsIdentity,
  getRuntimeExecutiveInsightExperienceContractsRegistry,
  runtimeExecutiveInsightExperienceContracts as contracts,
  runtimeExecutiveInsightExperienceContractsApiNames as apiNames,
  runtimeExecutiveInsightExperienceContractsCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightExperienceContractsRegistry as registry,
  validateRuntimeExecutiveInsightCollectionContract,
  validateRuntimeExecutiveInsightConfidenceContract,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceContract,
  validateRuntimeExecutiveInsightRelationshipContract,
  validateRuntimeExecutiveInsightSignalContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceContracts,
  type RuntimeExecutiveInsightContract,
} from "./runtimeExecutiveInsightExperienceContracts.ts";

import {
  RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS,
  runtimeExecutiveInsightExperienceFoundationIdentity,
  runtimeExecutiveInsightExperienceFoundationSupportedImportPath,
  verifyRuntimeExecutiveInsightExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveInsightExperienceContracts.ts",
    import.meta.url,
  ),
  "utf8",
);

function factorySource() {
  return createRuntimeExecutiveInsightSourceContract({
    kind: "runtime",
    sourceId: "runtime.ctx.1",
    runtimeRef: "rex.runtime.1",
  });
}

function factoryInsight(
  overrides?: Partial<RuntimeExecutiveInsightContract>,
): RuntimeExecutiveInsightContract {
  const primarySubject = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "object.factory",
    kind: "nexora-object",
    label: "Factory",
    scope: "object",
  });
  const related = {
    subject: createRuntimeExecutiveInsightSubjectContract({
      subjectId: "object.delivery",
      kind: "nexora-object",
      label: "Delivery",
    }),
    role: "related" as const,
    order: 0,
  };
  const evidence = createRuntimeExecutiveInsightEvidenceContract({
    evidenceId: "ev.util",
    kind: "metric",
    source: factorySource(),
    subjectId: primarySubject.subjectId,
    payload: { value: 0.72, unitHint: "ratio" },
    unit: "ratio",
    freshness: "recent",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
  const signal = createRuntimeExecutiveInsightSignalContract({
    signalId: "sig.util",
    kind: "metric",
    subjectId: primarySubject.subjectId,
    source: factorySource(),
    evidenceIds: [evidence.evidenceId],
    direction: "decreasing",
    confidence: 0.8,
    freshness: "recent",
    sequence: 1,
  });
  const relationship = createRuntimeExecutiveInsightRelationshipContract({
    relationshipId: "rel.factory-delivery",
    kind: "related-to",
    direction: "forward",
    from: { endpointKind: "subject", endpointId: primarySubject.subjectId },
    to: { endpointKind: "subject", endpointId: related.subject.subjectId },
    order: 0,
    evidenceIds: [evidence.evidenceId],
  });

  const base: RuntimeExecutiveInsightContract = {
    identity: {
      insightId: "insight.factory.capacity",
      category: "risk",
      schemaVersion: "4.2.0",
      originRef: "runtime.observation.1",
    },
    primarySubject,
    relatedSubjects: [related],
    classification: {
      category: "risk",
      direction: "decreasing",
      severity: "moderate",
      importance: "high",
      confidence: 0.8 as RuntimeExecutiveInsightContract["classification"]["confidence"],
      freshness: "recent",
      scope: "object",
    },
    evidence: [evidence],
    signals: [signal],
    source: factorySource(),
    relationships: [relationship],
    attention: {
      attentionState: "notice",
      reasonCode: "supplied-notice",
    },
    lifecycle: {
      status: "active",
    },
    presentationCompatibility: {
      presentationState: "report",
      structurallyEligible: true,
    },
  };

  return createRuntimeExecutiveInsightContract({
    ...base,
    ...overrides,
    identity: overrides?.identity ?? base.identity,
    primarySubject: overrides?.primarySubject ?? base.primarySubject,
    classification: overrides?.classification ?? base.classification,
    source: overrides?.source ?? base.source,
    evidence: overrides?.evidence ?? base.evidence,
    signals: overrides?.signals ?? base.signals,
  });
}

test("1. exact identity", () => {
  assert.equal(
    contracts.identity,
    "REX-4:2/RuntimeExecutiveInsightExperienceContracts",
  );
  assert.deepEqual(
    getRuntimeExecutiveInsightExperienceContractsIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version", () => {
  assert.equal(contracts.version, "4.2.0");
  assert.equal(canonicalIdentity.version, "4.2.0");
});

test("3. exact namespace / layer / capability / phase / status", () => {
  assert.equal(contracts.namespace, "nexora.rex.insight-experience.contracts");
  assert.equal(contracts.layer, "REX");
  assert.equal(contracts.capability, "RuntimeExecutiveInsightExperience");
  assert.equal(contracts.phase, "Contracts");
  assert.equal(contracts.status, "ContractsReady");
});

test("4. sole immediate dependency", () => {
  assert.equal(
    contracts.upstreamDependency,
    "REX-4:1/RuntimeExecutiveInsightExperienceFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    runtimeExecutiveInsightExperienceFoundationIdentity,
  );
  assert.equal(
    contracts.dependencyPath,
    runtimeExecutiveInsightExperienceFoundationSupportedImportPath,
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation",
  ]);
  assert.equal(boundary.consumesFoundationOnly, true);
});

test("5. contract-family registry", () => {
  assert.deepEqual([...families], [
    "InsightIdentity",
    "InsightSubject",
    "RelatedSubject",
    "Evidence",
    "EvidenceCollection",
    "Signal",
    "SignalCollection",
    "Classification",
    "Severity",
    "Importance",
    "Confidence",
    "Freshness",
    "Scope",
    "Source",
    "Relationship",
    "Attention",
    "Lifecycle",
    "PresentationCompatibility",
    "ExecutiveInsight",
    "InsightCollection",
  ]);
  assert.equal(registry.contractFamilyCount, 20);
  assert.equal(registry.contractFamilyCount, families.length);
});

test("6. insight identity contract", () => {
  const insight = factoryInsight();
  assert.equal(insight.identity.insightId, "insight.factory.capacity");
  assert.equal(insight.identity.category, "risk");
  assert.equal(insight.identity.schemaVersion, "4.2.0");
  assert.equal(Object.isFrozen(insight.identity), true);
});

test("7. subject contract", () => {
  const subject = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "kpi.throughput",
    kind: "kpi",
    label: "Throughput",
    scope: "object",
  });
  assert.equal(subject.kind, "kpi");
  assert.equal(
    validateRuntimeExecutiveInsightSubjectContract(subject).valid,
    true,
  );
});

test("8. related-subject contract", () => {
  const insight = factoryInsight();
  assert.equal(insight.relatedSubjects?.[0]?.role, "related");
  assert.equal(insight.relatedSubjects?.[0]?.order, 0);
  assert.deepEqual([...relatedRoles], [
    "related",
    "supporting",
    "dependent",
    "contextual",
    "impacted",
  ]);
});

test("9. evidence contract", () => {
  const evidence = createRuntimeExecutiveInsightEvidenceContract({
    evidenceId: "ev.1",
    kind: "observation",
    source: factorySource(),
    payload: { note: "plain" },
    freshness: "current",
  });
  assert.equal(
    validateRuntimeExecutiveInsightEvidenceContract(evidence).valid,
    true,
  );
  assert.equal(evidence.kind, "observation");
});

test("10. signal contract", () => {
  const signal = createRuntimeExecutiveInsightSignalContract({
    signalId: "sig.1",
    kind: "state",
    subjectId: "object.factory",
    source: factorySource(),
    direction: "stable",
    confidence: 0.5,
    sequence: 2,
  });
  assert.equal(
    validateRuntimeExecutiveInsightSignalContract(signal).valid,
    true,
  );
});

test("11. classification contract", () => {
  const insight = factoryInsight();
  assert.equal(insight.classification.category, "risk");
  assert.equal(insight.classification.direction, "decreasing");
  assert.equal(insight.classification.severity, "moderate");
  assert.equal(insight.classification.importance, "high");
  assert.equal(insight.classification.confidence, 0.8);
  assert.equal(insight.classification.freshness, "recent");
  assert.equal(insight.classification.scope, "object");
});

test("12. severity handling", () => {
  assert.deepEqual([...severities], [
    "none",
    "low",
    "moderate",
    "high",
    "critical",
  ]);
  const insight = factoryInsight({
    classification: {
      category: "risk",
      direction: "decreasing",
      severity: "critical",
      importance: "high",
      confidence: 0.8 as RuntimeExecutiveInsightContract["classification"]["confidence"],
      freshness: "recent",
      scope: "object",
    },
  });
  assert.equal(insight.classification.severity, "critical");
  assert.equal(insight.classification.importance, "high");
});

test("13. importance handling", () => {
  assert.deepEqual([...importanceValues], [
    "minimal",
    "low",
    "medium",
    "high",
    "essential",
  ]);
  const insight = factoryInsight({
    classification: {
      category: "risk",
      direction: "decreasing",
      severity: "low",
      importance: "essential",
      confidence: 0.2 as RuntimeExecutiveInsightContract["classification"]["confidence"],
      freshness: "recent",
      scope: "object",
    },
  });
  assert.equal(insight.classification.importance, "essential");
  assert.equal(insight.classification.severity, "low");
});

test("14. confidence valid lower boundary", () => {
  assert.equal(
    validateRuntimeExecutiveInsightConfidenceContract({ confidence: 0 }).valid,
    true,
  );
});

test("15. confidence valid upper boundary", () => {
  assert.equal(
    validateRuntimeExecutiveInsightConfidenceContract({ confidence: 1 }).valid,
    true,
  );
});

test("16. confidence below zero invalid", () => {
  const result = validateRuntimeExecutiveInsightConfidenceContract({
    confidence: -0.01,
  });
  assert.equal(result.valid, false);
  assert.equal(result.issues[0]?.code, "invalid-confidence");
});

test("17. confidence above one invalid", () => {
  const result = validateRuntimeExecutiveInsightConfidenceContract({
    confidence: 1.01,
  });
  assert.equal(result.valid, false);
  assert.equal(result.issues[0]?.code, "invalid-confidence");
});

test("18. freshness domain", () => {
  assert.deepEqual([...freshnessValues], [
    "current",
    "recent",
    "aging",
    "stale",
    "unknown",
  ]);
});

test("19. scope domain", () => {
  assert.deepEqual([...scopes], [
    "subject",
    "object",
    "goal",
    "scene",
    "workspace",
    "model",
    "organization",
    "global",
  ]);
});

test("20. source contract", () => {
  assert.ok(sourceKinds.includes("external-reference"));
  const sourceContract = createRuntimeExecutiveInsightSourceContract({
    kind: "external-reference",
    externalReference: "ref://metric/util",
  });
  assert.equal(sourceContract.kind, "external-reference");
});

test("21. relationship contract", () => {
  assert.deepEqual([...relationshipKinds], [
    "supports",
    "contradicts",
    "depends-on",
    "caused-by",
    "contributes-to",
    "related-to",
    "supersedes",
    "derived-from",
  ]);
  const relationship = createRuntimeExecutiveInsightRelationshipContract({
    relationshipId: "rel.1",
    kind: "caused-by",
    direction: "forward",
    from: { endpointKind: "insight", endpointId: "insight.a" },
    to: { endpointKind: "subject", endpointId: "object.factory" },
  });
  assert.equal(relationship.kind, "caused-by");
});

test("22. relationship direction", () => {
  assert.deepEqual([...relationshipDirections], [
    "forward",
    "reverse",
    "bidirectional",
  ]);
});

test("23. attention contract", () => {
  assert.deepEqual([...attentionStates], [
    "none",
    "background",
    "notice",
    "focus",
    "urgent",
  ]);
  const insight = factoryInsight();
  assert.equal(insight.attention?.attentionState, "notice");
});

test("24. lifecycle contract", () => {
  assert.deepEqual([...lifecycleStatuses], [
    "proposed",
    "active",
    "superseded",
    "resolved",
    "archived",
    "unknown",
  ]);
  assert.equal(registry.lifecycleStatusCount, 6);
  const insight = factoryInsight();
  assert.equal(insight.lifecycle?.status, "active");
});

test("25. minimum/report/operation compatibility", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  const insight = factoryInsight({
    presentationCompatibility: {
      presentationState: "minimum",
      structurallyEligible: true,
    },
  });
  assert.equal(insight.presentationCompatibility?.presentationState, "minimum");
});

test("26. composite Executive Insight validation", () => {
  const insight = factoryInsight();
  const validated = validateRuntimeExecutiveInsightContract(insight);
  assert.equal(validated.valid, true);
  assert.equal(validated.issues.length, 0);
});

test("27. evidence uniqueness", () => {
  const insight = factoryInsight();
  const duplicate = {
    ...insight,
    evidence: [insight.evidence[0]!, insight.evidence[0]!],
  };
  const result = validateRuntimeExecutiveInsightContract(duplicate);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "duplicate-evidence-id"));
});

test("28. signal uniqueness", () => {
  const insight = factoryInsight();
  const duplicate = {
    ...insight,
    signals: [insight.signals[0]!, insight.signals[0]!],
  };
  const result = validateRuntimeExecutiveInsightContract(duplicate);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "duplicate-signal-id"));
});

test("29. insight uniqueness in collection", () => {
  const insight = factoryInsight();
  const result = validateRuntimeExecutiveInsightCollectionContract({
    insights: [insight, insight],
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "duplicate-insight-id"));
});

test("30. invalid subject kind", () => {
  const result = validateRuntimeExecutiveInsightSubjectContract({
    subjectId: "x",
    kind: "not-a-kind",
  });
  assert.equal(result.valid, false);
  assert.equal(result.issues[0]?.code, "unknown-subject-kind");
});

test("31. invalid evidence kind", () => {
  const result = validateRuntimeExecutiveInsightEvidenceContract({
    evidenceId: "ev.x",
    kind: "not-evidence",
    source: { kind: "runtime" },
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "unknown-evidence-kind"));
});

test("32. invalid signal kind", () => {
  const result = validateRuntimeExecutiveInsightSignalContract({
    signalId: "sig.x",
    kind: "not-signal",
    subjectId: "object.factory",
    source: { kind: "runtime" },
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "unknown-signal-kind"));
});

test("33. invalid relationship kind", () => {
  const result = validateRuntimeExecutiveInsightRelationshipContract({
    relationshipId: "rel.x",
    kind: "not-kind",
    direction: "forward",
    from: { endpointKind: "subject", endpointId: "a" },
    to: { endpointKind: "subject", endpointId: "b" },
  });
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some((entry) => entry.code === "unknown-relationship-kind"),
  );
});

test("34. invalid presentation state", () => {
  const insight = factoryInsight();
  const result = validateRuntimeExecutiveInsightContract({
    ...insight,
    presentationCompatibility: {
      presentationState: "dashboard",
      structurallyEligible: true,
    },
  });
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some((entry) => entry.code === "unknown-presentation-state"),
  );
});

test("35. invalid internal reference", () => {
  const insight = factoryInsight();
  const result = validateRuntimeExecutiveInsightContract({
    ...insight,
    signals: [
      {
        ...insight.signals[0]!,
        evidenceIds: ["missing-evidence"],
      },
    ],
  });
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some((entry) => entry.code === "invalid-evidence-reference"),
  );
});

test("36. deterministic validation-code ordering", () => {
  assert.equal(validationCodes[0], "missing-insight-id");
  assert.equal(validationCodes[8], "invalid-confidence");
  assert.equal(validationCodes[19], "duplicate-insight-id");
  assert.equal(registry.validationCodeCount, validationCodes.length);
  assert.equal(Object.isFrozen(validationCodes), true);
});

test("37. repeated validation produces identical output", () => {
  const insight = factoryInsight();
  const a = validateRuntimeExecutiveInsightContract(insight);
  const b = validateRuntimeExecutiveInsightContract(insight);
  assert.deepEqual(a, b);
  const v1 = verifyRuntimeExecutiveInsightExperienceContracts();
  const v2 = verifyRuntimeExecutiveInsightExperienceContracts();
  assert.deepEqual(v1, v2);
  assert.equal(v1.ok, true);
});

test("38. validation does not mutate input", () => {
  const evidenceIds = ["ev.util"];
  const insight = factoryInsight();
  const mutable = {
    ...insight,
    signals: [
      {
        ...insight.signals[0]!,
        evidenceIds,
      },
    ],
  };
  validateRuntimeExecutiveInsightContract(mutable);
  assert.equal(evidenceIds.length, 1);
  assert.equal(evidenceIds[0], "ev.util");
  assert.equal(mutable.signals.length, 1);
});

test("39. immutable registry", () => {
  assert.equal(Object.isFrozen(contracts), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(families), true);
  assert.equal(Object.isFrozen(validationCodes), true);
  assert.equal(Object.isFrozen(consumerGuarantees), true);
  assert.throws(() => {
    (families as unknown as string[]).push("Invented");
  });
});

test("40. counts derived correctly", () => {
  const viaGetter = getRuntimeExecutiveInsightExperienceContractsRegistry();
  assert.equal(viaGetter, registry);
  assert.equal(registry.categoryCount, categories.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.evidenceKindCount, evidenceKinds.length);
  assert.equal(registry.signalKindCount, signalKinds.length);
  assert.equal(registry.relationshipKindCount, relationshipKinds.length);
  assert.equal(registry.lifecycleStatusCount, lifecycleStatuses.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.equal(
    registry.validationApiCount,
    apiNames.filter((name) => name.startsWith("validate")).length,
  );
});

test("41. KPI support", () => {
  assert.ok(subjectKinds.includes("kpi"));
  assert.equal(subjectSemantics.calculatesKpi, false);
  assert.equal(categories, RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES);
  assert.equal(subjectKinds, RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS);
});

test("42. KOI support", () => {
  assert.ok(subjectKinds.includes("koi"));
  assert.equal(subjectSemantics.calculatesKoi, false);
  const subject = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "koi.margin",
    kind: "koi",
  });
  assert.equal(subject.kind, "koi");
});

test("43. KOR absence", () => {
  const forbidden = ["k", "o", "r"].join("");
  assert.ok(!(subjectKinds as readonly string[]).includes(forbidden));
  assert.ok(!(categories as readonly string[]).includes(forbidden));
  assert.equal(subjectSemantics.introducesKor, false);
  assert.equal(boundary.introducesKor, false);
});

test("44. no resolution APIs", () => {
  assert.ok(!apiNames.some((name) => /resolv/i.test(name)));
  assert.doesNotMatch(source, /resolveRuntimeExecutiveInsight|insightResolution/);
  assert.equal(boundary.introducesResolution, false);
});

test("45. no priority/ranking APIs", () => {
  assert.ok(!apiNames.some((name) => /rank|priorit/i.test(name)));
  assert.equal(boundary.introducesRanking, false);
  assert.equal(boundary.introducesPrioritization, false);
  assert.ok(consumerGuarantees.includes("no-ranking"));
});

test("46. no presentation-resolution APIs", () => {
  assert.ok(!apiNames.some((name) => /resolvePresentation|selectPresentation/i.test(name)));
  assert.equal(boundary.introducesPresentationResolution, false);
  assert.ok(consumerGuarantees.includes("no-presentation-resolution"));
});

test("47. no AI/LLM behavior", () => {
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bchatgpt\b/i);
  assert.doesNotMatch(
    source,
    /generateText\s*\(|createChatCompletion|completion\.create/,
  );
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.equal(contracts.aiProviderIndependent, true);
});

test("48. no external integration behavior / foundation regression", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol|rex\/runtimeExecutiveAdvisor|rex\/runtimeExecutiveStage|rex\/runtimeEnabled)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.equal(boundary.introducesPersistence, false);
  assert.equal(evidenceKinds, RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS);
  assert.equal(signalKinds, RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS);

  const collection = createRuntimeExecutiveInsightCollectionContract({
    collectionId: "col.1",
    insights: [factoryInsight()],
  });
  assert.equal(collection.insights.length, 1);
  assert.equal(Object.isFrozen(collection), true);

  const verification = verifyRuntimeExecutiveInsightExperienceContracts();
  assert.equal(verification.ok, true);
  assert.equal(verification.reusesFoundationVocabularies, true);
  assert.equal(verification.upstreamFoundationOk, true);
  assert.equal(verification.confidenceBoundsEnforced, true);
  assert.equal(verification.noKor, true);
  assert.equal(
    contracts.architecturalStatus,
    "REX-4:2 Runtime Executive Insight Experience Contracts — ContractsReady",
  );

  const foundation = verifyRuntimeExecutiveInsightExperienceFoundation();
  assert.equal(foundation.ok, true);
});
