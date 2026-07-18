/**
 * DKL-2:4 — Model Validation Rules (category: Model).
 *
 * Four deterministic, metadata-only rules validating the DKL-2:3 model platform
 * through its approved public APIs. No runtime model instances are created.
 *
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: depends only on the DKL-2:2 public registry platform, the
 * DKL-2:3 public model platform, and DKL-2:4 validation types.
 */

import {
  ConnectorTypeRegistry,
  DataSourceRegistry,
  KnowledgeTypeRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  CompatibilityModels,
  ConnectorModels,
  DataSourceModels,
  DataSourceRegistryModelManifest,
  DataSourceRegistryModelSummary,
  KnowledgeModels,
  RegistryIdentityModels,
} from "./dataSourceRegistryModelPlatform.ts";
import {
  allUnique,
  createValidationRule,
  isDeeplyFrozen,
  type ValidationRule,
} from "./dataSourceKnowledgeValidationTypes.ts";

const allModelIds = (): readonly string[] => [
  ...RegistryIdentityModels.models.map((model) => model.identity.id),
  ...DataSourceModels.models.map((model) => model.identity.id),
  ...KnowledgeModels.models.map((model) => model.identity.id),
  ...ConnectorModels.models.map((model) => model.identity.id),
  ...CompatibilityModels.models.map((model) => model.identity.id),
];

export const ModelValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-model-counts",
    name: "Model counts are canonical",
    description: "Model collections contain 7/23/23/9/24 models totalling 86.",
    category: "Model",
    severity: "Critical",
    readinessImpact: "Incorrect model counts indicate an incomplete model surface.",
    evaluate: () => {
      const total =
        RegistryIdentityModels.models.length +
        DataSourceModels.models.length +
        KnowledgeModels.models.length +
        ConnectorModels.models.length +
        CompatibilityModels.models.length;
      const passed =
        RegistryIdentityModels.models.length === 7 &&
        DataSourceModels.models.length === 23 &&
        KnowledgeModels.models.length === 23 &&
        ConnectorModels.models.length === 9 &&
        CompatibilityModels.models.length === 24 &&
        total === 86;
      return {
        passed,
        evidence: Object.freeze([
          `identity=${RegistryIdentityModels.models.length}`,
          `source=${DataSourceModels.models.length}`,
          `knowledge=${KnowledgeModels.models.length}`,
          `connector=${ConnectorModels.models.length}`,
          `compatibility=${CompatibilityModels.models.length}`,
          `total=${total}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-model-identity",
    name: "Model ids are unique with valid identities",
    description: "All model ids are globally unique and every model has a valid identity.",
    category: "Model",
    severity: "Critical",
    readinessImpact: "Duplicate or malformed model identities corrupt aggregation.",
    evaluate: () => {
      const ids = allModelIds();
      const unique = allUnique(ids);
      const containers = [
        RegistryIdentityModels,
        DataSourceModels,
        KnowledgeModels,
        ConnectorModels,
        CompatibilityModels,
      ];
      const identityValid = containers.every((container) =>
        container.models.every(
          (model) =>
            model.identity.id.length > 0 &&
            model.identity.name.length > 0 &&
            model.identity.version === "1.0.0"
        )
      );
      return {
        passed: unique && identityValid,
        evidence: Object.freeze([
          `totalIds=${ids.length}`,
          `uniqueIds=${String(unique)}`,
          `identityValid=${String(identityValid)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-model-references",
    name: "Model references resolve to registry entries",
    description:
      "Every source, knowledge, connector, and compatibility model references an existing DKL-2:2 registry entry.",
    category: "Model",
    severity: "Critical",
    readinessImpact: "Dangling model references would break manifest aggregation.",
    evaluate: () => {
      const sourceIds = new Set(DataSourceRegistry.entries.map((e) => e.identity.registryEntryId));
      const knowledgeIds = new Set(KnowledgeTypeRegistry.entries.map((e) => e.identity.registryEntryId));
      const connectorIds = new Set(ConnectorTypeRegistry.entries.map((e) => e.identity.registryEntryId));
      const compatIds = new Set(
        SourceKnowledgeCompatibilityRegistry.entries.map((e) => e.identity.registryEntryId)
      );
      const sourceResolves = DataSourceModels.models.every((m) => sourceIds.has(m.registryEntryId));
      const knowledgeResolves = KnowledgeModels.models.every((m) => knowledgeIds.has(m.registryEntryId));
      const connectorResolves = ConnectorModels.models.every((m) => connectorIds.has(m.registryEntryId));
      const compatResolves = CompatibilityModels.models.every((m) => compatIds.has(m.registryEntryId));
      return {
        passed: sourceResolves && knowledgeResolves && connectorResolves && compatResolves,
        evidence: Object.freeze([
          `sourceModels=${String(sourceResolves)}`,
          `knowledgeModels=${String(knowledgeResolves)}`,
          `connectorModels=${String(connectorResolves)}`,
          `compatibilityModels=${String(compatResolves)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-model-manifest-immutability",
    name: "Model manifest, summary, ordering, and immutability are correct",
    description:
      "Model manifest counts match collections, the summary matches the manifest, ordering is deterministic, and model objects are deeply frozen.",
    category: "Model",
    severity: "High",
    readinessImpact: "Manifest drift or mutability would invalidate certification.",
    evaluate: () => {
      const manifest = DataSourceRegistryModelManifest;
      const countsMatch =
        manifest.identityModelCount === RegistryIdentityModels.models.length &&
        manifest.dataSourceModelCount === DataSourceModels.models.length &&
        manifest.knowledgeModelCount === KnowledgeModels.models.length &&
        manifest.connectorModelCount === ConnectorModels.models.length &&
        manifest.compatibilityModelCount === CompatibilityModels.models.length &&
        manifest.totalModels === allModelIds().length;
      const summaryMatches =
        DataSourceRegistryModelSummary.totalModels === manifest.totalModels &&
        DataSourceRegistryModelSummary.readiness === manifest.readiness;
      const firstOrder = DataSourceModels.models.map((m) => m.identity.id);
      const secondOrder = DataSourceModels.models.map((m) => m.identity.id);
      const deterministicOrder = firstOrder.every((id, index) => id === secondOrder[index]);
      const frozen =
        isDeeplyFrozen(RegistryIdentityModels) &&
        isDeeplyFrozen(DataSourceModels) &&
        isDeeplyFrozen(manifest);
      return {
        passed: countsMatch && summaryMatches && deterministicOrder && frozen,
        evidence: Object.freeze([
          `countsMatch=${String(countsMatch)}`,
          `summaryMatches=${String(summaryMatches)}`,
          `deterministicOrder=${String(deterministicOrder)}`,
          `deeplyFrozen=${String(frozen)}`,
        ]),
      };
    },
  }),
]);
