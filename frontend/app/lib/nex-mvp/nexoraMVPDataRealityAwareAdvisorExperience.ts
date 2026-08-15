/**
 * NEX-MVP consumer of P2:4 Advisor Experience Binding.
 *
 * Overlays certified P2:2 runtime truth onto the existing Advisor view-model
 * fields without redesigning the Advisor panel or inventing recommendations.
 *
 * Shell may import this module. Low-level Stage meshes must not.
 */

import {
  resolveDataRealityAwareAdvisorBinding,
  type DataRealityAwareAdvisorBindingResult,
} from "@/app/lib/data-reality/dataRealityAwareAdvisorExperienceBinding";
import type { DataRealityAwareMVPRuntimeState } from "@/app/lib/data-reality/dataRealityAwareMVPRuntimeState";
import type { NexoraMVPAdvisorViewModel } from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";

export const nexoraMVPDataRealityAwareAdvisorExperienceIdentity =
  "NEX-MVP/P2:4/DataRealityAwareAdvisorExperienceConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BOUNDARY =
  Object.freeze({
    consumesP22RuntimeState: true as const,
    consumesP24AdvisorBinding: true as const,
    usesStagePresentationAsTruth: false as const,
    ownsAdvisorReasoning: false as const,
    inventsRecommendations: false as const,
    usesGenerativeAi: false as const,
    redesignsAdvisorUi: false as const,
  });

export type ResolveNexoraMVPDataRealityAwareAdvisorExperienceInput = {
  readonly runtimeState: DataRealityAwareMVPRuntimeState;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
  readonly presentationState?: string;
  readonly workspace?: string;
};

export type NexoraMVPDataRealityAwareAdvisorExperienceResult = {
  readonly advisorBinding: DataRealityAwareAdvisorBindingResult;
};

/**
 * Resolve P2:4 Advisor binding from a shared P2:2 runtime snapshot.
 */
export function resolveNexoraMVPDataRealityAwareAdvisorExperience(
  input: ResolveNexoraMVPDataRealityAwareAdvisorExperienceInput,
): NexoraMVPDataRealityAwareAdvisorExperienceResult {
  const advisorBinding = resolveDataRealityAwareAdvisorBinding({
    runtimeState: input.runtimeState,
    ...(input.selectedObjectId !== undefined
      ? { selectedObjectId: input.selectedObjectId }
      : {}),
    ...(input.focusedObjectId !== undefined
      ? { focusedObjectId: input.focusedObjectId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.workspace !== undefined ? { workspace: input.workspace } : {}),
  });

  return Object.freeze({ advisorBinding });
}

/**
 * Overlay P2:4 truth onto an existing Advisor view-model.
 * Preserves UI nextActions from the base VM (UI affordances ≠ recommendations).
 */
export function applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
  base: NexoraMVPAdvisorViewModel,
  binding: DataRealityAwareAdvisorBindingResult,
): NexoraMVPAdvisorViewModel {
  const density = binding.presentationDensity;
  const primary = binding.primarySubject;

  // STAGE-2D:6V-FIX — Direct click subject authority.
  // Never replace an explicit Stage subject with a DR-recommended substitute.
  const hasExplicitBaseSubject =
    typeof base.subjectId === "string" && base.subjectId.length > 0;
  const subjectId =
    hasExplicitBaseSubject &&
    primary !== undefined &&
    primary.objectId !== base.subjectId
      ? base.subjectId
      : (primary?.objectId ?? base.subjectId);
  const subjectLabel =
    subjectId === base.subjectId
      ? base.subjectLabel
      : primary !== undefined && primary.objectId === subjectId
        ? primary.objectId
        : base.subjectLabel;

  const title =
    density.showHeadline && binding.headline.length > 0
      ? binding.headline
      : base.title;

  const observation = density.showAdvisorMeaning
    ? (primary?.advisorMeaning ?? binding.summary.summary)
    : density.showDominantAttention
      ? `Attention: ${binding.attention.dominantAttention}`
      : null;

  const recommendation = density.showRecommendedActions
    ? (binding.recommendations.primaryAction?.title ?? null)
    : null;

  const rationale = density.showRecommendedActions
    ? (binding.recommendations.primaryAction?.rationale ?? null)
    : density.showSummary
      ? binding.summary.summary
      : null;

  const warning =
    binding.unresolved.hasUnresolvedReality || (primary?.isUnresolved ?? false)
      ? (binding.unresolved.unavailableInformation[0] ??
        "Certified executive reality is unresolved for one or more subjects.")
      : null;

  const priority = density.showDominantAttention
    ? (primary?.attention ?? binding.attention.dominantAttention)
    : base.priority;

  return Object.freeze({
    ...base,
    contextKey: `${base.contextKey}|dr:${binding.bindingId}`,
    subjectId,
    subjectLabel,
    subjectKind: primary !== undefined ? "object" : base.subjectKind,
    title,
    contextLine: [
      binding.datasetIdentity.datasetId,
      binding.presentationState,
      binding.overallCondition.dominantState,
    ].join(" · "),
    recommendation,
    rationale,
    // Preserve existing UI chrome actions — do not convert them into recommendations.
    nextActions: base.nextActions,
    warning,
    observation,
    priority,
    emptyReason:
      recommendation == null && observation == null
        ? "No certified Advisor recommendation is available for the current reality."
        : null,
  });
}
