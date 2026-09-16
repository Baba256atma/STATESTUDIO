/**
 * NXA:5-FIX4 — Advisor↔Stage context intelligence (read model + relationship class).
 * Consumes DIR/runtime Stage state. Does not own Stage or duplicate collection truth.
 */

import {
  deriveNexoraMVPStageInteractionPresentation,
  type DeriveNexoraMVPStageInteractionPresentationOptions,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { EXECUTIVE_QUEUE_CATEGORY_LABELS } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import type { StageSemanticSnapshot } from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import { interpretExecutiveCollectionQuery } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { classifyManagerSpeechAct } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { isCompleteManagerBusinessObservation } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { isExecutiveComparisonCriterionAnswer } from "./nexoraNcaPost4CollectionComparison.ts";

export const nexoraNxa5Fix4Identity =
  "NXA:5-FIX4/AdvisorStageContextIntelligenceSceneAwarenessPresentationConsent" as const;

export const NEXORA_NXA5_FIX4_BOUNDARY = Object.freeze({
  identity: nexoraNxa5Fix4Identity,
  createsStageStore: false as const,
  mutatesStage: false as const,
  writesBusinessTruth: false as const,
  usesPhraseTables: false as const,
});

export type StagePresentationType =
  | "OVERVIEW"
  | "FOCUS"
  | "COLLECTION"
  | "RELATIONSHIP"
  | "UNKNOWN";

export type StageRequestRelationship =
  | "STAGE_GROUNDED"
  | "STAGE_META"
  | "STAGE_COMPATIBLE"
  | "STAGE_CONFLICTING"
  | "STAGE_INDEPENDENT"
  | "AMBIGUOUS"
  | "EXPLICIT_PRESENTATION";

export type AuthoritativeStageMember = Readonly<{
  id: string;
  label: string;
  kind: string;
  spatialRole?: string;
  family?: string;
}>;

export type LastAuthorizedPresentation = Readonly<{
  intent: string;
  reason: string;
  collectionKind: string | null;
  focusId: string | null;
  memberIds: readonly string[];
}>;

export type PendingPresentationConsent = Readonly<{
  targetId: string;
  targetLabel: string;
  targetKind: string;
  question: string;
}>;

export type StageAwarenessDiagnostics = Readonly<{
  stageSceneId: string;
  stageSceneMode: string;
  stageVisibleActorCount: number;
  stageVisibleActorIds: readonly string[];
  stageVisibleActorNames: readonly string[];
  stageVisibleActorFamilies: readonly string[];
  stageFocusedObjectId: string | null;
  stageSelectedObjectId: string | null;
  stagePresentationSource: string;
  stagePresentationReason: string | null;
  stageProjectionFreshness: "live-presentation" | "unavailable";
  eca1StageAwarenessConsumed: boolean;
  advisorStageQueryDetected: boolean;
  advisorStageMembershipSource: string;
  advisorStageFallbackUsed: boolean;
}>;

export type AuthoritativeStageContext = Readonly<{
  available: boolean;
  presentationType: StagePresentationType;
  workspace: string;
  focus: AuthoritativeStageMember | null;
  selected: AuthoritativeStageMember | null;
  collection: Readonly<{
    kind: string;
    label: string;
    memberIds: readonly string[];
    members: readonly AuthoritativeStageMember[];
  }> | null;
  visibleMembers: readonly AuthoritativeStageMember[];
  relationships: readonly string[];
  goalContext: string | null;
  presentationReason: string | null;
  presentationSource: "stage-presentation" | "unavailable";
  snapshot: StageSemanticSnapshot | null;
  diagnostics: StageAwarenessDiagnostics;
}>;

function prepared(text: string): string {
  return text.trim().toLowerCase().replace(/[?.!]+$/g, "");
}

function resolveMember(
  id: string,
  catalog: NexoraMVPObjectInteractionCatalog,
  extras?: { readonly spatialRole?: string; readonly family?: string; readonly label?: string },
): AuthoritativeStageMember {
  const item =
    catalog.objects.find((entry) => entry.id === id) ??
    catalog.contextSubjects.find((entry) => entry.id === id);
  const catalogLabel = item?.label ?? id;
  const spatialRole = extras?.spatialRole;
  const family =
    extras?.family ??
    (spatialRole === "watch"
      ? "watch"
      : item && "kind" in item && item.kind !== "object"
        ? "executive-work"
        : "business-object");
  const label =
    extras?.label ??
    (spatialRole === "watch" && !/\bwatch\b/i.test(catalogLabel)
      ? `${catalogLabel} Watch`
      : catalogLabel);
  return Object.freeze({
    id,
    label,
    kind: item?.kind ?? "object",
    spatialRole,
    family,
  });
}

function emptyStageDiagnostics(partial: Partial<StageAwarenessDiagnostics> = {}): StageAwarenessDiagnostics {
  return Object.freeze({
    stageSceneId: "unknown",
    stageSceneMode: "unknown",
    stageVisibleActorCount: 0,
    stageVisibleActorIds: Object.freeze([]),
    stageVisibleActorNames: Object.freeze([]),
    stageVisibleActorFamilies: Object.freeze([]),
    stageFocusedObjectId: null,
    stageSelectedObjectId: null,
    stagePresentationSource: "unavailable",
    stagePresentationReason: null,
    stageProjectionFreshness: "unavailable",
    eca1StageAwarenessConsumed: false,
    advisorStageQueryDetected: false,
    advisorStageMembershipSource: "none",
    advisorStageFallbackUsed: true,
    ...partial,
  });
}

export function resolveStageOrdinalActor(
  utterance: string,
  visible: readonly AuthoritativeStageMember[],
): AuthoritativeStageMember | null {
  const match = utterance.match(/\b(?:the )?(first|second|third|last) one\b/i);
  if (!match || visible.length === 0) return null;
  const token = match[1]?.toLowerCase();
  const index =
    token === "first" ? 0 : token === "second" ? 1 : token === "third" ? 2 : visible.length - 1;
  return visible[index] ?? null;
}

export function joinStageActorNames(names: readonly string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function isStageMembershipQuestion(utterance: string): boolean {
  const text = prepared(utterance);
  return (
    /\bwhat(?:'s| is) on (?:the )?stage\b/.test(text) ||
    /\bwhat objects (?:are |on )?(?:on )?(?:the )?stage\b/.test(text) ||
    /\bwhat can i see (?:here|on (?:the )?stage)\b/.test(text) ||
    /\bwhat is currently showing\b/.test(text) ||
    /\bwhich objects (?:are )?(?:visible|showing)\b/.test(text) ||
    /\bobjects on (?:the )?stage\b/.test(text)
  );
}

export function isStageFocusQuestion(utterance: string): boolean {
  const text = prepared(utterance);
  return /\bwhat am i focused on\b|\bcurrent focus\b|\bin the center\b/.test(text);
}

export function isLayoutProximityRelationshipQuestion(utterance: string): boolean {
  const text = prepared(utterance);
  return /\b(?:next to|beside|near|close to|next to each other)\b/.test(text) &&
    /\b(?:related|relationship|mean they|does that mean)\b/.test(text);
}

export function isVisibilityImportanceQuestion(utterance: string): boolean {
  const text = prepared(utterance);
  return /\bon stage\b/.test(text) && /\b(?:important|priority|priorit)\b/.test(text);
}

export function isVisibilityCausalityQuestion(utterance: string): boolean {
  const text = prepared(utterance);
  return /\bon stage\b/.test(text) && /\b(?:cause|causing|causal)\b/.test(text);
}

export function utteranceMentionsStageMember(
  utterance: string,
  member: AuthoritativeStageMember,
): boolean {
  const text = ` ${prepared(utterance)} `;
  const catalog = member.label.replace(/\s+watch$/i, "").toLowerCase();
  const full = prepared(member.label);
  return text.includes(` ${full} `) || text.includes(` ${catalog} `) || text.includes(` ${catalog} watch `);
}

export function isStageVisibilityCorrection(
  utterance: string,
  visible: readonly { readonly id: string; readonly label: string }[],
): boolean {
  if (/\?/.test(utterance) && !/\bdo you understand\b/i.test(utterance)) return false;
  if (/\bi mean what\b/i.test(utterance) || /^(?:what|which|why|how|explain)\b/i.test(utterance.trim())) {
    return false;
  }
  const speech = classifyManagerSpeechAct(utterance);
  const corrective =
    speech === "CORRECTION" ||
    /\byou(?:'re| are) wrong\b/i.test(utterance) ||
    /^(?:no[, ]+)/i.test(utterance.trim());
  if (!corrective) return false;
  const mentionsVisible = visible.some((member) =>
    utteranceMentionsStageMember(utterance, {
      id: member.id,
      label: member.label,
      kind: "object",
    }),
  );
  return mentionsVisible || /\bon it\b/i.test(utterance);
}

export function composeStageVisibilityCorrectionReply(input: {
  readonly utterance: string;
  readonly stage: AuthoritativeStageContext;
  readonly previousResponse?: string | null;
}): string {
  if (!input.stage.available) {
    return "I can’t reliably determine the current Stage contents.";
  }
  const claimed = input.stage.visibleMembers.filter((member) =>
    utteranceMentionsStageMember(input.utterance, member),
  );
  const names = joinStageActorNames(claimed.map((item) => item.label));
  const runtimeNames = joinStageActorNames(input.stage.visibleMembers.map((item) => item.label));
  if (claimed.length > 0 && claimed.length === input.stage.visibleMembers.filter((member) =>
    utteranceMentionsStageMember(input.utterance, member),
  ).length) {
    const allClaimedVisible = claimed.every((member) =>
      input.stage.visibleMembers.some((visible) => visible.id === member.id),
    );
    if (allClaimedVisible) {
      return `You're right. I was reading the wrong context. ${names} are currently visible on Stage.`;
    }
  }
  if (claimed.length === 0) {
    return "I understand that you’re correcting what is visible on Stage. My current Stage state doesn’t match that observation, so I shouldn’t treat either view as confirmed until they are reconciled.";
  }
  const mismatch = claimed.some(
    (member) => !input.stage.visibleMembers.some((visible) => visible.id === member.id),
  );
  if (mismatch || claimed.length === 0) {
    return "I understand that you’re correcting what is visible on Stage. My current Stage state doesn’t match that observation, so I shouldn’t treat either view as confirmed until they are reconciled.";
  }
  if (input.previousResponse && /does not currently show any executive objects|currently empty/i.test(input.previousResponse)) {
    return `You're right. I was reading the wrong context. ${runtimeNames || names} are currently visible on Stage.`;
  }
  return `You're right. I was reading the wrong context. ${names} are currently visible on Stage.`;
}

function diagnosticsFrom(input: {
  readonly sceneId: string;
  readonly mode: string;
  readonly visible: readonly AuthoritativeStageMember[];
  readonly focusId: string | null;
  readonly selectedId: string | null;
  readonly reason: string | null;
  readonly source: "stage-presentation" | "unavailable";
}): StageAwarenessDiagnostics {
  return emptyStageDiagnostics({
    stageSceneId: input.sceneId,
    stageSceneMode: input.mode,
    stageVisibleActorCount: input.visible.length,
    stageVisibleActorIds: Object.freeze(input.visible.map((item) => item.id)),
    stageVisibleActorNames: Object.freeze(input.visible.map((item) => item.label)),
    stageVisibleActorFamilies: Object.freeze(input.visible.map((item) => item.family ?? item.kind)),
    stageFocusedObjectId: input.focusId,
    stageSelectedObjectId: input.selectedId,
    stagePresentationSource: input.source,
    stagePresentationReason: input.reason,
    stageProjectionFreshness: input.source === "stage-presentation" ? "live-presentation" : "unavailable",
    eca1StageAwarenessConsumed: input.source === "stage-presentation",
    advisorStageMembershipSource: input.source,
    advisorStageFallbackUsed: input.source !== "stage-presentation",
  });
}

export function projectAuthoritativeStageContext(input: {
  readonly runtimeState: NexoraMVPObjectInteractionState | null | undefined;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly lastAuthorizedPresentation?: LastAuthorizedPresentation | null;
  readonly goalLabel?: string | null;
  readonly presentationOptions?: DeriveNexoraMVPStageInteractionPresentationOptions;
}): AuthoritativeStageContext {
  const state = input.runtimeState;
  if (!state) {
    return Object.freeze({
      available: false,
      presentationType: "UNKNOWN",
      workspace: "unknown",
      focus: null,
      selected: null,
      collection: null,
      visibleMembers: Object.freeze([]),
      relationships: Object.freeze([]),
      goalContext: input.goalLabel ?? null,
      presentationReason: null,
      presentationSource: "unavailable",
      snapshot: null,
      diagnostics: emptyStageDiagnostics(),
    });
  }
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    input.catalog,
    input.presentationOptions,
  );
  const focus = state.focusedSubject
    ? resolveMember(state.focusedSubject.id, input.catalog, {
        spatialRole: presentation.scene.objects.find((entry) => entry.id === state.focusedSubject?.id)?.spatialRole,
      })
    : null;
  const selected = state.selectedSubject
    ? resolveMember(state.selectedSubject.id, input.catalog)
    : null;
  const collectionIds = state.collectionContext?.objectIds ?? [];
  const members = Object.freeze(collectionIds.map((id) => resolveMember(id, input.catalog)));
  const collection = state.collectionContext
    ? Object.freeze({
        kind: state.collectionContext.category,
        label: EXECUTIVE_QUEUE_CATEGORY_LABELS[state.collectionContext.category] ?? "Collection",
        memberIds: Object.freeze([...collectionIds]),
        members,
      })
    : null;
  const visibleFromPresentation = presentation.scene.objects
    .filter((entry) => (entry.spatialRole ?? "hidden") !== "hidden" && entry.disclosureState !== "hidden")
    .map((entry) =>
      resolveMember(entry.id, input.catalog, {
        spatialRole: entry.spatialRole,
        label:
          entry.spatialRole === "watch"
            ? undefined
            : (entry.labelPrimaryLine && entry.labelPrimaryLine.trim()) || entry.label,
      }),
    );
  const visibleNodeActors = presentation.contextNodes
    .filter((node) => node.role === "context" || node.role === "focused" || node.role === "collapsed-thread")
    .filter((node) => !visibleFromPresentation.some((member) => member.id === node.id))
    .map((node) =>
      resolveMember(node.id, input.catalog, {
        family: "presentation-actor",
        label: node.label,
      }),
    );
  const collectionActors = Object.freeze(
    members.filter((member, index, all) => all.findIndex((entry) => entry.id === member.id) === index),
  );
  const overviewActors = Object.freeze(
    (visibleFromPresentation.length > 0
      ? [
          ...visibleFromPresentation.filter(
            (member) => (member.spatialRole ?? "hidden") !== "collection",
          ),
          ...visibleNodeActors.filter((node) =>
            presentation.contextNodes.some(
              (entry) => entry.id === node.id && entry.role === "focused",
            ),
          ),
        ]
      : [...(focus ? [focus] : [])]
    ).filter((member, index, all) => all.findIndex((entry) => entry.id === member.id) === index),
  );
  const visible = collection ? collectionActors : overviewActors;
  const presentationType: StagePresentationType = collection
    ? "COLLECTION"
    : focus
      ? "FOCUS"
      : state.workspace === "overview" || presentation.presentationMode === "overview"
        ? "OVERVIEW"
        : "UNKNOWN";
  const snapshot: StageSemanticSnapshot = Object.freeze({
    workspace: state.workspace,
    mode: collection
      ? "collection"
      : focus
        ? "object-focus"
        : presentation.presentationMode ?? state.mode,
    focused: focus,
    collection: collection
      ? Object.freeze({
          kind: collection.kind,
          label: collection.label,
          members: collection.members,
        })
      : null,
    visibleObjects: visible,
  });
  const presentationReason = input.lastAuthorizedPresentation
    ? input.lastAuthorizedPresentation.reason
    : collection
      ? `The current ${collection.label} collection is the authoritative Stage presentation.`
      : focus
        ? `${focus.label} is the current focused object on Stage.`
        : presentationType === "OVERVIEW"
          ? "They are part of the current Overview presentation."
          : null;
  return Object.freeze({
    available: true,
    presentationType,
    workspace: state.workspace,
    focus,
    selected,
    collection,
    visibleMembers: visible,
    relationships: Object.freeze([]),
    goalContext: input.goalLabel ?? null,
    presentationReason,
    presentationSource: "stage-presentation",
    snapshot,
    diagnostics: diagnosticsFrom({
      sceneId: `${state.workspace}:${presentation.presentationMode ?? state.mode}`,
      mode: presentation.presentationMode ?? snapshot.mode,
      visible,
      focusId: focus?.id ?? null,
      selectedId: selected?.id ?? presentation.selectedSubjectId ?? null,
      reason: presentationReason,
      source: "stage-presentation",
    }),
  });
}

export function isStageMetaUtterance(utterance: string): boolean {
  const text = prepared(utterance);
  return (
    /\b(?:on (?:the )?stage|this scene|the scene|looking at|showing me|going on here|going on on stage|visible objects|in the center|in the queue)\b/.test(
      text,
    ) ||
    /^(?:explain (?:the )?(?:stage|scene)|what(?:'s| is) (?:this|that)|what are these|why (?:is|are) (?:this|these|they) here)$/.test(
      text,
    )
  );
}

export function isStageGroundedReference(utterance: string): boolean {
  const text = prepared(utterance);
  return /(?:\b(?:which one|them|those|these|they)\b|\bcompare\b|\bmore important\b|\bneeds? attention\b|\bwhy are they here\b|\bwhat are these\b|\bexplain (?:them|these|those)\b)/.test(
    text,
  );
}

export function isExplicitPresentationRequest(utterance: string, intentKind: string): boolean {
  const text = prepared(utterance).replace(
    /^(?:(?:okay|ok|now|actually)\s*,?\s*)+/,
    "",
  );
  if (/^(?:what|which|why|how|explain)\b/.test(text)) return false;
  if (
    /^(?:show|open|focus(?: on)?|bring up|go to|take me to|go back|look at|lets work on|let s work on|let us work on|how about)\b/.test(
      text,
    )
  )
    return true;
  return /^(?:show-|open-|overview)/.test(intentKind);
}

export function isCollectionConfirmation(utterance: string): boolean {
  const text = prepared(utterance);
  if (!/\b(?:talking about|i mean|i meant|i am asking about|the .+ on stage)\b/.test(text)) {
    return false;
  }
  return Boolean(interpretExecutiveCollectionQuery(utterance));
}

export function isPresentationConsentReply(utterance: string): "yes" | "no" | null {
  const text = prepared(utterance);
  if (/^(?:yes|yeah|yep|ok|okay|please do|do it)$/.test(text)) return "yes";
  if (/^(?:no|nope|not now|keep (?:it|this)|leave it)$/.test(text)) return "no";
  return null;
}

export function classifyRequestStageRelationship(input: {
  readonly utterance: string;
  readonly intentKind: string;
  readonly stage: AuthoritativeStageContext;
  readonly pendingCriterion: boolean;
  readonly pendingConsent: PendingPresentationConsent | null;
}): StageRequestRelationship {
  const text = prepared(input.utterance);
  if (input.pendingConsent && isPresentationConsentReply(input.utterance)) {
    return "STAGE_COMPATIBLE";
  }
  if (isCollectionConfirmation(input.utterance) && input.stage.collection) {
    return "STAGE_GROUNDED";
  }
  if (isExplicitPresentationRequest(input.utterance, input.intentKind)) {
    return "EXPLICIT_PRESENTATION";
  }
  if (isStageMetaUtterance(input.utterance)) return "STAGE_META";
  if (isCompleteManagerBusinessObservation(input.utterance)) return "STAGE_COMPATIBLE";
  if (input.pendingCriterion && isExecutiveComparisonCriterionAnswer(input.utterance)) {
    return "STAGE_GROUNDED";
  }
  if (input.stage.collection || input.stage.focus) {
    if (isStageGroundedReference(input.utterance)) return "STAGE_GROUNDED";
  }
  if (/^(?:what|why|explain|how)\b/.test(text) && input.intentKind === "focus") {
    return input.stage.presentationType === "COLLECTION" ||
      input.stage.presentationType === "FOCUS" ||
      input.stage.visibleMembers.length > 0
      ? "STAGE_COMPATIBLE"
      : "STAGE_INDEPENDENT";
  }
  if (input.intentKind === "explain" || input.intentKind === "explain-scenario") {
    const mentionsVisible = input.stage.visibleMembers.some((member) =>
      utteranceMentionsStageMember(input.utterance, member),
    );
    return input.stage.focus || input.stage.collection || mentionsVisible
      ? "STAGE_COMPATIBLE"
      : "STAGE_INDEPENDENT";
  }
  if (!input.stage.available || input.stage.presentationType === "OVERVIEW") {
    return "STAGE_INDEPENDENT";
  }
  if (input.intentKind === "unknown" && !/\?/.test(input.utterance) && text.split(" ").length <= 3) {
    return input.pendingCriterion ? "STAGE_GROUNDED" : "AMBIGUOUS";
  }
  return "STAGE_INDEPENDENT";
}

export function composeStageSceneExplanation(stage: AuthoritativeStageContext): string {
  if (!stage.available) {
    return "I can’t reliably determine the current Stage presentation from the available context.";
  }
  if (stage.collection && stage.collection.members.length > 0) {
    const names = stage.collection.members.map((item) => item.label).join(", ");
    const reason = humanizePresentationReason(stage.presentationReason)
      ? ` They are here because ${humanizePresentationReason(stage.presentationReason)}.`
      : " They are here because they are the current collection on Stage.";
    const focus = stage.focus ? ` ${stage.focus.label} is focused.` : " None is currently focused as a preferred option.";
    return `The Stage is currently showing ${stage.collection.members.length} ${stage.collection.label}: ${names}.${reason}${focus} We can compare them using financial impact, risk, urgency, evidence strength, or another criterion.`;
  }
  if (stage.focus) {
    const kind = /^[aeiou]/i.test(stage.focus.kind) ? `an ${stage.focus.kind}` : `a ${stage.focus.kind}`;
    const reason = humanizePresentationReason(stage.presentationReason);
    const why = reason ? ` It is here because ${reason}.` : "";
    const others = stage.visibleMembers.filter((member) => member.id !== stage.focus?.id);
    if (others.length > 0) {
      return `${stage.focus.label} is currently focused. ${joinStageActorNames(others.map((item) => item.label))} ${others.length === 1 ? "is" : "are"} also visible.`;
    }
    return `The Stage is currently focused on ${stage.focus.label}, ${kind}.${why} Visibility does not by itself establish a causal conclusion.`;
  }
  if (stage.visibleMembers.length > 0) {
    return `${joinStageActorNames(stage.visibleMembers.map((item) => item.label))} ${stage.visibleMembers.length === 1 ? "is" : "are"} currently visible on Stage.`;
  }
  return "The Stage is currently empty.";
}

function humanizePresentationReason(reason: string | null): string | null {
  if (!reason) return null;
  if (/collection/i.test(reason) && /explicit|canonical|request/i.test(reason)) {
    return "you asked to review the current collection";
  }
  if (/explicit-resolved-object-request|explicit.*focus|you focused/i.test(reason)) {
    return "you focused this object";
  }
  if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(reason.trim())) return null;
  if (/current Overview presentation/i.test(reason)) {
    return "it is part of the current Overview presentation";
  }
  return reason.replace(/[-_]/g, " ");
}

export function composePresentationReasonReply(stage: AuthoritativeStageContext): string {
  if (!stage.available) {
    return "I can’t reliably determine the current Stage presentation from the available context.";
  }
  if (stage.collection) {
    const names = stage.collection.members.map((item) => item.label).join(", ");
    const proven = humanizePresentationReason(stage.presentationReason) ??
      `they are included in the active ${stage.collection.label} collection`;
    return `${names} are presented because ${proven.replace(/^The /, "the ").replace(/\.$/, "")}. Visibility alone does not establish a causal relationship.`;
  }
  if (stage.focus) {
    return `${stage.focus.label} is on Stage as the current focused object. That does not by itself establish causality.`;
  }
  if (stage.presentationType === "OVERVIEW" && stage.visibleMembers.length > 0) {
    return `${joinStageActorNames(stage.visibleMembers.map((item) => item.label))} ${stage.visibleMembers.length === 1 ? "is" : "are"} part of the current Overview presentation.`;
  }
  if (stage.visibleMembers.length > 0) {
    return "They are currently part of the Stage view, but I don’t have enough information to say why each was selected for this scene.";
  }
  return "I can only say that no collection or focused object is currently presented.";
}

export function composeCollectionConfirmationReply(stage: AuthoritativeStageContext): string | null {
  if (!stage.collection || stage.collection.members.length === 0) return null;
  const names = stage.collection.members.map((item) => item.label).join(", ");
  return `Yes — the ${stage.collection.members.length} ${stage.collection.label} currently on Stage: ${names}. By important, do you mean financial impact, risk, urgency, evidence strength, or overall investigation priority?`;
}

export function composeKnowledgeConsentOffer(label: string): string {
  return `I can also bring ${label} onto the Stage if you want.`;
}

export function shouldSkipScenarioEngineForStageGroundedComparison(input: {
  readonly relationship: StageRequestRelationship;
  readonly stage: AuthoritativeStageContext;
  readonly utterance: string;
}): boolean {
  if (input.relationship !== "STAGE_GROUNDED" && input.relationship !== "STAGE_META") return false;
  return Boolean(input.stage.collection) && isStageGroundedReference(input.utterance);
}

export function verifyNexoraNxa5Fix4(): { readonly ok: true } {
  if (NEXORA_NXA5_FIX4_BOUNDARY.createsStageStore) {
    throw new Error("NXA:5-FIX4 must not create a Stage store");
  }
  return Object.freeze({ ok: true as const });
}

export function stageContextAsSnapshot(stage: AuthoritativeStageContext): StageSemanticSnapshot | null {
  return stage.snapshot;
}

export function collectionKindMatchesStage(
  utterance: string,
  stage: AuthoritativeStageContext,
): boolean {
  const query = interpretExecutiveCollectionQuery(utterance);
  if (!query || !stage.collection) return false;
  return String(query.collectionKind).toLowerCase().startsWith(stage.collection.kind.replace(/s$/, ""));
}

export { classifyManagerSpeechAct };
