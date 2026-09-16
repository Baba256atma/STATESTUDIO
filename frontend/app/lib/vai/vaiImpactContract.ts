/**
 * NPA-T VAI:6 — Impact Analysis Scene presentation contract.
 * Director arranges VAI:1–5 truth. It does not create it.
 */

import { vaiImpactSceneIdentity } from "./vaiImpactIdentity.ts";
import type { VaiContextualRole } from "./vaiContract.ts";
import type { VaiTheatreConnectorType } from "./vaiTheatreContract.ts";

export const VAI_IMPACT_SCENE_INTENT = "IMPACT_ANALYSIS" as const;
export const VAI_IMPACT_THEATRE_INTENT_KIND = "INVESTIGATE_CONDITION" as const;

export const VAI_IMPACT_COMPLEXITY = Object.freeze(["SIMPLE", "STANDARD", "DETAILED"] as const);
export type VaiImpactComplexity = (typeof VAI_IMPACT_COMPLEXITY)[number];

export const VAI_IMPACT_VISIBLE_LIMIT = Object.freeze({
  SIMPLE: 4,
  STANDARD: 6,
  DETAILED: 8,
} as const);

export const VAI_IMPACT_ROLE_REGIONS = Object.freeze({
  FOCAL: Object.freeze({ regionId: "center", x: 0.5, y: 0.5, meaning: "focal executive Object" }),
  LEVER: Object.freeze({ regionId: "left-input", x: 0.22, y: 0.5, meaning: "potential management-controlled factor" }),
  OUTCOME: Object.freeze({ regionId: "right-result", x: 0.78, y: 0.5, meaning: "observed or target analytical result" }),
  PATH_OF_EFFECT: Object.freeze({ regionId: "path-band", x: 0.5, y: 0.7, meaning: "candidate pathway" }),
  MODERATOR: Object.freeze({ regionId: "offset-condition", x: 0.72, y: 0.7, meaning: "possible modifying condition" }),
  CONTROL: Object.freeze({ regionId: "reference-band", x: 0.5, y: 0.84, meaning: "factor being held or accounted for" }),
  CONFOUNDER: Object.freeze({ regionId: "alternative-band", x: 0.5, y: 0.18, meaning: "alternative explanation" }),
  AMBIGUOUS: Object.freeze({ regionId: "ambiguous-boundary", x: 0.22, y: 0.32, meaning: "role not yet resolved" }),
} as const);

export const VAI_IMPACT_SAFE_ZONES = Object.freeze({
  left: Object.freeze({ id: "scene-panel-zone", reservedUntil: 0.12 }),
  right: Object.freeze({ id: "scene-object-panel-zone", reservedFrom: 0.88 }),
  top: Object.freeze({ id: "scene-topbar-zone", reservedUntil: 0.1 }),
  bottom: Object.freeze({ id: "scene-timeline-zone", reservedFrom: 0.9 }),
} as const);

export type VaiImpactPlacement = {
  readonly participantId: string;
  readonly kind: "EXECUTIVE_OBJECT" | "VARIABLE_SYMBOL";
  readonly regionId: string;
  readonly x: number;
  readonly y: number;
  readonly scaleToken: "size-dominant" | "size-subordinate";
  readonly role: VaiContextualRole | "FOCAL" | "AMBIGUOUS";
  readonly placementReason: string;
  readonly meaningAuthority: "VAI:2" | "MO:1" | "VAI:5";
};

export type VaiImpactConnectorRoute = {
  readonly fromId: string;
  readonly toId: string;
  readonly connectorType: VaiTheatreConnectorType;
  readonly waypoints: readonly { readonly x: number; readonly y: number }[];
  readonly meaningUnchanged: true;
  readonly geometryUpgradedSemantics: false;
};

export const VAI_IMPACT_BOUNDARY = Object.freeze({
  identity: vaiImpactSceneIdentity,
  secondDirector: false as const,
  secondStage: false as const,
  secondTheatre: false as const,
  causalGraphAuthority: false as const,
  interventionPrediction: false as const,
  scenarioGeneration: false as const,
  synthesizesBundle: false as const,
  startsVai7: false as const,
  independentlyResolvesRoles: false as const,
  independentlyDeterminesCausality: false as const,
});
