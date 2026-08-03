/**
 * EX-2:9 — Executive Journal Experience Public Index.
 *
 * Sole public consumer entry point for EX-2.
 * Imports only the Freeze aggregate. Metadata only. Zero runtime behavior.
 *
 * Public exports (exactly 12, declaration order):
 *   publicIndexId
 *   publicIndexCanonicalId
 *   publicIndexNamespace
 *   publicIndexVersion
 *   publicIndexStatus
 *   publicIndexReadiness
 *   publicApiSurface
 *   publicApiCount
 *   executiveJournalExperiencePublicIndexIdentity
 *   executiveJournalExperiencePublicIndexMetadata
 *   executiveJournalExperiencePublicIndexSummary
 *   executiveJournalExperiencePublicIndex
 */

import { ExecutiveJournalExperienceFreeze } from "./executiveJournalExperienceFreeze.ts";

const freeze = ExecutiveJournalExperienceFreeze;

if (freeze.readiness !== "ReadyForPublicIndex") {
  throw new Error(
    "EX-2:9 Public Index requires Freeze readiness ReadyForPublicIndex.",
  );
}

if (freeze.status !== "Frozen") {
  throw new Error("EX-2:9 Public Index requires Freeze status Frozen.");
}

if (
  freeze.authorization.authorizationDecisionId !== "AD-EX2-14"
  || freeze.authorization.authorizationStatus !== "Accepted"
) {
  throw new Error(
    "EX-2:9 Public Index requires AD-EX2-14 Accepted Freeze authorization.",
  );
}

export const publicIndexId =
  "EX-2:9/ExecutiveJournalExperiencePublicIndex" as const;

export const publicIndexCanonicalId =
  "EX-2:9/ExecutiveJournalExperiencePublicIndex" as const;

export const publicIndexNamespace =
  "nexora.ex.executive.journal.experience.public-index" as const;

export const publicIndexVersion = "1.0.0" as const;

export const publicIndexStatus =
  "Released · Certified · Frozen · Stable" as const;

export const publicIndexReadiness = "ReadyForConsumer" as const;

const NAMESPACE_SECTION_NAMES = Object.freeze([
  "Identity",
  "Release Information",
  "Upstream",
  "Public API Registry",
  "Readiness",
  "Consumer Rules",
  "Compatibility",
  "Metadata",
  "Summary",
] as const);

const registerPublicApiEntry = (
  kind: "Contract" | "Lock" | "Decision" | "Readiness" | "Lifecycle" | "Identity",
  exportName: string,
  order: number,
) =>
  Object.freeze({
    apiIdentifier: `EX-2:9/Api/${kind}/${String(order).padStart(2, "0")}`,
    exportName,
    kind,
    sourcePhase: freeze.identity.id,
    order,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Public API Registry derived only from the Freeze aggregate.
 * Definitions are referenced, never reconstructed. Count is dynamic.
 */
const derivedPublicApiSurface = Object.freeze([
  ...freeze.contracts.map((entry, index) =>
    registerPublicApiEntry("Contract", entry.contractId, index + 1)),
  ...freeze.locks.map((entry, index) =>
    registerPublicApiEntry(
      "Lock",
      entry.lockId,
      freeze.contracts.length + index + 1,
    )),
  ...freeze.decisions.map((entry, index) =>
    registerPublicApiEntry(
      "Decision",
      entry.decisionId,
      freeze.contracts.length + freeze.locks.length + index + 1,
    )),
  ...freeze.readinessConditions.map((condition, index) =>
    registerPublicApiEntry(
      "Readiness",
      condition,
      freeze.contracts.length
        + freeze.locks.length
        + freeze.decisions.length
        + index
        + 1,
    )),
  ...freeze.lifecycle.states.map((state, index) =>
    registerPublicApiEntry(
      "Lifecycle",
      state,
      freeze.contracts.length
        + freeze.locks.length
        + freeze.decisions.length
        + freeze.readinessConditions.length
        + index
        + 1,
    )),
  ...freeze.aliases.map((alias, index) =>
    registerPublicApiEntry(
      "Identity",
      alias,
      freeze.contracts.length
        + freeze.locks.length
        + freeze.decisions.length
        + freeze.readinessConditions.length
        + freeze.lifecycle.states.length
        + index
        + 1,
    )),
]);

export const publicApiSurface = derivedPublicApiSurface;

/** Dynamic count — never hard-coded. */
export const publicApiCount = publicApiSurface.length;

export const executiveJournalExperiencePublicIndexIdentity = Object.freeze({
  id: publicIndexId,
  canonicalId: publicIndexCanonicalId,
  namespace: publicIndexNamespace,
  version: publicIndexVersion,
  status: publicIndexStatus,
  readiness: publicIndexReadiness,
  phase: "EX-2:9" as const,
  phaseKind: "PublicIndex" as const,
  previousPhase: "EX-2:8 — Executive Journal Experience Freeze" as const,
  authorizationDecisionId: "AD-EX2-14" as const,
  upstreamFreezeIdentity: freeze.identity.id,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  soleConsumerEntryPoint: true as const,
});

const consumerRules = Object.freeze([
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/01" as const,
    order: 1,
    statement: "Public Index is the sole consumer entry point." as const,
  }),
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/02" as const,
    order: 2,
    statement: "Direct imports from Freeze are prohibited." as const,
  }),
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/03" as const,
    order: 3,
    statement: "Direct imports from Certification are prohibited." as const,
  }),
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/04" as const,
    order: 4,
    statement: "Direct imports from Platform are prohibited." as const,
  }),
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/05" as const,
    order: 5,
    statement: "Lower-phase imports are prohibited." as const,
  }),
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/06" as const,
    order: 6,
    statement: "Runtime mutation is prohibited." as const,
  }),
  Object.freeze({
    ruleId: "EX-2:9/ConsumerRule/07" as const,
    order: 7,
    statement: "Public metadata is read-only." as const,
  }),
] as const);

const compatibility = Object.freeze({
  semanticVersion: publicIndexVersion,
  releaseChannel: "stable" as const,
  stability: "Stable" as const,
  deterministicBehavior: true as const,
  backwardCompatibilityPolicy:
    "Additive metadata evolution only; no breaking public export removals without a new major version." as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const releaseInformation = Object.freeze({
  releaseIdentity: publicIndexCanonicalId,
  releaseStatus: publicIndexStatus,
  readiness: publicIndexReadiness,
  version: publicIndexVersion,
  sourceFreeze: freeze.identity.id,
  sourceFreezeStatus: freeze.status,
  sourceFreezeReadiness: freeze.readiness,
  authorizationDecisionId: "AD-EX2-14" as const,
  released: true as const,
  certified: true as const,
  frozen: true as const,
  stable: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const executiveJournalExperiencePublicIndexMetadata = Object.freeze({
  identity: publicIndexCanonicalId,
  namespace: publicIndexNamespace,
  version: publicIndexVersion,
  releaseStatus: publicIndexStatus,
  readiness: publicIndexReadiness,
  authorizationReference: "AD-EX2-14" as const,
  upstreamReference: freeze.identity.id,
  freezeOnlyDependency: true as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
});

export const executiveJournalExperiencePublicIndexSummary = Object.freeze({
  canonicalIdentity: publicIndexCanonicalId,
  namespace: publicIndexNamespace,
  releaseStatus: publicIndexStatus,
  readiness: publicIndexReadiness,
  upstreamDependency: "EX-2:8/ExecutiveJournalExperienceFreeze" as const,
  publicApiCount,
  consumerEntryPoint: "executiveJournalExperiencePublicIndex.ts" as const,
  soleConsumerEntryPoint: true as const,
  authorizationDecisionId: "AD-EX2-14" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});

const namespaceSections = Object.freeze([
  Object.freeze({
    section: "Identity" as const,
    order: 1,
    value: executiveJournalExperiencePublicIndexIdentity,
  }),
  Object.freeze({
    section: "Release Information" as const,
    order: 2,
    value: releaseInformation,
  }),
  Object.freeze({
    section: "Upstream" as const,
    order: 3,
    value: Object.freeze({
      freeze: freeze,
      freezeIdentity: freeze.identity.id,
      freezeStatus: freeze.status,
      freezeReadiness: freeze.readiness,
      earlierPhasesReachedThroughFreezeOnly: true as const,
    }),
  }),
  Object.freeze({
    section: "Public API Registry" as const,
    order: 4,
    value: Object.freeze({
      publicApiSurface,
      publicApiCount,
      derivedFromFreezeOnly: true as const,
      readOnly: true as const,
    }),
  }),
  Object.freeze({
    section: "Readiness" as const,
    order: 5,
    value: Object.freeze({
      readiness: publicIndexReadiness,
      freezeReadiness: freeze.readiness,
      readyForConsumer: true as const,
    }),
  }),
  Object.freeze({
    section: "Consumer Rules" as const,
    order: 6,
    value: consumerRules,
  }),
  Object.freeze({
    section: "Compatibility" as const,
    order: 7,
    value: compatibility,
  }),
  Object.freeze({
    section: "Metadata" as const,
    order: 8,
    value: executiveJournalExperiencePublicIndexMetadata,
  }),
  Object.freeze({
    section: "Summary" as const,
    order: 9,
    value: executiveJournalExperiencePublicIndexSummary,
  }),
] as const);

if (namespaceSections.length !== NAMESPACE_SECTION_NAMES.length) {
  throw new Error("EX-2:9 Public Index namespace section count mismatch.");
}

for (let index = 0; index < NAMESPACE_SECTION_NAMES.length; index += 1) {
  if (namespaceSections[index]?.section !== NAMESPACE_SECTION_NAMES[index]) {
    throw new Error("EX-2:9 Public Index namespace section order mismatch.");
  }
}

/**
 * Sole public EX-2 aggregate for downstream consumers.
 */
export const executiveJournalExperiencePublicIndex = Object.freeze({
  identity: executiveJournalExperiencePublicIndexIdentity,
  namespaceSections,
  releaseInformation,
  upstream: Object.freeze({
    freeze,
    freezeIdentity: freeze.identity.id,
    freezeOnly: true as const,
  }),
  publicApiRegistry: Object.freeze({
    publicApiSurface,
    publicApiCount,
    derivedFromFreezeOnly: true as const,
    readOnly: true as const,
  }),
  readiness: publicIndexReadiness,
  consumerRules,
  compatibility,
  metadata: executiveJournalExperiencePublicIndexMetadata,
  summary: executiveJournalExperiencePublicIndexSummary,
  publicApiSurface,
  publicApiCount,
  status: publicIndexStatus,
  released: true as const,
  certified: true as const,
  frozen: true as const,
  stable: true as const,
  soleConsumerEntryPoint: true as const,
  freezeOnlyDependency: true as const,
  republishesOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  runtimeMutation: false as const,
  implementsRendering: false as const,
  executesRuntimeLogic: false as const,
  bypassesFreeze: false as const,
});
