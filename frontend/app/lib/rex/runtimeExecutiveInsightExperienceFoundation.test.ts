import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES as attentionStates,
  RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES as categories,
  RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS as directions,
  RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS as evidenceKinds,
  RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES as freshnessValues,
  RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES as importanceValues,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS as presentationSemantics,
  RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS as relationshipKinds,
  RUNTIME_EXECUTIVE_INSIGHT_SCOPES as scopes,
  RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES as severities,
  RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS as signalKinds,
  RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS as sourceKinds,
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  createRuntimeExecutiveInsight,
  createRuntimeExecutiveInsightEvidence,
  createRuntimeExecutiveInsightEvidenceId,
  createRuntimeExecutiveInsightId,
  createRuntimeExecutiveInsightRelationship,
  createRuntimeExecutiveInsightRelationshipId,
  createRuntimeExecutiveInsightSignal,
  createRuntimeExecutiveInsightSignalId,
  createRuntimeExecutiveInsightSource,
  createRuntimeExecutiveInsightSubject,
  createRuntimeExecutiveInsightSubjectRef,
  getRuntimeExecutiveInsightExperienceFoundationIdentity,
  getRuntimeExecutiveInsightExperienceFoundationRegistry,
  isRuntimeExecutiveInsightAttentionState,
  isRuntimeExecutiveInsightCategory,
  isRuntimeExecutiveInsightConfidence,
  isRuntimeExecutiveInsightDirection,
  isRuntimeExecutiveInsightEvidenceKind,
  isRuntimeExecutiveInsightFreshness,
  isRuntimeExecutiveInsightImportance,
  isRuntimeExecutiveInsightRelationshipKind,
  isRuntimeExecutiveInsightScope,
  isRuntimeExecutiveInsightSeverity,
  isRuntimeExecutiveInsightSignalKind,
  isRuntimeExecutiveInsightSourceKind,
  isRuntimeExecutiveInsightSubjectKind,
  normalizeRuntimeExecutiveInsight,
  normalizeRuntimeExecutiveInsightConfidence,
  runtimeExecutiveInsightExperienceFoundation as foundation,
  runtimeExecutiveInsightExperienceFoundationApiNames as apiNames,
  runtimeExecutiveInsightExperienceFoundationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightExperienceFoundationRegistry as registry,
  validateRuntimeExecutiveInsightConfidence,
  verifyRuntimeExecutiveInsightExperienceFoundation,
} from "./runtimeExecutiveInsightExperienceFoundation.ts";

import {
  runtimeExecutiveAdvisorExperiencePublicIndexIdentity,
  runtimeExecutiveAdvisorExperiencePublicIndexSupportedImportPath,
  verifyRuntimeExecutiveAdvisorExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveInsightExperienceFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

function factorySubject(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveInsightSubject>[0]>,
) {
  return createRuntimeExecutiveInsightSubject({
    subjectId: "object.factory",
    kind: "nexora-object",
    label: "Factory",
    referenceId: "nexora.object.factory",
    ...overrides,
  });
}

function factoryInsight(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveInsight>[0]>,
) {
  const subject = factorySubject();
  const sourceRef = createRuntimeExecutiveInsightSource({
    kind: "runtime",
    sourceId: "runtime.ctx.1",
  });
  const evidence = createRuntimeExecutiveInsightEvidence({
    evidenceId: createRuntimeExecutiveInsightEvidenceId({ key: "util.drop" }),
    kind: "metric",
    source: sourceRef,
    subjectId: subject.subjectId,
    summary: "utilization observation",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
  const signal = createRuntimeExecutiveInsightSignal({
    signalId: createRuntimeExecutiveInsightSignalId({ key: "util.signal" }),
    kind: "metric",
    subjectId: subject.subjectId,
    source: sourceRef,
    evidenceIds: [evidence.evidenceId],
    direction: "decreasing",
    confidence: 0.75,
    freshness: "recent",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
  const relationship = createRuntimeExecutiveInsightRelationship({
    relationshipId: createRuntimeExecutiveInsightRelationshipId({
      key: "factory.delivery",
    }),
    kind: "related-to",
    direction: "forward",
    from: { endpointKind: "subject", endpointId: subject.subjectId },
    to: { endpointKind: "subject", endpointId: "object.delivery" },
  });

  return createRuntimeExecutiveInsight({
    insightId: createRuntimeExecutiveInsightId({ key: "factory.capacity" }),
    category: "risk",
    primarySubject: subject,
    relatedSubjects: [
      createRuntimeExecutiveInsightSubject({
        subjectId: "object.delivery",
        kind: "nexora-object",
        label: "Delivery",
      }),
    ],
    evidence: [evidence],
    signals: [signal],
    direction: "decreasing",
    severity: "moderate",
    importance: "high",
    confidence: 0.75,
    freshness: "recent",
    scope: "object",
    source: sourceRef,
    relationships: [relationship],
    attentionState: "notice",
    lifecycleStatus: "active",
    presentationCompatibility: "report",
    summary: "Factory capacity signal",
    observedAtIso: "2026-08-08T12:00:00.000Z",
    ...overrides,
  });
}

test("1. exact identity", () => {
  assert.equal(
    foundation.identity,
    "REX-4:1/RuntimeExecutiveInsightExperienceFoundation",
  );
  assert.deepEqual(
    getRuntimeExecutiveInsightExperienceFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version", () => {
  assert.equal(foundation.version, "4.1.0");
  assert.equal(canonicalIdentity.version, "4.1.0");
});

test("3. exact namespace / layer / capability / phase / status", () => {
  assert.equal(foundation.namespace, "nexora.rex.insight-experience.foundation");
  assert.equal(foundation.layer, "REX");
  assert.equal(foundation.capability, "RuntimeExecutiveInsightExperience");
  assert.equal(foundation.phase, "Foundation");
  assert.equal(foundation.status, "FoundationReady");
});

test("4. canonical category ordering", () => {
  assert.deepEqual([...categories], [
    "change",
    "trend",
    "deviation",
    "risk",
    "opportunity",
    "anomaly",
    "dependency",
    "conflict",
    "progress",
    "threshold",
    "forecast",
    "attention",
  ]);
  assert.equal(isRuntimeExecutiveInsightCategory("risk"), true);
  assert.equal(isRuntimeExecutiveInsightCategory("kor"), false);
  assert.equal(registry.categoryCount, 12);
});

test("5. subject-kind ordering", () => {
  assert.deepEqual([...subjectKinds], [
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
  ]);
  assert.equal(isRuntimeExecutiveInsightSubjectKind("goal"), true);
  assert.equal(registry.subjectKindCount, 11);
});

test("6. evidence-kind ordering", () => {
  assert.deepEqual([...evidenceKinds], [
    "observation",
    "metric",
    "state",
    "transition",
    "comparison",
    "threshold",
    "relationship",
    "runtime-signal",
  ]);
  assert.equal(isRuntimeExecutiveInsightEvidenceKind("metric"), true);
  assert.equal(registry.evidenceKindCount, 8);
});

test("7. signal-kind ordering", () => {
  assert.deepEqual([...signalKinds], [
    "observation",
    "metric",
    "state",
    "transition",
    "threshold",
    "relationship",
    "attention",
    "freshness",
    "runtime",
  ]);
  assert.equal(isRuntimeExecutiveInsightSignalKind("attention"), true);
  assert.equal(registry.signalKindCount, 9);
});

test("8. direction ordering", () => {
  assert.deepEqual([...directions], [
    "increasing",
    "decreasing",
    "stable",
    "mixed",
    "emerging",
    "resolved",
    "unknown",
  ]);
  assert.equal(isRuntimeExecutiveInsightDirection("increasing"), true);
  assert.equal(registry.directionCount, 7);
});

test("9. severity ordering", () => {
  assert.deepEqual([...severities], [
    "none",
    "low",
    "moderate",
    "high",
    "critical",
  ]);
  assert.equal(isRuntimeExecutiveInsightSeverity("critical"), true);
  assert.equal(registry.severityCount, 5);
});

test("10. importance ordering", () => {
  assert.deepEqual([...importanceValues], [
    "minimal",
    "low",
    "medium",
    "high",
    "essential",
  ]);
  assert.equal(isRuntimeExecutiveInsightImportance("essential"), true);
  assert.equal(registry.importanceCount, 5);
});

test("11. freshness ordering", () => {
  assert.deepEqual([...freshnessValues], [
    "current",
    "recent",
    "aging",
    "stale",
    "unknown",
  ]);
  assert.equal(isRuntimeExecutiveInsightFreshness("stale"), true);
  assert.equal(registry.freshnessCount, 5);
});

test("12. scope ordering", () => {
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
  assert.equal(isRuntimeExecutiveInsightScope("workspace"), true);
  assert.equal(registry.scopeCount, 8);
});

test("13. source-kind ordering", () => {
  assert.deepEqual([...sourceKinds], [
    "runtime",
    "model",
    "object",
    "metric",
    "pack",
    "scenario",
    "decision",
    "execution",
    "director",
    "external-reference",
    "unknown",
  ]);
  assert.equal(isRuntimeExecutiveInsightSourceKind("external-reference"), true);
  assert.equal(registry.sourceKindCount, 11);
});

test("14. relationship-kind ordering", () => {
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
  assert.equal(isRuntimeExecutiveInsightRelationshipKind("caused-by"), true);
  assert.equal(registry.relationshipKindCount, 8);
});

test("15. attention-state ordering", () => {
  assert.deepEqual([...attentionStates], [
    "none",
    "background",
    "notice",
    "focus",
    "urgent",
  ]);
  assert.equal(isRuntimeExecutiveInsightAttentionState("focus"), true);
  assert.equal(registry.attentionStateCount, 5);
});

test("16. KPI support", () => {
  assert.ok(subjectKinds.includes("kpi"));
  assert.equal(
    subjectSemantics.kpi,
    "Key Performance Indicator associated with NexoraObjects",
  );
  assert.equal(subjectSemantics.calculatesKpi, false);
  const kpiSubject = createRuntimeExecutiveInsightSubject({
    subjectId: "kpi.throughput",
    kind: "kpi",
    label: "Throughput",
  });
  assert.equal(kpiSubject.kind, "kpi");
});

test("17. KOI support", () => {
  assert.ok(subjectKinds.includes("koi"));
  assert.equal(
    subjectSemantics.koi,
    "Key Output Index associated with goals, intents, and executive focus",
  );
  assert.equal(subjectSemantics.calculatesKoi, false);
  const koiSubject = createRuntimeExecutiveInsightSubject({
    subjectId: "koi.margin",
    kind: "koi",
    label: "Margin Focus",
  });
  assert.equal(koiSubject.kind, "koi");
});

test("18. absence of KOR terminology", () => {
  const forbidden = ["k", "o", "r"].join("");
  assert.ok(!(subjectKinds as readonly string[]).includes(forbidden));
  assert.ok(!(categories as readonly string[]).includes(forbidden));
  assert.ok(!(sourceKinds as readonly string[]).includes(forbidden));
  assert.equal(subjectSemantics.introducesKor, false);
  assert.equal(boundary.introducesKor, false);
  assert.equal(subjectSemantics.usesOnlyCanonicalIndexTerminology, true);
});

test("19. confidence boundaries", () => {
  assert.equal(isRuntimeExecutiveInsightConfidence(0), true);
  assert.equal(isRuntimeExecutiveInsightConfidence(1), true);
  assert.equal(isRuntimeExecutiveInsightConfidence(0.5), true);
  assert.equal(isRuntimeExecutiveInsightConfidence(-0.01), false);
  assert.equal(isRuntimeExecutiveInsightConfidence(1.01), false);
  assert.equal(isRuntimeExecutiveInsightConfidence(Number.NaN), false);
  assert.equal(isRuntimeExecutiveInsightConfidence("0.5"), false);
  assert.equal(normalizeRuntimeExecutiveInsightConfidence(0.25), 0.25);
  assert.throws(() => normalizeRuntimeExecutiveInsightConfidence(2));
  assert.equal(validateRuntimeExecutiveInsightConfidence(0.9).ok, true);
  assert.equal(validateRuntimeExecutiveInsightConfidence(1.1).ok, false);
});

test("20. deterministic identity/reference behavior", () => {
  assert.equal(
    createRuntimeExecutiveInsightId({ key: "factory.capacity" }),
    "rex.insight:factory.capacity",
  );
  assert.equal(
    createRuntimeExecutiveInsightId({ key: "factory.capacity" }),
    createRuntimeExecutiveInsightId({ key: "factory.capacity" }),
  );
  assert.equal(
    createRuntimeExecutiveInsightSubjectRef({
      kind: "kpi",
      key: "throughput",
    }),
    "rex.insight.subject:kpi:throughput",
  );
  assert.equal(
    createRuntimeExecutiveInsightEvidenceId({ key: "e1" }),
    "rex.insight.evidence:e1",
  );
  assert.equal(
    createRuntimeExecutiveInsightSignalId({ key: "s1" }),
    "rex.insight.signal:s1",
  );
  assert.equal(
    createRuntimeExecutiveInsightRelationshipId({ key: "r1" }),
    "rex.insight.relationship:r1",
  );
  assert.throws(() => createRuntimeExecutiveInsightId({ key: "" }));
});

test("21. immutable canonical collections", () => {
  assert.equal(Object.isFrozen(categories), true);
  assert.equal(Object.isFrozen(subjectKinds), true);
  assert.equal(Object.isFrozen(evidenceKinds), true);
  assert.equal(Object.isFrozen(signalKinds), true);
  assert.equal(Object.isFrozen(directions), true);
  assert.equal(Object.isFrozen(severities), true);
  assert.equal(Object.isFrozen(importanceValues), true);
  assert.equal(Object.isFrozen(freshnessValues), true);
  assert.equal(Object.isFrozen(scopes), true);
  assert.equal(Object.isFrozen(sourceKinds), true);
  assert.equal(Object.isFrozen(relationshipKinds), true);
  assert.equal(Object.isFrozen(attentionStates), true);
  assert.equal(Object.isFrozen(presentationStates), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.throws(() => {
    (categories as unknown as string[]).push("invented");
  });
});

test("22. caller input is not mutated", () => {
  const evidenceIds = ["ev.a", "ev.b"];
  const related = [
    {
      subjectId: "object.delivery",
      kind: "nexora-object" as const,
      label: "Delivery",
    },
  ];
  const evidence = [
    {
      evidenceId: "ev.a",
      kind: "observation" as const,
      source: { kind: "runtime" as const },
    },
  ];
  const signals = [
    {
      signalId: "sig.a",
      kind: "observation" as const,
      subjectId: "object.factory",
      source: { kind: "runtime" as const },
      evidenceIds,
    },
  ];
  const relationships = [
    {
      relationshipId: "rel.a",
      kind: "supports" as const,
      direction: "forward" as const,
      from: { endpointKind: "insight" as const, endpointId: "insight.a" },
      to: { endpointKind: "subject" as const, endpointId: "object.factory" },
    },
  ];

  const insight = createRuntimeExecutiveInsight({
    insightId: "insight.a",
    category: "change",
    primarySubject: factorySubject(),
    relatedSubjects: related,
    evidence,
    signals,
    source: { kind: "runtime" },
    relationships,
    confidence: 0.5,
  });

  assert.equal(evidenceIds.length, 2);
  assert.equal(related.length, 1);
  assert.equal(evidence.length, 1);
  assert.equal(signals.length, 1);
  assert.equal(relationships.length, 1);
  assert.notEqual(insight.signals[0]?.evidenceIds, evidenceIds);
  assert.equal(Object.isFrozen(insight), true);
  assert.equal(Object.isFrozen(insight.evidence), true);
  assert.equal(Object.isFrozen(insight.signals), true);
});

test("23. registry counts are derived correctly", () => {
  const viaGetter = getRuntimeExecutiveInsightExperienceFoundationRegistry();
  assert.equal(viaGetter, registry);
  assert.equal(registry.categoryCount, categories.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.evidenceKindCount, evidenceKinds.length);
  assert.equal(registry.signalKindCount, signalKinds.length);
  assert.equal(registry.directionCount, directions.length);
  assert.equal(registry.severityCount, severities.length);
  assert.equal(registry.importanceCount, importanceValues.length);
  assert.equal(registry.freshnessCount, freshnessValues.length);
  assert.equal(registry.scopeCount, scopes.length);
  assert.equal(registry.sourceKindCount, sourceKinds.length);
  assert.equal(registry.relationshipKindCount, relationshipKinds.length);
  assert.equal(registry.attentionStateCount, attentionStates.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.sectionCount, registry.sections.length);
});

test("24. Minimum/Report/Operation compatibility", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(presentationSemantics.minimum, "awareness");
  assert.equal(presentationSemantics.report, "understanding");
  assert.equal(
    presentationSemantics.operation,
    "executive-interaction-action-context",
  );
  const insight = factoryInsight({ presentationCompatibility: "minimum" });
  assert.equal(insight.presentationCompatibility, "minimum");
});

test("25. deterministic repeated execution", () => {
  const first = factoryInsight();
  const second = factoryInsight();
  assert.deepEqual(first, second);
  assert.deepEqual(
    normalizeRuntimeExecutiveInsight(first),
    normalizeRuntimeExecutiveInsight(second),
  );
  const a = verifyRuntimeExecutiveInsightExperienceFoundation();
  const b = verifyRuntimeExecutiveInsightExperienceFoundation();
  assert.deepEqual(a, b);
  assert.equal(a.ok, true);
});

test("26. no forbidden runtime dependencies", () => {
  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /crypto\.randomUUID|uuidv4|nanoid/i);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /from\s+["']node:fs["']/);
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.equal(foundation.deterministic, true);
  assert.equal(foundation.sideEffectFree, true);
});

test("27. no rendering behavior", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /jsx|tsx|createElement|useState|useEffect/);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(foundation.rendererIndependent, true);
  assert.equal(foundation.frameworkIndependent, true);
});

test("28. no AI/LLM behavior", () => {
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bchatgpt\b/i);
  assert.doesNotMatch(source, /generateText\s*\(|createChatCompletion|completion\.create/);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.equal(foundation.aiProviderIndependent, true);
});

test("29. no external integration behavior", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
  assert.equal(boundary.introducesPersistence, false);
  assert.equal(boundary.introducesExternalIntegration, false);
});

test("30. foundation API consistency / dependency / verification", () => {
  assert.equal(
    foundation.upstreamDependency,
    "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    runtimeExecutiveAdvisorExperiencePublicIndexIdentity,
  );
  assert.equal(
    foundation.dependencyPath,
    runtimeExecutiveAdvisorExperiencePublicIndexSupportedImportPath,
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex",
  ]);
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(boundary.importsRex3InternalDirectly, false);

  assert.ok(apiNames.includes("getRuntimeExecutiveInsightExperienceFoundationIdentity"));
  assert.ok(apiNames.includes("getRuntimeExecutiveInsightExperienceFoundationRegistry"));
  assert.ok(apiNames.includes("isRuntimeExecutiveInsightCategory"));
  assert.ok(apiNames.includes("isRuntimeExecutiveInsightConfidence"));
  assert.ok(apiNames.includes("verifyRuntimeExecutiveInsightExperienceFoundation"));

  const insight = factoryInsight();
  assert.equal(
    insight.foundationIdentity,
    "REX-4:1/RuntimeExecutiveInsightExperienceFoundation",
  );
  assert.equal(insight.foundationVersion, "4.1.0");
  assert.equal(insight.primarySubject.kind, "nexora-object");
  assert.equal(insight.evidence.length, 1);
  assert.equal(insight.signals.length, 1);
  assert.equal(insight.relationships?.[0]?.direction, "forward");
  assert.equal(insight.severity, "moderate");
  assert.equal(insight.importance, "high");
  assert.equal(insight.attentionState, "notice");

  // Distinct domains remain independently settable.
  const mixed = factoryInsight({
    severity: "low",
    importance: "essential",
    attentionState: "urgent",
    confidence: 0.1,
  });
  assert.equal(mixed.severity, "low");
  assert.equal(mixed.importance, "essential");
  assert.equal(mixed.attentionState, "urgent");
  assert.equal(mixed.confidence, 0.1);

  const verification = verifyRuntimeExecutiveInsightExperienceFoundation();
  assert.equal(verification.ok, true);
  assert.equal(verification.noKor, true);
  assert.equal(verification.kpiSupported, true);
  assert.equal(verification.koiSupported, true);
  assert.equal(verification.presentationCompatibilityPreserved, true);
  assert.equal(verification.upstreamConsumerEntryOk, true);
  assert.equal(verification.frozen, true);
  assert.equal(
    foundation.architecturalStatus,
    "REX-4:1 Runtime Executive Insight Experience Foundation — FoundationReady",
  );

  const upstream = verifyRuntimeExecutiveAdvisorExperienceConsumerEntry();
  assert.equal(upstream.valid, true);
});
