/** WS-5:8 — Complete Certification-derived frozen architecture inventory. */
import { ScenarioWorkspaceCertification } from "./scenarioWorkspaceCertification.ts";

const platform = ScenarioWorkspaceCertification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;

export const ScenarioWorkspaceFreezeInventory = Object.freeze({
  platformIdentity: platform.identity,
  workspaceIdentity: platform.composition.workspaceIdentity,
  responsibilities: platform.composition.responsibilities,
  capabilities: platform.composition.capabilities,
  scenarioTypes: platform.composition.scenarioTypes,
  lifecycleStates: platform.composition.lifecycleStates,
  contracts: platform.composition.contracts,
  domainModels: platform.composition.domainModels,
  relationships: platform.composition.relationships,
  compositions: platform.composition.compositions,
  manifestGuarantees: manifest.guarantees,
  platformGuarantees: platform.guarantees,
  certificationGuarantees: ScenarioWorkspaceCertification.guarantees,
  certificationResults: ScenarioWorkspaceCertification.results,
  certificationReadiness: ScenarioWorkspaceCertification.readiness,
  sourceChain: Object.freeze({
    foundation: validation.foundation,
    registry: validation.registry,
    model: validation.model,
    validation,
    manifest,
    platform,
    certification: ScenarioWorkspaceCertification,
  }),
  counts: Object.freeze({
    responsibilityCount: platform.composition.responsibilities.length,
    capabilityCount: platform.composition.capabilities.length,
    scenarioTypeCount: platform.composition.scenarioTypes.length,
    lifecycleCount: platform.composition.lifecycleStates.length,
    contractCount: platform.composition.contracts.length,
    domainModelCount: platform.composition.domainModels.length,
    relationshipCount: platform.composition.relationships.length,
    compositionCount: platform.composition.compositions.length,
    manifestGuaranteeCount: manifest.guarantees.length,
    platformGuaranteeCount: platform.guarantees.length,
    certificationGuaranteeCount:
      ScenarioWorkspaceCertification.guarantees.length,
  }),
  source: ScenarioWorkspaceCertification,
  frozen: true,
  immutable: true,
} as const);
