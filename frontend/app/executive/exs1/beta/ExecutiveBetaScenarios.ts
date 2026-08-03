/**
 * Phase E — Official Beta Scenarios (executable documentation).
 */

export type BetaScenarioId =
  | "first-login"
  | "connect-csv"
  | "create-executive-model"
  | "scenario-engineering"
  | "simulation"
  | "decision-approval"
  | "execution"
  | "monitoring"
  | "replay-timeline"
  | "journal-review";

export type BetaScenarioStep = {
  readonly order: number;
  readonly action: string;
  readonly expect: string;
};

export type BetaScenario = {
  readonly id: BetaScenarioId;
  readonly number: number;
  readonly title: string;
  readonly goal: string;
  readonly steps: readonly BetaScenarioStep[];
  readonly verify: readonly string[];
};

export const OFFICIAL_BETA_SCENARIOS: readonly BetaScenario[] = Object.freeze([
  {
    id: "first-login",
    number: 1,
    title: "First Login",
    goal: "Open the Executive Cockpit and orient without developer help.",
    steps: [
      { order: 1, action: "Open /executive", expect: "Cockpit shell loads" },
      { order: 2, action: "Review Context Bar", expect: "Company · Model · Pack visible" },
      { order: 3, action: "Scan Director Stage", expect: "Executive Objects visible" },
    ],
    verify: ["Status bar shows EXS-7 · Beta", "Advisor Assist panel present"],
  },
  {
    id: "connect-csv",
    number: 2,
    title: "Connect CSV",
    goal: "Publish inventory.csv through the Enterprise Connector.",
    steps: [
      { order: 1, action: "Open Data → Enterprise Connectors", expect: "CSV connector listed" },
      { order: 2, action: "Connect Sample inventory.csv", expect: "Schema preview ready" },
      { order: 3, action: "Manager Approve → Publish", expect: "Runtime DataUpdated published" },
    ],
    verify: ["Journal shows [Connector] pack", "Intelligence receives data signal"],
  },
  {
    id: "create-executive-model",
    number: 3,
    title: "Create Executive Model",
    goal: "Confirm Metadata meaning for Runtime Objects.",
    steps: [
      { order: 1, action: "Open Knowledge", expect: "Objects and Fields listed" },
      { order: 2, action: "Select Inventory / MAT_QTY", expect: "Available Inventory meaning shown" },
      { order: 3, action: "Confirm mapping", expect: "No orphan Runtime Object" },
    ],
    verify: ["Metadata resolves inventory → Inventory"],
  },
  {
    id: "scenario-engineering",
    number: 4,
    title: "Scenario Engineering",
    goal: "Enter Scenario Mode and select an alternative path.",
    steps: [
      { order: 1, action: "Set Mode to Scenario", expect: "Scenario workspace active" },
      { order: 2, action: "Select Scenario", expect: "Stage highlights scenario focus" },
      { order: 3, action: "Compare if needed", expect: "Runtime emits ScenarioSelected" },
    ],
    verify: ["Timeline Pack unchanged by Scenario selection alone"],
  },
  {
    id: "simulation",
    number: 5,
    title: "Simulation",
    goal: "Run Inventory Shortage · Increase Safety Stock.",
    steps: [
      { order: 1, action: "Open Simulations", expect: "Explorer shows Sessions" },
      { order: 2, action: "Create Inventory Shortage", expect: "Assumption Increase Safety Stock" },
      { order: 3, action: "Run Simulation", expect: "Future State Inventory 820 → 960" },
    ],
    verify: ["Runtime business state unchanged", "SimulationCompleted emitted"],
  },
  {
    id: "decision-approval",
    number: 6,
    title: "Decision Approval",
    goal: "Create Draft Decision Candidate and approve as Manager.",
    steps: [
      { order: 1, action: "Create Decision Candidate from Simulation", expect: "Status Draft" },
      { order: 2, action: "Open Decision Mode", expect: "Candidate visible" },
      { order: 3, action: "Manager Approve", expect: "DecisionApproved Runtime event" },
    ],
    verify: ["Advisor never auto-approves", "Journal Decision pack appears"],
  },
  {
    id: "execution",
    number: 7,
    title: "Execution",
    goal: "Start Execution after Decision approval.",
    steps: [
      { order: 1, action: "Set Mode to Execution", expect: "Execution workspace active" },
      { order: 2, action: "Start Execution", expect: "ExecutionStarted event" },
      { order: 3, action: "Review tasks", expect: "Plan status Running" },
    ],
    verify: ["Journal Execution pack present"],
  },
  {
    id: "monitoring",
    number: 8,
    title: "Monitoring",
    goal: "Create a Monitoring Snapshot.",
    steps: [
      { order: 1, action: "Set Mode to Monitoring", expect: "Health visible on Stage" },
      { order: 2, action: "Create Snapshot", expect: "SnapshotCreated event" },
      { order: 3, action: "Review attention objects", expect: "Intelligence may signal" },
    ],
    verify: ["Monitoring Pack on Timeline"],
  },
  {
    id: "replay-timeline",
    number: 9,
    title: "Replay Timeline",
    goal: "Change Timeline lens without moving Pack identity unexpectedly.",
    steps: [
      { order: 1, action: "Select Timeline lens", expect: "TimelineMoved event" },
      { order: 2, action: "Select Pack", expect: "PackSelected; Stage context updates" },
      { order: 3, action: "Confirm Simulation did not move Timeline", expect: "Lens stable from Simulation" },
    ],
    verify: ["Timeline UX unchanged by Simulation"],
  },
  {
    id: "journal-review",
    number: 10,
    title: "Journal Review",
    goal: "Review Connector, Simulation, Decision, Execution, Monitoring packs.",
    steps: [
      { order: 1, action: "Open Journal", expect: "Pack list visible" },
      { order: 2, action: "Scan [Connector] / [Simulation] / Decision", expect: "Audit trail readable" },
      { order: 3, action: "Confirm timestamps", expect: "Each pack dated" },
    ],
    verify: ["No dead-end empty state without guidance"],
  },
]);

export function getBetaScenario(id: BetaScenarioId): BetaScenario | undefined {
  return OFFICIAL_BETA_SCENARIOS.find((s) => s.id === id);
}
