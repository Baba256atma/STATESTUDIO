import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringPolicyCategories,
} from "./executionMonitoringModelTypes.ts";
import type { ExecutionMonitoringPolicyModelDescriptor } from "./executionMonitoringModelTypes.ts";

const policyMetadata = Object.freeze({
  platformId: "OPS-9:3",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "model", "policies"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringPolicyModel = Object.freeze(
  ExecutionMonitoringPolicyCategories.map((policyCategory) =>
    Object.freeze({
      id: `monitoring-policy-${policyCategory.toLowerCase().replace(/ /g, "-")}`,
      policyCategory,
      description: `Canonical metadata descriptor for ${policyCategory.toLowerCase()} within the Executive Execution Monitoring Platform.`,
      metadata: policyMetadata,
    } as const satisfies ExecutionMonitoringPolicyModelDescriptor),
  ),
);
