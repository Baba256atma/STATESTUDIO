#!/usr/bin/env python3
"""Remove HomeScreen sendTextImplementation + impl ref; insert chatPipelineSendTextDeps useMemo before hook call."""
from __future__ import annotations

import re
from pathlib import Path

HOME = Path("/Users/bahadoors/Documents/StateStudio/frontend/app/screens/HomeScreen.tsx")
CONTROLLER = Path("/Users/bahadoors/Documents/StateStudio/frontend/app/screens/hooks/chat/useChatPipelineController.ts")

text = HOME.read_text(encoding="utf-8")
lc = CONTROLLER.read_text(encoding="utf-8")
mkeys = re.search(r"const \{\n(.*)\n  \} = deps as any;", lc, re.S)
if not mkeys:
    raise SystemExit("Could not read deps keys from useChatPipelineController.ts")
keys = [ln.strip().rstrip(",") for ln in mkeys.group(1).splitlines() if ln.strip()]
deps_body = "\n".join(f"      {k}," for k in keys) + "\n"

# Extract old sendText useCallback dependency array (inside `}, [ ... ]);` before impl useLayoutEffect).
m = re.search(
    r"\n  \}, \[\n(?P<body>    activeExecutiveObjectId,.*?)\n  \]\);\n\n  useLayoutEffect\(\(\) => \{\n    chatPipelineSendTextImplRef",
    text,
    re.S,
)
if not m:
    raise SystemExit("dependency array / sendText block anchor not found")
dep_array_body = m.group("body")

# Remove sendText implementation + useLayoutEffect for impl ref.
m2 = re.search(
    r"\n  // O4 Extraction Boundary: Chat Pipeline Controller\n  // Chat must remain deduped.*?\n  \}, \[\n"
    + re.escape(dep_array_body)
    + r"\n  \]\);\n\n  useLayoutEffect\(\(\) => \{\n    chatPipelineSendTextImplRef\.current = sendTextImplementation;\n    return \(\) => \{\n      chatPipelineSendTextImplRef\.current = null;\n    \};\n  \}, \[sendTextImplementation\]\);\n\n",
    text,
    re.S,
)
if not m2:
    raise SystemExit("sendTextImplementation block not found for removal")
text = text[: m2.start()] + "\n" + text[m2.end() :]

insert = f"""
  const chatPipelineSendTextDeps = useMemo(
    (): ChatPipelineSendTextDeps => ({{
{deps_body.rstrip()}
    }}),
    [
{dep_array_body}
    ],
  );

"""

anchor = "  const chatPipelineController = useChatPipelineController({"
idx = text.find(anchor)
if idx == -1:
    raise SystemExit("chatPipelineController anchor not found")
text = text[:idx] + insert + text[idx:]

# Remove impl ref declaration near other refs.
text = re.sub(
    r"\n  /\*\* O4:5 — HomeScreen registers the full `sendText` implementation; `useChatPipelineController` exposes the canonical callback\. \*/\n  const chatPipelineSendTextImplRef = useRef<\n    \(\(textRaw: string, requestId\?: string \| undefined, options\?: SendTextOptions \| undefined\) => Promise<void>\) \| null\n  >\(null\);\n",
    "\n",
    text,
    count=1,
)

# Swap hook input: sendTextImplRef -> sendTextDeps
text = text.replace(
    "    sendTextImplRef: chatPipelineSendTextImplRef,\n",
    "    sendTextDeps: chatPipelineSendTextDeps,\n",
)

HOME.write_text(text, encoding="utf-8")
print("Patched HomeScreen.tsx")
