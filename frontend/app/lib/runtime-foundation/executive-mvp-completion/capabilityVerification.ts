import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { CompletionCapabilityId, ExecutiveCapabilityVerification, ExecutiveMVPCompletionInput } from "./mvpCompletionTypes.ts";

const CAPABILITIES: readonly CompletionCapabilityId[] = Object.freeze([
  "ingestion_workflows",
  "object_intelligence",
  "fragility_intelligence",
  "scenario_simulation",
  "decision_intelligence",
  "executive_dashboards",
  "trust_intelligence",
  "readiness_intelligence",
]);

function readyFor(capabilityId: CompletionCapabilityId, input: ExecutiveMVPCompletionInput): boolean {
  const features = input.readinessRegistry?.features.features;
  const feature =
    capabilityId === "ingestion_workflows"
      ? features?.ingestion
      : capabilityId === "fragility_intelligence"
        ? features?.fragility
        : capabilityId === "scenario_simulation"
          ? features?.simulation ?? features?.scenario_workflows
          : capabilityId === "decision_intelligence"
            ? features?.decision_intelligence
            : capabilityId === "executive_dashboards"
              ? features?.executive_panels
              : capabilityId === "object_intelligence"
                ? features?.mapping
                : undefined;
  if (capabilityId === "trust_intelligence") return (input.reliabilitySnapshot?.summary.trustScore ?? 0) >= 0.7;
  if (capabilityId === "readiness_intelligence") return input.readinessSnapshot?.isNexoraReady === true;
  if (capabilityId === "executive_dashboards") return input.dashboard != null && input.dashboard.healthSurface.status !== "critical";
  return feature?.readinessState === "ready" && feature.confidence >= 0.7;
}

export function verifyExecutiveCapabilities(input: ExecutiveMVPCompletionInput): readonly ExecutiveCapabilityVerification[] {
  return Object.freeze(
    CAPABILITIES.map((capabilityId) => {
      const available = capabilityId === "trust_intelligence"
        ? input.reliabilitySnapshot != null
        : capabilityId === "readiness_intelligence"
          ? input.readinessSnapshot != null
          : capabilityId === "executive_dashboards"
            ? input.dashboard != null
            : input.readinessRegistry != null;
      const ready = available && readyFor(capabilityId, input);
      const evidence = [
        input.readinessRegistry ? "readiness_registry" : "readiness_registry_missing",
        input.dashboard ? "dashboard" : "dashboard_missing",
        input.reliabilitySnapshot ? "trust" : "trust_missing",
      ];
      return {
        capabilityId,
        available,
        ready,
        evidence: Object.freeze(evidence),
        missingOrIncomplete: ready ? null : `${capabilityId} is missing or incomplete.`,
        signature: stableSignature(["d10-capability", capabilityId, available, ready, evidence]),
      };
    })
  );
}
