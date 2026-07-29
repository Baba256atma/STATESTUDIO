/**
 * RTC-2:3 — Executive Journal Runtime Model Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues carried
 * forward from RTC-2:2 without selecting defaults.
 *
 * Ownership: owned exclusively by RTC-2:3.
 */

import { ExecutiveJournalRuntimeRegistry } from "./executiveJournalRuntimeRegistry.ts";
import {
  ExecutiveJournalRuntimeModelContracts,
  ExecutiveJournalRuntimeModelInvariants,
} from "./executiveJournalRuntimeModelContracts.ts";
import { ExecutiveJournalRuntimeEntityModels } from "./executiveJournalRuntimeModelEntities.ts";
import {
  ExecutiveJournalRuntimeModelId,
  ExecutiveJournalRuntimeModelName,
  ExecutiveJournalRuntimeModelNamespace,
  ExecutiveJournalRuntimeModelNextPhase,
  ExecutiveJournalRuntimeModelReadiness,
  ExecutiveJournalRuntimeModelStatus,
  ExecutiveJournalRuntimeModelVersion,
} from "./executiveJournalRuntimeModelIdentity.ts";
import { ExecutiveJournalRuntimeModelLifecycle } from "./executiveJournalRuntimeModelLifecycle.ts";

/** Foundation resolved exclusively through the RTC-2:2 registry. */
const registeredFoundation = ExecutiveJournalRuntimeRegistry.foundation;

/** AI prohibitions preserved by registry → foundation reference. */
export const ExecutiveJournalModelAiMustNot =
  ExecutiveJournalRuntimeRegistry.aiMustNot;

/**
 * Open issues carried forward unresolved from RTC-2:1 via RTC-2:2.
 * RTC-2:3 MUST NOT resolve these through defaults.
 */
export const ExecutiveJournalRuntimeModelOpenIssues = Object.freeze(
  ExecutiveJournalRuntimeRegistry.openIssues.map((issue) =>
    Object.freeze({
      issueId: issue.issueId,
      issue: issue.issue,
      requiredResolution: issue.requiredResolution,
      accountableOwner: issue.accountableOwner,
      resolved: false as const,
      resolvedByModel: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:3" as const,
    })
  ),
);

/** Model principles. */
export const ExecutiveJournalRuntimeModelPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:3/Principle/01",
    name: "Structure without behaviour",
    description:
      "The model declares entities and distinctions only; it does not validate, persist, or execute.",
  }),
  Object.freeze({
    principleId: "RTC-2:3/Principle/02",
    name: "Append-only accepted history",
    description:
      "Corrections and reopenings are new modeled transitions; historical evidence remains.",
  }),
  Object.freeze({
    principleId: "RTC-2:3/Principle/03",
    name: "Provenance for every state",
    description:
      "Authoritative and derived states identify producing events, journal sequence, actor, and authority.",
  }),
  Object.freeze({
    principleId: "RTC-2:3/Principle/04",
    name: "Authority before automation",
    description:
      "Consequential state requires authority_ref; AI-proposed state remains AiProposed until HumanConfirmed.",
  }),
  Object.freeze({
    principleId: "RTC-2:3/Principle/05",
    name: "Private by construction",
    description:
      "PrivateReflection is a closed visibility and information category, not an optional flag.",
  }),
  Object.freeze({
    principleId: "RTC-2:3/Principle/06",
    name: "No open-issue resolution",
    description:
      "OI-01 through OI-06 remain unresolved; the model selects no defaults for them.",
  }),
] as const);

/** Structural model decisions (non-product). */
export const ExecutiveJournalRuntimeModelDecisions = Object.freeze([
  Object.freeze({
    decisionId: "RTC-2:3/D-01",
    statement:
      "Consume RTC-2:2 registry by reference and resolve RTC-2:1 foundation through it.",
  }),
  Object.freeze({
    decisionId: "RTC-2:3/D-02",
    statement:
      "Use ReadyForValidation readiness vocabulary established by RTC-1:3.",
  }),
  Object.freeze({
    decisionId: "RTC-2:3/D-03",
    statement:
      "Represent security-sensitive distinctions as closed vocabularies, not optional booleans.",
  }),
] as const);

/** Surfaces the model shall never own. */
export const ExecutiveJournalRuntimeModelProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "Decision Journal APP-8 implementation",
  "resolve open issues OI-01 through OI-06",
  "weaken append-only controls",
  "weaken AI non-delegable boundary",
  "treat derived projection as authoritative",
  "substitute title or silence for authority",
  "ORM or database schemas",
  "API handlers",
  "repositories",
  "network clients",
] as const);

/** Ownership declaration. */
export const ExecutiveJournalRuntimeModelOwnership = Object.freeze({
  ownershipId: "RTC-2:3/ExecutiveJournalRuntimeModelOwnership",
  sourcePhase: "RTC-2:3" as const,
  owns: Object.freeze([
    "Journal domain entity structure",
    "Closed state distinction vocabularies",
    "Provenance field contracts",
    "Authority and delegation field contracts",
    "Privacy and projection structural rules",
  ] as const),
  doesNotOwn: ExecutiveJournalRuntimeModelProhibitedSurfaces,
  importsRegistryByReference: true as const,
  importsFoundationDirectly: false as const,
  resolvesFoundationViaRegistry: true as const,
  ownsUi: false as const,
  ownsValidation: false as const,
  ownsPersistence: false as const,
  ownsAiAuthority: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Architectural boundaries. */
export const ExecutiveJournalRuntimeModelBoundaries = Object.freeze({
  boundariesId: "RTC-2:3/ExecutiveJournalRuntimeModelBoundaries",
  sourcePhase: "RTC-2:3" as const,
  registeredFoundationId: registeredFoundation.identity.foundationId,
  registeredFoundationNamespace: registeredFoundation.identity.foundationNamespace,
  foundationReadiness: registeredFoundation.readiness,
  foundationAppendOnly: registeredFoundation.appendOnly,
  foundationCorrectionsDoNotErase: registeredFoundation.correctionsDoNotErase,
  foundationPrivateReflectionSeparate:
    registeredFoundation.privateReflectionSeparateClass,
  foundationAiMustNot: ExecutiveJournalModelAiMustNot,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveJournalRuntimeModelProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc22RegistryOnly",
    "ResolveFoundationViaRegistry",
    "NoDirectFoundationImport",
    "NoDecisionJournalApp8Imports",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoNetworkOrPersistenceImports",
    "NoOpenIssueDefaults",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Publication constants. */
export const ExecutiveJournalRuntimeModelConstants = Object.freeze({
  phaseIdentifier: "RTC-2:3",
  canonicalIdentifier: ExecutiveJournalRuntimeModelId,
  version: ExecutiveJournalRuntimeModelVersion,
  name: ExecutiveJournalRuntimeModelName,
  namespace: ExecutiveJournalRuntimeModelNamespace,
  status: ExecutiveJournalRuntimeModelStatus,
  readiness: ExecutiveJournalRuntimeModelReadiness,
  nextPhase: ExecutiveJournalRuntimeModelNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Journal Runtime",
  entityCount: ExecutiveJournalRuntimeEntityModels.length,
  contractCount: ExecutiveJournalRuntimeModelContracts.length,
  invariantCount: ExecutiveJournalRuntimeModelInvariants.length,
  lifecycleStateCount: ExecutiveJournalRuntimeModelLifecycle.stateCount,
  openIssueCount: ExecutiveJournalRuntimeModelOpenIssues.length,
  principleCount: ExecutiveJournalRuntimeModelPrinciples.length,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveJournalRuntimeModelMetadata = Object.freeze({
  constants: ExecutiveJournalRuntimeModelConstants,
  principles: ExecutiveJournalRuntimeModelPrinciples,
  decisions: ExecutiveJournalRuntimeModelDecisions,
  openIssues: ExecutiveJournalRuntimeModelOpenIssues,
  ownership: ExecutiveJournalRuntimeModelOwnership,
  boundaries: ExecutiveJournalRuntimeModelBoundaries,
  invariants: ExecutiveJournalRuntimeModelInvariants,
  readiness: ExecutiveJournalRuntimeModelReadiness,
  nextPhase: ExecutiveJournalRuntimeModelNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
