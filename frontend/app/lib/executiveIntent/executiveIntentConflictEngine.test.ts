import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_CONFLICT_DIAGNOSTIC_CODES,
  isIntentConflictDiagnosticCode,
} from "./executiveIntentConflictDiagnostics.ts";
import {
  ExecutiveIntentConflictEngine,
  buildConflictExample,
  buildConflictMatrix,
  buildConflictProbe,
  detectIntentConflict,
  detectIntentConflicts,
  resolveConflictFlags,
  validateConflictResult,
} from "./executiveIntentConflictEngine.ts";
import {
  EXECUTIVE_INTENT_CONFLICT_ENGINE_RULES,
  EXECUTIVE_INTENT_CONFLICT_ENGINE_TAGS,
} from "./executiveIntentConflictEngine.ts";
import {
  INTENT_CONFLICT_CANONICAL_EXAMPLES,
  getIntentConflictCanonicalExample,
} from "./executiveIntentConflictExamples.ts";
import {
  CONFLICT_CATEGORY_ORDER,
  CONFLICT_SEVERITY_ORDER,
} from "./executiveIntentConflictRules.ts";
import {
  createIntentConflictAnalysisInput,
} from "./executiveIntentConflictTypes.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

function buildInput(text: string) {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text,
      workspaceId: WS,
      owner: "executive-owner",
      languageCode: "en",
      generatedAt: FIXED_TIME,
    })
  );
  const semantic = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
  const classification = classifyExecutiveIntent(semantic.model, FIXED_TIME);
  const state = extraction.primaryIntent
    ? resolveExecutiveIntentStateResult(
        Object.freeze({
          intent: extraction.primaryIntent,
          intentId: extraction.primaryIntent.intentId,
          workspaceId: WS,
          evaluatedAt: FIXED_TIME,
          proposedLifecycleTransition: null,
        })
      )
    : null;
  return createIntentConflictAnalysisInput({
    semanticModel: semantic.model,
    classification,
    state,
  });
}

test("detects duplicate objectives", () => {
  const result = buildConflictExample("duplicate-objectives", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.flags.duplicateIntent, true);
  assert.ok(result!.conflicts.some((entry) => entry.category === "duplicate"));
});

test("detects increase vs decrease on same metric", () => {
  const result = buildConflictProbe(FIXED_TIME);
  assert.equal(result.flags.hasConflict, true);
  assert.ok(result.conflicts.some((entry) => entry.category === "target"));
  assert.ok(["high", "critical"].includes(result.summary.highestSeverity));
  assert.equal(validateConflictResult(result).valid, true);
});

test("detects shared budget and growth vs cost reduction conflicts", () => {
  const budget = buildConflictExample("shared-budget-conflict", WS, "executive-owner", FIXED_TIME);
  const growth = buildConflictExample("growth-vs-cost-reduction", WS, "executive-owner", FIXED_TIME);
  assert.equal(budget?.flags.hasConflict, true);
  assert.equal(growth?.flags.hasConflict, true);
  assert.ok(
    growth?.conflicts.some(
      (entry) => entry.category === "strategic" || entry.category === "financial"
    )
  );
});

test("detects constraint and resource conflict for hiring vs headcount constraint", () => {
  const result = buildConflictExample("same-team-schedule", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.flags.hasConflict, true);
  assert.ok(
    result?.conflicts.some(
      (entry) => entry.category === "constraint" || entry.category === "resource"
    )
  );
});

test("detects technology replacement overlap", () => {
  const result = buildConflictExample("technology-replacement", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.flags.hasConflict, true);
  assert.ok(
    result?.conflicts.some(
      (entry) => entry.category === "technology" || entry.category === "target"
    )
  );
});

test("reports no conflict for compatible intents", () => {
  const result = buildConflictExample("no-conflict", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.flags.hasConflict, false);
  assert.equal(result?.summary.compatible, true);
  assert.ok(result?.diagnostics.some((entry) => entry.code === "no_conflict"));
});

test("reports compatible multi-intent operational and risk objectives", () => {
  const result = buildConflictExample("multiple-compatible", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.flags.hasConflict, false);
});

test("handles unknown comparison for incomplete intent", () => {
  const result = buildConflictExample("unknown-comparison", WS, "executive-owner", FIXED_TIME);
  assert.ok(result?.flags.hasConflict || result?.status === "unknown" || result?.status === "partial");
});

test("builds conflict matrix for batch analysis", () => {
  const intents = Object.freeze([
    buildInput("Increase company profit by 20% next year."),
    buildInput("Reduce operating cost by 8% next year."),
    buildInput("Expand market share by 15% this year."),
  ]);
  const { matrix } = buildConflictMatrix({
    workspaceId: WS,
    intents,
    timestamp: FIXED_TIME,
  });
  assert.equal(matrix.intentCount, 3);
  assert.equal(matrix.pairs.length, 3);
  assert.equal(Object.keys(matrix.pairIndex).length, 3);
});

test("returns deterministic conflict ordering", () => {
  const first = buildConflictProbe(FIXED_TIME);
  const second = buildConflictProbe(FIXED_TIME);
  assert.equal(first.resultId, second.resultId);
  assert.deepEqual(
    first.conflicts.map((entry) => entry.conflictId),
    second.conflicts.map((entry) => entry.conflictId)
  );
  const severities = first.conflicts.map((entry) => entry.severity);
  assert.deepEqual(
    [...severities].sort(
      (left, right) => CONFLICT_SEVERITY_ORDER.indexOf(right) - CONFLICT_SEVERITY_ORDER.indexOf(left)
    ),
    severities
  );
});

test("does not mutate analysis inputs", () => {
  const left = buildInput("Increase company profit by 20% next year.");
  const right = buildInput("Reduce operating cost by 8% next year.");
  const beforeLeft = JSON.stringify(left);
  const beforeRight = JSON.stringify(right);
  detectIntentConflict(left, right, FIXED_TIME);
  assert.equal(JSON.stringify(left), beforeLeft);
  assert.equal(JSON.stringify(right), beforeRight);
});

test("declares conflict categories severity and diagnostics vocabulary", () => {
  assert.equal(CONFLICT_CATEGORY_ORDER.length, 17);
  assert.equal(CONFLICT_SEVERITY_ORDER.length, 7);
  assert.equal(INTENT_CONFLICT_DIAGNOSTIC_CODES.length, 17);
  assert.equal(isIntentConflictDiagnosticCode("no_conflict"), true);
  assert.ok(EXECUTIVE_INTENT_CONFLICT_ENGINE_TAGS.includes("[APP3_7]"));
  assert.equal(EXECUTIVE_INTENT_CONFLICT_ENGINE_RULES.noResolution, true);
});

test("resolveConflictFlags marks executive review for critical conflicts", () => {
  const result = buildConflictProbe(FIXED_TIME);
  assert.equal(result.flags.readOnly, true);
  assert.equal(result.flags.deterministic, true);
  assert.equal(result.flags.requiresExecutiveReview, true);
});

test("detectIntentConflicts supports workspace intent set", () => {
  const result = detectIntentConflicts(
    Object.freeze({
      workspaceId: WS,
      intents: Object.freeze([
        buildInput("Increase company profit by 20% next year."),
        buildInput("Improve operational efficiency by 10% in the department."),
        buildInput("Mitigate supply chain risk exposure without increasing cost."),
      ]),
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.ok(result.matrix.pairs.length >= 3);
  assert.equal(result.readOnly, true);
});

test("regression: APP-3:5 semantic model consumed", () => {
  const left = buildInput("Increase company profit by 20% next year.");
  assert.equal(left.semanticModel.versionMetadata.semanticModelVersion, "APP-3/5");
  const result = detectIntentConflict(left, buildInput("Reduce operating cost by 8% next year."), FIXED_TIME);
  assert.equal(result.metadata.semanticModelVersion, "APP-3/5");
});

test("regression: APP-3:6 classification consumed", () => {
  const left = buildInput("Expand market share by 15% this year.");
  const right = buildInput("Reduce operating cost by 8% next year.");
  assert.ok(left.classification?.primaryClass);
  const result = detectIntentConflict(left, right, FIXED_TIME);
  assert.equal(result.metadata.classificationEngineVersion, "APP-3/6");
});

test("regression: APP-3:2 state consumed", () => {
  const left = buildInput("Increase company profit by 20% next year.");
  assert.ok(left.state);
  assert.equal(left.state!.engineVersion, "APP-3/2");
});

test("regression: APP-3:4 extraction pipeline preserved", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(extraction.engineVersion, "APP-3/4");
});

test("regression: APP-3:1 contract shape preserved", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  assert.ok(extraction.primaryIntent);
  assert.equal(validateExecutiveIntentShape(extraction.primaryIntent!).valid, true);
});

test("covers conflict canonical example catalog", () => {
  assert.ok(INTENT_CONFLICT_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getIntentConflictCanonicalExample("duplicate-objectives"));
});

test("ExecutiveIntentConflictEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentConflictEngine.version, "APP-3/7");
  assert.equal(typeof ExecutiveIntentConflictEngine.detectIntentConflicts, "function");
  assert.equal(typeof ExecutiveIntentConflictEngine.buildConflictProbe, "function");
});

test("resolveConflictFlags helper is consistent with engine output", () => {
  const result = buildConflictProbe(FIXED_TIME);
  const flags = resolveConflictFlags({
    conflicts: result.conflicts,
    pairs: result.matrix.pairs,
  });
  assert.equal(flags.hasConflict, result.flags.hasConflict);
  assert.equal(flags.duplicateIntent, result.flags.duplicateIntent);
});
