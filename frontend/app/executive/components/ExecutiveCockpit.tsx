"use client";

/**
 * Official Executive Cockpit composition root.
 *
 * /executive → NEX-MVP:2 Nexora Executive Shell.
 * /executive/exs1 remains the EXS development sandbox.
 */

import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";
import { NexoraExecutiveShell } from "../nex-mvp/NexoraExecutiveShell";

/**
 * ExecutiveCockpit — permanent Nexora MVP entry composition.
 */
export function ExecutiveCockpit({
  datasetScenario = "baseline",
}: {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
}) {
  return (
    <div
      data-testid="executive-cockpit"
      style={{
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <NexoraExecutiveShell datasetScenario={datasetScenario} />
    </div>
  );
}
