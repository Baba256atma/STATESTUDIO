# Mutation safety

Live and isolated:

- `Add this as a Risk.` without a bound item → clarification, not a write.
- Topic change (`show me problems`) then `yes` → no Risk add (stale proposal does not write).
- `delete Margin Pressure` → refuses; **does not become add**. No certified delete writer.
- Isolated confirm path: `Add Supplier Delay as a Risk.` → propose → `yes` → added.

No second mutation authority observed.
