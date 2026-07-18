/**
 * DKL-6:3 — Knowledge Repository Model Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Model.
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
} from "./knowledgeRepositoryFoundation.ts";
import * as ModelModule from "./knowledgeRepositoryModel.ts";
import {
  getKnowledgeRepositoryModelCount,
  getKnowledgeRepositoryModelSummary,
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
  KnowledgeRepositoryModelName,
  KnowledgeRepositoryModelNamespace,
  KnowledgeRepositoryModelStatus,
  KnowledgeRepositoryModelVersion,
} from "./knowledgeRepositoryModel.ts";
import type { KnowledgeRepositoryModelDescriptor } from "./knowledgeRepositoryModelTypes.ts";
import {
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
} from "./knowledgeRepositoryRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryModel",
  "KnowledgeRepositoryModelId",
  "KnowledgeRepositoryModelVersion",
  "KnowledgeRepositoryModelName",
  "KnowledgeRepositoryModelNamespace",
  "KnowledgeRepositoryModelStatus",
  "getKnowledgeRepositoryModelSummary",
  "getKnowledgeRepositoryModelCount",
] as const);

const DKL63_FILES = Object.freeze([
  "knowledgeRepositoryModelTypes.ts",
  "knowledgeRepositoryRecordModels.ts",
  "knowledgeRepositoryVersionModels.ts",
  "knowledgeRepositorySnapshotModels.ts",
  "knowledgeRepositoryHistoryModels.ts",
  "knowledgeRepositoryPolicyModels.ts",
  "knowledgeRepositoryModel.ts",
  "knowledgeRepositoryModel.test.ts",
] as const);

const RECORD_MODELS = Object.freeze([
  "KnowledgeObjectRecordModel",
  "BusinessObjectRecordModel",
  "RelationshipRecordModel",
  "EvidenceRecordModel",
  "ValidationRecordModel",
  "DecisionContextRecordModel",
  "RepositoryMetadataRecordModel",
] as const);

const VERSION_MODELS = Object.freeze([
  "InitialVersionModel",
  "RevisionVersionModel",
  "CorrectionVersionModel",
  "SupersededVersionModel",
  "HistoricalVersionModel",
  "FrozenVersionModel",
] as const);

const SNAPSHOT_MODELS = Object.freeze([
  "CurrentSnapshotModel",
  "PointInTimeSnapshotModel",
  "DecisionSnapshotModel",
  "OperationalSnapshotModel",
  "HistoricalSnapshotModel",
  "FrozenSnapshotModel",
] as const);

const HISTORY_MODELS = Object.freeze([
  "CreatedHistoryEventModel",
  "ValidatedHistoryEventModel",
  "StoredHistoryEventModel",
  "VersionedHistoryEventModel",
  "RetrievedHistoryEventModel",
  "ArchivedHistoryEventModel",
  "RestoredHistoryEventModel",
  "FrozenHistoryEventModel",
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

const RETENTION_MODELS = Object.freeze([
  "TemporaryRetentionModel",
  "OperationalRetentionModel",
  "HistoricalRetentionModel",
  "LegalRetentionModel",
  "PermanentRetentionModel",
  "FrozenRetentionModel",
] as const);

const INDEX_MODELS = Object.freeze([
  "IdentityIndexModel",
  "ObjectTypeIndexModel",
  "RelationshipIndexModel",
  "TimeIndexModel",
  "VersionIndexModel",
  "SourceIndexModel",
  "OwnerIndexModel",
  "StatusIndexModel",
] as const);

const RETRIEVAL_MODELS = Object.freeze([
  "RetrieveByIdentityModel",
  "RetrieveByObjectTypeModel",
  "RetrieveByRelationshipModel",
  "RetrieveByTimeModel",
  "RetrieveByVersionModel",
  "RetrieveBySourceModel",
  "RetrieveByOwnerModel",
  "RetrieveByStatusModel",
] as const);

const RELATIONSHIP_TYPES = Object.freeze([
  "RepositoryContainsRecord",
  "RecordHasVersion",
  "RecordIncludedInSnapshot",
  "RecordProducesHistory",
  "RecordHasMetadata",
  "RecordHasArchiveState",
  "RecordUsesRetentionPolicy",
  "RecordDeclaredByIndex",
  "RecordAccessibleByRetrieval",
  "RelationshipConnectsRecords",
  "EvidenceSupportsRecord",
  "ValidationQualifiesRecord",
  "DecisionContextReferencesKnowledge",
] as const);

const FOUNDATION_LIFECYCLE = Object.freeze([
  "Created",
  "Validated",
  "Stored",
  "Versioned",
  "Retrieved",
  "Archived",
  "Frozen",
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
  /\bdynamodb\b/i,
  /vector\s*db/i,
  /graph\s*db/i,
] as const);

const RUNTIME_PATTERNS = Object.freeze([
  /\badapter\s*[:=]/i,
  /\bhandler\s*[:=]/i,
  /\bexecutor\s*[:=]/i,
  /\bcallback\s*[:=]/i,
  /createConnection\s*\(/i,
  /executeQuery\s*\(/i,
  /localStorage/i,
  /indexedDB/i,
  /Date\.now\s*\(/,
  /Math\.random\s*\(/,
  /new Date\s*\(/,
] as const);

const PERSISTENCE_PATTERNS = Object.freeze([
  /connectionString/i,
  /databaseUrl/i,
  /ormConfig/i,
  /persistenceConfig/i,
  /storageAdapter/i,
  /cacheConfig/i,
] as const);

function namesOf(
  models: readonly KnowledgeRepositoryModelDescriptor[],
): readonly string[] {
  return models.map((model) => model.modelName);
}

function collectModels(): readonly KnowledgeRepositoryModelDescriptor[] {
  return Object.freeze([
    KnowledgeRepositoryModel.repository.identityModel,
    KnowledgeRepositoryModel.repository.aggregate,
    ...KnowledgeRepositoryModel.recordModels,
    ...KnowledgeRepositoryModel.versionModels,
    ...KnowledgeRepositoryModel.snapshotModels,
    ...KnowledgeRepositoryModel.historyModels,
    KnowledgeRepositoryModel.archiveModel.model,
    ...KnowledgeRepositoryModel.retentionModels,
    ...KnowledgeRepositoryModel.indexModels,
    ...KnowledgeRepositoryModel.retrievalModels,
  ]);
}

function readPhaseSources(): string {
  return DKL63_FILES.filter((file) => !file.endsWith(".test.ts"))
    .map((file) => readFileSync(join(HERE, file), "utf8"))
    .join("\n");
}

describe("DKL-6:3 Knowledge Repository Model", () => {
  it("exposes exactly eight public exports", () => {
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity", () => {
    assert.equal(
      KnowledgeRepositoryModelId,
      "DKL-6:3/KnowledgeRepositoryModel",
    );
    assert.equal(
      KnowledgeRepositoryModel.identity.modelId,
      KnowledgeRepositoryModelId,
    );
    assert.equal(KnowledgeRepositoryModel.identity.phase, "DKL-6:3");
    assert.equal(KnowledgeRepositoryModel.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryModelVersion, "1.0.0");
    assert.equal(KnowledgeRepositoryModel.identity.modelVersion, "1.0.0");
  });

  it("has correct name", () => {
    assert.equal(KnowledgeRepositoryModelName, "Knowledge Repository Model");
    assert.equal(
      KnowledgeRepositoryModel.identity.modelName,
      KnowledgeRepositoryModelName,
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryModelNamespace,
      "nexora.dkl.repository.model",
    );
    assert.equal(
      KnowledgeRepositoryModel.identity.modelNamespace,
      KnowledgeRepositoryModelNamespace,
    );
  });

  it("has Modeled status", () => {
    assert.equal(KnowledgeRepositoryModelStatus, "Modeled");
    assert.equal(KnowledgeRepositoryModel.identity.status, "Modeled");
  });

  it("has readiness ReadyForDKL6Validation", () => {
    assert.equal(
      KnowledgeRepositoryModel.readiness,
      "ReadyForDKL6Validation",
    );
    assert.equal(
      KnowledgeRepositoryModel.identity.readiness,
      "ReadyForDKL6Validation",
    );
  });

  it("consumes DKL-6:1 Foundation through its public surface only", () => {
    assert.equal(
      KnowledgeRepositoryModel.dependencies.foundationId,
      KnowledgeRepositoryFoundationId,
    );
    assert.equal(
      KnowledgeRepositoryModel.ownership,
      KnowledgeRepositoryFoundation.ownership,
    );
    assert.equal(
      KnowledgeRepositoryModel.boundaries,
      KnowledgeRepositoryFoundation.boundaries,
    );
    const source = readFileSync(join(HERE, "knowledgeRepositoryModel.ts"), "utf8");
    assert.match(source, /from "\.\/knowledgeRepositoryFoundation\.ts"/);
    assert.doesNotMatch(source, /knowledgeRepositoryBoundaries/);
    assert.doesNotMatch(source, /knowledgeRepositoryContracts/);
    assert.doesNotMatch(source, /knowledgeRepositoryLifecycle/);
    assert.doesNotMatch(source, /knowledgeRepositoryOwnership/);
    assert.doesNotMatch(source, /knowledgeRepositoryPolicies\.ts/);
    assert.doesNotMatch(source, /knowledgeRepositoryFoundationTypes/);
    assert.doesNotMatch(source, /knowledgeValidation/);
  });

  it("consumes DKL-6:2 Registry through its public surface only", () => {
    assert.equal(
      KnowledgeRepositoryModel.dependencies.registryId,
      KnowledgeRepositoryRegistryId,
    );
    assert.equal(
      KnowledgeRepositoryModel.dependencies.consumesPublicSurfacesOnly,
      true,
    );
    const sources = readPhaseSources();
    assert.match(sources, /from "\.\/knowledgeRepositoryRegistry\.ts"/);
    assert.doesNotMatch(sources, /knowledgeRepositoryTypeRegistry/);
    assert.doesNotMatch(sources, /knowledgeRepositoryComponentRegistry/);
    assert.doesNotMatch(sources, /knowledgeRepositoryVersionRegistry/);
    assert.doesNotMatch(sources, /knowledgeRepositorySnapshotRegistry/);
    assert.doesNotMatch(sources, /knowledgeRepositoryPolicyRegistry/);
    assert.doesNotMatch(sources, /knowledgeRepositoryRegistryTypes/);
  });

  it("defines all seven knowledge record models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.recordModels), [
      ...RECORD_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.recordModels.length, 7);
  });

  it("defines all six version models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.versionModels), [
      ...VERSION_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.versionModels.length, 6);
  });

  it("defines all six snapshot models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.snapshotModels), [
      ...SNAPSHOT_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.snapshotModels.length, 6);
  });

  it("defines all eight history models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.historyModels), [
      ...HISTORY_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.historyModels.length, 8);
  });

  it("defines the archive model", () => {
    assert.equal(
      KnowledgeRepositoryModel.archiveModel.model.modelName,
      "KnowledgeRepositoryArchiveModel",
    );
    assert.equal(KnowledgeRepositoryModel.archiveModel.model.metadataOnly, true);
  });

  it("represents all seven archive states", () => {
    assert.deepEqual(
      [...KnowledgeRepositoryModel.archiveModel.supportedStates],
      [...ARCHIVE_STATES],
    );
    assert.deepEqual(
      KnowledgeRepositoryRegistry.archiveStates.map((entry) => entry.name),
      [...ARCHIVE_STATES],
    );
  });

  it("defines all six retention models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.retentionModels), [
      ...RETENTION_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.retentionModels.length, 6);
  });

  it("defines all eight index declaration models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.indexModels), [
      ...INDEX_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.indexModels.length, 8);
  });

  it("defines all eight retrieval declaration models", () => {
    assert.deepEqual(namesOf(KnowledgeRepositoryModel.retrievalModels), [
      ...RETRIEVAL_MODELS,
    ]);
    assert.equal(KnowledgeRepositoryModel.retrievalModels.length, 8);
  });

  it("defines all thirteen required relationships", () => {
    assert.equal(KnowledgeRepositoryModel.relationships.length, 13);
    assert.deepEqual(
      KnowledgeRepositoryModel.relationships.map((rel) => rel.relationshipType),
      [...RELATIONSHIP_TYPES],
    );
  });

  it("ensures every relationship has owner DKL-6 and runtime None", () => {
    for (const rel of KnowledgeRepositoryModel.relationships) {
      assert.equal(rel.owner, "DKL-6");
      assert.equal(rel.runtimeBehavior, "None");
      assert.equal(rel.status, "Modeled");
    }
  });

  it("preserves Foundation lifecycle states", () => {
    assert.deepEqual(
      [...KnowledgeRepositoryModel.lifecycle.states],
      [...FOUNDATION_LIFECYCLE],
    );
    assert.equal(KnowledgeRepositoryModel.lifecycle.executableTransitions, false);
    assert.equal(
      KnowledgeRepositoryModel.lifecycle.stateCount,
      KnowledgeRepositoryFoundation.lifecycle.stateCount,
    );
  });

  it("exposes complete registry traceability", () => {
    assert.equal(KnowledgeRepositoryModel.registryTraceability.length, 14);
    for (const entry of KnowledgeRepositoryModel.registryTraceability) {
      assert.equal(entry.modeled, true);
      assert.ok(entry.entryCount > 0);
    }
    const groups = KnowledgeRepositoryModel.registryTraceability.map(
      (entry) => entry.group,
    );
    assert.ok(groups.includes("RepositoryTypes"));
    assert.ok(groups.includes("KnowledgeRecordTypes"));
    assert.ok(groups.includes("FoundationCapabilities"));
    assert.ok(groups.includes("FoundationContracts"));
    assert.ok(groups.includes("FoundationLifecycle"));
    assert.ok(groups.includes("FoundationPolicies"));
  });

  it("ensures model names are unique", () => {
    const names = collectModels().map((model) => model.modelName);
    assert.equal(new Set(names).size, names.length);
  });

  it("ensures model identities are unique", () => {
    const ids = collectModels().map((model) => model.modelId);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("returns a deterministic model count derived from inventories", () => {
    const count = getKnowledgeRepositoryModelCount();
    assert.equal(count, getKnowledgeRepositoryModelCount());
    assert.equal(count, collectModels().length);
    assert.equal(count, 52);
  });

  it("returns a summary whose counts match inventories", () => {
    const summary = getKnowledgeRepositoryModelSummary();
    assert.deepEqual(summary, getKnowledgeRepositoryModelSummary());
    assert.equal(summary.modelId, KnowledgeRepositoryModelId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.name, KnowledgeRepositoryModelName);
    assert.equal(summary.namespace, KnowledgeRepositoryModelNamespace);
    assert.equal(summary.status, "Modeled");
    assert.equal(summary.foundationDependencyId, KnowledgeRepositoryFoundationId);
    assert.equal(summary.registryDependencyId, KnowledgeRepositoryRegistryId);
    assert.equal(summary.repositoryAggregateCount, 1);
    assert.equal(summary.recordModelCount, 7);
    assert.equal(summary.versionModelCount, 6);
    assert.equal(summary.snapshotModelCount, 6);
    assert.equal(summary.historyModelCount, 8);
    assert.equal(summary.archiveModelCount, 1);
    assert.equal(summary.retentionModelCount, 6);
    assert.equal(summary.indexModelCount, 8);
    assert.equal(summary.retrievalModelCount, 8);
    assert.equal(summary.relationshipCount, 13);
    assert.equal(summary.lifecycleCount, 7);
    assert.equal(summary.registryTraceabilityCount, 14);
    assert.equal(summary.totalModelCount, getKnowledgeRepositoryModelCount());
    assert.equal(summary.readiness, "ReadyForDKL6Validation");
    assert.equal(Object.isFrozen(summary), true);
  });

  it("marks every model as metadata-only with runtime None", () => {
    for (const model of collectModels()) {
      assert.equal(model.metadataOnly, true);
      assert.equal(model.runtimeBehavior, "None");
      assert.equal(model.owner, "DKL-6");
      assert.equal(model.status, "Modeled");
      assert.ok(model.fields.length > 0);
      assert.ok(model.registryEntryReference.length > 0);
    }
  });

  it("freezes all public structures", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel.identity), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel.repository), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel.recordModels), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel.relationships), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel.lifecycle), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryModel.identity.status = "Mutated";
    });
  });

  it("freezes nested structures", () => {
    for (const model of collectModels()) {
      assert.equal(Object.isFrozen(model), true);
      assert.equal(Object.isFrozen(model.fields), true);
    }
    for (const rel of KnowledgeRepositoryModel.relationships) {
      assert.equal(Object.isFrozen(rel), true);
    }
    for (const entry of KnowledgeRepositoryModel.registryTraceability) {
      assert.equal(Object.isFrozen(entry), true);
    }
    assert.equal(
      Object.isFrozen(KnowledgeRepositoryModel.archiveModel.supportedStates),
      true,
    );
  });

  it("contains no runtime functions inside models", () => {
    for (const model of collectModels()) {
      const values = Object.values(model);
      for (const value of values) {
        assert.notEqual(typeof value, "function");
      }
    }
    for (const rel of KnowledgeRepositoryModel.relationships) {
      for (const value of Object.values(rel)) {
        assert.notEqual(typeof value, "function");
      }
    }
  });

  it("contains no physical storage technology references", () => {
    const combined = readPhaseSources();
    for (const pattern of PHYSICAL_STORAGE_PATTERNS) {
      assert.equal(
        pattern.test(combined),
        false,
        `Forbidden storage pattern: ${pattern}`,
      );
    }
  });

  it("contains no query execution", () => {
    const combined = readPhaseSources();
    assert.doesNotMatch(combined, /executeQuery/);
    assert.doesNotMatch(combined, /SELECT\s+/);
    assert.doesNotMatch(combined, /CREATE\s+INDEX/i);
    assert.equal(KnowledgeRepositoryModel.guarantees.noQueryExecution, true);
    assert.equal(KnowledgeRepositoryModel.guarantees.noRetrievalExecution, true);
  });

  it("contains no persistence configuration", () => {
    const combined = readPhaseSources();
    for (const pattern of PERSISTENCE_PATTERNS) {
      assert.equal(
        pattern.test(combined),
        false,
        `Forbidden persistence pattern: ${pattern}`,
      );
    }
    assert.equal(KnowledgeRepositoryModel.guarantees.noPersistence, true);
  });

  it("contains no environment-dependent values", () => {
    const combined = readPhaseSources();
    for (const pattern of RUNTIME_PATTERNS) {
      assert.equal(
        pattern.test(combined),
        false,
        `Forbidden runtime/environment pattern: ${pattern}`,
      );
    }
  });

  it("contains no mutation APIs", () => {
    assert.equal(KnowledgeRepositoryModel.guarantees.noMutationApis, true);
    assert.equal(
      "register" in KnowledgeRepositoryModel ||
        "update" in KnowledgeRepositoryModel ||
        "delete" in KnowledgeRepositoryModel,
      false,
    );
    const combined = readPhaseSources();
    assert.doesNotMatch(combined, /export function (register|update|delete|mutate)/);
  });

  it("creates exactly the eight required DKL-6:3 files", () => {
    for (const file of DKL63_FILES) {
      assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
    }
    const modelPhaseFiles = readdirSync(HERE).filter((file) =>
      /^(knowledgeRepository(ModelTypes|RecordModels|VersionModels|SnapshotModels|HistoryModels|PolicyModels|Model(\.test)?))\.ts$/.test(
        file,
      ),
    );
    assert.deepEqual(modelPhaseFiles.sort(), [...DKL63_FILES].sort());
  });
});
