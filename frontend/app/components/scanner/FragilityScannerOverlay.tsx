"use client";

import React from "react";
import type { FragilityScanResponse } from "../../types/fragilityScanner";

export function FragilityScannerOverlay({
  result,
}: {
  result: FragilityScanResponse;
}): React.ReactElement {
  const topDrivers = result.drivers.slice(0, 3).map((driver) => driver.label);

  return (
    <section
      style={{
        padding: 10,
        borderRadius: 12,
        border: "1px solid rgba(251,146,60,0.18)",
        background: "rgba(30,41,59,0.72)",
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>Scanner Active</div>
        <div style={{ color: "#fdba74", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
          {result.fragility_level}
        </div>
      </div>
      <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.45 }}>{result.summary}</div>
      {topDrivers.length ? (
        <div style={{ color: "#94a3b8", fontSize: 11 }}>Top drivers: {topDrivers.join(" • ")}</div>
      ) : null}
    </section>
  );
}
