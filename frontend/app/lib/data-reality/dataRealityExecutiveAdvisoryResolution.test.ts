/**
 * P1:4 — Executive Advisory Candidate & Guidance Resolution unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import type { NexoraDataRealitySnapshot } from "./dataRealityContracts.ts";
import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import { buildDataRealityAwareAdvisorContext } from "./dataRealityAwareAdvisorContextResolution.ts";
import {
  DATA_REALITY_ADVISOR_STATE_TO_GUIDANCE_PRIORITY,
  DATA_REALITY_EXECUTIVE_ADVISORY_CORE_PRINCIPLE,
  DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_INVARIANTS,
  DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_PRINCIPLES,
  DATA_REALITY_EXECUTIVE_GUIDANCE_KINDS,
  DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITIES,
  dataRealityExecutiveAdvisoryResolutionArchitecturalRole,
  dataRealityExecutiveAdvisoryResolutionIdentity,
  dataRealityExecutiveAdvisoryResolutionNamespace,
  dataRealityExecutiveAdvisoryResolutionPhase,
  dataRealityExecutiveAdvisoryResolutionVersion,
  getDataRealityExecutiveAdvisoryResolutionIdentity,
  getDataRealityExecutiveAdvisoryResolutionMetadata,
  resolveDataRealityAdvisoryCandidates,
  resolveDataRealityExecutiveAdvisoryResolution,
  resolveDataRealityExecutiveGuidance,
  resolveGuidancePriorityFromAdvisorState,
} from "./dataRealityExecutiveAdvisoryResolution.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "dataRealityExecutiveAdvisoryResolution.ts");

function snapshotFor(
  scenario: "baseline" | "operational-pressure",
): NexoraDataRealitySnapshot {
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();
  return resolveDatasetExecutiveReality(dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  }).snapshot;
}

function contextFor(
  scenario: "baseline" | "operational-pressure",
  options: {
    readonly focusedObjectId?: string;
    readonly selectedObjectIds?: readonly string[];
    readonly currentWorkspace?: string;
    readonly currentScenarioId?: string;
    readonly currentDecisionId?: string;
    readonly requestedIntent?:
      | "observe"
      | "explain"
      | "investigate"
      | "compare"
      | "prioritize"
      | "recommend"
      | "simulate"
      | "decide"
      | "act";
  } = {},
) {
  return buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor(scenario),
    focusedObjectId: options.focusedObjectId,
    selectedObjectIds: options.selectedObjectIds,
    currentWorkspace: options.currentWorkspace ?? "problem",
    currentScenarioId: options.currentScenarioId,
    currentDecisionId: options.currentDecisionId,
    requestedIntent: options.requestedIntent,
  });
}

test("P1:4 identity and metadata", () => {
  const identity = getDataRealityExecutiveAdvisoryResolutionIdentity();
  assert.equal(
    dataRealityExecutiveAdvisoryResolutionIdentity,
    "P1:4/ExecutiveAdvisoryCandidateGuidanceResolution",
  );
  assert.equal(
    identity.identity,
    "P1:4/ExecutiveAdvisoryCandidateGuidanceResolution",
  );
  assert.equal(dataRealityExecutiveAdvisoryResolutionVersion, "1.0.0");
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    dataRealityExecutiveAdvisoryResolutionNamespace,
    "nexora.data-reality.executive-advisor.advisory-resolution",
  );
  assert.equal(
    identity.namespace,
    "nexora.data-reality.executive-advisor.advisory-resolution",
  );
  assert.equal(
    dataRealityExecutiveAdvisoryResolutionPhase,
    "AdvisoryCandidateGuidanceResolution",
  );
  assert.equal(identity.phase, "AdvisoryCandidateGuidanceResolution");
  assert.equal(
    dataRealityExecutiveAdvisoryResolutionArchitecturalRole,
    "ExecutiveAdvisoryCandidateGuidanceResolver",
  );
  assert.equal(
    identity.architecturalRole,
    "ExecutiveAdvisoryCandidateGuidanceResolver",
  );

  const metadata = getDataRealityExecutiveAdvisoryResolutionMetadata();
  assert.equal(DATA_REALITY_EXECUTIVE_GUIDANCE_KINDS.length, 8);
  assert.equal(DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITIES.length, 4);
  assert.equal(metadata.capabilities.length, 18);
  assert.equal(metadata.invariants.length, 35);
  assert.equal(metadata.principles.length, 8);
  assert.equal(
    DATA_REALITY_EXECUTIVE_ADVISORY_CORE_PRINCIPLE,
    "Advice must emerge from Context, not bypass Reality.",
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_CAPABILITIES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_INVARIANTS),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_PRINCIPLES),
    true,
  );
});

test("P1:4 guidance priority mapping", () => {
  assert.equal(resolveGuidancePriorityFromAdvisorState("stable"), "low");
  assert.equal(resolveGuidancePriorityFromAdvisorState("unresolved"), "medium");
  assert.equal(resolveGuidancePriorityFromAdvisorState("watch"), "medium");
  assert.equal(resolveGuidancePriorityFromAdvisorState("opportunity"), "medium");
  assert.equal(resolveGuidancePriorityFromAdvisorState("risk"), "high");
  assert.equal(resolveGuidancePriorityFromAdvisorState("critical"), "urgent");
  assert.equal(DATA_REALITY_ADVISOR_STATE_TO_GUIDANCE_PRIORITY.critical, "urgent");
});

test("P1:4 Dataset A advisory profile is medium, not urgent", () => {
  const context = contextFor("baseline", {
    focusedObjectId: "obj-capacity",
    requestedIntent: "investigate",
  });
  const result = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
  });

  assert.equal(context.dominantState, "watch");
  assert.equal(context.attention, "medium");
  assert.ok(result.candidates.length > 0);
  assert.ok(result.guidance.length > 0);
  assert.equal(
    result.guidance.some((entry) => entry.priority === "urgent"),
    false,
  );
  assert.equal(
    result.guidance.some((entry) => entry.kind === "escalate"),
    false,
  );

  const productionGuidance = result.guidance.find(
    (entry) =>
      entry.subjectId === "obj-capacity" && entry.kind === "investigate",
  )!;
  assert.ok(productionGuidance);
  assert.equal(productionGuidance.priority, "medium");
  assert.match(productionGuidance.title, /production capacity/i);

  const costGuidance = result.guidance.filter(
    (entry) => entry.subjectId === "cost",
  );
  assert.ok(costGuidance.some((entry) => entry.kind === "investigate"));
  assert.ok(costGuidance.some((entry) => entry.kind === "defer"));
  assert.equal(
    costGuidance.some((entry) => entry.kind === "recommend"),
    false,
  );
});

test("P1:4 Dataset B advisory profile is urgent and critical-ranked", () => {
  const context = contextFor("operational-pressure", {
    focusedObjectId: "obj-capacity",
    requestedIntent: "investigate",
  });
  const result = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
  });

  assert.equal(context.dominantState, "critical");
  assert.equal(context.attention, "immediate");
  assert.ok(result.guidance.some((entry) => entry.priority === "urgent"));
  assert.ok(result.guidance.some((entry) => entry.kind === "escalate"));
  assert.ok(
    result.candidates.some(
      (entry) =>
        entry.subjectId === "obj-capacity" && entry.intent === "investigate",
    ),
  );
  assert.ok(
    result.candidates.some(
      (entry) =>
        entry.subjectId === "obj-capacity" && entry.intent === "recommend",
    ),
  );

  const primaryGuidance = result.guidance.find(
    (entry) => entry.id === result.primaryGuidanceId,
  )!;
  assert.equal(primaryGuidance.priority, "urgent");
  assert.equal(primaryGuidance.subjectId, "obj-capacity");
});

test("P1:4 cross-dataset same interaction → different advice", () => {
  const shared = {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory", "obj-delivery"] as const,
    currentWorkspace: "problem" as const,
    requestedIntent: "investigate" as const,
  };

  const a = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextFor("baseline", shared),
    requestedIntent: "investigate",
  });
  const b = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextFor("operational-pressure", shared),
    requestedIntent: "investigate",
  });

  assert.equal(
    a.guidance.some((entry) => entry.priority === "urgent"),
    false,
  );
  assert.ok(b.guidance.some((entry) => entry.priority === "urgent"));
  assert.notDeepEqual(
    a.candidates.map((entry) => entry.id),
    b.candidates.map((entry) => entry.id),
  );
  assert.notDeepEqual(
    a.guidance.map((entry) => `${entry.id}:${entry.priority}`),
    b.guidance.map((entry) => `${entry.id}:${entry.priority}`),
  );
});

test("P1:4 requested intent boost and unavailable capability", () => {
  const available = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextFor("baseline", {
      focusedObjectId: "obj-capacity",
      requestedIntent: "investigate",
    }),
    requestedIntent: "investigate",
  });
  assert.ok(
    available.resolutionReasons.includes("requested-intent:investigate:matched"),
  );
  assert.ok(available.primaryCandidateId?.includes(":investigate:"));

  const unsupported = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextFor("baseline", {
      focusedObjectId: "obj-capacity",
      requestedIntent: "simulate",
    }),
    requestedIntent: "simulate",
  });
  assert.equal(
    unsupported.candidates.some((entry) => entry.intent === "simulate"),
    false,
  );
  assert.equal(
    unsupported.guidance.some((entry) => entry.kind === "simulate"),
    false,
  );
  assert.ok(
    unsupported.resolutionReasons.includes(
      "requested-intent:simulate:unavailable",
    ),
  );

  const scenario = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextFor("operational-pressure", {
      focusedObjectId: "obj-capacity",
      currentScenarioId: "scenario-pressure",
      requestedIntent: "simulate",
    }),
    requestedIntent: "simulate",
  });
  assert.ok(scenario.candidates.some((entry) => entry.intent === "simulate"));
  assert.ok(scenario.guidance.some((entry) => entry.kind === "simulate"));
});

test("P1:4 recommendation safety and boundary", () => {
  const context = contextFor("operational-pressure", {
    focusedObjectId: "obj-capacity",
    requestedIntent: "recommend",
  });
  const result = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "recommend",
  });

  const recommendations = result.candidates.filter(
    (entry) => entry.intent === "recommend",
  );
  assert.ok(recommendations.length > 0);
  for (const candidate of recommendations) {
    assert.match(candidate.title, /Consider/i);
    assert.equal(candidate.title.includes("Increase"), false);
    assert.equal(candidate.title.includes("Buy"), false);
    assert.match(candidate.rationale, /not as approved decisions|advisory candidates/i);
  }

  const cost = result.candidates.filter((entry) => entry.subjectId === "cost");
  assert.equal(
    cost.some((entry) => entry.intent === "recommend"),
    false,
  );

  const baseContext = contextFor("baseline", {
    focusedObjectId: "obj-capacity",
  });
  const noRecommendContext = Object.freeze({
    ...baseContext,
    availableIntents: Object.freeze([
      "observe",
      "explain",
      "investigate",
      "compare",
      "prioritize",
    ] as const),
  });
  assert.equal(
    noRecommendContext.availableIntents.some(
      (intent) => String(intent) === "recommend",
    ),
    false,
  );
  const noRecommend = resolveDataRealityAdvisoryCandidates({
    context: noRecommendContext,
  });
  assert.equal(
    noRecommend.some((entry) => entry.intent === "recommend"),
    false,
  );
});

test("P1:4 escalation requires critical severity", () => {
  const watchOnly = resolveDataRealityExecutiveGuidance({
    context: contextFor("baseline", { focusedObjectId: "obj-capacity" }),
  });
  assert.equal(
    watchOnly.some((entry) => entry.kind === "escalate"),
    false,
  );

  const criticalContext = contextFor("operational-pressure", {
    focusedObjectId: "obj-capacity",
  });
  const critical = resolveDataRealityExecutiveGuidance({
    context: criticalContext,
  });
  assert.ok(critical.some((entry) => entry.kind === "escalate"));
  for (const entry of critical.filter((item) => item.kind === "escalate")) {
    const observation = criticalContext.observations.find(
      (obs) => obs.subjectId === entry.subjectId,
    );
    assert.equal(observation?.state, "critical");
  }
});

test("P1:4 focus relevance coexists with critical severity", () => {
  const context = contextFor("operational-pressure", {
    focusedObjectId: "obj-revenue",
    requestedIntent: "investigate",
  });
  const result = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
    maxCandidates: 10,
  });

  assert.equal(context.primarySubjectId, "obj-revenue");
  assert.ok(
    result.candidates.some((entry) => entry.subjectId === "obj-revenue"),
  );

  const criticalGuidance = result.guidance.filter(
    (entry) => entry.priority === "urgent",
  );
  assert.ok(criticalGuidance.length > 0);
  assert.ok(
    criticalGuidance.some((entry) => entry.subjectId === "obj-capacity"),
  );

  const primary = result.guidance.find(
    (entry) => entry.id === result.primaryGuidanceId,
  )!;
  assert.equal(primary.priority, "urgent");
  assert.notEqual(primary.subjectId, "obj-revenue");
});

test("P1:4 unresolved protection for Cost", () => {
  const result = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextFor("baseline", { focusedObjectId: "obj-capacity" }),
    maxCandidates: 20,
    includeLowAttention: true,
  });

  const costCandidates = result.candidates.filter(
    (entry) => entry.subjectId === "cost",
  );
  const costGuidance = result.guidance.filter(
    (entry) => entry.subjectId === "cost",
  );

  assert.ok(costCandidates.every((entry) => entry.intent === "investigate"));
  assert.ok(costGuidance.some((entry) => entry.kind === "investigate"));
  assert.ok(costGuidance.some((entry) => entry.kind === "defer"));
  assert.equal(
    costGuidance.some((entry) => entry.kind === "recommend"),
    false,
  );
  assert.equal(
    costGuidance.some((entry) => entry.kind === "escalate"),
    false,
  );
  for (const guidance of costGuidance) {
    assert.equal(guidance.blockedByUnresolvedReality, true);
    assert.equal(/poor|reduce costs|unhealthy/i.test(guidance.title), false);
    assert.equal(/poor|reduce costs|unhealthy/i.test(guidance.rationale), false);
  }
  assert.ok(
    result.resolutionReasons.some((reason) =>
      reason.startsWith("unresolved-protection:cost"),
    ),
  );
});

test("P1:4 evidence/observation/candidate reference integrity", () => {
  const context = contextFor("operational-pressure", {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory"],
    requestedIntent: "investigate",
  });
  const result = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
    maxCandidates: 8,
  });

  const evidenceIds = new Set(context.evidence.map((entry) => entry.id));
  const observationIds = new Set(context.observations.map((entry) => entry.id));
  const candidateIds = new Set(result.candidates.map((entry) => entry.id));

  for (const candidate of result.candidates) {
    for (const evidenceId of candidate.evidenceIds) {
      assert.ok(evidenceIds.has(evidenceId), `candidate dangling ${evidenceId}`);
    }
  }
  for (const guidance of result.guidance) {
    for (const evidenceId of guidance.evidenceIds) {
      assert.ok(evidenceIds.has(evidenceId), `guidance dangling evidence ${evidenceId}`);
    }
    for (const observationId of guidance.observationIds) {
      assert.ok(
        observationIds.has(observationId),
        `guidance dangling observation ${observationId}`,
      );
    }
    for (const candidateId of guidance.sourceCandidateIds) {
      assert.ok(
        candidateIds.has(candidateId),
        `guidance dangling candidate ${candidateId}`,
      );
    }
  }
});

test("P1:4 determinism and immutability", () => {
  const context = contextFor("baseline", {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-customer"],
    requestedIntent: "investigate",
  });
  const contextJson = JSON.stringify(context);

  const a = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
  });
  const b = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
  });

  assert.equal(JSON.stringify(context), contextJson);
  assert.deepEqual(a, b);
  assert.equal(Object.isFrozen(a), true);
  assert.equal(Object.isFrozen(a.candidates), true);
  assert.equal(Object.isFrozen(a.guidance), true);
  assert.equal(Object.isFrozen(a.resolutionReasons), true);
});

test("P1:4 end-to-end Dataset→P0→P1:2→P1:3→P1:4 causal proof", () => {
  const shared = {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory"] as const,
    currentWorkspace: "problem" as const,
    requestedIntent: "investigate" as const,
  };

  const contextA = contextFor("baseline", shared);
  const contextB = contextFor("operational-pressure", shared);
  const a = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextA,
    requestedIntent: "investigate",
  });
  const b = resolveDataRealityExecutiveAdvisoryResolution({
    context: contextB,
    requestedIntent: "investigate",
  });

  assert.equal(contextA.dominantState, "watch");
  assert.equal(contextA.attention, "medium");
  assert.equal(contextB.dominantState, "critical");
  assert.equal(contextB.attention, "immediate");

  assert.equal(
    a.guidance.some((entry) => entry.kind === "escalate"),
    false,
  );
  assert.ok(b.guidance.some((entry) => entry.kind === "escalate"));
  assert.ok(b.guidance.some((entry) => entry.priority === "urgent"));

  const meaningA = contextA.observations.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!.executiveMeaning;
  const meaningB = contextB.observations.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!.executiveMeaning;
  assert.notEqual(meaningA, meaningB);
  assert.notDeepEqual(
    a.candidates.map((entry) => entry.id),
    b.candidates.map((entry) => entry.id),
  );
});

test("P1:4 dependency and non-duplication rules", () => {
  const source = readFileSync(sourcePath, "utf8");
  assert.ok(
    source.includes('from "./dataRealityAwareExecutiveAdvisorFoundation.ts"'),
  );
  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
  assert.equal(/buildDataRealityAwareAdvisorContext/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveObservationResolution/.test(source), false);
  assert.equal(
    /export\s+(type|interface)\s+DataRealityAdvisoryCandidate\b/.test(source),
    false,
  );
  assert.equal(
    /export\s+(type|interface)\s+DataRealityAwareAdvisorContext\b/.test(source),
    false,
  );

  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']next\//,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
  ];
  for (const pattern of forbidden) {
    assert.equal(pattern.test(source), false, String(pattern));
  }
});
