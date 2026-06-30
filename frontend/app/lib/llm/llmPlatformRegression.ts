/**
 * LLM-12 — Regression runner (read-only validation over LLM-1 through LLM-11).
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildLlmAuditObservabilityLayer } from "./llmAuditExports.ts";
import { buildLlmContextBuilderLayer } from "./llmContextExports.ts";
import { buildLlmCostEstimatorLayer } from "./llmCostExports.ts";
import { buildLlmPlatformFoundation } from "./llmPlatformExports.ts";
import { getLlmCertifiedPhaseRegistrations } from "./llmPlatformFreezeRegistry.ts";
import type { LlmPlatformCertificationCheck, LlmPlatformRegressionResult } from "./llmPlatformFreezeTypes.ts";
import { buildLlmPromptBuilderLayer } from "./llmPromptExports.ts";
import { buildLlmProviderAdapterLayer } from "./llmProviderExports.ts";
import { buildLlmResilienceCoordinatorLayer } from "./llmResilienceExports.ts";
import { buildLlmModelRouterLayer } from "./llmRouterExports.ts";
import { buildLlmRuntimeContractLayer } from "./llmRuntimeExports.ts";
import { buildLlmSecurityRedactionLayer } from "./llmSecurityExports.ts";
import { buildLlmTokenMeterLayer } from "./llmTokenExports.ts";

const LLM_LIBRARY_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TIMESTAMP = "2026-01-01T00:00:00.000Z";

const LAYER_BUILDERS = Object.freeze({
  buildLlmPlatformFoundation,
  buildLlmProviderAdapterLayer,
  buildLlmRuntimeContractLayer,
  buildLlmPromptBuilderLayer,
  buildLlmContextBuilderLayer,
  buildLlmTokenMeterLayer,
  buildLlmCostEstimatorLayer,
  buildLlmModelRouterLayer,
  buildLlmAuditObservabilityLayer,
  buildLlmSecurityRedactionLayer,
  buildLlmResilienceCoordinatorLayer,
} as const);

function check(id: string, title: string, passed: boolean, evidence: string): LlmPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function verifyPhaseFilesExist(): LlmPlatformCertificationCheck {
  const phases = getLlmCertifiedPhaseRegistrations();
  const missing: string[] = [];
  for (const phase of phases) {
    for (const file of phase.requiredFiles) {
      if (!existsSync(join(LLM_LIBRARY_DIR, file))) {
        missing.push(`${phase.phaseId}:${file}`);
      }
    }
  }
  return check(
    "phase_files_exist",
    "LLM-1 through LLM-11 required files exist",
    missing.length === 0,
    missing.length === 0 ? `${phases.length} phases verified` : missing.slice(0, 3).join(", ")
  );
}

function verifyLayerInitialization(timestamp: string): readonly LlmPlatformCertificationCheck[] {
  const phases = getLlmCertifiedPhaseRegistrations();
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

function verifyPublicApiStability(): LlmPlatformCertificationCheck {
  const phases = getLlmCertifiedPhaseRegistrations();
  const empty = phases.filter((phase) => phase.publicApis.length === 0);
  return check(
    "public_api_stability",
    "All certified phases publish public APIs",
    empty.length === 0,
    empty.length === 0 ? `${phases.reduce((total, phase) => total + phase.publicApis.length, 0)} APIs registered` : empty.map((p) => p.phaseId).join(", ")
  );
}

function verifyVersionConsistency(): LlmPlatformCertificationCheck {
  const phases = getLlmCertifiedPhaseRegistrations();
  const mismatched = phases.filter((phase) => phase.phaseId !== phase.contractVersion);
  return check(
    "version_consistency",
    "Phase IDs match contract versions",
    mismatched.length === 0,
    mismatched.length === 0 ? "LLM/1 through LLM/11 aligned" : mismatched.map((p) => p.phaseId).join(", ")
  );
}

function verifyLlm13Independence(): LlmPlatformCertificationCheck {
  const mvpPhaseIds = getLlmCertifiedPhaseRegistrations().map((phase) => phase.phaseId);
  const cacheInMvp = mvpPhaseIds.includes("LLM/13");
  const cacheExists = existsSync(join(LLM_LIBRARY_DIR, "llmCacheContracts.ts"));
  return check(
    "llm_13_independence",
    "LLM/13 enterprise cache remains outside MVP path",
    !cacheInMvp && cacheExists,
    cacheInMvp ? "LLM/13 incorrectly in MVP registry" : "llmCacheContracts.ts isolated from MVP registry"
  );
}

export function runLlmPlatformRegression(
  timestamp: string = DEFAULT_TIMESTAMP
): LlmPlatformRegressionResult {
  const checks: LlmPlatformCertificationCheck[] = [
    verifyPhaseFilesExist(),
    verifyPublicApiStability(),
    verifyVersionConsistency(),
    verifyLlm13Independence(),
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
