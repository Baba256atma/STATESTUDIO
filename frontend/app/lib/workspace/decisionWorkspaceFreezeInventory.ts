/** WS-4:8 — Complete Certification-derived frozen architecture inventory. */
import { DecisionWorkspaceCertification } from "./decisionWorkspaceCertification.ts";

const platform = DecisionWorkspaceCertification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;

export const DecisionWorkspaceFreezeInventory = Object.freeze({
  platformIdentity: platform.identity,
  workspaceIdentity: platform.composition.workspaceIdentity,
  responsibilities: platform.composition.responsibilities,
  capabilities: platform.composition.capabilities,
  decisionTypes: platform.composition.decisionTypes,
  lifecycleStates: platform.composition.lifecycleStates,
  contracts: platform.composition.contracts,
  domainModels: platform.composition.domainModels,
  relationships: platform.composition.relationships,
  compositions: platform.composition.compositions,
  manifestGuarantees: manifest.guarantees,
  platformGuarantees: platform.guarantees,
  certificationGuarantees: DecisionWorkspaceCertification.guarantees,
  certificationResults: DecisionWorkspaceCertification.results,
  certificationReadiness: DecisionWorkspaceCertification.readiness,
  sourceChain: Object.freeze({
    foundation: validation.foundation,
    registry: validation.registry,
    model: validation.model,
    validation,
    manifest,
    platform,
    certification: DecisionWorkspaceCertification,
  }),
  counts: Object.freeze({
    responsibilityCount: platform.composition.responsibilities.length,
    capabilityCount: platform.composition.capabilities.length,
    decisionTypeCount: platform.composition.decisionTypes.length,
    lifecycleCount: platform.composition.lifecycleStates.length,
    contractCount: platform.composition.contracts.length,
    domainModelCount: platform.composition.domainModels.length,
    relationshipCount: platform.composition.relationships.length,
    compositionCount: platform.composition.compositions.length,
    manifestGuaranteeCount: manifest.guarantees.length,
    platformGuaranteeCount: platform.guarantees.length,
    certificationGuaranteeCount:
      DecisionWorkspaceCertification.guarantees.length,
  }),
  source: DecisionWorkspaceCertification,
  frozen: true,
  immutable: true,
} as const);
