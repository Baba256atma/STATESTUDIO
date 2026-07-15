import { ExecutiveReasoningFoundationValidation } from "./executiveReasoningFoundationValidation.ts";
import { ExecutiveReasoningModelValidation } from "./executiveReasoningModelValidation.ts";
import { ExecutiveReasoningRegistryValidation } from "./executiveReasoningRegistryValidation.ts";

const allRules = Object.freeze([
  ...ExecutiveReasoningFoundationValidation.rules,
  ...ExecutiveReasoningRegistryValidation.rules,
  ...ExecutiveReasoningModelValidation.rules,
] as const);

export const ExecutiveReasoningValidationDomains = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Relationship",
  "Lifecycle",
  "Ownership",
  "Dependency",
  "PublicApi",
  "Metadata",
  "Namespace",
] as const);

export const ExecutiveReasoningValidationMetadata = Object.freeze({
  validationId: "ENG-6:4",
  validationVersion: "1.0.0",
  namespace: "nexora.engine.executive.reasoning.validation",
  name: "Executive Reasoning Validation Platform",
  description:
    "Canonical immutable metadata-only validation platform verifying ENG-6:1 Foundation, ENG-6:2 Registry, and ENG-6:3 Model architectural integrity.",
  owner: "ENG-6",
  phase: "ENG-6:4",
  validationStatus: "PASS",
  validatedPhases: Object.freeze(["ENG-6:1", "ENG-6:2", "ENG-6:3"] as const),
  totalRuleCount: 30,
  totalDomainCount: 10,
  ruleCount: allRules.length,
  domainCount: 10,
  status: Object.freeze({
    validation: "Validation",
    passed: "PASS",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    aiFree: "AiFree",
    readyForManifest: "ReadyForManifest",
  } as const),
  nextPhase: "ENG-6:5",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveReasoningValidationManifest = Object.freeze({
  id: "eng-6-validation-manifest",
  name: "Executive Reasoning Validation Manifest",
  metadata: ExecutiveReasoningValidationMetadata,
  domains: ExecutiveReasoningValidationDomains,
  validatedPhases: ExecutiveReasoningValidationMetadata.validatedPhases,
  totalRuleCount: ExecutiveReasoningValidationMetadata.totalRuleCount,
  totalDomainCount: ExecutiveReasoningValidationMetadata.totalDomainCount,
  foundationRuleCount: ExecutiveReasoningFoundationValidation.rules.length,
  registryRuleCount: ExecutiveReasoningRegistryValidation.rules.length,
  modelRuleCount: ExecutiveReasoningModelValidation.rules.length,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "architectural validation metadata",
      "validation domains",
      "validation rules",
      "validation manifest",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning",
      "inference",
      "evidence evaluation",
      "confidence calculation",
      "contradiction resolution",
      "planning",
      "orchestration",
      "decision making",
      "runtime execution",
      "business logic",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
