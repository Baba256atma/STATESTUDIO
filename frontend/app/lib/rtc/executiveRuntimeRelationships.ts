/**
 * RTC-1:3 — Executive Runtime Relationships.
 *
 * Ownership hierarchy, directional relationships, reference rules,
 * invariants, principles, and extension strategy. Structure only —
 * validation executes in RTC-1:4.
 *
 * Ownership: owned exclusively by RTC-1:3.
 */

/** Directional identity-level relationship. */
export interface ExecutiveRuntimeRelationship {
  readonly relationshipId: string;
  readonly from: string;
  readonly to: string;
  readonly kind: "Owns" | "MayInclude" | "References";
  readonly directional: true;
  readonly circularOwnershipPermitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const relationship = (
  from: string,
  to: string,
  kind: ExecutiveRuntimeRelationship["kind"],
  order: number,
): ExecutiveRuntimeRelationship =>
  Object.freeze({
    relationshipId: `RTC-1:3/Relationship/${String(order).padStart(2, "0")}`,
    from,
    to,
    kind,
    directional: true as const,
    circularOwnershipPermitted: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Strict hierarchical ownership.
 * Child entities never own the Context.
 */
export const ExecutiveRuntimeOwnershipHierarchy = Object.freeze({
  ownershipId: "RTC-1:3/OwnershipHierarchy",
  root: "ExecutiveContext" as const,
  ownedByRoot: Object.freeze([
    "Workspace",
    "Pack",
    "Timeline",
    "Journal",
    "Stage",
    "Focus",
  ] as const),
  childNeverOwnsContext: true as const,
  circularOwnershipPermitted: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical directional relationships.
 * Workspace owns Pack; remaining children attach to Context.
 */
export const ExecutiveRuntimeRelationships = Object.freeze([
  relationship("ExecutiveContext", "Workspace", "Owns", 1),
  relationship("Workspace", "Pack", "Owns", 2),
  relationship("ExecutiveContext", "Timeline", "Owns", 3),
  relationship("ExecutiveContext", "Journal", "Owns", 4),
  relationship("ExecutiveContext", "Stage", "Owns", 5),
  relationship("ExecutiveContext", "Focus", "Owns", 6),
  relationship("ExecutiveContext", "Advisor", "Owns", 7),
  relationship("ExecutiveContext", "Director", "Owns", 8),
  relationship("Pack", "Timeline", "References", 9),
  relationship("Journal", "Pack", "References", 10),
  relationship("Focus", "Object", "References", 11),
] as const);

/** Immutable reference rules. */
export const ExecutiveRuntimeReferenceRules = Object.freeze([
  Object.freeze({
    ruleId: "RTC-1:3/ReferenceRule/01",
    name: "Immutable References",
    description: "All relationships use immutable references.",
  }),
  Object.freeze({
    ruleId: "RTC-1:3/ReferenceRule/02",
    name: "Workspace To Pack",
    description: "Workspace references Pack by Pack ID.",
  }),
  Object.freeze({
    ruleId: "RTC-1:3/ReferenceRule/03",
    name: "Pack To Timeline",
    description: "Pack may reference Timeline by Timeline ID.",
  }),
  Object.freeze({
    ruleId: "RTC-1:3/ReferenceRule/04",
    name: "No Circular Ownership",
    description: "No circular ownership is permitted.",
  }),
] as const);

/**
 * Runtime invariants declared here; validated in RTC-1:4.
 */
export const ExecutiveRuntimeInvariants = Object.freeze([
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/01",
    name: "One active Executive Context",
    cardinality: "ExactlyOne",
    subject: "ExecutiveContext",
  }),
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/02",
    name: "One active Workspace",
    cardinality: "ExactlyOne",
    subject: "Workspace",
  }),
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/03",
    name: "Zero or one active Pack",
    cardinality: "ZeroOrOne",
    subject: "Pack",
  }),
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/04",
    name: "Zero or one active Focus",
    cardinality: "ZeroOrOne",
    subject: "Focus",
  }),
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/05",
    name: "One Timeline instance",
    cardinality: "ExactlyOne",
    subject: "Timeline",
  }),
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/06",
    name: "One Journal instance",
    cardinality: "ExactlyOne",
    subject: "Journal",
  }),
  Object.freeze({
    invariantId: "RTC-1:3/Invariant/07",
    name: "One Stage instance",
    cardinality: "ExactlyOne",
    subject: "Stage",
  }),
] as const);

/** Model principles. */
export const ExecutiveRuntimeModelPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-1:3/Principle/01",
    name: "One Canonical Model",
    description: "One canonical Executive Context model exists.",
  }),
  Object.freeze({
    principleId: "RTC-1:3/Principle/02",
    name: "Stable Identities",
    description: "All entities have stable identities.",
  }),
  Object.freeze({
    principleId: "RTC-1:3/Principle/03",
    name: "Explicit Relationships",
    description: "Relationships are explicit. No implicit dependencies.",
  }),
  Object.freeze({
    principleId: "RTC-1:3/Principle/04",
    name: "Structure Only",
    description: "The model contains data structure only. No business rules.",
  }),
  Object.freeze({
    principleId: "RTC-1:3/Principle/05",
    name: "Deterministic And Immutable",
    description: "The model is deterministic and immutable.",
  }),
] as const);

/** Extension strategy constraints. */
export const ExecutiveRuntimeModelExtensionStrategy = Object.freeze({
  strategyId: "RTC-1:3/ExtensionStrategy",
  mayAddOptionalFields: true as const,
  mayRenameIdentities: false as const,
  mayRemoveRootEntities: false as const,
  mayChangeOwnershipHierarchy: false as const,
  preservesForwardCompatibility: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Surfaces Model shall never own. */
export const ExecutiveRuntimeModelProhibitedSurfaces = Object.freeze([
  "execute state transitions",
  "perform validation",
  "mutate runtime state",
  "render UI",
  "calculate metrics",
  "invoke AI",
  "access databases",
  "manage persistence",
  "React",
  "Next.js",
] as const);

/** Relationship aggregate for Model consumption. */
export const ExecutiveRuntimeRelationshipCatalog = Object.freeze({
  ownership: ExecutiveRuntimeOwnershipHierarchy,
  relationships: ExecutiveRuntimeRelationships,
  referenceRules: ExecutiveRuntimeReferenceRules,
  invariants: ExecutiveRuntimeInvariants,
  principles: ExecutiveRuntimeModelPrinciples,
  extensionStrategy: ExecutiveRuntimeModelExtensionStrategy,
  prohibitedSurfaces: ExecutiveRuntimeModelProhibitedSurfaces,
  relationshipCount: ExecutiveRuntimeRelationships.length,
  invariantCount: ExecutiveRuntimeInvariants.length,
  validatesInvariants: false as const,
  executesTransitions: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
