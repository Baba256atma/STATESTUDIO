"use client";

import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { VisualState } from "../../lib/visualState";
import { SystemVisualScene } from "./SystemVisualScene";

const demoState: VisualState = {
  t: 0,
  focus: "node_core",
  nodes: [
    {
      id: "node_core",
      shape: "sphere",
      pos: [0, 0, 0],
      color: "#8fb3ff",
      intensity: 0.6,
      opacity: 0.9,
      scale: 1.2,
    },
    {
      id: "node_limit",
      shape: "dodeca",
      pos: [1.8, 0.6, -0.4],
      color: "#f0b96a",
      intensity: 0.5,
      opacity: 0.85,
    },
    {
      id: "node_growth",
      shape: "ico",
      pos: [-1.6, -0.4, 0.6],
      color: "#8bd7a1",
      intensity: 0.7,
      opacity: 0.9,
    },
  ],
  loops: [
    {
      id: "loop_reinforce",
      type: "R",
      center: [0, 0, 0],
      radius: 1.6,
      intensity: 0.5,
      flowSpeed: 0.6,
    },
    {
      id: "loop_balance",
      type: "B",
      center: [0, 0, 0],
      radius: 2.4,
      intensity: 0.4,
      flowSpeed: 0.4,
      bottleneck: 0.6,
      delay: 0.4,
    },
  ],
  levers: [
    {
      id: "lever_policy",
      target: "node_limit",
      pos: [2.6, -0.8, 0.2],
      strength: 0.5,
    },
  ],
  flows: [
    {
      id: "flow_growth_to_limit",
      from: "node_growth",
      to: "node_limit",
      type: "tube",
      speed: 0.4,
      intensity: 0.6,
      color: "#b9c4ff",
    },
  ],
  field: {
    chaos: 0.35,
    density: 0.4,
    noiseAmp: 0.3,
  },
};

export function VisualDemo() {
  const [raw, setRaw] = useState(JSON.stringify(demoState, null, 2));
  const [focusId, setFocusId] = useState(demoState.focus);

  const parsed = useMemo(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }, [raw]);

  const visualInput = useMemo(() => {
    if (typeof parsed === "object" && parsed && !Array.isArray(parsed)) {
      return { ...parsed, focus: focusId };
    }
    return parsed;
  }, [parsed, focusId]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <SystemVisualScene visual={visualInput} onFocus={setFocusId} />
      </Canvas>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        spellCheck={false}
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          width: 320,
          height: 280,
          background: "rgba(15, 18, 24, 0.75)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10,
          padding: 10,
          fontSize: 12,
          fontFamily: "monospace",
          outline: "none",
        }}
      />
    </div>
  );
}
