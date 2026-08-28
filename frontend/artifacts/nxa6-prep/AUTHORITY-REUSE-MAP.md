# Authority and reuse map

| Concern | Authority | PREP reuse |
|---|---|---|
| Conversational execution | CC:5 `executeNexoraConversationalExperience` | Harness only caller |
| Intent / command / runtime | CC:1–4 | Existing result fields |
| Canonical collection | NCA-POST:3 | Existing members |
| Presentation | DIR:1 | `directorPlan` on result |
| Stage state | MVP object interaction | `nextRuntimeState` |
| Queue collection | `presentNexoraMVPExecutiveQueueCollection` | Parity probe |
| Decision / Execution | CC:10/11 | Safety assertions only |
| Diagnostics console | `diagnosticSwitch` | New default-off scope `nxaConversation` |
| Live browser | FINAL:3 Playwright helpers | Smoke only |
| Zero-failure summarizer | `nexora-zero-failure-gate.mjs` | Pattern reused in ledger barrier |

No second conversation store, presenter, or test authority.
