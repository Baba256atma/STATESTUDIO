/**
 * Manager-facing Data status projection for /executive.
 *
 * Reuses RDI / Data Reality source truth. Does not create a second
 * Data Reality state machine.
 */

import type { NexoraDatasetSource } from "@/app/lib/data-reality/dataRealityContracts";

export const nexoraMVPExecutiveDataStatusIdentity =
  "MVP:1/NexoraExecutiveDataStatusProjection" as const;

export type NexoraExecutiveDataStatusKind =
  | "local"
  | "imported"
  | "live"
  | "limited"
  | "stale";

export type NexoraExecutiveDataStatus = Readonly<{
  kind: NexoraExecutiveDataStatusKind;
  label: string;
}>;

export type ProjectNexoraExecutiveDataStatusInput = Readonly<{
  /** True only when an explicit validated RDI dataset is active. */
  readonly usesActiveDataSource: boolean;
  readonly datasetSource?: NexoraDatasetSource | null;
  readonly liveObservationActive: boolean;
  readonly csvImportActive: boolean;
  readonly hasUnresolvedReality: boolean;
  readonly stale?: boolean;
}>;

export function projectNexoraExecutiveDataStatus(
  input: ProjectNexoraExecutiveDataStatusInput,
): NexoraExecutiveDataStatus {
  if (input.stale === true && input.usesActiveDataSource) {
    return Object.freeze({ kind: "stale", label: "Stale" });
  }

  if (input.liveObservationActive && input.usesActiveDataSource) {
    if (input.hasUnresolvedReality) {
      return Object.freeze({ kind: "limited", label: "Limited" });
    }
    return Object.freeze({ kind: "live", label: "Live" });
  }

  if (
    input.csvImportActive &&
    input.usesActiveDataSource &&
    (input.datasetSource === "csv" || input.datasetSource == null)
  ) {
    if (input.hasUnresolvedReality) {
      return Object.freeze({ kind: "limited", label: "Limited" });
    }
    return Object.freeze({ kind: "imported", label: "Imported" });
  }

  if (input.usesActiveDataSource && input.datasetSource === "csv") {
    return Object.freeze({ kind: "imported", label: "Imported" });
  }

  if (
    input.usesActiveDataSource &&
    (input.datasetSource === "api" || input.datasetSource === "database")
  ) {
    return Object.freeze({ kind: "live", label: "Live" });
  }

  if (input.hasUnresolvedReality && input.usesActiveDataSource) {
    return Object.freeze({ kind: "limited", label: "Limited" });
  }

  return Object.freeze({ kind: "local", label: "Local" });
}
