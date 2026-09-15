# Mutation safety

Live and isolated:

- `Add this as a Risk.` without a named item → clarification, no write.
- Change topic (`show me problems`) then `yes` → no Risk created.
- Named `Add Supplier Delay as a Risk.` then `yes` (isolated) → added.
- `cancel` after proposal → will not add.
- `delete Margin Pressure` → refuses because there is no certified delete writer; **does not become Add**.

Stale confirmation after a topic change is not treated as mutation confirm.
