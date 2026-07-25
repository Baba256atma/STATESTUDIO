/** ASSISTANT-4:7 — Exactly 16 immutable certification gates. */
import type { AssistantExecutiveGuidanceCertificationGateMetadata } from "./assistantExecutiveGuidanceCertification.types.ts";

const gates = Object.freeze([
  {
    name: "Identity Gate",
    description:
      "Gate confirming Platform canonical identity certification.",
  },
  {
    name: "Namespace Gate",
    description:
      "Gate confirming Platform namespace certification.",
  },
  {
    name: "Version Gate",
    description:
      "Gate confirming Platform version certification.",
  },
  {
    name: "Foundation Gate",
    description:
      "Gate confirming Foundation integrity certification.",
  },
  {
    name: "Registry Gate",
    description:
      "Gate confirming Registry integrity certification.",
  },
  {
    name: "Model Gate",
    description:
      "Gate confirming Model integrity certification.",
  },
  {
    name: "Validation Gate",
    description:
      "Gate confirming Validation integrity certification.",
  },
  {
    name: "Manifest Gate",
    description:
      "Gate confirming Manifest integrity certification.",
  },
  {
    name: "Platform Gate",
    description:
      "Gate confirming Platform aggregate integrity certification.",
  },
  {
    name: "Metadata Gate",
    description:
      "Gate confirming immutable metadata certification.",
  },
  {
    name: "Dependency Gate",
    description:
      "Gate confirming dependency integrity certification.",
  },
  {
    name: "Compatibility Gate",
    description:
      "Gate confirming compatibility declaration certification.",
  },
  {
    name: "Consumer Gate",
    description:
      "Gate confirming consumer-safety certification.",
  },
  {
    name: "Architecture Gate",
    description:
      "Gate confirming architecture-compliance certification.",
  },
  {
    name: "Final Approval Gate",
    description:
      "Gate confirming final architectural approval for Freeze.",
  },
  {
    name: "ReadyForFreeze Gate",
    description:
      "Gate confirming ReadyForFreeze readiness certification.",
  },
] as const);

export const AssistantExecutiveGuidanceCertificationGates:
readonly AssistantExecutiveGuidanceCertificationGateMetadata[] = Object.freeze(
  gates.map((gate, index) => Object.freeze({
    gateId: `ASSISTANT-4:7/Gate/${String(index + 1).padStart(2, "0")}`,
    name: gate.name,
    description: gate.description,
    declaredState: "Passed",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
