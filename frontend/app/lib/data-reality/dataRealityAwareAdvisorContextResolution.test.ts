/**
 * P1:3 — Data-Reality-Aware Advisor Context Resolution unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import type { NexoraDataRealitySnapshot } from "./dataRealityContracts.ts";
import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import {
  DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_CAPABILITIES,
  DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_INVARIANTS,
  DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_PRINCIPLES,
  buildDataRealityAwareAdvisorContext,
  dataRealityAwareAdvisorContextResolutionArchitecturalRole,
  dataRealityAwareAdvisorContextResolutionIdentity,
  dataRealityAwareAdvisorContextResolutionNamespace,
  dataRealityAwareAdvisorContextResolutionPhase,
  dataRealityAwareAdvisorContextResolutionVersion,
  getDataRealityAwareAdvisorContextResolutionIdentity,
  getDataRealityAwareAdvisorContextResolutionMetadata,
  resolveDataRealityAdvisorAvailableIntents,
  resolveDataRealityAwareAdvisorContext,
} from "./dataRealityAwareAdvisorContextResolution.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(
  here,
  "dataRealityAwareAdvisorContextResolution.ts",
);

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

function emptySnapshot(): NexoraDataRealitySnapshot {
  return Object.freeze({
    datasetId: "empty-reality",
    facts: Object.freeze([]),
    kpis: Object.freeze([]),
    objectStates: Object.freeze([]),
    createdAt: "2026-08-10T00:00:00.000Z",
  });
}

test("P1:3 identity and metadata", () => {
  const identity = getDataRealityAwareAdvisorContextResolutionIdentity();
  assert.equal(
    dataRealityAwareAdvisorContextResolutionIdentity,
    "P1:3/DataRealityAwareAdvisorContextResolution",
  );
  assert.equal(
    identity.identity,
    "P1:3/DataRealityAwareAdvisorContextResolution",
  );
  assert.equal(dataRealityAwareAdvisorContextResolutionVersion, "1.0.0");
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    dataRealityAwareAdvisorContextResolutionNamespace,
    "nexora.data-reality.executive-advisor.context-resolution",
  );
  assert.equal(
    identity.namespace,
    "nexora.data-reality.executive-advisor.context-resolution",
  );
  assert.equal(
    dataRealityAwareAdvisorContextResolutionPhase,
    "AdvisorContextResolution",
  );
  assert.equal(identity.phase, "AdvisorContextResolution");
  assert.equal(
    dataRealityAwareAdvisorContextResolutionArchitecturalRole,
    "DataRealityAwareAdvisorContextResolver",
  );
  assert.equal(
    identity.architecturalRole,
    "DataRealityAwareAdvisorContextResolver",
  );

  const metadata = getDataRealityAwareAdvisorContextResolutionMetadata();
  assert.equal(metadata.capabilities.length, 16);
  assert.equal(metadata.invariants.length, 25);
  assert.equal(metadata.principles.length, 8);
  assert.equal(
    Object.isFrozen(DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_CAPABILITIES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_INVARIANTS),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_PRINCIPLES),
    true,
  );
});

test("P1:3 Dataset A enterprise/focus context", () => {
  const snapshot = snapshotFor("baseline");
  const result = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: "obj-capacity",
    currentWorkspace: "problem",
    requestedIntent: "investigate",
  });

  assert.equal(result.context.dominantState, "watch");
  assert.equal(result.context.attention, "medium");
  assert.equal(result.context.primarySubjectKind, "object");
  assert.equal(result.context.primarySubjectId, "obj-capacity");
  assert.equal(result.context.observations[0]!.subjectId, "obj-capacity");
  assert.equal(result.context.observations[0]!.state, "watch");
  assert.ok(
    result.context.evidence[0]!.subjectId === "obj-capacity" ||
      result.context.evidence.some((entry) => entry.subjectId === "obj-capacity"),
  );
  assert.equal(result.context.evidence[0]!.subjectId, "obj-capacity");
  assert.equal(result.requestedIntentAvailable, true);
  assert.ok(result.context.availableIntents.includes("investigate"));
  assert.ok(result.context.availableIntents.includes("recommend"));
});

test("P1:3 Dataset B focus keeps enterprise critical reality", () => {
  const snapshot = snapshotFor("operational-pressure");
  const result = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: "obj-revenue",
    currentWorkspace: "problem",
    requestedIntent: "investigate",
  });

  assert.equal(result.context.primarySubjectId, "obj-revenue");
  assert.equal(result.context.observations[0]!.subjectId, "obj-revenue");
  assert.equal(result.context.observations[0]!.state, "watch");
  assert.equal(result.context.dominantState, "critical");
  assert.equal(result.context.attention, "immediate");
});

test("P1:3 cross-dataset same interaction → different advisor context", () => {
  const interaction = {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory", "obj-delivery"] as const,
    currentWorkspace: "problem",
    requestedIntent: "investigate" as const,
  };

  const a = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("baseline"),
    ...interaction,
  });
  const b = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("operational-pressure"),
    ...interaction,
  });

  assert.equal(a.context.primarySubjectId, "obj-capacity");
  assert.equal(b.context.primarySubjectId, "obj-capacity");
  assert.equal(a.context.dominantState, "watch");
  assert.equal(b.context.dominantState, "critical");
  assert.equal(a.context.attention, "medium");
  assert.equal(b.context.attention, "immediate");

  const productionA = a.context.observations.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!;
  const productionB = b.context.observations.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!;
  assert.equal(productionA.state, "watch");
  assert.equal(productionB.state, "critical");
  assert.notEqual(productionA.executiveMeaning, productionB.executiveMeaning);

  const kpiA = a.context.evidence.find(
    (entry) => entry.id === "evidence:obj-capacity:kpi:capacity-utilization",
  )!;
  const kpiB = b.context.evidence.find(
    (entry) => entry.id === "evidence:obj-capacity:kpi:capacity-utilization",
  )!;
  assert.notEqual(kpiA.value, kpiB.value);
  assert.notEqual(a.context.contextId, b.context.contextId);
});

test("P1:3 invalid focus falls back without fabricating reality", () => {
  const snapshot = snapshotFor("baseline");
  const beforeCount = snapshot.objectStates.length;
  const result = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: "obj-does-not-exist",
  });

  assert.equal(snapshot.objectStates.length, beforeCount);
  assert.equal(result.context.focusedObjectId, undefined);
  assert.notEqual(result.context.primarySubjectId, "obj-does-not-exist");
  assert.ok(
    result.resolutionReasons.some((reason) =>
      reason === "invalid-focus:obj-does-not-exist"
    ),
  );
  assert.equal(
    result.context.observations.some(
      (entry) => entry.subjectId === "obj-does-not-exist",
    ),
    false,
  );
  assert.equal(
    result.context.evidence.some(
      (entry) => entry.subjectId === "obj-does-not-exist",
    ),
    false,
  );
  assert.ok(result.context.primarySubjectKind.length > 0);
});

test("P1:3 selection dedupe, priority, and unknown rejection", () => {
  const snapshot = snapshotFor("baseline");
  const selectedInput = [
    "obj-inventory",
    "obj-delivery",
    "obj-inventory",
    "obj-unknown",
  ];
  const result = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: "obj-capacity",
    selectedObjectIds: selectedInput,
  });

  assert.deepEqual([...result.context.selectedObjectIds], [
    "obj-inventory",
    "obj-delivery",
  ]);
  assert.equal(result.context.observations[0]!.subjectId, "obj-capacity");
  assert.ok(
    result.context.observations.findIndex(
      (entry) => entry.subjectId === "obj-inventory",
    ) <
      result.context.observations.findIndex(
        (entry) => entry.subjectId === "obj-revenue",
      ),
  );
  assert.ok(
    result.resolutionReasons.includes("unknown-selection:obj-unknown"),
  );
  assert.equal(selectedInput.length, 4);
});

test("P1:3 available intent resolution and requested-intent safety", () => {
  const enterprise = resolveDataRealityAdvisorAvailableIntents({
    primarySubject: Object.freeze({
      subjectKind: "enterprise",
      reason: "fallback-subject:enterprise",
    }),
    hasValidFocus: false,
  });
  assert.deepEqual([...enterprise], [
    "observe",
    "explain",
    "investigate",
    "compare",
    "prioritize",
  ]);

  const focused = resolveDataRealityAdvisorAvailableIntents({
    primarySubject: Object.freeze({
      subjectKind: "object",
      subjectId: "obj-capacity",
      reason: "focused-object",
    }),
    focusedObjectId: "obj-capacity",
    hasValidFocus: true,
  });
  assert.ok(focused.includes("recommend"));

  const scenario = resolveDataRealityAdvisorAvailableIntents({
    primarySubject: Object.freeze({
      subjectKind: "scenario",
      subjectId: "scenario-1",
      reason: "current-scenario",
    }),
    hasValidFocus: false,
    currentScenarioId: "scenario-1",
  });
  assert.ok(scenario.includes("simulate"));

  const decision = resolveDataRealityAdvisorAvailableIntents({
    primarySubject: Object.freeze({
      subjectKind: "decision",
      subjectId: "decision-1",
      reason: "current-decision",
    }),
    hasValidFocus: false,
    currentDecisionId: "decision-1",
  });
  assert.ok(decision.includes("decide"));

  const unsupported = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("baseline"),
    requestedIntent: "simulate",
  });
  assert.equal(unsupported.requestedIntent, "simulate");
  assert.equal(unsupported.requestedIntentAvailable, false);
  assert.equal(unsupported.context.availableIntents.includes("simulate"), false);
  assert.ok(
    unsupported.resolutionReasons.includes("requested-intent:unavailable"),
  );

  const actUnsupported = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("baseline"),
    requestedIntent: "act",
  });
  assert.equal(actUnsupported.requestedIntentAvailable, false);
  assert.equal(actUnsupported.context.availableIntents.includes("act"), false);
});

test("P1:3 limited reality remains valid and unresolved-aware", () => {
  const context = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: emptySnapshot(),
  });
  assert.equal(context.primarySubjectKind, "enterprise");
  assert.equal(context.dominantState, "unresolved");
  assert.equal(context.observations.length, 0);
  assert.equal(context.evidence.length, 0);
  assert.equal(context.questions.length, 0);
  assert.equal(context.advisoryCandidates.length, 0);
  assert.ok(context.availableIntents.includes("observe"));
});

test("P1:3 questions and advisory candidates remain empty", () => {
  const context = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("operational-pressure"),
    focusedObjectId: "obj-capacity",
    requestedIntent: "recommend",
  });
  assert.equal(context.questions.length, 0);
  assert.equal(context.advisoryCandidates.length, 0);
});

test("P1:3 evidence integrity and determinism/immutability", () => {
  const snapshot = snapshotFor("baseline");
  const originalJson = JSON.stringify(snapshot);
  const selected = ["obj-customer", "obj-delivery"] as const;

  const a = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: "obj-capacity",
    selectedObjectIds: selected,
    currentWorkspace: "problem",
    requestedIntent: "investigate",
  });
  const b = resolveDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: "obj-capacity",
    selectedObjectIds: selected,
    currentWorkspace: "problem",
    requestedIntent: "investigate",
  });

  assert.equal(JSON.stringify(snapshot), originalJson);
  assert.deepEqual(a, b);
  assert.equal(a.context.contextId, b.context.contextId);
  assert.equal(Object.isFrozen(a), true);
  assert.equal(Object.isFrozen(a.context), true);
  assert.equal(Object.isFrozen(a.context.observations), true);
  assert.equal(Object.isFrozen(a.context.evidence), true);
  assert.equal(Object.isFrozen(a.context.availableIntents), true);

  const evidenceIds = new Set(a.context.evidence.map((entry) => entry.id));
  for (const observation of a.context.observations) {
    for (const evidenceId of observation.evidenceIds) {
      assert.ok(
        evidenceIds.has(evidenceId),
        `dangling evidence ${evidenceId} on ${observation.id}`,
      );
    }
  }
});

test("P1:3 end-to-end Dataset→P0→P1:2→P1:3 reality awareness", () => {
  const shared = {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory"] as const,
    currentWorkspace: "problem",
    requestedIntent: "investigate" as const,
  };

  const a = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("baseline"),
    ...shared,
  });
  const b = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("operational-pressure"),
    ...shared,
  });

  assert.equal(a.primarySubjectId, b.primarySubjectId);
  assert.notEqual(a.dominantState, b.dominantState);
  assert.notEqual(a.attention, b.attention);

  const meaningA = a.observations.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!.executiveMeaning;
  const meaningB = b.observations.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!.executiveMeaning;
  assert.notEqual(meaningA, meaningB);

  assert.notDeepEqual(
    a.evidence.map((entry) => `${entry.id}:${String(entry.value)}`).sort(),
    b.evidence.map((entry) => `${entry.id}:${String(entry.value)}`).sort(),
  );
});

test("P1:3 dependency and non-duplication rules", () => {
  const source = readFileSync(sourcePath, "utf8");
  assert.ok(
    source.includes("resolveDataRealityExecutiveObservationResolution"),
  );
  assert.ok(
    source.includes('from "./dataRealityAwareExecutiveAdvisorFoundation.ts"'),
  );
  assert.ok(
    source.includes('from "./dataRealityExecutiveObservationResolution.ts"'),
  );

  assert.equal(
    /export\s+(type|interface)\s+DataRealityAwareAdvisorContext\b/.test(source),
    false,
  );
  assert.equal(
    /export\s+(type|interface)\s+DataRealityAdvisorEvidence\b/.test(source),
    false,
  );
  assert.equal(
    /export\s+(type|interface)\s+DataRealityExecutiveObservation\b/.test(
      source,
    ),
    false,
  );
  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
  assert.equal(/buildBusinessFactEvidence/.test(source), false);
  assert.equal(/resolveExecutiveMeaning/.test(source), false);

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
