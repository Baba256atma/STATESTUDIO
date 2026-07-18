/**
 * DKL-7:2 — Knowledge Services Registry Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Registry.
 * No mocks. No randomness. No network. No databases. No external services.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
  KnowledgeServicesFoundationVersion,
} from "./knowledgeServicesFoundation.ts";
import * as RegistryModule from "./knowledgeServicesRegistry.ts";
import {
  getKnowledgeServicesRegistryInventoryCount,
  getKnowledgeServicesRegistrySummary,
  KnowledgeServicesCapabilityRegistry,
  KnowledgeServicesRegistry,
  KnowledgeServicesRegistryEntries,
  KnowledgeServicesRegistryId,
  KnowledgeServicesRegistryName,
  KnowledgeServicesRegistryNamespace,
  KnowledgeServicesRegistryStatus,
  KnowledgeServicesRegistryVersion,
} from "./knowledgeServicesRegistry.ts";
import { KnowledgeServicesContractRegistry } from "./knowledgeServicesContractRegistry.ts";
import { KnowledgeServicesLifecycleRegistry } from "./knowledgeServicesLifecycleRegistry.ts";
import { KnowledgeServicesOwnershipRegistry } from "./knowledgeServicesOwnershipRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL72_FILES = Object.freeze([
  "knowledgeServicesRegistryTypes.ts",
  "knowledgeServicesRegistryEntries.ts",
  "knowledgeServicesCapabilityRegistry.ts",
  "knowledgeServicesContractRegistry.ts",
  "knowledgeServicesLifecycleRegistry.ts",
  "knowledgeServicesOwnershipRegistry.ts",
  "knowledgeServicesRegistry.ts",
  "knowledgeServicesRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesRegistry",
  "KnowledgeServicesRegistryId",
  "KnowledgeServicesRegistryName",
  "KnowledgeServicesRegistryVersion",
  "KnowledgeServicesRegistryNamespace",
  "KnowledgeServicesRegistryStatus",
  "KnowledgeServicesRegistryEntries",
  "KnowledgeServicesCapabilityRegistry",
  "getKnowledgeServicesRegistrySummary",
  "getKnowledgeServicesRegistryInventoryCount",
] as const);

const REQUIRED_SERVICES = Object.freeze([
  "Knowledge Retrieval Service",
  "Business Object Access Service",
  "Knowledge Search Service",
  "Relationship Lookup Service",
  "Knowledge Graph Navigation Service",
  "Metadata Query Service",
  "Timeline Query Service",
  "Evidence Lookup Service",
  "Knowledge Summary Service",
  "Knowledge Discovery Service",
  "Reference Resolution Service",
  "Cross-Domain Navigation Service",
] as const);

const REQUIRED_CAPABILITY_IDS = Object.freeze([
  "KnowledgeRetrieval",
  "BusinessObjectAccess",
  "KnowledgeSearch",
  "RelationshipLookup",
  "KnowledgeGraphTraversal",
  "MetadataQuery",
  "TimelineQuery",
  "EvidenceLookup",
  "KnowledgeSummary",
  "KnowledgeDiscovery",
  "ReferenceResolution",
  "CrossDomainNavigation",
] as const);

const REQUIRED_LIFECYCLE = Object.freeze([
  "Declared",
  "Registered",
  "Available",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
  "Retired",
] as const);

const REQUIRED_OWNS = Object.freeze([
  "Knowledge Service contracts",
  "Knowledge Service metadata",
  "Service capability declarations",
  "Knowledge access vocabulary",
  "Read-only service boundaries",
  "Service lifecycle definitions",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:2 Knowledge Services Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(DKL72_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL72_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("exposes exactly the required public exports", () => {
    const exported = Object.keys(RegistryModule).sort();
    assert.deepEqual(exported, [...REQUIRED_PUBLIC_EXPORTS].sort());
    assert.equal(exported.length, 10);
  });

  it("has exact registry identity, version, and RegistryComplete status", () => {
    assert.equal(
      KnowledgeServicesRegistryId,
      "DKL-7:2/KnowledgeServicesRegistry",
    );
    assert.equal(KnowledgeServicesRegistryName, "Knowledge Services Registry");
    assert.equal(KnowledgeServicesRegistryVersion, "1.0.0");
    assert.equal(KnowledgeServicesRegistryStatus, "RegistryComplete");
    assert.equal(
      KnowledgeServicesRegistryNamespace,
      "nexora.dkl.knowledge-services.registry",
    );
    assert.equal(
      KnowledgeServicesRegistry.identity.registryId,
      KnowledgeServicesRegistryId,
    );
    assert.equal(KnowledgeServicesRegistry.identity.layer, "Data Knowledge Layer");
    assert.equal(KnowledgeServicesRegistry.identity.phase, "DKL-7");
    assert.equal(KnowledgeServicesRegistry.identity.stage, "Registry");
    assert.equal(KnowledgeServicesRegistry.identity.status, "RegistryComplete");
    assert.equal(KnowledgeServicesRegistry.status, "RegistryComplete");
    assert.equal(
      KnowledgeServicesRegistry.identity.registryVersion,
      KnowledgeServicesRegistryVersion,
    );
  });

  it("references DKL-7:1 Foundation identity and version correctly", () => {
    assert.equal(
      KnowledgeServicesRegistry.identity.foundationId,
      KnowledgeServicesFoundationId,
    );
    assert.equal(
      KnowledgeServicesRegistry.identity.foundationVersion,
      KnowledgeServicesFoundationVersion,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.foundationId,
      KnowledgeServicesFoundationId,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.foundationVersion,
      KnowledgeServicesFoundationVersion,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.identity,
      KnowledgeServicesFoundation.identity,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.capabilities,
      KnowledgeServicesFoundation.capabilities,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.contracts,
      KnowledgeServicesFoundation.contracts,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.lifecycle,
      KnowledgeServicesFoundation.lifecycle,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.ownership,
      KnowledgeServicesFoundation.ownership,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.boundaries,
      KnowledgeServicesFoundation.boundaries,
    );
    assert.equal(
      KnowledgeServicesRegistry.foundation.referencedThroughPublicFoundation,
      true,
    );
  });

  it("consumes only DKL-7:1 through public foundation exports", () => {
    const dkl72Local = new Set([
      "./knowledgeServicesRegistryTypes.ts",
      "./knowledgeServicesRegistryEntries.ts",
      "./knowledgeServicesCapabilityRegistry.ts",
      "./knowledgeServicesContractRegistry.ts",
      "./knowledgeServicesLifecycleRegistry.ts",
      "./knowledgeServicesOwnershipRegistry.ts",
      "./knowledgeServicesRegistry.ts",
    ]);
    const allowedDkl71 = "./knowledgeServicesFoundation.ts";
    for (const file of DKL72_FILES.filter((f) => !f.endsWith(".test.ts"))) {
      const text = readFileSync(join(HERE, file), "utf8");
      const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map(
        (m) => m[1]!,
      );
      for (const spec of imports) {
        if (dkl72Local.has(spec) || spec === allowedDkl71) {
          continue;
        }
        if (spec.startsWith("./knowledgeServices")) {
          assert.fail(
            `${file} may import DKL-7:1 only via foundation public exports: ${spec}`,
          );
        }
        assert.equal(
          /knowledgeRepository|knowledgeValidation|knowledgeModeling|dataUnderstanding|dataSource|dataKnowledge|\/engine\/|\/bus\/|\/ops\/|\/core\/|advisor|scene|nea/i.test(
            spec,
          ),
          false,
          `${file} has prohibited dependency: ${spec}`,
        );
      }
      assert.equal(/\bTODO\b/.test(text), false, `${file} must not contain TODO`);
      assert.equal(/\beval\s*\(/.test(text), false, `${file} must not use eval`);
      assert.equal(
        /import\s*\(/.test(text),
        false,
        `${file} must not use dynamic import`,
      );
    }
  });

  it("registers all 12 capabilities from Foundation by reference", () => {
    assert.equal(KnowledgeServicesRegistry.capabilities.length, 12);
    assert.equal(KnowledgeServicesCapabilityRegistry.capabilityCount, 12);
    const ids = KnowledgeServicesRegistry.capabilities.map((c) => c.capabilityId);
    assert.deepEqual([...ids], [...REQUIRED_CAPABILITY_IDS]);
    for (const capability of KnowledgeServicesRegistry.capabilities) {
      assert.equal(capability.implemented, false);
      assert.equal(capability.declaredOnly, true);
      assert.equal(capability.readOnly, true);
      assert.ok(
        capability.foundationReference.startsWith(KnowledgeServicesFoundationId),
      );
      assert.equal(Object.isFrozen(capability), true);
    }
  });

  it("registers all 11 Foundation contracts by canonical identity", () => {
    assert.equal(KnowledgeServicesRegistry.contracts.length, 11);
    assert.equal(KnowledgeServicesContractRegistry.contractCount, 11);
    assert.equal(
      KnowledgeServicesContractRegistry.foundationContractCount,
      KnowledgeServicesFoundation.contracts.contractCount,
    );
    const foundationIds = KnowledgeServicesFoundation.contracts.contracts.map(
      (c) => c.contractId,
    );
    const registeredIds = KnowledgeServicesRegistry.contracts.map(
      (c) => c.contractId,
    );
    assert.deepEqual([...registeredIds], [...foundationIds]);
    assertUnique(registeredIds, "contract IDs");
    for (const contract of KnowledgeServicesRegistry.contracts) {
      assert.equal(contract.readOnly, true);
      assert.equal(contract.foundationReference, contract.contractId);
      assert.equal(Object.isFrozen(contract), true);
    }
  });

  it("registers all 8 lifecycle stages in Foundation order", () => {
    assert.equal(KnowledgeServicesRegistry.lifecycle.length, 8);
    assert.deepEqual(
      [...KnowledgeServicesLifecycleRegistry.orderedStageNames],
      [...REQUIRED_LIFECYCLE],
    );
    assert.deepEqual(
      KnowledgeServicesRegistry.lifecycle.map((s) => s.stage),
      [...REQUIRED_LIFECYCLE],
    );
    assert.equal(
      KnowledgeServicesRegistry.lifecycle[
        KnowledgeServicesRegistry.lifecycle.length - 1
      ]?.terminal,
      true,
    );
    assert.equal(
      KnowledgeServicesLifecycleRegistry.notes.noStateTransitions,
      true,
    );
  });

  it("preserves exactly 6 owned and 24 non-owned declarations", () => {
    assert.equal(KnowledgeServicesRegistry.ownership.ownedCount, 6);
    assert.equal(KnowledgeServicesRegistry.ownership.nonOwnedCount, 24);
    assert.deepEqual(
      [...KnowledgeServicesRegistry.ownership.foundationOwns],
      [...REQUIRED_OWNS],
    );
    assert.deepEqual(
      [...KnowledgeServicesRegistry.ownership.foundationOwns],
      [...KnowledgeServicesFoundation.ownership.owns],
    );
    assert.deepEqual(
      [...KnowledgeServicesRegistry.ownership.foundationDoesNotOwn],
      [...KnowledgeServicesFoundation.ownership.doesNotOwn],
    );
    assert.equal(KnowledgeServicesOwnershipRegistry.ownedCount, 6);
    assert.equal(KnowledgeServicesOwnershipRegistry.nonOwnedCount, 24);
  });

  it("preserves exactly 29 prohibited surfaces", () => {
    assert.equal(KnowledgeServicesRegistry.boundaries.length, 29);
    assert.equal(
      KnowledgeServicesOwnershipRegistry.prohibitedSurfaceCount,
      29,
    );
    assert.deepEqual(
      KnowledgeServicesRegistry.boundaries.map((b) => b.surface),
      [...KnowledgeServicesFoundation.boundaries.prohibitedSurfaces],
    );
    for (const boundary of KnowledgeServicesRegistry.boundaries) {
      assert.equal(boundary.prohibited, true);
      assert.ok(boundary.classification.length > 0);
      assert.equal(Object.isFrozen(boundary), true);
    }
  });

  it("registers twelve unique read-only services", () => {
    assert.equal(KnowledgeServicesRegistry.services.length, 12);
    assert.deepEqual(
      KnowledgeServicesRegistry.services.map((s) => s.name),
      [...REQUIRED_SERVICES],
    );
    assertUnique(
      KnowledgeServicesRegistry.services.map((s) => s.id),
      "service IDs",
    );
    for (const service of KnowledgeServicesRegistry.services) {
      assert.equal(service.readOnly, true);
      assert.equal(service.createsKnowledge, false);
      assert.equal(service.modifiesKnowledge, false);
      assert.equal(service.performsExecutiveReasoning, false);
      assert.equal(service.hasHandler, false);
      assert.equal(service.hasExecutor, false);
      assert.equal(service.runtimeBehavior, "None");
    }
  });

  it("enforces unique IDs across registry categories", () => {
    assertUnique(
      KnowledgeServicesRegistry.capabilities.map((c) => c.id),
      "capability entry IDs",
    );
    assertUnique(
      KnowledgeServicesRegistry.capabilities.map((c) => c.capabilityId),
      "capability IDs",
    );
    assertUnique(
      KnowledgeServicesRegistry.contracts.map((c) => c.id),
      "contract entry IDs",
    );
    assertUnique(
      KnowledgeServicesRegistry.requestCategories.map((c) => c.id),
      "request-category IDs",
    );
    assertUnique(
      KnowledgeServicesRegistry.responseCategories.map((c) => c.id),
      "response-category IDs",
    );
    assertUnique(
      KnowledgeServicesRegistry.accessModes.map((c) => c.id),
      "access-mode IDs",
    );
    assertUnique(
      KnowledgeServicesRegistry.relationships.map((c) => c.id),
      "relationship IDs",
    );
  });

  it("maps service-capability relationships to valid entries only", () => {
    assert.equal(KnowledgeServicesRegistry.relationships.length, 12);
    const serviceIds = new Set(
      KnowledgeServicesRegistry.services.map((s) => s.id),
    );
    const capabilityIds = new Set(
      KnowledgeServicesRegistry.capabilities.map((c) => c.capabilityId),
    );
    for (const relationship of KnowledgeServicesRegistry.relationships) {
      assert.ok(serviceIds.has(relationship.serviceId));
      assert.ok(capabilityIds.has(relationship.capabilityId));
      assert.equal(relationship.routing, false);
      assert.equal(relationship.dispatching, false);
    }
  });

  it("prohibits mutation access modes and declares read-only access only", () => {
    assert.equal(KnowledgeServicesRegistry.accessModes.length, 10);
    for (const mode of KnowledgeServicesRegistry.accessModes) {
      assert.equal(mode.readOnly, true);
      assert.equal(mode.mutationAllowed, false);
    }
    assert.deepEqual(
      [...KnowledgeServicesRegistryEntries.prohibitedMutationModes],
      [
        "create",
        "update",
        "delete",
        "execute",
        "mutate",
        "persist",
        "approve",
        "decide",
        "plan",
        "orchestrate",
      ],
    );
    assert.equal(
      KnowledgeServicesRegistry.inventory.prohibitedMutationModes.includes(
        "mutate",
      ),
      true,
    );
  });

  it("registers request and response categories as non-executable metadata", () => {
    assert.equal(KnowledgeServicesRegistry.requestCategories.length, 12);
    assert.equal(KnowledgeServicesRegistry.responseCategories.length, 12);
    for (const request of KnowledgeServicesRegistry.requestCategories) {
      assert.equal(request.executable, false);
      assert.ok(
        KnowledgeServicesRegistry.services.some(
          (s) => s.id === request.relatedServiceId,
        ),
      );
    }
    for (const response of KnowledgeServicesRegistry.responseCategories) {
      assert.equal(response.executable, false);
      assert.equal(response.transportAware, false);
    }
  });

  it("is immutable, metadata-only, and free of runtime implementation", () => {
    assert.equal(KnowledgeServicesRegistry.metadataOnly, true);
    assert.equal(KnowledgeServicesRegistry.runtimeBehavior, false);
    assert.equal(KnowledgeServicesRegistry.serviceExecution, false);
    assert.equal(KnowledgeServicesRegistry.createsKnowledge, false);
    assert.equal(KnowledgeServicesRegistry.modifiesKnowledge, false);
    assert.equal(KnowledgeServicesRegistry.performsExecutiveReasoning, false);
    assert.equal(KnowledgeServicesRegistry.immutable, true);
    assert.equal(KnowledgeServicesRegistry.deterministic, true);
    assert.equal(KnowledgeServicesRegistry.guarantees.noRuntimeBehavior, true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.identity), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.services), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.capabilities), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.contracts), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.lifecycle), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.boundaries), true);
    assert.equal(Object.isFrozen(KnowledgeServicesRegistry.inventory), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeServicesRegistry.status = "Mutated";
    });
    assert.equal("execute" in KnowledgeServicesRegistry, false);
    assert.equal("dispatch" in KnowledgeServicesRegistry, false);
    assert.equal("query" in KnowledgeServicesRegistry, false);
    assert.equal("search" in KnowledgeServicesRegistry, false);
  });

  it("returns deterministic summary and correct inventory counts", () => {
    const summary = getKnowledgeServicesRegistrySummary();
    const again = getKnowledgeServicesRegistrySummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.registryId, KnowledgeServicesRegistryId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "RegistryComplete");
    assert.equal(summary.foundationId, KnowledgeServicesFoundationId);
    assert.equal(summary.foundationVersion, KnowledgeServicesFoundationVersion);
    assert.equal(summary.serviceCount, 12);
    assert.equal(summary.capabilityCount, 12);
    assert.equal(summary.contractCount, 11);
    assert.equal(summary.lifecycleCount, 8);
    assert.equal(summary.ownedResponsibilityCount, 6);
    assert.equal(summary.nonOwnedResponsibilityCount, 24);
    assert.equal(summary.prohibitedSurfaceCount, 29);
    assert.equal(summary.requestCategoryCount, 12);
    assert.equal(summary.responseCategoryCount, 12);
    assert.equal(summary.accessModeCount, 10);
    assert.equal(summary.relationshipCount, 12);
    assert.equal(summary.totalEntryCount, 12 + 12 + 11 + 8 + 6 + 24 + 29 + 12 + 12 + 10 + 12);
    assert.equal(
      getKnowledgeServicesRegistryInventoryCount(),
      summary.totalEntryCount,
    );
    assert.equal(
      KnowledgeServicesRegistry.inventory.totalEntryCount,
      summary.totalEntryCount,
    );
    assert.equal(Object.isFrozen(summary), true);
  });
});
