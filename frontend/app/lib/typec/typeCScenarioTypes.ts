export type TypeCScenarioStatus =
  | "draft"
  | "selected"
  | "ignored"
  | "ready_for_decision";

export type TypeCScenario = {
  id: string;
  title: string;
  status: TypeCScenarioStatus;
  source: "scene_graph";
  objectIds: string[];
  loopIds: string[];
  createdAt: string;
  updatedAt: string;
  summary: string;
};

export type TypeCScenarioState = {
  scenarios: TypeCScenario[];
  selectedScenarioId: string | null;
};
