/**
 * DTH:5 — Scene actor-role registry.
 * Presentation roles only. They do not change canonical Object type or lifecycle.
 */

export const nexoraDecisionTheatreSceneActorRoleIdentity =
  "DTH:5/SceneActorRoleRegistry" as const;

export const NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLES = Object.freeze([
  "ANCHOR",
  "PRIMARY_ACTOR",
  "ALTERNATIVE_ACTOR",
  "SUPPORTING_ACTOR",
  "CONTEXT_ACTOR",
  "ATTENTION_ACTOR",
  "OUTCOME_ACTOR",
  "ICONIC_INDICATOR",
] as const);

export type NexoraDecisionTheatreSceneActorRole =
  (typeof NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLES)[number];

export const NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLE_REGISTRY = Object.freeze({
  ANCHOR: Object.freeze({
    role: "ANCHOR" as const,
    meaning: "The Object or context around which the scene is organized.",
    maxCount: 1,
    changesObjectType: false as const,
  }),
  PRIMARY_ACTOR: Object.freeze({
    role: "PRIMARY_ACTOR" as const,
    meaning: "An Executive Object directly necessary to answer the active question.",
    maxCount: null,
    changesObjectType: false as const,
  }),
  ALTERNATIVE_ACTOR: Object.freeze({
    role: "ALTERNATIVE_ACTOR" as const,
    meaning: "A candidate or Scenario participating in comparison. Alternative does not mean preferred.",
    maxCount: null,
    changesObjectType: false as const,
  }),
  SUPPORTING_ACTOR: Object.freeze({
    role: "SUPPORTING_ACTOR" as const,
    meaning: "An Executive Object that provides supported context.",
    maxCount: null,
    changesObjectType: false as const,
  }),
  CONTEXT_ACTOR: Object.freeze({
    role: "CONTEXT_ACTOR" as const,
    meaning: "An Object that remains relevant but is not central.",
    maxCount: null,
    changesObjectType: false as const,
  }),
  ATTENTION_ACTOR: Object.freeze({
    role: "ATTENTION_ACTOR" as const,
    meaning: "An existing Object with supported attention state. This role does not create attention.",
    maxCount: null,
    changesObjectType: false as const,
  }),
  OUTCOME_ACTOR: Object.freeze({
    role: "OUTCOME_ACTOR" as const,
    meaning: "An expected or observed Outcome participant already supported by authority.",
    maxCount: null,
    changesObjectType: false as const,
  }),
  ICONIC_INDICATOR: Object.freeze({
    role: "ICONIC_INDICATOR" as const,
    meaning: "A DTH:2 Iconic Object attached to an Executive Object or relationship. Not a full Executive actor.",
    maxCount: null,
    changesObjectType: false as const,
  }),
} as const);
