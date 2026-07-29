/**
 * EX-1:2 — Executive Stage Registry Metadata.
 *
 * Registry identity, entry contracts, and companion domains without dedicated
 * deliverable files (Stage, Focus, Relationship, Visual State, Metadata).
 * Identities only — no rendering or Runtime behaviour.
 *
 * Ownership: owned exclusively by EX-1:2.
 */

import { ExecutiveStageFoundationId } from "./executiveStageTypes.ts";

/** Registry status. */
export type ExecutiveStageRegistryStatus = "Registry";

/** Immediate next-phase readiness. */
export type ExecutiveStageRegistryReadiness = "ReadyForModel";

/** Registry domain names. */
export type ExecutiveStageRegistryDomain =
  | "Stage"
  | "Layer"
  | "Object"
  | "Focus"
  | "Relationship"
  | "Interaction"
  | "Layout"
  | "Overlay"
  | "VisualState"
  | "Metadata";

/** Immutable registry entry — identities only. */
export interface ExecutiveStageRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domain: ExecutiveStageRegistryDomain;
  readonly canonicalIdentity: string;
  readonly version: "1.0.0";
  readonly status: "Registered";
  readonly order: number;
  readonly immutableIdentity: true;
  readonly rendersUi: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Register deterministic immutable domain entries. */
export const registerExecutiveStageEntries = (
  domain: ExecutiveStageRegistryDomain,
  source: readonly {
    readonly name: string;
    readonly description: string;
  }[],
): readonly ExecutiveStageRegistryEntry[] =>
  Object.freeze(
    source.map((entry, index) =>
      Object.freeze({
        id: `EX-1:2/${domain}/${String(index + 1).padStart(2, "0")}`,
        name: entry.name,
        description: entry.description,
        domain,
        canonicalIdentity: `EX-1:2/${domain}/${entry.name.replace(/\s+/g, "")}`,
        version: "1.0.0" as const,
        status: "Registered" as const,
        order: index + 1,
        immutableIdentity: true as const,
        rendersUi: false as const,
        executable: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Canonical registry identity. */
export const ExecutiveStageRegistryId =
  "EX-1:2/ExecutiveStageRegistry" as const;

export const ExecutiveStageRegistryName =
  "Executive Stage Registry" as const;

export const ExecutiveStageRegistryVersion = "1.0.0" as const;

export const ExecutiveStageRegistryNamespace =
  "nexora.ex.executive.stage.registry" as const;

export const ExecutiveStageRegistryStatus = "Registry" as const;

export const ExecutiveStageRegistryReadiness = "ReadyForModel" as const;

export const ExecutiveStageRegistryNextPhase =
  "EX-1:3 — Executive Stage Model" as const;

export const ExecutiveStageRegistryIdentity = Object.freeze({
  id: ExecutiveStageRegistryId,
  name: ExecutiveStageRegistryName,
  phaseId: "EX-1:2" as const,
  version: ExecutiveStageRegistryVersion,
  namespace: ExecutiveStageRegistryNamespace,
  status: ExecutiveStageRegistryStatus,
  readiness: ExecutiveStageRegistryReadiness,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Stage" as const,
  canonical: true as const,
  mutable: false as const,
  sourceFoundation: ExecutiveStageFoundationId,
  upstream: "EX-1:1 — Executive Stage Foundation" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveStageRegistryNextPhase,
  description:
    "Canonical catalogue of every visual identity that may participate in the Executive Stage. Identities only — no rendering, animation, or Runtime behaviour.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Ordered registry domains. */
export const ExecutiveStageRegistryDomains = Object.freeze([
  "Stage",
  "Layer",
  "Object",
  "Focus",
  "Relationship",
  "Interaction",
  "Layout",
  "Overlay",
  "VisualState",
  "Metadata",
] as const satisfies readonly ExecutiveStageRegistryDomain[]);

/** Stage Registry — root Stage identities. */
export const ExecutiveStageIdentityRegistry = registerExecutiveStageEntries(
  "Stage",
  Object.freeze([
    {
      name: "Executive Stage",
      description: "Root Executive Stage visual identity.",
    },
    {
      name: "Executive Shell",
      description: "Root Executive Shell visual identity.",
    },
    {
      name: "Stage Surface",
      description: "Stage Surface visual identity.",
    },
  ]),
);

/** Focus Registry — focus identities only. */
export const ExecutiveStageFocusRegistry = registerExecutiveStageEntries(
  "Focus",
  Object.freeze([
    {
      name: "No Focus",
      description: "Absence of executive focus.",
    },
    {
      name: "Object Focus",
      description: "Focus on a Stage object.",
    },
    {
      name: "Workspace Focus",
      description: "Focus on a Workspace scope.",
    },
    {
      name: "Pack Focus",
      description: "Focus on a Pack scope.",
    },
    {
      name: "Timeline Focus",
      description: "Focus on a Timeline position.",
    },
  ]),
);

/** Relationship Registry — relationship identities only. */
export const ExecutiveStageRelationshipRegistry = registerExecutiveStageEntries(
  "Relationship",
  Object.freeze([
    {
      name: "Direct Relationship",
      description: "Direct visual relationship identity.",
    },
    {
      name: "Dependency",
      description: "Dependency relationship identity.",
    },
    {
      name: "Reference",
      description: "Reference relationship identity.",
    },
    {
      name: "Association",
      description: "Association relationship identity.",
    },
    {
      name: "Placeholder Relationship",
      description: "Placeholder relationship identity.",
    },
  ]),
);

/** Visual State Registry — only one may be active at a time. */
export const ExecutiveStageVisualStateRegistry = registerExecutiveStageEntries(
  "VisualState",
  Object.freeze([
    {
      name: "Initializing",
      description: "Stage is initializing.",
    },
    {
      name: "Loading",
      description: "Stage is loading.",
    },
    {
      name: "Ready",
      description: "Stage is ready for projection.",
    },
    {
      name: "Empty",
      description: "Stage has no visible content.",
    },
    {
      name: "Error",
      description: "Stage reports an error visual state.",
    },
  ]),
);

/** Metadata Registry — immutable Stage metadata categories. */
export const ExecutiveStageMetadataRegistry = registerExecutiveStageEntries(
  "Metadata",
  Object.freeze([
    {
      name: "Identity",
      description: "Stage identity metadata category.",
    },
    {
      name: "Version",
      description: "Stage version metadata category.",
    },
    {
      name: "Layer Order",
      description: "Canonical layer order metadata category.",
    },
    {
      name: "Registry Version",
      description: "Stage registry version metadata category.",
    },
    {
      name: "Created Timestamp",
      description: "Stage created timestamp metadata category.",
    },
  ]),
);

/** Registry principles. */
export const ExecutiveStageRegistryPrinciples = Object.freeze([
  Object.freeze({
    principleId: "EX-1:2/Principle/01",
    name: "Identities Only",
    description: "Registry contains identities only.",
  }),
  Object.freeze({
    principleId: "EX-1:2/Principle/02",
    name: "Unique Visual Identities",
    description: "Every visual identity is unique.",
  }),
  Object.freeze({
    principleId: "EX-1:2/Principle/03",
    name: "No Rendering Logic",
    description: "Registry contains no rendering logic.",
  }),
  Object.freeze({
    principleId: "EX-1:2/Principle/04",
    name: "Deterministic Catalogue",
    description: "Registry is deterministic.",
  }),
  Object.freeze({
    principleId: "EX-1:2/Principle/05",
    name: "Runtime Independent",
    description:
      "Registry references Runtime identities but never owns Runtime state.",
  }),
] as const);

/** Registry guarantees. */
export const ExecutiveStageRegistryGuarantees = Object.freeze([
  "unique identities",
  "deterministic ordering",
  "immutable registration",
  "forward-compatible extension",
  "canonical layer ordering",
  "stable visual vocabulary",
] as const);

/** Identity-level relationships only. */
export const ExecutiveStageRegistryRelationships = Object.freeze([
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/01",
    from: "Executive Stage",
    to: "Layers",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/02",
    from: "Executive Stage",
    to: "Objects",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/03",
    from: "Executive Stage",
    to: "Focus",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/04",
    from: "Executive Stage",
    to: "Relationships",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/05",
    from: "Executive Stage",
    to: "Interactions",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/06",
    from: "Executive Stage",
    to: "Overlays",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "EX-1:2/Relationship/07",
    from: "Executive Stage",
    to: "Visual States",
    kind: "MayInclude",
  }),
] as const);

/** Prohibited surfaces. */
export const ExecutiveStageRegistryProhibitedSurfaces = Object.freeze([
  "render UI",
  "manage Runtime",
  "execute interactions",
  "component animation",
  "calculate layout",
  "own visual state",
  "invoke Runtime services",
  "React rendering",
] as const);

/** Publication metadata aggregate. */
export const ExecutiveStageRegistryMetadata = Object.freeze({
  identity: ExecutiveStageRegistryIdentity,
  domains: ExecutiveStageRegistryDomains,
  stages: ExecutiveStageIdentityRegistry,
  focuses: ExecutiveStageFocusRegistry,
  relationships: ExecutiveStageRelationshipRegistry,
  visualStates: ExecutiveStageVisualStateRegistry,
  metadataCategories: ExecutiveStageMetadataRegistry,
  principles: ExecutiveStageRegistryPrinciples,
  guarantees: ExecutiveStageRegistryGuarantees,
  identityRelationships: ExecutiveStageRegistryRelationships,
  prohibitedSurfaces: ExecutiveStageRegistryProhibitedSurfaces,
  namespace: ExecutiveStageRegistryNamespace,
  readiness: ExecutiveStageRegistryReadiness,
  releaseState: ExecutiveStageRegistryStatus,
  nextPhase: ExecutiveStageRegistryNextPhase,
  foundationCompatible: true as const,
  ownsRuntimeState: false as const,
  rendersUi: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
