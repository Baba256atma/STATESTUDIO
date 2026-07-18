/**
 * DKL-6:4 — Knowledge Repository Boundary Validation.
 *
 * Exactly four boundary integrity rules. Metadata evaluation only.
 *
 * Ownership: owned exclusively by DKL-6:4.
 */

import { KnowledgeRepositoryFoundation } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryModel } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type { KnowledgeRepositoryValidationRule } from "./knowledgeRepositoryValidationTypes.ts";

const rule = (
  id: string,
  name: string,
  description: string,
  subjectReference: string,
  expected: string,
  actual: string,
  status: KnowledgeRepositoryValidationRule["status"],
  severity: KnowledgeRepositoryValidationRule["severity"],
  deterministicOrder: number,
): KnowledgeRepositoryValidationRule =>
  Object.freeze({
    id,
    name,
    category: "Boundaries" as const,
    description,
    subjectReference,
    expected,
    actual,
    status,
    severity,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

const boundaries = KnowledgeRepositoryFoundation.boundaries;

const noPersistencePass =
  KnowledgeRepositoryFoundation.persistenceImplementation === false &&
  boundaries.persistenceImplementationExcluded === true &&
  KnowledgeRepositoryRegistry.guarantees.noPersistence === true &&
  KnowledgeRepositoryModel.guarantees.noPersistence === true;

const noDatabasePass =
  boundaries.accessesDatabase === false &&
  boundaries.implementsSql === false &&
  boundaries.implementsGraphDb === false &&
  boundaries.implementsVectorDb === false &&
  boundaries.implementsElasticsearch === false &&
  boundaries.implementsRedis === false &&
  boundaries.databaseCouplingExcluded === true &&
  KnowledgeRepositoryRegistry.guarantees.noPhysicalStorageTechnology === true;

const noQueryOrRetrievalPass =
  boundaries.executesQueries === false &&
  boundaries.performsIndexing === false &&
  boundaries.implementsSearchAlgorithms === false &&
  KnowledgeRepositoryModel.guarantees.noQueryExecution === true &&
  KnowledgeRepositoryModel.guarantees.noIndexConstruction === true &&
  KnowledgeRepositoryModel.guarantees.noRetrievalExecution === true;

const noExternalIoPass =
  boundaries.accessesNetwork === false &&
  boundaries.accessesApis === false &&
  boundaries.accessesFileSystem === false &&
  boundaries.accessesCache === false &&
  boundaries.accessesExternalServices === false &&
  boundaries.performsHttp === false &&
  boundaries.performsIo === false &&
  boundaries.neverAccesses.length === 6;

/** Exactly four Boundary validation rules. */
export const KnowledgeRepositoryBoundaryValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-BND-001",
      "No Persistence Boundary Breach",
      "No persistence implementation exists across Foundation, Registry, and Model.",
      boundaries.boundariesId,
      "persistence-excluded",
      noPersistencePass ? "persistence-excluded" : "persistence-present",
      noPersistencePass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-BND-002",
      "No Database Boundary Breach",
      "No physical database technology is declared.",
      boundaries.boundariesId,
      "database-excluded",
      noDatabasePass ? "database-excluded" : "database-declared",
      noDatabasePass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-BND-003",
      "No Query or Retrieval Execution",
      "No query, search, indexing, or retrieval execution exists.",
      boundaries.boundariesId,
      "execution-excluded",
      noQueryOrRetrievalPass ? "execution-excluded" : "execution-present",
      noQueryOrRetrievalPass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
    rule(
      "DKL6-VAL-BND-004",
      "No External IO",
      "No network, filesystem, HTTP, cache, external API, or service access exists.",
      boundaries.boundariesId,
      "external-io-excluded",
      noExternalIoPass ? "external-io-excluded" : "external-io-present",
      noExternalIoPass ? "Pass" : "Fail",
      "Critical",
      4,
    ),
  ]);

/** Boundary validation section. */
export const KnowledgeRepositoryBoundaryValidation = Object.freeze({
  category: "Boundaries" as const,
  rules: KnowledgeRepositoryBoundaryValidationRules,
  ruleCount: KnowledgeRepositoryBoundaryValidationRules.length,
  passedRuleCount: KnowledgeRepositoryBoundaryValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: KnowledgeRepositoryBoundaryValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});
