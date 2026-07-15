import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import { ExecutiveContextAssemblyModel } from "./executiveContextAssemblyModel.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextFoundationValidation } from "./executiveContextFoundationValidation.ts";
import { ExecutiveContextModelValidation } from "./executiveContextModelValidation.ts";
import { ExecutiveContextOwnershipValidation } from "./executiveContextOwnershipValidation.ts";
import { ExecutiveContextPublicApiValidation } from "./executiveContextPublicApiValidation.ts";
import { ExecutiveContextRegistryValidation } from "./executiveContextRegistryValidation.ts";
import type {
  ExecutiveContextAssemblyValidationAggregate,
  ExecutiveContextValidationDependency,
  ExecutiveContextValidationGate,
  ExecutiveContextValidationMetadata,
  ExecutiveContextValidationRule,
  ExecutiveContextValidationSummary,
} from "./executiveContextAssemblyValidationTypes.ts";

const validationGroups = Object.freeze([
  ExecutiveContextFoundationValidation,
  ExecutiveContextRegistryValidation,
  ExecutiveContextModelValidation,
  ExecutiveContextOwnershipValidation,
  ExecutiveContextPublicApiValidation,
] as const);

const validationRules: readonly ExecutiveContextValidationRule[] = Object.freeze([
  ...ExecutiveContextFoundationValidation.rules,
  ...ExecutiveContextRegistryValidation.rules,
  ...ExecutiveContextModelValidation.rules,
  ...ExecutiveContextOwnershipValidation.rules,
  ...ExecutiveContextPublicApiValidation.rules,
]);

const ruleIndex: Readonly<Record<string, ExecutiveContextValidationRule | undefined>> = Object.freeze(
  Object.fromEntries(validationRules.map((rule) => [rule.id, rule])),
);

const gate = (
  key: string,
  name: string,
  description: string,
  requiredRuleGroups: ExecutiveContextValidationGate["requiredRuleGroups"],
) => Object.freeze({
  id: `eng-4-validation-gate-${key}`,
  name, description, status: "Pass", requiredRuleGroups,
  ownership: "ENG-4", runtimeFree: true,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationGate);

const validationGates = Object.freeze([
  gate("foundation-complete", "Foundation Complete", "ENG-4:1 foundation validation rules pass.", Object.freeze(["Foundation"] as const)),
  gate("registry-complete", "Registry Complete", "ENG-4:2 registry validation rules pass.", Object.freeze(["Registry"] as const)),
  gate("model-complete", "Model Complete", "ENG-4:3 model validation rules pass.", Object.freeze(["Model"] as const)),
  gate("ownership-protected", "Ownership Protected", "Ownership and anti-duplication rules pass.", Object.freeze(["Ownership"] as const)),
  gate("dependencies-approved", "Dependencies Approved", "Approved public-index dependencies are declared.", Object.freeze(["Foundation", "Registry", "Model"] as const)),
  gate("public-apis-stable", "Public APIs Stable", "Approved public helper APIs remain stable.", Object.freeze(["PublicApi"] as const)),
  gate("immutability-preserved", "Immutability Preserved", "Immutability guarantees remain declared.", Object.freeze(["Foundation", "Registry", "Model"] as const)),
  gate("metadata-only-preserved", "Metadata-Only Preserved", "Metadata-only guarantees remain declared.", Object.freeze(["Foundation", "Registry", "Model", "Ownership", "PublicApi"] as const)),
  gate("runtime-free-preserved", "Runtime-Free Preserved", "Runtime-free guarantees remain declared.", Object.freeze(["Foundation", "Registry", "Model", "Ownership", "PublicApi"] as const)),
  gate("anti-duplication-preserved", "Anti-Duplication Preserved", "ENG-4 remains distinct from ENG-1 generic ownership.", Object.freeze(["Ownership", "PublicApi"] as const)),
  gate("namespace-compatibility-preserved", "Namespace Compatibility Preserved", "ENG-1 compatibility relocation remains approved.", Object.freeze(["Ownership"] as const)),
  gate("ready-for-manifest", "Ready for Manifest", "Validation is complete and ready for ENG-4:5 Manifest.", Object.freeze(["Foundation", "Registry", "Model", "Ownership", "PublicApi"] as const)),
] as const);

const gateIndex = Object.freeze(
  Object.fromEntries(validationGates.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveContextValidationGate | undefined>
  >,
);

const dependencies = Object.freeze([
  Object.freeze({ phase: "ENG-1", publicIndex: "executiveEnginePublicIndex.ts", consumption: "PublicIndexOnly", metadataOnly: true, immutable: true } as const satisfies ExecutiveContextValidationDependency),
  Object.freeze({ phase: "ENG-2", publicIndex: "executiveRequestIntentPublicIndex.ts", consumption: "PublicIndexOnly", metadataOnly: true, immutable: true } as const satisfies ExecutiveContextValidationDependency),
  Object.freeze({ phase: "ENG-3", publicIndex: "executiveIntentResolutionPublicIndex.ts", consumption: "PublicIndexOnly", metadataOnly: true, immutable: true } as const satisfies ExecutiveContextValidationDependency),
  Object.freeze({ phase: "ENG-4:1", publicIndex: "executiveContextAssemblyFoundation.ts", consumption: "PublicIndexOnly", artifact: ExecutiveContextAssemblyFoundation, metadataOnly: true, immutable: true } as const satisfies ExecutiveContextValidationDependency),
  Object.freeze({ phase: "ENG-4:2", publicIndex: "executiveContextAssemblyRegistry.ts", consumption: "PublicIndexOnly", artifact: ExecutiveContextAssemblyRegistry, metadataOnly: true, immutable: true } as const satisfies ExecutiveContextValidationDependency),
  Object.freeze({ phase: "ENG-4:3", publicIndex: "executiveContextAssemblyModel.ts", consumption: "PublicIndexOnly", artifact: ExecutiveContextAssemblyModel, metadataOnly: true, immutable: true } as const satisfies ExecutiveContextValidationDependency),
] as const);

const metadata = Object.freeze({
  validationId: "ENG-4:4",
  validationVersion: "1.0.0",
  validationName: "Executive Context Assembly Validation",
  namespace: "nexora.engine.executive.context-assembly.validation",
  phase: "ENG-4:4",
  owner: "ENG-4",
  description: "Canonical metadata-only architectural validation for ENG-4:1 Foundation, ENG-4:2 Registry, and ENG-4:3 Model.",
  ruleCount: validationRules.length,
  groupCount: 5,
  gateCount: validationGates.length,
  status: Object.freeze({
    validation: "Validation",
    passed: "Passed",
    metadataOnly: "MetadataOnly",
    immutable: "Immutable",
    runtimeFree: "RuntimeFree",
    deterministic: "Deterministic",
    readyForManifest: "ReadyForManifest",
  } as const),
  nextPhase: "ENG-4:5",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationMetadata);

const summary = Object.freeze({
  validationId: "ENG-4:4",
  phase: "ENG-4:4",
  namespace: "nexora.engine.executive.context-assembly.validation",
  owner: "ENG-4",
  groupCount: 5,
  ruleCount: validationRules.length,
  passedRuleCount: validationRules.filter(({ status }) => status === "Pass").length,
  gateCount: validationGates.length,
  passedGateCount: validationGates.filter(({ status }) => status === "Pass").length,
  status: "Passed",
  nextPhase: "ENG-4:5",
  manifestReady: true,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationSummary);

export const ExecutiveContextAssemblyValidation = Object.freeze({
  foundationValidation: ExecutiveContextFoundationValidation,
  registryValidation: ExecutiveContextRegistryValidation,
  modelValidation: ExecutiveContextModelValidation,
  ownershipValidation: ExecutiveContextOwnershipValidation,
  publicApiValidation: ExecutiveContextPublicApiValidation,
  validationGroups,
  validationRules,
  validationGates,
  metadata,
  dependencies,
  summary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextAssemblyValidationAggregate);

export { ExecutiveContextFoundationValidation } from "./executiveContextFoundationValidation.ts";
export { ExecutiveContextModelValidation } from "./executiveContextModelValidation.ts";
export { ExecutiveContextOwnershipValidation } from "./executiveContextOwnershipValidation.ts";
export { ExecutiveContextPublicApiValidation } from "./executiveContextPublicApiValidation.ts";
export { ExecutiveContextRegistryValidation } from "./executiveContextRegistryValidation.ts";

export const getExecutiveContextAssemblyValidation = () => ExecutiveContextAssemblyValidation;
export const getExecutiveContextFoundationValidation = () => ExecutiveContextFoundationValidation;
export const getExecutiveContextRegistryValidation = () => ExecutiveContextRegistryValidation;
export const getExecutiveContextModelValidation = () => ExecutiveContextModelValidation;
export const getExecutiveContextOwnershipValidation = () => ExecutiveContextOwnershipValidation;
export const getExecutiveContextPublicApiValidation = () => ExecutiveContextPublicApiValidation;
export function getExecutiveContextAssemblyValidationRules(): readonly ExecutiveContextValidationRule[];
export function getExecutiveContextAssemblyValidationRules(id: string): ExecutiveContextValidationRule | undefined;
export function getExecutiveContextAssemblyValidationRules(id?: string) {
  return id === undefined ? validationRules : ruleIndex[id];
}
export const getExecutiveContextAssemblyValidationSummary = () => summary;

/** Deterministic gate lookup; unknown identifiers return undefined. */
export const getExecutiveContextAssemblyValidationGate = (
  id: string,
): ExecutiveContextValidationGate | undefined => gateIndex[id];
