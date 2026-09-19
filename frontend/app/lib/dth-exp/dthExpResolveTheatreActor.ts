/**
 * NPA-T DTH-EXP:2 — Canonical Object → Theatre Actor resolver.
 * Read-only. Identity is the canonical Object ID, never the display label.
 */

import { VAI_CONTEXTUAL_ROLES, type VaiContextualRole } from "@/app/lib/vai/vaiContract.ts";
import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { dthExpObjectStageRoleIdentity } from "./dthExpObjectStageRoleIdentity.ts";
import {
  isDthExpSceneAttention,
  type DthExpCanonicalObjectRef,
  type DthExpResolveTheatreActorInput,
  type DthExpSceneAttention,
  type DthExpTheatreActorResolution,
} from "./dthExpObjectStageRoleContract.ts";
import {
  DTH_EXP_DEFAULT_ACTOR_PRESENTATION,
  type DthExpActorPresentation,
  type DthExpTheatreActor,
} from "./dthExpTheatreContract.ts";
import { isDthExpVisualRole, type DthExpVisualRole } from "./dthExpVisualRole.ts";

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function isVaiRole(value: string | null | undefined): value is VaiContextualRole {
  return value != null && (VAI_CONTEXTUAL_ROLES as readonly string[]).includes(value);
}

function resolvePresentation(
  overlay: Partial<DthExpActorPresentation> | undefined,
  grouping: string | null,
): DthExpActorPresentation {
  return Object.freeze({
    position: overlay?.position ?? DTH_EXP_DEFAULT_ACTOR_PRESENTATION.position,
    size: overlay?.size ?? DTH_EXP_DEFAULT_ACTOR_PRESENTATION.size,
    emphasis: overlay?.emphasis ?? DTH_EXP_DEFAULT_ACTOR_PRESENTATION.emphasis,
    visibility: overlay?.visibility ?? DTH_EXP_DEFAULT_ACTOR_PRESENTATION.visibility,
    grouping: overlay?.grouping ?? grouping,
    relationshipPresentation:
      overlay?.relationshipPresentation ?? DTH_EXP_DEFAULT_ACTOR_PRESENTATION.relationshipPresentation,
  });
}

function failedResolution(limitations: readonly string[]): DthExpTheatreActorResolution {
  return freezeTree({
    identity: dthExpObjectStageRoleIdentity,
    status: "failed",
    actor: null,
    limitations: Object.freeze(limitations.slice()),
    writes: Object.freeze({
      canonicalObjects: false,
      objectVisualTypeField: false,
      evidence: false,
      vaiRoles: false,
      kpiTruth: false,
      decisionState: false,
      executionState: false,
      outcomeState: false,
    }),
  });
}

export function canonicalRefFromTheatreObject(object: {
  readonly id: string;
  readonly kind: string;
  readonly canonicalObjectType: string;
  readonly label: string;
  readonly authoritativeSource: string;
  readonly evidenceRef: string | null;
}): DthExpCanonicalObjectRef {
  return Object.freeze({
    id: object.id,
    kind: object.kind,
    canonicalObjectType: object.canonicalObjectType,
    label: object.label,
    authority: object.authoritativeSource,
    evidenceRef: object.evidenceRef,
  });
}

export function resolveDthExpTheatreActor(input: DthExpResolveTheatreActorInput): DthExpTheatreActorResolution {
  const object = input.object ?? null;
  const canonicalId = object?.id?.trim() ?? "";
  if (object == null || canonicalId.length === 0) {
    return failedResolution(["missing-canonical-object"]);
  }

  const limitations: string[] = [];
  const requestedRole = input.visualRole ?? null;
  let visualRole: DthExpVisualRole | null = null;
  if (requestedRole != null && requestedRole.length > 0) {
    if (isDthExpVisualRole(requestedRole)) {
      visualRole = requestedRole;
    } else {
      limitations.push(`unknown-visual-role:${canonicalId}:${requestedRole}`);
    }
  }

  const requestedVai = input.vaiRole ?? null;
  let vaiRoleRef: VaiContextualRole | null = null;
  if (requestedVai != null && requestedVai.length > 0) {
    if (isVaiRole(requestedVai)) {
      vaiRoleRef = requestedVai;
    } else {
      limitations.push(`unknown-vai-role:${canonicalId}:${requestedVai}`);
    }
  }

  const requestedAttention = input.attention ?? null;
  let attention: DthExpSceneAttention = "contextual";
  if (requestedAttention != null && requestedAttention.length > 0) {
    if (isDthExpSceneAttention(requestedAttention)) {
      attention = requestedAttention;
    } else {
      limitations.push(`unknown-attention:${canonicalId}:${requestedAttention}`);
    }
  }

  const kind = (object.canonicalObjectType ?? object.kind ?? "object").trim() || "object";
  const canonicalObjectKind = resolveCanonicalExecutiveObjectType({
    id: canonicalId,
    kind,
    label: object.label ?? "",
  });
  const objectAuthority = object.authority?.trim() || "NEX-MVP:4/catalog";
  const sceneIdentity = input.sceneIdentity.trim() || "dth-exp:scene:unspecified";
  const presentation = resolvePresentation(input.presentation, input.grouping ?? null);
  const evidenceRefs = Object.freeze(
    [
      ...(object.evidenceRef ? [object.evidenceRef] : []),
      ...(input.evidenceRefs ?? []),
    ].filter((item, index, all) => all.indexOf(item) === index),
  );

  const actor: DthExpTheatreActor = freezeTree({
    actorId: `theatre-actor:${canonicalId}`,
    canonicalObjectId: canonicalId,
    canonicalObjectKind,
    objectAuthority,
    sceneIdentity,
    displayLabel: object.label ?? null,
    labelIsIdentityAuthority: false as const,
    visualRole,
    visualRoleIsPermanent: false as const,
    visualRoleMutatesVaiRole: false as const,
    isTheatreActorNotBusinessObject: true as const,
    sceneActorRole: input.sceneActorRole ?? null,
    attention,
    presentation,
    evidenceRefs,
    vaiRoleRef,
    referent: Object.freeze({
      canonicalObjectId: canonicalId,
      canonicalObjectKind,
      objectAuthority,
      sceneIdentity,
      visualRole,
      suitableForLaterAdvisorReference: true as const,
    }),
    isCanonicalObjectDuplicate: false as const,
    presentationMutatesCanonicalObject: false as const,
  });

  return freezeTree({
    identity: dthExpObjectStageRoleIdentity,
    status: limitations.length > 0 ? "partial" : "ok",
    actor,
    limitations: Object.freeze(limitations),
    writes: Object.freeze({
      canonicalObjects: false,
      objectVisualTypeField: false,
      evidence: false,
      vaiRoles: false,
      kpiTruth: false,
      decisionState: false,
      executionState: false,
      outcomeState: false,
    }),
  });
}
