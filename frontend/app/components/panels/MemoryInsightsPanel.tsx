"use client";

import React from "react";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

type MemoryV2 = {
  similar_patterns?: Array<{ episode_id?: string; score?: number; label?: string }>;
  repeated_conflicts?: Array<{ pair?: [string, string] | string[]; count?: number; avg_score?: number }>;
  object_bias?: Array<{ id?: string; boost?: number }>;
  memory_reasoning?: string;
};

export default function MemoryInsightsPanel({ memory }: { memory: MemoryV2 | null | undefined }) {
  if (!memory) {
    return <EmptyStateCard text="No insights yet. Run a simulation or send a chat command to generate insights." />;
  }

  const similar = Array.isArray(memory.similar_patterns) ? memory.similar_patterns : [];
  const repeated = Array.isArray(memory.repeated_conflicts) ? memory.repeated_conflicts : [];
  const bias = Array.isArray(memory.object_bias) ? memory.object_bias : [];
  const hasAny = similar.length > 0 || repeated.length > 0 || bias.length > 0 || Boolean(memory.memory_reasoning);
  if (!hasAny) {
    return <EmptyStateCard text="No insights yet. Run a simulation or send a chat command to generate insights." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Memory Summary</div>
      <div style={{ ...softCardStyle, padding: 10 }}>
        <div style={{ color: nx.text, fontSize: 12 }}>
          Similar patterns: {similar.length}
        </div>
        <div style={{ color: nx.text, fontSize: 12 }}>
          Repeated conflicts: {repeated.length}
        </div>
        <div style={{ color: nx.text, fontSize: 12 }}>
          Object bias signals: {bias.length}
        </div>
      </div>

      {similar.length ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={sectionTitleStyle}>Top Similar Patterns</div>
          {similar.slice(0, 3).map((p, i) => (
            <div key={`${p.episode_id ?? "ep"}-${i}`} style={{ fontSize: 12, color: nx.text }}>
              • {String(p.label ?? "Similar prior pattern")} ({Number(p.score ?? 0).toFixed(2)})
            </div>
          ))}
        </div>
      ) : null}

      {repeated.length ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={sectionTitleStyle}>Top Repeated Conflicts</div>
          {repeated.slice(0, 3).map((c, i) => (
            <div key={`conf-${i}`} style={{ fontSize: 12, color: nx.text }}>
              • {String(c.pair?.[0] ?? "unknown")} {"\u2194"} {String(c.pair?.[1] ?? "unknown")} ({Number(c.count ?? 0)}x)
            </div>
          ))}
        </div>
      ) : null}

      {bias.length ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={sectionTitleStyle}>Top Object Bias</div>
          {bias.slice(0, 3).map((b, i) => (
            <div key={`${b.id ?? "obj"}-${i}`} style={{ fontSize: 12, color: nx.text }}>
              • {String(b.id ?? "unknown")} (+{Number(b.boost ?? 0).toFixed(2)})
            </div>
          ))}
        </div>
      ) : null}

      {memory.memory_reasoning ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={sectionTitleStyle}>Interpretation</div>
          <div style={{ fontSize: 11, color: nx.muted }}>{String(memory.memory_reasoning)}</div>
        </div>
      ) : null}

      {!similar.length && !repeated.length && !bias.length ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ fontSize: 12, color: nx.muted }}>
            No insights yet. Run a simulation or send a chat command to generate insights.
          </div>
        </div>
      ) : null}
    </div>
  );
}
