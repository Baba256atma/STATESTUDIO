/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Immutable manifest describing the DKL Foundation Model platform and its
 * compatibility with the DKL-1:1 Foundation and DKL-1:2 Registry.
 * Metadata only — no runtime behavior.
 */

import { BusinessObjectModel } from "./businessObjectModel.ts";
import { DataKnowledgeObjectModel } from "./dataKnowledgeObjectModel.ts";
import type { DataKnowledgeFoundationModelManifestDescriptor } from "./dataKnowledgeFoundationModelTypes.ts";
import { KnowledgeMetadataModel } from "./knowledgeMetadataModel.ts";
import { KnowledgeRelationshipModel } from "./knowledgeRelationshipModel.ts";

export const DataKnowledgeFoundationModelManifest = Object.freeze({
  modelVersion: "1.0.0",
  namespace: "nexora.dkl.foundation.model",
  modelId: "DKL-1:3",
  registeredModels: Object.freeze([
    DataKnowledgeObjectModel.id,
    BusinessObjectModel.id,
    KnowledgeRelationshipModel.id,
    KnowledgeMetadataModel.id,
  ]),
  modelCategories: Object.freeze([
    "knowledge-object",
    "business-object",
    "knowledge-relationship",
    "knowledge-metadata",
  ]),
  compatibility: Object.freeze({
    foundation: "DKL-1:1",
    registry: "DKL-1:2",
    backwardCompatible: true,
    additiveOnly: true,
  }),
  foundationCompatibility: Object.freeze({
    phase: "DKL-1:1",
    version: "1.0.0",
    compatible: true,
  }),
  registryCompatibility: Object.freeze({
    phase: "DKL-1:2",
    version: "1.0.0",
    compatible: true,
  }),
  stability: "Stable",
  certificationStatus: "Certified",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationModelManifestDescriptor);
