/**
 * DKL-1:5 — Phase Manifest.
 *
 * Immutable inventory describing every completed DKL Foundation phase.
 * All values are sourced from the official public metadata of DKL-1:1 through
 * DKL-1:4. Metadata only — no runtime behavior.
 */

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationModelManifest } from "./dataKnowledgeFoundationModel.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationRegistryManifest } from "./dataKnowledgeFoundationRegistryIndex.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import { DataKnowledgeFoundationValidationManifest } from "./dataKnowledgeFoundationValidation.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import type {
  DataKnowledgePhaseManifestDescriptor,
  PhaseManifestEntry,
} from "./dataKnowledgeFoundationManifestTypes.ts";

const phase = (entry: PhaseManifestEntry): PhaseManifestEntry => Object.freeze(entry);

const phases = Object.freeze([
  phase({
    id: "DKL-1:1",
    name: "Data Knowledge Layer Foundation",
    version: foundationApi.DataKnowledgeFoundationIdentity.version,
    namespace: foundationApi.DataKnowledgeFoundationIdentity.namespace,
    status: foundationApi.DataKnowledgeFoundationIdentity.releaseStatus,
    stability: foundationApi.DataKnowledgeFoundationIdentity.stability,
    readiness: "ReadyForRegistry",
    publicApiCount: Object.keys(foundationApi).length,
    metadataOnly: true,
    immutable: true,
  }),
  phase({
    id: "DKL-1:2",
    name: "Data Knowledge Foundation Registry",
    version: DataKnowledgeFoundationRegistryManifest.registryVersion,
    namespace: DataKnowledgeFoundationRegistryManifest.registryNamespace,
    status: DataKnowledgeFoundationRegistryManifest.certificationStatus,
    stability: DataKnowledgeFoundationRegistryManifest.stability,
    readiness: "ReadyForModel",
    publicApiCount: Object.keys(registryApi).length,
    metadataOnly: true,
    immutable: true,
  }),
  phase({
    id: "DKL-1:3",
    name: "Data Knowledge Foundation Model",
    version: DataKnowledgeFoundationModelManifest.modelVersion,
    namespace: DataKnowledgeFoundationModelManifest.namespace,
    status: DataKnowledgeFoundationModelManifest.certificationStatus,
    stability: DataKnowledgeFoundationModelManifest.stability,
    readiness: "ReadyForValidation",
    publicApiCount: Object.keys(modelApi).length,
    metadataOnly: true,
    immutable: true,
  }),
  phase({
    id: "DKL-1:4",
    name: "Data Knowledge Foundation Validation",
    version: DataKnowledgeFoundationValidationManifest.version,
    namespace: DataKnowledgeFoundationValidationManifest.namespace,
    status: DataKnowledgeFoundationValidationManifest.validationStatus,
    stability: DataKnowledgeFoundationValidationManifest.stability,
    readiness: DataKnowledgeFoundationValidationManifest.readiness,
    publicApiCount: Object.keys(validationApi).length,
    metadataOnly: true,
    immutable: true,
  }),
]);

export const DataKnowledgeFoundationPhaseManifest = Object.freeze({
  phases,
  phaseCount: phases.length,
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgePhaseManifestDescriptor);
