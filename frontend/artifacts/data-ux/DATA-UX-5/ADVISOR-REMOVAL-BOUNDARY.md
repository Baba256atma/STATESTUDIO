# DATA-UX:5 Advisor Removal Boundary

Advisor may explain impact and request review. It never calls `removeCsvRealDataImport`.

“Get rid of this.” / “Remove this CSV.” → `request-review` (Data Rail review opens). Not `SOURCE_REMOVED`.

“Cancel.” / “Keep it.” / “Never mind.” → close review; store unchanged.

LLM failure cannot block the Rail review/confirm path. Destructive execution is the confirm button.
