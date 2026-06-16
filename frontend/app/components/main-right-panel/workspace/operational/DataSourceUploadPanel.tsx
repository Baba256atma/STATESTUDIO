"use client";

import React from "react";

import { uploadDataSource } from "../../../../lib/data-sources/dataSourceUploadRuntime.ts";
import {
  operationalCardDetailStyle,
  operationalCardHeadlineStyle,
  operationalCardStyle,
  operationalSectionLabelStyle,
  operationalVisualColors,
  operationalVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type DataSourceUploadPanelProps = Readonly<{
  onUploadComplete?: () => void;
}>;

type UploadState = Readonly<{
  status: "idle" | "uploading" | "success" | "error";
  message: string;
}>;

const IDLE_UPLOAD_STATE: UploadState = Object.freeze({
  status: "idle",
  message: "Upload CSV, XLSX, or JSON files. Nexora records metadata only.",
});

function dataSourceUploadButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    alignSelf: "flex-start",
    border: `1px solid ${operationalVisualColors.border}`,
    borderRadius: 999,
    background: disabled ? "var(--nx-bg-muted)" : "var(--nx-bg-control)",
    color: disabled ? operationalVisualColors.muted : operationalVisualColors.accent,
    cursor: disabled ? "default" : "pointer",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    padding: "8px 12px",
    textTransform: "uppercase",
  };
}

export function DataSourceUploadPanel(props: DataSourceUploadPanelProps): React.ReactElement {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadState, setUploadState] = React.useState<UploadState>(IDLE_UPLOAD_STATE);
  const { onUploadComplete } = props;

  const handleUploadClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      event.target.value = "";
      if (!file) return;

      setUploadState(Object.freeze({ status: "uploading", message: "Reading source metadata..." }));
      const result = await uploadDataSource(file);
      if (!result.success || !result.source) {
        setUploadState(Object.freeze({
          status: "error",
          message:
            result.reason === "unsupported_file_type"
              ? "Unsupported file type. Upload CSV, XLSX, or JSON."
              : "Upload rejected. Source metadata was not registered.",
        }));
        return;
      }

      setUploadState(Object.freeze({
        status: "success",
        message: `${result.source.sourceName} registered with ${result.source.recordCount} records.`,
      }));
      onUploadComplete?.();
    },
    [onUploadComplete]
  );

  const uploading = uploadState.status === "uploading";

  return (
    <section
      data-nx="data-source-upload-panel"
      data-ds-upload-runtime="metadata-only"
      style={operationalCardStyle(uploadState.status === "error" ? "warning" : "accent")}
      aria-label="Data source upload"
    >
      <div style={operationalSectionLabelStyle()}>Data Sources</div>
      <div style={operationalCardHeadlineStyle("accent")}>Upload business file</div>
      <p style={operationalCardDetailStyle()}>{uploadState.message}</p>
      <div
        style={{
          display: "flex",
          gap: operationalVisualSpacing.cardGap,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          style={dataSourceUploadButtonStyle(uploading)}
        >
          {uploading ? "Uploading..." : "Upload Source"}
        </button>
        <span style={{ color: operationalVisualColors.muted, fontSize: 12 }}>
          CSV · XLSX · JSON
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.json,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-hidden
      />
    </section>
  );
}

export default DataSourceUploadPanel;

