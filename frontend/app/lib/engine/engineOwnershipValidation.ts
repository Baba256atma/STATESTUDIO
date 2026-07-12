import { ExecutiveEngineDependencyRegistry } from "./engineRegistryIndex.ts";
import { ExecutiveEngineModelRegistry } from "./engineModelIndex.ts";
import type { ExecutiveEngineValidationCheck, ExecutiveEngineValidationResult } from "./engineValidationTypes.ts";

const makeResult = (domain: ExecutiveEngineValidationResult["domain"], checks: readonly ExecutiveEngineValidationCheck[]) => {
  const passedChecks = checks.filter((item) => item.status === "PASS").length;
  return Object.freeze({ domain, checks, totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks, status: passedChecks === checks.length ? "PASS" : "FAIL", metadataOnly: true, immutable: true, deterministic: true } as const satisfies ExecutiveEngineValidationResult);
};
const check = (id: string, name: string, pass: boolean) => Object.freeze({ id, name, status: pass ? "PASS" : "FAIL", description: `Verifies ${name.toLowerCase()} metadata.`, metadataOnly: true } as const satisfies ExecutiveEngineValidationCheck);
const ownedRepresentations = Object.freeze(["executive-request", "executive-intent", "executive-goal", "executive-context", "executive-plan", "executive-reasoning-record", "executive-decision", "executive-coordination-instruction", "executive-outcome"]);
export const ExecutiveEngineOwnershipValidation = makeResult("Ownership", Object.freeze([
  check("engine-ownership-owner", "Engine Ownership", ExecutiveEngineModelRegistry.every((model) => model.owner === "Engine")),
  check("engine-ownership-representations", "Owned Representation Scope", ownedRepresentations.every((id) => ExecutiveEngineModelRegistry.some((model) => model.id === id))),
  check("engine-ownership-external", "External Layer Ownership Boundaries", ExecutiveEngineModelRegistry.every((model) => model.referencePolicies.every((policy) => !policy.includes("ownership-transfer")))),
]));
const approvedDependencies = Object.freeze(["CORE", "CORE-TEN", "BUS", "OPS"]);
export const ExecutiveEngineDependencyValidation = makeResult("Dependency", Object.freeze([
  check("engine-dependency-approved", "Approved Public Dependencies", ExecutiveEngineDependencyRegistry.every((entry) => approvedDependencies.includes(entry.id))),
  check("engine-dependency-public", "Public API Dependencies", ExecutiveEngineDependencyRegistry.every((entry) => entry.dependencyType === "PublicApi")),
  check("engine-dependency-circular", "No Circular Dependencies", ExecutiveEngineDependencyRegistry.every((entry) => !entry.circularDependencyAllowed)),
]));
const prohibitedFields = Object.freeze(["tasks", "workflows", "projects", "schedules", "dependencies", "automationrules", "kpientities", "okrentities", "financeentities", "revenueentities", "portfolioentities", "resourceentities", "organizationentities", "tenantidentities", "persistencerecords"]);
const modelFields = ExecutiveEngineModelRegistry.flatMap((model) => model.fields.map((field) => field.toLowerCase()));
export const ExecutiveEngineAntiDuplicationValidation = makeResult("AntiDuplication", Object.freeze([
  check("engine-anti-domain-entities", "No External Domain Entity Duplication", prohibitedFields.every((field) => !modelFields.includes(field))),
  check("engine-anti-references", "External Entities By Reference", modelFields.some((field) => field.endsWith("references"))),
  check("engine-anti-tenant", "Tenant Identity By Reference", modelFields.includes("tenantreference") && !modelFields.includes("tenantidentity")),
]));
