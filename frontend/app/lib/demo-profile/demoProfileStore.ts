/**
 * DEMO-MVP:2 — Demo Profile selection.
 *
 * Valid only while demo_workspace is the live workspace.
 * A profile id is not a workspace id, not a ManagerWorkspaceKind, and not a registry record.
 */
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { selectWorkspaceForRuntime } from "../workspace/workspaceSelectionBinding.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import {
  DEMO_PROFILE_SESSION_KEY,
  isDemoProfileId,
  MANUFACTURING_DEMO_PROFILE_ID,
  PROJECT_DEMO_PROFILE_ID,
  type DemoProfileId,
} from "./demoProfileContract.ts";
import { ensureManufacturingDemoPackage } from "./manufacturingDemoPackage.ts";
import { ensureProjectDemoPackage } from "./projectDemoPackage.ts";

export const demoProfileStoreIdentity = "DEMO-MVP:2/DemoProfileSelection" as const;

export {
  DEMO_PROFILE_BOUNDARY,
  DEMO_PROFILE_SESSION_KEY,
  MANUFACTURING_DEMO_PROFILE_ID,
  PROJECT_DEMO_PROFILE_ID,
  type DemoProfileId,
} from "./demoProfileContract.ts";

const listeners = new Set<() => void>();
let storedProfile: DemoProfileId | null = null;
let sessionMirror: DemoProfileId | null = null;

function readSessionProfile(): DemoProfileId | null {
  try {
    if (typeof sessionStorage !== "undefined") {
      const stored = sessionStorage.getItem(DEMO_PROFILE_SESSION_KEY);
      return isDemoProfileId(stored) ? stored : null;
    }
  } catch {
    // Storage can be blocked; the in-memory mirror remains the session stand-in.
  }
  return sessionMirror;
}

function writeSessionProfile(profile: DemoProfileId | null): void {
  sessionMirror = profile;
  try {
    if (typeof sessionStorage === "undefined") return;
    if (profile) sessionStorage.setItem(DEMO_PROFILE_SESSION_KEY, profile);
    else sessionStorage.removeItem(DEMO_PROFILE_SESSION_KEY);
  } catch {
    // Persistence availability does not change the in-memory selection.
  }
}

storedProfile = readSessionProfile();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeDemoProfile(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Persisted selection, including while a real workspace is active. */
export function readStoredDemoProfile(): DemoProfileId | null {
  return storedProfile;
}

/**
 * Product read path. A Demo Profile is active only for demo_workspace.
 * A stored selection does not follow the manager into a Company or Project.
 */
export function readActiveDemoProfile(): DemoProfileId | null {
  if (!isDemoProfileId(storedProfile)) return null;
  return readLiveExecutiveDataWorkspaceId() === DEMO_WORKSPACE_ID ? storedProfile : null;
}

function selectDemoProfile(profileId: DemoProfileId): boolean {
  if (getActiveWorkspaceId() !== DEMO_WORKSPACE_ID) return false;
  storedProfile = profileId;
  writeSessionProfile(profileId);
  emit();
  return readActiveDemoProfile() === profileId;
}

export function selectManufacturingDemoProfile(): boolean {
  return selectDemoProfile(MANUFACTURING_DEMO_PROFILE_ID);
}

export function selectProjectDemoProfile(): boolean {
  return selectDemoProfile(PROJECT_DEMO_PROFILE_ID);
}

export type OpenManufacturingDemoResult = Readonly<{
  opened: boolean;
  workspaceId: string | null;
  profileId: DemoProfileId | null;
  packageImportCount: number;
}>;

export type OpenDemoProfileResult = OpenManufacturingDemoResult;

/** Selects demo_workspace, selects Manufacturing, and loads the CSV package. */
export function openManufacturingDemo(): OpenDemoProfileResult {
  selectWorkspaceForRuntime(DEMO_WORKSPACE_ID);
  if (getActiveWorkspaceId() !== DEMO_WORKSPACE_ID) {
    return Object.freeze({
      opened: false,
      workspaceId: getActiveWorkspaceId(),
      profileId: null,
      packageImportCount: 0,
    });
  }
  const loaded = ensureManufacturingDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  const selected = selectManufacturingDemoProfile();
  return Object.freeze({
    opened: selected && !loaded.refused && loaded.files.every((file) => file.ready),
    workspaceId: DEMO_WORKSPACE_ID,
    profileId: readActiveDemoProfile(),
    packageImportCount: loaded.files.filter((file) => file.ready).length,
  });
}

/** Selects demo_workspace, selects Project, and loads the CSV package. */
export function openProjectDemo(): OpenDemoProfileResult {
  selectWorkspaceForRuntime(DEMO_WORKSPACE_ID);
  if (getActiveWorkspaceId() !== DEMO_WORKSPACE_ID) {
    return Object.freeze({
      opened: false,
      workspaceId: getActiveWorkspaceId(),
      profileId: null,
      packageImportCount: 0,
    });
  }
  const loaded = ensureProjectDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  const selected = selectProjectDemoProfile();
  return Object.freeze({
    opened: selected && !loaded.refused && loaded.files.every((file) => file.ready),
    workspaceId: DEMO_WORKSPACE_ID,
    profileId: readActiveDemoProfile(),
    packageImportCount: loaded.files.filter((file) => file.ready).length,
  });
}

/** Leaves demo presentation when an authorized manager workspace becomes live. */
export function releaseDemoProfileForManagerWorkspace(): void {
  storedProfile = null;
  writeSessionProfile(null);
  emit();
}

/** Re-read session after an in-memory reset. Used to prove reload continuity. */
export function restoreDemoProfileSelectionFromSession(): DemoProfileId | null {
  storedProfile = readSessionProfile();
  emit();
  return readActiveDemoProfile();
}

/** Drops process memory while leaving the session value. Proves reload. */
export function forgetDemoProfileMemoryForTests(): void {
  storedProfile = null;
  emit();
}

export function resetDemoProfileForTests(): void {
  storedProfile = null;
  writeSessionProfile(null);
  emit();
}
