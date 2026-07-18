/**
 * DKL-2:6 — Platform Registry.
 *
 * Canonical, immutable registry of the five completed DKL-2 phases (Foundation,
 * Registry, Model, Validation, Manifest). Runtime export counts are derived
 * deterministically from statically imported public module namespaces; artifact
 * (file) counts are explicit immutable metadata consistent with completed work.
 *
 * Ownership: owned exclusively by DKL-2:6.
 * Dependency rules: depends only on the DKL-2:1..2:5 public modules and the
 * DKL-2:6 platform types.
 */

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import * as validationModule from "./dataSourceKnowledgeValidationRunner.ts";
import * as manifestModule from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import {
  type PlatformRegistryContainer,
  type PlatformRegistryEntry,
} from "./dataSourceKnowledgePlatformTypes.ts";

const phaseEntries: readonly PlatformRegistryEntry[] = Object.freeze([
  Object.freeze<PlatformRegistryEntry>({
    phaseId: "DKL-2:1",
    phaseName: "Data Source & Knowledge Registry Foundation",
    phaseKind: "Foundation",
    publicModule: "dataSourceKnowledgeRegistryFoundation.ts",
    runtimeExportCount: Object.keys(foundationModule).length,
    artifactCount: 7,
    status: "Complete",
    dependencies: Object.freeze(["DKL-1 Public Index"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze<PlatformRegistryEntry>({
    phaseId: "DKL-2:2",
    phaseName: "Data Source & Knowledge Registry Platform",
    phaseKind: "Registry",
    publicModule: "dataSourceKnowledgeRegistryPlatform.ts",
    runtimeExportCount: Object.keys(registryModule).length,
    artifactCount: 8,
    status: "Complete",
    dependencies: Object.freeze(["DKL-2:1"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze<PlatformRegistryEntry>({
    phaseId: "DKL-2:3",
    phaseName: "Data Source & Knowledge Registry Model Platform",
    phaseKind: "Model",
    publicModule: "dataSourceRegistryModelPlatform.ts",
    runtimeExportCount: Object.keys(modelModule).length,
    artifactCount: 9,
    status: "Complete",
    dependencies: Object.freeze(["DKL-2:1", "DKL-2:2"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze<PlatformRegistryEntry>({
    phaseId: "DKL-2:4",
    phaseName: "Data Source & Knowledge Registry Validation Platform",
    phaseKind: "Validation",
    publicModule: "dataSourceKnowledgeValidationRunner.ts",
    runtimeExportCount: Object.keys(validationModule).length,
    artifactCount: 9,
    status: "Complete",
    dependencies: Object.freeze(["DKL-2:1", "DKL-2:2", "DKL-2:3"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze<PlatformRegistryEntry>({
    phaseId: "DKL-2:5",
    phaseName: "Data Source & Knowledge Registry Manifest Platform",
    phaseKind: "Manifest",
    publicModule: "dataSourceKnowledgeRegistryManifestPlatform.ts",
    runtimeExportCount: Object.keys(manifestModule).length,
    artifactCount: 8,
    status: "Complete",
    dependencies: Object.freeze(["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4"]),
    metadataOnly: true,
    immutable: true,
  }),
]);

export const DataSourceKnowledgePlatformRegistry: PlatformRegistryContainer = Object.freeze<PlatformRegistryContainer>({
  kind: "PlatformRegistry",
  phases: phaseEntries,
  dependencyChain: Object.freeze([
    "DKL-1 Public Index",
    "DKL-2:1",
    "DKL-2:2",
    "DKL-2:3",
    "DKL-2:4",
    "DKL-2:5",
  ]),
  getByPhaseId: (phaseId: string): PlatformRegistryEntry | undefined =>
    phaseEntries.find((entry) => entry.phaseId === phaseId),
});
