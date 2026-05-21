import { stableSignature } from "../../../intelligence/shared/dedupe";
import { enterpriseCognitionOrchestrationLayer } from "./enterpriseCognitionOrchestrationLayer";
import { executiveCognitionSynchronizationLayer } from "./executiveCognitionSynchronizationLayer";
import { institutionalAdaptationContinuityLayer } from "./institutionalAdaptationContinuityLayer";
import {
  buildEnterpriseCognitiveRuntimeSignature,
  synthesizeEnterpriseCognitiveRuntimeState,
} from "./synthesizeEnterpriseCognitiveRuntimeState";
import type {
  AutonomousInstitutionalIntelligenceRuntimeSnapshot,
  EnterpriseCognitiveRuntimeState,
  InstitutionalIntelligencePosture,
  SynthesizeEnterpriseCognitiveRuntimeInput,
} from "./enterpriseCognitiveRuntimeTypes";

export type ResolveAutonomousInstitutionalIntelligenceInput = SynthesizeEnterpriseCognitiveRuntimeInput & {
  enabled: boolean;
  sessionHydrated: boolean;
  runtimeStable: boolean;
  onboardingActive: boolean;
};

function resolveInstitutionalIntelligencePosture(
  state: EnterpriseCognitiveRuntimeState | null,
  continuityPreserved: boolean,
  runtimeStable: boolean
): InstitutionalIntelligencePosture {
  if (!continuityPreserved) return "attention";
  if (!runtimeStable) return "initializing";
  if (!state) return "idle";

  if (
    state.synchronizationHealth === "complete" &&
    state.cognitionIntegrity === "complete" &&
    state.continuityHealth === "strong"
  ) {
    return "complete";
  }
  if (state.synchronizationHealth === "synchronized" || state.synchronizationHealth === "complete") {
    return "operational";
  }
  if (state.synchronizationHealth === "stabilizing") return "synchronizing";
  return "synchronizing";
}

export function resolveAutonomousInstitutionalIntelligence(
  input: ResolveAutonomousInstitutionalIntelligenceInput
): AutonomousInstitutionalIntelligenceRuntimeSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeEnterpriseCognitiveRuntimeState(input)
      : null;

  const institutionalIntelligencePosture = resolveInstitutionalIntelligencePosture(
    canonical,
    input.continuityPreserved,
    input.runtimeStable
  );

  const enterpriseCognitiveRuntimeComplete =
    institutionalIntelligencePosture === "complete";

  const autonomousInstitutionalIntelligenceActive =
    enterpriseCognitiveRuntimeComplete || institutionalIntelligencePosture === "operational";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    institutionalIntelligencePosture !== "idle";

  const institutionalHeadline =
    institutionalIntelligencePosture === "complete"
      ? "Enterprise cognitive runtime complete"
      : institutionalIntelligencePosture === "operational"
        ? "Autonomous institutional intelligence operational"
        : institutionalIntelligencePosture === "synchronizing"
          ? "Enterprise cognition synchronizing across layers"
          : institutionalIntelligencePosture === "initializing"
            ? "Institutional intelligence runtime initializing"
            : institutionalIntelligencePosture === "attention"
              ? "Enterprise cognitive runtime requires continuity attention"
              : "Autonomous institutional intelligence idle";

  const institutionalSubline = canonical
    ? `Governance ${canonical.governanceState} · foresight ${canonical.foresightState} · sync ${canonical.synchronizationHealth}`
    : "Final enterprise cognitive runtime — coordinated orchestration, not self-governing AI";

  const synchronizationHealthLine = canonical
    ? enterpriseCognitionOrchestrationLayer.synthesizeSynchronizationHealthLine(
        canonical.synchronizationHealth
      )
    : "Synchronization health establishes with full F10 stack convergence";

  const adaptationContinuityLine = canonical
    ? institutionalAdaptationContinuityLayer.synthesizeAdaptationContinuityLine(
        canonical.adaptationState
      )
    : "";

  const executiveCognitionSyncLine = canonical
    ? executiveCognitionSynchronizationLayer.synthesizeExecutiveCognitionSyncLine(
        canonical.executiveAttentionState
      )
    : "";

  const timelineInstitutionalContinuityLine =
    "Timeline reflects complete institutional cognition continuity — operational evolution, resilience progression, governance adaptation, foresight, learning, and executive decision continuity";

  const assistantInstitutionalIntelligenceLine =
    autonomousInstitutionalIntelligenceActive || institutionalIntelligencePosture === "synchronizing"
      ? "Enterprise cognitive runtime is active — reason across governance, foresight, resilience, advisory, and institutional learning as one synchronized ecosystem. Executive authority remains final."
      : "Autonomous institutional intelligence is establishing — final enterprise cognition will synchronize with the complete F10 stack.";

  const signature = canonical
    ? buildEnterpriseCognitiveRuntimeSignature(canonical)
    : stableSignature(["f10-6-runtime-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    institutionalIntelligencePosture,
    institutionalHeadline,
    institutionalSubline,
    synchronizationHealthLine,
    adaptationContinuityLine,
    executiveCognitionSyncLine,
    timelineInstitutionalContinuityLine,
    assistantInstitutionalIntelligenceLine,
    autonomousInstitutionalIntelligenceActive,
    enterpriseCognitiveRuntimeComplete,
    canonical,
    runtimeStable: input.continuityPreserved && input.runtimeStable,
  };
}
