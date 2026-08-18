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

  // UX:3 — explicit Stage/Advisor subject wins. Overview must stay subject-less.
  // Never replace an explicit subject, and never fill Overview with recommended attention.
  const hasExplicitBaseSubject =
    typeof base.subjectId === "string" && base.subjectId.length > 0;
  const subjectId = hasExplicitBaseSubject ? base.subjectId : null;
  const matchingPrimary =
    primary !== undefined && primary.objectId === subjectId ? primary : undefined;
  const subjectLabel = hasExplicitBaseSubject ? base.subjectLabel : null;
  const subjectKind = hasExplicitBaseSubject ? base.subjectKind : null;

  const title = hasExplicitBaseSubject
    ? density.showHeadline && binding.headline.length > 0
      ? binding.headline
      : base.title
    : "Advisor · Overview";

  const observation = hasExplicitBaseSubject
    ? density.showAdvisorMeaning
      ? (matchingPrimary?.advisorMeaning ??
        (primary?.objectId === subjectId ? binding.summary.summary : base.observation) ??
        base.observation)
      : (base.observation ?? null)
    : base.observation;

  const recommendation = density.showRecommendedActions
    ? matchingPrimary != null ||
      binding.recommendations.primaryAction?.subjectId === subjectId
      ? (binding.recommendations.primaryAction?.title ?? base.recommendation)
      : base.recommendation
    : base.recommendation;

  const rationale = density.showRecommendedActions
    ? (binding.recommendations.primaryAction?.subjectId === subjectId
        ? (binding.recommendations.primaryAction?.rationale ?? base.rationale)
        : base.rationale)
    : density.showSummary && hasExplicitBaseSubject
      ? (binding.summary.summary ?? base.rationale)
      : base.rationale;

  const warning =
    hasExplicitBaseSubject &&
    (matchingPrimary?.isUnresolved === true ||
      (binding.unresolved.hasUnresolvedReality &&
        binding.unresolved.objectIds.includes(subjectId ?? "")))
      ? (binding.unresolved.unavailableInformation[0] ?? base.warning)
      : hasExplicitBaseSubject
        ? base.warning
        : null;

  const priority = hasExplicitBaseSubject
    ? density.showDominantAttention
      ? (matchingPrimary?.attention ?? base.priority)
      : base.priority
    : base.priority;

  return Object.freeze({
    ...base,
    contextKey: `${base.contextKey}|dr:${binding.bindingId}`,
    subjectId,
    subjectLabel,
    subjectKind,
    title,
    recommendation,
    rationale,
    // Preserve existing UI chrome actions — do not convert them into recommendations.
    nextActions: base.nextActions,
    warning,
    observation,
    priority,
    emptyReason:
      recommendation == null && observation == null
        ? (base.emptyReason ??
          "No certified Advisor recommendation is available for the current reality.")
        : null,
  });
}
