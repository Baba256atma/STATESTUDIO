import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { preserveExecutiveInteractionContext } from "./contextPreservation.ts";
import { evaluateRuntimeGuardrails } from "./runtimeGuardrails.ts";
import { stabilitySeverityRank } from "./stabilityClassification.ts";
import type {
  ExecutiveInteractionStabilityInput,
  ExecutiveInteractionStabilityRuntimeSnapshot,
} from "./interactionStabilityTypes.ts";

export function buildExecutiveInteractionStabilitySnapshot(
  input: ExecutiveInteractionStabilityInput
): ExecutiveInteractionStabilityRuntimeSnapshot {
  const organizationId = input.organizationId?.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const guardrail = evaluateRuntimeGuardrails({ ...input, organizationId, now });
  const preserved = preserveExecutiveInteractionContext({
    previous: input.previousContext,
    next: input.nextContext,
    options: input.options,
    now,
  });
  const classifications = [...guardrail.classifications].sort(
    (a, b) => stabilitySeverityRank(b.severity) - stabilitySeverityRank(a.severity) || a.affectedComponent.localeCompare(b.affectedComponent)
  );
  const highestRisk = classifications[0] ?? null;
  const interfaceStable = guardrail.stabilityState === "stable" || guardrail.stabilityState === "recovering";
  const workflowsBehavingNormally = !classifications.some(
    (item) => item.affectedComponent === "workflow_transition" && (item.severity === "critical" || item.severity === "warning")
  );
  const contextPreserved = preserved.context.signature === guardrail.preservedContext.signature;
  const answer = interfaceStable && workflowsBehavingNormally && contextPreserved
    ? "Interface is stable and executive context is preserved."
    : "Interaction stability requires attention before executive reliance.";
  const requiresAttention = classifications.length
    ? classifications.slice(0, 5).map((item) => item.suggestedResolution)
    : ["No immediate interaction stability action is required."];
  const signature = stableSignature([
    "d10-executive-interaction-stability-snapshot",
    organizationId,
    guardrail.signature,
    requiresAttention,
  ]);

  return {
    snapshotId: stableSignature(["d10-executive-interaction-stability-snapshot", organizationId]).slice(0, 56),
    organizationId,
    generatedAt: now,
    stabilityState: guardrail.stabilityState,
    answer,
    summary: {
      interfaceStable,
      workflowsBehavingNormally,
      contextPreserved,
      highestRisk,
      concernCount: classifications.length,
    },
    context: guardrail.preservedContext,
    issues: guardrail.issues,
    classifications: Object.freeze(classifications),
    requiresAttention: Object.freeze(Array.from(new Set(requiresAttention))),
    signature,
  };
}
