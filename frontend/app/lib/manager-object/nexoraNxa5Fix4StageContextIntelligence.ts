/**
 * NXA:5-FIX4 — Advisor↔Stage context intelligence (read model + relationship class).
 * Consumes DIR/runtime Stage state. Does not own Stage or duplicate collection truth.
 */

import type { NexoraMVPObjectInteractionCatalog, NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
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

export type AuthoritativeStageContext = Readonly<{
  available: boolean;
  presentationType: StagePresentationType;
  workspace: string;
  focus: AuthoritativeStageMember | null;
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
  snapshot: StageSemanticSnapshot | null;
}>;

function prepared(text: string): string {
  return text.trim().toLowerCase().replace(/[?.!]+$/g, "");
}

function resolveMember(
  id: string,
  catalog: NexoraMVPObjectInteractionCatalog,
): AuthoritativeStageMember {
  const item =
    catalog.objects.find((entry) => entry.id === id) ??
    catalog.contextSubjects.find((entry) => entry.id === id);
  return Object.freeze({
    id,
    label: item?.label ?? id,
    kind: item?.kind ?? "object",
  });
}

export function projectAuthoritativeStageContext(input: {
  readonly runtimeState: NexoraMVPObjectInteractionState | null | undefined;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly lastAuthorizedPresentation?: LastAuthorizedPresentation | null;
  readonly goalLabel?: string | null;
}): AuthoritativeStageContext {
  const state = input.runtimeState;
  if (!state) {
    return Object.freeze({
      available: false,
      presentationType: "UNKNOWN",
      workspace: "unknown",
      focus: null,
      collection: null,
      visibleMembers: Object.freeze([]),
      relationships: Object.freeze([]),
      goalContext: input.goalLabel ?? null,
      presentationReason: null,
      snapshot: null,
    });
  }
  const focus = state.focusedSubject ? resolveMember(state.focusedSubject.id, input.catalog) : null;
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
  const visible = Object.freeze([
    ...(focus ? [focus] : []),
    ...members.filter((member) => member.id !== focus?.id),
  ]);
  const presentationType: StagePresentationType = collection
    ? "COLLECTION"
    : focus
      ? "FOCUS"
      : state.workspace === "overview"
        ? "OVERVIEW"
        : "UNKNOWN";
  const snapshot: StageSemanticSnapshot = Object.freeze({
    workspace: state.workspace,
    mode: collection ? "collection" : focus ? "object-focus" : state.mode,
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
        : null;
  return Object.freeze({
    available: true,
    presentationType,
    workspace: state.workspace,
    focus,
    collection,
    visibleMembers: visible,
    relationships: Object.freeze([]),
    goalContext: input.goalLabel ?? null,
    presentationReason,
    snapshot,
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
  const text = prepared(utterance);
  if (/^(?:what|which|why|how|explain)\b/.test(text)) return false;
  if (/^(?:show|open|focus(?: on)?|bring up|go to|take me to|go back)\b/.test(text)) return true;
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
    return input.stage.presentationType === "COLLECTION" || input.stage.presentationType === "FOCUS"
      ? "STAGE_COMPATIBLE"
      : "STAGE_INDEPENDENT";
  }
  if (input.intentKind === "explain" || input.intentKind === "explain-scenario") {
    return input.stage.focus || input.stage.collection ? "STAGE_COMPATIBLE" : "STAGE_INDEPENDENT";
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
    return `The Stage is currently focused on ${stage.focus.label}, ${kind}.${why} Visibility does not by itself establish a causal conclusion.`;
  }
  return "The Stage does not currently show a focused object or collection.";
}

function humanizePresentationReason(reason: string | null): string | null {
  if (!reason) return null;
  if (/collection/i.test(reason) && /explicit|canonical|request/i.test(reason)) {
    return "you asked to review the current collection";
  }
  if (/focus/i.test(reason)) return "you focused this object";
  if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(reason.trim())) return null;
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
