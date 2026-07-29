/**
 * RTC-1:1 — Executive Context Runtime Metadata.
 *
 * Responsibilities, guarantees, principles, consumers, activation sources,
 * ownership, and prohibited surfaces. Metadata only.
 *
 * Ownership: owned exclusively by RTC-1:1.
 */

import {
  ExecutiveContextRuntimeFoundationId,
  ExecutiveContextRuntimeFoundationName,
  ExecutiveContextRuntimeFoundationNamespace,
  ExecutiveContextRuntimeFoundationNextPhase,
  ExecutiveContextRuntimeFoundationReadiness,
  ExecutiveContextRuntimeFoundationStatus,
  ExecutiveContextRuntimeFoundationVersion,
  ExecutiveContextRuntimeIdentity,
} from "./executiveContextRuntimeIdentity.ts";
import { ExecutiveContextRuntimeContracts } from "./executiveContextRuntimeContracts.ts";
import { ExecutiveContextRuntimeEvents } from "./executiveContextRuntimeEvents.ts";
import { ExecutiveContextRuntimeLifecycle } from "./executiveContextRuntimeLifecycle.ts";
import type {
  ExecutiveContextActivationSourceDeclaration,
  ExecutiveContextRuntimeConsumerDeclaration,
  ExecutiveContextRuntimeConsumerName,
} from "./executiveContextRuntimeTypes.ts";

const consumer = (
  consumerName: ExecutiveContextRuntimeConsumerName,
  order: number,
): ExecutiveContextRuntimeConsumerDeclaration =>
  Object.freeze({
    consumerId: `RTC-1:1/Consumer/${consumerName}` as const,
    consumerName,
    accessMode: "ReadOnly" as const,
    mayMutateContext: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const activation = (
  category: ExecutiveContextActivationSourceDeclaration["category"],
  action: string,
  description: string,
  order: number,
): ExecutiveContextActivationSourceDeclaration =>
  Object.freeze({
    sourceId: `RTC-1:1/Activation/${category}/${action}` as const,
    category,
    action,
    description,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Foundation principles. */
export const ExecutiveContextRuntimePrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-1:1/Principle/01",
    name: "Single Source of Truth",
    description: "There shall be exactly one active Executive Context.",
  }),
  Object.freeze({
    principleId: "RTC-1:1/Principle/02",
    name: "Context Before UI",
    description: "UI never decides state. Runtime owns state. UI only renders runtime.",
  }),
  Object.freeze({
    principleId: "RTC-1:1/Principle/03",
    name: "Context Is Immutable",
    description:
      "Every modification creates a new context snapshot. Previous contexts remain reproducible.",
  }),
  Object.freeze({
    principleId: "RTC-1:1/Principle/04",
    name: "Context Drives Experience",
    description:
      "Changing context automatically changes Stage, Journal, Timeline, and Advisor without direct communication between them.",
  }),
  Object.freeze({
    principleId: "RTC-1:1/Principle/05",
    name: "No Business Logic",
    description:
      "RTC Foundation contains no KPI calculations, AI reasoning, pack analysis, or workspace intelligence.",
  }),
] as const);

/** Runtime responsibilities owned by Foundation. */
export const ExecutiveContextRuntimeResponsibilities = Object.freeze([
  "Context creation",
  "Context activation",
  "Context replacement",
  "Context history registration",
  "Snapshot generation",
  "Runtime notifications",
  "Context integrity",
] as const);

/** Runtime guarantees. */
export const ExecutiveContextRuntimeGuarantees = Object.freeze([
  "deterministic state",
  "reproducible history",
  "immutable snapshots",
  "single active context",
  "stable runtime identity",
  "predictable lifecycle",
] as const);

/** Surfaces Foundation shall never own. */
export const ExecutiveContextRuntimeProhibitedSurfaces = Object.freeze([
  "render UI",
  "open packs",
  "perform AI reasoning",
  "analyse business data",
  "calculate KPIs",
  "animate objects",
  "control Director",
  "execute Workspace logic",
  "React",
  "Next.js",
  "rendering",
  "animations",
  "business intelligence algorithms",
] as const);

/** Read-only runtime consumers. */
export const ExecutiveContextRuntimeConsumers:
  readonly ExecutiveContextRuntimeConsumerDeclaration[] = Object.freeze([
    consumer("DirectorRuntime", 1),
    consumer("ExecutiveJournalRuntime", 2),
    consumer("TimelineRuntime", 3),
    consumer("StageRuntime", 4),
    consumer("WorkspaceRuntime", 5),
    consumer("AssistantRuntime", 6),
  ]);

/** Declared context activation sources. */
export const ExecutiveContextActivationSources:
  readonly ExecutiveContextActivationSourceDeclaration[] = Object.freeze([
    activation("Manager", "object-click", "Manager selects an executive object.", 1),
    activation("Manager", "pack-open", "Manager opens a pack.", 2),
    activation("Manager", "workspace-change", "Manager changes workspace.", 3),
    activation("Manager", "timeline-movement", "Manager moves along the timeline.", 4),
    activation("Manager", "advisor-request", "Manager requests advisor action.", 5),
    activation("Runtime", "data-refresh", "Runtime refreshes authoritative data.", 6),
    activation("Runtime", "object-evolution", "Runtime evolves a focused object.", 7),
    activation("Runtime", "pack-evolution", "Runtime evolves an active pack.", 8),
    activation("System", "login", "System establishes an executive session.", 9),
    activation("System", "restore-session", "System restores a prior executive session.", 10),
    activation("System", "company-switch", "System switches the active company.", 11),
  ]);

/** Ownership declaration. */
export const ExecutiveContextRuntimeOwnership = Object.freeze({
  ownershipId: "RTC-1:1/ExecutiveContextRuntimeOwnership",
  sourcePhase: "RTC-1:1" as const,
  owns: Object.freeze([
    "Context creation contracts",
    "Context activation contracts",
    "Context replacement contracts",
    "Context history registration contracts",
    "Snapshot generation contracts",
    "Runtime notification contracts",
    "Context integrity contracts",
    "Lifecycle vocabulary",
    "Event vocabulary",
    "Identity format",
  ] as const),
  doesNotOwn: ExecutiveContextRuntimeProhibitedSurfaces,
  rootRuntimePackage: true as const,
  downstreamRuntimeDependency: false as const,
  ownsUi: false as const,
  ownsBusinessLogic: false as const,
  ownsAiReasoning: false as const,
  ownsKpiCalculation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Architectural boundaries. */
export const ExecutiveContextRuntimeBoundaries = Object.freeze({
  boundariesId: "RTC-1:1/ExecutiveContextRuntimeBoundaries",
  sourcePhase: "RTC-1:1" as const,
  dependsOnRuntimeModules: false as const,
  downstreamDependencyPermitted: false as const,
  consumersReadOnly: true as const,
  onlyRuntimeContextMutatesItself: true as const,
  contextsNeverModifyEachOther: true as const,
  newContextAlwaysProduced: true as const,
  prohibitedSurfaces: ExecutiveContextRuntimeProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "NoDownstreamRuntimeDependencies",
    "RootRuntimePackage",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoBusinessIntelligence",
    "NoRegistryModelValidationManifestPlatform",
  ] as const),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Snapshot philosophy declaration. */
export const ExecutiveContextSnapshotPhilosophy = Object.freeze({
  philosophyId: "RTC-1:1/SnapshotPhilosophy",
  sourcePhase: "RTC-1:1" as const,
  sequence: Object.freeze([
    "Object Selected",
    "Context Snapshot",
    "Timeline replay",
    "Stage reconstruction",
    "Journal reconstruction",
  ] as const),
  enablesHistoricalReconstruction: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Foundation constants. */
export const ExecutiveContextRuntimeFoundationConstants = Object.freeze({
  phaseIdentifier: "RTC-1:1",
  canonicalIdentifier: ExecutiveContextRuntimeFoundationId,
  version: ExecutiveContextRuntimeFoundationVersion,
  name: ExecutiveContextRuntimeFoundationName,
  namespace: ExecutiveContextRuntimeFoundationNamespace,
  status: ExecutiveContextRuntimeFoundationStatus,
  readiness: ExecutiveContextRuntimeFoundationReadiness,
  nextPhase: ExecutiveContextRuntimeFoundationNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Context Runtime",
  ownership: "RTC-1 Executive Context Runtime Foundation",
  contractCount: ExecutiveContextRuntimeContracts.length,
  eventCount: ExecutiveContextRuntimeEvents.length,
  lifecycleStateCount: ExecutiveContextRuntimeLifecycle.stateCount,
  consumerCount: ExecutiveContextRuntimeConsumers.length,
  responsibilityCount: ExecutiveContextRuntimeResponsibilities.length,
  guaranteeCount: ExecutiveContextRuntimeGuarantees.length,
  principleCount: ExecutiveContextRuntimePrinciples.length,
  activationSourceCount: ExecutiveContextActivationSources.length,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveContextRuntimeMetadata = Object.freeze({
  identity: ExecutiveContextRuntimeIdentity,
  constants: ExecutiveContextRuntimeFoundationConstants,
  principles: ExecutiveContextRuntimePrinciples,
  responsibilities: ExecutiveContextRuntimeResponsibilities,
  guarantees: ExecutiveContextRuntimeGuarantees,
  consumers: ExecutiveContextRuntimeConsumers,
  activationSources: ExecutiveContextActivationSources,
  ownership: ExecutiveContextRuntimeOwnership,
  boundaries: ExecutiveContextRuntimeBoundaries,
  snapshotPhilosophy: ExecutiveContextSnapshotPhilosophy,
  readiness: ExecutiveContextRuntimeFoundationReadiness,
  nextPhase: ExecutiveContextRuntimeFoundationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
