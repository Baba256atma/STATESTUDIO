"use client";

/**
 * Executive Shell host for the Nexora MVP Executive Decision Environment.
 * Composes NEX-MVP:2 via ExecutiveCockpit → NexoraExecutiveShell.
 */

import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";
import { ExecutiveCockpit } from "./ExecutiveCockpit";

/**
 * Executive Shell — full-viewport cockpit container.
 */
export function ExecutiveShell({
  datasetScenario = "baseline",
}: {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
}) {
  return (
    <div
      data-testid="executive-shell"
      style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ExecutiveCockpit datasetScenario={datasetScenario} />
    </div>
  );
}
