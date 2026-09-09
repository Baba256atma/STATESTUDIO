import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  isEcaMutationCancellation,
  isEcaMutationConfirmation,
  type EcaConfidence,
  type EcaMutationProposal,
  type EcaSubject,
  type EcaWorkingConversationContext,
} from "./ecaWorkingConversationContext.ts";

export const ECA_EXECUTIVE_ACTION_PLAN_IDENTITY =
  "NPA-T ECA:2/ExecutiveIntentConversationActionPlan" as const;

export const ECA_EXECUTIVE_INTENTS = Object.freeze([
  "UNDERSTAND",
  "EXPLAIN",
  "INVESTIGATE",
  "INSPECT_EVIDENCE",
  "LOCATE",
  "SHOW",
  "COUNT",
  "SUMMARIZE",
  "COMPARE",
  "EVALUATE",
  "PRIORITIZE",
  "EXPLORE_SCENARIO",
  "ASK_WHAT_IF",
  "SEEK_RECOMMENDATION",
  "PROPOSE_CHANGE",
  "CONFIRM_ACTION",
  "CANCEL_ACTION",
  "REVIEW_DECISION",
  "COMMIT_DECISION",
  "REVIEW_EXECUTION",
  "REQUEST_EXECUTION_ACTION",
  "REVIEW_OUTCOME",
  "REASSESS",
  "CLARIFY",
  "CORRECT_CONTEXT",
  "UNKNOWN",
] as const);

export type EcaExecutiveIntent = (typeof ECA_EXECUTIVE_INTENTS)[number];

export const ECA_CONVERSATION_ACTIONS = Object.freeze([
  "ANSWER",
  "EXPLAIN",
  "SUMMARIZE",
  "SHOW",
  "COUNT",
  "LOCATE",
  "COMPARE",
  "EVALUATE",
  "ASK_CLARIFICATION",
  "ASK_FOR_MISSING_INFORMATION",
  "SHOW_EVIDENCE",
  "SHOW_UNCERTAINTY",
  "RECOMMEND_INVESTIGATION",
  "RECOMMEND_OPTION",
  "PREPARE_PROPOSAL",
  "ASK_CONFIRMATION",
  "HANDOFF_TO_CANONICAL_AUTHORITY",
  "PRESERVE_CONTEXT",
  "NO_SAFE_ACTION",
] as const);

export type EcaConversationAction = (typeof ECA_CONVERSATION_ACTIONS)[number];
export type EcaContextAvailability =
  | "AVAILABLE"
  | "MISSING_BUT_OPTIONAL"
  | "MISSING_AND_REQUIRED"
  | "AMBIGUOUS"
  | "UNAVAILABLE";

export type EcaCanonicalAuthorityTarget =
  | "NEX-CONV Conversation Kernel"
  | "Decision Theatre Comparison"
  | "CC:10 Decision Commitment"
  | "CC:11 Execution Follow-up"
  | "Decision Theatre Outcome Intelligence"
  | "Decision Theatre Learning/Reassessment"
  | "Canonical Risk Writer"
  | "DATA-ADV/Data Reality";

export type EcaActionContextRequirement = Readonly<{
  kind:
    | "SUBJECT"
    | "COMPARISON_SET"
    | "EVIDENCE"
    | "ACTIVE_PROPOSAL"
    | "COMMITTED_DECISION"
    | "EXECUTION"
    | "OUTCOME"
    | "DATA_SEMANTICS";
  availability: EcaContextAvailability;
  referenceIds: readonly string[];
}>;

export type EcaSuggestedManagerTurn = Readonly<{
  label: string;
  utterance: string;
  kind: "action" | "answer";
}>;

export type EcaConversationActionPlan = Readonly<{
  identity: typeof ECA_EXECUTIVE_ACTION_PLAN_IDENTITY;
  intent: EcaExecutiveIntent;
  subjects: readonly EcaSubject[];
  objective: string | null;
  requiredContext: readonly EcaActionContextRequirement[];
  nextAction: EcaConversationAction;
  alternatives: readonly EcaConversationAction[];
  suggestedManagerTurns: readonly EcaSuggestedManagerTurn[];
  requiresClarification: boolean;
  requiresConfirmation: boolean;
  authorityTarget: EcaCanonicalAuthorityTarget | null;
  uncertainty: Readonly<{
    level: EcaConfidence;
    reasons: readonly string[];
  }>;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
  }>;
  boundaries: Readonly<{
    mutatesBusinessState: false;
    writesStage: false;
    commitsDecision: false;
    startsExecution: false;
    createsConversationMemory: false;
  }>;
}>;

export type EcaExecutiveActionPlanInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  activeProposal?: EcaMutationProposal | null;
  evidenceAvailability?: EcaContextAvailability;
  lifecycle?: Readonly<{
    committedDecisionId?: string | null;
    executionId?: string | null;
    outcomeId?: string | null;
  }>;
}>;

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  createsConversationMemory: false as const,
});

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function normalized(utterance: string): string {
  return utterance.trim().toLowerCase().replace(/[.!?]+$/g, "");
}

function explicitSubjects(context: EcaWorkingConversationContext): readonly EcaSubject[] {
  const explicit = context.references
    .filter((reference) => reference.role === "EXPLICIT")
    .map((reference) => reference.subject);
  if (explicit.length > 0) return freeze(explicit);
  if (context.decisionContext.comparisonSubjects.length > 0) {
    return context.decisionContext.comparisonSubjects;
  }
  return freeze(context.activeSubject ? [context.activeSubject] : []);
}

function inferExecutiveIntent(
  utterance: string,
  meaning: CanonicalManagerMeaning | null,
  context: EcaWorkingConversationContext,
  activeProposal: EcaMutationProposal | null,
): EcaExecutiveIntent {
  const text = normalized(utterance);

  if (
    /\b(?:csv|data library|data source)\b/.test(text) &&
    /\b(?:have|any|files?|sources?|how many|count|list|status|file names|check)\b/.test(text) &&
    !/\bthis using\b/.test(text) &&
    !/\bwhat data supports\b/.test(text) &&
    !/\bneed to investigate\b/.test(text) &&
    !/\b(?:kpi|calculate|conclude|evidence|columns?|fields?|rows?)\b/.test(text)
  ) {
    return /\b(?:how many|count)\b/.test(text) ? "COUNT" : "SHOW";
  }
  if (/\b(?:kpi|calculate)\b/.test(text) && /\b(?:csv|file|field)\b/.test(text)) return "EVALUATE";
  if (/\bconclude\b/.test(text) && /\b(?:csv|file|data)\b/.test(text)) return "SUMMARIZE";
  if (/\bevidence\b/.test(text) && /\b(?:csv|file|data)\b/.test(text)) return "INSPECT_EVIDENCE";
  if (/\b(?:columns?|fields?)\b/.test(text) && /\b(?:understand|unclear|meaning)\b/.test(text)) return "SHOW";
  if (/\brows?\b/.test(text) && /\b(?:csv|file)\b/.test(text)) return "COUNT";
  if (/^(?:explain|what is) data(?: source)?$/.test(text)) return "EXPLAIN";

  if (activeProposal && isEcaMutationConfirmation(utterance)) return "CONFIRM_ACTION";
  if (activeProposal && isEcaMutationCancellation(utterance)) return "CANCEL_ACTION";
  if (!activeProposal && isEcaMutationConfirmation(utterance)) return "CONFIRM_ACTION";
  if (context.mutationProposal) return "PROPOSE_CHANGE";

  if (/\b(?:did (?:it|this|the decision) work|what was the result|review (?:the )?outcome|outcome)\b/.test(text)) return "REVIEW_OUTCOME";
  if (/\b(?:reassess|reconsider)\b/.test(text)) return "REASSESS";
  if (/^(?:i choose|choose|approve|commit to|decide on)\b/.test(text)) return "COMMIT_DECISION";
  if (/\b(?:start|begin|execute|mark .* complete|cancel execution)\b/.test(text)) return "REQUEST_EXECUTION_ACTION";
  if (/\b(?:review|show|explain).*(?:decision)\b|^have i already made the decision$/.test(text)) return "REVIEW_DECISION";
  if (/\b(?:execution|progress|blockers?|milestones?|on track)\b/.test(text)) return "REVIEW_EXECUTION";
  if (meaning?.communicativeIntent === "CORRECT") return "CORRECT_CONTEXT";
  if (meaning?.ambiguity.unresolved && meaning.requestedOperation === "NONE") return "CLARIFY";

  if (/\b(?:evidence|proof|supporting data)\b/.test(text) || meaning?.requestedOperation === "EVIDENCE") return "INSPECT_EVIDENCE";
  if (/\bwhat if\b/.test(text)) return "ASK_WHAT_IF";
  if (/\b(?:which|what).*(?:safer|lower risk|better|faster|delivery speed)|\bevaluate\b/.test(text)) return "EVALUATE";
  if (/\b(?:prioritize|priority|most serious|most important)\b|\bwhich\b.*\bfirst\b/.test(text)) return "PRIORITIZE";
  if (meaning?.communicativeIntent === "ASK_RECOMMENDATION" || meaning?.requestedOperation === "RECOMMEND" || /\bwhat (?:should|do) (?:i|we)\b|\bwhat do you recommend\b/.test(text)) return "SEEK_RECOMMENDATION";
  if (meaning?.requestedOperation === "COMPARE" || meaning?.communicativeIntent === "ASK_COMPARISON" || /\bcompare\b/.test(text)) return "COMPARE";
  if (/\binvestigate\b/.test(text) || meaning?.requestedOperation === "INVESTIGATE" || meaning?.communicativeIntent === "REQUEST_INVESTIGATION" || /^(?:why (?:are|is|were|did|do) .*(?:late|failing|dropping|rising))\b/.test(text)) return "INVESTIGATE";
  if (meaning?.communicativeIntent === "ASK_WHY" || meaning?.requestedOperation === "EXPLAIN" || meaning?.communicativeIntent === "ASK_EXPLANATION" || /^(?:explain|why(?: is that| is it important)?|why)$/.test(text)) return "EXPLAIN";
  if (/\b(?:where|locate|find)\b/.test(text)) return "LOCATE";
  if (/\b(?:how many|count)\b/.test(text)) return "COUNT";
  if (/\b(?:summarize|summary|recap)\b/.test(text)) return "SUMMARIZE";
  if (/\b(?:show|display)\b/.test(text)) return "SHOW";
  if (/\b(?:scenario|option)\b/.test(text) && /\b(?:explore|model|simulate)\b/.test(text)) return "EXPLORE_SCENARIO";
  if (/\b(?:worry|concerned|serious|risk)\b/.test(text)) return "EVALUATE";
  if (meaning?.communicativeIntent === "ASK_INFORMATION") return "UNDERSTAND";
  return "UNKNOWN";
}

function criterionFor(utterance: string, previous: string | null): string | null {
  const text = normalized(utterance);
  if (/lower risk|safer|risk/.test(text)) return "risk";
  if (/delivery speed|faster|speed/.test(text)) return "delivery speed";
  if (/cost|cheaper/.test(text)) return "cost";
  return previous;
}

function requirement(
  kind: EcaActionContextRequirement["kind"],
  availability: EcaContextAvailability,
  referenceIds: readonly string[] = [],
): EcaActionContextRequirement {
  return freeze({ kind, availability, referenceIds: freeze([...referenceIds]) });
}

function suggestedTurn(
  action: EcaConversationAction,
  subjects: readonly EcaSubject[],
): EcaSuggestedManagerTurn {
  const subject = subjects[0]?.label ?? "this";
  const map: Record<EcaConversationAction, EcaSuggestedManagerTurn> = {
    ANSWER: { label: `Answer about ${subject}`, utterance: `Explain ${subject}.`, kind: "action" },
    EXPLAIN: { label: `Explain ${subject}`, utterance: `Explain ${subject}.`, kind: "action" },
    SUMMARIZE: { label: `Summarize ${subject}`, utterance: `Summarize ${subject}.`, kind: "action" },
    SHOW: { label: `Show ${subject}`, utterance: `Show ${subject}.`, kind: "action" },
    COUNT: { label: "Count them", utterance: "How many do we have?", kind: "action" },
    LOCATE: { label: `Locate ${subject}`, utterance: `Where is ${subject}?`, kind: "action" },
    COMPARE: { label: "Compare the options", utterance: "Compare them.", kind: "action" },
    EVALUATE: { label: "Evaluate the options", utterance: "Which is safer?", kind: "action" },
    ASK_CLARIFICATION: { label: "Clarify the subject", utterance: "Which one do you mean?", kind: "action" },
    ASK_FOR_MISSING_INFORMATION: { label: "Ask for the missing evidence", utterance: "What evidence is missing?", kind: "action" },
    SHOW_EVIDENCE: { label: "Show evidence", utterance: "Show me the evidence.", kind: "action" },
    SHOW_UNCERTAINTY: { label: "Show the uncertainty", utterance: "What are we still unsure about?", kind: "action" },
    RECOMMEND_INVESTIGATION: { label: `Investigate ${subject}`, utterance: `Investigate ${subject}.`, kind: "action" },
    RECOMMEND_OPTION: { label: "Recommend a next step", utterance: "What should I do?", kind: "action" },
    PREPARE_PROPOSAL: { label: "Prepare the change", utterance: "Add it as a Risk.", kind: "action" },
    ASK_CONFIRMATION: { label: "Confirm the change", utterance: "Add it.", kind: "action" },
    HANDOFF_TO_CANONICAL_AUTHORITY: { label: "Review with the owning authority", utterance: "Review the decision.", kind: "action" },
    PRESERVE_CONTEXT: { label: "Keep the current context", utterance: "Never mind.", kind: "action" },
    NO_SAFE_ACTION: { label: "Do nothing yet", utterance: "What can you tell me safely?", kind: "action" },
  };
  return freeze(map[action]);
}

export function planEcaExecutiveConversationAction(
  input: EcaExecutiveActionPlanInput,
): EcaConversationActionPlan {
  const context = input.workingContext;
  const activeProposal = input.activeProposal ?? context.mutationProposal;
  const intent = inferExecutiveIntent(
    input.utterance,
    context.managerContext.meaning,
    context,
    activeProposal ?? null,
  );
  const ambiguity = context.unresolved.some((item) => /ambiguous/i.test(item));
  const subjects = ambiguity
    ? freeze<EcaSubject[]>([])
    : ["COMPARE", "EVALUATE", "ASK_WHAT_IF"].includes(intent) && context.decisionContext.comparisonSubjects.length >= 2
      ? context.decisionContext.comparisonSubjects
      : explicitSubjects(context);
  const evidenceAvailability = input.evidenceAvailability ?? (
    context.activeDataSource?.evidenceRefs.length
      ? "AVAILABLE"
      : context.activeDataSource
        ? "MISSING_AND_REQUIRED"
        : "MISSING_BUT_OPTIONAL"
  );
  const lifecycle = input.lifecycle ?? {};
  const requiredContext: EcaActionContextRequirement[] = [];
  const alternatives: EcaConversationAction[] = [];
  const uncertaintyReasons = [...context.unresolved];
  let nextAction: EcaConversationAction = "ANSWER";
  let authorityTarget: EcaCanonicalAuthorityTarget | null = "NEX-CONV Conversation Kernel";
  let requiresClarification = false;
  let requiresConfirmation = false;
  let objective: string | null = subjects[0]?.label ?? null;
  let rationale = "The explicit current request is answerable from the certified ECA:1 context.";

  if (ambiguity) {
    nextAction = "ASK_CLARIFICATION";
    authorityTarget = null;
    requiresClarification = true;
    requiredContext.push(requirement("SUBJECT", "AMBIGUOUS", context.references.filter((item) => item.role === "AMBIGUOUS_CANDIDATE").map((item) => item.subject.id)));
    rationale = "ECA:1 reports multiple plausible referents, so the planner preserves ambiguity instead of selecting a target.";
  } else {
    switch (intent) {
      case "EXPLAIN": nextAction = "EXPLAIN"; break;
      case "UNDERSTAND": nextAction = "ANSWER"; break;
      case "INSPECT_EVIDENCE":
        nextAction = "SHOW_EVIDENCE";
        requiredContext.push(requirement("EVIDENCE", evidenceAvailability, context.activeDataSource?.evidenceRefs ?? []));
        break;
      case "LOCATE": nextAction = "LOCATE"; break;
      case "SHOW": nextAction = "SHOW"; break;
      case "COUNT": nextAction = "COUNT"; break;
      case "SUMMARIZE": nextAction = "SUMMARIZE"; break;
      case "INVESTIGATE":
        nextAction = evidenceAvailability === "AVAILABLE" ? "SHOW_EVIDENCE" : "RECOMMEND_INVESTIGATION";
        requiredContext.push(requirement("EVIDENCE", evidenceAvailability, context.activeDataSource?.evidenceRefs ?? []));
        if (evidenceAvailability === "AVAILABLE") alternatives.push("COMPARE");
        uncertaintyReasons.push("No causal claim is established by the conversation plan.");
        rationale = "The request is investigation-oriented; evidence may be inspected without converting correlation into cause.";
        break;
      case "COMPARE":
      case "EVALUATE":
      case "ASK_WHAT_IF": {
        const comparison = context.decisionContext.comparisonSubjects;
        const available = comparison.length >= 2;
        requiredContext.push(requirement("COMPARISON_SET", available ? "AVAILABLE" : "MISSING_AND_REQUIRED", comparison.map((item) => item.id)));
        nextAction = available ? (intent === "COMPARE" ? "COMPARE" : "EVALUATE") : "ASK_FOR_MISSING_INFORMATION";
        authorityTarget = available ? "Decision Theatre Comparison" : null;
        requiresClarification = !available;
        objective = criterionFor(input.utterance, context.decisionContext.criterion);
        rationale = available
          ? "The active canonical comparison set is preserved while the current request supplies the comparison purpose or criterion."
          : "Comparison requires two canonical candidates; the planner will not manufacture or rank missing options.";
        break;
      }
      case "PRIORITIZE":
        requiredContext.push(requirement("EVIDENCE", evidenceAvailability, context.activeDataSource?.evidenceRefs ?? []));
        nextAction = evidenceAvailability === "AVAILABLE" ? "EVALUATE" : "SHOW_UNCERTAINTY";
        if (evidenceAvailability !== "AVAILABLE") alternatives.push("ASK_FOR_MISSING_INFORMATION");
        rationale = "A priority ranking is only safe with comparable evidence.";
        break;
      case "SEEK_RECOMMENDATION":
        requiredContext.push(requirement("EVIDENCE", evidenceAvailability, context.activeDataSource?.evidenceRefs ?? []));
        nextAction = evidenceAvailability === "AVAILABLE" ? "RECOMMEND_OPTION" : "RECOMMEND_INVESTIGATION";
        if (evidenceAvailability !== "AVAILABLE") alternatives.push("ASK_FOR_MISSING_INFORMATION");
        rationale = "A recommendation remains advice and never becomes a Decision commitment.";
        break;
      case "PROPOSE_CHANGE":
        nextAction = "PREPARE_PROPOSAL";
        authorityTarget = activeProposal?.targetType === "RISK" ? "Canonical Risk Writer" : null;
        requiresConfirmation = true;
        alternatives.push("ASK_CONFIRMATION");
        requiredContext.push(requirement("ACTIVE_PROPOSAL", activeProposal ? "AVAILABLE" : "MISSING_AND_REQUIRED", activeProposal ? [activeProposal.proposalId] : []));
        rationale = "The existing ECA:1 proposal is reused and remains non-executable until explicit confirmation.";
        break;
      case "CONFIRM_ACTION":
        requiredContext.push(requirement("ACTIVE_PROPOSAL", activeProposal ? "AVAILABLE" : "MISSING_AND_REQUIRED", activeProposal ? [activeProposal.proposalId] : []));
        nextAction = activeProposal ? "HANDOFF_TO_CANONICAL_AUTHORITY" : "NO_SAFE_ACTION";
        authorityTarget = activeProposal?.targetType === "RISK" ? "Canonical Risk Writer" : null;
        requiresClarification = !activeProposal;
        rationale = activeProposal
          ? "Confirmation is bound to the active proposal and routed to its existing canonical authority."
          : "A confirmation without an active proposal cannot be executed or attached to stale context.";
        break;
      case "CANCEL_ACTION":
        requiredContext.push(requirement("ACTIVE_PROPOSAL", activeProposal ? "AVAILABLE" : "MISSING_AND_REQUIRED", activeProposal ? [activeProposal.proposalId] : []));
        nextAction = activeProposal ? "PRESERVE_CONTEXT" : "NO_SAFE_ACTION";
        authorityTarget = null;
        rationale = "Cancellation clears session proposal context and never calls a business writer.";
        break;
      case "REVIEW_DECISION":
        nextAction = "SHOW";
        authorityTarget = "CC:10 Decision Commitment";
        break;
      case "COMMIT_DECISION":
        nextAction = "HANDOFF_TO_CANONICAL_AUTHORITY";
        authorityTarget = "CC:10 Decision Commitment";
        requiresConfirmation = true;
        rationale = "Commitment intent is routed to CC:10; the planner cannot create or approve a Decision.";
        break;
      case "REVIEW_EXECUTION":
        nextAction = "SHOW";
        authorityTarget = "CC:11 Execution Follow-up";
        requiredContext.push(requirement("EXECUTION", lifecycle.executionId ? "AVAILABLE" : "MISSING_AND_REQUIRED", lifecycle.executionId ? [lifecycle.executionId] : []));
        break;
      case "REQUEST_EXECUTION_ACTION":
        requiredContext.push(requirement("COMMITTED_DECISION", lifecycle.committedDecisionId ? "AVAILABLE" : "MISSING_AND_REQUIRED", lifecycle.committedDecisionId ? [lifecycle.committedDecisionId] : []));
        nextAction = lifecycle.committedDecisionId ? "HANDOFF_TO_CANONICAL_AUTHORITY" : "ASK_FOR_MISSING_INFORMATION";
        authorityTarget = lifecycle.committedDecisionId ? "CC:11 Execution Follow-up" : "CC:10 Decision Commitment";
        requiresClarification = !lifecycle.committedDecisionId;
        rationale = lifecycle.committedDecisionId
          ? "Execution intent is routed to CC:11 with an existing committed Decision prerequisite."
          : "Execution cannot start until the canonical Decision authority supplies a committed Decision.";
        break;
      case "REVIEW_OUTCOME":
        requiredContext.push(requirement("OUTCOME", lifecycle.outcomeId ? "AVAILABLE" : "MISSING_BUT_OPTIONAL", lifecycle.outcomeId ? [lifecycle.outcomeId] : []));
        requiredContext.push(requirement("EXECUTION", lifecycle.executionId ? "AVAILABLE" : "MISSING_AND_REQUIRED", lifecycle.executionId ? [lifecycle.executionId] : []));
        nextAction = lifecycle.executionId ? "SHOW" : "ASK_FOR_MISSING_INFORMATION";
        authorityTarget = "Decision Theatre Outcome Intelligence";
        uncertaintyReasons.push("Observed improvement alone does not establish Decision causality.");
        break;
      case "REASSESS":
        nextAction = "RECOMMEND_INVESTIGATION";
        authorityTarget = "Decision Theatre Learning/Reassessment";
        uncertaintyReasons.push("Reassessment does not create Learning or change the Decision.");
        break;
      case "CORRECT_CONTEXT": nextAction = "PRESERVE_CONTEXT"; break;
      case "CLARIFY":
        nextAction = "ASK_CLARIFICATION";
        requiresClarification = true;
        authorityTarget = null;
        break;
      case "EXPLORE_SCENARIO": nextAction = "EVALUATE"; authorityTarget = "Decision Theatre Comparison"; break;
      case "UNKNOWN":
        nextAction = "ASK_CLARIFICATION";
        requiresClarification = true;
        authorityTarget = null;
        break;
    }
  }

  const unconfirmedSemantics = context.activeDataSource != null &&
    context.activeDataSource.semanticStatus !== "CONFIRMED";
  if (unconfirmedSemantics && context.activeDataSource && /\bcap_av\b/i.test(input.utterance)) {
    requiredContext.push(requirement("DATA_SEMANTICS", "AMBIGUOUS", [context.activeDataSource.fieldId]));
    uncertaintyReasons.push("CAP_AV semantics are proposed, not manager-confirmed.");
    if (intent === "EVALUATE" || intent === "PRIORITIZE" || intent === "SEEK_RECOMMENDATION" || intent === "UNDERSTAND") {
      nextAction = "SHOW_UNCERTAINTY";
      authorityTarget = "DATA-ADV/Data Reality";
      if (!alternatives.includes("ASK_FOR_MISSING_INFORMATION")) alternatives.push("ASK_FOR_MISSING_INFORMATION");
    }
  }

  if (subjects.length === 0 && !requiresClarification && ["UNDERSTAND", "EXPLAIN", "INVESTIGATE", "INSPECT_EVIDENCE", "LOCATE"].includes(intent)) {
    requiredContext.push(requirement("SUBJECT", "MISSING_AND_REQUIRED"));
    nextAction = "ASK_FOR_MISSING_INFORMATION";
    requiresClarification = true;
    rationale = "The requested action needs a canonical subject, and ECA:1 supplies none.";
  }

  const role = (context.managerContext.role ?? "").toLowerCase();
  if (role && intent === "SEEK_RECOMMENDATION" && alternatives.length < 2) {
    if (/\b(?:ceo|executive|board)\b/.test(role) && !alternatives.includes("COMPARE")) alternatives.push("COMPARE");
    if (/\b(?:operations|ops|project)\b/.test(role) && !alternatives.includes("SHOW_EVIDENCE")) alternatives.push("SHOW_EVIDENCE");
  }

  const boundedAlternatives = freeze(alternatives.slice(0, 2));
  const answerSuggestions = nextAction === "ASK_CLARIFICATION"
    ? context.continuation.options.slice(0, 2).map((option) => freeze({
        label: option,
        utterance: option,
        kind: "answer" as const,
      }))
    : [];
  const suggestedManagerTurns = freeze([
    ...answerSuggestions,
    suggestedTurn(nextAction, subjects),
    ...boundedAlternatives.map((action) => suggestedTurn(action, subjects)),
  ].slice(0, 3));

  return freeze({
    identity: ECA_EXECUTIVE_ACTION_PLAN_IDENTITY,
    intent,
    subjects: freeze([...subjects]),
    objective,
    requiredContext: freeze(requiredContext),
    nextAction,
    alternatives: boundedAlternatives,
    suggestedManagerTurns,
    requiresClarification,
    requiresConfirmation,
    authorityTarget,
    uncertainty: freeze({
      level: uncertaintyReasons.length > 0 ? (context.confidence === "HIGH" ? "MEDIUM" : context.confidence) : context.confidence,
      reasons: freeze(uncertaintyReasons),
    }),
    provenance: freeze({
      sources: freeze([
        "NPA-T ECA:1/WorkingConversationContext",
        ...(context.managerContext.meaning ? ["NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding"] : []),
        ...(context.businessContext.projectId || context.managerContext.role
          ? ["ECA:1 BCA business/role context"]
          : []),
        ...context.provenance,
      ]),
      rationale,
    }),
    boundaries: BOUNDARIES,
  });
}
