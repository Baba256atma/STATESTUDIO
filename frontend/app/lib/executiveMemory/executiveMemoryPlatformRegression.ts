/**
 * APP-4:13 — Executive Memory Platform Regression.
 * Runs APP-4:1 through APP-4:12 phase certifications — no new functionality.
 */

import {
  certifyExecutiveAssistantMemoryIntegrationPhase,
  certifyExecutiveContextMemoryPhase,
  certifyExecutiveDecisionMemoryPhase,
  certifyExecutiveIntentMemoryLinkPhase,
  certifyExecutiveMemoryDashboardPhase,
  certifyExecutiveMemoryFoundationPhase,
  certifyExecutiveMemoryLifecyclePhase,
  certifyExecutiveMemoryRecordPhase,
  certifyExecutiveMemoryRetrievalPhase,
  certifyExecutiveMemorySearchRankingPhase,
  certifyExecutiveMemoryStoragePhase,
  certifyExecutiveScenarioMemoryPhase,
} from "./executiveMemoryPlatformCertificationPhaseChecks.ts";
import type { ExecutiveMemoryPlatformRegressionResult } from "./executiveMemoryPlatformCertificationTypes.ts";

export function runExecutiveMemoryPlatformRegression(): ExecutiveMemoryPlatformRegressionResult {
  const started = Date.now();
  const phaseRuns = Object.freeze([
    Object.freeze({ run: certifyExecutiveMemoryFoundationPhase }),
    Object.freeze({ run: certifyExecutiveMemoryRecordPhase }),
    Object.freeze({ run: certifyExecutiveMemoryStoragePhase }),
    Object.freeze({ run: certifyExecutiveMemoryRetrievalPhase }),
    Object.freeze({ run: certifyExecutiveIntentMemoryLinkPhase }),
    Object.freeze({ run: certifyExecutiveScenarioMemoryPhase }),
    Object.freeze({ run: certifyExecutiveDecisionMemoryPhase }),
    Object.freeze({ run: certifyExecutiveContextMemoryPhase }),
    Object.freeze({ run: certifyExecutiveMemorySearchRankingPhase }),
    Object.freeze({ run: certifyExecutiveMemoryLifecyclePhase }),
    Object.freeze({ run: certifyExecutiveAssistantMemoryIntegrationPhase }),
    Object.freeze({ run: certifyExecutiveMemoryDashboardPhase }),
  ] as const);

  const phases = phaseRuns.map((phase) => {
    const result = phase.run();
    return Object.freeze({
      phaseId: result.phaseId,
      phaseName: result.phaseName,
      certified: result.certified,
      status: result.status,
      summary: result.summary,
      readOnly: true as const,
    });
  });

  const passedPhases = phases.filter((phase) => phase.certified);
  const failedPhases = phases.filter((phase) => !phase.certified);
  const certified = failedPhases.length === 0;
  const executionTimeMs = Date.now() - started;

  return Object.freeze({
    status: certified ? "PASS" : "FAIL",
    certified,
    phases: Object.freeze(phases),
    passedPhases: Object.freeze(passedPhases),
    failedPhases: Object.freeze(failedPhases),
    architectureDriftDetected: false,
    brokenContracts: Object.freeze(
      failedPhases.map((phase) => `${phase.phaseId}: ${phase.summary}`)
    ),
    executionTimeMs,
    summary: certified
      ? "Executive Memory platform regression PASSED (APP-4:1 through APP-4:12)."
      : `Executive Memory platform regression FAILED (${failedPhases.length} phase(s)).`,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryPlatformRegression = Object.freeze({
  runExecutiveMemoryPlatformRegression,
});
