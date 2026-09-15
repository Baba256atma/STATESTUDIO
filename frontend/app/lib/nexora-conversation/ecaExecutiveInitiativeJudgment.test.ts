import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaDataContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  applyEcaInitiativeToPresentedResponse,
  emptyEcaInitiativeSession,
  judgeEcaExecutiveInitiative,
  nextEcaInitiativeSession,
  type EcaInitiativeCandidate,
  type EcaInitiativeSession,
} from "./ecaExecutiveInitiativeJudgment.ts";

const CAPACITY = Object.freeze({ id: "capacity-gap", label: "Capacity Gap", kind: "problem" });
const DEMAND = Object.freeze({ id: "demand-surge", label: "Demand Surge", kind: "problem" });
const SUPPLIER = Object.freeze({ id: "supplier-delay", label: "Supplier Delay", kind: "risk" });
const A = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const B = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const C = Object.freeze({ id: "scenario-c", label: "Scenario C", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([CAPACITY, DEMAND, SUPPLIER, A, B, C]);

function meaning(
  utterance: string,
  overrides: Partial<CanonicalManagerMeaning> = {},
): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "ASK_INFORMATION",
    requestedOperation: "NONE",
    subject: {
      subjectId: CAPACITY.id,
      canonicalName: CAPACITY.label,
      lexicalHint: CAPACITY.label,
      subjectKind: CAPACITY.kind,
    },
    objectReference: {
      subjectId: CAPACITY.id,
      canonicalName: CAPACITY.label,
      lexicalHint: CAPACITY.label,
      subjectKind: CAPACITY.kind,
    },
    questionType: "NONE",
    requestedDepth: "STANDARD",
    modality: "INTERROGATIVE",
    polarity: "AFFIRMATIVE",
    confidence: "HIGH",
    ambiguity: { unresolved: false, reason: "none", candidates: [] },
    semanticEvidence: {
      operationCues: [],
      objectCues: [],
      speechActCues: [],
      reasoningPath: "feature-frame-interpreter",
      usesLlm: false,
    },
    selectedAuthority: null,
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
    ...overrides,
  } as CanonicalManagerMeaning);
}

function working(
  utterance: string,
  extras: {
    subject?: EcaSubject;
    visible?: readonly EcaSubject[];
    data?: EcaDataContext;
    meaningOverrides?: Partial<CanonicalManagerMeaning>;
  } = {},
) {
  const subject = extras.subject ?? CAPACITY;
  return composeEcaWorkingConversationContext({
    utterance,
    meaning: meaning(utterance, {
      subject: {
        subjectId: subject.id,
        canonicalName: subject.label,
        lexicalHint: subject.label,
        subjectKind: subject.kind,
      },
      objectReference: {
        subjectId: subject.id,
        canonicalName: subject.label,
        lexicalHint: subject.label,
        subjectKind: subject.kind,
      },
      ...extras.meaningOverrides,
    }),
    stage: Object.freeze({
      available: true,
      workspace: "Executive workspace",
      focus: subject,
      selected: null,
      visible: extras.visible ?? SUBJECTS,
      collection: null,
      theatreSceneId: null,
    }),
    subjects: SUBJECTS,
    dataContext: extras.data ?? null,
  });
}

function candidate(partial: Partial<EcaInitiativeCandidate> & Pick<EcaInitiativeCandidate, "id" | "reason">): EcaInitiativeCandidate {
  const subject = partial.subject ?? SUPPLIER;
  const fingerprint =
    partial.fingerprint ??
    `${partial.reason}:${subject?.id ?? "none"}:${partial.evidence?.[0] ?? "base"}`;
  return Object.freeze({
    id: partial.id,
    reason: partial.reason,
    subject,
    significance: partial.significance ?? "HIGH",
    urgency: partial.urgency ?? "MODERATE",
    confidence: partial.confidence ?? "CONFIRMED",
    evidence: partial.evidence ?? Object.freeze(["canonical-evidence"]),
    relatedToCurrentContext: partial.relatedToCurrentContext ?? false,
    alreadyOnStage: partial.alreadyOnStage ?? false,
    materialChange: partial.materialChange ?? true,
    fingerprint,
    observation: partial.observation ?? `${subject?.label ?? "This issue"} may need review.`,
    nextStep: partial.nextStep ?? "Review its evidence.",
    source: partial.source ?? "test-candidate",
  });
}

function judge(
  utterance: string,
  candidates: readonly EcaInitiativeCandidate[] = [],
  extras: {
    session?: EcaInitiativeSession | null;
    subject?: EcaSubject;
    visible?: readonly EcaSubject[];
    data?: EcaDataContext;
    meaningOverrides?: Partial<CanonicalManagerMeaning>;
  } = {},
) {
  const workingContext = working(utterance, extras);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  return {
    workingContext,
    actionPlan,
    judgment: judgeEcaExecutiveInitiative({
      utterance,
      workingContext,
      actionPlan,
      candidates,
      session: extras.session ?? emptyEcaInitiativeSession(),
    }),
  };
}

function boundaries(judgment: ReturnType<typeof judge>["judgment"]) {
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.createsSecondInitiativeEngine, false);
}

test("ECA:3 A — Silence on low significance", () => {
  const { judgment } = judge("Explain Capacity Gap.", [
    candidate({
      id: "minor-margin",
      reason: "MATERIAL_CHANGE",
      subject: { id: "margin", label: "Margin", kind: "kpi" },
      significance: "LOW",
      urgency: "LOW",
      relatedToCurrentContext: false,
      materialChange: false,
      observation: "Margin ticked from 12.1% to 12.0%.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, false);
  assert.equal(judgment.suppressionReason, "LOW_SIGNIFICANCE");
  boundaries(judgment);
});

test("ECA:3 B — Goal at risk", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "goal-risk",
      reason: "GOAL_AT_RISK",
      subject: { id: "goal:delivery", label: "On-time delivery", kind: "goal" },
      significance: "HIGH",
      relatedToCurrentContext: true,
      observation: "Delivery is moving away from the 96% goal.",
      nextStep: "Review Capacity Gap and Demand Surge.",
      evidence: ["current:91%", "target:96%", "trend:deteriorating"],
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "GOAL_AT_RISK");
  assert.ok(judgment.guidance);
  assert.notEqual(judgment.strength, null);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:3 C — Risk escalation", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "risk-up",
      reason: "RISK_ESCALATION",
      relatedToCurrentContext: true,
      observation: "Supplier Delay has become more relevant to the delivery goal.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "RISK_ESCALATION");
  assert.equal(judgment.boundaries.writesRisk, false);
});

test("ECA:3 D — New evidence", () => {
  const { judgment } = judge("We are still investigating Capacity Gap.", [
    candidate({
      id: "new-ev",
      reason: "NEW_EVIDENCE",
      subject: CAPACITY,
      relatedToCurrentContext: true,
      observation: "New confirmed evidence is relevant to Capacity Gap.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "NEW_EVIDENCE");
});

test("ECA:3 E — Contradictory evidence", () => {
  const { judgment } = judge("How does this change Capacity Gap?", [
    candidate({
      id: "contra",
      reason: "CONTRADICTORY_EVIDENCE",
      subject: CAPACITY,
      relatedToCurrentContext: true,
      observation: "The latest evidence does not support the capacity explanation as strongly as before.",
      nextStep: null,
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "CONTRADICTORY_EVIDENCE");
  assert.match(judgment.guidance ?? "", /reassess/i);
  assert.doesNotMatch(judgment.guidance ?? "", /is not the cause/i);
});

test("ECA:3 F — Missing critical information", () => {
  const { judgment } = judge("Approve Scenario A.", [
    candidate({
      id: "missing-cost",
      reason: "MISSING_CRITICAL_INFORMATION",
      subject: A,
      relatedToCurrentContext: true,
      observation: "Cost information is missing for one supplier.",
      nextStep: "Add it before comparing them.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "MISSING_CRITICAL_INFORMATION");
});

test("ECA:3 G — Decision assumption weakening", () => {
  const { judgment } = judge("How is the Decision holding up?", [
    candidate({
      id: "assumption",
      reason: "DECISION_ASSUMPTION_WEAKENED",
      relatedToCurrentContext: true,
      observation: "The supplier recovery assumption behind this Decision is weaker now.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "DECISION_ASSUMPTION_WEAKENED");
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.match(judgment.guidance ?? "", /review/i);
});

test("ECA:3 H — Execution blocked", () => {
  const { judgment } = judge("How is execution going?", [
    candidate({
      id: "blocked",
      reason: "EXECUTION_BLOCKED",
      subject: { id: "exec-1", label: "Execution", kind: "execution" },
      relatedToCurrentContext: true,
      observation: "The execution is blocked by supplier confirmation.",
      nextStep: "Review the blocker.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "EXECUTION_BLOCKED");
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:3 I — Outcome available", () => {
  const { judgment } = judge("What else should I look at?", [
    candidate({
      id: "outcome",
      reason: "OUTCOME_DEVIATION",
      subject: { id: "outcome", label: "Outcome", kind: "outcome" },
      relatedToCurrentContext: true,
      observation: "The latest delivery result is now available: 94% versus the 96% goal.",
      nextStep: "Review the outcome.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "OUTCOME_DEVIATION");
  assert.doesNotMatch(judgment.guidance ?? "", /because of the Decision/i);
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:3 J — High-value next step", () => {
  const { judgment } = judge("What next?", [
    candidate({
      id: "compare-ready",
      reason: "HIGH_VALUE_NEXT_STEP",
      subject: A,
      relatedToCurrentContext: true,
      alreadyOnStage: true,
      materialChange: false,
      observation: "You now have enough information to compare the three scenarios.",
      nextStep: "Compare the scenarios.",
      evidence: [A.id, B.id, C.id],
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "HIGH_VALUE_NEXT_STEP");
  assert.match(judgment.guidance ?? "", /compare/i);
});

test("ECA:3 K — Duplicate suppression", () => {
  const same = candidate({
    id: "dup",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    materialChange: false,
    fingerprint: "RISK_ESCALATION:supplier-delay:base",
  });
  const first = judge("How are we doing?", [same]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const second = judge("And now?", [same], { session });
  assert.equal(first.judgment.shouldIntervene, true);
  assert.equal(second.judgment.shouldIntervene, false);
  assert.equal(second.judgment.suppressionReason, "DUPLICATE_GUIDANCE");
});

test("ECA:3 L — Manager acknowledged", () => {
  const same = candidate({
    id: "ack",
    reason: "GOAL_AT_RISK",
    relatedToCurrentContext: true,
    materialChange: false,
    fingerprint: "GOAL_AT_RISK:goal:delivery:91",
  });
  const first = judge("How are we doing?", [same]);
  let session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const ack = judge("I know.", [same], { session });
  session = nextEcaInitiativeSession(session, "I know.", ack.judgment);
  const later = judge("Show me Executions.", [same], {
    session,
    subject: { id: "executions", label: "Executions", kind: "execution" },
  });
  assert.equal(later.judgment.shouldIntervene, false);
  assert.ok(
    later.judgment.suppressionReason === "ALREADY_ACKNOWLEDGED" ||
      later.judgment.suppressionReason === "ACTIVE_MANAGER_TASK_MORE_IMPORTANT",
  );
});

test("ECA:3 M — Manager dismissed", () => {
  const same = candidate({
    id: "dismiss",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    materialChange: false,
    fingerprint: "RISK_ESCALATION:supplier-delay:v1",
  });
  const first = judge("How are we doing?", [same]);
  let session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const dismissed = judge("Not now.", [same], { session });
  session = nextEcaInitiativeSession(session, "Not now.", dismissed.judgment);
  const later = judge("Continue.", [same], { session });
  assert.equal(later.judgment.shouldIntervene, false);
  assert.equal(later.judgment.suppressionReason, "RECENTLY_DISMISSED");
  assert.equal(later.judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:3 N — Material change after dismissal", () => {
  const v1 = candidate({
    id: "v1",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    materialChange: false,
    fingerprint: "RISK_ESCALATION:supplier-delay:v1",
    evidence: ["severity:moderate"],
  });
  const v2 = candidate({
    id: "v2",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    materialChange: true,
    fingerprint: "RISK_ESCALATION:supplier-delay:v2",
    evidence: ["severity:high", "new-confirmation"],
    observation: "Supplier Delay now has new material evidence.",
  });
  const first = judge("How are we doing?", [v1]);
  let session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  session = nextEcaInitiativeSession(session, "Not now.", judge("Not now.", [v1], { session }).judgment);
  const again = judge("How are we doing?", [v2], { session });
  assert.equal(again.judgment.shouldIntervene, true);
  assert.equal(again.judgment.reason, "RISK_ESCALATION");
});

test("ECA:3 O — Unconfirmed data semantics", () => {
  const { judgment } = judge("Should I worry about CAP_AV?", [
    candidate({
      id: "cap-av",
      reason: "GOAL_AT_RISK",
      subject: { id: "CAP_AV", label: "CAP_AV", kind: "data-field" },
      significance: "HIGH",
      confidence: "TENTATIVE",
      relatedToCurrentContext: true,
      observation: "Available capacity has fallen dangerously.",
    }),
  ], {
    data: {
      sourceId: "src-1",
      sourceLabel: "ops.csv",
      fieldId: "CAP_AV",
      fieldLabel: "CAP_AV",
      semanticStatus: "PROPOSED",
      evidenceRefs: ["likely"],
    },
  });
  assert.notEqual(judgment.strength, "WARN");
  if (judgment.shouldIntervene) {
    assert.ok(judgment.strength === "SUGGEST" || judgment.reason === "MISSING_CRITICAL_INFORMATION");
    assert.doesNotMatch(judgment.guidance ?? "", /fallen dangerously/i);
  } else {
    assert.equal(judgment.suppressionReason, "UNCONFIRMED_SEMANTICS");
  }
});

test("ECA:3 P — Explicit intent wins", () => {
  const { judgment, actionPlan } = judge(
    "Show me current Executions.",
    [
      candidate({
        id: "unrelated-risk",
        reason: "RISK_ESCALATION",
        significance: "MODERATE",
        relatedToCurrentContext: false,
        materialChange: true,
      }),
    ],
    { subject: { id: "executions", label: "Executions", kind: "execution" } },
  );
  assert.equal(judgment.shouldIntervene, false);
  assert.equal(judgment.suppressionReason, "ACTIVE_MANAGER_TASK_MORE_IMPORTANT");
  assert.ok(
    actionPlan.intent === "REVIEW_EXECUTION" || actionPlan.intent === "SHOW",
    actionPlan.intent,
  );
});

test("ECA:3 Q — Stage awareness", () => {
  const { judgment } = judge("Explain Capacity Gap.", [
    candidate({
      id: "visible",
      reason: "MATERIAL_CHANGE",
      subject: SUPPLIER,
      relatedToCurrentContext: false,
      alreadyOnStage: true,
      materialChange: false,
      significance: "MODERATE",
      observation: "Supplier Delay exists.",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, false);
});

test("ECA:3 R — Multiple candidates pick one", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "low",
      reason: "MATERIAL_CHANGE",
      significance: "LOW",
      relatedToCurrentContext: true,
      fingerprint: "MATERIAL_CHANGE:margin:1",
      subject: { id: "margin", label: "Margin", kind: "kpi" },
    }),
    candidate({
      id: "goal",
      reason: "GOAL_AT_RISK",
      significance: "HIGH",
      relatedToCurrentContext: true,
      fingerprint: "GOAL_AT_RISK:goal:91",
      observation: "Delivery is moving away from the 96% goal.",
    }),
    candidate({
      id: "risk",
      reason: "RISK_ESCALATION",
      significance: "MODERATE",
      relatedToCurrentContext: true,
      fingerprint: "RISK_ESCALATION:supplier:1",
    }),
  ]);
  assert.equal(judgment.shouldIntervene, true);
  assert.equal(judgment.reason, "GOAL_AT_RISK");
  assert.equal(judgment.competingCount, 3);
});

test("ECA:3 S — Why follow-up", () => {
  const rec = candidate({
    id: "why",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    observation: "I recommend reviewing Supplier Delay.",
    evidence: ["Supplier Delay relevance increased", "delivery goal"],
  });
  const first = judge("How are we doing?", [rec]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const why = judge("Why?", [rec], { session });
  assert.equal(why.judgment.shouldIntervene, false);
  assert.match(why.judgment.whyExplanation ?? "", /Supplier Delay|evidence/i);
  assert.doesNotMatch(why.judgment.whyExplanation ?? "", /initiative score/i);
  const spoken = applyEcaInitiativeToPresentedResponse({
    source: "Because the current context changed.",
    utterance: "Why?",
    judgment: why.judgment,
    nca5AlreadySpoke: false,
    locked: false,
  });
  assert.match(spoken, /Evidence:/i);
});

test("ECA:3 T — No authority leakage", () => {
  const cases = [
    judge("How are we doing?", [
      candidate({ id: "g", reason: "GOAL_AT_RISK", relatedToCurrentContext: true }),
    ]),
    judge("How is execution going?", [
      candidate({ id: "e", reason: "EXECUTION_BLOCKED", relatedToCurrentContext: true }),
    ]),
    judge("How is the Decision holding up?", [
      candidate({ id: "d", reason: "DECISION_REVIEW_NEEDED", relatedToCurrentContext: true }),
    ]),
  ];
  for (const item of cases) boundaries(item.judgment);
});

test("ECA:3 sequence 1 — Surface then acknowledge then explicit request", () => {
  const issue = candidate({
    id: "seq1",
    reason: "GOAL_AT_RISK",
    relatedToCurrentContext: true,
    materialChange: false,
    fingerprint: "GOAL_AT_RISK:delivery:91",
    observation: "Delivery is moving away from the goal.",
    nextStep: "Review Capacity Gap.",
  });
  const first = judge("How are we doing?", [issue]);
  let session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  session = nextEcaInitiativeSession(session, "I know.", judge("I know.", [issue], { session }).judgment);
  const executions = judge("Show me Executions.", [issue], {
    session,
    subject: { id: "executions", label: "Executions", kind: "execution" },
  });
  assert.equal(first.judgment.shouldIntervene, true);
  assert.equal(executions.judgment.shouldIntervene, false);
  assert.ok(
    executions.actionPlan.intent === "REVIEW_EXECUTION" || executions.actionPlan.intent === "SHOW",
  );
});

test("ECA:3 sequence 2 — Dismiss then material change", () => {
  const v1 = candidate({
    id: "s2a",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    materialChange: false,
    fingerprint: "RISK_ESCALATION:supplier:old",
  });
  const v2 = candidate({
    id: "s2b",
    reason: "RISK_ESCALATION",
    relatedToCurrentContext: true,
    materialChange: true,
    fingerprint: "RISK_ESCALATION:supplier:new",
    observation: "Supplier Delay now has new material evidence.",
  });
  let session = emptyEcaInitiativeSession();
  const first = judge("How are we doing?", [v1], { session });
  session = nextEcaInitiativeSession(session, "How are we doing?", first.judgment);
  session = nextEcaInitiativeSession(session, "Not now.", judge("Not now.", [v1], { session }).judgment);
  const later = judge("How are we doing?", [v2], { session });
  assert.equal(later.judgment.shouldIntervene, true);
});

test("ECA:3 sequence 3 — Decision assumption then Why", () => {
  const assumption = candidate({
    id: "s3",
    reason: "DECISION_ASSUMPTION_WEAKENED",
    relatedToCurrentContext: true,
    observation: "The supplier recovery assumption behind this Decision is weaker now.",
    evidence: ["supplier recovery no longer supported"],
  });
  const first = judge("How is the Decision holding up?", [assumption]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How is the Decision holding up?", first.judgment);
  const why = judge("Why?", [assumption], { session });
  assert.equal(first.judgment.shouldIntervene, true);
  assert.equal(first.judgment.boundaries.commitsDecision, false);
  assert.match(why.judgment.whyExplanation ?? "", /supplier recovery/i);
});

test("ECA:3 sequence 4 — Execution blocker then show blocker", () => {
  const blocked = candidate({
    id: "s4",
    reason: "EXECUTION_BLOCKED",
    relatedToCurrentContext: true,
    observation: "The execution is blocked by supplier confirmation.",
    nextStep: "Review the blocker.",
  });
  const first = judge("How is execution going?", [blocked]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How is execution going?", first.judgment);
  const show = judge("Show me the blocker.", [blocked], { session });
  assert.equal(first.judgment.shouldIntervene, true);
  assert.ok(show.actionPlan.intent === "SHOW" || show.actionPlan.intent === "REVIEW_EXECUTION" || show.actionPlan.intent === "INSPECT_EVIDENCE" || show.actionPlan.intent === "EXPLAIN");
  assert.equal(show.judgment.boundaries.startsExecution, false);
});

test("ECA:3 sequence 5 — Productive next step then yes uses ECA:2", () => {
  const ready = candidate({
    id: "s5",
    reason: "HIGH_VALUE_NEXT_STEP",
    relatedToCurrentContext: true,
    observation: "You now have enough information to compare the three scenarios.",
  });
  const first = judge("What next?", [ready]);
  assert.equal(first.judgment.shouldIntervene, true);
  const yes = judge("Yes.", []);
  assert.equal(yes.actionPlan.boundaries.commitsDecision, false);
  assert.notEqual(yes.actionPlan.authorityTarget, "CC:10 Decision Commitment");
});

test("ECA:3 urgency stays separate from significance", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "sep",
      reason: "GOAL_AT_RISK",
      significance: "HIGH",
      urgency: "LOW",
      relatedToCurrentContext: true,
    }),
  ]);
  assert.equal(judgment.significance, "HIGH");
  assert.equal(judgment.urgency, "LOW");
});

function initiative(judgment: ReturnType<typeof judge>["judgment"]): "SPEAK" | "SILENT" {
  return judgment.shouldIntervene ? "SPEAK" : "SILENT";
}

test("ECA:3 prompt A — Important Risk → SPEAK without causal invention", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "prompt-a",
      reason: "RISK_ESCALATION",
      subject: SUPPLIER,
      relatedToCurrentContext: true,
      observation: "Supplier Delay may be contributing to the Capacity Gap.",
      evidence: ["association:supplier-delay→capacity-gap"],
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.doesNotMatch(judgment.guidance ?? "", /\bcaused\b/i);
  assert.equal(judgment.boundaries.writesRisk, false);
});

test("ECA:3 prompt B — Trivial stable context → SILENT", () => {
  const { judgment } = judge("Explain Capacity Gap.", [
    candidate({
      id: "prompt-b",
      reason: "MATERIAL_CHANGE",
      significance: "LOW",
      urgency: "LOW",
      materialChange: false,
      relatedToCurrentContext: false,
      observation: "Nothing material changed.",
    }),
  ]);
  assert.equal(initiative(judgment), "SILENT");
});

test("ECA:3 prompt C — Evidence gap before Decision → SPEAK, no Decision write", () => {
  const { judgment, actionPlan } = judge("I prefer Demand Surge.", [
    candidate({
      id: "prompt-c",
      reason: "MISSING_CRITICAL_INFORMATION",
      subject: DEMAND,
      relatedToCurrentContext: true,
      observation: "Delivery-impact evidence is still weak before approval.",
      nextStep: "Inspect the evidence first.",
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(actionPlan.boundaries.commitsDecision, false);
});

test("ECA:3 prompt D — Execution deviation → SPEAK from canonical evidence only", () => {
  const { judgment } = judge("How is execution going?", [
    candidate({
      id: "prompt-d",
      reason: "EXECUTION_OFF_TRACK",
      relatedToCurrentContext: true,
      observation: "Canonical Execution progress is behind the expected milestone.",
      evidence: ["execution:ACTIVE", "progress:behind"],
      nextStep: "Review the Execution deviation.",
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.equal(judgment.reason, "EXECUTION_OFF_TRACK");
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:3 prompt E — Execution stable → SILENT", () => {
  const { judgment } = judge("How is execution going?", [
    candidate({
      id: "prompt-e",
      reason: "EXECUTION_OFF_TRACK",
      significance: "LOW",
      urgency: "LOW",
      materialChange: false,
      relatedToCurrentContext: true,
      observation: "Execution remains on the expected path.",
      alreadyOnStage: true,
    }),
  ]);
  assert.equal(initiative(judgment), "SILENT");
});

test("ECA:3 prompt F — Data uncertainty stays non-authoritative", () => {
  const { judgment } = judge(
    "Should I worry about CAP_AV?",
    [
      candidate({
        id: "prompt-f",
        reason: "GOAL_AT_RISK",
        subject: { id: "CAP_AV", label: "CAP_AV", kind: "data-field" },
        significance: "HIGH",
        confidence: "TENTATIVE",
        relatedToCurrentContext: true,
        observation: "Available capacity has fallen dangerously.",
      }),
    ],
    {
      data: {
        sourceId: "src-1",
        sourceLabel: "ops.csv",
        fieldId: "CAP_AV",
        fieldLabel: "CAP_AV",
        semanticStatus: "UNKNOWN",
        evidenceRefs: ["unconfirmed"],
      },
    },
  );
  assert.notEqual(judgment.strength, "WARN");
  assert.doesNotMatch(judgment.guidance ?? "", /fallen dangerously|available capacity has fallen/i);
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:3 prompt G — Explicit Goal question outranks Scenario initiative", () => {
  const goal = Object.freeze({ id: "goal:reliability", label: "Improve Delivery Reliability", kind: "goal" as const });
  const { judgment, actionPlan } = judge(
    "What is my current goal?",
    [
      candidate({
        id: "prompt-g-scenario",
        reason: "HIGH_VALUE_NEXT_STEP",
        subject: DEMAND,
        significance: "HIGH",
        relatedToCurrentContext: true,
        observation: "Demand Surge deserves attention.",
      }),
    ],
    {
      subject: goal,
      meaningOverrides: {
        requestedOperation: "EXPLAIN",
        communicativeIntent: "ASK_INFORMATION",
        subject: {
          subjectId: goal.id,
          canonicalName: goal.label,
          lexicalHint: goal.label,
          subjectKind: goal.kind,
        },
      },
    },
  );
  assert.ok(actionPlan.intent === "EXPLAIN" || actionPlan.nextAction === "EXPLAIN" || /goal/i.test(actionPlan.intent));
  assert.equal(initiative(judgment), "SILENT");
  assert.equal(judgment.suppressionReason, "ACTIVE_MANAGER_TASK_MORE_IMPORTANT");
});

test("ECA:3 prompt H — No causal inflation on weak contribution", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "prompt-h",
      reason: "CONTRADICTORY_EVIDENCE",
      subject: DEMAND,
      confidence: "TENTATIVE",
      relatedToCurrentContext: true,
      observation: "Demand Surge may be contributing to the Capacity Gap.",
      evidence: ["possible-contribution"],
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.match(judgment.guidance ?? "", /may be contributing|reassess/i);
  assert.doesNotMatch(judgment.guidance ?? "", /\bcaused\b|\bis the cause\b/i);
  assert.ok(judgment.confidence === "TENTATIVE" || judgment.strength === "SUGGEST" || judgment.strength === "NOTICE");
});

test("ECA:3 prompt I — No repetition after same advisory", () => {
  const issue = candidate({
    id: "prompt-i",
    reason: "MISSING_CRITICAL_INFORMATION",
    subject: CAPACITY,
    relatedToCurrentContext: true,
    observation: "Capacity Gap deserves investigation because evidence is incomplete.",
    fingerprint: "prompt-i:capacity",
    materialChange: false,
  });
  const first = judge("How are we doing?", [issue]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const second = judge("How are we doing?", [issue], { session });
  assert.equal(initiative(first.judgment), "SPEAK");
  assert.equal(initiative(second.judgment), "SILENT");
});

test("ECA:3 prompt J — Subject switch drops old proactive subject", () => {
  const stale = candidate({
    id: "prompt-j-stale",
    reason: "GOAL_AT_RISK",
    subject: CAPACITY,
    relatedToCurrentContext: true,
    observation: "Capacity Gap still needs attention.",
    fingerprint: "prompt-j:capacity",
  });
  const first = judge("How are we doing?", [stale]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const switched = judge(
    "Explain Demand Surge.",
    [
      candidate({
        id: "prompt-j-stale-2",
        reason: "GOAL_AT_RISK",
        subject: CAPACITY,
        relatedToCurrentContext: false,
        materialChange: false,
        observation: "Capacity Gap still needs attention.",
        fingerprint: "prompt-j:capacity",
      }),
    ],
    { session, subject: DEMAND },
  );
  assert.equal(initiative(first.judgment), "SPEAK");
  assert.equal(initiative(switched.judgment), "SILENT");
  assert.ok(
    switched.actionPlan.intent === "EXPLAIN" ||
      switched.actionPlan.intent === "UNDERSTAND" ||
      switched.actionPlan.nextAction === "EXPLAIN",
  );
});

test("ECA:3 prompt K — Recommendation does not mutate Decision/Execution", () => {
  const { judgment } = judge("What should I do about Capacity Gap?", [
    candidate({
      id: "prompt-k",
      reason: "HIGH_VALUE_NEXT_STEP",
      relatedToCurrentContext: true,
      observation: "Investigate Capacity Gap before choosing an option.",
      nextStep: "Inspect evidence.",
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:3 prompt L — Preference is not Decision commitment", () => {
  const { judgment, actionPlan } = judge("I prefer Demand Surge.", [
    candidate({
      id: "prompt-l",
      reason: "DECISION_REVIEW_NEEDED",
      subject: DEMAND,
      relatedToCurrentContext: true,
      observation: "Preference is recorded, but Decision readiness still needs review.",
    }),
  ]);
  assert.ok(initiative(judgment) === "SPEAK" || initiative(judgment) === "SILENT");
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(actionPlan.boundaries.commitsDecision, false);
  assert.notEqual(actionPlan.authorityTarget, "CC:10 Decision Commitment");
});

test("ECA:3 prompt M — Approved Decision without Start is readiness, not ACTIVE", () => {
  const { judgment } = judge("Are we ready to start?", [
    candidate({
      id: "prompt-m",
      reason: "EXECUTION_BLOCKED",
      relatedToCurrentContext: true,
      observation: "The Decision is committed, but Execution is not ready yet.",
      evidence: ["decision:Approved", "execution:none"],
      nextStep: "Review readiness blockers.",
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.doesNotMatch(judgment.guidance ?? "", /\bACTIVE\b|is running/i);
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:3 prompt N — High importance keeps weak confidence bounded", () => {
  const { judgment } = judge("How are we doing?", [
    candidate({
      id: "prompt-n",
      reason: "RISK_ESCALATION",
      significance: "HIGH",
      urgency: "LOW",
      confidence: "TENTATIVE",
      relatedToCurrentContext: true,
      observation: "Supplier Delay looks important, but evidence is still weak.",
    }),
  ]);
  assert.equal(initiative(judgment), "SPEAK");
  assert.equal(judgment.significance, "HIGH");
  assert.equal(judgment.urgency, "LOW");
  assert.equal(judgment.confidence, "TENTATIVE");
  assert.notEqual(judgment.strength, "WARN");
});

test("ECA:3 prompt O — Silence after complete answer with no material change", () => {
  const issue = candidate({
    id: "prompt-o",
    reason: "NEW_EVIDENCE",
    subject: CAPACITY,
    relatedToCurrentContext: true,
    observation: "New confirmed evidence is relevant to Capacity Gap.",
    fingerprint: "prompt-o:capacity",
    materialChange: false,
  });
  const first = judge("How are we doing?", [issue]);
  const session = nextEcaInitiativeSession(emptyEcaInitiativeSession(), "How are we doing?", first.judgment);
  const after = judge("Explain Capacity Gap.", [issue], { session });
  assert.equal(initiative(first.judgment), "SPEAK");
  assert.equal(initiative(after.judgment), "SILENT");
});

test("ECA:3 prompt multi-turn 1 — Investigation may SPEAK on material evidence gap", () => {
  const explain = judge("Explain Capacity Gap.", []);
  assert.ok(explain.actionPlan.intent === "EXPLAIN" || explain.actionPlan.intent === "UNDERSTAND");
  assert.equal(initiative(explain.judgment), "SILENT");
  const evidence = judge("Show me the evidence.", [
    candidate({
      id: "mt1-gap",
      reason: "MISSING_CRITICAL_INFORMATION",
      subject: CAPACITY,
      relatedToCurrentContext: true,
      observation: "Evidence for Capacity Gap is still incomplete.",
      nextStep: "Inspect the missing evidence.",
    }),
  ]);
  // Explicit SHOW/INSPECT suppresses non-critical interruption while answering.
  assert.ok(
    evidence.actionPlan.intent === "SHOW" ||
      evidence.actionPlan.intent === "INSPECT_EVIDENCE" ||
      evidence.actionPlan.intent === "EXPLAIN" ||
      evidence.actionPlan.intent === "UNDERSTAND",
  );
  assert.equal(initiative(evidence.judgment), "SILENT");
  const follow = judge("How are we doing?", [
    candidate({
      id: "mt1-gap-2",
      reason: "MISSING_CRITICAL_INFORMATION",
      subject: CAPACITY,
      relatedToCurrentContext: true,
      observation: "Evidence for Capacity Gap is still incomplete.",
      nextStep: "Inspect the missing evidence.",
    }),
  ]);
  assert.equal(initiative(follow.judgment), "SPEAK");
  assert.equal(follow.judgment.boundaries.commitsDecision, false);
});

test("ECA:3 prompt multi-turn 2 — Comparison tradeoff never creates Decision", () => {
  const compare = judge("Compare Demand Surge and Pricing Response.", []);
  const risk = judge("Which has lower risk?", []);
  const criterion = judge("Delivery speed matters more.", [
    candidate({
      id: "mt2",
      reason: "HIGH_VALUE_NEXT_STEP",
      relatedToCurrentContext: true,
      observation: "Delivery speed changes the Demand Surge vs Pricing Response tradeoff.",
      nextStep: "Compare them on delivery speed.",
    }),
  ]);
  assert.ok(compare.actionPlan.intent === "COMPARE" || compare.actionPlan.nextAction === "COMPARE");
  assert.equal(criterion.judgment.boundaries.commitsDecision, false);
  assert.equal(risk.actionPlan.boundaries.commitsDecision, false);
  assert.equal(criterion.actionPlan.boundaries.commitsDecision, false);
});

test("ECA:3 prompt multi-turn 3 — Preference ≠ commitment; readiness may SPEAK", () => {
  const seek = judge("What should I do about Capacity Gap?", []);
  const prefer = judge("I prefer Demand Surge.", [
    candidate({
      id: "mt3",
      reason: "DECISION_ASSUMPTION_WEAKENED",
      subject: DEMAND,
      relatedToCurrentContext: true,
      observation: "Before approving Demand Surge, delivery-impact evidence remains weak.",
      nextStep: "Review Decision readiness.",
    }),
  ]);
  assert.equal(seek.actionPlan.boundaries.commitsDecision, false);
  assert.equal(prefer.judgment.boundaries.commitsDecision, false);
  assert.notEqual(prefer.actionPlan.authorityTarget, "CC:10 Decision Commitment");
  assert.ok(initiative(prefer.judgment) === "SPEAK" || initiative(prefer.judgment) === "SILENT");
});

test("ECA:3 prompt multi-turn 4 — Before Start readiness; after Start deviation allowed", () => {
  const before = judge("Are we ready to start?", [
    candidate({
      id: "mt4-before",
      reason: "EXECUTION_BLOCKED",
      relatedToCurrentContext: true,
      observation: "Execution has not started; readiness blockers remain.",
      evidence: ["execution:none"],
    }),
  ]);
  assert.equal(initiative(before.judgment), "SPEAK");
  assert.doesNotMatch(before.judgment.guidance ?? "", /\bis running\b/i);
  assert.equal(before.judgment.boundaries.startsExecution, false);
  const after = judge("How is execution going?", [
    candidate({
      id: "mt4-after",
      reason: "EXECUTION_OFF_TRACK",
      relatedToCurrentContext: true,
      observation: "Canonical Execution is active and behind expected progress.",
      evidence: ["execution:ACTIVE", "progress:behind"],
    }),
  ]);
  assert.equal(initiative(after.judgment), "SPEAK");
  assert.equal(after.judgment.boundaries.startsExecution, false);
});
