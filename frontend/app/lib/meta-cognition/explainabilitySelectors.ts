import { getExplainabilityStore } from "./explainabilityStore";
import type {
  EnterpriseCognitionPathway,
  ExecutiveReasoningTrace,
  ExplanationConfidenceField,
  StrategicExplanationSnapshot,
  TransparentReasoningSignal,
} from "./explainabilityTypes";

/** Readonly selectors for future executive reasoning dashboards and transparent trace overlays. */

export function selectExecutiveReasoningTraces(
  organizationId: string
): readonly ExecutiveReasoningTrace[] {
  return getExplainabilityStore(organizationId).getState().reasoningTraces;
}

export function selectStrategicExplanationSnapshots(
  organizationId: string
): readonly StrategicExplanationSnapshot[] {
  return getExplainabilityStore(organizationId).getState().snapshots;
}

export function selectLatestStrategicExplanationSnapshot(
  organizationId: string
): StrategicExplanationSnapshot | null {
  return getExplainabilityStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectTransparentReasoningSignals(
  organizationId: string
): readonly TransparentReasoningSignal[] {
  return getExplainabilityStore(organizationId).getState().transparentReasoningSignals;
}

export function selectEnterpriseCognitionPathways(
  organizationId: string
): readonly EnterpriseCognitionPathway[] {
  return getExplainabilityStore(organizationId).getState().cognitionPathways;
}

export function selectExplanationConfidenceFields(
  organizationId: string
): readonly ExplanationConfidenceField[] {
  return getExplainabilityStore(organizationId).getState().explanationConfidenceFields;
}

export function selectExplainabilitySignature(organizationId: string): string {
  return getExplainabilityStore(organizationId).getState().signature;
}
