/**
 * APP-7:7 — Business Timeline Platform readiness report.
 */

import type {
  BusinessTimelinePlatformCertificationGroup,
  BusinessTimelinePlatformReadinessGate,
  BusinessTimelinePlatformReadinessReport,
  BusinessTimelinePlatformRegressionResult,
} from "./businessTimelinePlatformCertificationTypes.ts";
import type { BusinessTimelinePlatformManifest } from "./businessTimelinePlatformCertificationManifest.ts";
import { validateBusinessTimelinePlatformManifest } from "./businessTimelinePlatformCertificationManifest.ts";

function gate(
  gateId: string,
  title: string,
  passed: boolean,
  evidence: string
): BusinessTimelinePlatformReadinessGate {
  return Object.freeze({ gateId, title, passed, evidence, readOnly: true as const });
}

export function buildBusinessTimelinePlatformReadinessReport(
  groups: readonly BusinessTimelinePlatformCertificationGroup[],
  regression: BusinessTimelinePlatformRegressionResult,
  manifest: BusinessTimelinePlatformManifest
): BusinessTimelinePlatformReadinessReport {
  const manifestValidation = validateBusinessTimelinePlatformManifest(manifest);
  const allGroupsPassed = groups.every((entry) => entry.passed);
  const allLayersCertified = regression.layerResults.every((entry) => entry.certified);

  const gates = Object.freeze([
    gate(
      "phase_regression",
      "All APP-7:1 through APP-7:6 regressions pass",
      regression.success === true,
      regression.summary
    ),
    gate(
      "certification_groups",
      "All certification groups pass",
      allGroupsPassed,
      `${groups.filter((entry) => entry.passed).length}/${groups.length} groups passed`
    ),
    gate(
      "layer_scores",
      "All layer certification scores at 100",
      regression.layerResults.every((entry) => entry.score === 100),
      regression.layerResults.map((entry) => `${entry.layerId}:${entry.score}`).join(", ")
    ),
    gate(
      "prior_phases_preserved",
      "Prior APP-7 phase files preserved",
      regression.priorPhasesPreserved === true,
      regression.priorPhasesPreserved ? "files intact" : "missing files"
    ),
    gate(
      "platform_manifest",
      "Platform manifest valid",
      manifestValidation.valid === true,
      manifestValidation.valid ? "manifest valid" : manifestValidation.issues.join("; ")
    ),
    gate(
      "all_layers_certified",
      "All certified modules report PASS",
      allLayersCertified,
      `${regression.layersPassed}/${regression.layersTotal} layers certified`
    ),
  ]);

  const gatesPassed = gates.filter((entry) => entry.passed).length;
  const readyForFreeze = gatesPassed === gates.length && allGroupsPassed && regression.success;

  return Object.freeze({
    readyForFreeze,
    gatesPassed,
    gatesTotal: gates.length,
    summary: readyForFreeze
      ? "Business Timeline platform is ready for APP-7:8 freeze."
      : `${gatesPassed}/${gates.length} readiness gates passed.`,
    gates,
    readOnly: true as const,
  });
}

export function computeReadyForFreeze(
  groups: readonly BusinessTimelinePlatformCertificationGroup[],
  regression: BusinessTimelinePlatformRegressionResult,
  manifest: BusinessTimelinePlatformManifest
): boolean {
  return buildBusinessTimelinePlatformReadinessReport(groups, regression, manifest).readyForFreeze;
}
