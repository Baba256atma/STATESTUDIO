/**
 * EX-2:3 — Executive Journal Experience Model.
 *
 * Canonical metadata-only presentation/consumer model. Runtime dependency is
 * exactly EX-2:2 Registry; EX-2:1 is reached only through Registry resolution.
 */

import { ExecutiveJournalExperienceRegistry } from "./executiveJournalExperienceRegistry.ts";
import {
  ExecutiveJournalExperienceModelContracts,
  ExecutiveJournalExperienceModelRelationships,
  ExecutiveJournalExperienceModelVocabularies,
  assertExecutiveJournalExperienceModelVocabularyValue,
  getExecutiveJournalExperienceModelRelationship,
  isExecutiveJournalExperienceModelVocabularyValue,
} from "./executiveJournalExperienceModelContracts.ts";
import {
  ExecutiveJournalExperienceEntity,
  ExecutiveJournalExperienceModelEntities,
  ExecutiveJournalExperienceModelEntityKinds,
  getExecutiveJournalExperienceModelEntity,
} from "./executiveJournalExperienceModelEntities.ts";
import {
  ExecutiveJournalExperienceModelApprovedAliases,
  ExecutiveJournalExperienceModelId,
  ExecutiveJournalExperienceModelIdentity,
  ExecutiveJournalExperienceModelNamespace,
  ExecutiveJournalExperienceModelNextPhaseMetadata,
  ExecutiveJournalExperienceModelPhase,
  ExecutiveJournalExperienceModelPreviousPhase,
  ExecutiveJournalExperienceModelReadiness,
  ExecutiveJournalExperienceModelRoot,
  ExecutiveJournalExperienceModelStatus,
  assertExecutiveJournalExperienceModelIdentity,
  resolveExecutiveJournalExperienceModelIdentity,
} from "./executiveJournalExperienceModelIdentity.ts";
import {
  ExecutiveJournalExperienceModelLifecycle,
  ExecutiveJournalExperienceModelLifecycleStates,
  assertExecutiveJournalExperienceModelLifecycleTransition,
  canTransitionExecutiveJournalExperienceModelLifecycle,
  isExecutiveJournalExperienceModelLifecycleState,
} from "./executiveJournalExperienceModelLifecycle.ts";
import {
  ExecutiveJournalExperienceModelAuthorization,
  ExecutiveJournalExperienceModelBoundaries,
  ExecutiveJournalExperienceModelDecisions,
  ExecutiveJournalExperienceModelMetadata,
  ExecutiveJournalExperienceModelOwnership,
  ExecutiveJournalExperienceModelPrinciples,
  ExecutiveJournalExperienceModelProhibitedSurfaces,
} from "./executiveJournalExperienceModelMetadata.ts";
import type { ExecutiveJournalExperienceModelSummary } from "./executiveJournalExperienceModelTypes.ts";

export {
  ExecutiveJournalExperienceModelApprovedAliases,
  ExecutiveJournalExperienceModelId,
  ExecutiveJournalExperienceModelIdentity,
  ExecutiveJournalExperienceModelNamespace,
  ExecutiveJournalExperienceModelNextPhaseMetadata,
  ExecutiveJournalExperienceModelPhase,
  ExecutiveJournalExperienceModelPreviousPhase,
  ExecutiveJournalExperienceModelReadiness,
  ExecutiveJournalExperienceModelRoot,
  ExecutiveJournalExperienceModelStatus,
  assertExecutiveJournalExperienceModelIdentity,
  resolveExecutiveJournalExperienceModelIdentity,
};

const registryEntryResolution = ExecutiveJournalExperienceRegistry.resolve(
  ExecutiveJournalExperienceRegistry.canonicalEntry.controlId,
);

if (registryEntryResolution.ok !== true) {
  throw new Error(
    "EX-2:3 requires EX-2:1 to resolve through the sealed EX-2:2 Registry.",
  );
}

const resolvedRegistryEntry = registryEntryResolution.entry;
const resolvedFoundation = resolvedRegistryEntry.foundation;

export const ExecutiveJournalExperienceModelUpstream = Object.freeze({
  registry: ExecutiveJournalExperienceRegistry,
  registryEntry: resolvedRegistryEntry,
  foundation: resolvedFoundation,
  foundationBoundaries: resolvedFoundation.boundaries,
  foundationPrinciples: resolvedFoundation.principles,
  foundationArchitectureDecisionLedger: resolvedFoundation.decisions,
  registryAuthorization: ExecutiveJournalExperienceRegistry.authorization,
  modelAuthorizationDecisionId: "AD-EX2-10" as const,
  tier0SupportingEvidenceLedger: resolvedFoundation.evidenceLedger,
  openIssues: resolvedFoundation.openIssues,
  pendingGates: resolvedFoundation.pendingGates,
  foundationCarriedByPhaseUnchanged: "EX-2:1" as const,
  adEx209InjectedIntoFoundationLedger: false as const,
  adEx210InjectedIntoFoundationLedger: false as const,
  exactReferencesPreserved: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceModel = Object.freeze({
  identity: ExecutiveJournalExperienceModelIdentity,
  lifecycle: ExecutiveJournalExperienceModelLifecycle,
  contracts: ExecutiveJournalExperienceModelContracts,
  vocabularies: ExecutiveJournalExperienceModelVocabularies,
  root: ExecutiveJournalExperienceEntity,
  entityKinds: ExecutiveJournalExperienceModelEntityKinds,
  entities: ExecutiveJournalExperienceModelEntities,
  relationships: ExecutiveJournalExperienceModelRelationships,
  metadata: ExecutiveJournalExperienceModelMetadata,
  registry: ExecutiveJournalExperienceRegistry,
  resolvedRegistryEntry,
  foundation: resolvedFoundation,
  upstream: ExecutiveJournalExperienceModelUpstream,
  decisions: ExecutiveJournalExperienceModelDecisions,
  principles: ExecutiveJournalExperienceModelPrinciples,
  ownership: ExecutiveJournalExperienceModelOwnership,
  boundaries: ExecutiveJournalExperienceModelBoundaries,
  prohibitedSurfaces: ExecutiveJournalExperienceModelProhibitedSurfaces,
  authorization: ExecutiveJournalExperienceModelAuthorization,
  unresolvedIssues: resolvedFoundation.openIssues,
  pendingGates: resolvedFoundation.pendingGates,
  resolveIdentity: resolveExecutiveJournalExperienceModelIdentity,
  assertIdentity: assertExecutiveJournalExperienceModelIdentity,
  getEntity: getExecutiveJournalExperienceModelEntity,
  getRelationship: getExecutiveJournalExperienceModelRelationship,
  isVocabularyValue: isExecutiveJournalExperienceModelVocabularyValue,
  assertVocabularyValue: assertExecutiveJournalExperienceModelVocabularyValue,
  isLifecycleState: isExecutiveJournalExperienceModelLifecycleState,
  canTransitionLifecycle: canTransitionExecutiveJournalExperienceModelLifecycle,
  assertLifecycleTransition:
    assertExecutiveJournalExperienceModelLifecycleTransition,
  status: ExecutiveJournalExperienceModelStatus,
  readiness: ExecutiveJournalExperienceModelReadiness,
  phase: ExecutiveJournalExperienceModelPhase,
  previousPhase: ExecutiveJournalExperienceModelPreviousPhase,
  nextPhaseMetadata: ExecutiveJournalExperienceModelNextPhaseMetadata,
  statistics: Object.freeze({
    entityCount: ExecutiveJournalExperienceModelEntities.length,
    relationshipCount: ExecutiveJournalExperienceModelRelationships.length,
    decisionCount: ExecutiveJournalExperienceModelDecisions.length,
    contractCount: ExecutiveJournalExperienceModelContracts.length,
    vocabularyCount: Object.keys(ExecutiveJournalExperienceModelVocabularies).length,
    lifecycleStateCount: ExecutiveJournalExperienceModelLifecycleStates.length,
    openIssueCount: resolvedFoundation.openIssues.issueIds.length,
    pendingGateCount: resolvedFoundation.pendingGates.length,
  }),
  metadataOnly: true as const,
  sideEffectFree: true as const,
  sealed: true as const,
  immutable: true as const,
  deterministic: true as const,
  runtimeBehavior: false as const,
  uiBehavior: false as const,
  routeBehavior: false as const,
  providerBehavior: false as const,
  realRtc2Consumption: false as const,
  networkBehavior: false as const,
  persistenceBehavior: false as const,
  telemetryBehavior: false as const,
  cloudBehavior: false as const,
  clockBehavior: false as const,
  randomnessBehavior: false as const,
  mutationBehavior: false as const,
  authorityCreationBehavior: false as const,
  productionIntegration: false as const,
  deploymentAuthorized: false as const,
  ex24Created: false as const,
  ex24Authorized: false as const,
});

export const getExecutiveJournalExperienceModelSummary =
  (): ExecutiveJournalExperienceModelSummary =>
    Object.freeze({
      identity: ExecutiveJournalExperienceModelId,
      namespace: ExecutiveJournalExperienceModelNamespace,
      status: ExecutiveJournalExperienceModelStatus,
      readiness: ExecutiveJournalExperienceModelReadiness,
      phase: ExecutiveJournalExperienceModelPhase,
      rootEntity: ExecutiveJournalExperienceModelRoot,
      entityCount: 14 as const,
      relationshipCount: 13 as const,
      decisionCount: 8 as const,
      previousPhase: ExecutiveJournalExperienceModelPreviousPhase,
      nextPhaseMetadata: ExecutiveJournalExperienceModelNextPhaseMetadata,
      nextPhase: ExecutiveJournalExperienceModelNextPhaseMetadata,
      metadataOnly: true as const,
      sideEffectFree: true as const,
      upstreamIdentityChain: Object.freeze([
        ExecutiveJournalExperienceModelId,
        "EX-2:2/ExecutiveJournalExperienceRegistry",
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      ] as const),
      openIssueCount: resolvedFoundation.openIssues.issueIds.length,
      pendingGateCount: 3 as const,
      authorizationDecisionId: "AD-EX2-10" as const,
      ex24Created: false as const,
      ex24Authorized: false as const,
    });

export const getExecutiveJournalExperienceModel = () =>
  ExecutiveJournalExperienceModel;
