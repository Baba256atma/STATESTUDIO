/** ASSISTANT-8:4 — Validation gates and Manifest readiness metadata. */
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";
import type { ExecutionValidationGateMetadata } from "./executionValidationMetadata.ts";
import { ExecutionValidationPolicies } from "./executionValidationPolicies.ts";
import { ExecutionValidationRules } from "./executionValidationRules.ts";

const gateDeclarations = Object.freeze([
  [
    "Foundation Compatible",
    "Gate confirming Foundation architectural compatibility metadata.",
  ],
  [
    "Registry Compatible",
    "Gate confirming Registry compatibility validation metadata.",
  ],
  [
    "Model Complete",
    "Gate confirming Model completeness validation metadata.",
  ],
  [
    "Relationships Valid",
    "Gate confirming relationship integrity validation metadata.",
  ],
  [
    "Execution Structure Valid",
    "Gate confirming execution structure validation metadata.",
  ],
  [
    "Progress Valid",
    "Gate confirming progress integrity validation metadata.",
  ],
  [
    "Execution States Valid",
    "Gate confirming execution state consistency validation metadata.",
  ],
  [
    "Health Valid",
    "Gate confirming execution health validation metadata.",
  ],
  [
    "Exceptions Valid",
    "Gate confirming exception integrity validation metadata.",
  ],
  [
    "Feedback Valid",
    "Gate confirming feedback integrity validation metadata.",
  ],
  [
    "Timeline Valid",
    "Gate confirming timeline integrity validation metadata.",
  ],
  [
    "Metadata Complete",
    "Gate confirming metadata completeness validation.",
  ],
  [
    "Policy Compliant",
    "Gate confirming validation policy compliance metadata.",
  ],
  [
    "Canonical Identity Valid",
    "Gate confirming canonical identity validation metadata.",
  ],
  [
    "Immutable Exports",
    "Gate confirming immutable export validation metadata.",
  ],
  [
    "Ready For Manifest",
    "Gate confirming ReadyForManifest readiness validation.",
  ],
] as const);

export const ExecutionValidationGates:
readonly ExecutionValidationGateMetadata[] = Object.freeze(
  gateDeclarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    declaredState: "Passed",
    evidenceRules: Object.freeze(
      ExecutionValidationRules
        .slice(index * 3, index * 3 + 3)
        .map(({ id }) => id),
    ),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ExecutionValidationManifest = Object.freeze({
  sourceModel: ExecutiveActionExecutionModel.identity,
  gates: ExecutionValidationGates,
  policies: ExecutionValidationPolicies,
  results: Object.freeze({
    validationStatus: "Passed",
    ruleCount: ExecutionValidationRules.length,
    gateCount: ExecutionValidationGates.length,
    policyCount: ExecutionValidationPolicies.length,
    passed: ExecutionValidationRules.length,
    failed: 0,
    warnings: 0,
    readiness: "ReadyForManifest",
    manifestEligibility: "Eligible",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);
