/**
 * P2:4 — Data-Reality-Aware Advisor Experience Binding.
 *
 * Maps canonical P2:2 MVP Runtime Reality State into an Advisor-consumable
 * experience contract. Sibling of P2:3 Stage binding — both consume P2:2.
 *
 * Does NOT:
 *   - recompute KPI / executive state
 *   - perform Advisor reasoning
 *   - invent recommendations or evidence
 *   - call LLMs / network services
 *   - derive truth from Stage presentation (P2:3)
 *
 * Chain:
 *   P2:2 Runtime Reality State
 *   → P2:4 Advisor Experience Binding (this module)
 *   → Existing NEX-MVP Advisor Panel
 */

import {
  dataRealityAwareMVPRuntimeStateIdentity,
  dataRealityAwareMVPRuntimeStateNamespace,
  dataRealityAwareMVPRuntimeStateVersion,
  type DataRealityAwareMVPObjectRuntimeState,
  type DataRealityAwareMVPRuntimeState,
  type ResolveDataRealityAwareMVPRuntimeStateInput,
  resolveDataRealityAwareMVPRuntimeState,
} from "./dataRealityAwareMVPRuntimeState.ts";
import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorState,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type { DataRealityExecutiveGuidance } from "./dataRealityExecutiveAdvisoryResolution.ts";
import type {
  DataRealityAdvisorMVPExecutiveSummary,
  DataRealityAdvisorMVPObjectResolutionStatus,
  DataRealityAdvisorMVPOverallCondition,
  DataRealityAdvisorMVPRecommendedFocus,
} from "./dataRealityAdvisorMVPBridge.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareAdvisorExperienceBindingIdentity =
  "P2:4/DataRealityAwareAdvisorExperienceBinding" as const;

export const dataRealityAwareAdvisorExperienceBindingVersion = "2.4.0" as const;

export const dataRealityAwareAdvisorExperienceBindingNamespace =
  "nexora.data-reality.advisor-experience-binding" as const;

export const dataRealityAwareAdvisorExperienceBindingPhase =
  "AdvisorExperienceBinding" as const;

export const dataRealityAwareAdvisorExperienceBindingArchitecturalRole =
  "DataRealityAwareAdvisorPresentationBoundary" as const;

export interface DataRealityAwareAdvisorExperienceBindingIdentity {
  readonly identity: "P2:4/DataRealityAwareAdvisorExperienceBinding";
  readonly version: "2.4.0";
  readonly namespace: "nexora.data-reality.advisor-experience-binding";
  readonly phase: "AdvisorExperienceBinding";
  readonly architecturalRole: "DataRealityAwareAdvisorPresentationBoundary";
}

const IDENTITY: DataRealityAwareAdvisorExperienceBindingIdentity = Object.freeze({
  identity: dataRealityAwareAdvisorExperienceBindingIdentity,
  version: dataRealityAwareAdvisorExperienceBindingVersion,
  namespace: dataRealityAwareAdvisorExperienceBindingNamespace,
  phase: dataRealityAwareAdvisorExperienceBindingPhase,
  architecturalRole: dataRealityAwareAdvisorExperienceBindingArchitecturalRole,
});

export function getDataRealityAwareAdvisorExperienceBindingIdentity(): DataRealityAwareAdvisorExperienceBindingIdentity {
  return IDENTITY;
}

export const DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY =
  Object.freeze({
    architecturalRole: dataRealityAwareAdvisorExperienceBindingArchitecturalRole,
    ownsKpiComputation: false as const,
    ownsExecutiveStateResolution: false as const,
    ownsAdvisorReasoning: false as const,
    inventsRecommendations: false as const,
    inventsEvidence: false as const,
    usesStagePresentationAsTruth: false as const,
    performsNetworkWork: false as const,
    usesGenerativeAi: false as const,
    redesignsAdvisorUi: false as const,
    consumesP22RuntimeStateOnly: true as const,
    immediateRuntimeSource: dataRealityAwareMVPRuntimeStateIdentity,
    bindingCertified: false as const,
  });

export const DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:1 MVP Bridge",
    "P2:2 MVP Runtime Reality State",
    "P2:4 Advisor Experience Binding",
  ] as const);

// ─── Input / output contracts ───────────────────────────────────────────────

/**
 * Prefer a pre-resolved P2:2 `runtimeState` shared with Stage (P2:3).
 * Optional `runtimeInput` enables a single-call convenience path only.
 */
export type ResolveDataRealityAwareAdvisorBindingInput = {
  readonly runtimeState?: DataRealityAwareMVPRuntimeState;
  readonly runtimeInput?: ResolveDataRealityAwareMVPRuntimeStateInput;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
  readonly presentationState?: string;
  readonly workspace?: string;
};

export type DataRealityAwareAdvisorSubjectBinding = {
  readonly objectId: string;
  readonly executiveState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly priority?: DataRealityAwareMVPObjectRuntimeState["priority"];
  readonly advisorMeaning: string;
  readonly evidenceIds: readonly string[];
  readonly recommendedAction?: DataRealityExecutiveGuidance;
  readonly hasData: boolean;
  readonly hasKPI: boolean;
  readonly resolutionStatus: DataRealityAdvisorMVPObjectResolutionStatus;
  readonly isPrimary: boolean;
  readonly isSelected: boolean;
  readonly isFocused: boolean;
  readonly isRecommendedFocus: boolean;
  readonly isUnresolved: boolean;
};

export type DataRealityAwareAdvisorPresentationDensity = {
  readonly showHeadline: boolean;
  readonly showPrimarySubject: boolean;
  readonly showDominantAttention: boolean;
  readonly showSummary: boolean;
  readonly showAdvisorMeaning: boolean;
  readonly showEvidence: boolean;
  readonly showPrioritizedSubjects: boolean;
  readonly showRecommendedActions: boolean;
};

export type DataRealityAwareAdvisorBindingFocus = {
  readonly recommendedObjectId?: string;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
  readonly primarySubjectId?: string;
};

export type DataRealityAwareAdvisorBindingRecommendations = {
  readonly recommendedFocus?: DataRealityAdvisorMVPRecommendedFocus;
  readonly actions: readonly DataRealityExecutiveGuidance[];
  readonly primaryAction?: DataRealityExecutiveGuidance;
};

export type DataRealityAwareAdvisorBindingUnresolved = {
  readonly objectIds: readonly string[];
  readonly unavailableInformation: readonly string[];
  readonly hasUnresolvedReality: boolean;
};

export type DataRealityAwareAdvisorBindingProvenance = {
  readonly bindingIdentity: "P2:4/DataRealityAwareAdvisorExperienceBinding";
  readonly bindingVersion: "2.4.0";
  readonly bindingNamespace: "nexora.data-reality.advisor-experience-binding";
  readonly bindingPhase: "AdvisorExperienceBinding";
  readonly bindingCertified: false;
  readonly chain: typeof DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_PROVENANCE_CHAIN;
  readonly immediateRuntimeSource: typeof dataRealityAwareMVPRuntimeStateIdentity;
  readonly immediateRuntimeVersion: typeof dataRealityAwareMVPRuntimeStateVersion;
  readonly immediateRuntimeNamespace: typeof dataRealityAwareMVPRuntimeStateNamespace;
  readonly runtimeStateId: string;
  readonly datasetId: string;
};

export type DataRealityAwareAdvisorBindingResult = {
  readonly bindingId: string;
  readonly identity: DataRealityAwareAdvisorExperienceBindingIdentity;
  readonly datasetIdentity: DataRealityAwareMVPRuntimeState["datasetIdentity"];
  readonly headline: string;
  readonly summary: DataRealityAdvisorMVPExecutiveSummary;
  readonly overallCondition: DataRealityAdvisorMVPOverallCondition;
  readonly primarySubject?: DataRealityAwareAdvisorSubjectBinding;
  readonly prioritizedSubjects: readonly DataRealityAwareAdvisorSubjectBinding[];
  readonly selectedSubject?: DataRealityAwareAdvisorSubjectBinding;
  readonly focusedSubject?: DataRealityAwareAdvisorSubjectBinding;
  readonly attention: DataRealityAwareMVPRuntimeState["attention"];
  readonly recommendations: DataRealityAwareAdvisorBindingRecommendations;
  /** Certified recommendations only — not UI chrome actions. */
  readonly actions: readonly DataRealityExecutiveGuidance[];
  readonly unresolved: DataRealityAwareAdvisorBindingUnresolved;
  readonly presentationState: string;
  readonly workspace?: string;
  readonly presentationDensity: DataRealityAwareAdvisorPresentationDensity;
  readonly focus: DataRealityAwareAdvisorBindingFocus;
  readonly provenance: DataRealityAwareAdvisorBindingProvenance;
  readonly sourceRuntimeState: DataRealityAwareMVPRuntimeState;
};

// ─── Lookup helpers ─────────────────────────────────────────────────────────

export function getDataRealityAwareAdvisorSubject(
  binding: DataRealityAwareAdvisorBindingResult,
  objectId: string,
): DataRealityAwareAdvisorSubjectBinding | undefined {
  return binding.prioritizedSubjects.find(
    (entry) => entry.objectId === objectId,
  );
}

export function getDataRealityAwareAdvisorPrimarySubject(
  binding: DataRealityAwareAdvisorBindingResult,
): DataRealityAwareAdvisorSubjectBinding | undefined {
  return binding.primarySubject;
}

export function getDataRealityAwareAdvisorRecommendations(
  binding: DataRealityAwareAdvisorBindingResult,
): readonly DataRealityExecutiveGuidance[] {
  return binding.recommendations.actions;
}

export function getDataRealityAwareAdvisorUnresolvedSubjects(
  binding: DataRealityAwareAdvisorBindingResult,
): readonly DataRealityAwareAdvisorSubjectBinding[] {
  return Object.freeze(
    binding.prioritizedSubjects.filter((entry) => entry.isUnresolved),
  );
}

// ─── Projection (no business reasoning) ─────────────────────────────────────

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function resolveRuntimeState(
  input: ResolveDataRealityAwareAdvisorBindingInput,
): DataRealityAwareMVPRuntimeState {
  if (input.runtimeState) return input.runtimeState;
  if (input.runtimeInput) {
    return resolveDataRealityAwareMVPRuntimeState(input.runtimeInput);
  }
  throw new Error(
    "resolveDataRealityAwareAdvisorBinding requires runtimeState or runtimeInput",
  );
}

/**
 * Primary presentation subject precedence (interaction over severity):
 * 1. focused subject (explicit Stage click — even if absent from DR catalog)
 * 2. selected subject (explicit Stage click — even if absent from DR catalog)
 * 3. recommended focus (DR catalog only)
 * 4. first upstream prioritized subject
 *
 * STAGE-2D:6V-FIX — Critical/recommended Capacity must never replace a direct
 * Budget (or other unbound) click as Advisor current-subject authority.
 * Does not invent severity scoring.
 */
export function resolveDataRealityAwareAdvisorPrimarySubjectId(
  runtimeState: DataRealityAwareMVPRuntimeState,
  selectedObjectId?: string,
  focusedObjectId?: string,
): string | undefined {
  const known = new Set(runtimeState.objects.map((entry) => entry.objectId));

  // Explicit Stage interaction wins even when the object is not in the DR catalog
  // (e.g. Budget). Matches resolveDataRealityAwarePrimaryFocusObjectId.
  if (focusedObjectId) return focusedObjectId;
  if (selectedObjectId) return selectedObjectId;

  const focused = runtimeState.focus.focusedObjectId;
  if (focused && known.has(focused)) return focused;

  const selected = runtimeState.focus.selectedObjectId;
  if (selected && known.has(selected)) return selected;

  const recommended = runtimeState.focus.recommendedObjectId;
  if (recommended && known.has(recommended)) return recommended;

  const firstPrioritized = runtimeState.prioritizedSubjects[0]?.subjectId;
  if (firstPrioritized && known.has(firstPrioritized)) return firstPrioritized;

  return runtimeState.objects[0]?.objectId;
}

function presentationDensityFor(
  presentationState: string,
): DataRealityAwareAdvisorPresentationDensity {
  const normalized = presentationState.toLowerCase();
  if (normalized === "minimum") {
    return Object.freeze({
      showHeadline: true,
      showPrimarySubject: true,
      showDominantAttention: true,
      showSummary: false,
      showAdvisorMeaning: false,
      showEvidence: false,
      showPrioritizedSubjects: false,
      showRecommendedActions: false,
    });
  }
  if (normalized === "operation") {
    return Object.freeze({
      showHeadline: true,
      showPrimarySubject: true,
      showDominantAttention: true,
      showSummary: true,
      showAdvisorMeaning: true,
      showEvidence: true,
      showPrioritizedSubjects: true,
      showRecommendedActions: true,
    });
  }
  // report (default)
  return Object.freeze({
    showHeadline: true,
    showPrimarySubject: true,
    showDominantAttention: true,
    showSummary: true,
    showAdvisorMeaning: true,
    showEvidence: true,
    showPrioritizedSubjects: true,
    showRecommendedActions: false,
  });
}

function projectSubject(
  object: DataRealityAwareMVPObjectRuntimeState,
  primarySubjectId: string | undefined,
  selectedObjectId: string | undefined,
  focusedObjectId: string | undefined,
  recommendedObjectId: string | undefined,
): DataRealityAwareAdvisorSubjectBinding {
  const isUnresolved =
    object.executiveState === "unresolved" ||
    object.resolutionStatus === "unresolved" ||
    object.resolutionStatus === "unavailable";

  return Object.freeze({
    objectId: object.objectId,
    executiveState: object.executiveState,
    attention: object.attention,
    ...(object.priority !== undefined ? { priority: object.priority } : {}),
    advisorMeaning: object.advisorMeaning,
    evidenceIds: object.evidenceIds,
    ...(object.recommendedAction !== undefined
      ? { recommendedAction: object.recommendedAction }
      : {}),
    hasData: object.hasData,
    hasKPI: object.hasKPI,
    resolutionStatus: object.resolutionStatus,
    isPrimary: primarySubjectId === object.objectId,
    // Effective selection/focus from this resolve cycle (input override or
    // runtime snapshot). Do not OR with stale object flags from the snapshot.
    isSelected: selectedObjectId === object.objectId,
    isFocused: focusedObjectId === object.objectId,
    isRecommendedFocus: recommendedObjectId === object.objectId,
    isUnresolved,
  });
}

function resolveHeadline(
  runtimeState: DataRealityAwareMVPRuntimeState,
  primarySubject: DataRealityAwareAdvisorSubjectBinding | undefined,
): string {
  if (runtimeState.summary.headline.length > 0) {
    return runtimeState.summary.headline;
  }
  if (primarySubject?.advisorMeaning) {
    return primarySubject.advisorMeaning;
  }
  if (runtimeState.attention.hasUnresolvedReality) {
    return "Executive reality is currently unresolved for one or more subjects.";
  }
  return "Certified executive reality is available for review.";
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:4 Advisor binding API.
 * Consumes P2:2 runtime truth and projects Advisor presentation contracts.
 */
export function resolveDataRealityAwareAdvisorBinding(
  input: ResolveDataRealityAwareAdvisorBindingInput,
): DataRealityAwareAdvisorBindingResult {
  const runtimeState = resolveRuntimeState(input);
  const presentationState =
    input.presentationState ??
    runtimeState.context.presentationState ??
    "report";
  const workspace = input.workspace ?? runtimeState.context.workspace;
  const selectedObjectId =
    input.selectedObjectId ?? runtimeState.focus.selectedObjectId;
  const focusedObjectId =
    input.focusedObjectId ?? runtimeState.focus.focusedObjectId;
  const recommendedObjectId = runtimeState.focus.recommendedObjectId;

  const primarySubjectId = resolveDataRealityAwareAdvisorPrimarySubjectId(
    runtimeState,
    selectedObjectId,
    focusedObjectId,
  );

  const subjects = Object.freeze(
    runtimeState.objects.map((object) =>
      projectSubject(
        object,
        primarySubjectId,
        selectedObjectId,
        focusedObjectId,
        recommendedObjectId,
      ),
    ),
  );

  const byId = new Map(subjects.map((entry) => [entry.objectId, entry]));

  const prioritizedSubjects = Object.freeze(
    (() => {
      const ordered: DataRealityAwareAdvisorSubjectBinding[] = [];
      const seen = new Set<string>();
      for (const prioritized of runtimeState.prioritizedSubjects) {
        const subject = byId.get(prioritized.subjectId);
        if (!subject || seen.has(subject.objectId)) continue;
        seen.add(subject.objectId);
        ordered.push(subject);
      }
      for (const subject of subjects) {
        if (seen.has(subject.objectId)) continue;
        seen.add(subject.objectId);
        ordered.push(subject);
      }
      return ordered;
    })(),
  );

  const primarySubject =
    primarySubjectId !== undefined ? byId.get(primarySubjectId) : undefined;
  const selectedSubject =
    selectedObjectId !== undefined ? byId.get(selectedObjectId) : undefined;
  const focusedSubject =
    focusedObjectId !== undefined ? byId.get(focusedObjectId) : undefined;

  const actions = runtimeState.recommendations.actions;
  const primaryAction =
    (primarySubject?.recommendedAction !== undefined
      ? primarySubject.recommendedAction
      : undefined) ??
    actions.find((entry) => entry.subjectId === primarySubjectId) ??
    actions[0];

  const bindingId = [
    "advisor-experience-binding",
    normalizeToken(runtimeState.datasetIdentity.datasetId),
    normalizeToken(runtimeState.stateId),
    normalizeToken(presentationState),
    normalizeToken(primarySubjectId),
    normalizeToken(selectedObjectId),
    normalizeToken(focusedObjectId),
  ].join(":");

  return Object.freeze({
    bindingId,
    identity: IDENTITY,
    datasetIdentity: runtimeState.datasetIdentity,
    headline: resolveHeadline(runtimeState, primarySubject),
    summary: runtimeState.summary,
    overallCondition: runtimeState.overallCondition,
    ...(primarySubject !== undefined ? { primarySubject } : {}),
    prioritizedSubjects,
    ...(selectedSubject !== undefined ? { selectedSubject } : {}),
    ...(focusedSubject !== undefined ? { focusedSubject } : {}),
    attention: runtimeState.attention,
    recommendations: Object.freeze({
      ...(runtimeState.recommendations.recommendedFocus !== undefined
        ? {
            recommendedFocus: runtimeState.recommendations.recommendedFocus,
          }
        : {}),
      actions,
      ...(primaryAction !== undefined ? { primaryAction } : {}),
    }),
    actions,
    unresolved: Object.freeze({
      objectIds: runtimeState.unresolved.objectIds,
      unavailableInformation: runtimeState.unresolved.unavailableInformation,
      hasUnresolvedReality: runtimeState.attention.hasUnresolvedReality,
    }),
    presentationState,
    ...(workspace !== undefined ? { workspace } : {}),
    presentationDensity: presentationDensityFor(presentationState),
    focus: Object.freeze({
      ...(recommendedObjectId !== undefined
        ? { recommendedObjectId }
        : {}),
      ...(selectedObjectId !== undefined ? { selectedObjectId } : {}),
      ...(focusedObjectId !== undefined ? { focusedObjectId } : {}),
      ...(primarySubjectId !== undefined ? { primarySubjectId } : {}),
    }),
    provenance: Object.freeze({
      bindingIdentity: dataRealityAwareAdvisorExperienceBindingIdentity,
      bindingVersion: dataRealityAwareAdvisorExperienceBindingVersion,
      bindingNamespace: dataRealityAwareAdvisorExperienceBindingNamespace,
      bindingPhase: dataRealityAwareAdvisorExperienceBindingPhase,
      bindingCertified: false,
      chain: DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_PROVENANCE_CHAIN,
      immediateRuntimeSource: dataRealityAwareMVPRuntimeStateIdentity,
      immediateRuntimeVersion: dataRealityAwareMVPRuntimeStateVersion,
      immediateRuntimeNamespace: dataRealityAwareMVPRuntimeStateNamespace,
      runtimeStateId: runtimeState.stateId,
      datasetId: runtimeState.datasetIdentity.datasetId,
    }),
    sourceRuntimeState: runtimeState,
  });
}
