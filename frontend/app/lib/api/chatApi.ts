export async function chatToBackend(payload: any) {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  const res = await fetch(`${base}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.detail?.error?.message ||
        data?.error?.message ||
        `Chat request failed (${res.status})`
    );
  }

  return data;
}
