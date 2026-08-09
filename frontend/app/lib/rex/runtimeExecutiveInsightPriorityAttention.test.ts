import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES as escalationStates,
  RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES as relevanceValues,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES as attentionStates,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS as priorityBands,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS as priorityDimensions,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES as reasonCodes,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES as suppressionStates,
  RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES as urgencyValues,
  createRuntimeExecutiveInsightPriorityPolicy,
  evaluateRuntimeExecutiveInsightPriority,
  getRuntimeExecutiveInsightPriorityAttentionIdentity,
  getRuntimeExecutiveInsightPriorityAttentionRegistry,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightEscalation,
  resolveRuntimeExecutiveInsightSuppression,
  runtimeExecutiveInsightPriorityAttention as priorityModule,
  runtimeExecutiveInsightPriorityAttentionApiNames as apiNames,
  runtimeExecutiveInsightPriorityAttentionCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightPriorityAttentionRegistry as registry,
  validateRuntimeExecutiveInsightPriorityPolicy,
  verifyRuntimeExecutiveInsightPriorityAttention,
  type RuntimeExecutiveInsightPriorityContext,
  type RuntimeExecutiveInsightPriorityPolicy,
  type RuntimeExecutiveInsightPriorityWeightMap,
} from "./runtimeExecutiveInsightPriorityAttention.ts";

import {
  runtimeExecutiveInsightResolutionIdentity,
  runtimeExecutiveInsightResolutionSupportedImportPath,
  verifyRuntimeExecutiveInsightResolution,
  type RuntimeExecutiveInsightCandidate,
} from "@/app/lib/rex/runtimeExecutiveInsightResolution";

import { verifyRuntimeExecutiveInsightExperienceContracts } from "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts";
import { verifyRuntimeExecutiveInsightExperienceFoundation } from "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation";

const source = readFileSync(
  new URL("./runtimeExecutiveInsightPriorityAttention.ts", import.meta.url),
  "utf8",
);

const equalWeights = (): RuntimeExecutiveInsightPriorityWeightMap =>
  Object.freeze({
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
  });

function basePolicy(
  overrides?: Partial<RuntimeExecutiveInsightPriorityPolicy>,
): RuntimeExecutiveInsightPriorityPolicy {
  return createRuntimeExecutiveInsightPriorityPolicy({
    policyId: "policy.default",
    policyVersion: "1",
    weights: equalWeights(),
    suppressStale: true,
    suppressSuperseded: true,
    suppressAcknowledged: true,
    escalateWhenPriorityBandAtLeast: "critical",
    escalateWhenUrgencyAtLeast: "immediate",
    ...overrides,
  });
}

function candidate(
  overrides?: Partial<RuntimeExecutiveInsightCandidate>,
): RuntimeExecutiveInsightCandidate {
  return Object.freeze({
    candidateId: "rex.insight.candidate:threshold:project.alpha:default",
    category: "threshold",
    primarySubject: Object.freeze({
      subjectId: "project.alpha",
      kind: "nexora-object",
      label: "Project Alpha",
      scope: "object",
    }),
    relatedSubjects: Object.freeze([]),
    evidenceIds: Object.freeze(["ev.1"]),
    signalIds: Object.freeze(["sig.1"]),
    direction: "decreasing",
    severity: "high",
    importance: "medium",
    confidence: 0.8,
    freshness: "current",
    scope: "object",
    source: Object.freeze({ kind: "runtime", sourceId: "runtime.1" }),
    relationships: Object.freeze([]),
    matchedRuleIds: Object.freeze(["rule.1"]),
    resolutionCodes: Object.freeze(["resolved"]),
    resolutionIdentity: "REX-4:3/RuntimeExecutiveInsightResolution",
    resolutionVersion: "4.3.0",
    ...overrides,
  }) as RuntimeExecutiveInsightCandidate;
}

function context(
  overrides?: Partial<RuntimeExecutiveInsightPriorityContext>,
): RuntimeExecutiveInsightPriorityContext {
  return Object.freeze({
    focusedSubjectId: "project.alpha",
    temporalRefIso: "2026-08-08T12:00:00.000Z",
    ...overrides,
  });
}

// 1–3 identity
test("exact identity", () => {
  assert.equal(
    priorityModule.identity,
    "REX-4:4/RuntimeExecutiveInsightPriorityAttention",
  );
  assert.equal(
    getRuntimeExecutiveInsightPriorityAttentionIdentity().identity,
    "REX-4:4/RuntimeExecutiveInsightPriorityAttention",
  );
});

test("exact version", () => {
  assert.equal(priorityModule.version, "4.4.0");
  assert.equal(canonicalIdentity.version, "4.4.0");
});

test("exact namespace", () => {
  assert.equal(
    priorityModule.namespace,
    "nexora.rex.insight-experience.priority-attention",
  );
});

// 4–6 dependency boundary
test("sole immediate dependency is REX-4:3", () => {
  assert.equal(
    priorityModule.upstreamDependency,
    runtimeExecutiveInsightResolutionIdentity,
  );
  assert.equal(
    priorityModule.dependencyPath,
    runtimeExecutiveInsightResolutionSupportedImportPath,
  );
  assert.equal(boundary.soleImmediateDependency, runtimeExecutiveInsightResolutionIdentity);
  assert.equal(boundary.consumesResolutionOnly, true);
});

test("no direct REX-4:1 import", () => {
  assert.equal(boundary.importsRex41Directly, false);
  assert.match(
    source,
    /from ["']@\/app\/lib\/rex\/runtimeExecutiveInsightResolution["']/,
  );
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightExperienceFoundation["']/,
  );
});

test("no direct REX-4:2 import", () => {
  assert.equal(boundary.importsRex42Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightExperienceContracts["']/,
  );
});

// 7–14 vocabularies
test("canonical priority dimensions", () => {
  assert.deepEqual([...priorityDimensions], [
    "severity",
    "importance",
    "urgency",
    "confidence",
    "freshness",
    "scope",
    "focus-relevance",
    "goal-relevance",
    "decision-relevance",
    "execution-relevance",
  ]);
});

test("canonical priority bands", () => {
  assert.deepEqual([...priorityBands], [
    "minimal",
    "low",
    "medium",
    "high",
    "critical",
  ]);
});

test("canonical urgency values", () => {
  assert.deepEqual([...urgencyValues], [
    "none",
    "low",
    "moderate",
    "high",
    "immediate",
  ]);
});

test("canonical executive relevance values", () => {
  assert.deepEqual([...relevanceValues], [
    "none",
    "weak",
    "moderate",
    "strong",
    "direct",
  ]);
});

test("canonical attention states", () => {
  assert.deepEqual([...attentionStates], [
    "none",
    "background",
    "notice",
    "focus",
    "urgent",
  ]);
});

test("canonical escalation states", () => {
  assert.deepEqual([...escalationStates], ["none", "eligible", "escalated"]);
});

test("canonical suppression states", () => {
  assert.deepEqual([...suppressionStates], [
    "visible",
    "deemphasized",
    "suppressed",
  ]);
});

test("canonical reason codes", () => {
  assert.ok(reasonCodes.includes("severity-contribution"));
  assert.ok(reasonCodes.includes("importance-contribution"));
  assert.ok(reasonCodes.includes("urgency-contribution"));
  assert.ok(reasonCodes.includes("confidence-contribution"));
  assert.ok(reasonCodes.includes("freshness-contribution"));
  assert.ok(reasonCodes.includes("scope-contribution"));
  assert.ok(reasonCodes.includes("focus-match"));
  assert.ok(reasonCodes.includes("goal-match"));
  assert.ok(reasonCodes.includes("koi-match"));
  assert.ok(reasonCodes.includes("decision-match"));
  assert.ok(reasonCodes.includes("execution-match"));
  assert.ok(reasonCodes.includes("escalation-applied"));
  assert.ok(reasonCodes.includes("deescalation-applied"));
  assert.ok(reasonCodes.includes("suppressed-stale"));
  assert.ok(reasonCodes.includes("suppressed-superseded"));
  assert.ok(reasonCodes.includes("suppressed-acknowledged"));
  assert.ok(reasonCodes.includes("low-relevance"));
  assert.ok(reasonCodes.includes("direct-relevance"));
  assert.ok(reasonCodes.includes("tie-break-applied"));
});

// 15–20 policy validation
test("valid priority policy", () => {
  const validated = validateRuntimeExecutiveInsightPriorityPolicy(basePolicy());
  assert.equal(validated.valid, true);
  assert.equal(validated.issues.length, 0);
});

test("invalid priority policy", () => {
  const validated = validateRuntimeExecutiveInsightPriorityPolicy({
    policyId: "",
    weights: equalWeights(),
  });
  assert.equal(validated.valid, false);
  assert.ok(validated.issues.some((issue) => issue.code === "invalid-policy"));
});

test("weight lower bound", () => {
  const validated = validateRuntimeExecutiveInsightPriorityPolicy({
    policyId: "p",
    weights: { ...equalWeights(), severity: -0.1 },
  });
  assert.equal(validated.valid, false);
  assert.ok(validated.issues.some((issue) => issue.code === "invalid-weight"));
});

test("weight upper bound", () => {
  const validated = validateRuntimeExecutiveInsightPriorityPolicy({
    policyId: "p",
    weights: { ...equalWeights(), severity: 1.1 },
  });
  assert.equal(validated.valid, false);
  assert.ok(validated.issues.some((issue) => issue.code === "invalid-weight"));
});

test("invalid NaN weight", () => {
  const validated = validateRuntimeExecutiveInsightPriorityPolicy({
    policyId: "p",
    weights: { ...equalWeights(), severity: Number.NaN },
  });
  assert.equal(validated.valid, false);
  assert.ok(
    validated.issues.some(
      (issue) =>
        issue.code === "invalid-weight" && issue.details?.reason === "nan",
    ),
  );
});

test("invalid Infinity weight", () => {
  const validated = validateRuntimeExecutiveInsightPriorityPolicy({
    policyId: "p",
    weights: { ...equalWeights(), severity: Number.POSITIVE_INFINITY },
  });
  assert.equal(validated.valid, false);
  assert.ok(
    validated.issues.some(
      (issue) =>
        issue.code === "invalid-weight" && issue.details?.reason === "infinity",
    ),
  );
});

// 21–33 scoring / contributions
test("deterministic score", () => {
  const input = {
    candidate: candidate(),
    context: context(),
    policy: basePolicy(),
  };
  const a = evaluateRuntimeExecutiveInsightPriority(input);
  const b = evaluateRuntimeExecutiveInsightPriority(input);
  assert.equal(a.priorityScore, b.priorityScore);
  assert.equal(a.priorityBand, b.priorityBand);
  assert.deepEqual([...a.reasonCodes], [...b.reasonCodes]);
});

test("score bounded correctly", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ severity: "critical", confidence: 1 }),
    context: context(),
    policy: basePolicy(),
  });
  assert.ok(result.priorityScore >= 0);
  assert.ok(result.priorityScore <= 1);
});

test("severity contributes when policy allows", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ severity: "critical" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 1, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  const contrib = result.contributions.find((entry) => entry.dimension === "severity");
  assert.ok(contrib);
  assert.ok(contrib!.contribution > 0);
  assert.ok(result.reasonCodes.includes("severity-contribution"));
});

test("importance contributes separately", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ importance: "essential", severity: "none" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 1, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.ok(result.reasonCodes.includes("importance-contribution"));
  assert.ok(
    result.contributions.find((entry) => entry.dimension === "importance")!
      .contribution > 0,
  );
});

test("urgency contributes separately", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ severity: "critical", freshness: "current" }),
    context: context(),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 1, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.ok(result.reasonCodes.includes("urgency-contribution"));
  assert.notEqual(result.urgency, "none");
});

test("confidence contributes when configured", () => {
  const high = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ confidence: 1 }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 1, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  const low = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ confidence: 0.1 }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 1, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.ok(high.priorityScore > low.priorityScore);
  assert.ok(high.reasonCodes.includes("confidence-contribution"));
});

test("freshness contributes when configured", () => {
  const current = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ freshness: "current" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 1, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
      suppressStale: false,
    }),
  });
  const stale = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ freshness: "stale" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 1, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
      suppressStale: false,
    }),
  });
  assert.ok(current.priorityScore > stale.priorityScore);
});

test("scope contributes when configured", () => {
  const org = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ scope: "organization" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 1, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  const subject = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ scope: "subject" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 1, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.ok(org.priorityScore > subject.priorityScore);
  assert.ok(org.reasonCodes.includes("scope-contribution"));
});

test("focus relevance", () => {
  const matched = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: context({ focusedSubjectId: "project.alpha" }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 1, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.equal(matched.executiveRelevance, "direct");
  assert.ok(matched.reasonCodes.includes("focus-match"));
});

test("KOI relevance", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      primarySubject: Object.freeze({
        subjectId: "koi.north-star",
        kind: "koi",
      }),
    }),
    context: context({
      focusedSubjectId: undefined,
      activeKoiId: "koi.north-star",
    }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 1, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.ok(result.reasonCodes.includes("koi-match"));
});

test("goal relevance", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      primarySubject: Object.freeze({
        subjectId: "goal.q3",
        kind: "goal",
      }),
    }),
    context: context({
      focusedSubjectId: undefined,
      activeGoalId: "goal.q3",
    }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 1, "decision-relevance": 0, "execution-relevance": 0 },
    }),
  });
  assert.ok(result.reasonCodes.includes("goal-match"));
});

test("decision relevance", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: context({
      focusedSubjectId: undefined,
      decisionSubjectIds: ["project.alpha"],
    }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 1, "execution-relevance": 0 },
    }),
  });
  assert.ok(result.reasonCodes.includes("decision-match"));
});

test("execution relevance", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: context({
      focusedSubjectId: undefined,
      executionSubjectIds: ["project.alpha"],
    }),
    policy: basePolicy({
      weights: { ...equalWeights(), severity: 0, importance: 0, urgency: 0, confidence: 0, freshness: 0, scope: 0, "focus-relevance": 0, "goal-relevance": 0, "decision-relevance": 0, "execution-relevance": 1 },
    }),
  });
  assert.ok(result.reasonCodes.includes("execution-match"));
});

// 34–39 invariants
test("severity and priority remain distinct", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ severity: "critical", importance: "minimal", freshness: "stale", confidence: 0.1 }),
    context: context({ focusedSubjectId: "other" }),
    policy: basePolicy({
      suppressStale: false,
      weights: {
        severity: 0.05,
        importance: 0.2,
        urgency: 0.05,
        confidence: 0.25,
        freshness: 0.25,
        scope: 0.05,
        "focus-relevance": 0.15,
        "goal-relevance": 0,
        "decision-relevance": 0,
        "execution-relevance": 0,
      },
    }),
  });
  assert.equal(result.contributions.find((e) => e.dimension === "severity")!.inputValue, "critical");
  assert.notEqual(result.priorityBand, "critical");
  assert.equal(boundary.severityDistinctFromPriority, true);
});

test("importance and priority remain distinct", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ importance: "essential", severity: "none", freshness: "stale", confidence: 0.1 }),
    context: context({ focusedSubjectId: "other" }),
    policy: basePolicy({
      suppressStale: false,
      weights: {
        severity: 0.2,
        importance: 0.05,
        urgency: 0.05,
        confidence: 0.25,
        freshness: 0.25,
        scope: 0.05,
        "focus-relevance": 0.15,
        "goal-relevance": 0,
        "decision-relevance": 0,
        "execution-relevance": 0,
      },
    }),
  });
  assert.equal(
    result.contributions.find((e) => e.dimension === "importance")!.inputValue,
    "essential",
  );
  assert.notEqual(result.priorityBand, "critical");
  assert.equal(boundary.importanceDistinctFromPriority, true);
});

test("high severity does not automatically force highest priority", () => {
  const criticalIrrelevant = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      severity: "critical",
      importance: "minimal",
      freshness: "stale",
      confidence: 0.2,
      scope: "subject",
    }),
    context: context({ focusedSubjectId: "other.project" }),
    policy: basePolicy({ suppressStale: false }),
  });
  const moderateFocused = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      candidateId: "rex.insight.candidate:threshold:project.alpha:focused",
      severity: "moderate",
      importance: "high",
      freshness: "current",
      confidence: 0.95,
      scope: "organization",
    }),
    context: context({ focusedSubjectId: "project.alpha" }),
    policy: basePolicy({ suppressStale: false }),
  });
  assert.ok(moderateFocused.priorityScore > criticalIrrelevant.priorityScore);
});

test("low-confidence candidate can rank below stronger evidence when policy defines it", () => {
  const policy = basePolicy({
    weights: {
      severity: 0.2,
      importance: 0.1,
      urgency: 0.1,
      confidence: 0.5,
      freshness: 0.1,
      scope: 0,
      "focus-relevance": 0,
      "goal-relevance": 0,
      "decision-relevance": 0,
      "execution-relevance": 0,
    },
  });
  const ranked = rankRuntimeExecutiveInsights({
    collection: {
      candidates: [
        candidate({
          candidateId: "rex.insight.candidate:threshold:project.alpha:low-conf",
          severity: "high",
          confidence: 0.2,
        }),
        candidate({
          candidateId: "rex.insight.candidate:threshold:project.alpha:high-conf",
          severity: "high",
          confidence: 0.95,
        }),
      ],
    },
    context: context({ focusedSubjectId: undefined }),
    policy,
  });
  assert.equal(ranked.ranked[0]!.candidateId, "rex.insight.candidate:threshold:project.alpha:high-conf");
});

test("stale insight can be de-emphasized when policy defines it", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ freshness: "stale" }),
    context: context({ focusedSubjectId: undefined }),
    policy: basePolicy({
      suppressStale: false,
      deemphasizeWhenRelevanceAtMost: "none",
      weights: { ...equalWeights(), "focus-relevance": 0 },
    }),
  });
  assert.equal(result.suppressionState, "deemphasized");
  assert.ok(result.reasonCodes.includes("low-relevance"));
});

test("direct focus match increases relevance when policy defines it", () => {
  const withFocus = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: context({ focusedSubjectId: "project.alpha" }),
    policy: basePolicy(),
  });
  const withoutFocus = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: context({ focusedSubjectId: "other" }),
    policy: basePolicy(),
  });
  assert.equal(withFocus.executiveRelevance, "direct");
  assert.ok(
    relevanceValues.indexOf(withFocus.executiveRelevance) >
      relevanceValues.indexOf(withoutFocus.executiveRelevance),
  );
  assert.ok(withFocus.priorityScore > withoutFocus.priorityScore);
});

// 40–48 attention / escalation / suppression
test("attention state resolution", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ severity: "high", freshness: "current" }),
    context: context(),
    policy: basePolicy(),
  });
  assert.ok(attentionStates.includes(result.attentionState));
  assert.notEqual(result.attentionState, "none");
});

test("urgent attention resolution", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      severity: "critical",
      freshness: "current",
      importance: "essential",
      confidence: 1,
      scope: "organization",
    }),
    context: context({ focusedSubjectId: "project.alpha" }),
    policy: basePolicy(),
  });
  assert.equal(result.attentionState, "urgent");
  assert.equal(
    resolveRuntimeExecutiveInsightAttention(
      "critical",
      "immediate",
      "direct",
      "escalated",
      "visible",
    ),
    "urgent",
  );
});

test("escalation metadata", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      severity: "critical",
      freshness: "current",
      importance: "essential",
      confidence: 1,
      scope: "global",
    }),
    context: context(),
    policy: basePolicy(),
  });
  assert.ok(
    result.escalationState === "escalated" ||
      result.escalationState === "eligible",
  );
  const direct = resolveRuntimeExecutiveInsightEscalation(
    "critical",
    "immediate",
    basePolicy(),
    "visible",
  );
  assert.equal(direct.escalationState, "escalated");
  assert.ok(direct.reasonCodes.includes("escalation-applied"));
});

test("de-escalation metadata", () => {
  const direct = resolveRuntimeExecutiveInsightEscalation(
    "critical",
    "immediate",
    basePolicy(),
    "suppressed",
  );
  assert.equal(direct.escalationState, "none");
  assert.equal(direct.deescalated, true);
  assert.ok(direct.reasonCodes.includes("deescalation-applied"));
});

test("suppression metadata", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      candidateId: "rex.insight.candidate:threshold:project.alpha:ack",
    }),
    context: context({
      acknowledgedCandidateIds: [
        "rex.insight.candidate:threshold:project.alpha:ack",
      ],
    }),
    policy: basePolicy(),
  });
  assert.equal(result.suppressionState, "suppressed");
});

test("stale suppression", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ freshness: "stale" }),
    context: context(),
    policy: basePolicy({ suppressStale: true }),
  });
  assert.equal(result.suppressionState, "suppressed");
  assert.ok(result.reasonCodes.includes("suppressed-stale"));
});

test("superseded suppression", () => {
  const id = "rex.insight.candidate:threshold:project.alpha:old";
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      candidateId: id,
      relationships: Object.freeze([
        Object.freeze({
          relationshipId: "rel.1",
          kind: "supersedes",
          direction: "forward",
          from: Object.freeze({
            endpointKind: "insight",
            endpointId: "rex.insight.candidate:threshold:project.alpha:new",
          }),
          to: Object.freeze({
            endpointKind: "insight",
            endpointId: id,
          }),
        }),
      ]),
    }),
    context: context(),
    policy: basePolicy({ suppressSuperseded: true }),
  });
  assert.equal(result.suppressionState, "suppressed");
  assert.ok(result.reasonCodes.includes("suppressed-superseded"));
});

test("acknowledged suppression", () => {
  const suppression = resolveRuntimeExecutiveInsightSuppression(
    candidate({ candidateId: "c.ack" }),
    context({ acknowledgedCandidateIds: ["c.ack"] }),
    basePolicy(),
    "direct",
  );
  assert.equal(suppression.suppressionState, "suppressed");
  assert.ok(suppression.reasonCodes.includes("suppressed-acknowledged"));
});

test("suppression does not delete candidate", () => {
  const c = candidate({ freshness: "stale" });
  const ranked = rankRuntimeExecutiveInsights({
    collection: { candidates: [c, candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:keep", freshness: "current" })] },
    context: context(),
    policy: basePolicy({ suppressStale: true }),
  });
  assert.equal(ranked.suppressed.length, 1);
  assert.equal(ranked.suppressed[0]!.candidateId, c.candidateId);
  assert.equal(ranked.ranked.length, 1);
  assert.ok(ranked.suppressed[0] !== undefined);
});

// 49–57 ranking / immutability
test("deterministic rank order", () => {
  const collection = {
    candidates: [
      candidate({
        candidateId: "rex.insight.candidate:threshold:project.alpha:a",
        severity: "low",
        confidence: 0.5,
      }),
      candidate({
        candidateId: "rex.insight.candidate:threshold:project.alpha:b",
        severity: "critical",
        confidence: 0.9,
        importance: "essential",
        scope: "organization",
      }),
    ],
  };
  const ranked = rankRuntimeExecutiveInsights({
    collection,
    context: context(),
    policy: basePolicy(),
  });
  assert.equal(ranked.ranked[0]!.rank, 1);
  assert.equal(
    ranked.ranked[0]!.candidateId,
    "rex.insight.candidate:threshold:project.alpha:b",
  );
});

test("stable tie-breaking", () => {
  const policy = basePolicy({
    weights: {
      severity: 0,
      importance: 0,
      urgency: 0,
      confidence: 0,
      freshness: 0,
      scope: 0,
      "focus-relevance": 0,
      "goal-relevance": 0,
      "decision-relevance": 0,
      "execution-relevance": 0,
    },
  });
  const ranked = rankRuntimeExecutiveInsights({
    collection: {
      candidates: [
        candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:z" }),
        candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:a" }),
      ],
    },
    context: context({ focusedSubjectId: undefined }),
    policy,
  });
  assert.equal(
    ranked.ranked[0]!.candidateId,
    "rex.insight.candidate:threshold:project.alpha:z",
  );
  assert.equal(ranked.ranked[0]!.tieBreakApplied, false);
  assert.equal(ranked.ranked[1]!.tieBreakApplied, true);
});

test("candidate ID tie-break", () => {
  const policy = basePolicy({
    weights: equalWeights(),
  });
  // identical scores via identical candidates except id; order preserved then id
  const first = candidate({
    candidateId: "rex.insight.candidate:threshold:project.alpha:m",
    severity: "moderate",
    importance: "medium",
    confidence: 0.5,
    freshness: "recent",
    scope: "object",
  });
  const second = candidate({
    candidateId: "rex.insight.candidate:threshold:project.alpha:n",
    severity: "moderate",
    importance: "medium",
    confidence: 0.5,
    freshness: "recent",
    scope: "object",
  });
  const ranked = rankRuntimeExecutiveInsights({
    collection: { candidates: [second, first] },
    context: context({ focusedSubjectId: undefined }),
    policy,
  });
  // collection order wins before ID when scores equal
  assert.equal(ranked.ranked[0]!.candidateId, second.candidateId);
  const rankedId = rankRuntimeExecutiveInsights({
    collection: { candidates: [first, second] },
    context: context({ focusedSubjectId: undefined }),
    policy,
  });
  assert.equal(rankedId.ranked[0]!.candidateId, first.candidateId);
});

test("repeated ranking produces identical output", () => {
  const input = {
    collection: {
      candidates: [
        candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:1", severity: "high" }),
        candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:2", severity: "low" }),
      ],
    },
    context: context(),
    policy: basePolicy(),
  };
  const a = rankRuntimeExecutiveInsights(input);
  const b = rankRuntimeExecutiveInsights(input);
  assert.deepEqual(
    a.ranked.map((entry) => ({
      rank: entry.rank,
      id: entry.candidateId,
      score: entry.priority.priorityScore,
    })),
    b.ranked.map((entry) => ({
      rank: entry.rank,
      id: entry.candidateId,
      score: entry.priority.priorityScore,
    })),
  );
});

test("input collection not mutated", () => {
  const candidates = [
    candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:1" }),
    candidate({ candidateId: "rex.insight.candidate:threshold:project.alpha:2" }),
  ];
  const collection = { candidates };
  const snapshot = candidates.map((entry) => entry.candidateId);
  rankRuntimeExecutiveInsights({
    collection,
    context: context(),
    policy: basePolicy(),
  });
  assert.deepEqual(
    collection.candidates.map((entry) => entry.candidateId),
    snapshot,
  );
});

test("candidate not mutated", () => {
  const c = candidate({ severity: "high" });
  const before = JSON.stringify(c);
  evaluateRuntimeExecutiveInsightPriority({
    candidate: c,
    context: context(),
    policy: basePolicy(),
  });
  assert.equal(JSON.stringify(c), before);
});

test("context not mutated", () => {
  const ctx = context({
    decisionSubjectIds: ["project.alpha"],
    acknowledgedCandidateIds: [],
  });
  const before = JSON.stringify(ctx);
  evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: ctx,
    policy: basePolicy(),
  });
  assert.equal(JSON.stringify(ctx), before);
});

test("policy not mutated", () => {
  const policy = basePolicy();
  const before = JSON.stringify(policy);
  evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate(),
    context: context(),
    policy,
  });
  assert.equal(JSON.stringify(policy), before);
});

test("immutable ranked collection", () => {
  const ranked = rankRuntimeExecutiveInsights({
    collection: { candidates: [candidate()] },
    context: context(),
    policy: basePolicy(),
  });
  assert.ok(Object.isFrozen(ranked));
  assert.ok(Object.isFrozen(ranked.ranked));
  assert.ok(Object.isFrozen(ranked.ranked[0]));
});

// 58–60 explainability / registry
test("reason contribution transparency", () => {
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({ severity: "high" }),
    context: context(),
    policy: basePolicy(),
  });
  assert.ok(result.contributions.length === priorityDimensions.length);
  for (const contrib of result.contributions) {
    assert.ok(typeof contrib.normalizedValue === "number");
    assert.ok(typeof contrib.weight === "number");
    assert.ok(typeof contrib.contribution === "number");
    assert.ok(reasonCodes.includes(contrib.reasonCode));
  }
});

test("registry immutability", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(getRuntimeExecutiveInsightPriorityAttentionRegistry()));
  assert.ok(Object.isFrozen(priorityModule));
});

test("registry counts derived correctly", () => {
  assert.equal(registry.priorityDimensionCount, priorityDimensions.length);
  assert.equal(registry.priorityBandCount, priorityBands.length);
  assert.equal(registry.urgencyCount, urgencyValues.length);
  assert.equal(registry.executiveRelevanceCount, relevanceValues.length);
  assert.equal(registry.attentionStateCount, attentionStates.length);
  assert.equal(registry.escalationStateCount, escalationStates.length);
  assert.equal(registry.suppressionStateCount, suppressionStates.length);
  assert.equal(registry.reasonCodeCount, reasonCodes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
});

// 61–65 KPI/KOI/KOR
test("KPI support", () => {
  assert.ok(subjectKinds.includes("kpi"));
  const result = evaluateRuntimeExecutiveInsightPriority({
    candidate: candidate({
      primarySubject: Object.freeze({
        subjectId: "kpi.delivery",
        kind: "kpi",
      }),
      relatedSubjects: Object.freeze([]),
    }),
    context: context({ focusedSubjectId: "kpi.delivery" }),
    policy: basePolicy(),
  });
  assert.equal(result.executiveRelevance, "direct");
});

test("KOI support", () => {
  assert.ok(subjectKinds.includes("koi"));
  assert.equal(subjectSemantics.introducesKor, false);
});

test("KOR absent", () => {
  const forbidden = ["k", "o", "r"].join("");
  assert.equal((subjectKinds as readonly string[]).includes(forbidden), false);
  assert.equal(boundary.introducesKor, false);
  assert.doesNotMatch(source, /\bkor\b/i);
});

test("no KPI calculation", () => {
  assert.equal(boundary.calculatesKpi, false);
  assert.doesNotMatch(source, /calculateKpi|computeKpi|kpiValue\s*=/);
});

test("no KOI calculation", () => {
  assert.equal(boundary.calculatesKoi, false);
  assert.doesNotMatch(source, /calculateKoi|computeKoi|koiValue\s*=/);
});

// 66–71 boundaries
test("no presentation-state selection", () => {
  assert.equal(boundary.introducesPresentationResolution, false);
  assert.doesNotMatch(source, /presentationState\s*=\s*["'](minimum|report|operation)["']/);
  assert.ok(!apiNames.some((name) => /presentation/i.test(name)));
});

test("no Advisor prose", () => {
  assert.equal(boundary.introducesAdvisorProse, false);
  assert.doesNotMatch(source, /generateAdvisor|advisorMessage|executiveSummary\s*=/);
});

test("no Stage execution", () => {
  assert.equal(boundary.introducesStageExecution, false);
  assert.doesNotMatch(source, /highlightObject|moveCamera|selectSubject|triggerAnimation/);
  assert.equal(boundary.attentionDistinctFromUiFocus, true);
});

test("no AI/LLM", () => {
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bchatgpt\b/i);
  assert.ok(consumerGuarantees.includes("no-ai"));
  assert.ok(consumerGuarantees.includes("no-llm"));
});

test("no external API/DB", () => {
  assert.equal(boundary.introducesPersistence, false);
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.doesNotMatch(source, /\b(fetch\(|axios|localStorage|indexedDB|prisma|sql)\b/);
  assert.doesNotMatch(source, /Date\.now\(|Math\.random\(/);
});

test("no automation", () => {
  assert.equal(boundary.introducesAutomation, false);
  assert.equal(boundary.introducesNotifications, false);
  assert.doesNotMatch(source, /sendEmail|createTask|notifyUser|triggerWorkflow/);
});

// Architectural dependency tests
test("architectural dependency imports only REX-4:3 among REX-4", () => {
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1]!,
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightResolution",
  ]);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperienceFoundation/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperienceContracts/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightPresentation/);
  assert.doesNotMatch(source, /runtimeExecutiveStage/);
  assert.doesNotMatch(source, /runtimeExecutiveAdvisor/);
  assert.doesNotMatch(source, /\/dri\//);
  assert.doesNotMatch(source, /\/nol\//);
  assert.doesNotMatch(source, /ex-dri/);
});

test("verifyRuntimeExecutiveInsightPriorityAttention passes", () => {
  const verification = verifyRuntimeExecutiveInsightPriorityAttention();
  assert.equal(verification.ok, true);
  assert.equal(verification.noKor, true);
  assert.equal(verification.kpiSupported, true);
  assert.equal(verification.koiSupported, true);
  assert.equal(verification.severityDistinctFromPriority, true);
  assert.equal(verification.importanceDistinctFromPriority, true);
});

test("upstream REX-4:1–4:3 verification remains green", () => {
  assert.equal(verifyRuntimeExecutiveInsightExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightResolution().ok, true);
});
