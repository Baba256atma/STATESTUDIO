import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ContextPreservationOptions,
  ExecutiveInteractionContext,
} from "./interactionStabilityTypes.ts";

export function buildInteractionContextSignature(
  context: Omit<ExecutiveInteractionContext, "signature">
): string {
  return stableSignature([
    "d10-interaction-context",
    context.selectedObjectId ?? "none",
    context.focusedObjectId ?? "none",
    context.activePanel ?? "none",
    context.activeWorkflow ?? "none",
    context.simulationContextId ?? "none",
    context.decisionContextId ?? "none",
    context.executiveInvestigationId ?? "none",
  ]);
}

export function createExecutiveInteractionContext(
  input: Partial<Omit<ExecutiveInteractionContext, "signature">> = {}
): ExecutiveInteractionContext {
  const context = {
    selectedObjectId: input.selectedObjectId ?? null,
    focusedObjectId: input.focusedObjectId ?? null,
    activePanel: input.activePanel ?? null,
    activeWorkflow: input.activeWorkflow ?? null,
    simulationContextId: input.simulationContextId ?? null,
    decisionContextId: input.decisionContextId ?? null,
    executiveInvestigationId: input.executiveInvestigationId ?? null,
    updatedAt: input.updatedAt ?? 0,
  };
  return {
    ...context,
    signature: buildInteractionContextSignature(context),
  };
}

export function preserveExecutiveInteractionContext(params: {
  previous?: ExecutiveInteractionContext | null;
  next?: Partial<Omit<ExecutiveInteractionContext, "signature">> | null;
  options?: ContextPreservationOptions;
  now: number;
}): { context: ExecutiveInteractionContext; preserved: boolean } {
  const previous = params.previous ?? createExecutiveInteractionContext({ updatedAt: params.now });
  const next = params.next ?? {};
  const destructive = params.options?.destructiveUpdate === true;
  const preservePanel = params.options?.preservePanel !== false;
  const preserveWorkflow = params.options?.preserveWorkflow !== false;
  const merged = {
    selectedObjectId: next.selectedObjectId ?? (destructive ? null : previous.selectedObjectId),
    focusedObjectId: next.focusedObjectId ?? (destructive ? null : previous.focusedObjectId),
    activePanel: next.activePanel ?? (!destructive && preservePanel ? previous.activePanel : null),
    activeWorkflow: next.activeWorkflow ?? (!destructive && preserveWorkflow ? previous.activeWorkflow : null),
    simulationContextId: next.simulationContextId ?? (destructive ? null : previous.simulationContextId),
    decisionContextId: next.decisionContextId ?? (destructive ? null : previous.decisionContextId),
    executiveInvestigationId: next.executiveInvestigationId ?? (destructive ? null : previous.executiveInvestigationId),
    updatedAt: next.updatedAt ?? params.now,
  };
  const context = {
    ...merged,
    signature: buildInteractionContextSignature(merged),
  };
  return {
    context,
    preserved:
      !destructive &&
      (next.selectedObjectId == null && previous.selectedObjectId === context.selectedObjectId ||
        next.focusedObjectId == null && previous.focusedObjectId === context.focusedObjectId ||
        next.activePanel == null && previous.activePanel === context.activePanel),
  };
}

