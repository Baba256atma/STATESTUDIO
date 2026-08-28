/**
 * MO:2 — Generic Explain Engine.
 *
 * One engine for any registered executive object.
 * Collects MO:1 context, composes a manager-facing explanation,
 * and never becomes a new source of truth.
 */

import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectGuidance } from "./managerObjectGuidance.ts";
import type { ManagerObjectExplainHandoffRequest } from "./managerObjectExplainHandoff.ts";
import type { ManagerObjectIntent } from "./managerObjectInteractionFoundation.ts";
import type { ManagerObjectKind } from "./managerObjectInteractionFoundation.ts";
import { composeConcreteAttentionReason } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  GENERIC_EXPLAIN_ENGINE_BOUNDARY,
  genericExplainEngineIdentity,
  type ExecutiveObjectExplanation,
  type ExecutiveObjectExplanationAction,
  type ExecutiveObjectExplanationDriver,
  type ExecutiveObjectExplanationEvidenceItem,
  type ExecutiveObjectExplanationImplication,
  type ExecutiveObjectExplanationRelationship,
  type ExplanationActionId,
  type ExplanationDepth,
  type ExplanationEpistemicStatus,
  type ExplanationFocus,
} from "./managerObjectExplainTypes.ts";

export {
  GENERIC_EXPLAIN_ENGINE_BOUNDARY,
  genericExplainEngineIdentity,
} from "./managerObjectExplainTypes.ts";
export type {
  ExecutiveObjectExplanation,
  ExplanationDepth,
  ExplanationFocus,
} from "./managerObjectExplainTypes.ts";

export const NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY =
  "NEX-MVP-FINAL:3/executive-explain-v1" as const;

export function getGenericExplainEngineIdentity(): {
  readonly id: typeof genericExplainEngineIdentity;
  readonly version: "1.0.0";
} {
  return Object.freeze({
    id: genericExplainEngineIdentity,
    version: "1.0.0" as const,
  });
}

export function resolveExplanationLens(utterance: string): {
  readonly focus: ExplanationFocus;
  readonly depth: ExplanationDepth;
} {
  const normalized = utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  const depth: ExplanationDepth = /in detail|tell me everything|deep dive|full explanation/.test(
    normalized,
  )
    ? "DEEP"
    : /briefly|quick(?:ly)?|short summary/.test(normalized)
      ? "QUICK"
      : "STANDARD";
  if (/what should i do|what do you recommend/.test(normalized)) {
    return Object.freeze({ focus: "recommendation", depth });
  }
  if (
    /^why$/.test(normalized) ||
    /why is this happening|what is causing|what may be contributing|what is driving/.test(
      normalized,
    )
  ) {
    return Object.freeze({ focus: "drivers", depth: "DEEP" });
  }
  if (/what does (?:it|this) affect|what is affected/.test(normalized)) {
    return Object.freeze({ focus: "relationships", depth: "DEEP" });
  }
  if (/^what is this$/.test(normalized) || /what is this object/.test(normalized)) {
    return Object.freeze({ focus: "overview", depth });
  }
  if (/what happens if this continues|if this continues/.test(normalized)) {
    return Object.freeze({ focus: "implications", depth });
  }
  if (/what don'?t we know|what do we not know|what is unknown|what remains unknown/.test(normalized)) {
    return Object.freeze({ focus: "uncertainty", depth });
  }
  if (/what evidence|what supports this|show (?:me )?(?:the )?evidence/.test(normalized)) {
    return Object.freeze({ focus: "evidence", depth });
  }
  if (/what is connected|what(?:'s| is) related/.test(normalized)) {
    return Object.freeze({ focus: "relationships", depth });
  }
  if (
    /why is this important|why does this matter|why is this critical|why is .+ (?:critical|important)/.test(
      normalized,
    )
  ) {
    return Object.freeze({ focus: "significance", depth });
  }
  return Object.freeze({ focus: "overview", depth });
}

export function composeExecutiveObjectExplanation(input: {
  readonly request: ManagerObjectExplainHandoffRequest;
  readonly guidance: ManagerObjectGuidance;
  readonly focus?: ExplanationFocus;
  readonly depth?: ExplanationDepth;
  readonly utterance?: string;
}): ExecutiveObjectExplanation {
  const lens =
    input.focus && input.depth
      ? { focus: input.focus, depth: input.depth }
      : resolveExplanationLens(input.utterance ?? "");
  const focus = input.focus ?? lens.focus;
  const depth = input.depth ?? lens.depth;
  const context = input.request.context;
  const intent = input.request.intent;
  const label = context.identity.value;
  const kind = context.objectKind.value;

  const summary = composeSummary(label, kind, context);
  const currentSituation = composeSituation(label, context);
  const significance = composeSignificance(label, context);
  const evidence = collectEvidence(context);
  const relationships = composeRelationships(label, context);
  const drivers = composeDrivers(context);
  const implications = composeImplications(label, context, intent, focus);
  const uncertainty = composeUncertainty(context, evidence);
  const recommendedNextQuestions = composeQuestions(
    kind,
    context,
    input.guidance,
    intent,
    focus,
  );
  const availableActions = composeActions(context, intent);
  const epistemicStatus = resolveOverallEpistemic(
    context,
    evidence,
    implications,
    focus,
    intent,
  );
  const handoffRecommendation = intent === "RECOMMEND" || focus === "recommendation";
  const managerFacingText = composeManagerFacingText({
    intent,
    focus,
    depth,
    label,
    summary,
    currentSituation,
    significance,
    evidence,
    relationships,
    drivers,
    implications,
    uncertainty,
    recommendedNextQuestions,
    handoffRecommendation,
    kpiUnknown: context.kpi.support === "UNKNOWN",
  });

  return Object.freeze({
    engineId: genericExplainEngineIdentity,
    subject: Object.freeze({
      id: context.objectId,
      label,
      kind,
    }),
    intent,
    focus,
    depth,
    summary,
    currentSituation,
    significance,
    evidence,
    relationships,
    drivers,
    implications,
    uncertainty,
    recommendedNextQuestions,
    availableActions,
    epistemicStatus,
    managerFacingText,
    handoffRecommendation,
    commitsDecision: false,
    startsExecution: false,
    usesLlm: false,
    languageComposer: "deterministic",
  });
}

export function verifyGenericExplainEngine(): { readonly ok: true } {
  const identity = getGenericExplainEngineIdentity();
  if (identity.id !== "MO:2/GenericExplainEngine") {
    throw new Error("MO:2 identity mismatch");
  }
  if (GENERIC_EXPLAIN_ENGINE_BOUNDARY.usesLlm) {
    throw new Error("MO:2 must work without LLM");
  }
  if (GENERIC_EXPLAIN_ENGINE_BOUNDARY.writesStageCoordinates) {
    throw new Error("MO:2 must not write Stage coordinates");
  }
  if (GENERIC_EXPLAIN_ENGINE_BOUNDARY.perObjectExplanationBranches) {
    throw new Error("MO:2 must remain object-type independent");
  }
  if (GENERIC_EXPLAIN_ENGINE_BOUNDARY.inventsDecisions) {
    throw new Error("MO:2 must not invent decisions");
  }
  return Object.freeze({ ok: true as const });
}

function composeSummary(
  label: string | null,
  kind: ManagerObjectKind | null,
  context: ManagerObjectContext,
): string | null {
  if (label == null || kind == null) {
    return "No executive object is currently active, so I cannot explain a subject.";
  }
  const meaning = context.executiveMeaning.value;
  if (meaning) {
    if (meaning.toLowerCase().startsWith(label.toLowerCase())) {
      return meaning;
    }
    return `${label}: ${meaning}`;
  }
  const kindMeaning = genericKindMeaning(kind);
  return kindMeaning ? `${label} is ${kindMeaning}` : null;
}

function genericKindMeaning(kind: ManagerObjectKind): string | null {
  switch (kind) {
    case "goal":
      return "the outcome you are trying to achieve.";
    case "problem":
      return "an issue in the current business situation.";
    case "risk":
      return "a possible future issue, not a confirmed current failure.";
    case "opportunity":
      return "a possible improvement path, not an approved decision.";
    case "scenario":
      return "a projected alternative, not observed reality.";
    case "decision":
      return "a choice under review or already committed.";
    case "execution":
      return "the work that follows a committed decision.";
    case "outcome":
      return "a result after execution, when evidence exists.";
    default:
      return null;
  }
}

function managerFacingOperationalState(state: string): string {
  const key = state.trim().toUpperCase();
  if (key === "WATCH") return "worth monitoring";
  if (key === "URGENT") return "requiring prompt attention";
  if (key === "CRITICAL") return "under pressure";
  return state;
}

function composeSituation(
  label: string | null,
  context: ManagerObjectContext,
): string | null {
  const state = context.currentState.value
    ? managerFacingOperationalState(context.currentState.value)
    : null;
  if (state && label) {
    if (needsAttentionState(context.currentState.value ?? state)) {
      const raw = context.currentState.value ?? state;
      return composeConcreteAttentionReason({
        label,
        belowTarget: /below|short|miss|under/i.test(raw),
        unresolved: /open|unresolved|outstanding/i.test(raw),
        deteriorated: /worse|deteriorat|declin/i.test(raw),
        state,
      });
    }
    return `${label} is ${state}.`;
  }
  if (state) return `Current state is ${state}.`;
  if (label) {
    return `Current state for ${label} is not yet known from available evidence.`;
  }
  return null;
}

function needsAttentionState(state: string): boolean {
  return /unresolved|watch|risk|critical|elevated|attention/i.test(state);
}

function composeSignificance(
  label: string | null,
  context: ManagerObjectContext,
): string | null {
  const subject = label ?? "This";
  const relatedLabel = relatedProblemLabel(context);
  if (context.associatedProblem.support === "KNOWN") {
    return relatedLabel
      ? `${subject} matters because it is connected to ${relatedLabel}.`
      : `${subject} matters because it is connected to a related problem.`;
  }
  if (context.associatedGoal.support === "KNOWN" && context.objectKind.value !== "goal") {
    return `${subject} matters in relation to the associated goal.`;
  }
  return null;
}

function relatedProblemLabel(context: ManagerObjectContext): string | null {
  const related = context.relationships.find((edge) =>
    /problem|associated|affected|constrained/i.test(
      `${edge.relationKind} ${edge.otherLabel}`,
    ),
  );
  return related?.otherLabel ?? context.relationships[0]?.otherLabel ?? null;
}

function collectEvidence(
  context: ManagerObjectContext,
): readonly ExecutiveObjectExplanationEvidenceItem[] {
  const items: ExecutiveObjectExplanationEvidenceItem[] = [];
  if (context.kpi.value) {
    items.push(
      Object.freeze({
        text: `${context.kpi.value.label} is ${context.kpi.value.value}.`,
        support: "KNOWN",
        sourceAuthority: context.kpi.sourceAuthority,
      }),
    );
  }
  if (context.currentState.value && context.currentState.support === "KNOWN") {
    items.push(
      Object.freeze({
        text: `Status is ${context.currentState.value}.`,
        support: "KNOWN",
        sourceAuthority: context.currentState.sourceAuthority,
      }),
    );
  }
  if (context.provenance.value) {
    const readable = context.provenance.value.filter(
      (item) => !/[A-Z]{2,}:\d|NEX-|CC:|MO:|EXI:/.test(item),
    );
    if (readable.length > 0) {
      items.push(
        Object.freeze({
          text: readable.join(", "),
          support: "KNOWN",
          sourceAuthority: context.provenance.sourceAuthority,
        }),
      );
    }
  }
  return Object.freeze(items);
}

function relationshipConsequenceText(
  subject: string,
  edge: { readonly otherLabel: string; readonly relationKind: string },
): string {
  if (edge.relationKind === "affects" || edge.relationKind === "acts-on") {
    return `${subject} may affect ${edge.otherLabel}. That directional relationship is recorded, but there is not enough evidence yet to treat it as a confirmed impact.`;
  }
  if (
    edge.relationKind === "constrained-by" ||
    edge.relationKind === "depends-on"
  ) {
    return `${subject} is connected to ${edge.otherLabel} through a constraint. That recorded dependency is not a confirmed cause.`;
  }
  return `${subject} is associated with ${edge.otherLabel}. That connection does not by itself tell us whether ${subject} is affecting ${edge.otherLabel} or the reverse.`;
}

function composeRelationships(
  label: string | null,
  context: ManagerObjectContext,
): readonly ExecutiveObjectExplanationRelationship[] {
  const subject = label ?? "This";
  return Object.freeze(
    context.relationships.map((edge) =>
      Object.freeze({
        text: relationshipConsequenceText(subject, edge),
        relationKind: edge.relationKind,
        otherId: edge.otherId,
        otherLabel: edge.otherLabel,
        support: edge.support === "KNOWN" ? "KNOWN" : "INFERRED",
        causalClaim: "none" as const,
      }),
    ),
  );
}

function composeDrivers(
  context: ManagerObjectContext,
): readonly ExecutiveObjectExplanationDriver[] {
  const contributors = context.relationships.filter(
    (edge) =>
      edge.relationKind === "constrained-by" ||
      edge.relationKind === "depends-on",
  );
  if (contributors.length === 0) return Object.freeze([]);
  return Object.freeze(
    contributors.map((edge) =>
      Object.freeze({
        text: `${edge.otherLabel} is connected and may be contributing, but the current evidence does not establish it as the confirmed cause.`,
        support: "INFERRED" as const,
        causalClaim: "possible-contributor" as const,
      }),
    ),
  );
}

function composeImplications(
  label: string | null,
  context: ManagerObjectContext,
  intent: ManagerObjectIntent,
  focus: ExplanationFocus,
): readonly ExecutiveObjectExplanationImplication[] {
  if (intent !== "IMPACT" && focus !== "implications") {
    if (context.scenarios.support !== "KNOWN") return Object.freeze([]);
  }
  const subject = label ?? "This";
  if (context.relationships.length > 0 && (intent === "IMPACT" || focus === "implications")) {
    const others = context.relationships.map((edge) => edge.otherLabel).join(", ");
    return Object.freeze([
      Object.freeze({
        text: `${subject} is connected to ${others}. Those connections are known relationships, not a measured impact, and they do not establish a confirmed cause.`,
        support: "UNKNOWN" as const,
      }),
    ]);
  }
  if (context.scenarios.support === "KNOWN") {
    return Object.freeze([
      Object.freeze({
        text: `If ${subject} continues on the current path, associated scenario intelligence can be inspected. That path is a projection, not an observed fact.`,
        support: "PREDICTED" as const,
      }),
    ]);
  }
  return Object.freeze([
    Object.freeze({
      text: `There is not currently enough evidence to state what happens if ${subject} continues.`,
      support: "UNKNOWN" as const,
    }),
  ]);
}

function composeUncertainty(
  context: ManagerObjectContext,
  evidence: readonly ExecutiveObjectExplanationEvidenceItem[],
): string | null {
  const unknown: string[] = [];
  if (evidence.length === 0) {
    unknown.push("there is not enough evidence to describe the current measured state");
  }
  if (context.outcomes.support === "UNKNOWN") {
    unknown.push("no outcome has been measured yet");
  }
  if (unknown.length === 0) {
    return "Known claims stay limited to available evidence. A relationship is not treated as a confirmed cause.";
  }
  return `${unknown.join("; ").replace(/^./, (ch) => ch.toUpperCase())}.`;
}

function composeQuestions(
  kind: ManagerObjectKind | null,
  context: ManagerObjectContext,
  guidance: ManagerObjectGuidance,
  intent: ManagerObjectIntent,
  focus: ExplanationFocus,
): readonly string[] {
  const questions: string[] = [];
  if (kind === "problem" || context.associatedProblem.support === "KNOWN") {
    questions.push("Why is this happening?");
    questions.push("What is affected?");
  }
  if (context.associatedRisk.support === "KNOWN" || kind === "risk") {
    questions.push("Show related risks.");
  }
  if (context.scenarios.support === "KNOWN" || kind === "scenario") {
    questions.push("What assumptions does this use?");
    questions.push("What are the trade-offs?");
  }
  if (kind === "scenario") {
    questions.push("What decision would this require?");
  }
  if (kind === "decision" || context.decisions.support === "KNOWN") {
    questions.push("Why was this recommended?");
    questions.push("What execution follows?");
  }
  if (kind === "execution" || context.execution.support === "KNOWN") {
    questions.push("What outcome should we monitor?");
  }
  if (focus === "overview" || intent === "EXPLAIN") {
    questions.push("Why does it matter?");
    questions.push("What is connected to it?");
  }
  if (evidenceUnknown(context)) {
    questions.push("What don't we know?");
  }
  const merged = [...questions, ...guidance.suggestedNextQuestions];
  const unique = [...new Set(merged)].slice(0, 5);
  return Object.freeze(unique);
}

function evidenceUnknown(context: ManagerObjectContext): boolean {
  return context.kpi.support === "UNKNOWN" && context.executiveMeaning.support === "UNKNOWN";
}

function composeActions(
  context: ManagerObjectContext,
  intent: ManagerObjectIntent,
): readonly ExecutiveObjectExplanationAction[] {
  const actions: ExecutiveObjectExplanationAction[] = [];
  const add = (id: ExplanationActionId, label: string, available: boolean) => {
    if (!available) return;
    actions.push(Object.freeze({ id, label, available: true as const }));
  };
  add(
    "INVESTIGATE",
    "Investigate related issues",
    context.objectId != null &&
      (context.associatedProblem.support === "KNOWN" ||
        context.relationships.length > 0),
  );
  add(
    "VIEW_RELATIONSHIPS",
    "View related issues",
    context.relationships.length > 0,
  );
  add(
    "COMPARE_SCENARIOS",
    "Compare available scenarios",
    context.scenarios.support === "KNOWN",
  );
  add(
    "RECOMMEND",
    "Ask existing recommendation intelligence",
    context.associatedProblem.support === "KNOWN" ||
      context.objectKind.value === "problem" ||
      context.objectKind.value === "risk",
  );
  add(
    "DECIDE",
    "Review an existing decision path",
    context.decisions.support === "KNOWN" || context.objectKind.value === "decision",
  );
  add(
    "VIEW_EXECUTION",
    "View associated execution",
    context.execution.support === "KNOWN" || context.objectKind.value === "execution",
  );
  add(
    "CHECK_OUTCOME",
    "Check outcome",
    context.outcomes.support === "KNOWN" || context.objectKind.value === "outcome",
  );
  void intent;
  return Object.freeze(actions);
}

function resolveOverallEpistemic(
  context: ManagerObjectContext,
  evidence: readonly ExecutiveObjectExplanationEvidenceItem[],
  implications: readonly ExecutiveObjectExplanationImplication[],
  focus: ExplanationFocus,
  intent: ManagerObjectIntent,
): ExplanationEpistemicStatus {
  if (focus === "implications" || intent === "IMPACT") {
    return implications[0]?.support ?? "UNKNOWN";
  }
  if (focus === "uncertainty") return "UNKNOWN";
  if (evidence.some((item) => item.support === "KNOWN")) return "KNOWN";
  if (context.identity.support === "KNOWN") {
    return context.relationships.length > 0 ? "INFERRED" : "KNOWN";
  }
  return "UNKNOWN";
}

function composeManagerFacingText(input: {
  readonly intent: ManagerObjectIntent;
  readonly focus: ExplanationFocus;
  readonly depth: ExplanationDepth;
  readonly label: string | null;
  readonly summary: string | null;
  readonly currentSituation: string | null;
  readonly significance: string | null;
  readonly evidence: readonly ExecutiveObjectExplanationEvidenceItem[];
  readonly relationships: readonly ExecutiveObjectExplanationRelationship[];
  readonly drivers: readonly ExecutiveObjectExplanationDriver[];
  readonly implications: readonly ExecutiveObjectExplanationImplication[];
  readonly uncertainty: string | null;
  readonly recommendedNextQuestions: readonly string[];
  readonly handoffRecommendation: boolean;
  readonly kpiUnknown: boolean;
}): string {
  const parts: string[] = [];
  const includeStandard =
    input.depth !== "QUICK" ||
    input.focus === "evidence" ||
    input.focus === "relationships" ||
    input.focus === "uncertainty";

  if (input.handoffRecommendation || input.focus === "recommendation") {
    if (input.currentSituation) parts.push(input.currentSituation);
    if (input.relationships[0]) parts.push(input.relationships[0].text);
    const nextSubject = input.relationships[0]?.otherLabel;
    if (nextSubject && input.label) {
      parts.push(
        `I recommend investigating ${nextSubject} next to determine whether it is driving ${input.label}.`,
      );
    } else if (nextSubject) {
      parts.push(`I recommend investigating ${nextSubject} next.`);
    } else {
      parts.push(
        "I recommend staying with the current subject until there is enough evidence for a specific next investigation.",
      );
    }
    if (input.handoffRecommendation) {
      parts.push(
        "The current evidence supports investigation, but not yet a committed course of action.",
      );
    }
    return parts.filter(Boolean).join(" ");
  }

  if (input.focus === "relationships" || input.intent === "RELATIONSHIPS") {
    if (input.relationships.length === 0) {
      parts.push(
        `${input.label ?? "This"} does not currently have related issues to explain.`,
      );
    } else {
      parts.push(input.relationships.map((item) => item.text).join(" "));
    }
    return parts.join(" ");
  }

  if (input.focus === "implications" || input.intent === "IMPACT") {
    parts.push(...input.implications.map((item) => item.text));
    return parts.join(" ");
  }

  if (input.focus === "uncertainty") {
    if (input.uncertainty) parts.push(input.uncertainty);
    else parts.push("There are no additional unknowns to report for this subject.");
    return parts.join(" ");
  }

  if (input.focus === "evidence") {
    if (input.kpiUnknown || input.evidence.length === 0) {
      parts.push(
        `There is not enough evidence yet to identify a confirmed measured claim for ${input.label ?? "this subject"}.`,
      );
    } else {
      parts.push(`We know ${uncapitalizeJoin(input.evidence.map((item) => item.text))}`);
    }
    if (input.uncertainty) parts.push(input.uncertainty);
    return parts.join(" ");
  }

  if (input.focus === "significance") {
    if (input.currentSituation) parts.push(input.currentSituation);
    if (input.significance) parts.push(input.significance);
    if (includeStandard && input.relationships[0]) parts.push(input.relationships[0].text);
    return parts.join(" ");
  }

  if (input.focus === "drivers") {
    if (input.currentSituation) parts.push(input.currentSituation);
    if (input.drivers.length > 0) {
      parts.push(input.drivers.map((item) => item.text).join(" "));
    } else if (input.relationships[0]) {
      parts.push(input.relationships[0].text);
      parts.push(
        `There is not enough evidence yet to identify a confirmed root cause for ${input.label ?? "this"}.`,
      );
    } else {
      parts.push(
        `There is not enough evidence yet to identify a confirmed root cause for ${input.label ?? "this"}.`,
      );
    }
    return parts.join(" ");
  }

  return composeExecutiveOverview(input, includeStandard);
}

function composeExecutiveOverview(
  input: Parameters<typeof composeManagerFacingText>[0],
  includeStandard: boolean,
): string {
  const parts: string[] = [];
  if (input.summary && !isGenericDefinitionNoise(input.summary)) {
    parts.push(input.summary);
  }
  if (input.currentSituation) parts.push(input.currentSituation);
  const relationshipText = includeStandard ? input.relationships[0]?.text ?? null : null;
  if (
    input.significance &&
    !relationshipText &&
    !overlapsExecutivePhrase(input.significance, input.currentSituation)
  ) {
    parts.push(input.significance);
  }
  const measured = input.evidence.find((item) => !/^Status is /i.test(item.text));
  if (includeStandard && measured) {
    parts.push(`We know ${uncapitalizeJoin([measured.text])}`);
  }
  if (relationshipText) parts.push(relationshipText);
  if (includeStandard && /no outcome has been measured/i.test(input.uncertainty ?? "")) {
    parts.push("No outcome has been measured yet.");
  }
  const nextSubject = input.relationships[0]?.otherLabel;
  if (includeStandard && nextSubject && input.label) {
    parts.push(
      `I recommend investigating ${nextSubject} next to determine whether it is driving ${input.label}.`,
    );
  }
  return parts.filter(Boolean).join(" ");
}

function isGenericDefinitionNoise(text: string): boolean {
  return /tracked business object|current executive context|It is a \w+\./i.test(
    text,
  );
}

function overlapsExecutivePhrase(left: string, right: string | null): boolean {
  if (!right) return false;
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  return a.includes(b.slice(0, Math.min(28, b.length))) || b.includes(a.slice(0, Math.min(28, a.length)));
}

function uncapitalizeJoin(texts: readonly string[]): string {
  return texts
    .map((text, index) => (index === 0 ? uncapitalizeSentence(text) : text))
    .join(" ");
}

function uncapitalizeSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}
