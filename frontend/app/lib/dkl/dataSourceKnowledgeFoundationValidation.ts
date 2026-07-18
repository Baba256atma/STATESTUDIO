/**
 * DKL-2:4 — Foundation Validation Rules (category: Foundation).
 *
 * Four deterministic, metadata-only rules validating the DKL-2:1 foundation
 * through its approved public APIs. No source inspection, no runtime behavior.
 *
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: depends only on the DKL-2:1 public foundation API and the
 * DKL-2:4 validation types.
 */

import {
  DataSourceKnowledgeRegistryBoundaries,
  DataSourceKnowledgeRegistryContracts,
  DataSourceKnowledgeRegistryFoundation,
  DataSourceKnowledgeRegistryMetadata,
  DataSourceKnowledgeRegistryOwnership,
  DataSourceKnowledgeRegistryVersion,
} from "./dataSourceKnowledgeRegistryFoundation.ts";
import {
  allUnique,
  createValidationRule,
  isDeeplyFrozen,
  type ValidationRule,
} from "./dataSourceKnowledgeValidationTypes.ts";

const REQUIRED_FORBIDDEN_DEPENDENCIES = [
  "Engine",
  "OPS",
  "BUS",
  "Advisor",
  "Scene",
  "NEA",
  "Persistence",
  "Integrations",
] as const;

export const FoundationValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-foundation-identity",
    name: "Foundation identity and version exist",
    description: "DKL-2:1 foundation exposes a stable identity, phase id, and version.",
    category: "Foundation",
    severity: "Critical",
    readinessImpact: "Foundation identity is required before manifest aggregation.",
    evaluate: () => {
      const identity = DataSourceKnowledgeRegistryFoundation.identity;
      const passed =
        identity.phaseId === "DKL-2:1" &&
        identity.version === "1.0.0" &&
        DataSourceKnowledgeRegistryVersion === "1.0.0" &&
        identity.layerId === "DKL-2";
      return {
        passed,
        evidence: Object.freeze([
          `phaseId=${identity.phaseId}`,
          `version=${identity.version}`,
          `layerId=${identity.layerId}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-foundation-contracts",
    name: "Foundation contracts, ownership, and boundaries exist",
    description: "DKL-2:1 declares non-empty contracts, ownership, and boundaries.",
    category: "Foundation",
    severity: "Critical",
    readinessImpact: "Missing contracts would invalidate the architectural foundation.",
    evaluate: () => {
      const passed =
        DataSourceKnowledgeRegistryContracts.responsibilities.length > 0 &&
        DataSourceKnowledgeRegistryOwnership.owns.length > 0 &&
        DataSourceKnowledgeRegistryOwnership.neverOwns.length > 0 &&
        DataSourceKnowledgeRegistryBoundaries.mustNeverPerform.length > 0;
      return {
        passed,
        evidence: Object.freeze([
          `responsibilities=${DataSourceKnowledgeRegistryContracts.responsibilities.length}`,
          `owns=${DataSourceKnowledgeRegistryOwnership.owns.length}`,
          `mustNeverPerform=${DataSourceKnowledgeRegistryBoundaries.mustNeverPerform.length}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-foundation-metadata",
    name: "Foundation metadata categories are complete and unique",
    description: "All canonical category collections are non-empty with unique keys.",
    category: "Foundation",
    severity: "High",
    readinessImpact: "Category vocabularies underpin every registry and model.",
    evaluate: () => {
      const metadata = DataSourceKnowledgeRegistryMetadata;
      const collections = [
        metadata.dataSourceCategories,
        metadata.knowledgeCategories,
        metadata.connectorTypes,
        metadata.contentTypes,
        metadata.metadataTypes,
        metadata.sourceCategories,
      ];
      const allNonEmpty = collections.every((collection) => collection.length > 0);
      const allUniqueKeys = collections.every((collection) =>
        allUnique(collection.map((entry) => entry.key))
      );
      return {
        passed: allNonEmpty && allUniqueKeys,
        evidence: Object.freeze([
          `dataSourceCategories=${metadata.dataSourceCategories.length}`,
          `knowledgeCategories=${metadata.knowledgeCategories.length}`,
          `connectorTypes=${metadata.connectorTypes.length}`,
          `contentTypes=${metadata.contentTypes.length}`,
          `uniqueKeys=${String(allUniqueKeys)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-foundation-boundaries",
    name: "Foundation dependencies, forbidden layers, and immutability are valid",
    description:
      "Allowed dependencies are DKL-1 only, forbidden layers are declared, owned and forbidden responsibilities do not overlap, and the foundation is immutable.",
    category: "Foundation",
    severity: "Critical",
    readinessImpact: "Boundary violations would break the forward-only architecture.",
    evaluate: () => {
      const allowedIsDkl1Only =
        DataSourceKnowledgeRegistryContracts.allowedDependencies.length === 1 &&
        DataSourceKnowledgeRegistryContracts.allowedDependencies[0] === "DKL-1 Public Index";
      const forbidden = DataSourceKnowledgeRegistryBoundaries.forbiddenDependencies as readonly string[];
      const forbiddenComplete = REQUIRED_FORBIDDEN_DEPENDENCIES.every((layer) =>
        forbidden.includes(layer)
      );
      const owns = DataSourceKnowledgeRegistryOwnership.owns as readonly string[];
      const neverOwns = DataSourceKnowledgeRegistryOwnership.neverOwns as readonly string[];
      const noOverlap = owns.every((entry) => !neverOwns.includes(entry));
      const frozen = isDeeplyFrozen(DataSourceKnowledgeRegistryFoundation);
      return {
        passed: allowedIsDkl1Only && forbiddenComplete && noOverlap && frozen,
        evidence: Object.freeze([
          `allowedDependencies=DKL-1-only:${String(allowedIsDkl1Only)}`,
          `forbiddenLayersDeclared:${String(forbiddenComplete)}`,
          `ownedForbiddenOverlap:${String(!noOverlap)}`,
          `foundationDeeplyFrozen:${String(frozen)}`,
        ]),
      };
    },
  }),
]);
