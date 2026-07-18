import type {
  ExecutiveDecisionFreezeCompatibility as ExecutiveDecisionFreezeCompatibilityEntry,
} from "./executiveDecisionFreezeTypes.ts";

const compatibility = (
  id: string,
  name: string,
  source: string,
  target: string,
  compatibilityType: string,
  frozenContract: string,
) => Object.freeze({
  id,
  name,
  source,
  target,
  compatibilityType,
  frozenContract,
  compatibilityLevel: "Frozen",
  breakingChangePolicy: "Prohibited",
  versionPolicy: "SemanticStable",
  status: "Compatible",
  freezeProtection: "Frozen",
  protection: "Protected",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionFreezeCompatibilityEntry);

/**
 * Immutable freeze compatibility declarations for ENG-7.
 */
export const ExecutiveDecisionFreezeCompatibility = Object.freeze([
  compatibility(
    "eng-7-freeze-compat-foundation",
    "Foundation contract compatibility",
    "ENG-7:1 Foundation",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionPublicApi.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-registry",
    "Registry contract compatibility",
    "ENG-7:2 Registry",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionRegistryPlatform.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-model",
    "Model contract compatibility",
    "ENG-7:3 Model",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionModelPlatform.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-validation",
    "Validation contract compatibility",
    "ENG-7:4 Validation",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionValidationPlatform.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-manifest",
    "Manifest contract compatibility",
    "ENG-7:5 Manifest",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionManifestPlatform.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-platform",
    "Platform contract compatibility",
    "ENG-7:6 Platform",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionPlatform.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-certification",
    "Certification contract compatibility",
    "ENG-7:7 Certification",
    "ENG-7 Decision Architecture",
    "ContractCompatibility",
    "executiveDecisionCertificationPlatform.ts",
  ),
  compatibility(
    "eng-7-freeze-compat-reasoning-input",
    "ENG-6 reasoning-input compatibility",
    "ENG-6 Reasoning",
    "ENG-7 Decision",
    "CrossPlatformInputCompatibility",
    "ENG-6 public reasoning surface → ENG-7 decision architecture",
  ),
  compatibility(
    "eng-7-freeze-compat-orchestration-consumer",
    "ENG-8 orchestration-consumer compatibility",
    "ENG-7 Decision",
    "ENG-8 Orchestration",
    "FutureConsumerCompatibility",
    "ENG-7 freeze surface → ENG-8 orchestration (metadata reference only)",
  ),
  compatibility(
    "eng-7-freeze-compat-advisor-consumer",
    "Advisor-consumer compatibility",
    "ENG-7 Decision",
    "Advisor",
    "ExternalConsumerCompatibility",
    "ENG-7 freeze surface → Advisor (metadata reference only)",
  ),
] as const);
