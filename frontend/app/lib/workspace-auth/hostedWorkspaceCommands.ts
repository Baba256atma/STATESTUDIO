/**
 * HOSTED-MVP:2 — create and read hosted workspaces.
 *
 * ownerUserId always comes from the authenticated principal.
 */

import { randomBytes } from "node:crypto";

import type { NexoraPrincipal } from "@/app/lib/auth/nexoraPrincipal.ts";
import { isManagerWorkspaceKind } from "@/app/lib/workspace/workspaceRegistryContract.ts";

import { authorizeNexoraWorkspace, type WorkspaceAuthorization } from "./authorizeNexoraWorkspace.ts";
import { isCustomerHostedWorkspaceId } from "./hostedWorkspaceId.ts";
import type { HostedWorkspace, HostedWorkspaceKind } from "./hostedWorkspaceRecord.ts";
import { HostedWorkspaceUnavailable, insertHostedWorkspace, listHostedWorkspaces } from "./hostedWorkspaceStore.ts";

const NAME_LIMIT = 80;
const REJECTED_OWNER_FIELDS = ["ownerUserId", "userId", "accountId"] as const;

export type HostedWorkspaceCommandResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; outcome: Exclude<WorkspaceAuthorization["outcome"], "AUTHORIZED"> | "INVALID" }>;

export function hostedWorkspaceCreationRejected(body: object): boolean {
  return REJECTED_OWNER_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(body, field));
}

export function assessHostedWorkspaceName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > NAME_LIMIT) return null;
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null;
  return trimmed;
}

export function createHostedWorkspaceId(): string {
  return `ws_${randomBytes(16).toString("base64url")}`;
}

export async function createHostedWorkspace(input: {
  readonly principal: NexoraPrincipal | null;
  readonly name: unknown;
  readonly kind: unknown;
}): Promise<HostedWorkspaceCommandResult<HostedWorkspace>> {
  if (!input.principal?.userId) return Object.freeze({ ok: false, outcome: "NOT_AUTHENTICATED" });
  const name = assessHostedWorkspaceName(input.name);
  if (!name || !isManagerWorkspaceKind(input.kind)) return Object.freeze({ ok: false, outcome: "INVALID" });
  const kind: HostedWorkspaceKind = input.kind;
  try {
    let workspaceId = createHostedWorkspaceId();
    if (!isCustomerHostedWorkspaceId(workspaceId)) workspaceId = createHostedWorkspaceId();
    const workspace = await insertHostedWorkspace({
      workspaceId,
      ownerUserId: input.principal.userId,
      name,
      kind,
      createdAt: new Date().toISOString(),
    });
    if (workspace.ownerUserId !== input.principal.userId) {
      return Object.freeze({ ok: false, outcome: "UNAVAILABLE" });
    }
    return Object.freeze({ ok: true, value: workspace });
  } catch (error) {
    if (error instanceof HostedWorkspaceUnavailable) return Object.freeze({ ok: false, outcome: "UNAVAILABLE" });
    return Object.freeze({ ok: false, outcome: "UNAVAILABLE" });
  }
}

export async function listOwnedHostedWorkspaces(
  principal: NexoraPrincipal | null,
): Promise<HostedWorkspaceCommandResult<readonly HostedWorkspace[]>> {
  if (!principal?.userId) return Object.freeze({ ok: false, outcome: "NOT_AUTHENTICATED" });
  try {
    return Object.freeze({ ok: true, value: await listHostedWorkspaces(principal.userId) });
  } catch {
    return Object.freeze({ ok: false, outcome: "UNAVAILABLE" });
  }
}

export async function readAuthorizedHostedWorkspace(input: {
  readonly principal: NexoraPrincipal | null;
  readonly workspaceId: string;
}): Promise<HostedWorkspaceCommandResult<HostedWorkspace>> {
  const authorization = await authorizeNexoraWorkspace(input);
  if (authorization.outcome !== "AUTHORIZED") return Object.freeze({ ok: false, outcome: authorization.outcome });
  return Object.freeze({ ok: true, value: authorization.workspace });
}
