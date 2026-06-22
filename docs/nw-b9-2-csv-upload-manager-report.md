# NW-B:9-2 CSV Upload Manager Report

Required tags:

[NWB92]
[CSV_UPLOAD_MANAGER]
[CSV_REGISTRATION_ACTIVE]

## Summary

NW-B:9-2 adds a workspace-scoped CSV upload manager. Workspace owners can upload `.csv` files, validate them against platform limits, register them in the workspace data source registry, and track upload status with user-friendly errors.

## Implementation

| Layer | Path |
|---|---|
| Contract | `frontend/app/lib/workspace/workspaceCsvUploadContract.ts` |
| Validation | `frontend/app/lib/workspace/workspaceCsvUploadValidation.ts` |
| Upload runtime + status tracking | `frontend/app/lib/workspace/workspaceCsvUploadRuntime.ts` |
| Registry integration | `frontend/app/lib/workspace/workspaceDataSourceRegistry.ts` |

## Upload Flow

```text
Upload CSV
  ↓
Validate (type, size, parse, rows/columns)
  ↓
Register in workspace data source registry
  ↓
Available in workspace via listWorkspaceDataSources / getWorkspaceDataSources
```

## Required Metadata

Each successful upload captures:

| Field | Description |
|---|---|
| `fileName` | Original uploaded file name |
| `fileSize` | File size in bytes |
| `rowCount` | Data row count (excluding header) |
| `columnCount` | Column count from header |
| `uploadTime` | ISO upload timestamp |
| `workspaceId` | Owning workspace |

Metadata is stored on the registered workspace data source entry and mirrored in CSV upload status history.

## Platform Limits

Maximum CSV upload size: **2 MB** (`MAX_WORKSPACE_CSV_UPLOAD_BYTES`), aligned with the backend CSV connector safety cap.

## Error Handling

| Error | User message |
|---|---|
| Invalid CSV | This file is not a valid CSV. Check the format and try again. |
| Corrupted CSV | This CSV appears corrupted or unreadable. Try exporting a fresh copy. |
| Empty CSV | This CSV is empty. Add column headers and at least one data row. |
| Oversized CSV | This CSV exceeds the platform upload limit of 2 MB. |

Invalid uploads do not mutate the workspace registry.

## Status Tracking

Upload status history is tracked per workspace:

- `validating`
- `registering`
- `success`
- `failed`

API:

- `listWorkspaceCsvUploadStatuses(workspaceId)`
- `getLatestWorkspaceCsvUploadStatus(workspaceId)`

## Diagnostics

Development-only diagnostics:

- `[CsvUpload] Upload Started`
- `[CsvUpload] Upload Success`
- `[CsvUpload] Upload Failed`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceCsvUploadRuntime.test.ts
node --test app/lib/workspace/workspaceDataSourceRegistry.test.ts
npm run build
```

## Acceptance Status

PASS:

- CSV upload works
- Metadata captured
- Registry updated
- Invalid CSV handled
- Build passes

## Scope Notes

This phase registers CSV metadata in the workspace registry only. Ingestion, KPI binding, and UI upload panels remain future integration work.
