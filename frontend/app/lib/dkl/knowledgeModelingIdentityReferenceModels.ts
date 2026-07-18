/**
 * DKL-4:3 — Identity and Reference Model descriptors.
 *
 * Explicit immutable contracts for knowledge identities and references.
 * Metadata only — no dereference or resolution services.
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

const IDENTITY_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable identity identifier."),
  field("identityKind", "IdentityKind", "Knowledge, Object, External, or Source identity."),
  field("scope", "string", "Declared identity scope."),
  field("stableName", "string", "Stable identity name."),
  field("version", "string", "Declared version."),
  field("ownerPhase", "string", "Owning phase declaration."),
  field("namespace", "string", "Identity namespace."),
  field("aliases", "string[]", "Declared aliases."),
  field("publicVisibility", "ModelVisibility", "Visibility declaration."),
  field("immutable", "true", "Identity is immutable."),
]);

const REFERENCE_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable reference identifier."),
  field("referenceKind", "ReferenceKind", "Canonical, CrossModel, Upstream, or Public."),
  field("sourceIdentityId", "string", "Source identity reference."),
  field("targetIdentityId", "string", "Target identity reference."),
  field("description", "string", "Reference description."),
  field("owner", "string", "Owning architectural owner."),
  field("sourcePhase", "string", "Source phase declaration."),
  field("dereferencedAtRuntime", "false", "Runtime dereference is forbidden."),
  field("resolutionServiceForbidden", "true", "Resolution services are forbidden."),
  field("immutable", "true", "Reference is immutable."),
]);

/** Canonical Knowledge Identity model descriptor. */
export const KnowledgeModelingKnowledgeIdentityModel: CanonicalModelDescriptor =
  Object.freeze({
    modelId: "DKL-4:3/KnowledgeIdentity",
    modelKind: "KnowledgeIdentity",
    modelName: "Knowledge Identity Model",
    namespace: "nexora.dkl.knowledge-modeling.model.knowledge-identity",
    description:
      "Canonical immutable Knowledge Identity covering Knowledge, Object, External, and Source identities.",
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze(["IdentityType"]),
    fields: IDENTITY_FIELDS,
    fieldCount: IDENTITY_FIELDS.length,
    lifecycleStates: LIFECYCLE,
    statuses: STATUSES,
    metadataOnly: true,
    runtimeInstanceForbidden: true,
    factoryForbidden: true,
    graphBehaviorForbidden: true,
    immutable: true,
    identityKinds: Object.freeze([
      "KnowledgeIdentity",
      "ObjectIdentity",
      "ExternalIdentity",
      "SourceIdentity",
    ]),
    allowedIdentityTypes: Object.freeze(
      KnowledgeModelingRegistry.collections.identityTypes.map((entry) => entry.name),
    ),
  });

/** Canonical Knowledge Reference model descriptor. */
export const KnowledgeModelingKnowledgeReferenceModel: CanonicalModelDescriptor =
  Object.freeze({
    modelId: "DKL-4:3/KnowledgeReference",
    modelKind: "KnowledgeReference",
    modelName: "Knowledge Reference Model",
    namespace: "nexora.dkl.knowledge-modeling.model.knowledge-reference",
    description:
      "Canonical immutable Reference covering Canonical, CrossModel, Upstream Understanding, and Public references.",
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze(["ReferenceType"]),
    fields: REFERENCE_FIELDS,
    fieldCount: REFERENCE_FIELDS.length,
    lifecycleStates: LIFECYCLE,
    statuses: STATUSES,
    metadataOnly: true,
    runtimeInstanceForbidden: true,
    factoryForbidden: true,
    graphBehaviorForbidden: true,
    immutable: true,
    referenceKinds: Object.freeze([
      "CanonicalReference",
      "CrossModelReference",
      "UpstreamUnderstandingReference",
      "PublicReference",
    ]),
    allowedReferenceTypes: Object.freeze(
      KnowledgeModelingRegistry.collections.referenceTypes.map((entry) => entry.name),
    ),
  });
