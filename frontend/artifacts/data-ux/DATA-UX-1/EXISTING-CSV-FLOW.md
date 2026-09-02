# Existing CSV Flow

```text
Manager
  → Left Nav: Data
  → ExecutiveExplorerDrawer (open/close/resize)
  → NexoraExecutiveDataExplorer
  → + Add Data → Upload File / CSV
  → NexoraCsvRealDataImportFlow
  → FileReader text
  → deterministic parse + preview
  → deterministic mapping suggestions
  → manager confirmation/ignore for ambiguity
  → RDI:1 adapter validation + source snapshot
  → RDI:1 Data Reality handoff
  → P0 Data Reality facts/KPIs/executive states
  → existing runtime/Stage projection + Advisor integration
  → atomic workspace-scoped commit
  → source card / source intelligence / comparison / View on Stage / Ask Nexora
```

| Step | Input → output | Persistence | Validation/provenance | `/executive` |
|---|---|---|---|---|
| Open Data Explorer | `activeNav=Data` → `explorerKind=data` | React session state | Drawer/HUD layout contract | Yes |
| Select file | browser `File` → name/size/text | local flow state | CSV extension and non-empty content later checked | Yes |
| Parse/preview | CSV text → columns/rows/issues | prepared flow state | deterministic RFC-4180-shaped checks | Yes |
| Mapping | columns → recognized/suggested/unmapped/unsupported | prepared flow state | aliases require confirmation; unknowns require mapping/ignore | Yes |
| Validate | mapped rows → RDI snapshot/handoff | prepared immutable object | workspace, source, record, field and provenance checks | Yes |
| Import | ready preparation → `CsvCommittedImport` | in-memory workspace store | atomic guards; failed replacement preserves truth | Yes |
| Data Reality | canonical dataset → facts/KPIs/states | embedded immutable snapshot in commit | existing P0 rules/bindings | Yes |
| Consumers | snapshot → Stage/Advisor/source intelligence | shell active-source state | downstream receives dataset/snapshot, never raw CSV | Yes |

Multiple CSV sources: supported per workspace. Update: deterministic re-import supports new/replace/cancel using stable `sourceContextId`. Remove: inactive CSV sources may be removed; active source removal is refused. Import storage does not survive a full process/page-session reset.

