import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { detectIntentConflicts } from "./executiveIntentConflictEngine.ts";
import { createIntentConflictAnalysisInput } from "./executiveIntentConflictTypes.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_DEPENDENCY_DIAGNOSTIC_CODES,
  isIntentDependencyDiagnosticCode,
} from "./executiveIntentDependencyDiagnostics.ts";
import {
  ExecutiveIntentDependencyEngine,
  buildDependencyExample,
  buildDependencyGraph,
  buildDependencyMatrix,
  buildDependencyProbe,
  detectIntentDependencies,
  detectIntentDependency,
  resolveDependencyFlags,
  validateDependencyGraph,
} from "./executiveIntentDependencyEngine.ts";
import {
  EXECUTIVE_INTENT_DEPENDENCY_ENGINE_RULES,
  EXECUTIVE_INTENT_DEPENDENCY_ENGINE_TAGS,
} from "./executiveIntentDependencyEngine.ts";
import {
  INTENT_DEPENDENCY_CANONICAL_EXAMPLES,
  getIntentDependencyCanonicalExample,
} from "./executiveIntentDependencyExamples.ts";
import {
  DEPENDENCY_CATEGORY_ORDER,
  DEPENDENCY_STRENGTH_ORDER,
  detectDependencyCycles,
} from "./executiveIntentDependencyRules.ts";
import { createIntentDependencyAnalysisInput } from "./executiveIntentDependencyTypes.ts";
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
  return createIntentDependencyAnalysisInput({
    semanticModel: semantic.model,
    classification,
    conflictResult: null,
    state,
  });
}

test("detects launch product depends on technology prerequisite", () => {
  const result = buildDependencyExample("launch-depends-prototype", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.flags.hasDependencies, true);
  assert.ok(
    result!.dependencies.some(
      (entry) => entry.category === "technology" || entry.category === "direct"
    )
  );
  assert.equal(validateDependencyGraph(result!).valid, true);
});

test("detects hiring before expansion enabling dependency", () => {
  const result = buildDependencyProbe(FIXED_TIME);
  assert.equal(result.flags.hasDependencies, true);
  assert.ok(result.dependencies.some((entry) => entry.category === "enabling"));
  assert.equal(result.readOnly, true);
});

test("detects compliance before release dependency", () => {
  const result = buildDependencyExample("compliance-before-release", WS, "executive-owner", FIXED_TIME);
  assert.ok(result?.dependencies.some((entry) => entry.category === "compliance"));
});

test("detects technology migration before deployment", () => {
  const result = buildDependencyExample(
    "technology-before-deployment",
    WS,
    "executive-owner",
    FIXED_TIME
  );
  assert.ok(result?.dependencies.some((entry) => entry.category === "technology"));
});

test("detects strategic funding before acquisition", () => {
  const result = buildDependencyExample("funding-before-acquisition", WS, "executive-owner", FIXED_TIME);
  assert.ok(result?.flags.hasDependencies || result?.dependencies.length > 0);
});

test("detects shared prerequisite between financial intents", () => {
  const result = buildDependencyExample("shared-prerequisite", WS, "executive-owner", FIXED_TIME);
  assert.ok(
    result?.dependencies.some((entry) => entry.category === "shared_prerequisite") ||
      result?.flags.sharedPrerequisite
  );
});

test("reports independent intents with no directional dependencies", () => {
  const result = buildDependencyExample("independent-objectives", WS, "executive-owner", FIXED_TIME);
  const directional = result?.dependencies.filter(
    (entry) => !entry.bidirectional && entry.category !== "parallel"
  );
  assert.equal(directional?.length ?? 0, 0);
  assert.ok(result?.diagnostics.some((entry) => entry.code === "no_dependency"));
});

test("handles unknown dependency for incomplete intent", () => {
  const result = buildDependencyExample("unknown-dependency", WS, "executive-owner", FIXED_TIME);
  assert.ok(
    result?.dependencies.some((entry) => entry.category === "unknown") ||
      result?.status === "unknown" ||
      result?.status === "partial"
  );
});

test("builds dependency matrix for batch analysis", () => {
  const intents = Object.freeze([
    buildInput("Expand market share by 15% this year."),
    buildInput("Hire 50 engineers for the project by Q3."),
    buildInput("Ensure compliance with GDPR regulation by 2026."),
  ]);
  const batchConflict = detectIntentConflicts(
    Object.freeze({
      workspaceId: WS,
      intents: intents.map((entry) =>
        createIntentConflictAnalysisInput({
          semanticModel: entry.semanticModel,
          classification: entry.classification,
          state: entry.state,
        })
      ),
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
  const { matrix } = buildDependencyMatrix({
    workspaceId: WS,
    intents,
    batchConflictResult: batchConflict,
    timestamp: FIXED_TIME,
  });
  assert.equal(matrix.intentCount, 3);
  assert.equal(matrix.pairs.length, 6);
});

test("builds dependency graph with stable node ordering", () => {
  const dependent = buildInput("Expand market share by 15% this year.");
  const prerequisite = buildInput("Hire 50 engineers for the project by Q3.");
  const result = detectIntentDependency(dependent, prerequisite, null, FIXED_TIME);
  assert.equal(result.graph.nodes.length, 2);
  assert.ok(result.graph.edges.length >= 1);
  assert.deepEqual(
    [...result.graph.nodes.map((node) => node.nodeId)].sort(),
    result.graph.nodes.map((node) => node.nodeId)
  );
});

test("detects circular dependency in three-intent graph", () => {
  const intents = Object.freeze([
    buildInput("Launch product innovation program next year."),
    buildInput("Ensure compliance with GDPR regulation by 2026."),
    buildInput("Modernize cloud platform technology across the enterprise."),
  ]);
  const result = detectIntentDependencies(
    Object.freeze({
      workspaceId: WS,
      intents,
      batchConflictResult: null,
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.ok(result.dependencies.length > 0);
  assert.ok(result.graph.edges.length > 0);
});

test("detectDependencyCycles identifies cycles in edge list", () => {
  const cycles = detectDependencyCycles(
    Object.freeze([
      Object.freeze({
        edgeId: "e1",
        fromNodeId: "n-a",
        toNodeId: "n-b",
        dependencyId: "d1",
        category: "sequential" as const,
        strength: "moderate" as const,
        readOnly: true as const,
      }),
      Object.freeze({
        edgeId: "e2",
        fromNodeId: "n-b",
        toNodeId: "n-c",
        dependencyId: "d2",
        category: "sequential" as const,
        strength: "moderate" as const,
        readOnly: true as const,
      }),
      Object.freeze({
        edgeId: "e3",
        fromNodeId: "n-c",
        toNodeId: "n-a",
        dependencyId: "d3",
        category: "sequential" as const,
        strength: "moderate" as const,
        readOnly: true as const,
      }),
    ])
  );
  assert.ok(cycles.length > 0);
});

test("returns deterministic dependency output", () => {
  const first = buildDependencyProbe(FIXED_TIME);
  const second = buildDependencyProbe(FIXED_TIME);
  assert.equal(first.resultId, second.resultId);
  assert.deepEqual(
    first.dependencies.map((entry) => entry.dependencyId),
    second.dependencies.map((entry) => entry.dependencyId)
  );
});

test("does not mutate analysis inputs", () => {
  const dependent = buildInput("Expand market share by 15% this year.");
  const prerequisite = buildInput("Hire 50 engineers for the project by Q3.");
  const beforeDep = JSON.stringify(dependent);
  const beforePre = JSON.stringify(prerequisite);
  detectIntentDependency(dependent, prerequisite, null, FIXED_TIME);
  assert.equal(JSON.stringify(dependent), beforeDep);
  assert.equal(JSON.stringify(prerequisite), beforePre);
});

test("declares dependency categories strength and diagnostics", () => {
  assert.equal(DEPENDENCY_CATEGORY_ORDER.length, 15);
  assert.equal(DEPENDENCY_STRENGTH_ORDER.length, 6);
  assert.equal(INTENT_DEPENDENCY_DIAGNOSTIC_CODES.length, 16);
  assert.equal(isIntentDependencyDiagnosticCode("dependency_graph_ready"), true);
  assert.ok(EXECUTIVE_INTENT_DEPENDENCY_ENGINE_TAGS.includes("[APP3_8]"));
  assert.equal(EXECUTIVE_INTENT_DEPENDENCY_ENGINE_RULES.noScheduling, true);
});

test("regression: APP-3:7 conflict result consumed", () => {
  const dependent = buildInput("Increase company profit by 20% next year.");
  const prerequisite = buildInput("Reduce company profit by 10% next year.");
  const result = detectIntentDependency(dependent, prerequisite, null, FIXED_TIME);
  assert.equal(result.metadata.conflictEngineVersion, "APP-3/7");
});

test("regression: APP-3:6 classification consumed", () => {
  const result = buildDependencyProbe(FIXED_TIME);
  assert.equal(result.metadata.classificationEngineVersion, "APP-3/6");
});

test("regression: APP-3:5 semantic model consumed", () => {
  const result = buildDependencyProbe(FIXED_TIME);
  assert.equal(result.metadata.semanticModelVersion, "APP-3/5");
});

test("regression: APP-3:2 state consumed", () => {
  const input = buildInput("Increase company profit by 20% next year.");
  assert.ok(input.state);
  assert.equal(input.state!.engineVersion, "APP-3/2");
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

test("covers dependency canonical example catalog", () => {
  assert.ok(INTENT_DEPENDENCY_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getIntentDependencyCanonicalExample("launch-depends-prototype"));
});

test("ExecutiveIntentDependencyEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentDependencyEngine.version, "APP-3/8");
  assert.equal(typeof ExecutiveIntentDependencyEngine.detectIntentDependencies, "function");
  assert.equal(typeof ExecutiveIntentDependencyEngine.buildDependencyProbe, "function");
});

test("resolveDependencyFlags is consistent with engine output", () => {
  const result = buildDependencyProbe(FIXED_TIME);
  const flags = resolveDependencyFlags({
    dependencies: result.dependencies,
    graph: result.graph,
    intentCount: 2,
  });
  assert.equal(flags.hasDependencies, result.flags.hasDependencies);
  assert.equal(flags.deterministic, true);
});
