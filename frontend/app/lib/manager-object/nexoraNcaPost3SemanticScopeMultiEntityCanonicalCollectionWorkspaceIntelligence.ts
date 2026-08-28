/**
 * NCA-POST:3 — Semantic scope, multi-entity, canonical collections, workspace.
 * Extends NCA:1–7 and NCA-POST:1–2. Not NCA:8.
 */

import type { NexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveExecutiveQueueEntryForCategory } from "../spatial-presentation/executiveStageQueueFoundation.ts";
import {
  interpretExecutiveCollectionQuery,
  observationShouldNotNavigate,
  preparedManagerUtterance,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";

export const nexoraNcaPost3Identity =
  "NCA-POST:3/SemanticScopeMultiEntityCanonicalCollectionNexoraWorkspaceIntelligence" as const;
export const nexoraNcaPost3Version = "1.0.0" as const;
export const nexoraNcaPost3Namespace =
  "nexora.nca.post.semantic-scope-multi-entity-canonical-collection-workspace" as const;

export const NEXORA_NCA_POST3_BOUNDARY = Object.freeze({
  identity: nexoraNcaPost3Identity,
  createsNca8: false as const,
  usesLiveLlm: false as const,
  duplicatesBusinessStore: false as const,
  usesPhraseTables: false as const,
});

export const NEXORA_SEMANTIC_SCOPES = Object.freeze([
  "BUSINESS",
  "NEXORA_PRODUCT",
  "CURRENT_WORKSPACE",
  "PRODUCT_ACTION",
  "HELP_TEACH",
  "MIXED",
  "UNKNOWN",
] as const);
export type NexoraSemanticScope = (typeof NEXORA_SEMANTIC_SCOPES)[number];

export const RELATIONSHIP_TRUTH_KINDS = Object.freeze([
  "DIRECT_RELATIONSHIP",
  "INDIRECT_RELATIONSHIP",
  "ASSOCIATED",
  "NO_REGISTERED_RELATIONSHIP",
  "CAUSALITY_UNKNOWN",
] as const);
export type RelationshipTruthKind = (typeof RELATIONSHIP_TRUTH_KINDS)[number];

export const PRIMARY_RESPONSE_OWNERS = Object.freeze([
  "RELATIONSHIP_EXPLANATION",
  "CONDITIONAL_EVALUATION",
  "MULTI_ENTITY_ASSERTION",
  "COLLECTION_QUERY",
  "COLLECTION_CHANGE_EXPLANATION",
  "PRODUCT_CAPABILITY",
  "PRODUCT_KNOWLEDGE",
  "WORKSPACE_STATE",
  "HELP_TEACH",
  "BUSINESS",
] as const);
export type PrimaryResponseOwner = (typeof PRIMARY_RESPONSE_OWNERS)[number];

export type ManagerReference = {
  readonly id: string;
  readonly name: string;
  readonly kind: string | null;
};

export type ManagerReferenceSet = {
  readonly primary: ManagerReference | null;
  readonly secondary: ManagerReference | null;
  readonly references: readonly ManagerReference[];
  readonly relationshipIntent: boolean;
};

export type CanonicalCollectionMember = {
  readonly id: string;
  readonly label: string;
};

export type ExecutiveCollectionDelta = {
  readonly collectionKind: string;
  readonly previousMembers: readonly CanonicalCollectionMember[];
  readonly currentMembers: readonly CanonicalCollectionMember[];
  readonly added: readonly CanonicalCollectionMember[];
  readonly removed: readonly CanonicalCollectionMember[];
  readonly retained: readonly CanonicalCollectionMember[];
  readonly explanationAvailability: "KNOWN" | "PARTIAL" | "UNKNOWN";
};

export type NcaPost3Diagnostics = {
  readonly semanticScope: NexoraSemanticScope;
  readonly speechAct: string;
  readonly need: string | null;
  readonly referenceSet: readonly string[];
  readonly primaryReference: string | null;
  readonly secondaryReference: string | null;
  readonly relationshipIntent: boolean;
  readonly collectionKind: string | null;
  readonly collectionScope: string | null;
  readonly collectionFilter: string | null;
  readonly canonicalCollectionAuthority: string | null;
  readonly collectionMembership: readonly string[];
  readonly previousCollectionMembership: readonly string[];
  readonly currentCollectionMembership: readonly string[];
  readonly changeIntent: boolean;
  readonly workspaceQuery: boolean;
  readonly capabilityQuery: boolean;
  readonly primaryResponseOwner: PrimaryResponseOwner;
  readonly suppressedAuthorities: readonly string[];
};

export function getNexoraNcaPost3Identity() {
  return Object.freeze({
    id: nexoraNcaPost3Identity,
    version: nexoraNcaPost3Version,
    namespace: nexoraNcaPost3Namespace,
  });
}

export function verifyNexoraNcaPost3(): { readonly ok: true } {
  if (getNexoraNcaPost3Identity().id !== nexoraNcaPost3Identity) {
    throw new Error("NCA-POST:3 identity mismatch");
  }
  if (NEXORA_NCA_POST3_BOUNDARY.createsNca8) {
    throw new Error("NCA-POST:3 must not create NCA:8");
  }
  return Object.freeze({ ok: true as const });
}

function prepared(text: string): string {
  return preparedManagerUtterance(text);
}

function productCue(text: string): boolean {
  return /\b(?:nexora|advisor|stage|queue|menu|workspace|object)\b/.test(text);
}

function helpCue(text: string): boolean {
  return /\b(?:how do i use|how should i (?:use|ask)|what can i do (?:here|with (?:these|the) objects)|help me use)\b/.test(text);
}

function workspaceCue(text: string): boolean {
  return /\b(?:on (?:the )?stage|on stage now|what(?:'s| is) on(?: (?:the )?stage| it)|visible objects|which object is (?:selected|focused)|what am i looking at|what is (?:in|at) the center|which (?:problems?|risks?|opportunities|scenarios?|decisions?|executions?|goals?) (?:are )?(?:shown|visible|on (?:the )?stage)|why are these here|why are (?:these|the) (?:objects?|problems?|risks?|opportunities|scenarios?|decisions?|executions?|goals?) here|what is in the queue|this scene|the scene|showing me|going on here|going on on stage|explain (?:the )?(?:stage|scene)|what are these|why (?:is|are) (?:this|these|they) here)\b/.test(
    text,
  );
}

function capabilityCue(text: string): boolean {
  return /\b(?:can you (?:add|create|remove|delete|import|change)|add (?:an? )?(?:object|risk|kpi)|create (?:an? )?(?:object|kpi|risk))\b/.test(
    text,
  );
}

function capabilityInquiry(text: string): boolean {
  return /^(?:can you|could you|are you able to|is it possible to)\b/.test(text);
}

function relationshipCue(text: string): boolean {
  return /\b(?:relation|relationship|related|connect(?:ed|ion)|between .+ and |and .+ relation|how (?:are|does) .+ relat|affect)\b/.test(
    text,
  );
}

function changeCue(text: string): boolean {
  return /\b(?:disappear(?:ed)?|removed?|no longer|which .+ disappeared|why isn'?t|why did .+ (?:remove|go|leave)|no longer (?:a |shown)|was added)\b/.test(
    text,
  );
}

function classificationCue(text: string): boolean {
  return /\b(?:are|is)\s+(?:both\s+)?(?:a |the )?(?:problems?|risks?|opportunit(?:y|ies)|goals?|scenarios?|decisions?)\b/.test(
    text,
  );
}

function multiEntityCue(text: string): boolean {
  return /\b(?:and|&)\b/.test(text);
}

function conditionalEvaluationCue(text: string): boolean {
  return (
    /^(?:if|what if|suppose)\b/.test(text) &&
    /\b(?:ok|okay|alright|acceptable|still okay|should we)\b/.test(text)
  );
}

export function classifyNexoraSemanticScope(utterance: string): NexoraSemanticScope {
  const text = prepared(utterance);
  if (!text) return "UNKNOWN";
  // Explicit navigation remains a business/object operation even when the
  // manager uses interface filler such as “object”.
  if (/^(?:show|open|focus)\b/.test(text)) return "BUSINESS";
  const product = productCue(text) && /\b(?:what is|explain|tell me about)\b/.test(text) && !workspaceCue(text);
  const workspace = workspaceCue(text);
  const help = helpCue(text);
  const action = capabilityCue(text);
  if (/\bexplain (?:the )?stage\b/.test(text) && workspace) return "MIXED";
  if ([product, workspace, help, action].filter(Boolean).length > 1) return "MIXED";
  if (help) return "HELP_TEACH";
  if (action) return "PRODUCT_ACTION";
  if (workspace) return "CURRENT_WORKSPACE";
  if (product) return "NEXORA_PRODUCT";
  if (productCue(text) && !/\b(?:late|demand|margin|capacity gap)\b/.test(text)) {
    return "NEXORA_PRODUCT";
  }
  return "BUSINESS";
}

export function nca3EligibleForSemanticScope(scope: NexoraSemanticScope): boolean {
  return scope === "BUSINESS";
}

export function collectionUsesConversationSubjectFilter(utterance: string): boolean {
  const query = interpretExecutiveCollectionQuery(utterance);
  if (!query) return false;
  if (query["subjectContext"]) return true;
  if (query.scope === "ALL") return false;
  return /\b(?:related to|about|its|these)\b/.test(prepared(utterance));
}

function tokenKeys(name: string): readonly string[] {
  const key = prepared(name);
  const keys = new Set<string>([key]);
  if (key.endsWith("y") && key.length > 3) keys.add(`${key.slice(0, -1)}ies`);
  if (!key.endsWith("s")) keys.add(`${key}s`);
  if (key.endsWith("s") && key.length > 3) keys.add(key.slice(0, -1));
  return Object.freeze([...keys].filter((item) => item.length > 1));
}

export function extractManagerReferenceSet(
  utterance: string,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): ManagerReferenceSet {
  const text = ` ${prepared(utterance)} `;
  const found: ManagerReference[] = [];
  const seen = new Set<string>();
  const candidates = [
    ...catalog.objects.map((item) => ({ id: item.id, name: item.label, kind: "object" })),
    ...catalog.contextSubjects.map((item) => ({ id: item.id, name: item.label, kind: item.kind })),
  ].sort((left, right) => right.name.length - left.name.length);
  for (const candidate of candidates) {
    if (seen.has(candidate.id)) continue;
    const tokens = new Set(text.split(/\s+/).filter(Boolean));
    const hit = tokenKeys(candidate.name).some((key) => {
      if (key.includes(" ")) return text.includes(` ${key} `);
      return tokens.has(key);
    });
    if (!hit) continue;
    seen.add(candidate.id);
    found.push(Object.freeze({ id: candidate.id, name: candidate.name, kind: candidate.kind }));
  }
  const nested = found.filter(
    (item) =>
      !found.some(
        (other) =>
          other.id !== item.id &&
          other.name.toLowerCase().includes(item.name.toLowerCase()) &&
          other.name.length > item.name.length,
      ),
  );
  return Object.freeze({
    primary: nested[0] ?? null,
    secondary: nested[1] ?? null,
    references: Object.freeze(nested),
    relationshipIntent: relationshipCue(prepared(utterance)) && nested.length >= 2,
  });
}

function connected(
  left: string,
  right: string,
  catalog: NexoraMVPObjectInteractionCatalog,
): { readonly kind: "direct" | "associated" | "none"; readonly via: string | null } {
  for (const edge of catalog.relationships) {
    if (
      (edge.sourceId === left && edge.targetId === right) ||
      (edge.sourceId === right && edge.targetId === left)
    ) {
      return { kind: "direct", via: null };
    }
  }
  for (const link of catalog.contextLinks) {
    if (
      (link.objectId === left && link.contextId === right) ||
      (link.objectId === right && link.contextId === left)
    ) {
      return { kind: "associated", via: null };
    }
  }
  const neighbors = (id: string): readonly string[] => {
    const next: string[] = [];
    for (const edge of catalog.relationships) {
      if (edge.sourceId === id) next.push(edge.targetId);
      if (edge.targetId === id) next.push(edge.sourceId);
    }
    for (const link of catalog.contextLinks) {
      if (link.objectId === id) next.push(link.contextId);
      if (link.contextId === id) next.push(link.objectId);
    }
    return next;
  };
  for (const hop of neighbors(left)) {
    if (hop === right) continue;
    if (neighbors(hop).includes(right)) {
      const via =
        catalog.objects.find((item) => item.id === hop)?.label ??
        catalog.contextSubjects.find((item) => item.id === hop)?.label ??
        hop;
      return { kind: "none", via };
    }
  }
  return { kind: "none", via: null };
}

export function interpretRelationshipQuery(input: {
  readonly utterance: string;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): {
  readonly intent: boolean;
  readonly left: ManagerReference | null;
  readonly right: ManagerReference | null;
  readonly truth: RelationshipTruthKind;
  readonly via: string | null;
} {
  const catalog = input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const refs = extractManagerReferenceSet(input.utterance, catalog);
  if (!refs.relationshipIntent || !refs.primary || !refs.secondary) {
    return Object.freeze({
      intent: false,
      left: refs.primary,
      right: refs.secondary,
      truth: "NO_REGISTERED_RELATIONSHIP" as const,
      via: null,
    });
  }
  const link = connected(refs.primary.id, refs.secondary.id, catalog);
  const truth: RelationshipTruthKind =
    link.kind === "direct"
      ? "DIRECT_RELATIONSHIP"
      : link.kind === "associated"
        ? "ASSOCIATED"
        : link.via
          ? "INDIRECT_RELATIONSHIP"
          : "NO_REGISTERED_RELATIONSHIP";
  return Object.freeze({
    intent: true,
    left: refs.primary,
    right: refs.secondary,
    truth,
    via: link.via,
  });
}

export function composeRelationshipReply(query: {
  readonly left: ManagerReference | null;
  readonly right: ManagerReference | null;
  readonly truth: RelationshipTruthKind;
  readonly via: string | null;
}): string {
  const a = query.left?.name ?? "the first subject";
  const b = query.right?.name ?? "the second subject";
  if (query.truth === "DIRECT_RELATIONSHIP") {
    return `${a} and ${b} have a registered relationship. That connection is recorded, but it does not by itself establish a causal direction.`;
  }
  if (query.truth === "ASSOCIATED") {
    return `${a} is associated with ${b} in the current model. Association is not a confirmed causal direction.`;
  }
  if (query.truth === "INDIRECT_RELATIONSHIP") {
    return `${a} and ${b} are not directly related. There is an indirect path through ${query.via ?? "another object"}, which is not evidence of cause.`;
  }
  return `${a} and ${b} do not have a registered direct relationship in the current model. I will not invent one.`;
}

export function interpretMultiEntityAssertion(utterance: string): boolean {
  const text = prepared(utterance);
  if (
    /\?$/.test(utterance.trim()) ||
    /^(?:show|open|explain|what|why|how|can you|no[, ]|yes[, ]|should we)\b/.test(text)
  ) {
    return false;
  }
  if (!multiEntityCue(text)) return false;
  if (classificationCue(text) && extractManagerReferenceSet(utterance).references.length >= 2) {
    return true;
  }
  if (/\bthese two\b/.test(text)) return true;
  if (extractManagerReferenceSet(utterance).references.length < 2) return false;
  return (
    observationShouldNotNavigate(utterance) ||
    /\b(?:are|is|look|getting)\b/.test(text)
  );
}

export function composeMultiEntityAssertionReply(input: {
  readonly utterance: string;
  readonly references: readonly ManagerReference[];
  readonly canonicalProblemIds: readonly string[];
}): string {
  const names = input.references.map((item) => item.name);
  const listed = names.length > 0 ? names.join(" and ") : "those subjects";
  if (classificationCue(prepared(input.utterance))) {
    const classified = input.references.filter((item) =>
      input.canonicalProblemIds.includes(item.id),
    );
    const notClassified = input.references.filter(
      (item) => !input.canonicalProblemIds.includes(item.id),
    );
    if (classified.length === input.references.length && classified.length > 0) {
      return `Understood — you're treating ${listed} as Problems, which matches the current canonical Problems collection. I am not changing that classification from this conversation.`;
    }
    return `Understood — you're describing ${listed} as Problems. Canonical Problems currently ${
      classified.length > 0
        ? `include ${classified.map((item) => item.name).join(" and ")}, but not ${notClassified.map((item) => item.name).join(" and ")}`
        : "do not list them that way"
    }. I'll keep your statement as manager classification, not a silent rewrite of canonical membership.`;
  }
  return `Understood. I'll treat that as your current observation about ${listed}, not as a navigation or recommendation request.`;
}

export function hydrateCanonicalCollectionMembers(
  items: readonly string[],
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): readonly CanonicalCollectionMember[] {
  return Object.freeze(
    items.map((raw) => {
      const hit =
        catalog.contextSubjects.find(
          (item) => item.id === raw || prepared(item.label) === prepared(raw),
        ) ??
        catalog.objects.find(
          (item) => item.id === raw || prepared(item.label) === prepared(raw),
        );
      return Object.freeze({ id: hit?.id ?? raw, label: hit?.label ?? raw });
    }),
  );
}

export function resolveCanonicalCollectionMembership(
  kind: "problem" | "scenario" | "decision" | "execution" | "risk" | "opportunity" | "goal",
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): readonly CanonicalCollectionMember[] {
  if (kind === "problem" || kind === "scenario" || kind === "decision" || kind === "execution") {
    const entry = resolveExecutiveQueueEntryForCategory({
      subjects: catalog.contextSubjects.map((subject) =>
        Object.freeze({
          subjectId: subject.id,
          workKind: subject.kind,
          objectKind: subject.kind,
          attention: subject.attention,
          status: subject.status,
        }),
      ),
      category: kind,
    });
    return Object.freeze(
      entry.objectIds.map((id) => {
        const subject = catalog.contextSubjects.find((item) => item.id === id);
        return Object.freeze({ id, label: subject?.label ?? id });
      }),
    );
  }
  const needle = kind === "opportunity" ? /opportunit/i : new RegExp(kind, "i");
  return Object.freeze(
    catalog.objects
      .filter((item) => needle.test(item.label) || needle.test(item.id))
      .map((item) => Object.freeze({ id: item.id, label: item.label })),
  );
}

export function composeCanonicalCollectionReply(input: {
  readonly kindLabel: string;
  readonly members: readonly CanonicalCollectionMember[];
  readonly filteredTo?: string | null;
}): string {
  if (input.members.length === 0) {
    return input.filteredTo
      ? `I don't see any ${input.kindLabel} related to ${input.filteredTo} in the current context.`
      : `I don't see any ${input.kindLabel} in the current context.`;
  }
  const names = input.members.map((item) => item.label).join(", ");
  if (input.filteredTo) return `${input.kindLabel} related to ${input.filteredTo}: ${names}.`;
  return `Current ${input.kindLabel}: ${names}.`;
}

export function interpretCollectionChangeQuery(utterance: string): boolean {
  return changeCue(prepared(utterance));
}

function memberKeys(item: CanonicalCollectionMember): readonly string[] {
  return Object.freeze(
    [...new Set([prepared(item.id), prepared(item.label)].filter(Boolean))],
  );
}

function sameCollectionMember(
  left: CanonicalCollectionMember,
  right: CanonicalCollectionMember,
): boolean {
  const rightKeys = new Set(memberKeys(right));
  return memberKeys(left).some((key) => rightKeys.has(key));
}

export function computeCollectionDelta(
  previous: readonly CanonicalCollectionMember[],
  current: readonly CanonicalCollectionMember[],
  collectionKind: string,
  reasonKnown: boolean,
): ExecutiveCollectionDelta {
  return Object.freeze({
    collectionKind,
    previousMembers: Object.freeze([...previous]),
    currentMembers: Object.freeze([...current]),
    added: Object.freeze(
      current.filter((item) => !previous.some((prior) => sameCollectionMember(prior, item))),
    ),
    removed: Object.freeze(
      previous.filter((item) => !current.some((next) => sameCollectionMember(item, next))),
    ),
    retained: Object.freeze(
      current.filter((item) => previous.some((prior) => sameCollectionMember(prior, item))),
    ),
    explanationAvailability: reasonKnown ? ("KNOWN" as const) : ("UNKNOWN" as const),
  });
}

export function composeCollectionChangeReply(input: {
  readonly utterance: string;
  readonly delta: ExecutiveCollectionDelta;
  readonly presentationOnly?: boolean;
  readonly named?: string | null;
}): string {
  const named =
    input.named ?? input.delta.removed[0]?.label ?? input.delta.added[0]?.label ?? "that item";
  if (
    named &&
    input.delta.currentMembers.some((item) => item.label.toLowerCase() === named.toLowerCase())
  ) {
    return `${named} is still in the current ${input.delta.collectionKind} collection. If it disappeared from the view, that is a presentation or filter change, not evidence that it ceased to be a ${input.delta.collectionKind}.`;
  }
  if (input.presentationOnly) {
    return `${named} is no longer shown in the current view. That is a presentation or filter change, not evidence that it ceased to be a ${input.delta.collectionKind}.`;
  }
  if (input.delta.previousMembers.length === 0) {
    return `I can see the current ${input.delta.collectionKind} membership, but I don't have a previous snapshot that would let me verify that ${named} was removed.`;
  }
  if (input.delta.removed.length === 0 && input.delta.added.length === 0) {
    return `The current ${input.delta.collectionKind} membership has not changed from the last collection result.`;
  }
  const removed = input.delta.removed.map((item) => item.label).join(", ");
  const added = input.delta.added.map((item) => item.label).join(", ");
  const observed = [
    removed ? `${removed} left the previous result` : null,
    added ? `${added} appeared` : null,
  ]
    .filter(Boolean)
    .join(", and ");
  if (input.delta.explanationAvailability === "UNKNOWN") {
    return `I can see that ${observed}. I don't have evidence showing why that classification or membership changed.`;
  }
  return `The ${input.delta.collectionKind} membership changed: ${observed}.`;
}

export function interpretProductCapabilityQuery(utterance: string): {
  readonly capability: boolean;
  readonly action: boolean;
} {
  const text = prepared(utterance);
  return Object.freeze({
    capability: capabilityCue(text) && capabilityInquiry(text),
    action: capabilityCue(text) && !capabilityInquiry(text),
  });
}

export function composeProductCapabilityReply(query: {
  readonly capability: boolean;
  readonly action: boolean;
}): string {
  if (query.capability) {
    return "I can help define what an object should represent, but I can't add a new production object from this conversation yet.";
  }
  if (query.action) {
    return "I can't create, delete, or import a production object from this conversation, so I won't pretend that change happened.";
  }
  return "I don't have a registered product capability for that action.";
}

export function composeProductKnowledgeReply(utterance: string): string {
  const text = prepared(utterance);
  if (/\bstage\b/.test(text)) {
    return "The Stage is Nexora's visual workspace for the executive objects relevant to the work you're reviewing.";
  }
  if (/\badvisor\b/.test(text)) {
    return "Advisor is the conversation surface where you can inspect, compare, and reason about the same executive objects shown in the workspace.";
  }
  if (/\bnexora\b/.test(text)) {
    return "Nexora is the executive decision workspace: it keeps business objects, collections, and conversation on one shared truth.";
  }
  if (/\bobject\b/.test(text)) {
    return "An object here is an executive entity on the Stage — a Goal, KPI, Problem, Risk, Scenario, Decision, or similar business item — not a generic software record.";
  }
  return "That's a Nexora product question. I can explain the Stage, Advisor, menus, and objects without treating them as a missing business outcome.";
}

export function composeWorkspaceReply(input: {
  readonly labels: readonly string[];
  readonly focused?: string | null;
  readonly snapshot?: StageSemanticSnapshot | null;
  readonly utterance?: string;
}): string {
  const snapshot = input.snapshot ?? null;
  const text = prepared(input.utterance ?? "");
  if (snapshot) {
    if (/\b(?:center|current focus|focused)\b/.test(text)) {
      return snapshot.focused
        ? `${snapshot.focused.label} is the current focus on the Stage.`
        : "The Stage does not currently have a single focused object.";
    }
    if (/\bwhich\s+(?:problems?|risks?|opportunit(?:y|ies)|scenarios?|decisions?|executions?|goals?)\b/.test(text)) {
      const requested = text.match(/\bwhich\s+(problems?|risks?|opportunit(?:y|ies)|scenarios?|decisions?|executions?|goals?)\b/)?.[1] ?? "objects";
      const singular = requested.replace(/ies$/, "y").replace(/s$/, "");
      const members = snapshot.visibleObjects.filter((item) => item.kind.toLowerCase().includes(singular));
      return members.length
        ? `The ${requested} currently shown are ${members.map((item) => item.label).join(" and ")}.`
        : `No ${requested} are currently shown on the Stage.`;
    }
    if (/\bwhy\b/.test(text) && /\b(?:these|objects?|here|shown)\b/.test(text)) {
      if (snapshot.collection) {
        const focus = snapshot.focused ? ` in the current ${snapshot.focused.label} view` : "";
        return `They are being presented as the current ${snapshot.collection.label} collection${focus}. Their visibility does not by itself establish a causal relationship.`;
      }
      return "They are part of the current Stage presentation. Visibility alone does not establish a causal relationship.";
    }
    if (snapshot.focused && snapshot.collection?.members.length) {
      return `You’re focused on ${snapshot.focused.label}. The Stage is showing the ${snapshot.collection.label} in this view: ${snapshot.collection.members.map((item) => item.label).join(" and ")}.`;
    }
    if (snapshot.collection?.members.length) {
      return `The Stage is showing the ${snapshot.collection.label}: ${snapshot.collection.members.map((item) => item.label).join(" and ")}.`;
    }
    if (snapshot.focused) return `You’re focused on ${snapshot.focused.label}.`;
  }
  if (input.labels.length === 0) {
    return "The Stage does not currently show any executive objects.";
  }
  const focus = input.focused ? ` ${input.focused} is focused.` : "";
  return `Right now the Stage contains ${input.labels.join(", ")}.${focus}`;
}

export type StageSemanticSnapshot = Readonly<{
  workspace: string;
  mode: string;
  focused: Readonly<{ id: string; label: string; kind: string }> | null;
  collection: Readonly<{ kind: string; label: string; members: readonly Readonly<{ id: string; label: string; kind: string }>[] }> | null;
  visibleObjects: readonly Readonly<{ id: string; label: string; kind: string }>[];
}>;

export function composeConditionalEvaluationReply(input: {
  readonly subject: string | null;
}): string {
  const subject = input.subject ?? "that area";
  return `That would work against the current ${subject} objective. I can support the direction of the risk, but I should not quantify the impact from this turn alone.`;
}

export function composeHelpTeachReply(): string {
  return "You can ask what matters, inspect an object, review Problems or Risks, compare scenarios, or tell me what you observe. The Stage shows the same objects the menus and Advisor use.";
}

export function nca4EligibleForPrimaryOwner(owner: PrimaryResponseOwner): boolean {
  return owner === "BUSINESS";
}

export function resolvePrimaryResponseOwner(input: {
  readonly scope: NexoraSemanticScope;
  readonly utterance: string;
  readonly relationshipIntent: boolean;
  readonly collectionQuery: boolean;
  readonly changeIntent: boolean;
  readonly capability: boolean;
  readonly action: boolean;
  readonly multiEntityAssertion: boolean;
}): PrimaryResponseOwner {
  if (input.changeIntent) return "COLLECTION_CHANGE_EXPLANATION";
  if (input.relationshipIntent) return "RELATIONSHIP_EXPLANATION";
  if (input.multiEntityAssertion) return "MULTI_ENTITY_ASSERTION";
  if (input.collectionQuery) return "COLLECTION_QUERY";
  if (input.scope === "HELP_TEACH") return "HELP_TEACH";
  if (input.capability || input.action) return "PRODUCT_CAPABILITY";
  if (input.scope === "CURRENT_WORKSPACE") return "WORKSPACE_STATE";
  if (input.scope === "NEXORA_PRODUCT" || input.scope === "MIXED") {
    return workspaceCue(prepared(input.utterance)) ? "WORKSPACE_STATE" : "PRODUCT_KNOWLEDGE";
  }
  if (conditionalEvaluationCue(prepared(input.utterance))) return "CONDITIONAL_EVALUATION";
  return "BUSINESS";
}

export function composeNexoraSemanticTurn(input: {
  readonly utterance: string;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly previousCollection?: readonly CanonicalCollectionMember[] | null;
  readonly stageLabels?: readonly string[];
  readonly focusedLabel?: string | null;
  readonly stageSnapshot?: StageSemanticSnapshot | null;
  readonly presentationOnlyChange?: boolean;
}): {
  readonly scope: NexoraSemanticScope;
  readonly owner: PrimaryResponseOwner;
  readonly references: ManagerReferenceSet;
  readonly reply: string | null;
  readonly diagnostics: NcaPost3Diagnostics;
  readonly suppressNca3: boolean;
  readonly suppressNca4: boolean;
  readonly suppressNavigation: boolean;
  /** Exact authoritative result shared by Advisor and Director. */
  readonly canonicalCollectionMembers: readonly CanonicalCollectionMember[];
} {
  const catalog = input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const scope = classifyNexoraSemanticScope(input.utterance);
  const references = extractManagerReferenceSet(input.utterance, catalog);
  const relationship = interpretRelationshipQuery({ utterance: input.utterance, catalog });
  const collectionQuery = interpretExecutiveCollectionQuery(input.utterance);
  const capability = interpretProductCapabilityQuery(input.utterance);
  const multiEntity = interpretMultiEntityAssertion(input.utterance);
  const changeIntent = interpretCollectionChangeQuery(input.utterance);
  const owner = resolvePrimaryResponseOwner({
    scope,
    utterance: input.utterance,
    relationshipIntent: relationship.intent,
    collectionQuery: Boolean(collectionQuery && !collectionQuery["ambiguousIssueNoun"]),
    changeIntent,
    capability: capability.capability,
    action: capability.action,
    multiEntityAssertion: multiEntity,
  });
  const problems = resolveCanonicalCollectionMembership("problem", catalog);
  let canonicalCollectionMembers: readonly CanonicalCollectionMember[] = Object.freeze([]);
  let reply: string | null = null;
  if (owner === "RELATIONSHIP_EXPLANATION") {
    reply = composeRelationshipReply(relationship);
  } else if (owner === "MULTI_ENTITY_ASSERTION") {
    reply = composeMultiEntityAssertionReply({
      utterance: input.utterance,
      references: references.references,
      canonicalProblemIds: problems.map((item) => item.id),
    });
  } else if (owner === "COLLECTION_QUERY" && collectionQuery) {
    const rawKind = String(collectionQuery["collectionKind"] ?? "PROBLEM");
    const kind =
      rawKind === "SCENARIO"
        ? "scenario"
        : rawKind === "DECISION"
          ? "decision"
          : rawKind === "EXECUTION"
            ? "execution"
            : rawKind === "RISK"
              ? "risk"
              : rawKind === "OPPORTUNITY"
                ? "opportunity"
                : rawKind === "GOAL"
                  ? "goal"
                  : "problem";
    const members = resolveCanonicalCollectionMembership(kind, catalog);
    const filtered = collectionUsesConversationSubjectFilter(input.utterance)
      ? String(collectionQuery["subjectContext"] ?? "")
      : "";
    const visible = filtered
      ? members.filter((item) => prepared(`${item.label} ${item.id}`).includes(prepared(filtered)))
      : members;
    canonicalCollectionMembers = Object.freeze([...visible]);
    const kindLabel =
      kind === "problem"
        ? "Problems"
        : kind === "scenario"
          ? "Scenarios"
          : kind === "decision"
            ? "Decisions"
            : kind === "execution"
              ? "Executions"
              : kind === "risk"
                ? "Risks"
                : kind === "opportunity"
                  ? "Opportunities"
                  : "Goals";
    reply = composeCanonicalCollectionReply({
      kindLabel,
      members: visible,
      filteredTo: filtered || null,
    });
  } else if (owner === "COLLECTION_CHANGE_EXPLANATION") {
    const current = resolveCanonicalCollectionMembership("problem", catalog);
    const delta = computeCollectionDelta(input.previousCollection ?? [], current, "Problem", false);
    reply = composeCollectionChangeReply({
      utterance: input.utterance,
      delta,
      presentationOnly: input.presentationOnlyChange === true,
      named: references.primary?.name ?? null,
    });
  } else if (owner === "PRODUCT_CAPABILITY") {
    reply = composeProductCapabilityReply(capability);
  } else if (owner === "PRODUCT_KNOWLEDGE") {
    const extra = workspaceCue(prepared(input.utterance))
      ? ` ${composeWorkspaceReply({
          labels: input.stageLabels ?? [],
          focused: input.focusedLabel ?? null,
          snapshot: input.stageSnapshot,
          utterance: input.utterance,
        })}`
      : "";
    reply = `${composeProductKnowledgeReply(input.utterance)}${extra}`.trim();
  } else if (owner === "HELP_TEACH") {
    reply = null;
  } else if (owner === "WORKSPACE_STATE") {
    const knowledge = /\bexplain\b/.test(prepared(input.utterance))
      ? `${composeProductKnowledgeReply(input.utterance)} `
      : "";
    reply = `${knowledge}${composeWorkspaceReply({
      labels: input.stageLabels ?? [],
      focused: input.focusedLabel ?? null,
      snapshot: input.stageSnapshot,
      utterance: input.utterance,
    })}`.trim();
  } else if (owner === "CONDITIONAL_EVALUATION") {
    reply = composeConditionalEvaluationReply({ subject: references.primary?.name ?? null });
  }
  const suppressNca3 = owner !== "BUSINESS" || !nca3EligibleForSemanticScope(scope);
  const suppressNca4 = !nca4EligibleForPrimaryOwner(owner);
  const diagnostics: NcaPost3Diagnostics = Object.freeze({
    semanticScope: scope,
    speechAct: owner,
    need: owner,
    referenceSet: Object.freeze(references.references.map((item) => item.name)),
    primaryReference: references.primary?.name ?? null,
    secondaryReference: references.secondary?.name ?? null,
    relationshipIntent: relationship.intent,
    collectionKind: collectionQuery ? String(collectionQuery["collectionKind"] ?? "") : null,
    collectionScope: collectionQuery?.scope ?? null,
    collectionFilter: collectionQuery ? String(collectionQuery["subjectContext"] ?? "") || null : null,
    canonicalCollectionAuthority: "executive-queue-category",
    collectionMembership: Object.freeze(canonicalCollectionMembers.map((item) => item.label)),
    previousCollectionMembership: Object.freeze(
      (input.previousCollection ?? []).map((item) => item.label),
    ),
    currentCollectionMembership: Object.freeze(canonicalCollectionMembers.map((item) => item.label)),
    changeIntent,
    workspaceQuery: owner === "WORKSPACE_STATE",
    capabilityQuery: owner === "PRODUCT_CAPABILITY",
    primaryResponseOwner: owner,
    suppressedAuthorities: Object.freeze(
      [
        suppressNca3 ? "NCA:3" : null,
        suppressNca4 ? "NCA:4" : null,
        owner !== "BUSINESS" ? "NCA:5" : null,
      ].filter((item): item is string => item != null),
    ),
  });
  return Object.freeze({
    scope,
    owner,
    references,
    reply,
    diagnostics,
    suppressNca3,
    suppressNca4,
    suppressNavigation: owner === "MULTI_ENTITY_ASSERTION" || owner === "COLLECTION_QUERY",
    canonicalCollectionMembers,
  });
}
