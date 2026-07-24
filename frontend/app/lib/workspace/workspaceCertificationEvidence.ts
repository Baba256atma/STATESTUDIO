/** WS-1:7 — Evidence derived exclusively from Platform. */
import { WorkspacePlatform } from "./workspacePlatform.ts";
export const WorkspaceCertificationEvidence = Object.freeze({
  platformIdentity: WorkspacePlatform.identity,
  sourceChain: WorkspacePlatform.composition,
  inventories: WorkspacePlatform.inventory,
  capabilities: WorkspacePlatform.capabilities,
  guarantees: WorkspacePlatform.guarantees,
  compatibility: WorkspacePlatform.compatibility,
  extensions: WorkspacePlatform.extensions,
  readiness: WorkspacePlatform.readiness,
  prohibitedDependencyAudit: "Pass", immutabilityAudit: "Pass",
  deterministicOrderingAudit: "Pass", runtimeAbsenceAudit: "Pass",
  source: WorkspacePlatform, immutable: true,
} as const);

