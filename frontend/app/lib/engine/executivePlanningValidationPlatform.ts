import { ExecutivePlanningFoundationValidation } from "./executivePlanningFoundationValidation.ts";
import { ExecutivePlanningModelValidation } from "./executivePlanningModelValidation.ts";
import { ExecutivePlanningOwnershipValidation } from "./executivePlanningOwnershipValidation.ts";
import { ExecutivePlanningPublicApiValidation } from "./executivePlanningPublicApiValidation.ts";
import { ExecutivePlanningRegistryValidation } from "./executivePlanningRegistryValidation.ts";
import type {
  ExecutivePlanningValidationPlatformMetadata,
  ExecutivePlanningValidationRule,
  ExecutivePlanningValidationSummary,
} from "./executivePlanningValidationTypes.ts";

const allRules = Object.freeze([
  ...ExecutivePlanningFoundationValidation.rules,
  ...ExecutivePlanningRegistryValidation.rules,
  ...ExecutivePlanningModelValidation.rules,
  ...ExecutivePlanningOwnershipValidation.rules,
  ...ExecutivePlanningPublicApiValidation.rules,
] as const);

const ruleIndex = Object.freeze(
  Object.fromEntries(allRules.map((rule) => [rule.id, rule])) as Readonly<
    Record<string, ExecutivePlanningValidationRule | undefined>
  >,
);

const metadata = Object.freeze({
  platformId: "ENG-5:4",
  name: "Executive Planning Validation Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.validation",
  description:
    "Canonical immutable metadata-only validation platform verifying ENG-5:1 Foundation, ENG-5:2 Registry, and ENG-5:3 Model architectural integrity.",
  status: Object.freeze({
    validation: "Validation",
    passed: "Pass",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    readyForManifest: "ReadyForManifest",
  } as const),
  dependencyOnFoundation: "executivePlanningIndex.ts",
  dependencyOnRegistry: "executivePlanningRegistryIndex.ts",
  dependencyOnModel: "executivePlanningModelIndex.ts",
  ownership: "ENG-5",
  ruleCount: 44,
  categoryCount: 5,
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  nextPhase: "ENG-5:5",
} as const satisfies ExecutivePlanningValidationPlatformMetadata);

const summary = Object.freeze({
  validationId: "ENG-5:4",
  phase: "ENG-5:4",
  namespace: "nexora.engine.executive.planning.validation",
  owner: "ENG-5",
  categoryCount: 5,
  ruleCount: 44,
  passedRuleCount: allRules.filter(({ status }) => status === "Pass").length,
  foundationRuleCount: 8,
  registryRuleCount: 10,
  modelRuleCount: 10,
  ownershipRuleCount: 8,
  publicApiRuleCount: 8,
  status: "Pass",
  nextPhase: "ENG-5:5",
  manifestReady: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningValidationSummary);

export const ExecutivePlanningValidationPlatform = Object.freeze({
  metadata,
  foundation: ExecutivePlanningFoundationValidation,
  registry: ExecutivePlanningRegistryValidation,
  model: ExecutivePlanningModelValidation,
  ownership: ExecutivePlanningOwnershipValidation,
  publicApi: ExecutivePlanningPublicApiValidation,
  summary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

export const getExecutivePlanningValidationPlatform = () => ExecutivePlanningValidationPlatform;
export const getExecutivePlanningValidationMetadata = () => metadata;
export const getExecutivePlanningValidationSummary = () => summary;
export const getExecutivePlanningValidationRuleById = (
  id: string,
): ExecutivePlanningValidationRule | undefined => ruleIndex[id];
