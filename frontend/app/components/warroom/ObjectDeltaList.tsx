"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { CompareObjectDelta } from "../../lib/compare/compareTypes";

type ObjectDeltaListProps = {
  items: CompareObjectDelta[];
};

function labelForId(value: string): string {
  return value.replace(/^obj_/, "").replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function ObjectDeltaList({ items }: ObjectDeltaListProps) {
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.slice(0, 5).map((item) => (
        <div key={item.object_id} style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{labelForId(item.object_id)}</div>
          <div style={{ color: nx.muted, fontSize: 12 }}>{item.rationale}</div>
        </div>
      ))}
    </div>
  );
}
