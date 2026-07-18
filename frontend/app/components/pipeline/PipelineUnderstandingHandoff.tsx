"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { PipelinePreviewViewModel } from "../../lib/pipeline/pipelinePreviewTypes";
import type { PipelineUnderstandingIntakeResult } from "../../lib/pipeline/pipelineUnderstandingContractTypes";

export interface PipelineUnderstandingHandoffProps {
  readonly preview: PipelinePreviewViewModel;
  readonly onConfirm: () => void;
  readonly intakeResult?: PipelineUnderstandingIntakeResult | null;
}

export function PipelineUnderstandingHandoffPanel({
  preview,
  onConfirm,
  intakeResult = null,
}: PipelineUnderstandingHandoffProps) {
  const contractValid = intakeResult?.ok === true && intakeResult.summary.contractValid;
  const ready = intakeResult?.summary.readyForDKL3Intake === true;
  const selectedColumns =
    intakeResult?.summary.selectedColumnCount ?? preview.handoff?.selectedColumnCount ?? 0;
  const blockingIssues = intakeResult?.summary.blockingIssueCount ?? preview.handoff?.blockingIssueCount ?? 0;
  const failures =
    intakeResult && !intakeResult.ok
      ? intakeResult.validationResults.filter((r) => r.status === "FAIL")
      : [];

  return (
    <section aria-label="Understanding handoff" style={{ ...softCardStyle, padding: 16 }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 15, color: nx.textStrong }}>
        Understanding Handoff
      </h2>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: nx.muted }}>
        Confirming creates an immutable UI handoff and validates the Pipeline-to-DKL-3 contract. It
        does not save the dataset or start Data Understanding.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!preview.canConfirm}
          aria-disabled={!preview.canConfirm}
          title={preview.confirmDisabledReason ?? undefined}
          style={{
            border: `1px solid ${nx.primaryCtaBorder}`,
            background: nx.primaryCtaBg,
            color: nx.primaryCtaColor,
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 14,
            fontWeight: 600,
            cursor: preview.canConfirm ? "pointer" : "not-allowed",
            opacity: preview.canConfirm ? 1 : 0.55,
          }}
        >
          Confirm Preview
        </button>
        {!preview.canConfirm && preview.confirmDisabledReason ? (
          <span style={{ fontSize: 12, color: nx.muted }}>{preview.confirmDisabledReason}</span>
        ) : null}
      </div>

      {preview.reviewStatus === "ReadyForUnderstanding" && preview.handoff ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 8,
            border: `1px solid ${contractValid ? nx.success : nx.risk}`,
            background: nx.bgControl,
          }}
        >
          <p style={{ margin: 0, color: nx.textStrong, fontWeight: 700 }}>
            Preview confirmed.{" "}
            {ready ? "Ready for Data Understanding." : "Contract validation incomplete."}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: nx.muted }}>
            Handoff {preview.handoff.handoffId} · {preview.handoff.selectedColumnCount} columns ·
            nextPlatform {preview.handoff.nextPlatform}
          </p>

          {intakeResult ? (
            <dl
              aria-label="Handoff contract status"
              style={{
                margin: "12px 0 0",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "4px 12px",
                fontSize: 13,
              }}
            >
              <dt style={{ color: nx.muted }}>Handoff Contract</dt>
              <dd style={{ margin: 0, color: nx.textStrong, fontWeight: 600 }}>
                {contractValid ? "Valid" : "Invalid"}
              </dd>
              <dt style={{ color: nx.muted }}>Target Platform</dt>
              <dd style={{ margin: 0 }}>DKL-3</dd>
              <dt style={{ color: nx.muted }}>Data Scope</dt>
              <dd style={{ margin: 0 }}>Preview Only</dd>
              <dt style={{ color: nx.muted }}>Selected Columns</dt>
              <dd style={{ margin: 0 }}>{selectedColumns}</dd>
              <dt style={{ color: nx.muted }}>Blocking Issues</dt>
              <dd style={{ margin: 0 }}>{blockingIssues}</dd>
              <dt style={{ color: nx.muted }}>DKL-3 Intake Readiness</dt>
              <dd style={{ margin: 0 }}>{ready ? "ReadyForDKL3Intake" : "NotReady"}</dd>
            </dl>
          ) : null}

          {failures.length > 0 ? (
            <ul
              aria-label="Contract validation failures"
              style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 12, color: nx.risk }}
            >
              {failures.map((f) => (
                <li key={f.ruleId}>
                  {f.ruleId}: {f.message}
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            disabled
            aria-disabled="true"
            title="DKL-3 is not available yet"
            style={{
              marginTop: 10,
              border: `1px solid ${nx.border}`,
              background: nx.btnSecondaryBg,
              color: nx.btnSecondaryText,
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 13,
              cursor: "not-allowed",
              opacity: 0.6,
            }}
          >
            Start Data Understanding — Coming Soon
          </button>
        </div>
      ) : null}

      {preview.reviewStatus === "Blocked" ? (
        <p role="status" style={{ marginTop: 12, color: nx.risk, fontSize: 13 }}>
          Review blocked by Blocking diagnostics. Confirmation is unavailable.
        </p>
      ) : null}
    </section>
  );
}
