/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Immutable metadata model describing the descriptive metadata fields carried
 * by organizational knowledge. These are field definitions only — no runtime
 * values are produced, stored, or computed here.
 */

import type {
  KnowledgeMetadataFieldDescriptor,
  KnowledgeMetadataFieldKey,
  KnowledgeMetadataModelDescriptor,
  KnowledgeMetadataValueType,
} from "./dataKnowledgeFoundationModelTypes.ts";

const field = (
  fieldKey: KnowledgeMetadataFieldKey,
  name: string,
  description: string,
  valueType: KnowledgeMetadataValueType
): KnowledgeMetadataFieldDescriptor =>
  Object.freeze({
    id: `dkl-metadata-field-${fieldKey}`,
    fieldKey,
    name,
    description,
    valueType,
    metadataOnly: true,
    immutable: true,
  } as const satisfies KnowledgeMetadataFieldDescriptor);

export const KnowledgeMetadataModel = Object.freeze({
  id: "dkl-model-knowledge-metadata",
  name: "Knowledge Metadata Model",
  kind: "knowledge-metadata",
  fields: Object.freeze([
    field("createdBy", "Created By", "Identity metadata for the creator of a knowledge entity.", "string"),
    field("modifiedBy", "Modified By", "Identity metadata for the last modifier of a knowledge entity.", "string"),
    field("version", "Version", "Version metadata for a knowledge entity.", "string"),
    field("classification", "Classification", "Classification metadata for a knowledge entity.", "enum"),
    field("confidence", "Confidence", "Confidence metadata for a knowledge entity.", "number"),
    field("sourceType", "Source Type", "Source type metadata for a knowledge entity.", "enum"),
    field("namespace", "Namespace", "Namespace metadata for a knowledge entity.", "string"),
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies KnowledgeMetadataModelDescriptor);
