"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveSchemaPreview } from "./ExecutiveSchemaPreview";
import { useEnterpriseConnector } from "./hooks/useEnterpriseConnector";

type Props = {
  readonly onClose: () => void;
};

/**
 * Publish Wizard — Schema → Mapping → Manager Review → Approve → Publish.
 * No automatic publish.
 */
export function ExecutivePublishWizard({ onClose }: Props) {
  const {
    session,
    busy,
    error,
    startCsvSession,
    connectSampleCsv,
    applyMappings,
    updateMapping,
    approveMappings,
    publishApproved,
  } = useEnterpriseConnector();

  return (
    <div
      data-testid="executive-publish-wizard"
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
          Enterprise Connector · Publish
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          CSV → Discovery → Mapping → Manager Approval → Runtime Publish
        </p>
      </div>

      {!session ? (
        <button
          type="button"
          data-testid="connector-start-csv"
          onClick={startCsvSession}
          style={primaryButton}
        >
          Start CSV Session
        </button>
      ) : null}

      {session && session.lifecycle === "Disconnected" ? (
        <button
          type="button"
          data-testid="connector-load-sample-csv"
          disabled={busy}
          onClick={() => void connectSampleCsv()}
          style={primaryButton}
        >
          Connect Sample inventory.csv
        </button>
      ) : null}

      {session?.schema ? (
        <ExecutiveSchemaPreview
          schema={session.schema}
          stats={session.previewStats}
          validation={session.validation}
        />
      ) : null}

      {session && session.mappings.length > 0 ? (
        <section
          data-testid="executive-connector-mapping"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            padding: "0.55rem 0.6rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
          }}
        >
          <strong style={{ fontSize: "0.72rem", color: cockpit.accent }}>
            Metadata Mapping · Manager confirms (no auto-create)
          </strong>
          {session.mappings.map((mapping) => (
            <div
              key={mapping.columnName}
              data-testid={`connector-map-row-${mapping.columnName}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.4rem",
                fontSize: "0.68rem",
                color: cockpit.textSoft,
              }}
            >
              <span>
                {mapping.columnName} · {mapping.detectedType} →{" "}
                {mapping.objectLabel}
                {mapping.metadataFieldId ? " (metadata)" : ""}
              </span>
              <select
                aria-label={`Mapping status ${mapping.columnName}`}
                value={mapping.status}
                onChange={(e) =>
                  updateMapping(mapping.columnName, {
                    status: e.target.value as typeof mapping.status,
                  })
                }
                style={{
                  background: cockpit.navy,
                  color: cockpit.text,
                  border: `1px solid ${cockpit.border}`,
                  borderRadius: cockpit.radius.sm,
                  fontSize: "0.62rem",
                }}
              >
                <option value="Unmapped">Unmapped</option>
                <option value="Suggested">Suggested</option>
                <option value="Mapped">Mapped</option>
                <option value="Ignored">Ignored</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            data-testid="connector-reapply-mappings"
            onClick={applyMappings}
            style={secondaryButton}
          >
            Re-apply Metadata Suggestions
          </button>
        </section>
      ) : null}

      {error ? (
        <p
          data-testid="connector-wizard-error"
          style={{ margin: 0, color: "#F97066", fontSize: "0.72rem" }}
        >
          {error}
        </p>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {session && !session.approved ? (
          <button
            type="button"
            data-testid="connector-approve"
            disabled={!session.schema || busy}
            onClick={approveMappings}
            style={primaryButton}
          >
            Manager Approve
          </button>
        ) : null}
        {session?.approved && !session.published ? (
          <button
            type="button"
            data-testid="connector-publish"
            disabled={busy}
            onClick={() => void publishApproved()}
            style={primaryButton}
          >
            Publish to Runtime
          </button>
        ) : null}
        <button
          type="button"
          data-testid="connector-wizard-close"
          onClick={onClose}
          style={secondaryButton}
        >
          Close
        </button>
      </div>

      {session ? (
        <p
          data-testid="connector-session-lifecycle"
          style={{ margin: 0, fontSize: "0.66rem", color: cockpit.muted }}
        >
          Session · {session.lifecycle}
          {session.publishedSourceId
            ? ` · Source ${session.publishedSourceId}`
            : ""}
        </p>
      ) : null}
    </div>
  );
}

const primaryButton = {
  padding: "0.4rem 0.65rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.accent}`,
  background: cockpit.accentSoft,
  color: cockpit.accent,
  fontSize: "0.68rem",
  cursor: "pointer",
  fontFamily: "inherit",
} as const;

const secondaryButton = {
  ...primaryButton,
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.muted,
};
