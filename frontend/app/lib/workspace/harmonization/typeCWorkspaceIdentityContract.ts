/**
 * E2:49 Part 10 — canonical Type-C workspace identity contract.
 *
 * Reference for future executive product development: visual, interaction,
 * language, layout, and polish standards.
 */

export type TypeCWorkspaceIdentityVersion = "e2-49-v1";

export type TypeCVisualPrinciple = {
  id: string;
  statement: string;
};

export type TypeCInteractionPrinciple = {
  id: string;
  statement: string;
};

export type TypeCLanguagePrinciple = {
  id: string;
  statement: string;
};

export type TypeCLayoutPrinciple = {
  id: string;
  statement: string;
};

export type TypeCExecutiveStandard = {
  id: string;
  domain: "visual" | "interaction" | "language" | "layout" | "motion" | "status";
  requirement: string;
};

export type TypeCWorkspaceIdentityContract = {
  version: TypeCWorkspaceIdentityVersion;
  productName: "Nexora Type-C Executive Workspace";
  visualPrinciples: TypeCVisualPrinciple[];
  interactionPrinciples: TypeCInteractionPrinciple[];
  languagePrinciples: TypeCLanguagePrinciple[];
  layoutPrinciples: TypeCLayoutPrinciple[];
  executiveStandards: TypeCExecutiveStandard[];
};

export const TYPE_C_WORKSPACE_IDENTITY_CONTRACT: TypeCWorkspaceIdentityContract = {
  version: "e2-49-v1",
  productName: "Nexora Type-C Executive Workspace",
  visualPrinciples: [
    { id: "scene-first", statement: "The operational scene is the primary workspace surface." },
    { id: "glass-instrument", statement: "HUDs use restrained glass, not decorative chrome." },
    { id: "single-hierarchy", statement: "Typography and spacing follow one executive reading order." },
    { id: "theme-parity", statement: "Day and night differ only in color — not layout or behavior." },
  ],
  interactionPrinciples: [
    { id: "predictable-panels", statement: "Collapse, expand, dock, and pin behave the same on every panel." },
    { id: "consistent-controls", statement: "Buttons share hover, focus, pressed, disabled, and selected states." },
    { id: "no-surprise-motion", statement: "Motion is subtle and never competes with operational context." },
  ],
  languagePrinciples: [
    { id: "single-vocabulary", statement: "Analyze, Scenario, Risk, Fragility, and Readiness use one canonical term each." },
    { id: "executive-tone", statement: "Copy reads as operational intelligence, not tutorial or alarm." },
    { id: "no-generic-init", statement: "Avoid Loading, Initializing, and Unknown in executive surfaces." },
  ],
  layoutPrinciples: [
    { id: "information-ownership", statement: "Each fact has one canonical surface owner." },
    { id: "progressive-disclosure", statement: "Reveal situation before risk, decision, and advanced analysis." },
    { id: "right-rail-assistant", statement: "Strategic AI assistant lives on the executive right rail in clean Type-C." },
  ],
  executiveStandards: [
    { id: "typography-max-display", domain: "visual", requirement: "Display text must not exceed 17px." },
    { id: "status-unified", domain: "status", requirement: "Healthy, warning, critical, active, inactive, and monitoring use one chip system." },
    { id: "icon-family", domain: "visual", requirement: "Use unified unicode icon registry — no mixed icon families." },
    { id: "motion-cap", domain: "motion", requirement: "Transitions must complete within 320ms." },
    { id: "vocabulary-canonical", domain: "language", requirement: "All visible labels resolve through executiveVocabularyRegistry." },
    { id: "panel-contract", domain: "interaction", requirement: "Panel behavior resolves through panelBehaviorGovernance." },
  ],
};
