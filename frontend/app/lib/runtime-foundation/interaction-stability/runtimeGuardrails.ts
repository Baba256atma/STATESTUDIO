import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { preserveExecutiveInteractionContext } from "./contextPreservation.ts";
import { analyzeInteractionIntegrity } from "./interactionIntegrity.ts";
import { analyzeInteractionLoops } from "./loopPrevention.ts";
import { classifyInteractionIssues } from "./stabilityClassification.ts";
import { validateRuntimeStateConsistency } from "./stateConsistency.ts";
import type {
  ExecutiveInteractionStabilityInput,
  InteractionStabilityState,
  RuntimeGuardrailDecision,
  StabilityEventSeverity,
} from "./interactionStabilityTypes.ts";

function severityState(severity: StabilityEventSeverity | null): InteractionStabilityState {
  if (severity === "critical") return "unstable";
  if (severity === "warning") return "degraded";
  if (severity === "caution") return "recovering";
  return "stable";
}

function worstSeverity(severities: readonly StabilityEventSeverity[]): StabilityEventSeverity | null {
  if (severities.includes("critical")) return "critical";
  if (severities.includes("warning")) return "warning";
  if (severities.includes("caution")) return "caution";
  if (severities.includes("informational")) return "informational";
  return null;
}

export function evaluateRuntimeGuardrails(input: ExecutiveInteractionStabilityInput): RuntimeGuardrailDecision {
  const now = input.now ?? Date.now();
  const preserved = preserveExecutiveInteractionContext({
    previous: input.previousContext,
    next: input.nextContext,
    options: input.options,
    now,
  });
  const integrityIssues = analyzeInteractionIntegrity({
    events: input.events ?? [],
    previousContext: input.previousContext,
    nextContext: preserved.context,
  });
  const loop = analyzeInteractionLoops(input.events ?? []);
  const consistencyIssues = input.consistency
    ? validateRuntimeStateConsistency({ ...input.consistency, context: preserved.context })
    : [];
  const issues = [...integrityIssues, ...loop.issues, ...consistencyIssues];
  const classifications = classifyInteractionIssues(issues);
  const severity = worstSeverity(classifications.map((item) => item.severity));
  const stabilityState = severityState(severity);
  const preventedIssue = issues.find((item) => item.severity === "critical") ?? null;
  const allowed = !preventedIssue;
  const signature = stableSignature([
    "d10-runtime-guardrail-decision",
    preserved.context.signature,
    allowed,
    stabilityState,
    issues.map((item) => item.issueId),
  ]);

  return {
    decisionId: stableSignature(["d10-runtime-guardrail-decision", input.organizationId ?? "nexora-default"]).slice(0, 56),
    allowed,
    stabilityState,
    preventedIssue,
    preservedContext: preserved.context,
    issues: Object.freeze(issues),
    classifications,
    signature,
  };
}
