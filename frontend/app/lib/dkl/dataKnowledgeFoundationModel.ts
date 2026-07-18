/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Canonical, immutable, metadata-only architectural model platform for the
 * Nexora Data Knowledge Layer. Aggregates every conceptual model into a single
 * deep-frozen structure and declares compatibility with the DKL-1:1 Foundation
 * and DKL-1:2 Registry, extending both without modifying either.
 *
 * Publishes exactly eight metadata-only public APIs. Zero runtime behavior:
 * no I/O, no network, no database access, no parsing, no AI, no graph
 * construction, no entity extraction, no async, no reflection, no side effects.
 */

import { BusinessObjectModel } from "./businessObjectModel.ts";
import { DataKnowledgeFoundationModelManifest } from "./dataKnowledgeFoundationModelManifest.ts";
import type {
  DataKnowledgeFoundationModelDescriptor,
  DataKnowledgeFoundationModelSummary,
} from "./dataKnowledgeFoundationModelTypes.ts";
import { DataKnowledgeObjectModel } from "./dataKnowledgeObjectModel.ts";
import { KnowledgeMetadataModel } from "./knowledgeMetadataModel.ts";
import { KnowledgeRelationshipModel } from "./knowledgeRelationshipModel.ts";

export {
  DataKnowledgeObjectModel,
  BusinessObjectModel,
  KnowledgeRelationshipModel,
  KnowledgeMetadataModel,
  DataKnowledgeFoundationModelManifest,
};

export const DataKnowledgeFoundationModel = Object.freeze({
  objectModel: DataKnowledgeObjectModel,
  businessModel: BusinessObjectModel,
  relationshipModel: KnowledgeRelationshipModel,
  metadataModel: KnowledgeMetadataModel,
  manifest: DataKnowledgeFoundationModelManifest,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationModelDescriptor);

export const getDataKnowledgeFoundationModel = (): DataKnowledgeFoundationModelDescriptor =>
  DataKnowledgeFoundationModel;

export const getDataKnowledgeFoundationModelSummary = (): DataKnowledgeFoundationModelSummary =>
  Object.freeze({
    modelId: DataKnowledgeFoundationModelManifest.modelId,
    modelVersion: DataKnowledgeFoundationModelManifest.modelVersion,
    registeredModelCount: DataKnowledgeFoundationModelManifest.registeredModels.length,
    businessObjectTypeCount: BusinessObjectModel.types.length,
    relationshipTypeCount: KnowledgeRelationshipModel.relationships.length,
    metadataFieldCount: KnowledgeMetadataModel.fields.length,
    foundationPhase: "DKL-1:1",
    registryPhase: "DKL-1:2",
    certificationStatus: DataKnowledgeFoundationModelManifest.certificationStatus,
    stability: DataKnowledgeFoundationModelManifest.stability,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgeFoundationModelSummary);
