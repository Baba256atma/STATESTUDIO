/**
 * DKL-1:4 — Registry Validation domain.
 *
 * Deterministically validates the DKL-1:2 Registry using its public index only.
 * Metadata only — no runtime behavior.
 */

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import {
  DataKnowledgeFoundationComponentRegistry,
  DataKnowledgeFoundationContractRegistry,
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationRegistry,
  DataKnowledgeFoundationRegistryManifest,
  getDataKnowledgeFoundationComponentById,
} from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  createValidationDomain,
  createValidationRule,
  isDeeplyFrozen,
} from "./dataKnowledgeFoundationValidationTypes.ts";

const foundationExportNames = Object.keys(foundationApi).sort();
const registeredApiNames = DataKnowledgeFoundationPublicApiRegistry.map((entry) => entry.name).sort();
const foundationContractIds = foundationApi.DataKnowledgeFoundationContracts.contracts.map((entry) => entry.id);
const registryContractIds = DataKnowledgeFoundationContractRegistry.map((entry) => entry.id);
const capabilitiesDeclarationOnly = DataKnowledgeFoundationRegistry.capabilities.every(
  (capability) => capability.declarationOnly === true
);

const rules = [
  createValidationRule({
    id: "DKL-VAL-R-01",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Five Foundation components registered",
    description: "The component registry must register exactly five Foundation components.",
    expected: "5",
    actual: String(DataKnowledgeFoundationComponentRegistry.length),
    condition: DataKnowledgeFoundationComponentRegistry.length === 5,
    evidence: { componentCount: DataKnowledgeFoundationComponentRegistry.length },
  }),
  createValidationRule({
    id: "DKL-VAL-R-02",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Every DKL-1:1 public API registered exactly once",
    description: "The public API registry must mirror the DKL-1:1 export inventory with no duplicates.",
    expected: foundationExportNames.join(","),
    actual: registeredApiNames.join(","),
    condition:
      registeredApiNames.length === foundationExportNames.length &&
      new Set(registeredApiNames).size === registeredApiNames.length &&
      registeredApiNames.every((name, index) => name === foundationExportNames[index]),
    evidence: {
      registeredCount: registeredApiNames.length,
      foundationCount: foundationExportNames.length,
      unique: new Set(registeredApiNames).size === registeredApiNames.length,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-03",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Contract registry mirrors Foundation contracts",
    description: "Every Foundation contract must be mirrored in the contract registry.",
    expected: foundationContractIds.join(","),
    actual: registryContractIds.join(","),
    condition:
      registryContractIds.length === foundationContractIds.length &&
      registryContractIds.every((id, index) => id === foundationContractIds[index]),
    evidence: {
      registryContractCount: registryContractIds.length,
      foundationContractCount: foundationContractIds.length,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-04",
    domain: "registry",
    severity: "INFO",
    sourcePhase: "DKL-1:2",
    title: "Architectural capabilities remain declaration-only",
    description: "Every registered architectural capability must be a declaration only.",
    expected: "all capabilities declarationOnly === true",
    actual: String(capabilitiesDeclarationOnly),
    condition: capabilitiesDeclarationOnly,
    evidence: {
      capabilityCount: DataKnowledgeFoundationRegistry.capabilities.length,
      declarationOnly: capabilitiesDeclarationOnly,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-05",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Registry manifest counts match inventories",
    description: "The manifest component and public API counts must match the actual registries.",
    expected: "componentCount=5, publicApiInventory=7",
    actual: `componentCount=${DataKnowledgeFoundationRegistryManifest.registeredComponentCount}, publicApiInventory=${DataKnowledgeFoundationRegistryManifest.publicApiInventory.length}`,
    condition:
      DataKnowledgeFoundationRegistryManifest.registeredComponentCount ===
        DataKnowledgeFoundationComponentRegistry.length &&
      DataKnowledgeFoundationRegistryManifest.publicApiInventory.length ===
        DataKnowledgeFoundationPublicApiRegistry.length,
    evidence: {
      manifestComponentCount: DataKnowledgeFoundationRegistryManifest.registeredComponentCount,
      manifestApiInventory: DataKnowledgeFoundationRegistryManifest.publicApiInventory.length,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-06",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Foundation compatibility is declared",
    description: "The registry manifest must declare compatibility with the DKL-1:1 Foundation.",
    expected: "foundationCompatibility.compatible === true (DKL-1:1)",
    actual: `${DataKnowledgeFoundationRegistryManifest.foundationCompatibility.phase}:${DataKnowledgeFoundationRegistryManifest.foundationCompatibility.compatible}`,
    condition:
      DataKnowledgeFoundationRegistryManifest.foundationCompatibility.phase === "DKL-1:1" &&
      DataKnowledgeFoundationRegistryManifest.foundationCompatibility.compatible === true,
    evidence: {
      phase: DataKnowledgeFoundationRegistryManifest.foundationCompatibility.phase,
      compatible: DataKnowledgeFoundationRegistryManifest.foundationCompatibility.compatible,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-07",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Component lookup is deterministic",
    description: "Known component lookups must return the correct frozen component metadata.",
    expected: "getById('dkl-component-identity').kind === 'identity'",
    actual: String(getDataKnowledgeFoundationComponentById("dkl-component-identity")?.kind),
    condition: getDataKnowledgeFoundationComponentById("dkl-component-identity")?.kind === "identity",
    evidence: {
      found: getDataKnowledgeFoundationComponentById("dkl-component-identity") !== undefined,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-08",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Unknown component identifiers return undefined",
    description: "Unknown component lookups must return undefined without throwing.",
    expected: "undefined",
    actual: String(getDataKnowledgeFoundationComponentById("dkl-component-unknown")),
    condition: getDataKnowledgeFoundationComponentById("dkl-component-unknown") === undefined,
    evidence: {
      unknownReturnsUndefined:
        getDataKnowledgeFoundationComponentById("dkl-component-unknown") === undefined,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-R-09",
    domain: "registry",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "Registry platform is deeply frozen",
    description: "The aggregate registry platform and all nested metadata must be deeply frozen.",
    expected: "isDeeplyFrozen(DataKnowledgeFoundationRegistry) === true",
    actual: String(isDeeplyFrozen(DataKnowledgeFoundationRegistry)),
    condition: isDeeplyFrozen(DataKnowledgeFoundationRegistry),
    evidence: { deeplyFrozen: isDeeplyFrozen(DataKnowledgeFoundationRegistry) },
  }),
];

export const DataKnowledgeFoundationRegistryValidation = createValidationDomain(
  "registry",
  "Registry Validation",
  "DKL-1:2",
  rules
);
