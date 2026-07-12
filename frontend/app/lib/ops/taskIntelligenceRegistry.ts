import { TaskIntelligenceIdentity } from "./taskIntelligenceIdentity.ts";

export const TaskIntelligenceRegistry = Object.freeze({
  platformId: TaskIntelligenceIdentity.platformId,
  namespace: TaskIntelligenceIdentity.platformNamespace,
  version: TaskIntelligenceIdentity.platformVersion,
  releaseStage: "Draft",
  supportedTaskCapabilities: Object.freeze([
    "Executive Task",
    "Operational Task",
    "Strategic Task",
    "Approval Task",
    "Review Task",
    "Automated Task",
    "Manual Task",
  ]),
  architecturalScope:
    "Defines canonical metadata contracts for operational task intelligence.",
  registeredPhases: Object.freeze([
    Object.freeze({
      phaseId: "OPS-2:1",
      phaseName: "Task Intelligence Foundation",
      phaseVersion: "1.0.0",
      phaseStatus: "Foundation",
      metadataOnly: true,
      deterministic: true,
    }),
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
