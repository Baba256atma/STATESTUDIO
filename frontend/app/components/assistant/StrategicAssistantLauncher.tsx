"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type StrategicAssistantLauncherProps = {
  onOpen: () => void;
  label?: string;
};

export function StrategicAssistantLauncher(props: StrategicAssistantLauncherProps) {
  return (
    <button
      type="button"
      onClick={props.onOpen}
      style={{
        height: 42,
        padding: "0 14px",
        borderRadius: 999,
        border: `1px solid ${nx.borderStrong}`,
        background: "rgba(15,23,42,0.88)",
        color: "#dbeafe",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        boxShadow: "0 14px 28px rgba(2,6,23,0.28)",
      }}
    >
      {props.label ?? "Open Strategic Assistant"}
    </button>
  );
}
