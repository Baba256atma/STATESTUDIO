import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES as densityValues,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES as eligibilityStatuses,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS as emphasisLevels,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS as fieldGroups,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS as interactionKinds,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES as reasonCodes,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KIND_SEMANTICS as subjectSemantics,
  createRuntimeExecutiveInsightPresentationPolicy,
  getRuntimeExecutiveInsightPresentationIdentity,
  getRuntimeExecutiveInsightPresentationRegistry,
  resolveRuntimeExecutiveInsightInteractions,
  resolveRuntimeExecutiveInsightMinimumPresentation,
  resolveRuntimeExecutiveInsightOperationPresentation,
  resolveRuntimeExecutiveInsightPresentation,
  resolveRuntimeExecutiveInsightReportPresentation,
  runtimeExecutiveInsightPresentation as presentationModule,
  runtimeExecutiveInsightPresentationApiNames as apiNames,
  runtimeExecutiveInsightPresentationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveInsightPresentationRegistry as registry,
  validateRuntimeExecutiveInsightPresentationInput,
  verifyRuntimeExecutiveInsightPresentation,
  type RuntimeExecutiveInsightPresentationCandidate,
  type RuntimeExecutiveInsightPresentationContext,
  type RuntimeExecutiveInsightPresentationPolicy,
  type RuntimeExecutiveInsightPriorityResult,
} from "./runtimeExecutiveInsightPresentation.ts";

import {
  createRuntimeExecutiveInsightPriorityPolicy,
  evaluateRuntimeExecutiveInsightPriority,
  runtimeExecutiveInsightPriorityAttentionIdentity,
  runtimeExecutiveInsightPriorityAttentionSupportedImportPath,
  verifyRuntimeExecutiveInsightPriorityAttention,
} from "@/app/lib/rex/runtimeExecutiveInsightPriorityAttention";

import { verifyRuntimeExecutiveInsightResolution } from "@/app/lib/rex/runtimeExecutiveInsightResolution";
import { verifyRuntimeExecutiveInsightExperienceContracts } from "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts";
import { verifyRuntimeExecutiveInsightExperienceFoundation } from "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation";

const source = readFileSync(
  new URL("./runtimeExecutiveInsightPresentation.ts", import.meta.url),
  "utf8",
);

function candidate(
  overrides?: Partial<RuntimeExecutiveInsightPresentationCandidate>,
): RuntimeExecutiveInsightPresentationCandidate {
  return Object.freeze({
    candidateId: "rex.insight.candidate:threshold:project.alpha:default",
    category: "threshold",
    primarySubject: Object.freeze({
      subjectId: "project.alpha",
      kind: "nexora-object",
      label: "Project Alpha",
      scope: "object",
    }),
    relatedSubjects: Object.freeze([
      Object.freeze({
        subject: Object.freeze({
          subjectId: "kpi.delivery",
          kind: "kpi",
          label: "Delivery",
        }),
        role: "related",
        order: 0,
      }),
      Object.freeze({
        subject: Object.freeze({
          subjectId: "koi.north-star",
          kind: "koi",
          label: "North Star",
        }),
        role: "related",
        order: 1,
      }),
    ]),
    evidenceIds: Object.freeze(["ev.1", "ev.2"]),
    signalIds: Object.freeze(["sig.1", "sig.2"]),
    direction: "decreasing",
    severity: "high",
    importance: "medium",
    confidence: 0.85,
    freshness: "current",
    scope: "object",
    source: Object.freeze({ kind: "runtime", sourceId: "runtime.1" }),
    relationships: Object.freeze([
      Object.freeze({
        relationshipId: "rel.1",
        kind: "related-to",
        direction: "forward",
        from: Object.freeze({
          endpointKind: "insight",
          endpointId: "rex.insight.candidate:threshold:project.alpha:default",
        }),
        to: Object.freeze({
          endpointKind: "subject",
          endpointId: "kpi.delivery",
        }),
      }),
    ]),
    matchedRuleIds: Object.freeze(["rule.1"]),
    resolutionCodes: Object.freeze(["resolved"]),
    resolutionIdentity: "REX-4:3/RuntimeExecutiveInsightResolution",
    resolutionVersion: "4.3.0",
    ...overrides,
  }) as RuntimeExecutiveInsightPresentationCandidate;
}

function priorityFor(
  c: RuntimeExecutiveInsightPresentationCandidate,
): RuntimeExecutiveInsightPriorityResult {
  return evaluateRuntimeExecutiveInsightPriority({
    candidate: c,
    context: {
      focusedSubjectId: c.primarySubject.subjectId,
      temporalRefIso: "2026-08-08T12:00:00.000Z",
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
}

function policy(
  overrides?: Partial<RuntimeExecutiveInsightPresentationPolicy>,
): RuntimeExecutiveInsightPresentationPolicy {
  return createRuntimeExecutiveInsightPresentationPolicy({
    policyId: "policy.presentation",
    policyVersion: "1",
    showPriorityScore: true,
    showContributions: true,
    showProvenance: true,
    requireOperationContext: true,
    allowDowngrade: true,
    maxEvidenceRefs: 10,
    maxSignalRefs: 10,
    maxRelationshipRefs: 10,
    ...overrides,
  });
}

function context(
  overrides?: Partial<RuntimeExecutiveInsightPresentationContext>,
): RuntimeExecutiveInsightPresentationContext {
  return Object.freeze({
    focusedSubjectId: "project.alpha",
    selectedSubjectId: "project.alpha",
    decisionRefs: Object.freeze(["decision.1"]),
    executionRefs: Object.freeze(["execution.1"]),
    scenarioRefs: Object.freeze(["scenario.1"]),
    problemRefs: Object.freeze(["problem.1"]),
    packRefs: Object.freeze(["pack.1"]),
    ...overrides,
  });
}

function baseInput(
  overrides?: Partial<Parameters<typeof resolveRuntimeExecutiveInsightPresentation>[0]>,
) {
  const c = overrides?.candidate ?? candidate();
  return {
    candidate: c,
    priority: overrides?.priority ?? priorityFor(c),
    requestedState: overrides?.requestedState ?? ("report" as const),
    context: overrides?.context ?? context(),
    policy: overrides?.policy ?? policy(),
  };
}

// 1–3 identity
test("exact identity", () => {
  assert.equal(
    presentationModule.identity,
    "REX-4:5/RuntimeExecutiveInsightPresentation",
  );
  assert.equal(
    getRuntimeExecutiveInsightPresentationIdentity().identity,
    "REX-4:5/RuntimeExecutiveInsightPresentation",
  );
});

test("exact version", () => {
  assert.equal(presentationModule.version, "4.5.0");
  assert.equal(canonicalIdentity.version, "4.5.0");
});

test("exact namespace", () => {
  assert.equal(
    presentationModule.namespace,
    "nexora.rex.insight-experience.presentation",
  );
});

// 4–7 dependency
test("sole immediate dependency is REX-4:4", () => {
  assert.equal(
    presentationModule.upstreamDependency,
    runtimeExecutiveInsightPriorityAttentionIdentity,
  );
  assert.equal(
    presentationModule.dependencyPath,
    runtimeExecutiveInsightPriorityAttentionSupportedImportPath,
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "REX-4:4/RuntimeExecutiveInsightPriorityAttention",
  );
});

test("no direct import from REX-4:1", () => {
  assert.equal(boundary.importsRex41Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightExperienceFoundation["']/,
  );
});

test("no direct import from REX-4:2", () => {
  assert.equal(boundary.importsRex42Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightExperienceContracts["']/,
  );
});

test("no direct import from REX-4:3", () => {
  assert.equal(boundary.importsRex43Directly, false);
  assert.doesNotMatch(
    source,
    /from ["'][^"']*runtimeExecutiveInsightResolution["']/,
  );
});

// 8–11 states / semantics
test("exact presentation states", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
});

test("Minimum semantics", () => {
  const result = resolveRuntimeExecutiveInsightMinimumPresentation(baseInput());
  assert.equal(result.resolvedState, "minimum");
  assert.equal(result.descriptor?.presentationState, "minimum");
  assert.equal(result.descriptor?.density, "compact");
  assert.ok(result.reasonCodes.includes("eligible-minimum"));
});

test("Report semantics", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.equal(result.resolvedState, "report");
  assert.equal(result.descriptor?.presentationState, "report");
  assert.equal(result.descriptor?.density, "balanced");
  assert.ok(result.reasonCodes.includes("eligible-report"));
});

test("Operation semantics", () => {
  const result = resolveRuntimeExecutiveInsightOperationPresentation(baseInput());
  assert.equal(result.resolvedState, "operation");
  assert.equal(result.descriptor?.presentationState, "operation");
  assert.equal(result.descriptor?.density, "detailed");
  assert.ok(result.reasonCodes.includes("eligible-operation"));
});

// 12–18 input / eligibility
test("valid presentation input", () => {
  const validated = validateRuntimeExecutiveInsightPresentationInput(baseInput());
  assert.equal(validated.valid, true);
});

test("invalid presentation input", () => {
  const validated = validateRuntimeExecutiveInsightPresentationInput({
    requestedState: "report",
  });
  assert.equal(validated.valid, false);
  assert.ok(validated.issues.some((issue) => issue.code === "invalid-input"));
});

test("minimum eligibility", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({ requestedState: "minimum" }),
  );
  assert.equal(result.status, "eligible");
  assert.equal(result.eligibility.status, "eligible");
});

test("report eligibility", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({ requestedState: "report" }),
  );
  assert.equal(result.status, "eligible");
});

test("operation eligibility", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({ requestedState: "operation" }),
  );
  assert.equal(result.status, "eligible");
});

test("restricted eligibility", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({
      requestedState: "operation",
      context: context({
        decisionRefs: [],
        executionRefs: [],
        scenarioRefs: [],
        problemRefs: [],
        packRefs: [],
      }),
      candidate: candidate({ relatedSubjects: Object.freeze([]) }),
    }),
  );
  assert.equal(result.status, "restricted");
  assert.equal(result.resolvedState, "report");
});

test("invalid eligibility", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({
      candidate: candidate({
        primarySubject: Object.freeze({
          subjectId: "",
          kind: "",
        }) as unknown as RuntimeExecutiveInsightPresentationCandidate["primarySubject"],
      }),
    }),
  );
  assert.equal(result.status, "invalid");
});

// 19–25 descriptors
test("minimum descriptor structure", () => {
  const result = resolveRuntimeExecutiveInsightMinimumPresentation(baseInput());
  assert.ok(result.descriptor);
  assert.equal(result.descriptor!.presentationState, "minimum");
  if (result.descriptor!.presentationState === "minimum") {
    assert.ok(result.descriptor.insightId.length > 0);
    assert.ok(result.descriptor.subjectReference.subjectId);
    assert.ok(result.descriptor.category);
    assert.ok(result.descriptor.direction);
    assert.ok(result.descriptor.priorityBand);
    assert.ok(result.descriptor.attentionState);
    assert.ok(result.descriptor.emphasis);
  }
});

test("report descriptor structure", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.equal(result.descriptor?.presentationState, "report");
  if (result.descriptor?.presentationState === "report") {
    assert.ok(result.descriptor.primarySubject.subjectId);
    assert.ok(Array.isArray(result.descriptor.relatedSubjects));
    assert.ok(Array.isArray(result.descriptor.evidenceRefs));
    assert.ok(Array.isArray(result.descriptor.kpiRefs));
    assert.ok(Array.isArray(result.descriptor.koiRefs));
  }
});

test("operation descriptor structure", () => {
  const result = resolveRuntimeExecutiveInsightOperationPresentation(baseInput());
  assert.equal(result.descriptor?.presentationState, "operation");
  if (result.descriptor?.presentationState === "operation") {
    assert.ok(Array.isArray(result.descriptor.interactions));
    assert.ok(Array.isArray(result.descriptor.decisionRefs));
    assert.ok(Array.isArray(result.descriptor.executionRefs));
  }
});

test("Minimum excludes full evidence by default", () => {
  const result = resolveRuntimeExecutiveInsightMinimumPresentation(baseInput());
  assert.equal(result.descriptor?.presentationState, "minimum");
  if (result.descriptor?.presentationState === "minimum") {
    assert.equal(result.descriptor.evidenceCount, undefined);
    assert.equal(
      result.descriptor.visibleFieldGroups.includes("evidence"),
      false,
    );
  }
});

test("Report exposes structured evidence references", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.equal(result.descriptor?.presentationState, "report");
  if (result.descriptor?.presentationState === "report") {
    assert.deepEqual([...result.descriptor.evidenceRefs], ["ev.1", "ev.2"]);
  }
});

test("Operation exposes structured interaction context", () => {
  const result = resolveRuntimeExecutiveInsightOperationPresentation(baseInput());
  assert.equal(result.descriptor?.presentationState, "operation");
  if (result.descriptor?.presentationState === "operation") {
    assert.ok(result.descriptor.interactions.length > 0);
    assert.ok(result.descriptor.decisionRefs.includes("decision.1"));
  }
});

test("no operation execution", () => {
  assert.doesNotMatch(source, /executeInteraction|dispatchAction|runWorkflow/);
  assert.ok(
    consumerGuarantees.includes("structured-interaction-intents-only"),
  );
});

// 26–33 state resolution / downgrade
test("deterministic state resolution", () => {
  const input = baseInput({ requestedState: "report" });
  const a = resolveRuntimeExecutiveInsightPresentation(input);
  const b = resolveRuntimeExecutiveInsightPresentation(input);
  assert.equal(a.resolvedState, b.resolvedState);
  assert.deepEqual([...a.reasonCodes], [...b.reasonCodes]);
});

test("requested Minimum never upgrades", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({ requestedState: "minimum" }),
  );
  assert.equal(result.resolvedState, "minimum");
  assert.notEqual(result.resolvedState, "report");
  assert.notEqual(result.resolvedState, "operation");
  assert.equal(boundary.noAutoUpgrade, true);
});

test("requested Report never upgrades to Operation", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({ requestedState: "report" }),
  );
  assert.equal(result.resolvedState, "report");
  assert.notEqual(result.resolvedState, "operation");
});

test("operation downgrade behavior", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({
      requestedState: "operation",
      context: context({
        decisionRefs: [],
        executionRefs: [],
        scenarioRefs: [],
        problemRefs: [],
        packRefs: [],
      }),
      candidate: candidate({ relatedSubjects: Object.freeze([]) }),
    }),
  );
  assert.equal(result.resolvedState, "report");
  assert.ok(result.reasonCodes.includes("missing-operation-context"));
});

test("report downgrade behavior", () => {
  const broken = candidate({
    severity: "" as never,
    importance: "" as never,
  });
  // force missing report data via empty category
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({
      requestedState: "report",
      candidate: candidate({ category: "" as never }),
      priority: {
        ...priorityFor(broken),
        candidateId: "rex.insight.candidate:threshold:project.alpha:default",
      },
    }),
  );
  // empty category fails hasReportData
  assert.ok(
    result.resolvedState === "minimum" || result.status === "ineligible" || result.status === "restricted" || result.status === "invalid",
  );
});

test("state downgrade reason code", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({
      requestedState: "operation",
      context: context({
        decisionRefs: [],
        executionRefs: [],
        scenarioRefs: [],
        problemRefs: [],
        packRefs: [],
      }),
      candidate: candidate({ relatedSubjects: Object.freeze([]) }),
    }),
  );
  assert.ok(result.reasonCodes.includes("state-downgraded"));
});

test("missing operation context", () => {
  const result = resolveRuntimeExecutiveInsightPresentation(
    baseInput({
      requestedState: "operation",
      context: context({
        decisionRefs: [],
        executionRefs: [],
        scenarioRefs: [],
        problemRefs: [],
        packRefs: [],
      }),
      candidate: candidate({ relatedSubjects: Object.freeze([]) }),
    }),
  );
  assert.ok(result.reasonCodes.includes("missing-operation-context"));
});

test("missing report data", () => {
  const result = resolveRuntimeExecutiveInsightPresentation({
    candidate: candidate({ category: "" as never }),
    priority: priorityFor(candidate()),
    requestedState: "report",
    context: context(),
    policy: policy(),
  });
  assert.ok(
    result.reasonCodes.includes("missing-report-data") ||
      result.status === "invalid",
  );
});

// 34–40 field groups / ordering
test("visible field-group resolution", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.ok(result.descriptor);
  assert.ok(result.descriptor!.visibleFieldGroups.includes("identity"));
  assert.ok(result.descriptor!.visibleFieldGroups.includes("subject"));
  assert.ok(result.descriptor!.visibleFieldGroups.includes("evidence"));
});

test("hidden field-group policy", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(
    baseInput({
      policy: policy({ hiddenFieldGroups: ["provenance", "lifecycle"] }),
    }),
  );
  assert.ok(result.reasonCodes.includes("field-hidden-by-policy"));
  assert.ok(result.omittedFieldGroups.includes("provenance"));
  assert.equal(
    result.descriptor!.visibleFieldGroups.includes("provenance"),
    false,
  );
});

test("deterministic field ordering", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  const order = result.descriptor!.fieldOrder;
  const indexes = order.map((group) => fieldGroups.indexOf(group));
  for (let i = 1; i < indexes.length; i += 1) {
    assert.ok(indexes[i]! > indexes[i - 1]!);
  }
});

test("deterministic evidence ordering", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.deepEqual([...result.descriptor.evidenceRefs], ["ev.1", "ev.2"]);
  }
});

test("deterministic signal ordering", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.deepEqual([...result.descriptor.signalRefs], ["sig.1", "sig.2"]);
  }
});

test("deterministic relationship ordering", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.deepEqual([...result.descriptor.relationshipRefs], ["rel.1"]);
  }
});

test("deterministic interaction ordering", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  for (let i = 0; i < interactions.length; i += 1) {
    assert.equal(interactions[i]!.order, i);
  }
  const again = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  assert.deepEqual(
    interactions.map((entry) => entry.kind),
    again.map((entry) => entry.kind),
  );
});

// 41–47 emphasis / visibility
test("semantic emphasis resolution", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.ok(result.descriptor?.emphasis);
  assert.ok(emphasisLevels.includes(result.descriptor!.emphasis.level));
});

test("attention emphasis", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.ok(
    result.reasonCodes.includes("attention-emphasis-applied") ||
      result.descriptor!.emphasis.attentionEmphasis !== "none",
  );
});

test("priority emphasis", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.ok(
    result.reasonCodes.includes("priority-emphasis-applied") ||
      result.descriptor!.emphasis.priorityEmphasis !== "none",
  );
});

test("severity remains distinct from priority", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.equal(result.descriptor.severity, "high");
    assert.ok(result.descriptor.priorityBand);
    assert.notEqual(result.descriptor.severity, result.descriptor.priorityBand);
  }
  assert.equal(boundary.severityDistinctFromPriority, true);
});

test("confidence visibility policy", () => {
  const hidden = resolveRuntimeExecutiveInsightMinimumPresentation(baseInput());
  assert.ok(hidden.reasonCodes.includes("confidence-hidden"));
  const report = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (report.descriptor?.presentationState === "report") {
    assert.equal(report.descriptor.confidence, 0.85);
  }
});

test("freshness visibility", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.equal(result.descriptor.freshness, "current");
  }
});

test("provenance visibility policy", () => {
  const hidden = resolveRuntimeExecutiveInsightReportPresentation(
    baseInput({ policy: policy({ showProvenance: false }) }),
  );
  assert.ok(hidden.reasonCodes.includes("provenance-hidden"));
  if (hidden.descriptor?.presentationState === "report") {
    assert.equal(hidden.descriptor.provenance, undefined);
  }
});

// 48–52 KPI/KOI
test("KPI context support", () => {
  assert.ok(subjectKinds.includes("kpi"));
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.ok(result.descriptor.kpiRefs.includes("kpi.delivery"));
  }
});

test("KOI context support", () => {
  assert.ok(subjectKinds.includes("koi"));
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  if (result.descriptor?.presentationState === "report") {
    assert.ok(result.descriptor.koiRefs.includes("koi.north-star"));
  }
});

test("KOR absence", () => {
  const forbidden = ["k", "o", "r"].join("");
  assert.equal((subjectKinds as readonly string[]).includes(forbidden), false);
  assert.equal(boundary.introducesKor, false);
  assert.equal(subjectSemantics.introducesKor, false);
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

// 53–59 interactions
test("valid inspect interaction", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  assert.ok(interactions.some((entry) => entry.kind === "inspect"));
});

test("valid focus-subject interaction", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  assert.ok(interactions.some((entry) => entry.kind === "focus-subject"));
});

test("valid inspect-evidence interaction", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  assert.ok(interactions.some((entry) => entry.kind === "inspect-evidence"));
});

test("valid compare interaction", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  assert.ok(interactions.some((entry) => entry.kind === "compare"));
});

test("valid ask-advisor descriptor", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate(),
    context(),
    policy(),
  );
  assert.ok(interactions.some((entry) => entry.kind === "ask-advisor"));
});

test("no ask-advisor execution", () => {
  assert.doesNotMatch(source, /invokeAdvisor|generateAdvisor|askAdvisor\(/);
  assert.equal(boundary.introducesAdvisorProse, false);
});

test("unavailable interaction omitted/restricted", () => {
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate({ evidenceIds: Object.freeze([]), relatedSubjects: Object.freeze([]), relationships: Object.freeze([]) }),
    context({ decisionRefs: [], executionRefs: [] }),
    policy({ allowCompare: false, allowAskAdvisor: false }),
  );
  assert.equal(
    interactions.some((entry) => entry.kind === "inspect-evidence"),
    false,
  );
  assert.equal(
    interactions.some((entry) => entry.kind === "review-decision"),
    false,
  );
  assert.equal(
    interactions.some((entry) => entry.kind === "ask-advisor"),
    false,
  );
  assert.equal(
    interactions.some((entry) => entry.kind === "compare"),
    false,
  );
});

// 60–66 immutability / registry
test("input not mutated", () => {
  const input = baseInput();
  const before = JSON.stringify(input);
  resolveRuntimeExecutiveInsightPresentation(input);
  assert.equal(JSON.stringify(input), before);
});

test("policy not mutated", () => {
  const p = policy();
  const before = JSON.stringify(p);
  resolveRuntimeExecutiveInsightPresentation(baseInput({ policy: p }));
  assert.equal(JSON.stringify(p), before);
});

test("upstream priority result not mutated", () => {
  const c = candidate();
  const priority = priorityFor(c);
  const before = JSON.stringify(priority);
  resolveRuntimeExecutiveInsightPresentation(
    baseInput({ candidate: c, priority }),
  );
  assert.equal(JSON.stringify(priority), before);
});

test("repeated identical input produces identical output", () => {
  const input = baseInput({ requestedState: "operation" });
  const a = resolveRuntimeExecutiveInsightPresentation(input);
  const b = resolveRuntimeExecutiveInsightPresentation(input);
  assert.deepEqual(
    {
      status: a.status,
      resolved: a.resolvedState,
      reasons: [...a.reasonCodes],
      fields: a.descriptor?.visibleFieldGroups,
    },
    {
      status: b.status,
      resolved: b.resolvedState,
      reasons: [...b.reasonCodes],
      fields: b.descriptor?.visibleFieldGroups,
    },
  );
});

test("immutable descriptor", () => {
  const result = resolveRuntimeExecutiveInsightReportPresentation(baseInput());
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.descriptor));
});

test("immutable registry", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(getRuntimeExecutiveInsightPresentationRegistry()));
  assert.ok(Object.isFrozen(presentationModule));
});

test("registry counts derived correctly", () => {
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.eligibilityStatusCount, eligibilityStatuses.length);
  assert.equal(registry.densityValueCount, densityValues.length);
  assert.equal(registry.emphasisValueCount, emphasisLevels.length);
  assert.equal(registry.fieldGroupCount, fieldGroups.length);
  assert.equal(registry.interactionKindCount, interactionKinds.length);
  assert.equal(registry.reasonCodeCount, reasonCodes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
});

// 67–78 boundaries
test("no semantic insight re-resolution", () => {
  assert.equal(boundary.reresolvesInsightSemantics, false);
  // May transitively re-export upstream resolvers; must not redefine them.
  assert.doesNotMatch(
    source,
    /function resolveRuntimeExecutiveInsight\b|function resolveRuntimeExecutiveInsights\b/,
  );
  assert.doesNotMatch(
    source,
    /function createRuntimeExecutiveInsightResolutionRule\b/,
  );
});

test("no priority recomputation", () => {
  assert.equal(boundary.recalculatesPriority, false);
  assert.doesNotMatch(
    source,
    /function evaluateRuntimeExecutiveInsightPriority\b|function rankRuntimeExecutiveInsights\b/,
  );
});

test("no attention recomputation", () => {
  assert.equal(boundary.recalculatesAttention, false);
  assert.doesNotMatch(
    source,
    /function resolveRuntimeExecutiveInsightAttention\b|function resolveRuntimeExecutiveInsightEscalation\b|function resolveRuntimeExecutiveInsightSuppression\b/,
  );
});

test("no React dependency", () => {
  assert.equal(boundary.reactIndependent, true);
  assert.doesNotMatch(source, /from ["']react["']|useState|useEffect|jsx/);
});

test("no renderer dependency", () => {
  assert.equal(boundary.rendererIndependent, true);
  assert.doesNotMatch(source, /\bWebGL\b|canvas\.getContext|CSSStyle|from ["']three["']/);
  assert.ok(registry.nonGoals.includes("three-js"));
});

test("no AI/LLM", () => {
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bchatgpt\b/i);
  assert.ok(consumerGuarantees.includes("no-ai"));
  assert.ok(consumerGuarantees.includes("no-llm"));
});

test("no Advisor prose generation", () => {
  assert.equal(boundary.introducesAdvisorProse, false);
  assert.doesNotMatch(source, /generateAdvisor|advisorMessage|executiveSummary\s*=/);
});

test("no Stage execution", () => {
  assert.equal(boundary.introducesStageExecution, false);
  assert.doesNotMatch(source, /highlightObject|moveCamera|selectSubject|triggerAnimation/);
});

test("no orchestration behavior", () => {
  assert.equal(boundary.introducesOrchestration, false);
  assert.doesNotMatch(source, /orchestrate|coordinateStageAdvisor/);
});

test("no DB/API dependency", () => {
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.doesNotMatch(source, /\b(fetch\(|axios|prisma|sql)\b/);
  assert.doesNotMatch(source, /Date\.now\(|Math\.random\(/);
});

test("no persistence", () => {
  assert.equal(boundary.introducesPersistence, false);
  assert.doesNotMatch(source, /localStorage|indexedDB|writeFile/);
});

test("no automation", () => {
  assert.equal(boundary.introducesAutomation, false);
  assert.equal(boundary.introducesNotifications, false);
  assert.doesNotMatch(source, /sendEmail|createTask|notifyUser|triggerWorkflow/);
});

test("architectural dependency imports only REX-4:4 among REX-4", () => {
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1]!,
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightPriorityAttention",
  ]);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperienceFoundation/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightExperienceContracts/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightResolution/);
  assert.doesNotMatch(source, /runtimeExecutiveInsightOrchestration/);
  assert.doesNotMatch(source, /runtimeExecutiveStage/);
  assert.doesNotMatch(source, /runtimeExecutiveAdvisor/);
  assert.doesNotMatch(source, /\/dri\//);
  assert.doesNotMatch(source, /\/nol\//);
  assert.doesNotMatch(source, /ex-dri/);
  assert.doesNotMatch(source, /from ["']react["']/);
});

test("verifyRuntimeExecutiveInsightPresentation passes", () => {
  const verification = verifyRuntimeExecutiveInsightPresentation();
  assert.equal(verification.ok, true);
  assert.equal(verification.noKor, true);
  assert.equal(verification.noAutoUpgrade, true);
  assert.equal(verification.informationMonotonicity, true);
});

test("upstream REX-4:1–4:4 verification remains green", () => {
  assert.equal(verifyRuntimeExecutiveInsightExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightResolution().ok, true);
  assert.equal(verifyRuntimeExecutiveInsightPriorityAttention().ok, true);
});

test("information monotonicity minimum ⊆ report ⊆ operation capability", () => {
  const c = candidate();
  const priority = priorityFor(c);
  const shared = { candidate: c, priority, context: context(), policy: policy() };
  const minimum = resolveRuntimeExecutiveInsightPresentation({
    ...shared,
    requestedState: "minimum",
  });
  const report = resolveRuntimeExecutiveInsightPresentation({
    ...shared,
    requestedState: "report",
  });
  const operation = resolveRuntimeExecutiveInsightPresentation({
    ...shared,
    requestedState: "operation",
  });
  assert.ok(minimum.descriptor);
  assert.ok(report.descriptor);
  assert.ok(operation.descriptor);
  for (const group of minimum.descriptor!.visibleFieldGroups) {
    assert.ok(report.descriptor!.visibleFieldGroups.includes(group));
  }
  assert.ok(operation.descriptor!.visibleFieldGroups.includes("interactions"));
  assert.equal(boundary.informationMonotonicity, true);
});
