import { ExecutiveDecisionFoundationValidation } from "./executiveDecisionFoundationValidation.ts";
import { ExecutiveDecisionModelValidation } from "./executiveDecisionModelValidation.ts";
import { ExecutiveDecisionOwnershipValidation } from "./executiveDecisionOwnershipValidation.ts";
import { ExecutiveDecisionRegistryValidation } from "./executiveDecisionRegistryValidation.ts";

const allRules = Object.freeze([
  ...ExecutiveDecisionFoundationValidation.rules,
  ...ExecutiveDecisionRegistryValidation.rules,
  ...ExecutiveDecisionModelValidation.rules,
  ...ExecutiveDecisionOwnershipValidation.rules,
] as const);

export const ExecutiveDecisionValidationCategories = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Ownership",
  "Dependency",
  "Public API",
  "Immutability",
  "Metadata Compliance",
] as const);

export const ExecutiveDecisionValidationSeverities = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const);

export const ExecutiveDecisionValidationInventory = Object.freeze({
  foundationRuleCount: ExecutiveDecisionFoundationValidation.rules.length,
  registryRuleCount: ExecutiveDecisionRegistryValidation.rules.length,
  modelRuleCount: ExecutiveDecisionModelValidation.rules.length,
  ownershipRuleCount: ExecutiveDecisionOwnershipValidation.rules.length,
  totalRuleCount: allRules.length,
  categoryCount: ExecutiveDecisionValidationCategories.length,
  severityCount: ExecutiveDecisionValidationSeverities.length,
  validatedPhases: Object.freeze(["ENG-7:1", "ENG-7:2", "ENG-7:3"] as const),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveDecisionValidationManifest = Object.freeze({
  id: "eng-7-validation-manifest",
  name: "Executive Decision Validation Manifest",
  description:
    "Immutable aggregation of ENG-7:1 Foundation, ENG-7:2 Registry, ENG-7:3 Model, and ownership validation metadata.",
  foundation: ExecutiveDecisionFoundationValidation,
  registry: ExecutiveDecisionRegistryValidation,
  model: ExecutiveDecisionModelValidation,
  ownership: ExecutiveDecisionOwnershipValidation,
  inventory: ExecutiveDecisionValidationInventory,
  categories: ExecutiveDecisionValidationCategories,
  severities: ExecutiveDecisionValidationSeverities,
  rules: allRules,
  ownershipBoundary: Object.freeze({
    owner: "ENG-7",
    validates: Object.freeze([
      "decision architecture",
      "decision metadata",
      "decision publication contracts",
      "decision trace contracts",
    ] as const),
    neverValidates: Object.freeze([
      "business decisions",
      "confidence calculation",
      "risk calculation",
      "trade-off evaluation",
      "reasoning reconstruction",
      "workflow execution",
      "orchestration",
      "Advisor invocation",
      "Scene object creation",
    ] as const),
    neverDuplicates: Object.freeze([
      "ENG-2 request validation",
      "ENG-3 intent validation",
      "ENG-4 context validation",
      "ENG-5 planning validation",
      "ENG-6 reasoning validation",
      "ENG-8 orchestration validation",
    ] as const),
  } as const),
  readiness: "ReadyForDecisionManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
