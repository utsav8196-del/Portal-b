/** Local Node APIs almost never speak TLS; https://localhost → ERR_SSL_PROTOCOL_ERROR. */
export function normalizeApiBaseUrl(url: string): string {
  const trimmed = (url || "").replace(/\/$/, "");
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    ) {
      parsed.protocol = "http:";
      return parsed.origin;
    }
  } catch {
    /* keep trimmed string */
  }
  return trimmed;
}
