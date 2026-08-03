"use client";

import { ExecutiveDataCatalog } from "./ExecutiveDataCatalog";
import { ExecutiveDataFilterBar } from "./ExecutiveDataFilterBar";
import { ExecutiveDataSearch } from "./ExecutiveDataSearch";
import { ExecutiveDataToolbar } from "./ExecutiveDataToolbar";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onAddSource: () => void;
};

/**
 * ExecutiveDataExplorer — Data Catalog content for Explorer Drawer.
 */
export function ExecutiveDataExplorer({ onAddSource }: Props) {
  const { connectedCount, warningCount, sources } = useExecutiveData();

  return (
    <div
      data-testid="executive-data-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Data Catalog
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          {sources.length} sources · {connectedCount} connected · {warningCount}{" "}
          warning
        </p>
      </div>
      <ExecutiveDataToolbar onAddSource={onAddSource} />
      <ExecutiveDataSearch />
      <ExecutiveDataFilterBar />
      <ExecutiveDataCatalog />
    </div>
  );
}
