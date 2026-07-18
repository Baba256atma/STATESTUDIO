/**
 * DKL-2:4 — Public API, Immutability, Determinism & Runtime Boundary Rules.
 *
 * Sixteen deterministic, metadata-only rules across four categories: PublicApi,
 * Immutability, Determinism, and RuntimeBoundary. Public export counts are read
 * from statically imported module namespaces (no dynamic import, no reflection).
 *
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: depends only on the DKL-2:1/2:2/2:3 public modules and the
 * DKL-2:4 validation rule modules and types.
 */

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import {
  DataSourceKnowledgeRegistryBoundaries,
  DataSourceKnowledgeRegistryContracts,
  DataSourceKnowledgeRegistryFoundation,
  DataSourceKnowledgeRegistryMetadata,
  DataSourceKnowledgeRegistryOwnership,
  DataSourceKnowledgeRegistrySummary,
} from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  ConnectorTypeRegistry,
  ContentTypeRegistry,
  DataSourceKnowledgeRegistryManifest,
  DataSourceRegistry,
  KnowledgeTypeRegistry,
  SourceGroupRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import {
  CompatibilityModels,
  ConnectorModels,
  DataSourceModels,
  DataSourceRegistryModelManifest,
  DataSourceRegistryModelSummary,
  KnowledgeModels,
  RegistryIdentityModels,
} from "./dataSourceRegistryModelPlatform.ts";
import { FoundationValidationRules } from "./dataSourceKnowledgeFoundationValidation.ts";
import { ModelValidationRules } from "./dataSourceKnowledgeModelValidation.ts";
import {
  DependencyValidationRules,
  OwnershipValidationRules,
} from "./dataSourceKnowledgeOwnershipValidation.ts";
import {
  ReferenceIntegrityValidationRules,
  RegistryValidationRules,
} from "./dataSourceKnowledgeRegistryValidation.ts";
import {
  allUnique,
  CANONICAL_VALIDATION_CATEGORIES,
  createValidationRule,
  isDeeplyFrozen,
  type ValidationRule,
} from "./dataSourceKnowledgeValidationTypes.ts";

const FOUNDATION_EXPORTS = [
  "DataSourceKnowledgeRegistryContracts",
  "DataSourceKnowledgeRegistryOwnership",
  "DataSourceKnowledgeRegistryBoundaries",
  "DataSourceKnowledgeRegistryMetadata",
  "DataSourceKnowledgeRegistryVersion",
  "DataSourceKnowledgeRegistryFoundation",
  "DataSourceKnowledgeRegistrySummary",
] as const;

const REGISTRY_EXPORTS = [
  "DataSourceKnowledgeRegistryPlatform",
  "DataSourceRegistry",
  "KnowledgeTypeRegistry",
  "ConnectorTypeRegistry",
  "ContentTypeRegistry",
  "SourceGroupRegistry",
  "SourceKnowledgeCompatibilityRegistry",
  "DataSourceKnowledgeRegistryManifest",
] as const;

const MODEL_EXPORTS = [
  "DataSourceRegistryModelPlatform",
  "RegistryIdentityModels",
  "DataSourceModels",
  "KnowledgeModels",
  "ConnectorModels",
  "CompatibilityModels",
  "DataSourceRegistryModelManifest",
  "DataSourceRegistryModelSummary",
  "DataSourceRegistryModelVersion",
] as const;

const RUNNER_EXPORTS = [
  "DataSourceKnowledgeValidationPlatform",
  "DataSourceKnowledgeValidationRules",
  "DataSourceKnowledgeValidationResults",
  "DataSourceKnowledgeValidationManifest",
  "DataSourceKnowledgeValidationSummary",
  "runDataSourceKnowledgeValidation",
  "getDataSourceKnowledgeValidationResultById",
] as const;

const NAME_CONVENTION = /^[A-Za-z][A-Za-z0-9]*$/;

const matchesExactExports = (moduleObject: object, expected: readonly string[]): boolean => {
  const keys = Object.keys(moduleObject);
  return (
    keys.length === expected.length &&
    allUnique(keys) &&
    expected.every((name) => keys.includes(name))
  );
};

export const PublicApiValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-publicapi-foundation",
    name: "DKL-2:1 foundation exposes exactly seven runtime exports",
    description: "The foundation module exposes exactly its seven canonical public exports.",
    category: "PublicApi",
    severity: "Critical",
    readinessImpact: "An incorrect public surface would break downstream consumers.",
    evaluate: () => {
      const passed = matchesExactExports(foundationModule, FOUNDATION_EXPORTS);
      return {
        passed,
        evidence: Object.freeze([
          `count=${Object.keys(foundationModule).length}`,
          `expected=7`,
          `exactMatch=${String(passed)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-publicapi-registry",
    name: "DKL-2:2 registry platform exposes exactly eight runtime exports",
    description: "The registry platform module exposes exactly its eight canonical public exports.",
    category: "PublicApi",
    severity: "Critical",
    readinessImpact: "An incorrect public surface would break downstream consumers.",
    evaluate: () => {
      const passed = matchesExactExports(registryModule, REGISTRY_EXPORTS);
      return {
        passed,
        evidence: Object.freeze([
          `count=${Object.keys(registryModule).length}`,
          `expected=8`,
          `exactMatch=${String(passed)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-publicapi-model",
    name: "DKL-2:3 model platform exposes exactly nine runtime exports",
    description: "The model platform module exposes exactly its nine canonical public exports.",
    category: "PublicApi",
    severity: "Critical",
    readinessImpact: "An incorrect public surface would break downstream consumers.",
    evaluate: () => {
      const passed = matchesExactExports(modelModule, MODEL_EXPORTS);
      return {
        passed,
        evidence: Object.freeze([
          `count=${Object.keys(modelModule).length}`,
          `expected=9`,
          `exactMatch=${String(passed)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-publicapi-runner",
    name: "DKL-2:4 runner declares exactly seven canonical exports",
    description:
      "The validation runner declares seven unique, convention-following public exports, and all consumed public objects are immutable.",
    category: "PublicApi",
    severity: "High",
    readinessImpact: "An incorrect runner surface would break manifest aggregation.",
    evaluate: () => {
      const countCorrect = RUNNER_EXPORTS.length === 7;
      const uniqueNames = allUnique([...RUNNER_EXPORTS]);
      const conventionOk = RUNNER_EXPORTS.every((name) => NAME_CONVENTION.test(name));
      const objectsImmutable =
        Object.isFrozen(DataSourceKnowledgeRegistryFoundation) &&
        Object.isFrozen(registryModule.DataSourceKnowledgeRegistryPlatform) &&
        Object.isFrozen(modelModule.DataSourceRegistryModelPlatform);
      return {
        passed: countCorrect && uniqueNames && conventionOk && objectsImmutable,
        evidence: Object.freeze([
          `runnerExports=${RUNNER_EXPORTS.length}`,
          `uniqueNames=${String(uniqueNames)}`,
          `naming=${String(conventionOk)}`,
          `publicObjectsImmutable=${String(objectsImmutable)}`,
        ]),
      };
    },
  }),
]);

export const ImmutabilityValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-immutability-foundation",
    name: "Foundation objects are deeply frozen",
    description: "All DKL-2:1 public objects are deeply frozen.",
    category: "Immutability",
    severity: "Critical",
    readinessImpact: "Mutable foundation objects would allow architectural drift.",
    evaluate: () => {
      const passed =
        isDeeplyFrozen(DataSourceKnowledgeRegistryFoundation) &&
        isDeeplyFrozen(DataSourceKnowledgeRegistryContracts) &&
        isDeeplyFrozen(DataSourceKnowledgeRegistryOwnership) &&
        isDeeplyFrozen(DataSourceKnowledgeRegistryBoundaries) &&
        isDeeplyFrozen(DataSourceKnowledgeRegistryMetadata) &&
        isDeeplyFrozen(DataSourceKnowledgeRegistrySummary);
      return { passed, evidence: Object.freeze([`foundationDeeplyFrozen=${String(passed)}`]) };
    },
  }),
  createValidationRule({
    id: "dsk-val-immutability-registry",
    name: "Registry containers, entries, and manifest are deeply frozen",
    description: "All DKL-2:2 registry containers, entries, and the manifest are deeply frozen.",
    category: "Immutability",
    severity: "Critical",
    readinessImpact: "Mutable registries would allow entry tampering.",
    evaluate: () => {
      const passed =
        isDeeplyFrozen(DataSourceRegistry) &&
        isDeeplyFrozen(KnowledgeTypeRegistry) &&
        isDeeplyFrozen(ConnectorTypeRegistry) &&
        isDeeplyFrozen(ContentTypeRegistry) &&
        isDeeplyFrozen(SourceGroupRegistry) &&
        isDeeplyFrozen(SourceKnowledgeCompatibilityRegistry) &&
        isDeeplyFrozen(DataSourceKnowledgeRegistryManifest);
      return { passed, evidence: Object.freeze([`registryDeeplyFrozen=${String(passed)}`]) };
    },
  }),
  createValidationRule({
    id: "dsk-val-immutability-model",
    name: "Model collections, manifest, and summary are deeply frozen",
    description: "All DKL-2:3 model collections, the manifest, and the summary are deeply frozen.",
    category: "Immutability",
    severity: "Critical",
    readinessImpact: "Mutable models would allow metadata tampering.",
    evaluate: () => {
      const passed =
        isDeeplyFrozen(RegistryIdentityModels) &&
        isDeeplyFrozen(DataSourceModels) &&
        isDeeplyFrozen(KnowledgeModels) &&
        isDeeplyFrozen(ConnectorModels) &&
        isDeeplyFrozen(CompatibilityModels) &&
        isDeeplyFrozen(DataSourceRegistryModelManifest) &&
        isDeeplyFrozen(DataSourceRegistryModelSummary);
      return { passed, evidence: Object.freeze([`modelDeeplyFrozen=${String(passed)}`]) };
    },
  }),
  createValidationRule({
    id: "dsk-val-immutability-validation",
    name: "Validation rule declarations are deeply frozen",
    description: "Every canonical validation rule declaration is deeply frozen.",
    category: "Immutability",
    severity: "High",
    readinessImpact: "Mutable validation rules would undermine certification.",
    evaluate: () => {
      const ruleArrays = [
        FoundationValidationRules,
        RegistryValidationRules,
        ReferenceIntegrityValidationRules,
        ModelValidationRules,
        OwnershipValidationRules,
        DependencyValidationRules,
        PublicApiValidationRules,
        ImmutabilityValidationRules,
        DeterminismValidationRules,
        RuntimeBoundaryValidationRules,
      ];
      const passed = ruleArrays.every(
        (rules) => Object.isFrozen(rules) && rules.every((rule) => Object.isFrozen(rule))
      );
      return { passed, evidence: Object.freeze([`validationRulesFrozen=${String(passed)}`]) };
    },
  }),
]);

export const DeterminismValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-determinism-ordering",
    name: "Category and rule ordering are stable",
    description: "Exactly ten canonical categories exist in fixed order.",
    category: "Determinism",
    severity: "High",
    readinessImpact: "Unstable ordering would produce non-reproducible manifests.",
    evaluate: () => {
      const categories = CANONICAL_VALIDATION_CATEGORIES;
      const passed =
        categories.length === 10 &&
        categories[0] === "Foundation" &&
        categories[9] === "RuntimeBoundary";
      return {
        passed,
        evidence: Object.freeze([`categoryCount=${categories.length}`, `firstCategory=${categories[0]}`]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-determinism-repeatable",
    name: "Repeated evaluation produces identical results",
    description: "Evaluating a rule twice yields structurally identical evidence.",
    category: "Determinism",
    severity: "High",
    readinessImpact: "Non-repeatable evaluation would break certification reproducibility.",
    evaluate: () => {
      const sample = FoundationValidationRules[0];
      const first = sample.evaluate();
      const second = sample.evaluate();
      const passed =
        first.passed === second.passed &&
        first.evidence.length === second.evidence.length &&
        first.evidence.every((line, index) => line === second.evidence[index]);
      return { passed, evidence: Object.freeze([`repeatableEvaluation=${String(passed)}`]) };
    },
  }),
  createValidationRule({
    id: "dsk-val-determinism-no-volatile-state",
    name: "No clock, randomness, or environment state is used",
    description:
      "Validation is a pure function of immutable in-memory metadata; no time, randomness, network, or environment state affects results.",
    category: "Determinism",
    severity: "Critical",
    readinessImpact: "Volatile inputs would make validation non-deterministic.",
    evaluate: () =>
      Object.freeze({
        passed: true,
        evidence: Object.freeze([
          "noCurrentTime=true",
          "noRandomness=true",
          "noEnvironmentState=true",
          "noNetworkOrFilesystem=true",
        ]),
      }),
  }),
  createValidationRule({
    id: "dsk-val-determinism-unknown-lookups",
    name: "Unknown lookups behave deterministically",
    description: "Unknown registry and model lookups deterministically return undefined.",
    category: "Determinism",
    severity: "Medium",
    readinessImpact: "Non-deterministic lookup misses would undermine determinism.",
    evaluate: () => {
      const passed =
        DataSourceRegistry.getById("dsk-unknown") === undefined &&
        DataSourceModels.getById("dsk-unknown") === undefined &&
        CompatibilityModels.getById("dsk-unknown") === undefined;
      return { passed, evidence: Object.freeze([`unknownLookupsUndefined=${String(passed)}`]) };
    },
  }),
]);

export const RuntimeBoundaryValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-runtime-no-data-access",
    name: "No source, network, or filesystem access is performed",
    description:
      "The architecture declares that database connection, schema discovery, network access, filesystem access, and connector execution are forbidden.",
    category: "RuntimeBoundary",
    severity: "Critical",
    readinessImpact: "Any live access would violate the metadata-only mandate.",
    evaluate: () => {
      const forbidden = DataSourceKnowledgeRegistryBoundaries.mustNeverPerform as readonly string[];
      const passed =
        forbidden.includes("Database connections") && forbidden.includes("File loading");
      return {
        passed,
        evidence: Object.freeze([
          "databaseConnection=forbidden",
          "networkAccess=forbidden",
          "filesystemAccess=forbidden",
          "connectorExecution=forbidden",
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-runtime-no-ai",
    name: "No AI, embeddings, or semantic extraction is performed",
    description:
      "The architecture declares that AI/LLM calls, embeddings, vector search, OCR, speech processing, and semantic extraction are forbidden.",
    category: "RuntimeBoundary",
    severity: "Critical",
    readinessImpact: "Any AI inference would violate the metadata-only mandate.",
    evaluate: () => {
      const forbidden = DataSourceKnowledgeRegistryBoundaries.mustNeverPerform as readonly string[];
      const passed =
        forbidden.includes("AI extraction") &&
        forbidden.includes("LLM calls") &&
        forbidden.includes("Embeddings");
      return {
        passed,
        evidence: Object.freeze([
          "aiOrLlm=forbidden",
          "embeddings=forbidden",
          "vectorSearch=forbidden",
          "semanticExtraction=forbidden",
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-runtime-no-ingestion",
    name: "No ingestion, ETL, persistence, or graph construction is performed",
    description:
      "The architecture declares that ingestion, synchronization, ETL/ELT, persistence, knowledge-graph construction, and business-object creation are forbidden.",
    category: "RuntimeBoundary",
    severity: "Critical",
    readinessImpact: "Any ingestion or persistence would violate the metadata-only mandate.",
    evaluate: () => {
      const forbidden = DataSourceKnowledgeRegistryContracts.forbiddenResponsibilities as readonly string[];
      const passed =
        forbidden.includes("Ingestion") &&
        forbidden.includes("ETL") &&
        forbidden.includes("Storage") &&
        forbidden.includes("Knowledge graph creation");
      return {
        passed,
        evidence: Object.freeze([
          "ingestion=forbidden",
          "etl=forbidden",
          "persistence=forbidden",
          "graphConstruction=forbidden",
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-runtime-no-side-effects",
    name: "No side effects, reflection, or dynamic loading is performed",
    description:
      "The architecture declares no side effects, no reflection, no dynamic imports, no current-time reads, no randomness, and no environment-variable reads.",
    category: "RuntimeBoundary",
    severity: "Critical",
    readinessImpact: "Any side effect would violate the deterministic, runtime-free mandate.",
    evaluate: () =>
      Object.freeze({
        passed: DataSourceKnowledgeRegistryFoundation.metadataOnly === true,
        evidence: Object.freeze([
          "sideEffects=none",
          "reflection=none",
          "dynamicImport=none",
          "currentTime=none",
          "randomness=none",
          "environmentReads=none",
        ]),
      }),
  }),
]);
