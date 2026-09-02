# DATA-UX:5 Stage Reconciliation

On confirmed store removal the shell:

- drops the DATA_OBJECT id from `stagedDataObjectIds`
- clears selection if it pointed at that object
- clears `activeCsvImport` if it was that source
- does not call `setInteraction` / Focus

Director then projects from remaining canonical objects. No mesh coordinates are written by lifecycle code. Ghost objects cannot remain because participants come only from remaining committed imports.
