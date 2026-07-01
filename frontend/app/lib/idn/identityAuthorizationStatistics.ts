import type { AuthorizationDecision } from "./identityAuthorizationTypes.ts";
import type { PermissionAction, PermissionResource } from "./identityPermissionIndex.ts";

export type AuthorizationStatistics = Readonly<{
  totalEvaluations: number;
  allowCount: number;
  denyCount: number;
  indeterminateCount: number;
  evaluationsByAction: Readonly<Record<string, number>>;
  evaluationsByResource: Readonly<Record<string, number>>;
  evaluationsByScope: Readonly<Record<string, number>>;
}>;

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

export function getAuthorizationStatistics(
  decisions: readonly AuthorizationDecision[],
  requests: readonly { action: PermissionAction; resource: PermissionResource; scopeIdentityId: string | "Global" }[]
): AuthorizationStatistics {
  const evaluationsByAction: Record<string, number> = {};
  const evaluationsByResource: Record<string, number> = {};
  const evaluationsByScope: Record<string, number> = {};

  requests.forEach((request) => {
    increment(evaluationsByAction, request.action);
    increment(evaluationsByResource, request.resource);
    increment(evaluationsByScope, request.scopeIdentityId);
  });

  return Object.freeze({
    totalEvaluations: decisions.length,
    allowCount: decisions.filter((decision) => decision.decision === "Allow").length,
    denyCount: decisions.filter((decision) => decision.decision === "Deny").length,
    indeterminateCount: decisions.filter((decision) => decision.decision === "Indeterminate").length,
    evaluationsByAction: Object.freeze(evaluationsByAction),
    evaluationsByResource: Object.freeze(evaluationsByResource),
    evaluationsByScope: Object.freeze(evaluationsByScope),
  });
}
