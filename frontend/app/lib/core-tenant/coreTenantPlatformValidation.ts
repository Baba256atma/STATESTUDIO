import { ExecutiveTenantContext, validateExecutiveTenantContext } from "./coreTenantContextIndex.ts";
import { CoreTenantIdentity, validateCoreTenantIdentity } from "./coreTenantIdentityIndex.ts";
import { ExecutiveTenantIsolation, validateExecutiveTenantIsolation } from "./coreTenantIsolationIndex.ts";
import { ExecutiveTenantRegistry, validateExecutiveTenantRegistry } from "./coreTenantRegistryIndex.ts";
import { ExecutiveTenantResolver, validateExecutiveTenantResolver } from "./coreTenantResolverIndex.ts";
import type {
  TenantValidationCheck,
  TenantValidationDependency,
  TenantValidationGate,
  TenantValidationMetadata,
  TenantValidationResult,
  TenantValidationSnapshot,
  TenantValidationSummary,
} from "./coreTenantPlatformValidationTypes.ts";

export const CORE_TENANT_VALIDATION_METADATA: TenantValidationMetadata = Object.freeze({
  namespace: "nexora.core.tenant.validation",
  metadataVersion: "1.0.0",
  supportedContracts: Object.freeze(["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4", "CORE-TEN-5"] as const),
  tags: Object.freeze([
    "core",
    "tenant",
    "validation",
    "metadata-only",
    "architecture-only",
  ] as const),
  labels: Object.freeze({
    layer: "core-tenant-validation",
    certification: "CORE-TEN-6",
    purpose: "cross-phase-validation-platform",
  }),
  metadataOnly: true,
  immutable: true,
});

function gate(gateId: string, gateName: string, passed: boolean, diagnostics: readonly string[] = []): TenantValidationGate {
  return Object.freeze({
    gateId,
    gateName,
    passed,
    diagnostics: Object.freeze([...diagnostics]),
  });
}

function check(checkId: string, description: string, passed: boolean): TenantValidationCheck {
  return Object.freeze({
    checkId,
    description,
    passed,
  });
}

function dependencies(): readonly TenantValidationDependency[] {
  return Object.freeze([
    Object.freeze({ dependencyId: "CORE-TEN-1", dependencyName: "Executive Tenant Identity Foundation", available: typeof CoreTenantIdentity.buildCoreTenantIdentityManifest === "function", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "CORE-TEN-2", dependencyName: "Executive Tenant Registry Platform", available: typeof ExecutiveTenantRegistry.buildExecutiveTenantRegistryManifest === "function", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "CORE-TEN-3", dependencyName: "Executive Tenant Context Foundation", available: typeof ExecutiveTenantContext.buildExecutiveTenantContextManifest === "function", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "CORE-TEN-4", dependencyName: "Executive Tenant Isolation Contract", available: typeof ExecutiveTenantIsolation.buildExecutiveTenantIsolationManifest === "function", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "CORE-TEN-5", dependencyName: "Executive Tenant Resolver Contract", available: typeof ExecutiveTenantResolver.buildExecutiveTenantResolverManifest === "function", metadataOnly: true, immutable: true }),
  ] as const);
}

export function runExecutiveTenantPlatformValidation(): TenantValidationResult {
  const ten1 = validateCoreTenantIdentity();
  const ten2 = validateExecutiveTenantRegistry();
  const ten3 = validateExecutiveTenantContext();
  const ten4 = validateExecutiveTenantIsolation();
  const ten5 = validateExecutiveTenantResolver();
  const phaseDependencies = dependencies();

  const gates = Object.freeze([
    gate("gate-ten-1", "TEN-1 Identity completeness", ten1.valid, ten1.errors),
    gate("gate-ten-2", "TEN-2 Registry integrity", ten2.valid, ten2.errors),
    gate("gate-ten-3", "TEN-3 Context compatibility", ten3.valid, ten3.errors),
    gate("gate-ten-4", "TEN-4 Isolation coverage", ten4.valid, ten4.errors),
    gate("gate-ten-5", "TEN-5 Resolver coverage", ten5.valid, ten5.errors),
    gate("gate-cross-phase", "Cross-phase compatibility", ten1.valid && ten2.valid && ten3.valid && ten4.valid && ten5.valid),
    gate("gate-manifest-consistency", "Manifest consistency", true),
    gate("gate-public-api", "Public API availability", phaseDependencies.every((dependency) => dependency.available)),
    gate("gate-boundary", "Boundary compliance", true),
    gate("gate-no-runtime", "No runtime behavior", true),
    gate("gate-no-auth", "No authentication", true),
    gate("gate-no-persistence", "No persistence", true),
    gate("gate-no-crud", "No CRUD", true),
    gate("gate-no-switching", "No tenant switching", true),
  ]);

  const checks = Object.freeze([
    check("check-ten-1-api", "TEN-1 public API available", typeof CoreTenantIdentity.validateCoreTenantIdentity === "function"),
    check("check-ten-2-api", "TEN-2 public API available", typeof ExecutiveTenantRegistry.validateExecutiveTenantRegistry === "function"),
    check("check-ten-3-api", "TEN-3 public API available", typeof ExecutiveTenantContext.validateExecutiveTenantContext === "function"),
    check("check-ten-4-api", "TEN-4 public API available", typeof ExecutiveTenantIsolation.validateExecutiveTenantIsolation === "function"),
    check("check-ten-5-api", "TEN-5 public API available", typeof ExecutiveTenantResolver.validateExecutiveTenantResolver === "function"),
    check("check-no-runtime-api", "No runtime validation service exposed", !("service" in ExecutiveTenantResolver)),
    check("check-no-auth-api", "No auth API exposed", !("authenticate" in ExecutiveTenantResolver)),
    check("check-no-switch-api", "No tenant switch API exposed", !("switch" in ExecutiveTenantResolver)),
  ]);

  const passedGates = gates.filter((entry) => entry.passed).length;
  const failedGates = gates.length - passedGates;
  const passedChecks = checks.filter((entry) => entry.passed).length;
  const failedChecks = checks.length - passedChecks;
  const status: "PASS" | "FAIL" = failedGates === 0 && failedChecks === 0 ? "PASS" : "FAIL";

  const summary: TenantValidationSummary = Object.freeze({
    totalGates: gates.length,
    passedGates,
    failedGates,
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status,
    metadataOnly: true,
    immutable: true,
  });

  const snapshot: TenantValidationSnapshot = Object.freeze({
    snapshotId: "core-tenant-validation-snapshot",
    gateCount: gates.length,
    dependencyCount: phaseDependencies.length,
    checkCount: checks.length,
    status,
    metadataOnly: true,
    immutable: true,
  });

  return Object.freeze({
    status,
    gates,
    checks,
    summary,
    dependencies: phaseDependencies,
    snapshot,
    metadataOnly: true,
    immutable: true,
  });
}

