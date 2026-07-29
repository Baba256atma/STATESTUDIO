/**
 * EX-2:2 — Executive Journal Experience Registry Metadata.
 *
 * Principles, authorization reference, dependency boundaries, previous/next
 * phase metadata, and upstream open issues/gates by Foundation reference.
 * Metadata-only. Does not expand authorization or resolve open issues.
 *
 * Ownership: owned exclusively by EX-2:2.
 *
 * AD-EX2-09 is represented by stable authorization ID and closed descriptor
 * only — no production import of the architecture aggregate.
 */

import {
  ExecutiveJournalExperienceFoundation,
  getExecutiveJournalExperienceFoundationSummary,
} from "./executiveJournalExperienceFoundation.ts";
import { ExecutiveJournalExperienceRegistryContracts } from "./executiveJournalExperienceRegistryContracts.ts";
import { ExecutiveJournalExperienceRegistryCanonicalEntries } from "./executiveJournalExperienceRegistryEntries.ts";
import {
  ExecutiveJournalExperienceRegistryId,
  ExecutiveJournalExperienceRegistryNamespace,
  ExecutiveJournalExperienceRegistryNextPhase,
  ExecutiveJournalExperienceRegistryPreviousPhase,
  ExecutiveJournalExperienceRegistryReadinessValue,
  ExecutiveJournalExperienceRegistryStatusValue,
  ExecutiveJournalExperienceRegistryTitle,
} from "./executiveJournalExperienceRegistryIdentity.ts";
import { ExecutiveJournalExperienceRegistryLifecycle } from "./executiveJournalExperienceRegistryLifecycle.ts";

/**
 * Ordered immutable Registry principles.
 * Each principle is unique, ordered, immutable, and directly testable.
 */
export const ExecutiveJournalExperienceRegistryPrinciples = Object.freeze([
  Object.freeze({
    principleId: "EX-2:2/Principle/01" as const,
    order: 1 as const,
    name: "Closed-world fail-closed discovery" as const,
    statement:
      "Registry discovery is closed-world and fail-closed." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/02" as const,
    order: 2 as const,
    name: "Exact Foundation reference" as const,
    statement:
      "EX-2:1 is registered by exact reference, never recreated." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/03" as const,
    order: 3 as const,
    name: "Authoritative case-sensitive identities" as const,
    statement:
      "Canonical IDs and namespaces are authoritative and case-sensitive." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/04" as const,
    order: 4 as const,
    name: "Explicit non-colliding aliases" as const,
    statement:
      "Aliases are explicit and cannot collide with canonical identities or namespaces." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/05" as const,
    order: 5 as const,
    name: "Sealed immutability" as const,
    statement: "A sealed Registry cannot be mutated." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/06" as const,
    order: 6 as const,
    name: "No lookup normalization" as const,
    statement:
      "Lookup performs no normalization, repair or inference." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/07" as const,
    order: 7 as const,
    name: "No product or journal authority" as const,
    statement:
      "Registry metadata cannot create product or journal authority." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/08" as const,
    order: 8 as const,
    name: "Tier-0 evidence only" as const,
    statement:
      "Tier-0 artifacts remain supporting evidence, not formal Registry entries." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/09" as const,
    order: 9 as const,
    name: "Immediate predecessor only" as const,
    statement:
      "EX-2:2 imports only the immediate predecessor production surface." as const,
  }),
  Object.freeze({
    principleId: "EX-2:2/Principle/10" as const,
    order: 10 as const,
    name: "ReadyForModel does not authorize EX-2:3" as const,
    statement:
      "ReadyForModel does not authorize EX-2:3 implementation." as const,
  }),
] as const);

export const ExecutiveJournalExperienceRegistryPrincipleIds = Object.freeze(
  ExecutiveJournalExperienceRegistryPrinciples.map(
    (principle) => principle.principleId,
  ),
);

/**
 * Closed AD-EX2-09 authorization descriptor for Registry production metadata.
 * Stable ID + flags only — does not import architecture aggregate.
 */
export const ExecutiveJournalExperienceRegistryAuthorization = Object.freeze({
  authorizationId: "AD-EX2-09" as const,
  authorizationStatus: "Accepted" as const,
  authorizationScope: "Ex22RegistryImplementationAndVerificationOnly" as const,
  selectedOption: "MetadataOnlyClosedWorldRegistry" as const,
  metadataOnlyRegistryAuthorized: true as const,
  ex22MetadataOnlyRegistryAuthorized: true as const,
  ex22ImplementationAuthorized: true as const,
  ex23Authorized: false as const,
  runtimeBehaviorAuthorized: false as const,
  routeAuthorized: false as const,
  realRtc2ConsumptionAuthorized: false as const,
  productionProviderAuthorized: false as const,
  networkAuthorized: false as const,
  persistenceAuthorized: false as const,
  telemetryAuthorized: false as const,
  publicIndexAuthorized: false as const,
  deploymentAuthorized: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  injectedIntoFoundationLedger: false as const,
} as const);

/** Dependency boundary declaration — production imports Foundation only. */
export const ExecutiveJournalExperienceRegistryDependencyBoundaries =
  Object.freeze({
    boundariesId:
      "EX-2:2/ExecutiveJournalExperienceRegistryDependencyBoundaries" as const,
    mayImport: Object.freeze([
      "executiveJournalExperienceFoundation.ts",
      "associated Foundation types only when required",
    ] as const),
    mustNotImport: Object.freeze([
      "executiveJournalProductArchitecture.ts",
      "EX-2:1 internal component modules for runtime reconstruction",
      "Tier-0 metadata package",
      "Tier-0 provider, adapter, UI, facade or harness",
      "EX-1 runtime or Public Index",
      "RTC-1, RTC-2 or RTC-3 runtime modules",
      "APP-8",
      "React",
      "Next.js",
      "any future EX-2 phase",
    ] as const),
    importsArchitectureAggregate: false as const,
    importsTier0: false as const,
    importsRtc: false as const,
    importsApp8: false as const,
    importsReactOrNext: false as const,
    importsEx23OrLater: false as const,
    clonesOrWrapsFoundation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  } as const);

/**
 * Upstream Foundation surfaces preserved by exact reference.
 * Registry-owned metadata remains distinguishable from Foundation metadata.
 */
export const ExecutiveJournalExperienceRegistryUpstreamPreservation =
  Object.freeze({
    preservationId:
      "EX-2:2/ExecutiveJournalExperienceRegistryUpstreamPreservation" as const,
    foundation: ExecutiveJournalExperienceFoundation,
    foundationIdentity: ExecutiveJournalExperienceFoundation.identity,
    foundationLifecycle: ExecutiveJournalExperienceFoundation.lifecycle,
    foundationBoundaries: ExecutiveJournalExperienceFoundation.boundaries,
    foundationPrinciples: ExecutiveJournalExperienceFoundation.principles,
    foundationDecisions: ExecutiveJournalExperienceFoundation.decisions,
    foundationEvidenceLedger:
      ExecutiveJournalExperienceFoundation.evidenceLedger,
    foundationOpenIssues: ExecutiveJournalExperienceFoundation.openIssues,
    foundationPendingGates: ExecutiveJournalExperienceFoundation.pendingGates,
    foundationAuthorizationScope:
      ExecutiveJournalExperienceFoundation.authorizationScope,
    getFoundationSummary: getExecutiveJournalExperienceFoundationSummary,
    observedByRegistry: true as const,
    mutatedByRegistry: false as const,
    ownershipTransferred: false as const,
    carriedByPhaseUnchanged: "EX-2:1" as const,
    adEx209InjectedIntoFoundationLedger: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  } as const);

/**
 * Open issues and pending gates observed/carried forward by Foundation
 * reference. Registry does not mutate ownership, phase history, or results.
 */
export const ExecutiveJournalExperienceRegistryOpenIssuesAndGates =
  Object.freeze({
    catalogueId:
      "EX-2:2/ExecutiveJournalExperienceRegistryOpenIssuesAndGates" as const,
    openIssues: ExecutiveJournalExperienceFoundation.openIssues,
    pendingGateIds: ExecutiveJournalExperienceFoundation.pendingGates,
    openIssueIds:
      ExecutiveJournalExperienceFoundation.openIssues.issueIds,
    pendingGates:
      ExecutiveJournalExperienceFoundation.openIssues.pendingGates,
    observedByRegistry: true as const,
    carriedForwardByReference: true as const,
    resolvedByRegistry: false as const,
    ownershipMutated: false as const,
    phaseHistoryMutated: false as const,
    gateResultsRemainPending: true as const,
    blocksMetadataOnlyReadyForModel: false as const,
    productionBlockingUnchanged: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  } as const);

/** Previous / next phase metadata — next phase is not created or authorized. */
export const ExecutiveJournalExperienceRegistryPhaseMetadata = Object.freeze({
  phase: "EX-2:2" as const,
  previousPhase: ExecutiveJournalExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveJournalExperienceRegistryNextPhase,
  nextPhaseCreated: false as const,
  nextPhaseAuthorized: false as const,
  ex23Authorized: false as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Surfaces the Registry shall never own. */
export const ExecutiveJournalExperienceRegistryProhibitedSurfaces =
  Object.freeze([
    "React",
    "Next.js",
    "App Router routes",
    "EX-2:3 Model implementation",
    "EX-2:4 through EX-2:9",
    "live RTC-2 integration",
    "production providers",
    "network clients",
    "persistence clients",
    "telemetry emitters",
    "Public Index publication",
    "deployment",
    "APP-8 Decision Journal implementation",
    "Tier-0 UI harness as Registry entry",
    "open-issue resolution by assumption",
  ] as const);

/** Ownership declaration. */
export const ExecutiveJournalExperienceRegistryOwnership = Object.freeze({
  ownershipId: "EX-2:2/ExecutiveJournalExperienceRegistryOwnership" as const,
  sourcePhase: "EX-2:2" as const,
  owns: Object.freeze([
    "Canonical EX-2:1 Foundation registration",
    "Closed-world identity resolution",
    "Alias resolution to canonical entries",
    "Registration conflict rejection",
    "Deterministic Registry summary",
  ] as const),
  doesNotOwn: ExecutiveJournalExperienceRegistryProhibitedSurfaces,
  importsFoundationByReference: true as const,
  recreatesFoundationAggregate: false as const,
  ownsUi: false as const,
  ownsBusinessLogic: false as const,
  ownsProductAuthority: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Publication constants. */
export const ExecutiveJournalExperienceRegistryConstants = Object.freeze({
  phaseIdentifier: "EX-2:2" as const,
  canonicalIdentifier: ExecutiveJournalExperienceRegistryId,
  title: ExecutiveJournalExperienceRegistryTitle,
  namespace: ExecutiveJournalExperienceRegistryNamespace,
  status: ExecutiveJournalExperienceRegistryStatusValue,
  readiness: ExecutiveJournalExperienceRegistryReadinessValue,
  previousPhase: ExecutiveJournalExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveJournalExperienceRegistryNextPhase,
  entryCount: ExecutiveJournalExperienceRegistryCanonicalEntries.length,
  contractCount: ExecutiveJournalExperienceRegistryContracts.length,
  lifecycleStateCount:
    ExecutiveJournalExperienceRegistryLifecycle.stateCount,
  principleCount: ExecutiveJournalExperienceRegistryPrinciples.length,
  authorizingDecisionId: "AD-EX2-09" as const,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveJournalExperienceRegistryMetadata = Object.freeze({
  constants: ExecutiveJournalExperienceRegistryConstants,
  principles: ExecutiveJournalExperienceRegistryPrinciples,
  principleIds: ExecutiveJournalExperienceRegistryPrincipleIds,
  authorization: ExecutiveJournalExperienceRegistryAuthorization,
  dependencyBoundaries:
    ExecutiveJournalExperienceRegistryDependencyBoundaries,
  upstream: ExecutiveJournalExperienceRegistryUpstreamPreservation,
  openIssuesAndGates:
    ExecutiveJournalExperienceRegistryOpenIssuesAndGates,
  phaseMetadata: ExecutiveJournalExperienceRegistryPhaseMetadata,
  ownership: ExecutiveJournalExperienceRegistryOwnership,
  prohibitedSurfaces: ExecutiveJournalExperienceRegistryProhibitedSurfaces,
  readiness: ExecutiveJournalExperienceRegistryReadinessValue,
  nextPhase: ExecutiveJournalExperienceRegistryNextPhase,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  closedWorld: true as const,
  sealed: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
