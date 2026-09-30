# Data Reality trace

```
Operator publication                         CORRECT
  → source / CSV family PRODUCTION           CORRECT (INGESTION); FAST uses equivalent RDI
  → Gate                                     CORRECT (untouched)
  → RDI                                      CORRECT (untouched)
  → Data Reality identity/version            PRODUCTION v4 @ tick 21
  → Evidence/Data selection                  Nexora-visible rdi2 snapshots including PRODUCTION:21
  → Advisor/conversation                     consumes current subject Delivery + visible evidence
```

No Ground Truth shortcut. Conversation does not read `Production.csv` from disk.

INGESTION before T92: publications at ticks 0, 7, 21. Latest visible PRODUCTION version is 4.

FAST parity journey signature unchanged `fnv1a32:8a0767d0` S1=0 — equivalent semantic query uses canonical Data Reality, not an INGESTION-only filename hack.
