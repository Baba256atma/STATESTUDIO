import type { DashboardContext } from "../ui/mainRightPanelContract.ts";

export type MrpSelectedObjectContext = Readonly<{
  selectedObjectId: string;
  selectedObjectLabel: string;
}>;

export function buildMrpSelectedObjectContext(input: {
  objectId: string;
  objectName?: string | null;
}): MrpSelectedObjectContext {
  const objectId = String(input.objectId ?? "").trim();
  const objectName = String(input.objectName ?? "").trim();
  return Object.freeze({
    selectedObjectId: objectId,
    selectedObjectLabel: objectName || objectId,
  });
}

export function shouldPublishMrpSelectedObjectContext(input: {
  previousSelectedObjectId: string | null;
  nextObjectId: string;
  priorDashboardContext: DashboardContext | null;
}): boolean {
  return !(
    input.previousSelectedObjectId === input.nextObjectId &&
    input.priorDashboardContext === "sources"
  );
}

/** @deprecated Use shouldPublishMrpSelectedObjectContext */
export const shouldCommitMrpSelectedObjectContext = shouldPublishMrpSelectedObjectContext;
