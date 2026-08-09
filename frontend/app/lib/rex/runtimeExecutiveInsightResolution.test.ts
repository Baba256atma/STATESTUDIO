import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES as resolutionCodes,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS as ruleKinds,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES as statuses,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  createRuntimeExecutiveInsightResolutionRule,
  getRuntimeExecutiveInsightResolutionIdentity,
  getRuntimeExecutiveInsightResolutionRegistry,
  isRuntimeExecutiveInsightResolutionRuleApplicable,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsights,
  runtimeExecutiveInsightResolution as resolution,
  runtimeExecutiveInsightResolutionApiNames as apiNames,
  runtimeExecutiveInsightResolutionCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightResolutionRegistry as registry,
  verifyRuntimeExecutiveInsightResolution,
  type RuntimeExecutiveInsightResolutionInput,
  type RuntimeExecutiveInsightResolutionRule,
} from "./runtimeExecutiveInsightResolution.ts";

import {
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightRelationshipContract,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  runtimeExecutiveInsightExperienceContractsIdentity,
  runtimeExecutiveInsightExperienceContractsSupportedImportPath,
  verifyRuntimeExecutiveInsightExperienceContracts,
} from "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts";

import { verifyRuntimeExecutiveInsightExperienceFoundation } from "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation";

const source = readFileSync(
  new URL("./runtimeExecutiveInsightResolution.ts", import.meta.url),
  "utf8",
);

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

function metricEvidence(payload: Record<string, number | boolean | number[]>, id = "ev.metric") {
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

function baseInput(
  overrides?: Partial<RuntimeExecutiveInsightResolutionInput> & {
    readonly rules?: ReadonlyArray<RuntimeExecutiveInsightResolutionRule>;
  },
): RuntimeExecutiveInsightResolutionInput {
  const { rules, context, ...rest } = overrides ?? {};
  return {
    primarySubject: subject(),
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
    evidence: [
      metricEvidence({ previous: 94, current: 78, threshold: 85 }),
    ],
    signals: [metricSignal({ evidenceIds: ["ev.metric"] })],
    context: {
      temporalRefIso: "2026-08-08T12:00:00.000Z",
      threshold: { value: 85, operator: "less-than", field: "current" },
      rules: rules ?? [],
      ...context,
    },
    source: sourceRef(),
    scope: "object",
    ...rest,
  };
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
      { kind: "require-previous-and-current", previousField: "previous", currentField: "current" },
      { kind: "compare-current-to-threshold", currentField: "current", operator: "less-than" },
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

test("1. exact identity", () => {
  assert.equal(resolution.identity, "REX-4:3/RuntimeExecutiveInsightResolution");
  assert.deepEqual(getRuntimeExecutiveInsightResolutionIdentity(), canonicalIdentity);
});

test("2. exact version", () => {
  assert.equal(resolution.version, "4.3.0");
});

test("3. exact namespace / layer / capability / phase / status", () => {
  assert.equal(resolution.namespace, "nexora.rex.insight-experience.resolution");
  assert.equal(resolution.layer, "REX");
  assert.equal(resolution.capability, "RuntimeExecutiveInsightExperience");
  assert.equal(resolution.phase, "Resolution");
  assert.equal(resolution.status, "ResolutionReady");
});

test("4. sole immediate dependency is REX-4:2", () => {
  assert.equal(
    resolution.upstreamDependency,
    "REX-4:2/RuntimeExecutiveInsightExperienceContracts",
  );
  assert.equal(
    resolution.upstreamDependency,
    runtimeExecutiveInsightExperienceContractsIdentity,
  );
  assert.equal(
    resolution.dependencyPath,
    runtimeExecutiveInsightExperienceContractsSupportedImportPath,
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts",
  ]);
});

test("5. no direct REX-4:1 dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperienceFoundation["']/,
  );
  assert.equal(boundary.importsRex41Directly, false);
  assert.equal(boundary.consumesContractsOnly, true);
});

test("6. canonical resolution statuses", () => {
  assert.deepEqual([...statuses], [
    "resolved",
    "unresolved",
    "ineligible",
    "invalid",
    "ambiguous",
  ]);
});

test("7. canonical rule kinds", () => {
  assert.deepEqual([...ruleKinds], [
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
});

test("8. canonical resolution codes", () => {
  assert.equal(resolutionCodes[0], "resolved");
  assert.ok(resolutionCodes.includes("ambiguous-resolution"));
  assert.ok(resolutionCodes.includes("missing-threshold"));
  assert.equal(registry.resolutionCodeCount, resolutionCodes.length);
});

test("9. valid resolution input", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "threshold");
});

test("10. invalid contract input", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      primarySubject: { subjectId: "", kind: "nexora-object" },
      rules: [thresholdRule()],
    }),
  );
  assert.equal(result.status, "invalid");
  assert.ok(result.codes.includes("invalid-input"));
});

test("11. resolved outcome", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.equal(result.status, "resolved");
  assert.ok(result.candidate);
  assert.deepEqual(result.codes, ["resolved"]);
});

test("12. unresolved outcome", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ current: 90 })],
      rules: [thresholdRule()],
    }),
  );
  assert.equal(result.status, "unresolved");
});

test("13. ineligible outcome", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      primarySubject: subject({ kind: "scene" }),
      rules: [thresholdRule()],
    }),
  );
  assert.equal(result.status, "ineligible");
  assert.ok(
    result.codes.includes("subject-not-applicable") ||
      result.codes.includes("no-applicable-rule"),
  );
});

test("14. invalid outcome", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      rules: [
        {
          ...thresholdRule(),
          output: {
            category: "threshold",
            confidence: 1.5,
          },
        },
      ],
    }),
  );
  assert.equal(result.status, "invalid");
});

test("15. ambiguous outcome", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      rules: [
        thresholdRule({
          ruleId: "rule.a",
          precedence: 10,
          specificity: 5,
          output: {
            category: "threshold",
            severity: "high",
            confidence: 0.8,
            candidateKey: "a",
          },
        }),
        thresholdRule({
          ruleId: "rule.b",
          precedence: 10,
          specificity: 5,
          output: {
            category: "threshold",
            severity: "critical",
            confidence: 0.9,
            candidateKey: "b",
          },
        }),
      ],
    }),
  );
  assert.equal(result.status, "ambiguous");
  assert.ok(result.codes.includes("ambiguous-resolution"));
});

test("16. change resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.change",
    ruleKind: "change",
    targetCategory: "change",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric", "transition"],
    applicableSignalKinds: ["metric", "transition"],
    conditions: [
      {
        kind: "require-previous-and-current",
        previousField: "previous",
        currentField: "current",
      },
    ],
    output: {
      category: "change",
      directionFrom: "previous-current",
      severity: "moderate",
      confidence: 0.7,
      candidateKey: "change",
    },
  });
  const result = resolveRuntimeExecutiveInsight(baseInput({ rules: [rule] }));
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "change");
  assert.equal(result.candidate?.direction, "decreasing");
});

test("17. trend resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.trend",
    ruleKind: "trend",
    targetCategory: "trend",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "require-ordered-observations",
        field: "observations",
        minCount: 3,
      },
    ],
    output: {
      category: "trend",
      directionFrom: "previous-current",
      confidence: 0.6,
      candidateKey: "trend",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ observations: [90, 85, 78] })],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "trend");
  assert.equal(result.candidate?.direction, "decreasing");
});

test("18. deviation resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.deviation",
    ruleKind: "deviation",
    targetCategory: "deviation",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric", "comparison"],
    applicableSignalKinds: ["metric"],
    conditions: [
      { kind: "require-baseline" },
      {
        kind: "compare-current-to-baseline",
        currentField: "current",
        operator: "greater-than",
        value: 0,
      },
    ],
    output: {
      category: "deviation",
      severityFromMagnitudeBands: [
        { minInclusive: 0, severity: "low" },
        { minInclusive: 3, severity: "moderate" },
        { minInclusive: 5, severity: "high" },
      ],
      confidence: 0.75,
      candidateKey: "deviation",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ current: 14, expected: 10 })],
      context: {
        baseline: { expected: 10 },
        rules: [rule],
      },
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "deviation");
  assert.equal(result.candidate?.severity, "moderate");
});

test("19. risk resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.risk",
    ruleKind: "risk",
    targetCategory: "risk",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "compare-current-to-threshold",
        currentField: "current",
        operator: "less-than",
      },
    ],
    output: {
      category: "risk",
      severity: "high",
      confidence: 0.85,
      candidateKey: "risk",
    },
  });
  const result = resolveRuntimeExecutiveInsight(baseInput({ rules: [rule] }));
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "risk");
});

test("20. opportunity resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.opportunity",
    ruleKind: "opportunity",
    targetCategory: "opportunity",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "compare-payload-number",
        field: "current",
        operator: "greater-than",
        value: 90,
      },
    ],
    output: {
      category: "opportunity",
      direction: "increasing",
      severity: "low",
      confidence: 0.7,
      candidateKey: "opportunity",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ current: 96 })],
      signals: [metricSignal({ direction: "increasing" })],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "opportunity");
});

test("21. anomaly resolution from explicit evidence/rule", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.anomaly",
    ruleKind: "anomaly",
    targetCategory: "anomaly",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric", "observation"],
    applicableSignalKinds: ["metric", "runtime"],
    conditions: [
      { kind: "require-payload-flag", field: "anomaly", value: true },
    ],
    output: {
      category: "anomaly",
      severity: "high",
      confidence: 0.9,
      candidateKey: "anomaly",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ anomaly: true, current: 12 })],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "anomaly");
});

test("22. dependency resolution", () => {
  const relationship = createRuntimeExecutiveInsightRelationshipContract({
    relationshipId: "rel.dep",
    kind: "depends-on",
    direction: "forward",
    from: { endpointKind: "subject", endpointId: "project.alpha" },
    to: { endpointKind: "subject", endpointId: "team.b" },
  });
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.dependency",
    ruleKind: "dependency",
    targetCategory: "dependency",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["relationship", "state"],
    applicableSignalKinds: ["relationship", "state"],
    conditions: [
      { kind: "require-relationship-kind", relationshipKinds: ["depends-on"] },
      { kind: "require-payload-flag", field: "unavailable", value: true },
    ],
    output: {
      category: "dependency",
      relationshipKind: "depends-on",
      severity: "high",
      confidence: 0.8,
      candidateKey: "dependency",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [
        createRuntimeExecutiveInsightEvidenceContract({
          evidenceId: "ev.dep",
          kind: "state",
          source: sourceRef(),
          payload: { unavailable: true },
          freshness: "current",
        }),
      ],
      signals: [
        createRuntimeExecutiveInsightSignalContract({
          signalId: "sig.dep",
          kind: "state",
          subjectId: "team.b",
          source: sourceRef(),
        }),
      ],
      relationships: [relationship],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "dependency");
  assert.equal(result.candidate?.relationships[0]?.kind, "depends-on");
});

test("23. conflict resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.conflict",
    ruleKind: "conflict",
    targetCategory: "conflict",
    applicableSubjectKinds: ["nexora-object", "decision"],
    applicableEvidenceKinds: ["state", "comparison"],
    applicableSignalKinds: ["state"],
    conditions: [
      { kind: "require-payload-flag", field: "conflict", value: true },
    ],
    output: {
      category: "conflict",
      severity: "moderate",
      confidence: 0.7,
      candidateKey: "conflict",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [
        createRuntimeExecutiveInsightEvidenceContract({
          evidenceId: "ev.conflict",
          kind: "state",
          source: sourceRef(),
          payload: { conflict: true },
        }),
      ],
      signals: [
        createRuntimeExecutiveInsightSignalContract({
          signalId: "sig.conflict",
          kind: "state",
          subjectId: "project.alpha",
          source: sourceRef(),
        }),
      ],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "conflict");
});

test("24. progress resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.progress",
    ruleKind: "progress",
    targetCategory: "progress",
    applicableSubjectKinds: ["nexora-object", "execution"],
    applicableEvidenceKinds: ["state", "metric"],
    applicableSignalKinds: ["state", "metric"],
    conditions: [
      {
        kind: "compare-payload-number",
        field: "progress",
        operator: "greater-than-or-equal",
        value: 1,
      },
    ],
    output: {
      category: "progress",
      direction: "increasing",
      severity: "none",
      confidence: 0.9,
      candidateKey: "progress",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ progress: 1 })],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "progress");
});

test("25. threshold resolution", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "threshold");
  assert.equal(result.candidate?.direction, "decreasing");
});

test("26. supplied forecast resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.forecast",
    ruleKind: "forecast",
    targetCategory: "forecast",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "compare-payload-number",
        field: "forecastedCapacityUtilization",
        operator: "greater-than",
        value: 0,
      },
    ],
    output: {
      category: "forecast",
      direction: "increasing",
      confidence: 0.65,
      candidateKey: "forecast",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ forecastedCapacityUtilization: 94 })],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "forecast");
});

test("27. attention-category resolution", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.attention",
    ruleKind: "attention",
    targetCategory: "attention",
    applicableSubjectKinds: ["nexora-object", "koi"],
    applicableEvidenceKinds: ["metric", "observation"],
    applicableSignalKinds: ["attention", "metric"],
    conditions: [
      { kind: "require-signal-kind", signalKinds: ["attention"] },
    ],
    output: {
      category: "attention",
      severity: "moderate",
      confidence: 0.5,
      candidateKey: "attention",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      signals: [
        createRuntimeExecutiveInsightSignalContract({
          signalId: "sig.attention",
          kind: "attention",
          subjectId: "project.alpha",
          source: sourceRef(),
        }),
      ],
      rules: [rule],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.category, "attention");
  assert.equal(boundary.introducesAttentionRanking, false);
});

test("28. direction resolution", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.equal(result.candidate?.direction, "decreasing");
});

test("29. explicit severity mapping", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.severity-map",
    ruleKind: "deviation",
    targetCategory: "deviation",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "require-previous-and-current",
        previousField: "previous",
        currentField: "current",
      },
    ],
    output: {
      category: "deviation",
      severityFromMagnitudeBands: [
        { minInclusive: 0, severity: "low" },
        { minInclusive: 5, severity: "moderate" },
        { minInclusive: 15, severity: "high" },
        { minInclusive: 30, severity: "critical" },
      ],
      confidence: 0.8,
      candidateKey: "severity-map",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      evidence: [metricEvidence({ previous: 100, current: 80 })],
      rules: [rule],
    }),
  );
  assert.equal(result.candidate?.severity, "high");
});

test("30. confidence lower boundary", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      rules: [
        thresholdRule({
          output: {
            category: "threshold",
            confidence: 0,
            candidateKey: "c0",
          },
        }),
      ],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.confidence, 0);
});

test("31. confidence upper boundary", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      rules: [
        thresholdRule({
          output: {
            category: "threshold",
            confidence: 1,
            candidateKey: "c1",
          },
        }),
      ],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.confidence, 1);
});

test("32. invalid confidence rejection", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      classificationHint: { confidence: 1.4 },
      rules: [thresholdRule()],
    }),
  );
  assert.equal(result.status, "invalid");
  assert.ok(result.codes.includes("invalid-confidence"));
});

test("33. explicit freshness resolution", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.equal(result.candidate?.freshness, "current");
});

test("34. no implicit system-time dependency", () => {
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /new\s+Date\s*\(/);
  const a = resolveRuntimeExecutiveInsight(baseInput({ rules: [thresholdRule()] }));
  const b = resolveRuntimeExecutiveInsight(baseInput({ rules: [thresholdRule()] }));
  assert.deepEqual(a, b);
});

test("35. scope resolution", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.equal(result.candidate?.scope, "object");
});

test("36. relationship resolution", () => {
  const relationship = createRuntimeExecutiveInsightRelationshipContract({
    relationshipId: "rel.supports",
    kind: "supports",
    direction: "forward",
    from: { endpointKind: "subject", endpointId: "ev.metric" },
    to: { endpointKind: "subject", endpointId: "project.alpha" },
  });
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.rel",
    ruleKind: "change",
    targetCategory: "change",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "require-previous-and-current",
        previousField: "previous",
        currentField: "current",
      },
      { kind: "require-relationship-kind", relationshipKinds: ["supports"] },
    ],
    output: {
      category: "change",
      relationshipKind: "supports",
      confidence: 0.7,
      candidateKey: "rel",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ relationships: [relationship], rules: [rule] }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.relationships[0]?.kind, "supports");
});

test("37. causality is not inferred", () => {
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.caused",
    ruleKind: "risk",
    targetCategory: "risk",
    applicableSubjectKinds: ["nexora-object"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "compare-current-to-threshold",
        currentField: "current",
        operator: "less-than",
      },
    ],
    output: {
      category: "risk",
      relationshipKind: "caused-by",
      confidence: 0.8,
      candidateKey: "caused",
    },
  });
  const result = resolveRuntimeExecutiveInsight(baseInput({ rules: [rule] }));
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.relationships.length, 0);
  assert.equal(boundary.infersCausality, false);
});

test("38. evidence reference preservation", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.deepEqual(result.evidenceIds, ["ev.metric"]);
  assert.deepEqual(result.candidate?.evidenceIds, ["ev.metric"]);
});

test("39. signal reference preservation", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [thresholdRule()] }),
  );
  assert.deepEqual(result.signalIds, ["sig.metric"]);
  assert.deepEqual(result.candidate?.signalIds, ["sig.metric"]);
});

test("40. deterministic rule precedence", () => {
  const low = thresholdRule({
    ruleId: "rule.low",
    precedence: 1,
    output: {
      category: "threshold",
      severity: "low",
      confidence: 0.5,
      candidateKey: "shared",
    },
  });
  const high = thresholdRule({
    ruleId: "rule.high",
    precedence: 20,
    output: {
      category: "threshold",
      severity: "critical",
      confidence: 0.9,
      candidateKey: "shared",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [low, high] }),
  );
  assert.equal(result.status, "resolved");
  assert.equal(result.candidate?.severity, "critical");
  assert.ok(result.matchedRuleIds.includes("rule.high"));
});

test("41. stable rule-ID tie-breaking", () => {
  const ruleB = thresholdRule({
    ruleId: "rule.b",
    precedence: 5,
    specificity: 1,
    output: {
      category: "threshold",
      severity: "moderate",
      confidence: 0.7,
      candidateKey: "tie",
    },
  });
  const ruleA = thresholdRule({
    ruleId: "rule.a",
    precedence: 5,
    specificity: 1,
    output: {
      category: "threshold",
      severity: "moderate",
      confidence: 0.7,
      candidateKey: "tie",
    },
  });
  const result = resolveRuntimeExecutiveInsight(
    baseInput({ rules: [ruleB, ruleA] }),
  );
  assert.equal(result.status, "resolved");
  assert.deepEqual(result.matchedRuleIds, ["rule.a", "rule.b"]);
});

test("42. conflicting rules produce ambiguity when unresolved by precedence", () => {
  const result = resolveRuntimeExecutiveInsight(
    baseInput({
      rules: [
        thresholdRule({
          ruleId: "rule.x",
          precedence: 3,
          specificity: 3,
          output: {
            category: "threshold",
            direction: "decreasing",
            confidence: 0.5,
            candidateKey: "x",
          },
        }),
        thresholdRule({
          ruleId: "rule.y",
          precedence: 3,
          specificity: 3,
          output: {
            category: "threshold",
            direction: "increasing",
            confidence: 0.5,
            candidateKey: "y",
          },
        }),
      ],
    }),
  );
  assert.equal(result.status, "ambiguous");
});

test("43. deterministic candidate identity", () => {
  const a = resolveRuntimeExecutiveInsight(baseInput({ rules: [thresholdRule()] }));
  const b = resolveRuntimeExecutiveInsight(baseInput({ rules: [thresholdRule()] }));
  assert.equal(a.candidate?.candidateId, b.candidate?.candidateId);
  assert.equal(
    a.candidate?.candidateId,
    "rex.insight.candidate:threshold:project.alpha:delivery-reliability-threshold",
  );
});

test("44. candidate deduplication", () => {
  const input = baseInput({ rules: [thresholdRule()] });
  const collection = resolveRuntimeExecutiveInsights([input, input]);
  assert.equal(collection.collection.candidates.length, 1);
});

test("45. evidence union during valid deduplication", () => {
  const rule = thresholdRule({
    output: {
      category: "threshold",
      confidence: 0.8,
      candidateKey: "shared-key",
    },
  });
  const first = baseInput({
    evidence: [metricEvidence({ previous: 94, current: 78, threshold: 85 }, "ev.a")],
    signals: [metricSignal({ signalId: "sig.a", evidenceIds: ["ev.a"] })],
    rules: [rule],
  });
  const second = baseInput({
    evidence: [metricEvidence({ previous: 94, current: 78, threshold: 85 }, "ev.b")],
    signals: [metricSignal({ signalId: "sig.b", evidenceIds: ["ev.b"] })],
    rules: [rule],
  });
  const collection = resolveRuntimeExecutiveInsights([first, second]);
  assert.equal(collection.collection.candidates.length, 1);
  assert.deepEqual(collection.collection.candidates[0]?.evidenceIds, [
    "ev.a",
    "ev.b",
  ]);
});

test("46. deterministic candidate collection order", () => {
  const ruleA = thresholdRule({
    ruleId: "rule.order.a",
    output: {
      category: "threshold",
      confidence: 0.8,
      candidateKey: "b-key",
    },
  });
  const ruleB = thresholdRule({
    ruleId: "rule.order.b",
    output: {
      category: "threshold",
      confidence: 0.8,
      candidateKey: "a-key",
    },
  });
  const collection = resolveRuntimeExecutiveInsights([
    baseInput({ rules: [ruleA] }),
    baseInput({ rules: [ruleB] }),
  ]);
  assert.deepEqual(
    collection.collection.candidates.map((entry) => entry.candidateId),
    [
      "rex.insight.candidate:threshold:project.alpha:a-key",
      "rex.insight.candidate:threshold:project.alpha:b-key",
    ],
  );
});

test("47. no executive-priority sorting", () => {
  assert.ok(!apiNames.some((name) => /rank|priorit/i.test(name)));
  assert.equal(boundary.introducesRanking, false);
  assert.ok(consumerGuarantees.includes("no-ranking"));
});

test("48. repeated identical input produces identical output", () => {
  const input = baseInput({ rules: [thresholdRule()] });
  assert.deepEqual(
    resolveRuntimeExecutiveInsight(input),
    resolveRuntimeExecutiveInsight(input),
  );
});

test("49. input is not mutated", () => {
  const evidence = [metricEvidence({ previous: 94, current: 78, threshold: 85 })];
  const input = baseInput({ evidence, rules: [thresholdRule()] });
  resolveRuntimeExecutiveInsight(input);
  assert.equal(evidence.length, 1);
  assert.equal(input.evidence.length, 1);
});

test("50. rules are not mutated", () => {
  const rules = [thresholdRule()];
  const input = baseInput({ rules });
  resolveRuntimeExecutiveInsight(input);
  assert.equal(rules.length, 1);
  assert.equal(rules[0]?.ruleId, "rule.threshold.delivery");
});

test("51. evidence is not mutated", () => {
  const payload = { previous: 94, current: 78, threshold: 85 };
  const evidence = [metricEvidence(payload)];
  resolveRuntimeExecutiveInsight(baseInput({ evidence, rules: [thresholdRule()] }));
  assert.equal(payload.current, 78);
  assert.equal(evidence[0]?.evidenceId, "ev.metric");
});

test("52. signals are not mutated", () => {
  const evidenceIds = ["ev.metric"];
  const signals = [metricSignal({ evidenceIds })];
  resolveRuntimeExecutiveInsight(baseInput({ signals, rules: [thresholdRule()] }));
  assert.equal(evidenceIds.length, 1);
  assert.equal(signals[0]?.signalId, "sig.metric");
});

test("53. immutable registry", () => {
  assert.equal(Object.isFrozen(resolution), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(statuses), true);
  assert.equal(Object.isFrozen(ruleKinds), true);
  assert.throws(() => {
    (statuses as unknown as string[]).push("invented");
  });
});

test("54. registry counts derive correctly", () => {
  const viaGetter = getRuntimeExecutiveInsightResolutionRegistry();
  assert.equal(viaGetter, registry);
  assert.equal(registry.resolutionStatusCount, statuses.length);
  assert.equal(registry.ruleKindCount, ruleKinds.length);
  assert.equal(registry.resolutionCodeCount, resolutionCodes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.sectionCount, registry.sections.length);
});

test("55. KPI supported", () => {
  assert.ok(subjectKinds.includes("kpi"));
  assert.equal(subjectSemantics.calculatesKpi, false);
});

test("56. KOI supported", () => {
  assert.ok(subjectKinds.includes("koi"));
  assert.equal(subjectSemantics.calculatesKoi, false);
});

test("57. KOR absent", () => {
  const forbidden = ["k", "o", "r"].join("");
  assert.ok(!(subjectKinds as readonly string[]).includes(forbidden));
  assert.equal(subjectSemantics.introducesKor, false);
  assert.equal(boundary.introducesKor, false);
});

test("58. no KPI calculation behavior", () => {
  assert.equal(boundary.calculatesKpi, false);
  assert.doesNotMatch(source, /calculateKpi|computeKpi|function\s+.*Kpi/i);
});

test("59. no KOI calculation behavior", () => {
  assert.equal(boundary.calculatesKoi, false);
  assert.doesNotMatch(source, /calculateKoi|computeKoi/i);
});

test("60. no AI/LLM dependency", () => {
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bchatgpt\b/i);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.ok(consumerGuarantees.includes("no-ai"));
  assert.ok(consumerGuarantees.includes("no-llm"));
});

test("61. no external API/DB dependency", () => {
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.equal(boundary.introducesPersistence, false);
});

test("62. no React/rendering dependency", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.equal(resolution.rendererIndependent, true);
  assert.equal(resolution.frameworkIndependent, true);
});

test("63. no presentation-resolution behavior", () => {
  assert.ok(!apiNames.some((name) => /presentation/i.test(name)));
  assert.equal(boundary.introducesPresentationResolution, false);
});

test("64. no executive-attention ranking", () => {
  assert.equal(boundary.introducesAttentionRanking, false);
  assert.ok(!apiNames.some((name) => /rankAttention|prioritize/i.test(name)));
});

test("65. no Advisor prose generation", () => {
  assert.equal(boundary.introducesAdvisorProse, false);
  assert.doesNotMatch(source, /should reallocate|serious trouble/i);
});

test("66. no Stage reaction execution", () => {
  assert.equal(boundary.introducesStageReactions, false);
  assert.doesNotMatch(source, /moveCamera|highlightObject|dimObject/);
});

test("67. no automation behavior / dependency architecture", () => {
  assert.equal(boundary.introducesAutomation, false);
  assert.equal(boundary.introducesOrchestration, false);
  assert.ok(
    isRuntimeExecutiveInsightResolutionRuleApplicable(
      thresholdRule(),
      baseInput({ rules: [thresholdRule()] }),
    ),
  );

  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Advisor|Stage|Enabled)/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperienceFoundation["']/,
  );

  const verification = verifyRuntimeExecutiveInsightResolution();
  assert.equal(verification.ok, true);
  assert.equal(verification.contractsBoundaryIntact, true);
  assert.equal(verification.upstreamContractsOk, true);
  assert.equal(
    resolution.architecturalStatus,
    "REX-4:3 Runtime Executive Insight Resolution — ResolutionReady",
  );

  assert.equal(verifyRuntimeExecutiveInsightExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightExperienceFoundation().ok, true);
});
