# DATA-ADV:1 Architecture Inspection

Date: 2026-09-02

Inspected Advisor/`executeNexoraConversationalExperience`, NCA:2 pending questions, `nexoraNcaCsvSemanticClarification`, FIX1 `answerCsvSemanticInquiry`, `csvRealDataImportStore` (including DATA-UX:6 hydrate), ESI, DATA_OBJECT advisor, conversational `not-found` copy, Stage/Director, Decision/Execution.

No second CSV store, Data Reality, semantic writer, Advisor engine, or NCA runtime.

## Root cause (ORD_QTY)

**A.** Nexora asked about OTD via FIX1 pending clarification (`NCA_CSV_SEMANTIC_PURPOSE`). “Yes” was consumed by `resolveNcaCsvSemanticReply` + `applyCsvSemanticClarification`. The next turn, “what is ORD_QTY?”, is a **QUESTION**. That is `unrelated` to the (already closed) pending, so the shell falls through to CC/NCA. CC resolves “Ord Qty” as an **executive subject hint**, not a CSV column.

**B.** Failed lookup searched conversational executive subjects / Stage catalog (`conversationalExperienceResponse` `not-found`: “current executive context”). It did **not** search `csvRealDataImportStore` mappings or parse headers.

**C.** Data Library awareness belongs in a **read-only Advisor Data Context** projected from the existing store + ESI, consulted in the shell **after** FIX1 pending answers and **before** `executeNexoraConversationalExperience`.

**D. Pending CSVs.** Filename, status PENDING, parse columns, mappings, confirmationSource, likely/unresolved copy, FIX5 potentially related (uncertain). Not Data Reality evidence.

**E. Committed CSVs.** Same plus prepared snapshot, ESI `affectedObjects`, removal impact. May be described as accepted.

**F. Confidence.** `confirmationSource` + `confirmed` / `proposedMeaning`. Confirmed/authoritative vs likely vs unresolved. Never upgrade likely in the projection.

**G. Multiple CSVs.** One context list, source-scoped fields. Same column name in two sources → ask which source. Confirmations stay source-scoped.

**H. DATA-UX:6.** Hydrate fills the store; the projection is built at question time from the store. No restore Advisor message. No Data Panel required.

**I. ESI.** Use object labels as “supports / related to”, never “caused”.

**J. Stage.** Answering does not call `onSelectSubject` / Director. Optional “show the object” remains existing Stage path.

**K. NCA route.** Manager→Nexora field questions are **not** the FIX1 pending-answer route. They are a library inquiry. If Advisor then asks a clarification question, **reuse** `beginNcaCsvSemanticClarification` + `applyCsvSemanticClarification` (pending only). Committed meaning changes stay Update Source.

**L. Genericity.** Context uses `sourceType`: csv | connected. Fields/status/related objects are source-agnostic. DB/API/RAG not implemented.
