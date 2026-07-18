/**
 * DKL-4:1 — Knowledge Modeling Foundation Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Foundation.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as foundationApi from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationVersion,
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingContracts,
  KnowledgeModelingOwnership,
  KnowledgeModelingBoundaries,
  KnowledgeModelingLifecycle,
  KnowledgeModelingDependencies,
} from "./knowledgeModelingFoundation.ts";
import {
  DataUnderstandingPublicIndexId,
  DataUnderstandingPublicIndexVersion,
} from "./dataUnderstandingPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL41_FILES = [
  "knowledgeModelingFoundationTypes.ts",
  "knowledgeModelingContracts.ts",
  "knowledgeModelingOwnership.ts",
  "knowledgeModelingBoundaries.ts",
  "knowledgeModelingLifecycle.ts",
  "knowledgeModelingDependencies.ts",
  "knowledgeModelingFoundation.ts",
  "knowledgeModelingFoundation.test.ts",
];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly eight DKL-4:1 files exist", () => {
  assert.equal(DKL41_FILES.length, 8);
  for (const file of DKL41_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. foundation module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(foundationApi).sort(), [
    "KnowledgeModelingBoundaries",
    "KnowledgeModelingContracts",
    "KnowledgeModelingDependencies",
    "KnowledgeModelingFoundation",
    "KnowledgeModelingFoundationIdentity",
    "KnowledgeModelingFoundationVersion",
    "KnowledgeModelingLifecycle",
    "KnowledgeModelingOwnership",
  ]);
});

test("3. no helper functions among foundation public exports", () => {
  for (const [name, value] of Object.entries(foundationApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. DKL-3 imported only via Public Index", () => {
  for (const file of DKL41_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      if (spec.includes("dataUnderstanding") && !spec.includes("knowledgeModeling")) {
        assert.ok(
          /dataUnderstandingPublicIndex\.ts$/.test(spec),
          `${file} must import DKL-3 only via Public Index: ${spec}`,
        );
      }
    }
    assert.equal(/dataUnderstandingFoundation\.ts/.test(text), false, file);
    assert.equal(/dataUnderstandingPlatform\.ts/.test(text), false, file);
    assert.equal(/dataUnderstandingFreeze\.ts/.test(text), false, file);
  }
});

test("5. identity and version stability", () => {
  assert.equal(
    KnowledgeModelingFoundationIdentity.foundationId,
    "DKL-4:1/KnowledgeModelingFoundation",
  );
  assert.equal(KnowledgeModelingFoundationIdentity.sourcePhase, "DKL-4:1");
  assert.equal(KnowledgeModelingFoundationIdentity.platformId, "DKL-4");
  assert.equal(KnowledgeModelingFoundationIdentity.status, "FoundationComplete");
  assert.equal(KnowledgeModelingFoundationIdentity.readiness, "ReadyForRegistry");
  assert.equal(KnowledgeModelingFoundationVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingFoundationIdentity.foundationNamespace,
    "nexora.dkl.knowledge-modeling.foundation",
  );
  assert.equal(
    KnowledgeModelingFoundation.identity,
    KnowledgeModelingFoundationIdentity,
  );
  assert.equal(KnowledgeModelingFoundation.version, KnowledgeModelingFoundationVersion);
});

test("6. ownership completeness and no overlap", () => {
  assert.ok(KnowledgeModelingOwnership.owns.length >= 11);
  assert.ok(KnowledgeModelingOwnership.doesNotOwn.length >= 15);
  const owns = new Set<string>([...KnowledgeModelingOwnership.owns]);
  for (const item of KnowledgeModelingOwnership.doesNotOwn) {
    assert.equal(owns.has(item), false, `overlap: ${item}`);
  }
  assert.ok(KnowledgeModelingOwnership.owns.includes("Business Object definitions"));
  assert.ok(KnowledgeModelingOwnership.owns.includes("Semantic Structure contracts"));
  assert.ok(KnowledgeModelingOwnership.doesNotOwn.includes("AI reasoning"));
  assert.ok(KnowledgeModelingOwnership.doesNotOwn.includes("executive reasoning"));
  assert.ok(KnowledgeModelingOwnership.doesNotOwn.includes("persistence"));
});

test("7. contract enumerations for all knowledge model elements", () => {
  assert.equal(KnowledgeModelingContracts.knowledgeObjectKinds.length, 11);
  assert.equal(KnowledgeModelingContracts.businessObjectKinds.length, 11);
  assert.equal(KnowledgeModelingContracts.entityKinds.length, 5);
  assert.equal(KnowledgeModelingContracts.relationshipKinds.length, 10);
  assert.equal(KnowledgeModelingContracts.identityScopes.length, 6);
  assert.equal(KnowledgeModelingContracts.metadataClasses.length, 6);
  assert.equal(KnowledgeModelingContracts.hierarchyKinds.length, 5);
  assert.equal(KnowledgeModelingContracts.compositionKinds.length, 5);
  assert.equal(KnowledgeModelingContracts.referenceKinds.length, 5);
  assert.equal(KnowledgeModelingContracts.semanticStructureKinds.length, 6);
  assert.equal(KnowledgeModelingContracts.knowledgeModelStatuses.length, 5);
  assert.ok(KnowledgeModelingContracts.definition.includes("Knowledge Modeling"));
  assert.ok(KnowledgeModelingContracts.terminology.BusinessObject.length > 0);
  assert.ok(KnowledgeModelingContracts.terminology.SemanticStructure.length > 0);
});

test("8. extension and compatibility policies", () => {
  assert.equal(KnowledgeModelingContracts.extensionPolicies.length, 4);
  assert.equal(KnowledgeModelingContracts.compatibilityPolicies.length, 5);
  const extById = Object.fromEntries(
    KnowledgeModelingContracts.extensionPolicies.map((p) => [p.policyId, p]),
  );
  assert.equal(extById["EXT-ADDITIVE"]?.status, "AdditiveAllowed");
  assert.equal(extById["EXT-RUNTIME-FORBIDDEN"]?.status, "Forbidden");
  const compatById = Object.fromEntries(
    KnowledgeModelingContracts.compatibilityPolicies.map((p) => [p.policyId, p]),
  );
  assert.equal(compatById["COMPAT-DKL3"]?.status, "Compatible");
  assert.equal(compatById["COMPAT-AI-FORBIDDEN"]?.status, "Forbidden");
  assert.equal(compatById["COMPAT-PERSISTENCE-FORBIDDEN"]?.status, "Forbidden");
});

test("9. processing policies forbid runtime, AI, Engine, persistence", () => {
  const p = KnowledgeModelingContracts.processingPolicies;
  assert.equal(p.metadataOnly, true);
  assert.equal(p.modelingOnly, true);
  assert.equal(p.runtimeBehaviorForbidden, true);
  assert.equal(p.algorithmsForbidden, true);
  assert.equal(p.persistenceForbidden, true);
  assert.equal(p.graphTraversalForbidden, true);
  assert.equal(p.aiForbidden, true);
  assert.equal(p.inferenceForbidden, true);
  assert.equal(p.engineReasoningForbidden, true);
  assert.equal(p.calculationsForbidden, true);
  assert.equal(p.sideEffectsForbidden, true);
});

test("10. boundaries and architectural position", () => {
  assert.equal(KnowledgeModelingBoundaries.consumesDkl3PublicIndex, true);
  assert.equal(KnowledgeModelingBoundaries.performsUnderstanding, false);
  assert.equal(KnowledgeModelingBoundaries.persistsModels, false);
  assert.equal(KnowledgeModelingBoundaries.executesAiModels, false);
  assert.equal(KnowledgeModelingBoundaries.executesEngineReasoning, false);
  assert.equal(KnowledgeModelingBoundaries.traversesGraphs, false);
  assert.equal(
    KnowledgeModelingBoundaries.architecturalPosition.platform,
    "DKL-4 Knowledge Modeling",
  );
  assert.ok(
    KnowledgeModelingBoundaries.architecturalPosition.upstream.some((u) =>
      u.includes("DKL-3"),
    ),
  );
  assert.ok(
    KnowledgeModelingBoundaries.architecturalPosition.downstream.some((d) =>
      d.includes("Executive Engine"),
    ),
  );
});

test("11. lifecycle states and transition metadata (no execution)", () => {
  assert.equal(KnowledgeModelingLifecycle.stateCount, 11);
  assert.deepEqual([...KnowledgeModelingLifecycle.states], [
    "Received",
    "Bound",
    "Structured",
    "Related",
    "Composed",
    "Referenced",
    "ModelReady",
    "Completed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]);
  assert.ok(KnowledgeModelingLifecycle.transitions.Received.includes("Bound"));
  assert.equal(KnowledgeModelingLifecycle.transitions.Completed.length, 0);
  assert.equal(KnowledgeModelingLifecycle.notes.transitionExecutionForbidden, true);
  assert.equal(
    "transitionKnowledgeModelingLifecycle" in KnowledgeModelingLifecycle,
    false,
  );
});

test("12. dependencies — DKL-3 Public Index only", () => {
  assert.equal(KnowledgeModelingDependencies.entryCount, 1);
  assert.equal(KnowledgeModelingDependencies.noFuturePhases, true);
  const dep = KnowledgeModelingDependencies.allowed[0]!;
  assert.equal(dep.module, "dataUnderstandingPublicIndex.ts");
  assert.equal(dep.publicIndexId, DataUnderstandingPublicIndexId);
  assert.equal(dep.publicIndexVersion, DataUnderstandingPublicIndexVersion);
  assert.equal(dep.readyForDKL4, true);
  assert.ok(KnowledgeModelingDependencies.forbidden.includes("DKL-4:2+"));
  assert.ok(KnowledgeModelingDependencies.forbidden.includes("Engine"));
  assert.ok(
    KnowledgeModelingDependencies.forbidden.includes("external AI or LLM services"),
  );
  assert.equal(
    KnowledgeModelingFoundation.upstream.dkl3PublicIndexId,
    DataUnderstandingPublicIndexId,
  );
});

test("13. readiness ReadyForRegistry and next phase", () => {
  assert.equal(KnowledgeModelingFoundation.readiness.ReadyForRegistry, true);
  assert.equal(KnowledgeModelingFoundation.readiness.FoundationComplete, true);
  assert.equal(KnowledgeModelingFoundation.readiness.AIFree, true);
  assert.equal(KnowledgeModelingFoundation.readiness.EngineFree, true);
  assert.equal(KnowledgeModelingFoundation.readiness.MetadataOnly, true);
  assert.equal(
    KnowledgeModelingFoundation.nextPhase,
    "DKL-4:2 — Knowledge Modeling Registry",
  );
});

test("14. immutability and deterministic guarantees", () => {
  assert.equal(isDeeplyFrozen(KnowledgeModelingFoundationIdentity), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingContracts), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingOwnership), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingBoundaries), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingLifecycle), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingDependencies), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFoundation), true);
  const a = JSON.stringify(KnowledgeModelingFoundation.completionStatus);
  const b = JSON.stringify(KnowledgeModelingFoundation.completionStatus);
  assert.equal(a, b);
});

test("15. no runtime behavior in source files", () => {
  for (const file of DKL41_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
    assert.equal(/\bexport\s+function\b/.test(text), false, file);
  }
});

test("16. metadata only — no AI, Engine, persistence, future leakage", () => {
  assert.equal(KnowledgeModelingFoundation.metadata.metadataOnly, true);
  assert.equal(KnowledgeModelingFoundation.metadata.runtimeBehaviorPerformed, false);
  assert.equal(KnowledgeModelingFoundation.metadata.algorithmsExecuted, false);
  assert.equal(KnowledgeModelingFoundation.metadata.aiExecuted, false);
  assert.equal(KnowledgeModelingFoundation.metadata.inferencePerformed, false);
  assert.equal(KnowledgeModelingFoundation.metadata.engineReasoningPerformed, false);
  assert.equal(KnowledgeModelingFoundation.metadata.persistencePerformed, false);
  assert.equal(KnowledgeModelingFoundation.metadata.graphTraversalPerformed, false);
  for (const file of DKL41_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*openai/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*knowledgeModelingRegistry/i.test(text), false, file);
  }
});
