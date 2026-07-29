/**
 * RTC-3:3 — Executive Decision Register Model Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues carried
 * forward from RTC-3:2 without selecting defaults.
 *
 * Ownership: owned exclusively by RTC-3:3.
 */

import {
  ExecutiveDecisionRegisterModelContracts,
  ExecutiveDecisionRegisterModelInvariants,
} from "./executiveDecisionRegisterModelContracts.ts";
import { ExecutiveDecisionRegisterEntityModels } from "./executiveDecisionRegisterModelEntities.ts";
import {
  ExecutiveDecisionRegisterModelId,
  ExecutiveDecisionRegisterModelName,
  ExecutiveDecisionRegisterModelNamespace,
  ExecutiveDecisionRegisterModelNextPhase,
  ExecutiveDecisionRegisterModelReadiness,
  ExecutiveDecisionRegisterModelStatus,
  ExecutiveDecisionRegisterModelVersion,
} from "./executiveDecisionRegisterModelIdentity.ts";
import {
  ExecutiveDecisionRegisterModelLifecycle,
  ExecutiveDecisionRegisterRelationshipKinds,
} from "./executiveDecisionRegisterModelLifecycle.ts";
import { ExecutiveDecisionRegisterRegistry } from "./executiveDecisionRegisterRegistry.ts";

/** Foundation resolved exclusively through the RTC-3:2 registry. */
const registeredFoundation = ExecutiveDecisionRegisterRegistry.foundation;

/** AI prohibitions preserved by registry → foundation reference. */
export const ExecutiveDecisionRegisterModelAiMustNot =
  ExecutiveDecisionRegisterRegistry.aiMustNot;

/** D-01…D-06 preserved by exact upstream foundation reference via registry. */
export const ExecutiveDecisionRegisterModelUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterRegistry.upstreamDecisions;

/** D-07…D-12 preserved by exact registry decision reference. */
export const ExecutiveDecisionRegisterModelUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterRegistry.decisions;

/**
 * Open issues carried forward unresolved from RTC-3:1 via RTC-3:2.
 * RTC-3:3 MUST NOT resolve these through defaults.
 */
export const ExecutiveDecisionRegisterModelOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterRegistry.openIssues.map((issue) =>
    Object.freeze({
      issueId: issue.issueId,
      issue: issue.issue,
      requiredResolution: issue.requiredResolution,
      accountableOwner: issue.accountableOwner,
      resolved: false as const,
      resolvedByModel: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:3" as const,
    })
  ),
);

/** Model principles. */
export const ExecutiveDecisionRegisterModelPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:3/Principle/01",
    name: "Structure without behaviour",
    description:
      "The model declares entities and distinctions only; it does not validate, persist, or execute.",
  }),
  Object.freeze({
    principleId: "RTC-3:3/Principle/02",
    name: "Append-only lineage",
    description:
      "Corrections, disputes, supersessions, and reopenings are new relationships; historical evidence remains.",
  }),
  Object.freeze({
    principleId: "RTC-3:3/Principle/03",
    name: "Authority and human confirmation",
    description:
      "Authoritative decisions require authority_ref and human confirmation; AI proposals remain non-authoritative.",
  }),
  Object.freeze({
    principleId: "RTC-3:3/Principle/04",
    name: "Registry-mediated foundation",
    description:
      "RTC-3:1 is consumed only through the sealed RTC-3:2 registry by exact reference.",
  }),
  Object.freeze({
    principleId: "RTC-3:3/Principle/05",
    name: "Private reflection outside model",
    description:
      "Private reflection is not a DecisionRegister entity and is not silently treated as a DecisionRecord.",
  }),
  Object.freeze({
    principleId: "RTC-3:3/Principle/06",
    name: "No open-issue resolution",
    description:
      "OI-01 through OI-06 remain unresolved; the model selects no defaults for them.",
  }),
] as const);

/**
 * Model-level architecture decisions D-13…D-18.
 * D-01…D-12 remain upstream by exact reference.
 */
export const ExecutiveDecisionRegisterModelDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-13",
    statement: "DecisionRegister is the canonical model root.",
  }),
  Object.freeze({
    decisionId: "D-14",
    statement:
      "Authoritative decisions require explicit authority and human confirmation.",
  }),
  Object.freeze({
    decisionId: "D-15",
    statement: "Model relationships preserve append-only lineage.",
  }),
  Object.freeze({
    decisionId: "D-16",
    statement: "AI-originated content remains non-authoritative.",
  }),
  Object.freeze({
    decisionId: "D-17",
    statement:
      "Projections preserve provenance and cannot create authority.",
  }),
  Object.freeze({
    decisionId: "D-18",
    statement:
      "RTC-3:3 consumes RTC-3:1 only through the sealed RTC-3:2 registry.",
  }),
] as const);

/** Surfaces the model shall never own. */
export const ExecutiveDecisionRegisterModelProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "RTC-2 modules",
  "RTC-1 Public Index",
  "Decision Journal APP-8 implementation",
  "direct RTC-3:1 runtime import",
  "resolve open issues OI-01 through OI-06",
  "weaken append-only controls",
  "weaken AI non-delegable boundary",
  "treat derived projection as authoritative",
  "treat private reflection as DecisionRecord",
  "live authority registry selection",
  "ORM or database schemas",
  "API handlers",
  "repositories",
  "network clients",
] as const);

/** Ownership declaration. */
export const ExecutiveDecisionRegisterModelOwnership = Object.freeze({
  ownershipId: "RTC-3:3/ExecutiveDecisionRegisterModelOwnership",
  sourcePhase: "RTC-3:3" as const,
  owns: Object.freeze([
    "Decision Register domain entity structure",
    "Closed state distinction vocabularies",
    "Append-only relationship kinds",
    "Authority and confirmation field contracts",
    "Evidence, privacy, projection, and telemetry structural rules",
  ] as const),
  doesNotOwn: ExecutiveDecisionRegisterModelProhibitedSurfaces,
  importsRegistryByReference: true as const,
  importsFoundationDirectly: false as const,
  resolvesFoundationViaRegistry: true as const,
  ownsUi: false as const,
  ownsValidation: false as const,
  ownsPersistence: false as const,
  ownsAiAuthority: false as const,
  selectsLiveAuthorityRegistry: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Architectural boundaries. */
export const ExecutiveDecisionRegisterModelBoundaries = Object.freeze({
  boundariesId: "RTC-3:3/ExecutiveDecisionRegisterModelBoundaries",
  sourcePhase: "RTC-3:3" as const,
  registeredFoundationId: registeredFoundation.identity.foundationId,
  registeredFoundationNamespace:
    registeredFoundation.identity.foundationNamespace,
  foundationReadiness: registeredFoundation.readiness,
  registryReadiness: ExecutiveDecisionRegisterRegistry.readiness,
  foundationAppendOnly: registeredFoundation.appendOnly,
  foundationCorrectionsDoNotErase: registeredFoundation.correctionsDoNotErase,
  foundationProposedIsNonAuthoritative:
    registeredFoundation.proposedIsNonAuthoritative,
  foundationConfirmedRequiresHumanAndAuthority:
    registeredFoundation.confirmedRequiresHumanAndAuthority,
  foundationAiMustNot: ExecutiveDecisionRegisterModelAiMustNot,
  foundationAiMustNotExactReference: true as const,
  privateReflectionOutsideModel: true as const,
  privateReflectionSilentPromotionForbidden:
    registeredFoundation.boundaries.privateReflectionSilentPromotionForbidden,
  selectsLiveAuthorityRegistry: false as const,
  relationshipKinds: ExecutiveDecisionRegisterRelationshipKinds,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterModelProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc32RegistryOnly",
    "ResolveFoundationViaRegistry",
    "NoDirectFoundationImport",
    "NoRtc2Imports",
    "NoRtc1PublicIndexImports",
    "NoDecisionJournalApp8Imports",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoNetworkOrPersistenceImports",
    "NoOpenIssueDefaults",
    "NoLiveAuthorityRegistry",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Publication constants. */
export const ExecutiveDecisionRegisterModelConstants = Object.freeze({
  phaseIdentifier: "RTC-3:3",
  canonicalIdentifier: ExecutiveDecisionRegisterModelId,
  version: ExecutiveDecisionRegisterModelVersion,
  name: ExecutiveDecisionRegisterModelName,
  namespace: ExecutiveDecisionRegisterModelNamespace,
  status: ExecutiveDecisionRegisterModelStatus,
  readiness: ExecutiveDecisionRegisterModelReadiness,
  nextPhase: ExecutiveDecisionRegisterModelNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Decision Register",
  entityCount: ExecutiveDecisionRegisterEntityModels.length,
  contractCount: ExecutiveDecisionRegisterModelContracts.length,
  invariantCount: ExecutiveDecisionRegisterModelInvariants.length,
  lifecycleStateCount: ExecutiveDecisionRegisterModelLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterModelOpenIssues.length,
  principleCount: ExecutiveDecisionRegisterModelPrinciples.length,
  modelDecisionCount: ExecutiveDecisionRegisterModelDecisions.length,
  relationshipKindCount: ExecutiveDecisionRegisterRelationshipKinds.length,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveDecisionRegisterModelMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterModelConstants,
  principles: ExecutiveDecisionRegisterModelPrinciples,
  decisions: ExecutiveDecisionRegisterModelDecisions,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterModelUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterModelUpstreamRegistryDecisions,
  openIssues: ExecutiveDecisionRegisterModelOpenIssues,
  ownership: ExecutiveDecisionRegisterModelOwnership,
  boundaries: ExecutiveDecisionRegisterModelBoundaries,
  readiness: ExecutiveDecisionRegisterModelReadiness,
  nextPhase: ExecutiveDecisionRegisterModelNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
