/**
 * DTH:3 — Deterministic proof fixtures for NexoGraph Visual Grammar.
 */

import type { NexoraDecisionTheatreExecutiveObject } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "./nexoraDecisionTheatreIconicProjection.ts";
import type { NexoraDecisionTheatreRelationship } from "./nexoraDecisionTheatreContract.ts";
import { NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST } from "./nexoraDecisionTheatreIconicFixtures.ts";
import { projectNexoraDecisionTheatreIconicObjects } from "./nexoraDecisionTheatreIconicProjection.ts";
import { deriveNexoraDecisionTheatreIconicPresentationId } from "./nexoraDecisionTheatreVisualFamily.ts";

export const nexoraDecisionTheatreVisualGrammarFixturesIdentity =
  "DTH:3/VisualGrammarProofFixtures" as const;

export function dth3Executive(input: {
  readonly id: string;
  readonly type: NexoraDecisionTheatreExecutiveObject["canonicalObjectType"];
  readonly status?: string | null;
  readonly attention?: string;
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly visibility?: NexoraDecisionTheatreExecutiveObject["visibility"];
  readonly label?: string;
}): NexoraDecisionTheatreExecutiveObject {
  return Object.freeze({
    visualFamily: "EXECUTIVE_OBJECT",
    id: input.id,
    label: input.label ?? input.id,
    kind: input.type,
    canonicalObjectType: input.type,
    authoritativeSource: "NEX-MVP:4/catalog",
    lifecycleStatus: input.status ?? null,
    visibility: input.visibility ?? "visible-primary",
    focused: input.focused === true,
    selected: input.selected === true,
    attention: input.attention ?? "normal",
    presentationRole: input.focused ? "focused" : "related",
    presentationLevel: "minimum",
    presenceReason: "Proof fixture",
    semanticRelationshipIds: Object.freeze([] as string[]),
    evidenceRef: null,
    provenanceRef: null,
    advisorIdentity: input.label ?? input.id,
    stageNavigationEligible: true,
    collectionEligible: true,
    rendererPresentationIdentity: input.id,
  });
}

export function dth3Relationship(input: {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly relation?: string | null;
}): NexoraDecisionTheatreRelationship {
  return Object.freeze({
    id: input.id,
    sourceId: input.sourceId,
    targetId: input.targetId,
    semanticRelation: input.relation ?? "related",
    impliesCausality: false as const,
    candidateMeansConfirmed: false as const,
  });
}

export const DTH3_PROOF_GOAL = dth3Executive({ id: "proof-goal", type: "goal", status: "stable" });
export const DTH3_PROOF_SCENARIO = dth3Executive({
  id: "proof-scenario",
  type: "scenario",
  status: "watch",
  attention: "elevated",
});
export const DTH3_PROOF_DECISION = dth3Executive({
  id: "proof-decision",
  type: "decision",
  status: "risk",
  focused: true,
  selected: false,
});
export const DTH3_PROOF_RISK = dth3Executive({ id: "proof-risk", type: "risk", status: "unresolved" });
export const DTH3_PROOF_MISSING = dth3Executive({ id: "proof-missing", type: "problem", status: null });
export const DTH3_PROOF_SELECTED = dth3Executive({
  id: "proof-selected",
  type: "execution",
  status: "stable",
  selected: true,
});
export const DTH3_PROOF_BACKGROUND = dth3Executive({
  id: "proof-background",
  type: "opportunity",
  status: "stable",
  visibility: "background-discoverable",
});

export const DTH3_PROOF_REL_SUPPORTED = dth3Relationship({
  id: "rel-supported",
  sourceId: "proof-goal",
  targetId: "proof-decision",
  relation: "depends-on",
});
export const DTH3_PROOF_REL_CANDIDATE = dth3Relationship({
  id: "rel-candidate",
  sourceId: "proof-scenario",
  targetId: "proof-goal",
});
export const DTH3_PROOF_REL_UNKNOWN = dth3Relationship({
  id: "rel-unknown",
  sourceId: "proof-risk",
  targetId: "proof-missing",
});

export function dth3ProofIconic(ownerId: string, role: "cost" | "time" | "evidence" = "cost"): NexoraDecisionTheatreIconicObject {
  const source = {
    ...NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
    ownerExecutiveObjectId: ownerId,
    role,
    sourceRef: `dth3-${role}`,
  };
  const [iconic] = projectNexoraDecisionTheatreIconicObjects({
    visibleExecutives: [dth3Executive({ id: ownerId, type: "scenario" })],
    focusedExecutiveId: ownerId,
    relationships: [],
    catalogExecutiveIds: [ownerId],
    sources: [source],
  });
  if (!iconic) {
    throw new Error("expected iconic proof fixture");
  }
  return iconic;
}

export const DTH3_PROOF_ICONIC_ID = deriveNexoraDecisionTheatreIconicPresentationId({
  ownerExecutiveObjectId: "proof-scenario",
  role: "cost",
  sourceRef: "dth3-cost",
});
