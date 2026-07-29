/**
 * RTC-1:2 — Executive Runtime Registry Metadata.
 *
 * Registry identity, entry contracts, metadata domain, and companion domains
 * without dedicated deliverable files (Manager, Company, Journal, Advisor,
 * Director, Stage). Definitions only — no runtime values.
 *
 * Ownership: owned exclusively by RTC-1:2.
 */

import { ExecutiveContextRuntimeFoundationId } from "./executiveContextRuntimeFoundation.ts";

/** Registry status. */
export type ExecutiveContextRuntimeRegistryStatus = "Registry";

/** Immediate next-phase readiness. */
export type ExecutiveContextRuntimeRegistryReadiness = "ReadyForModel";

/** Registry domain names. */
export type ExecutiveRuntimeRegistryDomain =
  | "Context"
  | "Manager"
  | "Company"
  | "Workspace"
  | "Pack"
  | "Object"
  | "Timeline"
  | "Journal"
  | "Advisor"
  | "Director"
  | "Stage"
  | "Metadata";

/** Immutable registry entry — definitions only, never runtime values. */
export interface ExecutiveRuntimeRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domain: ExecutiveRuntimeRegistryDomain;
  readonly canonicalIdentity: string;
  readonly version: "1.0.0";
  readonly status: "Registered";
  readonly order: number;
  readonly immutableIdentity: true;
  readonly storesRuntimeValues: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Register deterministic immutable domain entries. */
export const registerExecutiveRuntimeEntries = (
  domain: ExecutiveRuntimeRegistryDomain,
  source: readonly {
    readonly name: string;
    readonly description: string;
  }[],
): readonly ExecutiveRuntimeRegistryEntry[] =>
  Object.freeze(
    source.map((entry, index) =>
      Object.freeze({
        id: `RTC-1:2/${domain}/${String(index + 1).padStart(2, "0")}`,
        name: entry.name,
        description: entry.description,
        domain,
        canonicalIdentity: `RTC-1:2/${domain}/${entry.name.replace(/\s+/g, "")}`,
        version: "1.0.0" as const,
        status: "Registered" as const,
        order: index + 1,
        immutableIdentity: true as const,
        storesRuntimeValues: false as const,
        executable: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Canonical registry identity. */
export const ExecutiveContextRuntimeRegistryId =
  "RTC-1:2/ExecutiveContextRuntimeRegistry" as const;

export const ExecutiveContextRuntimeRegistryName =
  "Executive Context Runtime Registry" as const;

export const ExecutiveContextRuntimeRegistryVersion = "1.0.0" as const;

export const ExecutiveContextRuntimeRegistryNamespace =
  "nexora.rtc.executive.context.registry" as const;

export const ExecutiveContextRuntimeRegistryStatus = "Registry" as const;

export const ExecutiveContextRuntimeRegistryReadiness =
  "ReadyForModel" as const;

export const ExecutiveContextRuntimeRegistryNextPhase =
  "RTC-1:3 — Executive Context Runtime Model" as const;

export const ExecutiveContextRuntimeRegistryIdentity = Object.freeze({
  id: ExecutiveContextRuntimeRegistryId,
  name: ExecutiveContextRuntimeRegistryName,
  phaseId: "RTC-1:2" as const,
  version: ExecutiveContextRuntimeRegistryVersion,
  namespace: ExecutiveContextRuntimeRegistryNamespace,
  status: ExecutiveContextRuntimeRegistryStatus,
  stage: ExecutiveContextRuntimeRegistryReadiness,
  readiness: ExecutiveContextRuntimeRegistryReadiness,
  layer: "Runtime Layer" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Context Runtime" as const,
  canonical: true as const,
  mutable: false as const,
  sourceFoundation: ExecutiveContextRuntimeFoundationId,
  upstream: "RTC-1:1 — Executive Context Runtime Foundation" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveContextRuntimeRegistryNextPhase,
  description:
    "Canonical directory of every runtime identity that may participate in an Executive Context. Definitions only — no state, implementation, validation, or rendering.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Ordered registry domains. */
export const ExecutiveRuntimeRegistryDomains = Object.freeze([
  "Context",
  "Manager",
  "Company",
  "Workspace",
  "Pack",
  "Object",
  "Timeline",
  "Journal",
  "Advisor",
  "Director",
  "Stage",
  "Metadata",
] as const satisfies readonly ExecutiveRuntimeRegistryDomain[]);

/** Manager Registry — executive runtime identities only. */
export const ExecutiveManagerRegistry = registerExecutiveRuntimeEntries(
  "Manager",
  Object.freeze([
    {
      name: "Executive",
      description: "Primary executive runtime identity.",
    },
    {
      name: "Manager",
      description: "Manager runtime identity within Executive Context.",
    },
    {
      name: "Observer",
      description: "Observer runtime identity with read participation.",
    },
    {
      name: "Guest",
      description: "Guest runtime identity with limited participation.",
    },
  ]),
);

/** Company Registry — canonical company reference categories. */
export const ExecutiveCompanyRegistry = registerExecutiveRuntimeEntries(
  "Company",
  Object.freeze([
    {
      name: "Company",
      description: "Canonical company runtime category.",
    },
    {
      name: "Business Unit",
      description: "Business unit runtime category.",
    },
    {
      name: "Division",
      description: "Division runtime category.",
    },
    {
      name: "Portfolio",
      description: "Portfolio runtime category.",
    },
  ]),
);

/** Journal Registry — journal runtime entities. */
export const ExecutiveJournalRegistry = registerExecutiveRuntimeEntries(
  "Journal",
  Object.freeze([
    {
      name: "Executive Journal",
      description: "Primary executive journal runtime entity.",
    },
    {
      name: "Pack",
      description: "Pack journal runtime entity.",
    },
    {
      name: "Conversation",
      description: "Conversation journal runtime entity.",
    },
    {
      name: "Attachment",
      description: "Attachment journal runtime entity.",
    },
    {
      name: "Action",
      description: "Action journal runtime entity.",
    },
    {
      name: "Insight",
      description: "Insight journal runtime entity.",
    },
  ]),
);

/** Advisor Registry — advisor runtime identities. No AI reasoning. */
export const ExecutiveAdvisorRegistry = registerExecutiveRuntimeEntries(
  "Advisor",
  Object.freeze([
    {
      name: "Executive Advisor",
      description: "Primary executive advisor runtime identity.",
    },
    {
      name: "Suggestion",
      description: "Advisor suggestion runtime identity.",
    },
    {
      name: "Approval",
      description: "Advisor approval runtime identity.",
    },
    {
      name: "Question",
      description: "Advisor question runtime identity.",
    },
    {
      name: "Explanation",
      description: "Advisor explanation runtime identity.",
    },
    {
      name: "Recommendation",
      description: "Advisor recommendation runtime identity.",
    },
  ]),
);

/** Director Registry — scene-direction identities. No rendering. */
export const ExecutiveDirectorRegistry = registerExecutiveRuntimeEntries(
  "Director",
  Object.freeze([
    {
      name: "Stage Direction",
      description: "Stage direction runtime identity.",
    },
    {
      name: "Focus",
      description: "Director focus runtime identity.",
    },
    {
      name: "Highlight",
      description: "Director highlight runtime identity.",
    },
    {
      name: "Composition",
      description: "Director composition runtime identity.",
    },
    {
      name: "Workspace Transition",
      description: "Workspace transition direction identity.",
    },
  ]),
);

/** Stage Registry — stage-level runtime entities. Rendering belongs to EVE. */
export const ExecutiveStageRegistry = registerExecutiveRuntimeEntries(
  "Stage",
  Object.freeze([
    {
      name: "Stage",
      description: "Primary stage runtime entity.",
    },
    {
      name: "Layer",
      description: "Stage layer runtime entity.",
    },
    {
      name: "Object Focus",
      description: "Object focus stage runtime entity.",
    },
    {
      name: "Relationship Layer",
      description: "Relationship layer stage runtime entity.",
    },
    {
      name: "Visualization Layer",
      description: "Visualization layer stage runtime entity.",
    },
  ]),
);

/** Metadata Registry — immutable runtime metadata categories. */
export const ExecutiveMetadataRegistry = registerExecutiveRuntimeEntries(
  "Metadata",
  Object.freeze([
    {
      name: "Identity",
      description: "Runtime identity metadata category.",
    },
    {
      name: "Version",
      description: "Runtime version metadata category.",
    },
    {
      name: "Timestamp",
      description: "Runtime timestamp metadata category.",
    },
    {
      name: "Snapshot",
      description: "Runtime snapshot metadata category.",
    },
    {
      name: "Runtime Source",
      description: "Runtime source metadata category.",
    },
    {
      name: "Context Origin",
      description: "Context origin metadata category.",
    },
  ]),
);

/** Registry principles. */
export const ExecutiveRuntimeRegistryPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-1:2/Principle/01",
    name: "Definitions Only",
    description: "Registry contains definitions, never runtime values.",
  }),
  Object.freeze({
    principleId: "RTC-1:2/Principle/02",
    name: "Unique Identities",
    description: "Every runtime identity appears exactly once.",
  }),
  Object.freeze({
    principleId: "RTC-1:2/Principle/03",
    name: "Immutable Entries",
    description: "Registry entries are immutable.",
  }),
  Object.freeze({
    principleId: "RTC-1:2/Principle/04",
    name: "No Business Logic",
    description: "Registry contains no business logic.",
  }),
  Object.freeze({
    principleId: "RTC-1:2/Principle/05",
    name: "Deterministic Catalogue",
    description:
      "Given the same source, the same Registry is always produced.",
  }),
] as const);

/** Registry guarantees. */
export const ExecutiveRuntimeRegistryGuarantees = Object.freeze([
  "Unique identities",
  "Stable ordering",
  "Immutable registration",
  "Deterministic lookup",
  "Extension compatibility",
  "Foundation compatibility",
] as const);

/** Identity-level relationships only. Behaviour is defined later. */
export const ExecutiveRuntimeRegistryRelationships = Object.freeze([
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/01",
    from: "Context",
    to: "Workspace",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/02",
    from: "Context",
    to: "Pack",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/03",
    from: "Context",
    to: "Object",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/04",
    from: "Context",
    to: "Timeline",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/05",
    from: "Context",
    to: "Journal",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/06",
    from: "Context",
    to: "Advisor",
    kind: "MayInclude",
  }),
  Object.freeze({
    relationshipId: "RTC-1:2/Relationship/07",
    from: "Context",
    to: "Stage",
    kind: "MayInclude",
  }),
] as const);

/** Surfaces Registry shall never own. */
export const ExecutiveRuntimeRegistryProhibitedSurfaces = Object.freeze([
  "Store runtime values",
  "Execute transitions",
  "Hold active context",
  "Perform validation",
  "Execute lifecycle",
  "Modify state",
  "Communicate with UI",
  "Render Stage",
  "Process Timeline",
  "React",
  "Next.js",
  "AI reasoning",
  "Business logic",
] as const);

/** Publication metadata aggregate. */
export const ExecutiveRuntimeRegistryMetadata = Object.freeze({
  identity: ExecutiveContextRuntimeRegistryIdentity,
  domains: ExecutiveRuntimeRegistryDomains,
  managers: ExecutiveManagerRegistry,
  companies: ExecutiveCompanyRegistry,
  journals: ExecutiveJournalRegistry,
  advisors: ExecutiveAdvisorRegistry,
  directors: ExecutiveDirectorRegistry,
  stages: ExecutiveStageRegistry,
  metadataCategories: ExecutiveMetadataRegistry,
  principles: ExecutiveRuntimeRegistryPrinciples,
  guarantees: ExecutiveRuntimeRegistryGuarantees,
  relationships: ExecutiveRuntimeRegistryRelationships,
  prohibitedSurfaces: ExecutiveRuntimeRegistryProhibitedSurfaces,
  namespace: ExecutiveContextRuntimeRegistryNamespace,
  readiness: ExecutiveContextRuntimeRegistryReadiness,
  releaseState: ExecutiveContextRuntimeRegistryStatus,
  nextPhase: ExecutiveContextRuntimeRegistryNextPhase,
  foundationCompatible: true as const,
  storesRuntimeValues: false as const,
  executesTransitions: false as const,
  performsValidation: false as const,
  executesLifecycle: false as const,
  renderingBehavior: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
