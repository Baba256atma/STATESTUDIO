/**
 * DKL-2:4 — Registry & Reference Integrity Validation Rules.
 *
 * Eight deterministic, metadata-only rules: four validating the DKL-2:2 registry
 * platform (category: Registry) and four validating cross-phase references
 * (category: ReferenceIntegrity). All checks read only approved public objects.
 *
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: depends only on the DKL-2:1 public foundation, the DKL-2:2
 * public registry platform, and DKL-2:4 validation types.
 */

import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import {
  ConnectorTypeRegistry,
  ContentTypeRegistry,
  DataSourceKnowledgeRegistryManifest,
  DataSourceRegistry,
  KnowledgeTypeRegistry,
  SourceGroupRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  allUnique,
  createValidationRule,
  isDeeplyFrozen,
  type ValidationRule,
} from "./dataSourceKnowledgeValidationTypes.ts";

const VALID_STATUSES = ["Draft", "Active", "Deprecated", "Reserved"] as const;

const allRegistryIds = (): readonly string[] => [
  ...DataSourceRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...KnowledgeTypeRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...ConnectorTypeRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...ContentTypeRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...SourceGroupRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...SourceKnowledgeCompatibilityRegistry.entries.map((entry) => entry.identity.registryEntryId),
];

export const RegistryValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-registry-counts",
    name: "Registry entry counts are canonical",
    description: "Registries contain 23/23/9/8/8/24 entries respectively.",
    category: "Registry",
    severity: "Critical",
    readinessImpact: "Incorrect counts indicate an incomplete registry surface.",
    evaluate: () => {
      const passed =
        DataSourceRegistry.entries.length === 23 &&
        KnowledgeTypeRegistry.entries.length === 23 &&
        ConnectorTypeRegistry.entries.length === 9 &&
        ContentTypeRegistry.entries.length === 8 &&
        SourceGroupRegistry.entries.length === 8 &&
        SourceKnowledgeCompatibilityRegistry.entries.length === 24;
      return {
        passed,
        evidence: Object.freeze([
          `dataSources=${DataSourceRegistry.entries.length}`,
          `knowledge=${KnowledgeTypeRegistry.entries.length}`,
          `connectors=${ConnectorTypeRegistry.entries.length}`,
          `content=${ContentTypeRegistry.entries.length}`,
          `groups=${SourceGroupRegistry.entries.length}`,
          `compatibility=${SourceKnowledgeCompatibilityRegistry.entries.length}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-registry-identity",
    name: "Registry ids are unique with stable names, versions, and lifecycle",
    description: "All registry entry ids are globally unique with valid identity metadata.",
    category: "Registry",
    severity: "Critical",
    readinessImpact: "Duplicate or malformed identities corrupt manifest aggregation.",
    evaluate: () => {
      const ids = allRegistryIds();
      const unique = allUnique(ids);
      const containers = [
        DataSourceRegistry,
        KnowledgeTypeRegistry,
        ConnectorTypeRegistry,
        ContentTypeRegistry,
        SourceGroupRegistry,
        SourceKnowledgeCompatibilityRegistry,
      ];
      const identityValid = containers.every((container) =>
        container.entries.every(
          (entry) =>
            entry.identity.registryEntryName.length > 0 &&
            entry.identity.registryEntryVersion === "1.0.0" &&
            (VALID_STATUSES as readonly string[]).includes(entry.identity.status)
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
    id: "dsk-val-registry-references",
    name: "Registry internal references resolve",
    description:
      "Every data source references an existing source group, connector, and content id, and every compatibility references existing source and knowledge ids.",
    category: "Registry",
    severity: "Critical",
    readinessImpact: "Dangling registry references would break model derivation.",
    evaluate: () => {
      const groupIds = new Set(SourceGroupRegistry.entries.map((e) => e.identity.registryEntryId));
      const connectorIds = new Set(ConnectorTypeRegistry.entries.map((e) => e.identity.registryEntryId));
      const contentIds = new Set(ContentTypeRegistry.entries.map((e) => e.identity.registryEntryId));
      const sourceIds = new Set(DataSourceRegistry.entries.map((e) => e.identity.registryEntryId));
      const knowledgeIds = new Set(KnowledgeTypeRegistry.entries.map((e) => e.identity.registryEntryId));
      const sourcesResolve = DataSourceRegistry.entries.every(
        (entry) =>
          groupIds.has(entry.sourceGroupId) &&
          entry.supportedConnectorTypeIds.every((id) => connectorIds.has(id)) &&
          entry.supportedContentTypeIds.every((id) => contentIds.has(id))
      );
      const compatResolve = SourceKnowledgeCompatibilityRegistry.entries.every(
        (entry) => sourceIds.has(entry.sourceCategoryId) && knowledgeIds.has(entry.knowledgeCategoryId)
      );
      return {
        passed: sourcesResolve && compatResolve,
        evidence: Object.freeze([
          `dataSourceReferencesResolve=${String(sourcesResolve)}`,
          `compatibilityReferencesResolve=${String(compatResolve)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-registry-manifest-lookup",
    name: "Registry manifest, lookups, and immutability are correct",
    description:
      "Registry manifest counts match contents, unknown lookups return undefined or immutable empty results, and registry objects are deeply frozen.",
    category: "Registry",
    severity: "High",
    readinessImpact: "Manifest drift or mutability would invalidate certification.",
    evaluate: () => {
      const manifest = DataSourceKnowledgeRegistryManifest;
      const countsMatch =
        manifest.totalDataSourceEntries === DataSourceRegistry.entries.length &&
        manifest.totalKnowledgeEntries === KnowledgeTypeRegistry.entries.length &&
        manifest.totalConnectorEntries === ConnectorTypeRegistry.entries.length &&
        manifest.totalContentEntries === ContentTypeRegistry.entries.length &&
        manifest.totalSourceGroups === SourceGroupRegistry.entries.length &&
        manifest.totalCompatibilityRelationships === SourceKnowledgeCompatibilityRegistry.entries.length;
      const lookupSafe =
        DataSourceRegistry.getById("dsk-unknown") === undefined &&
        SourceKnowledgeCompatibilityRegistry.getBySourceId("dsk-unknown").length === 0 &&
        Object.isFrozen(SourceKnowledgeCompatibilityRegistry.getByKnowledgeId("dsk-unknown"));
      const frozen =
        isDeeplyFrozen(DataSourceRegistry) &&
        isDeeplyFrozen(SourceKnowledgeCompatibilityRegistry) &&
        isDeeplyFrozen(manifest);
      return {
        passed: countsMatch && lookupSafe && frozen,
        evidence: Object.freeze([
          `manifestCountsMatch=${String(countsMatch)}`,
          `lookupSafe=${String(lookupSafe)}`,
          `deeplyFrozen=${String(frozen)}`,
        ]),
      };
    },
  }),
]);

export const ReferenceIntegrityValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-reference-source-knowledge-categories",
    name: "DKL-2:2 source and knowledge entries map to DKL-2:1 categories",
    description:
      "Every data-source and knowledge-type entry references an existing DKL-2:1 category exactly once.",
    category: "ReferenceIntegrity",
    severity: "Critical",
    readinessImpact: "Category drift would break the DKL-2 vocabulary contract.",
    evaluate: () => {
      const sourceKeys = new Set(
        DataSourceKnowledgeRegistryMetadata.dataSourceCategories.map((c) => c.key)
      );
      const knowledgeKeys = new Set(
        DataSourceKnowledgeRegistryMetadata.knowledgeCategories.map((c) => c.key)
      );
      const sourcesMap =
        DataSourceRegistry.entries.every((entry) => sourceKeys.has(entry.sourceCategory)) &&
        allUnique(DataSourceRegistry.entries.map((entry) => entry.sourceCategory)) &&
        DataSourceRegistry.entries.length === sourceKeys.size;
      const knowledgeMap =
        KnowledgeTypeRegistry.entries.every((entry) => knowledgeKeys.has(entry.knowledgeCategory)) &&
        allUnique(KnowledgeTypeRegistry.entries.map((entry) => entry.knowledgeCategory)) &&
        KnowledgeTypeRegistry.entries.length === knowledgeKeys.size;
      return {
        passed: sourcesMap && knowledgeMap,
        evidence: Object.freeze([
          `dataSourceCategoryMapping=${String(sourcesMap)}`,
          `knowledgeCategoryMapping=${String(knowledgeMap)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-reference-vocabulary-cardinality",
    name: "DKL-2:2 connector, content, and group vocabularies correspond to DKL-2:1",
    description:
      "Connector, content, and source-group registries have the same cardinality as the DKL-2:1 vocabularies they refine.",
    category: "ReferenceIntegrity",
    severity: "High",
    readinessImpact: "Vocabulary cardinality drift signals an incomplete refinement.",
    evaluate: () => {
      const connectorMatch =
        ConnectorTypeRegistry.entries.length === DataSourceKnowledgeRegistryMetadata.connectorTypes.length;
      const contentMatch =
        ContentTypeRegistry.entries.length === DataSourceKnowledgeRegistryMetadata.contentTypes.length;
      const groupMatch =
        SourceGroupRegistry.entries.length === DataSourceKnowledgeRegistryMetadata.sourceCategories.length;
      return {
        passed: connectorMatch && contentMatch && groupMatch,
        evidence: Object.freeze([
          `connectors ${ConnectorTypeRegistry.entries.length}=${DataSourceKnowledgeRegistryMetadata.connectorTypes.length}`,
          `content ${ContentTypeRegistry.entries.length}=${DataSourceKnowledgeRegistryMetadata.contentTypes.length}`,
          `groups ${SourceGroupRegistry.entries.length}=${DataSourceKnowledgeRegistryMetadata.sourceCategories.length}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-reference-registry-completeness",
    name: "Registry references are complete and non-dangling",
    description:
      "Every DKL-2:2 data source references exactly one source group and all references resolve without ambiguity.",
    category: "ReferenceIntegrity",
    severity: "Critical",
    readinessImpact: "Ambiguous ownership of references would block manifest aggregation.",
    evaluate: () => {
      const groupIds = new Set(SourceGroupRegistry.entries.map((e) => e.identity.registryEntryId));
      const exactlyOneGroup = DataSourceRegistry.entries.every(
        (entry) => typeof entry.sourceGroupId === "string" && groupIds.has(entry.sourceGroupId)
      );
      const noDanglingCompat = SourceKnowledgeCompatibilityRegistry.entries.every(
        (entry) =>
          DataSourceRegistry.getById(entry.sourceCategoryId) !== undefined &&
          KnowledgeTypeRegistry.getById(entry.knowledgeCategoryId) !== undefined
      );
      return {
        passed: exactlyOneGroup && noDanglingCompat,
        evidence: Object.freeze([
          `eachSourceHasOneGroup=${String(exactlyOneGroup)}`,
          `noDanglingCompatibility=${String(noDanglingCompat)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-reference-lookups-deterministic",
    name: "Registry reference lookups are deterministic and safe",
    description:
      "Reference lookups resolve consistently and unknown references return undefined without throwing.",
    category: "ReferenceIntegrity",
    severity: "Medium",
    readinessImpact: "Non-deterministic lookups would undermine reference integrity.",
    evaluate: () => {
      const first = DataSourceRegistry.entries[0].identity.registryEntryId;
      const resolvesConsistently =
        DataSourceRegistry.getById(first) === DataSourceRegistry.getById(first) &&
        DataSourceRegistry.getById(first) !== undefined;
      const unknownSafe =
        DataSourceRegistry.getById("dsk-missing") === undefined &&
        KnowledgeTypeRegistry.getById("dsk-missing") === undefined;
      return {
        passed: resolvesConsistently && unknownSafe,
        evidence: Object.freeze([
          `resolvesConsistently=${String(resolvesConsistently)}`,
          `unknownReturnsUndefined=${String(unknownSafe)}`,
        ]),
      };
    },
  }),
]);
