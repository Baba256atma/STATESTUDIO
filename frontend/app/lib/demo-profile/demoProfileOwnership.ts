/**
 * DEMO-PROFILE-OWNED-STATE:1
 *
 * Operational records inside demo_workspace carry an optional demo profile.
 * A real Company or Project never requires one. A missing profile is legacy
 * and stays stored, but a modern profile does not read or mutate it.
 */
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { isDemoProfileId, type DemoProfileId } from "./demoProfileContract.ts";
import { readActiveDemoProfile } from "./demoProfileStore.ts";

export function acceptedDemoProfileId(value: unknown): DemoProfileId | null {
  return isDemoProfileId(value) ? value : null;
}

/** Profile stamp for a new record. Real workspaces and an idle demo receive none. */
export function demoProfileIdForWrite(workspaceId: string | null | undefined): DemoProfileId | null {
  if (workspaceId !== DEMO_WORKSPACE_ID) return null;
  return readActiveDemoProfile();
}

/**
 * Modern demo reads see only the active profile.
 * Without a modern profile, profile-owned records stay hidden and legacy records remain visible.
 * Records outside demo_workspace are unaffected.
 */
export function demoProfileVisible(
  workspaceId: string | null | undefined,
  recordProfileId: string | null | undefined,
): boolean {
  if (workspaceId !== DEMO_WORKSPACE_ID) return true;
  const active = readActiveDemoProfile();
  const owned = acceptedDemoProfileId(recordProfileId);
  if (!active) return owned == null;
  return owned === active;
}

/** Active profile mutates only its own records. Foreign and legacy demo records stay unchanged. */
export function demoProfileMutationAllowed(
  workspaceId: string | null | undefined,
  recordProfileId: string | null | undefined,
): boolean {
  if (workspaceId !== DEMO_WORKSPACE_ID) return true;
  const active = readActiveDemoProfile();
  const owned = acceptedDemoProfileId(recordProfileId);
  if (!active) return owned == null;
  return owned === active;
}
