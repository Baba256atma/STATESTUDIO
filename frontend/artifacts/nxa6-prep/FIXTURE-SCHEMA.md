# Conversation fixture schema

See `app/lib/nexora-certification/nxaConversationFixtureSchema.ts`.

Required case fields: id, title, purpose, families, optional setup (focusId, restoreConversation), ordered turns, optional queueParityCategory, optional navigationProbe.

Turn expectations may include response includes/excludes, intent, read/write, Stage effect, focus, collection members, confirmation/execution safety, and a partial path-trace overlay.

Named objects belong in fixtures only. The invalid synthetic case `prep-invalid-synthetic` is harness self-test only.
