/**
 * DKL-2:3 — Data Source & Knowledge Registry Model Manifest.
 *
 * One immutable aggregate manifest deterministically derived from the frozen
 * model registries. It reports phase identity, model counts, DKL-2:2 registry
 * references, ownership, duplicate-id status, and readiness for DKL-2:4.
 *
 * Responsibility: publish the derived model manifest.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on the DKL-2:3 model registries and types.
 * Architectural purpose: a single deterministic inventory of the model platform.
 * No source inspection, no reflection, no runtime behavior.
 */

import { CompatibilityModels } from "./dataSourceRegistryCompatibilityModels.ts";
import { ConnectorModels } from "./dataSourceRegistryConnectorModels.ts";
import { RegistryIdentityModels } from "./dataSourceRegistryIdentityModels.ts";
import { KnowledgeModels } from "./dataSourceRegistryKnowledgeModels.ts";
import { DataSourceModels } from "./dataSourceRegistrySourceModels.ts";
import {
  MODEL_OWNER,
  MODEL_VERSION,
  type ModelManifestDescriptor,
} from "./dataSourceRegistryModelTypes.ts";

const allIds: readonly string[] = Object.freeze([
  ...RegistryIdentityModels.models.map((model) => model.identity.id),
  ...DataSourceModels.models.map((model) => model.identity.id),
  ...KnowledgeModels.models.map((model) => model.identity.id),
  ...ConnectorModels.models.map((model) => model.identity.id),
  ...CompatibilityModels.models.map((model) => model.identity.id),
]);

const duplicateIdStatus: "none" | "detected" =
  new Set(allIds).size === allIds.length ? "none" : "detected";

const totalModels =
  RegistryIdentityModels.models.length +
  DataSourceModels.models.length +
  KnowledgeModels.models.length +
  ConnectorModels.models.length +
  CompatibilityModels.models.length;

export const DataSourceRegistryModelManifest = Object.freeze({
  phaseId: "DKL-2:3",
  name: "Data Source & Knowledge Registry Model Platform",
  namespace: "nexora.dkl.dsk-registry.model",
  version: MODEL_VERSION,
  dependency: Object.freeze(["DKL-2:1", "DKL-2:2"]),
  identityModelCount: RegistryIdentityModels.models.length,
  dataSourceModelCount: DataSourceModels.models.length,
  knowledgeModelCount: KnowledgeModels.models.length,
  connectorModelCount: ConnectorModels.models.length,
  compatibilityModelCount: CompatibilityModels.models.length,
  totalModels,
  registryReferences: Object.freeze([
    "DataSourceRegistry",
    "KnowledgeTypeRegistry",
    "ConnectorTypeRegistry",
    "ContentTypeRegistry",
    "SourceGroupRegistry",
    "SourceKnowledgeCompatibilityRegistry",
  ]),
  owner: MODEL_OWNER,
  duplicateIdStatus,
  completion: Object.freeze([
    "ModelComplete",
    "MetadataOnly",
    "RuntimeFree",
    "Deterministic",
    "Immutable",
    "ReadyForValidation",
  ]),
  readiness: "ReadyForValidation",
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} as const satisfies ModelManifestDescriptor);
