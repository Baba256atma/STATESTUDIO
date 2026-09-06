import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  writeCanonicalRisk,
  type CanonicalRiskConfirmation,
  type CanonicalRiskWriteResult,
} from "../risk/canonicalRiskWriter.ts";
import type { EcaMutationProposal } from "./ecaWorkingConversationContext.ts";

export type EcaRiskMutationHandoffInput = Readonly<{
  workspaceId: WorkspaceId;
  proposal: EcaMutationProposal;
  confirmation: CanonicalRiskConfirmation | null;
  evidenceRefs?: readonly string[];
}>;

export function handoffEcaRiskMutation(
  input: EcaRiskMutationHandoffInput,
): CanonicalRiskWriteResult {
  if (input.proposal.status !== "PROPOSED") {
    return Object.freeze({ status: "REJECTED", riskId: null, risk: null, reason: "proposal_not_active" });
  }
  if (input.proposal.operation !== "ADD" || input.proposal.targetType !== "RISK") {
    return Object.freeze({ status: "REJECTED", riskId: null, risk: null, reason: "not_a_risk_create_proposal" });
  }
  const confirmation = input.confirmation;
  return writeCanonicalRisk({
    operation: "CREATE",
    workspaceId: input.workspaceId,
    name: input.proposal.proposedName,
    confirmation,
    provenance: confirmation
      ? {
          createdBy: "MANAGER",
          creationSource: "MANAGER_CONVERSATION",
          proposalId: input.proposal.proposalId,
          confirmationTurn: confirmation.turnId,
          evidenceRefs: Object.freeze([...(input.evidenceRefs ?? [])]),
        }
      : null,
  });
}