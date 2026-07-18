/**
 * DKL-2:5 — Phase Manifest.
 *
 * Immutable inventory of the four completed DKL-2 phases (Foundation, Registry,
 * Model, Validation). Runtime export counts are derived deterministically from
 * the statically imported public module namespaces; artifact (file) counts are
 * explicit immutable metadata consistent with the completed implementation.
 *
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: depends only on the DKL-2:1/2:2/2:3/2:4 public modules and
 * the DKL-2:5 manifest types.
 */

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import * as validationModule from "./dataSourceKnowledgeValidationRunner.ts";
import {
  MANIFEST_OWNER,
  type PhaseManifestContainer,
  type PhaseManifestEntry,
} from "./dataSourceKnowledgeManifestTypes.ts";

const foundationExports = Object.keys(foundationModule).length;
const registryExports = Object.keys(registryModule).length;
const modelExports = Object.keys(modelModule).length;
const validationExports = Object.keys(validationModule).length;

const phaseEntries: readonly PhaseManifestEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "DKL-2:1",
    phaseName: "Data Source & Knowledge Registry Foundation",
    phaseVersion: "1.0.0",
    phaseKind: "Foundation",
    owner: MANIFEST_OWNER,
    status: "Complete",
    readiness: "ReadyForRegistry",
    publicModule: "dataSourceKnowledgeRegistryFoundation.ts",
    runtimeExportCount: foundationExports,
    artifactCount: 7,
    dependencies: Object.freeze(["DKL-1 Public Index"]),
    capabilities: Object.freeze([
      "Canonical category vocabularies",
      "Architectural contracts",
      "Ownership and boundary declarations",
    ]),
    boundaries: Object.freeze(["No discovery", "No ingestion", "No runtime behavior"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "DKL-2:2",
    phaseName: "Data Source & Knowledge Registry Platform",
    phaseVersion: "1.0.0",
    phaseKind: "Registry",
    owner: MANIFEST_OWNER,
    status: "Complete",
    readiness: "ReadyForModel",
    publicModule: "dataSourceKnowledgeRegistryPlatform.ts",
    runtimeExportCount: registryExports,
    artifactCount: 8,
    dependencies: Object.freeze(["DKL-2:1"]),
    capabilities: Object.freeze([
      "Canonical registries",
      "Source-to-knowledge compatibility declarations",
      "Deterministic lookups",
    ]),
    boundaries: Object.freeze(["No connectors", "No live data", "No runtime behavior"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "DKL-2:3",
    phaseName: "Data Source & Knowledge Registry Model Platform",
    phaseVersion: "1.0.0",
    phaseKind: "Model",
    owner: MANIFEST_OWNER,
    status: "Complete",
    readiness: "ReadyForValidation",
    publicModule: "dataSourceRegistryModelPlatform.ts",
    runtimeExportCount: modelExports,
    artifactCount: 9,
    dependencies: Object.freeze(["DKL-2:1", "DKL-2:2"]),
    capabilities: Object.freeze([
      "Canonical metadata models",
      "Identity models",
      "Reference-preserving derivation",
    ]),
    boundaries: Object.freeze(["No business objects", "No runtime instances", "No runtime behavior"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "DKL-2:4",
    phaseName: "Data Source & Knowledge Registry Validation Platform",
    phaseVersion: "1.0.0",
    phaseKind: "Validation",
    owner: MANIFEST_OWNER,
    status: "Complete",
    readiness: "ReadyForManifest",
    publicModule: "dataSourceKnowledgeValidationRunner.ts",
    runtimeExportCount: validationExports,
    artifactCount: 9,
    dependencies: Object.freeze(["DKL-2:1", "DKL-2:2", "DKL-2:3"]),
    capabilities: Object.freeze([
      "Architectural validation rules",
      "Deterministic certification",
      "Validation manifest",
    ]),
    boundaries: Object.freeze(["No live validation", "No data quality checks", "No runtime behavior"]),
    metadataOnly: true,
    immutable: true,
  }),
]);

export const DataSourceKnowledgePhaseManifest: PhaseManifestContainer = Object.freeze({
  kind: "PhaseManifest",
  entries: phaseEntries,
  getByPhaseId: (phaseId: string): PhaseManifestEntry | undefined =>
    phaseEntries.find((entry) => entry.phaseId === phaseId),
});
