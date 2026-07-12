import { ExecutiveEngineCapabilityRegistry, ExecutiveEngineComponentRegistry, ExecutiveEngineDependencyRegistry, ExecutiveEngineLifecycleRegistry, ExecutiveEngineRegistryManifest } from "./engineRegistryIndex.ts";
import type { ExecutiveEngineValidationCheck, ExecutiveEngineValidationResult } from "./engineValidationTypes.ts";

const result = (id: string, name: string, pass: boolean) => Object.freeze({ id, name, status: pass ? "PASS" : "FAIL", description: `Verifies ${name.toLowerCase()} metadata.`, metadataOnly: true } as const satisfies ExecutiveEngineValidationCheck);
const allIdsUnique = [ExecutiveEngineCapabilityRegistry, ExecutiveEngineComponentRegistry, ExecutiveEngineDependencyRegistry, ExecutiveEngineLifecycleRegistry].every((registry) => new Set(registry.map((entry) => entry.id)).size === registry.length);
const checks = Object.freeze([
  result("engine-registry-capabilities", "Capability Registry Completeness", ExecutiveEngineCapabilityRegistry.length === 8),
  result("engine-registry-components", "Component Registry Completeness", ExecutiveEngineComponentRegistry.length === 9),
  result("engine-registry-dependencies", "Dependency Registry Correctness", ExecutiveEngineDependencyRegistry.length === 4),
  result("engine-registry-lifecycle", "Lifecycle Registry Integrity", ExecutiveEngineLifecycleRegistry.length === 5),
  result("engine-registry-manifest", "Registry Manifest Consistency", ExecutiveEngineRegistryManifest.registryId === "ENG-1:2"),
  result("engine-registry-order", "Deterministic Ordering", ExecutiveEngineLifecycleRegistry.every((entry, index) => entry.order === index + 1)),
  result("engine-registry-unique", "Unique Identifiers", allIdsUnique),
] as const);
const passedChecks = checks.filter((item) => item.status === "PASS").length;
export const ExecutiveEngineRegistryValidation = Object.freeze({ domain: "Registry", checks, totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks, status: passedChecks === checks.length ? "PASS" : "FAIL", metadataOnly: true, immutable: true, deterministic: true } as const satisfies ExecutiveEngineValidationResult);
