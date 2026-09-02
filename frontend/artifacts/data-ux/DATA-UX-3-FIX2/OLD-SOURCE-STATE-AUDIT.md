# Old Source State Audit

## Finding

Previous CSV files and Downloads-based testing did **not** contribute to this failure.

## Evidence

- `csvRealDataImportStore.ts` is an in-memory, workspace-keyed, source-keyed store. It does not read browser storage, Downloads paths, or filesystem history.
- A fresh `/executive` session showed no committed CSV sources before the FIX2 proof. The unrelated Revenue failure still has a deterministic automated reproduction.
- The failing call unconditionally supplied the static Executive Operations KPI registry before consulting any committed-source collection.
- Repository searches found historical CSV fixtures and source artifacts, but no Downloads path participating in the RDI:2 validation call chain.
- Regression coverage commits an earlier Finance source, then independently prepares/commits Delivery and replaces Delivery. Finance remains unchanged and does not add requirements to Delivery.
- Workspace A and Workspace B commit collections remain isolated.

## Classification

- Prior CSV fixtures/artifacts: `HISTORICAL_ONLY`.
- Existing correctly keyed committed sources: `ACTIVE_BUT_ISOLATED` in their workspace/source scope.
- Static Revenue KPI registry: `ACTIVE_GLOBAL_DEFINITION`, formerly passed with the wrong validation scope.
- Downloads-based paths: `UNRELATED`.

No old data was deleted or reset as a product fix.

