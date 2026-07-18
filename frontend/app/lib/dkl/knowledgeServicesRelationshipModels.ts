/**
 * DKL-7:3 — Knowledge Services Relationship Models.
 *
 * Immutable relationship inventory connecting canonical model types.
 * Declarative only — no dispatching or orchestration.
 *
 * Ownership: owned exclusively by DKL-7:3.
 */

import { KnowledgeServicesRequestModels } from "./knowledgeServicesRequestModels.ts";
import { KnowledgeServicesResponseModels } from "./knowledgeServicesResponseModels.ts";
import type { KnowledgeServiceModelRelationship } from "./knowledgeServicesModelTypes.ts";

const relationship = (
  key: string,
  name: string,
  source: string,
  target: string,
  kind: string,
  description: string,
  deterministicOrder: number,
): KnowledgeServiceModelRelationship =>
  Object.freeze({
    relationshipId: `DKL-7:3/ModelRelationship/${key}`,
    name,
    sourceModelReference: source,
    targetModelReference: target,
    relationshipKind: kind,
    description,
    dispatching: false as const,
    orchestration: false as const,
    metadataOnly: true as const,
    deterministicOrder,
  });

const TRACE_RELATIONSHIPS: readonly KnowledgeServiceModelRelationship[] =
  Object.freeze(
    KnowledgeServicesRequestModels.map((request, index) => {
      const response = KnowledgeServicesResponseModels.find(
        (item) => item.originatingRequestModelReference === request.modelId,
      );
      return relationship(
        `Trace/${request.modelId.split("/").pop()}`,
        `${request.modelName} Trace Chain`,
        request.modelId,
        response?.modelId ?? "DKL-7:3/Response/ServiceErrorMetadataResponse",
        "RequestTrace",
        "Consumer Request → Request Model → Service → Capability → Contract → Response Model → Result Envelope.",
        index + 1,
      );
    }),
  );

const STRUCTURAL_RELATIONSHIPS: readonly KnowledgeServiceModelRelationship[] =
  Object.freeze([
    relationship(
      "RequestToRequestCategory",
      "Request Model → Request Category",
      "DKL-7:3/Request/*",
      "DKL-7:2/RequestCategory/*",
      "RegistryAlignment",
      "Every request model references a registered request category.",
      13,
    ),
    relationship(
      "RequestToService",
      "Request Model → Registered Service",
      "DKL-7:3/Request/*",
      "DKL-7:2/Service/*",
      "RegistryAlignment",
      "Every request model references a registered service.",
      14,
    ),
    relationship(
      "RequestToCapability",
      "Request Model → Registered Capability",
      "DKL-7:3/Request/*",
      "DKL-7:2/Capability/*",
      "RegistryAlignment",
      "Every request model references a registered capability.",
      15,
    ),
    relationship(
      "RequestToContract",
      "Request Model → Registered Contract",
      "DKL-7:3/Request/*",
      "DKL-7:2/Contract/*",
      "RegistryAlignment",
      "Every request model references a registered contract.",
      16,
    ),
    relationship(
      "RequestToAccessMode",
      "Request Model → Access Mode",
      "DKL-7:3/Request/*",
      "DKL-7:2/AccessMode/*",
      "RegistryAlignment",
      "Every request model uses an approved read-only access mode.",
      17,
    ),
    relationship(
      "ResponseToEnvelope",
      "Response Model → Result Envelope",
      "DKL-7:3/Response/*",
      "DKL-7:3/Result/ServiceResultEnvelope",
      "ResultBinding",
      "Every response model references the canonical result envelope.",
      18,
    ),
    relationship(
      "EnvelopeToResult",
      "Result Envelope → Result Model",
      "DKL-7:3/Result/ServiceResultEnvelope",
      "DKL-7:3/Result/*",
      "ResultBinding",
      "Result envelopes reference approved result model shapes.",
      19,
    ),
    relationship(
      "ObjectResultToBusinessObject",
      "Knowledge Object Result → Business Object Reference",
      "DKL-7:3/Result/KnowledgeObjectResult",
      "DKL-7:3/Reference/ObjectReference",
      "ReferenceBinding",
      "Knowledge object results reference Business Objects without owning them.",
      20,
    ),
    relationship(
      "RelationshipResultToSource",
      "Relationship Result → Source Object Reference",
      "DKL-7:3/Result/RelationshipResult",
      "DKL-7:3/Reference/ObjectReference",
      "ReferenceBinding",
      "Relationship results declare a source object reference structure.",
      21,
    ),
    relationship(
      "RelationshipResultToTarget",
      "Relationship Result → Target Object Reference",
      "DKL-7:3/Result/RelationshipResult",
      "DKL-7:3/Reference/ObjectReference",
      "ReferenceBinding",
      "Relationship results declare a target object reference structure.",
      22,
    ),
    relationship(
      "GraphPathToNodes",
      "Graph Path Result → Graph Node References",
      "DKL-7:3/Result/GraphPathResult",
      "DKL-7:3/Reference/GraphNodeReference",
      "GraphBinding",
      "Graph path results declare ordered node references.",
      23,
    ),
    relationship(
      "GraphPathToEdges",
      "Graph Path Result → Graph Edge References",
      "DKL-7:3/Result/GraphPathResult",
      "DKL-7:3/Reference/GraphEdgeReference",
      "GraphBinding",
      "Graph path results declare ordered edge references.",
      24,
    ),
    relationship(
      "TimelineToTimelineRefs",
      "Timeline Result → Timeline References",
      "DKL-7:3/Result/TimelineResult",
      "DKL-7:3/Reference/TimelineReference",
      "ReferenceBinding",
      "Timeline results declare timeline references.",
      25,
    ),
    relationship(
      "TimelineToEventRefs",
      "Timeline Result → Event References",
      "DKL-7:3/Result/TimelineResult",
      "DKL-7:3/Reference/TimelineReference",
      "ReferenceBinding",
      "Timeline results declare event references within timeline metadata.",
      26,
    ),
    relationship(
      "EvidenceToEvidenceRefs",
      "Evidence Result → Evidence References",
      "DKL-7:3/Result/EvidenceResult",
      "DKL-7:3/Reference/EvidenceReference",
      "ReferenceBinding",
      "Evidence results declare evidence references.",
      27,
    ),
    relationship(
      "EvidenceToProvenance",
      "Evidence Result → Provenance Context",
      "DKL-7:3/Result/EvidenceResult",
      "DKL-7:3/Context/ProvenanceContext",
      "ContextBinding",
      "Evidence results declare provenance context references.",
      28,
    ),
  ]);

/** Canonical immutable model relationship inventory. */
export const KnowledgeServicesModelRelationships: readonly KnowledgeServiceModelRelationship[] =
  Object.freeze([...TRACE_RELATIONSHIPS, ...STRUCTURAL_RELATIONSHIPS]);

/** Immutable relationship-model inventory aggregate. */
export const KnowledgeServicesModelRelationshipInventory = Object.freeze({
  inventoryId: "DKL-7:3/ModelRelationshipInventory",
  relationships: KnowledgeServicesModelRelationships,
  relationshipCount: KnowledgeServicesModelRelationships.length,
  traceRelationshipCount: TRACE_RELATIONSHIPS.length,
  structuralRelationshipCount: STRUCTURAL_RELATIONSHIPS.length,
  notes: Object.freeze({
    metadataOnly: true,
    noDispatching: true,
    noOrchestration: true,
    deterministic: true,
    requestServiceCapabilityResponseResultTraceRepresented: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
