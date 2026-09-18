# NPA-T NMI:FINAL — Attention / Queue Audit

STAGE-PROD:1 remains Queue authority.

NMI Attention is a read projection: Attention item IDs equal unique Queue object IDs.

- no second Queue (`NMI_MANAGEMENT_NAVIGATION_CONTRACT.secondQueue === false`)
- no invented priority score (`inventsPriority === false`)
- Queue IDs preserved
- counts deterministic
- Map nodes do not automatically become Attention (`mapNodeImpliesAttention === false`)
- roadmap gaps do not automatically become Attention
