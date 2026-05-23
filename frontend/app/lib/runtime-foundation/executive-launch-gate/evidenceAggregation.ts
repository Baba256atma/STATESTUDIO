import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveLaunchGateInput,
  LaunchEvidenceItem,
  LaunchEvidenceCategory,
} from "./executiveLaunchGateTypes.ts";

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(Math.min(1, Math.max(0, value)).toFixed(2));
}

function evidence(
  category: LaunchEvidenceCategory,
  source: string,
  description: string,
  confidence: number,
  supportsLaunch: boolean,
  signatureSeed: string
): LaunchEvidenceItem {
  const signature = stableSignature(["d10-launch-evidence", category, source, signatureSeed, supportsLaunch]);
  return {
    evidenceId: signature.slice(0, 56),
    category,
    source,
    description,
    confidence: clamp(confidence),
    supportsLaunch,
    signature,
  };
}

export function aggregateLaunchEvidence(input: ExecutiveLaunchGateInput): readonly LaunchEvidenceItem[] {
  const items: LaunchEvidenceItem[] = [];
  const registry = input.readinessRegistry;
  if (registry) {
    items.push(evidence(
      "readiness",
      "runtime_readiness_registry",
      `Readiness registry aggregate state is ${registry.platform.aggregateState}/${registry.features.aggregateState}.`,
      (registry.platform.confidence + registry.features.confidence) / 2,
      registry.platform.aggregateState === "ready" && registry.features.aggregateState === "ready",
      registry.signature
    ));
  }
  if (input.readinessSnapshot) {
    items.push(evidence(
      "readiness",
      "executive_readiness_snapshot",
      input.readinessSnapshot.answer,
      input.readinessSnapshot.evaluations.mvp.confidence,
      input.readinessSnapshot.isNexoraReady,
      input.readinessSnapshot.signature
    ));
  }
  if (input.reliabilitySnapshot) {
    items.push(evidence(
      "trust",
      "executive_reliability_snapshot",
      input.reliabilitySnapshot.answer,
      input.reliabilitySnapshot.summary.trustScore,
      input.reliabilitySnapshot.canTrustResult,
      input.reliabilitySnapshot.signature
    ));
  }
  if (input.interactionSnapshot) {
    const stable = input.interactionSnapshot.stabilityState === "stable" || input.interactionSnapshot.stabilityState === "recovering";
    items.push(evidence(
      "stability",
      "interaction_stability_snapshot",
      input.interactionSnapshot.answer,
      stable ? 0.82 : 0.42,
      stable && input.interactionSnapshot.summary.contextPreserved,
      input.interactionSnapshot.signature
    ));
  }
  if (input.dashboard) {
    items.push(evidence(
      "dashboard",
      "executive_readiness_dashboard",
      input.dashboard.executiveSummary.headline,
      input.dashboard.healthSurface.confidence,
      input.dashboard.launchAssessment === "production_candidate" || input.dashboard.launchAssessment === "pilot_ready",
      input.dashboard.signature
    ));
  }
  if (input.validationSuite) {
    items.push(evidence(
      "validation",
      "executive_validation_suite",
      input.validationSuite.summary.headline,
      input.validationSuite.coverage.coverageScore,
      input.validationSuite.summary.validationPassed,
      input.validationSuite.signature
    ));
  }

  return Object.freeze(items.sort((a, b) => a.category.localeCompare(b.category) || a.source.localeCompare(b.source)));
}

