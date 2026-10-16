/**
 * HOSTED-MVP:2 — server-owned workspace record.
 *
 * ownerUserId is assigned by the server from the authenticated principal.
 * It is not part of the client projection.
 */

export const hostedWorkspaceIdentity = "HOSTED-MVP:2/HostedWorkspace" as const;

export type HostedWorkspaceKind = "BUSINESS" | "PROJECT";

export type HostedWorkspace = Readonly<{
  workspaceId: string;
  ownerUserId: string;
  name: string;
  kind: HostedWorkspaceKind;
  createdAt: string;
  updatedAt: string;
}>;

export type HostedWorkspaceProjection = Readonly<{
  workspaceId: string;
  name: string;
  kind: HostedWorkspaceKind;
  createdAt: string;
  updatedAt: string;
}>;

export function projectHostedWorkspace(workspace: HostedWorkspace): HostedWorkspaceProjection {
  return Object.freeze({
    workspaceId: workspace.workspaceId,
    name: workspace.name,
    kind: workspace.kind,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  });
}
