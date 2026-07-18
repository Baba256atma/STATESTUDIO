/**
 * DKL-6:1 — Knowledge Repository Foundation Tests.
 *
 * Deterministic verification of foundation identity, ownership, boundaries,
 * lifecycle, policies, and public exports. No mocks. No randomness.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as FoundationModule from "./knowledgeRepositoryFoundation.ts";
import {
  getKnowledgeRepositoryFoundationSummary,
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationNamespace,
  KnowledgeRepositoryFoundationStatus,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeValidationPublicIndexId } from "./knowledgeValidationPublicIndex.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryFoundation",
  "KnowledgeRepositoryFoundationId",
  "KnowledgeRepositoryFoundationVersion",
  "KnowledgeRepositoryFoundationNamespace",
  "KnowledgeRepositoryFoundationStatus",
  "getKnowledgeRepositoryFoundationSummary",
] as const);

describe("DKL-6:1 Knowledge Repository Foundation", () => {
  it("exposes exactly the required public exports", () => {
    const exported = Object.keys(FoundationModule).sort();
    assert.deepEqual(exported, [...REQUIRED_PUBLIC_EXPORTS].sort());
    assert.equal(exported.length, 6);
  });

  it("has canonical foundation identity", () => {
    assert.equal(
      KnowledgeRepositoryFoundationId,
      "DKL-6:1/KnowledgeRepositoryFoundation",
    );
    assert.equal(
      KnowledgeRepositoryFoundation.foundationId,
      KnowledgeRepositoryFoundationId,
    );
    assert.equal(
      KnowledgeRepositoryFoundation.identity.foundationId,
      KnowledgeRepositoryFoundationId,
    );
    assert.equal(
      KnowledgeRepositoryFoundation.identity.foundationName,
      "Knowledge Repository Foundation",
    );
    assert.equal(KnowledgeRepositoryFoundation.identity.phase, "DKL-6:1");
    assert.equal(
      KnowledgeRepositoryFoundation.identity.architectureType,
      "KnowledgeRepository",
    );
  });

  it("has immutable version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryFoundationVersion, "1.0.0");
    assert.equal(
      KnowledgeRepositoryFoundation.version,
      KnowledgeRepositoryFoundationVersion,
    );
    assert.equal(
      KnowledgeRepositoryFoundation.identity.foundationVersion,
      "1.0.0",
    );
    assert.equal(
      KnowledgeRepositoryFoundation.validation.versionImmutable,
      true,
    );
  });

  it("has immutable namespace", () => {
    assert.equal(
      KnowledgeRepositoryFoundationNamespace,
      "nexora.dkl.repository.foundation",
    );
    assert.equal(
      KnowledgeRepositoryFoundation.namespace,
      KnowledgeRepositoryFoundationNamespace,
    );
    assert.equal(
      KnowledgeRepositoryFoundation.identity.foundationNamespace,
      "nexora.dkl.repository.foundation",
    );
    assert.equal(
      KnowledgeRepositoryFoundation.validation.namespaceImmutable,
      true,
    );
  });

  it("has Foundation status and ReadyForRegistry readiness", () => {
    assert.equal(KnowledgeRepositoryFoundationStatus, "Foundation");
    assert.equal(
      KnowledgeRepositoryFoundation.status,
      KnowledgeRepositoryFoundationStatus,
    );
    assert.equal(KnowledgeRepositoryFoundation.readiness, "ReadyForRegistry");
    assert.equal(KnowledgeRepositoryFoundation.identity.status, "Foundation");
    assert.equal(
      KnowledgeRepositoryFoundation.identity.readiness,
      "ReadyForRegistry",
    );
  });

  it("declares complete ownership and non-ownership", () => {
    const { ownership } = KnowledgeRepositoryFoundation;
    assert.equal(ownership.ownsCount, 11);
    assert.equal(ownership.doesNotOwnCount, 19);
    assert.ok(ownership.owns.includes("Repository contracts"));
    assert.ok(ownership.owns.includes("Repository policies"));
    assert.ok(ownership.doesNotOwn.includes("Database engines"));
    assert.ok(ownership.doesNotOwn.includes("Vector DB"));
    assert.ok(ownership.doesNotOwn.includes("Knowledge Validation"));
    assert.ok(ownership.doesNotOwn.includes("Engine reasoning"));
    assert.equal(ownership.noStorageEngineOwnership, true);
    assert.equal(ownership.noDatabaseCoupling, true);
    assert.equal(
      KnowledgeRepositoryFoundation.validation.ownershipComplete,
      true,
    );
  });

  it("declares architectural boundaries prohibiting implementation details", () => {
    const { boundaries } = KnowledgeRepositoryFoundation;
    assert.deepEqual([...boundaries.consumes], ["DKL-5 Public Index"]);
    assert.deepEqual([...boundaries.provides], ["Repository Foundation"]);
    assert.deepEqual(
      [...boundaries.neverAccesses],
      [
        "Database",
        "Network",
        "APIs",
        "File System",
        "Cache",
        "External Services",
      ],
    );
    assert.equal(boundaries.consumesDkl5PublicIndex, true);
    assert.equal(boundaries.accessesDatabase, false);
    assert.equal(boundaries.implementsVectorDb, false);
    assert.equal(boundaries.implementsSql, false);
    assert.equal(boundaries.executesQueries, false);
    assert.equal(boundaries.performsAiOrEmbeddings, false);
    assert.equal(boundaries.persistenceImplementationExcluded, true);
    assert.equal(boundaries.storageEngineExcluded, true);
    assert.equal(boundaries.databaseCouplingExcluded, true);
    assert.equal(
      KnowledgeRepositoryFoundation.validation.boundariesDeclared,
      true,
    );
  });

  it("declares complete repository lifecycle", () => {
    const { lifecycle } = KnowledgeRepositoryFoundation;
    assert.deepEqual(
      [...lifecycle.states],
      [
        "Created",
        "Validated",
        "Stored",
        "Versioned",
        "Retrieved",
        "Archived",
        "Frozen",
      ],
    );
    assert.equal(lifecycle.stateCount, 7);
    assert.equal(lifecycle.notes.terminalState, "Frozen");
    assert.equal(lifecycle.notes.noTransitionExecution, true);
    assert.deepEqual([...lifecycle.transitions.Frozen], []);
    assert.ok(lifecycle.transitions.Created.includes("Validated"));
    assert.ok(lifecycle.transitions.Stored.includes("Versioned"));
    assert.equal(
      KnowledgeRepositoryFoundation.validation.lifecycleComplete,
      true,
    );
  });

  it("declares complete repository policies", () => {
    const { policies } = KnowledgeRepositoryFoundation;
    assert.equal(policies.policyCount, 6);
    assert.deepEqual(
      [...policies.requiredKinds],
      [
        "VersionPolicy",
        "SnapshotPolicy",
        "ArchivePolicy",
        "RetentionPolicy",
        "MetadataPolicy",
        "IdentityPolicy",
      ],
    );
    for (const policy of policies.policies) {
      assert.equal(policy.status, "Declared");
      assert.equal(policy.metadataOnly, true);
      assert.equal(policy.executable, false);
    }
    assert.equal(policies.notes.noExecutableLogic, true);
    assert.equal(
      KnowledgeRepositoryFoundation.validation.policiesComplete,
      true,
    );
  });

  it("declares repository capabilities and contracts as metadata only", () => {
    const { contracts } = KnowledgeRepositoryFoundation;
    assert.equal(contracts.capabilityCount, 9);
    assert.equal(contracts.contractCount, 8);
    for (const capability of contracts.capabilities) {
      assert.equal(capability.metadataOnly, true);
      assert.equal(capability.implemented, false);
    }
    for (const contract of contracts.contracts) {
      assert.equal(contract.metadataOnly, true);
      assert.equal(contract.immutable, true);
    }
    assert.equal(contracts.notes.noPersistenceImplementation, true);
    assert.equal(contracts.notes.noDatabaseAccess, true);
    assert.equal(contracts.notes.noAi, true);
  });

  it("consumes DKL-5 Public Index only", () => {
    assert.equal(
      KnowledgeRepositoryFoundation.upstream.publicIndexId,
      KnowledgeValidationPublicIndexId,
    );
    assert.equal(
      KnowledgeRepositoryFoundation.upstream.consumesPublicIndexOnly,
      true,
    );
    assert.equal(
      KnowledgeRepositoryFoundation.validation.upstreamPublicIndexBound,
      true,
    );
  });

  it("is immutable and metadata-only", () => {
    assert.equal(KnowledgeRepositoryFoundation.metadataOnly, true);
    assert.equal(KnowledgeRepositoryFoundation.runtimeBehavior, false);
    assert.equal(KnowledgeRepositoryFoundation.persistenceImplementation, false);
    assert.equal(KnowledgeRepositoryFoundation.immutable, true);
    assert.equal(KnowledgeRepositoryFoundation.deterministic, true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryFoundation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryFoundation.identity), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryFoundation.status = "Mutated";
    });
  });

  it("returns a deterministic foundation summary", () => {
    const summary = getKnowledgeRepositoryFoundationSummary();
    const again = getKnowledgeRepositoryFoundationSummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.foundationId, KnowledgeRepositoryFoundationId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.namespace, "nexora.dkl.repository.foundation");
    assert.equal(summary.status, "Foundation");
    assert.equal(summary.readiness, "ReadyForRegistry");
    assert.equal(summary.capabilityCount, 9);
    assert.equal(summary.contractCount, 8);
    assert.equal(summary.lifecycleStateCount, 7);
    assert.equal(summary.policyCount, 6);
    assert.equal(summary.ownsCount, 11);
    assert.equal(summary.doesNotOwnCount, 19);
    assert.equal(summary.upstreamPublicIndexId, KnowledgeValidationPublicIndexId);
    assert.equal(summary.metadataOnly, true);
    assert.equal(Object.isFrozen(summary), true);
  });
});
