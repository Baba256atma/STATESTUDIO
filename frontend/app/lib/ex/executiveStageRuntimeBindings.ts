/**
 * EX-1:3 — Executive Stage Runtime Bindings.
 *
 * Immutable Runtime reference bindings, ownership hierarchy, structural
 * invariants, principles, and extension strategy. Structure only —
 * validation executes in EX-1:4.
 *
 * Ownership: owned exclusively by EX-1:3.
 */

/** Runtime binding type — immutable identifier references only. */
export interface ExecutiveStageRuntimeBindingType {
  readonly bindingId: string;
  readonly name: string;
  readonly stageEntity: string;
  readonly runtimeTarget: string;
  readonly description: string;
  readonly mutable: false;
  readonly allowsDirectMutation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Directional identity-level ownership edge. */
export interface ExecutiveStageOwnershipEdge {
  readonly relationshipId: string;
  readonly from: string;
  readonly to: string;
  readonly kind: "Owns";
  readonly directional: true;
  readonly circularOwnershipPermitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Runtime Binding Types — Stage entities reference Runtime by immutable IDs.
 * Direct Runtime mutation is prohibited.
 */
export const ExecutiveStageRuntimeBindingTypes = Object.freeze([
  Object.freeze({
    bindingId: "EX-1:3/RuntimeBinding/01",
    name: "Runtime Object ID",
    stageEntity: "StageObject",
    runtimeTarget: "Runtime Object ID",
    description:
      "StageObject references a Runtime object through an immutable Runtime Object ID.",
    mutable: false as const,
    allowsDirectMutation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: 1,
  }),
  Object.freeze({
    bindingId: "EX-1:3/RuntimeBinding/02",
    name: "Runtime Focus ID",
    stageEntity: "StageFocus",
    runtimeTarget: "Runtime Focus ID",
    description:
      "StageFocus references Runtime focus through an immutable Runtime Focus ID.",
    mutable: false as const,
    allowsDirectMutation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: 2,
  }),
  Object.freeze({
    bindingId: "EX-1:3/RuntimeBinding/03",
    name: "Runtime Context ID",
    stageEntity: "StageSurface",
    runtimeTarget: "Runtime Context ID",
    description:
      "StageSurface references the active Executive Context through an immutable Runtime Context ID.",
    mutable: false as const,
    allowsDirectMutation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: 3,
  }),
] as const satisfies readonly ExecutiveStageRuntimeBindingType[]);

/**
 * Ownership hierarchy — two levels.
 * Child entities never own the Stage.
 */
export const ExecutiveStageOwnershipHierarchy = Object.freeze({
  ownershipId: "EX-1:3/OwnershipHierarchy",
  root: "ExecutiveStage" as const,
  ownershipLevels: 2 as const,
  ownedByRoot: Object.freeze([
    "Surface",
    "Layers",
    "Objects",
    "Relationships",
    "Focus",
    "Interaction",
    "Overlay",
    "Viewport",
  ] as const),
  childNeverOwnsStage: true as const,
  circularOwnershipPermitted: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Explicit Owns edges from the Stage root. */
export const ExecutiveStageOwnershipEdges = Object.freeze(
  ExecutiveStageOwnershipHierarchy.ownedByRoot.map(
    (child, index): ExecutiveStageOwnershipEdge =>
      Object.freeze({
        relationshipId: `EX-1:3/Ownership/${String(index + 1).padStart(2, "0")}`,
        from: "ExecutiveStage",
        to: child,
        kind: "Owns" as const,
        directional: true as const,
        circularOwnershipPermitted: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: index + 1,
      }),
  ),
);

/**
 * Structural invariants declared here; verified in EX-1:4.
 */
export const ExecutiveStageStructuralInvariants = Object.freeze([
  Object.freeze({
    invariantId: "EX-1:3/Invariant/01",
    name: "One Stage root",
    cardinality: "ExactlyOne",
    subject: "ExecutiveStage",
  }),
  Object.freeze({
    invariantId: "EX-1:3/Invariant/02",
    name: "One Surface",
    cardinality: "ExactlyOne",
    subject: "Surface",
  }),
  Object.freeze({
    invariantId: "EX-1:3/Invariant/03",
    name: "One Viewport",
    cardinality: "ExactlyOne",
    subject: "Viewport",
  }),
  Object.freeze({
    invariantId: "EX-1:3/Invariant/04",
    name: "One Overlay root",
    cardinality: "ExactlyOne",
    subject: "Overlay",
  }),
  Object.freeze({
    invariantId: "EX-1:3/Invariant/05",
    name: "One Focus model",
    cardinality: "ExactlyOne",
    subject: "Focus",
  }),
  Object.freeze({
    invariantId: "EX-1:3/Invariant/06",
    name: "Fixed layer ordering",
    cardinality: "ExactlyOrdered",
    subject: "Layers",
  }),
  Object.freeze({
    invariantId: "EX-1:3/Invariant/07",
    name: "Immutable Runtime references",
    cardinality: "Immutable",
    subject: "RuntimeBindings",
  }),
] as const);

/** Model principles. */
export const ExecutiveStageModelPrinciples = Object.freeze([
  Object.freeze({
    principleId: "EX-1:3/Principle/01",
    name: "One Canonical Stage Model",
    description: "One canonical Stage Model exists.",
  }),
  Object.freeze({
    principleId: "EX-1:3/Principle/02",
    name: "Runtime Projection",
    description:
      "The Stage is a Runtime projection. It never owns business state.",
  }),
  Object.freeze({
    principleId: "EX-1:3/Principle/03",
    name: "Immutable Visual Identities",
    description: "All visual entities have immutable identities.",
  }),
  Object.freeze({
    principleId: "EX-1:3/Principle/04",
    name: "Explicit Relationships",
    description:
      "Relationships are explicit. Implicit visual dependencies are prohibited.",
  }),
  Object.freeze({
    principleId: "EX-1:3/Principle/05",
    name: "Rendering Technology Independent",
    description: "The model remains independent of rendering technology.",
  }),
] as const);

/** Extension strategy — optional fields only; core structure locked. */
export const ExecutiveStageModelExtensionStrategy = Object.freeze({
  strategyId: "EX-1:3/ExtensionStrategy",
  mayExtendWithOptionalFields: true as const,
  mayNotRenameRootEntities: true as const,
  mayNotAlterOwnership: true as const,
  mayNotChangeRuntimeBindingRules: true as const,
  mayNotReorderCanonicalLayers: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Prohibited surfaces. */
export const ExecutiveStageModelProhibitedSurfaces = Object.freeze([
  "render UI",
  "execute interactions",
  "object animation",
  "modify Runtime",
  "calculate layouts",
  "invoke AI",
  "perform business reasoning",
  "React rendering",
] as const);

/** Runtime binding reference rules. */
export const ExecutiveStageRuntimeReferenceRules = Object.freeze([
  Object.freeze({
    ruleId: "EX-1:3/ReferenceRule/01",
    name: "Immutable Runtime References",
    description: "Every Stage entity references Runtime through immutable identifiers.",
  }),
  Object.freeze({
    ruleId: "EX-1:3/ReferenceRule/02",
    name: "No Direct Runtime Mutation",
    description: "Direct Runtime mutation from the Stage Model is prohibited.",
  }),
  Object.freeze({
    ruleId: "EX-1:3/ReferenceRule/03",
    name: "Business Data Remains In Runtime",
    description: "Business data remains inside Runtime; Stage holds structure only.",
  }),
] as const);
