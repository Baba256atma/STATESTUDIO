import type { ExecutiveRequestIntentRelationshipDescriptor, ExecutiveRequestIntentRelationshipModel as RelationshipModel } from "./executiveRequestIntentModelTypes.ts";

const relationship = (id: ExecutiveRequestIntentRelationshipDescriptor["id"], source: ExecutiveRequestIntentRelationshipDescriptor["source"], target: ExecutiveRequestIntentRelationshipDescriptor["target"], description: string) => Object.freeze({
  id, source, target, relationship: description, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentRelationshipDescriptor);

export const ExecutiveRequestIntentRelationshipModel = Object.freeze({
  id: "eng-2-model-relationship", name: "Request & Intent Relationship Model", kind: "RelationshipModel",
  description: "Canonical relationship metadata connecting ENG-2 request and intent architectural models.",
  fields: Object.freeze(["relationshipId", "source", "target", "relationship"]),
  relationships: Object.freeze([
    relationship("eng-2-relationship-request-intent", "Request", "Intent", "Request references declared intent."),
    relationship("eng-2-relationship-request-context", "Request", "Context", "Request references context metadata."),
    relationship("eng-2-relationship-request-classification", "Request", "Classification", "Request references classification metadata."),
    relationship("eng-2-relationship-request-metadata", "Request", "Metadata", "Request references its metadata envelope."),
    relationship("eng-2-relationship-intent-registry", "Intent", "Registry", "Intent references an approved registry entry."),
  ]),
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies RelationshipModel);
