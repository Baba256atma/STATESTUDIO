"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import {
  PIPELINE_PREVIEW_PAGE_SIZES,
  type PipelinePreviewAction,
  type PipelinePreviewPageSize,
  type PipelinePreviewViewModel,
} from "../../lib/pipeline/pipelinePreviewTypes";

export interface PipelinePreviewPaginationProps {
  readonly preview: PipelinePreviewViewModel;
  readonly dispatch: (action: PipelinePreviewAction) => void;
}

export function PipelinePreviewPagination({ preview, dispatch }: PipelinePreviewPaginationProps) {
  const { pagination } = preview;
  return (
    <nav
      aria-label="Preview pagination"
      className="pipeline-preview-pagination"
      style={{
        ...softCardStyle,
        padding: 12,
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          aria-label="Previous preview page"
          disabled={!pagination.canPrevious}
          onClick={() => dispatch({ type: "SET_PAGE", page: pagination.currentPage - 1 })}
          style={buttonStyle(!pagination.canPrevious)}
        >
          Previous
        </button>
        <span role="status" style={{ fontSize: 13, color: nx.text }}>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          type="button"
          aria-label="Next preview page"
          disabled={!pagination.canNext}
          onClick={() => dispatch({ type: "SET_PAGE", page: pagination.currentPage + 1 })}
          style={buttonStyle(!pagination.canNext)}
        >
          Next
        </button>
      </div>
      <div>
        <label htmlFor="pipeline-page-size" style={{ fontSize: 12, color: nx.muted, marginRight: 8 }}>
          Page size
        </label>
        <select
          id="pipeline-page-size"
          value={pagination.pageSize}
          onChange={(event) =>
            dispatch({
              type: "SET_PAGE_SIZE",
              pageSize: Number(event.target.value) as PipelinePreviewPageSize,
            })
          }
          style={{
            border: `1px solid ${nx.border}`,
            borderRadius: 6,
            background: nx.bgControl,
            color: nx.text,
            padding: "6px 8px",
            fontSize: 13,
          }}
        >
          {PIPELINE_PREVIEW_PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

const buttonStyle = (disabled: boolean): React.CSSProperties => ({
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.btnSecondaryText,
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 12,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.55 : 1,
});
