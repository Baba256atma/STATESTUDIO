/**
 * NPA-T VAI:5 — Variable Symbol presentation contract.
 * References VAI:1–3 outputs. Does not duplicate Variable, role, or causal truth.
 */

import { vaiTheatreSymbolLanguageIdentity } from "./vaiTheatreIdentity.ts";
import type { VaiContextualRole, VaiSemanticStatus } from "./vaiContract.ts";
import type { VaiRoleStatus } from "./vaiObjectRoleContract.ts";

export const VAI_THEATRE_VISIBLE_LIMIT = 6 as const;
export const VAI_THEATRE_SYMBOL_ID_PREFIX = "var-symbol:" as const;

export const VAI_THEATRE_CONNECTORS = Object.freeze([
  "none",
  "association-neutral",
  "association-directional",
  "hypothesis",
  "manager-view",
  "causal-confirmed",
] as const);

export type VaiTheatreConnectorType = (typeof VAI_THEATRE_CONNECTORS)[number];

export const VAI_THEATRE_PRESENTATION_STATES = Object.freeze(["compact", "expanded"] as const);
export type VaiTheatrePresentationState = (typeof VAI_THEATRE_PRESENTATION_STATES)[number];

export type VaiTheatreRoleGrammar = {
  readonly role: VaiContextualRole;
  readonly geometryToken: string;
  readonly iconToken: string;
  readonly microLabel: string;
  readonly meaning: string;
  readonly mustNotInterpretAs: readonly string[];
};

export const VAI_THEATRE_ROLE_GRAMMAR: Readonly<Record<VaiContextualRole, VaiTheatreRoleGrammar>> = Object.freeze({
  LEVER: Object.freeze({
    role: "LEVER",
    geometryToken: "geometry-knob",
    iconToken: "icon-adjust",
    microLabel: "Can change",
    meaning: "Something management may potentially change.",
    mustNotInterpretAs: Object.freeze(["guaranteed improvement", "approved intervention", "executive Object"]),
  }),
  OUTCOME: Object.freeze({
    role: "OUTCOME",
    geometryToken: "geometry-target",
    iconToken: "icon-watch",
    microLabel: "Watching",
    meaning: "The result or condition being watched.",
    mustNotInterpretAs: Object.freeze(["Goal Object", "KPI Object", "executive Object"]),
  }),
  PATH_OF_EFFECT: Object.freeze({
    role: "PATH_OF_EFFECT",
    geometryToken: "geometry-bridge",
    iconToken: "icon-path",
    microLabel: "Along the path",
    meaning: "A possible intermediate analytical pathway.",
    mustNotInterpretAs: Object.freeze(["proven mediation", "confirmed cause", "causal arrow"]),
  }),
  MODERATOR: Object.freeze({
    role: "MODERATOR",
    geometryToken: "geometry-gate",
    iconToken: "icon-filter",
    microLabel: "May change how they relate",
    meaning: "A condition that may alter how a relationship behaves.",
    mustNotInterpretAs: Object.freeze(["proven moderation", "executive Object"]),
  }),
  CONTROL: Object.freeze({
    role: "CONTROL",
    geometryToken: "geometry-lock",
    iconToken: "icon-stable",
    microLabel: "Hold stable",
    meaning: "Something intended to remain stable or be accounted for.",
    mustNotInterpretAs: Object.freeze(["canonical Object lock", "Stage lock", "executive Object"]),
  }),
  CONFOUNDER: Object.freeze({
    role: "CONFOUNDER",
    geometryToken: "geometry-caution",
    iconToken: "icon-alternative",
    microLabel: "Another explanation",
    meaning: "Another factor that may explain the observed pattern.",
    mustNotInterpretAs: Object.freeze(["Risk Object", "confirmed cause", "executive Object"]),
  }),
});

export type VaiVariableSymbol = {
  readonly visualFamily: "VARIABLE_SYMBOL";
  readonly isExecutiveObject: false;
  readonly isStageObject: false;
  readonly symbolId: string;
  readonly variableId: string;
  readonly analysisContextId: string;
  readonly displayLabel: string;
  readonly analyticalRole: VaiContextualRole | null;
  readonly candidateRoles: readonly VaiContextualRole[];
  readonly roleStatus: VaiRoleStatus | "NONE";
  readonly semanticStatus: VaiSemanticStatus | "NOT_APPLICABLE";
  readonly relatedObjectId: string;
  readonly confidence: string;
  readonly evidencePresentation: "none" | "supported" | "mixed" | "insufficient";
  readonly causalPresentation: "none" | "unconfirmed" | "hypothesis" | "manager-view" | "confirmed";
  readonly connectorType: VaiTheatreConnectorType;
  readonly visualEmphasis: "subordinate" | "inspected";
  readonly geometryToken: string;
  readonly iconToken: string;
  readonly microLabel: string;
  readonly colorNotSoleSignal: true;
  readonly dimensionalTreatment: "2d-overlay-token";
  readonly scaleToken: "size-subordinate";
  readonly visibility: "visible" | "collapsed";
  readonly presentationState: VaiTheatrePresentationState;
  readonly interactionCapability: "inspect-only";
  readonly accessibilityLabel: string;
  readonly roleAmbiguous: boolean;
  readonly meaningUnresolved: boolean;
  readonly managerAssertionAttributed: boolean;
  readonly densityReason: string;
  readonly sourceProjection: "VAI:1-3";
};

export type VaiTheatreFocalObjectVisual = {
  readonly objectId: string;
  readonly label: string;
  readonly visualFamily: "EXECUTIVE_OBJECT";
  readonly scaleToken: "size-dominant";
  readonly dimensionalTreatment: "established-object";
};

export const VAI_THEATRE_BOUNDARY = Object.freeze({
  identity: vaiTheatreSymbolLanguageIdentity,
  secondStage: false as const,
  secondTheatre: false as const,
  secondDirector: false as const,
  secondObjectRegistry: false as const,
  secondVariableStore: false as const,
  secondGraphAuthority: false as const,
  secondSceneAuthority: false as const,
  startsVai6: false as const,
  independentlyPromotesCausality: false as const,
  synthesizesBundle: false as const,
});
