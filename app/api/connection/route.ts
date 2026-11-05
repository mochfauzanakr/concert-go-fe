import { backendApiURL } from "@/lib/backend-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${backendApiURL()}/roles`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    const payload = await response.json().catch(() => null);
    const connected = response.ok && payload?.status === "T";
    return Response.json({ connected, message: connected ? "Frontend terhubung ke API backend." : "Backend merespons tetapi API roles belum berhasil.", backendStatus: response.status }, { status: connected ? 200 : 502 });
  } catch {
    return Response.json({ connected: false, message: "Frontend aktif, tetapi backend belum dapat dihubungi. Periksa BACKEND_URL di .env.local frontend." }, { status: 503 });
  }
}
