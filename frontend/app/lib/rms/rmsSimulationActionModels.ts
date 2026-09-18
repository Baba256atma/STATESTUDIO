/**
 * NPA-T RMS:10 — explicit Scenario simulation-action models.
 * Simulation mechanics only. Not VAI causal truth.
 */

export type RmsScenarioActionModel = {
  readonly actionType: string;
  readonly label: string;
  readonly targetVariableId: string;
  readonly targetKey: string;
  readonly eventType: "CAPACITY_CHANGE" | "RESOURCE_CHANGE" | "INVENTORY_CHANGE" | "SCHEDULE_CHANGE";
  readonly delta: number;
  readonly delayTicks: number;
  readonly durationTicks: number | null;
  readonly assumptions: readonly string[];
};

const MANUFACTURING = Object.freeze([
  Object.freeze({
    actionType: "TEMP_EXTERNAL_CAPACITY",
    label: "Temporary Capacity",
    targetVariableId: "var:capacity",
    targetKey: "availableCapacity",
    eventType: "CAPACITY_CHANGE",
    delta: 20,
    delayTicks: 2,
    durationTicks: 10,
    assumptions: Object.freeze([
      "+20 modeled capacity",
      "begins after 2 ticks",
      "lasts 10 ticks",
      "adds modeled operating cost",
    ]),
  }),
  Object.freeze({
    actionType: "EXTERNAL_PRODUCTION",
    label: "External Production",
    targetVariableId: "var:capacity",
    targetKey: "availableCapacity",
    eventType: "CAPACITY_CHANGE",
    delta: 12,
    delayTicks: 1,
    durationTicks: 8,
    assumptions: Object.freeze([
      "+12 modeled external capacity contribution",
      "begins after 1 tick",
      "lasts 8 ticks",
    ]),
  }),
]) satisfies readonly RmsScenarioActionModel[];

const PROJECT = Object.freeze([
  Object.freeze({
    actionType: "ADD_PROJECT_RESOURCE",
    label: "Add Resource",
    targetVariableId: "var:crew",
    targetKey: "staffAvailable",
    eventType: "RESOURCE_CHANGE",
    delta: 3,
    delayTicks: 1,
    durationTicks: null,
    assumptions: Object.freeze(["+3 modeled resource capacity", "begins after 1 tick", "cost increase is modeled as an assumption only"]),
  }),
  Object.freeze({
    actionType: "RESEQUENCE_WORK",
    label: "Re-sequence Work",
    targetVariableId: "var:schedule",
    targetKey: "scheduleVarianceDays",
    eventType: "SCHEDULE_CHANGE",
    delta: -2,
    delayTicks: 0,
    durationTicks: null,
    assumptions: Object.freeze(["-2 modeled schedule-variance days", "applies on the current tick"]),
  }),
]) satisfies readonly RmsScenarioActionModel[];

const LOGISTICS = Object.freeze([
  Object.freeze({
    actionType: "EXPEDITE_INBOUND",
    label: "Expedite inbound",
    targetVariableId: "var:inventory",
    targetKey: "inventory",
    eventType: "INVENTORY_CHANGE",
    delta: 40,
    delayTicks: 1,
    durationTicks: null,
    assumptions: Object.freeze(["+40 modeled inventory buffer", "begins after 1 tick"]),
  }),
]) satisfies readonly RmsScenarioActionModel[];

const SERVICE = Object.freeze([
  Object.freeze({
    actionType: "ADD_SHIFT",
    label: "Add shift",
    targetVariableId: "var:crew",
    targetKey: "staffAvailable",
    eventType: "RESOURCE_CHANGE",
    delta: 2,
    delayTicks: 1,
    durationTicks: null,
    assumptions: Object.freeze(["+2 modeled staff", "begins after 1 tick"]),
  }),
]) satisfies readonly RmsScenarioActionModel[];

const BY_SCENARIO: Readonly<Record<string, readonly RmsScenarioActionModel[]>> = Object.freeze({
  "manufacturing-capacity-pressure": MANUFACTURING,
  "project-delivery-pressure": PROJECT,
  "logistics-delivery-pressure": LOGISTICS,
  "service-capacity-pressure": SERVICE,
});

export function listRmsScenarioActionModels(scenarioId: string): readonly RmsScenarioActionModel[] {
  return BY_SCENARIO[scenarioId] ?? Object.freeze([]);
}

export function getRmsScenarioActionModel(scenarioId: string, actionType: string): RmsScenarioActionModel | null {
  return listRmsScenarioActionModels(scenarioId).find((item) => item.actionType === actionType) ?? null;
}
