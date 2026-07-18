/**
 * DKL-4:3 — Business Object Model descriptor.
 *
 * Canonical immutable Business Object contract composed with Knowledge Object.
 * Structural only — no business behavior.
 *
 * Ownership: owned exclusively by DKL-4:3.
 */

import { KnowledgeModelingRegistry } from "./knowledgeModelingRegistry.ts";
import type {
  CanonicalModelDescriptor,
  ModelFieldDescriptor,
} from "./knowledgeModelingModelTypes.ts";

const OWNER = "DKL-4 Knowledge Modeling Model";
const PHASE = "DKL-4:3" as const;

const field = (
  fieldName: string,
  fieldKind: string,
  description: string,
): ModelFieldDescriptor =>
  Object.freeze({
    fieldName,
    fieldKind,
    required: true as const,
    readonly: true as const,
    executableBehaviorImplied: false as const,
    description,
  });

const LIFECYCLE = Object.freeze([
  "Defined",
  "Draft",
  "Bound",
  "Structured",
  "Ready",
  "Stable",
  "Deprecated",
  "Superseded",
] as const);

const STATUSES = Object.freeze([
  "Declared",
  "Complete",
  "Incomplete",
  "Blocked",
  "Retired",
] as const);

const BUSINESS_OBJECT_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("knowledgeObject", "KnowledgeObject", "Composed Knowledge Object contract."),
  field("businessObjectCategory", "registryReference", "Registered business object category."),
  field("organizationalRole", "string", "Declared organizational role."),
  field("businessDomain", "string", "Declared business domain."),
  field("ownership", "string", "Ownership declaration."),
  field("sourceReferences", "string[]", "Source reference identifiers."),
  field("relatedBusinessObjectReferences", "string[]", "Related business object references."),
  field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
  field("semanticLabels", "string[]", "Declared semantic labels."),
  field("operationalRelevance", "string", "Declared operational relevance."),
  field("executiveRelevance", "string", "Declared executive relevance."),
  field("stability", "string", "Stability declaration."),
  field("compatibility", "string", "Compatibility metadata."),
  field("extensionPolicy", "string", "Extension policy metadata."),
  field("behaviorImplemented", "false", "Business behavior is forbidden."),
]);

/** Canonical Business Object model descriptor. */
export const KnowledgeModelingBusinessObjectModel: CanonicalModelDescriptor =
  Object.freeze({
    modelId: "DKL-4:3/BusinessObject",
    modelKind: "BusinessObject",
    modelName: "Business Object Model",
    namespace: "nexora.dkl.knowledge-modeling.model.business-object",
    description:
      "Canonical immutable Business Object contract composed over Knowledge Object. No behavior.",
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze([
      "BusinessObjectType",
      "KnowledgeObjectType",
      "IdentityType",
      "MetadataType",
    ]),
    fields: BUSINESS_OBJECT_FIELDS,
    fieldCount: BUSINESS_OBJECT_FIELDS.length,
    lifecycleStates: LIFECYCLE,
    statuses: STATUSES,
    metadataOnly: true,
    runtimeInstanceForbidden: true,
    factoryForbidden: true,
    graphBehaviorForbidden: true,
    immutable: true,
    composesKnowledgeObject: true,
    allowedBusinessObjectCategories: Object.freeze(
      KnowledgeModelingRegistry.collections.businessObjectTypes.map((entry) => entry.name),
    ),
    registeredBusinessObjectCount:
      KnowledgeModelingRegistry.collections.businessObjectTypes.length,
  });
