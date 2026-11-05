import { backendApiURL } from "@/lib/backend-url";

export const runtime = "nodejs";

async function asset(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (path.some((segment) => !/^[a-zA-Z0-9_.-]+$/.test(segment) || segment === "." || segment === "..") || !/\.(png|jpe?g|webp)$/i.test(path.at(-1) || "")) {
    return new Response(null, { status: 404 });
  }
  try {
    const origin = backendApiURL().replace(/\/api$/, "");
    const upstream = await fetch(`${origin}/uploads/${path.map(encodeURIComponent).join("/")}`, {
      method: request.method, signal: AbortSignal.timeout(10000), redirect: "error", cache: "no-store",
    });
    if (!upstream.ok) return new Response(null, { status: upstream.status });
    const type = upstream.headers.get("content-type") || "";
    if (!/^image\/(png|jpeg|webp)(;|$)/i.test(type)) return new Response(null, { status: 502 });
    return new Response(upstream.body, {
      headers: { "Content-Type": type, "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" },
    });
  } catch (error) {
    return new Response(null, { status: error instanceof Error && error.name === "TimeoutError" ? 504 : 503 });
  }
}

export { asset as GET, asset as HEAD };
