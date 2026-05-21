import { stableSignature } from "../../../intelligence/shared/dedupe";
import { crossLayerCognitionSynchronizationLayer } from "./crossLayerCognitionSynchronizationLayer";
import { executiveStrategicAttentionLayer } from "./executiveStrategicAttentionLayer";
import {
  buildUnifiedStrategicConsciousnessSignature,
  synthesizeUnifiedStrategicConsciousnessState,
} from "./synthesizeUnifiedStrategicConsciousnessState";
import type {
  MetaIntelligencePosture,
  SynthesizeUnifiedStrategicConsciousnessInput,
  UnifiedStrategicConsciousnessRuntimeSnapshot,
  UnifiedStrategicConsciousnessState,
} from "./unifiedStrategicConsciousnessTypes";

export type ResolveUnifiedStrategicConsciousnessInput = SynthesizeUnifiedStrategicConsciousnessInput & {
  enabled: boolean;
  sessionHydrated: boolean;
  runtimeStable: boolean;
  onboardingActive: boolean;
};

function resolveMetaIntelligencePosture(
  state: UnifiedStrategicConsciousnessState | null,
  continuityPreserved: boolean
): MetaIntelligencePosture {
  if (!continuityPreserved) return "attention";
  if (!state) return "idle";

  if (state.cognitionIntegrity === "orchestrated" && state.continuityHealth === "strong") {
    return "sustained";
  }
  if (state.cognitionIntegrity === "orchestrated") return "orchestrated";
  if (state.cognitionIntegrity === "harmonized") return "harmonized";
  return "synchronizing";
}

export function resolveUnifiedStrategicConsciousness(
  input: ResolveUnifiedStrategicConsciousnessInput
): UnifiedStrategicConsciousnessRuntimeSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeUnifiedStrategicConsciousnessState(input)
      : null;

  const metaIntelligencePosture = resolveMetaIntelligencePosture(
    canonical,
    input.continuityPreserved
  );

  const enterpriseMetaIntelligenceActive =
    metaIntelligencePosture === "sustained" || metaIntelligencePosture === "orchestrated";

  const unifiedStrategicConsciousnessActive =
    enterpriseMetaIntelligenceActive || metaIntelligencePosture === "harmonized";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    metaIntelligencePosture !== "idle";

  const consciousnessHeadline =
    metaIntelligencePosture === "sustained"
      ? "Unified strategic consciousness sustained"
      : metaIntelligencePosture === "orchestrated"
        ? "Enterprise meta-intelligence runtime orchestrated"
        : metaIntelligencePosture === "harmonized"
          ? "Strategic cognition harmonized across layers"
          : metaIntelligencePosture === "synchronizing"
            ? "Cross-layer cognition synchronizing"
            : metaIntelligencePosture === "attention"
              ? "Meta-intelligence requires continuity attention"
              : "Unified strategic consciousness idle";

  const consciousnessSubline = canonical
    ? `Governance ${canonical.governanceState} · foresight ${canonical.foresightState} · integrity ${canonical.cognitionIntegrity}`
  : "Meta-intelligence coordinates enterprise cognition — coordinated orchestration, not sentience";

  const activeLayerCount = crossLayerCognitionSynchronizationLayer.countActiveLayers(
    input.intelligenceStack
  );

  const cognitionIntegrityLine = canonical
    ? crossLayerCognitionSynchronizationLayer.synthesizeCrossLayerSyncLine(
        canonical.cognitionIntegrity,
        activeLayerCount
      )
    : "Cognition integrity establishes as F10 layers converge";

  const continuityHealthLine = canonical
    ? `Continuity health ${canonical.continuityHealth} · strategic confidence ${canonical.strategicConfidence}`
    : "";

  const crossLayerSyncLine = canonical
    ? `Trajectory ${canonical.strategicTrajectory} · learning ${canonical.institutionalLearningState} · advisory ${canonical.advisoryState}`
    : "";

  const executiveAttentionLine = canonical
    ? executiveStrategicAttentionLayer.synthesizeExecutiveAttentionLine(
        canonical.executiveAttentionState
      )
    : "";

  const timelineStrategicContinuityLine =
    "Timeline reflects institutional strategic continuity — operational evolution, governance shifts, resilience development, foresight transitions, and cognition evolution";

  const assistantMetaIntelligenceLine =
    unifiedStrategicConsciousnessActive || metaIntelligencePosture === "synchronizing"
      ? "Unified meta-intelligence is active — reason across governance, foresight, resilience, advisory, and institutional learning as one coordinated cognition ecosystem without acting autonomously."
      : "Enterprise meta-intelligence runtime is establishing — strategic consciousness will synchronize with the full F10 stack.";

  const signature = canonical
    ? buildUnifiedStrategicConsciousnessSignature(canonical)
    : stableSignature(["f10-5-consciousness-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    metaIntelligencePosture,
    consciousnessHeadline,
    consciousnessSubline,
    cognitionIntegrityLine,
    continuityHealthLine,
    crossLayerSyncLine,
    executiveAttentionLine,
    timelineStrategicContinuityLine,
    assistantMetaIntelligenceLine,
    unifiedStrategicConsciousnessActive,
    enterpriseMetaIntelligenceActive,
    canonical,
    orchestrationStable: input.continuityPreserved && input.runtimeStable,
  };
}
