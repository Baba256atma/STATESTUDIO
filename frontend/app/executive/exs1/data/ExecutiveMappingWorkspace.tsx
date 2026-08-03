"use client";

import { ExecutiveMetadataEditor } from "../metadata";
import { ExecutiveMappingRow } from "./ExecutiveMappingRow";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

export function ExecutiveMappingWorkspace() {
  const { selectedMappings, selectedSource } = useExecutiveData();

  return (
    <section
      data-testid="executive-mapping-workspace"
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <p
        style={{
          margin: 0,
          fontSize: cockpit.type.status.size,
          letterSpacing: cockpit.type.status.tracking,
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Executive Mapping · {selectedSource?.name ?? "All sources"}
      </p>
      {selectedMappings.map((mapping) => (
        <ExecutiveMappingRow key={mapping.id} mapping={mapping} />
      ))}
      <ExecutiveMetadataEditor />
    </section>
  );
}
