/**
 * ASS-9 — Regression runner (read-only validation over ASS-1 through ASS-8).
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildExecutiveAssistantClarificationArchitecture } from "./executiveAssistantClarificationExports.ts";
import { buildExecutiveAssistantConversationContracts } from "./executiveAssistantConversationExports.ts";
import { buildExecutiveAssistantConversationStateArchitecture } from "./executiveAssistantConversationStateExports.ts";
import { buildExecutiveAssistantCoordinationManifest } from "./executiveAssistantCoordinationExports.ts";
import { buildExecutiveAssistantIntentInterpretationContracts } from "./executiveAssistantIntentExports.ts";
import { buildExecutiveAssistantPlatformFoundation } from "./executiveAssistantPlatformExports.ts";
import { getExecutiveAssistantCertifiedPhaseRegistrations } from "./executiveAssistantPlatformFreezeRegistry.ts";
import type {
  ExecutiveAssistantPlatformCertificationCheck,
  ExecutiveAssistantPlatformRegressionResult,
} from "./executiveAssistantPlatformFreezeTypes.ts";
import { buildExecutiveAssistantResponseContractArchitecture } from "./executiveAssistantResponseExports.ts";
import { buildExecutiveAssistantRoutingArchitecture } from "./executiveAssistantRoutingExports.ts";

const ASS_LIBRARY_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TIMESTAMP = "2026-01-01T00:00:00.000Z";

const LAYER_BUILDERS = Object.freeze({
  buildExecutiveAssistantPlatformFoundation,
  buildExecutiveAssistantConversationContracts,
  buildExecutiveAssistantConversationStateArchitecture,
  buildExecutiveAssistantRoutingArchitecture,
  buildExecutiveAssistantIntentInterpretationContracts,
  buildExecutiveAssistantResponseContractArchitecture,
  buildExecutiveAssistantClarificationArchitecture,
  buildExecutiveAssistantCoordinationManifest,
} as const);

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveAssistantPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function verifyPhaseFilesExist(): ExecutiveAssistantPlatformCertificationCheck {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
  const missing: string[] = [];
  for (const phase of phases) {
    for (const file of phase.requiredFiles) {
      if (!existsSync(join(ASS_LIBRARY_DIR, file))) {
        missing.push(`${phase.phaseId}:${file}`);
      }
    }
  }
  return check(
    "phase_files_exist",
    "ASS-1 through ASS-8 required files exist",
    missing.length === 0,
    missing.length === 0 ? `${phases.length} phases verified` : missing.slice(0, 3).join(", ")
  );
}

function verifyLayerInitialization(timestamp: string): readonly ExecutiveAssistantPlatformCertificationCheck[] {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
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

function verifyPublicApiStability(): ExecutiveAssistantPlatformCertificationCheck {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
  const empty = phases.filter((phase) => phase.publicApis.length === 0);
  return check(
    "public_api_stability",
    "All certified phases publish public APIs",
    empty.length === 0,
    empty.length === 0
      ? `${phases.reduce((total, phase) => total + phase.publicApis.length, 0)} APIs registered`
      : empty.map((phase) => phase.phaseId).join(", ")
  );
}

function verifyVersionConsistency(): ExecutiveAssistantPlatformCertificationCheck {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
  const mismatched = phases.filter((phase) => phase.phaseId !== phase.contractVersion);
  return check(
    "version_consistency",
    "Phase IDs match contract versions",
    mismatched.length === 0,
    mismatched.length === 0 ? "ASS/1 through ASS/8 aligned" : mismatched.map((phase) => phase.phaseId).join(", ")
  );
}

function verifyDependencyChainIntegrity(): ExecutiveAssistantPlatformCertificationCheck {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
  const expected = ["ASS/1", "ASS/2", "ASS/3", "ASS/4", "ASS/5", "ASS/6", "ASS/7", "ASS/8"];
  const actual = phases.map((phase) => phase.phaseId);
  return check(
    "dependency_chain_integrity",
    "Certified phase dependency chain is intact",
    JSON.stringify(actual) === JSON.stringify(expected),
    actual.join(" -> ")
  );
}

export function runExecutiveAssistantPlatformRegression(
  timestamp: string = DEFAULT_TIMESTAMP
): ExecutiveAssistantPlatformRegressionResult {
  const checks: ExecutiveAssistantPlatformCertificationCheck[] = [
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
