export function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
}

export function companyId(): string {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("nexora.company_id");
    if (saved && saved.trim()) return saved;
  }
  return process.env.NEXT_PUBLIC_COMPANY_ID || "default";
}

export function setCompanyId(next: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("nexora.company_id", next);
  }
}
