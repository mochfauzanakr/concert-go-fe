// Server-side configuration. Accept either the backend origin or its /api URL.
export function backendApiURL() {
  const base = (process.env.BACKEND_URL || "http://127.0.0.1:8080").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}
