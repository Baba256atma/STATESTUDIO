"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";
import { CUSTOMER_DEMO_PROFILES } from "../../lib/demo/customerDemoProfiles";

type CustomerDemoSelectorProps = {
  activeProfileId: string | null;
  onChange: (profileId: string | null) => void;
};

export function CustomerDemoSelector(props: CustomerDemoSelectorProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: "rgba(2,6,23,0.58)",
        color: nx.lowMuted,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
      }}
    >
      Demo
      <select
        value={props.activeProfileId ?? ""}
        onChange={(event) => props.onChange(event.target.value || null)}
        style={{
          height: 26,
          borderRadius: 8,
          border: `1px solid ${nx.border}`,
          background: "rgba(15,23,42,0.9)",
          color: nx.text,
          fontSize: 12,
          fontWeight: 700,
          padding: "0 8px",
          outline: "none",
          minWidth: 168,
        }}
      >
        <option value="">Platform Default</option>
        {CUSTOMER_DEMO_PROFILES.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.label}
          </option>
        ))}
      </select>
    </label>
  );
}
