/**
 * NPA-T SIM-TEST:6 — long-session discovery journeys.
 * Visible management intent and utterances only. No expected answers, Ground Truth, or backdoors.
 */

import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";

const REQUIRED = Object.freeze([
  "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
  "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
  "DECISION_STATE", "EXECUTION_STATE",
] as const);

const STOPS = Object.freeze([
  "TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE",
] as const);

const TARGETS = Object.freeze([
  "CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "SCENARIO",
  "CC10", "CC11", "DATA_REALITY", "OUTCOME", "LEARNING",
]);

function turn(
  managementIntent: NexoraSimulationManagerJourneyIntent,
  utterance: string,
  extras?: { readonly intendedSubject?: string; readonly deictic?: boolean },
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "MANAGER_TURN" as const, managementIntent, utterance, ...extras });
}

function interact(
  surface: Extract<NexoraSimulationTestJourneyStep, { kind: "INTERACT_VISIBLE" }>["surface"],
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "INTERACT_VISIBLE" as const, surface });
}

function publish(atTick: number): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick });
}

function journey(input: Omit<NexoraSimulationTestJourney,
  "startingMode" | "disturbancePolicy" | "requiredCheckpoints" | "stopConditions" |
  "maxRepeatedClarificationAttempts" | "maxUnresolvedLoops"
>): NexoraSimulationTestJourney {
  return Object.freeze({
    ...input,
    startingMode: "WATCH" as const,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    stopConditions: STOPS,
    maxRepeatedClarificationAttempts: 2,
    maxUnresolvedLoops: 2,
  });
}

export const SIM_TEST_6_MANUFACTURING_LONG = journey({
  journeyId: "sim-test-6-manufacturing-long",
  version: "1.0",
  title: "Manufacturing long-session discovery",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "DATA_DRIVEN_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 21,
  turnBudget: 150,
  maxNavigationCycles: 24,
  targetSurfaces: TARGETS,
  steps: Object.freeze([
    publish(0),
    turn("ORIENT", "What is happening?"),
    turn("INVESTIGATE", "Show me the main problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the capacity issue.", { intendedSubject: "Capacity" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_CAUSE", "Why?", { intendedSubject: "Capacity", deictic: true }),
    publish(7),
    turn("CHALLENGE", "How serious is it?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Capacity", deictic: true }),
    turn("FOCUS_PROBLEM", "The Capacity Gap problem.", { intendedSubject: "Capacity Gap" }),
    turn("REQUEST_EXECUTION_BEFORE_COMMIT", "Start option B.", { intendedSubject: "Capacity Gap" }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMPARE", "Compare them.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("FOLLOW_UP", "What about option A?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Let's go with option B.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Yes, that's the decision.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("FOLLOW_UP", "What if we had chosen A?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Proceed.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Yes, execute.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "Did it work?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "Is this working?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "How is it going?", { intendedSubject: "Capacity Gap", deictic: true }),
    publish(21),
    turn("CHECK_CHANGE", "Has anything changed?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "What's the outcome?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "How did it go?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_COUNTERFACTUAL", "Would option A have been better?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "What was the outcome of option A?", { intendedSubject: "Capacity Gap" }),
    turn("REVERSE_DECISION", "Actually, switch to option A.", { intendedSubject: "Capacity Gap" }),
    turn("REQUEST_EXECUTION", "Start the supplier recovery plan.", { intendedSubject: "Supplier" }),
    turn("RETURN_TO_SUBJECT", "Go back to the supplier problem.", { intendedSubject: "Supplier" }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("UNSUPPORTED_ACTION", "Teleport all inventory to the finished-goods warehouse.", { intendedSubject: "Capacity Gap" }),
    turn("ASK_LEARNING", "What did we learn?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("CHANGE_CONTEXT", "What about inventory?", { intendedSubject: "Inventory" }),
    turn("REQUEST_EVIDENCE", "What evidence do we have on that?", { intendedSubject: "Inventory", deictic: true }),
    turn("CHANGE_CONTEXT", "What about demand?", { intendedSubject: "Demand" }),
    turn("FOLLOW_UP", "This issue — how material is it?", { intendedSubject: "Demand", deictic: true }),
    turn("CHANGE_CONTEXT", "What about revenue?", { intendedSubject: "Revenue" }),
    turn("CHANGE_CONTEXT", "What about budget?", { intendedSubject: "Budget" }),
    turn("CHANGE_CONTEXT", "What about margin?", { intendedSubject: "Margin" }),
    turn("FOLLOW_UP", "That risk — what is driving it?", { intendedSubject: "Margin", deictic: true }),
    turn("RETURN_TO_SUBJECT", "Return to the capacity pressure we started with.", { intendedSubject: "Capacity Gap" }),
    turn("FOLLOW_UP", "This decision — is it still the active one?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("FOLLOW_UP", "That option we compared earlier — remind me of the difference.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("FOLLOW_UP", "How is this execution going?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("CHANGE_CONTEXT", "What about inventory?", { intendedSubject: "Inventory" }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("RETURN_TO_SUBJECT", "Back to capacity.", { intendedSubject: "Capacity Gap" }),
    turn("CHANGE_CONTEXT", "What about demand?", { intendedSubject: "Demand" }),
    turn("CHANGE_CONTEXT", "What about inventory?", { intendedSubject: "Inventory" }),
    turn("RETURN_TO_SUBJECT", "Bring me back to delivery.", { intendedSubject: "Delivery" }),
    interact("STAGE_FOCUSED"),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    interact("STAGE_VISIBLE_OTHER"),
    turn("FOLLOW_UP", "Why is this important?", { deictic: true }),
    interact("MLEVEL_L2"),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    interact("MLEVEL_L3"),
    turn("FOLLOW_UP", "What is the problem here?", { deictic: true }),
    turn("RETURN_TO_SUBJECT", "Take me back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("FOLLOW_UP", "The previous one — what did we conclude?", { deictic: true }),
    turn("FOLLOW_UP", "This execution — is it still running?", { deictic: true }),
    turn("CHANGE_CONTEXT", "What about the schedule issue?", { intendedSubject: "Schedule" }),
    turn("RETURN_TO_SUBJECT", "Go back to the supplier problem.", { intendedSubject: "Supplier" }),
    turn("FOCUS_PROBLEM", "Tell me more about the capacity issue.", { intendedSubject: "Capacity" }),
    turn("FOCUS_PROBLEM", "The delivery issue.", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about Capacity Theatre?", { intendedSubject: "Capacity Theatre" }),
    turn("REQUEST_EVIDENCE", "What data do we have?", { deictic: true }),
    turn("REQUEST_EVIDENCE", "Where did that come from?", { deictic: true }),
    turn("CHECK_CHANGE", "Has the data changed?", { deictic: true }),
    turn("ASK_CAUSE", "Why is this delayed?", { deictic: true }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives again.", { deictic: true }),
    turn("COMPARE", "Compare those options without changing the decision.", { deictic: true }),
    turn("FOLLOW_UP", "Walk me through option A again.", { deictic: true }),
    publish(21),
    turn("CHECK_CHANGE", "Has anything changed in the latest numbers?", { deictic: true }),
    turn("REQUEST_EVIDENCE", "What supports that now?", { deictic: true }),
    turn("ASK_OUTCOME", "Did the action work after the later data?", { deictic: true }),
    turn("INVESTIGATE", "Is there a new bottleneck I should know about?"),
    turn("CHANGE_CONTEXT", "What about inventory?", { intendedSubject: "Inventory" }),
    turn("RETURN_TO_SUBJECT", "What were we saying about capacity?", { intendedSubject: "Capacity Gap" }),
    turn("FOLLOW_UP", "That one — still the same problem?", { deictic: true }),
    turn("FOLLOW_UP", "Look at that.", { deictic: true }),
    turn("CHANGE_CONTEXT", "Switch to inventory.", { intendedSubject: "Inventory" }),
    turn("FOLLOW_UP", "The first one.", { deictic: true }),
    turn("RETURN_TO_SUBJECT", "Return to delivery.", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the maintenance crisis?", { intendedSubject: "Maintenance Crisis" }),
    turn("REQUEST_EVIDENCE", "What does the production data show?", { deictic: true }),
    turn("CHANGE_CONTEXT", "What about demand?", { intendedSubject: "Demand" }),
    turn("ASK_CAUSE", "Is this proven, or only associated?", { deictic: true }),
    turn("ASK_LEARNING", "What did we learn from repeating this?", { deictic: true }),
    turn("COMMIT_DECISION", "Approve a delivery recovery plan.", { intendedSubject: "Delivery" }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Delivery", deictic: true }),
    turn("REQUEST_EXECUTION", "Put that into action.", { intendedSubject: "Delivery", deictic: true }),
    turn("FOLLOW_UP", "How is that one going?", { deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { deictic: true }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("FOLLOW_UP", "Go back to the first decision we made.", { deictic: true }),
    turn("ASK_OUTCOME", "How did the capacity one go?", { intendedSubject: "Capacity Gap" }),
    turn("UNSUPPORTED_ACTION", "Wipe the backlog by command.", { intendedSubject: "Capacity Gap" }),
    turn("CHANGE_CONTEXT", "What about the resource issue?", { intendedSubject: "Resource" }),
    turn("CHANGE_CONTEXT", "What about budget?", { intendedSubject: "Budget" }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("ORIENT", "Where do we stand now?"),
  ]),
});

export const SIM_TEST_6_PROJECT_LONG = journey({
  journeyId: "sim-test-6-project-long",
  version: "1.0",
  title: "Project long-session discovery",
  scenarioId: "project-delivery-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "STANDARD_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 15,
  turnBudget: 100,
  maxNavigationCycles: 16,
  targetSurfaces: TARGETS,
  steps: Object.freeze([
    publish(0),
    turn("ORIENT", "How is the project progressing?"),
    turn("INVESTIGATE", "Show me the main project problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the delivery issue.", { intendedSubject: "Delivery" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_CAUSE", "What caused it?", { intendedSubject: "Delivery", deictic: true }),
    publish(5),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Delivery", deictic: true }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMPARE", "Compare them.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMMIT_DECISION", "Approve the delivery recovery plan.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Delivery", deictic: true }),
    turn("REQUEST_EXECUTION", "Put the decision into action.", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("CHANGE_CONTEXT", "What about the schedule?", { intendedSubject: "Schedule" }),
    turn("RETURN_TO_SUBJECT", "Go back to the delivery issue.", { intendedSubject: "Delivery" }),
    turn("ASK_OUTCOME", "Did it work already?", { intendedSubject: "Delivery", deictic: true }),
    turn("FOLLOW_UP", "How is it going?", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("FOLLOW_UP", "This issue — what is at stake?", { deictic: true }),
    turn("RETURN_TO_SUBJECT", "Return to delivery.", { intendedSubject: "Delivery" }),
    turn("REQUEST_EVIDENCE", "Where did that project evidence come from?", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the supplier problem?", { intendedSubject: "Supplier" }),
    turn("FOCUS_PROBLEM", "The delivery issue.", { intendedSubject: "Delivery" }),
    interact("STAGE_FOCUSED"),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    interact("STAGE_VISIBLE_OTHER"),
    turn("FOLLOW_UP", "Why is this important?", { deictic: true }),
    interact("MLEVEL_L2"),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    turn("CHANGE_CONTEXT", "What about Capacity Theatre?", { intendedSubject: "Capacity Theatre" }),
    turn("RETURN_TO_SUBJECT", "What were we saying about delivery?", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "That one.", { deictic: true }),
    turn("FOLLOW_UP", "Look at that.", { deictic: true }),
    turn("CHANGE_CONTEXT", "Talk about the schedule issue.", { intendedSubject: "Schedule" }),
    turn("FOLLOW_UP", "The first one.", { deictic: true }),
    turn("RETURN_TO_SUBJECT", "Back to the known delivery issue.", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the maintenance crisis?", { intendedSubject: "Maintenance Crisis" }),
    turn("ASK_CAUSE", "Is the delay proven or only associated?", { deictic: true }),
    publish(15),
    turn("CHECK_CHANGE", "What changed?", { intendedSubject: "Delivery", deictic: true }),
    turn("REQUEST_EVIDENCE", "Has the project data changed?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_OUTCOME", "What's the outcome now?", { intendedSubject: "Delivery", deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Delivery", deictic: true }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives again.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMPARE", "Compare them without a new decision.", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("CHANGE_CONTEXT", "What about budget?", { intendedSubject: "Budget" }),
    turn("RETURN_TO_SUBJECT", "Go back to delivery.", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "This execution — still active?", { deictic: true }),
    turn("FOLLOW_UP", "How is that one going?", { deictic: true }),
    turn("ASK_LEARNING", "What should we take from this?", { intendedSubject: "Delivery", deictic: true }),
    turn("UNSUPPORTED_ACTION", "Compress the remaining work by instruction.", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the resource issue?", { intendedSubject: "Resource" }),
    turn("INVESTIGATE", "Is there another project problem I should open?"),
    turn("RETURN_TO_SUBJECT", "Return to the delivery issue.", { intendedSubject: "Delivery" }),
    turn("ASK_OUTCOME", "How did it go much later?", { intendedSubject: "Delivery", deictic: true }),
    turn("ORIENT", "Where does the project stand now?"),
    turn("FOLLOW_UP", "The previous one — remind me.", { deictic: true }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { deictic: true }),
    turn("ASK_CAUSE", "Why?", { deictic: true }),
    turn("CHALLENGE", "How serious is the remaining delivery pressure?", { intendedSubject: "Delivery" }),
    turn("FOCUS_PROBLEM", "Tell me more about the delivery issue.", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the schedule?", { intendedSubject: "Schedule" }),
    turn("RETURN_TO_SUBJECT", "Go back to the delivery issue.", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "This decision — which one is current?", { deictic: true }),
    turn("ASK_OUTCOME", "Did it work?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_LEARNING", "What did we learn?", { intendedSubject: "Delivery", deictic: true }),
  ]),
});

function parityLong(input: {
  journeyId: string;
  title: string;
  scenarioId: string;
  profile: NexoraSimulationTestJourney["managerProfileId"];
  mode: NexoraSimulationTestJourney["mode"];
  ticks: number;
  opening: string;
  focus: string;
  otherA: string;
  otherB: string;
  unknown: string;
}): NexoraSimulationTestJourney {
  return journey({
    journeyId: input.journeyId,
    version: "1.0",
    title: input.title,
    scenarioId: input.scenarioId,
    scenarioVersion: "1.0",
    managerProfileId: input.profile,
    mode: input.mode,
    boundedDurationTicks: input.ticks,
    turnBudget: 50,
    maxNavigationCycles: 12,
    targetSurfaces: TARGETS,
    steps: Object.freeze([
      publish(0),
      turn("ORIENT", input.opening),
      turn("INVESTIGATE", "Show me the main problems."),
      turn("FOCUS_PROBLEM", `Tell me more about the ${input.focus.toLowerCase()} issue.`, { intendedSubject: input.focus }),
      turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: input.focus, deictic: true }),
      turn("ASK_CAUSE", "Why?", { intendedSubject: input.focus, deictic: true }),
      turn("ASK_VARIABLES", "What can I change?", { intendedSubject: input.focus, deictic: true }),
      turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: input.focus, deictic: true }),
      turn("COMPARE", "Compare them.", { intendedSubject: input.focus, deictic: true }),
      turn("COMMIT_DECISION", "Let's go with option B.", { intendedSubject: input.focus, deictic: true }),
      turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: input.focus, deictic: true }),
      turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: input.focus, deictic: true }),
      turn("ASK_OUTCOME", "Did it work?", { intendedSubject: input.focus, deictic: true }),
      turn("CHANGE_CONTEXT", `What about ${input.otherA.toLowerCase()}?`, { intendedSubject: input.otherA }),
      turn("FOLLOW_UP", "This issue — how material is it?", { deictic: true }),
      turn("CHANGE_CONTEXT", `What about ${input.otherB.toLowerCase()}?`, { intendedSubject: input.otherB }),
      turn("RETURN_TO_SUBJECT", `Go back to the ${input.focus.toLowerCase()} issue.`, { intendedSubject: input.focus }),
      turn("FOLLOW_UP", "That one.", { deictic: true }),
      turn("CHANGE_CONTEXT", `What about the ${input.unknown.toLowerCase()}?`, { intendedSubject: input.unknown }),
      turn("RETURN_TO_SUBJECT", `Return to ${input.focus.toLowerCase()}.`, { intendedSubject: input.focus }),
      interact("STAGE_FOCUSED"),
      turn("FOLLOW_UP", "Explain this.", { deictic: true }),
      turn("REQUEST_EVIDENCE", "What does the production data show?", { deictic: true }),
      turn("CHANGE_CONTEXT", "What about Capacity Theatre?", { intendedSubject: "Capacity Theatre" }),
      turn("ASK_CAUSE", "Is this proven or only associated?", { deictic: true }),
      publish(input.ticks),
      turn("CHECK_CHANGE", "Has anything changed?", { deictic: true }),
      turn("REQUEST_EVIDENCE", "Has the data changed?", { deictic: true }),
      turn("ASK_OUTCOME", "What's the outcome now?", { deictic: true }),
      turn("REQUEST_EXECUTION", "Start it.", { deictic: true }),
      turn("FOLLOW_UP", "How is that one going?", { deictic: true }),
      turn("CHANGE_CONTEXT", `What about ${input.otherA.toLowerCase()}?`, { intendedSubject: input.otherA }),
      turn("RETURN_TO_SUBJECT", `Go back to ${input.focus.toLowerCase()}.`, { intendedSubject: input.focus }),
      turn("ASK_LEARNING", "What did we learn?", { deictic: true }),
      turn("UNSUPPORTED_ACTION", "Force the remaining work complete.", { deictic: true }),
      turn("INVESTIGATE", "Is there another issue I should open?"),
      turn("ORIENT", "Where do we stand now?"),
    ]),
  });
}

export const SIM_TEST_6_LOGISTICS_PARITY = parityLong({
  journeyId: "sim-test-6-logistics-parity",
  title: "Logistics long-session parity",
  scenarioId: "logistics-delivery-pressure",
  profile: "STANDARD_MANAGER",
  mode: "INGESTION",
  ticks: 12,
  opening: "What is happening in logistics?",
  focus: "Delivery",
  otherA: "Inventory",
  otherB: "Customer",
  unknown: "supplier issue",
});

export const SIM_TEST_6_SERVICE_PARITY = parityLong({
  journeyId: "sim-test-6-service-parity",
  title: "Service long-session parity",
  scenarioId: "service-capacity-pressure",
  profile: "STANDARD_MANAGER",
  mode: "INGESTION",
  ticks: 12,
  opening: "What is happening in service operations?",
  focus: "Capacity",
  otherA: "Customer",
  otherB: "Delivery",
  unknown: "resource issue",
});

export const SIM_TEST_6_FAST_PARITY = parityLong({
  journeyId: "sim-test-6-fast-parity",
  title: "FAST long-session parity",
  scenarioId: "manufacturing-capacity-pressure",
  profile: "DATA_DRIVEN_MANAGER",
  mode: "FAST",
  ticks: 21,
  opening: "What is happening?",
  focus: "Capacity",
  otherA: "Delivery",
  otherB: "Inventory",
  unknown: "supplier issue",
});

export const SIM_TEST_6_MANUFACTURING_IMPATIENT = journey({
  journeyId: "sim-test-6-manufacturing-impatient",
  version: "1.0",
  title: "Manufacturing impatient bounded long session",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "IMPATIENT_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 21,
  turnBudget: 50,
  maxNavigationCycles: 12,
  targetSurfaces: TARGETS,
  steps: Object.freeze([
    publish(0),
    turn("ORIENT", "Status."),
    turn("INVESTIGATE", "Main problems. Now."),
    turn("FOCUS_PROBLEM", "Capacity. Details.", { intendedSubject: "Capacity" }),
    turn("REQUEST_EVIDENCE", "Data.", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_CAUSE", "Why?", { intendedSubject: "Capacity", deictic: true }),
    turn("EXPLORE_OPTIONS", "Options.", { intendedSubject: "Capacity", deictic: true }),
    turn("COMPARE", "Compare.", { intendedSubject: "Capacity", deictic: true }),
    turn("COMMIT_DECISION", "Go with B.", { intendedSubject: "Capacity", deictic: true }),
    turn("COMMIT_DECISION", "Yes. Decide.", { intendedSubject: "Capacity", deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_OUTCOME", "Done yet?", { intendedSubject: "Capacity", deictic: true }),
    turn("CHANGE_CONTEXT", "Delivery.", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "This.", { deictic: true }),
    turn("RETURN_TO_SUBJECT", "Back to capacity.", { intendedSubject: "Capacity" }),
    turn("CHANGE_CONTEXT", "Supplier issue.", { intendedSubject: "Supplier" }),
    turn("RETURN_TO_SUBJECT", "Capacity again.", { intendedSubject: "Capacity" }),
    publish(7),
    turn("CHECK_CHANGE", "Changed?", { deictic: true }),
    turn("REQUEST_EVIDENCE", "Source?", { deictic: true }),
    turn("FOLLOW_UP", "How is it going?", { deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { deictic: true }),
    turn("CHANGE_CONTEXT", "Inventory.", { intendedSubject: "Inventory" }),
    turn("FOLLOW_UP", "That one.", { deictic: true }),
    turn("RETURN_TO_SUBJECT", "Return to capacity.", { intendedSubject: "Capacity" }),
    publish(21),
    turn("ASK_OUTCOME", "Outcome.", { deictic: true }),
    turn("ASK_CAUSE", "Proven?", { deictic: true }),
    turn("CHANGE_CONTEXT", "Schedule issue.", { intendedSubject: "Schedule" }),
    turn("RETURN_TO_SUBJECT", "Capacity.", { intendedSubject: "Capacity" }),
    turn("ASK_LEARNING", "Learn what?", { deictic: true }),
    turn("ORIENT", "Now?"),
    turn("FOLLOW_UP", "The previous one.", { deictic: true }),
    turn("INVESTIGATE", "Anything else?"),
    turn("UNSUPPORTED_ACTION", "Just fix it."),
    turn("ASK_OUTCOME", "Did it work?", { deictic: true }),
  ]),
});

export const SIM_TEST_6_FRESH_SESSION = journey({
  journeyId: "sim-test-6-fresh-session",
  version: "1.0",
  title: "Fresh manufacturing session after long run",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "DATA_DRIVEN_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 0,
  turnBudget: 4,
  targetSurfaces: TARGETS,
  steps: Object.freeze([
    publish(0),
    turn("ORIENT", "What is happening?"),
    turn("INVESTIGATE", "Show me the main problems."),
  ]),
});

function prefixByManagerTurns(
  source: NexoraSimulationTestJourney,
  journeyId: string,
  title: string,
  managerTurnLimit: number,
): NexoraSimulationTestJourney {
  const steps: NexoraSimulationTestJourneyStep[] = [];
  let turns = 0;
  for (const step of source.steps) {
    steps.push(step);
    if (step.kind === "MANAGER_TURN") {
      turns += 1;
      if (turns >= managerTurnLimit) break;
    }
  }
  return journey({
    journeyId,
    version: "1.0",
    title,
    scenarioId: source.scenarioId,
    scenarioVersion: source.scenarioVersion,
    managerProfileId: source.managerProfileId,
    mode: source.mode,
    boundedDurationTicks: source.boundedDurationTicks,
    turnBudget: managerTurnLimit,
    maxNavigationCycles: source.maxNavigationCycles,
    targetSurfaces: source.targetSurfaces,
    steps: Object.freeze(steps),
  });
}

export const SIM_TEST_6_T50_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t50-focused",
  "Focused T42–T52 clarification-lifetime reproduction",
  52,
);

export const SIM_TEST_6_T64_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t64-focused",
  "Focused T56–T68 Advisor-context reproduction",
  68,
);

export const SIM_TEST_6_T69_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t69-focused",
  "Focused T61–T73 referent-continuity reproduction",
  73,
);

export const SIM_TEST_6_T71_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t71-focused",
  "Focused T63–T74 wrong-referent reproduction",
  74,
);

export const SIM_TEST_6_T77_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t77-focused",
  "Focused T72–T80 premature-decision reproduction",
  80,
);

export const SIM_TEST_6_T83_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t83-focused",
  "Focused T79–T86 repeated-clarification reproduction",
  86,
);

export const SIM_TEST_6_T85_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t85-focused",
  "Focused T80–T91 Stage-synchronization reproduction",
  91,
);

export const SIM_TEST_6_T88_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t88-focused",
  "Focused T84–T91 explicit-switch referent reproduction",
  91,
);

export const SIM_TEST_6_T89_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t89-focused",
  "Focused T84–T93 ordinal collection reproduction",
  93,
);

export const SIM_TEST_6_T92_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_MANUFACTURING_LONG,
  "sim-test-6-t92-focused",
  "Focused T88–T95 production-data referent reproduction",
  95,
);

export const SIM_TEST_6_SERVICE_T18_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_SERVICE_PARITY,
  "sim-test-6-service-t18-focused",
  "Focused Service T13–T18 Advisor-context reproduction",
  18,
);

export const SIM_TEST_6_PROJECT_T18_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_PROJECT_LONG,
  "sim-test-6-project-t18-focused",
  "Focused Project T14–T19 this-issue Advisor reproduction",
  19,
);

export const SIM_TEST_6_PROJECT_T35_FOCUSED = prefixByManagerTurns(
  SIM_TEST_6_PROJECT_LONG,
  "sim-test-6-project-t35-focused",
  "Focused Project T32–T36 change-question clarification reproduction",
  36,
);

export const SIM_TEST_6_JOURNEYS = Object.freeze([
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_FRESH_SESSION,
]);
