import { useState } from "react";
export function useSearch() {
  const [q, setQ] = useState("");
  const norm = (s: string) => s.toLowerCase();
  const match = (s: string) => norm(s).includes(norm(q));
  return { q, setQ, match, isActive: q.trim().length > 0 };
}
