import type {
  ExecutiveInteractionContext,
  ExecutiveInteractionEvent,
  ExecutiveInteractionStabilityRuntimeSnapshot,
  InteractionIntegrityIssue,
  RuntimeGuardrailDecision,
} from "./interactionStabilityTypes.ts";

export function validateExecutiveInteractionEvent(
  event: ExecutiveInteractionEvent | null | undefined
): event is ExecutiveInteractionEvent {
  if (!event) return false;
  return Boolean(event.eventId.trim() && event.component && event.source.trim() && event.action.trim() && event.actionSignature.trim() && Number.isFinite(event.generatedAt));
}

export function validateExecutiveInteractionContext(
  context: ExecutiveInteractionContext | null | undefined
): context is ExecutiveInteractionContext {
  if (!context) return false;
  return Boolean(context.signature.trim() && Number.isFinite(context.updatedAt));
}

export function validateInteractionIntegrityIssue(
  issue: InteractionIntegrityIssue | null | undefined
): issue is InteractionIntegrityIssue {
  if (!issue) return false;
  return Boolean(issue.issueId.trim() && issue.cause.trim() && issue.source.trim() && issue.recommendedCorrection.trim());
}

export function validateRuntimeGuardrailDecision(
  decision: RuntimeGuardrailDecision | null | undefined
): decision is RuntimeGuardrailDecision {
  if (!decision) return false;
  return Boolean(decision.decisionId.trim() && decision.signature.trim() && validateExecutiveInteractionContext(decision.preservedContext));
}

export function validateExecutiveInteractionStabilityRuntimeSnapshot(
  snapshot: ExecutiveInteractionStabilityRuntimeSnapshot | null | undefined
): snapshot is ExecutiveInteractionStabilityRuntimeSnapshot {
  if (!snapshot) return false;
  return Boolean(
    snapshot.snapshotId.trim() &&
      snapshot.organizationId.trim() &&
      snapshot.signature.trim() &&
      snapshot.answer.trim() &&
      Number.isFinite(snapshot.generatedAt) &&
      validateExecutiveInteractionContext(snapshot.context)
  );
}

