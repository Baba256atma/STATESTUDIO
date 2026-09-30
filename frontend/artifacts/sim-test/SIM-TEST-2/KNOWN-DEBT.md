# Known findings and debt

No S0, S2, or S3 findings were recorded. No repair was attempted for these six reproducible S1 product findings.

## Manufacturing

- S1 `DATA_ERROR/PUBLICATION_GAP`, owner DATA_REALITY, tick 21: `requested_quantity` was observable but did not reach Data Reality (`m:bc:requested_quantity`).
- S1 `NEXORA_ERROR/CAUSAL_OVERCLAIM`, owner ADVISOR, tick 21: confirmed causal language appeared without information-bounded evidence (`m:causal:3`).

## Logistics

- S1 `OPERATOR_ERROR/OBSERVATION_GAP`, owner OPERATOR, tick 4: Ground Truth available capacity had no AVAILABLE `CAP_AV` (`m:ab:CAP_AV`, `m:ab:produced_quantity`).
- S1 `DATA_ERROR/PUBLICATION_GAP`, owner DATA_REALITY, tick 4: `requested_quantity` was observable but did not reach Data Reality (`m:bc:requested_quantity`).

## Service

- S1 `OPERATOR_ERROR/OBSERVATION_GAP`, owner OPERATOR, tick 4: demand had no AVAILABLE `produced_quantity` (`m:ab:produced_quantity`, `m:ab:actual_progress`, `m:ab:resource_usage`).
- S1 `DATA_ERROR/PUBLICATION_GAP`, owner DATA_REALITY, tick 4: `orders_received` was observable but did not reach Data Reality (`m:bc:orders_received`).

Additional bounded debt:

- `machineStatus` remains unconfirmed at the production Gate, so Maintenance stays `MAPPING_REQUIRED`.
- Logistics Inventory and Service HR are header-only artifacts because the certified Operator produces no legitimate AVAILABLE records for those sources in the bounded parity journeys.
- The project emits a non-blocking warning that `baseline-browser-mapping` reference data is over two months old.

These findings remain investigation inputs for a separately authorized repair phase. They do not invalidate the ingestion harness or historical certifications.
