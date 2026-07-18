/**
 * DKL-6:2 — Knowledge Repository Registry Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Registry.
 * No mocks. No randomness. No network. No filesystem mutation.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import * as RegistryModule from "./knowledgeRepositoryRegistry.ts";
import {
  getKnowledgeRepositoryRegistryEntryCount,
  getKnowledgeRepositoryRegistrySummary,
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryName,
  KnowledgeRepositoryRegistryNamespace,
  KnowledgeRepositoryRegistryStatus,
  KnowledgeRepositoryRegistryVersion,
} from "./knowledgeRepositoryRegistry.ts";
import type { KnowledgeRepositoryRegistryEntry } from "./knowledgeRepositoryRegistryTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryRegistry",
  "KnowledgeRepositoryRegistryId",
  "KnowledgeRepositoryRegistryVersion",
  "KnowledgeRepositoryRegistryName",
  "KnowledgeRepositoryRegistryNamespace",
  "KnowledgeRepositoryRegistryStatus",
  "getKnowledgeRepositoryRegistrySummary",
  "getKnowledgeRepositoryRegistryEntryCount",
] as const);

const DKL62_FILES = Object.freeze([
  "knowledgeRepositoryRegistryTypes.ts",
  "knowledgeRepositoryTypeRegistry.ts",
  "knowledgeRepositoryComponentRegistry.ts",
  "knowledgeRepositoryVersionRegistry.ts",
  "knowledgeRepositorySnapshotRegistry.ts",
  "knowledgeRepositoryPolicyRegistry.ts",
  "knowledgeRepositoryRegistry.ts",
  "knowledgeRepositoryRegistry.test.ts",
] as const);

const REPOSITORY_TYPES = Object.freeze([
  "OrganizationalKnowledgeRepository",
  "BusinessKnowledgeRepository",
  "OperationalKnowledgeRepository",
  "DecisionKnowledgeRepository",
  "HistoricalKnowledgeRepository",
  "ReferenceKnowledgeRepository",
  "ArchivedKnowledgeRepository",
] as const);

const COMPONENTS = Object.freeze([
  "RepositoryIdentity",
  "RepositoryRecord",
  "RepositoryVersion",
  "RepositorySnapshot",
  "RepositoryHistory",
  "RepositoryArchive",
  "RepositoryMetadata",
  "RepositoryIndex",
  "RepositoryRetention",
  "RepositoryRetrieval",
] as const);

const KNOWLEDGE_RECORD_TYPES = Object.freeze([
  "KnowledgeObjectRecord",
  "BusinessObjectRecord",
  "RelationshipRecord",
  "EvidenceRecord",
  "ValidationRecord",
  "DecisionContextRecord",
  "RepositoryMetadataRecord",
] as const);

const VERSION_TYPES = Object.freeze([
  "InitialVersion",
  "RevisionVersion",
  "CorrectionVersion",
  "SupersededVersion",
  "HistoricalVersion",
  "FrozenVersion",
] as const);

const SNAPSHOT_TYPES = Object.freeze([
  "CurrentSnapshot",
  "PointInTimeSnapshot",
  "DecisionSnapshot",
  "OperationalSnapshot",
  "HistoricalSnapshot",
  "FrozenSnapshot",
] as const);

const HISTORY_EVENT_TYPES = Object.freeze([
  "Created",
  "Validated",
  "Stored",
  "Versioned",
  "Retrieved",
  "Archived",
  "Restored",
  "Frozen",
] as const);

const ARCHIVE_STATES = Object.freeze([
  "Active",
  "PendingArchive",
  "Archived",
  "RestorationPending",
  "Restored",
  "PermanentlyRetained",
  "Frozen",
] as const);

const RETENTION_POLICIES = Object.freeze([
  "TemporaryRetention",
  "OperationalRetention",
  "HistoricalRetention",
  "LegalRetention",
  "PermanentRetention",
  "FrozenRetention",
] as const);

const INDEX_DECLARATIONS = Object.freeze([
  "IdentityIndex",
  "ObjectTypeIndex",
  "RelationshipIndex",
  "TimeIndex",
  "VersionIndex",
  "SourceIndex",
  "OwnerIndex",
  "StatusIndex",
] as const);

const RETRIEVAL_DECLARATIONS = Object.freeze([
  "RetrieveByIdentity",
  "RetrieveByObjectType",
  "RetrieveByRelationship",
  "RetrieveByTime",
  "RetrieveByVersion",
  "RetrieveBySource",
  "RetrieveByOwner",
  "RetrieveByStatus",
] as const);

const FOUNDATION_CAPABILITY_NAMES = Object.freeze([
  "Repository Identity",
  "Repository Versioning",
  "Snapshot Support",
  "Archive Support",
  "History Support",
  "Metadata Management",
  "Retrieval Contract",
  "Repository Policies",
  "Lifecycle Management",
] as const);

const FOUNDATION_LIFECYCLE_STATES = Object.freeze([
  "Created",
  "Validated",
  "Stored",
  "Versioned",
  "Retrieved",
  "Archived",
  "Frozen",
] as const);

const FOUNDATION_POLICY_NAMES = Object.freeze([
  "Version Policy",
  "Snapshot Policy",
  "Archive Policy",
  "Retention Policy",
  "Metadata Policy",
  "Identity Policy",
] as const);

const PHYSICAL_STORAGE_PATTERNS = Object.freeze([
  /elasticsearch/i,
  /postgresql/i,
  /\bpostgres\b/i,
  /neo4j/i,
  /\bredis\b/i,
  /mongodb/i,
  /\bmysql\b/i,
  /\bsqlite\b/i,
  /\boracle\b/i,
  /\bdynamodb\b/i,
  /\bcassandra\b/i,
  /\bs3\b/i,
  /vector\s*db/i,
  /graph\s*db/i,
] as const);

const RUNTIME_IMPLEMENTATION_PATTERNS = Object.freeze([
  /\badapter\s*[:=]/i,
  /\bhandler\s*[:=]/i,
  /\bexecutor\s*[:=]/i,
  /\bcallback\s*[:=]/i,
  /createConnection\s*\(/i,
  /executeQuery\s*\(/i,
  /fetch\s*\(/i,
  /axios\./i,
  /localStorage/i,
  /indexedDB/i,
] as const);

function collectEntries(): readonly KnowledgeRepositoryRegistryEntry[] {
  return Object.freeze([
    ...KnowledgeRepositoryRegistry.repositoryTypes,
    ...KnowledgeRepositoryRegistry.components,
    ...KnowledgeRepositoryRegistry.knowledgeRecordTypes,
    ...KnowledgeRepositoryRegistry.versionTypes,
    ...KnowledgeRepositoryRegistry.snapshotTypes,
    ...KnowledgeRepositoryRegistry.historyEventTypes,
    ...KnowledgeRepositoryRegistry.archiveStates,
    ...KnowledgeRepositoryRegistry.retentionPolicies,
    ...KnowledgeRepositoryRegistry.indexDeclarations,
    ...KnowledgeRepositoryRegistry.retrievalDeclarations,
    ...KnowledgeRepositoryRegistry.capabilities,
    ...KnowledgeRepositoryRegistry.contracts,
    ...KnowledgeRepositoryRegistry.lifecycle,
    ...KnowledgeRepositoryRegistry.policies,
  ]);
}

function namesOf(
  entries: readonly { readonly name: string }[],
): readonly string[] {
  return entries.map((entry) => entry.name);
}

describe("DKL-6:2 Knowledge Repository Registry", () => {
  it("exposes exactly eight public exports", () => {
    const exported = Object.keys(RegistryModule).sort();
    assert.deepEqual(exported, [...REQUIRED_PUBLIC_EXPORTS].sort());
    assert.equal(exported.length, 8);
  });

  it("has canonical registry identity", () => {
    assert.equal(
      KnowledgeRepositoryRegistryId,
      "DKL-6:2/KnowledgeRepositoryRegistry",
    );
    assert.equal(
      KnowledgeRepositoryRegistry.identity.registryId,
      KnowledgeRepositoryRegistryId,
    );
    assert.equal(
      KnowledgeRepositoryRegistryName,
      "Knowledge Repository Registry",
    );
    assert.equal(
      KnowledgeRepositoryRegistry.identity.registryName,
      KnowledgeRepositoryRegistryName,
    );
    assert.equal(KnowledgeRepositoryRegistry.identity.phase, "DKL-6:2");
    assert.equal(KnowledgeRepositoryRegistry.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryRegistryVersion, "1.0.0");
    assert.equal(
      KnowledgeRepositoryRegistry.identity.registryVersion,
      "1.0.0",
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryRegistryNamespace,
      "nexora.dkl.repository.registry",
    );
    assert.equal(
      KnowledgeRepositoryRegistry.identity.registryNamespace,
      KnowledgeRepositoryRegistryNamespace,
    );
  });

  it("has Registered status", () => {
    assert.equal(KnowledgeRepositoryRegistryStatus, "Registered");
    assert.equal(
      KnowledgeRepositoryRegistry.identity.status,
      "Registered",
    );
  });

  it("depends solely on DKL-6:1 Foundation public surface", () => {
    assert.equal(
      KnowledgeRepositoryRegistry.foundation.foundationId,
      KnowledgeRepositoryFoundationId,
    );
    assert.equal(
      KnowledgeRepositoryRegistry.foundation.foundationVersion,
      KnowledgeRepositoryFoundationVersion,
    );
    assert.equal(
      KnowledgeRepositoryRegistry.foundation.soleArchitecturalDependency,
      true,
    );
    assert.equal(
      KnowledgeRepositoryRegistry.foundation.referencedThroughPublicFoundation,
      true,
    );
    assert.equal(
      KnowledgeRepositoryRegistry.ownership,
      KnowledgeRepositoryFoundation.ownership,
    );
    assert.equal(
      KnowledgeRepositoryRegistry.boundaries,
      KnowledgeRepositoryFoundation.boundaries,
    );

    const source = readFileSync(
      join(HERE, "knowledgeRepositoryRegistry.ts"),
      "utf8",
    );
    assert.match(source, /from "\.\/knowledgeRepositoryFoundation\.ts"/);
    assert.doesNotMatch(source, /knowledgeValidationPublicIndex/);
    assert.doesNotMatch(source, /knowledgeRepositoryBoundaries/);
    assert.doesNotMatch(source, /knowledgeRepositoryContracts/);
    assert.doesNotMatch(source, /knowledgeRepositoryLifecycle/);
    assert.doesNotMatch(source, /knowledgeRepositoryOwnership/);
    assert.doesNotMatch(source, /knowledgeRepositoryPolicies/);
    assert.doesNotMatch(source, /knowledgeRepositoryFoundationTypes/);
  });

  it("registers all required repository types", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.repositoryTypes),
      [...REPOSITORY_TYPES],
    );
    assert.equal(KnowledgeRepositoryRegistry.repositoryTypes.length, 7);
  });

  it("registers all required components", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.components),
      [...COMPONENTS],
    );
    assert.equal(KnowledgeRepositoryRegistry.components.length, 10);
    for (const component of KnowledgeRepositoryRegistry.components) {
      assert.ok(typeof component.category === "string");
      assert.ok(component.category.length > 0);
      assert.ok(typeof component.responsibility === "string");
      assert.ok(component.responsibility.length > 0);
      assert.equal(component.runtimeBehavior, "None");
      assert.equal(component.status, "Registered");
      assert.equal(component.owner, "DKL-6");
    }
  });

  it("registers all required knowledge record types", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.knowledgeRecordTypes),
      [...KNOWLEDGE_RECORD_TYPES],
    );
    assert.equal(KnowledgeRepositoryRegistry.knowledgeRecordTypes.length, 7);
  });

  it("registers all required version types", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.versionTypes),
      [...VERSION_TYPES],
    );
    assert.equal(KnowledgeRepositoryRegistry.versionTypes.length, 6);
  });

  it("registers all required snapshot types", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.snapshotTypes),
      [...SNAPSHOT_TYPES],
    );
    assert.equal(KnowledgeRepositoryRegistry.snapshotTypes.length, 6);
  });

  it("registers all required history event types", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.historyEventTypes),
      [...HISTORY_EVENT_TYPES],
    );
    assert.equal(KnowledgeRepositoryRegistry.historyEventTypes.length, 8);
  });

  it("registers all required archive states", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.archiveStates),
      [...ARCHIVE_STATES],
    );
    assert.equal(KnowledgeRepositoryRegistry.archiveStates.length, 7);
  });

  it("registers all required retention policies", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.retentionPolicies),
      [...RETENTION_POLICIES],
    );
    assert.equal(KnowledgeRepositoryRegistry.retentionPolicies.length, 6);
  });

  it("registers all required index declarations", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.indexDeclarations),
      [...INDEX_DECLARATIONS],
    );
    assert.equal(KnowledgeRepositoryRegistry.indexDeclarations.length, 8);
  });

  it("registers all required retrieval declarations", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.retrievalDeclarations),
      [...RETRIEVAL_DECLARATIONS],
    );
    assert.equal(KnowledgeRepositoryRegistry.retrievalDeclarations.length, 8);
  });

  it("registers Foundation capabilities", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.capabilities),
      [...FOUNDATION_CAPABILITY_NAMES],
    );
    assert.equal(
      KnowledgeRepositoryRegistry.capabilities.length,
      KnowledgeRepositoryFoundation.contracts.capabilityCount,
    );
    assert.equal(KnowledgeRepositoryRegistry.capabilities.length, 9);
  });

  it("registers Foundation contracts", () => {
    assert.equal(
      KnowledgeRepositoryRegistry.contracts.length,
      KnowledgeRepositoryFoundation.contracts.contractCount,
    );
    assert.equal(KnowledgeRepositoryRegistry.contracts.length, 8);
    const foundationContractIds =
      KnowledgeRepositoryFoundation.contracts.contracts.map((c) => c.contractId);
    for (const contract of KnowledgeRepositoryRegistry.contracts) {
      assert.ok(foundationContractIds.includes(contract.foundationReference));
    }
  });

  it("registers Foundation lifecycle states", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.lifecycle),
      [...FOUNDATION_LIFECYCLE_STATES],
    );
    assert.equal(
      KnowledgeRepositoryRegistry.lifecycle.length,
      KnowledgeRepositoryFoundation.lifecycle.stateCount,
    );
    assert.equal(KnowledgeRepositoryRegistry.lifecycle.length, 7);
  });

  it("registers Foundation policies", () => {
    assert.deepEqual(
      namesOf(KnowledgeRepositoryRegistry.policies),
      [...FOUNDATION_POLICY_NAMES],
    );
    assert.equal(
      KnowledgeRepositoryRegistry.policies.length,
      KnowledgeRepositoryFoundation.policies.policyCount,
    );
    assert.equal(KnowledgeRepositoryRegistry.policies.length, 6);
  });

  it("ensures every registry entry belongs to DKL-6 with Registered/None", () => {
    const entries = collectEntries();
    assert.ok(entries.length > 0);
    for (const entry of entries) {
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.status, "Registered");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("ensures registry entry IDs are unique", () => {
    const entries = collectEntries();
    const ids = entries.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("returns a deterministic entry count derived from registry contents", () => {
    const count = getKnowledgeRepositoryRegistryEntryCount();
    const again = getKnowledgeRepositoryRegistryEntryCount();
    assert.equal(count, again);
    assert.equal(count, collectEntries().length);
    assert.equal(count, 103);
  });

  it("returns a summary whose counts match registry contents", () => {
    const summary = getKnowledgeRepositoryRegistrySummary();
    const again = getKnowledgeRepositoryRegistrySummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.registryId, KnowledgeRepositoryRegistryId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.namespace, KnowledgeRepositoryRegistryNamespace);
    assert.equal(summary.status, "Registered");
    assert.equal(summary.foundationDependencyId, KnowledgeRepositoryFoundationId);
    assert.equal(
      summary.foundationDependencyVersion,
      KnowledgeRepositoryFoundationVersion,
    );
    assert.equal(summary.registryGroupCount, 16);
    assert.equal(summary.totalEntryCount, getKnowledgeRepositoryRegistryEntryCount());
    assert.equal(
      summary.repositoryTypeCount,
      KnowledgeRepositoryRegistry.repositoryTypes.length,
    );
    assert.equal(
      summary.componentCount,
      KnowledgeRepositoryRegistry.components.length,
    );
    assert.equal(
      summary.knowledgeRecordTypeCount,
      KnowledgeRepositoryRegistry.knowledgeRecordTypes.length,
    );
    assert.equal(
      summary.versionTypeCount,
      KnowledgeRepositoryRegistry.versionTypes.length,
    );
    assert.equal(
      summary.snapshotTypeCount,
      KnowledgeRepositoryRegistry.snapshotTypes.length,
    );
    assert.equal(
      summary.historyEventTypeCount,
      KnowledgeRepositoryRegistry.historyEventTypes.length,
    );
    assert.equal(
      summary.archiveStateCount,
      KnowledgeRepositoryRegistry.archiveStates.length,
    );
    assert.equal(
      summary.retentionPolicyCount,
      KnowledgeRepositoryRegistry.retentionPolicies.length,
    );
    assert.equal(
      summary.indexDeclarationCount,
      KnowledgeRepositoryRegistry.indexDeclarations.length,
    );
    assert.equal(
      summary.retrievalDeclarationCount,
      KnowledgeRepositoryRegistry.retrievalDeclarations.length,
    );
    assert.equal(
      summary.capabilityCount,
      KnowledgeRepositoryRegistry.capabilities.length,
    );
    assert.equal(
      summary.contractCount,
      KnowledgeRepositoryRegistry.contracts.length,
    );
    assert.equal(
      summary.lifecycleCount,
      KnowledgeRepositoryRegistry.lifecycle.length,
    );
    assert.equal(summary.policyCount, KnowledgeRepositoryRegistry.policies.length);
    assert.equal(Object.isFrozen(summary), true);
  });

  it("has readiness ReadyForDKL6Model", () => {
    assert.equal(
      KnowledgeRepositoryRegistry.identity.readiness,
      "ReadyForDKL6Model",
    );
    assert.equal(
      getKnowledgeRepositoryRegistrySummary().readiness,
      "ReadyForDKL6Model",
    );
  });

  it("freezes all public structures", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry.identity), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry.repositoryTypes), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry.components), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry.foundation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry.guarantees), true);
    for (const entry of collectEntries()) {
      assert.equal(Object.isFrozen(entry), true);
    }
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryRegistry.identity.status = "Mutated";
    });
  });

  it("contains no physical storage technology references", () => {
    const sources = DKL62_FILES.filter((file) => !file.endsWith(".test.ts")).map(
      (file) => readFileSync(join(HERE, file), "utf8"),
    );
    const combined = sources.join("\n");
    for (const pattern of PHYSICAL_STORAGE_PATTERNS) {
      assert.equal(
        pattern.test(combined),
        false,
        `Forbidden physical storage pattern matched: ${pattern}`,
      );
    }
  });

  it("contains no runtime functions, adapters, handlers, or executors", () => {
    const sources = DKL62_FILES.filter((file) => !file.endsWith(".test.ts")).map(
      (file) => readFileSync(join(HERE, file), "utf8"),
    );
    const combined = sources.join("\n");
    for (const pattern of RUNTIME_IMPLEMENTATION_PATTERNS) {
      assert.equal(
        pattern.test(combined),
        false,
        `Forbidden runtime pattern matched: ${pattern}`,
      );
    }
    assert.equal(KnowledgeRepositoryRegistry.guarantees.noRepositoryRuntime, true);
    assert.equal(KnowledgeRepositoryRegistry.guarantees.noPersistence, true);
    assert.equal(
      KnowledgeRepositoryRegistry.guarantees.runtimeBehaviorNone,
      true,
    );
  });

  it("creates exactly the eight required DKL-6:2 files", () => {
    for (const file of DKL62_FILES) {
      assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
    }
    const registryPhaseFiles = readdirSync(HERE).filter((file) =>
      /^(knowledgeRepository(RegistryTypes|TypeRegistry|ComponentRegistry|VersionRegistry|SnapshotRegistry|PolicyRegistry|Registry(\.test)?))\.ts$/.test(
        file,
      ),
    );
    assert.deepEqual(registryPhaseFiles.sort(), [...DKL62_FILES].sort());
  });

  it("routes Foundation access through the public foundation surface only", () => {
    const policySource = readFileSync(
      join(HERE, "knowledgeRepositoryPolicyRegistry.ts"),
      "utf8",
    );
    assert.match(policySource, /from "\.\/knowledgeRepositoryFoundation\.ts"/);
    assert.doesNotMatch(policySource, /knowledgeValidation/);
    assert.doesNotMatch(policySource, /knowledgeRepositoryBoundaries/);
    assert.doesNotMatch(policySource, /knowledgeRepositoryContracts/);
    assert.doesNotMatch(policySource, /knowledgeRepositoryLifecycle/);
    assert.doesNotMatch(policySource, /knowledgeRepositoryOwnership/);
    assert.doesNotMatch(policySource, /knowledgeRepositoryPolicies\.ts/);
    assert.doesNotMatch(policySource, /knowledgeRepositoryFoundationTypes/);
  });
});
