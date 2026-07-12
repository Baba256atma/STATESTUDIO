import type { ExecutiveEngineContractDescriptor, ExecutiveEngineResponsibility } from "./engineTypes.ts";

const contract = (responsibility: ExecutiveEngineResponsibility, name: string, description: string) => Object.freeze({
  id: `executive-engine-${responsibility}`,
  name,
  responsibility,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveEngineContractDescriptor);

export const ExecutiveEngineContracts = Object.freeze([
  contract("request-interpretation", "Request Interpretation", "Describes coordination of high-level request interpretation."),
  contract("intent-coordination", "Intent Coordination", "Describes coordination of executive intent metadata."),
  contract("reasoning-coordination", "Reasoning Coordination", "Describes coordination boundaries for future reasoning layers."),
  contract("planning-coordination", "Planning Coordination", "Describes coordination boundaries for future planning layers."),
  contract("orchestration-coordination", "Orchestration Coordination", "Describes orchestration coordination metadata without execution."),
  contract("decision-coordination", "Decision Coordination", "Describes decision coordination metadata without decision logic."),
  contract("platform-coordination", "Platform Coordination", "Describes public platform coordination responsibilities."),
  contract("executive-awareness-coordination", "Executive Awareness Coordination", "Describes executive awareness coordination boundaries."),
] as const);
