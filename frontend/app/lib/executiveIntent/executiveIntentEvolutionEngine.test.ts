import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { detectIntentConflicts } from "./executiveIntentConflictEngine.ts";
import { createIntentConflictAnalysisInput } from "./executiveIntentConflictTypes.ts";
import { detectIntentDependencies } from "./executiveIntentDependencyEngine.ts";
import { createIntentDependencyAnalysisInput } from "./executiveIntentDependencyTypes.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_EVOLUTION_DIAGNOSTIC_CODES,
  isIntentEvolutionDiagnosticCode,
} from "./executiveIntentEvolutionDiagnostics.ts";
import {
  ExecutiveIntentEvolutionEngine,
  buildEvolutionExampleSet,
  buildEvolutionProbe,
  buildEvolutionTimeline,
  buildIntentEvolution,
  buildIntentLineage,
  resolveActiveIntent,
  resolveAncestors,
  resolveDescendants,
  resolveMergeHistory,
  resolveRootIntent,
  resolveSplitHistory,
  validateLineage,
} from "./executiveIntentEvolutionEngine.ts";
import {
  EXECUTIVE_INTENT_EVOLUTION_ENGINE_RULES,
  EXECUTIVE_INTENT_EVOLUTION_ENGINE_TAGS,
} from "./executiveIntentEvolutionEngine.ts";
import {
  INTENT_EVOLUTION_CANONICAL_EXAMPLES,
  getIntentEvolutionCanonicalExample,
} from "./executiveIntentEvolutionExamples.ts";
import { compareSemanticVersions } from "./executiveIntentEvolutionRules.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

function buildEvolutionFromExample(exampleId: string) {
  const exampleSet = buildEvolutionExampleSet(exampleId);
  assert.ok(exampleSet, exampleId);
  return buildIntentEvolution(
    Object.freeze({
      workspaceId: WS,
      records: exampleSet!.records,
      focusIntentId: exampleSet!.focusIntentId,
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
}

test("builds simple revision lineage", () => {
  const result = buildEvolutionFromExample("simple-revision");
  assert.equal(result.lineage.rootIntentId, "intent-v1");
  assert.equal(result.lineage.activeIntentId, "intent-v2");
  assert.equal(result.flags.hasHistory, true);
  assert.equal(validateLineage(result).valid, true);
});

test("builds version chain v1 to v3", () => {
  const result = buildEvolutionFromExample("version-chain");
  assert.equal(result.focusIntentId, "intent-v3");
  assert.equal(result.lineage.versions.length, 3);
  assert.ok(compareSemanticVersions("3.0.0", "2.0.0") > 0);
  assert.ok(result.timeline.events.some((event) => event.kind === "versioned" || event.kind === "replaced"));
});

test("detects split strategy lineage", () => {
  const result = buildEvolutionFromExample("split-strategy");
  assert.equal(result.flags.split, true);
  assert.ok(result.splits.some((entry) => entry.parentIntentId === "intent-parent"));
});

test("detects merge strategy lineage", () => {
  const result = buildEvolutionFromExample("merge-strategy");
  assert.equal(result.flags.merged, true);
  assert.equal(result.merges[0]?.sourceIntentIds.length, 2);
});

test("detects replacement lineage", () => {
  const result = buildEvolutionFromExample("replacement");
  assert.ok(result.replacements.length > 0);
  assert.equal(result.replacements[0]?.replacedIntentId, "intent-original");
});

test("detects archived branch with active sibling", () => {
  const result = buildEvolutionFromExample("archived-branch");
  assert.equal(result.flags.hasParent, true);
  assert.ok(result.diagnostics.some((entry) => entry.code === "archived_branch"));
});

test("detects parallel branches from shared root", () => {
  const result = buildEvolutionFromExample("parallel-branches");
  assert.equal(result.lineage.rootIntentId, "intent-root");
  assert.ok(result.diagnostics.some((entry) => entry.code === "parallel_branch"));
});

test("identifies root intent without history", () => {
  const result = buildEvolutionFromExample("root-intent");
  assert.equal(result.flags.rootIntent, true);
  assert.equal(result.flags.hasParent, false);
  assert.ok(result.diagnostics.some((entry) => entry.code === "root_intent"));
});

test("detects broken lineage for missing parent", () => {
  const result = buildEvolutionFromExample("broken-lineage");
  assert.equal(result.status, "broken");
  assert.ok(result.diagnostics.some((entry) => entry.code === "broken_lineage"));
});

test("handles unknown history for draft intent", () => {
  const result = buildEvolutionFromExample("unknown-history");
  assert.ok(result.status === "unknown" || result.status === "partial");
});

test("builds evolution timeline with ordered events", () => {
  const exampleSet = buildEvolutionExampleSet("version-chain");
  assert.ok(exampleSet);
  const request = Object.freeze({
    workspaceId: WS,
    records: exampleSet!.records,
    focusIntentId: exampleSet!.focusIntentId,
    timestamp: FIXED_TIME,
    readOnly: true as const,
  });
  const lineage = buildIntentLineage(request);
  const timeline = buildEvolutionTimeline(request, lineage);
  assert.ok(timeline.events.length > 0);
  assert.ok(timeline.orderedIntentIds.length > 0);
});

test("resolveAncestors and resolveDescendants are consistent", () => {
  const exampleSet = buildEvolutionExampleSet("simple-revision");
  assert.ok(exampleSet);
  const ancestors = resolveAncestors(exampleSet!.focusIntentId, exampleSet!.records);
  const descendants = resolveDescendants("intent-v1", exampleSet!.records);
  assert.equal(ancestors[0]?.intentId, "intent-v1");
  assert.ok(descendants.some((entry) => entry.intentId === "intent-v2"));
});

test("returns deterministic evolution output", () => {
  const first = buildEvolutionProbe(FIXED_TIME);
  const second = buildEvolutionProbe(FIXED_TIME);
  assert.equal(first.resultId, second.resultId);
  assert.deepEqual(
    first.lineage.edges.map((edge) => edge.edgeId),
    second.lineage.edges.map((edge) => edge.edgeId)
  );
});

test("declares evolution diagnostics and tags", () => {
  assert.equal(INTENT_EVOLUTION_DIAGNOSTIC_CODES.length, 17);
  assert.equal(isIntentEvolutionDiagnosticCode("lineage_complete"), true);
  assert.ok(EXECUTIVE_INTENT_EVOLUTION_ENGINE_TAGS.includes("[APP3_9]"));
  assert.equal(EXECUTIVE_INTENT_EVOLUTION_ENGINE_RULES.noHistoryRewrite, true);
});

test("regression: APP-3:8 dependency engine still passes", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Expand market share by 15% this year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  const semantic = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
  const dep = detectIntentDependencies(
    Object.freeze({
      workspaceId: WS,
      intents: Object.freeze([
        createIntentDependencyAnalysisInput({
          semanticModel: semantic.model,
          classification: classifyExecutiveIntent(semantic.model, FIXED_TIME),
          conflictResult: null,
          state: null,
        }),
      ]),
      batchConflictResult: null,
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.ok(dep.metadata.dependencyEngineVersion);
});

test("regression: APP-3:7 conflict engine still passes", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  const semantic = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
  const conflict = detectIntentConflicts(
    Object.freeze({
      workspaceId: WS,
      intents: Object.freeze([
        createIntentConflictAnalysisInput({
          semanticModel: semantic.model,
          classification: classifyExecutiveIntent(semantic.model, FIXED_TIME),
          state: null,
        }),
      ]),
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.equal(conflict.metadata.conflictEngineVersion, "APP-3/7");
});

test("regression: APP-3:1 contract shape preserved", () => {
  const exampleSet = buildEvolutionExampleSet("simple-revision");
  assert.ok(exampleSet);
  for (const record of exampleSet!.records) {
    assert.equal(validateExecutiveIntentShape(record.intent).valid, true);
  }
});

test("regression: APP-3:2 state resolution on extracted intent", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  const state = resolveExecutiveIntentStateResult(
    Object.freeze({
      intent: extraction.primaryIntent,
      intentId: extraction.primaryIntent!.intentId,
      workspaceId: WS,
      evaluatedAt: FIXED_TIME,
      proposedLifecycleTransition: null,
    })
  );
  assert.equal(state.engineVersion, "APP-3/2");
});

test("covers evolution canonical example catalog", () => {
  assert.ok(INTENT_EVOLUTION_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getIntentEvolutionCanonicalExample("version-chain"));
});

test("ExecutiveIntentEvolutionEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentEvolutionEngine.version, "APP-3/9");
  assert.equal(typeof ExecutiveIntentEvolutionEngine.buildIntentEvolution, "function");
  assert.equal(typeof ExecutiveIntentEvolutionEngine.buildEvolutionProbe, "function");
});

test("resolveRootIntent and resolveActiveIntent helpers work", () => {
  const result = buildEvolutionProbe(FIXED_TIME);
  assert.equal(resolveRootIntent(result.lineage), "intent-v1");
  const exampleSet = buildEvolutionExampleSet("version-chain");
  assert.ok(exampleSet);
  assert.equal(resolveActiveIntent(exampleSet!.records, result.lineage), "intent-v3");
  assert.ok(resolveMergeHistory(exampleSet!.records).length >= 0);
  assert.ok(resolveSplitHistory(exampleSet!.records).length >= 0);
});
