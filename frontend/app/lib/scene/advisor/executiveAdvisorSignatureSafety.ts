import { devLogThrottled } from "../../runtime/diagnosticThrottle.ts";
import type {
  BuildExecutiveAdvisorInput,
  ExecutiveAdvisorRecommendation,
  ExecutiveAdvisorState,
} from "./executiveAdvisorTypes.ts";

const MAX_SIGNATURE_LENGTH = 4096;
const MAX_SIGNATURE_PART_LENGTH = 320;
const MAX_ALERT_SIGNATURE_ITEMS = 80;
const MAX_RECOMMENDATION_SIGNATURE_ITEMS = 24;
const MAX_ESTIMATED_INPUT_LENGTH = 16384;

function safeString(value: unknown, fallback = "none", maxLength = MAX_SIGNATURE_PART_LENGTH): string {
  const text = value == null ? fallback : String(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…#${text.length}`;
}

function boundedJoin(parts: readonly string[], separator: string, maxLength: number): { value: string; truncated: boolean } {
  let value = "";
  let truncated = false;
  for (const part of parts) {
    const next = value ? `${value}${separator}${part}` : part;
    if (next.length > maxLength) {
      const remaining = Math.max(0, maxLength - value.length);
      value = `${value}${remaining > 1 ? `${separator}${part}`.slice(0, remaining) : ""}…#truncated`;
      truncated = true;
      break;
    }
    value = next;
  }
  return { value: value || "none", truncated };
}

function estimateAlertSignatureLength(input: BuildExecutiveAdvisorInput): number {
  let total = 0;
  for (const alert of input.alerts ?? []) {
    total += String(alert?.id ?? "").length + String(Boolean(alert?.acknowledged)).length + 2;
    if (total > MAX_ESTIMATED_INPUT_LENGTH) return total;
  }
  return total;
}

function buildAlertSignature(input: BuildExecutiveAdvisorInput): { value: string; truncated: boolean } {
  const alerts = input.alerts ?? [];
  const parts = alerts.slice(0, MAX_ALERT_SIGNATURE_ITEMS).map((alert) =>
    `${safeString(alert?.id, "alert", 160)}:${Boolean(alert?.acknowledged)}`
  );
  const joined = boundedJoin(parts, "|", Math.min(MAX_SIGNATURE_LENGTH / 2, 2048));
  return {
    value: joined.value,
    truncated: joined.truncated || alerts.length > MAX_ALERT_SIGNATURE_ITEMS,
  };
}

function buildRecommendationSignature(
  stateOrRecommendations: ExecutiveAdvisorState | readonly ExecutiveAdvisorRecommendation[] | null
): { value: string; truncated: boolean } {
  const recommendations: readonly ExecutiveAdvisorRecommendation[] =
    stateOrRecommendations == null
      ? []
      : "recommendations" in stateOrRecommendations
        ? stateOrRecommendations.recommendations
        : stateOrRecommendations;
  const parts = recommendations.slice(0, MAX_RECOMMENDATION_SIGNATURE_ITEMS).map((entry) =>
    `${safeString(entry.id, "rec", 120)}:${safeString(entry.status, "proposed", 48)}`
  );
  const joined = boundedJoin(parts, "|", 1024);
  return {
    value: joined.value,
    truncated: joined.truncated || recommendations.length > MAX_RECOMMENDATION_SIGNATURE_ITEMS,
  };
}

export function buildSafeExecutiveAdvisorInputSignature(input: BuildExecutiveAdvisorInput): {
  signature: string;
  originalLengthEstimate: number;
  truncatedLength: number;
  guardActivated: boolean;
  alertCount: number;
  recommendationCount: number;
} {
  const alertSignature = buildAlertSignature(input);
  const parts = [
    safeString(input.cognitiveTwin?.signature),
    safeString(input.warRoom?.signature),
    safeString(input.activeSimulation?.scenarioId),
    safeString(input.scenarioComparison?.id),
    safeString(input.decisionRecommendation?.recommendedScenarioId),
    safeString(input.selectedObjectId),
    alertSignature.value,
  ];
  const joined = boundedJoin(parts, "::", MAX_SIGNATURE_LENGTH);
  const originalLengthEstimate =
    parts.slice(0, -1).reduce((sum, part) => sum + part.length + 2, 0) + estimateAlertSignatureLength(input);
  const guardActivated =
    alertSignature.truncated ||
    joined.truncated ||
    originalLengthEstimate > MAX_SIGNATURE_LENGTH ||
    originalLengthEstimate > MAX_ESTIMATED_INPUT_LENGTH;
  return {
    signature: joined.value,
    originalLengthEstimate,
    truncatedLength: joined.value.length,
    guardActivated,
    alertCount: input.alerts?.length ?? 0,
    recommendationCount: 0,
  };
}

export function buildSafeExecutiveAdvisorStateSignature(
  input: BuildExecutiveAdvisorInput,
  stateOrRecommendations: ExecutiveAdvisorState | readonly ExecutiveAdvisorRecommendation[] | null
): {
  signature: string;
  originalLengthEstimate: number;
  truncatedLength: number;
  guardActivated: boolean;
} {
  const inputSig = buildSafeExecutiveAdvisorInputSignature(input);
  const recommendationSig = buildRecommendationSignature(stateOrRecommendations);
  const joined = boundedJoin([inputSig.signature, recommendationSig.value], "::advisor::", MAX_SIGNATURE_LENGTH);
  const originalLengthEstimate = inputSig.originalLengthEstimate + recommendationSig.value.length + 11;
  return {
    signature: joined.value,
    originalLengthEstimate,
    truncatedLength: joined.value.length,
    guardActivated:
      inputSig.guardActivated ||
      recommendationSig.truncated ||
      joined.truncated ||
      originalLengthEstimate > MAX_SIGNATURE_LENGTH,
  };
}

export function logAdvisorSignatureAudit(input: {
  signatureLength: number;
  alertCount: number;
  recommendationCount: number;
  selectedObjectId: string | null;
  dependencyCounts: Record<string, number>;
  guardActivated: boolean;
}): void {
  devLogThrottled({
    key: `advisor-signature-audit:${input.selectedObjectId ?? "none"}:${input.alertCount}:${input.recommendationCount}:${input.signatureLength}`,
    label: "[NEXORA_ADVISOR_SIGNATURE_AUDIT]",
    scope: "runtimeAudit",
    intervalMs: 2000,
    payload: input,
  });
}

export function logAdvisorSignatureGuard(input: {
  originalLength: number;
  truncatedLength: number;
  guardActivated: boolean;
  alertCount: number;
  recommendationCount: number;
}): void {
  if (!input.guardActivated) return;
  devLogThrottled({
    key: `advisor-signature-guard:${input.originalLength}:${input.truncatedLength}:${input.alertCount}:${input.recommendationCount}`,
    label: "[NEXORA_ADVISOR_SIGNATURE_GUARD]",
    scope: "runtimeAudit",
    intervalMs: 2000,
    payload: input,
  });
}

export function logAdvisorAlertAccumulation(input: {
  previousCount: number;
  nextCount: number;
  delta: number;
  abnormalGrowth: boolean;
  selectedObjectId: string | null;
}): void {
  if (!input.abnormalGrowth && input.delta === 0) return;
  devLogThrottled({
    key: `advisor-alert-accumulation:${input.selectedObjectId ?? "none"}:${input.previousCount}:${input.nextCount}`,
    label: "[NEXORA_ADVISOR_ALERT_ACCUMULATION]",
    scope: "runtimeAudit",
    intervalMs: input.abnormalGrowth ? 1000 : 5000,
    payload: input,
  });
}
