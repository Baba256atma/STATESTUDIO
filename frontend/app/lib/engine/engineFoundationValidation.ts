import { ExecutiveEngineContracts, ExecutiveEngineFoundation, ExecutiveEngineMetadata, ExecutiveEngineRegistry, getExecutiveEngineFoundation, getExecutiveEngineMetadata } from "./engineIndex.ts";
import type { ExecutiveEngineValidationCheck, ExecutiveEngineValidationResult } from "./engineValidationTypes.ts";

const check = (id: string, name: string, pass: boolean, description: string) => Object.freeze({ id, name, status: pass ? "PASS" : "FAIL", description, metadataOnly: true } as const satisfies ExecutiveEngineValidationCheck);
const checks = Object.freeze([
  check("engine-foundation-identity", "Engine Identity", ExecutiveEngineRegistry.platformId === "ENG-1:1", "Verifies canonical Engine identity metadata."),
  check("engine-foundation-role", "Architectural Role", ExecutiveEngineRegistry.architecturalRole === "ExecutiveBrain", "Verifies Executive Brain role metadata."),
  check("engine-foundation-contracts", "Responsibility Contracts", ExecutiveEngineContracts.length === 8, "Verifies eight responsibility contracts."),
  check("engine-foundation-dependencies", "Dependency Policy", ExecutiveEngineMetadata.publicDependencies.length === 4, "Verifies approved public dependencies."),
  check("engine-foundation-boundaries", "Platform Boundaries", ExecutiveEngineMetadata.boundaries.length >= 18, "Verifies explicit runtime-free boundaries."),
  check("engine-foundation-release", "Release Metadata", ExecutiveEngineMetadata.releaseMetadata.phase === "ENG-1:1", "Verifies foundation release metadata."),
  check("engine-foundation-api", "Foundation Public API", getExecutiveEngineFoundation() === ExecutiveEngineFoundation && getExecutiveEngineMetadata() === ExecutiveEngineMetadata, "Verifies canonical public helper references."),
] as const);
const passedChecks = checks.filter((item) => item.status === "PASS").length;
export const ExecutiveEngineFoundationValidation = Object.freeze({
  domain: "Foundation", checks, totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks,
  status: passedChecks === checks.length ? "PASS" : "FAIL", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineValidationResult);
