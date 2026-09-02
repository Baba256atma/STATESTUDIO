# DATA-UX:5-FIX2 Source Library Contract

The Data panel **projects** `listCsvRealDataImports` and `listNexoraLiveConnections`. It does not own sources.

## Count semantics

`SOURCES · N` = `csvCount + connectedCount` (current sources in this workspace).

Subtitle: `CSV · n · Connected · m`.

“No CSV sources yet.” renders only when `csvEmpty` (`csvCount === 0`). Connected sources may still be listed.

## Rows

CSV: filename, type CSV, status (Ready / Needs attention / Needs clarification), Active when it is the shell active CSV, related object labels from ESI.

Connected: `displayName` (e.g. Engineering Source), type Connected, connection status, related objects from latest observation ESI when present.

## Selection

Click toggles details. Does not activate, remove, or write business truth.

## Lineage language

**Related Objects** = ESI `affectedObjects` labels. No “caused by” copy.

View Changes retains `Source: {filename|displayName}` and only ESI / PM:1 events.
