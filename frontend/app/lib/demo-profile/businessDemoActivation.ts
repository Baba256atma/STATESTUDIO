/**
 * BUSINESS-DEMO-STAGE-AND-SELECTOR:1 — open Business Demo.
 *
 * Selects the existing business_demo_workspace and loads its CSV package.
 * It does not create a demo profile, a customer Workspace, or a Deck.
 */
import type { CsvDurabilityStorage } from "../data-reality/csvRealDataImportDurability.ts";
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { BUSINESS_DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import { selectWorkspaceForRuntime } from "../workspace/workspaceSelectionBinding.ts";
import {
  ensureBusinessDemoPackage,
  listBusinessDemoPackageImports,
  type BusinessDemoPackageStatus,
} from "./businessDemoPackage.ts";

const listeners = new Set<() => void>();
let activationStatus: BusinessDemoPackageStatus | null = null;

export type BusinessDemoOpenResult = Readonly<{
  opened: boolean;
  workspaceId: string | null;
  profileId: null;
  status: BusinessDemoPackageStatus | "not_selected";
  importIds: readonly string[];
}>;

export function subscribeBusinessDemoActivation(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readBusinessDemoActivationStatus(): BusinessDemoPackageStatus | null {
  return activationStatus;
}

export function publishBusinessDemoActivation(status: BusinessDemoPackageStatus | null): void {
  activationStatus = status;
  listeners.forEach((listener) => listener());
}

export function resetBusinessDemoActivationForTests(): void {
  activationStatus = null;
  listeners.clear();
}

/** Selects Business Demo and loads its package. A stored Manufacturing or Project profile stays stored. */
export async function openBusinessDemo(input: {
  readonly storage?: CsvDurabilityStorage;
  readonly writtenAt?: string;
} = {}): Promise<BusinessDemoOpenResult> {
  selectWorkspaceForRuntime(BUSINESS_DEMO_WORKSPACE_ID);
  if (getActiveWorkspaceId() !== BUSINESS_DEMO_WORKSPACE_ID) {
    return Object.freeze({
      opened: false,
      workspaceId: getActiveWorkspaceId(),
      profileId: null,
      status: "not_selected" as const,
      importIds: Object.freeze([]),
    });
  }
  const report = await ensureBusinessDemoPackage(input);
  if (readLiveExecutiveDataWorkspaceId() !== BUSINESS_DEMO_WORKSPACE_ID) {
    return Object.freeze({
      opened: false,
      workspaceId: readLiveExecutiveDataWorkspaceId(),
      profileId: null,
      status: report.status,
      importIds: Object.freeze([]),
    });
  }
  publishBusinessDemoActivation(report.status);
  const importIds = Object.freeze(listBusinessDemoPackageImports().map((entry) => entry.importId));
  const opened = report.status === "loaded" || report.status === "already_present";
  return Object.freeze({
    opened,
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    profileId: null,
    status: report.status,
    importIds,
  });
}
