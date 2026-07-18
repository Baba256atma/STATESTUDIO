/**
 * DKL-7:1 — Knowledge Services Foundation Tests.
 *
 * Deterministic verification of foundation identity, ownership, boundaries,
 * lifecycle, capabilities, contracts, dependency rules, and public exports.
 * No mocks. No randomness. No runtime behavior.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./knowledgeServicesFoundation.ts";
import {
  getKnowledgeServicesFoundationSummary,
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
  KnowledgeServicesFoundationName,
  KnowledgeServicesFoundationNamespace,
  KnowledgeServicesFoundationStatus,
  KnowledgeServicesFoundationVersion,
} from "./knowledgeServicesFoundation.ts";
import { KnowledgeRepositoryPublicIndexId } from "./knowledgeRepositoryPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL71_FILES = Object.freeze([
  "knowledgeServicesFoundationTypes.ts",
  "knowledgeServicesContracts.ts",
  "knowledgeServicesOwnership.ts",
  "knowledgeServicesBoundaries.ts",
  "knowledgeServicesLifecycle.ts",
  "knowledgeServicesCapabilities.ts",
  "knowledgeServicesFoundation.ts",
  "knowledgeServicesFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesFoundation",
  "KnowledgeServicesFoundationId",
  "KnowledgeServicesFoundationName",
  "KnowledgeServicesFoundationVersion",
  "KnowledgeServicesFoundationNamespace",
  "KnowledgeServicesFoundationStatus",
  "getKnowledgeServicesFoundationSummary",
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

const REQUIRED_LIFECYCLE_STAGES = Object.freeze([
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

const REQUIRED_DOES_NOT_OWN = Object.freeze([
  "Repository implementation",
  "Persistence",
  "Database",
  "Search engine",
  "Graph engine",
  "Caching",
  "Authentication",
  "Authorization",
  "Transport",
  "REST",
  "HTTP",
  "SDK",
  "MCP",
  "NEA",
  "Executive Engine",
  "Advisor",
  "Scene",
  "Business Object creation",
  "Knowledge validation",
  "Knowledge storage",
  "AI reasoning",
  "Decision making",
  "Planning",
  "Execution",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /\/engine\//i,
  /\/bus\//i,
  /\/ops\//i,
  /\/core\//i,
  /advisor/i,
  /scene/i,
  /nea/i,
  /knowledgeRepository(?!PublicIndex)/i,
  /knowledgeValidation/i,
  /knowledgeModeling/i,
  /dataUnderstanding/i,
  /dataSource/i,
  /dataKnowledge/i,
]);

describe("DKL-7:1 Knowledge Services Foundation", () => {
  it("creates exactly eight Foundation files", () => {
    assert.equal(DKL71_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL71_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("exposes exactly the required public exports", () => {
    const exported = Object.keys(FoundationModule).sort();
    assert.deepEqual(exported, [...REQUIRED_PUBLIC_EXPORTS].sort());
    assert.equal(exported.length, 7);
  });

  it("has canonical foundation identity", () => {
    assert.equal(
      KnowledgeServicesFoundationId,
      "DKL-7:1/KnowledgeServicesFoundation",
    );
    assert.equal(
      KnowledgeServicesFoundationName,
      "Knowledge Services Foundation",
    );
    assert.equal(
      KnowledgeServicesFoundation.foundationId,
      KnowledgeServicesFoundationId,
    );
    assert.equal(
      KnowledgeServicesFoundation.identity.foundationId,
      KnowledgeServicesFoundationId,
    );
    assert.equal(
      KnowledgeServicesFoundation.identity.foundationName,
      KnowledgeServicesFoundationName,
    );
    assert.equal(
      KnowledgeServicesFoundation.identity.layer,
      "Data Knowledge Layer",
    );
    assert.equal(KnowledgeServicesFoundation.identity.phase, "DKL-7");
    assert.equal(KnowledgeServicesFoundation.identity.stage, "Foundation");
    assert.equal(KnowledgeServicesFoundation.identity.sourcePhase, "DKL-7:1");
    assert.equal(
      KnowledgeServicesFoundation.identity.architectureType,
      "KnowledgeServices",
    );
  });

  it("has immutable version 1.0.0", () => {
    assert.equal(KnowledgeServicesFoundationVersion, "1.0.0");
    assert.equal(
      KnowledgeServicesFoundation.version,
      KnowledgeServicesFoundationVersion,
    );
    assert.equal(
      KnowledgeServicesFoundation.identity.foundationVersion,
      "1.0.0",
    );
    assert.equal(
      KnowledgeServicesFoundation.validation.versionImmutable,
      true,
    );
  });

  it("has FoundationComplete status", () => {
    assert.equal(KnowledgeServicesFoundationStatus, "FoundationComplete");
    assert.equal(
      KnowledgeServicesFoundation.status,
      KnowledgeServicesFoundationStatus,
    );
    assert.equal(
      KnowledgeServicesFoundation.identity.status,
      "FoundationComplete",
    );
    assert.equal(KnowledgeServicesFoundation.readiness, "ReadyForRegistry");
    assert.equal(
      KnowledgeServicesFoundation.identity.readiness,
      "ReadyForRegistry",
    );
    assert.equal(KnowledgeServicesFoundation.validation.statusComplete, true);
  });

  it("has immutable namespace", () => {
    assert.equal(
      KnowledgeServicesFoundationNamespace,
      "nexora.dkl.knowledge-services.foundation",
    );
    assert.equal(
      KnowledgeServicesFoundation.namespace,
      KnowledgeServicesFoundationNamespace,
    );
    assert.equal(
      KnowledgeServicesFoundation.identity.foundationNamespace,
      "nexora.dkl.knowledge-services.foundation",
    );
    assert.equal(
      KnowledgeServicesFoundation.validation.namespaceImmutable,
      true,
    );
  });

  it("declares complete ownership and non-ownership", () => {
    const { ownership } = KnowledgeServicesFoundation;
    assert.equal(ownership.ownsCount, 6);
    assert.equal(ownership.doesNotOwnCount, 24);
    assert.deepEqual([...ownership.owns], [...REQUIRED_OWNS]);
    assert.deepEqual([...ownership.doesNotOwn], [...REQUIRED_DOES_NOT_OWN]);
    assert.equal(ownership.dkl6RetainsRepositoryOwnership, true);
    assert.equal(ownership.noRepositoryImplementationOwnership, true);
    assert.equal(ownership.noPersistenceOwnership, true);
    assert.equal(ownership.noExecutiveEngineOwnership, true);
    assert.equal(
      KnowledgeServicesFoundation.validation.ownershipComplete,
      true,
    );
  });

  it("declares complete lifecycle stages without runtime transitions", () => {
    const { lifecycle } = KnowledgeServicesFoundation;
    assert.deepEqual([...lifecycle.stages], [...REQUIRED_LIFECYCLE_STAGES]);
    assert.equal(lifecycle.stageCount, 8);
    assert.equal(lifecycle.notes.terminalStage, "Retired");
    assert.equal(lifecycle.notes.noTransitionExecution, true);
    assert.equal(lifecycle.notes.noRuntimeBehavior, true);
    assert.deepEqual([...lifecycle.transitions.Retired], []);
    assert.ok(lifecycle.transitions.Declared.includes("Registered"));
    assert.ok(lifecycle.transitions.Certified.includes("Frozen"));
    assert.ok(lifecycle.transitions.Released.includes("Deprecated"));
    assert.equal(
      KnowledgeServicesFoundation.validation.lifecycleComplete,
      true,
    );
  });

  it("declares all required capabilities as declarations only", () => {
    const { capabilities } = KnowledgeServicesFoundation;
    assert.equal(capabilities.capabilityCount, 12);
    assert.deepEqual(
      [...capabilities.requiredCapabilityIds],
      [...REQUIRED_CAPABILITY_IDS],
    );
    const ids = capabilities.capabilities.map((c) => c.capabilityId);
    assert.deepEqual([...ids], [...REQUIRED_CAPABILITY_IDS]);
    for (const capability of capabilities.capabilities) {
      assert.equal(capability.metadataOnly, true);
      assert.equal(capability.declaredOnly, true);
      assert.equal(capability.implemented, false);
      assert.equal(capability.createsKnowledge, false);
      assert.equal(capability.modifiesKnowledge, false);
      assert.equal(capability.performsExecutiveReasoning, false);
      assert.equal(Object.isFrozen(capability), true);
    }
    assert.equal(capabilities.notes.declarationsOnly, true);
    assert.equal(capabilities.notes.noImplementation, true);
    assert.equal(
      KnowledgeServicesFoundation.validation.capabilitiesDeclared,
      true,
    );
  });

  it("declares architectural boundaries prohibiting implementation surfaces", () => {
    const { boundaries } = KnowledgeServicesFoundation;
    assert.deepEqual([...boundaries.consumes], ["DKL-6 Public Index"]);
    assert.deepEqual(
      [...boundaries.provides],
      ["Knowledge Services Foundation"],
    );
    assert.equal(boundaries.prohibitedSurfaceCount, 29);
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime execution"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Repository implementation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("SQL"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Vector databases"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Graph databases"));
    assert.ok(boundaries.prohibitedSurfaces.includes("REST endpoints"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Executive reasoning"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Dependency injection"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Network communication"));
    assert.equal(boundaries.readOnlyAccessLayer, true);
    assert.equal(boundaries.createsKnowledge, false);
    assert.equal(boundaries.modifiesKnowledge, false);
    assert.equal(boundaries.performsExecutiveReasoning, false);
    assert.equal(boundaries.runtimeExecution, false);
    assert.equal(boundaries.repositoryImplementation, false);
    assert.equal(boundaries.implementsSql, false);
    assert.equal(boundaries.apiImplementation, false);
    assert.equal(boundaries.networkCommunication, false);
    assert.equal(boundaries.serviceImplementationExcluded, true);
    assert.equal(
      KnowledgeServicesFoundation.validation.boundariesDeclared,
      true,
    );
  });

  it("declares Knowledge Service contracts as metadata only", () => {
    const { contracts } = KnowledgeServicesFoundation;
    assert.equal(contracts.contractCount, 11);
    const contractIds = contracts.contracts.map((c) => c.contractId);
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeService"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceIdentity"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceMetadata"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceCapability"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceLifecycle"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceBoundary"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceOwnership"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceContract"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceRequest"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceResponse"));
    assert.ok(contractIds.includes("DKL-7:1/KnowledgeServiceNamespace"));
    for (const contract of contracts.contracts) {
      assert.equal(contract.metadataOnly, true);
      assert.equal(contract.immutable, true);
      assert.equal(contract.readOnly, true);
      assert.equal(Object.isFrozen(contract), true);
      assert.equal(Object.isFrozen(contract.fields), true);
    }
    assert.equal(contracts.notes.noRepositoryAccess, true);
    assert.equal(contracts.notes.noQueryExecution, true);
    assert.equal(contracts.notes.createsKnowledge, false);
    assert.equal(contracts.notes.modifiesKnowledge, false);
    assert.equal(
      KnowledgeServicesFoundation.validation.contractsDeclared,
      true,
    );
  });

  it("consumes DKL-6 Public Index only", () => {
    assert.equal(
      KnowledgeServicesFoundation.upstream.publicIndexId,
      KnowledgeRepositoryPublicIndexId,
    );
    assert.equal(
      KnowledgeServicesFoundation.upstream.module,
      "knowledgeRepositoryPublicIndex.ts",
    );
    assert.equal(
      KnowledgeServicesFoundation.upstream.consumesPublicIndexOnly,
      true,
    );
    assert.equal(
      KnowledgeServicesFoundation.dependencies.consumesDkl6PublicIndexOnly,
      true,
    );
    assert.equal(KnowledgeServicesFoundation.dependencies.allowedCount, 1);
    assert.equal(
      KnowledgeServicesFoundation.dependencies.allowed[0]?.module,
      "knowledgeRepositoryPublicIndex.ts",
    );
    assert.ok(
      KnowledgeServicesFoundation.dependencies.forbidden.includes("Engine"),
    );
    assert.ok(
      KnowledgeServicesFoundation.dependencies.forbidden.includes("Advisor"),
    );
    assert.ok(
      KnowledgeServicesFoundation.dependencies.forbidden.includes("NEA"),
    );
    assert.equal(
      KnowledgeServicesFoundation.validation.upstreamPublicIndexBound,
      true,
    );
  });

  it("enforces dependency rules across Foundation source files", () => {
    for (const file of DKL71_FILES.filter((f) => !f.endsWith(".test.ts"))) {
      const text = readFileSync(join(HERE, file), "utf8");
      const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map(
        (m) => m[1]!,
      );
      for (const spec of imports) {
        if (spec.startsWith("./knowledgeServices")) {
          continue;
        }
        if (spec.includes("knowledgeRepository")) {
          assert.ok(
            /knowledgeRepositoryPublicIndex\.ts$/.test(spec),
            `${file} must import DKL-6 only via Public Index: ${spec}`,
          );
          continue;
        }
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.equal(
            pattern.test(spec),
            false,
            `${file} has prohibited dependency: ${spec}`,
          );
        }
      }
      assert.equal(
        /\bTODO\b/.test(text),
        false,
        `${file} must not contain TODO`,
      );
      assert.equal(
        /\beval\s*\(/.test(text),
        false,
        `${file} must not use eval`,
      );
      assert.equal(
        /import\s*\(/.test(text),
        false,
        `${file} must not use dynamic import`,
      );
    }
  });

  it("is immutable and metadata-only with no runtime behavior", () => {
    assert.equal(KnowledgeServicesFoundation.metadataOnly, true);
    assert.equal(KnowledgeServicesFoundation.runtimeBehavior, false);
    assert.equal(KnowledgeServicesFoundation.serviceImplementation, false);
    assert.equal(KnowledgeServicesFoundation.createsKnowledge, false);
    assert.equal(KnowledgeServicesFoundation.modifiesKnowledge, false);
    assert.equal(KnowledgeServicesFoundation.performsExecutiveReasoning, false);
    assert.equal(KnowledgeServicesFoundation.immutable, true);
    assert.equal(KnowledgeServicesFoundation.deterministic, true);
    assert.equal(KnowledgeServicesFoundation.metadata.runtimeBehavior, false);
    assert.equal(KnowledgeServicesFoundation.metadata.queryExecution, false);
    assert.equal(KnowledgeServicesFoundation.metadata.aiReasoning, false);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.identity), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.ownership), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.capabilities), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.boundaries), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.lifecycle), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.contracts), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.metadata), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFoundation.dependencies), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeServicesFoundation.status = "Mutated";
    });
  });

  it("returns a deterministic foundation summary", () => {
    const summary = getKnowledgeServicesFoundationSummary();
    const again = getKnowledgeServicesFoundationSummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.foundationId, KnowledgeServicesFoundationId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(
      summary.namespace,
      "nexora.dkl.knowledge-services.foundation",
    );
    assert.equal(summary.layer, "Data Knowledge Layer");
    assert.equal(summary.phase, "DKL-7");
    assert.equal(summary.stage, "Foundation");
    assert.equal(summary.status, "FoundationComplete");
    assert.equal(summary.readiness, "ReadyForRegistry");
    assert.equal(summary.capabilityCount, 12);
    assert.equal(summary.contractCount, 11);
    assert.equal(summary.lifecycleStageCount, 8);
    assert.equal(summary.ownsCount, 6);
    assert.equal(summary.doesNotOwnCount, 24);
    assert.equal(summary.prohibitedBoundaryCount, 29);
    assert.equal(
      summary.upstreamPublicIndexId,
      KnowledgeRepositoryPublicIndexId,
    );
    assert.equal(summary.metadataOnly, true);
    assert.equal(Object.isFrozen(summary), true);
  });

  it("contains no implementation leakage in Foundation aggregate shape", () => {
    const keys = Object.keys(KnowledgeServicesFoundation).sort();
    assert.deepEqual(keys, [
      "boundaries",
      "capabilities",
      "contracts",
      "createsKnowledge",
      "dependencies",
      "deterministic",
      "foundationId",
      "foundationName",
      "foundationNamespace",
      "foundationStatus",
      "foundationVersion",
      "identity",
      "immutable",
      "layer",
      "lifecycle",
      "metadata",
      "metadataOnly",
      "modifiesKnowledge",
      "name",
      "namespace",
      "nextPhase",
      "ownership",
      "performsExecutiveReasoning",
      "phase",
      "readiness",
      "referencedThroughPublicFoundation",
      "runtimeBehavior",
      "serviceImplementation",
      "soleArchitecturalDependency",
      "stage",
      "status",
      "upstream",
      "validation",
      "version",
    ]);
    assert.equal("execute" in KnowledgeServicesFoundation, false);
    assert.equal("query" in KnowledgeServicesFoundation, false);
    assert.equal("search" in KnowledgeServicesFoundation, false);
    assert.equal("connect" in KnowledgeServicesFoundation, false);
    assert.equal("repository" in KnowledgeServicesFoundation, false);
  });
});
