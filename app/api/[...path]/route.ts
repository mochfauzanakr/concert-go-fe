import { backendApiURL } from "@/lib/backend-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function forward(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  // A browser arriving on the FE API callback must see the callback UI, not raw JSON.
  // fetch() from that UI still receives the backend JSON below.
  if (request.method === "GET" && path.join("/") === "auth/google/callback" && (request.headers.get("sec-fetch-mode") === "navigate" || request.headers.get("accept")?.includes("text/html"))) {
    const destination = new URL("/auth/callback", request.url);
    destination.search = new URL(request.url).search;
    return Response.redirect(destination, 303);
  }
  const url = `${backendApiURL()}/${path.map(encodeURIComponent).join("/")}${new URL(request.url).search}`;
  const headers = new Headers();
  for (const name of ["content-type", "accept", "authorization", "cookie"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const responseHeaders = new Headers(response.headers);
    for (const name of ["content-encoding", "content-length", "transfer-encoding", "connection"]) responseHeaders.delete(name);
    responseHeaders.delete("set-cookie");
    for (const cookie of response.headers.getSetCookie()) responseHeaders.append("set-cookie", cookie);
    responseHeaders.set("Cache-Control", "no-store");
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return Response.json({ message: "Backend terlalu lama merespons. Silakan coba lagi." }, { status: 504 });
    }
    return Response.json({ message: "Backend belum dapat dihubungi. Pastikan alamat API benar dan server backend sudah aktif." }, { status: 503 });
  }
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE, forward as HEAD, forward as OPTIONS };
