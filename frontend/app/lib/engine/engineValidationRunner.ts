import * as foundationApi from "./engineIndex.ts";
import * as registryApi from "./engineRegistryIndex.ts";
import * as modelApi from "./engineModelIndex.ts";
import { ExecutiveEngineFoundationValidation } from "./engineFoundationValidation.ts";
import { ExecutiveEngineModelValidation } from "./engineModelValidation.ts";
import { ExecutiveEngineAntiDuplicationValidation, ExecutiveEngineDependencyValidation, ExecutiveEngineOwnershipValidation } from "./engineOwnershipValidation.ts";
import { ExecutiveEngineRegistryValidation } from "./engineRegistryValidation.ts";
import type { ExecutiveEngineValidationCheck, ExecutiveEngineValidationResult, ExecutiveEngineValidationSummary } from "./engineValidationTypes.ts";

const check = (id: string, name: string, pass: boolean) => Object.freeze({ id, name, status: pass ? "PASS" : "FAIL", description: `Verifies ${name.toLowerCase()} metadata.`, metadataOnly: true } as const satisfies ExecutiveEngineValidationCheck);
const createResult = (domain: "Immutability" | "PublicApi", checks: readonly ExecutiveEngineValidationCheck[]) => {
  const passedChecks = checks.filter((item) => item.status === "PASS").length;
  return Object.freeze({ domain, checks, totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks, status: passedChecks === checks.length ? "PASS" : "FAIL", metadataOnly: true, immutable: true, deterministic: true } as const satisfies ExecutiveEngineValidationResult);
};
export const ExecutiveEngineImmutabilityValidation = createResult("Immutability", Object.freeze([
  check("engine-immutable-foundation", "Frozen Foundation Exports", Object.isFrozen(foundationApi.ExecutiveEngineFoundation) && Object.isFrozen(foundationApi.ExecutiveEngineMetadata)),
  check("engine-immutable-registry", "Frozen Registry Exports", Object.isFrozen(registryApi.ExecutiveEngineRegistryManifest) && registryApi.ExecutiveEngineComponentRegistry.every(Object.isFrozen)),
  check("engine-immutable-model", "Frozen Model Exports", Object.isFrozen(modelApi.ExecutiveEngineModelRegistry) && modelApi.ExecutiveEngineModelRegistry.every((model) => Object.isFrozen(model.fields))),
  check("engine-immutable-helpers", "Immutable Helper Results", Object.isFrozen(modelApi.getExecutiveEngineModelSummary()) && Object.isFrozen(registryApi.getExecutiveEngineRegistryManifest())),
]));
export const ExecutiveEnginePublicApiValidation = createResult("PublicApi", Object.freeze([
  check("engine-api-foundation", "Foundation Required Exports", ["ExecutiveEngineFoundation", "ExecutiveEngineContracts", "ExecutiveEngineRegistry", "ExecutiveEngineMetadata", "getExecutiveEngineFoundation", "getExecutiveEngineMetadata"].every((key) => key in foundationApi)),
  check("engine-api-registry", "Registry Required Exports", ["ExecutiveEngineCapabilityRegistry", "ExecutiveEngineComponentRegistry", "ExecutiveEngineDependencyRegistry", "ExecutiveEngineLifecycleRegistry", "ExecutiveEngineRegistryManifest"].every((key) => key in registryApi)),
  check("engine-api-model", "Model Required Exports", ["ExecutiveRequestModel", "ExecutiveIntentModel", "ExecutiveContextModel", "ExecutivePlanModel", "ExecutiveDecisionModel", "ExecutiveOutcomeModel", "ExecutiveEngineModelRegistry"].every((key) => key in modelApi)),
  check("engine-api-naming", "Public Naming Consistency", [...Object.keys(foundationApi), ...Object.keys(registryApi), ...Object.keys(modelApi)].every((key) => !/internal|private|test/i.test(key))),
  check("engine-api-deterministic", "Deterministic Public Helpers", modelApi.getExecutiveEngineModelRegistry() === modelApi.ExecutiveEngineModelRegistry && foundationApi.getExecutiveEngineFoundation() === foundationApi.ExecutiveEngineFoundation),
]));

const domains = Object.freeze([ExecutiveEngineFoundationValidation, ExecutiveEngineRegistryValidation, ExecutiveEngineModelValidation, ExecutiveEngineOwnershipValidation, ExecutiveEngineDependencyValidation, ExecutiveEngineAntiDuplicationValidation, ExecutiveEngineImmutabilityValidation, ExecutiveEnginePublicApiValidation] as const);
const buildSummary = () => {
  const passedDomains = domains.filter((domain) => domain.status === "PASS").length;
  const totalChecks = domains.reduce((total, domain) => total + domain.totalChecks, 0);
  const passedChecks = domains.reduce((total, domain) => total + domain.passedChecks, 0);
  return Object.freeze({ totalDomains: 8, passedDomains, failedDomains: domains.length - passedDomains,
    totalChecks, passedChecks, failedChecks: totalChecks - passedChecks,
    status: passedDomains === domains.length ? "PASS" : "FAIL",
    releaseReadiness: passedDomains === domains.length ? "ReadyForManifest" : "Blocked",
    nextPhase: "ENG-1:5 — Executive Engine Manifest",
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutiveEngineValidationSummary);
};

export const ExecutiveEngineValidationRunner = Object.freeze({
  id: "ENG-1:4-validation-runner", domains, mode: "MetadataOnly", runtimeBehavior: false,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
export const runExecutiveEngineValidation = () => buildSummary();
export const getExecutiveEngineValidationSummary = () => buildSummary();
