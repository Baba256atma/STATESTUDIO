/**
 * NEX-MVP:2 — Nexora Executive Decision Environment entry.
 *
 * Permanent production route: /executive
 * Composes NEX-MVP:2 Executive Shell on NEX-MVP:1 foundation.
 * Development sandbox remains at /executive/exs1.
 *
 * P0:5 development verification:
 *   /executive?dataset=baseline
 *   /executive?dataset=operational-pressure
 */

import type { Metadata } from "next";
import { ExecutiveShell } from "./components/ExecutiveShell";
import { parseNexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";

export const metadata: Metadata = {
  title: "Nexora · Executive Environment",
  description:
    "Nexora Executive Decision Environment — Stage-centered executive experience.",
};

/**
 * Executive Experience page — canonical MVP entry at /executive.
 */
export default async function ExecutivePage({
  searchParams,
}: {
  searchParams: Promise<{
    dataset?: string | string[];
    entrance?: string | string[];
    reset?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.dataset) ? params.dataset[0] : params.dataset;
  const datasetScenario = parseNexoraMVPDataRealityDatasetScenario(raw);
  const entranceRaw = Array.isArray(params.entrance)
    ? params.entrance[0]
    : params.entrance;
  const resetRaw = Array.isArray(params.reset) ? params.reset[0] : params.reset;
  const entranceRequested =
    entranceRaw === "1" || entranceRaw === "true" || entranceRaw === "first-time";
  const resetEntrance = resetRaw === "1" || resetRaw === "true";

  return (
    <main
      data-testid="executive-page"
      data-nexora-dataset={datasetScenario}
      data-nex-exp1-requested={entranceRequested ? "true" : "false"}
      style={{
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0a0e14",
        color: "#e8eef6",
        fontFamily:
          '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <ExecutiveShell
        datasetScenario={datasetScenario}
        entranceRequested={entranceRequested}
        resetEntrance={resetEntrance}
      />
    </main>
  );
}
