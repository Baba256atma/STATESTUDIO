/**
 * DEMO-MVP:1 — Demo Profile identity.
 * Not a workspace id and not a ManagerWorkspaceKind.
 */
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";

export const demoProfileContractIdentity = "DEMO-MVP:2/DemoProfileContract" as const;

export const DEMO_PROFILE_SESSION_KEY = "nexora.demo-profile.v1";

export const MANUFACTURING_DEMO_PROFILE_ID = "manufacturing" as const;

export const PROJECT_DEMO_PROFILE_ID = "project" as const;

export const DEMO_PROFILE_IDS = Object.freeze([
  MANUFACTURING_DEMO_PROFILE_ID,
  PROJECT_DEMO_PROFILE_ID,
] as const);

export type DemoProfileId = (typeof DEMO_PROFILE_IDS)[number];

export function isDemoProfileId(value: unknown): value is DemoProfileId {
  return value === MANUFACTURING_DEMO_PROFILE_ID || value === PROJECT_DEMO_PROFILE_ID;
}

export function demoProfileImportPrefix(profileId: DemoProfileId): string {
  return `demo-profile:${profileId}:`;
}

export const DEMO_PROFILE_BOUNDARY = Object.freeze({
  identity: demoProfileContractIdentity,
  selectsManagerWorkspace: false as const,
  storedInWorkspaceRegistry: false as const,
  extendsManagerWorkspaceKind: false as const,
  validWorkspaceId: DEMO_WORKSPACE_ID,
});
