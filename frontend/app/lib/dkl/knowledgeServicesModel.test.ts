/**
 * DKL-7:3 — Knowledge Services Model Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Model.
 * No mocks. No randomness. No network. No databases. No time dependence.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeServicesRegistry,
  KnowledgeServicesRegistryId,
  KnowledgeServicesRegistryVersion,
} from "./knowledgeServicesRegistry.ts";
import * as ModelModule from "./knowledgeServicesModel.ts";
import {
  getKnowledgeServicesModelInventoryCount,
  getKnowledgeServicesModelSummary,
  KnowledgeServicesContextModels,
  KnowledgeServicesModel,
  KnowledgeServicesModelId,
  KnowledgeServicesModelName,
  KnowledgeServicesModelNamespace,
  KnowledgeServicesModelRelationships,
  KnowledgeServicesModelStatus,
  KnowledgeServicesModelVersion,
  KnowledgeServicesRequestModels,
  KnowledgeServicesResponseModels,
  KnowledgeServicesResultModels,
} from "./knowledgeServicesModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL73_FILES = Object.freeze([
  "knowledgeServicesModelTypes.ts",
  "knowledgeServicesRequestModels.ts",
  "knowledgeServicesResponseModels.ts",
  "knowledgeServicesResultModels.ts",
  "knowledgeServicesRelationshipModels.ts",
  "knowledgeServicesContextModels.ts",
  "knowledgeServicesModel.ts",
  "knowledgeServicesModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesModel",
  "KnowledgeServicesModelId",
  "KnowledgeServicesModelName",
  "KnowledgeServicesModelVersion",
  "KnowledgeServicesModelNamespace",
  "KnowledgeServicesModelStatus",
  "KnowledgeServicesRequestModels",
  "KnowledgeServicesResponseModels",
  "KnowledgeServicesResultModels",
  "KnowledgeServicesContextModels",
  "KnowledgeServicesModelRelationships",
  "getKnowledgeServicesModelSummary",
  "getKnowledgeServicesModelInventoryCount",
] as const);

const CANONICAL_SECTION_ORDER = Object.freeze([
  "identity",
  "metadata",
  "registry",
  "requests",
  "responses",
  "results",
  "contexts",
  "references",
  "relationships",
  "inventory",
  "guarantees",
  "status",
] as const);

const PROHIBITED_MUTATION_WORDS = Object.freeze([
  "create",
  "update",
  "delete",
  "mutate",
  "persist",
  "execute",
  "approve",
  "decide",
  "plan",
  "orchestrate",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:3 Knowledge Services Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(DKL73_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL73_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("exposes exactly the required public exports", () => {
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 13);
  });

  it("has exact model identity, version, status, and readiness", () => {
    assert.equal(KnowledgeServicesModelId, "DKL-7:3/KnowledgeServicesModel");
    assert.equal(KnowledgeServicesModelName, "Knowledge Services Model");
    assert.equal(KnowledgeServicesModelVersion, "1.0.0");
    assert.equal(KnowledgeServicesModelStatus, "ModelComplete");
    assert.equal(
      KnowledgeServicesModelNamespace,
      "nexora.dkl.knowledge-services.model",
    );
    assert.equal(KnowledgeServicesModel.identity.modelId, KnowledgeServicesModelId);
    assert.equal(KnowledgeServicesModel.identity.status, "ModelComplete");
    assert.equal(KnowledgeServicesModel.identity.readiness, "ReadyForValidation");
    assert.equal(KnowledgeServicesModel.status, "ModelComplete");
    assert.equal(KnowledgeServicesModel.readiness, "ReadyForValidation");
    assert.equal(KnowledgeServicesModel.identity.layer, "Data Knowledge Layer");
    assert.equal(KnowledgeServicesModel.identity.phase, "DKL-7");
    assert.equal(KnowledgeServicesModel.identity.stage, "Model");
  });

  it("preserves Registry identity/version and Foundation through Registry", () => {
    assert.equal(
      KnowledgeServicesModel.identity.registryId,
      KnowledgeServicesRegistryId,
    );
    assert.equal(
      KnowledgeServicesModel.identity.registryVersion,
      KnowledgeServicesRegistryVersion,
    );
    assert.equal(KnowledgeServicesModel.registry, KnowledgeServicesRegistry);
    assert.equal(
      KnowledgeServicesModel.identity.foundationId,
      KnowledgeServicesRegistry.foundation.foundationId,
    );
    assert.equal(
      KnowledgeServicesModel.registry.foundation.foundationId,
      "DKL-7:1/KnowledgeServicesFoundation",
    );
  });

  it("consumes only DKL-7:2 Registry public surface", () => {
    const dkl73Local = new Set([
      "./knowledgeServicesModelTypes.ts",
      "./knowledgeServicesRequestModels.ts",
      "./knowledgeServicesResponseModels.ts",
      "./knowledgeServicesResultModels.ts",
      "./knowledgeServicesRelationshipModels.ts",
      "./knowledgeServicesContextModels.ts",
      "./knowledgeServicesModel.ts",
    ]);
    const allowedRegistry = "./knowledgeServicesRegistry.ts";
    for (const file of DKL73_FILES.filter((f) => !f.endsWith(".test.ts"))) {
      const text = readFileSync(join(HERE, file), "utf8");
      const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map(
        (m) => m[1]!,
      );
      for (const spec of imports) {
        if (dkl73Local.has(spec) || spec === allowedRegistry) {
          continue;
        }
        assert.equal(
          /knowledgeServicesFoundation|knowledgeRepository|knowledgeValidation|knowledgeModeling|dataUnderstanding|dataSource|dataKnowledge|\/engine\/|\/bus\/|\/ops\/|\/core\/|advisor|scene|nea/i.test(
            spec,
          ),
          false,
          `${file} has prohibited dependency: ${spec}`,
        );
        if (spec.startsWith("./knowledgeServices")) {
          assert.fail(`${file} has disallowed knowledgeServices import: ${spec}`);
        }
      }
      assert.equal(/\bTODO\b/.test(text), false, `${file} must not contain TODO`);
      assert.equal(/import\s*\(/.test(text), false, `${file} no dynamic import`);
    }
  });

  it("registers exactly 12 aligned request models", () => {
    assert.equal(KnowledgeServicesRequestModels.length, 12);
    assert.equal(KnowledgeServicesModel.requests.length, 12);
    const requestCategoryIds = new Set(
      KnowledgeServicesRegistry.requestCategories.map((c) => c.id),
    );
    const serviceIds = new Set(
      KnowledgeServicesRegistry.services.map((s) => s.id),
    );
    const capabilityIds = new Set(
      KnowledgeServicesRegistry.capabilities.map((c) => c.id),
    );
    const accessModeIds = new Set(
      KnowledgeServicesRegistry.accessModes.map((m) => m.id),
    );
    assertUnique(
      KnowledgeServicesRequestModels.map((m) => m.modelId),
      "request-model IDs",
    );
    for (const request of KnowledgeServicesRequestModels) {
      assert.ok(requestCategoryIds.has(request.requestCategoryReference));
      assert.ok(serviceIds.has(request.serviceReference));
      assert.ok(capabilityIds.has(request.capabilityReference));
      assert.ok(accessModeIds.has(request.accessModeReference));
      assert.equal(request.readOnly, true);
      assert.equal(request.mutationAllowed, false);
      assert.equal(request.executable, false);
      assert.equal(request.hasHandler, false);
      assert.equal(Object.isFrozen(request), true);
    }
  });

  it("registers exactly 12 aligned response models", () => {
    assert.equal(KnowledgeServicesResponseModels.length, 12);
    assert.equal(KnowledgeServicesModel.responses.length, 12);
    const responseCategoryIds = new Set(
      KnowledgeServicesRegistry.responseCategories.map((c) => c.id),
    );
    assertUnique(
      KnowledgeServicesResponseModels.map((m) => m.modelId),
      "response-model IDs",
    );
    for (const response of KnowledgeServicesResponseModels) {
      assert.ok(responseCategoryIds.has(response.responseCategoryReference));
      assert.equal(response.readOnly, true);
      assert.equal(response.transportAware, false);
      assert.equal(response.hasSerializer, false);
      assert.equal(response.hasHandler, false);
      assert.ok(
        response.architecturalOutcomeVocabulary.includes("Available"),
      );
      assert.ok(
        response.architecturalOutcomeVocabulary.includes("NotFound"),
      );
      assert.equal(
        response.architecturalOutcomeVocabulary.includes("Unauthorized" as never),
        false,
      );
      assert.equal(Object.isFrozen(response), true);
    }
  });

  it("registers exactly 12 primary result models with architectural constraints", () => {
    assert.equal(KnowledgeServicesResultModels.length, 12);
    assert.equal(KnowledgeServicesModel.results.length, 12);
    assertUnique(
      KnowledgeServicesResultModels.map((m) => m.modelId),
      "result-model IDs",
    );
    const byKind = Object.fromEntries(
      KnowledgeServicesResultModels.map((m) => [m.resultKind, m]),
    );
    assert.equal(byKind.KnowledgeObject?.ownsBusinessObjects, false);
    assert.equal(byKind.Relationship?.algorithmic, false);
    assert.equal(byKind.GraphPath?.algorithmic, false);
    assert.equal(byKind.Evidence?.algorithmic, false);
    assert.equal(byKind.KnowledgeSummary?.aiBehavior, false);
    assert.equal(byKind.ReferenceResolution?.aiBehavior, false);
    assert.equal(byKind.ReferenceResolution?.algorithmic, false);
    assert.equal(byKind.ServiceErrorMetadata?.executable, false);
    for (const result of KnowledgeServicesResultModels) {
      assert.equal(result.repositoryAccess, false);
      assert.equal(result.readOnly, true);
      assert.equal(result.executable, false);
      assert.equal(Object.isFrozen(result), true);
      assert.equal(Object.isFrozen(result.fields), true);
    }
  });

  it("aligns all references to Registry inventories", () => {
    const serviceIds = new Set(
      KnowledgeServicesRegistry.services.map((s) => s.id),
    );
    const capabilityIds = new Set(
      KnowledgeServicesRegistry.capabilities.map((c) => c.id),
    );
    const contractIds = new Set(
      KnowledgeServicesRegistry.contracts.map((c) => c.id),
    );
    const accessModeIds = new Set(
      KnowledgeServicesRegistry.accessModes.map((m) => m.id),
    );
    assert.equal(KnowledgeServicesRegistry.services.length, 12);
    assert.equal(KnowledgeServicesRegistry.capabilities.length, 12);
    assert.equal(KnowledgeServicesRegistry.contracts.length, 11);
    assert.equal(KnowledgeServicesRegistry.accessModes.length, 10);
    for (const request of KnowledgeServicesRequestModels) {
      assert.ok(serviceIds.has(request.serviceReference));
      assert.ok(capabilityIds.has(request.capabilityReference));
      assert.ok(contractIds.has(request.contractReference));
      assert.ok(accessModeIds.has(request.accessModeReference));
    }
    for (const response of KnowledgeServicesResponseModels) {
      if (response.serviceReference !== "DKL-7:2/Service/Any") {
        assert.ok(serviceIds.has(response.serviceReference));
      }
      if (response.capabilityReference !== "DKL-7:2/Capability/Any") {
        assert.ok(capabilityIds.has(response.capabilityReference));
      }
    }
    assert.equal(
      KnowledgeServicesRegistry.accessModes.every((m) => m.mutationAllowed === false),
      true,
    );
    assert.equal(getKnowledgeServicesModelSummary().mutationModeCount, 0);
  });

  it("declares context, reference, and graph model inventories", () => {
    assert.equal(KnowledgeServicesContextModels.length, 4);
    assert.equal(KnowledgeServicesModel.contexts.models.length, 4);
    assert.equal(KnowledgeServicesModel.references.length, 8);
    assert.equal(KnowledgeServicesModel.contexts.graphModels.length, 3);
    assert.ok(
      KnowledgeServicesModel.references.some(
        (r) => r.referenceKind === "BusinessObject" && r.ownsReferencedEntity === false,
      ),
    );
    for (const graph of KnowledgeServicesModel.contexts.graphModels) {
      assert.equal(graph.algorithmic, false);
      assert.equal(graph.traversable, false);
    }
  });

  it("declares deterministic model relationships and trace chains", () => {
    assert.equal(KnowledgeServicesModelRelationships.length, 28);
    assert.equal(KnowledgeServicesModel.relationships.length, 28);
    assertUnique(
      KnowledgeServicesModelRelationships.map((r) => r.relationshipId),
      "relationship IDs",
    );
    const traceCount = KnowledgeServicesModelRelationships.filter(
      (r) => r.relationshipKind === "RequestTrace",
    ).length;
    assert.equal(traceCount, 12);
    for (const relationship of KnowledgeServicesModelRelationships) {
      assert.equal(relationship.dispatching, false);
      assert.equal(relationship.orchestration, false);
      assert.equal(Object.isFrozen(relationship), true);
    }
  });

  it("preserves exact canonical section order and complete guarantees", () => {
    const keys = Object.keys(KnowledgeServicesModel);
    const sectionIndexes = CANONICAL_SECTION_ORDER.map((section) =>
      keys.indexOf(section),
    );
    for (let i = 1; i < sectionIndexes.length; i += 1) {
      assert.ok(
        sectionIndexes[i]! > sectionIndexes[i - 1]!,
        `${CANONICAL_SECTION_ORDER[i]} must follow ${CANONICAL_SECTION_ORDER[i - 1]}`,
      );
    }
    const guaranteeKeys = Object.keys(KnowledgeServicesModel.guarantees);
    assert.equal(guaranteeKeys.length, 20);
    assertUnique(guaranteeKeys, "guarantee keys");
    for (const value of Object.values(KnowledgeServicesModel.guarantees)) {
      assert.equal(value, true);
    }
  });

  it("is immutable, metadata-only, and free of runtime/mutation implementation", () => {
    assert.equal(KnowledgeServicesModel.metadataOnly, true);
    assert.equal(KnowledgeServicesModel.runtimeBehavior, false);
    assert.equal(KnowledgeServicesModel.serviceExecution, false);
    assert.equal(KnowledgeServicesModel.repositoryAccess, false);
    assert.equal(KnowledgeServicesModel.searchExecution, false);
    assert.equal(KnowledgeServicesModel.graphTraversal, false);
    assert.equal(KnowledgeServicesModel.aiBehavior, false);
    assert.equal(KnowledgeServicesModel.immutable, true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel), true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel.identity), true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel.requests), true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel.responses), true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel.results), true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel.relationships), true);
    assert.equal(Object.isFrozen(KnowledgeServicesModel.inventory), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeServicesModel.status = "Mutated";
    });
    assert.equal("execute" in KnowledgeServicesModel, false);
    assert.equal("dispatch" in KnowledgeServicesModel, false);
    assert.equal("query" in KnowledgeServicesModel, false);
    for (const request of KnowledgeServicesRequestModels) {
      const serialized = JSON.stringify(request).toLowerCase();
      for (const word of PROHIBITED_MUTATION_WORDS) {
        assert.equal(
          serialized.includes(`"${word}"`),
          false,
          `request must not support operation ${word}`,
        );
      }
    }
  });

  it("returns deterministic summary and exact inventory count", () => {
    const summary = getKnowledgeServicesModelSummary();
    const again = getKnowledgeServicesModelSummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.modelId, KnowledgeServicesModelId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "ModelComplete");
    assert.equal(summary.registryId, KnowledgeServicesRegistryId);
    assert.equal(
      summary.foundationId,
      KnowledgeServicesRegistry.foundation.foundationId,
    );
    assert.equal(summary.requestModelCount, 12);
    assert.equal(summary.responseModelCount, 12);
    assert.equal(summary.resultModelCount, 12);
    assert.equal(summary.contextModelCount, 4);
    assert.equal(summary.referenceModelCount, 8);
    assert.equal(summary.graphModelCount, 3);
    assert.equal(summary.relationshipCount, 28);
    assert.equal(summary.registeredServiceCount, 12);
    assert.equal(summary.registeredCapabilityCount, 12);
    assert.equal(summary.registeredContractCount, 11);
    assert.equal(summary.approvedAccessModeCount, 10);
    assert.equal(summary.mutationModeCount, 0);
    assert.equal(summary.readiness, "ReadyForValidation");
    const expected =
      12 + 12 + 12 + 4 + 8 + 3 + 28;
    assert.equal(KnowledgeServicesModel.inventory.totalEntryCount, expected);
    assert.equal(getKnowledgeServicesModelInventoryCount(), expected);
    assert.equal(
      KnowledgeServicesModel.inventory.countingRule.includes("requestModelCount"),
      true,
    );
    assert.equal(Object.isFrozen(summary), true);
  });
});
