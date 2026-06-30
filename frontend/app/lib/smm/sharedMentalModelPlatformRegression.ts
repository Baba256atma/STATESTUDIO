/**
 * SMM-8 — Regression runner (read-only validation over SMM-1 through SMM-7).
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildSmmPlatformFoundation } from "./smmPlatformExports.ts";
import { buildSharedMentalModelContracts } from "./sharedMentalModelExports.ts";
import { buildSharedMentalModelGovernancePlatform } from "./sharedMentalModelGovernanceExports.ts";
import { buildSharedMentalModelRegistry } from "./sharedMentalModelIdentityExports.ts";
import { getSharedMentalModelCertifiedPhaseRegistrations } from "./sharedMentalModelPlatformFreezeRegistry.ts";
import type {
  SharedMentalModelPlatformCertificationCheck,
  SharedMentalModelPlatformRegressionResult,
} from "./sharedMentalModelPlatformFreezeTypes.ts";
import { buildSharedMentalModelQueryPlatform } from "./sharedMentalModelQueryExports.ts";
import { buildSharedMentalModelSnapshotPlatform } from "./sharedMentalModelSnapshotExports.ts";
import { buildSharedMentalModelSynchronizationPlatform } from "./sharedMentalModelSynchronizationExports.ts";

const SMM_LIBRARY_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TIMESTAMP = "2026-01-01T00:00:00.000Z";

const LAYER_BUILDERS = Object.freeze({
  buildSmmPlatformFoundation,
  buildSharedMentalModelContracts,
  buildSharedMentalModelRegistry,
  buildSharedMentalModelSnapshotPlatform,
  buildSharedMentalModelSynchronizationPlatform,
  buildSharedMentalModelQueryPlatform,
  buildSharedMentalModelGovernancePlatform,
} as const);

function check(id: string, title: string, passed: boolean, evidence: string): SharedMentalModelPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function verifyPhaseFilesExist(): SharedMentalModelPlatformCertificationCheck {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  const missing: string[] = [];
  for (const phase of phases) {
    for (const file of phase.requiredFiles) {
      if (!existsSync(join(SMM_LIBRARY_DIR, file))) {
        missing.push(`${phase.phaseId}:${file}`);
      }
    }
  }
  return check(
    "phase_files_exist",
    "SMM-1 through SMM-7 required files exist",
    missing.length === 0,
    missing.length === 0 ? `${phases.length} phases verified` : missing.slice(0, 3).join(", ")
  );
}

function verifyLayerInitialization(timestamp: string): readonly SharedMentalModelPlatformCertificationCheck[] {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  return Object.freeze(
    phases.map((phase) => {
      const builder = LAYER_BUILDERS[phase.buildLayerApi as keyof typeof LAYER_BUILDERS];
      if (!builder) {
        return check(`layer_${phase.phaseId}`, `${phase.title} layer builder exists`, false, phase.buildLayerApi);
      }
      const result = builder(timestamp);
      return check(
        `layer_${phase.phaseId}`,
        `${phase.title} layer initializes`,
        result.success,
        result.reason
      );
    })
  );
}

function verifyPublicApiStability(): SharedMentalModelPlatformCertificationCheck {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  const empty = phases.filter((phase) => phase.publicApis.length === 0);
  return check(
    "public_api_stability",
    "All certified phases publish public APIs",
    empty.length === 0,
    empty.length === 0 ? `${phases.reduce((total, phase) => total + phase.publicApis.length, 0)} APIs registered` : empty.map((p) => p.phaseId).join(", ")
  );
}

function verifyVersionConsistency(): SharedMentalModelPlatformCertificationCheck {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  const mismatched = phases.filter((phase) => phase.phaseId !== phase.contractVersion);
  return check(
    "version_consistency",
    "Phase IDs match contract versions",
    mismatched.length === 0,
    mismatched.length === 0 ? "SMM/1 through SMM/7 aligned" : mismatched.map((p) => p.phaseId).join(", ")
  );
}

function verifyDependencyChainIntegrity(): SharedMentalModelPlatformCertificationCheck {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  const expected = ["SMM/1", "SMM/2", "SMM/3", "SMM/4", "SMM/5", "SMM/6", "SMM/7"];
  const actual = phases.map((phase) => phase.phaseId);
  return check(
    "dependency_chain_integrity",
    "Certified phase dependency chain is intact",
    JSON.stringify(actual) === JSON.stringify(expected),
    actual.join(" -> ")
  );
}

export function runSharedMentalModelPlatformRegression(
  timestamp: string = DEFAULT_TIMESTAMP
): SharedMentalModelPlatformRegressionResult {
  const checks: SharedMentalModelPlatformCertificationCheck[] = [
    verifyPhaseFilesExist(),
    verifyPublicApiStability(),
    verifyVersionConsistency(),
    verifyDependencyChainIntegrity(),
    ...verifyLayerInitialization(timestamp),
  ];
  const passed = checks.filter((entry) => entry.passed).length;
  return Object.freeze({
    success: passed === checks.length,
    checksPassed: passed,
    checksTotal: checks.length,
    summary: `${passed}/${checks.length} regression checks passed.`,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}
