/**
 * P1:5 — Executive Advisor Response Composition.
 *
 * Deterministic composition of P1:3 Advisor Context + P1:4 Advisory Resolution
 * into a concise, traceable, executive-facing Advisor response.
 *
 * Answers: How should Nexora communicate what it knows to the manager?
 * Rule: Language communicates truth. Language does not create truth.
 *
 * Chain:
 *   P0 Data Reality
 *   → P1:2 Evidence + Observation
 *   → P1:3 Advisor Context
 *   → P1:4 Advisory Candidates + Executive Guidance
 *   → P1:5 Executive Advisor Response
 *
 * Does not resolve KPIs, states, evidence, observations, context, candidates,
 * or guidance. Composition only — no LLM required.
 */

import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorEvidence,
  DataRealityAdvisorState,
  DataRealityAdvisorSubjectKind,
  DataRealityAwareAdvisorContext,
  DataRealityExecutiveObservation,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type {
  DataRealityExecutiveAdvisoryResolutionResult,
  DataRealityExecutiveGuidance,
} from "./dataRealityExecutiveAdvisoryResolution.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityExecutiveAdvisorResponseCompositionIdentity =
  "P1:5/ExecutiveAdvisorResponseComposition" as const;

export const dataRealityExecutiveAdvisorResponseCompositionVersion =
  "1.0.0" as const;

export const dataRealityExecutiveAdvisorResponseCompositionNamespace =
  "nexora.data-reality.executive-advisor.response-composition" as const;

export const dataRealityExecutiveAdvisorResponseCompositionPhase =
  "AdvisorResponseComposition" as const;

export const dataRealityExecutiveAdvisorResponseCompositionArchitecturalRole =
  "ExecutiveAdvisorResponseComposer" as const;

export interface DataRealityExecutiveAdvisorResponseCompositionIdentity {
  readonly identity: "P1:5/ExecutiveAdvisorResponseComposition";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.response-composition";
  readonly phase: "AdvisorResponseComposition";
  readonly architecturalRole: "ExecutiveAdvisorResponseComposer";
}

const IDENTITY: DataRealityExecutiveAdvisorResponseCompositionIdentity =
  Object.freeze({
    identity: dataRealityExecutiveAdvisorResponseCompositionIdentity,
    version: dataRealityExecutiveAdvisorResponseCompositionVersion,
    namespace: dataRealityExecutiveAdvisorResponseCompositionNamespace,
    phase: dataRealityExecutiveAdvisorResponseCompositionPhase,
    architecturalRole:
      dataRealityExecutiveAdvisorResponseCompositionArchitecturalRole,
  });

export function getDataRealityExecutiveAdvisorResponseCompositionIdentity(): DataRealityExecutiveAdvisorResponseCompositionIdentity {
  return IDENTITY;
}

// ─── Principles / capabilities / invariants ─────────────────────────────────

export const DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_CORE_PRINCIPLE =
  "The response may express certified meaning, but must never become a new source of executive truth." as const;

export const DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_PRINCIPLES =
  Object.freeze([
    "Truth before Language",
    "Evidence before Claim",
    "Observation before Explanation",
    "Guidance before Recommendation Language",
    "Uncertainty before Assumption",
    "Conciseness before Narrative",
    "Executive Meaning before Technical Detail",
    "Composition before Generation",
    "The response may express certified meaning, but must never become a new source of executive truth.",
  ] as const);

export type DataRealityExecutiveAdvisorResponseCompositionPrinciple =
  (typeof DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_PRINCIPLES)[number];

export const DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_CAPABILITIES =
  Object.freeze([
    "consume-data-reality-aware-advisor-context",
    "consume-executive-advisory-resolution",
    "compose-executive-advisor-response",
    "compose-executive-headline",
    "compose-executive-situation",
    "compose-evidence-summary",
    "compose-executive-meaning",
    "compose-executive-guidance",
    "compose-unresolved-caveat",
    "resolve-response-tone",
    "support-minimum-response-mode",
    "support-brief-response-mode",
    "support-standard-response-mode",
    "support-detailed-response-mode",
    "preserve-evidence-traceability",
    "preserve-observation-traceability",
    "preserve-guidance-traceability",
    "preserve-candidate-traceability",
    "preserve-enterprise-attention",
    "prevent-unsupported-claims",
    "prevent-causal-invention",
    "prevent-decision-invention",
    "support-dataset-sensitive-response",
  ] as const);

export type DataRealityExecutiveAdvisorResponseCompositionCapability =
  (typeof DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_CAPABILITIES)[number];

export const DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_INVARIANTS =
  Object.freeze([
    "P1:5 consumes canonical P1:3 Advisor Context.",
    "P1:5 consumes canonical P1:4 Advisory Resolution.",
    "P1:5 does not read raw datasets.",
    "P1:5 does not calculate KPIs.",
    "P1:5 does not resolve executive states.",
    "P1:5 does not create evidence.",
    "P1:5 does not create observations.",
    "P1:5 does not recreate Advisor Context.",
    "P1:5 does not create new advisory candidates.",
    "P1:5 does not create new guidance.",
    "Response language communicates truth but does not create truth.",
    "Every factual claim must be traceable to canonical input.",
    "Unknown must remain unresolved.",
    "Unresolved must not be interpreted as negative.",
    "Stable must not be communicated as warning.",
    "Critical reality must preserve critical semantics.",
    "Enterprise immediate attention cannot be hidden by focused-object response.",
    "Guidance semantics must not be strengthened during composition.",
    "Guidance does not equal decision.",
    "Response does not equal decision.",
    "Response does not equal execution.",
    "No action-completion claim may be generated.",
    "No unsupported causal claim may be generated.",
    "No unsupported numeric precision may be introduced.",
    "Evidence IDs must resolve.",
    "Observation IDs must resolve.",
    "Guidance IDs must resolve.",
    "Candidate IDs must resolve.",
    "Response IDs are deterministic.",
    "Same semantic input produces same response.",
    "Response modes affect density, not truth.",
    "Tone derives from structured reality.",
    "Tone must not be inferred from generated text.",
    "No randomness is allowed.",
    "No current-time dependency is allowed.",
    "No LLM dependency is required.",
    "No UI dependency is allowed.",
    "No execution dependency is allowed.",
    "P0 remains unchanged.",
    "P1:1 contracts remain canonical.",
    "P1:2 remains canonical for evidence/observation.",
    "P1:3 remains canonical for Advisor Context.",
    "P1:4 remains canonical for candidates/guidance.",
  ] as const);

// ─── Response vocabulary ────────────────────────────────────────────────────

export const DATA_REALITY_ADVISOR_RESPONSE_MODES = Object.freeze([
  "minimum",
  "brief",
  "standard",
  "detailed",
] as const);

export type DataRealityAdvisorResponseMode =
  (typeof DATA_REALITY_ADVISOR_RESPONSE_MODES)[number];

export const DATA_REALITY_ADVISOR_RESPONSE_TONES = Object.freeze([
  "neutral",
  "attention",
  "warning",
  "critical",
  "opportunity",
  "uncertain",
] as const);

export type DataRealityAdvisorResponseTone =
  (typeof DATA_REALITY_ADVISOR_RESPONSE_TONES)[number];

export const DATA_REALITY_ADVISOR_STATE_TO_RESPONSE_TONE = Object.freeze({
  stable: "neutral",
  watch: "attention",
  risk: "warning",
  critical: "critical",
  opportunity: "opportunity",
  unresolved: "uncertain",
} as const satisfies Record<
  DataRealityAdvisorState,
  DataRealityAdvisorResponseTone
>);

export const DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS = Object.freeze([
  "headline",
  "situation",
  "evidence",
  "meaning",
  "guidance",
  "caveat",
] as const);

export type DataRealityAdvisorResponseSectionKind =
  (typeof DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS)[number];

export interface DataRealityExecutiveAdvisorResponseSection {
  readonly kind: DataRealityAdvisorResponseSectionKind;
  readonly text: string;
  readonly evidenceIds: readonly string[];
  readonly observationIds: readonly string[];
  readonly guidanceIds: readonly string[];
}

export interface DataRealityExecutiveAdvisorResponse {
  readonly id: string;
  readonly contextId: string;
  readonly mode: DataRealityAdvisorResponseMode;
  readonly tone: DataRealityAdvisorResponseTone;
  readonly primarySubjectKind: DataRealityAdvisorSubjectKind;
  readonly primarySubjectId?: string;
  readonly headline: string;
  readonly summary: string;
  readonly sections: readonly DataRealityExecutiveAdvisorResponseSection[];
  readonly evidenceIds: readonly string[];
  readonly observationIds: readonly string[];
  readonly guidanceIds: readonly string[];
  readonly advisoryCandidateIds: readonly string[];
  readonly hasUnresolvedReality: boolean;
  readonly requiresImmediateAttention: boolean;
}

export interface ComposeDataRealityExecutiveAdvisorResponseInput {
  readonly context: DataRealityAwareAdvisorContext;
  readonly advisoryResolution: DataRealityExecutiveAdvisoryResolutionResult;
  readonly mode?: DataRealityAdvisorResponseMode;
  readonly includeSecondaryGuidance?: boolean;
  readonly maxEvidenceItems?: number;
}

export interface DataRealityExecutiveAdvisorResponseCompositionMetadata {
  readonly identity: DataRealityExecutiveAdvisorResponseCompositionIdentity;
  readonly capabilities: readonly DataRealityExecutiveAdvisorResponseCompositionCapability[];
  readonly invariants: readonly string[];
  readonly principles: readonly string[];
  readonly responseModes: typeof DATA_REALITY_ADVISOR_RESPONSE_MODES;
  readonly responseTones: typeof DATA_REALITY_ADVISOR_RESPONSE_TONES;
  readonly responseSectionKinds: typeof DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS;
}

const METADATA: DataRealityExecutiveAdvisorResponseCompositionMetadata =
  Object.freeze({
    identity: IDENTITY,
    capabilities:
      DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_CAPABILITIES,
    invariants: DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_INVARIANTS,
    principles: DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_PRINCIPLES,
    responseModes: DATA_REALITY_ADVISOR_RESPONSE_MODES,
    responseTones: DATA_REALITY_ADVISOR_RESPONSE_TONES,
    responseSectionKinds: DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS,
  });

export function getDataRealityExecutiveAdvisorResponseCompositionMetadata(): DataRealityExecutiveAdvisorResponseCompositionMetadata {
  return METADATA;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const SUBJECT_DISPLAY_NAMES: Readonly<Record<string, string>> = Object.freeze({
  "obj-capacity": "Production",
  "obj-inventory": "Warehouse",
  "obj-delivery": "Shipping",
  "obj-customer": "Customer",
  "obj-revenue": "Revenue",
  cost: "Cost",
});

function displayNameForSubject(subjectId: string | undefined): string {
  if (!subjectId) return "Enterprise";
  if (SUBJECT_DISPLAY_NAMES[subjectId]) return SUBJECT_DISPLAY_NAMES[subjectId]!;
  if (subjectId.startsWith("obj-")) {
    const rest = subjectId.slice(4);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
}

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function ensureSentence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function freezeSection(
  section: DataRealityExecutiveAdvisorResponseSection,
): DataRealityExecutiveAdvisorResponseSection {
  return Object.freeze({
    ...section,
    evidenceIds: Object.freeze([...section.evidenceIds]),
    observationIds: Object.freeze([...section.observationIds]),
    guidanceIds: Object.freeze([...section.guidanceIds]),
  });
}

function evidenceById(
  context: DataRealityAwareAdvisorContext,
  evidenceId: string,
): DataRealityAdvisorEvidence | undefined {
  return context.evidence.find((entry) => entry.id === evidenceId);
}

function observationById(
  context: DataRealityAwareAdvisorContext,
  observationId: string,
): DataRealityExecutiveObservation | undefined {
  return context.observations.find((entry) => entry.id === observationId);
}

function guidanceById(
  advisoryResolution: DataRealityExecutiveAdvisoryResolutionResult,
  guidanceId: string,
): DataRealityExecutiveGuidance | undefined {
  return advisoryResolution.guidance.find((entry) => entry.id === guidanceId);
}

// ─── Tone / primary resolution ──────────────────────────────────────────────

export function resolveDataRealityAdvisorResponseTone(
  state: DataRealityAdvisorState,
): DataRealityAdvisorResponseTone {
  return DATA_REALITY_ADVISOR_STATE_TO_RESPONSE_TONE[state];
}

export function resolveRequiresImmediateAttention(
  attention: DataRealityAdvisorAttentionLevel,
): boolean {
  return attention === "immediate";
}

function resolvePrimaryObservation(
  context: DataRealityAwareAdvisorContext,
): DataRealityExecutiveObservation | undefined {
  if (context.primarySubjectId) {
    const primary = context.observations.find(
      (entry) => entry.subjectId === context.primarySubjectId,
    );
    if (primary) return primary;
  }
  return context.observations[0];
}

function resolvePrimaryGuidance(
  advisoryResolution: DataRealityExecutiveAdvisoryResolutionResult,
): DataRealityExecutiveGuidance | undefined {
  if (advisoryResolution.primaryGuidanceId) {
    const primary = guidanceById(
      advisoryResolution,
      advisoryResolution.primaryGuidanceId,
    );
    if (primary) return primary;
  }
  return advisoryResolution.guidance[0];
}

// ─── Section composers ──────────────────────────────────────────────────────

function composeHeadline(
  observation: DataRealityExecutiveObservation | undefined,
  subjectId: string | undefined,
  state: DataRealityAdvisorState,
): string {
  if (observation?.headline) return observation.headline;
  const displayName = displayNameForSubject(subjectId);
  switch (state) {
    case "stable":
      return `${displayName} Performance Stable`;
    case "watch":
      return `${displayName} Requires Attention`;
    case "risk":
      return `${displayName} At Risk`;
    case "critical":
      return `${displayName} Under Pressure`;
    case "opportunity":
      return `${displayName} Opportunity`;
    case "unresolved":
      return `${displayName} Performance Unresolved`;
  }
}

function composeSituationText(
  observation: DataRealityExecutiveObservation | undefined,
  subjectId: string | undefined,
  state: DataRealityAdvisorState,
): string {
  const displayName = displayNameForSubject(
    observation?.subjectId ?? subjectId,
  );
  switch (state) {
    case "stable":
      return `${displayName} performance is currently stable.`;
    case "watch":
      return displayName === "Production"
        ? "Production capacity requires executive attention."
        : `${displayName} requires executive attention.`;
    case "risk":
      return `${displayName} is in a risk executive state.`;
    case "critical":
      return displayName === "Production"
        ? "Production capacity is in a critical executive state."
        : `${displayName} is in a critical executive state.`;
    case "opportunity":
      return `${displayName} indicates an opportunity worth executive attention.`;
    case "unresolved":
      return `${displayName} performance is currently unresolved.`;
  }
}

function formatEvidenceText(evidence: DataRealityAdvisorEvidence): string {
  if (evidence.sourceKind === "kpi") {
    if (evidence.value !== undefined && evidence.unit) {
      return `${evidence.label} is ${String(evidence.value)}${evidence.unit}.`;
    }
    if (evidence.summary.includes("=")) {
      const [left, right] = evidence.summary.split("=").map((part) => part.trim());
      if (left && right) return `${left} is ${right}.`;
    }
  }
  if (evidence.sourceKind === "executive-state") {
    return ensureSentence(evidence.summary.replace(" = ", " is "));
  }
  if (evidence.sourceKind === "business-fact") {
    return ensureSentence(evidence.summary);
  }
  return ensureSentence(evidence.summary);
}

function selectEvidenceItems(
  context: DataRealityAwareAdvisorContext,
  observation: DataRealityExecutiveObservation | undefined,
  guidance: DataRealityExecutiveGuidance | undefined,
  maxEvidenceItems: number,
): readonly DataRealityAdvisorEvidence[] {
  const preferredIds: string[] = [];
  if (observation) preferredIds.push(...observation.evidenceIds);
  if (guidance) {
    for (const id of guidance.evidenceIds) {
      if (!preferredIds.includes(id)) preferredIds.push(id);
    }
  }

  const resolved = preferredIds
    .map((evidenceId) => evidenceById(context, evidenceId))
    .filter((entry): entry is DataRealityAdvisorEvidence => entry !== undefined);

  const rank = (kind: DataRealityAdvisorEvidence["sourceKind"]) =>
    kind === "kpi" ? 0 : kind === "executive-state" ? 1 : kind === "business-fact" ? 2 : 3;

  const ordered = [...resolved].sort((a, b) => {
    const delta = rank(a.sourceKind) - rank(b.sourceKind);
    if (delta !== 0) return delta;
    return a.id.localeCompare(b.id);
  });

  return Object.freeze(ordered.slice(0, maxEvidenceItems));
}

function composeEvidenceText(
  evidenceItems: readonly DataRealityAdvisorEvidence[],
): string | undefined {
  if (evidenceItems.length === 0) return undefined;
  return evidenceItems.map(formatEvidenceText).join(" ");
}

function composeMeaningText(
  observation: DataRealityExecutiveObservation | undefined,
): string | undefined {
  if (!observation?.executiveMeaning) return undefined;
  return ensureSentence(observation.executiveMeaning);
}

function composeGuidanceText(
  guidance: DataRealityExecutiveGuidance | undefined,
): string | undefined {
  if (!guidance) return undefined;
  // Preserve guidance semantics — title only, no strengthening.
  return ensureSentence(guidance.title);
}

function composeUnresolvedCaveat(
  observation: DataRealityExecutiveObservation | undefined,
  hasUnresolvedReality: boolean,
): string | undefined {
  if (!hasUnresolvedReality) return undefined;
  if (observation?.state === "unresolved") {
    const displayName = displayNameForSubject(observation.subjectId);
    return `${displayName} performance cannot yet be assessed reliably because certified performance evidence is unavailable.`;
  }
  return "Some executive subjects remain unresolved because certified performance evidence is currently unavailable.";
}

function modeIncludes(mode: DataRealityAdvisorResponseMode): {
  readonly situation: boolean;
  readonly evidence: boolean;
  readonly meaning: boolean;
  readonly guidance: boolean;
  readonly caveat: boolean;
  readonly secondaryGuidance: boolean;
} {
  switch (mode) {
    case "minimum":
      return Object.freeze({
        situation: true,
        evidence: false,
        meaning: false,
        guidance: false,
        caveat: false,
        secondaryGuidance: false,
      });
    case "brief":
      return Object.freeze({
        situation: true,
        evidence: false,
        meaning: true,
        guidance: false,
        caveat: false,
        secondaryGuidance: false,
      });
    case "standard":
      return Object.freeze({
        situation: true,
        evidence: true,
        meaning: true,
        guidance: true,
        caveat: false,
        secondaryGuidance: false,
      });
    case "detailed":
      return Object.freeze({
        situation: true,
        evidence: true,
        meaning: true,
        guidance: true,
        caveat: true,
        secondaryGuidance: true,
      });
  }
}

function buildResponseId(input: {
  readonly contextId: string;
  readonly mode: DataRealityAdvisorResponseMode;
  readonly primaryGuidanceId?: string;
}): string {
  return [
    "advisor-response",
    normalizeToken(input.contextId),
    `mode-${input.mode}`,
    `guidance-${normalizeToken(input.primaryGuidanceId)}`,
  ].join(":");
}

// ─── Primary composition API ────────────────────────────────────────────────

/**
 * Compose a deterministic executive-facing Advisor response from canonical
 * P1:3 context and P1:4 advisory resolution. Composition only.
 */
export function composeDataRealityExecutiveAdvisorResponse(
  input: ComposeDataRealityExecutiveAdvisorResponseInput,
): DataRealityExecutiveAdvisorResponse {
  const mode = input.mode ?? "standard";
  const includeSecondaryGuidance = input.includeSecondaryGuidance ?? false;
  const maxEvidenceItems = input.maxEvidenceItems ?? 3;
  const context = input.context;
  const advisoryResolution = input.advisoryResolution;
  const includes = modeIncludes(mode);

  const primaryObservation = resolvePrimaryObservation(context);
  const primaryGuidance = resolvePrimaryGuidance(advisoryResolution);
  const state =
    primaryObservation?.state ??
    (context.observations.length === 0 ? "unresolved" : context.dominantState);
  const tone = resolveDataRealityAdvisorResponseTone(state);
  const requiresImmediateAttention = resolveRequiresImmediateAttention(
    context.attention,
  );
  const hasUnresolvedReality =
    context.observations.some((entry) => entry.state === "unresolved") ||
    state === "unresolved" ||
    advisoryResolution.guidance.some(
      (entry) => entry.blockedByUnresolvedReality,
    );

  const headline = composeHeadline(
    primaryObservation,
    context.primarySubjectId,
    state,
  );
  const situationText = composeSituationText(
    primaryObservation,
    context.primarySubjectId,
    state,
  );
  const evidenceItems = selectEvidenceItems(
    context,
    primaryObservation,
    primaryGuidance,
    maxEvidenceItems,
  );
  const evidenceText = composeEvidenceText(evidenceItems);
  const meaningText = composeMeaningText(primaryObservation);
  const guidanceText = composeGuidanceText(primaryGuidance);
  const caveatText = composeUnresolvedCaveat(
    primaryObservation,
    hasUnresolvedReality,
  );

  const observationIds = Object.freeze(
    primaryObservation ? [primaryObservation.id] : [],
  );
  const evidenceIds = Object.freeze(evidenceItems.map((entry) => entry.id));

  const selectedGuidance: DataRealityExecutiveGuidance[] = [];
  if (primaryGuidance) selectedGuidance.push(primaryGuidance);

  const allowSecondary =
    (includes.secondaryGuidance || includeSecondaryGuidance) &&
    mode === "detailed";
  if (allowSecondary) {
    for (const guidance of advisoryResolution.guidance) {
      if (selectedGuidance.length >= 3) break;
      if (selectedGuidance.some((entry) => entry.id === guidance.id)) continue;
      selectedGuidance.push(guidance);
    }
  }

  const guidanceIds = Object.freeze(
    selectedGuidance.map((entry) => entry.id),
  );

  const advisoryCandidateIds = Object.freeze(
    [
      ...(advisoryResolution.primaryCandidateId
        ? [advisoryResolution.primaryCandidateId]
        : []),
      ...selectedGuidance.flatMap((entry) => entry.sourceCandidateIds),
    ].filter((id, index, all) => {
      const exists = advisoryResolution.candidates.some(
        (candidate) => candidate.id === id,
      );
      return exists && all.indexOf(id) === index;
    }),
  );

  const sections: DataRealityExecutiveAdvisorResponseSection[] = [];

  sections.push(
    freezeSection({
      kind: "headline",
      text: headline,
      evidenceIds: Object.freeze([]),
      observationIds,
      guidanceIds: Object.freeze([]),
    }),
  );

  if (includes.situation) {
    sections.push(
      freezeSection({
        kind: "situation",
        text: situationText,
        evidenceIds: Object.freeze([]),
        observationIds,
        guidanceIds: Object.freeze([]),
      }),
    );
  }

  if (includes.evidence && evidenceText) {
    sections.push(
      freezeSection({
        kind: "evidence",
        text: evidenceText,
        evidenceIds,
        observationIds,
        guidanceIds: Object.freeze([]),
      }),
    );
  }

  if (includes.meaning && meaningText) {
    sections.push(
      freezeSection({
        kind: "meaning",
        text: meaningText,
        evidenceIds,
        observationIds,
        guidanceIds: Object.freeze([]),
      }),
    );
  }

  if (includes.guidance && selectedGuidance.length > 0) {
    const guidanceSectionText = selectedGuidance
      .map((entry) => ensureSentence(entry.title))
      .join(" ");
    sections.push(
      freezeSection({
        kind: "guidance",
        text: guidanceSectionText,
        evidenceIds: Object.freeze(
          selectedGuidance.flatMap((entry) => [...entry.evidenceIds]).filter(
            (id, index, all) =>
              evidenceById(context, id) !== undefined &&
              all.indexOf(id) === index,
          ),
        ),
        observationIds: Object.freeze(
          selectedGuidance
            .flatMap((entry) => [...entry.observationIds])
            .filter(
              (id, index, all) =>
                observationById(context, id) !== undefined &&
                all.indexOf(id) === index,
            ),
        ),
        guidanceIds,
      }),
    );
  }

  if (includes.caveat && caveatText) {
    sections.push(
      freezeSection({
        kind: "caveat",
        text: caveatText,
        evidenceIds: Object.freeze([]),
        observationIds,
        guidanceIds: Object.freeze([]),
      }),
    );
  }

  const summaryParts: string[] = [headline];
  if (includes.situation) summaryParts.push(situationText);
  if (includes.evidence && evidenceText) summaryParts.push(evidenceText);
  if (includes.meaning && meaningText) summaryParts.push(meaningText);
  if (includes.guidance && guidanceText) {
    if (selectedGuidance.length > 1) {
      summaryParts.push(
        selectedGuidance.map((entry) => ensureSentence(entry.title)).join(" "),
      );
    } else {
      summaryParts.push(guidanceText);
    }
  }
  if (includes.caveat && caveatText) summaryParts.push(caveatText);

  const responseId = buildResponseId({
    contextId: context.contextId,
    mode,
    primaryGuidanceId: primaryGuidance?.id,
  });

  return Object.freeze({
    id: responseId,
    contextId: context.contextId,
    mode,
    tone,
    primarySubjectKind: context.primarySubjectKind,
    ...(context.primarySubjectId !== undefined
      ? { primarySubjectId: context.primarySubjectId }
      : {}),
    headline,
    summary: summaryParts.join(" "),
    sections: Object.freeze(sections.map(freezeSection)),
    evidenceIds,
    observationIds,
    guidanceIds,
    advisoryCandidateIds,
    hasUnresolvedReality,
    requiresImmediateAttention,
  });
}
