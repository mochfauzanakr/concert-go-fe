"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, ScanLine, XCircle } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import {
  Button,
  Empty,
  Heading,
  inputClass,
  Loading,
  Message,
  UserShell,
} from "../ui";

export function ScannerView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [eventId, setEventId] = useState("");
  const [code, setCode] = useState("");
  const [camera, setCamera] = useState(false);
  const [cameraPending, setCameraPending] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    code: string;
  } | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef<number>(0);
  const decodeBusy = useRef(false);
  const selectedEvent =
    eventId ||
    store.events.find((event) => event.status === "published")?.id ||
    "";
  function stopCamera() {
    cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setCamera(false);
  }
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      stream.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );
  function check(value: string) {
    try {
      const name = store.scanTicket(value, selectedEvent);
      setResult({
        success: true,
        message: `Selamat datang, ${name}. Tiket valid dan sudah ditandai digunakan.`,
        code: value.trim(),
      });
      setCode("");
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "Tiket tidak valid.",
        code: value.trim(),
      });
    }
  }
  async function startCamera() {
    if (cameraPending || stream.current) return;
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Kamera tidak tersedia. Gunakan input kode tiket di bawah.",
      );
      return;
    }
    setCameraPending(true);
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 } },
        audio: false,
      });
      if (!video.current) {
        stream.current.getTracks().forEach((track) => track.stop());
        return;
      }
      video.current.srcObject = stream.current;
      await video.current.play();
      setCamera(true);
      const { default: jsQR } = await import("jsqr");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      let last = 0;
      function scan(timestamp: number) {
        if (!stream.current || !video.current) return;
        if (
          context &&
          video.current.readyState >= 2 &&
          video.current.videoWidth > 0 &&
          video.current.videoHeight > 0 &&
          timestamp - last > 180 &&
          !decodeBusy.current
        ) {
          last = timestamp;
          decodeBusy.current = true;
          canvas.width = 480;
          canvas.height = Math.max(
            1,
            Math.round(
              (480 * video.current.videoHeight) / video.current.videoWidth,
            ),
          );
          context.drawImage(video.current, 0, 0, canvas.width, canvas.height);
          const pixels = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          const qr = jsQR(pixels.data, canvas.width, canvas.height);
          decodeBusy.current = false;
          if (qr?.data) {
            check(qr.data);
            stopCamera();
            return;
          }
        }
        frame.current = requestAnimationFrame(scan);
      }
      frame.current = requestAnimationFrame(scan);
    } catch {
      stopCamera();
      setCameraError(
        "Kamera belum bisa dibuka. Periksa izin browser atau gunakan kode tiket secara manual.",
      );
    } finally {
      setCameraPending(false);
    }
  }
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const scanned = store.tickets
    .filter((ticket) => ticket.eventId === selectedEvent && ticket.usedAt)
    .sort((a, b) => Date.parse(b.usedAt!) - Date.parse(a.usedAt!));
  return (
    <UserShell>
      <Heading
        eyebrow="ConcertGo gate · STAFF"
        title="Scanner tiket"
        description="Pilih acara sebelum memeriksa QR. Tiket yang tidak cocok atau sudah digunakan akan ditolak oleh simulasi ini."
        back={{ href: "/admin/dashboard", label: "Kembali ke panel admin" }}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="demo-card space-y-5 p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-theme-accent/10 p-3 text-theme-accent">
              <ScanLine size={26} />
            </span>
            <div>
              <h2 className="font-bold">Pemeriksaan gate</h2>
              <p className="mt-1 text-xs text-theme-text-light">
                QR dan kode tiket menggunakan validasi yang sama.
              </p>
            </div>
          </div>
          <label className="demo-label">
            Acara yang diperiksa
            <select
              className={inputClass}
              disabled={cameraPending}
              value={selectedEvent}
              onChange={(e) => {
                stopCamera();
                setEventId(e.target.value);
                setResult(null);
              }}
            >
              {store.events
                .filter((event) => event.status === "published")
                .map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
            </select>
          </label>
          <div
            className={`relative overflow-hidden rounded-2xl border border-dashed border-theme-border bg-[#241209] ${camera ? "" : "flex min-h-52 items-center justify-center"}`}
          >
            <video
              ref={video}
              muted
              playsInline
              className={camera ? "max-h-72 w-full object-cover" : "hidden"}
            />
            {!camera && (
              <div className="p-6 text-center text-white/80">
                <Camera size={38} className="mx-auto mb-3" />
                <p className="text-sm">
                  Kamera hanya dibuka setelah kamu mengizinkan.
                </p>
              </div>
            )}
          </div>
          <Button
            tone="secondary"
            className="w-full"
            onClick={camera ? stopCamera : startCamera}
            disabled={cameraPending || !selectedEvent}
          >
            <Camera size={16} />
            {cameraPending
              ? "Meminta izin kamera..."
              : camera
                ? "Matikan kamera"
                : "Buka kamera scanner"}
          </Button>
          <Message message={cameraError} error />
          <div className="flex items-center gap-3 text-xs text-theme-text-light">
            <span className="h-px flex-1 bg-theme-border" />
            atau masukkan kode
            <span className="h-px flex-1 bg-theme-border" />
          </div>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              check(code);
            }}
          >
            <label className="demo-label">
              Kode tiket
              <input
                value={code}
                required
                maxLength={100}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputClass} font-mono`}
                placeholder="Contoh: CG-DEMO-TICKET-001"
                autoComplete="off"
              />
            </label>
            <Button type="submit" className="w-full">
              <ScanLine size={16} />
              Periksa tiket
            </Button>
          </form>
          <p className="text-xs leading-5 text-theme-text-light">
            Untuk mencoba, salin kode dari halaman E-ticket. Kamu juga bisa
            memakai kode contoh CG-DEMO-TICKET-001 pada acara pertama.
          </p>
        </section>
        <div className="space-y-5">
          <section aria-live="polite" className="demo-card p-6">
            {result ? (
              <div className="space-y-4">
                {result.success ? (
                  <CheckCircle2 size={42} className="text-emerald-600" />
                ) : (
                  <XCircle size={42} className="text-rose-600" />
                )}
                <h2 className="text-xl font-bold">
                  {result.success ? "Tiket valid" : "Tiket ditolak"}
                </h2>
                <p className="text-sm leading-6 text-theme-text-muted">
                  {result.message}
                </p>
                <p className="break-all rounded-xl bg-theme-bg-soft p-3 font-mono text-xs">
                  {result.code}
                </p>
              </div>
            ) : (
              <Empty
                title="Siap memeriksa tiket"
                description="Hasil validasi akan muncul di sini setelah tiket diperiksa."
              />
            )}
          </section>
          <section className="demo-card p-5">
            <h2 className="mb-4 font-bold">
              Check-in terbaru{" "}
              <span className="ml-1 text-theme-accent">{scanned.length}</span>
            </h2>
            {scanned.length ? (
              <div className="divide-y divide-theme-border">
                {scanned.slice(0, 8).map((ticket) => (
                  <article
                    key={ticket.id}
                    className="flex items-start justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{ticket.holder}</p>
                      <p className="mt-1 break-all font-mono text-[10px] text-theme-text-light">
                        {ticket.code}
                      </p>
                    </div>
                    <time className="shrink-0 text-[10px] text-theme-text-muted">
                      {new Date(ticket.usedAt!).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-theme-text-muted">
                Belum ada tiket yang diperiksa untuk acara ini.
              </p>
            )}
          </section>
        </div>
      </div>
    </UserShell>
  );
}
