"use client";

import { healthColor } from "./ExecutiveConnectorHealth";
import { useEnterpriseConnector } from "./hooks/useEnterpriseConnector";
import type { ConnectorFilter } from "./ExecutiveConnectorContracts";
import { cockpit } from "../shell/executiveCockpitTheme";

const FILTERS: readonly ConnectorFilter[] = [
  "All",
  "Connected",
  "Disconnected",
  "Errors",
  "CSV",
  "Database",
  "ERP",
  "API",
];

type Props = {
  readonly onOpenPublish: () => void;
};

/**
 * Enterprise Connectors Explorer — replaces mock Data list.
 */
export function ExecutiveConnectorExplorer({ onOpenPublish }: Props) {
  const {
    visibleStatuses,
    filter,
    setFilter,
    query,
    setQuery,
    selectedConnectorId,
    setSelectedConnectorId,
    session,
    startCsvSession,
    statuses,
  } = useEnterpriseConnector();

  const connected = statuses.filter((s) => s.connectionStatus === "Connected")
    .length;

  return (
    <div
      data-testid="executive-connector-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
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
          Enterprise Connectors
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          {statuses.length} connectors · {connected} connected · CSV reference
          ready
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        <button
          type="button"
          data-testid="connector-open-publish"
          onClick={() => {
            startCsvSession();
            onOpenPublish();
          }}
          style={{
            padding: "0.35rem 0.55rem",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.accent}`,
            background: cockpit.accentSoft,
            color: cockpit.accent,
            fontSize: "0.66rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Connect CSV
        </button>
      </div>

      <input
        data-testid="connector-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search connectors, schemas, fields, objects…"
        style={{
          padding: "0.4rem 0.5rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.border}`,
          background: cockpit.navy,
          color: cockpit.text,
          fontSize: "0.74rem",
          fontFamily: "inherit",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            data-testid={`connector-filter-${item.toLowerCase()}`}
            onClick={() => setFilter(item)}
            style={{
              padding: "0.28rem 0.45rem",
              borderRadius: cockpit.radius.sm,
              border:
                filter === item
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
              background: filter === item ? cockpit.accentSoft : "transparent",
              color: filter === item ? cockpit.accent : cockpit.muted,
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        data-testid="executive-connector-list"
        style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
      >
        {visibleStatuses.map((item) => {
          const selected = selectedConnectorId === item.descriptor.id;
          const color = healthColor(item.health.state);
          return (
            <button
              key={item.descriptor.id}
              type="button"
              data-testid={`executive-connector-card-${item.descriptor.id}`}
              data-shell={item.descriptor.shell ? "true" : "false"}
              onClick={() => setSelectedConnectorId(item.descriptor.id)}
              style={{
                textAlign: "left",
                padding: "0.55rem 0.65rem",
                borderRadius: cockpit.radius.md,
                border: selected
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
                background: selected ? cockpit.accentSoft : cockpit.panelSoft,
                color: cockpit.text,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.4rem",
                }}
              >
                <strong style={{ fontSize: "0.76rem" }}>
                  {item.descriptor.name}
                </strong>
                <span style={{ fontSize: "0.58rem", color }}>
                  {item.health.state}
                </span>
              </div>
              <div
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.66rem",
                  color: cockpit.muted,
                }}
              >
                {item.descriptor.kind} · v{item.descriptor.version} ·{" "}
                {item.descriptor.owner}
              </div>
              <div
                style={{
                  marginTop: "0.2rem",
                  fontSize: "0.64rem",
                  color: cockpit.lowMuted,
                }}
              >
                Status · {item.connectionStatus}
                {item.descriptor.shell ? " · Shell" : ""} · Last Sync ·{" "}
                {item.lastSync ?? "—"} · Rows · {item.rows ?? "—"}
              </div>
              <div
                style={{
                  marginTop: "0.15rem",
                  fontSize: "0.64rem",
                  color: cockpit.muted,
                }}
              >
                Mapped Objects ·{" "}
                {item.mappedObjects.join(", ") || "—"}
              </div>
            </button>
          );
        })}
      </div>

      {session ? (
        <p
          data-testid="connector-active-session"
          style={{ margin: 0, fontSize: "0.68rem", color: cockpit.textSoft }}
        >
          Active session · {session.connectorName} · {session.lifecycle}
        </p>
      ) : null}
    </div>
  );
}
